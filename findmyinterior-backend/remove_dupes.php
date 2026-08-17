<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$dupes = App\Models\Listing::select('user_id')->groupBy('user_id')->havingRaw('count(*) > 1')->get();
foreach ($dupes as $d) {
    $keep = App\Models\Listing::where('user_id', $d->user_id)->orderBy('updated_at', 'desc')->first();
    App\Models\Listing::where('user_id', $d->user_id)->where('id', '!=', $keep->id)->delete();
}
echo "Duplicates removed.";
