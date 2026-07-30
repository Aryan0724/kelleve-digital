# TRUEDIAL PLATFORM
# MODULE SYSTEM
# Version 1.0

---

# PURPOSE

This document defines how every feature inside the TRUEDIAL Platform must be designed, developed, maintained, and extended.

The platform is NOT page-driven.

The platform is NOT screen-driven.

The platform is MODULE DRIVEN.

Every feature belongs to a module.

Every module is independent.

Every module can evolve without breaking the rest of the platform.

---

# PHILOSOPHY

Never build features.

Build modules.

A feature is temporary.

A module is reusable.

Think of the platform as LEGO blocks.

Each block has one responsibility.

Blocks work together.

Blocks never become dependent on each other's internal implementation.

---

# WHAT IS A MODULE?

A module is a self-contained business capability.

Examples

Authentication

Business Directory

Offers

CRM

Marketing

Analytics

Consulting

Academy

Jobs

Privilege Card

Subscriptions

Wallet

Payments

Reviews

Notifications

AI Center

Every module has:

• Data

• Business Logic

• APIs

• Permissions

• Documentation

• Tests

---

# MODULE CHARACTERISTICS

Every module must be:

Independent

Reusable

Replaceable

Testable

Documented

Tenant Aware

API First

Secure

Scalable

---

# CURRENT PLATFORM MODULES

Core

Authentication

Users

Roles

Permissions

Settings

Feature Flags

Notifications

Platform

Business Directory

Categories

Business Verification

Reviews

Products

Services

Offers

Portfolio

Search

Location

Growth

CRM

Marketing

WhatsApp Campaigns

SMS Campaigns

Email Campaigns

Lead Management

Analytics

Business Intelligence

Commerce

Wallet

Payments

Subscriptions

Invoices

Privilege Card

Coupons

Learning

Academy

Courses

Certificates

Internships

Jobs

Consulting

Content

Podcast

Business News

Blogs

Media

AI

AI Center

AI Recommendations

AI Content Generation

AI Insights

Administration

Admin

Reports

Audit Logs

System Monitoring

Tenant Management

---

# MODULE DIRECTORY STRUCTURE

Each module should follow the same structure.

Modules/

Business/

Controllers/

Services/

Repositories/

Models/

Policies/

Requests/

Resources/

Events/

Listeners/

Jobs/

Notifications/

Rules/

Enums/

DTOs/

Actions/

Tests/

Documentation/

Routes/

Config/

Never invent new structures without approval.

Consistency is mandatory.

---

# SINGLE RESPONSIBILITY

Each module should solve ONE business problem.

Good

Offer Module

↓

Offers only

Bad

Offer Module

↓

Offers

↓

Wallet

↓

Payments

↓

Analytics

Those belong in their own modules.

---

# MODULE OWNERSHIP

Every resource belongs to exactly one module.

Example

Offer

↓

Offer Module

Review

↓

Review Module

Subscription

↓

Subscription Module

Wallet

↓

Wallet Module

No shared ownership.

---

# MODULE COMMUNICATION

Modules never manipulate each other's data directly.

Communication happens through:

Services

Events

Actions

Interfaces

Never

Controller → Controller

Never

Repository → Repository

Never

Database → Database hacks

---

# EXAMPLE WORKFLOW

Customer purchases subscription.

Subscription Module

↓

Payment Module

↓

Wallet Module

↓

Notification Module

↓

Analytics Module

Each module performs only its responsibility.

---

# PUBLIC API

Each module exposes a public interface.

Other modules communicate through this interface.

Never depend on internal implementation.

---

# INTERNAL IMPLEMENTATION

Everything inside a module is private.

Other modules should never know

Database structure

Internal services

Internal helper methods

Private models

Only public interfaces are exposed.

---

# MODULE DEPENDENCIES

Allowed

Authentication

↓

Business

↓

Offers

↓

CRM

↓

Marketing

↓

Analytics

Avoid circular dependencies.

Never

CRM

↓

Offers

↓

CRM

---

# EVENTS

Modules should communicate using events whenever possible.

Example

Business Approved

↓

Notification Module

↓

Analytics Module

↓

Marketing Module

↓

Search Index Module

Each module reacts independently.

---

# SHARED SERVICES

Platform-level services should never belong to business modules.

Examples

Email

Storage

OTP

SMS

WhatsApp

File Upload

Logging

Queue

Audit

Cache

AI Gateway

These belong in Shared Services.

---

# MODULE CONFIGURATION

Every module should support configuration.

Enable

Disable

Premium

Enterprise

Beta

Hidden

Region Specific

Tenant Specific

Configuration belongs in backend.

---

# FEATURE FLAGS

Every major module must support feature flags.

Examples

Academy

Jobs

Marketplace

AI

Podcast

Consulting

News

Admin controls visibility.

Never hardcode feature availability.

---

# PERMISSIONS

Each module defines its own permissions.

Example

Offer Module

offer.create

offer.edit

offer.delete

offer.publish

offer.archive

Never create generic permissions.

Permissions should be granular.

---

# ROUTES

Every module owns its routes.

Example

/api/v1/offers

/api/v1/reviews

/api/v1/businesses

Never mix unrelated endpoints.

---

# DATABASE

Each module owns its tables.

Example

Review Module

reviews

review_replies

review_reports

Offer Module

offers

offer_redemptions

offer_categories

Ownership should be obvious.

---

# MIGRATIONS

Each module owns its migrations.

Never place migrations randomly.

Group them logically.

---

# DOCUMENTATION

Every module must contain documentation.

Include

Purpose

Responsibilities

API

Events

Permissions

Dependencies

Configuration

Testing

Future Plans

No undocumented modules.

---

# TESTING

Every module must include

Unit Tests

Feature Tests

API Tests

Permission Tests

Validation Tests

Integration Tests

Critical modules should include load testing.

---

# UI RESPONSIBILITY

Modules should never know

Website Layout

Mobile Navigation

Frontend Components

Modules expose APIs.

Clients render experiences.

---

# REUSABILITY

Before creating a new module ask:

Can an existing module be extended?

Can this become part of another module?

Does this duplicate functionality?

Never create unnecessary modules.

---

# MODULE LIFECYCLE

Idea

↓

Specification

↓

Architecture Review

↓

Database Design

↓

API Design

↓

Implementation

↓

Testing

↓

Documentation

↓

Production

Every module follows this lifecycle.

---

# MODULE MATURITY

Each module has one status.

Planning

Development

Testing

Beta

Production

Deprecated

Archived

Track maturity explicitly.

---

# PERFORMANCE

Each module should define

Caching

Indexes

Queues

Background Jobs

Performance targets

Heavy operations should never block requests.

---

# VERSIONING

Modules evolve independently.

Breaking changes require

Migration Plan

API Version

Documentation Update

Client Migration

Never introduce breaking changes silently.

---

# AI CODING RULES

Before modifying any module, an AI agent must:

Read module documentation.

Understand dependencies.

Check existing services.

Reuse existing APIs.

Avoid duplicate logic.

Update documentation.

Run tests.

An AI must never create a parallel implementation.

---

# DEFINITION OF DONE

A module is complete only when:

✓ Database completed

✓ APIs completed

✓ Permissions implemented

✓ Validation completed

✓ Events implemented

✓ Tests passing

✓ Documentation updated

✓ Web integrated

✓ Mobile integrated

✓ Admin integrated

✓ Monitoring enabled

---

# NEVER DO THIS

❌ Duplicate Modules

❌ Duplicate Services

❌ Cross-Module Database Access

❌ Controller-to-Controller Calls

❌ Circular Dependencies

❌ Hidden APIs

❌ Hardcoded Feature Flags

❌ Frontend Business Logic

❌ Undocumented Modules

---

# FINAL RULE

Every module should be capable of surviving independently.

If removing one module causes unrelated modules to fail, the architecture is incorrect.

Modules should collaborate.

They should never become inseparable.