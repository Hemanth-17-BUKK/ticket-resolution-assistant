const { DynamoDBClient } =
    require("@aws-sdk/client-dynamodb");

const {
    DynamoDBDocumentClient,
    UpdateCommand,
    PutCommand
} = require("@aws-sdk/lib-dynamodb");

const {
    SNSClient,
    PublishCommand
} = require("@aws-sdk/client-sns");

const dynamoClient =
    new DynamoDBClient({});

const dynamoDB =
    DynamoDBDocumentClient.from(
        dynamoClient
    );

const snsClient =
    new SNSClient({});

// ======================================
// Bedrock Agent Response Builder
// ======================================

function buildBedrockResponse(
    event,
    message
) {
    return {
        messageVersion: "1.0",

        response: {
            actionGroup:
                event.actionGroup,

            function:
                event.function,

            functionResponse: {
                responseBody: {
                    TEXT: {
                        body:
                            JSON.stringify({
                                message
                            })
                    }
                }
            }
        }
    };
}

// ======================================
// Tool Implementations
// ======================================

async function getRefundStatus(
    ticketId
) {
    return {
        refundStatus:
            "IN_PROGRESS"
    };
}

async function issueRefund(
    ticketId
) {
    console.log(
        `Refund requested for ${ticketId}`
    );

    return true;
}

async function resetPassword(
    ticketId
) {
    console.log(
        `Password reset requested for ${ticketId}`
    );

    return true;
}

// ======================================
// Main Handler
// ======================================

exports.handler = async (
    event
) => {

    console.log(
        "Tool Executor Event:",
        JSON.stringify(event)
    );

    try {

        // ======================================
        // Approval / Rejection API
        // ======================================

        if (
            event.pathParameters
                ?.ticketId
        ) {

            const ticketId =
                event.pathParameters
                    .ticketId;

            const isApprove =
                event.rawPath
                    ?.includes(
                        "/approve/"
                    );

            const status =
                isApprove
                    ? "APPROVED"
                    : "REJECTED";

            await dynamoDB.send(
                new UpdateCommand({

                    TableName:
                        process.env.TICKETS_TABLE,

                    Key: {
                        ticketId
                    },

                    UpdateExpression:
                        "SET #status = :status, updatedAt = :updatedAt",

                    ExpressionAttributeNames: {
                        "#status":
                            "status"
                    },

                    ExpressionAttributeValues: {

                        ":status":
                            status,

                        ":updatedAt":
                            new Date().toISOString()
                    }
                })
            );

            await dynamoDB.send(
                new PutCommand({

                    TableName:
                        process.env.HISTORY_TABLE,

                    Item: {

                        historyId:
                            `HIST-${Date.now()}`,

                        ticketId,

                        status,

                        timestamp:
                            new Date().toISOString()
                    }
                })
            );

            return {
                statusCode: 200,

                headers: {
                    "Content-Type":
                        "text/html"
                },

                body:
                    `<h1>Ticket ${ticketId} ${status}</h1>`
            };
        }

        // ======================================
        // Bedrock Action Group Request
        // ======================================

        const tool =
            event.function;

        const ticketId =
            event.parameters
                ?.find(
                    p =>
                        p.name ===
                        "ticketId"
                )
                ?.value;

        console.log(
            "Tool:",
            tool
        );

        console.log(
            "Ticket ID:",
            ticketId
        );

        // ======================================
        // getRefundStatus
        // ======================================

        if (
            tool ===
            "getRefundStatus"
        ) {

            const result =
                await getRefundStatus(
                    ticketId
                );

            await dynamoDB.send(
                new PutCommand({

                    TableName:
                        process.env.HISTORY_TABLE,

                    Item: {

                        historyId:
                            `HIST-${Date.now()}`,

                        ticketId,

                        status:
                            "REFUND_STATUS_CHECKED",

                        timestamp:
                            new Date().toISOString()
                    }
                })
            );

            return buildBedrockResponse(
                event,
                `Refund status is ${result.refundStatus}`
            );
        }

        // ======================================
        // issueRefund
        // ======================================

        if (
            tool ===
            "issueRefund"
        ) {

            await issueRefund(
                ticketId
            );

            await dynamoDB.send(
                new UpdateCommand({

                    TableName:
                        process.env.TICKETS_TABLE,

                    Key: {
                        ticketId
                    },

                    UpdateExpression:
                        "SET #status = :status",

                    ExpressionAttributeNames: {
                        "#status":
                            "status"
                    },

                    ExpressionAttributeValues: {
                        ":status":
                            "PENDING_APPROVAL"
                    }
                })
            );

            await dynamoDB.send(
                new PutCommand({

                    TableName:
                        process.env.HISTORY_TABLE,

                    Item: {

                        historyId:
                            `HIST-${Date.now()}`,

                        ticketId,

                        tool:
                            "issueRefund",

                        status:
                            "PENDING_APPROVAL",

                        timestamp:
                            new Date().toISOString()
                    }
                })
            );

            await snsClient.send(
                new PublishCommand({

                    TopicArn:
                        process.env.APPROVAL_TOPIC_ARN,

                    Subject:
                        `Refund Approval Required - ${ticketId}`,

                    Message:
`Ticket ${ticketId}

Tool Requested:
issueRefund

Approve:
${process.env.API_BASE_URL}/approve/${ticketId}

Reject:
${process.env.API_BASE_URL}/reject/${ticketId}`
                })
            );

            return buildBedrockResponse(
                event,
                "Refund request submitted for approval"
            );
        }

        // ======================================
        // resetPassword
        // ======================================

        if (
            tool ===
            "resetPassword"
        ) {

            await resetPassword(
                ticketId
            );

            await dynamoDB.send(
                new UpdateCommand({

                    TableName:
                        process.env.TICKETS_TABLE,

                    Key: {
                        ticketId
                    },

                    UpdateExpression:
                        "SET #status = :status",

                    ExpressionAttributeNames: {
                        "#status":
                            "status"
                    },

                    ExpressionAttributeValues: {
                        ":status":
                            "PENDING_APPROVAL"
                    }
                })
            );

            await dynamoDB.send(
                new PutCommand({

                    TableName:
                        process.env.HISTORY_TABLE,

                    Item: {

                        historyId:
                            `HIST-${Date.now()}`,

                        ticketId,

                        tool:
                            "resetPassword",

                        status:
                            "PENDING_APPROVAL",

                        timestamp:
                            new Date().toISOString()
                    }
                })
            );

            await snsClient.send(
                new PublishCommand({

                    TopicArn:
                        process.env.APPROVAL_TOPIC_ARN,

                    Subject:
                        `Password Reset Approval Required - ${ticketId}`,

                    Message:
`Ticket ${ticketId}

Tool Requested:
resetPassword

Approve:
${process.env.API_BASE_URL}/approve/${ticketId}

Reject:
${process.env.API_BASE_URL}/reject/${ticketId}`
                })
            );

            return buildBedrockResponse(
                event,
                "Password reset request submitted for approval"
            );
        }

        return buildBedrockResponse(
            event,
            `Unknown tool: ${tool}`
        );

    } catch (error) {

        console.error(
            "Tool Executor Error:",
            error
        );

        throw error;
    }
};