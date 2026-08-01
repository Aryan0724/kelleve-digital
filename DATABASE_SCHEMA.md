# FINDMYINTERIOR.COM — DATABASE SCHEMA

Version: 3.0 (Master Execution V2 - Business Aligned)
Last Updated: 2026-06-12

---

## DECISIONS

- Database: MySQL 8.0+
- Geography: Bihar only (districts + cities as proper tables)
- Auth: Laravel Sanctum (token-based)
- Roles: RBAC (roles + user_roles)
- Polymorphic: Reviews, Inquiries, and Activity Timelines use morphable pattern
- Soft Deletes: All main entities use SoftDeletes
- Timestamps: All tables have created_at + updated_at

---

## MIGRATION ORDER

Run migrations in this exact order (dependencies first):

```text
001_create_roles_table
002_create_users_table
003_create_user_roles_table
004_create_wallets_table
005_create_wallet_transactions_table
006_create_districts_table
007_create_cities_table
008_create_categories_table
009_create_listings_table
010_create_listing_galleries_table
011_create_requirements_table
012_create_requirement_images_table
013_create_bids_table
014_create_builders_table
015_create_builder_projects_table
016_create_builder_project_images_table
017_create_suppliers_table
018_create_supplier_products_table
019_create_supplier_product_images_table
020_create_workers_table
021_create_reviews_table
022_create_inquiries_table
023_create_blogs_table
024_create_blog_tags_table
025_create_payments_table
026_create_subscription_plans_table
027_create_user_subscriptions_table
028_create_contact_unlocks_table
029_create_seo_pages_table
030_create_saved_projects_table
031_create_saved_vendors_table
032_create_activity_timelines_table
033_create_notifications_table
034_create_vendor_metrics_table
035_create_advertisements_table
036_create_conversations_table
037_create_messages_table
038_create_labour_requirements_table
039_create_labour_applications_table
040_create_tenders_table
041_create_tender_quotes_table
042_add_fulltext_indexes
```

---

## TABLE DEFINITIONS

---

### TABLE: roles

```sql
id          BIGINT UNSIGNED PK AUTO_INCREMENT
name        VARCHAR(100) NOT NULL
slug        VARCHAR(100) UNIQUE NOT NULL
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### TABLE: users

```sql
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
name                VARCHAR(255) NOT NULL
email               VARCHAR(255) UNIQUE NOT NULL
phone               VARCHAR(20) NULL
password            VARCHAR(255) NOT NULL
avatar              VARCHAR(255) NULL
verification_level  ENUM('unverified','mobile_verified','identity_verified','business_verified','site_verified') DEFAULT 'unverified'
email_verified_at   TIMESTAMP NULL
is_active           BOOLEAN DEFAULT TRUE
deleted_at          TIMESTAMP NULL
created_at          TIMESTAMP
updated_at          TIMESTAMP

INDEX: is_active
INDEX: verification_level
```

### TABLE: user_roles

```sql
id          BIGINT UNSIGNED PK AUTO_INCREMENT
user_id     BIGINT UNSIGNED FK → users(id)
role_id     BIGINT UNSIGNED FK → roles(id)

UNIQUE: (user_id, role_id)
```

---

### TABLE: wallets
```sql
id          BIGINT UNSIGNED PK AUTO_INCREMENT
user_id     BIGINT UNSIGNED UNIQUE FK → users(id)
balance     DECIMAL(12,2) DEFAULT 0.00
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### TABLE: wallet_transactions
```sql
id              BIGINT UNSIGNED PK AUTO_INCREMENT
wallet_id       BIGINT UNSIGNED FK → wallets(id)
type            ENUM('credit','debit') NOT NULL
amount          DECIMAL(12,2) NOT NULL
description     VARCHAR(255) NOT NULL
reference_type  VARCHAR(255) NULL
reference_id    BIGINT UNSIGNED NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP

INDEX: wallet_id
INDEX: type
INDEX: (reference_type, reference_id)
```

---

### TABLE: notifications
```sql
id          BIGINT UNSIGNED PK AUTO_INCREMENT
user_id     BIGINT UNSIGNED FK → users(id)
type        VARCHAR(100) NOT NULL
title       VARCHAR(255) NOT NULL
message     TEXT NOT NULL
data        JSON NULL
is_read     BOOLEAN DEFAULT FALSE
created_at  TIMESTAMP
updated_at  TIMESTAMP

INDEX: user_id
INDEX: is_read
```

---

### TABLE: vendor_metrics
```sql
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
vendor_id           BIGINT UNSIGNED UNIQUE FK → users(id)
response_rate       DECIMAL(5,2) DEFAULT 0.00
win_rate            DECIMAL(5,2) DEFAULT 0.00
completed_projects  INT DEFAULT 0
score               DECIMAL(5,2) DEFAULT 0.00
updated_at          TIMESTAMP
```

---

### TABLE: advertisements
```sql
id          BIGINT UNSIGNED PK AUTO_INCREMENT
location    VARCHAR(100) NOT NULL
banner_url  VARCHAR(255) NOT NULL
link        VARCHAR(255) NULL
priority    INT DEFAULT 0
starts_at   TIMESTAMP NULL
ends_at     TIMESTAMP NULL
is_active   BOOLEAN DEFAULT TRUE
created_at  TIMESTAMP
updated_at  TIMESTAMP

INDEX: location
INDEX: is_active
```

---

### TABLE: districts

```sql
id          BIGINT UNSIGNED PK AUTO_INCREMENT
name        VARCHAR(100) NOT NULL
slug        VARCHAR(100) UNIQUE NOT NULL
state       VARCHAR(100) NOT NULL DEFAULT 'Bihar'
is_active   BOOLEAN DEFAULT TRUE
created_at  TIMESTAMP
updated_at  TIMESTAMP

INDEX: state
INDEX: is_active
```

---

### TABLE: cities

```sql
id           BIGINT UNSIGNED PK AUTO_INCREMENT
district_id  BIGINT UNSIGNED FK → districts(id)
name         VARCHAR(100) NOT NULL
slug         VARCHAR(100) NOT NULL
is_active    BOOLEAN DEFAULT TRUE
created_at   TIMESTAMP
updated_at   TIMESTAMP

UNIQUE: (district_id, slug)
INDEX: district_id
```

---

### TABLE: categories

```sql
id           BIGINT UNSIGNED PK AUTO_INCREMENT
name         VARCHAR(255) NOT NULL
slug         VARCHAR(255) UNIQUE NOT NULL
icon         VARCHAR(255) NULL
image        VARCHAR(255) NULL
description  TEXT NULL
parent_id    BIGINT UNSIGNED NULL FK → categories(id)
sort_order   INT DEFAULT 0
is_active    BOOLEAN DEFAULT TRUE
created_at   TIMESTAMP
updated_at   TIMESTAMP

INDEX: parent_id
INDEX: sort_order
```

---

### TABLE: listings

```sql
id                BIGINT UNSIGNED PK AUTO_INCREMENT
user_id           BIGINT UNSIGNED FK → users(id)
category_id       BIGINT UNSIGNED FK → categories(id)
city_id           BIGINT UNSIGNED NULL FK → cities(id)
district_id       BIGINT UNSIGNED NULL FK → districts(id)
title             VARCHAR(255) NOT NULL
slug              VARCHAR(255) UNIQUE NOT NULL
description       TEXT NOT NULL
tagline           VARCHAR(255) NULL
cover_image       VARCHAR(255) NULL
phone             VARCHAR(20) NULL
whatsapp          VARCHAR(20) NULL
email             VARCHAR(255) NULL
website           VARCHAR(255) NULL
city              VARCHAR(100) NOT NULL
district          VARCHAR(100) NOT NULL
state             VARCHAR(100) DEFAULT 'Bihar'
address           TEXT NULL
lat               DECIMAL(10,8) NULL
lng               DECIMAL(11,8) NULL
years_experience  INT NULL
team_size         INT NULL
avg_rating        DECIMAL(3,2) DEFAULT 0.00
review_count      INT DEFAULT 0
is_featured       BOOLEAN DEFAULT FALSE
is_premium        BOOLEAN DEFAULT FALSE
sponsored_until   TIMESTAMP NULL
sponsored_rank    INT DEFAULT 0
status            ENUM('pending','active','inactive','suspended') DEFAULT 'pending'
views_count       INT DEFAULT 0
deleted_at        TIMESTAMP NULL
created_at        TIMESTAMP
updated_at        TIMESTAMP

INDEX: user_id
INDEX: category_id
INDEX: city_id
INDEX: district_id
INDEX: status
INDEX: is_featured
FULLTEXT: title, description
```

---

### TABLE: listing_galleries

```sql
id          BIGINT UNSIGNED PK AUTO_INCREMENT
listing_id  BIGINT UNSIGNED FK → listings(id) ON DELETE CASCADE
image_url   VARCHAR(255) NOT NULL
caption     VARCHAR(255) NULL
sort_order  INT DEFAULT 0
created_at  TIMESTAMP
updated_at  TIMESTAMP

INDEX: listing_id
```

---

### TABLE: requirements

```sql
id            BIGINT UNSIGNED PK AUTO_INCREMENT
user_id       BIGINT UNSIGNED NULL FK → users(id)
category_id   BIGINT UNSIGNED FK → categories(id)
city_id       BIGINT UNSIGNED NULL FK → cities(id)
district_id   BIGINT UNSIGNED NULL FK → districts(id)
title         VARCHAR(255) NOT NULL
description   TEXT NOT NULL
project_type  VARCHAR(100) NOT NULL
budget_min    DECIMAL(12,2) NULL
budget_max    DECIMAL(12,2) NULL
city          VARCHAR(100) NOT NULL
district      VARCHAR(100) NOT NULL
name          VARCHAR(255) NOT NULL
phone         VARCHAR(20) NOT NULL
email         VARCHAR(255) NULL
status        ENUM('open','bidding','shortlisted','awarded','completed','expired') DEFAULT 'open'
awarded_vendor_id BIGINT UNSIGNED NULL FK → users(id)
awarded_bid_id BIGINT UNSIGNED NULL
award_value   DECIMAL(12,2) NULL
awarded_at    TIMESTAMP NULL
deleted_at    TIMESTAMP NULL
created_at    TIMESTAMP
updated_at    TIMESTAMP

INDEX: user_id
INDEX: category_id
INDEX: status
INDEX: city_id
INDEX: district_id
INDEX: awarded_vendor_id
```

---

### TABLE: requirement_images

```sql
id              BIGINT UNSIGNED PK AUTO_INCREMENT
requirement_id  BIGINT UNSIGNED FK → requirements(id) ON DELETE CASCADE
image_url       VARCHAR(255) NOT NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP

INDEX: requirement_id
```

---

### TABLE: bids

```sql
id                       BIGINT UNSIGNED PK AUTO_INCREMENT
requirement_id           BIGINT UNSIGNED FK → requirements(id)
professional_id          BIGINT UNSIGNED FK → users(id)
company_name             VARCHAR(255) NULL
contact_person           VARCHAR(255) NULL
category                 VARCHAR(255) NULL
experience_years         INT DEFAULT 0
estimated_cost           DECIMAL(12,2) NOT NULL
timeline_days            INT NOT NULL
warranty_months          INT DEFAULT 0
material_included        BOOLEAN DEFAULT FALSE
labour_included          BOOLEAN DEFAULT FALSE
design_included          BOOLEAN DEFAULT FALSE
supervision_included     BOOLEAN DEFAULT FALSE
portfolio_urls           JSON NULL
previous_projects_count  INT DEFAULT 0
proposal_message         TEXT NOT NULL
smart_bid_score          DECIMAL(5,2) DEFAULT 0.00
status                   ENUM('pending','shortlisted','accepted','rejected') DEFAULT 'pending'
deleted_at               TIMESTAMP NULL
created_at               TIMESTAMP
updated_at               TIMESTAMP

INDEX: requirement_id
INDEX: professional_id
INDEX: status
```

---

### TABLE: builders

```sql
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
user_id             BIGINT UNSIGNED UNIQUE FK → users(id)
city_id             BIGINT UNSIGNED NULL FK → cities(id)
district_id         BIGINT UNSIGNED NULL FK → districts(id)
company_name        VARCHAR(255) NOT NULL
slug                VARCHAR(255) UNIQUE NOT NULL
tagline             VARCHAR(255) NULL
logo                VARCHAR(255) NULL
cover_image         VARCHAR(255) NULL
phone               VARCHAR(20) NOT NULL
email               VARCHAR(255) NOT NULL
website             VARCHAR(255) NULL
city                VARCHAR(100) NOT NULL
district            VARCHAR(100) NOT NULL
rera_number         VARCHAR(100) NULL
established_year    YEAR NULL
total_projects      INT DEFAULT 0
delivered_projects  INT DEFAULT 0
avg_rating          DECIMAL(3,2) DEFAULT 0.00
review_count        INT DEFAULT 0
is_featured         BOOLEAN DEFAULT FALSE
sponsored_until   TIMESTAMP NULL
sponsored_rank    INT DEFAULT 0
status              ENUM('pending','active','inactive') DEFAULT 'pending'
deleted_at          TIMESTAMP NULL
created_at          TIMESTAMP
updated_at          TIMESTAMP

INDEX: city_id
INDEX: district_id
INDEX: is_featured
```

---

### TABLE: builder_projects

```sql
id                    BIGINT UNSIGNED PK AUTO_INCREMENT
builder_id            BIGINT UNSIGNED FK → builders(id) ON DELETE CASCADE
title                 VARCHAR(255) NOT NULL
slug                  VARCHAR(255) UNIQUE NOT NULL
description           TEXT NOT NULL
cover_image           VARCHAR(255) NULL
project_type          ENUM('residential','commercial','mixed') DEFAULT 'residential'
location              VARCHAR(255) NOT NULL
city                  VARCHAR(100) NOT NULL
bhk_options           VARCHAR(100) NULL
area_sqft_min         INT NULL
area_sqft_max         INT NULL
price_min             DECIMAL(15,2) NULL
price_max             DECIMAL(15,2) NULL
possession_date       DATE NULL
is_possession_ready   BOOLEAN DEFAULT FALSE
status                ENUM('upcoming','ongoing','completed','possession_ready') DEFAULT 'upcoming'
is_featured           BOOLEAN DEFAULT FALSE
deleted_at            TIMESTAMP NULL
created_at            TIMESTAMP
updated_at            TIMESTAMP

INDEX: builder_id
INDEX: status
INDEX: is_possession_ready
INDEX: is_featured
```

---

### TABLE: suppliers

```sql
id              BIGINT UNSIGNED PK AUTO_INCREMENT
user_id         BIGINT UNSIGNED UNIQUE FK → users(id)
city_id         BIGINT UNSIGNED NULL FK → cities(id)
district_id     BIGINT UNSIGNED NULL FK → districts(id)
company_name    VARCHAR(255) NOT NULL
slug            VARCHAR(255) UNIQUE NOT NULL
tagline         VARCHAR(255) NULL
logo            VARCHAR(255) NULL
cover_image     VARCHAR(255) NULL
phone           VARCHAR(20) NOT NULL
email           VARCHAR(255) NOT NULL
website         VARCHAR(255) NULL
city            VARCHAR(100) NOT NULL
district        VARCHAR(100) NOT NULL
gst_number      VARCHAR(20) NULL
business_type   VARCHAR(100) NULL
avg_rating      DECIMAL(3,2) DEFAULT 0.00
review_count    INT DEFAULT 0
is_featured     BOOLEAN DEFAULT FALSE
sponsored_until   TIMESTAMP NULL
sponsored_rank    INT DEFAULT 0
status          ENUM('pending','active','inactive') DEFAULT 'pending'
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP

INDEX: city_id
INDEX: district_id
INDEX: is_featured
```

---

### TABLE: supplier_products

```sql
id           BIGINT UNSIGNED PK AUTO_INCREMENT
supplier_id  BIGINT UNSIGNED FK → suppliers(id) ON DELETE CASCADE
name         VARCHAR(255) NOT NULL
slug         VARCHAR(255) UNIQUE NOT NULL
description  TEXT NULL
cover_image  VARCHAR(255) NULL
category     VARCHAR(100) NOT NULL
unit         VARCHAR(50) NULL
price_min    DECIMAL(12,2) NULL
price_max    DECIMAL(12,2) NULL
is_active    BOOLEAN DEFAULT TRUE
deleted_at   TIMESTAMP NULL
created_at   TIMESTAMP
updated_at   TIMESTAMP

INDEX: supplier_id
INDEX: category
INDEX: is_active
```

---

### TABLE: workers

```sql
id                BIGINT UNSIGNED PK AUTO_INCREMENT
user_id           BIGINT UNSIGNED UNIQUE FK → users(id)
city_id           BIGINT UNSIGNED NULL FK → cities(id)
district_id       BIGINT UNSIGNED NULL FK → districts(id)
name              VARCHAR(255) NOT NULL
slug              VARCHAR(255) UNIQUE NOT NULL
avatar            VARCHAR(255) NULL
phone             VARCHAR(20) NOT NULL
city              VARCHAR(100) NOT NULL
district          VARCHAR(100) NOT NULL
skill             VARCHAR(100) NOT NULL
skills_tags       JSON NULL
experience_years  INT DEFAULT 0
daily_rate        DECIMAL(8,2) NULL
is_available      BOOLEAN DEFAULT TRUE
is_featured       BOOLEAN DEFAULT FALSE
avg_rating        DECIMAL(3,2) DEFAULT 0.00
review_count      INT DEFAULT 0
bio               TEXT NULL
status            ENUM('pending','active','inactive') DEFAULT 'pending'
deleted_at        TIMESTAMP NULL
created_at        TIMESTAMP
updated_at        TIMESTAMP

INDEX: city_id
INDEX: district_id
INDEX: skill
INDEX: is_available
INDEX: is_featured
FULLTEXT: name, skill, bio
```

---

### TABLE: reviews

```sql
id                BIGINT UNSIGNED PK AUTO_INCREMENT
user_id           BIGINT UNSIGNED FK → users(id)
reviewable_type   VARCHAR(255) NOT NULL
reviewable_id     BIGINT UNSIGNED NOT NULL
rating            TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5)
title             VARCHAR(255) NULL
body              TEXT NOT NULL
is_approved       BOOLEAN DEFAULT FALSE
deleted_at        TIMESTAMP NULL
created_at        TIMESTAMP
updated_at        TIMESTAMP

INDEX: user_id
INDEX: (reviewable_type, reviewable_id)
INDEX: is_approved
```

---

### TABLE: inquiries

```sql
id                BIGINT UNSIGNED PK AUTO_INCREMENT
user_id           BIGINT UNSIGNED NULL FK → users(id)
inquirable_type   VARCHAR(255) NOT NULL
inquirable_id     BIGINT UNSIGNED NOT NULL
name              VARCHAR(255) NOT NULL
phone             VARCHAR(20) NOT NULL
email             VARCHAR(255) NULL
message           TEXT NOT NULL
is_read           BOOLEAN DEFAULT FALSE
status            ENUM('new','contacted','closed') DEFAULT 'new'
created_at        TIMESTAMP
updated_at        TIMESTAMP

INDEX: user_id
INDEX: (inquirable_type, inquirable_id)
INDEX: status
INDEX: is_read
```

---

### TABLE: blogs

```sql
id            BIGINT UNSIGNED PK AUTO_INCREMENT
author_id     BIGINT UNSIGNED FK → users(id)
title         VARCHAR(255) NOT NULL
slug          VARCHAR(255) UNIQUE NOT NULL
excerpt       TEXT NOT NULL
content       LONGTEXT NOT NULL
cover_image   VARCHAR(255) NULL
category      VARCHAR(100) NOT NULL
status        ENUM('draft','published') DEFAULT 'draft'
published_at  TIMESTAMP NULL
views_count   INT DEFAULT 0
deleted_at    TIMESTAMP NULL
created_at    TIMESTAMP
updated_at    TIMESTAMP

INDEX: author_id
INDEX: status
INDEX: published_at
INDEX: category
FULLTEXT: title, excerpt, content
```

---

### TABLE: blog_tags

```sql
id       BIGINT UNSIGNED PK AUTO_INCREMENT
blog_id  BIGINT UNSIGNED FK → blogs(id) ON DELETE CASCADE
tag      VARCHAR(100) NOT NULL

INDEX: blog_id
INDEX: tag
```

---

### TABLE: subscription_plans

```sql
id                       BIGINT UNSIGNED PK AUTO_INCREMENT
name                     VARCHAR(255) NOT NULL
slug                     VARCHAR(255) UNIQUE NOT NULL
price_monthly            DECIMAL(10,2) NOT NULL
price_yearly             DECIMAL(10,2) NOT NULL
features                 JSON NOT NULL
max_listings             INT NOT NULL DEFAULT 1
max_gallery_images       INT NOT NULL DEFAULT 10
lead_unlocks_per_month   INT NOT NULL DEFAULT 0
can_see_all_leads        BOOLEAN DEFAULT FALSE
is_featured_listing      BOOLEAN DEFAULT FALSE
is_active                BOOLEAN DEFAULT TRUE
created_at               TIMESTAMP
updated_at               TIMESTAMP
```

MVP Plans:
- Basic (free or ₹0)
- Professional (₹999/mo)
- Premium (₹2499/mo)

---

### TABLE: payments

```sql
id                   BIGINT UNSIGNED PK AUTO_INCREMENT
user_id              BIGINT UNSIGNED FK → users(id)
razorpay_order_id    VARCHAR(255) UNIQUE NOT NULL
razorpay_payment_id  VARCHAR(255) NULL
razorpay_signature   VARCHAR(255) NULL
amount               DECIMAL(10,2) NOT NULL
currency             VARCHAR(10) DEFAULT 'INR'
purpose              ENUM('wallet_recharge','subscription','premium_listing','featured_listing')
status               ENUM('pending','success','failed','refunded') DEFAULT 'pending'
meta                 JSON NULL
created_at           TIMESTAMP
updated_at           TIMESTAMP

INDEX: user_id
INDEX: status
INDEX: purpose
```

---

### TABLE: user_subscriptions

```sql
id                    BIGINT UNSIGNED PK AUTO_INCREMENT
user_id               BIGINT UNSIGNED FK → users(id)
subscription_plan_id  BIGINT UNSIGNED FK → subscription_plans(id)
payment_id            BIGINT UNSIGNED NULL FK → payments(id)
billing_cycle         ENUM('monthly','yearly') DEFAULT 'monthly'
status                ENUM('active','expired','cancelled') DEFAULT 'active'
starts_at             TIMESTAMP NOT NULL
expires_at            TIMESTAMP NOT NULL
created_at            TIMESTAMP
updated_at            TIMESTAMP

INDEX: user_id
INDEX: status
INDEX: expires_at
```

---

### TABLE: contact_unlocks

```sql
id              BIGINT UNSIGNED PK AUTO_INCREMENT
user_id         BIGINT UNSIGNED FK → users(id)
requirement_id  BIGINT UNSIGNED FK → requirements(id)
wallet_transaction_id BIGINT UNSIGNED NULL FK → wallet_transactions(id)
created_at      TIMESTAMP
updated_at      TIMESTAMP

UNIQUE: (user_id, requirement_id)
INDEX: user_id
INDEX: requirement_id
```

---

### TABLE: seo_pages

```sql
id                BIGINT UNSIGNED PK AUTO_INCREMENT
title             VARCHAR(255) NOT NULL
slug              VARCHAR(255) UNIQUE NOT NULL
meta_title        VARCHAR(255) NULL
meta_description  VARCHAR(500) NULL
schema_json       JSON NULL
is_active         BOOLEAN DEFAULT TRUE
created_at        TIMESTAMP
updated_at        TIMESTAMP

INDEX: slug
INDEX: is_active
```

---

### TABLE: saved_projects

```sql
id              BIGINT UNSIGNED PK AUTO_INCREMENT
user_id         BIGINT UNSIGNED FK → users(id)
requirement_id  BIGINT UNSIGNED FK → requirements(id)
created_at      TIMESTAMP
updated_at      TIMESTAMP

UNIQUE: (user_id, requirement_id)
INDEX: user_id
```

---

### TABLE: saved_vendors

```sql
id              BIGINT UNSIGNED PK AUTO_INCREMENT
user_id         BIGINT UNSIGNED FK → users(id)
vendor_id       BIGINT UNSIGNED FK → users(id)
created_at      TIMESTAMP
updated_at      TIMESTAMP

UNIQUE: (user_id, vendor_id)
INDEX: user_id
```

---

### TABLE: activity_timelines

```sql
id                BIGINT UNSIGNED PK AUTO_INCREMENT
entity_type       VARCHAR(255) NOT NULL
entity_id         BIGINT UNSIGNED NOT NULL
user_id           BIGINT UNSIGNED NULL FK → users(id)
action            VARCHAR(255) NOT NULL
description       TEXT NOT NULL
meta_data         JSON NULL
created_at        TIMESTAMP
updated_at        TIMESTAMP

INDEX: (entity_type, entity_id)
INDEX: user_id
```

---

### TABLE: conversations
```sql
id              BIGINT UNSIGNED PK AUTO_INCREMENT
user_one_id     BIGINT UNSIGNED FK → users(id)
user_two_id     BIGINT UNSIGNED FK → users(id)
requirement_id  BIGINT UNSIGNED NULL FK → requirements(id)
created_at      TIMESTAMP
updated_at      TIMESTAMP

INDEX: user_one_id
INDEX: user_two_id
```

### TABLE: messages
```sql
id               BIGINT UNSIGNED PK AUTO_INCREMENT
conversation_id  BIGINT UNSIGNED FK → conversations(id)
sender_id        BIGINT UNSIGNED FK → users(id)
body             TEXT NOT NULL
is_read          BOOLEAN DEFAULT FALSE
created_at       TIMESTAMP
updated_at       TIMESTAMP

INDEX: conversation_id
```

---

### TABLE: labour_requirements
```sql
id               BIGINT UNSIGNED PK AUTO_INCREMENT
user_id          BIGINT UNSIGNED FK → users(id)
city_id          BIGINT UNSIGNED FK → cities(id)
title            VARCHAR(255) NOT NULL
description      TEXT NOT NULL
skills_required  JSON NOT NULL
workers_needed   INT NOT NULL
daily_wage       DECIMAL(8,2) NULL
duration_days    INT NULL
status           ENUM('open','fulfilled','cancelled') DEFAULT 'open'
created_at       TIMESTAMP
updated_at       TIMESTAMP

INDEX: user_id
INDEX: city_id
INDEX: status
```

### TABLE: labour_applications
```sql
id                    BIGINT UNSIGNED PK AUTO_INCREMENT
labour_requirement_id BIGINT UNSIGNED FK → labour_requirements(id)
worker_id             BIGINT UNSIGNED FK → users(id)
status                ENUM('pending','accepted','rejected') DEFAULT 'pending'
created_at            TIMESTAMP
updated_at            TIMESTAMP

INDEX: labour_requirement_id
INDEX: worker_id
INDEX: status
```

---

### TABLE: tenders
```sql
id               BIGINT UNSIGNED PK AUTO_INCREMENT
user_id          BIGINT UNSIGNED FK → users(id)
category_id      BIGINT UNSIGNED FK → categories(id)
city_id          BIGINT UNSIGNED FK → cities(id)
title            VARCHAR(255) NOT NULL
description      TEXT NOT NULL
budget_estimate  DECIMAL(15,2) NULL
deadline_date    DATE NOT NULL
document_url     VARCHAR(255) NULL
status           ENUM('open','evaluating','awarded','closed') DEFAULT 'open'
created_at       TIMESTAMP
updated_at       TIMESTAMP

INDEX: user_id
INDEX: category_id
INDEX: city_id
INDEX: status
```

### TABLE: tender_quotes
```sql
id               BIGINT UNSIGNED PK AUTO_INCREMENT
tender_id        BIGINT UNSIGNED FK → tenders(id)
supplier_id      BIGINT UNSIGNED FK → users(id)
amount           DECIMAL(15,2) NOT NULL
proposal         TEXT NOT NULL
delivery_days    INT NOT NULL
status           ENUM('pending','shortlisted','awarded','rejected') DEFAULT 'pending'
created_at       TIMESTAMP
updated_at       TIMESTAMP

INDEX: tender_id
INDEX: supplier_id
INDEX: status
```

---

END OF DOCUMENT
