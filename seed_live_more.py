import paramiko, sys
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)
cmd = """docker exec fmi_backend php artisan tinker --execute="
\$admin = App\\Models\\User::first();

// Categories
\$catArchitect = App\\Models\\Category::where('slug', 'like', '%architect%')->first() ?? App\\Models\\Category::first();
\$catPainter = App\\Models\\Category::where('slug', 'like', '%painter%')->first() ?? App\\Models\\Category::first();
\$catKitchen = App\\Models\\Category::where('slug', 'like', '%kitchen%')->first() ?? App\\Models\\Category::first();
\$catElectrician = App\\Models\\Category::where('slug', 'like', '%electrician%')->first() ?? App\\Models\\Category::first();
\$catPlumber = App\\Models\\Category::where('slug', 'like', '%plumber%')->first() ?? App\\Models\\Category::first();

// Additional Requirements
App\\Models\\Requirement::create(['title' => 'Complete Architectural Plan for 3BHK', 'description' => 'Need 2D and 3D elevations and structural drawings.', 'category_id' => \$catArchitect->id, 'user_id' => \$admin->id, 'budget_min' => 50000, 'budget_max' => 150000, 'city' => 'Patna', 'district' => 'Patna', 'status' => 'open', 'project_type' => 'Residential', 'name' => 'Amit Kumar', 'phone' => '+919876543210']);
App\\Models\\Requirement::create(['title' => 'Exterior Painting for Apartment', 'description' => 'Need asian paints apex ultima for 4 floors.', 'category_id' => \$catPainter->id, 'user_id' => \$admin->id, 'budget_min' => 200000, 'budget_max' => 400000, 'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'open', 'project_type' => 'Residential', 'name' => 'Rahul Singh', 'phone' => '+919876543211']);
App\\Models\\Requirement::create(['title' => 'Premium Modular Kitchen', 'description' => 'Acrylic finish L-shaped kitchen with Hettich fittings.', 'category_id' => \$catKitchen->id, 'user_id' => \$admin->id, 'budget_min' => 150000, 'budget_max' => 300000, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'open', 'project_type' => 'Residential', 'name' => 'Priya Sharma', 'phone' => '+919876543212']);

// Additional RFQs
App\\Models\\Rfq::create(['title' => 'Bulk supply of Kajaria Floor Tiles', 'description' => 'Need 2000 sqft of 2x4 vitrified tiles.', 'category_id' => \$catArchitect->id, 'user_id' => \$admin->id, 'budget_min' => 80000, 'budget_max' => 120000, 'city' => 'Patna', 'district' => 'Patna', 'status' => 'open', 'name' => 'Kunal Builder', 'phone' => '+919876543213']);
App\\Models\\Rfq::create(['title' => 'Berger Paints 20 Litre Buckets', 'description' => 'Need 50 buckets of white primer and 20 colored.', 'category_id' => \$catPainter->id, 'user_id' => \$admin->id, 'budget_min' => 50000, 'budget_max' => 90000, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'open', 'name' => 'Vikash Traders', 'phone' => '+919876543214']);
App\\Models\\Rfq::create(['title' => 'Wiring Cables and Switches', 'description' => 'Havells wiring coils (1.5sqmm and 2.5sqmm) bulk.', 'category_id' => \$catElectrician->id, 'user_id' => \$admin->id, 'budget_min' => 30000, 'budget_max' => 60000, 'city' => 'Patna', 'district' => 'Patna', 'status' => 'open', 'name' => 'Surya Electricals', 'phone' => '+919876543215']);

// Additional Worker Jobs
App\\Models\\WorkerJob::create(['title' => 'Need 3 Expert Electricians', 'description' => 'Wiring work for a new 4BHK apartment.', 'category_id' => \$catElectrician->id, 'user_id' => \$admin->id, 'budget_min' => 600, 'budget_max' => 1000, 'city' => 'Patna', 'district' => 'Patna', 'status' => 'open', 'name' => 'Ramesh Contractor', 'phone' => '+919876543216']);
App\\Models\\WorkerJob::create(['title' => 'Plumbing Team for Hotel', 'description' => 'CPVC pipe fitting for 20 bathrooms.', 'category_id' => \$catPlumber->id, 'user_id' => \$admin->id, 'budget_min' => 800, 'budget_max' => 1200, 'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'open', 'name' => 'Hotel Taj', 'phone' => '+919876543217']);
App\\Models\\WorkerJob::create(['title' => 'Need 5 Carpenters for Wardrobes', 'description' => 'Plywood wardrobe making in 5 rooms.', 'category_id' => \$catKitchen->id, 'user_id' => \$admin->id, 'budget_min' => 700, 'budget_max' => 1100, 'city' => 'Patna', 'district' => 'Patna', 'status' => 'open', 'name' => 'Suresh Designs', 'phone' => '+919876543218']);

"
"""
stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode())
client.close()
