# Evidence Index

This document maps reliability findings back to raw historical evidence.

## Log Retention Limits
- **Backend Docker:** 
   INFO  Route cache cleared successfully.  


   INFO  Configuration cache cleared successfully.  ...
- **Frontend Docker:** 
> findmyinterior-frontend@0.1.0 start
> next start

▲ Next.js 16.2.9
- Local:         http://localh...
- **Laravel Logs:** [2026-07-15 07:45:46] production.ERROR: SQLSTATE[HY000] [2002] Connection refused (Connection: mysql...

## Incident Evidence Mapping
- **FMI-001**: ParseError: Unclosed bracket in api.php causing global outage (Commit: `fe9bebe`, Confidence: CONFIRMED)
- **FMI-001**: Revert "fix(ui): restore TrueDial premium frontend UI, reverting JustDial overhaul" (Commit: `61c71a1`, Confidence: CONFIRMED)
- **FMI-002**: fix(ui): restore TrueDial premium frontend UI, reverting JustDial overhaul (Commit: `41d3a2c`, Confidence: CONFIRMED)
- **FMI-003**: fix(backend): add fix-unlocks endpoint (Commit: `be008a6`, Confidence: CONFIRMED)
- **FMI-004**: fix(backend): use projects table in script (Commit: `33814c3`, Confidence: CONFIRMED)
- **FMI-005**: fix(backend): fix worker job unlock visibility and database corruption bug (Commit: `2d8c5a4`, Confidence: CONFIRMED)
- **FMI-006**: fix(frontend): properly reset activeTab when tabParam is null across all dashboards (Commit: `7da178f`, Confidence: CONFIRMED)
- **FMI-007**: fix(frontend): make worker dashboard match homeowner dashboard style (Commit: `5082fe5`, Confidence: CONFIRMED)
- **FMI-008**: fix(frontend): rename Worker overview tab to Dashboard (Commit: `cffbae1`, Confidence: CONFIRMED)
- **FMI-009**: fix(frontend): pass missing currentPlan prop to SubscriptionTab (Commit: `7a7d091`, Confidence: CONFIRMED)
- **FMI-010**: fix(frontend): add missing Wallet and Subscription tabs to Worker and Builder dashboards (Commit: `1c3e31b`, Confidence: CONFIRMED)
- **FMI-011**: fix(mobile): install missing expo-blur (Commit: `2954cb0`, Confidence: CONFIRMED)
- **FMI-012**: chore: fix Vercel SSG build fetch failures (Commit: `d8e1206`, Confidence: CONFIRMED)
- **FMI-013**: fix(ui): refactor hero image into a rounded card layout to fix rendering and overlap issues on vercel (Commit: `967e50c`, Confidence: CONFIRMED)
- **FMI-014**: fix(ui): resolve text overlap in hero section and constrain navbar logo width (Commit: `c97a74c`, Confidence: CONFIRMED)
- **FMI-015**: fix(ui): adjust hero image positioning to prevent clipping on desktop (Commit: `4c58f3c`, Confidence: CONFIRMED)
- **FMI-016**: fix(db): ensure SQLite math functions persist across DB connections (Commit: `848f7fd`, Confidence: CONFIRMED)
- **FMI-017**: fix(ui): remove double padding on Popular Categories section header (Commit: `f3798c0`, Confidence: CONFIRMED)
- **FMI-018**: fix(ui): make hero search layout and image mobile responsive (Commit: `576a0ac`, Confidence: CONFIRMED)
- **FMI-019**: fix(api): remove duplicate get and post functions in api client (Commit: `09c2896`, Confidence: CONFIRMED)
- **FMI-020**: fix(ui): add Bell and User icon imports to Navbar (Commit: `b836ca9`, Confidence: CONFIRMED)
- **FMI-021**: fix(ui): add missing Menu and X imports in Navbar (Commit: `07c778f`, Confidence: CONFIRMED)
- **FMI-022**: fix(dashboard): resolve type error with roleSlugs in layout (Commit: `3651073`, Confidence: CONFIRMED)
- **FMI-023**: fix(ui): resolve layout and page syntax errors (Commit: `72edb7a`, Confidence: CONFIRMED)
- **FMI-024**: chore: add debug scripts (Commit: `1e6ab89`, Confidence: CONFIRMED)
- **FMI-025**: fix(ui): restore correct recent design from 1 day ago (e58da74) resolving old ui issue (Commit: `d3e258f`, Confidence: CONFIRMED)
- **FMI-026**: fix(frontend): improve global error boundary display and debug details (Commit: `ed8ac26`, Confidence: CONFIRMED)
- **FMI-027**: fix(ui): restore exact recent design and full multi-tier navbar (Commit: `ad0c46e`, Confidence: CONFIRMED)
- **FMI-028**: fix(ui): restore latest homepage design and components (Commit: `7d76b58`, Confidence: CONFIRMED)
- **FMI-029**: Fix React Error #31 in FeaturedProfessionals (Commit: `491733c`, Confidence: CONFIRMED)
- **FMI-030**: fix(frontend): resolve Dynamic server usage error in /blog route (Commit: `7014308`, Confidence: CONFIRMED)
- **FMI-031**: fix(frontend): Correct string comparison logic in wallet balance check and improve Razorpay error handling (Commit: `5e278a9`, Confidence: CONFIRMED)
- **FMI-032**: fix(frontend): UI crash fixes, edit profile routing, and universal image cropper for profile uploads (Commit: `291cc27`, Confidence: CONFIRMED)
- **FMI-033**: feat(frontend): add Next.js global error boundary and intercept Axios 500 errors to prevent user-facing crashes (Commit: `d5ad32f`, Confidence: CONFIRMED)
- **FMI-034**: chore(infra): add memory limits to MySQL container to prevent OOM crashes on the VPS (Commit: `624339b`, Confidence: CONFIRMED)
- **FMI-035**: fix(admin): wrap all system health checks in try-catch to prevent any uncaught fatal errors (Commit: `dead337`, Confidence: CONFIRMED)
- **FMI-036**: fix(admin): catch Throwable in system health to prevent 500 errors on missing extensions like Redis (Commit: `3e79d03`, Confidence: CONFIRMED)
- **FMI-037**: fix(admin): resolve 500 error in system health due to undefined pending migrations method (Commit: `7297c80`, Confidence: CONFIRMED)
- **FMI-038**: fix(ui): revert Navbar to c76cdf9 to remove unauthorized redesign, emojis, and new tabs (Commit: `d56529d`, Confidence: CONFIRMED)
- **FMI-039**: fix(ui): restore original FindMyInterior layout and typography, fix backend spatial queries (Commit: `c411632`, Confidence: CONFIRMED)
- **FMI-040**: fix(ui): implement exact mobile mockup layout for Top Bar and Search (Commit: `d83a41e`, Confidence: CONFIRMED)
- **FMI-041**: fix(ui): use correct logo.jpg image file for truedial logo (Commit: `68da33e`, Confidence: CONFIRMED)
- **FMI-042**: fix(ui): add bottom padding to hero wrapper to compensate for overlapping search bar (Commit: `34403e8`, Confidence: CONFIRMED)
- **FMI-043**: fix(ui): remove overflow-hidden from hero to prevent search bar cutoff (Commit: `ea2b2fc`, Confidence: CONFIRMED)
- **FMI-044**: fix(api): provide fallback values for required worker fields to prevent PDO exceptions on profile save (Commit: `fd22bc7`, Confidence: CONFIRMED)
- **FMI-045**: fix(ui): prevent automatic Studio appending and fix aggressive image cropping on professional cards (Commit: `f8f2a60`, Confidence: CONFIRMED)
- **FMI-046**: fix(api): enforce https://findmyinterior.com domain for media URLs to resolve broken images when APP_URL is misconfigured (Commit: `09fcca3`, Confidence: CONFIRMED)
- **FMI-047**: feat(ui): add dashboard profile edit button, fix verification status display, enable admin advertisement editing, and update TrueDial search/offers (Commit: `1fe0b71`, Confidence: CONFIRMED)
- **FMI-048**: fix(dashboard): update worker terminology, add missing portfolios & resolve profile data loss (Commit: `3b8eccb`, Confidence: CONFIRMED)
- **FMI-049**: Fix TrueDial logo in Navbar (Commit: `525e073`, Confidence: CONFIRMED)

*...and 405 more incidents traced to git history.*
