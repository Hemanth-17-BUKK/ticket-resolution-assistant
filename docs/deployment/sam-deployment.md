# SAM Deployment Guide

## Overview

The Ticket Resolution Assistant infrastructure is deployed using AWS SAM (Serverless Application Model).

AWS SAM transforms the template into AWS CloudFormation and provisions all required AWS resources.

---

## Infrastructure Template

Location:

infrastructure/template.yaml

---

## Deployment Workflow

### 1. Validate Template

Checks template syntax and SAM resource definitions.

Command:

sam validate -t infrastructure/template.yaml

Expected Output:

Template provided at infrastructure/template.yaml was validated successfully

---

### 2. Build Application

Packages Lambda source code and dependencies.

Command:

sam build -t infrastructure/template.yaml

Output:

.aws-sam/build

---

### 3. Deploy Application

Creates or updates AWS resources.

Command:

sam deploy

---

## Deployment Resources

The deployment creates:

* API Gateway
* Lambda Functions
* SQS Queue
* DynamoDB Table
* S3 Bucket
* IAM Roles
* CloudWatch Log Groups

---

## CloudFormation Outputs

Retrieve outputs:

aws cloudformation describe-stacks --stack-name ticket-resolution-assistant --query "Stacks[0].Outputs"

Example:

ApiGatewayEndpoint

QueueUrl

DynamoDBTable

AttachmentsBucket

---

## Deployment Verification

List Stack Resources:

aws cloudformation describe-stack-resources --stack-name ticket-resolution-assistant

Verify Lambda Functions:

aws lambda list-functions

Verify DynamoDB:

aws dynamodb scan --table-name tickets

Verify S3:

aws s3 ls s3://ticket-resolution-assistant-attachments/

---

## Troubleshooting

### ChangeSet Creation Failed

Cause:

Invalid SAM template.

Resolution:

Run:

sam validate

Review CloudFormation events.

---

### Stack Update Failed

Cause:

Resource conflict or invalid configuration.

Resolution:

Review CloudFormation stack events.

---

### Lambda Not Updated

Cause:

Build artifacts not regenerated.

Resolution:

Run:

sam build

before deployment.
