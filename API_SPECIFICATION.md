# FINDMYINTERIOR.COM (TRUEDIAL V1.0) API CONTRACT

Version: 1.0 (TrueDial Integrated)
Backend: Laravel 12
Authentication: Laravel Sanctum
Response Format: JSON
Base URL: `/api/v1`

---

## 1. STANDARD FORMATS

### 1.1 Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### 1.2 Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

### 1.3 Pagination Format (Laravel Standard)
```json
{
  "success": true,
  "message": null,
  "data": {
    "data": [
       // items here
    ],
    "current_page": 1,
    "first_page_url": "...",
    "from": 1,
    "last_page": 5,
    "last_page_url": "...",
    "links": [],
    "next_page_url": "...",
    "path": "...",
    "per_page": 15,
    "prev_page_url": null,
    "to": 15,
    "total": 75
  }
}
```

---

## 2. AUTHENTICATION ENDPOINTS

### `POST /auth/register`
- **Body**: `name`, `email`, `phone`, `password`, `password_confirmation`
- **Returns**: User object and Sanctum `token` inside `data` object.

### `POST /auth/login`
- **Body**: `email`, `password`
- **Returns**: User object and Sanctum `token` inside `data` object.

### `POST /auth/logout`
- **Requires**: Bearer Token
- **Returns**: Success message.

### `GET /auth/me`
- **Requires**: Bearer Token
- **Returns**: Current authenticated User object.

---

## 3. PUBLIC ENDPOINTS (TrueDial)

### `GET /truedial/public/categories`
- **Returns**: List of all categories (Interior Designers, Architects, etc.)

### `GET /truedial/public/search`
- **Query Params**: `q` (keyword), `verified` (boolean), `premium` (boolean), `min_rating` (float), `page`
- **Returns**: Paginated list of Business Listings matching the query.

### `GET /truedial/public/search/autocomplete`
- **Query Params**: `q` (keyword)
- **Returns**: Top 5 autocomplete suggestions (Businesses or Categories).

### `GET /truedial/public/businesses/{slug}`
- **Returns**: Full `BusinessProfileDTO` (basicInfo, gallery, services, products, reviews, offers).

### `GET /truedial/public/businesses/{slug}/reviews`
- **Query Params**: `page`
- **Returns**: Paginated reviews for a specific business.

### `GET /truedial/public/offers`
- **Query Params**: `page`
- **Returns**: Paginated list of active public offers from all businesses.

### `GET /truedial/public/businesses/{slug}/offers`
- **Returns**: Active offers for a specific business.

---

## 4. VENDOR ENDPOINTS (TrueDial)

*All endpoints require Bearer Token Authentication.*

### `GET /truedial/vendor/my-business`
- **Returns**: The authenticated vendor's business listing (if exists).

### `POST /truedial/vendor/businesses`
- **Body**: `title`, `description`, `category_id`, `city`, `phone`, etc.
- **Returns**: Created Business Listing.

### `PUT /truedial/vendor/businesses/{id}`
- **Body**: Updatable listing fields.
- **Returns**: Updated Business Listing.

### `PUT /truedial/vendor/businesses/me/products`
- **Body**: Array of product objects.
- **Returns**: Success message.

### `PUT /truedial/vendor/businesses/me/services`
- **Body**: Array of service objects.
- **Returns**: Success message.

### `POST /truedial/vendor/media`
- **Body**: `file` (multipart/form-data), `model_type`, `model_id`, `collection`
- **Returns**: Uploaded Media object with URL.

### `DELETE /truedial/vendor/media/{id}`
- **Returns**: Success message.

### `GET /truedial/vendor/reviews`
- **Query Params**: `page`
- **Returns**: Paginated reviews received by the vendor's business.

### `POST /truedial/vendor/reviews/{id}/reply`
- **Body**: `body`
- **Returns**: Created Review Reply.

### `POST /truedial/vendor/reviews/{id}/report`
- **Body**: `reason`, `notes`
- **Returns**: Created Review Report.

### `GET /truedial/vendor/offers`
- **Query Params**: `page`
- **Returns**: Paginated list of the vendor's offers.

### `POST /truedial/vendor/offers`
- **Body**: `title`, `description`, `discount_type`, `discount_value`, `valid_until`, etc.
- **Returns**: Created Offer.

### `PUT /truedial/vendor/offers/{id}`
- **Body**: Updatable offer fields (e.g. `status` to archive/pause).
- **Returns**: Updated Offer.

---

## 5. USER ENDPOINTS (Customers)

*All endpoints require Bearer Token Authentication.*

### `POST /truedial/user/businesses/{slug}/reviews`
- **Body**: `rating` (1-5), `title`, `body`
- **Returns**: Created Review.

### `PUT /truedial/user/reviews/{id}/helpful`
- **Returns**: Toggles helpful vote and returns new vote count.

---

## 6. ADMIN ENDPOINTS

*All endpoints require Admin Role and Bearer Token.*

### `GET /admin/dashboard`
- **Returns**: System-wide metrics (Total Users, Listings, Active Offers, etc.)

*(Other standard admin CRUD endpoints remain as per existing standard)*
