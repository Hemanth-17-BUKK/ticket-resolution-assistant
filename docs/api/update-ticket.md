# Update Ticket API

## Endpoint

PUT /tickets/{ticketId}

---

## Purpose

Update ticket status.

---

## Example

PUT /tickets/TKT-1780294246101

---

## Request Body

{
"status": "RESOLVED"
}

---

## Supported Status Values

OPEN

IN_PROGRESS

RESOLVED

CLOSED

---

## Response

{
"message": "Ticket updated successfully"
}

---

## Troubleshooting

### 500 Internal Server Error

Cause:

Request body missing.

Resolution:

Verify Content-Type header and JSON payload.
