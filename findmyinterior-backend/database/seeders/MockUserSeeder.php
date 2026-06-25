<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Listing;
use App\Models\Worker;
use App\Models\Supplier;
use App\Models\Builder;
use App\Models\Category;
use App\Models\Review;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MockUserSeeder extends Seeder
{
    private array $biharCities = [
        'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia',
        'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar',
        'Munger', 'Chhapra', 'Hajipur', 'Sitamarhi', 'Saharsa',
        'Siwan', 'Motihari', 'Buxar', 'Jehanabad', 'Nawada',
    ];

    private array $biharDistricts = [
        'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia',
        'Darbhanga', 'Nalanda', 'Bhojpur', 'Begusarai', 'Katihar',
    ];

    private array $firstNames = [
        'Rajesh', 'Suresh', 'Amit', 'Vikram', 'Deepak', 'Ravi', 'Sanjay', 'Manoj', 'Arun', 'Nitin',
        'Priya', 'Sunita', 'Kavita', 'Anita', 'Seema', 'Pooja', 'Rekha', 'Meena', 'Geeta', 'Lata',
        'Rahul', 'Ashok', 'Vinod', 'Kamal', 'Sunil', 'Ajay', 'Vivek', 'Dinesh', 'Ramesh', 'Naresh',
        'Arjun', 'Mohan', 'Gopal', 'Shyam', 'Hari', 'Ram', 'Krishna', 'Lakshmi', 'Puja', 'Neha',
    ];

    private array $lastNames = [
        'Kumar', 'Singh', 'Sharma', 'Verma', 'Gupta', 'Mishra', 'Pandey', 'Tiwari', 'Yadav', 'Jha',
        'Sinha', 'Prasad', 'Thakur', 'Chauhan', 'Raj', 'Das', 'Shah', 'Lal', 'Srivastava', 'Dubey',
    ];

    private array $designerTaglines = [
        'Creating beautiful spaces that tell your story',
        'Transforming homes with elegant design solutions',
        'Where creativity meets functionality',
        'Modern interiors for the modern Bihar family',
        'Bringing international design standards to your home',
        'Award-winning interior design at affordable prices',
        'Your dream home, designed to perfection',
        'Luxury interiors that fit your budget',
    ];

    private array $contractorTaglines = [
        'Quality construction, on time and on budget',
        'Building Bihar, one project at a time',
        'Trusted contractor with 10+ years experience',
        'Residential & commercial construction experts',
        'No compromise on quality, ever',
        'Bihar\'s most reliable construction partner',
        'From foundation to finish, we do it all',
        'Licensed, insured, and highly recommended',
    ];

    private array $workerTaglines = [
        'Skilled and dependable daily worker',
        'Expert craftsman with 8 years experience',
        'Available for immediate projects',
        'Quality work at fair prices',
        'Punctual and professional every time',
        'Specialized in premium finishes',
    ];

    private array $supplierTaglines = [
        'Premium building materials at wholesale prices',
        'Direct manufacturer prices, no middlemen',
        'Bulk orders with same-day delivery in Patna',
        'Bihar\'s trusted material supplier since 2010',
        'Quality guaranteed or money back',
        'Wide range of materials for all budgets',
    ];

    private array $builderTaglines = [
        'Bihar\'s most trusted real estate developer',
        'Premium apartments and villas across Bihar',
        'Quality construction with modern amenities',
        'Delivering dream homes for 15+ years',
        'RERA registered developer',
    ];

    public function run(): void
    {
        $this->command->info('Seeding 100 mock users...');

        $roles = DB::table('roles')->pluck('id', 'slug');
        $categories = Category::all()->keyBy('name');

        // ─── Interior Designers (20) ─────────────────────────────
        $this->createProfessionals(
            20, 'interior_designer', $roles['business'] ?? 2,
            'Interior Designer', $this->designerTaglines,
            'Interior Designers',
            $categories->firstWhere('name', 'like', '%Interior%')?->id ?? 1
        );

        // ─── Contractors (20) ────────────────────────────────────
        $this->createProfessionals(
            20, 'contractor', $roles['business'] ?? 2,
            'Contractor', $this->contractorTaglines,
            'Contractors',
            $categories->firstWhere('name', 'like', '%Contractor%')?->id ?? 2
        );

        // ─── Architects (10) ─────────────────────────────────────
        $this->createProfessionals(
            10, 'architect', $roles['business'] ?? 2,
            'Architect', $this->designerTaglines,
            'Architects',
            $categories->firstWhere('name', 'like', '%Architect%')?->id ?? 3
        );

        // ─── Skilled Workers (20) ────────────────────────────────
        $this->createWorkers(20, $roles['worker'] ?? 5);

        // ─── Suppliers (15) ──────────────────────────────────────
        $this->createSuppliers(15, $roles['supplier'] ?? 4);

        // ─── Builders (10) ───────────────────────────────────────
        $this->createBuilders(10, $roles['builder'] ?? 3);

        $this->command->info('✓ MockUserSeeder completed: 95 mock professional accounts created.');
    }

    private function randomName(): array
    {
        $first = $this->firstNames[array_rand($this->firstNames)];
        $last  = $this->lastNames[array_rand($this->lastNames)];
        return ['name' => "$first $last", 'first' => $first, 'last' => $last];
    }

    private function randomCity(): string
    {
        return $this->biharCities[array_rand($this->biharCities)];
    }

    private function randomDistrict(): string
    {
        return $this->biharDistricts[array_rand($this->biharDistricts)];
    }

    private function randomPhone(): string
    {
        return '9' . rand(100000000, 999999999);
    }

    private function randomAvatar(int $seed): string
    {
        // Using DiceBear Avatars (reliable, free, no hotlinking issues)
        return "https://api.dicebear.com/7.x/personas/svg?seed={$seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf";
    }

    private function randomRating(): float
    {
        // Slightly skew towards higher ratings for realism
        $ratings = [3.5, 4.0, 4.0, 4.2, 4.5, 4.5, 4.5, 4.7, 4.8, 5.0];
        return $ratings[array_rand($ratings)];
    }

    private function generateReviews(string $entityType, int $entityId, int $count = 3): void
    {
        $reviewMessages = [
            'Excellent work! Very professional and delivered on time.',
            'Great quality, highly recommend to everyone.',
            'Very satisfied with the outcome. Will hire again.',
            'Professional, punctual, and reasonably priced.',
            'Transformed my home completely. Very happy.',
            'Good work overall. Minor delays but final result was great.',
            'Exceeded my expectations. Truly skilled professional.',
            'Very helpful and knowledgeable. 100% recommended.',
            'Best in the business. Handled everything professionally.',
            'Fair pricing and top-notch quality of work.',
        ];

        $reviewers = User::where('is_mock', false)->take(10)->pluck('id')->toArray();
        if (empty($reviewers)) {
            $reviewers = [1]; // fallback to admin
        }

        for ($i = 0; $i < $count; $i++) {
            try {
                DB::table('reviews')->insert([
                    'reviewable_type' => $entityType,
                    'reviewable_id'   => $entityId,
                    'user_id'         => $reviewers[array_rand($reviewers)],
                    'rating'          => $this->randomRating(),
                    'review'          => $reviewMessages[array_rand($reviewMessages)],
                    'status'          => 'approved',
                    'created_at'      => now()->subDays(rand(1, 180)),
                    'updated_at'      => now()->subDays(rand(1, 30)),
                ]);
            } catch (\Exception $e) {
                // Skip if review already exists
            }
        }
    }

    private function createProfessionals(
        int $count,
        string $roleSlug,
        int $roleId,
        string $profession,
        array $taglines,
        string $listingTitle,
        int $categoryId
    ): void {
        $descriptions = [
            "With years of experience in {$profession} work across Bihar, we bring quality and professionalism to every project. Our team is trained in the latest techniques and uses premium materials to ensure lasting results.",
            "We are one of Patna's leading {$profession} firms, trusted by hundreds of satisfied clients. From concept to completion, we handle every detail with care.",
            "Specializing in residential and commercial {$profession} projects throughout Bihar. We believe in transparent pricing, timely delivery, and exceptional craftsmanship.",
            "Our {$profession} services combine traditional craftsmanship with modern design sensibilities. Based in Bihar, we serve clients across the state with professionalism and dedication.",
        ];

        for ($i = 0; $i < $count; $i++) {
            $nameData = $this->randomName();
            $city     = $this->randomCity();
            $district = $this->randomDistrict();
            $email    = strtolower(Str::slug($nameData['first']) . '.' . Str::slug($nameData['last']) . rand(1, 999) . '@gmail.com');
            $seed     = rand(1000, 9999);

            // Top 20% are verified
            $isVerified      = ($i < ($count * 0.2));
            $verificationLevel = $isVerified ? 'verified_business' : 'basic';

            $user = User::create([
                'name'               => $nameData['name'],
                'email'              => $email,
                'phone'              => $this->randomPhone(),
                'password'           => Hash::make('password123'),
                'avatar'             => $this->randomAvatar($seed),
                'is_active'          => true,
                'is_mock'            => true,
                'email_verified_at'  => now()->subDays(rand(10, 365)),
                'verification_level' => $verificationLevel,
                'trust_score'        => $isVerified ? rand(70, 95) : rand(20, 60),
            ]);

            DB::table('user_roles')->insert(['user_id' => $user->id, 'role_id' => $roleId]);
            DB::table('wallets')->insert(['user_id' => $user->id, 'balance' => rand(0, 500)]);

            $yearsExp = rand(2, 15);
            $listing  = Listing::create([
                'user_id'          => $user->id,
                'category_id'      => $categoryId,
                'title'            => $nameData['name'] . ' ' . $profession . ' Services',
                'slug'             => Str::slug($nameData['name'] . '-' . $profession . '-' . $city) . '-' . Str::random(4),
                'tagline'          => $taglines[array_rand($taglines)],
                'description'      => $descriptions[array_rand($descriptions)],
                'phone'            => $user->phone,
                'whatsapp'         => rand(0, 1) ? $user->phone : null,
                'email'            => $user->email,
                'city'             => $city,
                'district'         => $district,
                'state'            => 'Bihar',
                'address'          => 'Plot ' . rand(1, 999) . ', ' . $city . ', Bihar',
                'years_experience' => $yearsExp,
                'team_size'        => rand(2, 25),
                'cover_image'      => "https://picsum.photos/seed/{$seed}/800/400",
                'status'           => 'active',
                'is_verified'      => $isVerified,
                'views_count'      => rand(20, 2000),
                'phone_clicks'     => rand(5, 200),
                'whatsapp_clicks'  => rand(3, 150),
            ]);

            // Add 3-5 reviews
            $this->generateReviews(Listing::class, $listing->id, rand(3, 5));
        }

        $this->command->info("  ✓ {$count} {$profession}s created");
    }

    private function createWorkers(int $count, int $roleId): void
    {
        $skills = ['Carpenter', 'Plumber', 'Electrician', 'Painter', 'Welder', 'Mason', 'Tiler', 'Fabricator', 'Flooring Expert', 'False Ceiling Installer'];
        $dailyRates = [500, 600, 700, 800, 900, 1000, 1200, 1500];

        for ($i = 0; $i < $count; $i++) {
            $nameData = $this->randomName();
            $city     = $this->randomCity();
            $skill    = $skills[array_rand($skills)];
            $email    = strtolower(Str::slug($nameData['first']) . rand(1, 999) . '@gmail.com');
            $seed     = rand(1000, 9999);
            $isVerified = ($i < ($count * 0.2));

            $user = User::create([
                'name'               => $nameData['name'],
                'email'              => $email,
                'phone'              => $this->randomPhone(),
                'password'           => Hash::make('password123'),
                'avatar'             => $this->randomAvatar($seed),
                'is_active'          => true,
                'is_mock'            => true,
                'email_verified_at'  => now()->subDays(rand(10, 365)),
                'verification_level' => $isVerified ? 'verified_business' : 'basic',
                'trust_score'        => rand(20, 80),
            ]);

            DB::table('user_roles')->insert(['user_id' => $user->id, 'role_id' => $roleId]);
            DB::table('wallets')->insert(['user_id' => $user->id, 'balance' => rand(0, 200)]);

            $worker = Worker::create([
                'user_id'          => $user->id,
                'name'             => $nameData['name'],
                'slug'             => Str::slug($nameData['name'] . '-' . $skill . '-' . $city) . '-' . Str::random(4),
                'skill'            => $skill,
                'phone'            => $user->phone,
                'city'             => $city,
                'district'         => $this->randomDistrict(),
                'state'            => 'Bihar',
                'years_experience' => rand(1, 12),
                'daily_rate'       => $dailyRates[array_rand($dailyRates)],
                'is_available'     => (bool) rand(0, 1),
                'description'      => "Experienced {$skill} based in {$city}, Bihar. Available for residential and commercial projects. {$nameData['first']} brings {$skill} expertise with a commitment to quality and punctuality.",
                'cover_image'      => "https://picsum.photos/seed/{$seed}/800/400",
                'status'           => 'active',
                'is_verified'      => $isVerified,
                'views_count'      => rand(10, 500),
            ]);

            $this->generateReviews(Worker::class, $worker->id, rand(2, 4));
        }

        $this->command->info("  ✓ {$count} Workers created");
    }

    private function createSuppliers(int $count, int $roleId): void
    {
        $materialTypes = [
            'Cement & Concrete', 'Steel & Iron', 'Tiles & Flooring', 'Paint & Polish',
            'Hardware & Tools', 'Electrical Fittings', 'Plumbing Supplies', 'Wood & Timber',
            'Glass & Aluminium', 'Sanitaryware',
        ];

        for ($i = 0; $i < $count; $i++) {
            $nameData     = $this->randomName();
            $city         = $this->randomCity();
            $material     = $materialTypes[array_rand($materialTypes)];
            $email        = strtolower(Str::slug($nameData['first']) . '.supplier' . rand(1, 999) . '@gmail.com');
            $seed         = rand(1000, 9999);
            $isVerified   = ($i < ($count * 0.3));

            $user = User::create([
                'name'               => $nameData['name'],
                'email'              => $email,
                'phone'              => $this->randomPhone(),
                'password'           => Hash::make('password123'),
                'avatar'             => $this->randomAvatar($seed),
                'is_active'          => true,
                'is_mock'            => true,
                'email_verified_at'  => now()->subDays(rand(10, 365)),
                'verification_level' => $isVerified ? 'verified_business' : 'basic',
                'trust_score'        => rand(30, 85),
            ]);

            DB::table('user_roles')->insert(['user_id' => $user->id, 'role_id' => $roleId]);
            DB::table('wallets')->insert(['user_id' => $user->id, 'balance' => rand(0, 1000)]);

            $businessName = $nameData['name'] . ' ' . $material . ' Suppliers';
            $supplier = Supplier::create([
                'user_id'      => $user->id,
                'name'         => $businessName,
                'slug'         => Str::slug($businessName . '-' . $city) . '-' . Str::random(4),
                'tagline'      => $this->supplierTaglines[array_rand($this->supplierTaglines)],
                'description'  => "Leading supplier of {$material} in {$city} and surrounding areas. We offer competitive wholesale prices, bulk discounts, and timely delivery across Bihar. {$nameData['name']} has been serving contractors and builders for over 8 years.",
                'phone'        => $user->phone,
                'email'        => $user->email,
                'city'         => $city,
                'district'     => $this->randomDistrict(),
                'state'        => 'Bihar',
                'address'      => 'Warehouse No. ' . rand(1, 50) . ', Industrial Area, ' . $city,
                'cover_image'  => "https://picsum.photos/seed/{$seed}/800/400",
                'status'       => 'active',
                'is_verified'  => $isVerified,
                'views_count'  => rand(50, 3000),
            ]);

            $this->generateReviews(Supplier::class, $supplier->id, rand(2, 4));
        }

        $this->command->info("  ✓ {$count} Suppliers created");
    }

    private function createBuilders(int $count, int $roleId): void
    {
        $projectTypes = ['Residential Apartments', 'Commercial Complex', 'Villas & Bungalows', 'Township Development', 'Plotted Development'];

        for ($i = 0; $i < $count; $i++) {
            $nameData   = $this->randomName();
            $city       = $this->randomCity();
            $projType   = $projectTypes[array_rand($projectTypes)];
            $email      = strtolower(Str::slug($nameData['first']) . '.builders' . rand(1, 999) . '@gmail.com');
            $seed       = rand(1000, 9999);
            $isVerified = true; // All builders are verified

            $user = User::create([
                'name'               => $nameData['name'],
                'email'              => $email,
                'phone'              => $this->randomPhone(),
                'password'           => Hash::make('password123'),
                'avatar'             => $this->randomAvatar($seed),
                'is_active'          => true,
                'is_mock'            => true,
                'email_verified_at'  => now()->subDays(rand(30, 365)),
                'verification_level' => 'verified_business',
                'trust_score'        => rand(70, 95),
            ]);

            DB::table('user_roles')->insert(['user_id' => $user->id, 'role_id' => $roleId]);
            DB::table('wallets')->insert(['user_id' => $user->id, 'balance' => rand(500, 5000)]);

            $companyName = $nameData['name'] . ' Builders & Developers';
            $builder = Builder::create([
                'user_id'               => $user->id,
                'name'                  => $companyName,
                'slug'                  => Str::slug($companyName . '-' . $city) . '-' . Str::random(4),
                'tagline'               => $this->builderTaglines[array_rand($this->builderTaglines)],
                'description'           => "Established builder and real estate developer based in {$city}, Bihar. Specializing in {$projType} with a portfolio of 20+ completed projects. RERA registered with a commitment to quality construction and timely possession.",
                'phone'                 => $user->phone,
                'email'                 => $user->email,
                'city'                  => $city,
                'district'              => $this->randomDistrict(),
                'state'                 => 'Bihar',
                'address'               => 'Office No. ' . rand(1, 20) . ', Business Center, ' . $city,
                'cover_image'           => "https://picsum.photos/seed/{$seed}/800/400",
                'status'                => 'active',
                'is_verified'           => true,
                'total_projects_count'  => rand(5, 50),
                'ongoing_projects_count'=> rand(1, 10),
                'views_count'           => rand(100, 5000),
            ]);

            $this->generateReviews(Builder::class, $builder->id, rand(3, 6));
        }

        $this->command->info("  ✓ {$count} Builders created");
    }
}
