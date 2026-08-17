<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

foreach (\App\Models\Requirement::all() as $r) {
    if (is_string($r->target_roles)) {
        echo "ID: " . $r->id . " - target_roles is string: " . $r->target_roles . "\n";
    }
}
