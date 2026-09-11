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
                'title' => 'Kleve World | Premium Modular Kitchen Designers in Patna, Bihar & Across India',
                'location' => 'top_ribbon',
                'media_type' => 'html',
                'custom_code' => '<a href="https://kleveworld.in/" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:10px;width:100%;height:100%;text-decoration:none;color:inherit;"><span style="font-weight:700;background:#ea580c;color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Kleve World</span><span style="font-size:13px;font-weight:500;">Premium Modular Kitchen Designers in Patna, Bihar &amp; Across India</span><span style="display:inline-flex;align-items:center;gap:4px;background:#ea580c;color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:9999px;white-space:nowrap;text-decoration:none;">Visit Now &#8594;</span></a>',
                'link' => 'https://kleveworld.in/',
                'is_active' => true,
                'priority' => 1,
            ],
            // Popup Ad
            [
                'title' => 'Kleve World - Premium Modular Kitchens',
                'location' => 'popup',
                'banner_url' => 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
                'media_type' => 'image',
                'link' => 'https://kleveworld.in/',
                'target_role' => null,
                'is_active' => true,
                'priority' => 1,
            ],
            // Hero Banner
            [
                'title' => 'Transform Your Kitchen with Kleve World',
                'location' => 'hero_banner',
                'banner_url' => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=300&fit=crop',
                'media_type' => 'image',
                'link' => 'https://kleveworld.in/',
                'target_role' => null,
                'is_active' => true,
                'priority' => 1,
            ],
            // Mid Page (Targeted at homeowners)
            [
                'title' => 'Kleve World - Modern Kitchen Solutions',
                'location' => 'mid_page',
                'banner_url' => 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&h=300&fit=crop',
                'media_type' => 'image',
                'link' => 'https://kleveworld.in/',
                'target_role' => 'customer',
                'is_active' => true,
                'priority' => 1,
            ],
            // Mid Page (Targeted at professionals)
            [
                'title' => 'Partner with Kleve World',
                'location' => 'mid_page',
                'banner_url' => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=300&fit=crop',
                'media_type' => 'image',
                'link' => 'https://kleveworld.in/',
                'target_role' => 'interior_designer',
                'is_active' => true,
                'priority' => 1,
            ],
            // Between Categories
            [
                'title' => 'Upgrade to a Modular Kitchen',
                'location' => 'between_categories',
                'banner_url' => 'https://images.unsplash.com/photo-1556911261-6bd341186b2f?w=1200&h=300&fit=crop',
                'media_type' => 'image',
                'link' => 'https://kleveworld.in/',
                'target_role' => null,
                'is_active' => true,
                'priority' => 1,
            ],
            // Search Feed
            [
                'title' => 'Kleve World Kitchens',
                'location' => 'search_feed',
                'banner_url' => 'https://images.unsplash.com/photo-1556909190-eccf4a8bf97a?w=800&h=200&fit=crop',
                'media_type' => 'image',
                'link' => 'https://kleveworld.in/',
                'target_role' => null,
                'is_active' => true,
                'priority' => 1,
            ],
            // Right Sidebar
            [
                'title' => 'Kleve World',
                'location' => 'right_sidebar',
                'media_type' => 'html',
                'custom_code' => '<div class="w-full h-full min-h-[600px] bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl flex flex-col items-center justify-center p-8 text-center space-y-4"><h3 class="text-2xl font-bold text-orange-400">Kleve World</h3><p class="text-slate-300">Premium Modular Kitchen Designers in Patna, Bihar & Across India.</p><a href="https://kleveworld.in/" target="_blank" class="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors mt-4">Visit Now</a></div>',
                'target_role' => null,
                'is_active' => true,
                'priority' => 1,
            ],
            // Native Blog
            [
                'title' => 'Kleve World Guide',
                'location' => 'native_blog',
                'banner_url' => 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&h=200&fit=crop',
                'media_type' => 'image',
                'link' => 'https://kleveworld.in/',
                'target_role' => null,
                'is_active' => true,
                'priority' => 1,
            ],
            // Before Footer
            [
                'title' => 'Kleve World',
                'location' => 'before_footer',
                'banner_url' => 'https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=1200&h=200&fit=crop',
                'media_type' => 'image',
                'link' => 'https://kleveworld.in/',
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
