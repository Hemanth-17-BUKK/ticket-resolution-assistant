const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const sqsClient = new SQSClient({});
const s3Client = new S3Client({});

exports.handler = async (event) => {

    console.log("SES Event:", JSON.stringify(event));

    let ticket;

    // =====================================
    // REAL SES EVENT
    // =====================================
    if (event.Records && event.Records[0]?.ses) {

        const mail = event.Records[0].ses.mail;

        ticket = {
            source: "EMAIL",
            sender: mail.source,
            subject: mail.commonHeaders.subject || "No Subject",
            message: "Email received via SES",
            attachments: []
        };
    }

    // =====================================
    // POSTMAN / API GATEWAY EVENT
    // =====================================
    else {

        const body = JSON.parse(event.body);

        const attachments = [];

        if (body.attachments && body.attachments.length > 0) {

            for (const file of body.attachments) {

                const fileKey =
                    `attachments/${Date.now()}-${file.fileName}`;

                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.ATTACHMENTS_BUCKET,
                        Key: fileKey,
                        Body: Buffer.from(file.content, "base64")
                    })
                );

                attachments.push({
                    fileName: file.fileName,
                    s3Key: fileKey
                });
            }
        }

        ticket = {
            source: "EMAIL",
            sender: body.sender,
            subject: body.subject,
            message: body.message,
            attachments
        };
    }

    await sqsClient.send(
        new SendMessageCommand({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify(ticket)
        })
    );

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Email processed successfully"
        })
    };
};