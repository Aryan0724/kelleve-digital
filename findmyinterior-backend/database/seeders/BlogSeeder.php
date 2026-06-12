<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Blog;
use Illuminate\Support\Str;
class BlogSeeder extends Seeder {
  public function run(): void {
  Blog::unguard();

        Blog::create([
            'author_id' => 1, 'title' => 'Interior Design Trends in Bhagalpur (2026 Guide)', 'slug' => Str::slug('Interior Design Trends in Bhagalpur (2026 Guide)-1'),
            'excerpt' => 'Discover everything you need to know about Interior Design Trends in Bhagalpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Interior Design Trends in Bhagalpur (2026 Guide). Our experts from Bhagalpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(8),
            'cover_image' => 'https://picsum.photos/seed/blog1/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Choosing the Right Architect in Darbhanga (2026 Guide)', 'slug' => Str::slug('Choosing the Right Architect in Darbhanga (2026 Guide)-2'),
            'excerpt' => 'Discover everything you need to know about Choosing the Right Architect in Darbhanga (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Choosing the Right Architect in Darbhanga (2026 Guide). Our experts from Darbhanga have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(68),
            'cover_image' => 'https://picsum.photos/seed/blog2/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Interior Design Trends in Darbhanga (2026 Guide)', 'slug' => Str::slug('Interior Design Trends in Darbhanga (2026 Guide)-3'),
            'excerpt' => 'Discover everything you need to know about Interior Design Trends in Darbhanga (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Interior Design Trends in Darbhanga (2026 Guide). Our experts from Darbhanga have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(29),
            'cover_image' => 'https://picsum.photos/seed/blog3/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Choosing the Right Architect in Muzaffarpur (2026 Guide)', 'slug' => Str::slug('Choosing the Right Architect in Muzaffarpur (2026 Guide)-4'),
            'excerpt' => 'Discover everything you need to know about Choosing the Right Architect in Muzaffarpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Choosing the Right Architect in Muzaffarpur (2026 Guide). Our experts from Muzaffarpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(38),
            'cover_image' => 'https://picsum.photos/seed/blog4/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Best Tiles for Home Construction in Muzaffarpur (2026 Guide)', 'slug' => Str::slug('Best Tiles for Home Construction in Muzaffarpur (2026 Guide)-5'),
            'excerpt' => 'Discover everything you need to know about Best Tiles for Home Construction in Muzaffarpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Best Tiles for Home Construction in Muzaffarpur (2026 Guide). Our experts from Muzaffarpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(50),
            'cover_image' => 'https://picsum.photos/seed/blog5/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Choosing the Right Architect in Bhagalpur (2026 Guide)', 'slug' => Str::slug('Choosing the Right Architect in Bhagalpur (2026 Guide)-6'),
            'excerpt' => 'Discover everything you need to know about Choosing the Right Architect in Bhagalpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Choosing the Right Architect in Bhagalpur (2026 Guide). Our experts from Bhagalpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(67),
            'cover_image' => 'https://picsum.photos/seed/blog6/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Choosing the Right Architect in Bhagalpur (2026 Guide)', 'slug' => Str::slug('Choosing the Right Architect in Bhagalpur (2026 Guide)-7'),
            'excerpt' => 'Discover everything you need to know about Choosing the Right Architect in Bhagalpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Choosing the Right Architect in Bhagalpur (2026 Guide). Our experts from Bhagalpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(46),
            'cover_image' => 'https://picsum.photos/seed/blog7/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Modular Kitchen Cost in Bhagalpur (2026 Guide)', 'slug' => Str::slug('Modular Kitchen Cost in Bhagalpur (2026 Guide)-8'),
            'excerpt' => 'Discover everything you need to know about Modular Kitchen Cost in Bhagalpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Modular Kitchen Cost in Bhagalpur (2026 Guide). Our experts from Bhagalpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(83),
            'cover_image' => 'https://picsum.photos/seed/blog8/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Choosing the Right Architect in Patna (2026 Guide)', 'slug' => Str::slug('Choosing the Right Architect in Patna (2026 Guide)-9'),
            'excerpt' => 'Discover everything you need to know about Choosing the Right Architect in Patna (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Choosing the Right Architect in Patna (2026 Guide). Our experts from Patna have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(80),
            'cover_image' => 'https://picsum.photos/seed/blog9/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Choosing the Right Architect in Muzaffarpur (2026 Guide)', 'slug' => Str::slug('Choosing the Right Architect in Muzaffarpur (2026 Guide)-10'),
            'excerpt' => 'Discover everything you need to know about Choosing the Right Architect in Muzaffarpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Choosing the Right Architect in Muzaffarpur (2026 Guide). Our experts from Muzaffarpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(35),
            'cover_image' => 'https://picsum.photos/seed/blog10/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'House Construction Cost in Gaya (2026 Guide)', 'slug' => Str::slug('House Construction Cost in Gaya (2026 Guide)-11'),
            'excerpt' => 'Discover everything you need to know about House Construction Cost in Gaya (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on House Construction Cost in Gaya (2026 Guide). Our experts from Gaya have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(41),
            'cover_image' => 'https://picsum.photos/seed/blog11/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'House Construction Cost in Patna (2026 Guide)', 'slug' => Str::slug('House Construction Cost in Patna (2026 Guide)-12'),
            'excerpt' => 'Discover everything you need to know about House Construction Cost in Patna (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on House Construction Cost in Patna (2026 Guide). Our experts from Patna have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(8),
            'cover_image' => 'https://picsum.photos/seed/blog12/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Choosing the Right Architect in Bhagalpur (2026 Guide)', 'slug' => Str::slug('Choosing the Right Architect in Bhagalpur (2026 Guide)-13'),
            'excerpt' => 'Discover everything you need to know about Choosing the Right Architect in Bhagalpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Choosing the Right Architect in Bhagalpur (2026 Guide). Our experts from Bhagalpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(60),
            'cover_image' => 'https://picsum.photos/seed/blog13/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Choosing the Right Architect in Darbhanga (2026 Guide)', 'slug' => Str::slug('Choosing the Right Architect in Darbhanga (2026 Guide)-14'),
            'excerpt' => 'Discover everything you need to know about Choosing the Right Architect in Darbhanga (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Choosing the Right Architect in Darbhanga (2026 Guide). Our experts from Darbhanga have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(66),
            'cover_image' => 'https://picsum.photos/seed/blog14/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Best Tiles for Home Construction in Darbhanga (2026 Guide)', 'slug' => Str::slug('Best Tiles for Home Construction in Darbhanga (2026 Guide)-15'),
            'excerpt' => 'Discover everything you need to know about Best Tiles for Home Construction in Darbhanga (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Best Tiles for Home Construction in Darbhanga (2026 Guide). Our experts from Darbhanga have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(12),
            'cover_image' => 'https://picsum.photos/seed/blog15/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Modular Kitchen Cost in Gaya (2026 Guide)', 'slug' => Str::slug('Modular Kitchen Cost in Gaya (2026 Guide)-16'),
            'excerpt' => 'Discover everything you need to know about Modular Kitchen Cost in Gaya (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Modular Kitchen Cost in Gaya (2026 Guide). Our experts from Gaya have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(41),
            'cover_image' => 'https://picsum.photos/seed/blog16/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'House Construction Cost in Bhagalpur (2026 Guide)', 'slug' => Str::slug('House Construction Cost in Bhagalpur (2026 Guide)-17'),
            'excerpt' => 'Discover everything you need to know about House Construction Cost in Bhagalpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on House Construction Cost in Bhagalpur (2026 Guide). Our experts from Bhagalpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(4),
            'cover_image' => 'https://picsum.photos/seed/blog17/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Modular Kitchen Cost in Bhagalpur (2026 Guide)', 'slug' => Str::slug('Modular Kitchen Cost in Bhagalpur (2026 Guide)-18'),
            'excerpt' => 'Discover everything you need to know about Modular Kitchen Cost in Bhagalpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Modular Kitchen Cost in Bhagalpur (2026 Guide). Our experts from Bhagalpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(74),
            'cover_image' => 'https://picsum.photos/seed/blog18/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Modular Kitchen Cost in Gaya (2026 Guide)', 'slug' => Str::slug('Modular Kitchen Cost in Gaya (2026 Guide)-19'),
            'excerpt' => 'Discover everything you need to know about Modular Kitchen Cost in Gaya (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Modular Kitchen Cost in Gaya (2026 Guide). Our experts from Gaya have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(87),
            'cover_image' => 'https://picsum.photos/seed/blog19/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Choosing the Right Architect in Purnia (2026 Guide)', 'slug' => Str::slug('Choosing the Right Architect in Purnia (2026 Guide)-20'),
            'excerpt' => 'Discover everything you need to know about Choosing the Right Architect in Purnia (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Choosing the Right Architect in Purnia (2026 Guide). Our experts from Purnia have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(23),
            'cover_image' => 'https://picsum.photos/seed/blog20/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Modular Kitchen Cost in Purnia (2026 Guide)', 'slug' => Str::slug('Modular Kitchen Cost in Purnia (2026 Guide)-21'),
            'excerpt' => 'Discover everything you need to know about Modular Kitchen Cost in Purnia (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Modular Kitchen Cost in Purnia (2026 Guide). Our experts from Purnia have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(97),
            'cover_image' => 'https://picsum.photos/seed/blog21/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Interior Design Trends in Darbhanga (2026 Guide)', 'slug' => Str::slug('Interior Design Trends in Darbhanga (2026 Guide)-22'),
            'excerpt' => 'Discover everything you need to know about Interior Design Trends in Darbhanga (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Interior Design Trends in Darbhanga (2026 Guide). Our experts from Darbhanga have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(97),
            'cover_image' => 'https://picsum.photos/seed/blog22/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Choosing the Right Architect in Muzaffarpur (2026 Guide)', 'slug' => Str::slug('Choosing the Right Architect in Muzaffarpur (2026 Guide)-23'),
            'excerpt' => 'Discover everything you need to know about Choosing the Right Architect in Muzaffarpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Choosing the Right Architect in Muzaffarpur (2026 Guide). Our experts from Muzaffarpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(18),
            'cover_image' => 'https://picsum.photos/seed/blog23/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Best Tiles for Home Construction in Purnia (2026 Guide)', 'slug' => Str::slug('Best Tiles for Home Construction in Purnia (2026 Guide)-24'),
            'excerpt' => 'Discover everything you need to know about Best Tiles for Home Construction in Purnia (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Best Tiles for Home Construction in Purnia (2026 Guide). Our experts from Purnia have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(76),
            'cover_image' => 'https://picsum.photos/seed/blog24/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Best Tiles for Home Construction in Purnia (2026 Guide)', 'slug' => Str::slug('Best Tiles for Home Construction in Purnia (2026 Guide)-25'),
            'excerpt' => 'Discover everything you need to know about Best Tiles for Home Construction in Purnia (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Best Tiles for Home Construction in Purnia (2026 Guide). Our experts from Purnia have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(20),
            'cover_image' => 'https://picsum.photos/seed/blog25/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Modular Kitchen Cost in Muzaffarpur (2026 Guide)', 'slug' => Str::slug('Modular Kitchen Cost in Muzaffarpur (2026 Guide)-26'),
            'excerpt' => 'Discover everything you need to know about Modular Kitchen Cost in Muzaffarpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Modular Kitchen Cost in Muzaffarpur (2026 Guide). Our experts from Muzaffarpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(83),
            'cover_image' => 'https://picsum.photos/seed/blog26/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'House Construction Cost in Gaya (2026 Guide)', 'slug' => Str::slug('House Construction Cost in Gaya (2026 Guide)-27'),
            'excerpt' => 'Discover everything you need to know about House Construction Cost in Gaya (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on House Construction Cost in Gaya (2026 Guide). Our experts from Gaya have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(37),
            'cover_image' => 'https://picsum.photos/seed/blog27/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'House Construction Cost in Purnia (2026 Guide)', 'slug' => Str::slug('House Construction Cost in Purnia (2026 Guide)-28'),
            'excerpt' => 'Discover everything you need to know about House Construction Cost in Purnia (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on House Construction Cost in Purnia (2026 Guide). Our experts from Purnia have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(3),
            'cover_image' => 'https://picsum.photos/seed/blog28/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Choosing the Right Architect in Purnia (2026 Guide)', 'slug' => Str::slug('Choosing the Right Architect in Purnia (2026 Guide)-29'),
            'excerpt' => 'Discover everything you need to know about Choosing the Right Architect in Purnia (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Choosing the Right Architect in Purnia (2026 Guide). Our experts from Purnia have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(7),
            'cover_image' => 'https://picsum.photos/seed/blog29/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Best Tiles for Home Construction in Bhagalpur (2026 Guide)', 'slug' => Str::slug('Best Tiles for Home Construction in Bhagalpur (2026 Guide)-30'),
            'excerpt' => 'Discover everything you need to know about Best Tiles for Home Construction in Bhagalpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Best Tiles for Home Construction in Bhagalpur (2026 Guide). Our experts from Bhagalpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(8),
            'cover_image' => 'https://picsum.photos/seed/blog30/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Choosing the Right Architect in Patna (2026 Guide)', 'slug' => Str::slug('Choosing the Right Architect in Patna (2026 Guide)-31'),
            'excerpt' => 'Discover everything you need to know about Choosing the Right Architect in Patna (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Choosing the Right Architect in Patna (2026 Guide). Our experts from Patna have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(64),
            'cover_image' => 'https://picsum.photos/seed/blog31/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'House Construction Cost in Darbhanga (2026 Guide)', 'slug' => Str::slug('House Construction Cost in Darbhanga (2026 Guide)-32'),
            'excerpt' => 'Discover everything you need to know about House Construction Cost in Darbhanga (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on House Construction Cost in Darbhanga (2026 Guide). Our experts from Darbhanga have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(87),
            'cover_image' => 'https://picsum.photos/seed/blog32/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Modular Kitchen Cost in Gaya (2026 Guide)', 'slug' => Str::slug('Modular Kitchen Cost in Gaya (2026 Guide)-33'),
            'excerpt' => 'Discover everything you need to know about Modular Kitchen Cost in Gaya (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Modular Kitchen Cost in Gaya (2026 Guide). Our experts from Gaya have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(100),
            'cover_image' => 'https://picsum.photos/seed/blog33/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Modular Kitchen Cost in Muzaffarpur (2026 Guide)', 'slug' => Str::slug('Modular Kitchen Cost in Muzaffarpur (2026 Guide)-34'),
            'excerpt' => 'Discover everything you need to know about Modular Kitchen Cost in Muzaffarpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Modular Kitchen Cost in Muzaffarpur (2026 Guide). Our experts from Muzaffarpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(28),
            'cover_image' => 'https://picsum.photos/seed/blog34/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Modular Kitchen Cost in Gaya (2026 Guide)', 'slug' => Str::slug('Modular Kitchen Cost in Gaya (2026 Guide)-35'),
            'excerpt' => 'Discover everything you need to know about Modular Kitchen Cost in Gaya (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Modular Kitchen Cost in Gaya (2026 Guide). Our experts from Gaya have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(11),
            'cover_image' => 'https://picsum.photos/seed/blog35/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'House Construction Cost in Gaya (2026 Guide)', 'slug' => Str::slug('House Construction Cost in Gaya (2026 Guide)-36'),
            'excerpt' => 'Discover everything you need to know about House Construction Cost in Gaya (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on House Construction Cost in Gaya (2026 Guide). Our experts from Gaya have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(61),
            'cover_image' => 'https://picsum.photos/seed/blog36/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Interior Design Trends in Purnia (2026 Guide)', 'slug' => Str::slug('Interior Design Trends in Purnia (2026 Guide)-37'),
            'excerpt' => 'Discover everything you need to know about Interior Design Trends in Purnia (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Interior Design Trends in Purnia (2026 Guide). Our experts from Purnia have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(36),
            'cover_image' => 'https://picsum.photos/seed/blog37/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Best Tiles for Home Construction in Purnia (2026 Guide)', 'slug' => Str::slug('Best Tiles for Home Construction in Purnia (2026 Guide)-38'),
            'excerpt' => 'Discover everything you need to know about Best Tiles for Home Construction in Purnia (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Best Tiles for Home Construction in Purnia (2026 Guide). Our experts from Purnia have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(48),
            'cover_image' => 'https://picsum.photos/seed/blog38/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Interior Design Trends in Gaya (2026 Guide)', 'slug' => Str::slug('Interior Design Trends in Gaya (2026 Guide)-39'),
            'excerpt' => 'Discover everything you need to know about Interior Design Trends in Gaya (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Interior Design Trends in Gaya (2026 Guide). Our experts from Gaya have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(46),
            'cover_image' => 'https://picsum.photos/seed/blog39/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Choosing the Right Architect in Patna (2026 Guide)', 'slug' => Str::slug('Choosing the Right Architect in Patna (2026 Guide)-40'),
            'excerpt' => 'Discover everything you need to know about Choosing the Right Architect in Patna (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Choosing the Right Architect in Patna (2026 Guide). Our experts from Patna have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(70),
            'cover_image' => 'https://picsum.photos/seed/blog40/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Interior Design Trends in Purnia (2026 Guide)', 'slug' => Str::slug('Interior Design Trends in Purnia (2026 Guide)-41'),
            'excerpt' => 'Discover everything you need to know about Interior Design Trends in Purnia (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Interior Design Trends in Purnia (2026 Guide). Our experts from Purnia have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(26),
            'cover_image' => 'https://picsum.photos/seed/blog41/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'House Construction Cost in Bhagalpur (2026 Guide)', 'slug' => Str::slug('House Construction Cost in Bhagalpur (2026 Guide)-42'),
            'excerpt' => 'Discover everything you need to know about House Construction Cost in Bhagalpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on House Construction Cost in Bhagalpur (2026 Guide). Our experts from Bhagalpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(100),
            'cover_image' => 'https://picsum.photos/seed/blog42/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Interior Design Trends in Darbhanga (2026 Guide)', 'slug' => Str::slug('Interior Design Trends in Darbhanga (2026 Guide)-43'),
            'excerpt' => 'Discover everything you need to know about Interior Design Trends in Darbhanga (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Interior Design Trends in Darbhanga (2026 Guide). Our experts from Darbhanga have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(9),
            'cover_image' => 'https://picsum.photos/seed/blog43/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Interior Design Trends in Purnia (2026 Guide)', 'slug' => Str::slug('Interior Design Trends in Purnia (2026 Guide)-44'),
            'excerpt' => 'Discover everything you need to know about Interior Design Trends in Purnia (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Interior Design Trends in Purnia (2026 Guide). Our experts from Purnia have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(75),
            'cover_image' => 'https://picsum.photos/seed/blog44/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Choosing the Right Architect in Purnia (2026 Guide)', 'slug' => Str::slug('Choosing the Right Architect in Purnia (2026 Guide)-45'),
            'excerpt' => 'Discover everything you need to know about Choosing the Right Architect in Purnia (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Choosing the Right Architect in Purnia (2026 Guide). Our experts from Purnia have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(18),
            'cover_image' => 'https://picsum.photos/seed/blog45/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'House Construction Cost in Muzaffarpur (2026 Guide)', 'slug' => Str::slug('House Construction Cost in Muzaffarpur (2026 Guide)-46'),
            'excerpt' => 'Discover everything you need to know about House Construction Cost in Muzaffarpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on House Construction Cost in Muzaffarpur (2026 Guide). Our experts from Muzaffarpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(71),
            'cover_image' => 'https://picsum.photos/seed/blog46/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Interior Design Trends in Patna (2026 Guide)', 'slug' => Str::slug('Interior Design Trends in Patna (2026 Guide)-47'),
            'excerpt' => 'Discover everything you need to know about Interior Design Trends in Patna (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Interior Design Trends in Patna (2026 Guide). Our experts from Patna have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(62),
            'cover_image' => 'https://picsum.photos/seed/blog47/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Modular Kitchen Cost in Bhagalpur (2026 Guide)', 'slug' => Str::slug('Modular Kitchen Cost in Bhagalpur (2026 Guide)-48'),
            'excerpt' => 'Discover everything you need to know about Modular Kitchen Cost in Bhagalpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Modular Kitchen Cost in Bhagalpur (2026 Guide). Our experts from Bhagalpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(29),
            'cover_image' => 'https://picsum.photos/seed/blog48/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'House Construction Cost in Muzaffarpur (2026 Guide)', 'slug' => Str::slug('House Construction Cost in Muzaffarpur (2026 Guide)-49'),
            'excerpt' => 'Discover everything you need to know about House Construction Cost in Muzaffarpur (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on House Construction Cost in Muzaffarpur (2026 Guide). Our experts from Muzaffarpur have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(82),
            'cover_image' => 'https://picsum.photos/seed/blog49/800/400',
            'category' => 'General'
        ]);
        
        Blog::create([
            'author_id' => 1, 'title' => 'Choosing the Right Architect in Purnia (2026 Guide)', 'slug' => Str::slug('Choosing the Right Architect in Purnia (2026 Guide)-50'),
            'excerpt' => 'Discover everything you need to know about Choosing the Right Architect in Purnia (2026 Guide). Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on Choosing the Right Architect in Purnia (2026 Guide). Our experts from Purnia have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays(17),
            'cover_image' => 'https://picsum.photos/seed/blog50/800/400',
            'category' => 'General'
        ]);
          }
}
