<?php
// export_legacy_professionals.php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$legacyDb = \Illuminate\Support\Facades\DB::connection('legacy_restore');

$data = [
    'workers' => $legacyDb->table('workers')->get()->toArray(),
    'builders' => $legacyDb->table('builders')->get()->toArray(),
    'suppliers' => $legacyDb->table('suppliers')->get()->toArray(),
    'listings' => $legacyDb->table('listings')->get()->toArray(),
    'categories' => $legacyDb->table('categories')->get()->toArray(),
];

file_put_contents('legacy_professional_data.json', json_encode($data));
echo "Exported data successfully.\n";
