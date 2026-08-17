<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = \App\Models\User::whereNotNull('avatar')->orWhereNotNull('cover_image')->get();
echo "USERS WITH AVATAR OR COVER:\n";
foreach ($users as $u) {
    echo "ID: {$u->id} | Name: {$u->name} | Avatar: {$u->avatar} | Cover: {$u->cover_image}\n";
}

$listings = \App\Models\Listing::whereNotNull('cover_image')->get();
echo "\nLISTINGS WITH COVER:\n";
foreach ($listings as $l) {
    echo "ID: {$l->id} | Title: {$l->title} | Cover: {$l->cover_image}\n";
}
