<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

header('Content-Type: application/json');

$users = \App\Models\User::whereNotNull('avatar')->orWhereNotNull('cover_image')->get(['id', 'name', 'avatar', 'cover_image']);
$listings = \App\Models\Listing::whereNotNull('cover_image')->get(['id', 'title', 'cover_image', 'user_id']);

echo json_encode([
    'users_with_media' => $users,
    'listings_with_cover' => $listings,
    'user_2311' => \App\Models\User::find(2311) ? \App\Models\User::find(2311)->only(['id', 'name', 'avatar', 'cover_image']) : null,
    'listing_1635' => \App\Models\Listing::find(1635) ? \App\Models\Listing::find(1635)->only(['id', 'title', 'cover_image', 'images', 'user_id']) : null,
]);
