# API Architecture (Bid Engine)

## Core Philosophy
The API must support the real-time, dynamic nature of the new Bid Engine. Requirements and Bids are the primary transactional entities, replacing static listings as the focal point.

## Major Changes

### 1. Bid Engine Endpoints
- `POST /api/v1/bids` 
  - Submit a new comprehensive bid. Validates 14+ fields including `estimated_cost`, `timeline_days`, inclusions, and JSON `portfolio_urls`.
- `GET /api/v1/bids/{id}/compare`
  - Returns a structured comparison matrix comparing the requested bid against the highest-scoring alternative bid.
- `GET /api/v1/requirements/{id}/bids`
  - Customer view. Returns all bids for their requirement, sorted by `smart_bid_score` DESC.
- `PATCH /api/v1/bids/{id}/status`
  - Update bid lifecycle (pending -> shortlisted -> accepted -> rejected).

### 2. Requirement Lifecycle Endpoints
- `PATCH /api/v1/requirements/{id}/status`
  - Transitions requirement state (open -> bidding -> shortlisted -> awarded -> completed -> expired).
- `POST /api/v1/admin/requirements/expire`
  - Cron-triggered endpoint to expire 30-day old requirements.

### 3. Contact Unlock (Pricing Hidden UX)
- `GET /api/v1/requirements/{id}/pricing-context`
  - Returns the dynamic ₹49 unlock price metadata *only* when the user initiates the unlock flow popup.

### 4. Verification Endpoints
- `POST /api/v1/user/verify-identity`
  - Initiates KYC/Verification loop.
- `PATCH /api/v1/admin/users/{id}/verification-status`
  - Admin approves the verification badge.

### 5. Bookmark Endpoints
- `POST /api/v1/user/saved-projects`
  - Save a requirement for later.
- `POST /api/v1/user/saved-vendors`
  - Save a professional for later.
- `GET /api/v1/user/saved-items`
  - Retrieve bookmarked entities.

### 6. Admin Listing Approval
- `PATCH /api/v1/admin/listings/{id}/publish`
  - Transitions a listing from 'pending' (default) to 'published'.

---

## Authentication & Authorization
- **Sanctum** remains the primary driver.
- Role-based middleware (`role:customer`, `role:professional`, `role:admin`) strictly enforces endpoint isolation.
- Bid mutation is locked to the professional who owns the bid.
- Bid viewing is locked to the customer who owns the requirement (plus admins).
