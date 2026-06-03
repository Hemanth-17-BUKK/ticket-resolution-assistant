# API Gateway Troubleshooting

## Issue 1 - Missing Authentication Token

### Error

{
"message": "Missing Authentication Token"
}

### Cause

Incorrect API endpoint.

Incorrect HTTP method.

Incorrect resource path.

### Example

Calling:

GET /ticket

Instead of:

GET /tickets

### Resolution

Verify:

* API Gateway endpoint
* Resource path
* HTTP method

Command:

aws cloudformation describe-stacks --stack-name ticket-resolution-assistant --query "Stacks[0].Outputs"

---

## Issue 2 - 502 Bad Gateway

### Cause

Lambda execution failure.

### Resolution

Check Lambda logs:

aws logs tail /aws/lambda/<function-name> --since 10m

Investigate stack traces and runtime exceptions.
