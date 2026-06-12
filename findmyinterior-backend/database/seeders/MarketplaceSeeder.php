<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Listing;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
class MarketplaceSeeder extends Seeder {
  public function run(): void {
  Listing::unguard();

        $u = User::create(['name' => 'Bihar Muzaffarpur Works Account', 'email' => 'designer1@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540001']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Bihar Muzaffarpur Works', 'slug' => Str::slug('Bihar Muzaffarpur Works-1'),
            'description' => 'We are the leading interior designers in Muzaffarpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 14,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Main Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 3.8, 'review_count' => 106,
            'cover_image' => 'https://picsum.photos/seed/designer1/400/400'
        ]);
        
        $u = User::create(['name' => 'Patliputra Bhagalpur Solutions Account', 'email' => 'designer2@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540002']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Patliputra Bhagalpur Solutions', 'slug' => Str::slug('Patliputra Bhagalpur Solutions-2'),
            'description' => 'We are the leading interior designers in Bhagalpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 18,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'address' => 'Main Road, Bhagalpur',
            'status' => 'active', 'is_verified' => false, 'is_featured' => false,
            'avg_rating' => 4.8, 'review_count' => 45,
            'cover_image' => 'https://picsum.photos/seed/designer2/400/400'
        ]);
        
        $u = User::create(['name' => 'Muzaffarpur Design Associates Account', 'email' => 'designer3@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540003']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Muzaffarpur Design Associates', 'slug' => Str::slug('Muzaffarpur Design Associates-3'),
            'description' => 'We are the leading interior designers in Muzaffarpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 5,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Main Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.4, 'review_count' => 117,
            'cover_image' => 'https://picsum.photos/seed/designer3/400/400'
        ]);
        
        $u = User::create(['name' => 'Patna Elite Interiors Account', 'email' => 'designer4@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540004']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Patna Elite Interiors', 'slug' => Str::slug('Patna Elite Interiors-4'),
            'description' => 'We are the leading interior designers in Patna. Specializing in modern residential and commercial designs.',
            'years_experience' => 16,
            'city' => 'Patna', 'district' => 'Patna', 'address' => 'Main Road, Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.8, 'review_count' => 147,
            'cover_image' => 'https://picsum.photos/seed/designer4/400/400'
        ]);
        
        $u = User::create(['name' => 'Modern Gaya Designers Account', 'email' => 'designer5@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540005']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Modern Gaya Designers', 'slug' => Str::slug('Modern Gaya Designers-5'),
            'description' => 'We are the leading interior designers in Gaya. Specializing in modern residential and commercial designs.',
            'years_experience' => 17,
            'city' => 'Gaya', 'district' => 'Gaya', 'address' => 'Main Road, Gaya',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.9, 'review_count' => 145,
            'cover_image' => 'https://picsum.photos/seed/designer5/400/400'
        ]);
        
        $u = User::create(['name' => 'Darbhanga Decor Hub Account', 'email' => 'designer6@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540006']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Darbhanga Decor Hub', 'slug' => Str::slug('Darbhanga Decor Hub-6'),
            'description' => 'We are the leading interior designers in Darbhanga. Specializing in modern residential and commercial designs.',
            'years_experience' => 20,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'address' => 'Main Road, Darbhanga',
            'status' => 'active', 'is_verified' => false, 'is_featured' => true,
            'avg_rating' => 4.0, 'review_count' => 23,
            'cover_image' => 'https://picsum.photos/seed/designer6/400/400'
        ]);
        
        $u = User::create(['name' => 'Modern Purnia Designers Account', 'email' => 'designer7@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540007']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Modern Purnia Designers', 'slug' => Str::slug('Modern Purnia Designers-7'),
            'description' => 'We are the leading interior designers in Purnia. Specializing in modern residential and commercial designs.',
            'years_experience' => 18,
            'city' => 'Purnia', 'district' => 'Purnia', 'address' => 'Main Road, Purnia',
            'status' => 'active', 'is_verified' => false, 'is_featured' => true,
            'avg_rating' => 3.8, 'review_count' => 110,
            'cover_image' => 'https://picsum.photos/seed/designer7/400/400'
        ]);
        
        $u = User::create(['name' => 'Darbhanga Elite Interiors Account', 'email' => 'designer8@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540008']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Darbhanga Elite Interiors', 'slug' => Str::slug('Darbhanga Elite Interiors-8'),
            'description' => 'We are the leading interior designers in Darbhanga. Specializing in modern residential and commercial designs.',
            'years_experience' => 18,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'address' => 'Main Road, Darbhanga',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.1, 'review_count' => 117,
            'cover_image' => 'https://picsum.photos/seed/designer8/400/400'
        ]);
        
        $u = User::create(['name' => 'Magadh Darbhanga Interiors Account', 'email' => 'designer9@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540009']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Magadh Darbhanga Interiors', 'slug' => Str::slug('Magadh Darbhanga Interiors-9'),
            'description' => 'We are the leading interior designers in Darbhanga. Specializing in modern residential and commercial designs.',
            'years_experience' => 11,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'address' => 'Main Road, Darbhanga',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.4, 'review_count' => 140,
            'cover_image' => 'https://picsum.photos/seed/designer9/400/400'
        ]);
        
        $u = User::create(['name' => 'Patna Interior Studio Account', 'email' => 'designer10@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540010']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Patna Interior Studio', 'slug' => Str::slug('Patna Interior Studio-10'),
            'description' => 'We are the leading interior designers in Patna. Specializing in modern residential and commercial designs.',
            'years_experience' => 10,
            'city' => 'Patna', 'district' => 'Patna', 'address' => 'Main Road, Patna',
            'status' => 'active', 'is_verified' => false, 'is_featured' => false,
            'avg_rating' => 3.8, 'review_count' => 112,
            'cover_image' => 'https://picsum.photos/seed/designer10/400/400'
        ]);
        
        $u = User::create(['name' => 'Bihar Purnia Works Account', 'email' => 'designer11@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540011']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Bihar Purnia Works', 'slug' => Str::slug('Bihar Purnia Works-11'),
            'description' => 'We are the leading interior designers in Purnia. Specializing in modern residential and commercial designs.',
            'years_experience' => 7,
            'city' => 'Purnia', 'district' => 'Purnia', 'address' => 'Main Road, Purnia',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.6, 'review_count' => 95,
            'cover_image' => 'https://picsum.photos/seed/designer11/400/400'
        ]);
        
        $u = User::create(['name' => 'Gaya Royal Designs Account', 'email' => 'designer12@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540012']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Gaya Royal Designs', 'slug' => Str::slug('Gaya Royal Designs-12'),
            'description' => 'We are the leading interior designers in Gaya. Specializing in modern residential and commercial designs.',
            'years_experience' => 12,
            'city' => 'Gaya', 'district' => 'Gaya', 'address' => 'Main Road, Gaya',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 3.9, 'review_count' => 87,
            'cover_image' => 'https://picsum.photos/seed/designer12/400/400'
        ]);
        
        $u = User::create(['name' => 'Modern Muzaffarpur Designers Account', 'email' => 'designer13@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540013']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Modern Muzaffarpur Designers', 'slug' => Str::slug('Modern Muzaffarpur Designers-13'),
            'description' => 'We are the leading interior designers in Muzaffarpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 6,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Main Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => false, 'is_featured' => false,
            'avg_rating' => 4.6, 'review_count' => 45,
            'cover_image' => 'https://picsum.photos/seed/designer13/400/400'
        ]);
        
        $u = User::create(['name' => 'Patna Decor Hub Account', 'email' => 'designer14@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540014']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Patna Decor Hub', 'slug' => Str::slug('Patna Decor Hub-14'),
            'description' => 'We are the leading interior designers in Patna. Specializing in modern residential and commercial designs.',
            'years_experience' => 15,
            'city' => 'Patna', 'district' => 'Patna', 'address' => 'Main Road, Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.5, 'review_count' => 101,
            'cover_image' => 'https://picsum.photos/seed/designer14/400/400'
        ]);
        
        $u = User::create(['name' => 'Purnia Design Associates Account', 'email' => 'designer15@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540015']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Purnia Design Associates', 'slug' => Str::slug('Purnia Design Associates-15'),
            'description' => 'We are the leading interior designers in Purnia. Specializing in modern residential and commercial designs.',
            'years_experience' => 5,
            'city' => 'Purnia', 'district' => 'Purnia', 'address' => 'Main Road, Purnia',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.6, 'review_count' => 107,
            'cover_image' => 'https://picsum.photos/seed/designer15/400/400'
        ]);
        
        $u = User::create(['name' => 'Patna Interior Studio Account', 'email' => 'designer16@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540016']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Patna Interior Studio', 'slug' => Str::slug('Patna Interior Studio-16'),
            'description' => 'We are the leading interior designers in Patna. Specializing in modern residential and commercial designs.',
            'years_experience' => 11,
            'city' => 'Patna', 'district' => 'Patna', 'address' => 'Main Road, Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.3, 'review_count' => 101,
            'cover_image' => 'https://picsum.photos/seed/designer16/400/400'
        ]);
        
        $u = User::create(['name' => 'Muzaffarpur Elite Interiors Account', 'email' => 'designer17@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540017']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Muzaffarpur Elite Interiors', 'slug' => Str::slug('Muzaffarpur Elite Interiors-17'),
            'description' => 'We are the leading interior designers in Muzaffarpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 8,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Main Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.0, 'review_count' => 65,
            'cover_image' => 'https://picsum.photos/seed/designer17/400/400'
        ]);
        
        $u = User::create(['name' => 'Bhagalpur Space Planners Account', 'email' => 'designer18@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540018']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Bhagalpur Space Planners', 'slug' => Str::slug('Bhagalpur Space Planners-18'),
            'description' => 'We are the leading interior designers in Bhagalpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 13,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'address' => 'Main Road, Bhagalpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.3, 'review_count' => 65,
            'cover_image' => 'https://picsum.photos/seed/designer18/400/400'
        ]);
        
        $u = User::create(['name' => 'Patna Elite Interiors Account', 'email' => 'designer19@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540019']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Patna Elite Interiors', 'slug' => Str::slug('Patna Elite Interiors-19'),
            'description' => 'We are the leading interior designers in Patna. Specializing in modern residential and commercial designs.',
            'years_experience' => 16,
            'city' => 'Patna', 'district' => 'Patna', 'address' => 'Main Road, Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.2, 'review_count' => 27,
            'cover_image' => 'https://picsum.photos/seed/designer19/400/400'
        ]);
        
        $u = User::create(['name' => 'Patliputra Bhagalpur Solutions Account', 'email' => 'designer20@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540020']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Patliputra Bhagalpur Solutions', 'slug' => Str::slug('Patliputra Bhagalpur Solutions-20'),
            'description' => 'We are the leading interior designers in Bhagalpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 18,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'address' => 'Main Road, Bhagalpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.6, 'review_count' => 33,
            'cover_image' => 'https://picsum.photos/seed/designer20/400/400'
        ]);
        
        $u = User::create(['name' => 'Darbhanga Elite Interiors Account', 'email' => 'designer21@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540021']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Darbhanga Elite Interiors', 'slug' => Str::slug('Darbhanga Elite Interiors-21'),
            'description' => 'We are the leading interior designers in Darbhanga. Specializing in modern residential and commercial designs.',
            'years_experience' => 19,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'address' => 'Main Road, Darbhanga',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.3, 'review_count' => 69,
            'cover_image' => 'https://picsum.photos/seed/designer21/400/400'
        ]);
        
        $u = User::create(['name' => 'Patna Space Planners Account', 'email' => 'designer22@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540022']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Patna Space Planners', 'slug' => Str::slug('Patna Space Planners-22'),
            'description' => 'We are the leading interior designers in Patna. Specializing in modern residential and commercial designs.',
            'years_experience' => 18,
            'city' => 'Patna', 'district' => 'Patna', 'address' => 'Main Road, Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.7, 'review_count' => 49,
            'cover_image' => 'https://picsum.photos/seed/designer22/400/400'
        ]);
        
        $u = User::create(['name' => 'Magadh Purnia Interiors Account', 'email' => 'designer23@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540023']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Magadh Purnia Interiors', 'slug' => Str::slug('Magadh Purnia Interiors-23'),
            'description' => 'We are the leading interior designers in Purnia. Specializing in modern residential and commercial designs.',
            'years_experience' => 5,
            'city' => 'Purnia', 'district' => 'Purnia', 'address' => 'Main Road, Purnia',
            'status' => 'active', 'is_verified' => false, 'is_featured' => false,
            'avg_rating' => 3.9, 'review_count' => 31,
            'cover_image' => 'https://picsum.photos/seed/designer23/400/400'
        ]);
        
        $u = User::create(['name' => 'Modern Purnia Designers Account', 'email' => 'designer24@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540024']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Modern Purnia Designers', 'slug' => Str::slug('Modern Purnia Designers-24'),
            'description' => 'We are the leading interior designers in Purnia. Specializing in modern residential and commercial designs.',
            'years_experience' => 13,
            'city' => 'Purnia', 'district' => 'Purnia', 'address' => 'Main Road, Purnia',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.0, 'review_count' => 36,
            'cover_image' => 'https://picsum.photos/seed/designer24/400/400'
        ]);
        
        $u = User::create(['name' => 'Darbhanga Space Planners Account', 'email' => 'designer25@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540025']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Darbhanga Space Planners', 'slug' => Str::slug('Darbhanga Space Planners-25'),
            'description' => 'We are the leading interior designers in Darbhanga. Specializing in modern residential and commercial designs.',
            'years_experience' => 20,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'address' => 'Main Road, Darbhanga',
            'status' => 'active', 'is_verified' => false, 'is_featured' => false,
            'avg_rating' => 3.8, 'review_count' => 62,
            'cover_image' => 'https://picsum.photos/seed/designer25/400/400'
        ]);
        
        $u = User::create(['name' => 'Darbhanga Interior Studio Account', 'email' => 'designer26@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540026']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Darbhanga Interior Studio', 'slug' => Str::slug('Darbhanga Interior Studio-26'),
            'description' => 'We are the leading interior designers in Darbhanga. Specializing in modern residential and commercial designs.',
            'years_experience' => 12,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'address' => 'Main Road, Darbhanga',
            'status' => 'active', 'is_verified' => false, 'is_featured' => false,
            'avg_rating' => 3.8, 'review_count' => 146,
            'cover_image' => 'https://picsum.photos/seed/designer26/400/400'
        ]);
        
        $u = User::create(['name' => 'Gaya Decor Hub Account', 'email' => 'designer27@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540027']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Gaya Decor Hub', 'slug' => Str::slug('Gaya Decor Hub-27'),
            'description' => 'We are the leading interior designers in Gaya. Specializing in modern residential and commercial designs.',
            'years_experience' => 13,
            'city' => 'Gaya', 'district' => 'Gaya', 'address' => 'Main Road, Gaya',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.6, 'review_count' => 60,
            'cover_image' => 'https://picsum.photos/seed/designer27/400/400'
        ]);
        
        $u = User::create(['name' => 'Bhagalpur Design Associates Account', 'email' => 'designer28@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540028']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Bhagalpur Design Associates', 'slug' => Str::slug('Bhagalpur Design Associates-28'),
            'description' => 'We are the leading interior designers in Bhagalpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 7,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'address' => 'Main Road, Bhagalpur',
            'status' => 'active', 'is_verified' => false, 'is_featured' => true,
            'avg_rating' => 4.6, 'review_count' => 76,
            'cover_image' => 'https://picsum.photos/seed/designer28/400/400'
        ]);
        
        $u = User::create(['name' => 'Muzaffarpur Decor Hub Account', 'email' => 'designer29@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540029']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Muzaffarpur Decor Hub', 'slug' => Str::slug('Muzaffarpur Decor Hub-29'),
            'description' => 'We are the leading interior designers in Muzaffarpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 20,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Main Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.4, 'review_count' => 117,
            'cover_image' => 'https://picsum.photos/seed/designer29/400/400'
        ]);
        
        $u = User::create(['name' => 'Bihar Muzaffarpur Works Account', 'email' => 'designer30@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540030']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Bihar Muzaffarpur Works', 'slug' => Str::slug('Bihar Muzaffarpur Works-30'),
            'description' => 'We are the leading interior designers in Muzaffarpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 10,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Main Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => false, 'is_featured' => true,
            'avg_rating' => 4.9, 'review_count' => 133,
            'cover_image' => 'https://picsum.photos/seed/designer30/400/400'
        ]);
        
        $u = User::create(['name' => 'Patliputra Muzaffarpur Solutions Account', 'email' => 'designer31@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540031']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Patliputra Muzaffarpur Solutions', 'slug' => Str::slug('Patliputra Muzaffarpur Solutions-31'),
            'description' => 'We are the leading interior designers in Muzaffarpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 7,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Main Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.8, 'review_count' => 26,
            'cover_image' => 'https://picsum.photos/seed/designer31/400/400'
        ]);
        
        $u = User::create(['name' => 'Patna Decor Hub Account', 'email' => 'designer32@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540032']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Patna Decor Hub', 'slug' => Str::slug('Patna Decor Hub-32'),
            'description' => 'We are the leading interior designers in Patna. Specializing in modern residential and commercial designs.',
            'years_experience' => 11,
            'city' => 'Patna', 'district' => 'Patna', 'address' => 'Main Road, Patna',
            'status' => 'active', 'is_verified' => false, 'is_featured' => true,
            'avg_rating' => 4.6, 'review_count' => 129,
            'cover_image' => 'https://picsum.photos/seed/designer32/400/400'
        ]);
        
        $u = User::create(['name' => 'Bihar Gaya Works Account', 'email' => 'designer33@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540033']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Bihar Gaya Works', 'slug' => Str::slug('Bihar Gaya Works-33'),
            'description' => 'We are the leading interior designers in Gaya. Specializing in modern residential and commercial designs.',
            'years_experience' => 9,
            'city' => 'Gaya', 'district' => 'Gaya', 'address' => 'Main Road, Gaya',
            'status' => 'active', 'is_verified' => false, 'is_featured' => true,
            'avg_rating' => 3.9, 'review_count' => 100,
            'cover_image' => 'https://picsum.photos/seed/designer33/400/400'
        ]);
        
        $u = User::create(['name' => 'Muzaffarpur Elite Interiors Account', 'email' => 'designer34@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540034']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Muzaffarpur Elite Interiors', 'slug' => Str::slug('Muzaffarpur Elite Interiors-34'),
            'description' => 'We are the leading interior designers in Muzaffarpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 3,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Main Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => false, 'is_featured' => false,
            'avg_rating' => 5.0, 'review_count' => 54,
            'cover_image' => 'https://picsum.photos/seed/designer34/400/400'
        ]);
        
        $u = User::create(['name' => 'Bhagalpur Space Planners Account', 'email' => 'designer35@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540035']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Bhagalpur Space Planners', 'slug' => Str::slug('Bhagalpur Space Planners-35'),
            'description' => 'We are the leading interior designers in Bhagalpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 2,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'address' => 'Main Road, Bhagalpur',
            'status' => 'active', 'is_verified' => false, 'is_featured' => false,
            'avg_rating' => 4.6, 'review_count' => 94,
            'cover_image' => 'https://picsum.photos/seed/designer35/400/400'
        ]);
        
        $u = User::create(['name' => 'Magadh Gaya Interiors Account', 'email' => 'designer36@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540036']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Magadh Gaya Interiors', 'slug' => Str::slug('Magadh Gaya Interiors-36'),
            'description' => 'We are the leading interior designers in Gaya. Specializing in modern residential and commercial designs.',
            'years_experience' => 20,
            'city' => 'Gaya', 'district' => 'Gaya', 'address' => 'Main Road, Gaya',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.5, 'review_count' => 73,
            'cover_image' => 'https://picsum.photos/seed/designer36/400/400'
        ]);
        
        $u = User::create(['name' => 'Patliputra Purnia Solutions Account', 'email' => 'designer37@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540037']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Patliputra Purnia Solutions', 'slug' => Str::slug('Patliputra Purnia Solutions-37'),
            'description' => 'We are the leading interior designers in Purnia. Specializing in modern residential and commercial designs.',
            'years_experience' => 2,
            'city' => 'Purnia', 'district' => 'Purnia', 'address' => 'Main Road, Purnia',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.8, 'review_count' => 143,
            'cover_image' => 'https://picsum.photos/seed/designer37/400/400'
        ]);
        
        $u = User::create(['name' => 'Bihar Patna Works Account', 'email' => 'designer38@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540038']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Bihar Patna Works', 'slug' => Str::slug('Bihar Patna Works-38'),
            'description' => 'We are the leading interior designers in Patna. Specializing in modern residential and commercial designs.',
            'years_experience' => 5,
            'city' => 'Patna', 'district' => 'Patna', 'address' => 'Main Road, Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.4, 'review_count' => 62,
            'cover_image' => 'https://picsum.photos/seed/designer38/400/400'
        ]);
        
        $u = User::create(['name' => 'Bihar Muzaffarpur Works Account', 'email' => 'designer39@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540039']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Bihar Muzaffarpur Works', 'slug' => Str::slug('Bihar Muzaffarpur Works-39'),
            'description' => 'We are the leading interior designers in Muzaffarpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 16,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Main Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => false, 'is_featured' => true,
            'avg_rating' => 4.2, 'review_count' => 106,
            'cover_image' => 'https://picsum.photos/seed/designer39/400/400'
        ]);
        
        $u = User::create(['name' => 'Darbhanga Elite Interiors Account', 'email' => 'designer40@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540040']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Darbhanga Elite Interiors', 'slug' => Str::slug('Darbhanga Elite Interiors-40'),
            'description' => 'We are the leading interior designers in Darbhanga. Specializing in modern residential and commercial designs.',
            'years_experience' => 8,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'address' => 'Main Road, Darbhanga',
            'status' => 'active', 'is_verified' => false, 'is_featured' => false,
            'avg_rating' => 4.2, 'review_count' => 136,
            'cover_image' => 'https://picsum.photos/seed/designer40/400/400'
        ]);
        
        $u = User::create(['name' => 'Patliputra Purnia Solutions Account', 'email' => 'designer41@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540041']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Patliputra Purnia Solutions', 'slug' => Str::slug('Patliputra Purnia Solutions-41'),
            'description' => 'We are the leading interior designers in Purnia. Specializing in modern residential and commercial designs.',
            'years_experience' => 10,
            'city' => 'Purnia', 'district' => 'Purnia', 'address' => 'Main Road, Purnia',
            'status' => 'active', 'is_verified' => false, 'is_featured' => true,
            'avg_rating' => 4.2, 'review_count' => 113,
            'cover_image' => 'https://picsum.photos/seed/designer41/400/400'
        ]);
        
        $u = User::create(['name' => 'Purnia Elite Interiors Account', 'email' => 'designer42@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540042']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Purnia Elite Interiors', 'slug' => Str::slug('Purnia Elite Interiors-42'),
            'description' => 'We are the leading interior designers in Purnia. Specializing in modern residential and commercial designs.',
            'years_experience' => 5,
            'city' => 'Purnia', 'district' => 'Purnia', 'address' => 'Main Road, Purnia',
            'status' => 'active', 'is_verified' => false, 'is_featured' => true,
            'avg_rating' => 4.8, 'review_count' => 143,
            'cover_image' => 'https://picsum.photos/seed/designer42/400/400'
        ]);
        
        $u = User::create(['name' => 'Bihar Muzaffarpur Works Account', 'email' => 'designer43@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540043']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Bihar Muzaffarpur Works', 'slug' => Str::slug('Bihar Muzaffarpur Works-43'),
            'description' => 'We are the leading interior designers in Muzaffarpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 11,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Main Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.6, 'review_count' => 149,
            'cover_image' => 'https://picsum.photos/seed/designer43/400/400'
        ]);
        
        $u = User::create(['name' => 'Patna Royal Designs Account', 'email' => 'designer44@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540044']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Patna Royal Designs', 'slug' => Str::slug('Patna Royal Designs-44'),
            'description' => 'We are the leading interior designers in Patna. Specializing in modern residential and commercial designs.',
            'years_experience' => 20,
            'city' => 'Patna', 'district' => 'Patna', 'address' => 'Main Road, Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 5.0, 'review_count' => 105,
            'cover_image' => 'https://picsum.photos/seed/designer44/400/400'
        ]);
        
        $u = User::create(['name' => 'Muzaffarpur Royal Designs Account', 'email' => 'designer45@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540045']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Muzaffarpur Royal Designs', 'slug' => Str::slug('Muzaffarpur Royal Designs-45'),
            'description' => 'We are the leading interior designers in Muzaffarpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 3,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Main Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => false, 'is_featured' => true,
            'avg_rating' => 3.9, 'review_count' => 93,
            'cover_image' => 'https://picsum.photos/seed/designer45/400/400'
        ]);
        
        $u = User::create(['name' => 'Bihar Gaya Works Account', 'email' => 'designer46@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540046']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Bihar Gaya Works', 'slug' => Str::slug('Bihar Gaya Works-46'),
            'description' => 'We are the leading interior designers in Gaya. Specializing in modern residential and commercial designs.',
            'years_experience' => 7,
            'city' => 'Gaya', 'district' => 'Gaya', 'address' => 'Main Road, Gaya',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.1, 'review_count' => 31,
            'cover_image' => 'https://picsum.photos/seed/designer46/400/400'
        ]);
        
        $u = User::create(['name' => 'Muzaffarpur Decor Hub Account', 'email' => 'designer47@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540047']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Muzaffarpur Decor Hub', 'slug' => Str::slug('Muzaffarpur Decor Hub-47'),
            'description' => 'We are the leading interior designers in Muzaffarpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 4,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Main Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.3, 'review_count' => 148,
            'cover_image' => 'https://picsum.photos/seed/designer47/400/400'
        ]);
        
        $u = User::create(['name' => 'Modern Gaya Designers Account', 'email' => 'designer48@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540048']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Modern Gaya Designers', 'slug' => Str::slug('Modern Gaya Designers-48'),
            'description' => 'We are the leading interior designers in Gaya. Specializing in modern residential and commercial designs.',
            'years_experience' => 20,
            'city' => 'Gaya', 'district' => 'Gaya', 'address' => 'Main Road, Gaya',
            'status' => 'active', 'is_verified' => false, 'is_featured' => false,
            'avg_rating' => 4.4, 'review_count' => 113,
            'cover_image' => 'https://picsum.photos/seed/designer48/400/400'
        ]);
        
        $u = User::create(['name' => 'Patna Royal Designs Account', 'email' => 'designer49@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540049']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Patna Royal Designs', 'slug' => Str::slug('Patna Royal Designs-49'),
            'description' => 'We are the leading interior designers in Patna. Specializing in modern residential and commercial designs.',
            'years_experience' => 13,
            'city' => 'Patna', 'district' => 'Patna', 'address' => 'Main Road, Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.0, 'review_count' => 133,
            'cover_image' => 'https://picsum.photos/seed/designer49/400/400'
        ]);
        
        $u = User::create(['name' => 'Patliputra Muzaffarpur Solutions Account', 'email' => 'designer50@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876540050']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => 'Patliputra Muzaffarpur Solutions', 'slug' => Str::slug('Patliputra Muzaffarpur Solutions-50'),
            'description' => 'We are the leading interior designers in Muzaffarpur. Specializing in modern residential and commercial designs.',
            'years_experience' => 9,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Main Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.2, 'review_count' => 20,
            'cover_image' => 'https://picsum.photos/seed/designer50/400/400'
        ]);
        
        $u = User::create(['name' => 'Patna Modern Villas Account', 'email' => 'arch1@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550001']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Patna Modern Villas', 'slug' => Str::slug('Patna Modern Villas-1'),
            'description' => 'Expert architects in Patna focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 13,
            'city' => 'Patna', 'district' => 'Patna', 'address' => 'Arch Road, Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.8, 'review_count' => 128,
            'cover_image' => 'https://picsum.photos/seed/arch1/400/400'
        ]);
        
        $u = User::create(['name' => 'Purnia Commercial Planners Account', 'email' => 'arch2@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550002']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Purnia Commercial Planners', 'slug' => Str::slug('Purnia Commercial Planners-2'),
            'description' => 'Expert architects in Purnia focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 25,
            'city' => 'Purnia', 'district' => 'Purnia', 'address' => 'Arch Road, Purnia',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.2, 'review_count' => 103,
            'cover_image' => 'https://picsum.photos/seed/arch2/400/400'
        ]);
        
        $u = User::create(['name' => 'Darbhanga Builders & Architects Account', 'email' => 'arch3@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550003']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Darbhanga Builders & Architects', 'slug' => Str::slug('Darbhanga Builders & Architects-3'),
            'description' => 'Expert architects in Darbhanga focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 29,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'address' => 'Arch Road, Darbhanga',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.7, 'review_count' => 192,
            'cover_image' => 'https://picsum.photos/seed/arch3/400/400'
        ]);
        
        $u = User::create(['name' => 'Mithila Architecture Account', 'email' => 'arch4@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550004']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Mithila Architecture', 'slug' => Str::slug('Mithila Architecture-4'),
            'description' => 'Expert architects in Bhagalpur focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 24,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'address' => 'Arch Road, Bhagalpur',
            'status' => 'active', 'is_verified' => false, 'is_featured' => false,
            'avg_rating' => 4.6, 'review_count' => 113,
            'cover_image' => 'https://picsum.photos/seed/arch4/400/400'
        ]);
        
        $u = User::create(['name' => 'Mithila Architecture Account', 'email' => 'arch5@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550005']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Mithila Architecture', 'slug' => Str::slug('Mithila Architecture-5'),
            'description' => 'Expert architects in Bhagalpur focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 13,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'address' => 'Arch Road, Bhagalpur',
            'status' => 'active', 'is_verified' => false, 'is_featured' => true,
            'avg_rating' => 4.6, 'review_count' => 133,
            'cover_image' => 'https://picsum.photos/seed/arch5/400/400'
        ]);
        
        $u = User::create(['name' => 'Patna Blueprint Experts Account', 'email' => 'arch6@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550006']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Patna Blueprint Experts', 'slug' => Str::slug('Patna Blueprint Experts-6'),
            'description' => 'Expert architects in Patna focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 13,
            'city' => 'Patna', 'district' => 'Patna', 'address' => 'Arch Road, Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.0, 'review_count' => 47,
            'cover_image' => 'https://picsum.photos/seed/arch6/400/400'
        ]);
        
        $u = User::create(['name' => 'Gaya Commercial Planners Account', 'email' => 'arch7@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550007']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Gaya Commercial Planners', 'slug' => Str::slug('Gaya Commercial Planners-7'),
            'description' => 'Expert architects in Gaya focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 20,
            'city' => 'Gaya', 'district' => 'Gaya', 'address' => 'Arch Road, Gaya',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.0, 'review_count' => 171,
            'cover_image' => 'https://picsum.photos/seed/arch7/400/400'
        ]);
        
        $u = User::create(['name' => 'Muzaffarpur Builders & Architects Account', 'email' => 'arch8@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550008']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Muzaffarpur Builders & Architects', 'slug' => Str::slug('Muzaffarpur Builders & Architects-8'),
            'description' => 'Expert architects in Muzaffarpur focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 9,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Arch Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => false, 'is_featured' => true,
            'avg_rating' => 4.4, 'review_count' => 61,
            'cover_image' => 'https://picsum.photos/seed/arch8/400/400'
        ]);
        
        $u = User::create(['name' => 'Patna Commercial Planners Account', 'email' => 'arch9@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550009']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Patna Commercial Planners', 'slug' => Str::slug('Patna Commercial Planners-9'),
            'description' => 'Expert architects in Patna focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 25,
            'city' => 'Patna', 'district' => 'Patna', 'address' => 'Arch Road, Patna',
            'status' => 'active', 'is_verified' => false, 'is_featured' => false,
            'avg_rating' => 4.3, 'review_count' => 31,
            'cover_image' => 'https://picsum.photos/seed/arch9/400/400'
        ]);
        
        $u = User::create(['name' => 'Bhagalpur Commercial Planners Account', 'email' => 'arch10@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550010']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Bhagalpur Commercial Planners', 'slug' => Str::slug('Bhagalpur Commercial Planners-10'),
            'description' => 'Expert architects in Bhagalpur focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 25,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'address' => 'Arch Road, Bhagalpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.3, 'review_count' => 86,
            'cover_image' => 'https://picsum.photos/seed/arch10/400/400'
        ]);
        
        $u = User::create(['name' => 'Muzaffarpur Architects Account', 'email' => 'arch11@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550011']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Muzaffarpur Architects', 'slug' => Str::slug('Muzaffarpur Architects-11'),
            'description' => 'Expert architects in Muzaffarpur focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 11,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Arch Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.1, 'review_count' => 155,
            'cover_image' => 'https://picsum.photos/seed/arch11/400/400'
        ]);
        
        $u = User::create(['name' => 'Purnia Builders & Architects Account', 'email' => 'arch12@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550012']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Purnia Builders & Architects', 'slug' => Str::slug('Purnia Builders & Architects-12'),
            'description' => 'Expert architects in Purnia focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 8,
            'city' => 'Purnia', 'district' => 'Purnia', 'address' => 'Arch Road, Purnia',
            'status' => 'active', 'is_verified' => false, 'is_featured' => true,
            'avg_rating' => 4.4, 'review_count' => 160,
            'cover_image' => 'https://picsum.photos/seed/arch12/400/400'
        ]);
        
        $u = User::create(['name' => 'Patna Architects Account', 'email' => 'arch13@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550013']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Patna Architects', 'slug' => Str::slug('Patna Architects-13'),
            'description' => 'Expert architects in Patna focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 9,
            'city' => 'Patna', 'district' => 'Patna', 'address' => 'Arch Road, Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.1, 'review_count' => 118,
            'cover_image' => 'https://picsum.photos/seed/arch13/400/400'
        ]);
        
        $u = User::create(['name' => 'Gaya Builders & Architects Account', 'email' => 'arch14@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550014']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Gaya Builders & Architects', 'slug' => Str::slug('Gaya Builders & Architects-14'),
            'description' => 'Expert architects in Gaya focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 23,
            'city' => 'Gaya', 'district' => 'Gaya', 'address' => 'Arch Road, Gaya',
            'status' => 'active', 'is_verified' => false, 'is_featured' => true,
            'avg_rating' => 4.4, 'review_count' => 148,
            'cover_image' => 'https://picsum.photos/seed/arch14/400/400'
        ]);
        
        $u = User::create(['name' => 'Darbhanga Commercial Planners Account', 'email' => 'arch15@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550015']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Darbhanga Commercial Planners', 'slug' => Str::slug('Darbhanga Commercial Planners-15'),
            'description' => 'Expert architects in Darbhanga focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 29,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'address' => 'Arch Road, Darbhanga',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.7, 'review_count' => 115,
            'cover_image' => 'https://picsum.photos/seed/arch15/400/400'
        ]);
        
        $u = User::create(['name' => 'Purnia Structural Planners Account', 'email' => 'arch16@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550016']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Purnia Structural Planners', 'slug' => Str::slug('Purnia Structural Planners-16'),
            'description' => 'Expert architects in Purnia focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 17,
            'city' => 'Purnia', 'district' => 'Purnia', 'address' => 'Arch Road, Purnia',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.4, 'review_count' => 168,
            'cover_image' => 'https://picsum.photos/seed/arch16/400/400'
        ]);
        
        $u = User::create(['name' => 'Bhagalpur Architects Account', 'email' => 'arch17@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550017']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Bhagalpur Architects', 'slug' => Str::slug('Bhagalpur Architects-17'),
            'description' => 'Expert architects in Bhagalpur focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 10,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'address' => 'Arch Road, Bhagalpur',
            'status' => 'active', 'is_verified' => false, 'is_featured' => false,
            'avg_rating' => 4.1, 'review_count' => 98,
            'cover_image' => 'https://picsum.photos/seed/arch17/400/400'
        ]);
        
        $u = User::create(['name' => 'Bhagalpur Commercial Planners Account', 'email' => 'arch18@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550018']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Bhagalpur Commercial Planners', 'slug' => Str::slug('Bhagalpur Commercial Planners-18'),
            'description' => 'Expert architects in Bhagalpur focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 30,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'address' => 'Arch Road, Bhagalpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.2, 'review_count' => 21,
            'cover_image' => 'https://picsum.photos/seed/arch18/400/400'
        ]);
        
        $u = User::create(['name' => 'Muzaffarpur Blueprint Experts Account', 'email' => 'arch19@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550019']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Muzaffarpur Blueprint Experts', 'slug' => Str::slug('Muzaffarpur Blueprint Experts-19'),
            'description' => 'Expert architects in Muzaffarpur focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 23,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Arch Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.8, 'review_count' => 63,
            'cover_image' => 'https://picsum.photos/seed/arch19/400/400'
        ]);
        
        $u = User::create(['name' => 'Patna Blueprint Experts Account', 'email' => 'arch20@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550020']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Patna Blueprint Experts', 'slug' => Str::slug('Patna Blueprint Experts-20'),
            'description' => 'Expert architects in Patna focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 8,
            'city' => 'Patna', 'district' => 'Patna', 'address' => 'Arch Road, Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.3, 'review_count' => 129,
            'cover_image' => 'https://picsum.photos/seed/arch20/400/400'
        ]);
        
        $u = User::create(['name' => 'Mithila Architecture Account', 'email' => 'arch21@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550021']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Mithila Architecture', 'slug' => Str::slug('Mithila Architecture-21'),
            'description' => 'Expert architects in Bhagalpur focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 12,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'address' => 'Arch Road, Bhagalpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.2, 'review_count' => 119,
            'cover_image' => 'https://picsum.photos/seed/arch21/400/400'
        ]);
        
        $u = User::create(['name' => 'Muzaffarpur Structural Planners Account', 'email' => 'arch22@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550022']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Muzaffarpur Structural Planners', 'slug' => Str::slug('Muzaffarpur Structural Planners-22'),
            'description' => 'Expert architects in Muzaffarpur focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 25,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'address' => 'Arch Road, Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.4, 'review_count' => 57,
            'cover_image' => 'https://picsum.photos/seed/arch22/400/400'
        ]);
        
        $u = User::create(['name' => 'Gaya Blueprint Experts Account', 'email' => 'arch23@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550023']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Gaya Blueprint Experts', 'slug' => Str::slug('Gaya Blueprint Experts-23'),
            'description' => 'Expert architects in Gaya focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 13,
            'city' => 'Gaya', 'district' => 'Gaya', 'address' => 'Arch Road, Gaya',
            'status' => 'active', 'is_verified' => false, 'is_featured' => false,
            'avg_rating' => 4.6, 'review_count' => 78,
            'cover_image' => 'https://picsum.photos/seed/arch23/400/400'
        ]);
        
        $u = User::create(['name' => 'Gaya Commercial Planners Account', 'email' => 'arch24@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550024']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Gaya Commercial Planners', 'slug' => Str::slug('Gaya Commercial Planners-24'),
            'description' => 'Expert architects in Gaya focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 30,
            'city' => 'Gaya', 'district' => 'Gaya', 'address' => 'Arch Road, Gaya',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.4, 'review_count' => 134,
            'cover_image' => 'https://picsum.photos/seed/arch24/400/400'
        ]);
        
        $u = User::create(['name' => 'Gaya Commercial Planners Account', 'email' => 'arch25@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '9876550025']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => 'Gaya Commercial Planners', 'slug' => Str::slug('Gaya Commercial Planners-25'),
            'description' => 'Expert architects in Gaya focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => 10,
            'city' => 'Gaya', 'district' => 'Gaya', 'address' => 'Arch Road, Gaya',
            'status' => 'active', 'is_verified' => false, 'is_featured' => true,
            'avg_rating' => 4.0, 'review_count' => 51,
            'cover_image' => 'https://picsum.photos/seed/arch25/400/400'
        ]);
          }
}
