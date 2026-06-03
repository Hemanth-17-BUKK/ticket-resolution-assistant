# Query Service

## Overview

The Query Service provides APIs for ticket retrieval, updates, deletion, and attachment downloads.

---

## Service Location

backend/query-service

Handler:

src/handler.js

---

## AWS Services Used

* Amazon API Gateway
* AWS Lambda
* Amazon DynamoDB
* Amazon S3

---

## Environment Variables

### TICKETS_TABLE

Target DynamoDB table.

### ATTACHMENTS_BUCKET

Target S3 bucket.

---

## Supported APIs

GET /tickets

GET /tickets/{ticketId}

PUT /tickets/{ticketId}

DELETE /tickets/{ticketId}

---

## Responsibilities

* Retrieve tickets
* Retrieve individual ticket details
* Update ticket status
* Delete tickets
* Generate S3 presigned URLs

---

## Sample Update Request

PUT /tickets/{ticketId}

{
"status": "RESOLVED"
}

---

## Sample Delete Request

DELETE /tickets/{ticketId}

---

## Attachment Download Flow

Customer
|
v
GET /tickets/{ticketId}
|
v
Query Lambda
|
v
Generate Presigned URL
|
v
Return Download URL

---

## Testing Commands

Get All Tickets

GET /tickets

Get Single Ticket

GET /tickets/{ticketId}

Update Ticket

PUT /tickets/{ticketId}

Delete Ticket

DELETE /tickets/{ticketId}

---

## Troubleshooting

### 500 Internal Server Error

Cause:

Null request body.

Resolution:

Validate request payload.

### Missing Download URL

Cause:

S3 key not found.

Resolution:

Verify object exists in S3 bucket.
