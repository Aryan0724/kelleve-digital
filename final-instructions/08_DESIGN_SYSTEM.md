# TRUEDIAL PLATFORM
# DESIGN SYSTEM
# Version 1.0

---

# PURPOSE

This document defines the official Design System for every product built on the platform.

Every frontend application must follow this design system.

Current Products

• TrueDial Website

• TrueDial Mobile

• FindMyInterior

Future Products

• Marketplace

• AI Center

• Admin Dashboard

• Vendor Dashboard

• Customer Dashboard

All products should feel like they belong to one ecosystem.

---

# DESIGN PHILOSOPHY

The platform should feel

Professional

Modern

Premium

Simple

Fast

Clean

Trustworthy

Never flashy.

Never cluttered.

Never difficult to understand.

---

# DESIGN PRINCIPLES

Every interface should follow these principles.

1. Clarity

Users should understand every screen immediately.

2. Simplicity

Remove unnecessary elements.

3. Consistency

The same action should look identical everywhere.

4. Speed

Users should perform common tasks with minimum effort.

5. Accessibility

Everyone should be able to use the platform.

---

# BRAND PERSONALITY

The platform should communicate

Trust

Growth

Technology

Innovation

Professionalism

Reliability

Confidence

Every UI decision should reinforce these values.

---

# DESIGN LANGUAGE

Use a minimal modern design language.

Inspired by

Stripe

Linear

Notion

Vercel

Airbnb

Apple

Avoid outdated enterprise interfaces.

---

# GRID SYSTEM

Desktop

12-column grid

Tablet

8-column grid

Mobile

4-column grid

Use responsive layouts.

Never hardcode widths.

---

# SPACING SYSTEM

Use an 8-point spacing system.

Allowed spacing

4

8

12

16

24

32

40

48

56

64

80

96

Avoid arbitrary values.

Consistency matters.

---

# BORDER RADIUS

Small

6px

Medium

10px

Large

16px

Cards

20px

Pills

999px

Use consistent radii.

---

# TYPOGRAPHY

Primary Font

Inter

Fallback

System Sans

Never mix fonts unnecessarily.

---

# FONT SCALE

Display

48

Heading 1

40

Heading 2

32

Heading 3

28

Heading 4

24

Heading 5

20

Body Large

18

Body

16

Small

14

Caption

12

Never invent random font sizes.

---

# FONT WEIGHTS

Regular

400

Medium

500

Semibold

600

Bold

700

Use weight for hierarchy.

Not color.

---

# COLOR SYSTEM

Colors should come from theme configuration.

Core semantic colors

Primary

Secondary

Success

Warning

Danger

Info

Neutral

Never hardcode colors inside components.

---

# SEMANTIC COLORS

Green

Success

Red

Errors

Orange

Warnings

Blue

Information

Gray

Neutral

Never use colors without meaning.

---

# LIGHT MODE

Default experience.

Should be polished first.

Dark mode comes after light mode is complete.

---

# DARK MODE

Every component must support dark mode.

Never build dark mode as an afterthought.

---

# ICONS

Use one icon library across the platform.

Recommended

Lucide

or

Heroicons

Never mix multiple icon packs.

---

# BUTTONS

Primary

Main platform action

Secondary

Alternative action

Outline

Less important action

Ghost

Minimal action

Danger

Destructive action

Never invent custom button styles.

---

# INPUTS

Every input should support

Label

Placeholder

Helper Text

Validation

Disabled

Loading

Error

Required

Consistent everywhere.

---

# CARDS

Cards are the primary container.

Cards should contain

Title

Description

Actions

Footer (optional)

Avoid deeply nested cards.

---

# TABLES

Desktop only when appropriate.

Mobile should convert tables into cards.

Never force horizontal scrolling.

---

# FORMS

Group related information.

One primary action.

One secondary action.

Never overwhelm users.

---

# NAVIGATION

Maximum three navigation levels.

Users should never get lost.

Always indicate current location.

---

# SEARCH

Search should always be visible where relevant.

Support

Autocomplete

Suggestions

Recent Searches

Filters

Sorting

Search is a first-class feature.

---

# EMPTY STATES

Every empty screen should explain

Why it is empty

How to fix it

Next action

Never show blank pages.

---

# LOADING STATES

Never leave users wondering.

Use

Skeleton Loaders

Progress Indicators

Shimmer Effects

Avoid endless spinners.

---

# ERROR STATES

Errors should explain

What happened

Why

How to fix it

Never expose technical errors.

---

# CONFIRMATION DIALOGS

Only use for destructive actions.

Examples

Delete Business

Cancel Subscription

Remove User

Never confirm harmless actions.

---

# TOASTS

Use toasts for

Success

Information

Warnings

Avoid toast spam.

One message at a time.

---

# MODALS

Use only when necessary.

Avoid placing large forms inside modals.

Prefer dedicated pages for complex workflows.

---

# RESPONSIVE DESIGN

Desktop

Laptop

Tablet

Mobile

Every screen must work on all devices.

Never design desktop first and ignore mobile.

---

# ACCESSIBILITY

Support

Keyboard Navigation

Screen Readers

Color Contrast

Focus States

Large Touch Targets

Meaningful Labels

Accessibility is mandatory.

---

# ANIMATIONS

Animations should improve usability.

Not decoration.

Recommended duration

150ms

200ms

300ms

Avoid long animations.

---

# MICROINTERACTIONS

Buttons

Hover

Press

Success

Loading

Transitions

Use subtle feedback.

---

# IMAGES

Always optimize.

Use lazy loading.

Responsive images.

WebP when possible.

Never upload oversized assets.

---

# COMPONENT PHILOSOPHY

Every UI element should become a reusable component.

Never duplicate UI.

Build once.

Reuse everywhere.

---

# COMPONENT STRUCTURE

Every component should include

Logic

Styles

Types

Documentation

Tests (where appropriate)

Stories (future Storybook support)

---

# DESIGN TOKENS

Never hardcode

Colors

Spacing

Typography

Radius

Shadows

Everything should come from design tokens.

---

# DASHBOARDS

Dashboard cards should display

Key Metrics

Quick Actions

Recent Activity

Alerts

Avoid overwhelming users.

---

# MOBILE DESIGN

Large touch targets.

Bottom navigation when appropriate.

One-handed usability.

Native interactions.

Fast performance.

---

# ADMIN DESIGN

Information density can be higher.

Prioritize efficiency over visual effects.

Support power users.

---

# VENDOR DASHBOARD

Focus on

Business

Leads

Revenue

Campaigns

Offers

Analytics

Everything should help vendors grow.

---

# CUSTOMER EXPERIENCE

Focus on

Search

Discovery

Offers

Reviews

Trust

Speed

Convenience

---

# CONSISTENCY RULE

If two screens perform the same action,

they should look and behave the same.

Consistency is more important than creativity.

---

# DESIGN REVIEW CHECKLIST

Before approving any UI

✓ Responsive

✓ Accessible

✓ Uses design tokens

✓ Reuses existing components

✓ Supports dark mode

✓ Loading state implemented

✓ Empty state implemented

✓ Error state implemented

✓ Mobile optimized

✓ Matches platform branding

---

# NEVER DO THIS

❌ Hardcoded colors

❌ Random spacing

❌ Different button styles

❌ Multiple icon libraries

❌ Different input styles

❌ Inconsistent typography

❌ Unresponsive layouts

❌ Hidden navigation

❌ Unlabeled icons

❌ Tiny touch targets

---

# FINAL RULE

Every new screen should feel like it was designed by the same team, using the same language, for the same platform.

If a user can tell two modules were built by different developers, the design system has failed.