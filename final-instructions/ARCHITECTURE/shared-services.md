# TRUEDIAL PLATFORM
# SHARED SERVICES ARCHITECTURE MAP
# Version 1.0

---

# PURPOSE

This document defines the shared services used across the TRUEDIAL Platform.

Shared Services contain reusable business capabilities that can be consumed by multiple modules without duplicating logic.

Every shared service should

Be Stateless

Be Reusable

Be Independent

Be Testable

Be Framework Agnostic where possible

---

# SHARED SERVICE PHILOSOPHY

Business modules should own business logic.

Shared Services should own common platform capabilities.

Example

Authentication

Storage

Payments

Notifications

Analytics

Search

AI

Media

Permissions

Audit

No module should reimplement these capabilities.

---

# HIGH LEVEL ARCHITECTURE

```
                 Business Modules

                        │

 ┌──────────────────────────────────────────┐
 │                                          │
 │ Customer  Vendor  CRM  Marketing  Admin  │
 │                                          │
 └──────────────────────────────────────────┘

                        │

                Shared Services Layer

                        │

 ┌──────────────────────────────────────────┐
 │ Auth                                    │
 │ Payment                                 │
 │ Wallet                                  │
 │ Notification                            │
 │ Analytics                               │
 │ AI                                      │
 │ Search                                  │
 │ Storage                                 │
 │ Media                                   │
 │ Audit                                   │
 │ Permission                              │
 │ Feature Flags                           │
 │ Location                                │
 └──────────────────────────────────────────┘

                        │

              Infrastructure Layer
```

Shared services sit between business modules and infrastructure.

---

# DIRECTORY STRUCTURE

```
app/

Shared/

Services/

Auth/

Payment/

Wallet/

Notification/

Analytics/

Search/

Media/

Storage/

Audit/

AI/

Permission/

FeatureFlag/

Location/
```

Every service has one responsibility.

---

# AUTHSERVICE

Responsibilities

Authentication

Session Validation

JWT

OTP

OAuth

Device Validation

Password Management

Used by

All Modules

Authentication is centralized.

---

# USERSERVICE

Responsibilities

User Retrieval

User Profile

Role Resolution

Status

Preferences

Activity

Identity information should never be duplicated.

---

# TENANTSERVICE

Responsibilities

Tenant Resolution

Tenant Settings

Branding

Domain Resolution

Subscription Lookup

Feature Availability

Every request uses TenantService.

---

# PERMISSIONSERVICE

Responsibilities

Roles

Permissions

Policy Checks

Ownership

Access Control

Authorization remains centralized.

---

# FEATUREFLAGSERVICE

Responsibilities

Feature Availability

Beta Features

Tenant Features

Plan Features

User Features

Feature rollout occurs here.

---

# BUSINESSSERVICE

Responsibilities

Business Lookup

Business Validation

Business Availability

Business Status

Shared business operations.

---

# PAYMENTSERVICE

Responsibilities

Payment Processing

Gateway Communication

Payment Verification

Refund Processing

Invoice Creation

Settlement

No module communicates directly with payment gateways.

---

# WALLETSERVICE

Responsibilities

Credits

Debits

Balance

Rewards

Cashback

Ledger

Wallet consistency remains centralized.

---

# SUBSCRIPTIONSERVICE

Responsibilities

Plan Validation

Renewals

Feature Limits

Usage Tracking

Billing Cycle

Subscription logic belongs here.

---

# NOTIFICATIONSERVICE

Responsibilities

Email

SMS

Push

WhatsApp

In-App

Template Rendering

Delivery Queue

Retry Logic

Every notification uses this service.

---

# EMAILSERVICE

Responsibilities

Email Rendering

SMTP

Templates

Attachments

Scheduling

EmailService is used internally by NotificationService.

---

# SMSSERVICE

Responsibilities

SMS Providers

OTP

Transactional SMS

Campaign SMS

Delivery Tracking

SMS providers remain interchangeable.

---

# WHATSAPPSERVICE

Responsibilities

WhatsApp Templates

Session Messages

Campaign Messages

Delivery

Webhook Processing

Vendor integration remains isolated.

---

# PUSHSERVICE

Responsibilities

Mobile Push

Web Push

Device Tokens

Notification Delivery

Push notifications remain centralized.

---

# STORAGESERVICE

Responsibilities

Upload

Download

Delete

Move

Copy

Signed URLs

Storage provider abstraction.

---

# MEDIASERVICE

Responsibilities

Image Compression

Video Processing

Thumbnail Generation

Optimization

Metadata

MediaService depends on StorageService.

---

# SEARCHSERVICE

Responsibilities

Business Search

Location Search

Keyword Search

Autocomplete

Suggestions

Index Synchronization

Search implementation remains abstract.

---

# ANALYTICSSERVICE

Responsibilities

Event Tracking

Metrics

Funnels

Revenue

Customer Analytics

Business Analytics

Report Generation

Analytics should never block requests.

---

# AISERVICE

Responsibilities

Prompt Routing

Context Building

Model Selection

Response Processing

Recommendation Engine

AI Usage Tracking

All AI requests pass through this service.

---

# AUDITSERVICE

Responsibilities

Activity Logging

Security Logs

Business Logs

Payment Logs

System Logs

Audit Trails

Every critical action is logged.

---

# LOCATIONSERVICE

Responsibilities

Country

State

City

Coordinates

Distance

Geocoding

Reverse Geocoding

Maps Integration

Location logic is centralized.

---

# FILESERVICE

Responsibilities

Document Upload

Verification Files

Temporary Files

Export Files

Retention Policies

Separate from media processing.

---

# REPORTSERVICE

Responsibilities

PDF Generation

Excel Export

CSV Export

Analytics Reports

Invoice Reports

Background report generation.

---

# CACHESERVICE

Responsibilities

Caching

Invalidation

TTL

Distributed Cache

Redis Access

Business modules should not interact with Redis directly.

---

# EVENTSERVICE

Responsibilities

Dispatch Events

Register Events

Queue Events

Internal Messaging

Cross-module communication.

---

# HEALTHSERVICE

Responsibilities

Application Health

Database Health

Redis Health

Queue Health

Storage Health

External Service Health

Used by monitoring systems.

---

# SHARED SERVICE COMMUNICATION

Services communicate through

Interfaces

Events

Contracts

Dependency Injection

Never through direct module dependencies.

---

# SERVICE LIFECYCLE

Every service follows

```
Request

↓

Validation

↓

Business Rules

↓

Infrastructure

↓

Result

↓

Events

↓

Response
```

The lifecycle remains predictable.

---

# DEPENDENCY RULES

Business Modules

↓

Shared Services

↓

Infrastructure

Never

Business Module

↓

Another Module's Internal Service

Cross-module communication must occur through shared services or events.

---

# SERVICE DESIGN RULES

Every shared service should

Have one responsibility.

Expose a clean API.

Hide implementation details.

Be independently testable.

Avoid side effects.

Support dependency injection.

---

# TESTING

Every shared service requires

Unit Tests

Integration Tests (where applicable)

Mockable Interfaces

Predictable Outputs

Shared services must be reliable.

---

# PERFORMANCE

Optimize

Caching

Connection Pooling

Queue Usage

Lazy Loading

Batch Processing

Shared services should scale horizontally.

---

# SECURITY

Protect

Credentials

Secrets

API Keys

Payment Tokens

User Data

Tenant Context

Sensitive operations must be audited.

---

# AI IMPLEMENTATION RULES

AI coding agents must

Reuse shared services before creating new ones.

Never duplicate platform-wide functionality.

Maintain stateless services.

Respect dependency injection.

Avoid module-specific business logic inside shared services.

Update this document whenever a new shared service is added.

---

# FINAL RULE

Shared Services are the foundation of platform reuse.

If multiple modules require the same capability,

it belongs in a Shared Service.

Business modules should focus on business rules.

Shared Services should provide reusable platform capabilities.

Build once.

Reuse everywhere.