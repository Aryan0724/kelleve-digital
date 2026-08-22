<?php
$file = __DIR__ . '/database/migrations/truedial/2026_08_13_000001_create_truedial_database_schema.php';
$content = file_get_contents($file);
$content = str_replace("Schema::connection('truedial')", "Schema::connection('truedial_mysql')", $content);
file_put_contents($file, $content);
echo "Updated schema connection to truedial_mysql.";
