<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

config(['database.connections.legacy_restore' => [
    'driver' => 'mysql',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '3306'),
    'database' => 'findmyinterior_legacy_restore',
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
]]);

DB::connection('legacy_restore')->table('storage_migrations')->truncate();
$tables = ['listing_galleries' => 'storage_url', 'listings' => 'cover_image_url', 'projects' => 'image_url', 'user_documents' => 'file_url', 'users' => 'avatar_url'];
foreach ($tables as $t => $c) {
    DB::connection('legacy_restore')->table($t)->update([$c => null]);
}
DB::connection('legacy_restore')->table('users')->update(['cover_image_url' => null]);
echo "Reset DB.\n";
