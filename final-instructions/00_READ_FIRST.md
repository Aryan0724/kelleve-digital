# TRUEDIAL PLATFORM
# READ THIS FIRST
# Version 1.0

---

# STOP.

Before writing a single line of code, read this entire document.

Failure to follow these instructions WILL result in architectural drift, duplicated implementations, inconsistent APIs, broken user experiences, and an unmaintainable platform.

This repository is NOT a normal website.

It is NOT a normal mobile app.

It is NOT a collection of random projects.

It is a modular multi-tenant business platform.

Everything in this repository must follow these rules.

---

# PROJECT PHILOSOPHY

TRUEDIAL is NOT a Business Listing Website.

Business Listing is ONLY ONE MODULE.

TRUEDIAL is a Business Growth Platform.

Its purpose is helping businesses grow using technology.

Every feature must contribute toward one or more of the following:

• Business Discovery

• Customer Acquisition

• Customer Retention

• Marketing

• Revenue Growth

• Analytics

• Automation

• Business Consulting

• Digital Presence

• AI

Never build features that don't contribute to these goals.

---

# THE GOLDEN RULE

THERE MUST BE ONLY ONE SOURCE OF TRUTH.

Backend.

Everything else consumes the backend.

Website does NOT contain business logic.

Mobile App does NOT contain business logic.

Admin Panel does NOT contain business logic.

Only Laravel.

---

# ARCHITECTURE

There are NOT multiple projects.

There is ONE PLATFORM.

Current Clients:

• FindMyInterior Website

• TrueDial Website

• TrueDial Mobile

Future Clients:

• Additional Business Platforms

• Additional Mobile Apps

• Franchise Platforms

• SaaS Clients

Every client shares the same backend architecture.

---

# THINK IN MODULES

Never think in pages.

Never think in screens.

Never think in folders.

Think in Modules.

Example:

Business Listing

↓

Backend

↓

Website

↓

Mobile

↓

Admin

↓

QA

↓

Done

NOT

Website first

then mobile

then backend.

---

# DEVELOPMENT ORDER

Every feature must be completed vertically.

Example

Authentication

Backend

↓

Website

↓

Mobile

↓

Testing

↓

Documentation

↓

Done

Never leave a feature half complete.

---

# SINGLE IMPLEMENTATION RULE

Never build the same logic twice.

Never duplicate:

Authentication

API Calls

Validation

Business Rules

Permissions

Calculations

Pricing

Analytics

Offer Logic

Review Logic

Subscription Logic

Everything belongs in ONE implementation.

---

# API FIRST

Every feature begins with API.

Never create frontend-only features.

Every screen must consume APIs.

Every API must have a frontend consumer.

No dead endpoints.

No fake endpoints.

---

# REUSE BEFORE BUILD

Before writing code ask:

Does this already exist?

Can it be reused?

Can it be shared?

Can it become generic?

If yes,

DO NOT BUILD AGAIN.

---

# PLATFORM BEFORE PRODUCT

Always improve the platform.

Never improve only one product.

If a feature benefits FindMyInterior and TrueDial,

make it generic.

Never hardcode project-specific implementations.

---

# MOBILE IS NOT A DIFFERENT PRODUCT

The Mobile App is another interface.

NOT another architecture.

NOT another backend.

NOT another implementation.

The only differences should be:

Navigation

Responsive UI

Native APIs

Everything else should remain identical.

---

# WEBSITE IS NOT A DIFFERENT PRODUCT

Website and Mobile expose the same platform.

Different presentation.

Same workflows.

Same APIs.

Same permissions.

Same validation.

Same database.

---

# BACKEND IS SACRED

Laravel is the heart of the platform.

Never move business logic into React.

Never move business logic into Flutter/Expo.

Never calculate pricing inside frontend.

Never calculate subscriptions inside frontend.

Never calculate permissions inside frontend.

---

# QUALITY OVER SPEED

Fast code that creates technical debt is failure.

Slower architecture that survives years is success.

---

# BEFORE WRITING CODE

Always ask:

Can this be reused?

Can this become a module?

Can this serve future products?

Will this break another tenant?

Is this configurable?

If the answer is No,

redesign it.

---

# DOCUMENTATION

Whenever architecture changes,

documentation must change.

Documentation is part of the product.

Never let docs become outdated.

---

# DEFINITION OF DONE

A feature is NOT complete because:

✔ UI exists

A feature is complete only if:

✔ Backend completed

✔ APIs completed

✔ Website completed

✔ Mobile completed

✔ Admin completed

✔ Tested

✔ Production Build passes

✔ Type Check passes

✔ Documentation updated

Only then,

mark the feature complete.

---

# FINAL RULE

Every line of code should make the platform easier to extend.

Never harder.

Think like the CTO.

Not like a freelancer.

This document overrides all other implementation decisions.

Read it before every development session.