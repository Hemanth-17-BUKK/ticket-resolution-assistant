# Email Ingestion API

## Purpose

Simulates Amazon SES email processing in development environments.

This endpoint allows testing email ingestion without domain ownership or SES receipt rules.

---

## Endpoint

POST /email

---

## Request Flow

POST /email
|
v
SesIngestionFunction
|
+----> S3 Attachments
|
v
SQS
|
v
TicketProcessorFunction
|
v
DynamoDB

---

## Request Example

{
"sender": "[customer@gmail.com](mailto:customer@gmail.com)",
"subject": "Refund Request via Email",
"message": "I was charged twice.",
"attachments": [
{
"fileName": "invoice.txt",
"content": "<base64-content>"
}
]
}

---

## Success Response

{
"message": "Email processed successfully"
}

---

## Verification

GET /tickets

Expected:

{
"source": "EMAIL"
}

---

## Future Production Flow

Customer Email
|
v
Amazon SES
|
v
SesIngestionFunction
|
v
SQS
|
v
TicketProcessorFunction

Current implementation uses a mock endpoint until domain ownership and DNS configuration are available.
