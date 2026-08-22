<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$src = DB::connection('legacy_restore');

$proj = $src->table('projects')->where('id', 1)->first();
$bid = $src->table('bids')->where('id', 1)->first();

$critical_project_fields = ['awarded_bid_id', 'award_value', 'awarded_at', 'started_at', 'completed_at', 'image', 'image_url', 'awarded_vendor_id', 'winning_bid_id', 'professional_id'];
$critical_bid_fields = ['is_awarded', 'awarded_at', 'withdrawn_at', 'status', 'deleted_at'];
$relationship_fields = ['category_id', 'city_id', 'district_id', 'city', 'district'];

echo "=== Legacy Project #1 Critical Fields ===\n";
foreach ($critical_project_fields as $f) {
    echo "  $f = " . json_encode($proj->$f ?? null) . "\n";
}
echo "\n=== Legacy Project #1 Relationship Fields ===\n";
foreach ($relationship_fields as $f) {
    echo "  $f = " . json_encode($proj->$f ?? null) . "\n";
}
echo "\n=== Legacy Bid #1 Critical Fields ===\n";
foreach ($critical_bid_fields as $f) {
    echo "  $f = " . json_encode($bid->$f ?? null) . "\n";
}

// Cross check: what does the categories table look like for category_id from projects?
$cat_id = $proj->category_id;
if ($cat_id) {
    $cat = $src->table('categories')->where('id', $cat_id)->first();
    echo "\n=== Category #$cat_id (from legacy) ===\n";
    echo json_encode($cat) . "\n";
}

// Check city_id / district_id
$city_id = $proj->city_id;
echo "\n=== City #$city_id (from legacy) ===\n";
$legacy_tables = $src->select("SHOW TABLES")->map(function($r) { return array_values((array)$r)[0]; });
echo "Legacy Tables: " . $legacy_tables->implode(', ') . "\n";
if ($legacy_tables->contains('cities')) {
    $city = $src->table('cities')->where('id', $city_id)->first();
    echo json_encode($city) . "\n";
} else {
    echo "No 'cities' table in legacy.\n";
}
