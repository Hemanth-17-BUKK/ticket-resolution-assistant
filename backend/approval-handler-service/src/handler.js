const { DynamoDBClient } =
    require("@aws-sdk/client-dynamodb");

const {
    DynamoDBDocumentClient,
    UpdateCommand,
    PutCommand,
    QueryCommand,
    GetCommand
} = require("@aws-sdk/lib-dynamodb");

const {
    BedrockRuntimeClient,
    ConverseCommand
} = require(
    "@aws-sdk/client-bedrock-runtime"
);

const dynamoClient =
    new DynamoDBClient({});

const dynamoDB =
    DynamoDBDocumentClient.from(
        dynamoClient
    );

const bedrockClient =
    new BedrockRuntimeClient({
        region: "us-east-1"
    });

exports.handler = async (event) => {

    console.log(
        "Event:",
        JSON.stringify(event, null, 2)
    );

    try {

        const ticketId =
            event.pathParameters.ticketId;

        const isApprove =
            event.resource ===
            "/approve/{ticketId}";

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

        const ticket =
            ticketResult.Item;

        if (!ticket) {

            return {
                statusCode: 404,
                body:
                    "Ticket not found"
            };
        }

        // =====================================
        // Get Latest Tool Request
        // =====================================

        const historyResult =
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

        const toolRecord =
            historyResult.Items
                ?.filter(
                    item => item.tool
                )
                ?.sort(
                    (a, b) =>
                        b.timestamp.localeCompare(
                            a.timestamp
                        )
                )[0];

        const tool =
            toolRecord?.tool ||
            "UNKNOWN";

        console.log(
            "Tool Found:",
            tool
        );

        // =====================================
        // Generate Final Reply
        // =====================================

        let prompt;

        if (isApprove) {

            prompt = `
You are generating a final customer support ticket response.

Ticket Subject:
${ticket.subject}

Customer Message:
${ticket.message}

Requested Action:
${tool}

The request has been approved.

Rules:

- Maximum 2 sentences.
- Maximum 30 words.
- Plain text only.
- No greetings.
- No sign-off.
- No names.
- No placeholders.
- No email format.
- No bullet points.
- No markdown.
- Do not invent technical details.
- Do not claim refunds were issued.
- Do not claim passwords were reset.
- Do not claim emails were sent.
- Confirm only that the request was approved and is being processed.

Examples:

Your request has been approved and is being processed.

Your request has been approved. Thank you for your patience.

Return ONLY the response text.
`;
        }
        else {

            prompt = `
You are generating a final customer support ticket response.

Ticket Subject:
${ticket.subject}

Customer Message:
${ticket.message}

The request has been reviewed and rejected.

Rules:

- Maximum 2 sentences.
- Maximum 30 words.
- Plain text only.
- No greetings.
- No sign-off.
- No names.
- No placeholders.
- No email format.
- No bullet points.
- No markdown.
- Do not invent rejection reasons.
- Do not ask for more information.
- Be concise and professional.

Examples:

Your request has been reviewed but could not be approved at this time.

Your request could not be approved. Please contact support if you need further assistance.

Return ONLY the response text.
`;
        }

        const aiResponse =
            await bedrockClient.send(
                new ConverseCommand({

                    modelId:
                        process.env.MODEL_ID,

                    messages: [
                        {
                            role: "user",

                            content: [
                                {
                                    text:
                                        prompt
                                }
                            ]
                        }
                    ]
                })
            );

        const finalReply =
            aiResponse.output
                .message
                .content[0]
                .text
                .replace(/\n/g, " ")
                .replace(/\s+/g, " ")
                .trim();

        console.log(
            "Final Reply:",
            finalReply
        );

        // =====================================
        // Ticket Status
        // =====================================

        const status =
            isApprove
                ? "RESOLVED"
                : "REJECTED";

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
                    #status = :status,
                    finalReply = :finalReply
                    REMOVE draftReply
                `,

                ExpressionAttributeNames: {
                    "#status":
                        "status"
                },

                ExpressionAttributeValues: {

                    ":status":
                        status,

                    ":finalReply":
                        finalReply
                }
            })
        );

        // =====================================
        // Write History
        // =====================================

        await dynamoDB.send(
            new PutCommand({

                TableName:
                    process.env.HISTORY_TABLE,

                Item: {

                    historyId:
                        `HIST-${Date.now()}`,

                    ticketId,

                    status,

                    tool,

                    timestamp:
                        new Date().toISOString()
                }
            })
        );

        // =====================================
        // Response Page
        // =====================================

        return {

            statusCode: 200,

            headers: {
                "Content-Type":
                    "text/html"
            },

            body: `
            <html>
                <body style="font-family: Arial; padding:40px;">
                    <h1>Ticket ${ticketId}</h1>
                    <h2>Status: ${status}</h2>
                    <p>${finalReply}</p>
                </body>
            </html>
            `
        };

    } catch (error) {

        console.error(
            "Approval Handler Error:",
            error
        );

        throw error;
    }
};