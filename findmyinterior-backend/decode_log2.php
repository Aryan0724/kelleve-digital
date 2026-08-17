<?php
$lines = file('d:\find my interior\findmyinterior-backend\storage\logs\laravel.log');
$lastLine = array_pop($lines);
$json = json_decode($lastLine, true);
if (isset($json['context']['exception']['trace'])) {
    foreach (array_slice($json['context']['exception']['trace'], 0, 5) as $t) {
        if (isset($t['file'])) {
            echo "File: " . $t['file'] . " Line: " . $t['line'] . "\n";
        }
    }
}
