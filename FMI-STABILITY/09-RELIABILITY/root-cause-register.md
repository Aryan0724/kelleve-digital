# Root Cause Register

Database of unified historical incidents mapped to their respective failure families.

## DEPLOYMENT_DRIFT
- **FMI-001** (2026-08-20): ParseError: Unclosed bracket in api.php causing global outage
- **FMI-023** (2026-08-18): fix(ui): resolve layout and page syntax errors
- **FMI-051** (2026-08-16): Fix JSX syntax error in ecosystem and promotional sections
- **FMI-161** (2026-08-08): Fix api.php syntax error and filter out worker jobs from professional dashboard
- **FMI-200** (2026-08-06): fix syntax error
- **FMI-245** (2026-08-02): fix: resolve syntax error in public profile page
- **FMI-281** (2026-07-30): fix: update service name to frontend in deployment script
- **FMI-294** (2026-07-28): feat(architecture): configure Vercel rewrites and absolute URL SSR fallback for TrueDial
- **FMI-325** (2026-07-19): Fix navbar syntax errors causing hydration failure on mobile
- **FMI-382** (2026-07-02): Fix image API serialization and add doctrine/dbal for deployment
## API_CONTRACT_DRIFT
- **FMI-009** (2026-08-19): fix(frontend): pass missing currentPlan prop to SubscriptionTab
- **FMI-010** (2026-08-19): fix(frontend): add missing Wallet and Subscription tabs to Worker and Builder dashboards
- **FMI-011** (2026-08-19): fix(mobile): install missing expo-blur
- **FMI-021** (2026-08-18): fix(ui): add missing Menu and X imports in Navbar
- **FMI-036** (2026-08-18): fix(admin): catch Throwable in system health to prevent 500 errors on missing extensions like Redis
- **FMI-037** (2026-08-17): fix(admin): resolve 500 error in system health due to undefined pending migrations method
- **FMI-048** (2026-08-17): fix(dashboard): update worker terminology, add missing portfolios & resolve profile data loss
- **FMI-050** (2026-08-16): Fix missing ChevronDown import
- **FMI-061** (2026-08-16): fix: restore missing subscription permission variables in ListingResource
- **FMI-064** (2026-08-16): fix: make profile update validation flexible and sync all role updates directly to Listing model
## DATABASE_COUPLING
- **FMI-145** (2026-08-09): fix: Seeder foreign key constraint issue
- **FMI-146** (2026-08-09): fix: remove duplicate migration
- **FMI-152** (2026-08-08): Fix duplicate index migration
- **FMI-180** (2026-08-08): Fix backend migration table check and ensure supervisord startup
- **FMI-296** (2026-07-24): fix(verification): correct DB enums in backend and display Verified badge on public profile
- **FMI-311** (2026-07-23): fix(seeder): add phone number to vendor business to fix Playwright timeout
- **FMI-315** (2026-07-23): fix(rc-1): fix migration indexing errors for sqlite compatibility, add tenant factory, update ownership for media
- **FMI-334** (2026-07-04): perf: implement redis caching and fix dashboard N+1 queries
- **FMI-339** (2026-07-04): fix: increase timeout for slow image uploads and add explicit loading text
- **FMI-342** (2026-07-04): fix: add timeout and alert to post requirement to prevent hanging
## STORAGE_FAILURES
- **FMI-013** (2026-08-18): fix(ui): refactor hero image into a rounded card layout to fix rendering and overlap issues on vercel
- **FMI-015** (2026-08-18): fix(ui): adjust hero image positioning to prevent clipping on desktop
- **FMI-018** (2026-08-18): fix(ui): make hero search layout and image mobile responsive
- **FMI-032** (2026-08-18): fix(frontend): UI crash fixes, edit profile routing, and universal image cropper for profile uploads
- **FMI-041** (2026-08-17): fix(ui): use correct logo.jpg image file for truedial logo
- **FMI-044** (2026-08-17): fix(api): provide fallback values for required worker fields to prevent PDO exceptions on profile save
- **FMI-045** (2026-08-17): fix(ui): prevent automatic Studio appending and fix aggressive image cropping on professional cards
- **FMI-046** (2026-08-17): fix(api): enforce https://findmyinterior.com domain for media URLs to resolve broken images when APP_URL is misconfigured
- **FMI-047** (2026-08-17): feat(ui): add dashboard profile edit button, fix verification status display, enable admin advertisement editing, and update TrueDial search/offers
- **FMI-054** (2026-08-16): fix: ensure complete absolute media URLs across all resources and robust frontend profile rendering
## VIBE_CODE_REGRESSION
- **FMI-001** (2026-08-19): Revert "fix(ui): restore TrueDial premium frontend UI, reverting JustDial overhaul"
- **FMI-002** (2026-08-19): fix(ui): restore TrueDial premium frontend UI, reverting JustDial overhaul
- **FMI-003** (2026-08-19): fix(backend): add fix-unlocks endpoint
- **FMI-004** (2026-08-19): fix(backend): use projects table in script
- **FMI-005** (2026-08-19): fix(backend): fix worker job unlock visibility and database corruption bug
- **FMI-006** (2026-08-19): fix(frontend): properly reset activeTab when tabParam is null across all dashboards
- **FMI-007** (2026-08-19): fix(frontend): make worker dashboard match homeowner dashboard style
- **FMI-008** (2026-08-19): fix(frontend): rename Worker overview tab to Dashboard
- **FMI-012** (2026-08-19): chore: fix Vercel SSG build fetch failures
- **FMI-014** (2026-08-18): fix(ui): resolve text overlap in hero section and constrain navbar logo width
