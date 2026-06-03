# Environment Variables

## Overview

Environment variables are used to inject AWS resource references into Lambda functions.

This avoids hardcoding resource names and URLs.

---

## TicketIngestionFunction

### QUEUE_URL

Purpose:

Target SQS queue.

Example:

https://sqs.us-east-1.amazonaws.com/<account-id>/ticket-queue

---

### ATTACHMENTS_BUCKET

Purpose:

Target S3 bucket.

Example:

ticket-resolution-assistant-attachments

---

## TicketProcessorFunction

### TICKETS_TABLE

Purpose:

Target DynamoDB table.

Example:

tickets

---

## TicketQueryFunction

### TICKETS_TABLE

Purpose:

Target DynamoDB table.

---

### ATTACHMENTS_BUCKET

Purpose:

Generate presigned URLs.

---

## SesIngestionFunction

### QUEUE_URL

Purpose:

Publish email tickets to SQS.

---

### ATTACHMENTS_BUCKET

Purpose:

Store email attachments.

---

## SAM Configuration Example

Environment:
Variables:
QUEUE_URL: !Ref TicketQueue

---

## Verification

View Lambda Environment Variables:

aws lambda get-function-configuration --function-name ticket-resolution-assistant-ticket-ingestion

---

## Best Practices

* Never hardcode resource URLs
* Use CloudFormation references
* Use environment variables for configuration
* Keep secrets out of source code

---

## Troubleshooting

### Undefined Environment Variable

Cause:

Variable not configured in SAM template.

Resolution:

Update template.yaml and redeploy.

---

### Incorrect Resource Reference

Cause:

Wrong CloudFormation reference.

Resolution:

Verify !Ref and !GetAtt usage.
