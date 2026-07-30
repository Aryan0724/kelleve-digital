# TRUEDIAL PLATFORM
# API STANDARDS
# Version 1.0

---

# PURPOSE

This document defines the API standards for the TRUEDIAL Platform.

Every API developed for this platform MUST follow these standards.

There are no exceptions.

Every frontend, mobile application, admin panel, third-party integration, and future product depends on API consistency.

---

# API PHILOSOPHY

APIs are products.

They are not implementation details.

Every API should be:

• Predictable

• Consistent

• Versioned

• Secure

• Fast

• Documented

• Backward Compatible

---

# API STYLE

Use REST APIs.

Resource-based design.

Good

/api/v1/businesses

/api/v1/offers

/api/v1/reviews

/api/v1/subscriptions

Bad

/api/getBusiness

/api/createOffer

/api/deleteReview

---

# VERSIONING

Every endpoint must include a version.

Example

/api/v1/businesses

/api/v1/vendors

/api/v1/auth/login

Future

/api/v2/businesses

Never break existing clients.

If a breaking change is required,

create a new API version.

---

# RESOURCE NAMING

Use plural nouns.

Correct

/businesses

/vendors

/offers

/reviews

/categories

/customers

Incorrect

/business

/getBusinesses

/createVendor

/updateOffer

---

# HTTP METHODS

GET

Retrieve resources.

POST

Create resources.

PUT

Replace resources.

PATCH

Update resources.

DELETE

Delete resources.

Never misuse HTTP methods.

---

# STANDARD RESPONSE FORMAT

Every successful response must follow:

{
    "success": true,
    "message": "Business fetched successfully.",
    "data": {},
    "meta": {},
    "errors": null
}

Never return inconsistent structures.

---

# ERROR RESPONSE FORMAT

{
    "success": false,
    "message": "Validation failed.",
    "data": null,
    "meta": {},
    "errors": {
        "email": [
            "Email is required."
        ]
    }
}

Every error should have the same format.

---

# SUCCESS MESSAGES

Examples

Business created successfully.

Offer updated successfully.

Campaign deleted successfully.

Subscription activated successfully.

Keep messages short and human-readable.

---

# STATUS CODES

200

OK

201

Created

204

No Content

400

Bad Request

401

Unauthorized

403

Forbidden

404

Not Found

409

Conflict

422

Validation Failed

429

Too Many Requests

500

Internal Server Error

Always use proper HTTP status codes.

---

# AUTHENTICATION

Authentication methods:

JWT

Laravel Sanctum

OAuth

OTP

Google Login

Apple Login

Future methods should integrate through the same authentication service.

Never expose authentication logic to clients.

---

# AUTHORIZATION

Every protected endpoint must verify:

User

Role

Permission

Tenant

Ownership

Example

Vendor cannot edit another vendor's listing.

Backend enforces this.

---

# REQUEST VALIDATION

Every POST, PUT, and PATCH request must validate:

Required fields

Data types

Business rules

Relationships

Permissions

Never trust frontend validation.

---

# PAGINATION

Large collections must be paginated.

Example

GET /businesses?page=2&per_page=20

Response

meta

current_page

last_page

per_page

total

next_page

previous_page

Never return thousands of records.

---

# FILTERING

Filtering should use query parameters.

Examples

/businesses?city=Delhi

/businesses?category=Restaurant

/businesses?verified=true

/businesses?subscription=premium

Filters must be composable.

---

# SORTING

Examples

/businesses?sort=name

/businesses?sort=-rating

/businesses?sort=created_at

Use

-

for descending order.

---

# SEARCH

Global search

/search?q=interior

Module search

/businesses?search=architect

Never create separate search implementations for every client.

---

# FIELD SELECTION

Support optional field selection.

Example

/businesses?fields=id,name,rating

Improve performance where appropriate.

---

# RELATIONSHIPS

Allow optional relationship loading.

Example

/businesses?include=reviews

/businesses?include=offers

/businesses?include=owner

Never automatically load heavy relationships.

---

# API IDENTITY

Primary identifiers should use UUIDs for public APIs.

Avoid exposing sequential IDs externally.

Internal numeric IDs may exist in the database but should not be relied upon by clients.

---

# FILE UPLOADS

Uploads always pass through backend.

Supported

Images

Videos

Documents

Certificates

Responses should return

File URL

File ID

Metadata

Never expose storage implementation.

---

# DATE FORMAT

Always use ISO-8601.

Example

2026-07-26T18:30:00Z

Never use locale-specific formats.

---

# TIMEZONE

Store all timestamps in UTC.

Convert to user timezone only when presenting data.

---

# ENUMS

Use enums for controlled values.

Examples

Business Status

ACTIVE

INACTIVE

PENDING

REJECTED

Subscription Status

ACTIVE

EXPIRED

CANCELLED

Never use magic strings.

---

# IDPOTENCY

Sensitive operations must be idempotent.

Examples

Payments

Subscription Activation

Wallet Recharge

Order Creation

Retrying the same request should never create duplicates.

---

# RATE LIMITING

Apply rate limits.

Examples

Login

OTP

Search

Public APIs

File Uploads

Protect against abuse.

---

# API DOCUMENTATION

Every endpoint must include:

Purpose

Authentication

Request

Response

Status Codes

Validation Rules

Example Requests

Example Responses

Swagger/OpenAPI documentation is mandatory.

---

# API LOGGING

Log

Endpoint

Method

Status

Response Time

User

Tenant

IP

Trace ID

Logs should support debugging and monitoring.

---

# CONSISTENT ERROR CODES

Each business error should have a machine-readable code.

Example

BUSINESS_NOT_FOUND

INVALID_SUBSCRIPTION

PAYMENT_FAILED

EMAIL_ALREADY_EXISTS

Messages are for humans.

Codes are for software.

---

# WEBHOOKS

Incoming webhooks

Validate signatures.

Outgoing webhooks

Retry failures.

Log deliveries.

Support idempotency.

---

# DEPRECATION

Never remove APIs immediately.

Mark deprecated.

Document replacements.

Maintain compatibility until clients migrate.

---

# PERFORMANCE

Target response time:

Simple endpoints

<200 ms

Complex endpoints

<500 ms

Heavy reports

Asynchronous

Use caching, indexing, and queues where appropriate.

---

# SECURITY

Always

Validate input

Escape output where necessary

Authorize access

Limit uploads

Sanitize filenames

Use HTTPS

Protect secrets

Never expose internal implementation details.

---

# TESTING

Every API must have:

Validation Tests

Authentication Tests

Authorization Tests

Success Tests

Failure Tests

Edge Case Tests

Performance Tests (for critical endpoints)

---

# DEFINITION OF DONE

An API is complete only when:

✓ Route created

✓ Validation implemented

✓ Authorization enforced

✓ Business logic completed

✓ Tests passing

✓ Documentation written

✓ Swagger updated

✓ Frontend integrated

✓ Mobile integrated

---

# NEVER DO THIS

❌ Different response formats

❌ Different pagination formats

❌ Different authentication flows

❌ Different error structures

❌ Frontend-only business logic

❌ Breaking API changes without versioning

❌ Returning stack traces to clients

❌ Hardcoded tenant behavior

---

# FINAL RULE

Every API should be reusable by any current or future client.

If a new frontend requires creating duplicate endpoints instead of consuming existing APIs, the API architecture has failed.