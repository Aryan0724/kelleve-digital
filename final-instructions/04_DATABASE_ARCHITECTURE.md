# TRUEDIAL PLATFORM
# DATABASE ARCHITECTURE
# Version 1.0

---

# PURPOSE

This document defines the database architecture for the entire platform.

The database is NOT designed for one project.

It is designed for the PLATFORM.

Every product must reuse the same schema whenever possible.

Current Products

• FindMyInterior

• TrueDial Website

• TrueDial Mobile

Future Products

• Additional Business Platforms

• Marketplace

• Franchise Platform

• White Label Clients

All should share one logical database architecture.

---

# DATABASE PHILOSOPHY

Never create tables because one frontend needs them.

Create tables because the platform needs them.

Frontend changes.

Database survives.

---

# DATABASE GOALS

The database must be

✓ Scalable

✓ Modular

✓ Normalized

✓ Tenant Aware

✓ API Friendly

✓ Auditable

✓ Secure

✓ Extendable

---

# SINGLE SOURCE OF TRUTH

The database stores truth.

Never store duplicate business information.

Example

Business Name

Store once.

Never duplicate it into

Vendor

Offers

Campaigns

Analytics

Invoices

Everything references Business.

---

# CORE ENTITY HIERARCHY

Tenant

↓

Users

↓

Businesses

↓

Products

↓

Services

↓

Offers

↓

Reviews

↓

Campaigns

↓

Analytics

↓

Subscriptions

↓

Payments

↓

Wallet

Everything revolves around Business.

---

# PRIMARY ENTITIES

Core Platform Tables

tenants

users

roles

permissions

businesses

business_categories

cities

states

countries

business_media

products

services

offers

reviews

review_replies

consulting_requests

campaigns

campaign_reports

notifications

wallets

transactions

subscriptions

subscription_plans

payments

analytics_events

crm_contacts

crm_leads

jobs

internships

academy_courses

podcasts

news

feature_flags

audit_logs

settings

---

# TENANT MODEL

Every record that belongs to a product should reference

tenant_id

Never create

truedial_businesses

findmyinterior_businesses

Instead

businesses

+

tenant_id

Example

Tenant

1

FindMyInterior

Tenant

2

TrueDial

Tenant

3

Future Product

Same schema.

Different tenant.

---

# USER MODEL

One user can

Own businesses

Purchase subscriptions

Leave reviews

Hold privilege cards

Attend academy

Apply for jobs

Become consultant

Become franchise partner

Never duplicate users.

One identity.

Many roles.

---

# ROLE SYSTEM

One user

↓

Many roles

Examples

Super Admin

Admin

Vendor

Customer

Consultant

Faculty

Student

City Manager

State Manager

Franchise Partner

Never create multiple user tables.

---

# BUSINESS MODEL

Business is the heart of the platform.

Everything connects to Business.

Business owns

Products

Services

Offers

Reviews

Analytics

Campaigns

Media

Leads

Invoices

Subscription

Verification

Never duplicate business information.

---

# MEDIA

Images

Videos

Documents

Gallery

Certificates

Store as

business_media

Never create

product_images

offer_images

review_images

unless absolutely necessary.

Use polymorphic relations where appropriate.

---

# LOCATION STRUCTURE

Country

↓

State

↓

City

↓

Area

↓

Business

Never hardcode cities.

Never hardcode states.

Everything should be configurable.

---

# CATEGORY STRUCTURE

Categories

↓

Sub Categories

↓

Business

Categories should never be hardcoded.

Admin controls them.

---

# OFFERS

Offers belong to Business.

Offer contains

Title

Description

Type

Discount

Coupon

Validity

Status

Visibility

Never duplicate offers.

---

# REVIEWS

Review

↓

Reply

↓

Report

↓

Moderation

Review should store

Business

Customer

Rating

Review

Media

Status

Review replies belong to Vendor.

---

# SUBSCRIPTIONS

Subscription belongs to

Business

Plan

Vendor

Never calculate subscription rules in database.

Store only

Plan

Status

Start

Expiry

Renewal

Usage

Business rules belong in Laravel.

---

# PAYMENTS

Payments store

Gateway

Reference

Amount

Currency

Status

Invoice

Transaction

Never trust frontend payment status.

---

# WALLET

Wallet belongs to User.

Transactions belong to Wallet.

Wallet never stores history.

History belongs to transactions.

---

# CRM

CRM contains

Contacts

Leads

Activities

Notes

Follow Ups

Reminders

Everything references Business.

---

# CAMPAIGNS

Campaign

↓

Recipients

↓

Delivery

↓

Analytics

↓

Conversions

Support

SMS

WhatsApp

Email

Push

Future channels should require no schema redesign.

---

# ANALYTICS

Never store analytics in Business table.

Create separate event tables.

Track

Search

View

Call

WhatsApp

Offer Click

Lead

Review

Campaign

Subscription

Payment

Everything should be event driven.

---

# AUDIT LOGS

Every critical action creates audit log.

Store

User

Action

Resource

Old Value

New Value

Timestamp

IP

User Agent

Never delete audit logs.

---

# SETTINGS

Platform settings belong in database.

Examples

Brand

Logo

Theme

Feature Flags

Payment Keys

Limits

SMS Credits

Notification Settings

Never hardcode configuration.

---

# FEATURE FLAGS

Every major module should be toggleable.

Examples

Academy

Jobs

Podcast

Marketplace

Consulting

AI

News

Feature flags belong in database.

---

# SOFT DELETES

Every business-critical table should support Soft Deletes.

Examples

Business

Offers

Products

Services

Reviews

Campaigns

Never permanently delete unless legally required.

---

# FOREIGN KEYS

Always use foreign keys.

Never rely on string references.

Every relationship should be enforced by the database.

---

# INDEXES

Index all frequently searched fields.

Examples

Slug

Business Name

Category

City

State

Vendor

Status

Subscription

Offer Status

Review Rating

Created At

Search performance matters.

---

# NAMING CONVENTIONS

Tables

Plural

Snake Case

businesses

offers

reviews

Columns

Snake Case

created_at

updated_at

deleted_at

business_id

subscription_plan_id

No abbreviations.

Use descriptive names.

---

# MIGRATIONS

One migration

One responsibility.

Never create giant migrations.

Every migration should be reversible.

Never edit old migrations after production.

Always create new migrations.

---

# SEEDERS

Platform should have seeders for

Roles

Permissions

States

Cities

Categories

Subscription Plans

Feature Flags

Demo Businesses

Never depend on production data.

---

# FUTURE COMPATIBILITY

Adding a new platform should require

New Tenant

Brand Configuration

Enabled Modules

No schema redesign.

If a new product requires creating duplicate tables, the architecture has failed.

---

# FINAL RULE

The database is the foundation of the platform.

Applications come and go.

UI changes.

Frameworks change.

The database must remain stable, reusable, and capable of supporting every future product built on the platform.