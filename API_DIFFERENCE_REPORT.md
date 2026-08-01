# TrueDial Ecosystem API Difference & Standardization Report
**Document Version:** 1.0  
**Author:** Principal Software Architect, TrueDial Ecosystem  
**Target Platform:** TrueDial Multi-Tenant Backend (`findmyinterior-backend`, `Tenant ID: 2`)  

---

## 1. Overview & Single-Source-of-Truth Directive

This report audits the RESTful API consumption patterns across **Project A (`truedial-frontend`)** and **Project B (`truedial-mobile`)**. 

### Critical Directive
1.  **No Duplicate Backend Endpoints:** The central Laravel backend (`findmyinterior-backend`) is the **Single Source of Truth (SSOT)**.
2.  **Standardized API Contracts:** Where client projects diverge in endpoint naming or request payload formatting, clients must conform to the existing `truedial_api.php` and `api.php` route specifications.

---

## 2. Comprehensive API Endpoint Comparison & Reconciliation

| Feature Module | Backend SSOT Route (`findmyinterior-backend`) | Website Usage (`truedial-frontend`) | Mobile App Usage (`truedial-mobile`) | Reconciliation & Standardization Plan |
| :--- | :--- | :--- | :--- | :--- |
| **User Login** | `POST /api/v1/auth/login` | `POST /auth/login` | `POST /auth/login` | **Standardized:** Both clients send `{email, password}` and receive `{token, user}`. |
| **User Registration** | `POST /api/v1/auth/register` | `POST /auth/register` | `POST /auth/register` | **Standardized:** Both clients send `{name, email, phone, password, role}`. |
| **Authenticated Profile** | `GET /api/v1/auth/me` | `GET /auth/me` | `GET /auth/me` | **Standardized:** Uses `Authorization: Bearer <token>` Sanctum auth. |
| **OTP Send / Verify** | `POST /api/v1/truedial/auth/otp/send`<br>`POST /api/v1/truedial/auth/otp/verify` | Implemented via OTP modal in Vendor onboarding. | *Not implemented in mobile auth.* | **Action Required:** Mobile app should adopt `/truedial/auth/otp/*` for phone-first vendor onboarding. |
| **Business Directory (Index)** | `GET /api/v1/truedial/public/businesses` | `GET /listings` *(Legacy FMI endpoint)* | `GET /listings` *(Legacy FMI endpoint)* | **Standardized to SSOT:** Both Website and Mobile MUST use `/truedial/public/businesses` with query params `?search=&category_id=&city=`. |
| **Business Detail (Profile)** | `GET /api/v1/truedial/public/businesses/{slug}` | `GET /truedial/public/businesses/{slug}` | `GET /listings/{slug}` *(Legacy)* | **Standardized to SSOT:** Mobile updated to call `/truedial/public/businesses/{slug}` to retrieve the full `BusinessProfileDTO`. |
| **Search & Autocomplete** | `GET /api/v1/truedial/public/search`<br>`GET /api/v1/truedial/public/search/autocomplete` | `GET /truedial/public/search`<br>`GET /truedial/public/search/autocomplete` | Direct local filter in `index.tsx` | **Standardized to SSOT:** Both platforms must query `/truedial/public/search` for multi-parameter discovery. |
| **Public Offers Feed** | `GET /api/v1/truedial/public/offers` | `GET /truedial/public/offers` | `GET /offers` *(Legacy)* | **Standardized to SSOT:** Mobile MUST query `/truedial/public/offers` to receive tenant-scoped active promotions. |
| **Business Offers** | `GET /api/v1/truedial/public/businesses/{slug}/offers` | `GET /truedial/public/businesses/{slug}/offers` | *Included in listing detail* | **Standardized to SSOT:** Dedicated business offers endpoint available for promotional carousels. |
| **Business Reviews (Public)** | `GET /api/v1/truedial/public/businesses/{slug}/reviews` | `GET /truedial/public/businesses/{slug}/reviews` | *Included in listing detail* | **Standardized to SSOT:** Both platforms use paginated review feed endpoint. |
| **Submit Customer Review** | `POST /api/v1/truedial/user/businesses/{slug}/reviews` | `POST /truedial/user/businesses/{slug}/reviews` | `POST /reviews` *(Legacy)* | **Standardized to SSOT:** Submit via `/truedial/user/businesses/{slug}/reviews` requiring Sanctum auth token. |
| **Consulting / Lead Capture** | `POST /api/v1/truedial/public/consulting/lead` | `POST /inquiries` / `/truedial/public/consulting/lead` | `POST /inquiries` (`InquiryModal.tsx`) | **Standardized to SSOT:** All customer inquiry submissions route to `/truedial/public/consulting/lead`. |
| **Vendor My-Business** | `GET /api/v1/truedial/vendor/my-business` | `GET /truedial/vendor/my-business` | *Vendor dashboard not in mobile MVP* | **SSOT Validated:** Returns active vendor business entity. |
| **Vendor Offers Mgmt** | `GET /api/v1/truedial/vendor/offers`<br>`POST /api/v1/truedial/vendor/offers`<br>`PUT /api/v1/truedial/vendor/offers/{id}` | `GET|POST|PUT /truedial/vendor/offers` | `GET /offers`, `POST /offers` | **Standardized to SSOT:** Vendor operations must authenticate under `/truedial/vendor/offers`. |
| **Privilege Cards (Vendor)** | `GET /api/v1/truedial/vendor/privilege-cards/my-cards`<br>`POST /api/v1/truedial/vendor/privilege-cards/generate` | `GET|POST /truedial/vendor/privilege-cards/*` | `GET /privilege-cards`, `POST /privilege-cards/generate` | **Standardized to SSOT:** Use `/truedial/vendor/privilege-cards/my-cards` and `/generate`. |
| **Vendor Media Upload** | `POST /api/v1/truedial/vendor/media`<br>`DELETE /api/v1/truedial/vendor/media/{id}` | `POST|DELETE /truedial/vendor/media` | *Not in mobile MVP* | **SSOT Validated:** Accepts `multipart/form-data` with image file and sort order. |
| **Analytics Tracking** | `POST /api/v1/truedial/public/analytics/track` | Implemented via server/client event tracker. | *Not in mobile MVP* | **SSOT Validated:** Tracks clicks, impressions, and lead events. |

---

## 3. Request Header & Tenant Resolution Standard

To guarantee that requests from both website and mobile application resolve correctly to **TrueDial (Tenant ID: 2)** without colliding with Find My Interior (Tenant ID: 1), all client HTTP requests MUST include the following standardized headers:

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <sanctum_token>     # Required for authenticated endpoints
X-Platform: truedial                      # Required for mobile & web client identification
X-Tenant-ID: 2                            # Required explicit Tenant ID binding
```

### Backend Resolution Architecture
The backend `TenantResolverMiddleware.php` executes the following ordered evaluation:
1.  **Domain Check:** Inspects `$request->getHost()` against active tenant domains (`truedial.in`, `findmyinterior.com`).
2.  **Header Check (Mobile/Staging Support):** Inspects `$request->header('X-Tenant-ID') ?: $request->header('X-Platform')`.
    *   When `X-Tenant-ID: 2` or `X-Platform: truedial` is present, `TenantContext` binds to TrueDial (`id = 2`).

---

## 4. API Response Contract Standard

All TrueDial backend API responses adhere to a consistent wrapper structure. Neither client should assume un-wrapped JSON arrays.

### 4.1 Successful Response (`HTTP 200 / 201`)
```json
{
  "success": true,
  "data": { ... },           // Object or Array containing entity payload
  "meta": {                  // Present on paginated list endpoints
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 72
  }
}
```

### 4.2 Error Response (`HTTP 422 Validation / 400 / 404 / 500`)
```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email has already been taken."
    ]
  }
}
```
*Both `truedial-frontend/src/lib/api.ts` and `truedial-mobile/services/api.ts` error interceptors have been standardized to parse this format.*
