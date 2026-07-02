# PROFILE VERIFICATION & TRUST SYSTEM SPECIFICATION

> **Document Version:** 1.0
> **Priority:** Critical
> **Status:** Final Specification
> **Purpose:** This document defines the complete verification architecture of Find My Interior. Verification is completely manual during the MVP. It is one of the biggest trust systems of the platform and directly affects search ranking, recommendations, profile visibility, trust score, profile completion, and customer confidence.

---

# 1. Objective

The objective of verification is NOT simply giving users a blue tick.

The objective is to answer one question:

> **"Can I trust this person with my home or my business?"**

Verification should create confidence before the first conversation happens.

A verified professional should naturally receive more visibility than an unverified one.

---

# 2. Verification Philosophy

Verification is **completely manual**.

No OCR.

No AI verification.

No automatic approvals.

Every uploaded document is manually reviewed by an administrator.

Only the admin can approve, reject, revoke or upgrade a verification.

---

# 3. Verification Levels

Every account belongs to one verification level.

---

## Level 0

Basic Member

Requirements

- Registered Account

Badge

Gray

---

## Level 1

Identity Verified

Requirements

Identity documents approved.

Badge

Blue

---

## Level 2

Verified Business

Requirements

Business documents approved.

Badge

Green

---

## Level 3

Trusted Professional

Requirements

Verified Business

+

Good Reviews

+

Completed Projects

+

Healthy Trust Score

Badge

Gold

---

## Level 4

Elite Professional

Admin Only.

Never automatic.

Admin manually promotes.

Badge

Platinum

---

# 4. Verification Workflow

```
User Registers

↓

Uploads Documents

↓

Status = Pending

↓

Admin Review

↓

Approve

OR

Reject

↓

User Notification

↓

Verification Badge Updated

↓

Trust Score Updated

↓

Search Ranking Updated
```

---

# 5. Verification Status

Each document has its own status.

Pending

Approved

Rejected

Expired

Needs Re-upload

---

# 6. Required Documents

Verification differs by role.

---

# Homeowner

No business verification.

Required

- Mobile OTP
- Email Verification

Optional

- Aadhaar

---

# Interior Designer

Required

- Aadhaar
- PAN
- GST
- Business Registration
- Office Image
- Business Logo

Optional

- Portfolio PDF
- Design Certificate

---

# Interior Company

Required

- GST
- PAN
- CIN (if applicable)
- Business Registration
- Office Images
- Logo

---

# Contractor

Required

- Aadhaar
- GST
- PAN
- Business Registration
- Office Images

Optional

- Contractor License

---

# Builder

Required

- GST
- Registration
- PAN
- Office Images

Optional

- Builder License

---

# Material Supplier

Required

- GST
- PAN
- Shop Images
- Warehouse Images
- Business Logo

Optional

- Product Catalogue

---

# Skilled Worker

Workers should have the simplest verification.

Required

- Aadhaar
- Self Photograph
- Skill Photograph

Optional

- Experience Certificate
- Skill Certificate

Workers should NEVER be asked for GST.

---

# 7. Document Types

The platform supports

- Aadhaar
- PAN
- GST
- Business Registration
- Trade License
- Office Images
- Warehouse Images
- Business Logo
- Owner Photo
- Selfie
- Portfolio
- Skill Certificate
- Experience Certificate

---

# 8. Upload Rules

Every uploaded file stores

User

Document Type

Original Name

Storage Path

Mime Type

Status

Uploaded At

Reviewed By

Reviewed At

Rejection Reason

---

# 9. File Validation

Allowed

PNG

JPEG

JPG

PDF

Maximum

10 MB

Reject

Corrupted Files

Password Protected PDFs

Executable Files

Duplicate Files

---

# 10. Admin Verification Queue

Admin Dashboard should display

Pending Verification

↓

Grouped by Role

↓

Newest First

↓

Open Documents

↓

Approve

Reject

Request Re-upload

Suspend

---

# 11. Approval Process

Admin opens submission.

Views

Documents

Profile

Business Information

Existing Reviews

Portfolio

Past Rejections

Previous Uploads

Then chooses

Approve

Reject

Needs Re-upload

---

# 12. Reject Flow

Rejected users receive

Reason

Example

Image blurry.

GST expired.

Wrong PAN.

Business registration unreadable.

User uploads again.

Status returns

Pending.

---

# 13. Re-upload Rules

Old document

Never deleted.

Marked

Rejected.

New document

Creates new record.

Admin always has history.

---

# 14. Verification History

Every verification action stores

Admin

Time

Reason

Old Status

New Status

IP

Device

---

# 15. Verification Badge Rules

Badges cannot be edited manually.

They come only from verification status.

Removing verification removes badge immediately.

---

# 16. Trust Score Impact

Identity Verification

+10

Business Verification

+20

Trusted Professional

+30

Elite Professional

+40

Rejected Verification

Negative impact

Fake Documents

Heavy penalty

---

# 17. Profile Completion Impact

Verification contributes to Profile Completion.

Without verification

Profile Completion should never reach 100%.

---

# 18. Search Ranking Impact

Verified users rank above

Unverified users.

Ranking

Elite

↓

Trusted

↓

Verified Business

↓

Identity Verified

↓

Basic Member

---

# 19. Homepage Impact

Homepage sections

Top Professionals

Featured Professionals

Recommended Professionals

must prioritize

Verified professionals.

---

# 20. Recommendation Engine

Recommendations consider

Verification Level

Trust Score

Location

Category

Completed Projects

Reviews

Never recommend fake or incomplete profiles over verified ones.

---

# 21. Vendor Profile

Customer should immediately see

Verification Badge

Business Verified

Identity Verified

Trust Score

Profile Completion

Verified Documents

Years Experience

Projects Completed

---

# 22. Admin Controls

Admin can

Approve

Reject

Suspend

Revoke Verification

Upgrade Badge

Downgrade Badge

Request Re-upload

View History

Download Documents

---

# 23. Expiry

Some documents expire.

Example

GST

Trade License

Business Registration

System should notify

30 days before expiry.

Expired documents

reduce Trust Score.

---

# 24. Fraud Detection

Admin can mark

Fake Document

Fake Identity

Duplicate Business

Stolen Images

Fake Portfolio

Consequences

Verification Removed

Trust Score Reduced

Account Suspended

Permanent Ban

---

# 25. Verification Notifications

User receives

Verification Submitted

Verification Approved

Verification Rejected

Document Expiring

Verification Revoked

---

Admin receives

New Submission

Re-upload

Expired Documents

Fraud Reports

---

# 26. Database Requirements

Every verification stores

User

Role

Document

Status

Approval History

Admin

Review Time

Expiry Date

Storage Path

Rejection Reason

Version

---

# 27. Existing Project Problems That MUST Be Fixed

The following issues currently exist and **must be resolved during implementation**.

✅ Profile completion resets after refresh.

✅ Uploaded documents disappear.

✅ Verification status does not persist.

✅ Trust score is partially hardcoded.

✅ Profile completion is hardcoded.

✅ Search ignores verification.

✅ Homepage ignores verification.

✅ Recommended professionals ignore verification.

✅ Verification badges are not fully database-driven.

Everything must persist in the database and survive refreshes, deployments, cache clears, and new sessions.

---

# 28. Verification Checklist

Before a professional is considered fully verified, ensure

✓ Required documents uploaded

✓ Documents approved

✓ Business information complete

✓ Profile photo uploaded

✓ Contact details verified

✓ Portfolio available (where applicable)

✓ Profile stored successfully

✓ Trust score updated

✓ Search ranking updated

✓ Homepage ranking updated

✓ Dashboard reflects verification

---

# 29. Non-Negotiable Rules

- Verification is always manual.
- No AI approval.
- No OCR approval.
- Workers have different requirements than businesses.
- Every verification action is logged.
- Every rejection stores a reason.
- Every verification affects Trust Score.
- Every verification affects Search Ranking.
- Every verification affects Homepage recommendations.
- Verification status must never reset after refresh.
- Verification must always come from the database.
- Admin is the only authority for granting or revoking verification.