<?php
try {
    $db = new PDO('pgsql:host=dpg-d8luoscvikkc73bu2pd0-a.oregon-postgres.render.com;port=5432;dbname=findmyinterior_db;sslmode=require', 'findmyinterior_db_user', 'WIBm9aTAekpE9C8EqcBFaklLTJRUO6LD');
    $stmt = $db->query("SELECT id, title, status, professional_id, awarded_vendor_id, worker_id, supplier_id FROM projects WHERE status = 'awarded' LIMIT 1");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    print_r($result);
} catch (PDOException $e) {
    echo $e->getMessage();
}
