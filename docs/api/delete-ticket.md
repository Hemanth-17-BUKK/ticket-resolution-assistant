# Delete Ticket API

## Endpoint

DELETE /tickets/{ticketId}

---

## Purpose

Delete a ticket from DynamoDB.

---

## Example

DELETE /tickets/TKT-1780294246101

---

## Response

{
"message": "Ticket deleted successfully"
}

---

## Verification

Run:

aws dynamodb scan --table-name tickets

Verify ticket record no longer exists.
