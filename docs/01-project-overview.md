# Ticket Resolution Assistant

## Project Objective

The Ticket Resolution Assistant is a cloud-native serverless application built on AWS.

The system allows customers to raise support tickets through multiple channels such as:

* Web Portal
* Email

Tickets are processed asynchronously using Amazon SQS and stored in DynamoDB. Attachments are stored in Amazon S3 and can be downloaded securely using presigned URLs.

---

## Business Problem

Customer support teams often receive requests from multiple channels.

Without a centralized ticketing platform:

* Tickets may be lost
* Attachments are difficult to manage
* Processing becomes tightly coupled
* Scaling becomes difficult

This project solves these problems using AWS managed services.

---

## Technology Stack

### Compute

* AWS Lambda

### API Layer

* Amazon API Gateway

### Messaging

* Amazon SQS

### Storage

* Amazon DynamoDB
* Amazon S3

### Email

* Amazon SES

### Security

* AWS IAM

### Infrastructure as Code

* AWS SAM
* AWS CloudFormation

---

## Current Features

### Ticket Management

* Create Ticket
* Get Ticket
* Get All Tickets
* Update Ticket
* Delete Ticket

### Attachments

* Upload Attachments
* Store Attachments in S3
* Generate Presigned Download URLs

### Email Support

* Email Ticket Ingestion Architecture
* Mock Email Processing Endpoint

### Infrastructure

* Fully Serverless
* Event Driven
* Infrastructure as Code

---

## Project Status

### Week 1-2 Deliverables

Completed:

* REST APIs
* CRUD Operations
* DynamoDB Storage
* S3 Attachment Storage
* Attachment Download
* SQS Integration
* IAM Permissions
* SAM Deployment
* Web Ticket Ingestion
* Email Ticket Ingestion (Mock Mode)

Pending:

* Real SES Email Receiving
* Domain Ownership
* DNS Configuration
* SES Receipt Rules

---

## Repository Structure

backend/
infrastructure/
docs/

---

## Deployment Commands

sam validate -t infrastructure/template.yaml

sam build -t infrastructure/template.yaml

sam deploy
