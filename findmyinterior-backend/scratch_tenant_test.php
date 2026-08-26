<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
try {
    $tenants = \App\Models\Tenant::all();
    echo "Count: " . $tenants->count() . "\n";
    foreach ($tenants as $t) {
        echo "ID: {$t->id}, Domain: {$t->domain}\n";
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
