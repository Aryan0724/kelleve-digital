<?php
$trueDialModels = [
    'Listing', 'ListingGallery', 'Media', 'Offer', 'Review', 'ReviewReply', 
    'ReviewHelpfulVote', 'ReviewReport', 'PrivilegeCard', 'AnalyticsEvent', 
    'AnalyticsDaily', 'ConsultingLead', 'MarketingCampaign', 'TruedialInvoice', 
    'SavedVendor', 'ListingProduct', 'ListingService', 'ProductCategory', 
    'ServiceCategory', 'AdvertisementStat'
];

$files = glob(__DIR__ . '/app/Models/*.php');
foreach ($files as $file) {
    $content = file_get_contents($file);
    $modelName = basename($file, '.php');
    
    $connection = in_array($modelName, $trueDialModels) ? 'truedial_mysql' : 'fmi_mysql';
    
    // If it already has a connection defined, replace it
    if (preg_match('/protected\s+\$connection\s*=\s*[\'"][^\'"]+[\'"];/', $content)) {
        $content = preg_replace('/protected\s+\$connection\s*=\s*[\'"][^\'"]+[\'"];/', "protected \$connection = '{$connection}';", $content);
    } else {
        // Otherwise inject it after the class declaration or use HasFactory;
        if (strpos($content, 'use HasFactory;') !== false) {
            $content = preg_replace('/use HasFactory;/', "use HasFactory;\n    protected \$connection = '{$connection}';", $content, 1);
        } else {
            // inject right after { of the class
            $content = preg_replace('/class\s+[^{]+\{/', "$0\n    protected \$connection = '{$connection}';", $content, 1);
        }
    }
    
    file_put_contents($file, $content);
}
echo "Models updated with explicit connections.\n";
