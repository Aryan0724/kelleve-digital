<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

Illuminate\Support\Facades\Storage::disk('local')->deleteDirectory('storage/migrated');
echo "Deleted storage/migrated\n";
