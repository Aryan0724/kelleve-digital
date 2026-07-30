# TRUEDIAL PLATFORM
# ROUTING ARCHITECTURE MAP
# Version 1.0

---

# PURPOSE

This document defines the routing architecture of the TRUEDIAL Platform.

It explains

- Route Organization
- Route Groups
- Middleware
- Guards
- API Hierarchy
- Web Routing
- Internal Routing

Every route in the platform follows a predictable structure.

---

# ROUTING PHILOSOPHY

Routes are entry points.

Routes should

Be predictable.

Be RESTful.

Be versioned.

Be secure.

Be modular.

Routes never contain business logic.

Routes only direct requests.

---

# HIGH LEVEL ROUTING

```
Client

↓

Domain

↓

Route

↓

Middleware

↓

Authentication

↓

Authorization

↓

Controller

↓

Service

↓

Repository

↓

Database
```

Routing stops after handing control to the controller.

---

# ROOT ROUTES

```
/

↓

Landing

/api

↓

REST API

/admin

↓

Administration

/docs

↓

API Documentation

/health

↓

Health Check
```

Every public endpoint begins here.

---

# API VERSIONING

```
/api/v1

↓

Authentication

Businesses

Customers

Vendors

Payments

Marketing

Analytics

Notifications

AI
```

Future versions

```
/api/v2

/api/v3
```

Older versions remain functional.

---

# ROUTE GROUPS

```
Routes

│

├── Public

├── Protected

├── Admin

├── Internal

└── Webhooks
```

Each group has dedicated middleware.

---

# PUBLIC ROUTES

Accessible without authentication.

Examples

```
GET /businesses

GET /businesses/{slug}

GET /categories

GET /cities

GET /offers

GET /search

GET /reviews
```

Public routes are rate limited.

---

# AUTHENTICATION ROUTES

```
POST /auth/register

POST /auth/login

POST /auth/logout

POST /auth/verify

POST /auth/refresh

POST /auth/forgot-password

POST /auth/reset-password

POST /auth/otp
```

Owned by Authentication Module.

---

# USER ROUTES

```
GET /user

PUT /user

DELETE /user

GET /user/profile

PUT /user/preferences

PUT /user/password

GET /user/activity
```

User manages personal information.

---

# CUSTOMER ROUTES

```
/customers

/customers/profile

/customers/bookings

/customers/reviews

/customers/favorites

/customers/wallet

/customers/rewards

/customers/notifications
```

Protected by customer authentication.

---

# VENDOR ROUTES

```
/vendors

/vendors/dashboard

/vendors/businesses

/vendors/leads

/vendors/crm

/vendors/marketing

/vendors/analytics

/vendors/subscription
```

Protected by vendor permissions.

---

# BUSINESS ROUTES

```
/businesses

/businesses/{id}

/businesses/{id}/services

/businesses/{id}/products

/businesses/{id}/staff

/businesses/{id}/media

/businesses/{id}/reviews

/businesses/{id}/offers
```

Business resources remain hierarchical.

---

# BOOKING ROUTES

```
/bookings

/bookings/{id}

/bookings/history

/bookings/calendar

/bookings/status
```

Booking module owns scheduling.

---

# PAYMENT ROUTES

```
/payments

/payments/create

/payments/verify

/payments/history

/payments/refunds
```

Payments require authentication.

---

# WALLET ROUTES

```
/wallet

/wallet/history

/wallet/transactions

/wallet/rewards
```

Wallet remains independent.

---

# CRM ROUTES

```
/crm/leads

/crm/contacts

/crm/pipelines

/crm/tasks

/crm/activities

/crm/notes
```

CRM endpoints belong only to CRM.

---

# MARKETING ROUTES

```
/marketing/campaigns

/marketing/offers

/marketing/coupons

/marketing/referrals

/marketing/templates

/marketing/automation
```

Marketing remains modular.

---

# REVIEW ROUTES

```
/reviews

/reviews/{id}

/reviews/report

/reviews/vote
```

Moderation handled separately.

---

# ANALYTICS ROUTES

```
/analytics/dashboard

/analytics/revenue

/analytics/business

/analytics/customers

/analytics/campaigns

/analytics/reports
```

Analytics APIs are read-heavy.

---

# NOTIFICATION ROUTES

```
/notifications

/notifications/read

/notifications/preferences

/notifications/history
```

Notification management only.

---

# SEARCH ROUTES

```
/search

/search/businesses

/search/categories

/search/locations

/search/suggestions
```

Search logic remains centralized.

---

# AI ROUTES

```
/ai/chat

/ai/recommendations

/ai/content

/ai/insights

/ai/search
```

AI endpoints use centralized AI services.

---

# MEDIA ROUTES

```
/media/upload

/media/delete

/media/download

/media/optimize
```

Uploads always require validation.

---

# SUBSCRIPTION ROUTES

```
/subscriptions

/subscriptions/plans

/subscriptions/current

/subscriptions/upgrade

/subscriptions/history
```

Subscription controls platform access.

---

# SETTINGS ROUTES

```
/settings

/settings/profile

/settings/branding

/settings/integrations

/settings/preferences
```

Settings remain module-specific.

---

# ADMIN ROUTES

```
/admin

/admin/users

/admin/tenants

/admin/businesses

/admin/reports

/admin/moderation

/admin/feature-flags

/admin/system

/admin/logs
```

Protected by administrator permissions.

---

# WEBHOOK ROUTES

```
/webhooks/payment

/webhooks/whatsapp

/webhooks/email

/webhooks/sms

/webhooks/oauth
```

Every webhook verifies signatures before processing.

---

# INTERNAL ROUTES

Internal services only.

Examples

```
/internal/queues

/internal/events

/internal/health

/internal/jobs

/internal/cache
```

Never exposed publicly.

---

# MIDDLEWARE FLOW

Every request passes through

```
Request

↓

Maintenance Mode

↓

Rate Limiter

↓

Tenant Resolver

↓

Authentication

↓

Authorization

↓

Localization

↓

Validation

↓

Controller
```

Middleware order is deterministic.

---

# ROUTE MIDDLEWARE

Common middleware

Authentication

Authorization

Tenant

Rate Limiting

Localization

Logging

Feature Flags

Maintenance

Security Headers

Middleware remains reusable.

---

# ROUTE NAMING

Examples

```
business.index

business.show

business.store

business.update

business.destroy

booking.create

payment.verify

review.submit
```

Names remain consistent across modules.

---

# ROUTE OWNERSHIP

Every route belongs to exactly one module.

Examples

Authentication

↓

Authentication Routes

Marketing

↓

Marketing Routes

CRM

↓

CRM Routes

Payment

↓

Payment Routes

Cross-module routing is prohibited.

---

# URL DESIGN

Rules

Use nouns.

Use lowercase.

Use hyphens.

Avoid verbs.

Avoid abbreviations.

Examples

Good

```
/businesses

/customer-reviews

/subscription-plans
```

Bad

```
/getBusiness

/doPayment

/updateReview
```

---

# DEPENDENCY FLOW

```
Route

↓

Middleware

↓

Controller

↓

Service

↓

Repository

↓

Model
```

Routes never access business logic directly.

---

# SECURITY

Protect routes using

Authentication

Policies

Permissions

Rate Limiting

Tenant Isolation

Feature Flags

Audit Logging

Security begins before controller execution.

---

# PERFORMANCE

Optimize routing by

Grouping routes

Caching routes

Lazy loading controllers

Minimal middleware

Avoid duplicate route definitions.

---

# API DOCUMENTATION

Every route documents

Purpose

Authentication

Parameters

Request Body

Responses

Errors

Permissions

Examples

Documentation remains synchronized with implementation.

---

# ROUTING RULES

Always

Version APIs

Group related routes

Use middleware

Use REST conventions

Name routes consistently

Never

Put logic in routes

Duplicate endpoints

Expose internal routes

Skip middleware

Hardcode permissions

---

# AI IMPLEMENTATION RULES

AI coding agents must

Follow existing route groups.

Never create duplicate endpoints.

Reuse middleware.

Respect module ownership.

Maintain REST conventions.

Update this document whenever routing changes.

---

# FINAL RULE

Routes are the gateway into the TRUEDIAL Platform.

They should remain simple, predictable, secure, and modular.

Every route belongs to one module.

Every request follows one path.

Every endpoint exists for one purpose.