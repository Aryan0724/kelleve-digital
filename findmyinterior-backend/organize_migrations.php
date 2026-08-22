<?php
$trueDialTables = [
    'listings', 'listing_galleries', 'media', 'offers', 'reviews', 'review_replies', 
    'review_helpful_votes', 'review_reports', 'privilege_cards', 'analytics_events', 
    'analytics_daily', 'consulting_leads', 'marketing_campaigns', 'truedial_invoices', 
    'saved_vendors', 'listing_products', 'listing_services', 'product_categories', 
    'service_categories', 'advertisement_stats'
];

$data = json_decode(file_get_contents('schema_analysis.json'), true);

@mkdir(__DIR__ . '/database/migrations/fmi', 0777, true);
@mkdir(__DIR__ . '/database/migrations/archive/truedial_legacy', 0777, true);
@mkdir(__DIR__ . '/database/migrations/archive/consolidated_auth', 0777, true);

// Move consolidated auth away since we aren't using a separate auth db
if (file_exists(__DIR__ . '/database/migrations/auth/2026_08_13_000001_create_auth_database_schema.php')) {
    rename(__DIR__ . '/database/migrations/auth/2026_08_13_000001_create_auth_database_schema.php', __DIR__ . '/database/migrations/archive/consolidated_auth/2026_08_13_000001_create_auth_database_schema.php');
}

$files = glob(__DIR__ . '/database/migrations/*.php');
foreach ($files as $file) {
    $basename = basename($file);
    
    // Check if this file exclusively creates TrueDial tables
    $isTrueDialLegacy = false;
    $createsTables = false;
    
    foreach ($data as $table => $info) {
        if ($info['file'] === $basename) {
            $createsTables = true;
            if (in_array($table, $trueDialTables)) {
                $isTrueDialLegacy = true;
            } else {
                $isTrueDialLegacy = false;
                break; // If it creates even one non-TrueDial table, it goes to FMI
            }
        }
    }
    
    // Also check for specific known TrueDial legacy files that might just alter tables
    if (strpos($basename, 'business_fields_to_listings') !== false ||
        strpos($basename, 'budget_tier_to_listings') !== false ||
        strpos($basename, 'click_metrics_to_listings') !== false ||
        strpos($basename, 'products_to_listings') !== false ||
        strpos($basename, 'is_cover_to_media') !== false ||
        strpos($basename, 'deleted_at_to_media') !== false ||
        strpos($basename, 'update_listings_for_monetization') !== false ||
        strpos($basename, 'update_reviews_schema') !== false ||
        strpos($basename, 'rating_breakdown_to_listings') !== false ||
        strpos($basename, 'update_offers_table') !== false ||
        strpos($basename, 'metadata_columns_to_analytics') !== false ||
        strpos($basename, 'type_and_video_url_to_listing_galleries') !== false ||
        strpos($basename, 'keywords_to_listings') !== false ||
        strpos($basename, 'media_fields_to_listing_galleries') !== false ||
        strpos($basename, 'image_url_nullable_in_listing_galleries') !== false ||
        strpos($basename, 'syndicated_listings') !== false) {
        $isTrueDialLegacy = true;
    }
    
    $content = file_get_contents($file);
    
    if ($isTrueDialLegacy) {
        // Move to archive since the consolidated TrueDial schema covers them without FKs
        rename($file, __DIR__ . '/database/migrations/archive/truedial_legacy/' . $basename);
    } else {
        // It's FMI/Shared/Auth. Move to fmi/ and inject connection
        $connection = 'fmi_mysql';
        if (preg_match('/protected\s+\$connection\s*=\s*[\'"][^\'"]+[\'"];/', $content)) {
            $content = preg_replace('/protected\s+\$connection\s*=\s*[\'"][^\'"]+[\'"];/', "protected \$connection = '{$connection}';", $content);
        } else {
            $content = preg_replace('/extends\s+Migration\s*\{/', "$0\n    protected \$connection = '{$connection}';", $content, 1);
        }
        file_put_contents(__DIR__ . '/database/migrations/fmi/' . $basename, $content);
        unlink($file);
    }
}

// Inject connection into TrueDial consolidated schema
$tdSchemaPath = __DIR__ . '/database/migrations/truedial/2026_08_13_000001_create_truedial_database_schema.php';
if (file_exists($tdSchemaPath)) {
    $content = file_get_contents($tdSchemaPath);
    if (!strpos($content, "protected \$connection = 'truedial_mysql';")) {
        $content = preg_replace('/extends\s+Migration\s*\{/', "$0\n    protected \$connection = 'truedial_mysql';", $content, 1);
        file_put_contents($tdSchemaPath, $content);
    }
}

echo "Migrations organized and connections injected.\n";
