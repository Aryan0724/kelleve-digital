# BUSINESS_DIRECTORY.md
Version 1.0

---

# PURPOSE

The Business Directory is the core module of TRUEDIAL.

It allows businesses to create a professional digital presence and allows customers to discover businesses based on category, location, rating, and services.

This module is the primary lead generation engine for vendors.

The implementation MUST reuse the existing platform architecture and shared services from Find My Interior.

---

# BUSINESS ENTITY

Each business represents one verified commercial entity.

Every business belongs to:

- One Tenant
- One Vendor
- One Primary Category
- One City
- One State

A Vendor may own multiple businesses.

---

# BUSINESS INFORMATION

Every business must support:

Business Name

Business Slug

Business Description

Short Description

Logo

Cover Image

Gallery

Category

Subcategory

GST Number (Optional)

Business Registration Number (Optional)

Year Established

Owner Name

Contact Person

Phone Number

WhatsApp Number

Email Address

Website

Facebook

Instagram

LinkedIn

YouTube

Address

State

City

Pincode

Latitude

Longitude

Google Map Location

Opening Hours

Working Days

Emergency Contact

---

# BUSINESS STATUS

Business can be:

Draft

Pending Verification

Verified

Rejected

Suspended

Inactive

Only VERIFIED businesses are publicly searchable.

---

# BUSINESS VERIFICATION

Vendor submits business.

↓

Admin reviews submission.

↓

Admin may:

Approve

Reject

Request Changes

↓

Verified badge becomes visible.

Verification history should be stored.

---

# BUSINESS GALLERY

Vendor may upload:

Business Images

Office Images

Product Images

Team Images

Certificates

The gallery must reuse the existing media upload service.

No duplicate upload logic.

---

# PRODUCTS & SERVICES

Vendor may create:

Products

Services

Each item contains:

Title

Description

Price (Optional)

Image

Status

Display Order

---

# BUSINESS PROFILE PAGE

Public profile should contain:

Business Banner

Logo

Verified Badge

Business Description

Gallery

Products

Services

Reviews

Average Rating

Opening Hours

Address

Google Map

Call Button

WhatsApp Button

Website Button

Share Button

Favourite Button

Report Business

Nearby Businesses

Similar Businesses

---

# SEARCH

Users can search using:

Business Name

Category

Subcategory

City

Area

Keyword

Verified Only

Open Now

Highest Rated

Newest

Nearby

---

# SEARCH RESULTS

Each business card should display:

Logo

Business Name

Verified Badge

Category

Rating

Address

Distance

Open/Closed Status

Offer Badge

Call

WhatsApp

View Details

---

# CATEGORY SYSTEM

Categories must be manageable by Admin.

Each category supports:

Icon

Image

Name

Slug

SEO Metadata

Sort Order

Status

Categories support unlimited subcategories.

---

# FAVOURITES

Customers can:

Save Business

Remove Business

View Saved Businesses

Reuse existing favourite architecture if available.

---

# REVIEWS

Reuse existing review engine.

Support:

Rating

Review

Images (Future)

Business Reply

Report Review

Average Rating

Rating Distribution

Verified Customer Badge

---

# REPORT BUSINESS

Customer may report:

Wrong Information

Spam

Fake Business

Closed Business

Duplicate Listing

Admin receives report.

---

# SEO

Every business must generate:

SEO URL

Meta Title

Meta Description

OpenGraph Image

Structured Data

Canonical URL

No duplicate URLs.

---

# GOOGLE MAPS

Business page displays:

Map

Directions Button

Distance

Nearby Businesses

Location Search

---

# BUSINESS OWNERSHIP

Vendor owns business.

Admin can transfer ownership.

Deleted vendors should never orphan businesses.

Ownership history should remain intact.

---

# MEMBERSHIP READY

Every business must support:

Free Plan

Premium Plan

Featured Plan

Membership affects:

Listing Priority

Verified Badge

Offer Visibility

Gallery Limit

Future features should depend on membership without changing database structure.

---

# ANALYTICS (MVP)

Vendor Dashboard displays:

Profile Views

Calls

WhatsApp Clicks

Website Clicks

Reviews

Rating

Offer Views

Simple analytics only.

No advanced BI.

---

# ADMIN CONTROLS

Admin can:

Approve Business

Reject Business

Suspend Business

Feature Business

Change Membership

Transfer Ownership

Edit Business

Delete Business

Manage Categories

Manage Reports

---

# IMPLEMENTATION RULES

Reuse existing:

Media Upload

Authentication

Review Engine

User System

Notification System

Search Infrastructure

Settings

Activity Logs

Never duplicate shared services.

Everything must be tenant-aware.

Business Directory must work as a reusable module for future tenants.

---

# COMPLETION CRITERIA

Business registration works.

Admin verification works.

Businesses are searchable.

Business profile page is production-ready.

Gallery uploads function correctly.

Maps work.

Reviews work.

Call and WhatsApp actions work.

Favourite system works.

Membership integration is ready.

The Business Directory is fully operational and launch-ready.