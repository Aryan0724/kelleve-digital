# Project Rules for Antigravity (Find My Interior & TrueDial)

These rules apply to ANY Antigravity agent working in this repository. You must read and follow these rules strictly to maintain consistency across the codebase, regardless of who is operating you.

## 1. TrueDial Frontend Architecture
When working inside the `truedial-frontend` directory, you MUST strictly adhere to the guidelines documented in `truedial-frontend/TRUEDIAL_ARCHITECTURE.md`. Before building new components or pages for TrueDial, read that file to understand the design language, stack, and component structure.

## 2. Aesthetics & UI Guidelines
- NEVER create basic, unstyled MVP components.
- ALL UI components must look extremely premium, utilizing modern web design trends.
- **Glassmorphism:** Use backdrops, blurs, and semi-transparent borders for cards and navbars.
- **Micro-animations:** Always add hover states, subtle scaling, and fade-in transitions.
- **Dark Mode:** Every component built MUST have explicit `dark:` variants (e.g., text legibility, adjusted opacity, inverted logos). Never build a light-mode only component.

## 3. Backend Integration
- Both `findmyinterior-frontend` and `truedial-frontend` communicate with the central Laravel backend (`findmyinterior-backend`).
- When writing API calls, follow the existing endpoints documented in `DATABASE_SCHEMA.md` and `API_SPECIFICATION.md` located in the root directory.

## 4. Git Protocol
- When asked to push code, ensure the commit message accurately reflects the UI/UX or architectural changes made.
