# FINDMYINTERIOR.COM

# PROJECT_ARCHITECTURE.md

Version: 1.0

Author: Integral Labs

Project Type: Home Improvement + Interior + Construction Marketplace

Target Region: Bihar

---

# PROJECT VISION

FindMyInterior is Bihar's Home Improvement Marketplace.

The platform connects:

* Home Owners
* Interior Designers
* Architects
* Builders
* Contractors
* Skilled Workers
* Suppliers
* Manufacturers

The platform combines concepts inspired by:

* Houzz
* Urban Company
* IndiaMART
* Buildertrend
* Architizer
* Urban Ladder

---

# MVP GOAL

Launch a production-ready marketplace within 15-20 days.

Focus:

* Directory
* Listings
* Lead Generation
* Admin Management
* Payments

Avoid:

* Complex CRM
* Mobile App
* Advanced Tender Engine
* WhatsApp Automation

---

# TECH STACK

Frontend:

* Next.js 15
* TypeScript
* TailwindCSS
* Shadcn UI

Backend:

* Laravel 12

Database:

* MySQL

Storage:

* AWS S3

Payments:

* Razorpay

Hosting:

* VPS / AWS / DigitalOcean

SEO:

* SSR

Authentication:

* Laravel Auth

Version Control:

* Git + GitHub

---

# REPOSITORIES USED

## 1. Directory Foundation

Purpose:
Professional Listings

Repository:
https://github.com/AbdulBasit313/nextjs-directory-site-starter

Use For:

* Directory Structure
* Listing Pages
* Search UI
* Categories

---

## 2. Admin Dashboard

Purpose:
Admin Panel

Repository:
https://github.com/TailAdmin/free-nextjs-admin-dashboard

Use For:

* Dashboard
* Tables
* User Management
* Analytics UI

---

## 3. Authentication

Purpose:
Login System

Repository:
https://github.com/laravel/breeze-next

Use For:

* Registration
* Login
* Password Reset
* User Sessions

---

## 4. Design Components

Purpose:
Reusable UI Components

Repository:
https://github.com/shadcn-ui/ui

Use For:

* Dialogs
* Cards
* Forms
* Tables
* Modals

---

# USER TYPES

## Guest

Can:

* Browse Listings
* Search Professionals
* View Profiles
* Read Blogs

Cannot:

* Post Requirements
* Purchase Plans

---

## Customer

Can:

* Register
* Post Requirements
* Save Listings
* Contact Providers

---

## Business User

Can:

* Create Listing
* Manage Listing
* Upload Portfolio
* Receive Leads

---

## Admin

Can:

* Manage Users
* Manage Leads
* Manage Listings
* Manage Payments
* Manage Blogs

---

# DATABASE STRUCTURE

## USERS

id

name

email

password

role

phone

city

created_at

---

## LISTINGS

id

user_id

category_id

title

description

city

district

phone

email

website

is_featured

status

---

## CATEGORIES

id

name

slug

icon

---

## REQUIREMENTS

id

user_id

title

description

budget

city

images

status

---

## BUILDERS

id

name

company

city

description

contact

---

## SUPPLIERS

id

name

company

products

city

contact

---

## WORKERS

id

name

skill

experience

city

contact

---

## BLOGS

id

title

slug

content

image

status

---

## PAYMENTS

id

user_id

amount

payment_id

status

type

---

# MODULES

## MODULE 1

HOME PAGE

Sections:

Hero

Search

Categories

Featured Listings

Builders

Workers

Suppliers

Blogs

Footer

---

## MODULE 2

DIRECTORY

Categories:

Interior Designers

Architects

Builders

Contractors

Suppliers

Workers

---

## MODULE 3

SEARCH

Search By:

City

District

Category

Keyword

---

## MODULE 4

LISTING DETAILS

Contains:

Gallery

Description

Contact

Services

Reviews

---

## MODULE 5

POST REQUIREMENT

User submits:

Project Type

Budget

Location

Description

Images

---

## MODULE 6

BUILDER HUB

Builder Profiles

Builder Projects

Project Gallery

---

## MODULE 7

SUPPLIER MARKETPLACE

Supplier Profiles

Products

Inquiry Form

---

## MODULE 8

WORKFORCE MARKETPLACE

Worker Profiles

Skills

Experience

Location

---

## MODULE 9

BLOG

SEO Articles

Category Pages

District Pages

---

## MODULE 10

ADMIN DASHBOARD

Manage:

Users

Listings

Requirements

Builders

Suppliers

Workers

Blogs

Payments

---

# PAYMENT SYSTEM

Provider:
Razorpay

V1 Features:

Premium Listing

Featured Listing

Subscription Purchase

Lead Unlock

---

# SEO STRUCTURE

District Pages

Example:

/patna

/muzaffarpur

/gaya

---

Service Pages

/interior-designer-patna

/architect-patna

/contractor-patna

---

# FILE STRUCTURE

frontend/

app/

components/

lib/

hooks/

services/

types/

public/

---

backend/

app/

controllers/

models/

middleware/

routes/

database/

storage/

---

# DEPLOYMENT

Frontend:
Vercel

Backend:
Hostinger VPS / DigitalOcean

Database:
MySQL

Storage:
AWS S3

Domain:
findmyinterior.com

SSL:
Cloudflare

---

# DEVELOPMENT PHASES

Phase 1

Project Setup

Authentication

Database

Admin Dashboard

---

Phase 2

Directory

Listings

Search

Profiles

---

Phase 3

Requirements

Builders

Suppliers

Workers

---

Phase 4

Payments

SEO

Testing

Deployment

---

# SUCCESS CRITERIA

Users can:

* Register
* Search Professionals
* View Profiles
* Post Requirements
* Purchase Premium Listings

Admin can:

* Manage Platform
* Manage Leads
* Manage Listings

Platform is:

* Mobile Responsive
* SEO Friendly
* Production Ready

---

END OF DOCUMENT
