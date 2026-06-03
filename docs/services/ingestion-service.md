# Ingestion Service

## Overview

The Ingestion Service acts as the entry point for all web-based ticket submissions.

It receives ticket requests through API Gateway, uploads attachments to Amazon S3, and publishes ticket messages to Amazon SQS for asynchronous processing.

---

## Service Location

backend/ingestion-service

Handler:

src/handler.js

---

## AWS Services Used

* Amazon API Gateway
* AWS Lambda
* Amazon S3
* Amazon SQS

---

## Environment Variables

### QUEUE_URL

Purpose:

Target SQS queue URL used for publishing ticket messages.

### ATTACHMENTS_BUCKET

Purpose:

S3 bucket used for storing uploaded attachments.

---

## Architecture Flow

Customer
|
v
API Gateway
|
v
TicketIngestionFunction
|
+----> S3 Attachments
|
v
SQS
|
v
TicketProcessorFunction

---

## Responsibilities

* Receive ticket requests
* Process attachment uploads
* Store files in S3
* Generate attachment metadata
* Publish ticket message to SQS

---

## API Endpoint

POST /tickets

---

## Sample Request

{
"customerId": "CUST-K7P4M9",
"subject": "Refund Request",
"message": "I was charged twice."
}

---

## Attachment Request Example

{
"customerId": "CUST-K7P4M9",
"subject": "Attachment Test",
"message": "Testing attachment upload",
"attachments": [
{
"fileName": "sample.txt",
"content": "VGhpcyBpcyBhIHNhbXBsZSBmaWxl"
}
]
}

---

## Deployment Commands

sam validate -t infrastructure/template.yaml

sam build -t infrastructure/template.yaml

sam deploy

---

## Testing

Use Postman:

POST /tickets

Header:

Content-Type: application/json

---

## Expected Result

HTTP 201

{
"message": "Ticket submitted successfully"
}

---

## Troubleshooting

### Attachment Upload Failure

Cause:

Missing S3 permissions.

Resolution:

Verify S3CrudPolicy is attached.

### SQS Publish Failure

Cause:

Incorrect QUEUE_URL.

Resolution:

Verify Lambda environment variables.
