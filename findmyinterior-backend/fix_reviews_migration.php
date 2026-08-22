<?php
$file = __DIR__ . '/database/migrations/fmi/2026_06_20_074748_update_reviews_for_projects.php';
$content = file_get_contents($file);
$content = str_replace("protected \$connection = 'fmi_mysql';", "protected \$connection = 'truedial_mysql';", $content);
$content = str_replace("->constrained('projects')->cascadeOnDelete()", "", $content);
$content = str_replace("->constrained('users')->cascadeOnDelete()", "", $content);
$content = preg_replace('/\$table->dropForeign\(\[[^\]]+\]\);/', '', $content); // Don't drop FKs if they don't exist
file_put_contents($file, $content);
rename($file, __DIR__ . '/database/migrations/truedial/2026_06_20_074748_update_reviews_for_projects.php');
echo "Moved and fixed update_reviews_for_projects.";
