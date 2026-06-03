# IAM Permissions

## Overview

IAM roles are automatically created and managed by AWS SAM.

Each Lambda function receives least-privilege permissions.

---

## TicketIngestionFunction

Permissions:

### Amazon SQS

SQSSendMessagePolicy

Purpose:

Publish ticket messages to SQS.

---

### Amazon S3

S3CrudPolicy

Purpose:

Upload attachment files.

---

## TicketProcessorFunction

Permissions:

### DynamoDB

DynamoDBCrudPolicy

Purpose:

Store ticket records.

---

### Amazon SQS

Event Source Mapping

Purpose:

Consume queue messages.

---

## TicketQueryFunction

Permissions:

### DynamoDB

DynamoDBCrudPolicy

Purpose:

Retrieve and update ticket records.

---

### Amazon S3

S3ReadPolicy

Purpose:

Generate presigned download URLs.

---

## SesIngestionFunction

Permissions:

### Amazon SQS

SQSSendMessagePolicy

Purpose:

Publish email tickets.

---

### Amazon S3

S3CrudPolicy

Purpose:

Upload email attachments.

---

## Security Design

Principles used:

* Least Privilege Access
* Service-Specific Roles
* No Hardcoded Credentials
* IAM Managed Policies via SAM

---

## Verification

List IAM Roles:

aws iam list-roles

Describe Lambda Configuration:

aws lambda get-function-configuration --function-name ticket-resolution-assistant-ticket-ingestion

---

## Troubleshooting

### AccessDeniedException

Cause:

Missing IAM permissions.

Resolution:

Verify Lambda policy configuration.

---

### S3 Upload Failure

Cause:

Missing S3CrudPolicy.

Resolution:

Verify template.yaml permissions section.

---

### DynamoDB Write Failure

Cause:

Missing DynamoDBCrudPolicy.

Resolution:

Redeploy SAM template.
