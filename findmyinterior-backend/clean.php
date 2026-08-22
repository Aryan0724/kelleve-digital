<?php
$pdo=new PDO('mysql:host=127.0.0.1;port=3306;dbname=findmyinterior_testing','root',''); 
$pdo->exec('SET FOREIGN_KEY_CHECKS=0; TRUNCATE TABLE users; TRUNCATE TABLE listings; TRUNCATE TABLE workers; TRUNCATE TABLE contact_unlocks; TRUNCATE TABLE subscription_plans; TRUNCATE TABLE subscriptions; TRUNCATE TABLE categories; TRUNCATE TABLE role_user; TRUNCATE TABLE roles; SET FOREIGN_KEY_CHECKS=1;'); 
echo "Cleaned\n";
