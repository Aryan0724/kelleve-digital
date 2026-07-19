# REQUIREMENT_LIFECYCLE.md

# FIND MY INTERIOR - REQUIREMENT & PROJECT LIFECYCLE

## Purpose

This document defines the complete lifecycle of every opportunity on the platform.

Every Project, RFQ and Job must follow a predefined workflow.

No shortcut should exist.

Every button must move the opportunity from one valid state to another.

The lifecycle should feel natural to every user.

---

# FUNDAMENTAL PRINCIPLE

Every opportunity has:

• Creator

• Target Audience

• Current Status

• Next Allowed Actions

Every page should determine

Who created this?

Who is viewing this?

What actions are allowed?

Never show buttons that the current viewer cannot perform.

---

# OPPORTUNITY TYPES

The platform contains three major opportunity types.

---

## Projects

Created by

Homeowner

Builder

Purpose

Hire professionals.

Examples

Interior Design

Construction

Renovation

Architecture

Furniture

---

## RFQs

Created by

Contractor

Interior Designer

Builder

Purpose

Purchase materials.

Examples

Tiles

Plywood

Furniture

Paint

Steel

Electrical

Plumbing

---

## Jobs

Created by

Contractor

Builder

Interior Company

Purpose

Hire skilled workers.

Examples

Electrician

Carpenter

Painter

Plumber

POP Worker

Mason

Tile Worker

Helper

---

# PROJECT LIFECYCLE

Step 1

Project Created

Status

POSTED

Visible To

Eligible Professionals

Owner Can

Edit

Delete

Pause

Close

Professionals Can

View

Save

Unlock Contact

Submit Bid

Message (Only after Unlock)

---

Step 2

Receiving Bids

Status

RECEIVING_BIDS

Owner Sees

Incoming Bids

Compare Button

Shortlist Button

Professionals See

Bid Submitted

Waiting

Edit Bid

Withdraw Bid

---

Step 3

Bid Comparison

Owner

Compare

Budget

Timeline

Experience

Reviews

Portfolio

Ratings

Verification

Never compare only price.

---

Step 4

Shortlisting

Owner can shortlist multiple professionals.

Professionals receive

You have been shortlisted.

Still no project awarded.

---

Step 5

Messaging

Messaging becomes available only if

Professional unlocked contact

OR

Professional shortlisted

OR

Project awarded

There should always be a visible entry point.

Never hide messaging.

---

Step 6

Award Project

Status

AWARDED

Owner

Award

Professionals

Receive Award

Accept Project

Decline Project

Only one professional can be awarded.

---

Step 7

Professional Accepts

Status

ACCEPTED

Owner

Waiting

Professional

Start Project

---

Step 8

Project Started

Status

IN_PROGRESS

Timeline starts.

Messages continue.

Files may be exchanged.

Future Milestone system can plug here.

---

Step 9

Completion Request

Professional clicks

Request Completion

Status

COMPLETION_REQUESTED

Owner receives

Completion Request

Approve

Reject

Comment

---

Step 10

Completion Approved

Status

COMPLETED

Platform unlocks

Reviews

Ratings

Project Gallery

---

Step 11

Review

Both parties review each other.

Owner reviews Professional.

Professional reviews Owner.

Reviews become public.

---

Step 12

Archive

Status

ARCHIVED

Project becomes history.

Visible inside dashboard.

---

# RFQ LIFECYCLE

Create RFQ

↓

Suppliers Receive RFQ

↓

Suppliers Submit Quotes

↓

Contractor Compares Quotes

↓

Supplier Selected

↓

Material Delivered

↓

Order Completed

↓

Reviews

---

# JOB LIFECYCLE

Create Job

↓

Workers Apply

↓

Applications Received

↓

Worker Selected

↓

Work Starts

↓

Completion

↓

Rating

↓

Archive

---

# REQUIREMENT DETAIL PAGE

The UI depends on WHO IS VIEWING.

Never reuse one UI.

---

## Creator View

Show

Edit

Close

Pause

Compare

Shortlist

Award

Timeline

Messages

Received Bids

Never Show

Unlock Contact

Submit Bid

---

## Eligible Professional View

Show

Unlock Contact

Submit Bid

Save

Portfolio

Messages

Project Details

Never Show

Award

Edit

Close

---

## Selected Professional

Show

Messages

Project Files

Start Project

Request Completion

Timeline

---

## Ineligible User

Show

Opportunity Details

Category

Reason

"This opportunity is not available for your business."

Suggest similar opportunities.

Never show Submit Bid.

---

# BID LIFECYCLE

Draft

↓

Submitted

↓

Viewed

↓

Shortlisted

↓

Accepted

↓

Rejected

↓

Expired

Each state should have different UI.

---

# MESSAGING RULES

Messaging is contextual.

Every conversation belongs to one opportunity.

Conversation Header

Project Name

Requirement

RFQ

Job

Participants

Current Status

Never allow random messaging.

---

# NOTIFICATIONS

Homeowner

New Bid

Shortlisted Professional

Completion Request

Review Reminder

Professional

New Project

Bid Viewed

Shortlisted

Awarded

Message

Supplier

RFQ Received

Quote Accepted

Order Confirmed

Worker

Job Posted

Application Viewed

Selected

Builder

New Applications

Supplier Quotes

Contractor Quotes

---

# ACTIVITY TIMELINE

Every opportunity should maintain history.

Example

Requirement Posted

↓

Bid Submitted

↓

Viewed

↓

Shortlisted

↓

Message Started

↓

Awarded

↓

Started

↓

Completion Requested

↓

Completed

↓

Reviewed

Users should always know what happened.

---

# RULES

No button should exist without backend support.

No page should have dead actions.

No page should expose another user's workflow.

Every action should update status immediately.

Every status should unlock only the next valid action.

Never skip steps.

Never manually jump from Posted to Completed.

---

# FUTURE

Milestones

Escrow

Invoices

Payments

Site Visits

Contracts

Digital Signatures

Progress Reports

These will be added after Razorpay and Analytics.

Do not implement now.
