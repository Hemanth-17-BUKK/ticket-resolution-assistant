# Processor Service

## Overview

The Processor Service consumes messages from Amazon SQS and persists ticket records into Amazon DynamoDB.

This service decouples ticket submission from ticket storage.

---

## Service Location

backend/processor-service

Handler:

src/handler.js

---

## AWS Services Used

* Amazon SQS
* AWS Lambda
* Amazon DynamoDB

---

## Environment Variables

### TICKETS_TABLE

Purpose:

Target DynamoDB table for ticket storage.

---

## Architecture Flow

SQS
|
v
TicketProcessorFunction
|
v
DynamoDB

---

## Responsibilities

* Consume SQS messages
* Generate ticket records
* Assign initial status
* Store attachment metadata
* Persist tickets into DynamoDB

---

## Ticket Schema

{
"ticketId": "TKT-1780294246101",
"customerId": "CUST-K7P4M9",
"subject": "Refund Request",
"message": "I was charged twice.",
"source": "WEB",
"status": "OPEN",
"attachments": []
}

---

## SQS Trigger

Queue:

ticket-queue

Batch Size:

1

---

## Testing

Send message to SQS:

aws sqs send-message --queue-url <QUEUE_URL> --message-body file://message.json

Verify:

aws dynamodb scan --table-name tickets

---

## Troubleshooting

### Records Not Stored

Cause:

Missing DynamoDB permissions.

Resolution:

Verify DynamoDBCrudPolicy.

### SQS Trigger Not Executed

Cause:

Missing Event Source Mapping.

Resolution:

Verify Queue event configuration in SAM template.
