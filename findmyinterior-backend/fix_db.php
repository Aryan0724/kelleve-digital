<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

Illuminate\Support\Facades\DB::connection('fmi_mysql')->statement("ALTER TABLE payments MODIFY COLUMN purpose ENUM('wallet_recharge','subscription','premium_listing','featured_listing','lead_unlock') NOT NULL");
echo "Done\n";
