# TRUEDIAL PLATFORM
# MOBILE DEVELOPMENT RULES
# Version 1.0

---

# PURPOSE

This document defines the mandatory standards for every mobile application built for the platform.

Current Applications

• TrueDial Mobile

Future Applications

• FindMyInterior Mobile

• Vendor App

• Customer App

• Admin App

All mobile applications must follow these rules.

---

# TECHNOLOGY STACK

Framework

React Native

Platform

Expo

Language

TypeScript

Navigation

Expo Router

State Management

Zustand

Server State

TanStack Query

Forms

React Hook Form

Validation

Zod

Icons

Lucide React Native

Maps

React Native Maps

Notifications

Firebase Cloud Messaging

Authentication

Laravel API

Styling

NativeWind

Storage

MMKV

Analytics

Firebase Analytics

Crash Reporting

Firebase Crashlytics

Do not introduce another framework without approval.

---

# CORE PRINCIPLE

The Mobile App is NOT another backend.

It is another interface.

Everything should consume existing APIs.

Never build mobile-specific business logic.

---

# RESPONSIBILITIES

Mobile is responsible for

✓ UI

✓ Native Experience

✓ Navigation

✓ Offline Cache

✓ Camera

✓ GPS

✓ Push Notifications

✓ QR Scanner

✓ Biometrics

✓ API Consumption

Mobile is NOT responsible for

✗ Business Logic

✗ Pricing

✗ Subscription Rules

✗ Payment Verification

✗ User Permissions

✗ Database Logic

---

# PROJECT STRUCTURE

app/

components/

features/

hooks/

services/

stores/

providers/

constants/

utils/

types/

assets/

Never place business logic inside screens.

---

# FEATURE STRUCTURE

Each feature must follow

features/

offers/

components/

hooks/

services/

types/

schemas/

utils/

screens/

Example

features/

business/

components/

BusinessCard.tsx

BusinessGallery.tsx

BusinessReviews.tsx

hooks/

useBusiness.ts

services/

business.service.ts

types/

business.ts

Keep feature boundaries clean.

---

# SCREEN RULES

Screens should only

Compose UI

Use Hooks

Navigate

Display Data

Never call APIs directly.

Never write business logic.

---

# COMPONENT RULES

Every component should be

Reusable

Typed

Small

Composable

Testable

Documented

Split components before they become difficult to maintain.

---

# API RULES

Every request goes through

services/

Never call fetch()

Never call axios()

directly inside components.

---

# API CLIENT

One API client.

Responsible for

Authentication

Headers

Retry

Refresh Token

Tenant Headers

Logging

Error Handling

Offline Queue

Never create multiple API clients.

---

# STATE MANAGEMENT

Zustand

Only for

Authentication

Theme

Notification State

Temporary UI State

Global Settings

Server data belongs in TanStack Query.

---

# OFFLINE SUPPORT

Offline support should include

Cached Businesses

Saved Offers

Recently Viewed

Draft Forms

Pending Uploads

Offline Search (where applicable)

Queue writes until connection returns.

---

# SYNCHRONIZATION

Pending actions

↓

Local Queue

↓

Internet Available

↓

Background Sync

↓

Backend

Never lose user actions.

---

# PUSH NOTIFICATIONS

Support

Offers

Messages

Campaigns

Subscription Alerts

Payment Updates

System Notifications

Notifications should deep-link into the app.

---

# LOCATION

Use GPS only when necessary.

Always request permission politely.

Never request unnecessary permissions.

---

# CAMERA

Supported Uses

Business Photos

Profile Photos

QR Codes

Document Upload

Receipt Upload

Camera logic should remain reusable.

---

# FILE UPLOADS

Uploads must

Compress Images

Validate Type

Validate Size

Retry Failed Uploads

Show Progress

Never upload raw files without optimization.

---

# PERFORMANCE

Target

Cold Start

<2 seconds

Navigation

<150 ms

Search

<300 ms

Scrolling

60 FPS

Optimize before release.

---

# MEMORY

Avoid unnecessary re-renders.

Lazy load screens.

Dispose listeners.

Optimize images.

Keep bundle size low.

---

# BATTERY

Avoid

Constant GPS

Infinite polling

Heavy background tasks

Frequent wake-ups

Optimize for battery life.

---

# NETWORK

Handle

Slow Internet

Offline

Timeout

Retry

Server Errors

Network changes gracefully.

---

# FORMS

All forms

React Hook Form

+

Zod

Never create custom validation systems.

---

# RESPONSIVE DESIGN

Support

Phones

Foldables

Large Phones

Small Phones

Tablets (future)

Do not hardcode screen sizes.

---

# SAFE AREAS

Respect

Status Bar

Notch

Dynamic Island

Navigation Bar

Gesture Areas

Use Safe Area Context.

---

# AUTHENTICATION

Authentication handled through backend.

Support

Email

OTP

Google

Apple (future)

Biometric Unlock

Never store sensitive credentials insecurely.

---

# BIOMETRICS

Support

Fingerprint

Face ID

Device Authentication

Only for convenience.

Backend still verifies identity.

---

# STORAGE

Use

MMKV

for

Session

Preferences

Cached Settings

Never store sensitive business data permanently.

---

# ERROR HANDLING

Every screen must handle

Loading

Empty

Offline

Unauthorized

Unexpected Error

Retry

Gracefully.

---

# ACCESSIBILITY

Support

Screen Readers

Large Fonts

Keyboard Navigation

Accessible Labels

High Contrast

Accessibility is mandatory.

---

# ANIMATIONS

Use animations to improve usability.

Avoid excessive motion.

Target duration

150–250ms

Keep interactions responsive.

---

# FILE NAMING

Components

PascalCase

BusinessCard.tsx

Hooks

camelCase

useBusinesses.ts

Stores

camelCase

authStore.ts

Utilities

camelCase

formatCurrency.ts

---

# TESTING

Critical features require

Unit Tests

Integration Tests

Navigation Tests

Offline Tests

Notification Tests

Authentication Tests

---

# RELEASE PROCESS

Before every release

✓ Build Android

✓ Build iOS

✓ Run Tests

✓ Check Crash Reports

✓ Verify API Compatibility

✓ Verify Deep Links

✓ Test Offline Mode

✓ Verify Notifications

No release without completing the checklist.

---

# AI CODING RULES

Before writing code

Search existing screens.

Search existing components.

Search existing hooks.

Search existing services.

Reuse first.

Build second.

Never create duplicate implementations.

---

# DEFINITION OF DONE

A mobile feature is complete only when

✓ API Integrated

✓ Responsive

✓ Offline Safe

✓ Accessible

✓ Type Safe

✓ Tested

✓ Documentation Updated

✓ Android Tested

✓ iOS Tested

✓ Production Ready

---

# NEVER DO THIS

❌ Business Logic in Screens

❌ Direct API Calls

❌ Duplicate Components

❌ Multiple API Clients

❌ Hardcoded URLs

❌ Ignored TypeScript Errors

❌ Unhandled Offline States

❌ Insecure Storage

❌ Platform-specific Hacks without Documentation

---

# FINAL RULE

The mobile application is another client of the platform.

If the mobile app requires new business logic that already exists in Laravel, the implementation is incorrect.

Build native experiences.

Never build a separate system.