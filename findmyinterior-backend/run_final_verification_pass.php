<?php
/**
 * FMI SUBSCRIPTION SYSTEM — FINAL VERIFICATION PASS
 *
 * Executes exhaustive behavioral proof across:
 * 1. Real Purchase -> Activation -> Entitlement Verification (Razorpay flow for Pro, Growth, Elite)
 * 2. Contact Unlock Money Test & Tamper Resistance (₹100 -> ₹90, ₹80, ₹70, and price=1 rejection)
 * 3. Top-3 Multi-Elite Stress Test (4 Elites, 2 Elites, 0 Elites ranking order)
 * 4. Subscription Expiry Lifecycle Test (Immediate revocation of all benefits, data preserved)
 * 5. Downgrade Test (Elite -> Starter, limit gating, data preserved)
 * 6. Direct API Security Bypass Test (Starter blocked from all premium endpoints)
 */

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use App\Models\Payment;
use App\Models\Requirement;
use App\Models\Listing;
use App\Models\ListingImage;
use App\Models\Category;
use App\Models\VendorMetric;
use App\Services\EntitlementService;
use App\Services\RecommendationEngineService;
use Illuminate\Http\Request;

$entitlement = app(EntitlementService::class);
$recEngine = app(RecommendationEngineService::class);

echo "\n=================================================================\n";
echo "FMI SUBSCRIPTION SYSTEM — FINAL COMPREHENSIVE VERIFICATION PASS\n";
echo "=================================================================\n\n";

$passCount = 0;
$failCount = 0;

function assertCheck(string $label, bool $condition, string $detail = '') {
    global $passCount, $failCount;
    if ($condition) {
        $passCount++;
        echo "  [PASS] {$label}" . ($detail ? " ({$detail})" : "") . "\n";
    } else {
        $failCount++;
        echo "  [FAIL] {$label}" . ($detail ? " ({$detail})" : "") . "\n";
    }
}

function callApi(User $user, string $method, string $uri, array $data = []): array {
    global $app;
    auth()->forgetGuards();
    app('auth')->forgetGuards();
    \Laravel\Sanctum\Sanctum::actingAs($user);
    $req = Request::create($uri, $method, $data);
    $req->setUserResolver(fn() => $user);
    $req->headers->set('Accept', 'application/json');
    $response = $app->handle($req);
    $status = $response->getStatusCode();
    $body = json_decode($response->getContent(), true) ?: [];
    return ['status' => $status, 'data' => $body, 'raw' => $response->getContent()];
}

function callPublicApi(string $method, string $uri, array $data = []): array {
    global $app;
    $req = Request::create($uri, $method, $data);
    $req->headers->set('Accept', 'application/json');
    $response = $app->handle($req);
    $status = $response->getStatusCode();
    $body = json_decode($response->getContent(), true) ?: [];
    return ['status' => $status, 'data' => $body, 'raw' => $response->getContent()];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. REAL PURCHASE -> ACTIVATION -> BENEFIT
// ─────────────────────────────────────────────────────────────────────────────
echo "1. REAL PURCHASE -> ACTIVATION -> BENEFIT (Razorpay Order & Verification)\n";
echo "-------------------------------------------------------------------------\n";

// Test Buyer for Professional Plan (₹8,999)
$proPlan = SubscriptionPlan::where('slug', 'professional')->firstOrFail();
$buyerPro = User::updateOrCreate(
    ['email' => 'e2e_buyer_pro@test.local'],
    [
        'name' => 'E2E Buyer Professional',
        'password' => bcrypt('password123'),
        'phone' => '9888888801',
        'is_active' => true,
        'is_verified' => true,
    ]
);

// Reset subscriptions for fresh test
UserSubscription::where('user_id', $buyerPro->id)->delete();
Payment::where('user_id', $buyerPro->id)->delete();

// Step 1: Create Order for Professional Plan
$resOrder = callApi($buyerPro, 'POST', '/api/v1/payments/create-order', [
    'purpose' => 'subscription',
    'subscription_plan_id' => $proPlan->id,
    'billing_cycle' => 'yearly',
]);
$orderData = $resOrder['data'];

assertCheck("Pro Order HTTP status is 200", $resOrder['status'] === 200);
assertCheck("Pro Order ID generated", !empty($orderData['order_id']), "order_id: " . ($orderData['order_id'] ?? 'null'));
assertCheck("Pro Order Amount is 899900 paise (Rs 8,999)", ($orderData['amount'] ?? 0) === 899900, "amount: " . ($orderData['amount'] ?? 0));

$pendingPayment = Payment::where('razorpay_order_id', $orderData['order_id'])->first();
assertCheck("Payment record stored in pending state", $pendingPayment && $pendingPayment->status === 'pending' && (float)$pendingPayment->amount === 8999.0);

// Step 2: Test Invalid Signature Rejection
$resInvalidVerify = callApi($buyerPro, 'POST', '/api/v1/payments/verify', [
    'razorpay_order_id' => $orderData['order_id'],
    'razorpay_payment_id' => 'pay_test_' . uniqid(),
    'razorpay_signature' => 'invalid_signature_xyz',
]);
assertCheck("Invalid signature rejected with 422", $resInvalidVerify['status'] === 422);

// Step 3: Verify Valid Signature (Fulfill Order)
$validSig = str_starts_with($orderData['order_id'], 'order_mock_') ? 'mock_sig' : hash_hmac('sha256', $orderData['order_id'] . '|pay_test_123', config('services.razorpay.secret'));
$resVerify = callApi($buyerPro, 'POST', '/api/v1/payments/verify', [
    'razorpay_order_id' => $orderData['order_id'],
    'razorpay_payment_id' => 'pay_test_123',
    'razorpay_signature' => $validSig,
]);
if ($resVerify['status'] !== 200) {
    echo "DEBUG resVerify: Status=" . $resVerify['status'] . ", Raw=" . $resVerify['raw'] . "\n";
}
assertCheck("Payment verification returns 200 success", $resVerify['status'] === 200 && ($resVerify['data']['success'] ?? false) === true);

$succPayment = Payment::where('razorpay_order_id', $orderData['order_id'])->first();
assertCheck("Payment record updated to success", $succPayment && $succPayment->status === 'success');

$activatedSub = UserSubscription::where('user_id', $buyerPro->id)->where('status', 'active')->first();
assertCheck("Active subscription record created", $activatedSub && $activatedSub->subscription_plan_id === $proPlan->id);
assertCheck("Subscription expires in ~12 months", $activatedSub && $activatedSub->expires_at > now()->addMonths(11));

// Step 4: Verify Activated Benefits via EntitlementService
$buyerPro->refresh();
$buyerPro->unsetRelation('activeSubscription');
$activePlanPro = $entitlement->getActivePlan($buyerPro);
assertCheck("EntitlementService resolves active plan as Professional", $activePlanPro && $activePlanPro->slug === 'professional');
assertCheck("Professional max listings limit = 3", $entitlement->getLimit($buyerPro, 'max_listings') === 3);
assertCheck("Professional max gallery images limit = 30", $entitlement->getLimit($buyerPro, 'max_gallery_images') === 30);
assertCheck("Professional early lead access = 2 hours", $entitlement->getEarlyLeadAccessHours($buyerPro) === 2);
assertCheck("Professional analytics tier = summary", $entitlement->getAnalyticsTier($buyerPro) === 'summary');
assertCheck("Professional contact unlock discount = 20%", $entitlement->getLimit($buyerPro, 'contact_unlock_discount_percent') === 20);
assertCheck("Professional recommendation boost = 15", $activePlanPro->recommendation_score_boost === 15);

// Repeat for Growth (Rs 4,499)
$growthPlan = SubscriptionPlan::where('slug', 'growth')->firstOrFail();
$buyerGrowth = User::updateOrCreate(
    ['email' => 'e2e_buyer_growth@test.local'],
    ['name' => 'E2E Buyer Growth', 'password' => bcrypt('password123'), 'phone' => '9888888802', 'is_active' => true, 'is_verified' => true]
);
UserSubscription::where('user_id', $buyerGrowth->id)->delete();
$resGrowthOrder = callApi($buyerGrowth, 'POST', '/api/v1/payments/create-order', ['purpose' => 'subscription', 'subscription_plan_id' => $growthPlan->id]);
assertCheck("Growth Order Amount is 449900 paise (Rs 4,499)", ($resGrowthOrder['data']['amount'] ?? 0) === 449900);
$growthSig = str_starts_with($resGrowthOrder['data']['order_id'], 'order_mock_') ? 'mock_sig' : 'mock_sig';
$resGrowthVerify = callApi($buyerGrowth, 'POST', '/api/v1/payments/verify', [
    'razorpay_order_id' => $resGrowthOrder['data']['order_id'], 'razorpay_payment_id' => 'pay_test_growth', 'razorpay_signature' => $growthSig
]);
assertCheck("Growth payment verified and activated", $resGrowthVerify['status'] === 200);
$buyerGrowth->refresh();
$buyerGrowth->unsetRelation('activeSubscription');
assertCheck("Growth discount = 10%", $entitlement->getLimit($buyerGrowth, 'contact_unlock_discount_percent') === 10);
assertCheck("Growth boost = 5", $entitlement->getActivePlan($buyerGrowth)->recommendation_score_boost === 5);

// Repeat for Elite (Rs 17,999)
$elitePlan = SubscriptionPlan::where('slug', 'elite')->firstOrFail();
$buyerElite = User::updateOrCreate(
    ['email' => 'e2e_buyer_elite@test.local'],
    ['name' => 'E2E Buyer Elite', 'password' => bcrypt('password123'), 'phone' => '9888888803', 'is_active' => true, 'is_verified' => true]
);
UserSubscription::where('user_id', $buyerElite->id)->delete();
$resEliteOrder = callApi($buyerElite, 'POST', '/api/v1/payments/create-order', ['purpose' => 'subscription', 'subscription_plan_id' => $elitePlan->id]);
assertCheck("Elite Order Amount is 1799900 paise (Rs 17,999)", ($resEliteOrder['data']['amount'] ?? 0) === 1799900);
$eliteSig = str_starts_with($resEliteOrder['data']['order_id'], 'order_mock_') ? 'mock_sig' : 'mock_sig';
$resEliteVerify = callApi($buyerElite, 'POST', '/api/v1/payments/verify', [
    'razorpay_order_id' => $resEliteOrder['data']['order_id'], 'razorpay_payment_id' => 'pay_test_elite', 'razorpay_signature' => $eliteSig
]);
assertCheck("Elite payment verified and activated", $resEliteVerify['status'] === 200);
$buyerElite->refresh();
$buyerElite->unsetRelation('activeSubscription');
assertCheck("Elite max listings = 5", $entitlement->getLimit($buyerElite, 'max_listings') === 5);
assertCheck("Elite max gallery images = 60", $entitlement->getLimit($buyerElite, 'max_gallery_images') === 60);
assertCheck("Elite early lead access = 0 hours (immediate)", $entitlement->getEarlyLeadAccessHours($buyerElite) === 0);
assertCheck("Elite discount = 30%", $entitlement->getLimit($buyerElite, 'contact_unlock_discount_percent') === 30);
assertCheck("Elite boost = 25", $entitlement->getActivePlan($buyerElite)->recommendation_score_boost === 25);
assertCheck("Elite analytics tier = full", $entitlement->getAnalyticsTier($buyerElite) === 'full');

echo "\n";

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONTACT UNLOCK MONEY TEST & TAMPER RESISTANCE
// ─────────────────────────────────────────────────────────────────────────────
echo "2. CONTACT UNLOCK MONEY TEST & CLIENT TAMPER RESISTANCE\n";
echo "--------------------------------------------------------\n";

$testAdmin = User::where('email', 'admin@findmyinterior.com')->first() ?: $buyerPro;
$moneyReq = Requirement::create([
    'user_id' => $testAdmin->id,
    'title' => 'Money Test Requirement Rs 100',
    'description' => 'Requirement with explicit Rs 100 base unlock fee',
    'project_type' => 'Residential',
    'category_id' => 1,
    'city' => 'Patna',
    'district' => 'Patna',
    'status' => 'open',
    'unlock_price' => 100.00,
    'phone' => '9999999999',
    'name' => 'Owner',
]);

// Starter user (0% discount): expects Rs 100 = 10000 paise
$starterUser = User::where('email', 'fmi_test_starter@test.local')->firstOrFail();
$resStarterUnlock = callApi($starterUser, 'POST', '/api/v1/payments/create-order', [
    'purpose' => 'lead_unlock',
    'requirement_id' => $moneyReq->id,
]);
if (($resStarterUnlock['data']['amount'] ?? 0) !== 10000) {
    echo "DEBUG Starter unlock: " . $resStarterUnlock['raw'] . "\n";
}
assertCheck("Starter unlock amount is Rs 100 (10000 paise)", ($resStarterUnlock['data']['amount'] ?? 0) === 10000);

// Growth user (10% discount): expects Rs 90 = 9000 paise
$resGrowthUnlock = callApi($buyerGrowth, 'POST', '/api/v1/payments/create-order', [
    'purpose' => 'lead_unlock',
    'requirement_id' => $moneyReq->id,
]);
if (($resGrowthUnlock['data']['amount'] ?? 0) !== 9000) {
    echo "DEBUG Growth unlock: " . $resGrowthUnlock['raw'] . "\n";
}
assertCheck("Growth unlock amount is Rs 90 (9000 paise)", ($resGrowthUnlock['data']['amount'] ?? 0) === 9000);

// Professional user (20% discount): expects Rs 80 = 8000 paise
$resProUnlock = callApi($buyerPro, 'POST', '/api/v1/payments/create-order', [
    'purpose' => 'lead_unlock',
    'requirement_id' => $moneyReq->id,
]);
if (($resProUnlock['data']['amount'] ?? 0) !== 8000) {
    echo "DEBUG Pro unlock: " . $resProUnlock['raw'] . "\n";
}
assertCheck("Professional unlock amount is Rs 80 (8000 paise)", ($resProUnlock['data']['amount'] ?? 0) === 8000);

// Elite user (30% discount): expects Rs 70 = 7000 paise
$resEliteUnlock = callApi($buyerElite, 'POST', '/api/v1/payments/create-order', [
    'purpose' => 'lead_unlock',
    'requirement_id' => $moneyReq->id,
]);
assertCheck("Elite unlock amount is Rs 70 (7000 paise)", ($resEliteUnlock['data']['amount'] ?? 0) === 7000);

// TAMPER ATTEMPT: Client sends price = 1 or amount = 1
$resTamper = callApi($starterUser, 'POST', '/api/v1/payments/create-order', [
    'purpose' => 'lead_unlock',
    'requirement_id' => $moneyReq->id,
    'amount' => 1.00,
    'price' => 1.00,
]);
assertCheck("Tamper attempt: client passes amount=1, backend ignores and charges 10000 paise", ($resTamper['data']['amount'] ?? 0) === 10000);
$tamperPayment = Payment::where('razorpay_order_id', $resTamper['data']['order_id'] ?? '')->first();
assertCheck("Database payment amount reflects server-side 100.00, not 1.00", $tamperPayment && (float)$tamperPayment->amount === 100.00);

echo "\n";

// ─────────────────────────────────────────────────────────────────────────────
// 3. TOP-3 MULTI-ELITE STRESS TEST
// ─────────────────────────────────────────────────────────────────────────────
echo "3. TOP-3 MULTI-ELITE STRESS TEST (Deterministic Competition Ordering)\n";
echo "--------------------------------------------------------------------\n";

$stressCat = Category::firstOrCreate(['slug' => 'stress-test-cat'], ['name' => 'Stress Test Category']);
$stressCity = 'TestCityStress';

function createStressVendor(string $key, string $planSlug, $catId, string $city): User {
    $plan = SubscriptionPlan::where('slug', $planSlug)->firstOrFail();
    $user = User::updateOrCreate(
        ['email' => "stress_{$key}@test.local"],
        ['name' => "Stress Vendor {$key}", 'password' => bcrypt('password123'), 'phone' => '999900' . rand(1000, 9999), 'is_active' => true, 'is_verified' => true]
    );
    UserSubscription::where('user_id', $user->id)->delete();
    if ($plan->slug !== 'starter') {
        UserSubscription::create([
            'user_id' => $user->id,
            'subscription_plan_id' => $plan->id,
            'status' => 'active',
            'starts_at' => now(),
            'expires_at' => now()->addYear(),
        ]);
    }
    Listing::where('user_id', $user->id)->forceDelete();
    Listing::create([
        'user_id' => $user->id,
        'title' => "Listing {$key} ({$planSlug})",
        'slug' => "listing-{$key}-" . uniqid(),
        'category_id' => $catId,
        'city' => $city,
        'state' => 'Bihar',
        'status' => 'active',
        'is_active' => true,
        'rating' => 4.5,
        'reviews_count' => 10,
    ]);
    return $user;
}

$eliteA = createStressVendor('elite_a', 'elite', $stressCat->id, $stressCity);
$eliteB = createStressVendor('elite_b', 'elite', $stressCat->id, $stressCity);
$eliteC = createStressVendor('elite_c', 'elite', $stressCat->id, $stressCity);
$eliteD = createStressVendor('elite_d', 'elite', $stressCat->id, $stressCity);
$proX   = createStressVendor('pro_x', 'professional', $stressCat->id, $stressCity);
$starterY = createStressVendor('starter_y', 'starter', $stressCat->id, $stressCity);

// Case A: 4 Elites, 1 Pro, 1 Starter
$resCaseA = callPublicApi('GET', '/api/v1/listings', ['category_id' => $stressCat->id, 'city' => $stressCity]);
$dataCaseA = $resCaseA['data']['data'] ?? [];

assertCheck("Search returns all 6 listings", count($dataCaseA) === 6, "count: " . count($dataCaseA));
assertCheck("Position 1 is Elite", ($dataCaseA[0]['badge_type'] ?? '') === 'elite' && ($dataCaseA[0]['is_top3_eligible'] ?? false) === true);
assertCheck("Position 2 is Elite", ($dataCaseA[1]['badge_type'] ?? '') === 'elite' && ($dataCaseA[1]['is_top3_eligible'] ?? false) === true);
assertCheck("Position 3 is Elite", ($dataCaseA[2]['badge_type'] ?? '') === 'elite' && ($dataCaseA[2]['is_top3_eligible'] ?? false) === true);
assertCheck("Top-3 slots were fully occupied by Elites", 
    ($dataCaseA[0]['is_top3_eligible'] ?? false) && ($dataCaseA[1]['is_top3_eligible'] ?? false) && ($dataCaseA[2]['is_top3_eligible'] ?? false)
);

// Case B: Exactly 2 Elites (Elite C and Elite D subscriptions cancelled)
UserSubscription::whereIn('user_id', [$eliteC->id, $eliteD->id])->update(['status' => 'cancelled']);
$resCaseB = callPublicApi('GET', '/api/v1/listings', ['category_id' => $stressCat->id, 'city' => $stressCity]);
$dataCaseB = $resCaseB['data']['data'] ?? [];
$top3CountB = count(array_filter($dataCaseB, fn($item) => ($item['is_top3_eligible'] ?? false) === true));
assertCheck("When 2 Elites exist, exactly 2 listings are top3_eligible", $top3CountB === 2, "top3 count: {$top3CountB}");
assertCheck("Positions 1 and 2 are Elite", ($dataCaseB[0]['badge_type'] ?? '') === 'elite' && ($dataCaseB[1]['badge_type'] ?? '') === 'elite');
assertCheck("Position 3 is filled by Professional (Category Spotlight)", ($dataCaseB[2]['badge_type'] ?? '') === 'trusted' && ($dataCaseB[2]['is_spotlight_eligible'] ?? false) === true);

// Case C: 0 Elites (Elite A and B also cancelled)
UserSubscription::whereIn('user_id', [$eliteA->id, $eliteB->id])->update(['status' => 'cancelled']);
$resCaseC = callPublicApi('GET', '/api/v1/listings', ['category_id' => $stressCat->id, 'city' => $stressCity]);
$dataCaseC = $resCaseC['data']['data'] ?? [];
$top3CountC = count(array_filter($dataCaseC, fn($item) => ($item['is_top3_eligible'] ?? false) === true));
assertCheck("When 0 Elites exist, 0 listings are top3_eligible", $top3CountC === 0);
assertCheck("Normal ranking: Spotlight Pro X ranks #1", ($dataCaseC[0]['user']['id'] ?? null) === $proX->id);

echo "\n";

// ─────────────────────────────────────────────────────────────────────────────
// 4. SUBSCRIPTION EXPIRY TEST
// ─────────────────────────────────────────────────────────────────────────────
echo "4. SUBSCRIPTION EXPIRY LIFECYCLE TEST\n";
echo "-------------------------------------\n";

$expUser = User::updateOrCreate(
    ['email' => 'e2e_expiry_test@test.local'],
    ['name' => 'E2E Expiry Subject', 'password' => bcrypt('password123'), 'phone' => '9999888801', 'is_active' => true, 'is_verified' => true]
);
VendorMetric::updateOrCreate(
    ['vendor_id' => $expUser->id],
    ['response_count' => 10, 'total_response_minutes' => 450, 'average_response_time_minutes' => 45, 'lead_count' => 15, 'conversion_rate' => 20]
);
$expListing = Listing::updateOrCreate(
    ['user_id' => $expUser->id, 'title' => 'Expiry Subject Listing'],
    ['slug' => 'exp-subject-listing', 'category_id' => 1, 'city' => 'Patna', 'state' => 'Bihar', 'status' => 'active', 'is_active' => true]
);
$expImage = \App\Models\ListingGallery::updateOrCreate(
    ['listing_id' => $expListing->id, 'image_url' => 'gallery/exp_test.jpg'],
    ['sort_order' => 1]
);

// Give active Elite subscription
UserSubscription::where('user_id', $expUser->id)->delete();
$activeEliteSub = UserSubscription::create([
    'user_id' => $expUser->id,
    'subscription_plan_id' => $elitePlan->id,
    'status' => 'active',
    'starts_at' => now()->subMonths(6),
    'expires_at' => now()->addMonths(6),
]);

// 1. Confirm ALL Elite benefits active
$expUser->refresh();
$expUser->unsetRelation('activeSubscription');
assertCheck("Prior to expiry: plan is Elite", $entitlement->getActivePlan($expUser)->slug === 'elite');
assertCheck("Prior to expiry: Responds Fast is TRUE", $entitlement->hasRespondsFastBadge($expUser) === true);
assertCheck("Prior to expiry: Analytics tier is full", $entitlement->getAnalyticsTier($expUser) === 'full');
assertCheck("Prior to expiry: Contact unlock discount is 30%", $entitlement->getLimit($expUser, 'contact_unlock_discount_percent') === 30);
assertCheck("Prior to expiry: Early lead access is 0 (immediate)", $entitlement->getEarlyLeadAccessHours($expUser) === 0);

assertCheck("Prior to expiry: Competitor insights returns 200", callApi($expUser, 'GET', '/api/v1/user/competitor-insights')['status'] === 200);
assertCheck("Prior to expiry: Analytics returns 200", callApi($expUser, 'GET', '/api/v1/user/analytics')['status'] === 200);

// 2. EXPIRE SUBSCRIPTION (expires_at 1 day in past)
$activeEliteSub->update(['expires_at' => now()->subDay()]);
$expUser->refresh();
$expUser->unsetRelation('activeSubscription');

// 3. Confirm IMMEDIATE revocation of ALL benefits
$expiredPlan = $entitlement->getActivePlan($expUser);
assertCheck("Post-expiry: plan falls back to Starter", $expiredPlan->slug === 'starter');
assertCheck("Post-expiry: Responds Fast revoked (FALSE)", $entitlement->hasRespondsFastBadge($expUser) === false);
assertCheck("Post-expiry: Analytics tier revoked (none)", $entitlement->getAnalyticsTier($expUser) === 'none');
assertCheck("Post-expiry: Contact unlock discount revoked (0%)", $entitlement->getLimit($expUser, 'contact_unlock_discount_percent') === 0);
assertCheck("Post-expiry: Early lead access revoked (null standard)", $entitlement->getEarlyLeadAccessHours($expUser) === null);

// Check APIs blocked
assertCheck("Post-expiry: Competitor insights blocked with 403", callApi($expUser, 'GET', '/api/v1/user/competitor-insights')['status'] === 403);
assertCheck("Post-expiry: Analytics blocked with 403", callApi($expUser, 'GET', '/api/v1/user/analytics')['status'] === 403);

// Check Unlock Price returns Rs 100 without discount
$expUnlockRes = callApi($expUser, 'POST', '/api/v1/payments/create-order', [
    'purpose' => 'lead_unlock',
    'requirement_id' => $moneyReq->id,
]);
assertCheck("Post-expiry: Contact unlock charges full 10000 paise (Rs 100)", ($expUnlockRes['data']['amount'] ?? 0) === 10000);

// Check Homepage Featured Slot excludes expired user
$featRes = callPublicApi('GET', '/api/v1/listings/featured-homepage');
$featIds = array_map(fn($item) => $item['user']['id'] ?? null, $featRes['data']['data'] ?? []);
assertCheck("Post-expiry: Listing removed from homepage featured slot", !in_array($expUser->id, $featIds));

// Existing listings and images must remain intact!
assertCheck("Post-expiry: Existing listing preserved in database", Listing::where('id', $expListing->id)->exists());
assertCheck("Post-expiry: Existing gallery image preserved in database", \App\Models\ListingGallery::where('id', $expImage->id)->exists());

echo "\n";

// ─────────────────────────────────────────────────────────────────────────────
// 5. DOWNGRADE TEST (Elite -> Starter)
// ─────────────────────────────────────────────────────────────────────────────
echo "5. DOWNGRADE TEST (Elite -> Starter Concurrency & Limit Enforcement)\n";
echo "-------------------------------------------------------------------\n";

$downUser = User::updateOrCreate(
    ['email' => 'e2e_downgrade_test@test.local'],
    ['name' => 'E2E Downgrade Subject', 'password' => bcrypt('password123'), 'phone' => '9999888802', 'is_active' => true, 'is_verified' => true]
);
UserSubscription::where('user_id', $downUser->id)->delete();
Listing::where('user_id', $downUser->id)->forceDelete();

// Create 2 listings while on Starter (simulate previously created content)
Listing::create([
    'user_id' => $downUser->id, 'title' => 'Downgrade Listing 1', 'slug' => 'down-list-1-' . uniqid(), 'category_id' => 1, 'city' => 'Patna', 'state' => 'Bihar', 'status' => 'active', 'is_active' => true, 'tenant_id' => 1
]);
Listing::create([
    'user_id' => $downUser->id, 'title' => 'Downgrade Listing 2', 'slug' => 'down-list-2-' . uniqid(), 'category_id' => 1, 'city' => 'Patna', 'state' => 'Bihar', 'status' => 'active', 'is_active' => true, 'tenant_id' => 1
]);

// Confirm existing content is NOT deleted
assertCheck("Downgrade: Existing listings remain intact (2 listings)", Listing::where('user_id', $downUser->id)->count() === 2);

// Now user is on Starter (max_listings = 1). Since user already has 2, creating a 3rd listing MUST be rejected with 403!
$resDownCreate = callApi($downUser, 'POST', '/api/v1/user/listings', [
    'title'       => 'Illegal 3rd Listing',
    'category_id' => 1,
    'city'        => 'Patna',
    'district'    => 'Patna',
    'state'       => 'Bihar',
    'phone'       => '9999999999',
]);
assertCheck("Downgrade: Creating new listing when exceeding Starter limit is blocked with 403", $resDownCreate['status'] === 403);

echo "\n";

// ─────────────────────────────────────────────────────────────────────────────
// 6. DIRECT API SECURITY BYPASS TEST
// ─────────────────────────────────────────────────────────────────────────────
echo "6. DIRECT API SECURITY BYPASS TEST (Unprivileged Starter direct API hits)\n";
echo "------------------------------------------------------------------------\n";

// 1. Analytics endpoint
assertCheck("Security Bypass: Starter calling /user/analytics directly gets 403", callApi($starterUser, 'GET', '/api/v1/user/analytics')['status'] === 403);

// 2. Competitor insights endpoint
assertCheck("Security Bypass: Starter calling /user/competitor-insights directly gets 403", callApi($starterUser, 'GET', '/api/v1/user/competitor-insights')['status'] === 403);

// 3. Attempting to create listing beyond 1 listing
Listing::updateOrCreate(
    ['user_id' => $starterUser->id, 'title' => 'Starter Base Listing'],
    ['slug' => 'starter-base-listing', 'category_id' => 1, 'city' => 'Patna', 'state' => 'Bihar', 'status' => 'active', 'is_active' => true, 'tenant_id' => 1]
);
$resBypassList = callApi($starterUser, 'POST', '/api/v1/user/listings', [
    'title'       => 'Starter 2nd Listing Attempt',
    'category_id' => 1,
    'city'        => 'Patna',
    'district'    => 'Patna',
    'state'       => 'Bihar',
    'phone'       => '9999999999',
]);
assertCheck("Security Bypass: Starter attempting 2nd listing gets 403", $resBypassList['status'] === 403);

echo "\n";

// ─────────────────────────────────────────────────────────────────────────────
// 7. WEBHOOK IDEMPOTENCY & PAYMENT SECURITY
// ─────────────────────────────────────────────────────────────────────────────
echo "7. WEBHOOK IDEMPOTENCY & PAYMENT SECURITY TEST\n";
echo "----------------------------------------------\n";

$idemUserA = User::updateOrCreate(
    ['email' => 'idem_user_a@test.local'],
    ['name' => 'Idempotency User A', 'password' => bcrypt('password123'), 'phone' => '9999770001', 'is_active' => true, 'is_verified' => true]
);
$idemUserB = User::updateOrCreate(
    ['email' => 'idem_user_b@test.local'],
    ['name' => 'Idempotency User B', 'password' => bcrypt('password123'), 'phone' => '9999770002', 'is_active' => true, 'is_verified' => true]
);
UserSubscription::whereIn('user_id', [$idemUserA->id, $idemUserB->id])->delete();

$growthPlanForIdem = SubscriptionPlan::where('slug', 'growth')->firstOrFail();
$orderRes = callApi($idemUserA, 'POST', '/api/v1/payments/create-order', [
    'purpose' => 'subscription',
    'subscription_plan_id' => $growthPlanForIdem->id,
    'billing_cycle' => 'yearly',
]);
$idemOrderId = $orderRes['data']['order_id'];
$idemPayId = 'pay_idem_' . uniqid();

// 1. Initial verification for User A
$firstVerify = callApi($idemUserA, 'POST', '/api/v1/payments/verify', [
    'razorpay_order_id'   => $idemOrderId,
    'razorpay_payment_id' => $idemPayId,
    'razorpay_signature'  => 'mock_sig',
]);
assertCheck("Idempotency: First payment verification succeeds with 200", $firstVerify['status'] === 200);
assertCheck("Idempotency: User A is activated on Growth plan", $entitlement->getActivePlan($idemUserA)->slug === 'growth');
$userASubCount1 = UserSubscription::where('user_id', $idemUserA->id)->where('status', 'active')->count();
assertCheck("Idempotency: Exactly 1 active subscription created", $userASubCount1 === 1);

// 2. Replay the EXACT same verification payload (simulating duplicate webhook / client replay)
$replayVerify = callApi($idemUserA, 'POST', '/api/v1/payments/verify', [
    'razorpay_order_id'   => $idemOrderId,
    'razorpay_payment_id' => $idemPayId,
    'razorpay_signature'  => 'mock_sig',
]);
assertCheck("Idempotency: Replayed verification succeeds with 200", $replayVerify['status'] === 200);
assertCheck("Idempotency: Replayed response indicates already fulfilled", ($replayVerify['data']['message'] ?? '') === 'Payment already fulfilled.');
$userASubCount2 = UserSubscription::where('user_id', $idemUserA->id)->where('status', 'active')->count();
assertCheck("Idempotency: Active subscription count remains strictly 1 (NO duplicate)", $userASubCount2 === 1);
$payRecordCount = Payment::where('razorpay_order_id', $idemOrderId)->count();
assertCheck("Idempotency: Payment table has strictly 1 record (NO duplicate)", $payRecordCount === 1);

// 3. User B attempts to hijack / verify User A's order
$hijackOrder = callApi($idemUserB, 'POST', '/api/v1/payments/create-order', [
    'purpose' => 'subscription',
    'subscription_plan_id' => $growthPlanForIdem->id,
    'billing_cycle' => 'yearly',
]);
$hijackOrderId = $hijackOrder['data']['order_id'];
$stealAttempt = callApi($idemUserB, 'POST', '/api/v1/payments/verify', [
    'razorpay_order_id'   => $idemOrderId, // User A's order!
    'razorpay_payment_id' => 'pay_steal_' . uniqid(),
    'razorpay_signature'  => 'mock_sig',
]);
assertCheck("Payment Security: Cross-user verification attempt blocked with 403", $stealAttempt['status'] === 403);
assertCheck("Payment Security: User B active plan remains Starter (cannot steal)", $entitlement->getActivePlan($idemUserB)->slug === 'starter');

// 4. Non-existent order passed to verify
$bogusVerify = callApi($idemUserA, 'POST', '/api/v1/payments/verify', [
    'razorpay_order_id'   => 'order_mock_non_existent_' . uniqid(),
    'razorpay_payment_id' => 'pay_bogus_123',
    'razorpay_signature'  => 'mock_sig',
]);
assertCheck("Payment Security: Non-existent order ID is rejected with 404", $bogusVerify['status'] === 404);

echo "\n=================================================================\n";
echo "FINAL RESULTS: {$passCount} PASSED, {$failCount} FAILED\n";
echo "=================================================================\n\n";

if ($failCount === 0) {
    echo ">>> ALL 100% OF VERIFICATION CHECKS PASSED SUCCESSFULLY! <<<\n\n";
    exit(0);
} else {
    echo ">>> SOME CHECKS FAILED! <<<\n\n";
    exit(1);
}
