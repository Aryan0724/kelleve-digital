# Installation & Verification Checklist

Follow these steps exactly to transition the AI-generated code into a functional runtime environment.

## Phase 1: Environment Setup
- [ ] Install PHP 8.3+, Composer, and MySQL (Laragon/XAMPP).
- [ ] Create a new database named `findmyinterior`.
- [ ] Navigate to the project root (`d:\find my interior`).
- [ ] Rename the current folder: `ren findmyinterior-backend findmyinterior-backend-generated`
- [ ] Generate fresh Laravel: `composer create-project laravel/laravel findmyinterior-backend`
- [ ] Change directory: `cd findmyinterior-backend`
- [ ] Copy `.env.example` to `.env` and fill using `ENVIRONMENT_VARIABLES.md`.

## Phase 2: Dependency Installation
- [ ] Require Razorpay: `composer require razorpay/razorpay`
- [ ] Require AWS S3: `composer require league/flysystem-aws-s3-v3 "^3.0"`
- [ ] (Optional) Sanctum should be installed by default in Laravel 11/12, but verify: `php artisan install:api`

## Phase 3: Code Weaving
Copy the AI-generated code from the `findmyinterior-backend-generated` folder into the fresh `findmyinterior-backend` folder:
- [ ] Copy `app/Models/*`
- [ ] Copy `app/Http/Controllers/*`
- [ ] Copy `app/Http/Resources/*`
- [ ] Copy `app/Http/Middleware/*`
- [ ] Copy `app/Notifications/*`
- [ ] Copy `database/migrations/*` (delete default migrations first)
- [ ] Copy `database/seeders/*`
- [ ] Merge `routes/api.php`
- [ ] Merge `bootstrap/app.php` (Careful! Only append the alias/middleware configurations, do not overwrite the base file entirely).

## Phase 4: Runtime Verification
- [ ] Verify classes: `composer dump-autoload`
- [ ] Run migrations: `php artisan migrate:fresh`
- [ ] Run seeders: `php artisan db:seed`
- [ ] List routes: `php artisan route:list`
- [ ] Start server: `php artisan serve`
