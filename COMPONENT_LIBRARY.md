# FINDMYINTERIOR.COM

# COMPONENT_LIBRARY.md

Version: 1.0

Purpose:
Reusable UI components across the platform.

---

# CORE DESIGN SYSTEM

Framework:

* Shadcn UI
* Tailwind CSS

Animation:

* Framer Motion

Icons:

* Lucide React

---

# LAYOUT COMPONENTS

## Header

Component:
Header.tsx

Contains:

* Logo
* Search Bar
* Navigation
* Login Button
* Post Requirement CTA

Used On:

* All Pages

---

## Footer

Component:
Footer.tsx

Contains:

* Company Links
* Categories
* Cities
* Blogs
* Social Links

Used On:

* All Pages

---

## PageContainer

Component:
PageContainer.tsx

Purpose:

* Standard Width
* Responsive Layout

Max Width:
1400px

---

# BUTTON COMPONENTS

## PrimaryButton

Green CTA Button

Examples:

* Get Quotes
* Contact Now
* Post Requirement

---

## SecondaryButton

Outlined Button

Examples:

* View Profile
* Learn More

---

## DangerButton

Delete Actions

Admin Only

---

# CARD COMPONENTS

## ListingCard

Used For:

* Interior Designers
* Architects
* Contractors

Fields:

* Image
* Name
* Category
* Rating
* Location
* CTA

---

## BuilderCard

Fields:

* Project Image
* Builder Name
* Location
* Possession Date

---

## SupplierCard

Fields:

* Company Logo
* Supplier Name
* Product Category
* Inquiry Button

---

## WorkerCard

Fields:

* Profile Image
* Skill
* Experience
* City
* Contact CTA

---

## BlogCard

Fields:

* Featured Image
* Title
* Excerpt
* Read More

---

# SEARCH COMPONENTS

## GlobalSearchBar

Fields:

* Keyword
* City
* Category

Button:

Search

---

## FilterSidebar

Filters:

* Category
* District
* City
* Experience
* Rating

---

# FORM COMPONENTS

## LoginForm

Fields:

* Email
* Password

---

## RegisterForm

Fields:

* Name
* Email
* Phone
* Password

---

## RequirementForm

Fields:

* Project Title
* Budget
* Location
* Description
* Images

---

## InquiryForm

Fields:

* Name
* Phone
* Email
* Message

Purpose:

IndiaMART Style Lead Capture

---

## ContactForm

Used On:

* Profiles
* Supplier Pages
* Builder Pages

---

# PROFILE COMPONENTS

## ProfileHero

Contains:

* Image
* Name
* Rating
* Contact CTA

---

## PortfolioGallery

Grid Layout

Lightbox Enabled

---

## ServicesSection

Service List

---

## ReviewsSection

User Reviews

Ratings

---

# MARKETPLACE COMPONENTS

## CategoryGrid

Displays:

* Interior Designers
* Architects
* Builders
* Suppliers
* Workers

---

## FeaturedListings

Homepage Component

---

## SupplierProductsGrid

Displays Supplier Products

---

## BuilderProjectsGrid

Displays Builder Projects

---

## WorkforceGrid

Displays Workers

---

# BLOG COMPONENTS

## BlogGrid

Blog Listing Page

---

## BlogDetail

Single Blog Page

---

## RelatedPosts

Suggested Articles

---

# PAYMENT COMPONENTS

## PricingCard

Plan Name

Price

Features

CTA

---

## PaymentModal

Razorpay Checkout

---

## SubscriptionBadge

Shows:

* Basic
* Premium
* Featured

---

# ADMIN COMPONENTS

## AdminSidebar

Navigation

---

## AdminHeader

Admin Topbar

---

## StatCard

Metrics:

* Users
* Leads
* Revenue

---

## DataTable

Reusable Table

Used For:

* Users
* Listings
* Leads
* Payments

---

## StatusBadge

Values:

* Active
* Pending
* Suspended

---

# SEO COMPONENTS

## SEOHead

Meta Tags

OpenGraph

Canonical

---

## Breadcrumb

SEO Navigation

---

# LOADING COMPONENTS

## PageLoader

Full Page Loading

---

## SkeletonCard

Card Placeholder

---

## SkeletonTable

Table Placeholder

---

# ERROR COMPONENTS

## EmptyState

No Data Found

---

## ErrorState

Something Went Wrong

---

## NotFound

404 Page

---

# REUSABILITY RULE

Before creating any new component:

1. Check if a reusable component exists.
2. Extend existing component if possible.
3. Create new component only if necessary.

Goal:

Maximum Reusability

Minimum Code Duplication

END OF FILE
