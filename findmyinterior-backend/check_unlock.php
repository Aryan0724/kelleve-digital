<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
$base = ['driver'=>'mysql','host'=>env('DB_HOST','127.0.0.1'),'port'=>env('DB_PORT','3306'),'username'=>env('DB_USERNAME','root'),'password'=>env('DB_PASSWORD','')];
Config::set('database.connections.legacy_migrated', array_merge($base, ['database'=>'findmyinterior_legacy_migrated']));
DB::purge('legacy_migrated');
$src = DB::connection('legacy_restore');
$dest = DB::connection('legacy_migrated');

$legacy = $src->table('contact_unlocks')->get();
foreach ($legacy as $u) {
    $m = $dest->table('contact_unlocks')->where('id', $u->id)->first();
    $q = $dest->table('quarantine_unlocks')->where('legacy_unlock_id', $u->id)->first();
    if (!$m && !$q) {
        echo 'Missing unlock: ' . json_encode($u) . PHP_EOL;
    }
}
