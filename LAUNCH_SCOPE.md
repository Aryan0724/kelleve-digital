# FINDMYINTERIOR.COM — LAUNCH SCOPE

Version: 1.1
Last Updated: 2026-06-12 (Stack confirmed)

---

## PURPOSE

This document defines the EXACT scope of the MVP launch.

Once development begins, this document is frozen.

Any feature not listed below is PHASE 2.

No exceptions.

---

## MVP — WHAT WE ARE BUILDING

### 1. Authentication

✅ Register (with role selection)
✅ Login
✅ Logout
✅ Forgot Password
✅ Email Verification
✅ Token-based auth (Laravel Sanctum)

---

### 2. Homepage

✅ Top Bar (phone, email, social links)
✅ Navigation with dropdowns
✅ Hero Section with search
✅ Stats Bar (counters)
✅ Browse By Services (10 categories)
✅ Live Projects Marketplace section
✅ Builder Projects Hub section
✅ Upcoming Possession Projects section
✅ Skilled Workers section
✅ Suppliers & Vendors section
✅ Feature Highlights (5 icons)
✅ Partner Brands Logo Slider (Kleve Ecosystem)
✅ Trust Section
✅ Footer

---

### 3. Directory & Search

✅ Directory page (all categories)
✅ Category directory pages (e.g. /directory/interior-designers)
✅ Global search with filters
✅ Filters: Category, City, District, Verified, Featured, Rating
✅ Paginated results

---

### 4. Listing Profiles

✅ Professional profile page (Houzz-style)
✅ Profile gallery
✅ Services section
✅ Location (city, district)
✅ Contact section
✅ Inquiry form
✅ Reviews display

---

### 5. Builder Hub

✅ Builder directory page
✅ Builder profile page
✅ Builder's projects list
✅ Project gallery (images)
✅ Possession-ready project section
✅ Inquiry form on builder profile

---

### 6. Supplier Marketplace

✅ Supplier directory page
✅ Supplier profile page
✅ Supplier product listings
✅ Product detail (image, price range, unit)
✅ Inquiry form on supplier profile

---

### 7. Workforce Marketplace

✅ Workers directory page
✅ Worker profile page
✅ Skill, experience, location display
✅ Daily rate display (optional)
✅ Inquiry form

---

### 8. Requirement System

✅ Post a requirement form (multi-step)
✅ Project type, budget, location, description, images
✅ Contact details (name, phone)
✅ Guest submission allowed
✅ Lead stored in database
✅ Admin can view all requirements

---

### 9. Admin Dashboard

✅ Dashboard stats (users, listings, leads, revenue)
✅ User management (list, view, activate/deactivate)
✅ Listing management (approve, feature, suspend)
✅ Builder management
✅ Supplier management
✅ Worker management
✅ Requirements / Leads viewer
✅ Blog management (CRUD)
✅ Payment records viewer
✅ Subscription plan management

---

### 10. Payments

✅ Premium Listing upgrade (one-time payment)
✅ Featured Listing upgrade (one-time payment)
✅ Subscription Plans (Basic, Professional, Premium)
✅ Razorpay payment gateway
✅ Payment verification + webhook
✅ Payment history for users

---

### 11. Blog

✅ Blog listing page
✅ Blog detail page
✅ Admin can create/edit/publish blogs
✅ SEO-optimized blog URLs

---

### 12. SEO

✅ SSR for all public pages
✅ Dynamic meta titles and descriptions
✅ Open Graph tags
✅ JSON-LD structured data (LocalBusiness, Product, BlogPosting)
✅ Dynamic sitemap.xml
✅ robots.txt
✅ Canonical URLs

---

### 13. Notifications

✅ WhatsApp API notification on new inquiry received
✅ WhatsApp API notification on new requirement submitted
✅ Email notification on new inquiry received
✅ Email notification on registration welcome
✅ Email notification on password reset
✅ Email notification on payment success

> **Provider**: WhatsApp Business API (Meta) or 360Dialog / Interakt for India
> **Email**: Laravel Mail + Mailgun or AWS SES

---

### 14. Seed Marketplace Data (Pre-Launch)

✅ 38 Bihar districts seeded
✅ Major Bihar cities seeded
✅ 10 categories seeded
✅ 3 subscription plans seeded
✅ 50 dummy professionals (listings)
✅ 20 dummy builders + 5 projects each
✅ 20 dummy suppliers + 5 products each
✅ 50 dummy workers
✅ 10 dummy blog posts

---

## PHASE 2 — NOT IN MVP

The following features are EXPLICITLY excluded from MVP.

Do not build these until Phase 2 is formally started.

### Communication
❌ Real-time chat (bidirectional, like WhatsApp clone)
❌ WhatsApp drip campaigns / bulk broadcast
❌ Push notifications (mobile/PWA)
❌ Email drip campaigns / marketing sequences

> ✅ Transactional WhatsApp + Email ARE in MVP (inquiry alerts, welcome, payment)
> ❌ Only marketing/broadcast automation is Phase 2

### Advanced Features
❌ Booking / scheduling engine
❌ RFQ / quote negotiation system
❌ Tender & bidding engine (real)
❌ Complex cost estimator
❌ RERA API verification
❌ Project management software
❌ Construction tracking
❌ Team management

### Platform Expansion
❌ Mobile app (iOS/Android)
❌ Pan-India expansion
❌ Multi-language support
❌ Social feed / community
❌ Awards / competitions
❌ E-commerce cart / checkout
❌ B2B marketplace

### Business Tools
❌ CRM
❌ ERP integration
❌ Analytics dashboard (Google Analytics is sufficient for MVP)
❌ GST invoicing engine
❌ Report / flag listing system

---

## CONFIRMED TECH STACK

| Layer | Technology |
|---|---|
| Frontend | Next.js + TailwindCSS |
| Backend | Laravel 12 |
| Database | MySQL |
| Server | AWS / DigitalOcean |
| Storage | AWS S3 |
| SEO | Next.js SSR |
| Notifications | WhatsApp Business API + Email (Laravel Mail) |
| Payments | Razorpay |

---

## DECISIONS LOG

| Decision | Choice | Reason |
|---|---|---|
| Auth method | Token-based (Sanctum) | Simpler for cross-domain Next.js ↔ Laravel |
| Geography | Bihar only | Focused launch |
| Lead unlock | Premium subscribers see all leads | Simpler than pay-per-lead |
| Tender & Bidding | Marketing section only | Not a real bidding engine |
| Cost Calculator | Simple static calculator | Not enterprise software |
| Kleve Ecosystem | Partner Brands Showcase | Logo slider only |
| SEO strategy | Next.js SSR | Full App Router SSR |
| File uploads | AWS S3 directly | Server confirmed as AWS |
| Repo structure | 2 separate repos | Easier deployment + debugging |
| Notifications | WhatsApp API + Email | Transactional only, confirmed in stack |

---

## FROZEN SCOPE RULE

Once development begins:

1. No new features added to MVP without written approval.
2. New ideas go to PHASE_2.md document.
3. Scope changes require full re-estimation.

END OF DOCUMENT
