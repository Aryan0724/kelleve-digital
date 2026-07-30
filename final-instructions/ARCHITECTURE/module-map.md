# TRUEDIAL PLATFORM
# MODULE ARCHITECTURE MAP
# Version 1.0

---

# PURPOSE

This document defines the module architecture of the TRUEDIAL Platform.

It explains

- Platform Modules
- Module Responsibilities
- Module Boundaries
- Communication Rules
- Dependencies
- Shared Resources

Every feature belongs to exactly one module.

Modules communicate through defined interfaces.

---

# MODULE PHILOSOPHY

The platform is built as a collection of independent business modules.

Each module

Owns its data.

Owns its business logic.

Owns its APIs.

Owns its workflows.

Modules should be

Independent

Reusable

Replaceable

Scalable

Never tightly coupled.

---

# HIGH LEVEL MODULE MAP

```
                           Platform

                               │

 ┌──────────────────────────────────────────────────────┐
 │                                                      │
 │ Authentication                                        │
 │                                                      │
 └──────────────────────────────────────────────────────┘
                               │

        ┌───────────────┬───────────────┬───────────────┐
        │               │               │               │
     Customer        Vendor         Admin          Tenant
        │               │               │               │
        └───────┬───────┴───────┬───────┴───────────────┘
                │               │
         Business Layer     Shared Services
                │               │
 ┌──────────────┼───────────────┼────────────────────────┐
 │              │               │                        │
 CRM       Marketing      Analytics                  AI
 │              │               │                        │
 ├──────────────┼───────────────┼────────────────────────┤
 │              │               │                        │
 Reviews    Bookings      Payments                  Wallet
 │              │               │                        │
 ├──────────────┼───────────────┼────────────────────────┤
 │              │               │                        │
 Search     Notifications    Subscription          Referral
 │              │               │                        │
 └──────────────┴───────────────┴────────────────────────┘
```

Every module has a single responsibility.

---

# CORE MODULES

Platform consists of

Authentication

Tenant

Customer

Vendor

Business

Admin

CRM

Marketing

Analytics

AI

Payments

Wallet

Notifications

Reviews

Bookings

Search

Media

Subscription

Referral

Settings

Each module is independently maintainable.

---

# AUTHENTICATION MODULE

Responsibilities

Identity

Login

Registration

OTP

OAuth

Sessions

Permissions

Roles

Guards

This module owns user identity.

No other module authenticates users.

---

# TENANT MODULE

Responsibilities

Tenant Configuration

Domains

Branding

Feature Flags

Integrations

Billing

Tenant Settings

Everything tenant-specific belongs here.

---

# CUSTOMER MODULE

Responsibilities

Profiles

Favorites

Rewards

Preferences

Bookings

Wallet

Reviews

Notifications

Customer experience belongs here.

---

# VENDOR MODULE

Responsibilities

Vendor Profile

Business Management

CRM

Marketing

Offers

Analytics

Subscription

Staff

Leads

Vendor growth belongs here.

---

# BUSINESS MODULE

Responsibilities

Business Profile

Categories

Products

Services

Working Hours

Media

Documents

Business Information

Every vendor owns one or more businesses.

---

# ADMIN MODULE

Responsibilities

Platform Management

Moderation

Reports

System Settings

Feature Management

Audit

Monitoring

Platform administration belongs here.

---

# CRM MODULE

Responsibilities

Leads

Contacts

Tasks

Notes

Pipelines

Activities

Lead Sources

Customer Relationships

CRM never owns customer identity.

---

# MARKETING MODULE

Responsibilities

Campaigns

Offers

Coupons

Segments

Automation

Referral

Templates

Engagement

Marketing focuses on customer acquisition and retention.

---

# ANALYTICS MODULE

Responsibilities

KPIs

Funnels

Reports

Revenue

Search Metrics

Campaign Metrics

Business Insights

Customer Insights

Analytics consumes events from other modules.

---

# PAYMENT MODULE

Responsibilities

Gateway Integration

Payments

Refunds

Invoices

Transactions

Settlement

Payment Verification

Financial processing belongs here.

---

# WALLET MODULE

Responsibilities

Wallet Balance

Credits

Debits

Rewards

Cashback

Transaction History

Wallet never processes gateway payments directly.

---

# REVIEW MODULE

Responsibilities

Ratings

Reviews

Media

Reports

Moderation

Review Analytics

Review ownership remains separate.

---

# BOOKING MODULE

Responsibilities

Appointments

Scheduling

Availability

Booking History

Booking Status

Calendar

Bookings remain isolated from payments.

---

# NOTIFICATION MODULE

Responsibilities

Email

SMS

WhatsApp

Push

In-App

Templates

Delivery

Notification History

All communication passes through this module.

---

# SEARCH MODULE

Responsibilities

Business Search

Category Search

Location Search

AI Search

Suggestions

Search Indexes

Search logic remains centralized.

---

# MEDIA MODULE

Responsibilities

Images

Videos

Documents

Compression

Storage

Optimization

Uploads

Media storage remains independent.

---

# SUBSCRIPTION MODULE

Responsibilities

Plans

Billing

Renewals

Feature Access

Usage Limits

Subscription History

Controls premium access.

---

# REFERRAL MODULE

Responsibilities

Referral Codes

Rewards

Referral Tracking

Referral Analytics

Referral Payouts

Referral Campaigns

Growth through referrals belongs here.

---

# AI MODULE

Responsibilities

Prompt Routing

Recommendations

Lead Scoring

Content Generation

Insights

Automation

Search Intelligence

AI assists every module.

---

# SETTINGS MODULE

Responsibilities

Platform Settings

Business Settings

User Preferences

Localization

Configuration

Integrations

System-wide configuration belongs here.

---

# SHARED SERVICES

Modules reuse

Authentication

Notifications

Payments

Storage

Media

Analytics

AI

Search

Permissions

Audit

No module duplicates shared functionality.

---

# MODULE COMMUNICATION

Modules communicate through

Services

Events

Queues

Shared Interfaces

Never communicate through direct database access.

---

# EVENT FLOW

Example

```
Booking Created

↓

Booking Module

↓

BookingCreated Event

↓

Notification Module

↓

Analytics Module

↓

Reward Module

↓

Customer Module
```

Modules remain loosely coupled.

---

# DEPENDENCY RULES

Allowed

```
Controller

↓

Service

↓

Repository

↓

Model
```

Modules may call

Shared Services

Events

Contracts

Modules should not directly access another module's repositories.

---

# MODULE OWNERSHIP

Every entity has exactly one owner.

Examples

User

↓

Authentication

Campaign

↓

Marketing

Review

↓

Review Module

Payment

↓

Payment Module

Booking

↓

Booking Module

Ownership prevents duplicated logic.

---

# REUSE STRATEGY

Before creating

Module

Service

Repository

Event

DTO

Policy

Always check existing modules.

Prefer extension over duplication.

---

# MODULE ISOLATION

Every module should be capable of evolving independently.

Changes inside one module should not require modifications across unrelated modules.

Dependencies remain explicit.

---

# MODULE LIFECYCLE

Every module follows

Request

↓

Validation

↓

Authorization

↓

Business Logic

↓

Persistence

↓

Events

↓

Notifications

↓

Analytics

Lifecycle remains consistent.

---

# FUTURE MODULES

Future additions should integrate without changing existing architecture.

Examples

Marketplace

Learning

Community

Hiring

Events

Membership

New modules plug into the platform using existing patterns.

---

# AI IMPLEMENTATION RULES

AI coding agents must

Never create duplicate modules.

Respect module ownership.

Use shared services.

Communicate through events.

Avoid cross-module database access.

Maintain loose coupling.

Update this document whenever a new module is introduced.

---

# FINAL RULE

Every feature belongs to one module.

Every module owns one business domain.

Modules communicate through services and events—not direct dependencies.

A clean module architecture enables the TRUEDIAL Platform to grow into multiple products without becoming a monolith.