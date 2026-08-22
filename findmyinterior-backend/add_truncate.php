<?php
$file = 'd:\find my interior\findmyinterior-backend\app\Console\Commands\MigrationExecutionCommand.php';
$content = file_get_contents($file);
$old = "        try {\n            \$dest->statement('SET FOREIGN_KEY_CHECKS=0;');\n            \$dest->beginTransaction();";
$new = "        try {\n            \$dest->statement('SET FOREIGN_KEY_CHECKS=0;');\n            \$dest->table('wallet_transactions')->truncate();\n            \$dest->table('wallets')->truncate();\n            \$dest->table('contact_unlocks')->truncate();\n            \$dest->table('job_applications')->truncate();\n            \$dest->table('bids')->truncate();\n            \$dest->table('rfq_quotations')->truncate();\n            \$dest->table('worker_jobs')->truncate();\n            \$dest->table('rfqs')->truncate();\n            \$dest->table('projects')->truncate();\n            \$dest->table('users')->truncate();\n            \$dest->beginTransaction();";
$content = str_replace($old, $new, $content);
file_put_contents($file, $content);
echo "Added truncates.\n";
