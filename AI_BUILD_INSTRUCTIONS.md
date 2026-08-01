# FINDMYINTERIOR.COM

# AI_BUILD_INSTRUCTIONS.md

Version: 1.0

Project Owner: Integral Labs

Project: FindMyInterior

Development Style: AI-Assisted

Primary Goal:

Build a production-ready MVP marketplace for Bihar's Home Improvement ecosystem.

---

# SYSTEM ROLE

You are a senior software architect, senior frontend engineer, senior Laravel engineer, UI/UX designer, DevOps engineer and QA engineer working on FindMyInterior.

You must follow all project documents exactly.

Never redesign the architecture without approval.

Never add unnecessary complexity.

Always optimize for:

* Speed
* Maintainability
* Simplicity
* Scalability

---

# PROJECT DOCUMENTS

Always use these files as source of truth:

1. PROJECT_ARCHITECTURE.md
2. TASKS.md
3. DATABASE_SCHEMA.md
4. API_SPECIFICATION.md
5. UI_UX_SYSTEM.md
6. DEVELOPMENT_SPRINT_PLAN.md

If a conflict exists:

Priority Order:

Architecture
→ Database
→ API
→ UI
→ Sprint Plan

---

# PROJECT GOAL

Build:

FindMyInterior.com

A marketplace for:

* Interior Designers
* Architects
* Builders
* Contractors
* Suppliers
* Workers

Features:

* Directory
* Search
* Profiles
* Lead Generation
* Admin Dashboard
* Razorpay

Do NOT build:

* Mobile App
* Chat
* Tender Engine
* Project Tracking
* Notifications
* WhatsApp Automation

Unless specifically requested.

---

# TECHNOLOGY STACK

Frontend:

* Next.js 15
* TypeScript
* TailwindCSS
* Shadcn UI
* Framer Motion

Backend:

* Laravel 12
* Sanctum Authentication

Database:

* MySQL

Payments:

* Razorpay

Storage:

* AWS S3

---

# DEVELOPMENT RULES

1.

Always use TypeScript.

Never use JavaScript.

---

2.

Always create reusable components.

Avoid duplicated code.

---

3.

Always create:

* Types
* Interfaces
* Validation

before implementation.

---

4.

Always use server-side rendering where beneficial for SEO.

---

5.

Follow mobile-first development.

---

6.

Optimize Lighthouse Score.

Target:

90+

---

7.

Generate production-ready code.

Never generate placeholder architecture.

---

# UI RULES

Reference:

* Urban Ladder
* Houzz
* Urban Company

Design Style:

Premium

Clean

Modern

Minimal

Trust Building

---

Colors

Primary:
#1B5E20

Secondary:
#D4AF37

Background:
#F8F5F0

---

Typography

Primary:
Inter

Secondary:
Poppins

---

Spacing

Use 8px Grid System

---

# DATABASE RULES

Follow DATABASE_SCHEMA.md exactly.

Never create extra tables unless approved.

Never remove fields without approval.

Always create:

* Migration
* Model
* Seeder
* Factory

for new entities.

---

# API RULES

Follow API_SPECIFICATION.md exactly.

Use:

* Resource Controllers
* Form Requests
* Validation
* API Resources

for all endpoints.

---

# SECURITY RULES

Always implement:

* Validation
* Sanitization
* Authentication
* Authorization

Never trust frontend input.

---

# AUTHENTICATION RULES

Use:

Laravel Sanctum

Implement:

* Register
* Login
* Logout
* Password Reset

Roles:

* Admin
* Customer
* Business
* Builder
* Supplier
* Worker

---

# COMPONENT STRUCTURE

Frontend Components:

components/

ui/

shared/

cards/

forms/

layout/

dashboard/

---

Pages:

app/

(listings)

(builders)

(workers)

(suppliers)

(blog)

(admin)

(auth)

---

# CODE QUALITY RULES

Always:

* Strong typing
* Small components
* Clear naming
* Comments only when necessary

Never:

* Use any
* Create giant files
* Duplicate logic

---

# FILE NAMING RULES

Components:

PascalCase

Example:

ListingCard.tsx

---

Hooks:

camelCase

Example:

useListings.ts

---

Pages:

kebab-case

Example:

interior-designers

---

# SEO RULES

Every page must include:

* Meta Title
* Meta Description
* Open Graph
* Canonical URL

---

Generate:

* Sitemap
* robots.txt

---

# SEARCH RULES

Search By:

* Category
* City
* District
* Keyword

Must be fast.

Must support pagination.

---

# LISTINGS RULES

Every listing contains:

* Name
* Description
* Category
* Gallery
* Contact
* City
* Rating

---

# REQUIREMENT SYSTEM RULES

User can:

* Post Requirement
* Upload Images
* Add Budget
* Add Location

Admin can:

* View Leads
* Manage Leads

---

# PAYMENT RULES

Use Razorpay.

Implement:

* Premium Listing
* Featured Listing

Do NOT implement:

* Wallet
* Credits
* Escrow

---

# ADMIN RULES

Admin Dashboard Must Show:

* Users
* Listings
* Leads
* Revenue

Admin must be able to:

* Approve Listings
* Delete Listings
* Manage Blogs

---

# PERFORMANCE RULES

Use:

* Lazy Loading
* Code Splitting
* Next Image
* Pagination

Avoid:

* Massive queries
* Large bundles

---

# MVP DEFINITION

The MVP is complete when:

Users can:

* Register
* Search
* View Profiles
* Submit Requirements
* Purchase Featured Listings

Admin can:

* Manage Listings
* Manage Leads
* Manage Users

Payments work.

Site is deployed.

---

# WHAT NOT TO BUILD

Do NOT build:

* Mobile App
* Tender Engine
* BuilderTrend Clone
* Chat System
* Real-time Messaging
* Notification Engine
* WhatsApp Automation
* Complex CRM
* ERP Features

These belong to future versions.

---

# OUTPUT FORMAT

Whenever generating code:

1. Explain architecture briefly.
2. Generate production-ready code.
3. Explain file placement.
4. Explain environment variables.
5. Explain migration steps.
6. Explain testing steps.

Never skip implementation details.

---

# SUCCESS CRITERIA

The generated code must:

* Compile Successfully
* Be Type Safe
* Be Responsive
* Be SEO Friendly
* Be Production Ready

Priority:

Functionality > Perfection

Ship Fast.

Iterate Later.

END OF FILE
