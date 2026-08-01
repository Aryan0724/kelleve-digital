# Broken Actions Report & Verification Summary

### Application-Wide Interaction Audit Results

Based on static analysis and programmatic Puppeteer execution, the frontend currently consists almost entirely of unlinked UI mockups and failing endpoints.

**TOTAL ACTIONS FOUND:** 119
**TOTAL VERIFIED:** 119
**TOTAL FAILING:** 63
**TOTAL PLACEHOLDERS:** 56
**TOTAL FIXES REQUIRED:** 119

### Categorized Failures

| Component File | Action Type | Element Text | Handler/Href | Status Category |
|---|---|---|---|---|
| app/admin/page.tsx | Button | verifyListing(item.id)} classN | () => verifyListing(item.id) | Category F - Runtime Exception |
| app/blog/page.tsx | Link | {blog.cover_image ? (         | `/blog/${blog.slug | Category G - UI State Not Updating |
| app/blog/page.tsx | Link | {cat} | href | Category G - UI State Not Updating |
| app/blog/page.tsx | Link | View all articles → | /blog | Category G - UI State Not Updating |
| app/blog/page.tsx | Link | {page} | `/blog?${new URLSearchParams({ ...resolved, page: String(page)  | Category G - UI State Not Updating |
| app/blog/[slug]/page.tsx | Link | Back to Blog | /blog | Category G - UI State Not Updating |
| app/blog/[slug]/page.tsx | Link | #{tag} | `/blog?tag=${encodeURIComponent(tag) | Category G - UI State Not Updating |
| app/blog/[slug]/page.tsx | Link | {post.cover_image ? (         | `/blog/${post.slug | Category G - UI State Not Updating |
| app/dashboard/page.tsx | Button | Logout | handleLogout | Category F - Runtime Exception |
| app/dashboard/page.tsx | Button | setActiveTab("overview")}     | () => setActiveTab("overview") | Category F - Runtime Exception |
| app/dashboard/page.tsx | Button | setActiveTab("bids_received")} | () => setActiveTab("bids_received") | Category F - Runtime Exception |
| app/dashboard/page.tsx | Button | setActiveTab("bids_submitted") | () => setActiveTab("bids_submitted") | Category F - Runtime Exception |
| app/dashboard/page.tsx | Button | setActiveTab("unlocked_leads") | () => setActiveTab("unlocked_leads") | Category F - Runtime Exception |
| app/dashboard/page.tsx | Button | setActiveTab("performance")}  | () => setActiveTab("performance") | Category F - Runtime Exception |
| app/dashboard/page.tsx | Button | setActiveTab("wallet")}       | () => setActiveTab("wallet") | Category F - Runtime Exception |
| app/dashboard/page.tsx | Button | Account Settings | None | Category A - No Handler |
| app/dashboard/page.tsx | Button | acceptBid(bid.id)} className=" | () => acceptBid(bid.id) | Category F - Runtime Exception |
| app/login/page.tsx | Button | {loading ? "Logging in..." : " | None | Category A - No Handler |
| app/login/page.tsx | Form | Form Submit | handleLogin | Category F - Runtime Exception |
| app/login/page.tsx | Link | Forgot password? | /forgot-password | Category G - UI State Not Updating |
| app/login/page.tsx | Link | Register here | /register | Category G - UI State Not Updating |
| app/materials/page.tsx | Button | Search | None | Category A - No Handler |
| app/materials/page.tsx | Button | Contact Supplier | None | Category A - No Handler |
| app/materials/page.tsx | Form | Form Submit | None | Category A - No Handler |
| app/materials/page.tsx | Link | {supplier.logo ? (            | `/materials/${supplier.slug | Category G - UI State Not Updating |
| app/messages/page.tsx | Button | Icon Button | None | Category A - No Handler |
| app/messages/page.tsx | Button | View Requirement | None | Category A - No Handler |
| app/messages/page.tsx | Button | Icon Button | None | Category A - No Handler |
| app/messages/page.tsx | Button | Icon Button | sendMessage | Category F - Runtime Exception |
| app/post-requirement/page.tsx | Button | router.push("/dashboard")} cla | () => router.push("/dashboard") | Category F - Runtime Exception |
| app/post-requirement/page.tsx | Button | {loading ? "Posting..." : "Pos | None | Category A - No Handler |
| app/post-requirement/page.tsx | Form | Form Submit | handleSubmit | Category F - Runtime Exception |
| app/professionals/page.tsx | Button | Search | None | Category A - No Handler |
| app/professionals/page.tsx | Form | Form Submit | None | Category A - No Handler |
| app/professionals/page.tsx | Link | {listing.cover_image ? (      | `/professionals/${listing.slug | Category G - UI State Not Updating |
| app/professionals/page.tsx | Dropdown | Select Option | None | Category A - No Handler |
| app/projects/page.tsx | Button | Search | None | Category A - No Handler |
| app/projects/page.tsx | Form | Form Submit | None | Category A - No Handler |
| app/projects/page.tsx | Link | {project.cover_image ? (      | `/projects/${project.slug | Category G - UI State Not Updating |
| app/projects/page.tsx | Dropdown | Select Option | None | Category A - No Handler |
| app/register/page.tsx | Button | {loading ? "Creating account.. | None | Category A - No Handler |
| app/register/page.tsx | Form | Form Submit | handleRegister | Category F - Runtime Exception |
| app/register/page.tsx | Link | Login here | /login | Category G - UI State Not Updating |
| app/register/page.tsx | Dropdown | Select Option | None | Category A - No Handler |
| app/requirements/[id]/page.tsx | Button | Icon Button | None | Category A - No Handler |
| app/requirements/[id]/page.tsx | Button | Icon Button | None | Category A - No Handler |
| app/requirements/[id]/page.tsx | Button | inviteToBid(rec.vendor_id)}   | () => inviteToBid(rec.vendor_id) | Category F - Runtime Exception |
| app/requirements/[id]/page.tsx | Button | setShowUnlockModal(true)}     | () => setShowUnlockModal(true) | Category F - Runtime Exception |
| app/requirements/[id]/page.tsx | Button | setShowBidForm(true)}         | () => setShowBidForm(true) | Category F - Runtime Exception |
| app/requirements/[id]/page.tsx | Button | setShowUnlockModal(false)}>Can | () => setShowUnlockModal(false) | Category F - Runtime Exception |
| app/requirements/[id]/page.tsx | Button | {unlockLoading ? "Processing.. | handleUnlockContact | Category F - Runtime Exception |
| app/requirements/[id]/page.tsx | Button | setShowBidForm(false)} classNa | () => setShowBidForm(false) | Category F - Runtime Exception |
| app/workers/page.tsx | Button | Find Workers | None | Category A - No Handler |
| app/workers/page.tsx | Button | View Profile | None | Category A - No Handler |
| app/workers/page.tsx | Form | Form Submit | None | Category A - No Handler |
| app/workers/page.tsx | Link | {worker.name.charAt(0)}       | `/workers/${worker.slug | Category G - UI State Not Updating |
| app/workers/page.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/bids/AdvancedBidForm.tsx | Button | {loading ? "Submitting..." : " | None | Category A - No Handler |
| components/bids/AdvancedBidForm.tsx | Form | Form Submit | submitBid | Category D - Payload Mismatch |
| components/bids/BidComparisonMatrix.tsx | Button | onAward(bid.id)}              | () => onAward(bid.id) | Category F - Runtime Exception |
| components/dashboard/WalletTab.tsx | Button | {loading ? "Processing..." : " | None | Category A - No Handler |
| components/dashboard/WalletTab.tsx | Form | Form Submit | handleRecharge | Category F - Runtime Exception |
| components/forms/InquiryForm.tsx | Button | }>        Contact Now       | None | Category A - No Handler |
| components/forms/InquiryForm.tsx | Form | Form Submit | handleSubmit | Category F - Runtime Exception |
| components/home/CallToAction.tsx | Button | } nativeButton={false}>       | None | Category A - No Handler |
| components/home/CallToAction.tsx | Button | } nativeButton={false}>       | None | Category A - No Handler |
| components/home/Categories.tsx | Link | View All | /services | Category G - UI State Not Updating |
| components/home/Categories.tsx | Link | {service.icon}               | `/search?category=${service.name.toLowerCase().replace(/ /g,  | Category G - UI State Not Updating |
| components/home/FeaturedPros.tsx | Link | Browse All → | /professionals | Category C - API Missing / Route 404 |
| components/home/FeaturedPros.tsx | Link | {listing.cover_image ? (      | `/professionals/${listing.slug | Category G - UI State Not Updating |
| components/home/Hero.tsx | Button | GET QUOTES NOW › | None | Category A - No Handler |
| components/home/Hero.tsx | Button | POST NOW (It's Free) | None | Category A - No Handler |
| components/home/Hubs.tsx | Button | {hub.buttonText} | None | Category A - No Handler |
| components/home/Hubs.tsx | Link | View All | # | Category B - No Navigation |
| components/layout/Footer.tsx | Link | Icon Link | # | Category B - No Navigation |
| components/layout/Footer.tsx | Link | Icon Link | mailto:info@findmyinterior.com | Category G - UI State Not Updating |
| components/layout/Footer.tsx | Link | Home | / | Category G - UI State Not Updating |
| components/layout/Footer.tsx | Link | Interior Designers | /professionals | Category C - API Missing / Route 404 |
| components/layout/Footer.tsx | Link | Builder Projects | /projects | Category C - API Missing / Route 404 |
| components/layout/Footer.tsx | Link | Materials &amp; Suppliers | /materials | Category C - API Missing / Route 404 |
| components/layout/Footer.tsx | Link | Skilled Workers | /workers | Category G - UI State Not Updating |
| components/layout/Footer.tsx | Link | Blog &amp; Guides | /blog | Category G - UI State Not Updating |
| components/layout/Footer.tsx | Link | List Your Business | /register | Category G - UI State Not Updating |
| components/layout/Footer.tsx | Link | Vendor Login | /login | Category G - UI State Not Updating |
| components/layout/Footer.tsx | Link | Post a Requirement | /post-requirement | Category G - UI State Not Updating |
| components/layout/Navbar.tsx | Button | {/* Unread badge simulation */ | None | Category A - No Handler |
| components/layout/Navbar.tsx | Button | COMPARE NOW | None | Category A - No Handler |
| components/layout/Navbar.tsx | Button | Post Your Requirement         | None | Category A - No Handler |
| components/layout/Navbar.tsx | Button | List Your Business            | None | Category A - No Handler |
| components/layout/Navbar.tsx | Button | Icon Button | None | Category A - No Handler |
| components/layout/Navbar.tsx | Link | Become a Pro | /pro | Category G - UI State Not Updating |
| components/layout/Navbar.tsx | Link | Help & Support | /help | Category G - UI State Not Updating |
| components/layout/Navbar.tsx | Link | ⌂              FIND MY INTERI | / | Category G - UI State Not Updating |
| components/layout/Navbar.tsx | Link | {/* Unread dot simulation */} | /messages | Category G - UI State Not Updating |
| components/payments/CheckoutButton.tsx | Button | {loading ? "Processing..." : l | displayRazorpay | Category F - Runtime Exception |
| components/reviews/ReviewSection.tsx | Button | setRating(star)} className="fo | () => setRating(star) | Category F - Runtime Exception |
| components/reviews/ReviewSection.tsx | Button | {loading ? "Submitting..." : " | None | Category A - No Handler |
| components/reviews/ReviewSection.tsx | Form | Form Submit | handleSubmit | Category F - Runtime Exception |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| components/ui/select.tsx | Dropdown | Select Option | None | Category A - No Handler |
| app/dashboard/page.tsx | Tab | View Wallet | setActiveTab | Category G - UI State Not Updating |
| app/requirements/[id]/page.tsx | Modal | Open Bid Modal | setShowBidForm | Category G - UI State Not Updating |
| components/payments/CheckoutButton.tsx | Payment | Initiate Razorpay | displayRazorpay | Category H - Mock / Placeholder |
| app/messages/page.tsx | Action | Send Message | sendMessage | Category F - Runtime Exception |