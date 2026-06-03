# Ticket Resolution Assistant

A cloud-native serverless ticket management platform built on AWS.

The system enables customers to raise support tickets through web and email channels, upload attachments, track ticket status, and securely download files using presigned URLs.

---

# Project Objectives

Build a production-style support ticket platform using AWS serverless services.

Key goals:

- Multi-channel ticket ingestion
- Attachment management
- Asynchronous processing
- Serverless architecture
- Infrastructure as Code
- Scalable event-driven design

---

# Technology Stack

## Compute

- AWS Lambda

## API Layer

- Amazon API Gateway

## Messaging

- Amazon SQS

## Storage

- Amazon DynamoDB
- Amazon S3

## Email

- Amazon SES

## Security

- AWS IAM

## Infrastructure as Code

- AWS SAM
- AWS CloudFormation

---

# High Level Architecture

## Web Ticket Flow

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

---

## Email Ticket Flow

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

---

## Query Flow

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
+----> Generate Presigned URLs
|
v
Response

---

# Features

## Ticket Management

- Create Ticket
- Get Ticket
- Get All Tickets
- Update Ticket Status
- Delete Ticket

## Attachments

- Upload Attachments
- Store Files in S3
- Generate Presigned Download URLs

## Email Support

- Email Ticket Ingestion
- Mock SES Endpoint
- Future SES Production Integration

## Infrastructure

- Infrastructure as Code
- AWS SAM Deployment
- Event Driven Architecture

---

# Project Structure

```text
backend/
│
├── ingestion-service/
├── processor-service/
├── query-service/
└── ses-ingestion-service/

infrastructure/
│
└── template.yaml

docs/
│
├── 01-project-overview.md
├── 02-architecture.md
├── 03-infrastructure.md
│
├── services/
├── api/
├── storage/
├── deployment/
└── troubleshooting/
```

---

# API Endpoints

## Ticket APIs

### Create Ticket

```http
POST /tickets
```

### Get All Tickets

```http
GET /tickets
```

### Get Ticket

```http
GET /tickets/{ticketId}
```

### Update Ticket

```http
PUT /tickets/{ticketId}
```

### Delete Ticket

```http
DELETE /tickets/{ticketId}
```

---

## Email API

```http
POST /email
```

Used to simulate SES email ingestion during development.

---

# Deployment

Validate

```bash
sam validate -t infrastructure/template.yaml
```

Build

```bash
sam build -t infrastructure/template.yaml
```

Deploy

```bash
sam deploy
```

---

# AWS Resources Created

- API Gateway
- Lambda Functions
- DynamoDB Table
- SQS Queue
- S3 Bucket
- IAM Roles
- CloudWatch Logs

---

# Documentation

## Project Documentation

- docs/01-project-overview.md
- docs/02-architecture.md
- docs/03-infrastructure.md

## Services

- docs/services/ingestion-service.md
- docs/services/processor-service.md
- docs/services/query-service.md
- docs/services/ses-ingestion-service.md

## APIs

- docs/api/create-ticket.md
- docs/api/get-ticket.md
- docs/api/update-ticket.md
- docs/api/delete-ticket.md
- docs/api/email-ingestion.md

## Storage

- docs/storage/dynamodb.md
- docs/storage/s3-attachments.md

## Deployment

- docs/deployment/sam-deployment.md
- docs/deployment/iam-permissions.md
- docs/deployment/environment-variables.md

## Troubleshooting

- docs/troubleshooting/api-gateway.md
- docs/troubleshooting/lambda.md
- docs/troubleshooting/sqs.md
- docs/troubleshooting/dynamodb.md
- docs/troubleshooting/s3.md
- docs/troubleshooting/ses.md

---

# Current Status

## Completed

### Week 1–2

- REST APIs
- CRUD Operations
- DynamoDB Storage
- S3 Attachment Storage
- Attachment Downloads
- SQS Integration
- IAM Configuration
- SAM Deployment
- Web Ticket Ingestion
- Mock Email Ticket Ingestion

---

## Pending

### SES Production Integration

Requires:

- Domain Ownership
- DNS Configuration
- SES Receipt Rules
- MX Records

---

# Future Roadmap

## Phase 2

- Ticket Categorization
- Priority Assignment
- Agent Assignment

## Phase 3

- Amazon Bedrock Integration
- AI Ticket Classification
- AI Resolution Suggestions

## Phase 4

- Monitoring and Alerting
- CloudWatch Dashboards
- SNS Notifications

## Phase 5

- CI/CD Pipeline
- GitHub Actions
- Automated Deployments

---

# Author

Hemanth Bukkuru

Cloud-Native Ticket Resolution Platform built using AWS Serverless Technologies.
