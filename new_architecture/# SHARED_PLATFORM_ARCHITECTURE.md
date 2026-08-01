# SHARED_PLATFORM_ARCHITECTURE.md
Version 1.0

Status:
Platform Foundation Specification

---

# PURPOSE

Integral Platform is a shared multi-tenant ecosystem.

Products such as Find My Interior, TRUEDIAL, BestInBharat, and future applications are **products built on one platform**, not independent applications.

The platform must provide a single identity, shared services, shared infrastructure, and a common architecture while allowing each product to maintain its own branding, modules, and business rules.

This document defines the foundational architecture that every current and future product must follow.

---

# PLATFORM PHILOSOPHY

Think of the platform like:

Google

- Gmail
- Drive
- Maps
- Photos
- Calendar

One Account.

Many Products.

Or

Meta

- Facebook
- Instagram
- Messenger
- Threads

One Identity.

Many Experiences.

Integral Platform follows the same philosophy.

---

# PLATFORM STRUCTURE

Integral Platform

├── Core Platform

│   ├── Authentication

│   ├── Authorization

│   ├── Users

│   ├── Media

│   ├── Payments

│   ├── Notifications

│   ├── Search

│   ├── Settings

│   ├── Analytics

│   ├── Activity Logs

│   └── Shared Components

│

├── Tenant 1

│   Find My Interior

│

├── Tenant 2

│   TRUEDIAL

│

├── Tenant 3

│   BestInBharat

│

└── Future Products

One Platform.

Unlimited Products.

---

# SINGLE IDENTITY

The platform has only one identity system.

Every person owns exactly one account.

Example

Aryan registers on Find My Interior.

↓

A User record is created.

↓

Later Aryan opens TRUEDIAL.

↓

The platform detects the same authenticated user.

↓

Aryan is immediately logged in.

↓

No additional registration.

↓

No duplicate account.

Users should never have to remember multiple passwords for products built on the Integral Platform.

---

# SHARED USERS

There must only be one users table.

Correct

users

Incorrect

findmyinterior_users

truedial_users

bestinbharat_users

future_users

Every module references the same users table.

---

# SHARED AUTHENTICATION

Authentication is centralized.

Every product uses the same

User

Session

Access Token

Refresh Token

Password

Email

Phone Number

Identity Provider

Logging into one product authenticates the user across every product.

---

# SHARED PROFILE

Every user owns one profile.

Fields include

Name

Email

Phone

Avatar

Password

Language

Timezone

Notification Preferences

Profile changes are reflected instantly across every product.

There is no profile duplication.

---

# SHARED DATABASE

The platform uses one database.

Correct

platform_database

Incorrect

findmyinterior_database

truedial_database

bestinbharat_database

Every product stores its data inside the same database while maintaining isolation through tenant-aware design.

---

# TENANT MODEL

Every product is represented as a Tenant.

Example

Tenant 1

Find My Interior

Tenant 2

TRUEDIAL

Tenant 3

BestInBharat

Future products become additional tenants.

The platform should support unlimited tenants without architectural changes.

---

# TENANT CONTEXT

Every request must resolve the active tenant before business logic executes.

Tenant resolution may be based on

Domain

Subdomain

Configuration

Route

Middleware

Tenant context should be available throughout the request lifecycle.

---

# DATA ISOLATION

Shared infrastructure does NOT mean shared business data.

Example

Businesses

Offers

Reviews

Memberships

Orders

Analytics

must always be isolated by tenant.

Every tenant-aware table must contain a tenant identifier.

Example

Business

id

tenant_id

owner_id

name

This ensures products remain logically independent while sharing infrastructure.

---

# CROSS-PRODUCT ACCESS

A user account is global.

Business data is product-specific.

Example

Aryan owns

Interior Company

inside Find My Interior.

That business should NOT automatically appear inside TRUEDIAL.

The account is shared.

The business belongs only to its tenant.

---

# SHARED SERVICES

Every product must reuse the platform services.

Authentication

Authorization

Roles

Permissions

Media

Storage

Notifications

Payments

Reviews

Search

Settings

Activity Logs

Email

Logging

Queue System

Caching

File Uploads

No product should duplicate these services.

---

# SHARED MEDIA

Only one media library exists.

Images

Videos

Documents

Logos

Certificates

Gallery Images

Each media record references its owner and tenant when required.

Media upload logic should never be duplicated.

---

# SHARED NOTIFICATIONS

The notification service is global.

Notification types

System

Membership

Business

Payment

Security

Marketing (Future)

Notifications should be filtered according to tenant context.

---

# SHARED PAYMENTS

Only one payment infrastructure exists.

Payments

Invoices

Transactions

Refunds

Subscriptions

Webhooks

Each payment record belongs to the appropriate tenant.

Payment processing logic is shared across the platform.

---

# SHARED MEMBERSHIPS

A user may own multiple memberships across products.

Example

Find My Interior Premium

TRUEDIAL Premium

Future Product Premium

Each membership belongs to its respective tenant.

Memberships do not interfere with each other.

---

# SHARED SEARCH

One search infrastructure.

Separate tenant-aware indexes.

Search results must only return data belonging to the active tenant.

---

# SHARED ANALYTICS

Analytics exist on three levels.

Platform Analytics

Overall ecosystem health.

Tenant Analytics

Performance of an individual product.

Business Analytics

Performance of individual businesses.

Analytics should never leak tenant data.

---

# SHARED SETTINGS

Platform Settings

Global configuration.

Tenant Settings

Branding

Theme

Logo

Business Rules

Enabled Modules

Payment Configuration

SEO

Every tenant may override platform defaults where permitted.

---

# SHARED ROLES

Identity is global.

Permissions are tenant-specific.

Example

Aryan

Customer

↓

Find My Interior

Vendor

↓

TRUEDIAL

Administrator

↓

BestInBharat

Same account.

Different permissions.

---

# MODULE ENABLEMENT

Each tenant controls which modules are enabled.

Example

Find My Interior

Business Listings

Projects

Professionals

Suppliers

TRUEDIAL

Business Directory

Offers

Privilege Card

Memberships

Future products may enable different modules without affecting others.

---

# CROSS-PRODUCT NAVIGATION

Users should experience seamless movement between products.

Example

Login once.

↓

Open Find My Interior.

↓

Navigate to TRUEDIAL.

↓

Already authenticated.

↓

Navigate to BestInBharat.

↓

Already authenticated.

No additional login should be required.

---

# FUTURE PRODUCT ONBOARDING

Launching a new product should require only

Create Tenant

Configure Branding

Enable Modules

Configure Domain

Configure Navigation

Deploy

No new authentication system.

No new user database.

No duplicated backend.

---

# DEVELOPMENT RULES

Every new feature must answer these questions before implementation.

Can this reuse an existing service?

Can this reuse an existing component?

Can this reuse an existing API?

Can this reuse an existing database structure?

Can this benefit future products?

If the answer is yes, extend the shared platform instead of creating a duplicate.

---

# PROHIBITED PRACTICES

Never create

Multiple authentication systems

Multiple users tables

Multiple media services

Multiple payment systems

Multiple notification systems

Multiple review engines

Product-specific copies of shared services

Hardcoded tenant names

Hardcoded branding

Duplicate business logic

---

# SCALABILITY PRINCIPLES

The architecture must support

Unlimited Products

Unlimited Users

Unlimited Businesses

Unlimited Membership Plans

Unlimited Offers

Unlimited Domains

Unlimited Tenants

without requiring structural redesign.

---

# SUCCESS CRITERIA

The architecture is considered successful when

✓ One account works across every product.

✓ One backend powers every product.

✓ One database supports every product.

✓ Shared services are reused.

✓ Products remain logically isolated.

✓ Tenant context is enforced.

✓ No duplicate authentication exists.

✓ No duplicate user tables exist.

✓ Future products can be added with minimal development.

✓ Existing products remain backward compatible.

✓ The platform is scalable, maintainable, and production-ready.

---

# FINAL ARCHITECTURAL PRINCIPLE

The Integral Platform is not a collection of separate websites.

It is a unified ecosystem.

Every new product should strengthen the platform by reusing its shared capabilities instead of creating new ones.

Build the platform once.

Launch products on top of it forever.