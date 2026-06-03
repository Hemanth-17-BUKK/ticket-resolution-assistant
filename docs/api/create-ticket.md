# Create Ticket API

## Endpoint

POST /tickets

---

## Purpose

Creates a new support ticket and publishes it to Amazon SQS for asynchronous processing.

---

## Request Flow

Client
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
|
v
DynamoDB

---

## Request Headers

Content-Type: application/json

---

## Request Body

{
"customerId": "CUST-K7P4M9",
"subject": "Refund Request",
"message": "I was charged twice."
}

---

## Request Body With Attachment

{
"customerId": "CUST-K7P4M9",
"subject": "Attachment Test",
"message": "Testing attachment upload",
"attachments": [
{
"fileName": "sample.txt",
"content": "<base64-content>"
}
]
}

---

## Success Response

HTTP 201

{
"message": "Ticket submitted successfully"
}

---

## Postman Testing

Method:

POST

Endpoint:

https://<api-id>.execute-api.us-east-1.amazonaws.com/Prod/tickets
