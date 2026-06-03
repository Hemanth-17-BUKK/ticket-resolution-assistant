const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const sqsClient = new SQSClient({});
const s3Client = new S3Client({});

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

    const message = {
        customerId: body.customerId,
        subject: body.subject,
        message: body.message,
        source: "WEB",
        attachments: attachments
    };

    await sqsClient.send(
        new SendMessageCommand({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify(message)
        })
    );

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Ticket submitted successfully"
        })
    };
};