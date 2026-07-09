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

                headers: {

                    "Content-Type": "application/json",

                    "Access-Control-Allow-Origin": "*",

                    "Access-Control-Allow-Headers": "*",

                    "Access-Control-Allow-Methods": "GET,OPTIONS"

                },

                body: JSON.stringify({

                    message: "Ticket not found"

                })

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

        // const aiResponse =
        //     await bedrockClient.send(
        //         new ConverseCommand({

        //             modelId:
        //                 process.env.MODEL_ID,

        //             messages: [
        //                 {
        //                     role: "user",

        //                     content: [
        //                         {
        //                             text:
        //                                 prompt
        //                         }
        //                     ]
        //                 }
        //             ]
        //         })
        //     );

        // const finalReply =
        //     aiResponse.output
        //         .message
        //         .content[0]
        //         .text
        //         .replace(/\n/g, " ")
        //         .replace(/\s+/g, " ")
        //         .trim();

        // console.log(
        //     "Final Reply:",
        //     finalReply
        // );
        
        /* =====================================
   Generate Final Reply
===================================== */

let finalReply;

if (ticket.draftReply) {

    console.log(
        "Using saved draft reply."
    );

    finalReply = ticket.draftReply;

}
else {

    console.log(
        "No saved draft found. Generating reply using Bedrock."
    );

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
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        );

    finalReply =
        aiResponse.output
            .message
            .content[0]
            .text
            .replace(/\n/g, " ")
            .replace(/\s+/g, " ")
            .trim();

}

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

                    action: status,

                    tool,

                    timestamp:
                        new Date().toISOString()
                }
            })
        );

        /* =====================================
        RESPONSE TYPE
        ===================================== */

        const wantsJson = Boolean(

            event.headers?.authorization ||

            event.headers?.Authorization

        );

        // =====================================
        // Response Page
        // =====================================

       /* =====================================
   DASHBOARD RESPONSE
===================================== */

if (wantsJson) {

    return {

        statusCode: 200,

        headers: {

            "Content-Type": "application/json",

            "Access-Control-Allow-Origin": "*",

            "Access-Control-Allow-Headers": "Content-Type,Authorization",

            "Access-Control-Allow-Methods": "GET,OPTIONS"

        },

        body: JSON.stringify({

            success: true,

            ticketId,

            status,

            finalReply

        })

    };

}

/* =====================================
   EMAIL RESPONSE
===================================== */

return {

    statusCode: 200,

    headers: {

        "Content-Type": "text/html"

    },

    body: `
    <html>

        <head>

            <title>Ticket Approval</title>

        </head>

        <body
            style="
                font-family: Arial, sans-serif;
                max-width:600px;
                margin:40px auto;
                padding:30px;
                border:1px solid #e5e7eb;
                border-radius:12px;
                box-shadow:0 2px 10px rgba(0,0,0,.08);
            "
        >

            <h2
                style="color:#2563eb;"
            >

                Ticket Updated Successfully

            </h2>

            <hr>

            <p>

                <strong>Ticket ID:</strong>
                ${ticketId}

            </p>

            <p>

                <strong>Status:</strong>
                ${status}

            </p>

            <p>

                <strong>Customer Response:</strong>

            </p>

            <div
                style="
                    background:#f8fafc;
                    padding:16px;
                    border-radius:8px;
                    border-left:4px solid #2563eb;
                "
            >

                ${finalReply}

            </div>

            <p
                style="
                    margin-top:30px;
                    color:#64748b;
                    font-size:13px;
                "
            >

                This approval has already been processed.
                You may close this window.

            </p>

        </body>

    </html>
    `

};

    } catch (error) {

    console.error(
        "Approval Handler Error:",
        error
    );

    const wantsJson = Boolean(

        event.headers?.authorization ||

        event.headers?.Authorization

    );

    if (wantsJson) {

        return {

            statusCode: 500,

            headers: {

                "Content-Type": "application/json",

                "Access-Control-Allow-Origin": "*",

                "Access-Control-Allow-Headers": "Content-Type,Authorization",

                "Access-Control-Allow-Methods": "GET,OPTIONS"

            },

            body: JSON.stringify({

                message: error.message

            })

        };

    }

    return {

        statusCode: 500,

        headers: {

            "Content-Type": "text/html"

        },

        body: `

        <html>

            <body style="font-family:Arial;padding:40px;">

                <h2 style="color:#dc2626;">

                    Approval Failed

                </h2>

                <p>

                    ${error.message}

                </p>

            </body>

        </html>

        `

    };

}
};