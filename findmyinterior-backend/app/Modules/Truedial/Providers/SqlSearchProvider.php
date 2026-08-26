<?php

namespace App\Modules\Truedial\Providers;

use App\Models\Listing;
use App\Modules\Truedial\Contracts\SearchProviderInterface;
use Illuminate\Support\Facades\DB;

class SqlSearchProvider implements SearchProviderInterface
{
    private function resolveCategoryKeywords(string $input): array
    {
        $normalized = strtolower(trim($input));
        $normalized = str_replace(['&', 'and', '+', '%20', '-'], ' ', $normalized);

        $map = [
            'restaurant' => ['restaurants', 'Restaurants & Cafes', 'restaurant', 'food', 'cafe', 'dining'],
            'food' => ['restaurants', 'Restaurants & Cafes', 'restaurant', 'food', 'cafe'],
            'hotel' => ['hotels-lodging', 'Hotels & Lodging', 'hotel', 'resort', 'stay'],
            'lodging' => ['hotels-lodging', 'Hotels & Lodging', 'hotel', 'stay'],
            'hospital' => ['hospitals-healthcare', 'Hospitals & Healthcare', 'doctor', 'clinic', 'hospital'],
            'health' => ['hospitals-healthcare', 'Hospitals & Healthcare', 'doctor', 'clinic', 'healthcare'],
            'doctor' => ['hospitals-healthcare', 'Hospitals & Healthcare', 'doctor', 'clinic'],
            'education' => ['education-coaching', 'Education & Coaching', 'coaching', 'tuition', 'school', 'college'],
            'coaching' => ['education-coaching', 'Education & Coaching', 'coaching', 'academy'],
            'interior' => ['interior-architecture', 'Interior & Architecture', 'interior', 'architect', 'decor'],
            'architect' => ['interior-architecture', 'Interior & Architecture', 'architect', 'interior'],
            'repair' => ['repair-maintenance', 'Repair & Maintenance', 'repair', 'electrician', 'plumber', 'ac repair'],
            'maintenance' => ['repair-maintenance', 'Repair & Maintenance', 'repair', 'maintenance'],
            'digital' => ['digital-marketing-it', 'Digital Marketing & IT', 'marketing', 'seo', 'web development'],
            'marketing' => ['digital-marketing-it', 'Digital Marketing & IT', 'marketing', 'agency'],
            'fitness' => ['fitness-gyms', 'Fitness & Gyms', 'gym', 'fitness', 'crossfit', 'workout'],
            'gym' => ['fitness-gyms', 'Fitness & Gyms', 'gym', 'fitness'],
            'salon' => ['salons-beauty', 'Salons & Beauty', 'salon', 'beauty', 'spa', 'parlour'],
            'beauty' => ['salons-beauty', 'Salons & Beauty', 'salon', 'beauty', 'spa'],
            'automobile' => ['automobile-services', 'Automobile Services', 'car', 'bike', 'automobile', 'mechanic'],
            'car' => ['automobile-services', 'Automobile Services', 'car', 'automobile', 'mechanic'],
            'real estate' => ['real-estate-property', 'Real Estate & Property', 'property', 'real estate', 'plots', 'flats'],
            'property' => ['real-estate-property', 'Real Estate & Property', 'property', 'real estate'],
            'legal' => ['legal-financial', 'Legal & Financial Services', 'legal', 'tax', 'gst', 'ca', 'lawyer'],
            'financial' => ['legal-financial', 'Legal & Financial Services', 'finance', 'tax', 'accounting'],
            'grocery' => ['grocery-supermarket', 'Grocery & Supermarket', 'grocery', 'supermarket', 'mart'],
            'pharmacy' => ['pharmacy-medical', 'Pharmacy & Medical Store', 'pharmacy', 'chemist', 'medicine'],
            'electronic' => ['electronics-gadgets', 'Electronics & Gadgets', 'electronics', 'gadgets', 'appliances'],
            'fashion' => ['clothing-fashion', 'Clothing & Fashion', 'clothing', 'fashion', 'boutique', 'wear'],
            'clothing' => ['clothing-fashion', 'Clothing & Fashion', 'clothing', 'fashion'],
            'furniture' => ['furniture-home-decor', 'Furniture & Home Decor', 'furniture', 'decor', 'sofa', 'wood'],
            'photo' => ['photography-videography', 'Photography & Videography', 'photography', 'wedding shoot', 'photographer'],
            'packer' => ['packers-movers', 'Packers & Movers', 'packers', 'movers', 'relocation', 'transport'],
            'tiffin' => ['catering-tiffin', 'Catering & Tiffin Service', 'catering', 'tiffin', 'food delivery'],
            'cater' => ['catering-tiffin', 'Catering & Tiffin Service', 'catering', 'tiffin'],
            'pet' => ['pet-services', 'Pet Services & Veterinary', 'pet', 'vet', 'dog', 'veterinary'],
            'jewel' => ['jewellery-accessories', 'Jewellery & Accessories', 'jewellery', 'gold', 'diamond'],
            'cake' => ['bakery-sweets', 'Bakery & Sweets', 'bakery', 'sweets', 'cake', 'pastry'],
            'bakery' => ['bakery-sweets', 'Bakery & Sweets', 'bakery', 'sweets'],
            'optical' => ['opticals-eyewear', 'Opticals & Eyewear', 'opticals', 'eyewear', 'glasses', 'lenses'],
            'event' => ['event-management', 'Event Management', 'wedding', 'event', 'planner'],
        ];

        foreach ($map as $key => $keywords) {
            if (str_contains($normalized, $key)) {
                return $keywords;
            }
        }

        return [$input, $normalized];
    }

    public function search(?string $term, array $filters = [], int $perPage = 15): array
    {
        $query = Listing::query()
            ->with(['category', 'media', 'offers'])
            ->where('status', 'active');

        // Text Search
        if (!empty($term)) {
            $query->where(function($q) use ($term) {
                $q->where('title', 'like', "%{$term}%")
                  ->orWhere('description', 'like', "%{$term}%")
                  ->orWhere('tagline', 'like', "%{$term}%");
            });
        }

        // Category Filter
        $catParam = $filters['category_id'] ?? $filters['category_name'] ?? $filters['category'] ?? null;
        if (!empty($catParam)) {
            if (is_numeric($catParam)) {
                $query->where('category_id', $catParam);
            } else {
                $keywords = $this->resolveCategoryKeywords($catParam);
                $query->where(function ($b) use ($keywords, $catParam) {
                    $b->whereHas('category', function ($c) use ($keywords, $catParam) {
                        $c->where('slug', $catParam)
                          ->orWhere('name', 'like', "%{$catParam}%");
                        foreach ($keywords as $kw) {
                            $c->orWhere('slug', 'like', "%{$kw}%")
                              ->orWhere('name', 'like', "%{$kw}%");
                        }
                    })
                    ->orWhere('title', 'like', "%{$catParam}%")
                    ->orWhere('description', 'like', "%{$catParam}%");
                });
            }
        }

        // City Filter
        if (!empty($filters['city']) && strtolower($filters['city']) !== 'all' && strtolower($filters['city']) !== 'india') {
            $cityParam = is_array($filters['city']) ? $filters['city'][0] : $filters['city'];
            $cleanCity = trim(str_ireplace(['NCR', 'Metro', 'City', 'Area', 'India'], '', $cityParam));
            
            $query->where(function ($b) use ($cityParam, $cleanCity) {
                $b->where('city', 'like', "%{$cityParam}%")
                  ->orWhere('district', 'like', "%{$cityParam}%")
                  ->orWhere('address', 'like', "%{$cityParam}%")
                  ->orWhere('city', 'like', "%{$cleanCity}%")
                  ->orWhere('district', 'like', "%{$cleanCity}%");
            });
        }

        if (!empty($filters['verified'])) {
            $query->where('is_verified', true);
        }

        if (!empty($filters['premium'])) {
            $query->where('is_premium', true);
        }

        if (!empty($filters['min_rating'])) {
            $query->where('avg_rating', '>=', (float) $filters['min_rating']);
        }

        if (!empty($filters['offers'])) {
            $query->whereHas('offers', function($q) use ($filters) {
                $q->where('status', 'active');
            });
        }

        $results = $query->orderByDesc('is_featured')
                         ->orderByDesc('avg_rating')
                         ->paginate($perPage);

        // Fallback: If specific city filter returned 0 results for a category,
        // relax the city filter and return category results so search never returns an empty dead page!
        if ($results->total() === 0 && !empty($catParam)) {
            $fallbackQuery = Listing::query()
                ->with(['category', 'media', 'offers'])
                ->where('status', 'active');

            if (is_numeric($catParam)) {
                $fallbackQuery->where('category_id', $catParam);
            } else {
                $keywords = $this->resolveCategoryKeywords($catParam);
                $fallbackQuery->where(function ($b) use ($keywords, $catParam) {
                    $b->whereHas('category', function ($c) use ($keywords, $catParam) {
                        $c->where('slug', $catParam)
                          ->orWhere('name', 'like', "%{$catParam}%");
                        foreach ($keywords as $kw) {
                            $c->orWhere('slug', 'like', "%{$kw}%")
                              ->orWhere('name', 'like', "%{$kw}%");
                        }
                    });
                });
            }

            $fallbackResults = $fallbackQuery->orderByDesc('is_featured')
                                             ->orderByDesc('avg_rating')
                                             ->paginate($perPage);

            if ($fallbackResults->total() > 0) {
                return [
                    'data' => $fallbackResults,
                    'facets' => ['total' => $fallbackResults->total()]
                ];
            }
        }

        return [
            'data' => $results,
            'facets' => [
                'total' => $results->total()
            ]
        ];
    }

    public function autocomplete(string $term, int $limit = 8)
    {
        return Listing::query()
            ->where('status', 'active')
            ->where('title', 'like', '%' . $term . '%')
            ->select('id', 'title', 'slug', 'city')
            ->limit($limit)
            ->get();
    }
}
