<?php
$logs = file_get_contents('http://localhost:8000/api/v1/debug-logs?key=aryan123');
file_put_contents('render_logs.txt', $logs);
echo "Logs fetched: " . strlen($logs) . " bytes\n";
