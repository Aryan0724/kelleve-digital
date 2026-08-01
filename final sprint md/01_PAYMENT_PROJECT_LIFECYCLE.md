# PAYMENT & PROJECT LIFECYCLE SPECIFICATION

> **Document Version:** 1.0
> **Priority:** Critical
> **Status:** Final Specification
> **Purpose:** This document defines the complete lifecycle of a project after it is posted, how professionals are selected, how payments are handled, how disputes are resolved, and how both parties are protected. This specification is the single source of truth for all project execution workflows.

---

# 1. Objective

Find My Interior is **not** responsible for executing projects. It is a marketplace that connects customers with professionals while providing trust, transparency, communication, and optional payment protection.

The platform must ensure:

- Customers can confidently hire professionals.
- Professionals receive fair payment.
- Both parties are protected against fraud.
- Every project has a clearly defined lifecycle.
- Every action is recorded.
- Admins can intervene whenever necessary.

---

# 2. Project Lifecycle

Every project follows the same lifecycle.

```
Draft
↓

Published
↓

Receiving Bids
↓

Bid Comparison
↓

Shortlisting
↓

Awarded
↓

Project Accepted
↓

In Progress
↓

Milestone Updates
↓

Completion Requested
↓

Client Review
↓

Completed
↓

Review Window
↓

Archived
```

No project can skip a stage.

Every transition must be recorded in Activity Logs.

---

# 3. Stage Definitions

## Draft

Project is being created.

Visible only to owner.

Customer can

- Edit
- Delete
- Save draft

---

## Published

Project becomes visible.

Matching professionals receive notifications.

Project appears in:

- Search
- Homepage recommendations
- Dashboard recommendations

Status:

```
Published
```

---

## Receiving Bids

Professionals can

- Unlock contact
- View details
- Submit bid
- Save project
- Share internally

Customer can

- Watch incoming bids
- Compare
- Message
- Close project

---

## Shortlisting

Customer can shortlist any number of professionals.

Shortlisted professionals receive notification.

Shortlisted professionals receive higher priority messaging.

---

## Awarded

Customer selects exactly ONE professional.

System automatically

- Closes bidding
- Locks further bids
- Sends Award Notification
- Opens Project Workspace

Status:

```
Awarded
```

---

## Project Accepted

Professional must accept.

If not accepted within configurable time

Example

48 Hours

Project automatically returns to

Receiving Bids.

---

## In Progress

Professional clicks

```
Start Project
```

Project officially starts.

System records

- Start Date
- Expected Completion
- Timeline

---

## Milestone Updates

Professional can post updates.

Examples

- Site Visit Completed
- Material Purchased
- Civil Work Started
- Furniture Installed
- Painting Completed

Each update supports

- Text
- Images
- Videos
- Documents

Customer receives notification.

---

## Completion Requested

Professional clicks

```
Request Completion
```

Uploads

- Final Images
- Invoice
- Completion Note

Customer reviews.

---

## Client Review

Customer has three options.

### Option 1

Approve

Project becomes Completed.

---

### Option 2

Request Changes

Project returns to

In Progress.

Professional receives comments.

---

### Option 3

Raise Dispute

Admin intervention begins.

---

## Completed

Project is officially completed.

Actions unlocked

- Reviews
- Ratings
- Portfolio addition
- Experience increment
- Completion certificate

---

## Archived

Project becomes read-only.

Still available in history.

---

# 4. Messaging Rules

Messaging becomes available only after

One of these conditions.

- Bid Submitted
- Contact Unlocked
- Awarded

Before that

No direct communication.

---

# 5. Payment Philosophy

Phase 1

Platform DOES NOT hold customer money.

Customer pays professional directly.

Platform earns through

- Lead Unlock
- Bid Fee
- Subscription
- Featured Listings

---

Future Phase

Escrow System

```
Customer

↓

Platform Escrow

↓

Professional

↓

Completion

↓

Payment Release
```

NOT in MVP.

---

# 6. Payment Tracking

Even if payment happens offline

Platform should still track

```
Payment Status
```

Possible values

- Not Started
- Advance Paid
- Partially Paid
- Fully Paid
- Payment Disputed

This allows

- Timeline
- Analytics
- Trust Score

without handling money.

---

# 7. Milestone Payments

Professional can create milestones.

Example

```
Design

20%

Civil

30%

Furniture

30%

Final Delivery

20%
```

Customer marks milestone as paid.

Future Razorpay can automate this.

---

# 8. Cancellation Rules

Customer can cancel before award.

Professional receives notification.

No penalty.

---

Professional can withdraw bid before award.

No penalty.

---

After award

Cancellation requires reason.

Reasons stored.

Admin can review.

---

# 9. Abandonment Handling

## Professional Leaves

Professional clicks

```
Cannot Continue
```

Must provide

- Reason
- Current progress
- Images

Project returns to

Receiving Bids.

Professional receives negative metric.

---

If professional disappears

No updates

Configurable days

Example

14 Days

System flags

```
Inactive Professional
```

Admin notified.

---

## Customer Leaves

If customer becomes inactive

Professional can request admin review.

Admin contacts customer.

Possible actions

- Extend deadline
- Close project
- Cancel project

---

# 10. Dispute System

Either party can raise dispute.

Reasons

- Payment not received
- Poor work
- Delay
- Fraud
- Wrong materials
- Behaviour
- Scope conflict

Dispute contains

- Description
- Images
- Videos
- Documents

Admin reviews.

Possible outcomes

- Customer wins
- Professional wins
- Mutual settlement

Every dispute logged permanently.

---

# 11. Rating Unlock Rules

Reviews become available ONLY IF

Project status

```
Completed
```

AND

Customer approved completion.

No fake reviews.

No review without actual project.

---

# 12. Review Rules

Customer reviews professional.

Professional reviews customer.

Both reviews independent.

Cannot edit after 7 days.

Cannot delete.

Only admin can remove fraudulent reviews.

---

# 13. Portfolio Integration

Completed projects automatically appear in

```
Completed Projects
```

Professional chooses

```
Add to Portfolio
```

Customer receives consent request.

If approved

Project appears publicly.

---

# 14. Experience Growth

Each completed project updates

- Projects Completed
- Total Budget Executed
- Years Experience
- Category Experience
- Success Rate

Automatically.

No manual editing.

---

# 15. Trust Score Impact

Trust Score increases for

- Completed Projects
- Positive Reviews
- Fast Response
- Verified Documents
- Low Cancellation

Trust Score decreases for

- Abandonment
- Fake Documents
- Payment Disputes
- Negative Reviews
- Admin Warnings

---

# 16. Notifications

Customer receives

- New Bid
- Shortlisted
- Professional Accepted
- Project Started
- Milestone Added
- Completion Requested
- New Message

Professional receives

- New Award
- Shortlisted
- Customer Message
- Completion Approved
- Review Received

Admin receives

- New Dispute
- Project Abandoned
- Fraud Reports
- Completion Issues

---

# 17. Admin Powers

Admin can

- Override status
- Close project
- Reopen project
- Cancel project
- Freeze project
- Remove professional
- Resolve dispute
- Mark payment dispute
- Suspend users

Every action recorded.

---

# 18. Future Razorpay Integration

Current

```
Customer

↓

Professional
```

Future

```
Customer

↓

Razorpay Escrow

↓

Platform

↓

Professional
```

The lifecycle must already support this without requiring redesign.

---

# 19. Database Requirements

Every project must store

- Current Status
- Previous Status
- Award Date
- Start Date
- Completion Date
- Completion Request Date
- Cancellation Reason
- Dispute Status
- Payment Status
- Review Status
- Timeline Events

No lifecycle information should be hardcoded.

---

# 20. Non-Negotiable Rules

- Every project has one lifecycle.
- Every status change is logged.
- No review without completed project.
- No messaging before valid interaction.
- No direct payment logic in MVP.
- Payment tracking only.
- Every dispute must be traceable.
- Every completed project should strengthen the professional's profile.
- Every workflow must be recoverable after refresh.
- No data should exist only in frontend state.