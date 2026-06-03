# S3 Attachment Storage

## Overview

Amazon S3 is used to store ticket attachments.

Attachments are uploaded during ticket creation and referenced from DynamoDB.

---

## Bucket Information

Bucket Name:

ticket-resolution-assistant-attachments

---

## Why S3?

Reasons for choosing Amazon S3:

* Highly durable storage
* Virtually unlimited capacity
* Cost effective
* Native integration with Lambda
* Secure presigned URL support

---

## Upload Flow

Customer
|
v
API Gateway
|
v
TicketIngestionFunction
|
v
S3 Bucket

---

## Email Attachment Flow

Development Mode

POST /email
|
v
SesIngestionFunction
|
v
S3 Bucket

Future Production Mode

Customer Email
|
v
SES
|
v
SesIngestionFunction
|
v
S3 Bucket

---

## Object Naming Convention

attachments/<timestamp>-<filename>

Example:

attachments/1780294244106-sample.txt

---

## Attachment Metadata

Stored in DynamoDB:

{
"fileName": "sample.txt",
"s3Key": "attachments/1780294244106-sample.txt"
}

---

## Download Flow

Customer
|
v
GET /tickets/{ticketId}
|
v
TicketQueryFunction
|
v
Generate Presigned URL
|
v
Return URL

---

## Presigned URL

Validity:

3600 seconds

Example:

https://bucket.s3.amazonaws.com/...

---

## Verification Commands

List Objects

aws s3 ls s3://ticket-resolution-assistant-attachments/attachments/ --recursive

---

View Object

aws s3 cp s3://ticket-resolution-assistant-attachments/attachments/<file> .

---

## Troubleshooting

### Upload Failed

Cause:

Missing S3 permissions.

Resolution:

Verify S3CrudPolicy attached to Lambda.

---

### Download URL Not Generated

Cause:

Object key missing.

Resolution:

Verify attachment metadata stored in DynamoDB.

---

### 403 Access Denied

Cause:

Expired presigned URL.

Resolution:

Call GET /tickets/{ticketId} again to generate a new URL.
