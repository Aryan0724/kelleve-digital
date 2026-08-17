<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\Category;
use App\Models\Listing;
use App\Models\Offer;
use App\Models\Review;
use App\Models\Conversation;
use App\Models\Message;
use App\Core\Tenancy\TenantContext;

class TruedialSeeder extends Seeder
{
    public function run(): void
    {
        $tenantId = 2;
        $tenant = Tenant::find($tenantId);
        if ($tenant) {
            app(TenantContext::class)->setTenant($tenant);
        }

        // Roles
        $adminRole    = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
        $businessRole = Role::firstOrCreate(['slug' => 'business'], ['name' => 'Business (Truedial)']);
        $customerRole = Role::firstOrCreate(['slug' => 'customer'], ['name' => 'Customer (Truedial)']);

        // Platform Admin
        $admin = User::firstOrCreate(['email' => 'admin@truedial.in'], [
            'name' => 'Truedial Admin',
            'password' => Hash::make('password123'),
        ]);
        if (!$admin->roles()->where('role_id', $adminRole->id)->exists()) {
            $admin->roles()->attach($adminRole->id);
        }

        // Standard Test Vendor & Customer
        $vendor = User::firstOrCreate(['email' => 'vendor@truedial.in'], [
            'name' => 'Truedial Master Vendor',
            'password' => Hash::make('password123'),
        ]);
        if (!$vendor->roles()->where('role_id', $businessRole->id)->exists()) {
            $vendor->roles()->attach($businessRole->id);
        }

        $customer = User::firstOrCreate(['email' => 'customer@truedial.in'], [
            'name' => 'Truedial Customer',
            'password' => Hash::make('password123'),
        ]);
        if (!$customer->roles()->where('role_id', $customerRole->id)->exists()) {
            $customer->roles()->attach($customerRole->id);
        }

        $customer2 = User::firstOrCreate(['email' => 'rahul@truedial.in'], [
            'name' => 'Rahul Sharma',
            'password' => Hash::make('password123'),
        ]);
        if (!$customer2->roles()->where('role_id', $customerRole->id)->exists()) {
            $customer2->roles()->attach($customerRole->id);
        }

        // Core TrueDial Categories
        $categoriesData = [
            ['name' => 'Restaurants & Cafes', 'slug' => 'restaurants', 'icon' => 'Utensils'],
            ['name' => 'Hotels & Lodging', 'slug' => 'hotels-lodging', 'icon' => 'Hotel'],
            ['name' => 'Hospitals & Healthcare', 'slug' => 'hospitals-healthcare', 'icon' => 'Hospital'],
            ['name' => 'Education & Coaching', 'slug' => 'education-coaching', 'icon' => 'GraduationCap'],
            ['name' => 'Interior & Architecture', 'slug' => 'interior-architecture', 'icon' => 'Home'],
            ['name' => 'Repair & Maintenance', 'slug' => 'repair-maintenance', 'icon' => 'Wrench'],
            ['name' => 'Digital Marketing & IT', 'slug' => 'digital-marketing-it', 'icon' => 'Laptop'],
            ['name' => 'Fitness & Gyms', 'slug' => 'fitness-gyms', 'icon' => 'Dumbbell'],
            ['name' => 'Event Management', 'slug' => 'event-management', 'icon' => 'Calendar'],
            ['name' => 'Salons & Beauty', 'slug' => 'salons-beauty', 'icon' => 'Scissors'],
            ['name' => 'Automobile Services', 'slug' => 'automobile-services', 'icon' => 'Car'],
            ['name' => 'Travel & Tourism', 'slug' => 'travel-tourism', 'icon' => 'Plane'],
            ['name' => 'Real Estate & Property', 'slug' => 'real-estate-property', 'icon' => 'Building'],
            ['name' => 'Legal & Financial Services', 'slug' => 'legal-financial', 'icon' => 'Scale'],
            ['name' => 'Grocery & Supermarket', 'slug' => 'grocery-supermarket', 'icon' => 'ShoppingCart'],
            ['name' => 'Pharmacy & Medical Store', 'slug' => 'pharmacy-medical', 'icon' => 'Pills'],
            ['name' => 'Electronics & Gadgets', 'slug' => 'electronics-gadgets', 'icon' => 'Smartphone'],
            ['name' => 'Clothing & Fashion', 'slug' => 'clothing-fashion', 'icon' => 'Shirt'],
            ['name' => 'Furniture & Home Decor', 'slug' => 'furniture-home-decor', 'icon' => 'Sofa'],
            ['name' => 'Photography & Videography', 'slug' => 'photography-videography', 'icon' => 'Camera'],
            ['name' => 'Packers & Movers', 'slug' => 'packers-movers', 'icon' => 'Truck'],
            ['name' => 'Printing & Advertising', 'slug' => 'printing-advertising', 'icon' => 'Printer'],
            ['name' => 'Catering & Tiffin Service', 'slug' => 'catering-tiffin', 'icon' => 'ChefHat'],
            ['name' => 'Pet Services & Veterinary', 'slug' => 'pet-services', 'icon' => 'Dog'],
            ['name' => 'Jewellery & Accessories', 'slug' => 'jewellery-accessories', 'icon' => 'Gem'],
            ['name' => 'Banking & Insurance', 'slug' => 'banking-insurance', 'icon' => 'Landmark'],
            ['name' => 'Courier & Delivery', 'slug' => 'courier-delivery', 'icon' => 'Package'],
            ['name' => 'Hardware & Building Supplies', 'slug' => 'hardware-building', 'icon' => 'Hammer'],
            ['name' => 'Books & Stationery', 'slug' => 'books-stationery', 'icon' => 'Book'],
            ['name' => 'Nursery & Garden', 'slug' => 'nursery-garden', 'icon' => 'Leaf'],
            ['name' => 'Security Services', 'slug' => 'security-services', 'icon' => 'Shield'],
            ['name' => 'Astrology & Vastu', 'slug' => 'astrology-vastu', 'icon' => 'Star'],
            ['name' => 'Bakery & Sweets', 'slug' => 'bakery-sweets', 'icon' => 'Cake'],
            ['name' => 'Opticals & Eyewear', 'slug' => 'opticals-eyewear', 'icon' => 'Glasses'],
            ['name' => 'Mobile & Computer Repair', 'slug' => 'mobile-computer-repair', 'icon' => 'Wrench']
        ];

        $categories = [];
        foreach ($categoriesData as $catData) {
            $cat = Category::firstOrCreate(
                ['slug' => $catData['slug'], 'tenant_id' => $tenantId],
                ['name' => $catData['name'], 'icon' => $catData['icon'], 'is_active' => true]
            );
            $categories[$catData['slug']] = $cat;
        }

        // Realistic Business Listings
        $businesses = [
            [
                'slug' => 'restaurants-biz-1',
                'title' => 'Restaurants Business 1',
                'category_slug' => 'restaurants',
                'description' => 'Best Restaurants Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500001', 'whatsapp' => '919876500001', 'website' => 'https://biz1.in',
                'avg_rating' => 4.5, 'review_count' => 10, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz1@truedial.in', 'owner_name' => 'Owner 1'
            ],
            [
                'slug' => 'restaurants-biz-2',
                'title' => 'Restaurants Business 2',
                'category_slug' => 'restaurants',
                'description' => 'Best Restaurants Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500002', 'whatsapp' => '919876500002', 'website' => 'https://biz2.in',
                'avg_rating' => 4.5, 'review_count' => 20, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz2@truedial.in', 'owner_name' => 'Owner 2'
            ],
            [
                'slug' => 'restaurants-biz-3',
                'title' => 'Restaurants Business 3',
                'category_slug' => 'restaurants',
                'description' => 'Best Restaurants Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500003', 'whatsapp' => '919876500003', 'website' => 'https://biz3.in',
                'avg_rating' => 4.5, 'review_count' => 30, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz3@truedial.in', 'owner_name' => 'Owner 3'
            ],
            [
                'slug' => 'restaurants-biz-4',
                'title' => 'Restaurants Business 4',
                'category_slug' => 'restaurants',
                'description' => 'Best Restaurants Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500004', 'whatsapp' => '919876500004', 'website' => 'https://biz4.in',
                'avg_rating' => 4.5, 'review_count' => 40, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz4@truedial.in', 'owner_name' => 'Owner 4'
            ],
            [
                'slug' => 'restaurants-biz-5',
                'title' => 'Restaurants Business 5',
                'category_slug' => 'restaurants',
                'description' => 'Best Restaurants Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500005', 'whatsapp' => '919876500005', 'website' => 'https://biz5.in',
                'avg_rating' => 4.5, 'review_count' => 50, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz5@truedial.in', 'owner_name' => 'Owner 5'
            ],
            [
                'slug' => 'hotels-lodging-biz-6',
                'title' => 'Hotels Business 1',
                'category_slug' => 'hotels-lodging',
                'description' => 'Best Hotels Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500006', 'whatsapp' => '919876500006', 'website' => 'https://biz6.in',
                'avg_rating' => 4.5, 'review_count' => 60, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz6@truedial.in', 'owner_name' => 'Owner 6'
            ],
            [
                'slug' => 'hotels-lodging-biz-7',
                'title' => 'Hotels Business 2',
                'category_slug' => 'hotels-lodging',
                'description' => 'Best Hotels Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500007', 'whatsapp' => '919876500007', 'website' => 'https://biz7.in',
                'avg_rating' => 4.5, 'review_count' => 70, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz7@truedial.in', 'owner_name' => 'Owner 7'
            ],
            [
                'slug' => 'hotels-lodging-biz-8',
                'title' => 'Hotels Business 3',
                'category_slug' => 'hotels-lodging',
                'description' => 'Best Hotels Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500008', 'whatsapp' => '919876500008', 'website' => 'https://biz8.in',
                'avg_rating' => 4.5, 'review_count' => 80, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz8@truedial.in', 'owner_name' => 'Owner 8'
            ],
            [
                'slug' => 'hotels-lodging-biz-9',
                'title' => 'Hotels Business 4',
                'category_slug' => 'hotels-lodging',
                'description' => 'Best Hotels Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500009', 'whatsapp' => '919876500009', 'website' => 'https://biz9.in',
                'avg_rating' => 4.5, 'review_count' => 90, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz9@truedial.in', 'owner_name' => 'Owner 9'
            ],
            [
                'slug' => 'hotels-lodging-biz-10',
                'title' => 'Hotels Business 5',
                'category_slug' => 'hotels-lodging',
                'description' => 'Best Hotels Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500010', 'whatsapp' => '919876500010', 'website' => 'https://biz10.in',
                'avg_rating' => 4.5, 'review_count' => 100, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz10@truedial.in', 'owner_name' => 'Owner 10'
            ],
            [
                'slug' => 'hospitals-healthcare-biz-11',
                'title' => 'Hospitals Business 1',
                'category_slug' => 'hospitals-healthcare',
                'description' => 'Best Hospitals Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500011', 'whatsapp' => '919876500011', 'website' => 'https://biz11.in',
                'avg_rating' => 4.5, 'review_count' => 110, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz11@truedial.in', 'owner_name' => 'Owner 11'
            ],
            [
                'slug' => 'hospitals-healthcare-biz-12',
                'title' => 'Hospitals Business 2',
                'category_slug' => 'hospitals-healthcare',
                'description' => 'Best Hospitals Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500012', 'whatsapp' => '919876500012', 'website' => 'https://biz12.in',
                'avg_rating' => 4.5, 'review_count' => 120, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz12@truedial.in', 'owner_name' => 'Owner 12'
            ],
            [
                'slug' => 'hospitals-healthcare-biz-13',
                'title' => 'Hospitals Business 3',
                'category_slug' => 'hospitals-healthcare',
                'description' => 'Best Hospitals Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500013', 'whatsapp' => '919876500013', 'website' => 'https://biz13.in',
                'avg_rating' => 4.5, 'review_count' => 130, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz13@truedial.in', 'owner_name' => 'Owner 13'
            ],
            [
                'slug' => 'hospitals-healthcare-biz-14',
                'title' => 'Hospitals Business 4',
                'category_slug' => 'hospitals-healthcare',
                'description' => 'Best Hospitals Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500014', 'whatsapp' => '919876500014', 'website' => 'https://biz14.in',
                'avg_rating' => 4.5, 'review_count' => 140, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz14@truedial.in', 'owner_name' => 'Owner 14'
            ],
            [
                'slug' => 'hospitals-healthcare-biz-15',
                'title' => 'Hospitals Business 5',
                'category_slug' => 'hospitals-healthcare',
                'description' => 'Best Hospitals Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500015', 'whatsapp' => '919876500015', 'website' => 'https://biz15.in',
                'avg_rating' => 4.5, 'review_count' => 150, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz15@truedial.in', 'owner_name' => 'Owner 15'
            ],
            [
                'slug' => 'education-coaching-biz-16',
                'title' => 'Education Business 1',
                'category_slug' => 'education-coaching',
                'description' => 'Best Education Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500016', 'whatsapp' => '919876500016', 'website' => 'https://biz16.in',
                'avg_rating' => 4.5, 'review_count' => 160, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz16@truedial.in', 'owner_name' => 'Owner 16'
            ],
            [
                'slug' => 'education-coaching-biz-17',
                'title' => 'Education Business 2',
                'category_slug' => 'education-coaching',
                'description' => 'Best Education Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500017', 'whatsapp' => '919876500017', 'website' => 'https://biz17.in',
                'avg_rating' => 4.5, 'review_count' => 170, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz17@truedial.in', 'owner_name' => 'Owner 17'
            ],
            [
                'slug' => 'education-coaching-biz-18',
                'title' => 'Education Business 3',
                'category_slug' => 'education-coaching',
                'description' => 'Best Education Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500018', 'whatsapp' => '919876500018', 'website' => 'https://biz18.in',
                'avg_rating' => 4.5, 'review_count' => 180, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz18@truedial.in', 'owner_name' => 'Owner 18'
            ],
            [
                'slug' => 'education-coaching-biz-19',
                'title' => 'Education Business 4',
                'category_slug' => 'education-coaching',
                'description' => 'Best Education Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500019', 'whatsapp' => '919876500019', 'website' => 'https://biz19.in',
                'avg_rating' => 4.5, 'review_count' => 190, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz19@truedial.in', 'owner_name' => 'Owner 19'
            ],
            [
                'slug' => 'education-coaching-biz-20',
                'title' => 'Education Business 5',
                'category_slug' => 'education-coaching',
                'description' => 'Best Education Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500020', 'whatsapp' => '919876500020', 'website' => 'https://biz20.in',
                'avg_rating' => 4.5, 'review_count' => 200, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz20@truedial.in', 'owner_name' => 'Owner 20'
            ],
            [
                'slug' => 'interior-architecture-biz-21',
                'title' => 'Interior Business 1',
                'category_slug' => 'interior-architecture',
                'description' => 'Best Interior Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500021', 'whatsapp' => '919876500021', 'website' => 'https://biz21.in',
                'avg_rating' => 4.5, 'review_count' => 210, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz21@truedial.in', 'owner_name' => 'Owner 21'
            ],
            [
                'slug' => 'interior-architecture-biz-22',
                'title' => 'Interior Business 2',
                'category_slug' => 'interior-architecture',
                'description' => 'Best Interior Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500022', 'whatsapp' => '919876500022', 'website' => 'https://biz22.in',
                'avg_rating' => 4.5, 'review_count' => 220, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz22@truedial.in', 'owner_name' => 'Owner 22'
            ],
            [
                'slug' => 'interior-architecture-biz-23',
                'title' => 'Interior Business 3',
                'category_slug' => 'interior-architecture',
                'description' => 'Best Interior Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500023', 'whatsapp' => '919876500023', 'website' => 'https://biz23.in',
                'avg_rating' => 4.5, 'review_count' => 230, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz23@truedial.in', 'owner_name' => 'Owner 23'
            ],
            [
                'slug' => 'interior-architecture-biz-24',
                'title' => 'Interior Business 4',
                'category_slug' => 'interior-architecture',
                'description' => 'Best Interior Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500024', 'whatsapp' => '919876500024', 'website' => 'https://biz24.in',
                'avg_rating' => 4.5, 'review_count' => 240, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz24@truedial.in', 'owner_name' => 'Owner 24'
            ],
            [
                'slug' => 'interior-architecture-biz-25',
                'title' => 'Interior Business 5',
                'category_slug' => 'interior-architecture',
                'description' => 'Best Interior Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500025', 'whatsapp' => '919876500025', 'website' => 'https://biz25.in',
                'avg_rating' => 4.5, 'review_count' => 250, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz25@truedial.in', 'owner_name' => 'Owner 25'
            ],
            [
                'slug' => 'repair-maintenance-biz-26',
                'title' => 'Repair Business 1',
                'category_slug' => 'repair-maintenance',
                'description' => 'Best Repair Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500026', 'whatsapp' => '919876500026', 'website' => 'https://biz26.in',
                'avg_rating' => 4.5, 'review_count' => 260, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz26@truedial.in', 'owner_name' => 'Owner 26'
            ],
            [
                'slug' => 'repair-maintenance-biz-27',
                'title' => 'Repair Business 2',
                'category_slug' => 'repair-maintenance',
                'description' => 'Best Repair Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500027', 'whatsapp' => '919876500027', 'website' => 'https://biz27.in',
                'avg_rating' => 4.5, 'review_count' => 270, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz27@truedial.in', 'owner_name' => 'Owner 27'
            ],
            [
                'slug' => 'repair-maintenance-biz-28',
                'title' => 'Repair Business 3',
                'category_slug' => 'repair-maintenance',
                'description' => 'Best Repair Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500028', 'whatsapp' => '919876500028', 'website' => 'https://biz28.in',
                'avg_rating' => 4.5, 'review_count' => 280, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz28@truedial.in', 'owner_name' => 'Owner 28'
            ],
            [
                'slug' => 'repair-maintenance-biz-29',
                'title' => 'Repair Business 4',
                'category_slug' => 'repair-maintenance',
                'description' => 'Best Repair Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500029', 'whatsapp' => '919876500029', 'website' => 'https://biz29.in',
                'avg_rating' => 4.5, 'review_count' => 290, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz29@truedial.in', 'owner_name' => 'Owner 29'
            ],
            [
                'slug' => 'repair-maintenance-biz-30',
                'title' => 'Repair Business 5',
                'category_slug' => 'repair-maintenance',
                'description' => 'Best Repair Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500030', 'whatsapp' => '919876500030', 'website' => 'https://biz30.in',
                'avg_rating' => 4.5, 'review_count' => 300, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz30@truedial.in', 'owner_name' => 'Owner 30'
            ],
            [
                'slug' => 'digital-marketing-it-biz-31',
                'title' => 'Digital Marketing Business 1',
                'category_slug' => 'digital-marketing-it',
                'description' => 'Best Digital Marketing Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500031', 'whatsapp' => '919876500031', 'website' => 'https://biz31.in',
                'avg_rating' => 4.5, 'review_count' => 310, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz31@truedial.in', 'owner_name' => 'Owner 31'
            ],
            [
                'slug' => 'digital-marketing-it-biz-32',
                'title' => 'Digital Marketing Business 2',
                'category_slug' => 'digital-marketing-it',
                'description' => 'Best Digital Marketing Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500032', 'whatsapp' => '919876500032', 'website' => 'https://biz32.in',
                'avg_rating' => 4.5, 'review_count' => 320, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz32@truedial.in', 'owner_name' => 'Owner 32'
            ],
            [
                'slug' => 'digital-marketing-it-biz-33',
                'title' => 'Digital Marketing Business 3',
                'category_slug' => 'digital-marketing-it',
                'description' => 'Best Digital Marketing Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500033', 'whatsapp' => '919876500033', 'website' => 'https://biz33.in',
                'avg_rating' => 4.5, 'review_count' => 330, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz33@truedial.in', 'owner_name' => 'Owner 33'
            ],
            [
                'slug' => 'digital-marketing-it-biz-34',
                'title' => 'Digital Marketing Business 4',
                'category_slug' => 'digital-marketing-it',
                'description' => 'Best Digital Marketing Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500034', 'whatsapp' => '919876500034', 'website' => 'https://biz34.in',
                'avg_rating' => 4.5, 'review_count' => 340, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz34@truedial.in', 'owner_name' => 'Owner 34'
            ],
            [
                'slug' => 'digital-marketing-it-biz-35',
                'title' => 'Digital Marketing Business 5',
                'category_slug' => 'digital-marketing-it',
                'description' => 'Best Digital Marketing Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500035', 'whatsapp' => '919876500035', 'website' => 'https://biz35.in',
                'avg_rating' => 4.5, 'review_count' => 350, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz35@truedial.in', 'owner_name' => 'Owner 35'
            ],
            [
                'slug' => 'fitness-gyms-biz-36',
                'title' => 'Fitness Business 1',
                'category_slug' => 'fitness-gyms',
                'description' => 'Best Fitness Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500036', 'whatsapp' => '919876500036', 'website' => 'https://biz36.in',
                'avg_rating' => 4.5, 'review_count' => 360, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz36@truedial.in', 'owner_name' => 'Owner 36'
            ],
            [
                'slug' => 'fitness-gyms-biz-37',
                'title' => 'Fitness Business 2',
                'category_slug' => 'fitness-gyms',
                'description' => 'Best Fitness Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500037', 'whatsapp' => '919876500037', 'website' => 'https://biz37.in',
                'avg_rating' => 4.5, 'review_count' => 370, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz37@truedial.in', 'owner_name' => 'Owner 37'
            ],
            [
                'slug' => 'fitness-gyms-biz-38',
                'title' => 'Fitness Business 3',
                'category_slug' => 'fitness-gyms',
                'description' => 'Best Fitness Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500038', 'whatsapp' => '919876500038', 'website' => 'https://biz38.in',
                'avg_rating' => 4.5, 'review_count' => 380, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz38@truedial.in', 'owner_name' => 'Owner 38'
            ],
            [
                'slug' => 'fitness-gyms-biz-39',
                'title' => 'Fitness Business 4',
                'category_slug' => 'fitness-gyms',
                'description' => 'Best Fitness Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500039', 'whatsapp' => '919876500039', 'website' => 'https://biz39.in',
                'avg_rating' => 4.5, 'review_count' => 390, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz39@truedial.in', 'owner_name' => 'Owner 39'
            ],
            [
                'slug' => 'fitness-gyms-biz-40',
                'title' => 'Fitness Business 5',
                'category_slug' => 'fitness-gyms',
                'description' => 'Best Fitness Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500040', 'whatsapp' => '919876500040', 'website' => 'https://biz40.in',
                'avg_rating' => 4.5, 'review_count' => 400, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz40@truedial.in', 'owner_name' => 'Owner 40'
            ],
            [
                'slug' => 'event-management-biz-41',
                'title' => 'Event Management Business 1',
                'category_slug' => 'event-management',
                'description' => 'Best Event Management Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500041', 'whatsapp' => '919876500041', 'website' => 'https://biz41.in',
                'avg_rating' => 4.5, 'review_count' => 410, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz41@truedial.in', 'owner_name' => 'Owner 41'
            ],
            [
                'slug' => 'event-management-biz-42',
                'title' => 'Event Management Business 2',
                'category_slug' => 'event-management',
                'description' => 'Best Event Management Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500042', 'whatsapp' => '919876500042', 'website' => 'https://biz42.in',
                'avg_rating' => 4.5, 'review_count' => 420, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz42@truedial.in', 'owner_name' => 'Owner 42'
            ],
            [
                'slug' => 'event-management-biz-43',
                'title' => 'Event Management Business 3',
                'category_slug' => 'event-management',
                'description' => 'Best Event Management Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500043', 'whatsapp' => '919876500043', 'website' => 'https://biz43.in',
                'avg_rating' => 4.5, 'review_count' => 430, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz43@truedial.in', 'owner_name' => 'Owner 43'
            ],
            [
                'slug' => 'event-management-biz-44',
                'title' => 'Event Management Business 4',
                'category_slug' => 'event-management',
                'description' => 'Best Event Management Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500044', 'whatsapp' => '919876500044', 'website' => 'https://biz44.in',
                'avg_rating' => 4.5, 'review_count' => 440, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz44@truedial.in', 'owner_name' => 'Owner 44'
            ],
            [
                'slug' => 'event-management-biz-45',
                'title' => 'Event Management Business 5',
                'category_slug' => 'event-management',
                'description' => 'Best Event Management Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500045', 'whatsapp' => '919876500045', 'website' => 'https://biz45.in',
                'avg_rating' => 4.5, 'review_count' => 450, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz45@truedial.in', 'owner_name' => 'Owner 45'
            ],
            [
                'slug' => 'salons-beauty-biz-46',
                'title' => 'Salons Business 1',
                'category_slug' => 'salons-beauty',
                'description' => 'Best Salons Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500046', 'whatsapp' => '919876500046', 'website' => 'https://biz46.in',
                'avg_rating' => 4.5, 'review_count' => 460, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz46@truedial.in', 'owner_name' => 'Owner 46'
            ],
            [
                'slug' => 'salons-beauty-biz-47',
                'title' => 'Salons Business 2',
                'category_slug' => 'salons-beauty',
                'description' => 'Best Salons Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500047', 'whatsapp' => '919876500047', 'website' => 'https://biz47.in',
                'avg_rating' => 4.5, 'review_count' => 470, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz47@truedial.in', 'owner_name' => 'Owner 47'
            ],
            [
                'slug' => 'salons-beauty-biz-48',
                'title' => 'Salons Business 3',
                'category_slug' => 'salons-beauty',
                'description' => 'Best Salons Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500048', 'whatsapp' => '919876500048', 'website' => 'https://biz48.in',
                'avg_rating' => 4.5, 'review_count' => 480, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz48@truedial.in', 'owner_name' => 'Owner 48'
            ],
            [
                'slug' => 'salons-beauty-biz-49',
                'title' => 'Salons Business 4',
                'category_slug' => 'salons-beauty',
                'description' => 'Best Salons Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500049', 'whatsapp' => '919876500049', 'website' => 'https://biz49.in',
                'avg_rating' => 4.5, 'review_count' => 490, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz49@truedial.in', 'owner_name' => 'Owner 49'
            ],
            [
                'slug' => 'salons-beauty-biz-50',
                'title' => 'Salons Business 5',
                'category_slug' => 'salons-beauty',
                'description' => 'Best Salons Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500050', 'whatsapp' => '919876500050', 'website' => 'https://biz50.in',
                'avg_rating' => 4.5, 'review_count' => 500, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz50@truedial.in', 'owner_name' => 'Owner 50'
            ],
            [
                'slug' => 'automobile-services-biz-51',
                'title' => 'Automobile Services Business 1',
                'category_slug' => 'automobile-services',
                'description' => 'Best Automobile Services Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500051', 'whatsapp' => '919876500051', 'website' => 'https://biz51.in',
                'avg_rating' => 4.5, 'review_count' => 510, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz51@truedial.in', 'owner_name' => 'Owner 51'
            ],
            [
                'slug' => 'automobile-services-biz-52',
                'title' => 'Automobile Services Business 2',
                'category_slug' => 'automobile-services',
                'description' => 'Best Automobile Services Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500052', 'whatsapp' => '919876500052', 'website' => 'https://biz52.in',
                'avg_rating' => 4.5, 'review_count' => 520, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz52@truedial.in', 'owner_name' => 'Owner 52'
            ],
            [
                'slug' => 'automobile-services-biz-53',
                'title' => 'Automobile Services Business 3',
                'category_slug' => 'automobile-services',
                'description' => 'Best Automobile Services Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500053', 'whatsapp' => '919876500053', 'website' => 'https://biz53.in',
                'avg_rating' => 4.5, 'review_count' => 530, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz53@truedial.in', 'owner_name' => 'Owner 53'
            ],
            [
                'slug' => 'automobile-services-biz-54',
                'title' => 'Automobile Services Business 4',
                'category_slug' => 'automobile-services',
                'description' => 'Best Automobile Services Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500054', 'whatsapp' => '919876500054', 'website' => 'https://biz54.in',
                'avg_rating' => 4.5, 'review_count' => 540, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz54@truedial.in', 'owner_name' => 'Owner 54'
            ],
            [
                'slug' => 'automobile-services-biz-55',
                'title' => 'Automobile Services Business 5',
                'category_slug' => 'automobile-services',
                'description' => 'Best Automobile Services Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500055', 'whatsapp' => '919876500055', 'website' => 'https://biz55.in',
                'avg_rating' => 4.5, 'review_count' => 550, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz55@truedial.in', 'owner_name' => 'Owner 55'
            ],
            [
                'slug' => 'travel-tourism-biz-56',
                'title' => 'Travel Business 1',
                'category_slug' => 'travel-tourism',
                'description' => 'Best Travel Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500056', 'whatsapp' => '919876500056', 'website' => 'https://biz56.in',
                'avg_rating' => 4.5, 'review_count' => 560, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz56@truedial.in', 'owner_name' => 'Owner 56'
            ],
            [
                'slug' => 'travel-tourism-biz-57',
                'title' => 'Travel Business 2',
                'category_slug' => 'travel-tourism',
                'description' => 'Best Travel Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500057', 'whatsapp' => '919876500057', 'website' => 'https://biz57.in',
                'avg_rating' => 4.5, 'review_count' => 570, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz57@truedial.in', 'owner_name' => 'Owner 57'
            ],
            [
                'slug' => 'travel-tourism-biz-58',
                'title' => 'Travel Business 3',
                'category_slug' => 'travel-tourism',
                'description' => 'Best Travel Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500058', 'whatsapp' => '919876500058', 'website' => 'https://biz58.in',
                'avg_rating' => 4.5, 'review_count' => 580, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz58@truedial.in', 'owner_name' => 'Owner 58'
            ],
            [
                'slug' => 'travel-tourism-biz-59',
                'title' => 'Travel Business 4',
                'category_slug' => 'travel-tourism',
                'description' => 'Best Travel Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500059', 'whatsapp' => '919876500059', 'website' => 'https://biz59.in',
                'avg_rating' => 4.5, 'review_count' => 590, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz59@truedial.in', 'owner_name' => 'Owner 59'
            ],
            [
                'slug' => 'travel-tourism-biz-60',
                'title' => 'Travel Business 5',
                'category_slug' => 'travel-tourism',
                'description' => 'Best Travel Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500060', 'whatsapp' => '919876500060', 'website' => 'https://biz60.in',
                'avg_rating' => 4.5, 'review_count' => 600, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz60@truedial.in', 'owner_name' => 'Owner 60'
            ],
            [
                'slug' => 'real-estate-property-biz-61',
                'title' => 'Real Estate Business 1',
                'category_slug' => 'real-estate-property',
                'description' => 'Best Real Estate Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500061', 'whatsapp' => '919876500061', 'website' => 'https://biz61.in',
                'avg_rating' => 4.5, 'review_count' => 610, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz61@truedial.in', 'owner_name' => 'Owner 61'
            ],
            [
                'slug' => 'real-estate-property-biz-62',
                'title' => 'Real Estate Business 2',
                'category_slug' => 'real-estate-property',
                'description' => 'Best Real Estate Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500062', 'whatsapp' => '919876500062', 'website' => 'https://biz62.in',
                'avg_rating' => 4.5, 'review_count' => 620, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz62@truedial.in', 'owner_name' => 'Owner 62'
            ],
            [
                'slug' => 'real-estate-property-biz-63',
                'title' => 'Real Estate Business 3',
                'category_slug' => 'real-estate-property',
                'description' => 'Best Real Estate Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500063', 'whatsapp' => '919876500063', 'website' => 'https://biz63.in',
                'avg_rating' => 4.5, 'review_count' => 630, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz63@truedial.in', 'owner_name' => 'Owner 63'
            ],
            [
                'slug' => 'real-estate-property-biz-64',
                'title' => 'Real Estate Business 4',
                'category_slug' => 'real-estate-property',
                'description' => 'Best Real Estate Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500064', 'whatsapp' => '919876500064', 'website' => 'https://biz64.in',
                'avg_rating' => 4.5, 'review_count' => 640, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz64@truedial.in', 'owner_name' => 'Owner 64'
            ],
            [
                'slug' => 'real-estate-property-biz-65',
                'title' => 'Real Estate Business 5',
                'category_slug' => 'real-estate-property',
                'description' => 'Best Real Estate Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500065', 'whatsapp' => '919876500065', 'website' => 'https://biz65.in',
                'avg_rating' => 4.5, 'review_count' => 650, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz65@truedial.in', 'owner_name' => 'Owner 65'
            ],
            [
                'slug' => 'legal-financial-biz-66',
                'title' => 'Legal Business 1',
                'category_slug' => 'legal-financial',
                'description' => 'Best Legal Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500066', 'whatsapp' => '919876500066', 'website' => 'https://biz66.in',
                'avg_rating' => 4.5, 'review_count' => 660, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz66@truedial.in', 'owner_name' => 'Owner 66'
            ],
            [
                'slug' => 'legal-financial-biz-67',
                'title' => 'Legal Business 2',
                'category_slug' => 'legal-financial',
                'description' => 'Best Legal Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500067', 'whatsapp' => '919876500067', 'website' => 'https://biz67.in',
                'avg_rating' => 4.5, 'review_count' => 670, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz67@truedial.in', 'owner_name' => 'Owner 67'
            ],
            [
                'slug' => 'legal-financial-biz-68',
                'title' => 'Legal Business 3',
                'category_slug' => 'legal-financial',
                'description' => 'Best Legal Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500068', 'whatsapp' => '919876500068', 'website' => 'https://biz68.in',
                'avg_rating' => 4.5, 'review_count' => 680, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz68@truedial.in', 'owner_name' => 'Owner 68'
            ],
            [
                'slug' => 'legal-financial-biz-69',
                'title' => 'Legal Business 4',
                'category_slug' => 'legal-financial',
                'description' => 'Best Legal Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500069', 'whatsapp' => '919876500069', 'website' => 'https://biz69.in',
                'avg_rating' => 4.5, 'review_count' => 690, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz69@truedial.in', 'owner_name' => 'Owner 69'
            ],
            [
                'slug' => 'legal-financial-biz-70',
                'title' => 'Legal Business 5',
                'category_slug' => 'legal-financial',
                'description' => 'Best Legal Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500070', 'whatsapp' => '919876500070', 'website' => 'https://biz70.in',
                'avg_rating' => 4.5, 'review_count' => 700, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz70@truedial.in', 'owner_name' => 'Owner 70'
            ],
            [
                'slug' => 'grocery-supermarket-biz-71',
                'title' => 'Grocery Business 1',
                'category_slug' => 'grocery-supermarket',
                'description' => 'Best Grocery Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500071', 'whatsapp' => '919876500071', 'website' => 'https://biz71.in',
                'avg_rating' => 4.5, 'review_count' => 710, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz71@truedial.in', 'owner_name' => 'Owner 71'
            ],
            [
                'slug' => 'grocery-supermarket-biz-72',
                'title' => 'Grocery Business 2',
                'category_slug' => 'grocery-supermarket',
                'description' => 'Best Grocery Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500072', 'whatsapp' => '919876500072', 'website' => 'https://biz72.in',
                'avg_rating' => 4.5, 'review_count' => 720, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz72@truedial.in', 'owner_name' => 'Owner 72'
            ],
            [
                'slug' => 'grocery-supermarket-biz-73',
                'title' => 'Grocery Business 3',
                'category_slug' => 'grocery-supermarket',
                'description' => 'Best Grocery Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500073', 'whatsapp' => '919876500073', 'website' => 'https://biz73.in',
                'avg_rating' => 4.5, 'review_count' => 730, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz73@truedial.in', 'owner_name' => 'Owner 73'
            ],
            [
                'slug' => 'grocery-supermarket-biz-74',
                'title' => 'Grocery Business 4',
                'category_slug' => 'grocery-supermarket',
                'description' => 'Best Grocery Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500074', 'whatsapp' => '919876500074', 'website' => 'https://biz74.in',
                'avg_rating' => 4.5, 'review_count' => 740, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz74@truedial.in', 'owner_name' => 'Owner 74'
            ],
            [
                'slug' => 'grocery-supermarket-biz-75',
                'title' => 'Grocery Business 5',
                'category_slug' => 'grocery-supermarket',
                'description' => 'Best Grocery Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500075', 'whatsapp' => '919876500075', 'website' => 'https://biz75.in',
                'avg_rating' => 4.5, 'review_count' => 750, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz75@truedial.in', 'owner_name' => 'Owner 75'
            ],
            [
                'slug' => 'pharmacy-medical-biz-76',
                'title' => 'Pharmacy Business 1',
                'category_slug' => 'pharmacy-medical',
                'description' => 'Best Pharmacy Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500076', 'whatsapp' => '919876500076', 'website' => 'https://biz76.in',
                'avg_rating' => 4.5, 'review_count' => 760, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz76@truedial.in', 'owner_name' => 'Owner 76'
            ],
            [
                'slug' => 'pharmacy-medical-biz-77',
                'title' => 'Pharmacy Business 2',
                'category_slug' => 'pharmacy-medical',
                'description' => 'Best Pharmacy Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500077', 'whatsapp' => '919876500077', 'website' => 'https://biz77.in',
                'avg_rating' => 4.5, 'review_count' => 770, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz77@truedial.in', 'owner_name' => 'Owner 77'
            ],
            [
                'slug' => 'pharmacy-medical-biz-78',
                'title' => 'Pharmacy Business 3',
                'category_slug' => 'pharmacy-medical',
                'description' => 'Best Pharmacy Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500078', 'whatsapp' => '919876500078', 'website' => 'https://biz78.in',
                'avg_rating' => 4.5, 'review_count' => 780, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz78@truedial.in', 'owner_name' => 'Owner 78'
            ],
            [
                'slug' => 'pharmacy-medical-biz-79',
                'title' => 'Pharmacy Business 4',
                'category_slug' => 'pharmacy-medical',
                'description' => 'Best Pharmacy Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500079', 'whatsapp' => '919876500079', 'website' => 'https://biz79.in',
                'avg_rating' => 4.5, 'review_count' => 790, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz79@truedial.in', 'owner_name' => 'Owner 79'
            ],
            [
                'slug' => 'pharmacy-medical-biz-80',
                'title' => 'Pharmacy Business 5',
                'category_slug' => 'pharmacy-medical',
                'description' => 'Best Pharmacy Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500080', 'whatsapp' => '919876500080', 'website' => 'https://biz80.in',
                'avg_rating' => 4.5, 'review_count' => 800, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz80@truedial.in', 'owner_name' => 'Owner 80'
            ],
            [
                'slug' => 'electronics-gadgets-biz-81',
                'title' => 'Electronics Business 1',
                'category_slug' => 'electronics-gadgets',
                'description' => 'Best Electronics Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500081', 'whatsapp' => '919876500081', 'website' => 'https://biz81.in',
                'avg_rating' => 4.5, 'review_count' => 810, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz81@truedial.in', 'owner_name' => 'Owner 81'
            ],
            [
                'slug' => 'electronics-gadgets-biz-82',
                'title' => 'Electronics Business 2',
                'category_slug' => 'electronics-gadgets',
                'description' => 'Best Electronics Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500082', 'whatsapp' => '919876500082', 'website' => 'https://biz82.in',
                'avg_rating' => 4.5, 'review_count' => 820, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz82@truedial.in', 'owner_name' => 'Owner 82'
            ],
            [
                'slug' => 'electronics-gadgets-biz-83',
                'title' => 'Electronics Business 3',
                'category_slug' => 'electronics-gadgets',
                'description' => 'Best Electronics Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500083', 'whatsapp' => '919876500083', 'website' => 'https://biz83.in',
                'avg_rating' => 4.5, 'review_count' => 830, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz83@truedial.in', 'owner_name' => 'Owner 83'
            ],
            [
                'slug' => 'electronics-gadgets-biz-84',
                'title' => 'Electronics Business 4',
                'category_slug' => 'electronics-gadgets',
                'description' => 'Best Electronics Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500084', 'whatsapp' => '919876500084', 'website' => 'https://biz84.in',
                'avg_rating' => 4.5, 'review_count' => 840, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz84@truedial.in', 'owner_name' => 'Owner 84'
            ],
            [
                'slug' => 'electronics-gadgets-biz-85',
                'title' => 'Electronics Business 5',
                'category_slug' => 'electronics-gadgets',
                'description' => 'Best Electronics Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500085', 'whatsapp' => '919876500085', 'website' => 'https://biz85.in',
                'avg_rating' => 4.5, 'review_count' => 850, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz85@truedial.in', 'owner_name' => 'Owner 85'
            ],
            [
                'slug' => 'clothing-fashion-biz-86',
                'title' => 'Clothing Business 1',
                'category_slug' => 'clothing-fashion',
                'description' => 'Best Clothing Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500086', 'whatsapp' => '919876500086', 'website' => 'https://biz86.in',
                'avg_rating' => 4.5, 'review_count' => 860, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz86@truedial.in', 'owner_name' => 'Owner 86'
            ],
            [
                'slug' => 'clothing-fashion-biz-87',
                'title' => 'Clothing Business 2',
                'category_slug' => 'clothing-fashion',
                'description' => 'Best Clothing Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500087', 'whatsapp' => '919876500087', 'website' => 'https://biz87.in',
                'avg_rating' => 4.5, 'review_count' => 870, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz87@truedial.in', 'owner_name' => 'Owner 87'
            ],
            [
                'slug' => 'clothing-fashion-biz-88',
                'title' => 'Clothing Business 3',
                'category_slug' => 'clothing-fashion',
                'description' => 'Best Clothing Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500088', 'whatsapp' => '919876500088', 'website' => 'https://biz88.in',
                'avg_rating' => 4.5, 'review_count' => 880, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz88@truedial.in', 'owner_name' => 'Owner 88'
            ],
            [
                'slug' => 'clothing-fashion-biz-89',
                'title' => 'Clothing Business 4',
                'category_slug' => 'clothing-fashion',
                'description' => 'Best Clothing Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500089', 'whatsapp' => '919876500089', 'website' => 'https://biz89.in',
                'avg_rating' => 4.5, 'review_count' => 890, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz89@truedial.in', 'owner_name' => 'Owner 89'
            ],
            [
                'slug' => 'clothing-fashion-biz-90',
                'title' => 'Clothing Business 5',
                'category_slug' => 'clothing-fashion',
                'description' => 'Best Clothing Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500090', 'whatsapp' => '919876500090', 'website' => 'https://biz90.in',
                'avg_rating' => 4.5, 'review_count' => 900, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz90@truedial.in', 'owner_name' => 'Owner 90'
            ],
            [
                'slug' => 'furniture-home-decor-biz-91',
                'title' => 'Furniture Business 1',
                'category_slug' => 'furniture-home-decor',
                'description' => 'Best Furniture Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500091', 'whatsapp' => '919876500091', 'website' => 'https://biz91.in',
                'avg_rating' => 4.5, 'review_count' => 910, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz91@truedial.in', 'owner_name' => 'Owner 91'
            ],
            [
                'slug' => 'furniture-home-decor-biz-92',
                'title' => 'Furniture Business 2',
                'category_slug' => 'furniture-home-decor',
                'description' => 'Best Furniture Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500092', 'whatsapp' => '919876500092', 'website' => 'https://biz92.in',
                'avg_rating' => 4.5, 'review_count' => 920, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz92@truedial.in', 'owner_name' => 'Owner 92'
            ],
            [
                'slug' => 'furniture-home-decor-biz-93',
                'title' => 'Furniture Business 3',
                'category_slug' => 'furniture-home-decor',
                'description' => 'Best Furniture Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500093', 'whatsapp' => '919876500093', 'website' => 'https://biz93.in',
                'avg_rating' => 4.5, 'review_count' => 930, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz93@truedial.in', 'owner_name' => 'Owner 93'
            ],
            [
                'slug' => 'furniture-home-decor-biz-94',
                'title' => 'Furniture Business 4',
                'category_slug' => 'furniture-home-decor',
                'description' => 'Best Furniture Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500094', 'whatsapp' => '919876500094', 'website' => 'https://biz94.in',
                'avg_rating' => 4.5, 'review_count' => 940, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz94@truedial.in', 'owner_name' => 'Owner 94'
            ],
            [
                'slug' => 'furniture-home-decor-biz-95',
                'title' => 'Furniture Business 5',
                'category_slug' => 'furniture-home-decor',
                'description' => 'Best Furniture Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500095', 'whatsapp' => '919876500095', 'website' => 'https://biz95.in',
                'avg_rating' => 4.5, 'review_count' => 950, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz95@truedial.in', 'owner_name' => 'Owner 95'
            ],
            [
                'slug' => 'photography-videography-biz-96',
                'title' => 'Photography Business 1',
                'category_slug' => 'photography-videography',
                'description' => 'Best Photography Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500096', 'whatsapp' => '919876500096', 'website' => 'https://biz96.in',
                'avg_rating' => 4.5, 'review_count' => 960, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz96@truedial.in', 'owner_name' => 'Owner 96'
            ],
            [
                'slug' => 'photography-videography-biz-97',
                'title' => 'Photography Business 2',
                'category_slug' => 'photography-videography',
                'description' => 'Best Photography Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500097', 'whatsapp' => '919876500097', 'website' => 'https://biz97.in',
                'avg_rating' => 4.5, 'review_count' => 970, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz97@truedial.in', 'owner_name' => 'Owner 97'
            ],
            [
                'slug' => 'photography-videography-biz-98',
                'title' => 'Photography Business 3',
                'category_slug' => 'photography-videography',
                'description' => 'Best Photography Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500098', 'whatsapp' => '919876500098', 'website' => 'https://biz98.in',
                'avg_rating' => 4.5, 'review_count' => 980, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz98@truedial.in', 'owner_name' => 'Owner 98'
            ],
            [
                'slug' => 'photography-videography-biz-99',
                'title' => 'Photography Business 4',
                'category_slug' => 'photography-videography',
                'description' => 'Best Photography Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500099', 'whatsapp' => '919876500099', 'website' => 'https://biz99.in',
                'avg_rating' => 4.5, 'review_count' => 990, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz99@truedial.in', 'owner_name' => 'Owner 99'
            ],
            [
                'slug' => 'photography-videography-biz-100',
                'title' => 'Photography Business 5',
                'category_slug' => 'photography-videography',
                'description' => 'Best Photography Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500100', 'whatsapp' => '919876500100', 'website' => 'https://biz100.in',
                'avg_rating' => 4.5, 'review_count' => 1000, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz100@truedial.in', 'owner_name' => 'Owner 100'
            ],
            [
                'slug' => 'packers-movers-biz-101',
                'title' => 'Packers Business 1',
                'category_slug' => 'packers-movers',
                'description' => 'Best Packers Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500101', 'whatsapp' => '919876500101', 'website' => 'https://biz101.in',
                'avg_rating' => 4.5, 'review_count' => 1010, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz101@truedial.in', 'owner_name' => 'Owner 101'
            ],
            [
                'slug' => 'packers-movers-biz-102',
                'title' => 'Packers Business 2',
                'category_slug' => 'packers-movers',
                'description' => 'Best Packers Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500102', 'whatsapp' => '919876500102', 'website' => 'https://biz102.in',
                'avg_rating' => 4.5, 'review_count' => 1020, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz102@truedial.in', 'owner_name' => 'Owner 102'
            ],
            [
                'slug' => 'packers-movers-biz-103',
                'title' => 'Packers Business 3',
                'category_slug' => 'packers-movers',
                'description' => 'Best Packers Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500103', 'whatsapp' => '919876500103', 'website' => 'https://biz103.in',
                'avg_rating' => 4.5, 'review_count' => 1030, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz103@truedial.in', 'owner_name' => 'Owner 103'
            ],
            [
                'slug' => 'packers-movers-biz-104',
                'title' => 'Packers Business 4',
                'category_slug' => 'packers-movers',
                'description' => 'Best Packers Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500104', 'whatsapp' => '919876500104', 'website' => 'https://biz104.in',
                'avg_rating' => 4.5, 'review_count' => 1040, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz104@truedial.in', 'owner_name' => 'Owner 104'
            ],
            [
                'slug' => 'packers-movers-biz-105',
                'title' => 'Packers Business 5',
                'category_slug' => 'packers-movers',
                'description' => 'Best Packers Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500105', 'whatsapp' => '919876500105', 'website' => 'https://biz105.in',
                'avg_rating' => 4.5, 'review_count' => 1050, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz105@truedial.in', 'owner_name' => 'Owner 105'
            ],
            [
                'slug' => 'printing-advertising-biz-106',
                'title' => 'Printing Business 1',
                'category_slug' => 'printing-advertising',
                'description' => 'Best Printing Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500106', 'whatsapp' => '919876500106', 'website' => 'https://biz106.in',
                'avg_rating' => 4.5, 'review_count' => 1060, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz106@truedial.in', 'owner_name' => 'Owner 106'
            ],
            [
                'slug' => 'printing-advertising-biz-107',
                'title' => 'Printing Business 2',
                'category_slug' => 'printing-advertising',
                'description' => 'Best Printing Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500107', 'whatsapp' => '919876500107', 'website' => 'https://biz107.in',
                'avg_rating' => 4.5, 'review_count' => 1070, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz107@truedial.in', 'owner_name' => 'Owner 107'
            ],
            [
                'slug' => 'printing-advertising-biz-108',
                'title' => 'Printing Business 3',
                'category_slug' => 'printing-advertising',
                'description' => 'Best Printing Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500108', 'whatsapp' => '919876500108', 'website' => 'https://biz108.in',
                'avg_rating' => 4.5, 'review_count' => 1080, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz108@truedial.in', 'owner_name' => 'Owner 108'
            ],
            [
                'slug' => 'printing-advertising-biz-109',
                'title' => 'Printing Business 4',
                'category_slug' => 'printing-advertising',
                'description' => 'Best Printing Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500109', 'whatsapp' => '919876500109', 'website' => 'https://biz109.in',
                'avg_rating' => 4.5, 'review_count' => 1090, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz109@truedial.in', 'owner_name' => 'Owner 109'
            ],
            [
                'slug' => 'printing-advertising-biz-110',
                'title' => 'Printing Business 5',
                'category_slug' => 'printing-advertising',
                'description' => 'Best Printing Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500110', 'whatsapp' => '919876500110', 'website' => 'https://biz110.in',
                'avg_rating' => 4.5, 'review_count' => 1100, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz110@truedial.in', 'owner_name' => 'Owner 110'
            ],
            [
                'slug' => 'catering-tiffin-biz-111',
                'title' => 'Catering Business 1',
                'category_slug' => 'catering-tiffin',
                'description' => 'Best Catering Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500111', 'whatsapp' => '919876500111', 'website' => 'https://biz111.in',
                'avg_rating' => 4.5, 'review_count' => 1110, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz111@truedial.in', 'owner_name' => 'Owner 111'
            ],
            [
                'slug' => 'catering-tiffin-biz-112',
                'title' => 'Catering Business 2',
                'category_slug' => 'catering-tiffin',
                'description' => 'Best Catering Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500112', 'whatsapp' => '919876500112', 'website' => 'https://biz112.in',
                'avg_rating' => 4.5, 'review_count' => 1120, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz112@truedial.in', 'owner_name' => 'Owner 112'
            ],
            [
                'slug' => 'catering-tiffin-biz-113',
                'title' => 'Catering Business 3',
                'category_slug' => 'catering-tiffin',
                'description' => 'Best Catering Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500113', 'whatsapp' => '919876500113', 'website' => 'https://biz113.in',
                'avg_rating' => 4.5, 'review_count' => 1130, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz113@truedial.in', 'owner_name' => 'Owner 113'
            ],
            [
                'slug' => 'catering-tiffin-biz-114',
                'title' => 'Catering Business 4',
                'category_slug' => 'catering-tiffin',
                'description' => 'Best Catering Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500114', 'whatsapp' => '919876500114', 'website' => 'https://biz114.in',
                'avg_rating' => 4.5, 'review_count' => 1140, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz114@truedial.in', 'owner_name' => 'Owner 114'
            ],
            [
                'slug' => 'catering-tiffin-biz-115',
                'title' => 'Catering Business 5',
                'category_slug' => 'catering-tiffin',
                'description' => 'Best Catering Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500115', 'whatsapp' => '919876500115', 'website' => 'https://biz115.in',
                'avg_rating' => 4.5, 'review_count' => 1150, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz115@truedial.in', 'owner_name' => 'Owner 115'
            ],
            [
                'slug' => 'pet-services-biz-116',
                'title' => 'Pet Services Business 1',
                'category_slug' => 'pet-services',
                'description' => 'Best Pet Services Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500116', 'whatsapp' => '919876500116', 'website' => 'https://biz116.in',
                'avg_rating' => 4.5, 'review_count' => 1160, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz116@truedial.in', 'owner_name' => 'Owner 116'
            ],
            [
                'slug' => 'pet-services-biz-117',
                'title' => 'Pet Services Business 2',
                'category_slug' => 'pet-services',
                'description' => 'Best Pet Services Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500117', 'whatsapp' => '919876500117', 'website' => 'https://biz117.in',
                'avg_rating' => 4.5, 'review_count' => 1170, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz117@truedial.in', 'owner_name' => 'Owner 117'
            ],
            [
                'slug' => 'pet-services-biz-118',
                'title' => 'Pet Services Business 3',
                'category_slug' => 'pet-services',
                'description' => 'Best Pet Services Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500118', 'whatsapp' => '919876500118', 'website' => 'https://biz118.in',
                'avg_rating' => 4.5, 'review_count' => 1180, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz118@truedial.in', 'owner_name' => 'Owner 118'
            ],
            [
                'slug' => 'pet-services-biz-119',
                'title' => 'Pet Services Business 4',
                'category_slug' => 'pet-services',
                'description' => 'Best Pet Services Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500119', 'whatsapp' => '919876500119', 'website' => 'https://biz119.in',
                'avg_rating' => 4.5, 'review_count' => 1190, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz119@truedial.in', 'owner_name' => 'Owner 119'
            ],
            [
                'slug' => 'pet-services-biz-120',
                'title' => 'Pet Services Business 5',
                'category_slug' => 'pet-services',
                'description' => 'Best Pet Services Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500120', 'whatsapp' => '919876500120', 'website' => 'https://biz120.in',
                'avg_rating' => 4.5, 'review_count' => 1200, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz120@truedial.in', 'owner_name' => 'Owner 120'
            ],
            [
                'slug' => 'jewellery-accessories-biz-121',
                'title' => 'Jewellery Business 1',
                'category_slug' => 'jewellery-accessories',
                'description' => 'Best Jewellery Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500121', 'whatsapp' => '919876500121', 'website' => 'https://biz121.in',
                'avg_rating' => 4.5, 'review_count' => 1210, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz121@truedial.in', 'owner_name' => 'Owner 121'
            ],
            [
                'slug' => 'jewellery-accessories-biz-122',
                'title' => 'Jewellery Business 2',
                'category_slug' => 'jewellery-accessories',
                'description' => 'Best Jewellery Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500122', 'whatsapp' => '919876500122', 'website' => 'https://biz122.in',
                'avg_rating' => 4.5, 'review_count' => 1220, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz122@truedial.in', 'owner_name' => 'Owner 122'
            ],
            [
                'slug' => 'jewellery-accessories-biz-123',
                'title' => 'Jewellery Business 3',
                'category_slug' => 'jewellery-accessories',
                'description' => 'Best Jewellery Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500123', 'whatsapp' => '919876500123', 'website' => 'https://biz123.in',
                'avg_rating' => 4.5, 'review_count' => 1230, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz123@truedial.in', 'owner_name' => 'Owner 123'
            ],
            [
                'slug' => 'jewellery-accessories-biz-124',
                'title' => 'Jewellery Business 4',
                'category_slug' => 'jewellery-accessories',
                'description' => 'Best Jewellery Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500124', 'whatsapp' => '919876500124', 'website' => 'https://biz124.in',
                'avg_rating' => 4.5, 'review_count' => 1240, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz124@truedial.in', 'owner_name' => 'Owner 124'
            ],
            [
                'slug' => 'jewellery-accessories-biz-125',
                'title' => 'Jewellery Business 5',
                'category_slug' => 'jewellery-accessories',
                'description' => 'Best Jewellery Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500125', 'whatsapp' => '919876500125', 'website' => 'https://biz125.in',
                'avg_rating' => 4.5, 'review_count' => 1250, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz125@truedial.in', 'owner_name' => 'Owner 125'
            ],
            [
                'slug' => 'banking-insurance-biz-126',
                'title' => 'Banking Business 1',
                'category_slug' => 'banking-insurance',
                'description' => 'Best Banking Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500126', 'whatsapp' => '919876500126', 'website' => 'https://biz126.in',
                'avg_rating' => 4.5, 'review_count' => 1260, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz126@truedial.in', 'owner_name' => 'Owner 126'
            ],
            [
                'slug' => 'banking-insurance-biz-127',
                'title' => 'Banking Business 2',
                'category_slug' => 'banking-insurance',
                'description' => 'Best Banking Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500127', 'whatsapp' => '919876500127', 'website' => 'https://biz127.in',
                'avg_rating' => 4.5, 'review_count' => 1270, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz127@truedial.in', 'owner_name' => 'Owner 127'
            ],
            [
                'slug' => 'banking-insurance-biz-128',
                'title' => 'Banking Business 3',
                'category_slug' => 'banking-insurance',
                'description' => 'Best Banking Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500128', 'whatsapp' => '919876500128', 'website' => 'https://biz128.in',
                'avg_rating' => 4.5, 'review_count' => 1280, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz128@truedial.in', 'owner_name' => 'Owner 128'
            ],
            [
                'slug' => 'banking-insurance-biz-129',
                'title' => 'Banking Business 4',
                'category_slug' => 'banking-insurance',
                'description' => 'Best Banking Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500129', 'whatsapp' => '919876500129', 'website' => 'https://biz129.in',
                'avg_rating' => 4.5, 'review_count' => 1290, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz129@truedial.in', 'owner_name' => 'Owner 129'
            ],
            [
                'slug' => 'banking-insurance-biz-130',
                'title' => 'Banking Business 5',
                'category_slug' => 'banking-insurance',
                'description' => 'Best Banking Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500130', 'whatsapp' => '919876500130', 'website' => 'https://biz130.in',
                'avg_rating' => 4.5, 'review_count' => 1300, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz130@truedial.in', 'owner_name' => 'Owner 130'
            ],
            [
                'slug' => 'courier-delivery-biz-131',
                'title' => 'Courier Business 1',
                'category_slug' => 'courier-delivery',
                'description' => 'Best Courier Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500131', 'whatsapp' => '919876500131', 'website' => 'https://biz131.in',
                'avg_rating' => 4.5, 'review_count' => 1310, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz131@truedial.in', 'owner_name' => 'Owner 131'
            ],
            [
                'slug' => 'courier-delivery-biz-132',
                'title' => 'Courier Business 2',
                'category_slug' => 'courier-delivery',
                'description' => 'Best Courier Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500132', 'whatsapp' => '919876500132', 'website' => 'https://biz132.in',
                'avg_rating' => 4.5, 'review_count' => 1320, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz132@truedial.in', 'owner_name' => 'Owner 132'
            ],
            [
                'slug' => 'courier-delivery-biz-133',
                'title' => 'Courier Business 3',
                'category_slug' => 'courier-delivery',
                'description' => 'Best Courier Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500133', 'whatsapp' => '919876500133', 'website' => 'https://biz133.in',
                'avg_rating' => 4.5, 'review_count' => 1330, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz133@truedial.in', 'owner_name' => 'Owner 133'
            ],
            [
                'slug' => 'courier-delivery-biz-134',
                'title' => 'Courier Business 4',
                'category_slug' => 'courier-delivery',
                'description' => 'Best Courier Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500134', 'whatsapp' => '919876500134', 'website' => 'https://biz134.in',
                'avg_rating' => 4.5, 'review_count' => 1340, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz134@truedial.in', 'owner_name' => 'Owner 134'
            ],
            [
                'slug' => 'courier-delivery-biz-135',
                'title' => 'Courier Business 5',
                'category_slug' => 'courier-delivery',
                'description' => 'Best Courier Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500135', 'whatsapp' => '919876500135', 'website' => 'https://biz135.in',
                'avg_rating' => 4.5, 'review_count' => 1350, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz135@truedial.in', 'owner_name' => 'Owner 135'
            ],
            [
                'slug' => 'hardware-building-biz-136',
                'title' => 'Hardware Business 1',
                'category_slug' => 'hardware-building',
                'description' => 'Best Hardware Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500136', 'whatsapp' => '919876500136', 'website' => 'https://biz136.in',
                'avg_rating' => 4.5, 'review_count' => 1360, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz136@truedial.in', 'owner_name' => 'Owner 136'
            ],
            [
                'slug' => 'hardware-building-biz-137',
                'title' => 'Hardware Business 2',
                'category_slug' => 'hardware-building',
                'description' => 'Best Hardware Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500137', 'whatsapp' => '919876500137', 'website' => 'https://biz137.in',
                'avg_rating' => 4.5, 'review_count' => 1370, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz137@truedial.in', 'owner_name' => 'Owner 137'
            ],
            [
                'slug' => 'hardware-building-biz-138',
                'title' => 'Hardware Business 3',
                'category_slug' => 'hardware-building',
                'description' => 'Best Hardware Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500138', 'whatsapp' => '919876500138', 'website' => 'https://biz138.in',
                'avg_rating' => 4.5, 'review_count' => 1380, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz138@truedial.in', 'owner_name' => 'Owner 138'
            ],
            [
                'slug' => 'hardware-building-biz-139',
                'title' => 'Hardware Business 4',
                'category_slug' => 'hardware-building',
                'description' => 'Best Hardware Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500139', 'whatsapp' => '919876500139', 'website' => 'https://biz139.in',
                'avg_rating' => 4.5, 'review_count' => 1390, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz139@truedial.in', 'owner_name' => 'Owner 139'
            ],
            [
                'slug' => 'hardware-building-biz-140',
                'title' => 'Hardware Business 5',
                'category_slug' => 'hardware-building',
                'description' => 'Best Hardware Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500140', 'whatsapp' => '919876500140', 'website' => 'https://biz140.in',
                'avg_rating' => 4.5, 'review_count' => 1400, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz140@truedial.in', 'owner_name' => 'Owner 140'
            ],
            [
                'slug' => 'books-stationery-biz-141',
                'title' => 'Books Business 1',
                'category_slug' => 'books-stationery',
                'description' => 'Best Books Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500141', 'whatsapp' => '919876500141', 'website' => 'https://biz141.in',
                'avg_rating' => 4.5, 'review_count' => 1410, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz141@truedial.in', 'owner_name' => 'Owner 141'
            ],
            [
                'slug' => 'books-stationery-biz-142',
                'title' => 'Books Business 2',
                'category_slug' => 'books-stationery',
                'description' => 'Best Books Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500142', 'whatsapp' => '919876500142', 'website' => 'https://biz142.in',
                'avg_rating' => 4.5, 'review_count' => 1420, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz142@truedial.in', 'owner_name' => 'Owner 142'
            ],
            [
                'slug' => 'books-stationery-biz-143',
                'title' => 'Books Business 3',
                'category_slug' => 'books-stationery',
                'description' => 'Best Books Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500143', 'whatsapp' => '919876500143', 'website' => 'https://biz143.in',
                'avg_rating' => 4.5, 'review_count' => 1430, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz143@truedial.in', 'owner_name' => 'Owner 143'
            ],
            [
                'slug' => 'books-stationery-biz-144',
                'title' => 'Books Business 4',
                'category_slug' => 'books-stationery',
                'description' => 'Best Books Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500144', 'whatsapp' => '919876500144', 'website' => 'https://biz144.in',
                'avg_rating' => 4.5, 'review_count' => 1440, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz144@truedial.in', 'owner_name' => 'Owner 144'
            ],
            [
                'slug' => 'books-stationery-biz-145',
                'title' => 'Books Business 5',
                'category_slug' => 'books-stationery',
                'description' => 'Best Books Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500145', 'whatsapp' => '919876500145', 'website' => 'https://biz145.in',
                'avg_rating' => 4.5, 'review_count' => 1450, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz145@truedial.in', 'owner_name' => 'Owner 145'
            ],
            [
                'slug' => 'nursery-garden-biz-146',
                'title' => 'Nursery Business 1',
                'category_slug' => 'nursery-garden',
                'description' => 'Best Nursery Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500146', 'whatsapp' => '919876500146', 'website' => 'https://biz146.in',
                'avg_rating' => 4.5, 'review_count' => 1460, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz146@truedial.in', 'owner_name' => 'Owner 146'
            ],
            [
                'slug' => 'nursery-garden-biz-147',
                'title' => 'Nursery Business 2',
                'category_slug' => 'nursery-garden',
                'description' => 'Best Nursery Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500147', 'whatsapp' => '919876500147', 'website' => 'https://biz147.in',
                'avg_rating' => 4.5, 'review_count' => 1470, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz147@truedial.in', 'owner_name' => 'Owner 147'
            ],
            [
                'slug' => 'nursery-garden-biz-148',
                'title' => 'Nursery Business 3',
                'category_slug' => 'nursery-garden',
                'description' => 'Best Nursery Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500148', 'whatsapp' => '919876500148', 'website' => 'https://biz148.in',
                'avg_rating' => 4.5, 'review_count' => 1480, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz148@truedial.in', 'owner_name' => 'Owner 148'
            ],
            [
                'slug' => 'nursery-garden-biz-149',
                'title' => 'Nursery Business 4',
                'category_slug' => 'nursery-garden',
                'description' => 'Best Nursery Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500149', 'whatsapp' => '919876500149', 'website' => 'https://biz149.in',
                'avg_rating' => 4.5, 'review_count' => 1490, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz149@truedial.in', 'owner_name' => 'Owner 149'
            ],
            [
                'slug' => 'nursery-garden-biz-150',
                'title' => 'Nursery Business 5',
                'category_slug' => 'nursery-garden',
                'description' => 'Best Nursery Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500150', 'whatsapp' => '919876500150', 'website' => 'https://biz150.in',
                'avg_rating' => 4.5, 'review_count' => 1500, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz150@truedial.in', 'owner_name' => 'Owner 150'
            ],
            [
                'slug' => 'security-services-biz-151',
                'title' => 'Security Services Business 1',
                'category_slug' => 'security-services',
                'description' => 'Best Security Services Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500151', 'whatsapp' => '919876500151', 'website' => 'https://biz151.in',
                'avg_rating' => 4.5, 'review_count' => 1510, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz151@truedial.in', 'owner_name' => 'Owner 151'
            ],
            [
                'slug' => 'security-services-biz-152',
                'title' => 'Security Services Business 2',
                'category_slug' => 'security-services',
                'description' => 'Best Security Services Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500152', 'whatsapp' => '919876500152', 'website' => 'https://biz152.in',
                'avg_rating' => 4.5, 'review_count' => 1520, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz152@truedial.in', 'owner_name' => 'Owner 152'
            ],
            [
                'slug' => 'security-services-biz-153',
                'title' => 'Security Services Business 3',
                'category_slug' => 'security-services',
                'description' => 'Best Security Services Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500153', 'whatsapp' => '919876500153', 'website' => 'https://biz153.in',
                'avg_rating' => 4.5, 'review_count' => 1530, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz153@truedial.in', 'owner_name' => 'Owner 153'
            ],
            [
                'slug' => 'security-services-biz-154',
                'title' => 'Security Services Business 4',
                'category_slug' => 'security-services',
                'description' => 'Best Security Services Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500154', 'whatsapp' => '919876500154', 'website' => 'https://biz154.in',
                'avg_rating' => 4.5, 'review_count' => 1540, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz154@truedial.in', 'owner_name' => 'Owner 154'
            ],
            [
                'slug' => 'security-services-biz-155',
                'title' => 'Security Services Business 5',
                'category_slug' => 'security-services',
                'description' => 'Best Security Services Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500155', 'whatsapp' => '919876500155', 'website' => 'https://biz155.in',
                'avg_rating' => 4.5, 'review_count' => 1550, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz155@truedial.in', 'owner_name' => 'Owner 155'
            ],
            [
                'slug' => 'astrology-vastu-biz-156',
                'title' => 'Astrology Business 1',
                'category_slug' => 'astrology-vastu',
                'description' => 'Best Astrology Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500156', 'whatsapp' => '919876500156', 'website' => 'https://biz156.in',
                'avg_rating' => 4.5, 'review_count' => 1560, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz156@truedial.in', 'owner_name' => 'Owner 156'
            ],
            [
                'slug' => 'astrology-vastu-biz-157',
                'title' => 'Astrology Business 2',
                'category_slug' => 'astrology-vastu',
                'description' => 'Best Astrology Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500157', 'whatsapp' => '919876500157', 'website' => 'https://biz157.in',
                'avg_rating' => 4.5, 'review_count' => 1570, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz157@truedial.in', 'owner_name' => 'Owner 157'
            ],
            [
                'slug' => 'astrology-vastu-biz-158',
                'title' => 'Astrology Business 3',
                'category_slug' => 'astrology-vastu',
                'description' => 'Best Astrology Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500158', 'whatsapp' => '919876500158', 'website' => 'https://biz158.in',
                'avg_rating' => 4.5, 'review_count' => 1580, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz158@truedial.in', 'owner_name' => 'Owner 158'
            ],
            [
                'slug' => 'astrology-vastu-biz-159',
                'title' => 'Astrology Business 4',
                'category_slug' => 'astrology-vastu',
                'description' => 'Best Astrology Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500159', 'whatsapp' => '919876500159', 'website' => 'https://biz159.in',
                'avg_rating' => 4.5, 'review_count' => 1590, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz159@truedial.in', 'owner_name' => 'Owner 159'
            ],
            [
                'slug' => 'astrology-vastu-biz-160',
                'title' => 'Astrology Business 5',
                'category_slug' => 'astrology-vastu',
                'description' => 'Best Astrology Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500160', 'whatsapp' => '919876500160', 'website' => 'https://biz160.in',
                'avg_rating' => 4.5, 'review_count' => 1600, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz160@truedial.in', 'owner_name' => 'Owner 160'
            ],
            [
                'slug' => 'bakery-sweets-biz-161',
                'title' => 'Bakery Business 1',
                'category_slug' => 'bakery-sweets',
                'description' => 'Best Bakery Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500161', 'whatsapp' => '919876500161', 'website' => 'https://biz161.in',
                'avg_rating' => 4.5, 'review_count' => 1610, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz161@truedial.in', 'owner_name' => 'Owner 161'
            ],
            [
                'slug' => 'bakery-sweets-biz-162',
                'title' => 'Bakery Business 2',
                'category_slug' => 'bakery-sweets',
                'description' => 'Best Bakery Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500162', 'whatsapp' => '919876500162', 'website' => 'https://biz162.in',
                'avg_rating' => 4.5, 'review_count' => 1620, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz162@truedial.in', 'owner_name' => 'Owner 162'
            ],
            [
                'slug' => 'bakery-sweets-biz-163',
                'title' => 'Bakery Business 3',
                'category_slug' => 'bakery-sweets',
                'description' => 'Best Bakery Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500163', 'whatsapp' => '919876500163', 'website' => 'https://biz163.in',
                'avg_rating' => 4.5, 'review_count' => 1630, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz163@truedial.in', 'owner_name' => 'Owner 163'
            ],
            [
                'slug' => 'bakery-sweets-biz-164',
                'title' => 'Bakery Business 4',
                'category_slug' => 'bakery-sweets',
                'description' => 'Best Bakery Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500164', 'whatsapp' => '919876500164', 'website' => 'https://biz164.in',
                'avg_rating' => 4.5, 'review_count' => 1640, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz164@truedial.in', 'owner_name' => 'Owner 164'
            ],
            [
                'slug' => 'bakery-sweets-biz-165',
                'title' => 'Bakery Business 5',
                'category_slug' => 'bakery-sweets',
                'description' => 'Best Bakery Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500165', 'whatsapp' => '919876500165', 'website' => 'https://biz165.in',
                'avg_rating' => 4.5, 'review_count' => 1650, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz165@truedial.in', 'owner_name' => 'Owner 165'
            ],
            [
                'slug' => 'opticals-eyewear-biz-166',
                'title' => 'Opticals Business 1',
                'category_slug' => 'opticals-eyewear',
                'description' => 'Best Opticals Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500166', 'whatsapp' => '919876500166', 'website' => 'https://biz166.in',
                'avg_rating' => 4.5, 'review_count' => 1660, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz166@truedial.in', 'owner_name' => 'Owner 166'
            ],
            [
                'slug' => 'opticals-eyewear-biz-167',
                'title' => 'Opticals Business 2',
                'category_slug' => 'opticals-eyewear',
                'description' => 'Best Opticals Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500167', 'whatsapp' => '919876500167', 'website' => 'https://biz167.in',
                'avg_rating' => 4.5, 'review_count' => 1670, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz167@truedial.in', 'owner_name' => 'Owner 167'
            ],
            [
                'slug' => 'opticals-eyewear-biz-168',
                'title' => 'Opticals Business 3',
                'category_slug' => 'opticals-eyewear',
                'description' => 'Best Opticals Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500168', 'whatsapp' => '919876500168', 'website' => 'https://biz168.in',
                'avg_rating' => 4.5, 'review_count' => 1680, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz168@truedial.in', 'owner_name' => 'Owner 168'
            ],
            [
                'slug' => 'opticals-eyewear-biz-169',
                'title' => 'Opticals Business 4',
                'category_slug' => 'opticals-eyewear',
                'description' => 'Best Opticals Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500169', 'whatsapp' => '919876500169', 'website' => 'https://biz169.in',
                'avg_rating' => 4.5, 'review_count' => 1690, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz169@truedial.in', 'owner_name' => 'Owner 169'
            ],
            [
                'slug' => 'opticals-eyewear-biz-170',
                'title' => 'Opticals Business 5',
                'category_slug' => 'opticals-eyewear',
                'description' => 'Best Opticals Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500170', 'whatsapp' => '919876500170', 'website' => 'https://biz170.in',
                'avg_rating' => 4.5, 'review_count' => 1700, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz170@truedial.in', 'owner_name' => 'Owner 170'
            ],
            [
                'slug' => 'mobile-computer-repair-biz-171',
                'title' => 'Mobile Business 1',
                'category_slug' => 'mobile-computer-repair',
                'description' => 'Best Mobile Business 1 services in Patna. Providing top quality to all customers.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Main Road, Patna',
                'phone' => '+919876500171', 'whatsapp' => '919876500171', 'website' => 'https://biz171.in',
                'avg_rating' => 4.5, 'review_count' => 1710, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz171@truedial.in', 'owner_name' => 'Owner 171'
            ],
            [
                'slug' => 'mobile-computer-repair-biz-172',
                'title' => 'Mobile Business 2',
                'category_slug' => 'mobile-computer-repair',
                'description' => 'Best Mobile Business 2 services in Gaya. Providing top quality to all customers.',
                'city' => 'Gaya', 'district' => 'Gaya', 'state' => 'Bihar', 'address' => 'Bypass, Gaya',
                'phone' => '+919876500172', 'whatsapp' => '919876500172', 'website' => 'https://biz172.in',
                'avg_rating' => 4.5, 'review_count' => 1720, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz172@truedial.in', 'owner_name' => 'Owner 172'
            ],
            [
                'slug' => 'mobile-computer-repair-biz-173',
                'title' => 'Mobile Business 3',
                'category_slug' => 'mobile-computer-repair',
                'description' => 'Best Mobile Business 3 services in Bhagalpur. Providing top quality to all customers.',
                'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'state' => 'Bihar', 'address' => 'Station Road, Bhagalpur',
                'phone' => '+919876500173', 'whatsapp' => '919876500173', 'website' => 'https://biz173.in',
                'avg_rating' => 4.5, 'review_count' => 1730, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz173@truedial.in', 'owner_name' => 'Owner 173'
            ],
            [
                'slug' => 'mobile-computer-repair-biz-174',
                'title' => 'Mobile Business 4',
                'category_slug' => 'mobile-computer-repair',
                'description' => 'Best Mobile Business 4 services in Muzaffarpur. Providing top quality to all customers.',
                'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'state' => 'Bihar', 'address' => 'Market Area, Muzaffarpur',
                'phone' => '+919876500174', 'whatsapp' => '919876500174', 'website' => 'https://biz174.in',
                'avg_rating' => 4.5, 'review_count' => 1740, 'is_verified' => true, 'is_featured' => false,
                'email' => 'biz174@truedial.in', 'owner_name' => 'Owner 174'
            ],
            [
                'slug' => 'mobile-computer-repair-biz-175',
                'title' => 'Mobile Business 5',
                'category_slug' => 'mobile-computer-repair',
                'description' => 'Best Mobile Business 5 services in Purnia. Providing top quality to all customers.',
                'city' => 'Purnia', 'district' => 'Purnia', 'state' => 'Bihar', 'address' => 'Civil Lines, Purnia',
                'phone' => '+919876500175', 'whatsapp' => '919876500175', 'website' => 'https://biz175.in',
                'avg_rating' => 4.5, 'review_count' => 1750, 'is_verified' => true, 'is_featured' => true,
                'email' => 'biz175@truedial.in', 'owner_name' => 'Owner 175'
            ]
        ];

        $createdListings = [];

        foreach ($businesses as $bData) {
            // Create Vendor Account
            $vendorUser = User::firstOrCreate(['email' => $bData['email']], [
                'name' => $bData['owner_name'],
                'password' => Hash::make('password123'),
                'phone' => $bData['phone'],
            ]);
            if (!$vendorUser->roles()->where('role_id', $businessRole->id)->exists()) {
                $vendorUser->roles()->attach($businessRole->id);
            }

            $catObj = $categories[$bData['category_slug']] ?? reset($categories);

            // Create Listing under Tenant 2
            $listing = Listing::updateOrCreate([
                'slug' => $bData['slug'],
                'tenant_id' => $tenantId,
            ], [
                'user_id' => $vendorUser->id,
                'title' => $bData['title'],
                'description' => $bData['description'],
                'category_id' => $catObj->id,
                'city_id' => 1,
                'district_id' => 1,
                'city' => $bData['city'],
                'district' => $bData['district'],
                'state' => $bData['state'],
                'address' => $bData['address'],
                'status' => 'active',
                'phone' => $bData['phone'],
                'whatsapp' => $bData['whatsapp'],
                'website' => $bData['website'],
                'is_verified' => $bData['is_verified'],
                'is_featured' => $bData['is_featured'],
                'avg_rating' => $bData['avg_rating'],
                'review_count' => $bData['review_count'],
            ]);

            $createdListings[] = $listing;

            // Seed Active Offers for Listings
            Offer::updateOrCreate([
                'listing_id' => $listing->id,
                'title' => 'Flat 20% OFF Special TrueDial Deal',
            ], [
                'tenant_id' => $tenantId,
                'description' => 'Exclusive 20% discount on all bookings made through TrueDial Mobile or Website.',
                'discount_type' => 'percentage',
                'discount_value' => 20,
                'promo_code' => 'TRUEDIAL20',
                'valid_until' => now()->addDays(90),
                'status' => 'active',
            ]);

            // Seed Reviews for Listing
            Review::firstOrCreate([
                'reviewer_id' => $customer->id,
                'listing_id' => $listing->id,
            ], [
                'tenant_id' => $tenantId,
                'reviewed_user_id' => $vendorUser->id,
                'rating' => 5,
                'title' => 'Outstanding Service!',
                'body' => 'Extremely professional team, high quality work, and great communication.',
                'status' => 'approved',
            ]);
        }

        // Seed Sample Conversation and Real-time Messages for TrueDial Mobile
        $firstListing = $createdListings[0] ?? null;
        $interiorListing = Listing::where('slug', 'interior-architecture-biz-21')->first();

        if ($firstListing && $customer) {
            $conv1 = Conversation::updateOrCreate([
                'customer_id' => $customer->id,
                'vendor_id'   => $firstListing->user_id,
            ], [
                'project_id'    => null,
                'status'        => 'active',
                'project_stage' => 'initiated',
                'last_message_at' => now(),
                'customer_unread_count' => 1,
            ]);

            Message::firstOrCreate([
                'conversation_id' => $conv1->id,
                'message' => 'Hello! I saw your listing on TrueDial. What are your opening hours today?',
            ], [
                'sender_id' => $customer->id,
                'message_type' => 'text',
                'created_at' => now()->subMinutes(15),
            ]);

            Message::firstOrCreate([
                'conversation_id' => $conv1->id,
                'message' => 'Hi! We are open until 10:00 PM today. Feel free to visit or order online via TrueDial!',
            ], [
                'sender_id' => $firstListing->user_id,
                'message_type' => 'text',
                'created_at' => now()->subMinutes(5),
            ]);
        }

        if ($interiorListing && $customer2) {
            $conv2 = Conversation::updateOrCreate([
                'customer_id' => $customer2->id,
                'vendor_id'   => $interiorListing->user_id,
            ], [
                'project_id'    => null,
                'status'        => 'active',
                'project_stage' => 'initiated',
                'last_message_at' => now(),
                'vendor_unread_count' => 1,
            ]);

            Message::firstOrCreate([
                'conversation_id' => $conv2->id,
                'message' => 'Hi, I need a complete interior design quote for my 3BHK flat in Patna.',
            ], [
                'sender_id' => $customer2->id,
                'message_type' => 'text',
                'created_at' => now()->subHours(1),
            ]);
        }
    }
}
