<?php
// PHP script to test bidding and notifications
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Requirement;
use App\Models\Bid;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\BidController;

$user = clone User::where('id', '>', 2)->first();
$user->is_verified = true;
$user->verification_level = 'elite_professional';
$user->save();
Auth::login($user);

$requirement = Requirement::where('status', 'open')->first();

if (!$requirement) {
    echo "No open requirement found.\n";
    exit;
}

$request = Request::create('/api/v1/projects/' . $requirement->id . '/bids', 'POST', [
    'requirement_id' => $requirement->id,
    'amount' => 5000,
    'proposal' => 'I can do this!',
    'estimated_days' => 10
]);
$request->setUserResolver(function () use ($user) {
    return $user;
});

$controller = app()->make(BidController::class);
$response = $controller->store($request, $requirement->id);

echo "Bid Response Status: " . $response->getStatusCode() . "\n";
echo "Bid Response Content: " . $response->getContent() . "\n";
