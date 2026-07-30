# TRUEDIAL PLATFORM
# BACKEND ARCHITECTURE
# Version 1.0

---

# PURPOSE

This document defines the backend architecture of the entire TRUEDIAL Platform.

Laravel is the heart of the platform.

Everything revolves around it.

The backend is the ONLY Source of Truth.

Every frontend, mobile application, admin panel and future platform must consume the backend.

No exceptions.

---

# CORE PHILOSOPHY

The Backend is NOT made for TRUEDIAL.

The Backend is made for THE PLATFORM.

TRUEDIAL is only one client.

FindMyInterior is another client.

Future SaaS products are more clients.

The backend should never know about specific frontend implementations.

It only exposes business capabilities.

---

# BACKEND RESPONSIBILITIES

Laravel owns ALL business logic.

Examples

✓ Authentication

✓ Authorization

✓ Permissions

✓ Validation

✓ Search

✓ Reviews

✓ Business Listings

✓ Categories

✓ CRM

✓ Marketing

✓ Analytics

✓ Wallet

✓ Subscription

✓ Payments

✓ Notifications

✓ Email

✓ WhatsApp

✓ SMS

✓ Reports

✓ AI Services

✓ Marketplace

✓ Jobs

✓ Academy

✓ Consulting

Frontend owns NONE of these.

---

# BACKEND LAYERS

Backend must follow this architecture.

Routes

↓

Controllers

↓

Services

↓

Repositories

↓

Models

↓

Database

Never skip layers.

---

# CONTROLLERS

Controllers should NEVER contain business logic.

Controllers should only:

• Validate Request

• Call Service

• Return Response

Example

BAD

PaymentController

- Calculates pricing
- Updates wallet
- Sends email
- Creates subscription

GOOD

PaymentController

↓

PaymentService

↓

SubscriptionService

↓

NotificationService

↓

Response

Controllers should stay small.

Maximum preferred size:

300 lines

---

# SERVICES

Every business rule belongs here.

Examples

BusinessService

ReviewService

OfferService

SubscriptionService

WalletService

CampaignService

AnalyticsService

ConsultingService

AcademyService

CRMService

Services can communicate.

Controllers cannot.

---

# REPOSITORIES

Repositories only interact with database.

They never:

Send Emails

Send Notifications

Calculate Prices

Call External APIs

Repositories only perform CRUD.

---

# MODELS

Models represent database entities.

Models should contain:

Relationships

Scopes

Accessors

Mutators

Simple helpers

Models should NOT contain:

Business workflows

Payment logic

Marketing logic

Analytics calculations

Large methods

---

# MODULE STRUCTURE

Every module must have its own structure.

Example

Modules/

Authentication/

Business/

Categories/

Reviews/

Offers/

CRM/

Marketing/

Analytics/

Wallet/

Subscription/

Payments/

Consulting/

Academy/

Jobs/

Podcast/

News/

Notifications/

AI/

Marketplace/

Each module should be independent.

---

# STANDARD MODULE STRUCTURE

Each module should contain:

Controller/

Service/

Repository/

Model/

Policy/

Request/

Resource/

Routes/

Events/

Listeners/

Jobs/

Notifications/

Tests/

Documentation/

If a module grows large,

split it.

Never create giant files.

---

# SHARED SERVICES

Some services belong to the platform.

Examples

File Upload

Email

SMS

WhatsApp

Notification

Authentication

OTP

Logging

Audit

Storage

These should never be duplicated.

Every module reuses them.

---

# API RULES

Every endpoint must:

Validate Request

Authenticate User

Authorize Action

Call Service

Return Standard Response

Nothing else.

---

# STANDARD RESPONSE FORMAT

Every API should return

{
    success,
    message,
    data,
    meta,
    errors
}

Never return inconsistent responses.

Never return random objects.

Consistency is mandatory.

---

# VALIDATION

Validation belongs ONLY in Laravel.

Never trust frontend validation.

Every endpoint validates:

Required fields

Data types

Ownership

Permissions

Business rules

---

# AUTHORIZATION

Never check permissions in React.

Never check permissions in Mobile.

Backend decides everything.

Examples

Can edit listing

Can delete offer

Can approve vendor

Can create campaign

Can purchase subscription

Backend decides.

---

# EVENTS

Modules communicate using Events.

Example

Review Created

↓

Update Rating

↓

Notify Vendor

↓

Update Analytics

↓

Award Reward Points

Each responsibility should be separated.

---

# QUEUES

Expensive operations must use queues.

Examples

Emails

SMS

WhatsApp

Image Processing

PDF Generation

Reports

AI Generation

Analytics

Never block API requests.

---

# CACHE

Cache only where beneficial.

Examples

Categories

Homepage

Popular Businesses

Cities

States

Configuration

Feature Flags

Never cache dynamic user data incorrectly.

---

# FILE STORAGE

Frontend never stores files.

Files always pass through backend.

Backend validates

↓

Stores

↓

Returns URL

Storage Providers

AWS S3

Cloud Storage

Local Development

Storage provider must be configurable.

---

# NOTIFICATIONS

Notification channels

Database

Email

SMS

WhatsApp

Push Notification

Future channels

Telegram

Slack

Webhook

Notification logic belongs inside NotificationService.

---

# PAYMENT ARCHITECTURE

Payment flow

Frontend

↓

Payment API

↓

Gateway

↓

Verification

↓

Transaction

↓

Subscription

↓

Notification

Never activate subscriptions from frontend.

Only backend.

---

# SUBSCRIPTIONS

Subscription rules belong ONLY in backend.

Never calculate:

Expiry

Renewal

Plan Limits

Credits

Listing Limits

Inside frontend.

---

# SEARCH

Search logic belongs in backend.

Frontend sends filters.

Backend decides:

Ranking

Sorting

Scoring

Pagination

Recommendations

Never duplicate search logic.

---

# ANALYTICS

Backend owns analytics.

Track

Views

Clicks

Calls

WhatsApp

Directions

Leads

Conversions

Campaign Performance

Never calculate analytics inside frontend.

---

# FEATURE FLAGS

Backend controls

Academy

Jobs

Podcast

News

AI

Marketplace

Consulting

Franchise

Frontend only reads configuration.

---

# MULTI TENANT

Every request identifies:

Tenant

Platform

Version

Locale

Backend loads configuration.

Never hardcode tenant behavior.

---

# BACKWARD COMPATIBILITY

Never break existing APIs.

If changing response shape,

Create

v2

Do NOT silently break clients.

---

# LOGGING

Every critical action should be logged.

Examples

Login

Vendor Approval

Payment

Subscription

Offer Creation

Campaign Launch

Business Verification

Logs should be searchable.

---

# AUDIT TRAIL

Admin should know

Who

Did What

When

From Where

Why

Every critical change must be auditable.

---

# TESTING

Every module should include

Unit Tests

Feature Tests

API Tests

Authorization Tests

Validation Tests

Critical business logic should never be untested.

---

# PERFORMANCE

Target

Fast APIs

Efficient Queries

Pagination

Lazy Loading

Indexes

Queue Heavy Tasks

Avoid

N+1 Queries

Duplicate Queries

Large Payloads

Repeated Calculations

---

# NEVER DO THIS

❌ Duplicate Business Logic

❌ Duplicate Controllers

❌ Duplicate Services

❌ Duplicate Payment Logic

❌ Duplicate Authentication

❌ Duplicate Notification Logic

❌ Duplicate Validation

❌ Duplicate API Responses

❌ Frontend Business Logic

❌ Mobile Business Logic

---

# FINAL RULE

The backend is a reusable platform.

Every new frontend should work by consuming existing APIs.

If a new product requires rewriting backend business logic instead of configuring modules or extending services, the architecture has failed.

Laravel is not the backend of one website.

Laravel is the engine of the entire platform.