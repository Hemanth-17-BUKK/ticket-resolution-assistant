# Infrastructure Documentation

## Infrastructure as Code

The project infrastructure is managed using AWS SAM.

Template Location:

infrastructure/template.yaml

---

## AWS Resources

### API Gateway

Purpose:

Expose REST APIs.

Endpoints:

POST /tickets

GET /tickets

GET /tickets/{ticketId}

PUT /tickets/{ticketId}

DELETE /tickets/{ticketId}

POST /email

---

### Lambda Functions

ticket-ingestion

ticket-processor

ticket-query

ses-ingestion

---

### SQS Queue

Queue Name:

ticket-queue

Purpose:

Decouple ticket submission from ticket processing.

---

### DynamoDB

Table Name:

tickets

Partition Key:

ticketId

---

### S3

Bucket:

ticket-resolution-assistant-attachments

Purpose:

Store uploaded files.

---

## Deployment Workflow

Validate Template

sam validate -t infrastructure/template.yaml

Build Application

sam build -t infrastructure/template.yaml

Deploy Stack

sam deploy

---

## Useful AWS CLI Commands

List Lambda Functions

aws lambda list-functions

List S3 Objects

aws s3 ls s3://ticket-resolution-assistant-attachments/ --recursive

Scan DynamoDB Table

aws dynamodb scan --table-name tickets

View Stack Outputs

aws cloudformation describe-stacks --stack-name ticket-resolution-assistant --query "Stacks[0].Outputs"

View Stack Resources

aws cloudformation describe-stack-resources --stack-name ticket-resolution-assistant

View Lambda Logs

aws logs tail /aws/lambda/ticket-resolution-assistant-ticket-processor --since 10m

---

## Environment Variables

QUEUE_URL

ATTACHMENTS_BUCKET

TICKETS_TABLE
