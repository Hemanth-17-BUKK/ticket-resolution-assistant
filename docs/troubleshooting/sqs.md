# SQS Troubleshooting

## Issue 1 - Message Not Consumed

### Cause

Event Source Mapping missing.

### Resolution

Verify SAM configuration:

Events:
TicketQueueEvent:
Type: SQS

---

## Issue 2 - Message Stuck in Queue

### Cause

Processor Lambda failure.

### Resolution

Check:

aws logs tail /aws/lambda/ticket-resolution-assistant-ticket-processor --since 10m

---

## Verification Commands

Queue Attributes

aws sqs get-queue-attributes --queue-url <QUEUE_URL> --attribute-names All

Send Test Message

aws sqs send-message --queue-url <QUEUE_URL> --message-body "{"test":"message"}"

---

## Best Practices

Use asynchronous processing.

Keep ingestion and processing services decoupled.

Implement DLQ in future phases.
