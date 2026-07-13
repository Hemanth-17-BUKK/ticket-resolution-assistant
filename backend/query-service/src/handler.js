const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    ScanCommand,
    QueryCommand,
    UpdateCommand,
    DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const {
    S3Client,
    GetObjectCommand
} = require("@aws-sdk/client-s3");

const {
    getSignedUrl
} = require("@aws-sdk/s3-request-presigner");

const dynamoClient = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(dynamoClient);

const s3Client = new S3Client({});

const corsHeaders = {

    "Access-Control-Allow-Origin":
        "*",

    "Access-Control-Allow-Headers":
        "Content-Type,Authorization",

    "Access-Control-Allow-Methods":
        "GET,POST,PUT,DELETE,OPTIONS"
};


const successResponse = (statusCode, body) => {

    return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify(body)
    };
};

const errorResponse = (statusCode, message) => {

    return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify({
            message
        })
    };
};


exports.handler = async (event) => {

    try {

        const method = event.httpMethod;

        const ticketId = event.pathParameters?.ticketId;


        if (
            event.httpMethod === "GET" &&
            event.resource === "/my-tickets"
        ) {

            const customerEmail =
                event.requestContext
                    ?.authorizer
                    ?.claims
                    ?.email;

            console.log(
                "Customer Email:",
                customerEmail
            );

            const result =
                await dynamoDB.send(
                    new QueryCommand({

                        TableName:
                            process.env.TICKETS_TABLE,

                        IndexName:
                            "email-index",

                        KeyConditionExpression:
                            "customerEmail = :email",

                        ExpressionAttributeValues: {
                            ":email":
                                customerEmail
                        }
                    })
                );

            const tickets = await Promise.all(

            (result.Items || []).map(async (ticket) => {

                if (ticket.attachments?.length) {

                    ticket.attachments = await Promise.all(

                        ticket.attachments.map(async (attachment) => {

                            const downloadUrl = await getSignedUrl(

                                s3Client,

                                new GetObjectCommand({

                                    Bucket: process.env.ATTACHMENTS_BUCKET,

                                    Key: attachment.s3Key

                                }),

                                {

                                    expiresIn: 3600

                                }

                            );

                            return {

                                ...attachment,

                                downloadUrl

                            };

                        })

                    );

                }

                return ticket;

            })

        );

        return successResponse(
            200,
            tickets
        );
        }

        // ==========================================
        // GET /tickets/{ticketId}/history
        // ==========================================

        if (
            method === "GET" &&
            ticketId &&
            event.resource ===
                "/tickets/{ticketId}/history"
        ) {

            const claims =
                event.requestContext
                    ?.authorizer
                    ?.claims;

            const groups =
                claims?.["cognito:groups"] || "";

            if (!groups.includes("ADMIN")) {

                return errorResponse(
                    403,
                    "Access Denied"
                );
            }
            const result =
                await dynamoDB.send(
                    new QueryCommand({

                        TableName:
                            process.env.HISTORY_TABLE,

                        IndexName:
                            "ticket-id-index",

                        KeyConditionExpression:
                            "ticketId = :ticketId",

                        ExpressionAttributeValues: {
                            ":ticketId":
                                ticketId
                        }
                    })
                );

            const history =
                (result.Items || [])
                    .sort(
                        (a, b) =>
                            b.timestamp.localeCompare(
                                a.timestamp
                            )
                    );

            return successResponse(
                200,
                history
            );
        }

        // ==========================================
        // GET /dashboard
        // ==========================================

        if (
            method === "GET" &&
            event.resource === "/dashboard"
        ) {

            const claims =
                event.requestContext
                    ?.authorizer
                    ?.claims;

            const groups =
                claims?.["cognito:groups"] || "";

            if (!groups.includes("ADMIN")) {

                return errorResponse(
                    403,
                    "Access Denied"
                );
            }

            const result =
                await dynamoDB.send(
                    new ScanCommand({
                        TableName:
                            process.env.TICKETS_TABLE
                    })
                );

            const tickets =
                result.Items || [];

            const dashboard = {

                totalTickets:
                    tickets.length,

                openTickets: 0,

                pendingApprovalTickets: 0,

                resolvedTickets: 0,

                rejectedTickets: 0,

                highPriorityTickets: 0,

                mediumPriorityTickets: 0,

                lowPriorityTickets: 0,

                paymentTickets: 0,

                authenticationTickets: 0,

                technicalTickets: 0,

                shippingTickets: 0,

                generalTickets: 0
            };

            for (const ticket of tickets) {

                switch (ticket.status) {

                    case "OPEN":
                        dashboard.openTickets++;
                        break;

                    case "PENDING_APPROVAL":
                        dashboard.pendingApprovalTickets++;
                        break;

                    case "RESOLVED":
                        dashboard.resolvedTickets++;
                        break;

                    case "REJECTED":
                        dashboard.rejectedTickets++;
                        break;
                }

                switch (ticket.priority) {

                    case "HIGH":
                        dashboard.highPriorityTickets++;
                        break;

                    case "MEDIUM":
                        dashboard.mediumPriorityTickets++;
                        break;

                    case "LOW":
                        dashboard.lowPriorityTickets++;
                        break;
                }

                switch (ticket.category) {

                    case "PAYMENT":
                        dashboard.paymentTickets++;
                        break;

                    case "AUTHENTICATION":
                        dashboard.authenticationTickets++;
                        break;

                    case "TECHNICAL":
                        dashboard.technicalTickets++;
                        break;

                    case "SHIPPING":
                        dashboard.shippingTickets++;
                        break;

                    case "GENERAL":
                        dashboard.generalTickets++;
                        break;
                }
            }

            return successResponse(
                200,
                dashboard
            );
        }
        // ==========================================
        // GET /tickets/{ticketId}
        // ==========================================
        if (method === "GET" && ticketId) {

            const result = await dynamoDB.send(
                new GetCommand({
                    TableName: process.env.TICKETS_TABLE,
                    Key: {
                        ticketId: ticketId
                    }
                })
            );

            if (!result.Item) {

                return errorResponse(
                    404,
                    "Ticket not found"
                );
            }

            const ticket = result.Item;

            if (ticket.attachments?.length) {

                ticket.attachments = await Promise.all(

                    ticket.attachments.map(async (attachment) => {

                        const downloadUrl = await getSignedUrl(

                            s3Client,

                            new GetObjectCommand({

                                Bucket: process.env.ATTACHMENTS_BUCKET,

                                Key: attachment.s3Key

                            }),

                            {

                                expiresIn: 3600

                                }

                            );

                            return {

                                ...attachment,

                                downloadUrl

                            };

                        })

                    );

                }

            return successResponse(
                200,
                ticket
            );
        }

        // ==========================================
        // GET /tickets
        // ==========================================
        if (method === "GET") {

            const claims =
                event.requestContext
                    ?.authorizer
                    ?.claims;

            const groups =
                claims?.["cognito:groups"] || "";

            if (!groups.includes("ADMIN")) {

                return errorResponse(
                    403,
                    "Access Denied"
                );
            }

            const queryParams =
                event.queryStringParameters || {};

            // Query by Status
            if (queryParams.status) {

                const result = await dynamoDB.send(
                    new QueryCommand({
                        TableName: process.env.TICKETS_TABLE,
                        IndexName: "status-index",
                        KeyConditionExpression:
                            "#status = :status",
                        ExpressionAttributeNames: {
                            "#status": "status"
                        },
                        ExpressionAttributeValues: {
                            ":status": queryParams.status
                        }
                    })
                );

                const tickets = await Promise.all(

                    (result.Items || []).map(async (ticket) => {

                        if (ticket.attachments?.length) {

                            ticket.attachments = await Promise.all(

                                ticket.attachments.map(async (attachment) => {

                                    const downloadUrl = await getSignedUrl(

                                        s3Client,

                                        new GetObjectCommand({

                                            Bucket: process.env.ATTACHMENTS_BUCKET,

                                            Key: attachment.s3Key

                                        }),

                                        {

                                            expiresIn: 3600

                                        }

                                    );

                                    return {

                                        ...attachment,

                                        downloadUrl

                                    };

                                })

                            );

                        }

                        return ticket;

                    })

                );

                return successResponse(
                    200,
                    tickets
                );
            }

            // Query by Priority
            if (queryParams.priority) {

                const result = await dynamoDB.send(
                    new QueryCommand({
                        TableName: process.env.TICKETS_TABLE,
                        IndexName: "priority-index",
                        KeyConditionExpression:
                            "priority = :priority",
                        ExpressionAttributeValues: {
                            ":priority":
                                queryParams.priority
                        }
                    })
                );

                return successResponse(
                    200,
                    result.Items
                );
            }

            // Query by Team
            if (queryParams.assignedTeam) {

                const result = await dynamoDB.send(
                    new QueryCommand({
                        TableName: process.env.TICKETS_TABLE,
                        IndexName: "assigned-team-index",
                        KeyConditionExpression:
                            "assignedTeam = :team",
                        ExpressionAttributeValues: {
                            ":team":
                                queryParams.assignedTeam
                        }
                    })
                );

                return successResponse(
                    200,
                    result.Items
                );
            }

            // Get All Tickets
            const result = await dynamoDB.send(
                new ScanCommand({
                    TableName: process.env.TICKETS_TABLE
                })
            );

            return successResponse(
                200,
                result.Items
            );
        }

        // ==========================================
        // PUT /tickets/{ticketId}
        // ==========================================
        if (method === "PUT" && ticketId) {

            const requestBody = JSON.parse(event.body);

            // Get existing ticket
            const existingTicket = await dynamoDB.send(
                new GetCommand({
                    TableName: process.env.TICKETS_TABLE,
                    Key: {
                        ticketId: ticketId
                    }
                })
            );

            if (!existingTicket.Item) {

                return errorResponse(
                    404,
                    "Ticket not found"
                );
            }

            const updateExpressionParts = [
                "#status = :status",
                "updatedAt = :updatedAt"
            ];

            const expressionAttributeNames = {
                "#status": "status"
            };

            const expressionAttributeValues = {
                ":status": requestBody.status,
                ":updatedAt": new Date().toISOString()
            };

            if (requestBody.assignedAgent) {

                updateExpressionParts.push(
                    "assignedAgent = :assignedAgent"
                );

                expressionAttributeValues[
                    ":assignedAgent"
                ] = requestBody.assignedAgent;
            }

            if (requestBody.resolution) {

                updateExpressionParts.push(
                    "resolution = :resolution"
                );

                expressionAttributeValues[
                    ":resolution"
                ] = requestBody.resolution;
            }

            /* ==========================================
            DRAFT REPLY
            ========================================== */

            if (requestBody.draftReply) {

                updateExpressionParts.push(
                    "draftReply = :draftReply"
                );

                expressionAttributeValues[
                    ":draftReply"
                ] = requestBody.draftReply;
            }

            /* ==========================================
            FINAL REPLY
            ========================================== */

            if (requestBody.finalReply) {

                updateExpressionParts.push(
                    "finalReply = :finalReply"
                );

                expressionAttributeValues[
                    ":finalReply"
                ] = requestBody.finalReply;
            }

            if (requestBody.status === "RESOLVED") {

                updateExpressionParts.push(
                    "resolvedAt = :resolvedAt"
                );

                expressionAttributeValues[
                    ":resolvedAt"
                ] = new Date().toISOString();
            }

            await dynamoDB.send(
                new UpdateCommand({
                    TableName: process.env.TICKETS_TABLE,

                    Key: {
                        ticketId: ticketId
                    },

                    UpdateExpression:
                        `SET ${updateExpressionParts.join(", ")}`,

                    ExpressionAttributeNames:
                        expressionAttributeNames,

                    ExpressionAttributeValues:
                        expressionAttributeValues
                })
            );

            // Save History Snapshot
            await dynamoDB.send(
                new PutCommand({
                    TableName: process.env.HISTORY_TABLE,

                    Item: {
                        historyId:
                            `HIST-${Date.now()}`,

                        ticketId: ticketId,

                        subject:
                            existingTicket.Item.subject,

                        status: requestBody.status,

                        action:

                            requestBody.action ||

                            (

                                requestBody.status === "OPEN"

                                    ? "UPDATED"

                                    : requestBody.status

                            ),

                        timestamp:
                            new Date().toISOString()
                    }
                })
            );

            return successResponse(
                200,
                {
                    message:
                        "Ticket updated successfully"
                }
            );
        }

        // ==========================================
        // DELETE /tickets/{ticketId}
        // ==========================================
        if (method === "DELETE" && ticketId) {

            await dynamoDB.send(
                new DeleteCommand({
                    TableName: process.env.TICKETS_TABLE,
                    Key: {
                        ticketId: ticketId
                    }
                })
            );

            return successResponse(
                200,
                {
                    message:
                        "Ticket deleted successfully"
                }
            );
        }

        return errorResponse(
            400,
            "Unsupported operation"
        );

    } catch (error) {

        console.error(error);

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message:
                    "Internal Server Error",
                error: error.message
            })
        };
    }
};