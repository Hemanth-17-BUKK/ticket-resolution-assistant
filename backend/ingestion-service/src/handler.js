const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const sqsClient = new SQSClient({});
const s3Client = new S3Client({});

const corsHeaders = {

    "Access-Control-Allow-Origin":
        "*",

    "Access-Control-Allow-Headers":
        "Content-Type,Authorization",

    "Access-Control-Allow-Methods":
        "GET,POST,PUT,DELETE,OPTIONS"
};

exports.handler = async (event) => {

    console.log("Incoming Request:", event);

    const body = JSON.parse(event.body);

    const attachments = [];

    if (body.attachments && body.attachments.length > 0) {

        for (const file of body.attachments) {

            const s3Key = `attachments/${Date.now()}-${file.fileName}`;

            await s3Client.send(
                new PutObjectCommand({
                    Bucket: process.env.ATTACHMENTS_BUCKET,
                    Key: s3Key,
                    Body: Buffer.from(file.content, "base64")
                })
            );

            attachments.push({
                fileName: file.fileName,
                s3Key: s3Key
            });
        }
    }
    console.log(
        "REQUEST CONTEXT:",
        JSON.stringify(
            event.requestContext,
            null,
            2
        )
    );
    console.log(
        "AUTHORIZER:",
        JSON.stringify(
            event.requestContext?.authorizer,
            null,
            2
        )
    );
    const customerEmail =
        event.requestContext
            ?.authorizer
            ?.claims
            ?.email;

            console.log(
                "Customer Email:",
                customerEmail
            );

    const message = {
        customerEmail,
        subject: body.subject,
        message: body.message,
        source: "WEB",
        attachments
    };

    await sqsClient.send(
        new SendMessageCommand({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify(message)
        })
    );

    return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify({
            message: "Ticket submitted successfully"
        })
    };
};