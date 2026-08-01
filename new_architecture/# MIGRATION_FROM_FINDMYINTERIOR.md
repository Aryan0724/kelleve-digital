# MIGRATION_FROM_FINDMYINTERIOR.md
Version 1.0

---

# PURPOSE

Find My Interior is the foundation of the platform.

TRUEDIAL is not a new application.

TRUEDIAL extends the existing platform.

This document defines exactly what should be reused, extended, or created.

The goal is to minimize development time while maintaining production stability.

---

# PLATFORM STRATEGY

Current State

Find My Interior

↓

Single Product

Target State

Platform

├── Find My Interior
├── TRUEDIAL
└── Future Products

One Backend

One Database

Shared Services

Multiple Products

---

# MODULES TO REUSE

The following modules must never be recreated.

Authentication

Users

Roles

Permissions

Media Upload

Storage

Notification System

Review Engine

Payment Integration

Dashboard Layout

Admin Authentication

Search Components

Settings

Activity Logs

API Authentication

File Upload

Email System

Logging

Error Handling

Validation

---

# MODULES TO EXTEND

These modules require additional functionality.

Users

Businesses

Categories

Membership

Offers

Analytics

Dashboard

Search

Navigation

Settings

---

# NEW MODULES

Only these modules should be newly developed.

Business Directory

Privilege Card

Vendor Dashboard

Customer Dashboard

Membership Plans

Offer Engine

QR Code Validation

Business Verification

---

# DATABASE STRATEGY

Reuse existing tables whenever possible.

Add new tables only when required.

Preferred approach

Existing Table

↓

Add Columns

↓

Update Models

↓

Update APIs

Avoid creating duplicate entities.

---

# RECOMMENDED TABLES

Reuse

users

roles

permissions

media

reviews

notifications

settings

payments

activity_logs

Create only if missing

businesses

business_categories

business_gallery

business_services

business_products

offers

memberships

privilege_cards

business_reports

favorites

---

# FOLDER STRUCTURE

Recommended structure

app/

Core/

Authentication

Media

Notifications

Payments

Reviews

Search

Settings

Shared

Tenants/

FindMyInterior/

Controllers

Services

Views

Routes

TRUEDIAL/

Controllers

Services

Views

Routes

Modules/

BusinessDirectory

Offers

Membership

PrivilegeCard

---

# ROUTING

Routes should remain isolated.

Example

/findmyinterior/*

↓

Find My Interior

/truedial/*

↓

TRUEDIAL

Shared APIs remain inside Core.

---

# MODELS

Shared

User

Review

Media

Notification

Payment

Setting

Tenant

Business-specific

Business

BusinessCategory

BusinessGallery

Offer

Membership

PrivilegeCard

Favorite

---

# UI COMPONENTS

Reuse

Buttons

Forms

Tables

Cards

Dialogs

Pagination

Navigation

Sidebar

Header

Footer

Modals

Alerts

Loaders

Create new only for

Business Cards

Offer Cards

Privilege Card

Membership Cards

---

# DESIGN SYSTEM

Maintain the existing UI system.

Do not redesign shared components.

TRUEDIAL should feel like another product built on the same platform.

---

# API STRATEGY

Shared APIs remain shared.

Business APIs remain inside TRUEDIAL.

Avoid duplicate endpoints.

Use consistent response format.

---

# TESTING AFTER EVERY PHASE

Confirm

Find My Interior still works.

TRUEDIAL still works.

Authentication works.

Uploads work.

Reviews work.

Search works.

Payments work.

Admin Panel works.

---

# BACKWARD COMPATIBILITY

Every change must be checked against Find My Interior.

No existing feature should break.

If a reusable component requires modification, the modification must remain compatible with both products.

---

# PERFORMANCE

Reuse queries.

Reuse caching.

Avoid duplicate business logic.

Optimize new queries.

Use eager loading.

Paginate all listings.

---

# FINAL GOAL

After migration, the platform should support multiple products without requiring another backend.

Every future product should be able to plug into the shared platform with minimal development effort.

Find My Interior remains fully functional.

TRUEDIAL launches as Product #2.

Future products should follow the same architecture.
