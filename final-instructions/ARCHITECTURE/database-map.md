# TRUEDIAL PLATFORM
# DATABASE ARCHITECTURE MAP
# Version 1.0

---

# PURPOSE

This document defines the database architecture of the TRUEDIAL Platform.

It explains

- Database Structure
- Table Organization
- Relationships
- Multi-Tenant Strategy
- Naming Standards
- Keys
- Indexing
- Data Ownership

The database is the single source of truth for the platform.

---

# DATABASE PHILOSOPHY

The database stores facts.

Business logic never belongs inside the database.

The database should be

Consistent

Normalized

Scalable

Auditable

Tenant-Aware

Every table exists for a reason.

---

# DATABASE ENGINE

Primary Database

PostgreSQL

Supporting Technologies

Redis

Object Storage

Search Engine (Future)

Analytics Warehouse (Future)

---

# HIGH LEVEL STRUCTURE

```
Platform

│

├── Identity

├── Tenants

├── Businesses

├── Customers

├── Vendors

├── Marketing

├── CRM

├── Payments

├── Wallet

├── Analytics

├── AI

├── Notifications

├── Reviews

├── Bookings

├── Referrals

└── Audit Logs
```

Each domain owns its own tables.

---

# DATABASE LAYERS

```
Shared Tables

↓

Tenant Tables

↓

Business Tables

↓

Operational Tables

↓

Analytics Tables

↓

Audit Tables
```

Each layer has a specific responsibility.

---

# SHARED TABLES

These tables belong to the platform.

Examples

users

roles

permissions

countries

states

cities

currencies

languages

feature_flags

system_settings

Shared tables are available to all tenants.

---

# TENANT TABLES

Tenant-owned tables.

Examples

tenants

tenant_domains

tenant_settings

tenant_branding

tenant_features

tenant_integrations

Every tenant has isolated configuration.

---

# BUSINESS TABLES

Core business data.

Examples

businesses

business_categories

business_locations

business_media

business_hours

business_contacts

business_services

business_products

business_staff

business_documents

Every business belongs to one tenant.

---

# CUSTOMER TABLES

Examples

customers

customer_profiles

customer_addresses

customer_preferences

customer_devices

customer_rewards

customer_favorites

customer_wallets

Customer identity remains centralized.

---

# VENDOR TABLES

Examples

vendors

vendor_profiles

vendor_documents

vendor_subscriptions

vendor_wallets

vendor_settings

Vendor records remain tenant-aware.

---

# CRM TABLES

Examples

leads

lead_sources

lead_statuses

contacts

pipelines

activities

tasks

notes

CRM data belongs to businesses.

---

# MARKETING TABLES

Examples

campaigns

campaign_segments

campaign_messages

campaign_templates

campaign_results

referrals

coupons

offers

Marketing remains modular.

---

# PAYMENT TABLES

Examples

payments

transactions

wallets

wallet_transactions

refunds

subscriptions

subscription_plans

invoices

Financial records are immutable.

---

# REVIEW TABLES

Examples

reviews

review_images

review_votes

review_reports

Moderation data stored separately.

---

# BOOKING TABLES

Examples

bookings

booking_services

booking_status

booking_history

appointments

Scheduling remains isolated.

---

# NOTIFICATION TABLES

Examples

notifications

notification_templates

notification_logs

notification_preferences

delivery_attempts

Notification history is permanent.

---

# ANALYTICS TABLES

Examples

analytics_events

analytics_sessions

page_views

search_events

conversion_events

business_metrics

customer_metrics

Analytics tables are append-only whenever possible.

---

# AI TABLES

Examples

ai_requests

ai_responses

ai_prompts

ai_feedback

ai_usage

AI history remains auditable.

---

# AUDIT TABLES

Examples

audit_logs

login_history

security_events

system_events

activity_logs

Nothing is permanently lost.

---

# PRIMARY KEYS

Every table uses

UUID

Advantages

Globally Unique

Secure

Merge Friendly

Distributed Ready

Sequential integer IDs are never exposed publicly.

---

# FOREIGN KEYS

Every relationship uses foreign keys.

Examples

tenant_id

user_id

business_id

customer_id

vendor_id

campaign_id

payment_id

Referential integrity is mandatory.

---

# RELATIONSHIP MODEL

```
Tenant

↓

Businesses

↓

Services

↓

Bookings

↓

Payments

↓

Reviews

↓

Analytics
```

Relationships remain hierarchical.

---

# USER RELATIONSHIPS

```
User

│

├── Customer

├── Vendor

├── Admin

└── Staff
```

One identity.

Multiple roles.

---

# TENANT RELATIONSHIPS

```
Tenant

│

├── Businesses

├── Users

├── Campaigns

├── Analytics

├── Settings

└── Integrations
```

Tenants own operational data.

---

# BUSINESS RELATIONSHIPS

```
Business

│

├── Categories

├── Staff

├── Products

├── Services

├── Reviews

├── Offers

├── Bookings

├── Wallet

└── Analytics
```

Business acts as the operational hub.

---

# DATA OWNERSHIP

Every record has one owner.

Platform

or

Tenant

or

Business

or

User

Ownership is explicit.

---

# SOFT DELETES

Use soft deletes for

Users

Businesses

Customers

Vendors

Campaigns

Bookings

Reviews

Never permanently delete operational data.

---

# HARD DELETES

Allowed only for

Temporary Cache

Expired Sessions

Queue Payloads

Logs beyond retention

No business records.

---

# INDEXING STRATEGY

Index

UUIDs

Foreign Keys

Email

Phone

Slug

Search Fields

Created Date

Updated Date

Status

Optimize for read performance.

---

# UNIQUE CONSTRAINTS

Examples

Email

Phone

Business Slug

Tenant Domain

Coupon Code

Invoice Number

Duplicates are prevented at database level.

---

# TRANSACTIONS

Required for

Payments

Wallet

Refunds

Bookings

Subscriptions

Business Registration

Critical operations must remain atomic.

---

# CASCADE RULES

Use cascade carefully.

Allowed

Dependent metadata

Media

Temporary records

Avoid cascading financial records.

---

# AUDITABILITY

Every critical table stores

created_at

updated_at

created_by

updated_by

deleted_at

Auditability is mandatory.

---

# MULTI-TENANCY

Tenant-aware tables include

tenant_id

Queries automatically scope to tenant.

Cross-tenant access is prohibited.

---

# SEARCHABLE DATA

Search indexes include

Business Name

Category

Location

Services

Products

Tags

Keywords

Search remains optimized.

---

# MEDIA RELATIONSHIPS

Media stored separately.

```
Business

↓

Media

↓

Storage
```

Database stores metadata only.

---

# ARCHIVAL STRATEGY

Old records move to archive when appropriate.

Examples

Expired Campaigns

Old Analytics

Historical Reports

Audit Logs

Archives remain queryable.

---

# BACKUPS

Protect

Database

Schema

Critical Configuration

Backups occur automatically.

Restoration procedures are tested.

---

# PERFORMANCE PRINCIPLES

Avoid

N+1 Queries

Duplicate Data

Large JSON Columns

Repeated Aggregations

Optimize before scaling.

---

# DATABASE RULES

Always

Use UUIDs

Use Foreign Keys

Use Indexes

Use Migrations

Normalize Data

Audit Changes

Never

Store Business Logic

Duplicate Data

Modify Production Manually

Break Referential Integrity

---

# AI IMPLEMENTATION RULES

AI coding agents must

Create migrations only.

Never edit schema manually.

Respect existing relationships.

Reuse lookup tables.

Never duplicate entities.

Always maintain tenant isolation.

Update this document whenever schema changes.

---

# FINAL RULE

The database is the permanent memory of the TRUEDIAL Platform.

Every table has one purpose.

Every relationship is explicit.

Every record has an owner.

Every change is auditable.

The database stores truth.

The application enforces behavior.