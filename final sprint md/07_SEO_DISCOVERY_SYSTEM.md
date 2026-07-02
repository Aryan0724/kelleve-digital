# SEARCH, DISCOVERY & SEO SYSTEM SPECIFICATION

> **Document Version:** 1.0
> **Priority:** Critical
> **Status:** Final Specification
> **Purpose:** This document defines the complete discovery architecture of Find My Interior. The goal is that every user, immediately after logging in, sees exactly what they are looking for, can discover relevant opportunities with minimum friction, and search throughout the platform intelligently. This document also covers public SEO pages, recommendation algorithms, homepage personalization, and search ranking.

---

# 1. Objective

The marketplace should never feel empty.

Every user should immediately see relevant opportunities.

Nobody should need to search extensively before finding value.

Search, homepage, dashboard, recommendations and SEO should all work together as one discovery engine.

---

# 2. Discovery Philosophy

Discovery is divided into five layers.

Layer 1
Homepage Discovery

Layer 2
Dashboard Recommendations

Layer 3
Search

Layer 4
Recommendation Engine

Layer 5
SEO Discovery

Every opportunity should eventually appear through one of these five layers.

---

# 3. Homepage Experience

Homepage must NOT be identical for everyone.

Homepage is role-aware.

---

## Homeowner Homepage

Should immediately show

Continue Existing Projects

Recent Messages

Pending Reviews

Saved Professionals

Recommended Professionals

Popular Categories

Trending Interior Styles

Nearby Professionals

Recently Viewed Professionals

Latest Blogs

---

Primary Actions

Post Project

Find Interior Designer

Find Contractor

Find Architect

Find Workers

Find Suppliers

---

## Interior Designer Homepage

Should show

Recommended Projects

Nearby Projects

High Budget Projects

Recently Posted Projects

Trending Categories

New Reviews

Profile Performance

Portfolio Views

Lead Statistics

Subscription Status

Wallet

---

Primary Actions

Browse Projects

Manage Portfolio

Upgrade Subscription

Complete Profile

---

## Contractor Homepage

Should show

Construction Projects

Labour Availability

Supplier Recommendations

Nearby Material RFQs

Worker Availability

Builder Opportunities

Current Jobs

Recent Messages

---

## Supplier Homepage

Should show

New RFQs

Nearby Builders

Nearby Contractors

Trending Products

Orders

Quote Requests

Inventory Suggestions

---

## Worker Homepage

Should show

Nearby Jobs

Urgent Jobs

Highest Paying Jobs

Recently Posted Jobs

Nearby Contractors

Recently Active Employers

Application Status

---

## Builder Homepage

Should show

Interior Requirements

Contractor Discovery

Supplier Discovery

Worker Discovery

Commercial Opportunities

---

# 4. Dashboard Recommendations

Dashboard recommendations are different from homepage.

Dashboard recommendations should be based on

Recent Activity

Location

Skills

Categories

Trust Score

Verification

Subscriptions

Search History

Saved Opportunities

Applied Opportunities

Completed Projects

---

# 5. Smart Search

Search must support

Professionals

Projects

RFQs

Jobs

Suppliers

Workers

Builders

Products

Cities

Districts

Categories

Businesses

Articles

FAQs

---

Autocomplete should suggest

Profession Names

Cities

Categories

Businesses

Requirements

Popular Searches

---

# 6. Search Filters

Profession

Category

City

District

Budget

Experience

Rating

Trust Score

Verification

Availability

Subscription

Response Time

Completed Projects

Languages

Business Type

Distance

Price

---

# 7. Search Ranking

Results should never be random.

Ranking Priority

Verification Level

Trust Score

Reputation Score

Profile Completion

Rating

Review Count

Completed Projects

Subscription

Featured Listing

Recent Activity

Location Match

Keyword Match

---

# 8. Recommendation Engine

Every recommendation should calculate

Role Match

Category Match

Requirement Match

City Match

District Match

Budget Match

Experience Match

Verification

Trust Score

Recent Activity

Response Time

Success Rate

No recommendation should rely on hardcoded ordering.

---

# 9. Saved Items

Every user can save

Projects

RFQs

Jobs

Professionals

Suppliers

Workers

Articles

Saved items synchronize across devices.

---

# 10. Recently Viewed

Track

Professionals

Projects

RFQs

Workers

Suppliers

Show recently viewed everywhere.

---

# 11. Nearby Discovery

Show

Nearby Professionals

Nearby Workers

Nearby Suppliers

Nearby Projects

Nearby Jobs

Nearby RFQs

Nearby Builders

Distance should use

City

District

Future GPS.

---

# 12. Top Professionals

Never hardcoded.

Must calculate from

Trust Score

Reviews

Completed Projects

Verification

Profile Completion

Recent Activity

Success Rate

---

# 13. Featured Listings

Featured professionals appear before organic listings.

After featured listings,

normal ranking resumes.

---

# 14. Public Directory Pages

The platform must expose

Professionals

Workers

Suppliers

Builders

Projects

RFQs

Jobs

through searchable public pages.

---

# 15. SEO Pages

Automatically generate

City Pages

Category Pages

City + Category Pages

Examples

Interior Designers in Patna

Contractors in Delhi

Builders in Mumbai

Architects in Bengaluru

Carpenters in Lucknow

Tile Suppliers in Jaipur

Electricians in Noida

Each page should contain

Unique Meta Title

Unique Description

Schema.org

Canonical URL

Internal Links

Breadcrumb

FAQ

Nearby Cities

Related Categories

Top Professionals

---

# 16. Search Analytics

Track

Popular Searches

No Result Searches

Popular Cities

Popular Categories

Top Viewed Profiles

Most Viewed Projects

Search Conversion

---

# 17. Homepage Analytics

Track

Homepage Clicks

Most Clicked Categories

Most Clicked Professionals

Most Viewed Cards

Recommendation CTR

---

# 18. Existing Issues That MUST Be Fixed

The following issues currently exist and must be eliminated.

✅ Homepage recommendations are partially hardcoded.

✅ Search results are inconsistent.

✅ Top professionals are not database-driven.

✅ Verification has little impact on ranking.

✅ Reviews do not affect discovery.

✅ Trust Score does not influence search correctly.

✅ Some homepage widgets display irrelevant information.

✅ Different roles sometimes receive identical recommendations.

✅ Saved and recently viewed data is incomplete.

Everything must be generated dynamically from database data.

---

# 19. Verification Checklist

Verify

✓ Homeowner sees homeowner homepage.

✓ Worker sees worker homepage.

✓ Supplier sees supplier homepage.

✓ Builder sees builder homepage.

✓ Designers receive project recommendations.

✓ Suppliers receive RFQs.

✓ Workers receive jobs.

✓ Search returns correct entity.

✓ Filters work.

✓ Autocomplete works.

✓ Featured professionals appear correctly.

✓ Top professionals are calculated dynamically.

✓ SEO pages generate correctly.

✓ Homepage is fully role-aware.

---

# 20. Non-Negotiable Rules

- Homepage must be personalized.
- Search must never return irrelevant entities.
- Rankings must always be database-driven.
- Recommendations must adapt continuously.
- SEO pages must be dynamically generated.
- No discovery component should contain hardcoded data.
- Every user should immediately find opportunities relevant to their role.