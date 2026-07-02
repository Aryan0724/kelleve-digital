<?php
$env = [
    'DB_CONNECTION' => 'pgsql',
    'DB_HOST' => 'dpg-d8luoscvikkc73bu2pd0-a.oregon-postgres.render.com',
    'DB_PORT' => '5432',
    'DB_DATABASE' => 'findmyinterior_db',
    'DB_USERNAME' => 'findmyinterior_db_user',
    'DB_PASSWORD' => 'WIBm9aTAekpE9C8EqcBFaklLTJRUO6LD',
];

$descriptorspec = [
   0 => ["pipe", "r"],  
   1 => ["pipe", "w"],  
   2 => ["pipe", "w"]   
];

$process = proc_open('php artisan migrate --force', $descriptorspec, $pipes, __DIR__, $env);

if (is_resource($process)) {
    echo stream_get_contents($pipes[1]);
    echo stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    $return_value = proc_close($process);
    echo "command returned $return_value\n";
}
