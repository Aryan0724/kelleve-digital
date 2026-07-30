# TRUEDIAL PLATFORM
# AUTHENTICATION & AUTHORIZATION SYSTEM
# Version 1.0

---

# PURPOSE

This document defines the complete Authentication and Authorization architecture of the TRUEDIAL Platform.

Authentication is one of the most critical systems.

Every application, module, API, and service depends on it.

There must NEVER be multiple authentication systems.

There is ONE identity system.

Many applications.

---

# CORE PHILOSOPHY

One User.

One Identity.

Many Roles.

Many Businesses.

Many Tenants.

One Authentication System.

Never create separate login systems for:

❌ Vendor

❌ Customer

❌ Admin

❌ Consultant

❌ Student

❌ Franchise

Everyone authenticates through the same Identity Service.

Authorization determines what they can do.

---

# AUTHENTICATION FLOW

User

↓

Login Request

↓

Authentication Service

↓

Identity Verification

↓

Role Resolution

↓

Permission Resolution

↓

Tenant Resolution

↓

JWT / Sanctum Token

↓

API Access

---

# SUPPORTED LOGIN METHODS

Primary

✓ Mobile Number + OTP

Secondary

✓ Email + Password

OAuth

✓ Google

Future

✓ Apple

✓ Microsoft

✓ LinkedIn

✓ Facebook

Never create isolated authentication methods.

Everything must flow through AuthService.

---

# USER ENTITY

There is ONLY ONE users table.

A user may be

Customer

Vendor

Admin

Student

Consultant

Franchise Owner

Faculty

City Manager

State Manager

Super Admin

Never create

customers table

vendors table

admins table

---

# USER PROFILE

Every user should contain

UUID

Full Name

Email

Phone

Avatar

Gender

Date of Birth

Language

Timezone

Country

Status

Verification Status

Created At

Updated At

Deleted At

Authentication data should remain separate from profile preferences where appropriate.

---

# LOGIN FLOW

User enters

Phone

↓

OTP Requested

↓

OTP Verified

↓

User Exists?

↓

YES

↓

Login

↓

NO

↓

Registration

↓

Login

Simple.

Fast.

Secure.

---

# REGISTRATION FLOW

Register

↓

Verify OTP

↓

Create User

↓

Assign Default Role

↓

Create Profile

↓

Issue Token

↓

Welcome Notification

↓

Done

Never create incomplete accounts.

---

# PASSWORD LOGIN

Email

↓

Password

↓

Verify

↓

Issue Token

↓

Login

Passwords must always be hashed.

Never store plaintext passwords.

---

# OTP SYSTEM

OTP should support

Login

Registration

Password Reset

Phone Verification

Sensitive Actions

OTP expires automatically.

Maximum validity

5 minutes

---

# TOKEN SYSTEM

Authentication tokens should include

User ID

Tenant ID

Roles

Permissions (optional cache)

Issued At

Expiry

Device

Session ID

Never expose sensitive information.

---

# SESSION MANAGEMENT

Every login creates a session.

Track

Device

Browser

Platform

IP

Location (optional)

Last Activity

Users can terminate sessions remotely.

---

# DEVICE MANAGEMENT

Allow users to

View Devices

Remove Devices

Logout Other Devices

Rename Devices

Notify on New Login

---

# MULTI-TENANT AUTHENTICATION

Authentication is global.

Permissions are tenant-specific.

Example

John

↓

Login

↓

Tenant A

↓

Vendor

Switch

↓

Tenant B

↓

Customer

One login.

Different permissions.

---

# ROLE SYSTEM

Every user can have multiple roles.

Examples

Vendor

+

Customer

Student

+

Customer

Consultant

+

Vendor

Roles should never require duplicate accounts.

---

# PERMISSION SYSTEM

Permissions belong to roles.

Examples

Business

business.create

business.edit

business.delete

Offer

offer.create

offer.publish

offer.delete

Campaign

campaign.create

campaign.launch

campaign.stop

Permissions should be granular.

---

# ROLE HIERARCHY

Highest

Super Admin

↓

Platform Admin

↓

State Manager

↓

City Manager

↓

Vendor

↓

Consultant

↓

Faculty

↓

Student

↓

Customer

Never hardcode permissions.

---

# AUTHORIZATION

Authentication answers

Who are you?

Authorization answers

What are you allowed to do?

Never confuse the two.

---

# ACCESS CONTROL

Every request validates

Authentication

↓

Tenant

↓

Role

↓

Permission

↓

Ownership

↓

Business Rules

Only then execute.

---

# OWNERSHIP

Even if permission exists,

ownership should still be checked.

Example

Vendor

↓

Owns Business A

Cannot edit

↓

Business B

---

# EMAIL VERIFICATION

Support

Email Verification

Phone Verification

Business Verification

Identity Verification

Each verification is independent.

---

# BUSINESS VERIFICATION

Vendor

↓

Uploads Documents

↓

Admin Review

↓

Approved

↓

Verified Badge

Verification should never be automatic.

---

# PASSWORD RESET

Forgot Password

↓

Verify Identity

↓

OTP

↓

Reset Password

↓

Invalidate Previous Sessions

↓

Done

---

# SOCIAL LOGIN

Google

↓

OAuth

↓

Verify

↓

Create User if Needed

↓

Issue Token

↓

Done

Future providers use the same flow.

---

# BIOMETRIC LOGIN

Supported

Fingerprint

Face ID

Device Authentication

Only unlocks existing sessions.

Backend remains the source of truth.

---

# SECURITY RULES

Passwords

Argon2id or Bcrypt

Tokens

Secure

Short-lived

HTTPS

Mandatory

OTP

Rate Limited

Sessions

Revocable

Never weaken security for convenience.

---

# RATE LIMITS

Login

5 attempts / 15 minutes

OTP

3 requests / 10 minutes

Password Reset

3 requests / hour

Registration

Configurable

Prevent abuse.

---

# ACCOUNT STATUS

ACTIVE

PENDING

SUSPENDED

BLOCKED

DELETED

Inactive accounts cannot authenticate.

---

# AUDIT LOGGING

Log

Login

Logout

Password Change

OTP Request

OTP Verification

Role Change

Permission Change

Failed Login

New Device

Session Removal

Security events should always be traceable.

---

# API ENDPOINTS

Examples

POST /auth/login

POST /auth/register

POST /auth/logout

POST /auth/refresh

POST /auth/request-otp

POST /auth/verify-otp

POST /auth/forgot-password

POST /auth/reset-password

GET /auth/me

GET /auth/sessions

DELETE /auth/sessions/{id}

One authentication API for the entire platform.

---

# MIDDLEWARE

Protected routes should pass through

Authentication

↓

Tenant Resolution

↓

Role Check

↓

Permission Check

↓

Ownership Check

↓

Business Rules

Never bypass middleware.

---

# AI IMPLEMENTATION RULES

Before modifying authentication

Read this document.

Never duplicate login systems.

Never bypass permission checks.

Never hardcode roles.

Never hardcode admin access.

Reuse existing AuthService.

Reuse existing middleware.

Update documentation.

Run security tests.

---

# DEFINITION OF DONE

Authentication is complete when

✓ Login Works

✓ Registration Works

✓ OTP Works

✓ Password Reset Works

✓ Social Login Works

✓ Session Management Works

✓ Authorization Enforced

✓ Audit Logs Enabled

✓ Tests Passing

✓ Documentation Updated

---

# NEVER DO THIS

❌ Multiple Login Systems

❌ Multiple User Tables

❌ Hardcoded Roles

❌ Frontend Permission Checks

❌ Plain Text Passwords

❌ Unlimited OTP Requests

❌ Long-Lived Tokens

❌ Authentication Without Audit Logs

❌ Skipping Middleware

---

# FINAL RULE

Identity is shared across the entire platform.

Roles define responsibilities.

Permissions define capabilities.

The backend enforces every security decision.

Every application trusts the same authentication system.