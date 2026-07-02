<?php
/**
 * FINAL LIVE PRODUCTION ACCEPTANCE TEST v2
 * Target: https://find-my-interior-1.onrender.com/api/v1
 * 
 * ALL ROUTES VERIFIED AGAINST: php artisan route:list
 * ALL RESPONSE STRUCTURES VERIFIED AGAINST: AuthController source
 * 
 * Fixed issues from v1:
 * - Token at data.token (not token)
 * - User ID at data.user.id
 * - Admin email: Aryantiwari@findmyinterior.com
 * - Health at /api/v1/health (not ../health)
 * - Dashboard at /user/dashboard
 * - Reviews at /user/reviews (homeowner) + /admin/projects/{id}/reviews
 * - Bids award: PATCH /bids/{bid}/award
 * - Subscription: /subscriptions/plans
 * - Milestone pay: PATCH (not POST)
 * - Added sleep() between registrations to avoid rate limit
 * - api() always gets array for data
 */

$BASE = 'https://find-my-interior-1.onrender.com/api/v1';
$results  = [];
$PASS = 'PASS';
$FAIL = 'FAIL';

function api(string $method, string $url, array $data = [], string $token = ''): array {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 45);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    $headers = ['Content-Type: application/json', 'Accept: application/json'];
    if ($token) $headers[] = "Authorization: Bearer $token";
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif (in_array($method, ['PUT', 'PATCH', 'DELETE'])) {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);
    
    $json = json_decode($body, true);
    return ['code' => $code, 'body' => $body, 'json' => $json ?? [], 'error' => $err];
}

function check(string $label, array $r, int $expectedCode, ?callable $assert = null): bool {
    global $PASS, $FAIL, $results;
    $passed = ($r['code'] === $expectedCode);
    if ($passed && $assert) $passed = (bool)$assert($r['json']);
    $preview = substr($r['body'], 0, 150);
    $status  = $passed ? $PASS : $FAIL;
    echo "[$status] $label | HTTP {$r['code']} | $preview\n\n";
    $results[] = ['label' => $label, 'passed' => $passed, 'code' => $r['code'], 'body' => substr($r['body'], 0, 300)];
    return $passed;
}

$ts   = time();
$pass = 'Acceptance@123!';

echo "\n===========================================================\n";
echo "  FIND MY INTERIOR – PRODUCTION ACCEPTANCE TEST v2\n";
echo "  Target : $BASE\n";
echo "  Time   : " . date('Y-m-d H:i:s') . "\n";
echo "===========================================================\n";

// ──────────────────────────────────────────────────────────────
// PHASE 1 — HEALTH
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 1: HEALTH ===\n";
$h = api('GET', "$BASE/health");
check('Backend /health', $h, 200, fn($r) => ($r['status'] ?? '') === 'ok');

// ──────────────────────────────────────────────────────────────
// PHASE 2 — HOMEOWNER REGISTRATION + AUTH
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 2: HOMEOWNER ===\n";
$hoEmail = "ho_{$ts}@test.com";
$r = api('POST', "$BASE/auth/register", [
    'name' => 'Test Homeowner', 'email' => $hoEmail,
    'password' => $pass, 'password_confirmation' => $pass, 'role' => 'customer',
]);
check('Homeowner register', $r, 201, fn($j) => !empty($j['data']['token']));
$hoToken  = $r['json']['data']['token'] ?? '';
$hoUserId = $r['json']['data']['user']['id'] ?? null;

// Login
sleep(1);
$r = api('POST', "$BASE/auth/login", ['email' => $hoEmail, 'password' => $pass]);
check('Homeowner login', $r, 200, fn($j) => !empty($j['data']['token']));
$hoToken = $r['json']['data']['token'] ?? $hoToken;

// Get profile
$r = api('GET', "$BASE/user/profile", [], $hoToken);
check('Homeowner get profile', $r, 200, fn($j) => isset($j['data']['id']));

// Update profile
$r = api('PUT', "$BASE/user/profile", ['name' => 'Updated Homeowner', 'phone' => '9876543210'], $hoToken);
check('Homeowner update profile', $r, 200);

// Persist after re-fetch
$r = api('GET', "$BASE/user/profile", [], $hoToken);
check('Profile update persists', $r, 200, fn($j) => ($j['data']['name'] ?? '') === 'Updated Homeowner');

// Dashboard
$r = api('GET', "$BASE/user/dashboard", [], $hoToken);
check('Homeowner dashboard', $r, 200, fn($j) => isset($j['data']));

// ──────────────────────────────────────────────────────────────
// PHASE 3 — POST REQUIREMENT (HOMEOWNER)
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 3: POST REQUIREMENT ===\n";
$r = api('POST', "$BASE/requirements", [
    'title'       => "Test Interior Design $ts",
    'description' => "Full 3BHK interior design. Budget ₹3-5 lakh. Modern minimalist.",
    'budget_min'  => 300000,
    'budget_max'  => 500000,
    'city'        => 'Patna',
    'district'    => 'Patna',
    'category_id' => 1,
    'scope'       => 'full_home',
    'timeline'    => '3-6 months',
    'property_type' => 'apartment',
], $hoToken);
check('Post requirement', $r, 201, fn($j) => isset($j['data']['id']));
$reqId = $r['json']['data']['id'] ?? null;

// Persist
if ($reqId) {
    $r = api('GET', "$BASE/requirements/$reqId", [], $hoToken);
    check('Requirement persists after refresh', $r, 200, fn($j) => ($j['data']['id'] ?? 0) == $reqId);
    
    // Edit
    $r = api('PUT', "$BASE/requirements/$reqId", ['title' => "Updated Interior $ts"], $hoToken);
    check('Edit requirement', $r, 200);
}

// ──────────────────────────────────────────────────────────────
// PHASE 4 — INTERIOR DESIGNER REGISTRATION + LISTING
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 4: INTERIOR DESIGNER ===\n";
sleep(2); // avoid rate limit
$dEmail = "designer_{$ts}@test.com";
$r = api('POST', "$BASE/auth/register", [
    'name' => 'Test Designer', 'email' => $dEmail,
    'password' => $pass, 'password_confirmation' => $pass, 'role' => 'business',
]);
check('Designer register', $r, 201, fn($j) => !empty($j['data']['token']));
$dToken  = $r['json']['data']['token'] ?? '';
$dUserId = $r['json']['data']['user']['id'] ?? null;

sleep(1);
$r = api('POST', "$BASE/auth/login", ['email' => $dEmail, 'password' => $pass]);
check('Designer login', $r, 200, fn($j) => !empty($j['data']['token']));
$dToken = $r['json']['data']['token'] ?? $dToken;

// Create listing
$r = api('POST', "$BASE/user/listings", [
    'category_id' => 1, 'title' => "Test Design Studio $ts",
    'tagline' => 'Modern interiors', 'description' => 'Full service interior design',
    'phone' => '9876543211', 'whatsapp' => '9876543211',
    'city' => 'Patna', 'district' => 'Patna',
    'years_experience' => 5, 'team_size' => 3,
], $dToken);
check('Designer creates listing', $r, 201, fn($j) => isset($j['data']['id']));
$listingId = $r['json']['data']['id'] ?? null;

// Update listing
if ($listingId) {
    $r = api('PUT', "$BASE/user/listings/$listingId", ['tagline' => 'Award-winning interiors'], $dToken);
    check('Designer updates listing', $r, 200);
}

// Verify listing persists
$r = api('GET', "$BASE/user/listings", [], $dToken);
check('Designer listings persist', $r, 200, fn($j) => count($j['data'] ?? []) > 0);

// Professional dashboard
$r = api('GET', "$BASE/user/dashboard", [], $dToken);
check('Designer dashboard loads', $r, 200, fn($j) => isset($j['data']));

// Vendor metrics
$r = api('GET', "$BASE/vendors/me/metrics", [], $dToken);
check('Designer vendor metrics', $r, 200);

// Trust score present
$r = api('GET', "$BASE/user/profile", [], $dToken);
check('Designer trust_score on profile', $r, 200, fn($j) => array_key_exists('trust_score', $j['data'] ?? []));
$trustBefore = $r['json']['data']['trust_score'] ?? 0;
echo "  → Trust Score before verification: $trustBefore\n";

// ──────────────────────────────────────────────────────────────
// PHASE 5 — OTHER ROLE REGISTRATIONS
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 5: OTHER ROLES ===\n";

sleep(2);
$cEmail = "contractor_{$ts}@test.com";
$r = api('POST', "$BASE/auth/register", [
    'name' => 'Test Contractor', 'email' => $cEmail,
    'password' => $pass, 'password_confirmation' => $pass, 'role' => 'business',
]);
check('Contractor register', $r, 201);
$cToken = $r['json']['data']['token'] ?? '';
sleep(1);
$r = api('POST', "$BASE/auth/login", ['email' => $cEmail, 'password' => $pass]);
check('Contractor login', $r, 200, fn($j) => !empty($j['data']['token']));
$cToken = $r['json']['data']['token'] ?? $cToken;

sleep(2);
$bEmail = "builder_{$ts}@test.com";
$r = api('POST', "$BASE/auth/register", [
    'name' => 'Test Builder', 'email' => $bEmail,
    'password' => $pass, 'password_confirmation' => $pass, 'role' => 'builder',
]);
check('Builder register', $r, 201);
$bToken = $r['json']['data']['token'] ?? '';
sleep(1);
$r = api('POST', "$BASE/auth/login", ['email' => $bEmail, 'password' => $pass]);
check('Builder login', $r, 200, fn($j) => !empty($j['data']['token']));
$bToken = $r['json']['data']['token'] ?? $bToken;

sleep(2);
$sEmail = "supplier_{$ts}@test.com";
$r = api('POST', "$BASE/auth/register", [
    'name' => 'Test Supplier', 'email' => $sEmail,
    'password' => $pass, 'password_confirmation' => $pass, 'role' => 'supplier',
]);
check('Supplier register', $r, 201);
$sToken = $r['json']['data']['token'] ?? '';
sleep(1);
$r = api('POST', "$BASE/auth/login", ['email' => $sEmail, 'password' => $pass]);
check('Supplier login', $r, 200, fn($j) => !empty($j['data']['token']));
$sToken = $r['json']['data']['token'] ?? $sToken;

sleep(2);
$wEmail = "worker_{$ts}@test.com";
$r = api('POST', "$BASE/auth/register", [
    'name' => 'Test Worker', 'email' => $wEmail,
    'password' => $pass, 'password_confirmation' => $pass, 'role' => 'worker',
]);
check('Worker register', $r, 201);
$wToken = $r['json']['data']['token'] ?? '';
sleep(1);
$r = api('POST', "$BASE/auth/login", ['email' => $wEmail, 'password' => $pass]);
check('Worker login', $r, 200, fn($j) => !empty($j['data']['token']));
$wToken = $r['json']['data']['token'] ?? $wToken;

// ──────────────────────────────────────────────────────────────
// PHASE 6 — BID LIFECYCLE
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 6: BID LIFECYCLE ===\n";
$bidId = null;
if ($reqId && $dToken) {
    $r = api('POST', "$BASE/bids", [
        'requirement_id'          => $reqId,
        'requirement_type'        => 'Requirement',
        'amount'                  => 380000,
        'estimated_cost'          => 380000,
        'experience_years'        => 5,
        'previous_projects_count' => 15,
        'company_name'            => "Test Design Studio $ts",
        'timeline'                => '4 months',
        'proposal'                => 'Professional interior design within budget.',
    ], $dToken);
    check('Designer submits bid', $r, 201, fn($j) => isset($j['data']['id']));
    $bidId = $r['json']['data']['id'] ?? null;
    
    // Customer sees bids
    $r = api('GET', "$BASE/requirements/$reqId/bids", [], $hoToken);
    check('Customer sees bids on requirement', $r, 200, fn($j) => is_array($j['data'] ?? null));
    
    // Smart score present
    $firstBid = $r['json']['data'][0] ?? [];
    echo "  → Smart Bid Score: " . ($firstBid['smart_bid_score'] ?? 'N/A') . "\n";
}

// ──────────────────────────────────────────────────────────────
// PHASE 7 — AWARD + MILESTONE + COMPLETE
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 7: AWARD → MILESTONE → COMPLETE ===\n";
if ($bidId) {
    // Award the bid
    $r = api('PATCH', "$BASE/bids/$bidId/award", [], $hoToken);
    check('Customer awards bid', $r, 200);
    
    // Milestones
    $r = api('POST', "$BASE/requirements/$reqId/milestones?requirement_type=project", [
        'title'       => 'Initial Concepts',
        'description' => 'Deliver 3 design concepts',
        'percentage'  => 30,
        'amount'      => 114000,
    ], $dToken);
    check('Professional creates milestone', $r, 201, fn($j) => isset($j['data']['id']));
    $mId = $r['json']['data']['id'] ?? null;
    
    if ($mId) {
        // Request approval
        $r = api('PATCH', "$BASE/requirements/$reqId/milestones/$mId?requirement_type=project",
            ['status' => 'requested'], $dToken);
        check('Professional requests milestone approval', $r, 200);
        
        // Mark paid
        $r = api('PATCH', "$BASE/requirements/$reqId/milestones/$mId/pay?requirement_type=project",
            [], $hoToken);
        check('Customer marks milestone paid', $r, 200);
    }
    
    // Complete the requirement
    $r = api('PATCH', "$BASE/requirements/$reqId/complete", [], $hoToken);
    check('Customer marks project complete', $r, 200);
}

// ──────────────────────────────────────────────────────────────
// PHASE 8 — REVIEW
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 8: REVIEW & TRUST SCORE ===\n";
// POST /user/reviews — from homeowner using professional_id + requirement_id
if ($dUserId && $reqId) {
    $r = api('POST', "$BASE/user/reviews", [
        'professional_id'  => $dUserId,
        'requirement_id'   => $reqId,
        'rating'           => 5,
        'body'             => 'Outstanding work. Highly recommended!',
    ], $hoToken);
    check('Homeowner submits review', $r, 201, fn($j) => ($j['success'] ?? false) === true);
    
    // Check trust score updated
    sleep(2);
    $r = api('GET', "$BASE/user/profile", [], $dToken);
    check('Trust score present after review', $r, 200, fn($j) => array_key_exists('trust_score', $j['data'] ?? []));
    $trustAfter = $r['json']['data']['trust_score'] ?? 0;
    echo "  → Trust Score after review: $trustAfter (was $trustBefore)\n";
}

// ──────────────────────────────────────────────────────────────
// PHASE 9 — SEARCH & DISCOVERY
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 9: SEARCH & DISCOVERY ===\n";
$r = api('GET', "$BASE/listings?city=Patna&category_id=1");
check('Public listing search (city+category)', $r, 200, fn($j) => isset($j['data']));

$r = api('GET', "$BASE/search?q=interior&city=Patna");
check('Global search endpoint', $r, 200);

$r = api('GET', "$BASE/requirements?status=open", [], $dToken);
check('Professional sees open requirements', $r, 200, fn($j) => isset($j['data']));

$r = api('GET', "$BASE/homepage");
check('Homepage data endpoint', $r, 200, fn($j) => is_array($j));

$r = api('GET', "$BASE/categories");
check('Categories public endpoint', $r, 200);

// ──────────────────────────────────────────────────────────────
// PHASE 10 — MESSAGING
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 10: MESSAGING ===\n";
$r = api('GET', "$BASE/conversations", [], $hoToken);
check('Homeowner conversations', $r, 200);
$convs = $r['json']['data'] ?? [];
echo "  → Conversation count: " . count($convs) . "\n";

if (!empty($convs)) {
    $cId = $convs[0]['id'] ?? null;
    if ($cId) {
        $r = api('GET', "$BASE/conversations/$cId", [], $hoToken);
        check('Homeowner opens conversation', $r, 200);
        
        $r = api('POST', "$BASE/conversations/$cId/messages", 
            ['body' => 'Hello! Looking forward to working with you.'], $hoToken);
        check('Homeowner sends message', $r, 201);
        
        $r = api('GET', "$BASE/conversations/$cId/messages", [], $hoToken);
        check('Homeowner reads messages', $r, 200, fn($j) => is_array($j['data'] ?? null));
    }
}

$r = api('GET', "$BASE/conversations", [], $dToken);
check('Designer conversations', $r, 200);

// ──────────────────────────────────────────────────────────────
// PHASE 11 — NOTIFICATIONS
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 11: NOTIFICATIONS ===\n";
$r = api('GET', "$BASE/notifications", [], $hoToken);
check('Homeowner notifications', $r, 200);
$notifCount = count($r['json']['data'] ?? $r['json'] ?? []);
echo "  → Notification count: $notifCount\n";

$r = api('GET', "$BASE/notifications", [], $dToken);
check('Designer notifications', $r, 200);

// ──────────────────────────────────────────────────────────────
// PHASE 12 — WALLET
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 12: WALLET ===\n";
$r = api('GET', "$BASE/wallet", [], $dToken);
check('Designer wallet loads', $r, 200);
echo "  → Wallet balance: " . ($r['json']['data']['balance'] ?? 'N/A') . "\n";

$r = api('GET', "$BASE/wallet", [], $hoToken);
check('Homeowner wallet loads', $r, 200);

// ──────────────────────────────────────────────────────────────
// PHASE 13 — SUBSCRIPTION
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 13: SUBSCRIPTION ===\n";
$r = api('GET', "$BASE/subscriptions/plans");  // /subscriptions/plans (plural)
check('Subscription plans (public)', $r, 200, fn($j) => is_array($j['data'] ?? $j));

$r = api('GET', "$BASE/payments/history", [], $dToken);
check('Professional payment history', $r, 200);

// ──────────────────────────────────────────────────────────────
// PHASE 14 — VERIFICATION FLOW
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 14: VERIFICATION FLOW ===\n";
$r = api('GET', "$BASE/verification/status", [], $dToken);
check('Designer verification status', $r, 200);
echo "  → Verification level: " . ($r['json']['data']['verification_level'] ?? 'N/A') . "\n";

// ──────────────────────────────────────────────────────────────
// PHASE 15 — ADMIN
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 15: ADMIN LIFECYCLE ===\n";
$adminEmail = 'Aryantiwari@findmyinterior.com';
$adminPass  = 'Admin@123!';

$r = api('POST', "$BASE/auth/login", ['email' => $adminEmail, 'password' => $adminPass]);
check('Admin login', $r, 200, fn($j) => !empty($j['data']['token']));
$adminToken = $r['json']['data']['token'] ?? '';

if ($adminToken) {
    $r = api('GET', "$BASE/admin/dashboard", [], $adminToken);
    check('Admin dashboard', $r, 200, fn($j) => isset($j['data']['stats']));
    
    $stats = $r['json']['data']['stats'] ?? [];
    echo "  → Total users: " . ($stats['total_users'] ?? 'N/A') . "\n";
    echo "  → Total requirements: " . ($stats['total_requirements'] ?? 'N/A') . "\n";
    echo "  → Pending reviews: " . ($stats['pending_reviews'] ?? 'N/A') . "\n";
    
    $r = api('GET', "$BASE/admin/users", [], $adminToken);
    check('Admin views all users', $r, 200, fn($j) => isset($j['data']));
    
    $r = api('GET', "$BASE/admin/requirements", [], $adminToken);
    check('Admin views requirements', $r, 200, fn($j) => isset($j['data']));
    
    $r = api('GET', "$BASE/admin/payments", [], $adminToken);
    check('Admin views payments', $r, 200, fn($j) => isset($j['data']));
    
    $r = api('GET', "$BASE/admin/reviews/pending", [], $adminToken);
    check('Admin views pending reviews', $r, 200, fn($j) => isset($j['data']));
    
    $r = api('GET', "$BASE/admin/verifications?filter=pending", [], $adminToken);
    check('Admin views pending verifications', $r, 200);
    
    $r = api('GET', "$BASE/admin/listings", [], $adminToken);
    check('Admin views listings', $r, 200, fn($j) => isset($j['data']));
    
    // Approve requirement if pending
    if ($reqId) {
        $r = api('PATCH', "$BASE/admin/requirements/$reqId/approve", [], $adminToken);
        // May be 400 if already past pending state after award/complete
        check('Admin approves/overrides requirement', $r, 200);
    }
    
    // Admin verifies user
    if ($dUserId) {
        $r = api('PATCH', "$BASE/admin/users/$dUserId/verify",
            ['verification_level' => 'identity_verified'], $adminToken);
        check('Admin verifies designer identity', $r, 200);
        
        // Trust score should update
        sleep(1);
        $r = api('GET', "$BASE/user/profile", [], $dToken);
        check('Designer verification level updated', $r, 200,
            fn($j) => ($j['data']['verification_level'] ?? '') === 'identity_verified');
        echo "  → Verification level: " . ($r['json']['data']['verification_level'] ?? 'N/A') . "\n";
        echo "  → Trust score after identity verify: " . ($r['json']['data']['trust_score'] ?? 'N/A') . "\n";
    }
    
    // Toggle user active
    if ($hoUserId) {
        $r = api('PATCH', "$BASE/admin/users/$hoUserId/toggle-active", [], $adminToken);
        check('Admin toggles homeowner active', $r, 200);
        // Restore
        api('PATCH', "$BASE/admin/users/$hoUserId/toggle-active", [], $adminToken);
    }
    
    // Admin revenue
    $r = api('GET', "$BASE/admin/revenue", [], $adminToken);
    check('Admin revenue endpoint', $r, 200);
    
    // Admin blogs
    $r = api('GET', "$BASE/admin/blogs", [], $adminToken);
    check('Admin blogs endpoint', $r, 200);
    
    // Admin categories
    $r = api('GET', "$BASE/categories", [], $adminToken);
    check('Categories endpoint (admin)', $r, 200);
}

// ──────────────────────────────────────────────────────────────
// PHASE 16 — LOGOUT
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 16: LOGOUT ===\n";
$r = api('POST', "$BASE/auth/logout", [], $hoToken);
check('Homeowner logout', $r, 200, fn($j) => ($j['success'] ?? false) === true);

$r = api('POST', "$BASE/auth/logout", [], $dToken);
check('Designer logout', $r, 200);

// Token invalid after logout
$r = api('GET', "$BASE/user/profile", [], $hoToken);
check('Homeowner token invalid after logout', $r, 401);

// ──────────────────────────────────────────────────────────────
// PHASE 17 — PUBLIC DISCOVERY (SEO)
// ──────────────────────────────────────────────────────────────
echo "\n=== PHASE 17: PUBLIC / SEO ENDPOINTS ===\n";
$r = api('GET', "$BASE/listings");
check('Public listings', $r, 200, fn($j) => isset($j['data']));

$r = api('GET', "$BASE/categories");
check('Public categories', $r, 200);

$r = api('GET', "$BASE/cities");
check('Public cities', $r, 200);

$r = api('GET', "$BASE/districts");
check('Public districts', $r, 200);

$r = api('GET', "$BASE/blogs");
check('Public blogs', $r, 200);

$r = api('GET', "$BASE/builders");
check('Public builders', $r, 200);

$r = api('GET', "$BASE/suppliers");
check('Public suppliers', $r, 200);

$r = api('GET', "$BASE/workers");
check('Public workers', $r, 200);

$r = api('GET', "$BASE/homepage");
check('Homepage data', $r, 200);

// Frontend routes — just check 200 from Vercel
$frontendBase = 'https://find-my-interior-frontend.vercel.app';
$frontendRoutes = ['/', '/login', '/register', '/professionals', '/blog', '/terms', '/privacy', '/dispute-resolution', '/compliance', '/pricing'];
echo "\n=== PHASE 17B: FRONTEND VERCEL ROUTES ===\n";
foreach ($frontendRoutes as $path) {
    $ch = curl_init($frontendBase . $path);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_NOBODY, true); // HEAD-like
    curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $passed = in_array($code, [200, 301, 302]);
    $status = $passed ? $PASS : $FAIL;
    $results[] = ['label' => "Frontend: $path", 'passed' => $passed, 'code' => $code, 'body' => ''];
    echo "[$status] Frontend: $path | HTTP $code\n";
}

// ──────────────────────────────────────────────────────────────
// SUMMARY
// ──────────────────────────────────────────────────────────────
echo "\n===========================================================\n";
echo "  PRODUCTION ACCEPTANCE TEST — FINAL SUMMARY\n";
echo "===========================================================\n";
$passed = array_filter($results, fn($r) => $r['passed']);
$failed = array_filter($results, fn($r) => !$r['passed']);
$total  = count($results);
$pCount = count($passed);
$fCount = count($failed);
echo "  Total : $total\n";
echo "  Passed: $pCount\n";
echo "  Failed: $fCount\n";
echo "  Pass % : " . round($pCount/$total*100, 1) . "%\n\n";

if ($fCount > 0) {
    echo "FAILED TESTS:\n";
    foreach ($failed as $r) {
        echo "  [FAIL] {$r['label']} (HTTP {$r['code']}) → {$r['body']}\n\n";
    }
}

file_put_contents(__DIR__ . '/prod_test_results_v2.json', json_encode($results, JSON_PRETTY_PRINT));
echo "\nResults saved to prod_test_results_v2.json\n";
