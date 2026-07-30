# TRUEDIAL PLATFORM
# BACKEND ARCHITECTURE MAP
# Version 1.0

---

# PURPOSE

This document defines the complete backend architecture of the TRUEDIAL Platform.

It explains

- Folder Organization
- Layer Responsibilities
- Request Lifecycle
- Business Logic Placement
- Module Structure
- Dependency Rules

This is the technical blueprint for every Laravel developer and AI coding agent.

---

# BACKEND PHILOSOPHY

The backend is the heart of the platform.

Every business rule lives here.

Every client communicates with the backend.

The backend owns

Authentication

Authorization

Business Logic

Database

Payments

Notifications

Analytics

AI Orchestration

Audit Logs

Tenant Management

The frontend never owns business logic.

---

# HIGH LEVEL ARCHITECTURE

```
                Web (Next.js)
                      │
                      │
                Mobile (Expo)
                      │
                      │
          Future Products / APIs
                      │
                      ▼
              Laravel API Backend
                      │
 ┌────────────────────────────────────────────┐
 │ Authentication Layer                       │
 ├────────────────────────────────────────────┤
 │ Middleware Layer                           │
 ├────────────────────────────────────────────┤
 │ Controllers                                │
 ├────────────────────────────────────────────┤
 │ Services                                   │
 ├────────────────────────────────────────────┤
 │ Repositories                               │
 ├────────────────────────────────────────────┤
 │ Models                                     │
 ├────────────────────────────────────────────┤
 │ PostgreSQL                                 │
 └────────────────────────────────────────────┘
                      │
                      ▼
Redis • Queue • Storage • AI • Payments • Notifications
```

---

# ROOT STRUCTURE

```
app/

├── Modules/
├── Shared/
├── Http/
├── Console/
├── Events/
├── Jobs/
├── Listeners/
├── Notifications/
├── Policies/
├── Providers/
├── Exceptions/
├── Helpers/
└── Support/
```

Application code belongs inside these folders only.

---

# MODULE STRUCTURE

Every business domain is isolated.

```
Modules/

Authentication/

Vendor/

Customer/

Business/

Admin/

CRM/

Marketing/

Analytics/

Payments/

Wallet/

Reviews/

Booking/

Subscription/

Notification/

Search/

Media/

AI/

Referral/

Settings/
```

Each module owns its own business logic.

---

# STANDARD MODULE STRUCTURE

Every module follows the same structure.

```
Module/

Controllers/

Services/

Repositories/

Models/

Requests/

Resources/

Policies/

Events/

Listeners/

Jobs/

Notifications/

DTOs/

Enums/

Traits/

Actions/

Observers/

Tests/
```

Consistency is mandatory.

---

# SHARED LAYER

Shared functionality belongs here.

```
Shared/

Services/

Traits/

Contracts/

Helpers/

Enums/

Constants/

Middleware/

Validators/

Utilities/
```

Never duplicate reusable code inside modules.

---

# HTTP LAYER

Contains

Controllers

Middleware

Form Requests

API Resources

Guards

Routes

Responsibilities

Receive request

Validate

Authorize

Call Service

Return Response

Nothing else.

---

# CONTROLLERS

Controllers are thin.

Responsibilities

Receive Request

Validate Input

Authorize User

Call Service

Return Resource

Controllers never

Access database directly

Contain business logic

Contain calculations

Contain workflows

---

# SERVICES

Services contain business logic.

Responsibilities

Validation Rules

Business Rules

Transactions

Workflow Coordination

External Integrations

Event Dispatching

Permission Checks

Services are the brain of the backend.

---

# REPOSITORIES

Repositories own persistence.

Responsibilities

Queries

Filtering

Pagination

Database Access

Repositories never

Contain business rules

Call controllers

Return HTTP responses

---

# MODELS

Models represent database entities.

Responsibilities

Relationships

Scopes

Accessors

Mutators

Casting

Models remain lightweight.

---

# REQUESTS

Form Requests

Validate

Authorize

Sanitize

Never perform business logic.

---

# API RESOURCES

Responsibilities

Transform Models

Hide Internal Fields

Standardize Responses

Resources never query databases.

---

# POLICIES

Every sensitive action requires policies.

Examples

BusinessPolicy

OfferPolicy

ReviewPolicy

CampaignPolicy

WalletPolicy

Permissions never belong in controllers.

---

# EVENTS

Events communicate across modules.

Examples

BusinessCreated

PaymentCompleted

ReviewSubmitted

CampaignPublished

SubscriptionRenewed

Events reduce coupling.

---

# LISTENERS

Listeners react to events.

Examples

Send Welcome Email

Update Analytics

Award Points

Notify Vendor

Generate Invoice

Listeners never modify request flow.

---

# JOBS

Long-running tasks become jobs.

Examples

AI Analysis

Image Processing

Email Campaigns

Report Generation

Data Export

Notification Delivery

Jobs run asynchronously.

---

# NOTIFICATIONS

Notification channels

Email

SMS

WhatsApp

Push

In-App

All notifications use one centralized system.

---

# MIDDLEWARE

Middleware responsibilities

Authentication

Tenant Resolution

Localization

Rate Limiting

Permission Checks

Request Logging

Feature Flags

No business logic inside middleware.

---

# SERVICE PROVIDERS

Responsibilities

Dependency Injection

Bindings

Singletons

Observers

Event Registration

Providers configure the application.

---

# DEPENDENCY FLOW

Backend follows strict dependency rules.

```
Request

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

↓

Database

↓

Resource

↓

Response
```

Flow is always one direction.

---

# DATABASE ACCESS

Database access occurs only through

Repositories

ORM

Transactions

Never from

Controllers

Resources

Policies

Views

---

# TRANSACTIONS

Transactions protect

Payments

Wallet

Bookings

Subscriptions

Business Registration

Financial Operations

Critical workflows must be atomic.

---

# EXTERNAL SERVICES

Integrations include

Payment Gateway

WhatsApp API

SMS Provider

Email Provider

Maps API

AI Provider

Cloud Storage

Every integration is wrapped inside Services.

---

# QUEUE LAYER

Queued Tasks

Email

SMS

Push

AI

Media Processing

Analytics

Imports

Exports

Never block API responses.

---

# CACHE LAYER

Redis stores

Sessions

Rate Limits

Frequently Used Data

Analytics Cache

Feature Flags

Temporary Results

Cache never owns business data.

---

# STORAGE LAYER

Storage handles

Images

Documents

Invoices

Business Verification

Exports

Reports

Backups

Application servers remain stateless.

---

# AI LAYER

AI services are isolated.

Responsibilities

Prompt Routing

Model Selection

Recommendation Engine

Lead Scoring

Content Generation

Search Intelligence

AI never modifies database directly.

---

# PAYMENT LAYER

Payment services manage

Orders

Transactions

Wallet

Refunds

Invoices

Subscriptions

Financial calculations remain centralized.

---

# ANALYTICS LAYER

Collect

Events

KPIs

Funnels

Revenue

Marketing Metrics

Search Metrics

Business Metrics

Analytics never slows user requests.

---

# SECURITY LAYER

Enforce

Authentication

Authorization

Validation

Encryption

Audit Logs

Rate Limiting

Security applies at every layer.

---

# MULTI-TENANCY

Every request resolves

Platform

↓

Tenant

↓

User

↓

Permissions

↓

Feature Flags

↓

Business Logic

Tenant isolation is automatic.

---

# ERROR HANDLING

Errors flow through

Exception

↓

Handler

↓

Logger

↓

Standard Response

Users never receive internal stack traces.

---

# LOGGING

Log

Authentication

Payments

Business Events

Errors

Warnings

Security Events

System Health

Logs remain centralized.

---

# TESTING

Every module contains

Unit Tests

Feature Tests

Integration Tests

Critical workflows require automated coverage.

---

# BACKEND RULES

Always

Use Services

Use Repositories

Use DTOs

Use Policies

Use Events

Use Queues

Use Resources

Never

Duplicate Logic

Query Database in Controllers

Bypass Services

Bypass Policies

Return Raw Models

---

# AI IMPLEMENTATION RULES

AI coding agents must

Follow existing module structure.

Never create new architectural patterns.

Reuse shared services.

Reuse repositories.

Reuse middleware.

Reuse validation.

Never duplicate business logic.

Always update architecture when introducing structural changes.

---

# FINAL RULE

Every backend request must follow the same architecture.

Request

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

↓

Database

↓

Resource

↓

Response

The backend is the single source of truth for every business operation in the TRUEDIAL Platform.