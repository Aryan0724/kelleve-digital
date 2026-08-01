# NOTIFICATION & ACTIVITY SYSTEM SPECIFICATION

> **Document Version:** 1.0
> **Priority:** Critical
> **Status:** Final Specification

---

# 1. Objective

Notifications should make the marketplace feel alive.

Users should never have to repeatedly check the dashboard to know whether something happened.

Every important activity should immediately notify the relevant user.

The notification system must become the communication backbone of the platform.

---

# 2. Notification Channels

The platform will support multiple channels.

## In-App Notifications

Primary notification system.

Always enabled.

---

## Email Notifications

For important events.

Examples:

- Verification Approved
- Project Awarded
- Subscription Expiring

---

## WhatsApp Notifications

For high-value actions.

Examples

- New Lead
- Project Awarded
- Contact Unlock
- Payment Received

---

## SMS

Only critical alerts.

Examples

OTP

Account Recovery

Verification Code

---

## Push Notifications

Future Mobile App.

Same notification engine.

---

# 3. Notification Categories

## Marketplace

New Project

New RFQ

New Job

Project Awarded

Bid Shortlisted

Bid Rejected

New Bid

New Quote

New Application

---

## Messaging

New Message

Customer Online

Professional Online

Unread Messages

Message Seen

---

## Verification

Verification Submitted

Verification Approved

Verification Rejected

Document Expiring

---

## Reviews

New Review

Review Reply

Review Reported

---

## Wallet

Wallet Credited

Wallet Debited

Subscription Purchased

Unlock Purchased

Low Balance

---

## Admin

Announcement

Maintenance

Platform Updates

Policy Updates

---

# 4. Homepage Notifications

Each role receives different notifications.

Never show irrelevant notifications.

---

## Homeowner

New Bid

Bid Shortlisted

Professional Messaged

Project Completed

Review Pending

---

## Professional

New Matching Project

Bid Viewed

Bid Shortlisted

Project Awarded

Customer Message

Verification Approved

Low Wallet

Subscription Expiring

---

## Supplier

New RFQ

Quote Viewed

Order Awarded

New Message

Verification Status

---

## Worker

New Jobs

Application Viewed

Application Accepted

Application Rejected

Employer Message

---

## Builder

New Contractors

Supplier Quotes

Worker Applications

Project Updates

---

# 5. Live Lead Notifications

Professionals should instantly know when

A matching project is posted.

Matching means

Role

Category

City

District

Budget

Services

---

Example

A contractor from Patna

should immediately receive

"New Construction Project in Patna"

---

# 6. Premium Notifications

Premium users receive extra alerts.

Examples

Someone viewed your profile.

Someone opened your bid.

Someone viewed your portfolio.

Customer came online.

Bid ranking changed.

Competitor won project.

Customer shortlisted you.

---

# 7. Messaging Notifications

New message

Unread message

Message delivered

Message read

Customer online

Professional online

Conversation archived

---

# 8. Notification Center

Every user has a notification center.

Shows

Unread

Today

Yesterday

Earlier

Read

Archived

---

Notifications grouped by

Projects

Messages

Verification

Wallet

Admin

Reviews

---

# 9. Notification Actions

Notifications should be clickable.

Example

New Project

↓

Open Project

---

New Message

↓

Open Conversation

---

Verification Approved

↓

Open Verification Page

---

Review Received

↓

Open Review

---

# 10. Admin Broadcast System

Admin can send notifications to

Everyone

Homeowners

Designers

Builders

Suppliers

Workers

Contractors

Premium Members

Verified Businesses

Specific Users

---

Notification types

Announcement

Promotion

Warning

Maintenance

Survey

---

# 11. Notification Preferences

Users can enable/disable

Email

WhatsApp

Push

Marketing

Marketplace

Messages

Reviews

Wallet

Verification

---

# 12. Activity Timeline

Every account has a timeline.

Example

Submitted Bid

↓

Customer Viewed Bid

↓

Customer Shortlisted Bid

↓

Message Started

↓

Project Awarded

↓

Project Started

↓

Completion Requested

↓

Completed

↓

Review Received

Everything visible chronologically.

---

# 13. Activity Feed

Homepage should contain

Recent Marketplace Activity

Examples

You received a new lead

Builder posted new RFQ

Worker applied

Supplier quoted

Customer shortlisted you

Project completed

Review received

---

# 14. Notification Priority

High Priority

Project Awarded

Verification Approved

Payment

Wallet

Account Issues

---

Medium

Messages

Leads

RFQs

Jobs

Reviews

---

Low

Announcements

Tips

Suggestions

---

# 15. Notification Retention

Unread

Never deleted

Read

Stored

90 Days

Archived

365 Days

---

# 16. Database

Every notification stores

User

Actor

Type

Title

Description

Action URL

Priority

Channel

Read Status

Created Time

---

# 17. Security

Only intended recipient can view.

Notifications cannot leak

Phone Numbers

Emails

Business Documents

Private Chats

---

# 18. Non-Negotiable Rules

- Notifications must never be hardcoded.
- Every notification comes from a real event.
- Every notification opens the relevant page.
- Homepage notifications are role-specific.
- Premium users receive premium alerts.
- Admin can broadcast notifications.
- Notification history is always available.