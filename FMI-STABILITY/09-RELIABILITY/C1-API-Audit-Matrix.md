# C1 API Audit Matrix & Canonical Contracts

This document contains the canonical business rules, state machines, and endpoint contracts for Find My Interior (FMI).
**Rule: Do not modify any API endpoint code until its behavior is documented and verified here.**

## 1. Canonical State Machines

### A. Customer Project (Interior Design)
| Current   | Action       | Role                      | Next       |
| --------- | ------------ | ------------------------- | ---------- |
| Draft     | Publish      | Customer                  | Open       |
| Open      | Submit Quote | Professional              | Open       |
| Open      | Shortlist    | Customer                  | Open       |
| Open      | Award        | Customer                  | Awarded    |
| Awarded   | Complete     | Customer/authorized party | Completed  |
| Completed | Submit Quote | Anyone                    | **Reject** |

### B. Labour Jobs (Worker)
| Current               | Action            | Role    | Next                   |
| --------------------- | ----------------- | ------- | ---------------------- |
| Draft                 | Publish           | Builder | Open                   |
| Open                  | Apply (not Quote) | Worker  | Receiving Applications |
| Receiving Applications| Shortlist         | Builder | Receiving Applications |
| Receiving Applications| Hire / Award      | Builder | Hired                  |
| Hired                 | Complete          | Builder | Completed              |

### C. Material Inquiries (RFQ)
| Current              | Action           | Role     | Next              |
| -------------------- | ---------------- | -------- | ----------------- |
| Draft                | Publish          | Customer | Open              |
| Open                 | Submit Quotation | Supplier | Receiving Quotes  |
| Receiving Quotes     | Select Supplier  | Customer | Supplier Selected |
| Supplier Selected    | Close            | Customer | Closed            |

### D. Tenders
| Current   | Action          | Role                | Next     |
| --------- | --------------- | ------------------- | -------- |
| Draft     | Publish         | Builder             | Open     |
| Open      | Submit Response | Supplier/Contractor | Responses|
| Responses | Award           | Builder             | Awarded  |
| Awarded   | Close           | Builder             | Closed   |


## 2. Phase 1: Marketplace Engine Endpoints

The marketplace engine covers bids, requirements, milestones, unlocks, rfqs, worker-jobs, and projects.

### A. Customer Project Endpoints

**Inventory:**
- `POST /api/v1/projects` (Create)
- `GET /api/v1/projects/{id}` (Read)
- `PUT /api/v1/projects/{id}` (Update)
- `POST /api/v1/projects/{id}/progress` (Status transition)
- `POST /api/v1/projects/{id}/complete` (Status transition)

*Note: There is currently no dedicated `/publish` or `/award` endpoint in `OpportunityProjectController`. Status transitions are currently merged into generic `update` or `progress` endpoints. This needs to be strictly constrained.*

| Field            | Contract Rules |
| ---------------- | -------------- |
| Method           | POST |
| Endpoint         | `/api/v1/projects` |
| Actor            | Homeowner / Customer |
| Purpose          | Create a new interior project |
| Auth             | Required |
| Authorization    | Any authenticated user can create |
| Validation       | ProjectRequest (budget, timeline, scope) |
| Allowed states   | N/A |
| Forbidden states | N/A |
| DB writes        | `projects` |
| Storage          | Optional floorplans/images |
| Response         | 201 Created |
| Errors           | 401, 422 |
| Idempotency      | No duplicate identical projects |
| Audit event      | `PROJECT_CREATED` |

### B. Professional Quote / Bid Endpoints (CURRENTLY CONFLATED)

**Inventory (CURRENTLY OVER-GENERIC):**
- `POST /api/v1/bids` (Handles Projects, RFQs, and Jobs via `requirement_type` parameter)
- `PATCH /api/v1/bids/{bid}/accept` (Shortlist)
- `PATCH /api/v1/bids/{bid}/award`
- `PATCH /api/v1/bids/{bid}/reject`

**Canonical Requirement:** 
`BidController@store` currently allows any role to submit a "Bid" to any requirement type by simply passing `requirement_type=job` or `project`. This violates business logic (e.g. Worker -> Apply, Supplier -> Quote).

We will audit and split this into:
1. `POST /api/v1/projects/{id}/bids` (Professional -> Quote)
2. `POST /api/v1/worker-jobs/{id}/apply` (Worker -> Application)
3. `POST /api/v1/rfqs/{id}/quotes` (Supplier -> Quotation)

### C. Contact Unlock Endpoints

**Inventory:**
- `POST /api/v1/requirements/{requirement}/unlock`
- `POST /api/v1/listings/{listing}/unlock`

| Field            | Contract Rules |
| ---------------- | -------------- |
| Method           | POST |
| Endpoint         | `/api/v1/requirements/{id}/unlock` |
| Actor            | Professional / Vendor |
| Purpose          | Reveal customer contact details |
| Auth             | Required |
| Authorization    | Professional / Vendor Role |
| Validation       | Sufficient Wallet Balance, Correct Fee |
| Allowed states   | Project/Lead = Active |
| Forbidden states | Project = Awarded, Completed. Lead = Expired |
| DB writes        | `wallets` (decrement), `contact_unlocks` (insert), `transactions` (insert) |
| Storage          | None |
| Response         | 200 OK |
| Errors           | 401, 403, 409 (Already unlocked), 422 (Insufficient funds) |
| Idempotency      | Duplicate requests MUST NOT deduct wallet twice (Atomic) |
| Audit event      | `CONTACT_UNLOCKED`, `WALLET_DEDUCTED` |


### D. RFQ / Supplier / Tender Endpoints

**Inventory:**
- `POST /api/v1/rfqs`
- `PUT /api/v1/rfqs/{id}`
- `DELETE /api/v1/rfqs/{id}`
- `POST /api/v1/rfqs/{id}/progress`

**Canonical Contract:** 
Must enforce states: Draft → Open → Receiving Quotations → Supplier Selected → Closed.
Currently, RFQ quotes are routed through `/api/v1/bids`. The audit will decouple this.

### E. Labour Jobs

**Inventory:**
- `POST /api/v1/worker-jobs`
- `PUT /api/v1/worker-jobs/{id}`
- `DELETE /api/v1/worker-jobs/{id}`
- `POST /api/v1/worker-jobs/{id}/progress`

**Canonical Contract:**
Worker applies, never bids. Must decouple from `/api/v1/bids`. 
Only Builders can create/publish worker jobs.

---
## Remaining API Inventory (To be mapped in subsequent phases)
* `C1-2`: `api/v1/user/*` (Ownership / Authz)
* `C1-3`: `api/v1/wallet/*` and `api/v1/payments/*` (Payment Integrity)
* `C1-4`: `api/v1/listings`, `api/v1/homepage`, `api/v1/search` (Public API)
* `C1-5`: `api/v1/admin/*` (Admin & Audit Trails)
