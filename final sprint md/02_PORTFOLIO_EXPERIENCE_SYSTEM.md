# PROFESSIONAL PROFILE, PORTFOLIO & TRUST SYSTEM SPECIFICATION

> **Document Version:** 1.0
> **Priority:** Critical
> **Status:** Final Specification
> **Purpose:** This document defines how professionals build trust on the platform, how portfolios work, how verification works, how profiles evolve over time, and how customers evaluate professionals before hiring them.

---

# 1. Objective

A professional profile should function like a digital company profile.

It should answer every question a customer has before hiring.

The profile must build trust through:

- Identity
- Business verification
- Portfolio
- Reviews
- Completed projects
- Experience
- Response rate
- Performance history

The profile should become stronger over time instead of remaining static.

---

# 2. Supported Professional Types

The profile system must support all professional categories.

- Interior Designer
- Interior Company
- Architect
- Contractor
- Builder
- Material Supplier
- Skilled Worker

Each role has different profile fields.

---

# 3. Profile Completion

Every professional starts with

```
0%
```

Profile completion is calculated dynamically from database data.

Never hardcode percentages.

---

## Profile Completion Components

### Basic Information

- Profile Photo
- Name
- Phone
- Email
- Bio

Weight:
10%

---

### Business Information

Applicable where required.

- Business Name
- GST
- Address
- Business Category
- Years in Business

Weight:
15%

---

### Verification

- Government ID
- GST
- Business Registration
- Address Proof

Weight:
15%

---

### Portfolio

- Images
- Videos
- Completed Projects
- Before/After Photos

Weight:
20%

---

### Experience

- Years Experience
- Skills
- Categories
- Services

Weight:
10%

---

### Reviews

Calculated automatically.

Weight:
15%

---

### Platform Activity

- Response Rate
- Response Time
- Completed Jobs

Weight:
15%

---

Total

100%

---

# 4. Trust Score

Profile Completion is NOT Trust Score.

Trust Score measures reliability.

Scale

```
0 - 100
```

---

## Trust Score Factors

Identity Verification

20%

Business Verification

20%

Completed Projects

15%

Average Rating

15%

Response Time

10%

Project Success Rate

10%

Dispute History

-10%

Account Age

10%

---

Trust Score updates automatically.

Never manually edited.

---

# 5. Verification Levels

Level 0

Basic User

Gray Badge

---

Level 1

Identity Verified

Blue Badge

---

Level 2

Business Verified

Green Badge

---

Level 3

Trusted Professional

Gold Badge

---

Level 4

Elite Professional

Platinum Badge

Admin grants manually.

---

# 6. Manual Verification Workflow

The platform uses ONLY manual verification.

No OCR.

No AI approval.

No automatic approvals.

---

User uploads documents.

↓

Status

Pending

↓

Admin reviews.

↓

Approve

or

Reject

↓

Reason stored.

↓

User notified.

---

# 7. Required Documents

## Interior Designer

- Aadhaar
- PAN
- GST
- Business Registration
- Office Image
- Logo

---

## Contractor

- Aadhaar
- GST
- PAN
- Business Registration
- Office Image

---

## Builder

- GST
- Registration Certificate
- PAN
- Office Images

---

## Supplier

- GST
- PAN
- Warehouse Images
- Shop Images

---

## Worker

- Aadhaar
- Self Photo
- Skill Photo
- Optional Experience Certificate

Workers should NOT be asked for GST.

---

# 8. Public Profile Layout

Every profile contains

---

## Header

- Name
- Badge
- Trust Score
- Rating
- Reviews
- Years Experience

---

## About

Professional introduction.

---

## Services

List of services.

---

## Categories

Interior

Construction

Architecture

Furniture

Civil

Electrical

etc.

---

## Areas Served

Cities

Districts

States

---

## Portfolio

Image Gallery

Video Gallery

Completed Projects

Before/After

---

## Reviews

Chronological.

Verified only.

---

## Statistics

Projects Completed

Response Time

Response Rate

Success Rate

Repeat Customers

Years Experience

---

## Verification

Visible badges.

Customer can see

Verified GST

Verified Business

Verified Identity

---

## Contact

Visible only after

Unlock

Award

Subscription permissions

---

# 9. Portfolio System

Portfolio is separate from Reviews.

Portfolio showcases work.

Review shows customer satisfaction.

---

Portfolio supports

Images

Videos

PDF

Drawings

3D Renders

Site Photos

Completion Photos

---

# 10. Portfolio Categories

Interior

Architecture

Construction

Furniture

Civil

Commercial

Residential

Hospitality

Retail

Industrial

---

# 11. Portfolio Upload Rules

Every portfolio item stores

Title

Description

Category

Location

Completion Date

Project Cost

Images

Videos

Cover Image

---

# 12. Portfolio Approval

Portfolio uploads

Pending

↓

Admin Review

↓

Approved

↓

Visible

---

Rejected items remain hidden.

---

# 13. Automatic Portfolio Growth

Completed marketplace projects can be added.

Flow

Project Completed

↓

Professional clicks

Add to Portfolio

↓

Customer Consent

↓

Admin Review

↓

Published

---

# 14. Experience System

Experience cannot be freely edited.

User enters

Years Experience

Admin verifies.

Platform also calculates

Marketplace Experience

Completed Projects

Project Value

Categories Served

---

# 15. Vendor Statistics

Every professional profile displays

Projects Completed

Projects Active

Projects Won

Bid Win Rate

Average Bid Time

Average Response Time

Repeat Clients

Average Rating

Review Count

Portfolio Count

Trust Score

Verification Level

---

# 16. Search Ranking Factors

Search order must NEVER be random.

Ranking factors

Trust Score

Verification Level

Rating

Completed Projects

Response Rate

Subscription

Featured Listing

Location Match

Recent Activity

---

# 17. Profile Visibility

Anonymous visitors

See public information.

---

Logged in customers

See

Portfolio

Reviews

Statistics

Badges

---

Unlocked customers

See

Phone

WhatsApp

Email

---

# 18. Messaging Entry

Customer can message only if

Contact unlocked

OR

Bid submitted

OR

Project awarded

---

# 19. Reviews Integration

Every completed project contributes to

Review Count

Average Rating

Trust Score

Experience

Portfolio

Success Rate

---

No hardcoded values.

Everything comes from database.

---

# 20. What Customer Should Feel

After opening a profile, customer should immediately know

Can I trust this professional?

How experienced are they?

What projects have they completed?

How many people hired them?

Are they verified?

Are they active?

Are they responsive?

Do they specialize in my requirement?

Would I confidently spend ₹20 lakh with them?

If any of these questions cannot be answered from the profile,

the profile is incomplete.

---

# 21. Database Requirements

Every professional profile should persist

Basic Details

Business Details

Verification Status

Trust Score

Profile Completion

Portfolio

Statistics

Reviews

Experience

Services

Areas Served

Verification Documents

Badges

No profile data should reset after refresh.

Everything must be loaded from database.

---

# 22. Non-Negotiable Rules

- No fake experience.
- No fake reviews.
- No automatic verification.
- Every badge requires admin approval.
- Workers have different verification requirements than businesses.
- Trust Score is dynamic.
- Profile Completion is dynamic.
- Portfolio is moderated.
- Completed projects strengthen the profile automatically.
- Customer must be able to evaluate a professional without contacting them.