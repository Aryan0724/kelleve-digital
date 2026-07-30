# TRUEDIAL PLATFORM
# WEB DEVELOPMENT RULES
# Version 1.0

---

# PURPOSE

This document defines the mandatory rules for every web application built on the platform.

Current Applications

• TrueDial Website

• FindMyInterior

Future Applications

• Admin Dashboard

• Vendor Dashboard

• Customer Dashboard

• AI Center

• Academy

Every web application must follow these standards.

---

# TECHNOLOGY STACK

Framework

Next.js 15+

Language

TypeScript

Styling

Tailwind CSS

UI Components

shadcn/ui

Icons

Lucide React

Animations

Framer Motion

Forms

React Hook Form

Validation

Zod

Data Fetching

TanStack Query

State Management

Zustand

Authentication

Laravel API + Sanctum/JWT

Charts

Recharts

Maps

Google Maps API

Never introduce new frameworks without approval.

---

# CORE PRINCIPLE

The website is a CLIENT.

It is NOT the backend.

It is NOT the business layer.

It only communicates with APIs.

---

# RESPONSIBILITIES

The website is responsible for

✓ UI

✓ User Experience

✓ Navigation

✓ Forms

✓ Responsive Design

✓ Animations

✓ API Consumption

✓ Client-side caching

✓ Accessibility

The website is NOT responsible for

✗ Business Logic

✗ Permissions

✗ Pricing

✗ Subscription Rules

✗ Validation Rules

✗ Payment Verification

✗ Analytics Calculation

---

# PROJECT STRUCTURE

src/

app/

components/

features/

hooks/

services/

lib/

types/

providers/

stores/

constants/

utils/

styles/

assets/

middleware.ts

Never place business logic inside pages.

---

# FEATURE STRUCTURE

Every feature should follow

features/

business/

components/

hooks/

services/

types/

schemas/

utils/

constants/

pages/

Example

features/

offers/

components/

OfferCard.tsx

OfferGrid.tsx

OfferFilters.tsx

hooks/

useOffers.ts

services/

offer.service.ts

types/

offer.ts

Never mix unrelated features.

---

# COMPONENT RULES

Components should be

Small

Reusable

Typed

Documented

Composable

Avoid components larger than 300 lines.

Split when necessary.

---

# COMPONENT TYPES

Shared Components

Button

Card

Modal

Dialog

Input

Avatar

Badge

Pagination

Feature Components

BusinessCard

OfferCard

CampaignTable

ReviewCard

VendorProfile

Keep them separated.

---

# PAGE RULES

Pages should only

Compose Components

Call Hooks

Handle Layout

Never place API calls directly inside pages.

---

# API RULES

Every API request goes through

services/

Never call fetch() directly from components.

Never duplicate API calls.

---

# SERVICE STRUCTURE

services/

business.service.ts

offer.service.ts

review.service.ts

campaign.service.ts

subscription.service.ts

One service per domain.

---

# API CLIENT

One centralized API client.

Responsible for

Authentication

Headers

Retry

Token Refresh

Tenant Headers

Error Handling

Logging

Never create multiple API clients.

---

# STATE MANAGEMENT

Use Zustand only for

Authentication

Theme

Global Settings

Notifications

Temporary UI State

Never store server data globally.

Use TanStack Query.

---

# SERVER STATE

Use TanStack Query.

Examples

Businesses

Offers

Reviews

Campaigns

Analytics

Never use Zustand for server state.

---

# FORMS

All forms must use

React Hook Form

+

Zod

Never build custom validation systems.

---

# TYPES

Every API response must have TypeScript types.

Never use

any

Never ignore TypeScript errors.

---

# IMPORT RULES

Prefer absolute imports.

Example

@/components

@/features

@/hooks

Avoid long relative imports.

---

# STYLING

Tailwind only.

Never mix

Bootstrap

Material UI

Inline CSS

Global CSS

without approval.

---

# DESIGN TOKENS

Never hardcode

Colors

Spacing

Radius

Typography

Use Tailwind tokens.

---

# RESPONSIVE DESIGN

Every page must support

Mobile

Tablet

Laptop

Desktop

Desktop-only pages are not acceptable.

---

# LOADING

Every page must include

Skeletons

Loading Indicators

Fallback UI

Never leave blank screens.

---

# ERROR HANDLING

Every API request must handle

Loading

Success

Empty

Unauthorized

Error

Timeout

Offline

Gracefully.

---

# AUTHENTICATION

Authentication state belongs in

Auth Store

Never store tokens in random places.

Use secure storage mechanisms.

---

# PERMISSIONS

Frontend may hide UI.

Backend decides access.

Never rely on frontend permissions.

---

# ROUTING

Use App Router.

Organize routes logically.

Example

/businesses

/businesses/[slug]

/offers

/dashboard

/admin

Never create deeply nested routes unnecessarily.

---

# SEO

Every public page should include

Title

Description

Canonical URL

Open Graph

Twitter Card

Structured Data

Sitemap

Robots

SEO is mandatory.

---

# PERFORMANCE

Optimize

Images

Fonts

Bundles

Lazy Loading

Dynamic Imports

Memoization

Never optimize prematurely.

Measure first.

---

# ACCESSIBILITY

Support

Keyboard Navigation

ARIA Labels

Screen Readers

Focus Management

Color Contrast

Accessibility is required.

---

# FILE NAMING

Components

PascalCase

BusinessCard.tsx

Hooks

camelCase

useBusinesses.ts

Utilities

camelCase

formatDate.ts

Types

camelCase

business.ts

Consistency matters.

---

# TESTING

Critical components should include

Unit Tests

Integration Tests

Accessibility Tests

Visual Testing (future)

---

# CODE STYLE

Functions should do one thing.

Avoid deeply nested logic.

Extract reusable utilities.

Prefer readability over cleverness.

---

# AI CODING RULES

Before creating a component

Search existing components.

Reuse if possible.

Before creating an API service

Check existing services.

Before creating hooks

Search existing hooks.

Never duplicate.

---

# DEFINITION OF DONE

A web feature is complete only when

✓ Responsive

✓ Accessible

✓ Type-safe

✓ API integrated

✓ Loading state

✓ Error state

✓ Empty state

✓ Tests (where applicable)

✓ Documentation updated

✓ Code reviewed

---

# NEVER DO THIS

❌ Business Logic in Components

❌ API Calls in JSX

❌ Duplicate Components

❌ Hardcoded Colors

❌ Inline Styles

❌ Massive Components

❌ Multiple API Clients

❌ any Type

❌ Ignored TypeScript Errors

❌ Direct Database Access

---

# FINAL RULE

The website exists to provide an exceptional user experience.

Every business decision belongs to Laravel.

Every visual decision belongs to Next.js.

Keep those responsibilities separate at all times.