<?php
require __DIR__.'/vendor/autoload.php';

$token = "149|ebUXhEb4YNDznFlTezckjhLRs7YRFRdu3LebMY0Ubb7f90a7";
$baseUrl = "http://localhost:8000/api/v1";

function makeRequest($method, $url, $data = null) {
    global $token;
    $ch = curl_init($url);
    $headers = [
        "Authorization: Bearer $token",
        "Accept: application/json",
        "Content-Type: application/json"
    ];
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    if ($method !== 'GET') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    }
    
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

// 1. Notifications
$notifs = makeRequest('GET', "$baseUrl/notifications");
echo "=== NOTIFICATIONS ===\n";
print_r(array_slice($notifs['data'] ?? [], 0, 1));
echo "\n";

// 2. ProfileTab (Listings)
$listings = makeRequest('GET', "$baseUrl/user/listings");
echo "=== USER LISTINGS ===\n";
print_r(array_slice($listings['data'] ?? [], 0, 1));
echo "\n";

if (!empty($listings['data'])) {
    $listingId = $listings['data'][0]['id'];
    $updateListing = makeRequest('PUT', "$baseUrl/user/listings/$listingId", [
        'title' => 'Updated Title ' . time()
    ]);
    echo "=== UPDATE LISTING ===\n";
    echo ($updateListing['success'] ? "PASS" : "FAIL") . " - " . $updateListing['message'] . "\n\n";
}

// 3. Requirement Close/Reopen
// Create a requirement first to test
$req = makeRequest('POST', "$baseUrl/requirements", [
    'title' => 'Test Req',
    'description' => 'Test Desc',
    'category_id' => 1,
    'city' => 'Patna',
    'district' => 'Patna',
    'name' => 'Tester',
    'phone' => '9999999999'
]);

if (isset($req['data']['id'])) {
    $reqId = $req['data']['id'];
    echo "=== CLOSE REQUIREMENT ===\n";
    $close = makeRequest('PATCH', "$baseUrl/requirements/$reqId/status", ['status' => 'closed']);
    echo ($close['success'] ? "PASS - Status: " . $close['data']['status'] : "FAIL") . "\n";
    
    echo "=== REOPEN REQUIREMENT ===\n";
    $reopen = makeRequest('PATCH', "$baseUrl/requirements/$reqId/status", ['status' => 'open']);
    echo ($reopen['success'] ? "PASS - Status: " . $reopen['data']['status'] : "FAIL") . "\n\n";
}

// 4. Dynamic SEO Pages
$seo = makeRequest('GET', "$baseUrl/listings?category=interior-designers&city=patna");
echo "=== SEO PAGE FILTERS ===\n";
echo "Total matching: " . ($seo['meta']['total'] ?? 0) . "\n";
print_r(array_slice($seo['data'] ?? [], 0, 1));
echo "\n";

