# TRUEDIAL PLATFORM
# TENANT ARCHITECTURE MAP
# Version 1.0

---

# PURPOSE

This document defines the multi-tenant architecture of the TRUEDIAL Platform.

It explains

- Tenant Isolation
- Tenant Hierarchy
- Shared Resources
- Tenant Resources
- Data Ownership
- Feature Isolation
- White-label Support

The platform is designed to serve multiple independent organizations from a single backend.

---

# MULTI-TENANT PHILOSOPHY

A tenant is an independent organization using the platform.

Every tenant has

Users

Businesses

Branding

Settings

Subscriptions

Analytics

Marketing

CRM

Data belonging to one tenant must never be accessible by another tenant.

---

# HIGH LEVEL TENANT ARCHITECTURE

```
                    TRUEDIAL PLATFORM

                            │

        ┌───────────────────┼───────────────────┐

        │                   │                   │

    Tenant A           Tenant B           Tenant C

        │                   │                   │

 ┌──────┴──────┐      ┌─────┴─────┐      ┌──────┴──────┐

 Businesses     Users  Businesses  Users Businesses     Users

        │                   │                   │

 Marketing      CRM     Analytics      AI     Payments

```

Each tenant behaves like an independent platform.

---

# TENANT HIERARCHY

```
Platform

↓

Tenant

↓

Businesses

↓

Users

↓

Customers

↓

Operations
```

Ownership flows downward.

---

# TENANT IDENTIFIER

Every tenant has

UUID

Slug

Primary Domain

Status

Plan

Branding

Settings

Integrations

Tenant identity is immutable.

---

# TENANT RESOLUTION

Every request resolves

```
Incoming Request

↓

Domain

↓

Subdomain

↓

Header

↓

API Token

↓

Tenant Resolution

↓

Tenant Context Loaded

↓

Continue Request
```

Tenant context is established before business logic executes.

---

# TENANT CONTEXT

Every request carries

Tenant ID

Tenant Configuration

Feature Flags

Subscription Plan

Localization

Branding

Permissions

The context is available throughout the request lifecycle.

---

# TENANT OWNERSHIP

Every operational record belongs to exactly one tenant.

Examples

Business

Campaign

Booking

Review

Lead

Payment

Analytics

Media

Notifications

Ownership is explicit using

tenant_id

---

# SHARED DATA

Shared data belongs to the platform.

Examples

Countries

States

Cities

Languages

Currencies

Roles

Permissions

Feature Definitions

System Settings

Shared data is read-only for tenants.

---

# TENANT DATA

Tenant-specific data includes

Businesses

Users

Campaigns

CRM

Bookings

Wallets

Offers

Analytics

Reviews

Notifications

Each tenant controls its own data.

---

# BUSINESS OWNERSHIP

```
Tenant

↓

Business

↓

Products

↓

Services

↓

Staff

↓

Bookings

↓

Reviews
```

Businesses never exist without a tenant.

---

# USER OWNERSHIP

```
Tenant

↓

Users

↓

Roles

↓

Permissions

↓

Sessions
```

A user belongs to one tenant unless explicitly designed for multi-tenant access.

---

# TENANT BRANDING

Each tenant controls

Logo

Colors

Fonts

Theme

Email Branding

SMS Branding

WhatsApp Branding

Invoices

Reports

Branding never affects business logic.

---

# TENANT SETTINGS

Each tenant has configurable settings.

Examples

Timezone

Language

Currency

Business Hours

Tax Rules

Notification Preferences

Feature Configuration

Settings remain isolated.

---

# FEATURE FLAGS

Every feature can be enabled

Per Platform

Per Tenant

Per Plan

Per User

Feature availability is determined before execution.

---

# SUBSCRIPTION PLANS

Subscription controls

Maximum Businesses

Maximum Users

Storage Limits

AI Usage

Marketing Limits

CRM Limits

Analytics Features

Premium Modules

Plans control capabilities—not architecture.

---

# DOMAIN MANAGEMENT

Supported

Primary Domain

Subdomain

Custom Domain

White-label Domain

Examples

```
tenant.truedial.com

business.truedial.com

mycompany.com
```

Domain resolution automatically determines tenant context.

---

# WHITE-LABEL SUPPORT

Each tenant may customize

Brand Name

Logo

Colors

Email Templates

Invoices

Reports

Notification Templates

The backend remains shared.

---

# DATA ISOLATION

Every query automatically scopes by

tenant_id

No cross-tenant query should execute without explicit platform authorization.

Isolation is mandatory.

---

# AUTHORIZATION

Every request verifies

Authenticated User

↓

Tenant Membership

↓

Role

↓

Permission

↓

Ownership

↓

Feature Access

Authorization is tenant-aware.

---

# STORAGE ISOLATION

Each tenant has isolated storage paths.

Example

```
storage/

tenant-a/

tenant-b/

tenant-c/
```

Media remains logically separated.

---

# CACHE ISOLATION

Cache keys include tenant identifiers.

Example

```
tenant:{id}:dashboard

tenant:{id}:analytics

tenant:{id}:settings
```

No cache leakage between tenants.

---

# QUEUE ISOLATION

Queued jobs include tenant context.

Example

```
Job

↓

Tenant Context

↓

Queue

↓

Worker

↓

Restore Context

↓

Execute
```

Workers always restore tenant information before execution.

---

# ANALYTICS ISOLATION

Analytics is collected

Per Tenant

Per Business

Per User

Platform administrators may view aggregated platform analytics.

Tenants view only their own analytics.

---

# SEARCH ISOLATION

Search results are filtered by

Tenant

Business Visibility

Permissions

Status

Private data never appears across tenant boundaries.

---

# API ISOLATION

Every protected API automatically resolves

Tenant

↓

Permissions

↓

Resources

↓

Response

Clients never manually specify another tenant.

---

# EVENT ISOLATION

Events always carry

Tenant ID

User ID

Business ID

Correlation ID

Events remain traceable across distributed systems.

---

# BACKUPS

Backups support

Entire Platform

Single Tenant

Single Business

Selective Restoration

Tenant recovery should not impact other tenants.

---

# TENANT LIFECYCLE

```
Tenant Created

↓

Branding

↓

Subscription

↓

Configuration

↓

Businesses

↓

Users

↓

Go Live

↓

Growth

↓

Renewal

↓

Archive (if required)
```

Every tenant follows the same lifecycle.

---

# PLATFORM ADMINISTRATORS

Platform administrators can

Create Tenants

Suspend Tenants

Upgrade Plans

Manage Domains

View Platform Analytics

Restore Backups

Platform administrators bypass tenant isolation only through authorized system operations.

---

# FUTURE SCALABILITY

The architecture supports

Unlimited Tenants

Millions of Users

Millions of Businesses

Regional Deployments

Dedicated Tenant Infrastructure

Migration to dedicated databases if required.

The tenant model should not require architectural changes as the platform grows.

---

# TENANT RULES

Always

Resolve Tenant First

Scope Every Query

Store tenant_id

Respect Feature Flags

Separate Storage

Separate Cache

Separate Analytics

Never

Mix Tenant Data

Share Private Resources

Hardcode Tenant Logic

Bypass Tenant Resolution

---

# AI IMPLEMENTATION RULES

AI coding agents must

Always maintain tenant isolation.

Never create tables without tenant awareness unless they are platform-wide.

Never execute cross-tenant queries.

Reuse tenant middleware.

Propagate tenant context to queues, events, and notifications.

Update this document whenever tenant architecture changes.

---

# FINAL RULE

The TRUEDIAL Platform is one application serving many independent organizations.

Every tenant should experience the platform as if it were built exclusively for them.

Shared infrastructure.

Isolated data.

Independent operations.

Zero cross-tenant leakage.