<?php
$data = json_decode(file_get_contents('schema_analysis.json'), true);
print_r($data['reviews']);
