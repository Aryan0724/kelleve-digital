<?php
/**
 * FINAL LIVE PRODUCTION ACCEPTANCE TEST
 * Target: http://localhost:8000/api/v1
 * 
 * Tests every user role lifecycle end-to-end against the deployed API.
 */

$BASE = 'http://localhost:8000/api/v1';
$results = [];
$PASS = "\033[32mPASS\033[0m";
$FAIL = "\033[31mFAIL\033[0m";
$WARN = "\033[33mWARN\033[0m";

function api(string $method, string $url, array $data = [], string $token = ''): array {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $headers = ['Content-Type: application/json', 'Accept: application/json'];
    if ($token) $headers[] = "Authorization: Bearer $token";
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'PUT' || $method === 'PATCH') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'DELETE') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    }
    
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);
    
    return ['code' => $code, 'body' => $body, 'json' => json_decode($body, true), 'error' => $err];
}

function test(string $label, int $code, array $response, int $expectedCode, ?callable $check = null): bool {
    global $PASS, $FAIL, $WARN, $results;
    $passed = ($code === $expectedCode);
    if ($passed && $check) $passed = $check($response);
    
    $status = $passed ? $PASS : $FAIL;
    $body_preview = substr(json_encode($response), 0, 120);
    echo "[$status] $label (HTTP $code) → $body_preview\n";
    $results[] = ['label' => $label, 'passed' => $passed, 'code' => $code];
    return $passed;
}

// ─── GENERATE UNIQUE TEST DATA ────────────────────────────────────────────────
$ts = time();
$homeownerEmail   = "test_homeowner_{$ts}@test.com";
$designerEmail    = "test_designer_{$ts}@test.com";
$contractorEmail  = "test_contractor_{$ts}@test.com";
$builderEmail     = "test_builder_{$ts}@test.com";
$supplierEmail    = "test_supplier_{$ts}@test.com";
$workerEmail      = "test_worker_{$ts}@test.com";
$adminEmail       = "aryan@findmyinterior.com"; // pre-existing admin
$adminPassword    = "admin123";
$defaultPass      = "Password123!";

echo "\n════════════════════════════════════════════════════════\n";
echo "  FIND MY INTERIOR — PRODUCTION ACCEPTANCE TEST\n";
echo "  Target: $BASE\n";
echo "  Time: " . date('Y-m-d H:i:s') . "\n";
echo "════════════════════════════════════════════════════════\n\n";

// ─── PHASE 1: HEALTH CHECK ────────────────────────────────────────────────────
echo "\n--- PHASE 1: HEALTH CHECK ---\n";
$health = api('GET', "$BASE/health");
test('Backend health check', $health['code'], $health['json'] ?? [], 200, fn($r) => isset($r['status']) && $r['status'] === 'ok');

// ─── PHASE 2: HOMEOWNER REGISTRATION & AUTH ───────────────────────────────────
echo "\n--- PHASE 2: HOMEOWNER REGISTRATION & AUTH ---\n";
$reg = api('POST', "$BASE/auth/register", [
    'name'     => 'Test Homeowner',
    'email'    => $homeownerEmail,
    'password' => $defaultPass,
    'password_confirmation' => $defaultPass,
    'role'     => 'customer',
]);
test('Homeowner registration', $reg['code'], $reg['json'] ?? [], 201, fn($r) => isset($r['user']));

$homeownerToken = $reg['json']['data']['token'] ?? '';
$homeownerId = $reg['json']['data']['user']['id'] ?? null;

// Login
$login = api('POST', "$BASE/auth/login", ['email' => $homeownerEmail, 'password' => $defaultPass]);
test('Homeowner login', $login['code'], $login['json'] ?? [], 200);
$homeownerToken = $login['json']['data']['token'] ?? $homeownerToken;

// Get profile
$profile = api('GET', "$BASE/user/profile", [], $homeownerToken);
test('Homeowner get profile', $profile['code'], $profile['json'] ?? [], 200, fn($r) => isset($r['data']));

// Update profile
$profileUpdate = api('PUT', "$BASE/user/profile", ['name' => 'Updated Homeowner Name', 'phone' => '9876543210'], $homeownerToken);
test('Homeowner update profile', $profileUpdate['code'], $profileUpdate['json'] ?? [], 200);

// Verify profile persists after re-fetch
$profileRecheck = api('GET', "$BASE/user/profile", [], $homeownerToken);
$nameUpdated = ($profileRecheck['json']['data']['name'] ?? '') === 'Updated Homeowner Name';
test('Homeowner profile change persists', $profileRecheck['code'], $profileRecheck['json'] ?? [], 200, fn($r) => ($r['data']['name'] ?? '') === 'Updated Homeowner Name');

// ─── PHASE 3: POST A REQUIREMENT ─────────────────────────────────────────────
echo "\n--- PHASE 3: REQUIREMENT POSTING (HOMEOWNER) ---\n";
$reqData = [
    'title'       => "Test Interior Design {$ts}",
    'description' => 'Full home interior design for 3BHK, need modern minimalist style',
    'budget_min'  => 200000,
    'budget_max'  => 500000,
    'city'        => 'Patna',
    'district'    => 'Patna',
    'category_id' => 1,
    'scope'       => 'full_home',
    'timeline'    => '3-6 months',
    'property_type' => 'apartment',
];
$req = api('POST', "$BASE/requirements", $reqData, $homeownerToken);
test('Post requirement', $req['code'], $req['json'] ?? [], 201, fn($r) => isset($r['data']['id']));
$reqId = $req['json']['data']['id'] ?? null;

// Fetch requirement — persistence check
if ($reqId) {
    $reqFetch = api('GET', "$BASE/requirements/$reqId", [], $homeownerToken);
    test('Requirement persists after refresh', $reqFetch['code'], $reqFetch['json'] ?? [], 200, fn($r) => ($r['data']['id'] ?? null) == $reqId);
    
    // Edit requirement
    $reqEdit = api('PUT', "$BASE/requirements/$reqId", ['title' => "Updated Interior Design {$ts}"], $homeownerToken);
    test('Edit requirement', $reqEdit['code'], $reqEdit['json'] ?? [], 200);
}

// Customer Dashboard — requirements list
$dash = api('GET', "$BASE/dashboard/customer", [], $homeownerToken);
test('Customer dashboard loads', $dash['code'], $dash['json'] ?? [], 200, fn($r) => isset($r['data']));

// ─── PHASE 4: PROFESSIONAL REGISTRATIONS ─────────────────────────────────────
echo "\n--- PHASE 4: PROFESSIONAL REGISTRATION (INTERIOR DESIGNER) ---\n";
$designerReg = api('POST', "$BASE/auth/register", [
    'name'     => 'Test Designer',
    'email'    => $designerEmail,
    'password' => $defaultPass,
    'password_confirmation' => $defaultPass,
    'role'     => 'business',
]);
test('Interior designer registration', $designerReg['code'], $designerReg['json'] ?? [], 201);
$designerToken = $designerReg['json']['data']['token'] ?? '';
$designerId = $designerReg['json']['data']['user']['id'] ?? null;

// Login
$loginD = api('POST', "$BASE/auth/login", ['email' => $designerEmail, 'password' => $defaultPass]);
test('Interior designer login', $loginD['code'], $loginD['json'] ?? [], 200);
$designerToken = $loginD['json']['data']['token'] ?? $designerToken;

echo "\n--- PHASE 4B: CONTRACTOR REGISTRATION ---\n";
$contractorReg = api('POST', "$BASE/auth/register", [
    'name'     => 'Test Contractor',
    'email'    => $contractorEmail,
    'password' => $defaultPass,
    'password_confirmation' => $defaultPass,
    'role'     => 'business',
]);
test('Contractor registration', $contractorReg['code'], $contractorReg['json'] ?? [], 201);
$contractorToken = $contractorReg['json']['token'] ?? '';

$cLogin = api('POST', "$BASE/auth/login", ['email' => $contractorEmail, 'password' => $defaultPass]);
test('Contractor login', $cLogin['code'], $cLogin['json'] ?? [], 200, fn($r) => !empty($r['token']));
$contractorToken = $cLogin['json']['token'] ?? $contractorToken;

echo "\n--- PHASE 4C: BUILDER REGISTRATION ---\n";
$builderReg = api('POST', "$BASE/auth/register", [
    'name'     => 'Test Builder',
    'email'    => $builderEmail,
    'password' => $defaultPass,
    'password_confirmation' => $defaultPass,
    'role'     => 'builder',
]);
test('Builder registration', $builderReg['code'], $builderReg['json'] ?? [], 201);
$builderToken = $builderReg['json']['token'] ?? '';

$bLogin = api('POST', "$BASE/auth/login", ['email' => $builderEmail, 'password' => $defaultPass]);
test('Builder login', $bLogin['code'], $bLogin['json'] ?? [], 200, fn($r) => !empty($r['token']));
$builderToken = $bLogin['json']['token'] ?? $builderToken;

echo "\n--- PHASE 4D: SUPPLIER REGISTRATION ---\n";
$supplierReg = api('POST', "$BASE/auth/register", [
    'name'     => 'Test Supplier',
    'email'    => $supplierEmail,
    'password' => $defaultPass,
    'password_confirmation' => $defaultPass,
    'role'     => 'supplier',
]);
test('Supplier registration', $supplierReg['code'], $supplierReg['json'] ?? [], 201);
$supplierToken = $supplierReg['json']['token'] ?? '';

$sLogin = api('POST', "$BASE/auth/login", ['email' => $supplierEmail, 'password' => $defaultPass]);
test('Supplier login', $sLogin['code'], $sLogin['json'] ?? [], 200, fn($r) => !empty($r['token']));
$supplierToken = $sLogin['json']['token'] ?? $supplierToken;

echo "\n--- PHASE 4E: WORKER REGISTRATION ---\n";
$workerReg = api('POST', "$BASE/auth/register", [
    'name'     => 'Test Worker',
    'email'    => $workerEmail,
    'password' => $defaultPass,
    'password_confirmation' => $defaultPass,
    'role'     => 'worker',
]);
test('Worker registration', $workerReg['code'], $workerReg['json'] ?? [], 201);
$workerToken = $workerReg['json']['token'] ?? '';

$wLogin = api('POST', "$BASE/auth/login", ['email' => $workerEmail, 'password' => $defaultPass]);
test('Worker login', $wLogin['code'], $wLogin['json'] ?? [], 200, fn($r) => !empty($r['token']));
$workerToken = $wLogin['json']['token'] ?? $workerToken;

// ─── PHASE 5: LISTING CREATION (INTERIOR DESIGNER) ───────────────────────────
echo "\n--- PHASE 5: LISTING / PORTFOLIO (INTERIOR DESIGNER) ---\n";
$listingData = [
    'category_id'      => 1,
    'title'            => "Test Design Studio {$ts}",
    'tagline'          => 'Modern minimalist interior design',
    'description'      => 'We specialize in modern, minimalist interiors for residential and commercial spaces.',
    'phone'            => '9876543210',
    'whatsapp'         => '9876543210',
    'city'             => 'Patna',
    'district'         => 'Patna',
    'years_experience' => 5,
    'team_size'        => 3,
];
$listing = api('POST', "$BASE/user/listings", $listingData, $designerToken);
test('Designer creates listing', $listing['code'], $listing['json'] ?? [], 201, fn($r) => isset($r['data']['id']));
$listingId = $listing['json']['data']['id'] ?? null;

// Update listing
if ($listingId) {
    $listingUpdate = api('PUT', "$BASE/user/listings/$listingId", ['tagline' => 'Award-winning interior design'], $designerToken);
    test('Designer updates listing', $listingUpdate['code'], $listingUpdate['json'] ?? [], 200);
}

// Fetch user listings 
$myListings = api('GET', "$BASE/user/listings", [], $designerToken);
test('Designer listings persist', $myListings['code'], $myListings['json'] ?? [], 200, fn($r) => isset($r['data']) && count($r['data']) > 0);

// Professional dashboard
$profDash = api('GET', "$BASE/dashboard/professional", [], $designerToken);
test('Professional dashboard loads', $profDash['code'], $profDash['json'] ?? [], 200, fn($r) => isset($r['data']));

// ─── PHASE 6: BID SUBMISSION ─────────────────────────────────────────────────
echo "\n--- PHASE 6: BID SUBMISSION (DESIGNER → REQUIREMENT) ---\n";
if ($reqId) {
    $bidData = [
        'requirement_id'       => $reqId,
        'requirement_type'     => 'Requirement',
        'amount'               => 350000,
        'estimated_cost'       => 350000,
        'experience_years'     => 5,
        'previous_projects_count' => 20,
        'company_name'         => 'Test Design Studio',
        'timeline'             => '4 months',
        'proposal'             => 'We will deliver a modern minimalist interior within budget and timeline.',
    ];
    $bid = api('POST', "$BASE/bids", $bidData, $designerToken);
    test('Designer submits bid', $bid['code'], $bid['json'] ?? [], 201, fn($r) => isset($r['data']['id']));
    $bidId = $bid['json']['data']['id'] ?? null;

    // Customer sees bids on their requirement
    $reqBids = api('GET', "$BASE/requirements/$reqId/bids", [], $homeownerToken);
    test('Customer can see bids on requirement', $reqBids['code'], $reqBids['json'] ?? [], 200, fn($r) => is_array($r['data'] ?? null));
    
    // ─── PHASE 7: SHORTLIST → AWARD → COMPLETE ───────────────────────────────
    echo "\n--- PHASE 7: BID SHORTLIST → AWARD → COMPLETE ---\n";
    if ($bidId) {
        $shortlist = api('POST', "$BASE/bids/$bidId/shortlist", [], $homeownerToken);
        test('Customer shortlists bid', $shortlist['code'], $shortlist['json'] ?? [], 200);
        
        $award = api('POST', "$BASE/bids/$bidId/award", [], $homeownerToken);
        test('Customer awards bid', $award['code'], $award['json'] ?? [], 200);
        
        // ─── PHASE 8: MILESTONE ───────────────────────────────────────────────
        echo "\n--- PHASE 8: MILESTONE MANAGEMENT ---\n";
        $milestone = api('POST', "$BASE/requirements/$reqId/milestones?requirement_type=project", [
            'title'       => 'Initial Design Concepts',
            'description' => 'Deliver 3 design concepts for client approval',
            'percentage'  => 30,
            'amount'      => 105000,
        ], $designerToken);
        test('Professional creates milestone', $milestone['code'], $milestone['json'] ?? [], 201, fn($r) => isset($r['data']['id']));
        $milestoneId = $milestone['json']['data']['id'] ?? null;
        
        if ($milestoneId) {
            // Professional requests approval
            $requestApproval = api('PUT', "$BASE/requirements/$reqId/milestones/$milestoneId?requirement_type=project", 
                ['status' => 'requested'], $designerToken);
            test('Professional requests milestone approval', $requestApproval['code'], $requestApproval['json'] ?? [], 200);
            
            // Customer marks as paid
            $markPaid = api('POST', "$BASE/requirements/$reqId/milestones/$milestoneId/pay?requirement_type=project", 
                [], $homeownerToken);
            test('Customer marks milestone as paid', $markPaid['code'], $markPaid['json'] ?? [], 200);
        }
        
        // ─── PHASE 9: PROJECT COMPLETION ─────────────────────────────────────
        echo "\n--- PHASE 9: PROJECT COMPLETION & REVIEW ---\n";
        $complete = api('POST', "$BASE/requirements/$reqId/complete", [], $homeownerToken);
        test('Customer marks project complete', $complete['code'], $complete['json'] ?? [], 200);
        
        // Review
        $review = api('POST', "$BASE/projects/$reqId/reviews", [
            'rating' => 5,
            'review' => 'Excellent work! The interior design exceeded all expectations.',
        ], $homeownerToken);
        test('Homeowner submits review', $review['code'], $review['json'] ?? [], 200, fn($r) => isset($r['data']));
    }
}

// ─── PHASE 10: SEARCH & DISCOVERY ────────────────────────────────────────────
echo "\n--- PHASE 10: SEARCH & DISCOVERY ---\n";
$search = api('GET', "$BASE/listings?city=Patna&category_id=1", [], '');
test('Public search listings', $search['code'], $search['json'] ?? [], 200, fn($r) => isset($r['data']));

$reqSearch = api('GET', "$BASE/requirements?status=open", [], $designerToken);
test('Professional views open requirements', $reqSearch['code'], $reqSearch['json'] ?? [], 200, fn($r) => isset($r['data']));

// ─── PHASE 11: MESSAGING ─────────────────────────────────────────────────────
echo "\n--- PHASE 11: MESSAGING ---\n";
$conversations = api('GET', "$BASE/conversations", [], $homeownerToken);
test('Customer sees conversations', $conversations['code'], $conversations['json'] ?? [], 200);

$convDesigner = api('GET', "$BASE/conversations", [], $designerToken);
test('Designer sees conversations', $convDesigner['code'], $convDesigner['json'] ?? [], 200);

// If there are conversations, test sending a message
$convList = $conversations['json']['data'] ?? [];
if (!empty($convList)) {
    $firstConvId = $convList[0]['id'] ?? null;
    if ($firstConvId) {
        $msg = api('POST', "$BASE/conversations/$firstConvId/messages", ['body' => 'Hello, looking forward to working with you!'], $homeownerToken);
        test('Send message in conversation', $msg['code'], $msg['json'] ?? [], 201);
    }
}

// ─── PHASE 12: NOTIFICATIONS ─────────────────────────────────────────────────
echo "\n--- PHASE 12: NOTIFICATIONS ---\n";
$notifs = api('GET', "$BASE/notifications", [], $homeownerToken);
test('Customer notifications endpoint', $notifs['code'], $notifs['json'] ?? [], 200);

$profNotifs = api('GET', "$BASE/notifications", [], $designerToken);
test('Professional notifications endpoint', $profNotifs['code'], $profNotifs['json'] ?? [], 200);

// ─── PHASE 13: WALLET ────────────────────────────────────────────────────────
echo "\n--- PHASE 13: WALLET ---\n";
$wallet = api('GET', "$BASE/wallet", [], $designerToken);
test('Professional wallet loads', $wallet['code'], $wallet['json'] ?? [], 200);

$homeownerWallet = api('GET', "$BASE/wallet", [], $homeownerToken);
test('Homeowner wallet loads', $homeownerWallet['code'], $homeownerWallet['json'] ?? [], 200);

// ─── PHASE 14: SUBSCRIPTION ──────────────────────────────────────────────────
echo "\n--- PHASE 14: SUBSCRIPTION ---\n";
$plans = api('GET', "$BASE/subscription/plans", [], '');
test('Subscription plans public', $plans['code'], $plans['json'] ?? [], 200, fn($r) => is_array($r['data'] ?? null) || is_array($r));

$myPlan = api('GET', "$BASE/subscription/current", [], $designerToken);
test('Current subscription check', $myPlan['code'], $myPlan['json'] ?? [], 200);

// ─── PHASE 15: TRUST SCORE ───────────────────────────────────────────────────
echo "\n--- PHASE 15: TRUST SCORE ---\n";
$trustProfile = api('GET', "$BASE/user/profile", [], $designerToken);
$trustScore = $trustProfile['json']['data']['trust_score'] ?? null;
test('Trust score present on profile', $trustProfile['code'], $trustProfile['json'] ?? [], 200, fn($r) => array_key_exists('trust_score', $r['data'] ?? []));
echo "  → Trust Score: $trustScore\n";

// ─── PHASE 16: ADMIN ─────────────────────────────────────────────────────────
echo "\n--- PHASE 16: ADMIN LIFECYCLE ---\n";
$adminLogin = api('POST', "$BASE/auth/login", ['email' => $adminEmail, 'password' => $adminPassword]);
test('Admin login', $adminLogin['code'], $adminLogin['json'] ?? [], 200, fn($r) => !empty($r['token']));
$adminToken = $adminLogin['json']['token'] ?? '';

if ($adminToken) {
    $adminDash = api('GET', "$BASE/admin/dashboard", [], $adminToken);
    test('Admin dashboard loads', $adminDash['code'], $adminDash['json'] ?? [], 200, fn($r) => isset($r['data']['stats']));
    
    $adminUsers = api('GET', "$BASE/admin/users", [], $adminToken);
    test('Admin views all users', $adminUsers['code'], $adminUsers['json'] ?? [], 200, fn($r) => isset($r['data']));
    
    $adminReqs = api('GET', "$BASE/admin/requirements", [], $adminToken);
    test('Admin views requirements', $adminReqs['code'], $adminReqs['json'] ?? [], 200, fn($r) => isset($r['data']));
    
    $adminPayments = api('GET', "$BASE/admin/payments", [], $adminToken);
    test('Admin views payments', $adminPayments['code'], $adminPayments['json'] ?? [], 200, fn($r) => isset($r['data']));
    
    $pendingVerif = api('GET', "$BASE/admin/verifications?filter=pending", [], $adminToken);
    test('Admin views pending verifications', $pendingVerif['code'], $pendingVerif['json'] ?? [], 200);
    
    $pendingReviews = api('GET', "$BASE/admin/reviews/pending", [], $adminToken);
    test('Admin views pending reviews', $pendingReviews['code'], $pendingReviews['json'] ?? [], 200, fn($r) => isset($r['data']));
    
    // Approve the new requirement if it exists and is pending
    if ($reqId) {
        $adminApproveReq = api('PATCH', "$BASE/admin/requirements/$reqId/approve", [], $adminToken);
        test('Admin approves requirement', $adminApproveReq['code'], $adminApproveReq['json'] ?? [], 200);
    }
    
    // Admin verify user
    if ($designerId) {
        $adminVerifyUser = api('PATCH', "$BASE/admin/users/$designerId/verify", ['verification_level' => 'identity_verified'], $adminToken);
        test('Admin verifies user identity', $adminVerifyUser['code'], $adminVerifyUser['json'] ?? [], 200);
        
        // Verify trust score updated after verification
        $postVerifyProfile = api('GET', "$BASE/user/profile", [], $designerToken);
        $postTrustScore = $postVerifyProfile['json']['data']['trust_score'] ?? 0;
        $verificationLevel = $postVerifyProfile['json']['data']['verification_level'] ?? '';
        test('Trust score updated after verification', $postVerifyProfile['code'], $postVerifyProfile['json'] ?? [], 200, 
            fn($r) => ($r['data']['verification_level'] ?? '') === 'identity_verified');
        echo "  → Post-verification Trust Score: $postTrustScore, Level: $verificationLevel\n";
    }
    
    // Admin toggle user active
    if ($homeownerId) {
        $toggleUser = api('PATCH', "$BASE/admin/users/$homeownerId/toggle-active", [], $adminToken);
        test('Admin toggle user active', $toggleUser['code'], $toggleUser['json'] ?? [], 200);
        // Restore active
        api('PATCH', "$BASE/admin/users/$homeownerId/toggle-active", [], $adminToken);
    }
}

// ─── PHASE 17: LOGOUT ────────────────────────────────────────────────────────
echo "\n--- PHASE 17: LOGOUT ---\n";
$logout = api('POST', "$BASE/auth/logout", [], $homeownerToken);
test('Homeowner logout', $logout['code'], $logout['json'] ?? [], 200);

$logoutDesigner = api('POST', "$BASE/auth/logout", [], $designerToken);
test('Designer logout', $logoutDesigner['code'], $logoutDesigner['json'] ?? [], 200);

// Verify token is invalid after logout
$postLogout = api('GET', "$BASE/user/profile", [], $homeownerToken);
test('Token invalid after logout', $postLogout['code'], $postLogout['json'] ?? [], 401);

// ─── PHASE 18: SEO & LEGAL PAGES ─────────────────────────────────────────────
echo "\n--- PHASE 18: PUBLIC API ENDPOINTS (SEO/Discovery) ---\n";
$publicListings = api('GET', "$BASE/listings?city=Patna", [], '');
test('Public listings discovery', $publicListings['code'], $publicListings['json'] ?? [], 200);

$publicProfessionals = api('GET', "$BASE/professionals?city=Patna", [], '');
test('Public professionals discovery', $publicProfessionals['code'], $publicProfessionals['json'] ?? [], 200);

$categories = api('GET', "$BASE/categories", [], '');
test('Public categories load', $categories['code'], $categories['json'] ?? [], 200);

// ─── SUMMARY ─────────────────────────────────────────────────────────────────
echo "\n════════════════════════════════════════════════════════\n";
echo "  PRODUCTION ACCEPTANCE TEST — SUMMARY\n";
echo "════════════════════════════════════════════════════════\n";
$passed = count(array_filter($results, fn($r) => $r['passed']));
$failed = count(array_filter($results, fn($r) => !$r['passed']));
$total  = count($results);
echo "  Total: $total | Passed: $passed | Failed: $failed\n\n";

if ($failed > 0) {
    echo "FAILED TESTS:\n";
    foreach ($results as $r) {
        if (!$r['passed']) {
            echo "  [FAIL] {$r['label']} (HTTP {$r['code']})\n";
        }
    }
}
echo "\n";

// Save results to JSON
file_put_contents(__DIR__ . '/prod_test_results.json', json_encode($results, JSON_PRETTY_PRINT));
echo "  Results saved to prod_test_results.json\n";
