<?php
require '/var/www/html/vendor/autoload.php';
$app = require '/var/www/html/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$app->boot();
$user = App\Models\User::where('role', 'admin')->orWhere('email', 'like', '%admin%')->first()
    ?? App\Models\User::first();
if ($user) {
    $token = $user->createToken('diag-token')->plainTextToken;
    echo "USER: " . $user->email . " | ROLE: " . $user->role . "\n";
    echo "TOKEN: " . $token . "\n";
} else {
    echo "No users found\n";
}
