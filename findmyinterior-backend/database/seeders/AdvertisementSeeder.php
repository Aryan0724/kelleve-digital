<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Advertisement;

class AdvertisementSeeder extends Seeder
{
    public function run(): void
    {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        Advertisement::truncate();
        \App\Models\AdvertisementStat::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
        
        $ads = [
            // Top Ribbon
            [
                'title' => 'Flash Sale: 30% Off Modular Kitchens this week!',
                'location' => 'top_ribbon',
                'media_type' => 'html',
                'custom_code' => '<a href="/materials" class="block w-full h-full hover:text-white group flex items-center justify-center"><span><span class="font-bold bg-white text-orange-600 px-2 py-0.5 rounded mr-2 uppercase text-xs">Flash Sale</span> 30% Off Modular Kitchens this week! <span class="underline ml-2 text-orange-100 group-hover:text-white">Shop Now</span></span></a>',
                'is_active' => true,
                'priority' => 1,
            ],
            // Popup Ad
            [
                'title' => 'Join our Premium Designer Network',
                'location' => 'popup',
                'banner_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
                'media_type' => 'image',
                'link' => '/register',
                'target_role' => null,
                'is_active' => true,
                'priority' => 1,
            ],
            // Hero Banner
            [
                'title' => 'Transform Your Living Space',
                'location' => 'hero_banner',
                'banner_url' => 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=300&fit=crop',
                'media_type' => 'image',
                'link' => '/professionals',
                'target_role' => null,
                'is_active' => true,
                'priority' => 1,
            ],
            // Mid Page (Targeted at homeowners)
            [
                'title' => 'Hire Top Interior Designers for your 3BHK',
                'location' => 'mid_page',
                'banner_url' => 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=300&fit=crop',
                'media_type' => 'image',
                'link' => '/professionals',
                'target_role' => 'customer',
                'is_active' => true,
                'priority' => 1,
            ],
            // Mid Page (Targeted at professionals)
            [
                'title' => 'Sponsored: Buy Bulk Plywood at 20% Off',
                'location' => 'mid_page',
                'banner_url' => 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=1200&h=300&fit=crop',
                'media_type' => 'image',
                'link' => '/materials',
                'target_role' => 'interior_designer',
                'is_active' => true,
                'priority' => 1,
            ],
            // Between Categories
            [
                'title' => 'Need Civil Contractors?',
                'location' => 'between_categories',
                'banner_url' => 'https://images.unsplash.com/photo-1504307651254-35680f356f12?w=1200&h=300&fit=crop',
                'media_type' => 'image',
                'link' => '/professionals',
                'target_role' => null,
                'is_active' => true,
                'priority' => 1,
            ],
            // Search Feed
            [
                'title' => 'Featured Premium Listing',
                'location' => 'search_feed',
                'banner_url' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=200&fit=crop',
                'media_type' => 'image',
                'link' => '/professionals',
                'target_role' => null,
                'is_active' => true,
                'priority' => 1,
            ],
            // Right Sidebar
            [
                'title' => 'Advertise with us',
                'location' => 'right_sidebar',
                'media_type' => 'html',
                'custom_code' => '<div class="w-full h-full min-h-[600px] bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl flex flex-col items-center justify-center p-8 text-center space-y-4"><h3 class="text-2xl font-bold text-orange-400">Grow Your Business</h3><p class="text-slate-300">Reach thousands of homeowners actively looking for interior design services.</p><a href="/contact" class="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors mt-4">Start Advertising</a></div>',
                'target_role' => null,
                'is_active' => true,
                'priority' => 1,
            ],
            // Native Blog
            [
                'title' => 'Read Our Guide on Vastu',
                'location' => 'native_blog',
                'banner_url' => 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=800&h=200&fit=crop',
                'media_type' => 'image',
                'link' => '/blog',
                'target_role' => null,
                'is_active' => true,
                'priority' => 1,
            ],
            // Before Footer
            [
                'title' => 'Trusted Partners',
                'location' => 'before_footer',
                'banner_url' => 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=200&fit=crop',
                'media_type' => 'image',
                'link' => '/about',
                'target_role' => null,
                'is_active' => true,
                'priority' => 1,
            ]
        ];

        foreach ($ads as $ad) {
            Advertisement::create($ad);
        }
    }
}
