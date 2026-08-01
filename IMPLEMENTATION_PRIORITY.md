# Implementation Priority

Based on the Business Alignment Audit, we must pivot from building directory features to building marketplace transaction engines. The following priority list dictates the execution order for the remainder of the project.

## Priority 1: Revenue Critical

These modules directly generate cash flow and must be built immediately.

1. **Database Expansion Migration:** Create `bids`, `tenders`, `tender_quotes`, `labour_requirements`, `labour_applications`.
2. **Project Bidding System (Module 4):**
   - API to submit bids on Requirements.
   - Professional Dashboard to view available Requirements and submit proposals.
   - Customer Dashboard to view received bids.
3. **Contact Unlock UI (Module 5):**
   - Wire up the Frontend to trigger the Razorpay modal when a Professional clicks "Unlock Contact" on a Requirement.
4. **Material Tender System (Module 12):**
   - Allow Builders to post bulk material requirements.
   - Allow Suppliers to pay a fee to access and quote on these tenders.

## Priority 2: Marketplace Critical

These modules ensure supply and demand can interact effectively.

1. **Compare Professionals (Module 2):**
   - UI matrix allowing customers to select up to 3 professionals and compare reviews, pricing, and past projects side-by-side.
2. **Post Requirement Wizard (Module 3):**
   - A multi-step frontend form capturing specific dimensions, budget constraints, and timeline for high-quality lead generation.
3. **Labour Requirement Board (Module 9):**
   - A dedicated board where builders post daily/weekly wage labour needs.
   - Workers or agencies can apply.

## Priority 3: Growth Features

These features optimize the user experience and scale lead generation.

1. **Premium Listing Sorting:**
   - Update `ListingController` and search APIs to sort by `is_premium` descending, then by reviews.
2. **Supplier Marketplace Catalog (Module 10):**
   - UI for users to browse `supplier_products`.
3. **Product Inquiry System (Module 11):**
   - Frontend modals for "Send Inquiry" attached to Supplier Products.
4. **Subscription Pricing Page:**
   - Frontend UI displaying Silver, Gold, Platinum, Diamond tiers and routing to Razorpay.

## Priority 4: Future Features

These features are for scaling the Kleve Ecosystem and external monetization.

1. **Advertisements System:**
   - Database and UI for banner ad management.
2. **Sponsored Rankings:**
   - Auction system for top search result slots.
3. **Marketplace Commission Escrow:**
   - Holding funds for large interior projects and taking a percentage cut.
4. **Kleve Ecosystem Hub (Module 13):**
   - Dedicated SEO pages for Kleve Kitchens, FloorWale, etc.
5. **Franchise Admin Panel:**
   - Role-based access control for city-specific franchise owners.
