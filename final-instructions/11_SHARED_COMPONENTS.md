# TRUEDIAL PLATFORM
# SHARED COMPONENTS
# Version 1.0

---

# PURPOSE

This document defines every reusable component, hook, service, utility, provider, and pattern allowed across the TRUEDIAL Platform.

The purpose is simple:

> Build Once.
> Reuse Everywhere.

No duplicate implementations should ever exist.

This document is mandatory for every AI coding agent and developer.

---

# PHILOSOPHY

Every time you think

"I'll create another component..."

STOP.

Ask yourself

Does this already exist?

Can it be extended?

Can it become configurable?

Can multiple products use it?

If YES

Reuse.

If NO

Create it properly.

---

# SHARED ARCHITECTURE

Shared Resources

↓

Components

↓

Hooks

↓

Providers

↓

Utilities

↓

Services

↓

Types

↓

Constants

↓

Icons

↓

Layouts

↓

Animations

↓

Design Tokens

Everything should be reusable.

---

# COMPONENT HIERARCHY

Level 1

Primitive Components

Button

Input

Badge

Avatar

Spinner

Checkbox

Radio

Textarea

Label

Divider

Card

Tooltip

Modal

Drawer

Popover

Tabs

Accordion

Switch

Skeleton

Progress

Alert

Toast

Every other component is built using these.

---

# LEVEL 2

Layout Components

Container

Section

Grid

Stack

PageHeader

Sidebar

Topbar

Footer

Breadcrumb

Navigation

EmptyState

LoadingScreen

ErrorScreen

No page should recreate these.

---

# LEVEL 3

Business Components

BusinessCard

VendorCard

OfferCard

ProductCard

ServiceCard

ReviewCard

CampaignCard

CourseCard

JobCard

NewsCard

PodcastCard

ConsultantCard

These belong inside feature modules.

---

# LEVEL 4

Dashboard Components

AnalyticsCard

RevenueCard

StatisticCard

ChartCard

RecentActivity

QuickActions

NotificationPanel

TaskList

Dashboard widgets should be configurable.

---

# BUTTON COMPONENT

Must support

Primary

Secondary

Outline

Ghost

Danger

Loading

Disabled

Icon Left

Icon Right

Full Width

Small

Medium

Large

Never create another button.

---

# INPUT COMPONENT

Supports

Text

Email

Password

Number

Phone

OTP

Search

Currency

Textarea

Validation

Loading

Helper Text

Prefix

Suffix

Error

Success

Disabled

Readonly

Never create another input.

---

# CARD COMPONENT

Supports

Title

Subtitle

Image

Actions

Footer

Loading

Hover

Clickable

Responsive

Every card extends this.

---

# MODAL COMPONENT

Supports

Header

Body

Footer

Loading

Fullscreen

Confirmation

Scrollable

Accessible

Escape Key

Backdrop Click

Never build custom modals.

---

# TABLE COMPONENT

Supports

Sorting

Pagination

Filtering

Search

Selection

Export

Loading

Responsive

Virtualization

Never build another table implementation.

---

# FORM COMPONENTS

Every form uses

React Hook Form

+

Zod

Supported Components

TextInput

Select

MultiSelect

Checkbox

Radio

Switch

Date Picker

Time Picker

File Upload

Image Upload

OTP Input

Rich Text

Color Picker

Currency Input

---

# MEDIA COMPONENTS

Shared

Image

Gallery

Carousel

Video Player

PDF Viewer

Audio Player

Lightbox

Preview Dialog

---

# FEEDBACK COMPONENTS

Toast

Alert

Banner

Snackbar

Skeleton

Empty State

Success State

Error State

Offline State

Permission Denied

404

500

Loading Overlay

Never duplicate feedback UI.

---

# SEARCH COMPONENTS

Global Search

Search Bar

Search Filters

Search Suggestions

Search Results

Search Chips

Advanced Filters

Everything should reuse the same search engine.

---

# MAP COMPONENTS

Google Map

Business Marker

Current Location

Radius Search

Cluster

Directions

Route Preview

Location Picker

Maps should be centralized.

---

# SHARED HOOKS

Authentication

useAuth()

Theme

useTheme()

Businesses

useBusinesses()

Offers

useOffers()

Reviews

useReviews()

Campaigns

useCampaigns()

Notifications

useNotifications()

Permissions

usePermissions()

Tenant

useTenant()

Analytics

useAnalytics()

Search

useSearch()

Never create duplicate hooks.

---

# SHARED SERVICES

AuthService

BusinessService

OfferService

ReviewService

CampaignService

AnalyticsService

WalletService

PaymentService

NotificationService

SearchService

LocationService

StorageService

AIService

Every API request belongs here.

---

# SHARED PROVIDERS

ThemeProvider

AuthProvider

TenantProvider

NotificationProvider

QueryProvider

ModalProvider

PermissionProvider

AnalyticsProvider

Only one provider per concern.

---

# SHARED UTILITIES

formatCurrency()

formatDate()

formatPhone()

generateSlug()

truncateText()

capitalize()

downloadFile()

copyToClipboard()

debounce()

throttle()

sleep()

retry()

Never rewrite utilities.

---

# SHARED CONSTANTS

API Routes

Role Names

Permission Names

Feature Flags

Route Names

Theme Colors

Status Values

Country Codes

Currency Codes

Error Codes

No magic strings.

---

# SHARED TYPES

Business

Offer

Review

Campaign

Vendor

Customer

Subscription

Wallet

Payment

Analytics

Course

Job

Notification

User

Tenant

Every API response should map to these types.

---

# SHARED ENUMS

BusinessStatus

OfferStatus

CampaignStatus

SubscriptionStatus

PaymentStatus

ReviewStatus

NotificationType

UserRole

Never hardcode strings.

---

# SHARED ICONS

One icon library.

Lucide React

Never mix

Heroicons

FontAwesome

Material Icons

Bootstrap Icons

Without architectural approval.

---

# SHARED ANIMATIONS

Fade

Slide

Scale

Collapse

Expand

Loading Pulse

Skeleton

Page Transition

One animation system.

---

# SHARED LAYOUTS

Public Layout

Dashboard Layout

Admin Layout

Vendor Layout

Customer Layout

Auth Layout

Settings Layout

No page creates its own layout.

---

# SHARED VALIDATION

Every validation schema belongs in

schemas/

Reuse across

Forms

APIs

Mobile

Admin

Never duplicate validation rules.

---

# SHARED CONFIGURATION

API URL

Timeout

Retry Count

Theme

Feature Flags

Supported Languages

Supported Currencies

Never hardcode configuration.

---

# SHARED ERROR HANDLING

Centralized

API Errors

Validation Errors

Network Errors

Permission Errors

Authentication Errors

Unknown Errors

Never create custom error systems.

---

# AI REUSE CHECKLIST

Before creating ANY component

Search existing components.

Before creating ANY hook

Search hooks.

Before creating ANY service

Search services.

Before creating ANY utility

Search utilities.

Before creating ANY provider

Search providers.

If one exists

Reuse.

If one almost exists

Extend.

Never duplicate.

---

# DEPRECATION POLICY

Components should never be deleted immediately.

Mark as deprecated.

Replace usages.

Remove only after migration.

---

# DEFINITION OF DONE

A shared component is complete when

✓ Typed

✓ Responsive

✓ Accessible

✓ Documented

✓ Tested

✓ Theme Compatible

✓ Dark Mode Ready

✓ Mobile Ready

✓ Reusable

✓ No Duplicate Exists

---

# NEVER DO THIS

❌ Duplicate Buttons

❌ Duplicate Inputs

❌ Duplicate Services

❌ Duplicate Hooks

❌ Duplicate Utilities

❌ Multiple Modal Systems

❌ Multiple Toast Systems

❌ Multiple Table Components

❌ Hardcoded API Calls

❌ Magic Strings

---

# FINAL RULE

Every reusable piece of code should exist exactly once.

If the same logic, UI, hook, utility, or service exists in more than one place, the architecture has failed.

The platform grows by composing shared building blocks—not by copying code.