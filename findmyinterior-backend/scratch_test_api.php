<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== TESTING HOMEPAGE CONTROLLER ===" . PHP_EOL;
try {
    $ctrl = app(\App\Http\Controllers\Public\HomepageController::class);
    $res = $ctrl();
    echo "STATUS: " . $res->getStatusCode() . PHP_EOL;
    echo "SUCCESS: " . json_encode($res->getData(true)['success']) . PHP_EOL;
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . PHP_EOL;
    echo "FILE: " . $e->getFile() . ":" . $e->getLine() . PHP_EOL;
    echo $e->getTraceAsString() . PHP_EOL;
}

echo PHP_EOL . "=== TESTING USER DASHBOARD CONTROLLER (User #1) ===" . PHP_EOL;
try {
    $user = \App\Models\User::first();
    if ($user) {
        $req = \Illuminate\Http\Request::create('/api/v1/user/dashboard', 'GET');
        $req->setUserResolver(fn() => $user);
        $ctrl = app(\App\Http\Controllers\User\DashboardController::class);
        $res = $ctrl($req);
        echo "STATUS: " . $res->getStatusCode() . PHP_EOL;
        echo "DATA: " . json_encode(array_keys($res->getData(true)['data'] ?? [])) . PHP_EOL;
    } else {
        echo "No users found in database." . PHP_EOL;
    }
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . PHP_EOL;
    echo "FILE: " . $e->getFile() . ":" . $e->getLine() . PHP_EOL;
    echo $e->getTraceAsString() . PHP_EOL;
}
