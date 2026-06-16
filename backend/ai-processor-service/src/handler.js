const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
    S3Client,
    GetObjectCommand
} = require("@aws-sdk/client-s3");

const {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand
} = require("@aws-sdk/lib-dynamodb");

const {
    BedrockAgentRuntimeClient,
    RetrieveCommand,
    InvokeAgentCommand
} = require(
    "@aws-sdk/client-bedrock-agent-runtime");

const {
    BedrockRuntimeClient,
    ConverseCommand
} = require("@aws-sdk/client-bedrock-runtime");

const s3Client = new S3Client({});

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
async function streamToString(stream) {

    const chunks = [];

    for await (const chunk of stream) {

        chunks.push(chunk);
    }

    return Buffer
        .concat(chunks)
        .toString("utf-8");
}
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

            let attachmentContext = "";

            if (
                ticket.attachments &&
                ticket.attachments.length > 0
            ) {

                console.log(
                    `Found ${ticket.attachments.length} attachment(s)`
                );

                for (const attachment of ticket.attachments) {

                    try {

                        const file =
                            await s3Client.send(
                                new GetObjectCommand({

                                    Bucket:
                                        process.env.ATTACHMENTS_BUCKET,

                                    Key:
                                        attachment.s3Key
                                })
                            );

                        const content =
                            await streamToString(
                                file.Body
                            );

                        attachmentContext += `

Attachment:
${attachment.fileName}

Content:
${content}

`;

        } catch (error) {

            console.error(
                `Failed to read attachment ${attachment.fileName}`,
                error
            );
        }
    }
}

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

Analyze this customer support ticket.

Ticket ID: ${ticket.ticketId}

Subject:
${ticket.subject}

Message:
${ticket.message}

Attachment Context:
${attachmentContext}

If a supported action is required,
use the appropriate action group.

Initial Response Rules:

Generate an acknowledgement message.

The acknowledgement message must:

- Confirm the ticket was received.
- Inform the customer the request is under review.
- Never solve the issue.
- Never provide troubleshooting steps.
- Never assume approval.
- Never claim an action has been completed.
- Keep it under 50 words.

Category MUST be exactly one of:

PAYMENT
AUTHENTICATION
TECHNICAL
SHIPPING
GENERAL

Mapping:

Payment, billing, refund, transaction issues => PAYMENT

Login, password, account access issues => AUTHENTICATION

Errors, bugs, crashes, technical failures => TECHNICAL

Shipping, delivery, order tracking => SHIPPING

Everything else => GENERAL

Priority Rules:

HIGH:
Payment issues, transactions, service outages.

MEDIUM:
Authentication issues.

LOW:
General inquiries.

Tool Decision Rules:

Return true if a support tool is required.

Refund Request => true

Refund Status => true

Password Reset => true

General Inquiry => false

Return ONLY valid JSON.

{
  "category": "",
  "priority": "",
  "sentiment": "",
  "draftReply": "",
  "toolRequired": false
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

            if (aiResult.toolRequired) {

                console.log(
                    "Invoking Bedrock Agent..."
                );

                const agentPrompt = `
            Ticket ID: ${ticket.ticketId}

            Subject:
            ${ticket.subject}

            Message:
            ${ticket.message}
            `;

                const agentResponse =
                    await bedrockAgentClient.send(
                        new InvokeAgentCommand({

                            agentId:
                                process.env.AGENT_ID,

                            agentAliasId:
                                process.env.AGENT_ALIAS_ID,

                            sessionId:
                                ticket.ticketId,

                            inputText:
                                agentPrompt
                        })
                    );

                console.log(
                    "Bedrock Agent Invoked Successfully"
                );

                console.log(
                    JSON.stringify(
                        agentResponse,
                        null,
                        2
                    )
                );
            }

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