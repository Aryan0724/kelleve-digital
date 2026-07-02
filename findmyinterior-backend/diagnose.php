<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Find admins
$admins = App\Models\User::where('role', 'admin')
    ->orWhere('is_admin', true)
    ->get(['id','email','name','role','is_admin']);
echo "ADMIN USERS:\n";
foreach ($admins as $a) {
    echo "ID:{$a->id} Email:{$a->email} Role:{$a->role} IsAdmin:{$a->is_admin}\n";
}

// Check auth response structure
echo "\nLOGIN RESPONSE KEYS:\n";
$authController = new App\Http\Controllers\Auth\AuthController();
$request = Illuminate\Http\Request::create('/api/v1/auth/login', 'POST', [
    'email' => $admins->first()->email ?? 'none',
    'password' => 'test'
]);
// Just show what the token structure would be
echo "Token is returned under: data.token\n";

// Check routes registered
$router = app('router');
$routes = $router->getRoutes();
$bidsShortlist = false;
foreach ($routes as $route) {
    if (strpos($route->uri(), 'shortlist') !== false) {
        echo "SHORTLIST ROUTE: " . implode('|', $route->methods()) . " " . $route->uri() . "\n";
        $bidsShortlist = true;
    }
}
if (!$bidsShortlist) echo "NO SHORTLIST ROUTE FOUND\n";

// Check bids award route
foreach ($routes as $route) {
    if (strpos($route->uri(), 'award') !== false) {
        echo "AWARD ROUTE: " . implode('|', $route->methods()) . " " . $route->uri() . "\n";
    }
}
// Check projects reviews route
foreach ($routes as $route) {
    if (strpos($route->uri(), 'review') !== false) {
        echo "REVIEW ROUTE: " . implode('|', $route->methods()) . " " . $route->uri() . "\n";
    }
}

// Check milestones pay route
foreach ($routes as $route) {
    if (strpos($route->uri(), 'pay') !== false) {
        echo "PAY ROUTE: " . implode('|', $route->methods()) . " " . $route->uri() . "\n";
    }
}
