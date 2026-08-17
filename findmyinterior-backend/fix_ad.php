<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$ad = \App\Models\Advertisement::where('title', 'like', '%30% Off Modular Kitchens%')->first();
if ($ad) {
    $ad->custom_code = '<a href="/materials" class="block w-full h-full hover:text-white group flex items-center justify-center"><span><span class="font-bold bg-white text-orange-600 px-2 py-0.5 rounded mr-2 uppercase text-xs">Flash Sale</span> 30% Off Modular Kitchens this week! <span class="underline ml-2 text-orange-100 group-hover:text-white">Shop Now</span></span></a>';
    $ad->save();
    echo "Successfully updated the advertisement!\n";
} else {
    echo "Advertisement not found!\n";
}
