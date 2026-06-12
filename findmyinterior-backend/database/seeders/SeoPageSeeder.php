<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\SeoPage;
class SeoPageSeeder extends Seeder {
  public function run(): void {
  SeoPage::unguard();
        SeoPage::create([
            'slug' => 'interior-designers-patna', 'title' => 'Best Interior Designer Patna | Find My Interior',
            'meta_title' => 'Top Interior Designers in Patna',
            'meta_description' => 'Find the top verified Interior Designer Patna. Get free quotes and read reviews.'
        ]);
        SeoPage::create([
            'slug' => 'architects-patna', 'title' => 'Best Architect Patna | Find My Interior',
            'meta_title' => 'Top Architects in Patna',
            'meta_description' => 'Find the top verified Architect Patna. Get free quotes and read reviews.'
        ]);
        SeoPage::create([
            'slug' => 'builders-patna', 'title' => 'Best Builder Patna | Find My Interior',
            'meta_title' => 'Top Builders in Patna',
            'meta_description' => 'Find the top verified Builder Patna. Get free quotes and read reviews.'
        ]);
        SeoPage::create([
            'slug' => 'contractors-patna', 'title' => 'Best Contractor Patna | Find My Interior',
            'meta_title' => 'Top Contractors in Patna',
            'meta_description' => 'Find the top verified Contractor Patna. Get free quotes and read reviews.'
        ]);
  }
}
