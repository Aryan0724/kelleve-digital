<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Listing;
use App\Models\Category;
use App\Traits\ApiResponse;
use Illuminate\Support\Str;

class SearchController extends Controller
{
    use ApiResponse;

    /**
     * Map common frontend category names / URL aliases to database category slugs & keywords
     */
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

    public function index(Request $request)
    {
        $query = Listing::with(['category', 'gallery', 'offers'])->active();

        // 1. Keyword search (q, search, term)
        if ($q = $request->get('q') ?: $request->get('search')) {
            $query->where(function ($b) use ($q) {
                $b->where('title', 'like', "%{$q}%")
                  ->orWhere('description', 'like', "%{$q}%")
                  ->orWhere('tagline', 'like', "%{$q}%")
                  ->orWhere('address', 'like', "%{$q}%")
                  ->orWhereHas('category', function ($c) use ($q) {
                      $c->where('name', 'like', "%{$q}%")->orWhere('slug', 'like', "%{$q}%");
                  });
            });
        }

        // 2. Category matching (category_id, category, category_name)
        $categoryParam = $request->get('category_id') ?: $request->get('category') ?: $request->get('category_name');
        if ($categoryParam) {
            if (is_numeric($categoryParam)) {
                $query->where('category_id', $categoryParam);
            } else {
                $keywords = $this->resolveCategoryKeywords($categoryParam);
                $query->where(function ($b) use ($keywords, $categoryParam) {
                    $b->whereHas('category', function ($c) use ($keywords, $categoryParam) {
                        $c->where('slug', $categoryParam)
                          ->orWhere('name', 'like', "%{$categoryParam}%");
                        foreach ($keywords as $kw) {
                            $c->orWhere('slug', 'like', "%{$kw}%")
                              ->orWhere('name', 'like', "%{$kw}%");
                        }
                    })
                    ->orWhere('title', 'like', "%{$categoryParam}%")
                    ->orWhere('description', 'like', "%{$categoryParam}%");
                });
            }
        }

        // 3. City matching (city, location)
        $cityParam = $request->get('city') ?: $request->get('location');
        if ($cityParam && strtolower($cityParam) !== 'all' && strtolower($cityParam) !== 'india') {
            // Clean city name (e.g. "Delhi NCR" -> "Delhi")
            $cleanCity = trim(str_ireplace(['NCR', 'Metro', 'City', 'Area', 'India'], '', $cityParam));
            if (!empty($cleanCity)) {
                $query->where(function ($b) use ($cityParam, $cleanCity) {
                    $b->where('city', 'like', "%{$cityParam}%")
                      ->orWhere('district', 'like', "%{$cityParam}%")
                      ->orWhere('address', 'like', "%{$cityParam}%")
                      ->orWhere('city', 'like', "%{$cleanCity}%")
                      ->orWhere('district', 'like', "%{$cleanCity}%");
                });
            }
        }

        // 4. Filters: verified, premium, rating
        if ($request->boolean('verified') || $request->get('verified') === 'true') {
            $query->where('is_verified', true);
        }

        if ($request->boolean('premium') || $request->get('premium') === 'true') {
            $query->where('is_premium', true);
        }

        if ($minRating = $request->get('min_rating')) {
            $query->where('avg_rating', '>=', (float) $minRating);
        }

        $perPage = (int) ($request->get('per_page', 15));
        $results = $query->orderByDesc('is_featured')
                         ->orderByDesc('avg_rating')
                         ->paginate($perPage);

        // Fallback: If 0 results were found because of an overly restrictive city filter,
        // relax the city filter and return matching category businesses so the page is never dead!
        if ($results->total() === 0 && $categoryParam) {
            $fallbackQuery = Listing::with(['category', 'gallery', 'offers'])->active();
            $keywords = is_numeric($categoryParam) ? [] : $this->resolveCategoryKeywords($categoryParam);

            if (is_numeric($categoryParam)) {
                $fallbackQuery->where('category_id', $categoryParam);
            } else {
                $fallbackQuery->where(function ($b) use ($keywords, $categoryParam) {
                    $b->whereHas('category', function ($c) use ($keywords, $categoryParam) {
                        $c->where('slug', $categoryParam)
                          ->orWhere('name', 'like', "%{$categoryParam}%");
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
                return $this->paginated($fallbackResults);
            }
        }

        return $this->paginated($results);
    }

    public function autocomplete(Request $request)
    {
        $q = $request->get('q', '');
        if (strlen($q) < 2) {
            return $this->success([]);
        }

        $listings = Listing::active()
            ->where('title', 'like', "%{$q}%")
            ->select('id', 'title', 'slug', 'city', 'cover_image', 'category_id')
            ->with('category:id,name,slug')
            ->limit(8)
            ->get();

        return $this->success($listings);
    }

    public function categories()
    {
        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return $this->success($categories);
    }
}
