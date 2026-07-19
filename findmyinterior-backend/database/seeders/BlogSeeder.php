<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $authorId = DB::table('users')->where('role', 'admin')->value('id');
        if (!$authorId) {
            $authorId = 1; // Fallback
        }

        $blogs = [
            [
                'title' => 'Top 10 Interior Design Trends for 2026',
                'slug' => 'top-10-interior-design-trends-2026',
                'content' => '<h2>Embracing the Future of Design</h2><p>As we step into 2026, interior design is taking a bold leap forward. The emphasis is on sustainable materials, smart home integration, and biophilic design. Homeowners are increasingly looking for ways to bring nature indoors, utilizing large windows, indoor plants, and natural textures like wood and stone.</p><h3>Smart Homes are the New Normal</h3><p>Integration of IoT devices into the very fabric of our homes is no longer a luxury but a standard. From automated lighting that adjusts to your circadian rhythm to climate control that learns your preferences, technology is making homes more comfortable and energy-efficient.</p>',
                'excerpt' => 'Discover the cutting-edge trends shaping interior design this year, from biophilic elements to smart home integration.',
                'image_url' => 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000',
                'author_id' => $authorId,
                'status' => 'published',
                'published_at' => Carbon::now()->subDays(5),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'How to Choose the Right Contractor for Your Home Renovation',
                'slug' => 'how-to-choose-the-right-contractor',
                'content' => '<h2>The Key to a Successful Renovation</h2><p>Finding the right contractor can make or break your home renovation project. It is crucial to do your research before signing any contracts.</p><h3>Check Credentials and Reviews</h3><p>Always verify the contractor\'s license and insurance. Read online reviews and ask for references from past clients. A reputable contractor will be happy to provide this information. Platform like FindMyInterior makes this easier by verifying all listed professionals.</p><h3>Get Multiple Quotes</h3><p>Don\'t settle for the first quote you receive. Compare estimates from at least three different contractors to ensure you are getting a fair price.</p>',
                'excerpt' => 'A comprehensive guide to finding, vetting, and hiring the best contractor for your next home project.',
                'image_url' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000',
                'author_id' => $authorId,
                'status' => 'published',
                'published_at' => Carbon::now()->subDays(10),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Maximizing Space in Small Apartments',
                'slug' => 'maximizing-space-small-apartments',
                'content' => '<h2>Living Large in Small Spaces</h2><p>Urban living often means dealing with limited square footage. However, with the right design strategies, even the smallest apartment can feel spacious and functional.</p><h3>Multifunctional Furniture</h3><p>Invest in pieces that serve dual purposes, such as a sofa bed, a coffee table with hidden storage, or a fold-out dining table. Vertical space is your best friend—use tall shelving units to draw the eye upward and maximize storage.</p><h3>Light and Color</h3><p>Light colors make rooms feel larger and brighter. Use mirrors strategically to reflect natural light and create the illusion of more space.</p>',
                'excerpt' => 'Clever design hacks and furniture choices to make your compact apartment feel incredibly spacious.',
                'image_url' => 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
                'author_id' => $authorId,
                'status' => 'published',
                'published_at' => Carbon::now()->subDays(15),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'The Ultimate Guide to Kitchen Remodeling',
                'slug' => 'ultimate-guide-kitchen-remodeling',
                'content' => '<h2>Planning Your Dream Kitchen</h2><p>A kitchen remodel is one of the most rewarding home improvement projects. It enhances functionality and significantly boosts your home\'s value.</p><h3>The Work Triangle</h3><p>The layout is the most important aspect of kitchen design. Keep the classic work triangle in mind: the distance between the sink, stove, and refrigerator should be optimized for efficiency.</p><h3>Choosing Materials</h3><p>Select durable materials for countertops and flooring. Quartz and granite remain popular choices for their resilience and aesthetic appeal.</p>',
                'excerpt' => 'Everything you need to know before tearing down cabinets, from layout planning to material selection.',
                'image_url' => 'https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&q=80&w=1000',
                'author_id' => $authorId,
                'status' => 'published',
                'published_at' => Carbon::now()->subDays(20),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Sustainable Architecture: Building for Tomorrow',
                'slug' => 'sustainable-architecture-building-for-tomorrow',
                'content' => '<h2>Eco-Friendly Design Principles</h2><p>Sustainable architecture is not just a trend; it is a necessity. Builders and architects are adopting green practices to minimize environmental impact.</p><h3>Energy Efficiency</h3><p>Passive design strategies, such as optimizing window placement for natural heating and cooling, can drastically reduce energy consumption. Solar panels and high-efficiency HVAC systems further contribute to a home\'s sustainability.</p><h3>Locally Sourced Materials</h3><p>Using locally sourced, recycled, or renewable materials reduces the carbon footprint associated with transportation and manufacturing.</p>',
                'excerpt' => 'Explore how modern architects are incorporating green practices and eco-friendly materials into new builds.',
                'image_url' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
                'author_id' => $authorId,
                'status' => 'published',
                'published_at' => Carbon::now()->subDays(25),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ];

        foreach ($blogs as $blog) {
            DB::table('blogs')->updateOrInsert(
                ['slug' => $blog['slug']],
                $blog
            );
        }
    }
}
