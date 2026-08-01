# FindMyInterior API Endpoints

This document maps out all available backend API routes for frontend integration. 

## Auth
- `POST /api/v1/auth/login` - Login (No Auth Required)
- `POST /api/v1/auth/register` - Register (No Auth Required)
- `POST /api/v1/auth/logout` - Logout (Auth Required)
- `GET  /api/v1/auth/me` - Get Current User (Auth Required)
- `POST /api/v1/auth/forgot-password` - Forgot Password (No Auth Required)
- `POST /api/v1/auth/reset-password` - Reset Password (No Auth Required)

## Homepage & Dropdowns
- `GET  /api/v1/homepage` - Get Homepage Data (Categories, Featured Listings/Builders/Suppliers/Workers)
- `GET  /api/v1/categories` - List Categories
- `GET  /api/v1/cities` - List Cities
- `GET  /api/v1/districts` - List Districts

## Listings
- `GET  /api/v1/listings` - List/Filter General Listings
- `GET  /api/v1/listings/{listing}` - Get Single Listing

## Builders & Builder Projects
- `GET  /api/v1/builders` - List/Filter Builders
- `GET  /api/v1/builders/{builder}` - Get Single Builder Profile
- `GET  /api/v1/builder-projects` - List Builder Projects
- `GET  /api/v1/builder-projects/{slug}` - Get Builder Project

## Suppliers
- `GET  /api/v1/suppliers` - List/Filter Suppliers
- `GET  /api/v1/suppliers/{supplier}` - Get Single Supplier Profile

## Workers
- `GET  /api/v1/workers` - List/Filter Workers
- `GET  /api/v1/workers/{worker}` - Get Single Worker Profile

## Requirements
- `GET  /api/v1/requirements` - List Public Requirements
- `GET  /api/v1/requirements/{requirement}` - Get Single Requirement
- `POST /api/v1/requirements` - Post a Requirement (Auth Required)

## Inquiries
- `POST /api/v1/inquiries` - Send an inquiry/lead to a listing or professional

## Blogs
- `GET  /api/v1/blogs` - List Blogs
- `GET  /api/v1/blogs/{blog}` - Get Single Blog

## User Profile & Management (Auth Required)
- `GET  /api/v1/user/dashboard` - Get user dashboard stats
- `GET  /api/v1/user/profile` - Get full user profile
- `PUT  /api/v1/user/profile` - Update user profile
- `PUT  /api/v1/user/change-password` - Change user password
- `GET  /api/v1/user/listings` - Get user's managed listings
- `POST /api/v1/user/listings` - Create a listing
- `PUT  /api/v1/user/listings/{id}` - Update a listing
- `POST /api/v1/user/listings/{id}/gallery` - Add gallery image to listing
- `DELETE /api/v1/user/listings/{id}/gallery/{imageId}` - Delete gallery image
- `GET  /api/v1/user/reviews` - Get user's reviews
- `POST /api/v1/user/reviews` - Post a review

## Subscriptions & Payments
- `GET  /api/v1/subscriptions/plans` - List Subscription Plans
- `POST /api/v1/payments/create-order` - Create Razorpay Order (Auth Required)
- `POST /api/v1/payments/verify` - Verify Payment Signature (Auth Required)
- `GET  /api/v1/payments/history` - User Payment History (Auth Required)

## Admin (Auth Required - Admin Role)
- `GET  /api/v1/admin/dashboard` - Admin Dashboard Stats
- `GET  /api/v1/admin/users` - Manage Users
- `PATCH /api/v1/admin/users/{id}/toggle-active` - Toggle User
- `GET  /api/v1/admin/listings` - Manage Listings
- `PATCH /api/v1/admin/listings/{id}/verify` - Verify Listing
- `PATCH /api/v1/admin/listings/{id}/feature` - Feature Listing
- `PATCH /api/v1/admin/builders/{id}/verify` - Verify Builder
- `PATCH /api/v1/admin/suppliers/{id}/verify` - Verify Supplier
- `PATCH /api/v1/admin/workers/{id}/verify` - Verify Worker
- `GET  /api/v1/admin/requirements` - Manage Requirements
- `PATCH /api/v1/admin/requirements/{id}/close` - Close Requirement
- `GET  /api/v1/admin/reviews/pending` - Review Moderation Queue
- `PATCH /api/v1/admin/reviews/{id}/approve` - Approve Review
- `DELETE /api/v1/admin/reviews/{id}` - Delete Review
- `POST /api/v1/admin/blogs` - Create Blog
- `DELETE /api/v1/admin/blogs/{id}` - Delete Blog
