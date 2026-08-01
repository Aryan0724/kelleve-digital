# LEGAL, COMPLIANCE & PLATFORM GOVERNANCE SYSTEM

> **Document Version:** 1.0
> **Priority:** Critical
> **Status:** Final Specification
> **Purpose:** This document defines the legal architecture, compliance policies, user agreements, fraud prevention, payment protection, dispute handling, content moderation, and platform governance of Find My Interior. The objective is to protect users, professionals, businesses, and the platform itself while ensuring legal compliance.

---

# 1. Objective

Find My Interior is a marketplace.

The platform connects buyers and service providers.

The platform is NOT the contractor.

The platform is NOT the architect.

The platform is NOT the supplier.

The platform only facilitates discovery, communication and transactions.

This distinction must exist throughout the platform.

---

# 2. Mandatory Legal Pages

Create database-driven CMS pages for

Privacy Policy

Terms & Conditions

Refund Policy

Cancellation Policy

Cookie Policy

Community Guidelines

Professional Code of Conduct

Vendor Agreement

Customer Agreement

Marketplace Disclaimer

Intellectual Property Policy

Content Policy

Business Verification Policy

Payment Policy

Dispute Resolution Policy

Grievance Redressal Policy

Contact Us

About Us

---

# 3. Footer

Every page must contain

About

Privacy Policy

Terms

Refund Policy

Contact

Support

Become Professional

Become Supplier

Blogs

Careers

Copyright

Social Links

---

# 4. Registration Agreement

Every new user must accept

Terms & Conditions

Privacy Policy

Community Guidelines

before account creation.

Checkbox cannot be pre-selected.

Timestamp should be stored.

IP Address stored.

Agreement Version stored.

---

# 5. Professional Agreement

Professionals must additionally agree to

Vendor Agreement

Commission Policy

Payment Policy

Verification Policy

Cancellation Rules

Review Policy

Dispute Policy

---

# 6. Verification Consent

During document upload

User agrees

Documents are authentic.

Platform may verify them.

False information may lead to suspension.

Documents may be reviewed manually.

---

# 7. Fraud Prevention

Detect

Fake Profiles

Duplicate Accounts

Spam Listings

Fake Reviews

Repeated Scam Reports

Mass Messaging

Abusive Behaviour

Stolen Images

Copied Portfolio

Multiple Wallet Abuse

Referral Abuse

Subscription Abuse

Fake Businesses

---

# 8. Account Restrictions

Admin can

Warn

Suspend

Freeze

Blacklist

Delete

Restore

Ban Device

Ban IP

Require Reverification

---

# 9. Review Protection

Reviews cannot be

Purchased

Edited after moderation period

Submitted without completed work

Duplicated

Spam

AI Generated

Anonymous

Every review must belong to

Completed Requirement

Completed RFQ

Completed Job

---

# 10. Payment Protection

Platform should maintain

Transaction History

Payment Status

Refund Status

Invoice

Payment Logs

Wallet Logs

Subscription Logs

Commission Logs

---

# 11. Payment Disputes

When dispute occurs

Payment freezes

Admin notified

Evidence collected

Chat preserved

Timeline preserved

Images preserved

Documents preserved

Decision recorded

Refund decision logged

---

# 12. Project Disputes

Dispute reasons

Poor Quality

No Response

Delayed Completion

Payment Issue

Fraud

Abandoned Project

Wrong Deliverables

Misconduct

---

Admin may

Warn

Suspend

Refund

Mediate

Close Project

Ban User

---

# 13. Escrow (Future Ready)

Platform architecture should support

Escrow Payment

Milestone Payments

Partial Release

Final Release

Dispute Hold

Future implementation only.

---

# 14. Cancellation Policy

Customer Cancellation

Professional Cancellation

Supplier Cancellation

Worker Cancellation

Late Cancellation

Refund Eligibility

Penalty Rules

Cancellation history stored permanently.

---

# 15. Refund Policy

Refund reasons

Duplicate Payment

Failed Payment

Cancelled Subscription

Platform Error

Fraud

Manual Admin Approval

Refund history must be auditable.

---

# 16. User Generated Content

Users may upload

Images

Portfolio

Videos

Descriptions

Reviews

Comments

Documents

Platform reserves right to

Hide

Remove

Moderate

Delete

Suspend

---

# 17. Intellectual Property

Uploaded work belongs to uploader.

Platform receives display rights.

Users cannot upload copyrighted content.

Repeated violations result in suspension.

---

# 18. Messaging Policy

Platform stores

Messages

Attachments

Read Status

Delivery Status

Reports

Deleted Messages

Admin moderation logs

Users cannot

Send Spam

Harass

Share Illegal Content

Repeated violations trigger suspension.

---

# 19. Business Verification Policy

Verification is manual.

Verification badge does NOT guarantee work quality.

Verification only confirms

Business identity

Documents

Ownership

GST

Business existence

Platform never guarantees service quality.

---

# 20. Trust & Reputation

Trust Score should NEVER be manually editable.

Trust Score only changes through

Verification

Completed Projects

Reviews

Disputes

Response Rate

Profile Completion

Account Age

Platform Activity

---

# 21. Data Protection

Store

Encrypted Passwords

Encrypted Tokens

Encrypted Documents

Sanitized Inputs

Validated Uploads

Audit Logs

Soft Deletes

Backups

Never expose

Passwords

Documents

Personal IDs

Payment Information

API Keys

---

# 22. Security Requirements

Implement

CSRF Protection

XSS Protection

SQL Injection Protection

Rate Limiting

File Validation

Role Based Authorization

Secure File Storage

Input Sanitization

Activity Logging

Session Expiration

---

# 23. Compliance

Platform should remain compatible with

Indian IT Act

DPDP Act (India)

GST Compliance

Consumer Protection Act

Intermediary Guidelines

Future GDPR Compatibility

---

# 24. Admin Governance

Every admin action must be logged.

Store

Admin

Action

Target

Old Value

New Value

Timestamp

IP

Device

Reason

---

# 25. Existing Issues That MUST Be Fixed

Missing legal pages.

Footer links not connected.

Registration does not record agreement acceptance.

Document upload lacks consent.

Reviews insufficiently protected.

No structured dispute flow.

Refund architecture incomplete.

Fraud reporting incomplete.

Terms acceptance not versioned.

No audit trail for sensitive admin actions.

---

# 26. Verification Checklist

Verify

✓ Privacy Policy accessible.

✓ Terms accessible.

✓ Footer links functional.

✓ Registration requires acceptance.

✓ Professional agreement accepted.

✓ Verification consent stored.

✓ Fraud reporting works.

✓ Dispute workflow functions.

✓ Refund workflow functions.

✓ Review moderation functions.

✓ Admin audit logs generated.

✓ Security protections enabled.

✓ User content moderation works.

✓ Account suspension works.

✓ All legal pages editable through CMS.

---

# 27. Non-Negotiable Rules

- Every legal page must be editable from the Admin CMS.
- Every agreement acceptance must be stored with timestamp and version.
- Every payment must be auditable.
- Every dispute must leave a permanent audit trail.
- No sensitive action should occur without logging.
- Every uploaded document must remain secure.
- Every moderation action must be reversible by Super Admin.
- The platform must protect customers, professionals, businesses and itself from fraud, abuse and legal disputes.