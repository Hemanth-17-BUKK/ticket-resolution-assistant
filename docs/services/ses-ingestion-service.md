# SES Ingestion Service

## Overview

The SES Ingestion Service handles email-based ticket creation.

The service supports two modes:

1. Real Amazon SES Events
2. Mock Email API for local and development testing

---

## Service Location

backend/ses-ingestion-service

Handler:

src/handler.js

---

## AWS Services Used

* Amazon SES
* AWS Lambda
* Amazon S3
* Amazon SQS
* Amazon API Gateway

---

## Environment Variables

### QUEUE_URL

Target SQS queue.

### ATTACHMENTS_BUCKET

Target S3 bucket.

---

## Architecture Flow

Production

Customer Email
|
v
SES
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

---

Development

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

---

## Supported Modes

### Real SES Event

event.Records[0].ses

### Mock Email Event

event.body

---

## Mock Email Endpoint

POST /email

---

## Sample Request

{
"sender": "[customer@gmail.com](mailto:customer@gmail.com)",
"subject": "Refund Request via Email",
"message": "I was charged twice.",
"attachments": [
{
"fileName": "invoice.txt",
"content": "VGhpcyBpcyBhbiBlbWFpbCBhdHRhY2htZW50"
}
]
}

---

## Responsibilities

* Process email requests
* Upload email attachments to S3
* Generate attachment metadata
* Publish ticket messages to SQS

---

## Current Limitation

Real SES inbound email receiving requires:

* Domain ownership
* DNS configuration
* SES receipt rules
* MX records

These are currently pending.

---

## Troubleshooting

### 502 Bad Gateway

Cause:

Lambda expected SES event but received API Gateway event.

Resolution:

Implement dual-mode event handling.

### Attachment Upload Failure

Cause:

Missing S3 permissions.

Resolution:

Verify S3CrudPolicy configuration.
