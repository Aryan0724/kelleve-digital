<?php
$lines = file('d:\find my interior\findmyinterior-backend\storage\logs\laravel.log');
$lastLine = array_pop($lines);
$json = json_decode($lastLine, true);
file_put_contents('d:\find my interior\findmyinterior-backend\trace_output.txt', print_r($json['context']['exception']['trace'] ?? [], true));
