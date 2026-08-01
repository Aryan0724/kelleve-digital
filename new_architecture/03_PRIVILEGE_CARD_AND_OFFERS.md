# PRIVILEGE_CARD_AND_OFFERS.md
Version 1.0

---

# PURPOSE

The Privilege Card is TRUEDIAL's premium customer membership.

The goal is to increase customer retention while giving vendors a reason to subscribe to premium plans.

Customers receive discounts.

Businesses receive more customers.

TRUEDIAL earns through memberships and premium vendor subscriptions.

This module must integrate with the existing shared platform.

---

# PRIVILEGE CARD

Every customer may own one digital Privilege Card.

Card Types

Free

Premium

VIP (Future)

Each card contains

Card Number

QR Code

Customer Name

Photo (Optional)

Membership Plan

Issue Date

Expiry Date

Status

Reward Points

Wallet Balance (Future)

---

# DIGITAL CARD

Card should be visible inside:

Customer Dashboard

Mobile App

Website

Card displays

QR Code

Customer Name

Card Number

Membership Type

Expiry Date

Status

Reward Points

---

# QR CODE

Every card generates a unique QR Code.

Vendor scans QR.

System validates

Card Status

Expiry

Membership

Reward Eligibility

The QR must never expose sensitive customer information.

---

# MEMBERSHIP

Membership Types

Free

Premium

Premium members receive

Exclusive Offers

Priority Discounts

Special Coupons

Future Rewards

Membership status

Active

Expired

Cancelled

Pending

---

# MEMBERSHIP PURCHASE

Customer

↓

Choose Membership

↓

Payment

↓

Membership Activated

↓

Digital Card Generated

↓

QR Generated

↓

Confirmation

Reuse existing payment gateway.

Do not build a separate payment module.

---

# OFFERS

Vendors may create offers.

Offer Types

Flat Discount

Percentage Discount

Buy One Get One

Festival Offer

Combo Offer

Limited Time Offer

---

# OFFER DETAILS

Every offer contains

Title

Description

Offer Image

Discount Type

Discount Value

Coupon Code (Optional)

Category

Business

Start Date

End Date

Maximum Redemptions

Status

Terms & Conditions

---

# OFFER STATUS

Draft

Scheduled

Active

Expired

Disabled

Only Active offers appear publicly.

---

# OFFER DISPLAY

Offers appear

Business Profile

Home Page

Nearby Businesses

Category Pages

Search Results

Customer Dashboard

Featured Offers Section

---

# OFFER REDEMPTION

Customer opens offer.

↓

Clicks Redeem.

↓

QR Code generated.

↓

Vendor scans QR.

↓

Offer marked redeemed.

↓

Usage stored.

Future support

Manual redemption.

---

# COUPONS

Vendor may optionally generate coupon codes.

Example

WELCOME10

SUMMER20

SAVE500

Coupon Rules

One Time

Limited Quantity

Expiry Date

Minimum Purchase (Future)

Maximum Usage

---

# FEATURED OFFERS

Admin may feature offers.

Featured offers appear

Homepage

Category Landing Pages

Nearby Section

Future advertising placements.

---

# OFFER SEARCH

Users may filter by

Category

Business

Nearby

Highest Discount

Newest

Expiring Soon

Verified Businesses

---

# CUSTOMER EXPERIENCE

Customer may

Browse Offers

Save Offers

Redeem Offers

Share Offers

View Redemption History

Favourite Businesses

---

# VENDOR EXPERIENCE

Vendor Dashboard

Create Offer

Edit Offer

Delete Offer

Pause Offer

View Analytics

View Redemptions

Renew Membership

---

# ADMIN EXPERIENCE

Admin may

Approve Offers (Optional)

Delete Offers

Feature Offers

Disable Offers

Manage Membership Plans

Manage Coupons

Monitor Abuse

View Statistics

---

# MEMBERSHIP BENEFITS

Free Vendor

Basic Listing

Limited Gallery

No Featured Placement

Premium Vendor

Verified Badge

Priority Listing

Unlimited Gallery

Offer Creation

Featured Business

Future Marketing Features

---

# BASIC ANALYTICS

Vendor sees

Offer Views

Offer Clicks

Redemptions

Profile Visits

Calls

WhatsApp Clicks

No advanced reporting required.

---

# IMPLEMENTATION RULES

Reuse existing

Authentication

Payments

Users

Notifications

Media Upload

Search

Settings

No duplicate services.

All offers must be tenant-aware.

All memberships must support future upgrades without schema redesign.

---

# COMPLETION CRITERIA

Customer can purchase membership.

Digital Privilege Card is generated.

QR Code works.

Vendor creates offers.

Offers appear publicly.

Customers redeem offers.

Vendor analytics update.

Admin manages memberships.

Module is production ready.