# TrueDial Ecosystem Technical Debt & Refactoring Report
**Document Version:** 1.0  
**Author:** Principal Software Architect, TrueDial Ecosystem  
**Target Scope:** `truedial-frontend` (Web), `truedial-mobile` (App), and `findmyinterior-backend` (Backend)  

---

## 1. Overview & Technical Debt Taxonomy

As part of the TrueDial platform synchronization mission, a full-stack architectural audit was conducted to identify legacy code patterns, duplicated routes, mock data fallbacks, and performance bottlenecks.

This report classifies technical debt into four risk tiers and provides concrete remediation strategies to ensure production-grade reliability without breaking active workflows.

---

## 2. Technical Debt Register & Remediation Matrix

| Debt ID | Codebase / Module | Technical Debt Description | Severity & Risk | Remediation Strategy | Effort Estimate |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TD-01** | `findmyinterior-backend`<br>(`routes/api.php:L398`) | **Duplicate Route Loading:** `require base_path('routes/truedial_api.php');` is called in `api.php` while `bootstrap/app.php` also loads `truedial_api.php` under the `/api` prefix. | **Medium** (Route registrar redundancy) | Keep a single registration point in `bootstrap/app.php` and remove the redundant `require` line in `routes/api.php`. | 1 Hour |
| **TD-02** | `truedial-mobile`<br>(`app/(tabs)/index.tsx:L154`) | **Legacy Endpoint References:** Mobile app originally queried `/listings` and `/offers` instead of the tenant-scoped `/truedial/public/businesses` and `/truedial/public/offers` SSOT endpoints. | **High** (Data divergence & missing DTO fields) | Refactor all mobile API calls to strictly invoke the `/truedial/public/*` and `/truedial/vendor/*` routes. *(Completed in audit)* | 2 Hours |
| **TD-03** | `truedial-frontend`<br>(`src/lib/api.ts:L71`) | **Mock Data Fallbacks in Production Catch Blocks:** When `fetch()` calls fail, several helper methods fallback to returning `MOCK_LISTINGS` or local static arrays instead of throwing clear error states. | **High** (Masks real backend outages) | Remove static mock array fallbacks from staging/production builds. Implement React Error Boundaries and retry toast alerts. | 4 Hours |
| **TD-04** | `truedial-mobile`<br>(`app/(auth)/login.tsx`) | **Hardcoded Patna Offline Fallbacks:** Authentication screens included mock offline Patna tokens and bypasses for local testing. | **High** (Security vulnerability in production) | Strip all mock token generators from production builds; require strict Sanctum token validation against `POST /api/v1/auth/login`. | 2 Hours |
| **TD-05** | `truedial-frontend`<br>(`src/lib/api.ts`) | **Untyped HTTP Responses:** Several API helper methods return `any` or loose `Record<string, any>` structures rather than strict DTO TypeScript interfaces (`BusinessProfileDTO`, etc.). | **Medium** (Type safety gaps) | Create a shared `@truedial/types` package or define strict interface contracts in `src/types/api.ts` across both web and mobile. | 6 Hours |
| **TD-06** | `findmyinterior-backend`<br>(`TenantResolverMiddleware.php`) | **Incomplete Header Evaluation (RESOLVED):** Middleware only checked `X-Tenant-ID`, ignoring `X-Platform` sent by mobile clients. | **High** (Tenant misresolution) | Upgraded middleware to check `$request->header('X-Tenant-ID') ?: $request->header('X-Platform')`. *(Resolved)* | Done |
| **TD-07** | `truedial-mobile`<br>(`package.json`) | **Missing Root Dependency Installation:** The imported mobile codebase had uninstalled `node_modules`, causing `npm run ts:check` failures in fresh CI clones. | **Low** (CI/CD friction) | Standardize package manager lockfiles (`package-lock.json`) and configure automated caching in CI build pipelines. | 1 Hour |

---

## 3. Prioritized Action Roadmap for Technical Debt Elimination

### 3.1 Immediate Priority (Sprint 1)
1.  **Purge Production Mocks (TD-03, TD-04):** Remove all `MOCK_LISTINGS` and mock Patna offline fallback tokens from both `truedial-frontend` and `truedial-mobile` production build configurations.
2.  **Route Registrar Clean-up (TD-01):** Consolidate TrueDial route mounting in Laravel so routes are registered exactly once in `bootstrap/app.php`.

### 3.2 Secondary Priority (Sprint 2)
1.  **Shared TypeScript Interfaces (TD-05):** Export backend DTO schemas (`BusinessProfileDTO`, `OfferDTO`, `ReviewDTO`, `PrivilegeCardDTO`) into a shared TypeScript declarations file imported by both web and mobile repositories.
2.  **Optimized Media Delivery:** Ensure image URLs returned by `/truedial/public/businesses/{slug}` utilize Next.js Image Optimization on Web and `expo-image` caching on Mobile to minimize bandwidth consumption.
