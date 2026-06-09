const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const {
    SQSClient,
    SendMessageCommand
} = require("@aws-sdk/client-sqs");

const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);

const sqsClient = new SQSClient({});

exports.handler = async (event) => {

    console.log(
        "Received Event:",
        JSON.stringify(event)
    );

    for (const record of event.Records) {

        const ticket =
            JSON.parse(record.body);

        const currentTimestamp =
            new Date().toISOString();

        const uniqueId =
            Date.now();

        const ticketItem = {

            ticketId:
                `TKT-${uniqueId}`,

            customerId:
                `CUST-${uniqueId}`,

            subject:
                ticket.subject,

            message:
                ticket.message,

            attachments:
                ticket.attachments || [],

            source:
                ticket.source || "WEB",

            status:
                "OPEN",

            createdAt:
                currentTimestamp,

            updatedAt:
                currentTimestamp
        };

        // =====================================
        // Store Ticket
        // =====================================

        await dynamoDB.send(
            new PutCommand({
                TableName:
                    process.env.TICKETS_TABLE,

                Item:
                    ticketItem
            })
        );

        // =====================================
        // Send To AI Queue
        // =====================================

        await sqsClient.send(
            new SendMessageCommand({

                QueueUrl:
                    process.env.AI_QUEUE_URL,

                MessageBody:
                    JSON.stringify({
                        ticketId:
                            ticketItem.ticketId
                    })
            })
        );

        // =====================================
        // Create Audit Record
        // =====================================

        await dynamoDB.send(
            new PutCommand({

                TableName:
                    process.env.HISTORY_TABLE,

                Item: {

                    historyId:
                        `HIST-${uniqueId}`,

                    ticketId:
                        ticketItem.ticketId,

                    subject:
                        ticketItem.subject,

                    status:
                        ticketItem.status,

                    timestamp:
                        currentTimestamp
                }
            })
        );

        console.log(
            "Ticket Stored:",
            JSON.stringify(ticketItem)
        );

        console.log(
            "Ticket Sent To AI Queue:",
            ticketItem.ticketId
        );
    }

    return {

        statusCode: 200,

        body: JSON.stringify({
            message:
                "Tickets processed successfully"
        })
    };
};