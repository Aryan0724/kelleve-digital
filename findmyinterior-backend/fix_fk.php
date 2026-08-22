<?php
$file = 'd:\find my interior\findmyinterior-backend\app\Console\Commands\MigrationExecutionCommand.php';
$content = file_get_contents($file);
$content = str_replace(
    "try {\n            \$dest->beginTransaction();",
    "try {\n            \$dest->statement('SET FOREIGN_KEY_CHECKS=0;');\n            \$dest->beginTransaction();",
    $content
);
$content = str_replace(
    "\$dest->commit();\n            \$this->info(\"Transaction committed successfully.\");",
    "\$dest->commit();\n            \$dest->statement('SET FOREIGN_KEY_CHECKS=1;');\n            \$this->info(\"Transaction committed successfully.\");",
    $content
);
file_put_contents($file, $content);
echo "Updated FK checks in MigrationExecutionCommand.php\n";
