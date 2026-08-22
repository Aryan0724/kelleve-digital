<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
$conn = DB::connection('legacy_restore');

$projects = $conn->table('projects')->get();
$all_users = $conn->table('users')->pluck('id')->toArray(); // gets all rows in table, ignoring soft deletes since we use raw query builder

foreach ($projects as $proj) {
    if (!in_array($proj->user_id, $all_users)) {
        echo "Project {$proj->id} has missing user {$proj->user_id}\n";
    }
}
