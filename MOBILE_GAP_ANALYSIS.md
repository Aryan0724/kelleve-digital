# TrueDial Mobile Application: Gap Analysis

**Date:** July 2026
**Target:** TrueDial React Native (Expo) Application

This document identifies the missing features, broken workflows, and architectural gaps in the current `truedial-mobile` repository compared to the production `truedial-frontend` (Next.js) website.

---

## 1. Scope Adjustments (Excluded from Mobile)

Per project directives, the following modules are currently in development on the website and will **NOT** be rebuilt on the mobile application to prevent duplicating unfinished work:
- ❌ **Academy** (`/academy`)
- ❌ **Jobs & Internships** (`/jobs`)
- ❌ **News & Podcasts** (`/news`)

---

## 2. Missing Core Workflows (To Be Rebuilt)

The following production workflows exist on the website but are either missing, incomplete, or broken in the current mobile app:

### Customer Workflows
- **Comprehensive Search**: Multi-parameter search by Category, City, and Keywords.
- **Detailed Business Profiles**: Full business view including media galleries, reviews, working hours, and offers.
- **Offers Discovery**: Dedicated screens to view active vendor promotions.
- **Consulting Lead Capture**: Forms to request expert consulting services directly from the app.
- **Direct Contact Action**: One-tap Call, WhatsApp, and Direction actions.

### Vendor Workflows
- **Business Registration**: Full onboarding flow for vendors (Free Listing and Premium).
- **Vendor Dashboard**: A native bottom sheet / tab implementation for vendors to manage their business.
- **CRM & Lead Management**: Missing entirely on mobile.
- **Marketing & Offers**: Ability to create and manage promotional offers from the phone.
- **Media Uploads**: Native camera/gallery integration for uploading business photos.
- **Invoices & Subscriptions**: Billing history and subscription management.

### Platform Features
- **Privilege Card System**: Digital wallet implementation for multi-city privilege cards.

---

## 3. UI & Design System Gaps

- **Lack of TrueDial Branding**: The mobile app does not consistently use the TrueDial Brand Orange (`#E8701A`) or Deep Navy (`#0A1C3A`).
- **Glassmorphism**: Missing frosted glass cards and modal backdrops.
- **Dark Mode**: No robust native dark mode implementation.
- **Navigation**: Desktop-like routing is used. We need native bottom tabs and swipeable bottom sheets for improved UX.
- **Micro-interactions**: Missing pull-to-refresh, smooth sheet animations, and native loading states.

---

## 4. Architectural & Backend Gaps

- **Styling System**: Mobile app uses standard `StyleSheet` which makes it hard to maintain UI parity with Tailwind. We will migrate to `nativewind` for 1-to-1 design translation.
- **API Disconnects**: Mock data and offline bypasses need to be removed.
- **Tenant Headers**: All API calls must inject `X-Platform: truedial` and `X-Tenant-ID: 2` to correctly hit the centralized Laravel backend.

---

## Conclusion
The mobile app requires a total structural refactor. We will utilize NativeWind and Expo Router to build a native-feeling application (tabs, swipe sheets, camera integration) while maintaining exact feature parity with the TrueDial web specifications.
