import os
import random

cities = ['Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Darbhanga', 'Purnia']
districts = {'Patna': 'Patna', 'Muzaffarpur': 'Muzaffarpur', 'Gaya': 'Gaya', 'Bhagalpur': 'Bhagalpur', 'Darbhanga': 'Darbhanga', 'Purnia': 'Purnia'}

def get_random_city():
    city = random.choice(cities)
    return city, districts[city]

def get_image(seed, width=800, height=600):
    return f"https://picsum.photos/seed/{seed}/{width}/{height}"

def generate_marketplace_seeder():
    out = []
    out.append("<?php\nnamespace Database\\Seeders;\nuse Illuminate\\Database\\Seeder;\nuse App\\Models\\User;\nuse App\\Models\\Listing;\nuse Illuminate\\Support\\Facades\\Hash;\nuse Illuminate\\Support\\Str;\n")
    out.append("class MarketplaceSeeder extends Seeder {\n  public function run(): void {\n  Listing::unguard();\n")
    
    business_names = ["{} Interior Studio", "{} Design Associates", "Magadh {} Interiors", "{} Decor Hub", "Bihar {} Works", "Patliputra {} Solutions", "{} Royal Designs", "{} Space Planners", "Modern {} Designers", "{} Elite Interiors"]
    
    for i in range(1, 51):
        city, district = get_random_city()
        name = random.choice(business_names).format(city)
        out.append(f"""
        $u = User::create(['name' => '{name} Account', 'email' => 'designer{i}@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '987654{str(i).zfill(4)}']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 1, 'title' => '{name}', 'slug' => Str::slug('{name}-{i}'),
            'description' => 'We are the leading interior designers in {city}. Specializing in modern residential and commercial designs.',
            'years_experience' => {random.randint(2, 20)},
            'city' => '{city}', 'district' => '{district}', 'address' => 'Main Road, {city}',
            'status' => 'active', 'is_verified' => {random.choice(['true', 'true', 'false'])}, 'is_featured' => {random.choice(['true', 'false', 'false'])},
            'avg_rating' => {round(random.uniform(3.8, 5.0), 1)}, 'review_count' => {random.randint(10, 150)},
            'cover_image' => '{get_image("designer"+str(i), 400, 400)}'
        ]);
        """)

    arch_names = ["{} Architects", "{} Structural Planners", "{} Builders & Architects", "Mithila Architecture", "{} Modern Villas", "{} Commercial Planners", "{} Blueprint Experts"]
    for i in range(1, 26):
        city, district = get_random_city()
        name = random.choice(arch_names).format(city)
        out.append(f"""
        $u = User::create(['name' => '{name} Account', 'email' => 'arch{i}@example.com', 'password' => Hash::make('password'), 'role' => 'business', 'is_active' => true, 'phone' => '987655{str(i).zfill(4)}']);
        Listing::create([
            'user_id' => $u->id, 'category_id' => 2, 'title' => '{name}', 'slug' => Str::slug('{name}-{i}'),
            'description' => 'Expert architects in {city} focusing on Luxury Villas and Modern Residential complexes.',
            'years_experience' => {random.randint(5, 30)},
            'city' => '{city}', 'district' => '{district}', 'address' => 'Arch Road, {city}',
            'status' => 'active', 'is_verified' => {random.choice(['true', 'true', 'false'])}, 'is_featured' => {random.choice(['true', 'false', 'false'])},
            'avg_rating' => {round(random.uniform(4.0, 5.0), 1)}, 'review_count' => {random.randint(15, 200)},
            'cover_image' => '{get_image("arch"+str(i), 400, 400)}'
        ]);
        """)
    out.append("  }\n}\n")
    return "".join(out)


def generate_builder_seeder():
    out = []
    out.append("<?php\nnamespace Database\\Seeders;\nuse Illuminate\\Database\\Seeder;\nuse App\\Models\\User;\nuse App\\Models\\Builder;\nuse App\\Models\\BuilderProject;\nuse Illuminate\\Support\\Facades\\Hash;\nuse Illuminate\\Support\\Str;\n")
    out.append("class BuilderSeeder extends Seeder {\n  public function run(): void {\n  Builder::unguard();\n  BuilderProject::unguard();\n")
    b_names = ["Magadh Builders", "Patna Infra Projects", "Ganga Realtors", "Mithila Build Estate", "Nalanda Smart Homes", "Bhagalpur Township", "Gaya Lotus Constructions", "Purnia Dream Homes", "Bihar Heights", "Kosi Developers", "Sonbhadra Builders", "Maurya Enclave", "Ashoka Builders", "Aryabhatta Constructions", "Vikramshila Realty", "Tirhut Projects", "Bhojpur City Builders", "Champaran Green Homes", "Vaishali Heritage", "Rajgir Smart City"]
    for i, name in enumerate(b_names, 1):
        city, district = get_random_city()
        rera = f"BR/RERA/{random.randint(1000, 9999)}" if random.random() > 0.2 else 'null'
        rera_val = f"'{rera}'" if rera != 'null' else 'null'
        out.append(f"""
        $u = User::create(['name' => '{name} Account', 'email' => 'builder{i}@example.com', 'password' => Hash::make('password'), 'role' => 'builder', 'is_active' => true, 'phone' => '987656{str(i).zfill(4)}']);
        $b{i} = Builder::create([
            'user_id' => $u->id, 'company_name' => '{name}', 'slug' => Str::slug('{name}-{i}'),
            'tagline' => 'Building the future of {city}',
            'city' => '{city}', 'district' => '{district}', 'established_year' => {random.randint(2000, 2020)},
            'rera_number' => {rera_val}, 'total_projects' => {random.randint(2, 10)},
            'is_verified' => true, 'is_featured' => {random.choice(['true', 'false'])},
            'avg_rating' => {round(random.uniform(3.5, 5.0), 1)}, 'review_count' => {random.randint(20, 300)},
            'cover_image' => '{get_image("builder"+str(i), 400, 400)}',
            'phone' => '987656{str(i).zfill(4)}', 'email' => 'contact@builder{i}.com'
        ]);
        """)
        
    p_names = ["Residential Apartments", "Villas", "Commercial Complex", "Mixed Use Development"]
    for i in range(1, 51):
        builder_idx = random.randint(1, 20)
        city, _ = get_random_city()
        ptype = random.choice(['residential', 'commercial', 'mixed'])
        bhk = "2BHK, 3BHK" if ptype == 'residential' else 'null'
        bhk_val = f"'{bhk}'" if bhk != 'null' else 'null'
        status = random.choice(['upcoming', 'ongoing', 'completed', 'possession_ready'])
        out.append(f"""
        BuilderProject::create([
            'builder_id' => $b{builder_idx}->id, 'title' => '{random.choice(p_names)} in {city}', 'slug' => Str::slug('Project {i} {city}'),
            'description' => 'A luxurious {ptype} project located in the heart of {city}. Modern amenities included.',
            'project_type' => '{ptype}', 'location' => '{city} Center', 'city' => '{city}',
            'bhk_options' => {bhk_val}, 'price_min' => {random.randint(30, 60)*100000}, 'price_max' => {random.randint(70, 150)*100000},
            'status' => '{status}', 'is_featured' => {random.choice(['true', 'false'])},
            'cover_image' => '{get_image("project"+str(i), 800, 500)}',
            'possession_date' => now()->addMonths({random.randint(-12, 24)}), 'is_possession_ready' => {random.choice(['true', 'false'])}
        ]);
        """)
    out.append("  }\n}\n")
    return "".join(out)


def generate_supplier_seeder():
    out = []
    out.append("<?php\nnamespace Database\\Seeders;\nuse Illuminate\\Database\\Seeder;\nuse App\\Models\\User;\nuse App\\Models\\Supplier;\nuse App\\Models\\SupplierProduct;\nuse Illuminate\\Support\\Facades\\Hash;\nuse Illuminate\\Support\\Str;\n")
    out.append("class SupplierSeeder extends Seeder {\n  public function run(): void {\n  Supplier::unguard();\n  SupplierProduct::unguard();\n")
    categories = ['Tiles', 'Marble', 'Granite', 'Plywood', 'Hardware', 'Furniture', 'Lighting', 'Glass', 'Aluminium', 'Sanitary']
    s_names = ["Ganga {} House", "Patna {} Depot", "Bihar {} World", "Magadh {} Traders", "{} Emporium"]
    for i in range(1, 41):
        cat = random.choice(categories)
        city, district = get_random_city()
        name = random.choice(s_names).format(cat)
        out.append(f"""
        $u = User::create(['name' => '{name} Account', 'email' => 'supplier{i}@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '987657{str(i).zfill(4)}']);
        $s{i} = Supplier::create([
            'user_id' => $u->id, 'company_name' => '{name}', 'slug' => Str::slug('{name}-{i}'),
            'tagline' => 'Top dealer of {cat} in {city}. We provide high-quality materials at wholesale rates.',
            'city' => '{city}', 'district' => '{district}',
            'status' => 'active', 'is_verified' => true, 'is_featured' => {random.choice(['true', 'false'])},
            'avg_rating' => {round(random.uniform(4.0, 5.0), 1)}, 'review_count' => {random.randint(10, 150)},
            'cover_image' => '{get_image("supplier"+str(i), 400, 400)}',
            'phone' => '987657{str(i).zfill(4)}', 'email' => 'contact@supplier{i}.com'
        ]);
        """)
        for p in range(1, 6):
            pid = (i-1)*5 + p
            out.append(f"""
            SupplierProduct::create([
                'supplier_id' => $s{i}->id, 'name' => 'Premium {cat} Model {p}', 'slug' => Str::slug('Premium {cat} {pid}'),
                'description' => 'High quality {cat} suitable for all modern constructions.',
                'category' => '{cat}', 'price_min' => {random.randint(100, 1000)}, 'price_max' => {random.randint(1000, 5000)}, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => '{get_image("product"+str(pid), 600, 600)}'
            ]);
            """)
    out.append("  }\n}\n")
    return "".join(out)


def generate_worker_seeder():
    out = []
    out.append("<?php\nnamespace Database\\Seeders;\nuse Illuminate\\Database\\Seeder;\nuse App\\Models\\User;\nuse App\\Models\\Worker;\nuse Illuminate\\Support\\Facades\\Hash;\nuse Illuminate\\Support\\Str;\n")
    out.append("class WorkerSeeder extends Seeder {\n  public function run(): void {\n  Worker::unguard();\n")
    categories = ['Carpenter', 'Electrician', 'Painter', 'Welder', 'Fabricator', 'Tile Mason', 'POP Expert', 'Site Supervisor']
    first_names = ["Raju", "Amit", "Suresh", "Ramesh", "Manoj", "Dinesh", "Sanjay", "Rajesh", "Pappu", "Vikas", "Ashok", "Sunil"]
    last_names = ["Kumar", "Singh", "Sharma", "Yadav", "Paswan", "Mishra", "Pandey"]
    for i in range(1, 101):
        cat = random.choice(categories)
        city, district = get_random_city()
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        out.append(f"""
        $u = User::create(['name' => '{name}', 'email' => 'worker{i}@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '987658{str(i).zfill(4)}']);
        Worker::create([
            'user_id' => $u->id, 'name' => '{name}', 'slug' => Str::slug('{name}-{i}'),
            'skill' => '{cat}', 'experience_years' => {random.randint(2, 25)},
            'daily_rate' => {random.randint(500, 1500)}, 'city' => '{city}', 'district' => '{district}',
            'is_available' => {random.choice(['true', 'false'])},
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('{name}'),
            'phone' => '987658{str(i).zfill(4)}'
        ]);
        """)
    out.append("  }\n}\n")
    return "".join(out)


def generate_requirement_seeder():
    out = []
    out.append("<?php\nnamespace Database\\Seeders;\nuse Illuminate\\Database\\Seeder;\nuse App\\Models\\User;\nuse App\\Models\\Requirement;\nuse Illuminate\\Support\\Facades\\Hash;\n")
    out.append("class RequirementSeeder extends Seeder {\n  public function run(): void {\n  Requirement::unguard();\n")
    reqs = ['3BHK Interior Design', 'Modular Kitchen', 'Villa Renovation', 'Office Interior', 'Hotel Renovation', 'Bathroom Remodeling', 'False Ceiling Work']
    for i in range(1, 101):
        city, district = get_random_city()
        title = random.choice(reqs)
        status = random.choice(['open', 'open', 'in_progress', 'closed'])
        out.append(f"""
        Requirement::create([
            'user_id' => 1, 'category_id' => {random.randint(1, 10)},
            'title' => '{title} in {city}', 'description' => 'Looking for experienced professionals for {title.lower()} at my property in {city}. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => {random.randint(1, 5)*100000}, 'budget_max' => {random.randint(6, 15)*100000},
            'city' => '{city}', 'district' => '{district}', 'status' => '{status}',
            'name' => 'Customer {i}', 'phone' => '990000{str(i).zfill(4)}'
        ]);
        """)
    out.append("  }\n}\n")
    return "".join(out)


def generate_review_seeder():
    out = []
    out.append("<?php\nnamespace Database\\Seeders;\nuse Illuminate\\Database\\Seeder;\nuse App\\Models\\Review;\n")
    out.append("class ReviewSeeder extends Seeder {\n  public function run(): void {\n  Review::unguard();\n")
    texts = ["Excellent service and very professional behavior. Highly recommended!", "They delivered the project on time. Very satisfied with the material quality.", "Good work, but took a little longer than expected.", "Absolutely stunning design work. Worth every penny.", "The team was very cooperative and understood our requirements perfectly."]
    for i in range(1, 501):
        rtype = random.choice(['App\\Models\\Listing', 'App\\Models\\Builder', 'App\\Models\\Supplier'])
        rid = random.randint(1, 75) if rtype == 'App\\Models\\Listing' else (random.randint(1, 20) if rtype == 'App\\Models\\Builder' else random.randint(1, 40))
        out.append(f"""
        Review::create([
            'user_id' => 1, 'reviewable_type' => '{rtype}', 'reviewable_id' => {rid},
            'rating' => {random.choice([4, 5, 5, 4, 3])}, 'title' => 'Great Experience',
            'body' => '{random.choice(texts)}', 'is_approved' => true
        ]);
        """)
    out.append("  }\n}\n")
    return "".join(out)


def generate_inquiry_seeder():
    out = []
    out.append("<?php\nnamespace Database\\Seeders;\nuse Illuminate\\Database\\Seeder;\nuse App\\Models\\Inquiry;\n")
    out.append("class InquirySeeder extends Seeder {\n  public function run(): void {\n  Inquiry::unguard();\n")
    for i in range(1, 101):
        rtype = random.choice(['App\\Models\\Listing', 'App\\Models\\Builder', 'App\\Models\\Supplier', 'App\\Models\\Worker'])
        rid = random.randint(1, 20)
        out.append(f"""
        Inquiry::create([
            'inquirable_type' => '{rtype}', 'inquirable_id' => {rid},
            'name' => 'Customer {i}', 'email' => 'cust{i}@example.com', 'phone' => '980000{str(i).zfill(4)}',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        """)
    out.append("  }\n}\n")
    return "".join(out)


def generate_blog_seeder():
    out = []
    out.append("<?php\nnamespace Database\\Seeders;\nuse Illuminate\\Database\\Seeder;\nuse App\\Models\\Blog;\nuse Illuminate\\Support\\Str;\n")
    out.append("class BlogSeeder extends Seeder {\n  public function run(): void {\n  Blog::unguard();\n")
    topics = ['Interior Design Trends in', 'Modular Kitchen Cost in', 'Best Tiles for Home Construction in', 'House Construction Cost in', 'Choosing the Right Architect in']
    for i in range(1, 51):
        city, _ = get_random_city()
        title = f"{random.choice(topics)} {city} (2026 Guide)"
        out.append(f"""
        Blog::create([
            'author_id' => 1, 'title' => '{title}', 'slug' => Str::slug('{title}-{i}'),
            'excerpt' => 'Discover everything you need to know about {title}. Read our comprehensive guide.',
            'content' => '<h3>Introduction</h3><p>This is a detailed guide on {title}. Our experts from {city} have shared their valuable insights.</p><p>Make sure to hire verified professionals.</p>',
            'status' => 'published', 'published_at' => now()->subDays({random.randint(1, 100)}),
            'cover_image' => '{get_image("blog"+str(i), 800, 400)}',
            'category' => 'General'
        ]);
        """)
    out.append("  }\n}\n")
    return "".join(out)


def generate_seopage_seeder():
    out = []
    out.append("<?php\nnamespace Database\\Seeders;\nuse Illuminate\\Database\\Seeder;\nuse App\\Models\\SeoPage;\n")
    out.append("class SeoPageSeeder extends Seeder {\n  public function run(): void {\n  SeoPage::unguard();\n")
    pages = [('Interior Designer Patna', '/search?category=interior-designers&city=patna'), ('Architect Patna', '/search?category=architects&city=patna'), ('Builder Patna', '/search?category=builders&city=patna'), ('Contractor Patna', '/search?category=contractors&city=patna'), ('Kitchen Designer Patna', '/search?category=modular-kitchens&city=patna'), ('Tiles Supplier Patna', '/search?category=tiles&city=patna')]
    for p in pages:
        out.append(f"""
        SeoPage::create([
            'url_path' => '{p[1]}', 'title' => 'Best {p[0]} | Find My Interior',
            'meta_description' => 'Find the top verified {p[0]}. Get free quotes and read reviews.',
            'h1_heading' => 'Top {p[0]}', 'content' => 'Browse our curated list of {p[0]}.'
        ]);
        """)
    out.append("  }\n}\n")
    return "".join(out)

def write_seeder(name, content):
    path = os.path.join('d:\\\\find my interior\\\\findmyinterior-backend\\\\database\\\\seeders', name)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

write_seeder('MarketplaceSeeder.php', generate_marketplace_seeder())
write_seeder('BuilderSeeder.php', generate_builder_seeder())
write_seeder('SupplierSeeder.php', generate_supplier_seeder())
write_seeder('WorkerSeeder.php', generate_worker_seeder())
write_seeder('RequirementSeeder.php', generate_requirement_seeder())
write_seeder('ReviewSeeder.php', generate_review_seeder())
write_seeder('InquirySeeder.php', generate_inquiry_seeder())
write_seeder('BlogSeeder.php', generate_blog_seeder())
write_seeder('SeoPageSeeder.php', generate_seopage_seeder())
