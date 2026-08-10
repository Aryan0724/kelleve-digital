<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$roles = App\Models\Role::all();
foreach ($roles as $r) {
    echo "Role: {$r->name}\n";
}
