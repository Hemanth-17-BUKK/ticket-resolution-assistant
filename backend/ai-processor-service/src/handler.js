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

const pdfParse =
    require("pdf-parse");
    
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
async function streamToBuffer(stream) {

    const chunks = [];

    for await (const chunk of stream) {

        chunks.push(chunk);
    }

    return Buffer.concat(chunks);
}

async function streamToString(stream) {

    const buffer =
        await streamToBuffer(stream);

    return buffer.toString("utf-8");
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

    for (
        const attachment
        of ticket.attachments
    ) {

        try {

            const fileName =
                attachment.fileName
                    .toLowerCase();

            const object =
                await s3Client.send(
                    new GetObjectCommand({

                        Bucket:
                            process.env.ATTACHMENTS_BUCKET,

                        Key:
                            attachment.s3Key
                    })
                );

            // ==========================
            // PDF Invoice
            // ==========================

            if (
                fileName.endsWith(
                    ".pdf"
                )
            ) {

                const pdfBuffer =
                    await streamToBuffer(
                        object.Body
                    );

                const pdfData =
                    await pdfParse(
                        pdfBuffer
                    );

                attachmentContext += `

Invoice Attachment:

${pdfData.text}

`;
            }

            // ==========================
            // Text Files
            // ==========================

            else if (

                fileName.endsWith(".txt") ||
                fileName.endsWith(".csv") ||
                fileName.endsWith(".log") ||
                fileName.endsWith(".json")

            ) {

                const content =
                    await streamToString(
                        object.Body
                    );

                attachmentContext += `

Attachment:

${content}

`;
            }

        } catch (error) {

            console.error(
                `Failed processing attachment ${attachment.fileName}`,
                error
            );
        }
    }
}

console.log(
    "Attachment Context:",
    attachmentContext
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
You are an AI Customer Support Analyst for an enterprise ticket resolution system.

Your responsibility is to analyze customer support tickets accurately and consistently using:

1. The customer's message.
2. Any uploaded attachment.
3. The retrieved Knowledge Base.

Your response will be used by an automated ticketing system, therefore accuracy is more important than creativity.

==================================================
RETRIEVED KNOWLEDGE BASE
==================================================

${context}

==================================================
CUSTOMER TICKET
==================================================

Ticket ID:
${ticket.ticketId}

Subject:
${ticket.subject}

Message:
${ticket.message}

Attachment Context:
${attachmentContext || "No attachment provided."}

==================================================
TASKS
==================================================

Complete ALL of the following tasks.

1. Determine the ticket category.

2. Determine the ticket priority.

3. Determine the customer's sentiment.

4. Decide whether a backend support tool is required.

5. Generate the appropriate customer response.

6. Estimate your confidence in the overall analysis.

==================================================
CATEGORY RULES
==================================================

Return EXACTLY one of these values.

PAYMENT
AUTHENTICATION
TECHNICAL
SHIPPING
GENERAL

Use these mappings.

PAYMENT

- Refund requests
- Billing issues
- Failed payments
- Duplicate charges
- Transactions
- Invoice issues

AUTHENTICATION

- Login issues
- Password reset
- MFA problems
- Locked accounts
- Account access

TECHNICAL

- Application errors
- Bugs
- Crashes
- Unexpected behaviour
- System failures
- Performance issues

SHIPPING

- Order tracking
- Delivery delays
- Shipment status
- Shipping policies

GENERAL

- Greetings
- General questions
- Information requests
- Support hours
- Policies
- Anything not covered above

==================================================
PRIORITY RULES
==================================================

HIGH

- Refunds
- Payment failures
- Financial issues
- Service outages
- Security incidents

MEDIUM

- Authentication
- Login
- Password reset
- Account access

LOW

- Shipping questions
- Policy questions
- General enquiries
- Informational requests

==================================================
TOOL DECISION RULES
==================================================

toolRequired = true

- Refund request
- Refund status
- Password reset
- Order status
- Account unlock
- Account verification

toolRequired = false

- Shipping timelines
- Policies
- FAQs
- General information
- Questions that can be answered using the Knowledge Base only

==================================================
RESPONSE RULES
==================================================

CASE 1

If toolRequired is TRUE

Generate ONLY a short acknowledgement.

The acknowledgement must:

- Confirm the request was received.
- State that it is under review.
- Never solve the issue.
- Never provide troubleshooting.
- Never promise approval.
- Never state an action has already been completed.
- Maximum 50 words.

Example:

"Thank you for contacting support. Your request has been received and is currently under review. Our support team will update you as soon as possible."

--------------------------------------------------

CASE 2

If toolRequired is FALSE

Generate the COMPLETE customer response.

Requirements:

- Use ONLY the retrieved Knowledge Base.
- Answer the customer's question directly.
- Do not invent information.
- Do not guess.
- If the Knowledge Base does not contain enough information, politely say that additional assistance is required.
- Do NOT generate an acknowledgement.
- Do NOT say the request is under review.

==================================================
KNOWLEDGE BASE USAGE
==================================================

Always prioritize the retrieved Knowledge Base.

If the Knowledge Base contains the answer,
use it.

If attachment content provides additional
context,
use it.

Never contradict the Knowledge Base.

Never invent policies.

==================================================
SENTIMENT
==================================================

Return one of:

POSITIVE

NEUTRAL

NEGATIVE

==================================================
CONFIDENCE
==================================================

Return an integer from 0 to 100.

Base the confidence on:

- clarity of the customer's request
- relevance of the attachment
- relevance of the retrieved Knowledge Base
- certainty of category
- certainty of priority
- certainty of sentiment

90-100

Very confident.

70-89

Mostly confident with minor ambiguity.

Below 70

Ambiguous request or insufficient information.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

Do NOT include markdown.

Do NOT include explanations.

Do NOT include code fences.

{
  "category": "",
  "priority": "",
  "sentiment": "",
  "confidence": 95,
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
                        aiConfidence = :aiConfidence,
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

                        ":aiConfidence":
                            aiResult.confidence,

                        ":draftReply":
                            aiResult.draftReply,

                        ":updatedAt":
                            new Date().toISOString()
                    }
                })
            );

            if (aiResult.toolRequired) {
                status = "PROCESSING";
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