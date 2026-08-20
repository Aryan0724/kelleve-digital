# TRUEDIAL PLATFORM
# MULTI TENANCY ARCHITECTURE
# Version 1.0

---

# PURPOSE

This document defines how the platform supports multiple products, brands, businesses, and future SaaS clients from one backend.

Multi-tenancy is the foundation of scalability.

Every architectural decision must assume that new platforms will be added in the future.

---

# WHAT IS A TENANT?

A tenant is an independent platform running on the same backend.

Examples

Tenant 1

TrueDial

Tenant 2

FindMyInterior

Tenant 3

BestInBharat

Tenant 4

Future Healthcare Platform

Tenant 5

Future Education Platform

Each tenant has its own identity but shares the same architecture.

---

# PHILOSOPHY

Never build software for one brand.

Build software for many brands.

Every feature should ask:

"Can another tenant use this?"

If YES

Build it generically.

If NO

Redesign.

---

# ONE BACKEND

There is only ONE Laravel backend.

Never create:

truedial-api

findmyinterior-api

bestinbharat-api

future-api

Instead

One backend

↓

Tenant Configuration

↓

Different Experiences

---

# TENANT IDENTIFICATION

Every request must identify the tenant.

Possible methods

• Domain

• Subdomain

• Header

• API Key

• JWT Claims

Example

truedial.com

↓

Tenant = TrueDial

findmyinterior.com

↓

Tenant = FindMyInterior

futureplatform.com

↓

Tenant = FuturePlatform

Backend resolves the tenant before executing business logic.

---

# TENANT TABLE

Every tenant should contain:

id

name

slug

domain

logo

primary_color

secondary_color

theme

status

timezone

currency

language

country

settings

created_at

updated_at

deleted_at

Never hardcode branding.

---

# TENANT SETTINGS

Each tenant controls:

Logo

Theme

Primary Color

Secondary Color

Homepage Layout

Feature Flags

Subscription Plans

Contact Information

Support Email

Support Phone

SEO Configuration

Analytics Keys

Payment Configuration

Notification Configuration

Everything should be configurable.

---

# TENANT ISOLATION

Tenant data must never leak.

Example

Customer from TrueDial

↓

Cannot access

↓

FindMyInterior data.

Every database query must respect tenant boundaries.

---

# SHARED TABLES

These tables are shared.

users

roles

permissions

countries

states

cities

currencies

languages

feature_flags

settings

subscription_plans

Only platform-level data belongs here.

---

# TENANT TABLES

These tables must include tenant_id.

businesses

offers

products

services

campaigns

reviews

analytics

wallets

transactions

notifications

crm

academy

jobs

internships

podcasts

news

consulting

Everything belonging to a tenant must reference tenant_id.

---

# BRAND CUSTOMIZATION

Each tenant controls:

Logo

Icons

Fonts

Colors

Homepage

Navigation

Footer

Terms

Privacy Policy

SEO

Meta Tags

Email Templates

SMS Templates

Notification Templates

Backend logic remains identical.

---

# FEATURE FLAGS

Each tenant can enable or disable modules.

Example

TrueDial

✓ Directory

✓ Offers

✓ CRM

✓ Marketing

✓ AI

✓ Jobs

FindMyInterior

✓ Directory

✓ Portfolios

✓ Vendors

✓ Interior Designers

✗ Jobs

✗ Academy

Same backend.

Different modules.

---

# MODULE CONFIGURATION

Every module should have

Enabled

Disabled

Visible

Hidden

Beta

Premium

Enterprise

States.

Frontend should never hardcode module visibility.

---

# TENANT USERS

One person may belong to multiple tenants.

Example

John

↓

Customer

↓

TrueDial

Vendor

↓

FindMyInterior

Admin

↓

Healthcare Platform

Identity is shared.

Permissions are tenant-specific.

---

# TENANT PERMISSIONS

Permissions must always be evaluated within tenant context.

Example

Vendor

TrueDial

↓

Cannot automatically become Vendor

↓

FindMyInterior

Permissions belong to

Tenant + User + Role

---

# STORAGE

Storage paths should be tenant-aware.

Example

uploads/

tenant-1/

businesses/

uploads/

tenant-2/

offers/

uploads/

tenant-3/

academy/

Never mix tenant assets.

---

# MEDIA

Every uploaded image should know:

Tenant

Business

Owner

Uploader

Storage Path

Visibility

Media should never exist without ownership.

---

# NOTIFICATIONS

Notifications should be tenant-aware.

Example

Email Template

↓

TrueDial Branding

Same notification

↓

FindMyInterior Branding

No duplicated notification logic.

---

# EMAILS

Email branding should come from tenant configuration.

Never hardcode

Logo

Footer

Colors

Support Links

Everything should be dynamic.

---

# PAYMENTS

Every tenant may have

Different Plans

Different Prices

Different Taxes

Different Currency

Different Gateway Keys

Never hardcode payment values.

---

# SUBSCRIPTIONS

Subscription plans belong to tenants.

Example

TrueDial

Starter

Professional

Enterprise

FindMyInterior

Free

Designer

Agency

Same subscription engine.

Different plans.

---

# SEARCH

Search should automatically respect tenant context.

Example

Searching businesses

↓

Returns only businesses belonging to current tenant.

Never expose cross-tenant data.

---

# ANALYTICS

Analytics should always include:

Tenant

Platform

Business

Campaign

Source

Device

Location

Analytics should be filterable by tenant.

---

# CACHE

Cache keys must include tenant identifiers.

Example

BAD

homepage

GOOD

tenant:1:homepage

BAD

categories

GOOD

tenant:2:categories

Never allow cache collisions.

---

# BACKUPS

Backups should support

Platform Backup

Tenant Backup

Tenant Restore

Future migrations should support restoring individual tenants.

---

# SECURITY

Every request must verify

Authenticated User

Tenant

Role

Permissions

Ownership

Never trust frontend tenant information.

Backend validates everything.

---

# API DESIGN

Every API should automatically resolve tenant.

Frontend should never manually filter tenant data.

Example

GET /businesses

Backend

↓

Returns only businesses for current tenant.

---

# FUTURE WHITE LABEL SUPPORT

The architecture should support

Different Domains

Different Branding

Different Pricing

Different Modules

Different Markets

Without creating another backend.

---

# WHEN TO CREATE A NEW TENANT

Create a new tenant when:

A new brand launches.

A white-label client is onboarded.

A franchise requires independent branding.

A new SaaS product uses the same platform.

Do NOT create a tenant simply because a new frontend exists.

---

# SUCCESS CRITERIA

The multi-tenant architecture is successful when:

A new platform can be launched by:

1. Creating a tenant.
2. Configuring branding.
3. Enabling modules.
4. Assigning roles.
5. Publishing the frontend.

No backend duplication.

No database duplication.

No business logic duplication.

---

# FINAL RULE

Every new feature must be designed as if one hundred future tenants will use it.

If a feature only works for one tenant, it is not ready for production.