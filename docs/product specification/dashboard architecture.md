# DASHBOARD_ARCHITECTURE.md

# FIND MY INTERIOR - DASHBOARD ARCHITECTURE

## Purpose

This document defines every dashboard inside FindMyInterior.

The dashboard is the user's control center.

Every dashboard must answer one question:

**"What does this user need to do today?"**

Every widget, card, graph, button and notification must help the user perform today's work.

Nothing irrelevant should ever appear.

The dashboard should never feel generic.

---

# GLOBAL DASHBOARD RULES

Every dashboard must contain:

• Header
• Quick Statistics
• Notifications
• Recent Activity
• Recommendations
• Primary Work Area
• Messages
• Profile Completion
• Verification Status

Every dashboard must NOT contain another role's workflow.

Example

Homeowner must never see

- Available Leads
- Unlock Contact
- Wallet Balance
- Subscription
- RFQs

Worker must never see

- Compare Bids
- Supplier Catalogue
- Material RFQs

---

# COMMON LAYOUT

--------------------------------------------------

Top Navbar

Sidebar

Main Dashboard

--------------------------------------------------

Dashboard consists of

1. KPI Cards

2. Primary Action Buttons

3. Main Workspace

4. Secondary Widgets

5. Notifications

6. Recent Activities

---

# HOMEOWNER DASHBOARD

Purpose

Manage house projects.

Sidebar

Dashboard

My Projects

Received Bids

Shortlisted Professionals

Messages

Reviews

Profile

Settings

Verification

Top KPIs

Projects

Received Bids

Unread Messages

Completed Projects

Today's Main CTA

Post New Requirement

Main Workspace

Continue Active Projects

Received Bids

Compare Bids

Recommended Professionals

Project Timeline

Notifications

Professional accepted your project

New Bid Received

Project Started

Completion Requested

Review Pending

Never Show

Wallet

Subscription

Unlock Contact

Available Leads

RFQs

Material Requests

---

# INTERIOR DESIGNER DASHBOARD

Purpose

Win projects.

Sidebar

Dashboard

Available Projects

Recommended Projects

My Bids

Won Projects

Portfolio

Messages

Wallet

Subscription

Verification

Business Profile

KPIs

Projects Available

Bids Submitted

Won Projects

Unread Messages

Portfolio Views

Main CTA

Browse Projects

Workspace

Recommended Projects

Recent Opportunities

Project Suggestions

Portfolio Performance

Recent Reviews

Upcoming Meetings

Never Show

Worker Jobs

Supplier Catalogue

Builder Possessions

---

# CONTRACTOR DASHBOARD

Purpose

Execute construction.

Sidebar

Dashboard

Available Projects

My Projects

My Bids

Labour Requests

Material Requests

Subcontract Requests

Messages

Wallet

Subscription

Verification

Business Profile

KPIs

Projects

Labour Required

Material RFQs

Wallet

Main CTA

Create Labour Request

Workspace

Current Projects

Recent RFQs

Labour Applications

Supplier Quotes

Recent Messages

Project Deadlines

---

# BUILDER DASHBOARD

Purpose

Manage large developments.

Sidebar

Dashboard

Projects

Upcoming Possessions

Contractor Requests

Designer Requests

Supplier Requests

Worker Requests

Messages

Verification

KPIs

Active Projects

Upcoming Possessions

Pending Requests

Unread Messages

Main CTA

Create Builder Project

Workspace

Construction Progress

Contractor Pipeline

Supplier Pipeline

Upcoming Deliveries

---

# SUPPLIER DASHBOARD

Purpose

Sell materials.

Sidebar

Dashboard

RFQs

Submitted Quotes

Orders

Products

Catalogue

Messages

Wallet

Subscription

Verification

Business Profile

KPIs

Open RFQs

Quotes Sent

Orders

Wallet

Main CTA

Upload Product

Workspace

Recent RFQs

Popular Products

Latest Orders

Catalogue Performance

---

# SKILLED WORKER DASHBOARD

Purpose

Find work.

Sidebar

Dashboard

Available Jobs

Applied Jobs

Current Work

Completed Work

Ratings

Messages

Verification

Profile

KPIs

Available Jobs

Applications

Current Jobs

Ratings

Main CTA

Browse Jobs

Workspace

Nearby Jobs

Recommended Jobs

Application Status

Employer Messages

Upcoming Work

Never Show

Wallet Purchases

Subscriptions

Compare Bids

RFQs

Lead Unlock

---

# ARCHITECT DASHBOARD

Purpose

Acquire design work.

Sidebar

Dashboard

Projects

My Bids

Portfolio

Messages

Reviews

Verification

Business Profile

KPIs

Available Projects

Submitted Proposals

Won Projects

Unread Messages

Main CTA

Browse Projects

Workspace

Recommended Projects

Recent Opportunities

Portfolio Analytics

Client Reviews

---

# DASHBOARD NOTIFICATIONS

Every role receives different notifications.

Homeowner

New Bid

Project Started

Completion Requested

Review Reminder

Designer

New Project

Bid Accepted

Bid Rejected

Portfolio Viewed

Contractor

Labour Applied

Supplier Quote Received

Project Awarded

Supplier

New RFQ

Quote Accepted

Order Confirmed

Worker

Job Available

Application Accepted

Employer Message

Builder

Contractor Applied

Supplier Quote

Worker Applied

---

# RECENT ACTIVITY

Must only display activities related to that role.

Example

Worker

Applied to XYZ Job

Accepted by ABC Contractor

Started Work

Completed Work

Never show

"Bid Submitted"

because workers don't bid.

---

# RECOMMENDATION WIDGET

Every dashboard should recommend useful things.

Examples

Homeowner

Recommended Professionals

Designer

Recommended Projects

Contractor

Recommended Suppliers

Supplier

Recommended RFQs

Worker

Recommended Jobs

Builder

Recommended Contractors

---

# EMPTY STATES

Every empty widget must explain

Why it is empty

What to do next

Provide one CTA

Never display blank tables.

---

# MOBILE

Dashboard should prioritize

Current Work

Primary CTA

Notifications

Everything else comes afterwards.

Never force horizontal scrolling.

---

# FUTURE

Analytics

Revenue Graphs

AI Recommendations

Business Intelligence

Growth Reports

These will be implemented later.

Do not build now.