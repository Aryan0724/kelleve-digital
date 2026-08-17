<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$l = App\Models\Listing::first();
if ($l) {
    echo json_encode([
        'id' => $l->id,
        'tenant' => $l->tenant_id,
        'status' => $l->status,
        'verified' => $l->is_verified,
        'user_id' => $l->user_id,
        'role' => $l->user->role ?? null
    ]);
} else {
    echo "No listings found.";
}
