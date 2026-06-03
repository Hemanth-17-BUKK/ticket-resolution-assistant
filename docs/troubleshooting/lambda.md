# Lambda Troubleshooting

## Issue 1 - Function Not Created

### Cause

Incorrect YAML indentation.

### Symptom

CloudFormation deployment succeeds but expected Lambda is missing.

### Resolution

Verify indentation under:

Resources:

Example:

TicketIngestionFunction:
Type: AWS::Serverless::Function

SesIngestionFunction:
Type: AWS::Serverless::Function

---

## Issue 2 - Internal Server Error

### Error

HTTP 500

### Cause

Unhandled exception inside Lambda.

### Resolution

Check CloudWatch Logs:

aws logs tail /aws/lambda/<function-name> --since 10m

---

## Issue 3 - event.body is null

### Cause

Request body missing.

### Symptom

TypeError while accessing requestBody.status

### Resolution

Validate request payload and Content-Type header.

---

## Useful Commands

List Functions

aws lambda list-functions

View Logs

aws logs tail /aws/lambda/<function-name> --since 10m

Function Configuration

aws lambda get-function-configuration --function-name <function-name>
