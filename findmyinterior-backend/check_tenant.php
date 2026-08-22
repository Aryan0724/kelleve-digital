<?php
$content = file_get_contents('database/migrations/truedial/2026_01_01_000000_create_truedial_database_schema.php');
echo (strpos($content, 'tenant_id') !== false) ? 'Yes' : 'No';
