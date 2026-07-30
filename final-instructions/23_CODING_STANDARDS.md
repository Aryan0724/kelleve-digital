# TRUEDIAL PLATFORM
# CODING STANDARDS
# Version 1.0

---

# PURPOSE

This document defines the coding standards for the entire TRUEDIAL Platform.

Every developer and AI coding agent must follow these standards.

Consistency is more important than personal preference.

Code should be

Readable

Maintainable

Reusable

Testable

Scalable

Predictable

---

# PHILOSOPHY

Write code for humans first.

Computers execute code.

Humans maintain it.

The best code is

Simple

Consistent

Self-documenting

Easy to extend

---

# GENERAL PRINCIPLES

Always

Write clean code

Prefer readability

Reuse existing modules

Keep functions small

Avoid duplication

Write meaningful names

Follow SOLID principles

Never optimize prematurely.

---

# PROJECT STRUCTURE

Follow the platform architecture.

Never invent new folder structures.

Backend

Modules

Shared

Infrastructure

Config

Routes

Database

Frontend

Features

Components

Hooks

Services

Providers

Types

Utils

Mobile follows the same philosophy.

---

# FILE NAMING

Use

PascalCase

Components

BusinessCard.tsx

VendorDashboard.tsx

Controllers

BusinessController.php

Services

PaymentService.php

Repositories

BusinessRepository.php

Policies

BusinessPolicy.php

Requests

CreateBusinessRequest.php

Avoid abbreviations.

---

# VARIABLE NAMING

Use descriptive names.

Good

customer

business

subscription

campaign

analytics

Bad

x

temp

obj

abc

Never use meaningless names.

---

# FUNCTION NAMING

Functions should describe actions.

Examples

createBusiness()

updateOffer()

calculateRevenue()

verifyPayment()

sendNotification()

Never use

doStuff()

process()

handle()

Without context.

---

# CLASS NAMING

Use nouns.

Examples

BusinessService

WalletService

OfferRepository

NotificationManager

CampaignScheduler

Class names should describe responsibility.

---

# BOOLEAN VARIABLES

Begin with

is

has

can

should

Examples

isVerified

hasPermission

canEdit

shouldNotify

Avoid ambiguous names.

---

# CONSTANTS

Use

UPPER_SNAKE_CASE

Examples

MAX_UPLOAD_SIZE

DEFAULT_LANGUAGE

OTP_EXPIRY

SUPPORTED_CURRENCIES

Never hardcode values repeatedly.

---

# ENUMS

Prefer enums over strings.

Examples

BusinessStatus

PaymentStatus

SubscriptionStatus

ReviewStatus

NotificationType

No magic strings.

---

# COMMENTS

Write comments only when necessary.

Explain

Why

Not

What

Bad

// increment i

Good

// Retry because payment gateways may return temporary failures.

Code should explain itself.

---

# FUNCTION SIZE

Aim for

10–30 lines

Split large functions into smaller reusable methods.

One function.

One responsibility.

---

# CLASS SIZE

Classes should have one responsibility.

Avoid

God Classes

Massive Controllers

Huge Services

Prefer composition.

---

# CONTROLLERS

Controllers should

Validate

Authorize

Call Services

Return Responses

Nothing else.

Business logic belongs in services.

---

# SERVICES

Services contain

Business Logic

Validation Rules

Workflows

Events

Never access request objects directly.

---

# REPOSITORIES

Repositories

Handle persistence.

Nothing more.

Never place business logic inside repositories.

---

# MODELS

Models represent data.

Avoid placing business workflows inside models.

Keep models lightweight.

---

# API RESPONSES

Use consistent response format.

Never return random JSON structures.

Errors should also follow one format.

---

# ERROR HANDLING

Never swallow exceptions.

Handle

Log

Return meaningful errors

Fail safely

Avoid generic

"Something went wrong."

---

# LOGGING

Log

Business Events

Errors

Warnings

Security Events

Do not log secrets.

---

# TESTING

Every new feature should include

Unit Tests

Feature Tests

Integration Tests (where required)

Critical flows require automated tests.

---

# CODE STYLE

Backend

PSR-12

Frontend

ESLint

Prettier

TypeScript Strict Mode

Never disable linters to make builds pass.

---

# TYPESCRIPT

Avoid

any

Prefer

interfaces

types

generics

Strict typing is mandatory.

---

# PHP

Use

Typed Properties

Return Types

Dependency Injection

Constructor Promotion

Modern PHP features preferred.

---

# DATABASE

Always

Use migrations

Use foreign keys

Index searchable fields

Soft delete where appropriate

Never modify production schema manually.

---

# GIT COMMITS

Write meaningful commit messages.

Examples

feat: add vendor analytics dashboard

fix: resolve payment webhook verification

refactor: simplify business search service

Avoid

update

changes

fix

done

---

# BRANCHES

Use

feature/

bugfix/

hotfix/

release/

Never commit directly to main.

---

# PULL REQUESTS

Every PR should include

Description

Screenshots (if UI)

Testing Notes

Linked Issue

Migration Notes

Deployment Notes

Small PRs are preferred.

---

# DOCUMENTATION

Every module should contain

Purpose

Architecture

API

Dependencies

Examples

Update documentation with every major change.

---

# DEPENDENCIES

Before adding a package ask

Can existing code solve this?

Is it maintained?

Is it secure?

Is it necessary?

Avoid dependency bloat.

---

# PERFORMANCE

Avoid

N+1 Queries

Repeated API Calls

Large Components

Duplicate Calculations

Measure before optimizing.

---

# ACCESSIBILITY

Follow WCAG guidelines.

Support

Keyboard Navigation

Screen Readers

Focus Management

ARIA Labels

Color Contrast

Accessibility is mandatory.

---

# SECURITY

Never

Trust User Input

Expose Secrets

Bypass Permissions

Store Plaintext Passwords

Disable Validation

Security reviews are required for sensitive features.

---

# AI CODING RULES

AI agents must

Read documentation before coding.

Search existing modules first.

Reuse components.

Reuse services.

Reuse APIs.

Reuse utilities.

Never duplicate logic.

Generate typed code.

Write tests.

Update documentation.

If uncertain,

ask instead of assuming.

---

# CODE REVIEW CHECKLIST

Verify

Architecture

Naming

Typing

Security

Performance

Testing

Documentation

Reusability

No Duplication

Consistency

No code merges without review.

---

# DEFINITION OF DONE

A feature is complete when

✓ Requirements Met

✓ Architecture Followed

✓ Code Reviewed

✓ Tests Passing

✓ Documentation Updated

✓ Security Reviewed

✓ Responsive

✓ Accessible

✓ No Duplication

✓ Production Ready

---

# NEVER DO THIS

❌ Duplicate Business Logic

❌ Hardcoded Values

❌ Magic Strings

❌ Massive Controllers

❌ Huge Components

❌ Direct Database Edits

❌ Disabled Type Checking

❌ Disabled Tests

❌ Unused Dependencies

❌ Inconsistent Naming

---

# SUCCESS METRICS

Measure

Code Coverage

Bug Rate

Technical Debt

Cyclomatic Complexity

Build Success Rate

Review Time

Deployment Success

Developer Productivity

Maintainability Score

Module Reuse

---

# FINAL RULE

Every line of code should make the platform easier to maintain.

Write code that another developer—or another AI—can understand immediately.

Consistency beats cleverness.

Reusable code beats duplicated code.

Simple architecture beats complex implementation.