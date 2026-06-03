const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    console.log("Received Event:", JSON.stringify(event));

    for (const record of event.Records) {

        const ticket = JSON.parse(record.body);

        const ticketItem = {
            ticketId: `TKT-${Date.now()}`,
            customerId: ticket.customerId,
            subject: ticket.subject,
            message: ticket.message,

            attachments: ticket.attachments || [],

            source: ticket.source || "EMAIL",
            status: "OPEN",
            createdAt: new Date().toISOString()
        };

        await dynamoDB.send(
            new PutCommand({
                TableName: process.env.TICKETS_TABLE,
                Item: ticketItem
            })
        );

        console.log("Ticket Stored:", ticketItem);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Tickets processed successfully"
        })
    };
};