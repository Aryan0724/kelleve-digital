# EXECUTION_RULES.md
Version 1.0

Status:
Final Implementation Guide

------------------------------------------------------------

# OBJECTIVE

This project is NOT a fresh Laravel application.

Find My Interior already exists.

The goal is to transform the existing platform into a reusable multi-tenant platform and implement TRUEDIAL as Tenant #2.

Never create another backend.

Never duplicate existing modules.

Everything should reuse the existing platform whenever possible.

------------------------------------------------------------

# DEVELOPMENT PRINCIPLES

The editor must:

✓ Read every document before making changes.

✓ Audit the existing codebase.

✓ Identify reusable modules.

✓ Extend existing modules.

✓ Build only missing functionality.

✓ Maintain backward compatibility with Find My Interior.

------------------------------------------------------------

# NEVER REBUILD

The following systems already exist and MUST be reused.

Authentication

Users

Roles

Permissions

Media Upload

Image Storage

Reviews

Notification System

Settings

Activity Logs

Payments

Search

API Authentication

Admin Authentication

Dashboard Layout

File Uploads

Shared Components

These are platform services.

TRUEDIAL consumes them.

------------------------------------------------------------

# MULTI TENANT IMPLEMENTATION

Find My Interior becomes

Tenant 1

TRUEDIAL becomes

Tenant 2

Every request must resolve tenant.

Every tenant has

Logo

Theme

Configuration

Enabled Modules

Business Rules

No duplicated code.

------------------------------------------------------------

# BUILD ORDER

The implementation must follow this exact sequence.

STEP 1

Audit codebase.

Understand architecture.

Find reusable modules.

------------------------------------------------------------

STEP 2

Implement tenant middleware.

Tenant configuration.

Tenant settings.

Domain resolution.

------------------------------------------------------------

STEP 3

Integrate TRUEDIAL.

Do NOT affect Find My Interior.

------------------------------------------------------------

STEP 4

Implement Business Directory.

Business Profile

Categories

Search

Gallery

Reviews

Verification

------------------------------------------------------------

STEP 5

Implement Vendor Dashboard.

------------------------------------------------------------

STEP 6

Implement Customer Dashboard.

------------------------------------------------------------

STEP 7

Implement Privilege Card.

Membership.

QR Code.

Offers.

------------------------------------------------------------

STEP 8

Implement Admin Panel.

------------------------------------------------------------

STEP 9

Production Testing.

------------------------------------------------------------

# CODING RULES

Never duplicate code.

Never duplicate APIs.

Never duplicate tables.

Never create multiple upload systems.

Never create another authentication system.

Never hardcode tenant names.

Never hardcode branding.

Everything must support additional tenants.

------------------------------------------------------------

# DATABASE RULES

Reuse existing schema wherever possible.

Only add new tables when absolutely required.

Prefer extending existing models.

Avoid unnecessary migrations.

Keep the database normalized.

Every tenant-specific table must support tenant isolation.

------------------------------------------------------------

# API RULES

All APIs should follow the existing API conventions.

Reuse existing authentication.

Reuse validation patterns.

Return consistent JSON responses.

Maintain backward compatibility.

------------------------------------------------------------

# UI RULES

Reuse existing layouts.

Reuse existing components.

Reuse existing design system.

Only create new components when necessary.

Maintain a clean and modern interface.

Brand Theme

Primary

White

Secondary

Navy Blue

Accent

Orange

------------------------------------------------------------

# PERFORMANCE

Optimize queries.

Avoid N+1 queries.

Use eager loading.

Paginate all large datasets.

Cache configuration where appropriate.

Optimize images.

------------------------------------------------------------

# SECURITY

Validate every request.

Authorize every action.

Never trust client-side validation.

Protect uploads.

Prevent mass assignment.

Use existing permission system.

------------------------------------------------------------

# TESTING CHECKLIST

Business Registration

Vendor Registration

Customer Registration

Admin Login

Business Approval

Business Search

Business Details

Reviews

Gallery Upload

Privilege Card

Membership Purchase

Offer Creation

Offer Redemption

Analytics

Settings

Tenant Resolution

Everything must function correctly.

------------------------------------------------------------

# DEFINITION OF DONE

The project is considered complete only when:

✓ Find My Interior continues working without regression.

✓ TRUEDIAL is fully functional.

✓ One backend serves both products.

✓ One database supports both products.

✓ Tenant resolution works.

✓ Business Directory is production-ready.

✓ Vendor Dashboard is production-ready.

✓ Customer Dashboard is production-ready.

✓ Admin Dashboard is production-ready.

✓ Membership system works.

✓ Offer system works.

✓ QR code generation works.

✓ Reviews work.

✓ Search works.

✓ No duplicated logic exists.

✓ No placeholder implementations remain.

✓ Application is production deployable.

------------------------------------------------------------

# FUTURE FEATURES

The following are intentionally excluded from MVP and should NOT be implemented now:

AI Business Center

CRM

SMS Campaigns

WhatsApp Campaigns

Email Marketing

Academy

Internship

Job Portal

Podcast

TD News

Business Consulting

Franchise

Advanced Analytics

Marketplace Extensions

These belong to future phases after market validation.

------------------------------------------------------------

# FINAL INSTRUCTION

This project is an MVP.

The priority is:

1. Launch quickly.
2. Keep the codebase clean.
3. Reuse the existing platform.
4. Maintain Find My Interior compatibility.
5. Deliver a stable, production-ready Business Growth Platform.

Do not over-engineer.

Do not implement future-phase features.

Complete the MVP with production quality before expanding.