# System Architecture

## High Level Architecture

WEB CHANNEL

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
|
v
DynamoDB

EMAIL CHANNEL

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
|
v
DynamoDB

QUERY CHANNEL

Customer / Support Agent
|
v
API Gateway
|
v
TicketQueryFunction
|
+----> DynamoDB
|
+----> S3 Presigned URLs

---

## Architectural Principles

### Serverless

No EC2 instances are used.

All compute is handled by AWS Lambda.

### Event Driven

Ticket creation is decoupled from ticket processing using SQS.

### Scalable

AWS managed services automatically scale based on workload.

### Fault Tolerant

SQS provides durability and retry capability.

### Secure

IAM roles are used to grant least-privilege access.

---

## Lambda Functions

### TicketIngestionFunction

Purpose:

Accept tickets from API Gateway.

### TicketProcessorFunction

Purpose:

Process queue messages and store tickets.

### TicketQueryFunction

Purpose:

Provide CRUD APIs and attachment downloads.

### SesIngestionFunction

Purpose:

Process email-based ticket requests.

---

## Storage Components

### DynamoDB

Stores ticket records.

### S3

Stores ticket attachments.

---

## Future Enhancements

* Real SES Email Receiving
* AI Categorization
* AI Resolution Suggestions
* Monitoring and Alerting
* CI/CD Pipeline
