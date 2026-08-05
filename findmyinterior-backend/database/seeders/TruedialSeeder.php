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

        // 10 Core TrueDial Categories
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
        ];

        $categories = [];
        foreach ($categoriesData as $catData) {
            $cat = Category::firstOrCreate(
                ['slug' => $catData['slug'], 'tenant_id' => $tenantId],
                ['name' => $catData['name'], 'icon' => $catData['icon'], 'is_active' => true]
            );
            $categories[$catData['slug']] = $cat;
        }

        // 15 Realistic Business Listings
        $businesses = [
            [
                'slug' => 'the-great-indian-restaurant',
                'title' => 'The Great Indian Fine Dining',
                'category_slug' => 'restaurants',
                'description' => 'Authentic North Indian & Mughlai Delicacies in Patna. Specializing in Biryani, Butter Chicken, and Tandoori platters.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Fraser Road, Near Dak Bungalow, Patna',
                'phone' => '+919876543210', 'whatsapp' => '919876543210', 'website' => 'https://greatindianrestro.in',
                'avg_rating' => 4.8, 'review_count' => 142, 'is_verified' => true, 'is_featured' => true,
                'email' => 'restaurant@truedial.in', 'owner_name' => 'Vikram Singh'
            ],
            [
                'slug' => 'patliputra-cafe-bistro',
                'title' => 'Patliputra Artisan Cafe & Bakery',
                'category_slug' => 'restaurants',
                'description' => 'Cozy cafe offering artisan coffee, woodfired pizzas, fresh pastries, and Continental dishes.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Boring Road, Opposite AN College, Patna',
                'phone' => '+919876543211', 'whatsapp' => '919876543211', 'website' => 'https://patliputracafe.in',
                'avg_rating' => 4.6, 'review_count' => 88, 'is_verified' => true, 'is_featured' => false,
                'email' => 'cafe@truedial.in', 'owner_name' => 'Ananya Roy'
            ],
            [
                'slug' => 'grand-central-hotel-suites',
                'title' => 'Grand Central Hotel & Luxury Suites',
                'category_slug' => 'hotels-lodging',
                'description' => 'Premium 4-star luxury accommodation with banquet halls, rooftop pool, and multi-cuisine restaurant.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Exhibition Road, Near Railway Station, Patna',
                'phone' => '+919876543212', 'whatsapp' => '919876543212', 'website' => 'https://grandcentralpatna.com',
                'avg_rating' => 4.7, 'review_count' => 210, 'is_verified' => true, 'is_featured' => true,
                'email' => 'hotel@truedial.in', 'owner_name' => 'Rajesh Sharma'
            ],
            [
                'slug' => 'patliputra-multispecialty-hospital',
                'title' => 'Patliputra Multi-Specialty Hospital',
                'category_slug' => 'hospitals-healthcare',
                'description' => '24x7 Emergency, Cardiology, Orthopedics, Neurology, and Advanced ICU care with state-of-the-art diagnostics.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Kankarbagh Main Road, Patna',
                'phone' => '+919876543213', 'whatsapp' => '919876543213', 'website' => 'https://patliputrahospital.com',
                'avg_rating' => 4.9, 'review_count' => 315, 'is_verified' => true, 'is_featured' => true,
                'email' => 'hospital@truedial.in', 'owner_name' => 'Dr. A. K. Verma'
            ],
            [
                'slug' => 'apex-iit-neet-coaching-academy',
                'title' => 'Apex IIT-JEE & NEET Coaching Academy',
                'category_slug' => 'education-coaching',
                'description' => 'Premier coaching institute producing top rankers in JEE Advanced, NEET, and Olympiads with experienced Kota faculty.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'East Boring Canal Road, Patna',
                'phone' => '+919876543214', 'whatsapp' => '919876543214', 'website' => 'https://apexacademy.in',
                'avg_rating' => 4.8, 'review_count' => 195, 'is_verified' => true, 'is_featured' => true,
                'email' => 'apex@truedial.in', 'owner_name' => 'Prof. S. K. Gupta'
            ],
            [
                'slug' => 'magadh-interior-studio',
                'title' => 'Magadh Interior Studio & Luxury Architecture',
                'category_slug' => 'interior-architecture',
                'description' => 'Turnkey interior design services for luxury apartments, villas, modular kitchens, and commercial offices in Patna.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Bailey Road, Near High Court, Patna',
                'phone' => '+919876543215', 'whatsapp' => '919876543215', 'website' => 'https://magadhinteriors.com',
                'avg_rating' => 4.9, 'review_count' => 165, 'is_verified' => true, 'is_featured' => true,
                'email' => 'interior@truedial.in', 'owner_name' => 'Amit Kumar'
            ],
            [
                'slug' => 'quickfix-home-repair-electricians',
                'title' => 'QuickFix Doorstep Home Repair & AC Service',
                'category_slug' => 'repair-maintenance',
                'description' => 'Fast 30-minute doorstep service for AC repair, electrical wiring, plumbing, and home appliance maintenance.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Rajendra Nagar, Patna',
                'phone' => '+919876543216', 'whatsapp' => '919876543216', 'website' => 'https://quickfixpatna.in',
                'avg_rating' => 4.5, 'review_count' => 94, 'is_verified' => true, 'is_featured' => false,
                'email' => 'quickfix@truedial.in', 'owner_name' => 'Sunil Prasad'
            ],
            [
                'slug' => 'pixelcraft-digital-marketing-agency',
                'title' => 'PixelCraft Digital Growth & SEO Agency',
                'category_slug' => 'digital-marketing-it',
                'description' => 'Full-service digital growth agency offering SEO, Google Ads, Social Media Marketing, and Custom Web Development.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Patliputra Colony, Patna',
                'phone' => '+919876543217', 'whatsapp' => '919876543217', 'website' => 'https://pixelcraft.co.in',
                'avg_rating' => 4.8, 'review_count' => 76, 'is_verified' => true, 'is_featured' => true,
                'email' => 'pixelcraft@truedial.in', 'owner_name' => 'Rohan Mehta'
            ],
            [
                'slug' => 'pulse-fitness-gym-wellness',
                'title' => 'Pulse Fitness Club & Unisex Gym',
                'category_slug' => 'fitness-gyms',
                'description' => 'State-of-the-art gym with imported cardio & strength equipment, certified personal trainers, steam bath, and zumba classes.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Ashok Rajpath, Near Science College, Patna',
                'phone' => '+919876543218', 'whatsapp' => '919876543218', 'website' => 'https://pulsefitness.in',
                'avg_rating' => 4.7, 'review_count' => 110, 'is_verified' => true, 'is_featured' => false,
                'email' => 'gym@truedial.in', 'owner_name' => 'Manish Yadav'
            ],
            [
                'slug' => 'shree-bankey-bihari-event-planners',
                'title' => 'Shree Bankey Bihari Royal Wedding & Event Planners',
                'category_slug' => 'event-management',
                'description' => 'Destination wedding planners, floral stage decoration, catering, sound & lighting, and corporate event management.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'Saguna More, Danapur, Patna',
                'phone' => '+919876543219', 'whatsapp' => '919876543219', 'website' => 'https://bankeybiharievents.com',
                'avg_rating' => 4.9, 'review_count' => 155, 'is_verified' => true, 'is_featured' => true,
                'email' => 'events@truedial.in', 'owner_name' => 'Sanjay Mishra'
            ],
            [
                'slug' => 'glow-and-shine-unisex-salon',
                'title' => 'Glow & Shine Luxury Unisex Salon & Spa',
                'category_slug' => 'salons-beauty',
                'description' => 'Premium hair styling, bridal makeup, skin facials, beard grooming, and relaxing spa therapies by certified experts.',
                'city' => 'Patna', 'district' => 'Patna', 'state' => 'Bihar', 'address' => 'SK Puri, Near Children Park, Patna',
                'phone' => '+919876543220', 'whatsapp' => '919876543220', 'website' => 'https://glowshine.in',
                'avg_rating' => 4.6, 'review_count' => 84, 'is_verified' => true, 'is_featured' => false,
                'email' => 'salon@truedial.in', 'owner_name' => 'Pooja Kapoor'
            ],
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
                'user_id' => $customer->id,
                'listing_id' => $listing->id,
            ], [
                'tenant_id' => $tenantId,
                'reviewed_user_id' => $vendorUser->id,
                'reviewable_type' => \App\Models\Listing::class,
                'reviewable_id' => $listing->id,
                'rating' => 5,
                'title' => 'Outstanding Service!',
                'body' => 'Extremely professional team, high quality work, and great communication.',
                'status' => 'approved',
            ]);
        }

        // Seed Sample Conversation and Real-time Messages for TrueDial Mobile
        $firstListing = $createdListings[0] ?? null;
        $interiorListing = Listing::where('slug', 'magadh-interior-studio')->first();

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
