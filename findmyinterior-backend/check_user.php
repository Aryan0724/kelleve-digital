<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'Aryantiwari@findmyinterior.com')
    ->orWhere('email', 'aryantiwari@findmyinterior.com')
    ->first();
if ($user) {
    echo "Found user: " . $user->email . "\n";
    echo "Password hash starts with: " . substr($user->password, 0, 10) . "\n";
    $match = \Illuminate\Support\Facades\Hash::check('findmyinterior', $user->password);
    echo "Password matches 'findmyinterior': " . ($match ? 'Yes' : 'No') . "\n";
} else {
    echo "User not found\n";
}
