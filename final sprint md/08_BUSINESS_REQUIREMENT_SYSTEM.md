# BUSINESS REQUIREMENT SYSTEM

> **Document Version:** 1.0
> **Priority:** Critical
> **Status:** Final Specification
> **Purpose:** This document defines how every business entity on Find My Interior can create requirements, discover suppliers, hire professionals, and purchase services. The platform should no longer assume that only homeowners create requirements. Every business should become both a buyer and a seller depending on the situation.

---

# 1. Objective

Currently the platform is heavily homeowner-centric.

This is incorrect.

In the real construction industry,

- Builders hire Contractors.
- Contractors hire Workers.
- Contractors purchase Materials.
- Interior Designers hire Carpenters.
- Architects hire Contractors.
- Suppliers hire Delivery Partners.
- Businesses hire Businesses.

The marketplace should reflect this ecosystem.

---

# 2. Core Marketplace Philosophy

Every user can become

Buyer

Seller

Employer

Service Provider

depending on context.

The platform should never permanently classify someone as only one of these.

---

# 3. Who Can Post Requirements

## Homeowner

Can Post

Interior Project

Construction Project

Renovation

Architect Requirement

Landscape Requirement

Furniture Requirement

Consultation

Maintenance Work

---

## Interior Designer

Can Post

Material Requirement

Carpenter Requirement

Painter Requirement

Electrician Requirement

POP Requirement

False Ceiling Requirement

Tile Requirement

Supplier RFQ

Contractor Requirement

---

## Contractor

Can Post

Worker Jobs

Labour Requirement

Supplier RFQ

Equipment Requirement

Subcontract Requirement

Architect Requirement

Engineer Requirement

Interior Designer Requirement

---

## Builder

Can Post

Contractor Requirement

Supplier RFQ

Worker Jobs

PMC Requirement

Architect Requirement

Interior Requirement

Commercial Construction Requirement

---

## Architect

Can Post

Contractor Requirement

Interior Designer Requirement

Survey Requirement

Structural Engineer Requirement

Supplier Requirement

---

## Material Supplier

Can Post

Delivery Partner Requirement

Warehouse Requirement

Sales Executive Requirement

Installation Requirement

Technician Requirement

---

## Skilled Worker

Workers cannot create Projects.

Workers can

Update Availability

Create Service Profile

Receive Job Requests

---

# 4. Dashboard Behaviour

Every dashboard must contain

MY WORK

WHAT I NEED

RECOMMENDED

MESSAGES

NOTIFICATIONS

ANALYTICS

depending upon role.

---

# 5. Professional Requirement Wizard

Every business requirement begins with

"What do you need?"

Options

Professional

Workers

Materials

Equipment

Consultation

Architecture

Construction

Transportation

Warehousing

System dynamically changes the remaining form.

No unnecessary fields should appear.

---

# 6. Requirement Types

Project

RFQ

Worker Job

Subcontract

Consultation

Commercial Contract

Maintenance Contract

AMC

Bulk Purchase

Emergency Requirement

---

# 7. Discovery

Businesses should discover

Projects

Workers

Suppliers

Businesses

Consultants

Architects

Builders

Interior Designers

Contractors

Manufacturers

Distributors

Service Providers

---

# 8. Dashboard Experience

## Contractor Dashboard

Should show

New Projects

Worker Availability

Supplier RFQs

Material Price Trends

Nearby Workers

Nearby Suppliers

Recent Messages

Current Projects

Pending Payments

Current Bids

---

## Builder Dashboard

Should show

Commercial Opportunities

Contractor Discovery

Architect Discovery

Supplier Discovery

Current Construction

Pending RFQs

Worker Statistics

---

## Supplier Dashboard

Should show

Incoming RFQs

Recent Orders

Nearby Contractors

Nearby Builders

Inventory Suggestions

Most Demanded Products

Top Buyers

---

## Interior Designer Dashboard

Should show

Interior Projects

Material Requests

Carpenter Availability

Trending Designs

Supplier Suggestions

Current Clients

---

# 9. Search Behaviour

Search results should depend upon role.

Contractor searching

↓

Workers

Suppliers

Projects

Equipment

---

Supplier searching

↓

RFQs

Builders

Contractors

Interior Designers

---

Worker searching

↓

Jobs

Nearby Contractors

Nearby Builders

---

Homeowner searching

↓

Professionals

Companies

Reviews

Portfolios

---

# 10. Requirement Lifecycle

Business creates Requirement

↓

Matching Businesses notified

↓

Businesses apply

↓

Requirement owner shortlists

↓

Discussion

↓

Award

↓

Execution

↓

Completion

↓

Payment

↓

Reviews

↓

Analytics updated

---

# 11. Messaging

Messages should begin only after

Requirement Posted

Bid Submitted

Shortlisted

Awarded

Direct Business Contact

No random spam messaging.

---

# 12. Recommendation Engine

Recommendations should use

Role

Location

Category

Budget

Skills

Experience

Verification

Trust Score

Recent Activity

Availability

---

# 13. Reviews

Every business interaction becomes reviewable.

Builder ↔ Contractor

Contractor ↔ Worker

Builder ↔ Supplier

Designer ↔ Supplier

Architect ↔ Contractor

Contractor ↔ Supplier

Supplier ↔ Buyer

Reviews should update

Trust Score

Search Ranking

Profile Reputation

---

# 14. Notifications

Businesses receive notifications when

New Requirement

Bid Shortlisted

Bid Accepted

Requirement Closed

Payment Received

Review Received

Message Received

Verification Approved

Subscription Expiring

Lead Matching

---

# 15. Existing Problems That MUST Be Fixed

Current implementation assumes

Customer → Professional

This must be completely removed.

Current dashboards are partially homeowner-centric.

Businesses currently cannot fully create opportunities.

Workers cannot properly receive targeted jobs.

Some searches return irrelevant entities.

Some dashboards display unnecessary widgets.

Everything should become role-aware.

---

# 16. Database Requirements

Every Requirement must store

Creator

Creator Role

Target Roles

Opportunity Type

Category

Subcategory

Priority

Budget

Timeline

City

District

Status

Visibility

Verification Requirement

---

# 17. Admin Controls

Admin should

View every requirement.

Edit requirement.

Approve.

Reject.

Archive.

Feature.

Close.

Transfer ownership.

Suspend abusive businesses.

View requirement analytics.

---

# 18. Verification Checklist

Verify

✓ Contractor can post Labour Requirement.

✓ Builder can post Contractor Requirement.

✓ Designer can post Material Requirement.

✓ Supplier receives RFQs.

✓ Worker receives Jobs.

✓ Businesses can hire Businesses.

✓ Businesses can hire Workers.

✓ Dashboard changes according to role.

✓ Homepage recommendations change according to role.

✓ Search results change according to role.

✓ Notifications trigger correctly.

✓ Reviews generated after completion.

✓ Database stores correct creator and target roles.

---

# 19. Non-Negotiable Rules

- Every business can become both buyer and seller.
- No dashboard should assume only homeowners create requirements.
- Every requirement must target the correct audience.
- Posting forms must dynamically change according to requirement type.
- Search, recommendations, homepage, dashboard and notifications must all respect the user's current role.
- Nothing should be hardcoded.
- All discovery should be generated from live database data.