# Frontend Architecture (Bid Engine)

## Framework & UI
- **Next.js 14 App Router**
- **Tailwind CSS + Shadcn UI** for components.

## Core Architectural Shifts

### 1. The Requirement Detail Page as the Transaction Hub
The page `src/app/requirements/[id]/page.tsx` is completely overhauled. 
- **Customer View:** Displays incoming bids, comparisons, and the "Award Project" button.
- **Professional View:** Displays project details, the "Submit Proposal" form (with 14+ fields), and the contact unlock gateway.

### 2. Contact Unlock Hidden Pricing Flow (Strict UX)
Pricing is never exposed on static buttons or public text. 
**Component Flow:**
1. `UnlockButtonComponent` -> Triggers `UnlockIntentModal`.
2. `UnlockIntentModal` -> Shows masked project summary and a "Continue to Pricing" button.
3. State shift -> Shows the `PricingCheckoutComponent` revealing the ₹49 fee.
4. User clicks Pay -> Razorpay script executes.

### 3. Smart Bid Comparison UI
- A new interactive component `BidComparisonMatrix.tsx` allows customers to select up to 3 bids and compare them side-by-side.
- Visual Badges for: `Recommended Bid`, `Verified Professional`, and `Best Value`.

### 4. Modular Dashboard Architecture
The old generic dashboard is replaced with role-specific isolated layouts:
- `src/app/dashboard/customer/page.tsx`
- `src/app/dashboard/vendor/page.tsx`
- `src/app/dashboard/builder/page.tsx`
- `src/app/dashboard/supplier/page.tsx`
- `src/app/dashboard/worker/page.tsx`

*Routing Logic:* `src/app/dashboard/page.tsx` now acts solely as a role-router, instantly redirecting the user to their specific sub-dashboard based on their token claims.

### 5. Bookmark & Saved Items UI
- Global `SaveHeartIcon` component added to Requirement cards and Listing cards.
- Connected to React Context/Zustand store `useBookmarksStore` for optimistic UI updates.

### 6. Admin Approval Queue
- Admin dashboard updated to default all new provider signups to a "Pending Approvals" tab.
- Bulk approve/reject UI implemented.
