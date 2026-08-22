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

$t = ['listing_galleries'=>'image_url','listings'=>'cover_image','projects'=>'image','user_documents'=>'file_path','users'=>'avatar'];
$c = 0; $b = 0;
foreach($t as $table => $col) {
    $rows = DB::connection('legacy_restore')->table($table)->get();
    foreach($rows as $row) {
        $val = $row->$col;
        if ($val && strlen($val) > 100 && !str_starts_with($val, 'http')) {
            $c++; $b += strlen($val);
        }
    }
}
$rows = DB::connection('legacy_restore')->table('users')->get();
foreach($rows as $row) {
    $val = $row->cover_image;
    if ($val && strlen($val) > 100 && !str_starts_with($val, 'http')) {
        $c++; $b += strlen($val);
    }
}

// Get Object sizes
$bytes = 0;
$count = 0;
$files = Illuminate\Support\Facades\Storage::disk('local')->allFiles('storage/migrated/blobs');
foreach($files as $file) {
    $bytes += Illuminate\Support\Facades\Storage::disk('local')->size($file);
    $count++;
}

// Get Migrations count
$migs = DB::connection('legacy_restore')->table('storage_migrations')->count();
$verified = DB::connection('legacy_restore')->table('storage_migrations')->where('status', 'VERIFIED')->count();

$urls = 0;
$url_t = ['listing_galleries'=>'storage_url','listings'=>'cover_image_url','projects'=>'image_url','user_documents'=>'file_url','users'=>'avatar_url'];
foreach($url_t as $table => $col) {
    $urls += DB::connection('legacy_restore')->table($table)->whereNotNull($col)->count();
}
$urls += DB::connection('legacy_restore')->table('users')->whereNotNull('cover_image_url')->count();

echo json_encode([
    'base64_records' => $c,
    'base64_bytes' => $b,
    'objects_count' => $count,
    'objects_bytes' => $bytes,
    'migrations_count' => $migs,
    'verified_count' => $verified,
    'urls_populated' => $urls
], JSON_PRETTY_PRINT);
