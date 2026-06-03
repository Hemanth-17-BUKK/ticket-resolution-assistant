const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    GetCommand,
    ScanCommand,
    UpdateCommand,
    DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const dynamoClient = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(dynamoClient);

const s3Client = new S3Client({});

exports.handler = async (event) => {

    try {

        const method = event.httpMethod;
        const ticketId = event.pathParameters?.ticketId;

        // =====================================
        // GET /tickets/{ticketId}
        // =====================================
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
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: "Ticket not found"
                    })
                };
            }

            const ticket = result.Item;

            if (ticket.attachments && ticket.attachments.length > 0) {

                for (const attachment of ticket.attachments) {

                    attachment.downloadUrl = await getSignedUrl(
                        s3Client,
                        new GetObjectCommand({
                            Bucket: process.env.ATTACHMENTS_BUCKET,
                            Key: attachment.s3Key
                        }),
                        {
                            expiresIn: 3600
                        }
                    );
                }
            }

            return {
                statusCode: 200,
                body: JSON.stringify(ticket)
            };
        }

        // =====================================
        // GET /tickets
        // =====================================
        if (method === "GET") {

            const result = await dynamoDB.send(
                new ScanCommand({
                    TableName: process.env.TICKETS_TABLE
                })
            );

            return {
                statusCode: 200,
                body: JSON.stringify(result.Items)
            };
        }

        // =====================================
        // PUT /tickets/{ticketId}
        // =====================================
        if (method === "PUT" && ticketId) {

            const requestBody = event.body
                ? JSON.parse(event.body)
                : {};

            if (!requestBody.status) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: "status is required"
                    })
                };
            }

            await dynamoDB.send(
                new UpdateCommand({
                    TableName: process.env.TICKETS_TABLE,
                    Key: {
                        ticketId: ticketId
                    },
                    UpdateExpression: "SET #status = :status",
                    ExpressionAttributeNames: {
                        "#status": "status"
                    },
                    ExpressionAttributeValues: {
                        ":status": requestBody.status
                    }
                })
            );

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Ticket updated successfully"
                })
            };
        }

        // =====================================
        // DELETE /tickets/{ticketId}
        // =====================================
        if (method === "DELETE" && ticketId) {

            await dynamoDB.send(
                new DeleteCommand({
                    TableName: process.env.TICKETS_TABLE,
                    Key: {
                        ticketId: ticketId
                    }
                })
            );

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Ticket deleted successfully"
                })
            };
        }

        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Unsupported operation"
            })
        };

    } catch (error) {

        console.error("ERROR:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal Server Error"
            })
        };
    }
};