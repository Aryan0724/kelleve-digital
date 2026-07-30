# TRUEDIAL PLATFORM
# DEPENDENCY ARCHITECTURE MAP
# Version 1.0

---

# PURPOSE

This document defines the dependency rules for the TRUEDIAL Platform.

It specifies

- Which layers can depend on other layers
- Module communication
- Shared services
- Allowed dependencies
- Forbidden dependencies
- Dependency direction

The objective is to eliminate tight coupling and maintain a scalable architecture.

---

# DEPENDENCY PHILOSOPHY

Dependencies always move in one direction.

Higher layers depend on lower layers.

Lower layers never depend on higher layers.

The dependency graph must remain acyclic.

Circular dependencies are prohibited.

---

# COMPLETE DEPENDENCY FLOW

```
Client

↓

Routes

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

Repository

↓

Service

↓

API Resource

↓

Response
```

Every request follows this dependency chain.

---

# LAYER HIERARCHY

```
Presentation Layer

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer

↓

Database
```

Each layer has one responsibility.

---

# PRESENTATION LAYER

Contains

Routes

Controllers

Resources

Form Requests

Middleware

Responsibilities

Receive Requests

Validate

Authorize

Transform Responses

Presentation layer never owns business logic.

---

# APPLICATION LAYER

Contains

Services

Actions

DTOs

Workflows

Use Cases

Responsibilities

Business Logic

Transactions

Event Dispatching

External Integrations

This layer coordinates the platform.

---

# DOMAIN LAYER

Contains

Models

Enums

Policies

Rules

Domain Events

Value Objects

Responsibilities

Represent business entities

Represent relationships

Represent business state

No infrastructure concerns.

---

# INFRASTRUCTURE LAYER

Contains

Repositories

Storage

Redis

Queues

Mail

Notifications

External APIs

Responsibilities

Persistence

Caching

External communication

Infrastructure never owns business rules.

---

# DEPENDENCY GRAPH

```
Controllers

↓

Services

↓

Repositories

↓

Models

↓

Database
```

Reverse dependencies are forbidden.

---

# CONTROLLER DEPENDENCIES

Controllers may depend on

Services

Requests

Resources

Policies

DTOs

Controllers may NOT depend on

Repositories

Database

Queues

Storage

External APIs

---

# SERVICE DEPENDENCIES

Services may depend on

Repositories

Shared Services

Events

Queues

Storage

External APIs

DTOs

Transactions

Services may never depend on

Controllers

Resources

Routes

Views

---

# REPOSITORY DEPENDENCIES

Repositories may depend on

Models

Database

Query Builders

Repositories may NOT depend on

Controllers

Services

Routes

Views

Notifications

---

# MODEL DEPENDENCIES

Models may depend on

Relationships

Enums

Traits

Casts

Scopes

Models never depend on

Services

Controllers

Repositories

Requests

---

# SHARED SERVICES

Every module may depend on

AuthService

NotificationService

PaymentService

StorageService

MediaService

AnalyticsService

AuditService

PermissionService

FeatureFlagService

SearchService

LocationService

AIService

Shared services never depend on business modules.

---

# MODULE DEPENDENCIES

Allowed

```
Vendor

↓

Shared Services

↓

Payment

↓

Notification
```

Not Allowed

```
Vendor

↓

Customer Repository
```

Modules communicate through services or events.

---

# EVENT DEPENDENCIES

Events provide loose coupling.

```
Business Module

↓

BusinessCreated Event

↓

Notification Module

Analytics Module

Search Module

AI Module
```

Modules never call downstream modules directly.

---

# QUEUE DEPENDENCIES

Jobs depend on

Services

Repositories

Shared Services

Jobs never depend on

Controllers

Routes

Views

---

# API DEPENDENCIES

```
API Route

↓

Controller

↓

Service

↓

Repository

↓

Model
```

API layers remain isolated from infrastructure.

---

# DATABASE DEPENDENCIES

Database is the lowest layer.

Nothing below it.

Everything eventually depends on the database.

Database never depends on application code.

---

# CACHE DEPENDENCIES

Services may use

Redis

Cache

Feature Flags

Sessions

Repositories should not own caching strategy unless explicitly designed.

---

# STORAGE DEPENDENCIES

Storage accessed only through

StorageService

MediaService

Repositories never manipulate files directly.

---

# PAYMENT DEPENDENCIES

Payment Module depends on

Gateway Adapter

Repositories

Wallet Service

Notification Service

Analytics

Payment never depends on UI modules.

---

# AI DEPENDENCIES

AI depends on

Shared AI Service

Context Builder

Prompt Builder

Analytics

Search

AI never directly updates business entities without going through services.

---

# NOTIFICATION DEPENDENCIES

Notification Module depends on

Templates

Queues

Providers

Channels

Events

Business modules only dispatch events.

---

# ANALYTICS DEPENDENCIES

Analytics consumes

Events

Logs

Business Metrics

Marketing Metrics

Payments

Bookings

Analytics should never be required for a business workflow to complete.

---

# AUTHENTICATION DEPENDENCIES

Authentication depends on

Users

Roles

Permissions

Sessions

Tokens

Every module depends on Authentication.

Authentication depends on no business module.

---

# TENANT DEPENDENCIES

Tenant resolution occurs before

Controllers

Services

Repositories

Every tenant-aware module depends on Tenant Context.

Tenant module remains foundational.

---

# EXTERNAL DEPENDENCIES

External systems

Payment Gateway

Maps

WhatsApp

SMS

Email

AI Providers

Storage

Always accessed through adapters or shared services.

Never directly from controllers.

---

# ALLOWED DEPENDENCIES

✓ Controller → Service

✓ Service → Repository

✓ Repository → Model

✓ Service → Shared Service

✓ Service → Event

✓ Event → Listener

✓ Listener → Service

✓ Job → Service

✓ Policy → Model

---

# FORBIDDEN DEPENDENCIES

❌ Controller → Database

❌ Controller → Repository

❌ Controller → External API

❌ Model → Service

❌ Repository → Controller

❌ Repository → Notification

❌ Module → Another Module's Repository

❌ Circular Service Calls

❌ Cross-module Database Queries

---

# DEPENDENCY INJECTION

All dependencies should be injected.

Prefer

Constructor Injection

Interfaces

Contracts

IoC Container

Avoid

Static Dependencies

Global State

Manual Instantiation

---

# CIRCULAR DEPENDENCIES

Never create

```
Service A

↓

Service B

↓

Service A
```

Resolve using

Events

Shared Services

Interfaces

Dependency inversion.

---

# DEPENDENCY PRINCIPLES

Always

Depend on abstractions.

Keep modules independent.

Use interfaces where appropriate.

Minimize coupling.

Maximize cohesion.

One responsibility per dependency.

---

# AI IMPLEMENTATION RULES

AI coding agents must

Follow the dependency graph.

Never bypass layers.

Never introduce circular dependencies.

Never access another module's repositories directly.

Use events for inter-module communication.

Respect dependency injection.

Update this document whenever dependency rules change.

---

# ARCHITECTURAL CHECKLIST

Before adding a dependency, ask

Is this dependency necessary?

Can this use an existing shared service?

Can an event replace direct communication?

Does this create coupling?

Does this violate layer boundaries?

If the answer is yes, redesign before implementation.

---

# FINAL RULE

Dependencies define the architecture.

Every dependency should move downward.

Nothing should depend upward.

Nothing should depend sideways without a defined interface.

A clean dependency graph keeps the TRUEDIAL Platform modular, maintainable, and scalable for years to come.