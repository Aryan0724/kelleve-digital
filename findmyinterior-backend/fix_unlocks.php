<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\ContactUnlock;
use Illuminate\Support\Facades\DB;

$affected = ContactUnlock::where('requirement_type', 'App\Models\Requirement')
    ->whereNotExists(function ($query) {
        $query->select(DB::raw(1))
            ->from('requirements')
            ->whereColumn('requirements.id', 'contact_unlocks.requirement_id');
    })
    ->update(['requirement_type' => 'App\Models\WorkerJob']);

echo "Fixed $affected records.\n";
