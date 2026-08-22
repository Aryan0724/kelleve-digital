<?php
$file = 'd:\find my interior\findmyinterior-backend\app\Console\Commands\MigrationExecutionCommand.php';
$content = file_get_contents($file);
$content = str_replace("'project_quotes'", "'bids'", $content);
file_put_contents($file, $content);
echo "Updated file.\n";
