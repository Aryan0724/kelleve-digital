<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$notifications = \Illuminate\Support\Facades\DB::table('notifications')->orderBy('created_at', 'desc')->limit(10)->get();
echo "Total notifications in DB: " . \Illuminate\Support\Facades\DB::table('notifications')->count() . "\n";
foreach ($notifications as $n) {
    echo "ID: {$n->id} | User: {$n->notifiable_id} | Type: {$n->type} | Created: {$n->created_at}\n";
    echo "Data: " . substr($n->data, 0, 100) . "...\n";
}
