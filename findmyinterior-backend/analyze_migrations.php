<?php
$files = glob(__DIR__ . '/database/migrations/*.php');
$map = [];

foreach($files as $file) {
    $content = file_get_contents($file);
    preg_match_all('/Schema::create\(\'([^\']+)\'/', $content, $creates);
    foreach($creates[1] as $table) {
        $map[$table] = ['file' => basename($file), 'foreign_keys' => []];
        
        // Match standard foreign('col')->references('id')->on('table')
        preg_match_all('/foreign\(\'([^\']+)\'\)(?:.*?\-\>references\(\'[^\']+\'\))?(?:.*?\-\>on\(\'([^\']+)\'\))?/', $content, $fks);
        foreach($fks[1] as $idx => $fkCol) {
            if (!empty($fks[2][$idx])) {
                $map[$table]['foreign_keys'][] = ['column' => $fkCol, 'on' => $fks[2][$idx]];
            }
        }

        // Match constrained foreignId('user_id')->constrained('users') or ->constrained()
        preg_match_all('/foreignId\(\'([^\']+)\'\).*?constrained\((?:[\'"]([^\'"]+)[\'"])?\)/', $content, $constrained);
        foreach($constrained[1] as $idx => $fkCol) {
            $refTable = !empty($constrained[2][$idx]) ? $constrained[2][$idx] : '';
            if (empty($refTable)) {
                $refTable = str_replace('_id', 's', $fkCol);
                if ($refTable === 'categorys') $refTable = 'categories';
                if ($refTable === 'propertys') $refTable = 'properties';
                if ($refTable === 'business_ids') $refTable = 'businesses';
            }
            $map[$table]['foreign_keys'][] = ['column' => $fkCol, 'on' => $refTable];
        }
    }
}
file_put_contents('schema_analysis.json', json_encode($map, JSON_PRETTY_PRINT));
echo "Schema analysis saved to schema_analysis.json\n";
