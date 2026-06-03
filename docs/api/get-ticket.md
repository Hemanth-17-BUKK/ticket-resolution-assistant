# Get Ticket API

## Get All Tickets

### Endpoint

GET /tickets

### Response

[
{
"ticketId": "TKT-1780294246101",
"subject": "Refund Request",
"status": "OPEN"
}
]

---

## Get Single Ticket

### Endpoint

GET /tickets/{ticketId}

### Example

GET /tickets/TKT-1780294246101

---

## Response

{
"ticketId": "TKT-1780294246101",
"subject": "Attachment Test",
"attachments": [
{
"fileName": "sample.txt",
"s3Key": "attachments/xxxx-sample.txt",
"downloadUrl": "https://..."
}
]
}

---

## Attachment Download

The downloadUrl field contains a presigned S3 URL valid for one hour.

The URL can be opened directly in a browser.
