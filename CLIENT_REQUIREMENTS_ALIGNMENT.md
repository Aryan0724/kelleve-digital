# Client Requirements Alignment

## Platform Identity Shift
The platform is fully transitioning from a static directory/listing website into a **Dynamic Project Bidding Marketplace**. The **Requirement Detail Page** is now the primary transaction engine where demand (customers) meets supply (professionals).

---

## 1. Advanced Bid Submission System
Professionals will no longer just submit a simple price and text proposal. Bids will now be comprehensive project proposals including:
- **Company Name & Contact Person**
- **Category**
- **Experience (Years)**
- **Estimated Cost (₹)**
- **Timeline (Days/Weeks)**
- **Warranty Offered (Months/Years)**
- **Inclusions:** Material Included (Yes/No), Labour Included (Yes/No), Design Included (Yes/No), Supervision Included (Yes/No)
- **Portfolio:** Upload up to 5 relevant images/documents
- **Previous Projects Count**
- **Proposal Message / Cover Letter**

## 2. Customer Bid Comparison System
Customers will receive a unified dashboard to compare incoming bids side-by-side. 
**Comparison Metrics:**
- Total Price
- Vendor Experience
- Vendor Platform Rating
- Total Projects Completed
- Warranty Duration
- Timeline to Completion
- Material/Labour/Design/Supervision inclusions

## 3. Smart Bid Score Algorithm
To assist customers in making informed decisions, the platform will automatically score incoming bids based on the professional's profile and proposal quality.
**Weightage Formula:**
- **Experience:** 30%
- **Rating:** 30%
- **Projects Completed:** 20%
- **Verification Status:** 20%
*(The highest-scoring bid will receive a "Recommended Bid" badge).*

## 4. Requirement Lifecycle Management
Requirements will no longer just be "Open" or "Closed". They will follow a strict, transparent lifecycle:
1. **Open:** Accepting unlocks and bids.
2. **Bidding:** Customer is actively reviewing bids.
3. **Shortlisted:** Customer has shortlisted 1 or more bids for final discussion.
4. **Awarded:** Customer has accepted a specific bid.
5. **Completed:** The project is marked as finished by the customer.
6. **Expired:** 30 days have passed without the requirement being awarded.

## 5. Verification System
Trust is critical for marketplace liquidity.
- **Customer Verification:** Phone OTP / Email verification before posting requirements.
- **Vendor Verification:** Multi-tier verification (Basic, Identity, Business License, Site Visit).
- **Verified Badge:** Displayed prominently on profiles, bids, and listings.

## 6 & 7. Saved Entities (Bookmarks)
Users must be able to curate their experience.
- **Saved Projects:** Professionals can bookmark requirements they want to bid on later.
- **Saved Vendors:** Customers can bookmark professionals they want to invite to bid on future projects.

## 8. Lead Expiry
To maintain a high-quality, active marketplace, stale leads will be removed automatically.
- **Default Expiry:** Requirements automatically move to "Expired" status after 30 Days of inactivity.

## 9. Role-Specific Dashboards
The dashboard system will be heavily modularized to cater to specific user journeys:
- **Customer:** Focus on posted requirements, bid comparisons, saved vendors, and project lifecycle tracking.
- **Vendor (Business):** Focus on available requirements, active bids, unlocked contacts, and profile analytics.
- **Builder:** Focus on large-scale project bidding and portfolio management.
- **Supplier:** Focus on material supply requirements and bulk orders.
- **Workforce:** Focus on localized labour requirements and gig availability.

## 10. Admin Approval Workflow
Quality control will be enforced at the entry point.
- **Listings:** All new business profiles, builder profiles, supplier profiles, and worker profiles remain in a "Pending" state and are hidden from the public directory until an Admin explicitly approves them.

---

## 11. Official UX Flow for Contact Unlock Pricing
Pricing must never be exposed publicly as a deterrent. The official UX flow is strictly enforced as:

1. **Unlock Contact (Button Click)** 
   *(Professional clicks on a masked lead)*
2. **→ Popup Modal**
   *(Modal opens with a summary of the project information)*
3. **→ Continue**
   *(Professional confirms they want to proceed)*
4. **→ Pricing**
   *(The ₹49 price is revealed ONLY at this step)*
5. **→ Checkout**
   *(Razorpay gateway processes the transaction)*
