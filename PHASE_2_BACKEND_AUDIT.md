# Phase 2 Backend Route Audit

| Requested Route | Actual Route / Status | Status Code | Response Structure | Missing Fields / Notes |
| :--- | :--- | :--- | :--- | :--- |
| \GET /api/v1/requirements\ | \GET /api/v1/requirements\ | 200 OK | Paginated list of \RequirementResource\ | None. Works as intended for 'Available Leads'. |
| \GET /api/v1/user/unlocked-leads\ | \GET /api/v1/user/dashboard\ (Property: \unlocked_contacts\) | 200 OK | Array of unlocked contacts with requirement and city relations | Route doesn't exist independently; however, \DashboardController\ provides this data seamlessly. |
| \GET /api/v1/user/bids\ | \GET /api/v1/bids\ | 200 OK | Array of \Bid\ models with requirement relations | Exists at \/api/v1/bids\. Serves 'My Bids' section. |
| \GET /api/v1/user/won-projects\ | \GET /api/v1/bids\ (Filtered by \status === 'awarded'\) | 200 OK | Array of \Bid\ models | Route doesn't exist independently. Can be derived on frontend by filtering \myBids\ or \dashboard.submitted_bids\ where status is 'awarded'. |
| \GET /api/v1/wallet\ | \GET /api/v1/wallet\ | 200 OK | Wallet object and transactions | Exists and returns current balance and transaction history. |
| \GET /api/v1/subscriptions/current\| \GET /api/v1/auth/me\ or \GET /api/v1/user/dashboard\ | 200 OK | User object with \ctiveSubscription.plan\ | Route doesn't exist independently. Handled efficiently via auth user or dashboard context. |

## Audit Conclusion
All required data points are available from the backend. Instead of creating redundant isolated endpoints, the frontend will leverage the highly optimized \/api/v1/user/dashboard\ endpoint which aggregates \unlocked_contacts\, \submitted_bids\, \ecommended_leads\, \wallet_balance\, and \subscription\ in a single fast query.
