<?php
$pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=findmyinterior_testing', 'root', '');
$stmt = $pdo->query('SHOW PROCESSLIST');
while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    if($row['Command'] == 'Sleep' && $row['Time'] > 10) {
        $pdo->query('KILL ' . $row['Id']);
        echo 'Killed ' . $row['Id'] . PHP_EOL;
    }
}
