<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

$c = Category::firstOrCreate(['slug'=>'restaurant'],['name'=>'Restaurant','type'=>'business']);
$u = User::firstOrCreate(
    ['email'=>'restaurant_owner@example.com'],
    ['name'=>'John Restaurant','password'=>bcrypt('password123'),'phone'=>'9876543210']
);

$l = \App\Models\Listing::where('user_id', $u->id)->first();
if (!$l) {
    $l = new \App\Models\Listing();
    $l->user_id = $u->id;
    $l->title = 'John Cafe';
    $l->description = 'A nice cafe';
    $l->phone = '9876543210';
    $l->address = 'Mumbai';
    $l->status = 'active';
    $l->category_id = $c->id;
    $l->save();
}

DB::table('category_listing')->updateOrInsert(
    ['listing_id' => $l->id, 'category_id' => $c->id]
);
echo "Done\n";
