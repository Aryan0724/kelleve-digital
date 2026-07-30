# TRUEDIAL PLATFORM
# SYSTEM ARCHITECTURE
# Version 1.0

---

# PURPOSE

This document defines the architecture of the entire TRUEDIAL Platform.

This document is NOT optional.

Every developer, AI coding agent, and future contributor must follow these architectural rules.

Failure to follow this architecture will create:

- Duplicate code
- Different implementations
- Broken APIs
- Technical debt
- Difficult maintenance
- Platform inconsistency

This document is the highest authority regarding system architecture.

---

# SYSTEM PHILOSOPHY

TRUEDIAL is ONE PLATFORM.

It is NOT:

- One Website
- One Mobile App
- One Backend

Instead it consists of multiple interfaces built on one shared platform.

Think like Shopify.

Think like Zoho.

Think like Salesforce.

One platform.

Many clients.

---

# HIGH LEVEL ARCHITECTURE

                         Users

                            │

          ┌────────────────────────────────┐
          │                                │
          │        Website (Next.js)        │
          │                                │
          └────────────────────────────────┘

                            │

          ┌────────────────────────────────┐
          │                                │
          │     Mobile App (React Native)  │
          │                                │
          └────────────────────────────────┘

                            │

          ┌────────────────────────────────┐
          │                                │
          │        Admin Dashboard         │
          │                                │
          └────────────────────────────────┘

                            │

                    HTTPS REST API

                            │

          ┌────────────────────────────────┐
          │                                │
          │      Laravel Backend           │
          │                                │
          └────────────────────────────────┘

                            │

                    MySQL Database

                            │

             AWS / Storage / Redis / Queue

---

# SINGLE SOURCE OF TRUTH

Only ONE layer owns business logic.

Laravel Backend.

Frontend NEVER owns business logic.

Frontend NEVER owns permissions.

Frontend NEVER owns pricing.

Frontend NEVER owns subscriptions.

Frontend NEVER owns calculations.

Frontend ONLY renders data.

---

# CLIENTS

Current Clients

- FindMyInterior Website

- TrueDial Website

- TrueDial Mobile

Future Clients

- White Label Platforms

- Franchise Platforms

- Internal Admin

- Desktop Apps

- AI Agents

Every client communicates with the same backend.

---

# PLATFORM LAYERS

The platform consists of clearly separated layers.

Layer 1

Presentation

Examples

Next.js

React Native

Admin UI

Responsibilities

Display

Forms

Animations

Navigation

Theme

Nothing else.

---

Layer 2

API Layer

Responsibilities

HTTP

Authentication

Headers

DTO Mapping

Caching

Retry

Error Handling

This is the only communication layer.

---

Layer 3

Business Layer

Laravel

Responsibilities

Validation

Rules

Permissions

Pricing

Analytics

Campaign Logic

Subscriptions

Offers

Everything business-related.

---

Layer 4

Data Layer

Database

Storage

Redis

Queue

Cache

---

# FRONTEND RESPONSIBILITIES

Frontend SHOULD

Display data

Collect user input

Navigate

Validate basic forms

Show loading states

Show errors

Handle responsiveness

Handle animations

Frontend SHOULD NEVER

Calculate prices

Check subscriptions

Generate analytics

Decide permissions

Approve payments

Generate reports

Duplicate backend logic

---

# BACKEND RESPONSIBILITIES

Laravel owns:

Authentication

Authorization

Business Logic

Validation

Notifications

Payments

Subscriptions

CRM

Offers

Reviews

Analytics

Marketing

Invoices

Wallet

Rewards

Everything.

---

# MODULE BASED ARCHITECTURE

Every feature belongs to ONE module.

Never mix modules.

Example

Business Directory

Reviews

Offers

CRM

Marketing

Consulting

Academy

Jobs

Podcast

News

Wallet

Privilege Card

Subscriptions

Authentication

Notifications

Payments

Analytics

Each module should have:

Controller

Services

Models

Routes

Policies

Requests

Resources

Events

Tests

Documentation

---

# MODULE COMMUNICATION

Modules communicate only through:

Services

Events

Repositories

Never directly modify another module.

Bad

OfferController

↓

changes Wallet

Good

OfferController

↓

OfferService

↓

Event

↓

WalletService

---

# MULTI PRODUCT STRATEGY

TRUEDIAL

FindMyInterior

Future Products

must NEVER have different business logic.

Only differences allowed:

Brand

Theme

Logo

Colors

Feature Flags

Navigation

Landing Pages

Everything else remains shared.

---

# MOBILE ARCHITECTURE

The Mobile App is NOT another backend.

It is another renderer.

Every API should already exist.

Never create mobile-only APIs unless absolutely required.

---

# WEBSITE ARCHITECTURE

The Website is NOT another implementation.

It consumes the same APIs.

It follows the same workflows.

It uses the same authentication.

It uses the same permissions.

---

# SHARED API CONTRACT

Every frontend consumes identical contracts.

Example

Business

GET

POST

PUT

DELETE

The response shape must remain identical across every client.

Never create:

Website DTO

Mobile DTO

Admin DTO

One DTO.

Many renderers.

---

# FEATURE FLAGS

Modules must be configurable.

Admin should enable or disable:

Academy

Jobs

Podcast

News

AI

Marketplace

Consulting

without changing code.

Feature flags belong in backend configuration.

Never hardcode visibility inside frontend.

---

# TENANT AWARENESS

Every request carries:

Tenant

Platform

Version

Locale

The backend determines behavior.

Never hardcode tenant-specific behavior inside React.

---

# SHARED DESIGN

Different UI.

Same UX.

Example

Website

Grid

Mobile

Cards

Workflow remains identical.

Search

↓

Business

↓

Contact

↓

Review

↓

Offer

Same journey.

Different layout.

---

# REUSE RULE

Before writing code ask:

Does this already exist?

Can I extend it?

Can I reuse it?

Can it become generic?

If YES

Reuse.

Never duplicate.

---

# FOLDER STRUCTURE

Backend

Modules

Controllers

Services

Repositories

Models

Policies

Requests

Resources

Events

Observers

Jobs

Notifications

Routes

Frontend

Components

Hooks

Services

Types

Utils

Pages

Layouts

Providers

Mobile

Components

Hooks

Services

Navigation

Screens

Types

Providers

Shared

API

Types

Utilities

Constants

Config

---

# DEPENDENCY RULES

Presentation

↓

API

↓

Business

↓

Database

Never reverse.

Never allow database access from frontend.

Never allow frontend business logic.

---

# DEFINITION OF ARCHITECTURAL SUCCESS

The platform succeeds when:

A new product can be created by:

Changing branding

Enabling modules

Configuring tenant

Without rewriting backend logic.

If creating a new platform requires copying controllers, services, APIs, or workflows, the architecture has failed.

---

# FINAL RULE

Every decision should answer this question:

"If we build six more products next year, will this implementation still make sense?"

If the answer is NO,

redesign before coding.