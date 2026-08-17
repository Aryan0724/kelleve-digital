<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$categories = App\Models\Category::all();
echo "Categories:\n";
foreach ($categories as $cat) {
    echo "ID: {$cat->id}, Name: {$cat->name}, Slug: {$cat->slug}\n";
}
