# DynamoDB Troubleshooting

## Issue 1 - Records Not Stored

### Cause

Processor Lambda failed.

### Resolution

Review processor logs.

Verify:

TICKETS_TABLE environment variable.

---

## Issue 2 - Update Operation Fails

### Cause

Missing request payload.

### Symptom

TypeError:

Cannot read properties of null (reading 'status')

### Resolution

Verify PUT request body.

Example:

{
"status": "RESOLVED"
}

---

## Verification Commands

Scan Table

aws dynamodb scan --table-name tickets

Get Item

aws dynamodb get-item --table-name tickets --key "{"ticketId":{"S":"TKT-xxxx"}}"

---

## Best Practices

Use ticketId as partition key.

Store attachment metadata only.

Store files in S3.
