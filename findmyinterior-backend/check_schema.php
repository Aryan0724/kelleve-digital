<?php
$file = 'database/migrations/truedial/2026_08_13_000001_create_truedial_database_schema.php';
$content = file_get_contents($file);
if (strpos($content, 'project_id') !== false) { echo 'Has project_id'; } else { echo 'No project_id'; }
