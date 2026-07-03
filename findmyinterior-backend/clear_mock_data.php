<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $userIds = \App\Models\User::where('is_mock', true)->pluck('id');
    if ($userIds->isEmpty()) {
        echo "No mock users to delete.\n";
        exit;
    }
    
    echo "Deleting data for " . $userIds->count() . " mock users...\n";

    \Illuminate\Support\Facades\DB::table('reviews')->whereIn('user_id', $userIds)->delete();
    \Illuminate\Support\Facades\DB::table('listings')->whereIn('user_id', $userIds)->delete();
    \Illuminate\Support\Facades\DB::table('workers')->whereIn('user_id', $userIds)->delete();
    \Illuminate\Support\Facades\DB::table('builders')->whereIn('user_id', $userIds)->delete();
    \Illuminate\Support\Facades\DB::table('suppliers')->whereIn('user_id', $userIds)->delete();
    \Illuminate\Support\Facades\DB::table('wallets')->whereIn('user_id', $userIds)->delete();
    \Illuminate\Support\Facades\DB::table('user_roles')->whereIn('user_id', $userIds)->delete();
    
    \App\Models\User::where('is_mock', true)->forceDelete();
    echo "Successfully deleted old mock data.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
