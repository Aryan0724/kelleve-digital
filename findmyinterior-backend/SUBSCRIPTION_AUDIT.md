# FIND MY INTERIOR — SUBSCRIPTION AUDIT BASELINE
**Generated:** 2026-09-10  
**Auditor:** Antigravity AI  
**Status:** PRE-IMPLEMENTATION BASELINE — Do NOT mark anything VERIFIED without end-to-end proof.

---

## 1. CANONICAL PLAN CONTRACT (Source of Truth)

All implementation must conform to this specification. Do NOT deviate.

| Feature | Starter (Free) | Growth (₹4,499) | Professional (₹8,999) | Elite (₹17,999) |
|---------|:-:|:-:|:-:|:-:|
| Business Listings | 1 | 1 | 3 | 5 |
| Portfolio Images | 5 | 15 | 30 | 60 |
| Bid on Projects | ✅ | ✅ | ✅ | ✅ |
| View Projects | ✅ | ✅ | ✅ | ✅ |
| WhatsApp Button | ❌ | ✅ | ✅ | ✅ |
| Website Link | ❌ | ✅ | ✅ | ✅ |
| Category Lead Notifications | ❌ | ✅ | ✅ | ✅ |
| Instant Lead Notifications | ❌ | ❌ | ✅ | ✅ |
| Real-Time Lead Alerts | ❌ | ❌ | ❌ | ✅ |
| Early Lead Access (hours) | 0 | 0 | 2h | 0 (immediate) |
| Search Ranking Boost | 0 | +10 | +30 | +25 |
| Recommendation Score | 0 | +5 | +15 | +25 |
| Contact Unlock Discount | 0% | 10% | 20% | 30% |
| Trusted Professional Badge | ❌ | ❌ | ✅ | ✅ |
| Elite Professional Badge | ❌ | ❌ | ❌ | ✅ |
| Category Spotlight | ❌ | ❌ | ✅ | ✅ |
| Top-3 Category Placement | ❌ | ❌ | ❌ | ✅ |
| Homepage Featured Slot | ❌ | ❌ | ❌ | ✅ |
| Weekly Analytics | ❌ | ❌ | ✅ | ✅ |
| Full Analytics Dashboard | ❌ | ❌ | ❌ | ✅ |
| Competitor Insights | ❌ | ❌ | ❌ | ✅ |
| Priority Admin Support | ❌ | ❌ | ❌ | ✅ |
| "Responds Fast" Badge | ❌ | ❌ | ❌ | ✅ |

---

## 2. PLAN DEFINITION DISCREPANCY (CRITICAL)

The current system has **multiple conflicting plan definitions** across layers:

| Source File | Plans Defined | Plans Match Canonical? |
|-------------|--------------|----------------------|
| `SubscriptionPlanSeeder.php` | Starter, QuickStart, GrowthPlus, ProBusiness, EliteBusiness | ❌ NO |
| Seeder slugs | `starter`, `quickstart`, `growthplus`, `probusiness`, `elitebusiness` | ❌ NO |
| Seeder prices | ₹0, ₹4,999, ₹9,999, ₹17,999, ₹35,999 | ❌ NO |
| Canonical intent | Starter, Growth, Professional, Elite | ✅ TARGET |
| Canonical prices | ₹0, ₹4,499, ₹8,999, ₹17,999 | ✅ TARGET |
| `PaymentController.php:218-228` | Hardcoded slug matching on `quickstart`, `growthplus` for expiry | ❌ WILL BREAK with new slugs |
| `ProfileController.php:312` | Hardcodes `'probusiness', 'elitebusiness'` for custom URL check | ❌ WILL BREAK |
| `PaymentController.php:243-247` | Hardcodes `'elitebusiness', 'probusiness', 'growthplus'` for verification level | ❌ WILL BREAK |
| `ListingResource.php:63` | Hardcodes `'elitebusiness'`, `'probusiness'` for badge_type computation | ❌ WILL BREAK |
| `FMI frontend` | Pricing page — dynamically fetches from API `/api/v1/subscriptions/plans` | ✅ GOOD |

**Resolution Required:** Migrate plans to canonical slugs: `starter`, `growth`, `professional`, `elite`. Replace all hardcoded slug references with data-driven checks (`badge_type`, `plan->price_yearly`, etc.).

---

## 3. CURRENT DATABASE PLAN DEFINITIONS (Actual Live State)

Plans in DB (from Seeder): `Starter`, `QuickStart`, `GrowthPlus`, `ProBusiness`, `EliteBusiness`

**Key discrepancies vs canonical:**

| Canonical Benefit | Canonical | Current DB | Gap |
|-----------------|-----------|------------|-----|
| Growth listings | 1 | QuickStart=3 | ❌ Over-generous |
| Growth images | 15 | QuickStart=30 | ❌ Over-generous |
| Growth price | ₹4,499 | ₹4,999 | ❌ Wrong price |
| Professional listings | 3 | GrowthPlus=5 | ❌ Over-generous |
| Professional images | 30 | GrowthPlus=60 | ❌ Over-generous |
| Professional price | ₹8,999 | ₹9,999 | ❌ Wrong price |
| Professional early_access | 2h | GrowthPlus=2h | ✅ |
| Elite listings | 5 | ProBusiness=10 | ❌ Over-generous |
| Elite images | 60 | ProBusiness=100 | ❌ Over-generous |
| Elite price | ₹17,999 | ProBusiness=₹17,999 | ✅ |
| Growth badge | none | QuickStart=elite | ❌ Wrong badge |
| Professional badge | trusted | GrowthPlus=elite | ❌ Wrong badge |
| Elite badge | elite | ProBusiness=elite | ✅ |
| Growth search_boost | +10 | QuickStart=+15 | ❌ |
| Professional search_boost | +30 | GrowthPlus=+25 | ❌ |
| Elite search_boost | +25 | ProBusiness=+50 | ❌ |
| Growth recommendation | +5 | QuickStart=+10 | ❌ |
| Professional recommendation | +15 | GrowthPlus=+20 | ❌ |
| Elite recommendation | +25 | ProBusiness=+35 | ❌ |

---

## 4. FEATURE STATUS MATRIX

### 4.1 LISTING LIMITS
- **Backend enforcement:** ✅ EXISTS — `ProfileController::createListing` checks `EntitlementService::getLimit($user, 'max_listings')` 
- **Correct limits in DB:** ❌ Wrong plan slugs/values (see §3)
- **Downgrade protection:** ✅ EXISTS — existing listings preserved, new creation blocked
- **Bypass protection:** ✅ Backend enforces, not trust frontend
- **Status:** PARTIALLY WORKING — enforcement logic correct, DB plans wrong

### 4.2 PORTFOLIO IMAGE LIMITS
- **Backend enforcement:** ✅ EXISTS — `ProfileController::addGalleryImages` checks `EntitlementService::getLimit($user, 'max_gallery_images')`
- **Correct limits in DB:** ❌ Wrong plan slugs/values
- **Upload vs quota race condition:** ⚠️ POTENTIAL — limit check is `$allowed <= 0` but batch upload; if concurrent requests, could exceed by 1 batch
- **Status:** PARTIALLY WORKING — enforcement logic correct, DB plans wrong

### 4.3 WHATSAPP / WEBSITE BUTTONS
- **Backend enforcement:** ✅ EXISTS — `ProfileController::createListing` and `updateListing` strip `website`/`whatsapp` fields via `EntitlementService::hasFeature`
- **Forces null on downgrade:** ✅ EXISTS — `$data['website'] = null` if no entitlement
- **DB correct:** ❌ Plans have wrong slug — Growth/Starter: `can_add_whatsapp` per seeder maps to QuickStart, not to canonical Growth
- **Status:** PARTIALLY WORKING — enforcement logic correct, DB plans wrong

### 4.4 SEARCH RANKING BOOST
- **Backend computation:** ✅ EXISTS — `ListingController.php:163` and `SearchController.php:50` JOIN subscription_plans, compute `dynamic_trust_score = users.trust_score + COALESCE(search_ranking_boost, 0)`
- **Correctly sorted:** ✅ EXISTS — ordered by `dynamic_trust_score` in `ListingController`
- **DB values correct:** ❌ Wrong plan slugs/values
- **Expired subscription handled:** ✅ LEFT JOIN with `expires_at > now()` check — expired users get COALESCE 0
- **Status:** PARTIALLY WORKING — SQL logic correct, DB plans wrong

### 4.5 RECOMMENDATION SCORE BOOST
- **Field exists in DB:** ✅ `recommendation_score_boost` column exists in `subscription_plans`
- **EntitlementService exposes it:** ✅ `getLimit($user, 'recommendation_score_boost')`
- **Actually used in RecommendationEngineService:** ❌ NOT USED — `RecommendationEngineService::calculateScore()` does NOT apply `recommendation_score_boost` at all
- **RecommendationController:** ❌ Reads pre-computed scores from `requirement_recommendations` table, doesn't re-sort by subscription
- **Status:** BROKEN — field exists, not applied anywhere

### 4.6 LEAD ACCESS / EARLY ACCESS
- **Backend enforcement:** ✅ EXISTS — `OpportunityProjectController::index` computes delay as `(maxSystemAccess - userAccess)` hours
- **Dashboard `recommended_leads`:** ✅ EXISTS — same delay logic applied
- **Notification type (instant/realtime):** ⚠️ PARTIAL — `RecommendationEngineService::notifyTopVendors` sends notifications to ALL matched vendors regardless of subscription tier; does NOT filter by `lead_notification_type`
- **DB values correct:** ❌ Wrong plan slugs/values
- **Status:** PARTIALLY WORKING — delay enforced, notification tier NOT enforced

### 4.7 CONTACT UNLOCK DISCOUNTS
- **Backend enforcement:** ✅ EXISTS — `PaymentController::createOrder` fetches `contact_unlock_discount_percent` via `EntitlementService::getLimit`, applies discount server-side before creating Razorpay order
- **Client cannot manipulate price:** ✅ — backend determines Razorpay order amount
- **DB values correct:** ❌ Wrong plan slugs/values
- **Status:** PARTIALLY WORKING — logic correct, DB plans wrong

### 4.8 BADGES (Trusted / Elite / Responds Fast)
- **Field in DB:** ✅ `badge_type` column exists in `subscription_plans`
- **Returned in SubscriptionPlanResource:** ✅ 
- **`ListingResource` returns badge:** ⚠️ YES BUT WRONG — computes badge from hardcoded slug names (`elitebusiness`, `probusiness`) NOT from plan's `badge_type` field
- **Public profile returns badge:** ✅ via `ListingResource`
- **Search results show badge in UI:** Need to check frontend
- **Responds Fast badge:** ❌ NOT IMPLEMENTED — no response-time tracking, no entitlement check, nothing
- **Status:** PARTIALLY WORKING for listed badge; BROKEN for Responds Fast

### 4.9 CATEGORY SPOTLIGHT (Professional)
- **Backend implementation:** ❌ NOT IMPLEMENTED — no spotlight table, no spotlight field, no spotlight query
- **Frontend implementation:** ❌ NOT IMPLEMENTED
- **Status:** NOT IMPLEMENTED

### 4.10 TOP-3 CATEGORY PLACEMENT (Elite)
- **Backend implementation:** ❌ NOT IMPLEMENTED as a dedicated placement. The search ranking boost partially achieves this effect but does NOT guarantee top-3 position.
- **Frontend implementation:** ❌ NOT IMPLEMENTED
- **Status:** NOT IMPLEMENTED (partially approximated by ranking boost)

### 4.11 HOMEPAGE FEATURED SLOT (Elite)
- **`is_featured_listing` field in plans:** ✅ EXISTS
- **`dynamic_is_featured` in ListingController:** ✅ EXISTS — computed from plan's `is_featured_listing`
- **FMI homepage uses it:** Need to verify; listing is ordered by `dynamic_is_featured` in search
- **Explicitly Elite-only:** ❌ ProBusiness and EliteBusiness both have `is_featured_listing = true` in seeder
- **Dedicated "Homepage Featured Slot" section:** ❌ NOT IMPLEMENTED as a named section
- **Status:** PARTIALLY WORKING — ordering boost exists, dedicated slot not implemented

### 4.12 ANALYTICS (Weekly/Full)
- **Data exists:** ✅ `analytics_events` table exists, `views_count`, `phone_clicks`, `whatsapp_clicks`, `website_clicks` tracked in `listings`
- **DashboardController returns analytics:** ✅ Returns views, clicks, inquiries, recent visitors
- **Subscription-gated:** ❌ NOT GATED — ALL authenticated users receive full analytics data regardless of plan
- **Weekly vs Full distinction:** ❌ NOT IMPLEMENTED — no time-window filtering, no tier differentiation
- **Status:** BROKEN — analytics exist but NOT subscription-gated

### 4.13 COMPETITOR INSIGHTS (Elite)
- **Backend:** ❌ NOT IMPLEMENTED
- **Frontend:** ❌ NOT IMPLEMENTED
- **Data to support it:** ✅ Aggregate data available (avg_rating, reviews, response rate in VendorMetric)
- **Status:** NOT IMPLEMENTED

### 4.14 PRIORITY SUPPORT (Elite)
- **Inquiry model has priority:** ❌ `priority` field does NOT exist in `Inquiry` model or `inquiries` table
- **Admin panel shows priority:** ❌ NOT IMPLEMENTED
- **Status:** NOT IMPLEMENTED

### 4.15 PAYMENT FLOW / RAZORPAY
- **Create Razorpay order:** ✅ EXISTS — uses backend canonical price from DB (`plan->price_yearly`)
- **Signature verification:** ✅ EXISTS — `utility->verifyPaymentSignature`
- **Idempotency (duplicate webhook):** ✅ EXISTS — `lockForUpdate()` + `if ($payment->status === 'success') return already fulfilled`
- **Subscription activated:** ✅ EXISTS — creates `UserSubscription` record
- **Cancels previous subscription:** ✅ EXISTS — `UserSubscription::where('user_id')->status(active)->update(cancelled)`
- **Expiry duration:** ❌ HARDCODED to plan slugs (`quickstart`, `growthplus`) — will break with new slugs
- **Welcome message:** ✅ EXISTS
- **Notification on activation:** ✅ EXISTS
- **Status:** PARTIALLY WORKING — logic correct, hardcoded slugs will break with canonical plan migration

### 4.16 SUBSCRIPTION EXPIRY ENFORCEMENT
- **UserSubscription.scopeActive:** ✅ Checks `status = active AND expires_at > now()`
- **EntitlementService.getActivePlan:** ✅ Checks both conditions
- **SearchController JOIN:** ✅ Filters `user_subscriptions.expires_at > now()`
- **Real-time enforcement on API:** ✅ Every API call through EntitlementService gets current live subscription
- **Status:** WORKING

### 4.17 FRONTEND SUBSCRIPTION PAGE
- **FMI Pricing page:** ✅ Fetches from `/api/v1/subscriptions/plans` API (dynamic)
- **FMI Dashboard subscription section:** Need to verify
- **Status:** Need verification

### 4.18 ADMIN SUBSCRIPTION MANAGEMENT
- **Admin can view subscriptions:** ✅ `AdminController` has `dashboard()` with active subscription count
- **Admin can view user's current plan:** Need to verify
- **Admin can diagnose "user paid but no entitlement":** ❌ No dedicated diagnostic endpoint
- **Admin delete Requirements:** ❌ No Delete button in admin UI (only Approve/Reject/Reopen/Expire)
- **Status:** PARTIALLY IMPLEMENTED

### 4.19 CONCURRENCY PROTECTION
- **Listing creation:** ❌ No transaction/lock — concurrent requests could exceed limit by 1
- **Gallery upload:** ❌ No transaction/lock — batch upload could race
- **Payment processing:** ✅ Uses `lockForUpdate()` in `verify()`
- **Status:** PARTIALLY WORKING — payment OK, listing/gallery vulnerable

---

## 5. HARDCODED REFERENCES THAT MUST BE REPLACED

| File | Line | Hardcoded Value | Risk |
|------|------|----------------|------|
| `PaymentController.php` | 220-225 | `'starter'`, `'quickstart'`, `'growthplus'` in `fulfillPayment` expiry logic | Will break after plan migration |
| `PaymentController.php` | 243-247 | `'elitebusiness'`, `'probusiness'`, `'growthplus'` for `verificationLevel` | Will break after plan migration |
| `PaymentController.php` | 250 | `in_array($plan->slug, ['elitebusiness', 'probusiness'])` for featured | Will break |
| `ProfileController.php` | 312 | `in_array($plan?->slug, ['probusiness', 'elitebusiness'])` for custom URL | Will break |
| `ListingResource.php` | 63 | Badge computation based on hardcoded slugs | Will break |
| `EntitlementService.php` | 33-35 | Role-to-prefix mapping for Starter fallback | Needs updating for new slugs |
| `EntitlementService.php` | 39 | `$prefix . 'starter'` lookup | Needs updating |

---

## 6. MISSING FEATURES (Not Implemented)

1. **Recommendation Score Boost** — field exists, never applied in scoring
2. **Category Spotlight Placement** — no backend or frontend implementation
3. **Top-3 Category Placement** — no guaranteed position, only ranking boost approximation
4. **Homepage Featured Slot** — no dedicated named slot, only search ordering boost
5. **Analytics Subscription Gating** — all users see all analytics
6. **Weekly vs Full Analytics distinction** — no time-window logic
7. **Competitor Insights** — no implementation
8. **Priority Support flag** — no `priority` field in inquiries
9. **Responds Fast Badge** — no response time tracking
10. **Lead Notification Type enforcement** — `lead_notification_type` field exists but `notifyTopVendors` ignores it
11. **Admin delete Requirements/Worker Jobs/RFQs** — UI missing Delete button

---

## 7. IMPLEMENTATION PHASES

Phases ordered by dependency chain:

```
Phase A: Canonical Plan Migration (DB + Seeder)
    ↓
Phase B: Fix hardcoded slug references in backend
    ↓
Phase C: Recommendation Score Boost
Phase D: Lead Notification Type enforcement
Phase E: Concurrency protection (listing/gallery)
    ↓
Phase F: Analytics subscription gating
Phase G: Competitor Insights
Phase H: Priority Support flag
Phase I: Category Spotlight + Top-3 placement
Phase J: Homepage Featured Slot (dedicated)
Phase K: Responds Fast Badge
Phase L: Admin UI — delete Requirements/Worker Jobs/RFQs
Phase M: Frontend — remove hardcoded plan display, use API
    ↓
Phase N: Automated tests
Phase O: End-to-end test users
```

---

## 8. FILES TO MODIFY

### Backend (PHP/Laravel)
- `database/seeders/SubscriptionPlanSeeder.php` — Replace with canonical plans
- `database/migrations/` — New migration to add `billing_period_months` column
- `app/Http/Controllers/User/PaymentController.php` — Fix hardcoded slugs, use `billing_period_months`
- `app/Http/Controllers/User/ProfileController.php` — Fix hardcoded slug check for custom URL
- `app/Http/Resources/ListingResource.php` — Fix badge_type computation
- `app/Services/RecommendationEngineService.php` — Apply `recommendation_score_boost`
- `app/Services/EntitlementService.php` — Add `hasAnalytics()`, `getAnalyticsTier()`, `isElite()`, `isProfessionalPlus()`
- `app/Http/Controllers/User/DashboardController.php` — Gate analytics by subscription
- `app/Http/Controllers/Admin/AdminController.php` — Add delete methods
- `app/Models/Inquiry.php` — Add `priority` field
- `app/Notifications/NewLeadNotification.php` — Respect `lead_notification_type`
- `routes/api.php` — Add admin delete routes

### Database Migrations (New, Additive Only)
- Migrate plan slugs: `quickstart→growth`, `growthplus→professional`, `probusiness→elite`, remove `elitebusiness`
- Add `billing_period_months` to `subscription_plans`  
- Add `priority` column to `inquiries`
- Add `is_spotlight` to `listings` (for Category Spotlight)

### Frontend (Next.js/TSX)
- `src/app/(dashboard)/subscription/page.tsx` — Verify it uses API (not hardcoded)
- `src/app/(dashboard)/analytics/page.tsx` — Gate advanced sections behind plan tier
- `src/components/ui/VerifiedBadge.tsx` — Map new slug names

---

## 9. TESTING PROTOCOL

After each phase:
1. Create test user with specific plan
2. Call relevant API endpoint directly (not via UI)
3. Verify response matches plan contract
4. Verify expired plan reverts to Starter behavior
5. Verify API bypass (Starter user calling endpoint without plan) returns 403

---

## 10. PRODUCTION SAFETY RULES

- ❌ NO `migrate:fresh`, `migrate:refresh`, `db:wipe`, `truncate`
- ✅ All migrations ADDITIVE only (new columns, new rows)
- ✅ Plan migration uses `updateOrCreate`, NOT `truncate + create`
- ✅ Test migration rollback before applying
- ✅ No production deployment until ALL local tests pass
