# Database Ownership & Dependency Map

## 1. Classification Summary

| Table | Assigned Domain | Dependencies (Foreign Keys) |
|---|---|---|
| `cache` | **FMI** | None |
| `cache_locks` | **FMI** | None |
| `jobs` | **FMI** | None |
| `job_batches` | **FMI** | None |
| `failed_jobs` | **FMI** | None |
| `users` | **Auth/Core** | None |
| `password_reset_tokens` | **Auth/Core** | None |
| `sessions` | **Auth/Core** | None |
| `districts` | **Shared/Cross-Domain** | None |
| `cities` | **Shared/Cross-Domain** | `districts` |
| `categories` | **Shared/Cross-Domain** | `categories` |
| `listings` | **TrueDial** | `users`, `categories`, `cities`, `districts` |
| `listing_galleries` | **TrueDial** | `listings` |
| `requirements` | **FMI** | `users`, `categories`, `cities`, `districts` |
| `requirement_images` | **FMI** | `requirements` |
| `builders` | **FMI** | `users`, `cities`, `districts` |
| `builder_projects` | **FMI** | `builders` |
| `builder_project_images` | **FMI** | `builder_projects` |
| `suppliers` | **FMI** | `users`, `cities`, `districts` |
| `supplier_products` | **FMI** | `suppliers` |
| `supplier_product_images` | **FMI** | `supplier_products` |
| `workers` | **FMI** | `users`, `cities`, `districts` |
| `reviews` | **TrueDial** | `users` |
| `inquiries` | **FMI** | `users` |
| `blogs` | **FMI** | `users` |
| `blog_tags` | **FMI** | `blogs` |
| `payments` | **FMI** | `users` |
| `subscription_plans` | **FMI** | None |
| `user_subscriptions` | **FMI** | `users`, `subscription_plans`, `payments` |
| `contact_unlocks` | **FMI** | `users`, `requirements`, `payments` |
| `seo_pages` | **FMI** | None |
| `bids` | **FMI** | `requirements`, `users` |
| `roles` | **Auth/Core** | None |
| `user_roles` | **Auth/Core** | `users`, `roles` |
| `wallets` | **FMI** | `users` |
| `wallet_transactions` | **FMI** | `wallets` |
| `advertisements` | **FMI** | None |
| `vendor_metrics` | **FMI** | `users` |
| `labour_requirements` | **FMI** | `users`, `cities` |
| `labour_applications` | **FMI** | `labour_requirements`, `users` |
| `tenders` | **FMI** | `users`, `categories`, `cities` |
| `tender_quotes` | **FMI** | `tenders`, `users` |
| `activity_timelines` | **FMI** | `users` |
| `saved_projects` | **FMI** | `users`, `requirements` |
| `saved_vendors` | **TrueDial** | `users` |
| `personal_access_tokens` | **Auth/Core** | None |
| `conversations` | **FMI** | `users` |
| `messages` | **FMI** | `conversations`, `users` |
| `message_attachments` | **FMI** | `messages`, `users` |
| `requirement_recommendations` | **FMI** | `requirements`, `users` |
| `notifications` | **FMI** | None |
| `projects` | **FMI** | `requirements`, `bids`, `users` |
| `activity_logs` | **FMI** | `users` |
| `opportunity_types` | **FMI** | None |
| `rfqs` | **FMI** | `users` |
| `worker_jobs` | **FMI** | `users` |
| `shortlists` | **FMI** | `users`, `projects` |
| `user_documents` | **FMI** | `users` |
| `project_milestones` | **FMI** | `projects` |
| `locations` | **Shared/Cross-Domain** | None |
| `settings` | **Shared/Cross-Domain** | None |
| `contact_messages` | **FMI** | None |
| `offers` | **TrueDial** | `listings` |
| `privilege_cards` | **TrueDial** | `users` |
| `tenants` | **Auth/Core** | `tenants`, `users`, `roles` |
| `tenant_modules` | **Auth/Core** | `tenants`, `users`, `roles` |
| `tenant_user` | **Auth/Core** | `tenants`, `users`, `roles` |
| `product_categories` | **TrueDial** | None |
| `service_categories` | **TrueDial** | None |
| `listing_products` | **TrueDial** | `listings`, `product_categories` |
| `listing_services` | **TrueDial** | `listings`, `service_categories` |
| `media` | **TrueDial** | None |
| `analytics_events` | **TrueDial** | `tenants` |
| `review_helpful_votes` | **TrueDial** | `reviews`, `users` |
| `review_replies` | **TrueDial** | `reviews`, `users` |
| `review_reports` | **TrueDial** | `reviews`, `users` |
| `analytics_daily` | **TrueDial** | `listings` |
| `ventures` | **FMI** | `users` |
| `advertisement_stats` | **TrueDial** | `advertisements` |
| `consulting_leads` | **TrueDial** | None |
| `truedial_invoices` | **TrueDial** | `users` |
| `marketing_campaigns` | **TrueDial** | `users` |
| `bookmarks` | **FMI** | `users` |
| `call_logs` | **FMI** | `users` |
| `user_categories` | **FMI** | `users` |
| `cross_platform_bids` | **FMI** | None |
| `syndicated_listings` | **FMI** | None |
| `user_tenant_roles` | **Auth/Core** | `users` |
| `otps` | **Auth/Core** | None |
| `patients` | **FMI** | `tenants`, `users` |
| `job_applications` | **FMI** | `worker_jobs`, `users` |
| `rfq_quotations` | **FMI** | `rfqs`, `users` |

## 2. Cross-Database Dependencies

> [!WARNING]
> The following physical foreign keys span across different domains. If these domains are split into physically isolated databases, these constraints **will fail** in MySQL unless the databases reside on the same instance and queries are fully qualified.

| Source Domain | Source Table | Column | Target Domain | Target Table |
|---|---|---|---|---|
| TrueDial | `listings` | `user_id` | Auth/Core | `users` |
| TrueDial | `listings` | `category_id` | Shared/Cross-Domain | `categories` |
| TrueDial | `listings` | `city_id` | Shared/Cross-Domain | `cities` |
| TrueDial | `listings` | `district_id` | Shared/Cross-Domain | `districts` |
| FMI | `requirements` | `user_id` | Auth/Core | `users` |
| FMI | `requirements` | `category_id` | Shared/Cross-Domain | `categories` |
| FMI | `requirements` | `city_id` | Shared/Cross-Domain | `cities` |
| FMI | `requirements` | `district_id` | Shared/Cross-Domain | `districts` |
| FMI | `requirements` | `awarded_vendor_id` | Auth/Core | `users` |
| FMI | `builders` | `user_id` | Auth/Core | `users` |
| FMI | `builders` | `city_id` | Shared/Cross-Domain | `cities` |
| FMI | `builders` | `district_id` | Shared/Cross-Domain | `districts` |
| FMI | `suppliers` | `user_id` | Auth/Core | `users` |
| FMI | `suppliers` | `city_id` | Shared/Cross-Domain | `cities` |
| FMI | `suppliers` | `district_id` | Shared/Cross-Domain | `districts` |
| FMI | `workers` | `user_id` | Auth/Core | `users` |
| FMI | `workers` | `city_id` | Shared/Cross-Domain | `cities` |
| FMI | `workers` | `district_id` | Shared/Cross-Domain | `districts` |
| TrueDial | `reviews` | `user_id` | Auth/Core | `users` |
| FMI | `inquiries` | `user_id` | Auth/Core | `users` |
| FMI | `blogs` | `author_id` | Auth/Core | `users` |
| FMI | `payments` | `user_id` | Auth/Core | `users` |
| FMI | `user_subscriptions` | `user_id` | Auth/Core | `users` |
| FMI | `contact_unlocks` | `user_id` | Auth/Core | `users` |
| FMI | `bids` | `professional_id` | Auth/Core | `users` |
| FMI | `wallets` | `user_id` | Auth/Core | `users` |
| FMI | `vendor_metrics` | `vendor_id` | Auth/Core | `users` |
| FMI | `labour_requirements` | `user_id` | Auth/Core | `users` |
| FMI | `labour_requirements` | `city_id` | Shared/Cross-Domain | `cities` |
| FMI | `labour_applications` | `worker_id` | Auth/Core | `users` |
| FMI | `tenders` | `user_id` | Auth/Core | `users` |
| FMI | `tenders` | `category_id` | Shared/Cross-Domain | `categories` |
| FMI | `tenders` | `city_id` | Shared/Cross-Domain | `cities` |
| FMI | `tender_quotes` | `supplier_id` | Auth/Core | `users` |
| FMI | `activity_timelines` | `user_id` | Auth/Core | `users` |
| FMI | `saved_projects` | `user_id` | Auth/Core | `users` |
| TrueDial | `saved_vendors` | `user_id` | Auth/Core | `users` |
| TrueDial | `saved_vendors` | `vendor_id` | Auth/Core | `users` |
| FMI | `conversations` | `customer_id` | Auth/Core | `users` |
| FMI | `conversations` | `vendor_id` | Auth/Core | `users` |
| FMI | `messages` | `sender_id` | Auth/Core | `users` |
| FMI | `message_attachments` | `uploaded_by` | Auth/Core | `users` |
| FMI | `requirement_recommendations` | `vendor_id` | Auth/Core | `users` |
| FMI | `projects` | `client_id` | Auth/Core | `users` |
| FMI | `projects` | `professional_id` | Auth/Core | `users` |
| FMI | `activity_logs` | `user_id` | Auth/Core | `users` |
| FMI | `rfqs` | `user_id` | Auth/Core | `users` |
| FMI | `rfqs` | `supplier_id` | Auth/Core | `users` |
| FMI | `worker_jobs` | `user_id` | Auth/Core | `users` |
| FMI | `worker_jobs` | `worker_id` | Auth/Core | `users` |
| FMI | `shortlists` | `user_id` | Auth/Core | `users` |
| FMI | `shortlists` | `professional_id` | Auth/Core | `users` |
| FMI | `user_documents` | `user_id` | Auth/Core | `users` |
| FMI | `user_documents` | `approved_by` | Auth/Core | `users` |
| TrueDial | `privilege_cards` | `user_id` | Auth/Core | `users` |
| TrueDial | `analytics_events` | `tenant_id` | Auth/Core | `tenants` |
| TrueDial | `review_helpful_votes` | `user_id` | Auth/Core | `users` |
| TrueDial | `review_replies` | `user_id` | Auth/Core | `users` |
| TrueDial | `review_reports` | `user_id` | Auth/Core | `users` |
| FMI | `ventures` | `user_id` | Auth/Core | `users` |
| TrueDial | `advertisement_stats` | `advertisement_id` | FMI | `advertisements` |
| TrueDial | `truedial_invoices` | `user_id` | Auth/Core | `users` |
| TrueDial | `marketing_campaigns` | `user_id` | Auth/Core | `users` |
| FMI | `bookmarks` | `user_id` | Auth/Core | `users` |
| FMI | `call_logs` | `caller_id` | Auth/Core | `users` |
| FMI | `user_categories` | `user_id` | Auth/Core | `users` |
| FMI | `patients` | `tenant_id` | Auth/Core | `tenants` |
| FMI | `patients` | `user_id` | Auth/Core | `users` |
| FMI | `job_applications` | `professional_id` | Auth/Core | `users` |
| FMI | `rfq_quotations` | `professional_id` | Auth/Core | `users` |

## 3. Architectural Resolution Strategy

### The Identity & Core Data Problem
Both `FMI` and `TrueDial` rely heavily on `users` and geographical tables (`cities`, `districts`). Moving `users` to an isolated `Auth DB` will break dozens of physical foreign key constraints in both applications.

### Target Architecture Exception
Because FindMyInterior and TrueDial are tightly coupled to the same identity and geographical ecosystem, **Auth/Core and Shared tables MUST reside in the primary FMI database** (`findmyinterior`). TrueDial models will connect to the `truedial` database, but we must either:
1. Drop physical foreign key constraints in TrueDial that point to `users` and manage them at the application layer.
2. Provide TrueDial with read-only cross-database access if hosted on the same MySQL cluster.

Given that `database/migrations/truedial/2026_08_13_000001_create_truedial_database_schema.php` already defines TrueDial tables **without** foreign key constraints, Strategy 1 has already been partially implemented in schema, but the original overlapping migrations were never cleaned up.
