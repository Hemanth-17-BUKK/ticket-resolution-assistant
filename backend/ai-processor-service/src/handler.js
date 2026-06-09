const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand
} = require("@aws-sdk/lib-dynamodb");

const {
    BedrockAgentRuntimeClient,
    RetrieveCommand
} = require("@aws-sdk/client-bedrock-agent-runtime");

const {
    BedrockRuntimeClient,
    ConverseCommand
} = require("@aws-sdk/client-bedrock-runtime");

const dynamoClient = new DynamoDBClient({});

const dynamoDB =
    DynamoDBDocumentClient.from(dynamoClient);

const bedrockAgentClient =
    new BedrockAgentRuntimeClient({
        region: "us-east-1"
    });

const bedrockRuntimeClient =
    new BedrockRuntimeClient({
        region: "us-east-1"
    });

exports.handler = async (event) => {

    try {

        console.log(
            "Incoming Event:",
            JSON.stringify(event)
        );

        for (const record of event.Records) {

            const message =
                JSON.parse(record.body);

            const ticketId =
                message.ticketId;

            console.log(
                "Processing Ticket:",
                ticketId
            );

            // =====================================
            // Get Ticket
            // =====================================

            const ticketResult =
                await dynamoDB.send(
                    new GetCommand({
                        TableName:
                            process.env.TICKETS_TABLE,

                        Key: {
                            ticketId
                        }
                    })
                );

            if (!ticketResult.Item) {

                console.log(
                    `Ticket ${ticketId} not found`
                );

                continue;
            }

            const ticket =
                ticketResult.Item;

            console.log(
                "Ticket:",
                JSON.stringify(ticket)
            );

            // =====================================
            // Retrieve Context From KB
            // =====================================

            const retrieveResponse =
                await bedrockAgentClient.send(
                    new RetrieveCommand({

                        knowledgeBaseId:
                            process.env.KNOWLEDGE_BASE_ID,

                        retrievalQuery: {
                            text:
                                `${ticket.subject}\n${ticket.message}`
                        }
                    })
                );

            const retrievedChunks =
                retrieveResponse.retrievalResults || [];

            const context =
                retrievedChunks
                    .map(
                        chunk =>
                            chunk.content?.text || ""
                    )
                    .join("\n\n");

            // =====================================
            // Build Prompt
            // =====================================

            const prompt = `
You are an AI customer support analyst.

Use the knowledge base context to classify the ticket.

Knowledge Base Context:
${context}

Ticket Subject:
${ticket.subject}

Ticket Message:
${ticket.message}

Rules:

1. Payment, billing, refund, transaction issues => PAYMENT

2. Login, password, account access issues => AUTHENTICATION

3. Errors, bugs, crashes, technical failures => TECHNICAL

4. Shipping, delivery, order tracking => SHIPPING

5. Everything else => GENERAL

Priority Rules:

HIGH:
Payment issues, transactions, service outages.

MEDIUM:
Authentication issues.

LOW:
General inquiries.

Return ONLY valid JSON.

{
  "category": "",
  "priority": "",
  "sentiment": "",
  "draftReply": ""
}
`;

            // =====================================
            // Invoke Nova Lite
            // =====================================

            const aiResponse =
                await bedrockRuntimeClient.send(
                    new ConverseCommand({

                        modelId:
                            process.env.MODEL_ID,

                        messages: [
                            {
                                role: "user",

                                content: [
                                    {
                                        text: prompt
                                    }
                                ]
                            }
                        ]
                    })
                );

            const aiText =
                aiResponse
                    .output
                    .message
                    .content[0]
                    .text;

            console.log(
                "Raw AI Response:",
                aiText
            );

            // =====================================
            // Parse AI JSON
            // =====================================

            const cleanText =
                aiText
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

            const aiResult =
                JSON.parse(cleanText);

            console.log(
                "Parsed AI Result:",
                JSON.stringify(aiResult)
            );

            // =====================================
            // Update Ticket
            // =====================================

            await dynamoDB.send(
                new UpdateCommand({

                    TableName:
                        process.env.TICKETS_TABLE,

                    Key: {
                        ticketId
                    },

                    UpdateExpression: `
                        SET
                        category = :category,
                        priority = :priority,
                        sentiment = :sentiment,
                        draftReply = :draftReply,
                        updatedAt = :updatedAt
                    `,

                    ExpressionAttributeValues: {

                        ":category":
                            aiResult.category,

                        ":priority":
                            aiResult.priority,

                        ":sentiment":
                            aiResult.sentiment,

                        ":draftReply":
                            aiResult.draftReply,

                        ":updatedAt":
                            new Date().toISOString()
                    }
                })
            );

            console.log(
                `AI processing completed for ${ticketId}`
            );
        }

        return {
            statusCode: 200
        };

    } catch (error) {

        console.error(
            "AI Processor Error:",
            error
        );

        throw error;
    }
};