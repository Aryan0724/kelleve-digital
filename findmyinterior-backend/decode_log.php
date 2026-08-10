<?php
$lines = file('d:\find my interior\findmyinterior-backend\storage\logs\laravel.log');
$lastLine = array_pop($lines);
$json = json_decode($lastLine, true);
if (isset($json['context']['exception'])) {
    $e = $json['context']['exception'];
    echo "Message: " . $e['message'] . "\n";
    echo "File: " . $e['file'] . "\n";
}
