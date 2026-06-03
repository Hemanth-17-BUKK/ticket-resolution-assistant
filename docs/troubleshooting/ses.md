# SES Troubleshooting

## Issue 1 - Mock Endpoint Returns 502

### Cause

Lambda expected:

event.Records[0].ses

but received:

event.body

from API Gateway.

### Resolution

Implement dual-mode processing.

if (event.Records)
{
// SES Event
}
else
{
// API Gateway Event
}

---

## Issue 2 - Unable To Receive Real Emails

### Cause

Verified Gmail identity does not support SES inbound email processing.

### Explanation

SES inbound email requires:

* Domain ownership
* DNS configuration
* MX records
* SES receipt rules

Gmail addresses cannot be configured for inbound SES.

---

## Current Solution

Implemented:

POST /email

for development and testing.

Architecture remains identical to future production implementation.

---

## Future Production Setup

Customer Email
|
v
SES Receipt Rule
|
v
SesIngestionFunction
|
v
SQS
|
v
TicketProcessorFunction

---

## Best Practices

Develop and validate architecture using mock events.

Switch event source to SES when domain ownership becomes available.
