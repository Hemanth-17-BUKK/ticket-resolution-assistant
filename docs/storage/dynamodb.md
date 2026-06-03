# DynamoDB Storage

## Overview

Amazon DynamoDB is used as the primary datastore for ticket records.

Each support ticket is stored as a single item.

---

## Table Information

Table Name:

tickets

Billing Mode:

PAY_PER_REQUEST

Partition Key:

ticketId

Data Type:

String

---

## Why DynamoDB?

Reasons for choosing DynamoDB:

* Fully managed service
* Serverless architecture
* Automatic scaling
* Low latency reads and writes
* Native AWS integration

---

## Ticket Schema

{
"ticketId": "TKT-1780294246101",
"customerId": "CUST-K7P4M9",
"subject": "Refund Request",
"message": "I was charged twice.",
"source": "WEB",
"status": "OPEN",
"createdAt": "2026-06-01T06:10:46.101Z",
"attachments": [
{
"fileName": "sample.txt",
"s3Key": "attachments/1780294244106-sample.txt"
}
]
}

---

## Field Definitions

### ticketId

Unique ticket identifier.

Example:

TKT-1780294246101

---

### customerId

Customer identifier.

Example:

CUST-K7P4M9

---

### subject

Short description of issue.

---

### message

Detailed issue description.

---

### source

Ticket source.

Possible values:

WEB

EMAIL

---

### status

Ticket status.

Possible values:

OPEN

IN_PROGRESS

RESOLVED

CLOSED

---

### attachments

List of attachment metadata.

---

## Sample Queries

Scan Table

aws dynamodb scan --table-name tickets

---

Get Specific Item

aws dynamodb get-item --table-name tickets --key "{"ticketId":{"S":"TKT-1780294246101"}}"

---

## Troubleshooting

### Ticket Not Stored

Cause:

Processor Lambda failed.

Resolution:

Check CloudWatch logs for TicketProcessorFunction.

---

### Missing Fields

Cause:

Incorrect message structure from ingestion service.

Resolution:

Verify SQS message payload.
