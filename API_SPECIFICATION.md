# FINDMYINTERIOR.COM

# API_SPECIFICATION.md

Version: 1.0

Backend: Laravel 12

Authentication: Laravel Sanctum

Response Format: JSON

Base URL:

/api/v1

---

# API STRUCTURE

Modules:

1. Authentication
2. Users
3. Listings
4. Categories
5. Requirements
6. Builders
7. Suppliers
8. Workers
9. Inquiries
10. Blogs
11. Payments
12. Subscriptions
13. Admin

---

# STANDARD RESPONSE FORMAT

Success:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

---

# AUTHENTICATION

## Register

POST

/api/v1/auth/register

Request

```json
{
  "name": "",
  "email": "",
  "phone": "",
  "password": ""
}
```

Response

```json
{
  "token": ""
}
```

---

## Login

POST

/api/v1/auth/login

Request

```json
{
  "email": "",
  "password": ""
}
```

---

## Logout

POST

/api/v1/auth/logout

---

## Current User

GET

/api/v1/auth/me

---

# USERS

## User Profile

GET

/api/v1/users/profile

---

## Update Profile

PUT

/api/v1/users/profile

Request

```json
{
  "name": "",
  "phone": "",
  "city": ""
}
```

---

# CATEGORIES

## All Categories

GET

/api/v1/categories

---

## Single Category

GET

/api/v1/categories/{id}

---

# LISTINGS

## All Listings

GET

/api/v1/listings

Filters

?category=

?city=

?district=

?featured=

?page=

---

## Featured Listings

GET

/api/v1/listings/featured

---

## Single Listing

GET

/api/v1/listings/{slug}

---

## Create Listing

POST

/api/v1/listings

Request

```json
{
  "title": "",
  "category_id": "",
  "description": "",
  "city": ""
}
```

---

## Update Listing

PUT

/api/v1/listings/{id}

---

## Delete Listing

DELETE

/api/v1/listings/{id}

---

# LISTING GALLERY

## Upload Image

POST

/api/v1/listings/{id}/gallery

---

## Delete Image

DELETE

/api/v1/gallery/{id}

---

# REQUIREMENTS

## Create Requirement

POST

/api/v1/requirements

Request

```json
{
  "title": "",
  "budget": "",
  "city": "",
  "description": ""
}
```

---

## Get Requirements

GET

/api/v1/requirements

---

## Single Requirement

GET

/api/v1/requirements/{id}

---

## Update Requirement

PUT

/api/v1/requirements/{id}

---

## Delete Requirement

DELETE

/api/v1/requirements/{id}

---

# BUILDERS

## All Builders

GET

/api/v1/builders

---

## Single Builder

GET

/api/v1/builders/{id}

---

## Create Builder

POST

/api/v1/builders

---

## Update Builder

PUT

/api/v1/builders/{id}

---

## Delete Builder

DELETE

/api/v1/builders/{id}

---

# BUILDER PROJECTS

## Get Projects

GET

/api/v1/builder-projects

---

## Create Project

POST

/api/v1/builder-projects

---

## Update Project

PUT

/api/v1/builder-projects/{id}

---

## Delete Project

DELETE

/api/v1/builder-projects/{id}

---

# SUPPLIERS

## All Suppliers

GET

/api/v1/suppliers

---

## Single Supplier

GET

/api/v1/suppliers/{id}

---

## Create Supplier

POST

/api/v1/suppliers

---

## Update Supplier

PUT

/api/v1/suppliers/{id}

---

## Delete Supplier

DELETE

/api/v1/suppliers/{id}

---

# SUPPLIER PRODUCTS

## Get Products

GET

/api/v1/products

---

## Create Product

POST

/api/v1/products

---

## Update Product

PUT

/api/v1/products/{id}

---

## Delete Product

DELETE

/api/v1/products/{id}

---

# WORKERS

## All Workers

GET

/api/v1/workers

---

## Single Worker

GET

/api/v1/workers/{id}

---

## Create Worker

POST

/api/v1/workers

---

## Update Worker

PUT

/api/v1/workers/{id}

---

## Delete Worker

DELETE

/api/v1/workers/{id}

---

# REVIEWS

## Create Review

POST

/api/v1/reviews

Request

```json
{
  "listing_id": "",
  "rating": 5,
  "review": ""
}
```

---

## Get Listing Reviews

GET

/api/v1/listings/{id}/reviews

---

# INQUIRIES

IndiaMART Style Lead System

## Create Inquiry

POST

/api/v1/inquiries

Request

```json
{
  "listing_id": "",
  "name": "",
  "phone": "",
  "message": ""
}
```

---

## Get My Inquiries

GET

/api/v1/inquiries

---

# BLOGS

## All Blogs

GET

/api/v1/blogs

---

## Single Blog

GET

/api/v1/blogs/{slug}

---

## Create Blog

POST

/api/v1/blogs

Admin Only

---

## Update Blog

PUT

/api/v1/blogs/{id}

Admin Only

---

## Delete Blog

DELETE

/api/v1/blogs/{id}

Admin Only

---

# PAYMENTS

## Create Razorpay Order

POST

/api/v1/payments/create-order

Request

```json
{
  "amount": 999
}
```

---

## Verify Payment

POST

/api/v1/payments/verify

---

## Payment History

GET

/api/v1/payments/history

---

# SUBSCRIPTIONS

## Get Plans

GET

/api/v1/plans

---

## Purchase Plan

POST

/api/v1/plans/purchase

---

## Active Subscription

GET

/api/v1/subscriptions/current

---

# CONTACT UNLOCK

## Unlock Contact

POST

/api/v1/contact-unlock

Request

```json
{
  "listing_id": 1
}
```

---

## My Unlocks

GET

/api/v1/contact-unlock

---

# SEARCH API

## Global Search

GET

/api/v1/search

Query Params

?keyword=

?city=

?district=

?category=

---

# ADMIN

Admin Middleware Required

---

## Dashboard Stats

GET

/api/v1/admin/dashboard

Returns

* Users Count
* Listings Count
* Leads Count
* Revenue

---

## Manage Users

GET

/api/v1/admin/users

PUT

/api/v1/admin/users/{id}

DELETE

/api/v1/admin/users/{id}

---

## Manage Listings

GET

/api/v1/admin/listings

PUT

/api/v1/admin/listings/{id}

DELETE

/api/v1/admin/listings/{id}

---

## Manage Requirements

GET

/api/v1/admin/requirements

---

## Manage Payments

GET

/api/v1/admin/payments

---

## Manage Blogs

GET

/api/v1/admin/blogs

---

# SECURITY

Sanctum Authentication

CSRF Protection

Rate Limiting

Request Validation

Role-Based Access Control

Input Sanitization

---

# FUTURE APIs (PHASE 2)

Do Not Build Now

* Tender APIs
* Bidding APIs
* Chat APIs
* Notification APIs
* Project Tracking APIs
* Mobile App APIs

---

# MVP ENDPOINT PRIORITY

Build First:

1. Auth
2. Categories
3. Listings
4. Search
5. Requirements
6. Inquiries
7. Admin Dashboard
8. Payments

Everything else can be added after launch.

END OF FILE
