# TrueDial Ecosystem Architecture Comparison
**Document Version:** 1.0  
**Author:** Principal Software Architect, TrueDial Ecosystem  
**Target Platform:** TrueDial Multi-Tenant Enterprise Growth Platform (`Tenant ID: 2`, Domain: `truedial.in`)  
**Scope:** Architectural Audit & Unified Design Blueprint comparing **Project A (TrueDial Website/Vendor Portal)** and **Project B (TrueDial Mobile Application)** against the central **Find My Interior / TrueDial Backend**.

---

## 1. Executive Summary & Architectural Topology

The TrueDial ecosystem operates on a **Single-Source-of-Truth (SSOT) Multi-Tenant Architecture**. Rather than deploying fragmented databases or duplicated business logic, both client applications communicate with a centralized Laravel backend (`findmyinterior-backend`) via RESTful JSON APIs.

```
                  +-------------------------------------------------------+
                  |              CENTRAL LARAVEL 11 BACKEND               |
                  |     (findmyinterior-backend / Tenant ID: 2)           |
                  |                                                       |
                  |  +-------------------------------------------------+  |
                  |  |  TenantResolverMiddleware (X-Tenant-ID / Host)  |  |
                  |  +-------------------------------------------------+  |
                  |                           |                           |
                  |   +-----------------------+-----------------------+   |
                  |   |                                               |   |
                  |   v                                               v   |
                  | [Core API /auth/*]            [TrueDial Module API]   |
                  | • Login / Register            • /truedial/public/*    |
                  | • OTP Send / Verify           • /truedial/vendor/*    |
                  | • Sanctum Token Auth          • /truedial/admin/*     |
                  +-------------------------------------------------------+
                                ^                           ^
                                |                           |
                +---------------+                           +---------------+
                |                                                           |
+---------------+---------------+                           +---------------+---------------+
|           PROJECT A           |                           |           PROJECT B           |
|       truedial-frontend       |                           |        truedial-mobile        |
+-------------------------------+                           +-------------------------------+
|  Next.js 16 (App Router)      |                           |  Expo Router v6 (React Native)|
|  Tailwind CSS v4 + shadcn/ui  |                           |  React Native 0.81 + TypeScript|
|  SSR / ISR + Server Actions   |                           |  Expo SecureStore + Native    |
|  Headers: X-Tenant-ID: 2      |                           |  Headers: X-Platform: truedial|
+-------------------------------+                           +-------------------------------+
```

---

## 2. Platform-by-Platform Architectural Breakdown

### 2.1 Project A: TrueDial Website (`truedial-frontend`)
*   **Framework:** Next.js 16.2.10 (App Router, Turbopack, React 19).
*   **Styling & UI:** Vanilla CSS + Tailwind CSS v4, `shadcn/ui`, `lucide-react`, Glassmorphism tokens (`backdrop-blur-md`, `bg-card`), explicit Dark Mode support (`dark:bg-[#0a1c3a]`).
*   **Routing Paradigm:** File-system routing with directory groups:
    *   Public Discovery: `/`, `/search`, `/free-listing`, `/businesses/[slug]`, `/academy`, `/jobs`, `/news`, `/offers`, `/consulting`.
    *   Vendor Portal: `/dashboard/vendor/*` (analytics, catalog, CRM leads, invoices, marketing, privilege-cards, profile, reputation, offers).
    *   Admin Portal: `/dashboard/admin/*` (vendor approvals, user management, platform stats).
*   **State & Data Fetching:**
    *   Server-Side Rendering (SSR) & Incremental Static Regeneration (ISR) with explicit `revalidate` cache tags (e.g., `revalidate: 60` for listings and search).
    *   Client-side interactions via standard React Hooks and async `fetch` connector (`TrueDialAPI`).
*   **Authentication & Session Management:**
    *   Laravel Sanctum token authentication stored in browser storage and injected into authenticated requests (`Authorization: Bearer <token>`).
    *   Supports OTP authentication flows (`/truedial/auth/otp/send` and `/truedial/auth/otp/verify`).

### 2.2 Project B: TrueDial Mobile Application (`truedial-mobile`)
*   **Framework:** Expo SDK 54 (`react-native` 0.81.5, React 19, TypeScript).
*   **Routing Paradigm:** Expo Router v6 (file-based navigation with layouts):
    *   Auth Group: `/app/(auth)/login.tsx`, `/app/(auth)/register.tsx`.
    *   Main Navigation Tabs: `/app/(tabs)/index.tsx` (Directory), `/app/(tabs)/privilege.tsx` (Privilege Cards), `/app/(tabs)/offers.tsx` (Offers Feed), `/app/(tabs)/profile.tsx` (Profile).
    *   Dynamic Detail Views: `/app/listing/[slug].tsx` (Business Profile Detail).
*   **Styling & UI:** React Native StyleSheet + Custom components (`GlassCard.tsx`, `CustomButton.tsx`, `InquiryModal.tsx`), supporting Patna/Bihar localized datasets.
*   **State & Data Fetching:**
    *   Centralized Axios HTTP instance (`services/api.ts`) with request/response interceptors.
    *   React Context (`context/auth.tsx`) managing global user authentication state and protected route redirection.
*   **Authentication & Session Management:**
    *   Token persistence via `expo-secure-store` (`getStorageItem('user_token')`).
    *   Sends `'X-Platform': 'truedial'` and `'X-Tenant-ID': '2'` headers to bind requests to Tenant ID 2.

---

## 3. Module-by-Module Comparison Table

| Architecture Layer | Project A (`truedial-frontend`) | Project B (`truedial-mobile`) | Comparison & Assessment |
| :--- | :--- | :--- | :--- |
| **Routing & Navigation** | Next.js App Router (`app/*`), layout nesting, server components. | Expo Router (`app/*`), bottom tab layouts, native stack navigators. | **Similar:** Both adhere to file-based routing with explicit layout groups.<br>**Difference:** Next.js uses SSR/ISR; Expo Router uses native client navigation. |
| **HTTP API Client** | Native `fetch` with `NEXT_PUBLIC_API_URL` fallback, custom class methods (`TrueDialAPI`). | `axios` instance (`services/api.ts`) with 60s timeout and token interceptors. | **Difference:** Project A uses stateless fetch wrappers; Project B uses a stateful Axios client with automatic interceptor header injection. |
| **Tenant Resolution** | Sends `X-Platform: truedial` and `X-Tenant-ID: 2` in fetch headers. | Sends `X-Platform: truedial` and `X-Tenant-ID: 2` in axios headers. | **Synchronized:** Both clients now explicitly declare multi-tenant headers recognized by `TenantResolverMiddleware`. |
| **Auth Flow** | Sanctum Token + OTP via `/auth/login` and `/truedial/auth/otp/*`. | Sanctum Token via `/auth/login` and `/auth/register` with offline Patna fallback. | **Conflict:** Project B included local mock fallbacks when offline; production must enforce backend token validation. |
| **State Management** | URL search params + React local state + Server Components. | `AuthContext` (React Context API) + local state in tab screens. | **Complementary:** Web leverages URL-driven state for SEO; Mobile leverages Context API for persistent app sessions. |
| **Component Library** | `shadcn/ui`, Lucide Icons, Glassmorphic Tailwind utility classes. | Custom native components (`GlassCard`, `CustomButton`, `InquiryModal`). | **Difference:** Web uses Tailwind v4 tokens; Mobile uses StyleSheet with matching color hex codes (`#E8701A`, `#0a1c3a`). |

---

## 4. Architectural Similarities, Differences & Conflicts

### 4.1 Key Similarities
1.  **Shared Multi-Tenant Backend:** Both clients target the same Laravel 11 instance (`findmyinterior-backend`), using `Tenant ID: 2` (`truedial.in`).
2.  **Shared Authentication Contract:** Both authenticate against `/api/v1/auth/login`, `/api/v1/auth/register`, and `/api/v1/auth/me`, expecting a standard `{ success: true, data: { token, user } }` payload.
3.  **Visual Brand Language:** Both employ the TrueDial signature palette (Brand Orange `#E8701A` and Navy Background `#0a1c3a`) and glassmorphic card overlays.

### 4.2 Key Differences
1.  **Rendering Engine:**
    *   Website uses **Server-Side Rendering (SSR)** and **Static Site Generation (SSG/ISR)** for maximum SEO crawlability and sub-second Initial Page Load.
    *   Mobile uses **Client-Side Rendering (CSR)** with React Native UI threads and native modal overlays.
2.  **Data Caching Strategy:**
    *   Website leverages Next.js Data Cache (`next: { revalidate: 60 }`) for listings, offers, and categories.
    *   Mobile performs direct real-time API queries on component mount via `useEffect()`.

### 4.3 Key Conflicts Identified & Resolved
1.  **Endpoint Dissonance (RESOLVED):**
    *   *Conflict:* Project B originally queried `/listings` (Find My Interior default endpoint) instead of `/truedial/public/businesses`.
    *   *Resolution:* Standardized both platforms to invoke the dedicated `/truedial/public/*` and `/truedial/vendor/*` namespace.
2.  **Tenant Header Parsing (RESOLVED):**
    *   *Conflict:* Laravel `TenantResolverMiddleware` only checked `X-Tenant-ID`, ignoring `X-Platform: truedial` sent by the mobile client.
    *   *Resolution:* Upgraded backend middleware (`TenantResolverMiddleware.php:L31-36`) to evaluate `$request->header('X-Tenant-ID') ?: $request->header('X-Platform')`.

---

## 5. Architectural Recommendations & Best Practices

1.  **Preserve Domain-Specific Client Advantages:**
    *   Do **not** force Next.js into a pure CSR SPA; maintain SSR/ISR for SEO and public directory indexing.
    *   Do **not** force Expo React Native to use web views; preserve native components (`GlassCard`, `InquiryModal`) for 60fps mobile responsiveness.
2.  **Enforce Strict Endpoint Symmetry:**
    *   All business discovery queries on both web and mobile MUST use `/api/v1/truedial/public/businesses` and `/api/v1/truedial/public/search`.
    *   All vendor dashboard operations MUST use `/api/v1/truedial/vendor/*`.
3.  **Unify Error & Offline Handling:**
    *   Replace hardcoded mock data fallbacks in mobile production builds with structured error states and retry banners when network timeouts occur.
