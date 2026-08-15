<?php
define('LARAVEL_START', microtime(true));
require '/var/www/html/vendor/autoload.php';
$app = require_once '/var/www/html/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Create fresh token for Zee Interior (user 2306)
$user = App\Models\User::find(2306);
if (!$user) { echo "User not found\n"; exit; }

// Clean up old tokens
$user->tokens()->delete();

// Create fresh token
$token = $user->createToken('api-token');
echo $token->plainTextToken;
