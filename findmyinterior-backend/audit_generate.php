<?php
$schema = json_decode(file_get_contents('d:\find my interior\findmyinterior-backend\schema_check.json'), true);
$forensic = json_decode(file_get_contents('d:\find my interior\findmyinterior-backend\forensic_4H1.json'), true);

$legacy_project_cols = ['id', 'tenant_id', 'user_id', 'category_id', 'city_id', 'district_id', 'title', 'description', 'opportunity_type', 'requirement_type', 'creator_role', 'target_roles', 'project_category', 'project_type', 'budget_min', 'budget_max', 'budget_tier', 'views_count', 'city', 'district', 'name', 'phone', 'email', 'awarded_vendor_id', 'awarded_bid_id', 'award_value', 'awarded_at', 'deleted_at', 'created_at', 'updated_at', 'status', 'payment_status', 'unlock_price', 'winning_bid_id', 'professional_id', 'started_at', 'completed_at', 'image', 'image_url', 'expires_at', 'extensions_count', 'max_bids', 'max_unlocks'];

$legacy_bid_cols = ['id', 'requirement_id', 'requirement_type', 'professional_id', 'amount', 'timeline_days', 'warranty_months', 'material_included', 'labour_included', 'design_included', 'supervision_included', 'portfolio_urls', 'previous_projects_count', 'proposal_message', 'smart_bid_score', 'created_at', 'updated_at', 'deleted_at', 'status', 'is_awarded', 'awarded_at', 'revision_count', 'withdrawn_at', 'rejection_reason'];

$report_json = [];

function analyze_field($table, $field, $dest_table, $legacy_val) {
    global $schema;
    $dest_cols = $schema[$dest_table];
    
    if (in_array($field, $dest_cols)) {
        return null; // Preserved
    }
    
    $classification = '';
    $dest_repr = '';
    $rule = '';
    $preserved = '';
    $lost = '';
    $severity = 'LOW';
    
    // Geographical Relationships
    if (in_array($field, ['category_id', 'city_id', 'district_id'])) {
        $classification = 'REDUNDANT_SAFE_TO_DROP';
        $dest_repr = 'Denormalized string fields (city, district) exist in destination. Category relationships handled by new tag/relationship structures.';
        $rule = 'Drop integer IDs, rely on denormalized string values migrated';
        $preserved = 'City and district strings (which are present)';
        $lost = 'Legacy integer relational IDs';
    } 
    // Redundant User Fields on Projects
    elseif (in_array($field, ['name', 'phone', 'email'])) {
        $classification = 'REDUNDANT_SAFE_TO_DROP';
        $dest_repr = 'Stored in destination `users` table linked via `user_id`';
        $rule = 'Drop from project table, rely on user_id relational resolution';
        $preserved = 'User metadata via relation';
        $lost = 'None';
    } 
    // Obsolete Specialization Fields
    elseif (in_array($field, ['project_category', 'project_type', 'budget_min', 'budget_max', 'budget_tier'])) {
        if ($dest_table == 'worker_jobs') {
            $classification = 'OBSOLETE_BY_ARCHITECTURE';
            $dest_repr = 'WorkerJobs use `daily_rate` instead of complex budget tiers';
            $rule = 'Drop for worker_jobs domain';
            $preserved = 'None (Intentional schema design)';
            $lost = 'Legacy project budget ranges';
        }
    } 
    // Obsolete Bid Metadata
    elseif (in_array($field, ['warranty_months', 'material_included', 'labour_included', 'design_included', 'supervision_included', 'portfolio_urls', 'previous_projects_count', 'smart_bid_score', 'revision_count', 'rejection_reason'])) {
        $classification = 'OBSOLETE_BY_ARCHITECTURE';
        $dest_repr = 'Fields were removed in C1 architecture for Specialized Applications (Jobs/RFQs)';
        $rule = 'Drop for Job Applications / RFQ Quotations domains';
        $preserved = 'None (Intentional schema design)';
        $lost = 'Legacy bid metadata';
    }
    // Deletion tracking
    elseif ($field == 'deleted_at') {
        $classification = 'REDUNDANT_SAFE_TO_DROP';
        $dest_repr = 'Destination schema uses physical deletion for job_applications (or handles it differently)';
        $rule = 'Soft-deleted records are blocked during migration; existing records drop the column';
        $preserved = 'None';
        $lost = 'deleted_at timestamp';
    }
    // Award State Tracking (High/Critical)
    elseif (in_array($field, ['awarded_vendor_id', 'winning_bid_id', 'professional_id', 'worker_id', 'supplier_id'])) {
        $classification = 'TRANSFORMED_TO_OTHER_FIELD';
        if ($dest_table == 'worker_jobs') {
            $dest_repr = 'worker_jobs uses `worker_id` and `winning_application_id`';
            $rule = 'Map legacy awarded_vendor_id -> worker_id';
            $preserved = 'Winning Professional ID';
            $lost = 'None (must be explicitly mapped in migration)';
            $severity = 'HIGH';
        }
    } 
    elseif (in_array($field, ['is_awarded', 'awarded_at', 'withdrawn_at'])) {
        $classification = 'TRANSFORMED_TO_OTHER_FIELD';
        $dest_repr = 'Managed via `status` enum (e.g., accepted, withdrawn, rejected)';
        $rule = 'Map boolean/timestamps into discrete status string states';
        $preserved = 'Award/withdrawal state';
        $lost = 'Exact historical timestamp of the action';
        $severity = 'HIGH';
    }
    // Genuine Unresolved Data Loss
    elseif (in_array($field, ['awarded_bid_id', 'award_value', 'started_at', 'completed_at', 'image_url'])) {
        $classification = 'UNRESOLVED_DATA_LOSS';
        $dest_repr = 'No destination field handles this data';
        $rule = 'Currently dropped entirely by migration engine';
        $preserved = 'None';
        $lost = "Legacy business tracking data: {$field}";
        $severity = 'CRITICAL';
    } else {
        $classification = 'UNRESOLVED_DATA_LOSS';
        $dest_repr = 'Unknown';
        $rule = 'Dropped';
        $preserved = 'None';
        $lost = "Field data: {$field}";
        $severity = 'HIGH';
    }

    return [
        'source_table' => $table,
        'source_field' => $field,
        'source_value_count' => $legacy_val ? 1 : 0,
        'destination_representation' => $dest_repr,
        'transformation_rule' => $rule,
        'information_preserved' => $preserved,
        'information_lost' => $lost,
        'classification' => $classification,
        'severity' => $severity
    ];
}

foreach ($legacy_project_cols as $f) {
    $val = $forensic['legacy_parent_1'][$f] ?? null;
    $res = analyze_field('projects', $f, 'worker_jobs', $val);
    if ($res) $report_json[] = $res;
}

foreach ($legacy_bid_cols as $f) {
    $val = $forensic['legacy_bid_1'][$f] ?? null;
    $res = analyze_field('bids', $f, 'job_applications', $val);
    if ($res) $report_json[] = $res;
}

$basePath = 'C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\\';

file_put_contents($basePath . 'phase_4h3_field_loss_audit.json', json_encode($report_json, JSON_PRETTY_PRINT));

$md = "# Phase 4H.3 Field Loss Forensic Audit\n\n";
$md .= "| Table | Field | Classification | Severity | Lost Info | Dest Repr |\n";
$md .= "|---|---|---|---|---|---|\n";
foreach ($report_json as $item) {
    $md .= "| {$item['source_table']} | {$item['source_field']} | {$item['classification']} | {$item['severity']} | {$item['information_lost']} | {$item['destination_representation']} |\n";
}
file_put_contents($basePath . 'phase_4h3_field_loss_audit.md', $md);
echo "Audit generated.\n";
