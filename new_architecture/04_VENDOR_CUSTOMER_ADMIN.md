# VENDOR_CUSTOMER_ADMIN.md
Version 1.0

---

# PURPOSE

This document defines every dashboard required for the MVP launch of TRUEDIAL.

The objective is to provide a clean, simple and scalable experience for Vendors, Customers and Administrators.

Only launch-critical functionality should be implemented.

All dashboards must reuse the shared platform services from Find My Interior.

No duplicate modules should be created.

---

# USER TYPES

The platform has only three dashboards for MVP.

• Customer

• Vendor

• Super Admin

Future roles like State Manager, City Manager, Franchise, etc. are intentionally excluded.

---

# CUSTOMER DASHBOARD

The customer dashboard should be minimal and focused on discovery.

Customers should immediately see useful information instead of unnecessary settings.

---

## Customer Navigation

Dashboard

My Profile

Privilege Card

Saved Businesses

Saved Offers

My Reviews

Membership

Settings

Logout

---

## Dashboard Home

Display

Welcome Message

Nearby Businesses

Featured Businesses

Trending Offers

Recently Viewed

Popular Categories

Membership Status

Quick Search

---

## Customer Profile

Customer can manage

Profile Picture

Name

Phone

Email

City

State

Password

Notification Preferences

---

## Saved Businesses

Customer can

Save Business

Remove Business

Open Business

Call Business

WhatsApp Business

Navigate

---

## Saved Offers

Customer can

View Offer

Redeem Offer

Share Offer

Remove Offer

---

## Reviews

Customer can

View Reviews

Edit Own Review

Delete Own Review

Rate Businesses

---

## Privilege Card

Display

Digital Card

QR Code

Membership Status

Expiry Date

Card Number

Reward Points (Reserved)

---

# VENDOR DASHBOARD

Vendor Dashboard is the heart of the platform.

The dashboard must help vendors manage their business quickly.

No unnecessary complexity.

---

## Vendor Navigation

Dashboard

Business

Gallery

Products & Services

Offers

Reviews

Membership

Analytics

Settings

Logout

---

## Vendor Dashboard Home

Show

Business Status

Membership Status

Profile Views

Offer Views

Calls

WhatsApp Clicks

Average Rating

Recent Reviews

Quick Actions

---

## Business Management

Vendor can

Edit Business

Update Description

Update Contact

Update Address

Update Working Hours

Update Social Links

Update Location

Manage Categories

---

## Gallery

Vendor can

Upload Images

Delete Images

Arrange Images

Update Cover

Update Logo

Reuse existing media system.

---

## Products & Services

Vendor can

Create

Edit

Delete

Hide

Reorder

Each product supports

Image

Title

Description

Price (Optional)

---

## Offers

Vendor can

Create Offer

Edit Offer

Delete Offer

Activate

Deactivate

View Redemptions

---

## Reviews

Vendor can

View Reviews

Reply to Reviews

Report Fake Reviews

---

## Membership

Vendor can

View Current Plan

Renew Plan

Upgrade Plan

Download Invoice

---

## Analytics

Simple statistics only.

Display

Profile Views

Call Clicks

WhatsApp Clicks

Website Clicks

Offer Views

Review Count

Average Rating

No advanced BI.

---

## Vendor Settings

Vendor may update

Password

Notification Preferences

Business Preferences

Logo

Cover

---

# SUPER ADMIN PANEL

The Admin Panel controls the platform.

Everything must be manageable without touching code.

---

## Admin Navigation

Dashboard

Businesses

Vendors

Customers

Categories

Offers

Memberships

Reviews

Reports

Settings

Logout

---

## Dashboard

Display

Total Businesses

Verified Businesses

Pending Businesses

Customers

Vendors

Membership Revenue

Active Offers

Recent Registrations

---

## Businesses

Admin can

Approve

Reject

Suspend

Delete

Transfer Ownership

Feature Business

---

## Vendors

Admin can

Approve Vendor

Suspend Vendor

Edit Vendor

Reset Password

View Businesses

Change Membership

---

## Customers

Admin can

Search

Suspend

Delete

View Membership

View Activity

---

## Categories

Admin can

Create

Edit

Delete

Reorder

Enable

Disable

---

## Offers

Admin can

Delete Offer

Feature Offer

Disable Offer

Review Reported Offers

---

## Membership

Admin can

Create Plans

Edit Plans

Deactivate Plans

View Purchases

View Expiry

---

## Reviews

Admin can

Delete Review

Hide Review

Approve Review

View Reports

---

## Reports

Simple reports

Business Count

Vendor Count

Membership Revenue

Offer Usage

Review Count

Customer Growth

---

## Settings

Admin controls

General Settings

Brand Settings

Membership Pricing

Business Verification Rules

Offer Rules

SEO Settings

Contact Details

---

# COMMON DESIGN PRINCIPLES

Every dashboard must

Be mobile responsive

Load quickly

Use server-side pagination

Use reusable UI components

Reuse existing authentication

Reuse existing notification system

Reuse existing upload system

Reuse existing review system

---

# UI REQUIREMENTS

The interface should be modern and clean.

Primary Colors

White

Dark Navy

Orange Accent

Cards should have

Rounded Corners

Soft Shadows

Minimal Borders

Modern Typography

Consistent Spacing

---

# IMPLEMENTATION RULES

Do NOT redesign existing shared components.

Reuse components from Find My Interior whenever possible.

Keep all dashboards tenant-aware.

Avoid duplicate APIs.

Avoid duplicate database tables.

Avoid duplicate business logic.

---

# MVP COMPLETION CHECKLIST

✓ Customer registration

✓ Vendor registration

✓ Business approval

✓ Business profile

✓ Business gallery

✓ Products & Services

✓ Offer creation

✓ Privilege Card

✓ Membership purchase

✓ Business search

✓ Reviews

✓ Admin management

✓ Analytics

✓ Fully responsive

✓ Production ready