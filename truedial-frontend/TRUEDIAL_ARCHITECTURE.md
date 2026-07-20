# TrueDial Architecture & Design Standards

This document serves as the master blueprint for the TrueDial frontend. Any AI agent or developer working on `truedial-frontend` MUST adhere to these rules.

## 1. Project Overview
TrueDial is "India's Emerging Business Growth Platform." Unlike Find My Interior, which focuses on construction/interior professionals, TrueDial is a broad directory and business suite encompassing Restaurants, Hotels, Hospitals, Education, and Digital Marketing services.
It features a Privilege Card system, robust business discovery, and B2B growth solutions.

## 2. Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (v4)
- **Components:** shadcn/ui & Lucide React Icons
- **Backend:** Central Laravel API (`findmyinterior-backend`)

## 3. Premium Design Language
The UI must feel world-class, trusted, and highly dynamic.
- **Color Palette:** 
  - Primary: Brand Orange (`#E8701A` / `oklch(0.65 0.18 45)`)
  - Secondary: Rich Navy (`#0a1c3a` / `oklch(0.24 0.06 260)`)
- **Glassmorphism:** Heavy use of `backdrop-blur-md`, `bg-white/70`, and semi-transparent borders for floating cards, privilege cards, and navigation.
- **Animations:** All interactive elements must have smooth transitions (`transition-all duration-300`). Use keyframe animations for elements entering the viewport (e.g., `animate-fade-in-up`).
- **Typography:** Clean, legible sans-serif with distinct font-weights for hierarchy.

## 4. Dark Mode Strict Compliance
TrueDial must have flawless Dark Mode support.
- Always use `dark:text-white`, `dark:bg-[#0a1c3a]`, or semantic tokens like `bg-background text-foreground`.
- Avoid hardcoded white backgrounds in components. Use `bg-card` or explicitly add `dark:bg-card-dark`.
- Images and gradients must adapt to dark mode (e.g., lowering opacity of background images so text remains legible).

## 5. Core Features Roadmap
1. **Authentication:** Seamless user & business login flows.
2. **Dynamic Search Engine:** Multi-parameter search (Category + City + Query).
3. **Privilege Card System:** UI for digital multi-city privilege cards.
4. **Business Dashboards:** Tools for marketing, SMS campaigns, and analytics.

**By reading this, you acknowledge the high standard required for TrueDial. Do not write generic code.**
