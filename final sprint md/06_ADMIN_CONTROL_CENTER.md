# ADMIN DASHBOARD & PLATFORM OPERATIONS SPECIFICATION

> **Document Version:** 1.0
> **Priority:** Critical
> **Status:** Final Specification
> **Purpose:** This document defines the complete Admin Control Center for Find My Interior. The Admin Dashboard is the operating system of the entire marketplace. Every important action performed on the platform should be manageable through the Admin Dashboard without requiring direct database access.

---

# 1. Objective

The Admin Dashboard is responsible for operating the entire marketplace.

The administrator should never need phpMyAdmin or SQL queries to manage the platform.

Everything should be manageable from the UI.

---

# 2. Dashboard Overview

The homepage of the Admin Dashboard should provide a real-time overview of the entire platform.

Display:

- Total Users
- Active Users
- New Users Today
- Verified Professionals
- Pending Verifications
- Active Projects
- Active RFQs
- Active Jobs
- Active Conversations
- Wallet Revenue
- Subscription Revenue
- Platform Revenue
- Reports Pending
- Disputes Pending

---

# 3. Left Navigation

Dashboard

Users

Professionals

Homeowners

Workers

Builders

Suppliers

Projects

RFQs

Jobs

Bids

Reviews

Verification

Wallet

Subscriptions

Payments

Notifications

Support Tickets

Reports

SEO Pages

CMS

Analytics

Settings

Audit Logs

System Health

---

# 4. User Management

Admin should be able to

View Users

Search Users

Filter Users

Edit User

Suspend User

Deactivate User

Delete User

Restore User

Reset Password

Force Logout

Change User Role

Merge Duplicate Accounts

View Login History

View Devices

View Activity Timeline

---

# 5. Professional Management

Admin should see

Business Name

Owner

Verification

Trust Score

Profile Completion

Projects Completed

Reviews

Subscription

Wallet Balance

Featured Status

Current Listings

---

Actions

Approve

Reject

Feature

Suspend

Blacklist

Reset Verification

Change Subscription

Adjust Wallet

Send Notification

---

# 6. Homeowner Management

View

Projects

Reviews

Messages

Activity

Reports

Blocked Professionals

---

Admin can

Suspend

Delete

Warn

Reset Password

---

# 7. Worker Management

View

Skills

Experience

Verification

Jobs

Applications

Reviews

Trust Score

---

Admin Actions

Approve

Reject

Suspend

Promote

Feature

---

# 8. Project Management

View every Project.

Filters

Status

Budget

City

Category

Owner

Professional

Verification

---

Admin can

Edit

Delete

Close

Award

Cancel

Transfer Ownership

Archive

Restore

---

# 9. RFQ Management

Manage

Material Requests

Supplier Quotes

Awarded RFQs

Cancelled RFQs

Expired RFQs

---

Actions

Edit

Delete

Close

Approve

Reject

---

# 10. Worker Job Management

Manage

Jobs

Applications

Hired Workers

Completed Jobs

Cancelled Jobs

---

# 11. Bid Management

Admin should view

Every Bid

Bid Amount

Timeline

Status

Professional

Customer

Project

Smart Score

Award Status

---

Admin can

Approve

Reject

Award

Cancel

Refund

Delete

---

# 12. Verification Center

Pending Documents

Approved

Rejected

Expired

Re-upload Required

Elite Requests

---

Actions

Approve

Reject

Revoke

Suspend

Download Documents

View History

---

# 13. Reviews Management

View

All Reviews

Reported Reviews

Hidden Reviews

Deleted Reviews

Pending Reviews

---

Actions

Approve

Hide

Delete

Restore

Warn User

---

# 14. Wallet Management

Admin can

Credit Wallet

Debit Wallet

Freeze Wallet

Unfreeze Wallet

View Ledger

Export Transactions

Refund Credits

---

# 15. Subscription Management

Manage

Plans

Pricing

Benefits

Bid Limits

Unlock Limits

Visibility

Discounts

Featured Access

---

Admin can

Assign Plans

Cancel Plans

Extend Plans

Downgrade

Upgrade

---

# 16. Featured Listings

Manage

Homepage Featured

City Featured

Category Featured

Premium Listings

---

Actions

Approve

Reject

Feature

Remove

Schedule

---

# 17. Notification Center

Admin can

Send Global Notification

Send Role Notification

Send City Notification

Send Premium Notification

Send Verification Reminder

Schedule Notifications

---

# 18. Support Center

View

Support Tickets

Bug Reports

Payment Issues

Verification Issues

Account Recovery

---

Admin can

Reply

Assign

Close

Escalate

---

# 19. Reports & Abuse

Manage

Spam Reports

Fake Profiles

Fake Reviews

Fraud

Harassment

Copyright

---

Actions

Investigate

Warn

Suspend

Ban

Dismiss

---

# 20. SEO Management

Manage

City Pages

Category Pages

Meta Titles

Meta Descriptions

Schema

Internal Links

Landing Pages

Sitemap

Robots

---

# 21. CMS

Manage

Homepage

Hero

Footer

FAQ

About

Privacy Policy

Terms

Refund Policy

Blog

Announcements

---

# 22. Analytics Dashboard

Users

Registrations

Daily Active Users

Monthly Active Users

Revenue

Subscriptions

Wallet Revenue

Bid Revenue

Unlock Revenue

Conversion Rate

Bounce Rate

Top Cities

Top Categories

Top Professionals

Most Viewed Profiles

Most Successful Vendors

Search Trends

---

# 23. Audit Logs

Every admin action should be logged.

Store

Admin

Action

Target

Old Value

New Value

Timestamp

IP

Device

---

# 24. System Health

Display

API Status

Database Status

Storage Usage

Queue Status

Mail Status

Notification Status

Payment Gateway Status

Cache Status

Cron Status

Server Uptime

---

# 25. Search

Global Search

Admin should instantly search

Users

Projects

Jobs

RFQs

Professionals

Reviews

Payments

Subscriptions

Tickets

---

# 26. Filters

Every table should support

Search

Sort

Status

Role

Verification

City

District

Date

Subscription

Trust Score

Rating

---

# 27. Bulk Operations

Admin should perform

Bulk Approve

Bulk Reject

Bulk Delete

Bulk Suspend

Bulk Notify

Bulk Export

Bulk Assign

---

# 28. Export

CSV

Excel

PDF

JSON

---

# 29. Security

Role Based Access

Super Admin

Admin

Support

Moderator

Verification Team

Finance Team

Marketing Team

Content Team

Each role only accesses permitted modules.

---

# 30. Existing Problems That MUST Be Fixed

The following issues must be completely eliminated.

✅ No hardcoded dashboard values.

✅ Every table connected to database.

✅ Every button functional.

✅ Every action updates database.

✅ Dashboard statistics update automatically.

✅ Search works everywhere.

✅ Filters work everywhere.

✅ Pagination works everywhere.

✅ Admin never needs SQL access.

---

# 31. Verification Checklist

Before launch verify

✓ User Management

✓ Project Management

✓ RFQ Management

✓ Worker Jobs

✓ Verification

✓ Reviews

✓ Wallet

✓ Subscriptions

✓ Featured Listings

✓ Notifications

✓ Reports

✓ Analytics

✓ CMS

✓ SEO

✓ Audit Logs

✓ System Health

---

# 32. Non-Negotiable Rules

- Nothing should be hardcoded.
- Everything should come from the database.
- Every action should have confirmation.
- Every important action should be logged.
- Admin should be able to manage the complete marketplace without touching code or the database.
- The Admin Dashboard is the operational backbone of Find My Interior.