<?php

$source = new PDO('mysql:host=127.0.0.1;dbname=findmyinterior_legacy_restore;charset=utf8mb4', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

$destination = new PDO('mysql:host=127.0.0.1;dbname=findmyinterior_prod_candidate;charset=utf8mb4', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

echo "--- 4K.A Targeted Role Restoration ---\n";

// 1. Verify Destination is Zero
$destRolesCount = (int)$destination->query("SELECT COUNT(*) FROM roles")->fetchColumn();
$destUserRolesCount = (int)$destination->query("SELECT COUNT(*) FROM user_roles")->fetchColumn();

if ($destRolesCount !== 0 || $destUserRolesCount !== 0) {
    die("FATAL: Destination tables are not empty (roles: $destRolesCount, user_roles: $destUserRolesCount). Aborting.\n");
}
echo "Verified: Destination tables are empty.\n";

$destination->beginTransaction();

try {
    // 2. Fetch from source
    $roles = $source->query("SELECT * FROM roles")->fetchAll();
    $userRoles = $source->query("SELECT * FROM user_roles")->fetchAll();

    echo "Source data: " . count($roles) . " roles, " . count($userRoles) . " user_roles.\n";

    // 3. Insert into destination
    $roleStmt = $destination->prepare("INSERT INTO roles (id, name, slug, created_at, updated_at) VALUES (?, ?, ?, ?, ?)");
    foreach ($roles as $r) {
        $roleStmt->execute([$r['id'], $r['name'], $r['slug'], $r['created_at'], $r['updated_at']]);
    }

    $urStmt = $destination->prepare("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)");
    foreach ($userRoles as $ur) {
        $urStmt->execute([$ur['user_id'], $ur['role_id']]);
    }

    $destination->commit();
    echo "Restoration committed transactionally.\n\n";

} catch (Exception $e) {
    $destination->rollBack();
    die("Transaction failed: " . $e->getMessage() . "\n");
}

echo "--- 4K.B Role Assignment Verification ---\n";
// Re-fetch everything and compare directly
$sourceUR = $source->query("SELECT user_id, role_id FROM user_roles ORDER BY user_id, role_id")->fetchAll();
$destUR = $destination->query("SELECT user_id, role_id FROM user_roles ORDER BY user_id, role_id")->fetchAll();

if (count($sourceUR) !== count($destUR)) {
    die("Count mismatch! Source: " . count($sourceUR) . ", Dest: " . count($destUR) . "\n");
}

$matched = 0;
foreach ($sourceUR as $i => $sRow) {
    $dRow = $destUR[$i];
    if ($sRow['user_id'] == $dRow['user_id'] && $sRow['role_id'] == $dRow['role_id']) {
        $matched++;
    } else {
        echo "Mismatch at user_id " . $sRow['user_id'] . "\n";
    }
}

echo "Total Legacy User-Role Assignments: " . count($sourceUR) . "\n";
echo "Total Matched Candidate Assignments: $matched\n";

if ($matched === count($sourceUR)) {
    echo "✅ PASS: $matched / " . count($sourceUR) . " role assignments matched perfectly.\n";
} else {
    echo "❌ FAIL: Only $matched matches out of " . count($sourceUR) . ".\n";
}
