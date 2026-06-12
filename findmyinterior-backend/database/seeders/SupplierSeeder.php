<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Supplier;
use App\Models\SupplierProduct;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
class SupplierSeeder extends Seeder {
  public function run(): void {
  Supplier::unguard();
  SupplierProduct::unguard();

        $u = User::create(['name' => 'Patna Marble Depot Account', 'email' => 'supplier1@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570001']);
        $s1 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Patna Marble Depot', 'slug' => Str::slug('Patna Marble Depot-1'),
            'tagline' => 'Top dealer of Marble in Muzaffarpur. We provide high-quality materials at wholesale rates.',
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.0, 'review_count' => 44,
            'cover_image' => 'https://picsum.photos/seed/supplier1/400/400',
            'phone' => '9876570001', 'email' => 'contact@supplier1.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s1->id, 'name' => 'Premium Marble Model 1', 'slug' => Str::slug('Premium Marble 1'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 402, 'price_max' => 4329, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product1/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s1->id, 'name' => 'Premium Marble Model 2', 'slug' => Str::slug('Premium Marble 2'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 475, 'price_max' => 3549, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product2/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s1->id, 'name' => 'Premium Marble Model 3', 'slug' => Str::slug('Premium Marble 3'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 471, 'price_max' => 1740, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product3/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s1->id, 'name' => 'Premium Marble Model 4', 'slug' => Str::slug('Premium Marble 4'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 412, 'price_max' => 1401, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product4/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s1->id, 'name' => 'Premium Marble Model 5', 'slug' => Str::slug('Premium Marble 5'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 976, 'price_max' => 4919, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product5/600/600'
            ]);
            
        $u = User::create(['name' => 'Ganga Lighting House Account', 'email' => 'supplier2@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570002']);
        $s2 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Ganga Lighting House', 'slug' => Str::slug('Ganga Lighting House-2'),
            'tagline' => 'Top dealer of Lighting in Patna. We provide high-quality materials at wholesale rates.',
            'city' => 'Patna', 'district' => 'Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.2, 'review_count' => 116,
            'cover_image' => 'https://picsum.photos/seed/supplier2/400/400',
            'phone' => '9876570002', 'email' => 'contact@supplier2.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s2->id, 'name' => 'Premium Lighting Model 1', 'slug' => Str::slug('Premium Lighting 6'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 588, 'price_max' => 1103, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product6/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s2->id, 'name' => 'Premium Lighting Model 2', 'slug' => Str::slug('Premium Lighting 7'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 843, 'price_max' => 2807, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product7/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s2->id, 'name' => 'Premium Lighting Model 3', 'slug' => Str::slug('Premium Lighting 8'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 375, 'price_max' => 3851, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product8/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s2->id, 'name' => 'Premium Lighting Model 4', 'slug' => Str::slug('Premium Lighting 9'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 862, 'price_max' => 4529, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product9/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s2->id, 'name' => 'Premium Lighting Model 5', 'slug' => Str::slug('Premium Lighting 10'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 222, 'price_max' => 4074, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product10/600/600'
            ]);
            
        $u = User::create(['name' => 'Furniture Emporium Account', 'email' => 'supplier3@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570003']);
        $s3 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Furniture Emporium', 'slug' => Str::slug('Furniture Emporium-3'),
            'tagline' => 'Top dealer of Furniture in Muzaffarpur. We provide high-quality materials at wholesale rates.',
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.2, 'review_count' => 48,
            'cover_image' => 'https://picsum.photos/seed/supplier3/400/400',
            'phone' => '9876570003', 'email' => 'contact@supplier3.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s3->id, 'name' => 'Premium Furniture Model 1', 'slug' => Str::slug('Premium Furniture 11'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 151, 'price_max' => 2309, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product11/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s3->id, 'name' => 'Premium Furniture Model 2', 'slug' => Str::slug('Premium Furniture 12'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 734, 'price_max' => 4294, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product12/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s3->id, 'name' => 'Premium Furniture Model 3', 'slug' => Str::slug('Premium Furniture 13'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 930, 'price_max' => 4318, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product13/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s3->id, 'name' => 'Premium Furniture Model 4', 'slug' => Str::slug('Premium Furniture 14'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 177, 'price_max' => 3300, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product14/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s3->id, 'name' => 'Premium Furniture Model 5', 'slug' => Str::slug('Premium Furniture 15'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 994, 'price_max' => 1689, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product15/600/600'
            ]);
            
        $u = User::create(['name' => 'Glass Emporium Account', 'email' => 'supplier4@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570004']);
        $s4 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Glass Emporium', 'slug' => Str::slug('Glass Emporium-4'),
            'tagline' => 'Top dealer of Glass in Muzaffarpur. We provide high-quality materials at wholesale rates.',
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.4, 'review_count' => 115,
            'cover_image' => 'https://picsum.photos/seed/supplier4/400/400',
            'phone' => '9876570004', 'email' => 'contact@supplier4.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s4->id, 'name' => 'Premium Glass Model 1', 'slug' => Str::slug('Premium Glass 16'),
                'description' => 'High quality Glass suitable for all modern constructions.',
                'category' => 'Glass', 'price_min' => 538, 'price_max' => 2981, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product16/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s4->id, 'name' => 'Premium Glass Model 2', 'slug' => Str::slug('Premium Glass 17'),
                'description' => 'High quality Glass suitable for all modern constructions.',
                'category' => 'Glass', 'price_min' => 219, 'price_max' => 2242, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product17/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s4->id, 'name' => 'Premium Glass Model 3', 'slug' => Str::slug('Premium Glass 18'),
                'description' => 'High quality Glass suitable for all modern constructions.',
                'category' => 'Glass', 'price_min' => 480, 'price_max' => 2881, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product18/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s4->id, 'name' => 'Premium Glass Model 4', 'slug' => Str::slug('Premium Glass 19'),
                'description' => 'High quality Glass suitable for all modern constructions.',
                'category' => 'Glass', 'price_min' => 844, 'price_max' => 2599, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product19/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s4->id, 'name' => 'Premium Glass Model 5', 'slug' => Str::slug('Premium Glass 20'),
                'description' => 'High quality Glass suitable for all modern constructions.',
                'category' => 'Glass', 'price_min' => 715, 'price_max' => 4808, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product20/600/600'
            ]);
            
        $u = User::create(['name' => 'Granite Emporium Account', 'email' => 'supplier5@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570005']);
        $s5 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Granite Emporium', 'slug' => Str::slug('Granite Emporium-5'),
            'tagline' => 'Top dealer of Granite in Patna. We provide high-quality materials at wholesale rates.',
            'city' => 'Patna', 'district' => 'Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.1, 'review_count' => 138,
            'cover_image' => 'https://picsum.photos/seed/supplier5/400/400',
            'phone' => '9876570005', 'email' => 'contact@supplier5.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s5->id, 'name' => 'Premium Granite Model 1', 'slug' => Str::slug('Premium Granite 21'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 476, 'price_max' => 4271, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product21/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s5->id, 'name' => 'Premium Granite Model 2', 'slug' => Str::slug('Premium Granite 22'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 974, 'price_max' => 1358, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product22/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s5->id, 'name' => 'Premium Granite Model 3', 'slug' => Str::slug('Premium Granite 23'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 597, 'price_max' => 3761, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product23/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s5->id, 'name' => 'Premium Granite Model 4', 'slug' => Str::slug('Premium Granite 24'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 663, 'price_max' => 2915, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product24/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s5->id, 'name' => 'Premium Granite Model 5', 'slug' => Str::slug('Premium Granite 25'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 511, 'price_max' => 4928, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product25/600/600'
            ]);
            
        $u = User::create(['name' => 'Bihar Marble World Account', 'email' => 'supplier6@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570006']);
        $s6 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Bihar Marble World', 'slug' => Str::slug('Bihar Marble World-6'),
            'tagline' => 'Top dealer of Marble in Gaya. We provide high-quality materials at wholesale rates.',
            'city' => 'Gaya', 'district' => 'Gaya',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.9, 'review_count' => 88,
            'cover_image' => 'https://picsum.photos/seed/supplier6/400/400',
            'phone' => '9876570006', 'email' => 'contact@supplier6.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s6->id, 'name' => 'Premium Marble Model 1', 'slug' => Str::slug('Premium Marble 26'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 319, 'price_max' => 2407, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product26/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s6->id, 'name' => 'Premium Marble Model 2', 'slug' => Str::slug('Premium Marble 27'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 602, 'price_max' => 4185, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product27/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s6->id, 'name' => 'Premium Marble Model 3', 'slug' => Str::slug('Premium Marble 28'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 937, 'price_max' => 3082, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product28/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s6->id, 'name' => 'Premium Marble Model 4', 'slug' => Str::slug('Premium Marble 29'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 322, 'price_max' => 3007, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product29/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s6->id, 'name' => 'Premium Marble Model 5', 'slug' => Str::slug('Premium Marble 30'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 423, 'price_max' => 4267, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product30/600/600'
            ]);
            
        $u = User::create(['name' => 'Bihar Hardware World Account', 'email' => 'supplier7@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570007']);
        $s7 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Bihar Hardware World', 'slug' => Str::slug('Bihar Hardware World-7'),
            'tagline' => 'Top dealer of Hardware in Purnia. We provide high-quality materials at wholesale rates.',
            'city' => 'Purnia', 'district' => 'Purnia',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.1, 'review_count' => 10,
            'cover_image' => 'https://picsum.photos/seed/supplier7/400/400',
            'phone' => '9876570007', 'email' => 'contact@supplier7.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s7->id, 'name' => 'Premium Hardware Model 1', 'slug' => Str::slug('Premium Hardware 31'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 593, 'price_max' => 1916, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product31/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s7->id, 'name' => 'Premium Hardware Model 2', 'slug' => Str::slug('Premium Hardware 32'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 129, 'price_max' => 2632, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product32/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s7->id, 'name' => 'Premium Hardware Model 3', 'slug' => Str::slug('Premium Hardware 33'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 945, 'price_max' => 1434, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product33/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s7->id, 'name' => 'Premium Hardware Model 4', 'slug' => Str::slug('Premium Hardware 34'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 898, 'price_max' => 2876, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product34/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s7->id, 'name' => 'Premium Hardware Model 5', 'slug' => Str::slug('Premium Hardware 35'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 278, 'price_max' => 2504, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product35/600/600'
            ]);
            
        $u = User::create(['name' => 'Bihar Granite World Account', 'email' => 'supplier8@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570008']);
        $s8 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Bihar Granite World', 'slug' => Str::slug('Bihar Granite World-8'),
            'tagline' => 'Top dealer of Granite in Bhagalpur. We provide high-quality materials at wholesale rates.',
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.2, 'review_count' => 48,
            'cover_image' => 'https://picsum.photos/seed/supplier8/400/400',
            'phone' => '9876570008', 'email' => 'contact@supplier8.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s8->id, 'name' => 'Premium Granite Model 1', 'slug' => Str::slug('Premium Granite 36'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 721, 'price_max' => 4885, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product36/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s8->id, 'name' => 'Premium Granite Model 2', 'slug' => Str::slug('Premium Granite 37'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 478, 'price_max' => 4398, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product37/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s8->id, 'name' => 'Premium Granite Model 3', 'slug' => Str::slug('Premium Granite 38'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 375, 'price_max' => 1860, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product38/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s8->id, 'name' => 'Premium Granite Model 4', 'slug' => Str::slug('Premium Granite 39'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 316, 'price_max' => 3322, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product39/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s8->id, 'name' => 'Premium Granite Model 5', 'slug' => Str::slug('Premium Granite 40'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 540, 'price_max' => 2148, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product40/600/600'
            ]);
            
        $u = User::create(['name' => 'Magadh Granite Traders Account', 'email' => 'supplier9@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570009']);
        $s9 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Magadh Granite Traders', 'slug' => Str::slug('Magadh Granite Traders-9'),
            'tagline' => 'Top dealer of Granite in Bhagalpur. We provide high-quality materials at wholesale rates.',
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.5, 'review_count' => 109,
            'cover_image' => 'https://picsum.photos/seed/supplier9/400/400',
            'phone' => '9876570009', 'email' => 'contact@supplier9.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s9->id, 'name' => 'Premium Granite Model 1', 'slug' => Str::slug('Premium Granite 41'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 138, 'price_max' => 4732, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product41/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s9->id, 'name' => 'Premium Granite Model 2', 'slug' => Str::slug('Premium Granite 42'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 354, 'price_max' => 2601, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product42/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s9->id, 'name' => 'Premium Granite Model 3', 'slug' => Str::slug('Premium Granite 43'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 801, 'price_max' => 4759, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product43/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s9->id, 'name' => 'Premium Granite Model 4', 'slug' => Str::slug('Premium Granite 44'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 896, 'price_max' => 2868, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product44/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s9->id, 'name' => 'Premium Granite Model 5', 'slug' => Str::slug('Premium Granite 45'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 825, 'price_max' => 3191, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product45/600/600'
            ]);
            
        $u = User::create(['name' => 'Bihar Tiles World Account', 'email' => 'supplier10@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570010']);
        $s10 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Bihar Tiles World', 'slug' => Str::slug('Bihar Tiles World-10'),
            'tagline' => 'Top dealer of Tiles in Gaya. We provide high-quality materials at wholesale rates.',
            'city' => 'Gaya', 'district' => 'Gaya',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.2, 'review_count' => 33,
            'cover_image' => 'https://picsum.photos/seed/supplier10/400/400',
            'phone' => '9876570010', 'email' => 'contact@supplier10.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s10->id, 'name' => 'Premium Tiles Model 1', 'slug' => Str::slug('Premium Tiles 46'),
                'description' => 'High quality Tiles suitable for all modern constructions.',
                'category' => 'Tiles', 'price_min' => 482, 'price_max' => 1879, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product46/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s10->id, 'name' => 'Premium Tiles Model 2', 'slug' => Str::slug('Premium Tiles 47'),
                'description' => 'High quality Tiles suitable for all modern constructions.',
                'category' => 'Tiles', 'price_min' => 577, 'price_max' => 1813, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product47/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s10->id, 'name' => 'Premium Tiles Model 3', 'slug' => Str::slug('Premium Tiles 48'),
                'description' => 'High quality Tiles suitable for all modern constructions.',
                'category' => 'Tiles', 'price_min' => 611, 'price_max' => 4512, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product48/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s10->id, 'name' => 'Premium Tiles Model 4', 'slug' => Str::slug('Premium Tiles 49'),
                'description' => 'High quality Tiles suitable for all modern constructions.',
                'category' => 'Tiles', 'price_min' => 677, 'price_max' => 2543, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product49/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s10->id, 'name' => 'Premium Tiles Model 5', 'slug' => Str::slug('Premium Tiles 50'),
                'description' => 'High quality Tiles suitable for all modern constructions.',
                'category' => 'Tiles', 'price_min' => 707, 'price_max' => 4233, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product50/600/600'
            ]);
            
        $u = User::create(['name' => 'Magadh Aluminium Traders Account', 'email' => 'supplier11@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570011']);
        $s11 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Magadh Aluminium Traders', 'slug' => Str::slug('Magadh Aluminium Traders-11'),
            'tagline' => 'Top dealer of Aluminium in Patna. We provide high-quality materials at wholesale rates.',
            'city' => 'Patna', 'district' => 'Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.9, 'review_count' => 59,
            'cover_image' => 'https://picsum.photos/seed/supplier11/400/400',
            'phone' => '9876570011', 'email' => 'contact@supplier11.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s11->id, 'name' => 'Premium Aluminium Model 1', 'slug' => Str::slug('Premium Aluminium 51'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 984, 'price_max' => 4814, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product51/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s11->id, 'name' => 'Premium Aluminium Model 2', 'slug' => Str::slug('Premium Aluminium 52'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 854, 'price_max' => 1287, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product52/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s11->id, 'name' => 'Premium Aluminium Model 3', 'slug' => Str::slug('Premium Aluminium 53'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 579, 'price_max' => 2151, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product53/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s11->id, 'name' => 'Premium Aluminium Model 4', 'slug' => Str::slug('Premium Aluminium 54'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 351, 'price_max' => 4179, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product54/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s11->id, 'name' => 'Premium Aluminium Model 5', 'slug' => Str::slug('Premium Aluminium 55'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 695, 'price_max' => 2077, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product55/600/600'
            ]);
            
        $u = User::create(['name' => 'Magadh Tiles Traders Account', 'email' => 'supplier12@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570012']);
        $s12 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Magadh Tiles Traders', 'slug' => Str::slug('Magadh Tiles Traders-12'),
            'tagline' => 'Top dealer of Tiles in Darbhanga. We provide high-quality materials at wholesale rates.',
            'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.8, 'review_count' => 125,
            'cover_image' => 'https://picsum.photos/seed/supplier12/400/400',
            'phone' => '9876570012', 'email' => 'contact@supplier12.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s12->id, 'name' => 'Premium Tiles Model 1', 'slug' => Str::slug('Premium Tiles 56'),
                'description' => 'High quality Tiles suitable for all modern constructions.',
                'category' => 'Tiles', 'price_min' => 765, 'price_max' => 1677, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product56/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s12->id, 'name' => 'Premium Tiles Model 2', 'slug' => Str::slug('Premium Tiles 57'),
                'description' => 'High quality Tiles suitable for all modern constructions.',
                'category' => 'Tiles', 'price_min' => 118, 'price_max' => 1820, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product57/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s12->id, 'name' => 'Premium Tiles Model 3', 'slug' => Str::slug('Premium Tiles 58'),
                'description' => 'High quality Tiles suitable for all modern constructions.',
                'category' => 'Tiles', 'price_min' => 441, 'price_max' => 1158, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product58/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s12->id, 'name' => 'Premium Tiles Model 4', 'slug' => Str::slug('Premium Tiles 59'),
                'description' => 'High quality Tiles suitable for all modern constructions.',
                'category' => 'Tiles', 'price_min' => 953, 'price_max' => 3516, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product59/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s12->id, 'name' => 'Premium Tiles Model 5', 'slug' => Str::slug('Premium Tiles 60'),
                'description' => 'High quality Tiles suitable for all modern constructions.',
                'category' => 'Tiles', 'price_min' => 101, 'price_max' => 4326, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product60/600/600'
            ]);
            
        $u = User::create(['name' => 'Bihar Lighting World Account', 'email' => 'supplier13@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570013']);
        $s13 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Bihar Lighting World', 'slug' => Str::slug('Bihar Lighting World-13'),
            'tagline' => 'Top dealer of Lighting in Bhagalpur. We provide high-quality materials at wholesale rates.',
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.1, 'review_count' => 11,
            'cover_image' => 'https://picsum.photos/seed/supplier13/400/400',
            'phone' => '9876570013', 'email' => 'contact@supplier13.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s13->id, 'name' => 'Premium Lighting Model 1', 'slug' => Str::slug('Premium Lighting 61'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 383, 'price_max' => 4449, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product61/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s13->id, 'name' => 'Premium Lighting Model 2', 'slug' => Str::slug('Premium Lighting 62'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 370, 'price_max' => 4453, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product62/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s13->id, 'name' => 'Premium Lighting Model 3', 'slug' => Str::slug('Premium Lighting 63'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 185, 'price_max' => 4867, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product63/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s13->id, 'name' => 'Premium Lighting Model 4', 'slug' => Str::slug('Premium Lighting 64'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 611, 'price_max' => 3215, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product64/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s13->id, 'name' => 'Premium Lighting Model 5', 'slug' => Str::slug('Premium Lighting 65'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 536, 'price_max' => 2732, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product65/600/600'
            ]);
            
        $u = User::create(['name' => 'Patna Granite Depot Account', 'email' => 'supplier14@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570014']);
        $s14 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Patna Granite Depot', 'slug' => Str::slug('Patna Granite Depot-14'),
            'tagline' => 'Top dealer of Granite in Patna. We provide high-quality materials at wholesale rates.',
            'city' => 'Patna', 'district' => 'Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.9, 'review_count' => 103,
            'cover_image' => 'https://picsum.photos/seed/supplier14/400/400',
            'phone' => '9876570014', 'email' => 'contact@supplier14.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s14->id, 'name' => 'Premium Granite Model 1', 'slug' => Str::slug('Premium Granite 66'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 789, 'price_max' => 3193, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product66/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s14->id, 'name' => 'Premium Granite Model 2', 'slug' => Str::slug('Premium Granite 67'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 621, 'price_max' => 1924, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product67/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s14->id, 'name' => 'Premium Granite Model 3', 'slug' => Str::slug('Premium Granite 68'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 681, 'price_max' => 1584, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product68/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s14->id, 'name' => 'Premium Granite Model 4', 'slug' => Str::slug('Premium Granite 69'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 762, 'price_max' => 2612, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product69/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s14->id, 'name' => 'Premium Granite Model 5', 'slug' => Str::slug('Premium Granite 70'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 960, 'price_max' => 1444, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product70/600/600'
            ]);
            
        $u = User::create(['name' => 'Furniture Emporium Account', 'email' => 'supplier15@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570015']);
        $s15 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Furniture Emporium', 'slug' => Str::slug('Furniture Emporium-15'),
            'tagline' => 'Top dealer of Furniture in Gaya. We provide high-quality materials at wholesale rates.',
            'city' => 'Gaya', 'district' => 'Gaya',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.8, 'review_count' => 95,
            'cover_image' => 'https://picsum.photos/seed/supplier15/400/400',
            'phone' => '9876570015', 'email' => 'contact@supplier15.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s15->id, 'name' => 'Premium Furniture Model 1', 'slug' => Str::slug('Premium Furniture 71'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 320, 'price_max' => 1428, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product71/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s15->id, 'name' => 'Premium Furniture Model 2', 'slug' => Str::slug('Premium Furniture 72'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 284, 'price_max' => 4291, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product72/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s15->id, 'name' => 'Premium Furniture Model 3', 'slug' => Str::slug('Premium Furniture 73'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 642, 'price_max' => 4519, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product73/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s15->id, 'name' => 'Premium Furniture Model 4', 'slug' => Str::slug('Premium Furniture 74'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 280, 'price_max' => 2277, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product74/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s15->id, 'name' => 'Premium Furniture Model 5', 'slug' => Str::slug('Premium Furniture 75'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 202, 'price_max' => 4796, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product75/600/600'
            ]);
            
        $u = User::create(['name' => 'Sanitary Emporium Account', 'email' => 'supplier16@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570016']);
        $s16 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Sanitary Emporium', 'slug' => Str::slug('Sanitary Emporium-16'),
            'tagline' => 'Top dealer of Sanitary in Gaya. We provide high-quality materials at wholesale rates.',
            'city' => 'Gaya', 'district' => 'Gaya',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.0, 'review_count' => 147,
            'cover_image' => 'https://picsum.photos/seed/supplier16/400/400',
            'phone' => '9876570016', 'email' => 'contact@supplier16.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s16->id, 'name' => 'Premium Sanitary Model 1', 'slug' => Str::slug('Premium Sanitary 76'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 365, 'price_max' => 1735, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product76/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s16->id, 'name' => 'Premium Sanitary Model 2', 'slug' => Str::slug('Premium Sanitary 77'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 828, 'price_max' => 4160, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product77/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s16->id, 'name' => 'Premium Sanitary Model 3', 'slug' => Str::slug('Premium Sanitary 78'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 213, 'price_max' => 2730, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product78/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s16->id, 'name' => 'Premium Sanitary Model 4', 'slug' => Str::slug('Premium Sanitary 79'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 669, 'price_max' => 4943, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product79/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s16->id, 'name' => 'Premium Sanitary Model 5', 'slug' => Str::slug('Premium Sanitary 80'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 273, 'price_max' => 2572, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product80/600/600'
            ]);
            
        $u = User::create(['name' => 'Patna Tiles Depot Account', 'email' => 'supplier17@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570017']);
        $s17 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Patna Tiles Depot', 'slug' => Str::slug('Patna Tiles Depot-17'),
            'tagline' => 'Top dealer of Tiles in Purnia. We provide high-quality materials at wholesale rates.',
            'city' => 'Purnia', 'district' => 'Purnia',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.6, 'review_count' => 89,
            'cover_image' => 'https://picsum.photos/seed/supplier17/400/400',
            'phone' => '9876570017', 'email' => 'contact@supplier17.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s17->id, 'name' => 'Premium Tiles Model 1', 'slug' => Str::slug('Premium Tiles 81'),
                'description' => 'High quality Tiles suitable for all modern constructions.',
                'category' => 'Tiles', 'price_min' => 757, 'price_max' => 1000, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product81/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s17->id, 'name' => 'Premium Tiles Model 2', 'slug' => Str::slug('Premium Tiles 82'),
                'description' => 'High quality Tiles suitable for all modern constructions.',
                'category' => 'Tiles', 'price_min' => 770, 'price_max' => 1412, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product82/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s17->id, 'name' => 'Premium Tiles Model 3', 'slug' => Str::slug('Premium Tiles 83'),
                'description' => 'High quality Tiles suitable for all modern constructions.',
                'category' => 'Tiles', 'price_min' => 913, 'price_max' => 1922, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product83/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s17->id, 'name' => 'Premium Tiles Model 4', 'slug' => Str::slug('Premium Tiles 84'),
                'description' => 'High quality Tiles suitable for all modern constructions.',
                'category' => 'Tiles', 'price_min' => 287, 'price_max' => 2224, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product84/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s17->id, 'name' => 'Premium Tiles Model 5', 'slug' => Str::slug('Premium Tiles 85'),
                'description' => 'High quality Tiles suitable for all modern constructions.',
                'category' => 'Tiles', 'price_min' => 662, 'price_max' => 2311, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product85/600/600'
            ]);
            
        $u = User::create(['name' => 'Ganga Aluminium House Account', 'email' => 'supplier18@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570018']);
        $s18 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Ganga Aluminium House', 'slug' => Str::slug('Ganga Aluminium House-18'),
            'tagline' => 'Top dealer of Aluminium in Gaya. We provide high-quality materials at wholesale rates.',
            'city' => 'Gaya', 'district' => 'Gaya',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.8, 'review_count' => 106,
            'cover_image' => 'https://picsum.photos/seed/supplier18/400/400',
            'phone' => '9876570018', 'email' => 'contact@supplier18.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s18->id, 'name' => 'Premium Aluminium Model 1', 'slug' => Str::slug('Premium Aluminium 86'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 970, 'price_max' => 1097, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product86/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s18->id, 'name' => 'Premium Aluminium Model 2', 'slug' => Str::slug('Premium Aluminium 87'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 464, 'price_max' => 1222, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product87/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s18->id, 'name' => 'Premium Aluminium Model 3', 'slug' => Str::slug('Premium Aluminium 88'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 429, 'price_max' => 3776, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product88/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s18->id, 'name' => 'Premium Aluminium Model 4', 'slug' => Str::slug('Premium Aluminium 89'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 523, 'price_max' => 1588, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product89/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s18->id, 'name' => 'Premium Aluminium Model 5', 'slug' => Str::slug('Premium Aluminium 90'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 861, 'price_max' => 2063, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product90/600/600'
            ]);
            
        $u = User::create(['name' => 'Magadh Glass Traders Account', 'email' => 'supplier19@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570019']);
        $s19 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Magadh Glass Traders', 'slug' => Str::slug('Magadh Glass Traders-19'),
            'tagline' => 'Top dealer of Glass in Patna. We provide high-quality materials at wholesale rates.',
            'city' => 'Patna', 'district' => 'Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.5, 'review_count' => 130,
            'cover_image' => 'https://picsum.photos/seed/supplier19/400/400',
            'phone' => '9876570019', 'email' => 'contact@supplier19.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s19->id, 'name' => 'Premium Glass Model 1', 'slug' => Str::slug('Premium Glass 91'),
                'description' => 'High quality Glass suitable for all modern constructions.',
                'category' => 'Glass', 'price_min' => 586, 'price_max' => 1920, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product91/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s19->id, 'name' => 'Premium Glass Model 2', 'slug' => Str::slug('Premium Glass 92'),
                'description' => 'High quality Glass suitable for all modern constructions.',
                'category' => 'Glass', 'price_min' => 547, 'price_max' => 3391, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product92/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s19->id, 'name' => 'Premium Glass Model 3', 'slug' => Str::slug('Premium Glass 93'),
                'description' => 'High quality Glass suitable for all modern constructions.',
                'category' => 'Glass', 'price_min' => 528, 'price_max' => 4840, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product93/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s19->id, 'name' => 'Premium Glass Model 4', 'slug' => Str::slug('Premium Glass 94'),
                'description' => 'High quality Glass suitable for all modern constructions.',
                'category' => 'Glass', 'price_min' => 227, 'price_max' => 4487, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product94/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s19->id, 'name' => 'Premium Glass Model 5', 'slug' => Str::slug('Premium Glass 95'),
                'description' => 'High quality Glass suitable for all modern constructions.',
                'category' => 'Glass', 'price_min' => 651, 'price_max' => 4552, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product95/600/600'
            ]);
            
        $u = User::create(['name' => 'Patna Furniture Depot Account', 'email' => 'supplier20@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570020']);
        $s20 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Patna Furniture Depot', 'slug' => Str::slug('Patna Furniture Depot-20'),
            'tagline' => 'Top dealer of Furniture in Patna. We provide high-quality materials at wholesale rates.',
            'city' => 'Patna', 'district' => 'Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.2, 'review_count' => 103,
            'cover_image' => 'https://picsum.photos/seed/supplier20/400/400',
            'phone' => '9876570020', 'email' => 'contact@supplier20.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s20->id, 'name' => 'Premium Furniture Model 1', 'slug' => Str::slug('Premium Furniture 96'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 804, 'price_max' => 1881, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product96/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s20->id, 'name' => 'Premium Furniture Model 2', 'slug' => Str::slug('Premium Furniture 97'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 661, 'price_max' => 1996, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product97/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s20->id, 'name' => 'Premium Furniture Model 3', 'slug' => Str::slug('Premium Furniture 98'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 786, 'price_max' => 3021, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product98/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s20->id, 'name' => 'Premium Furniture Model 4', 'slug' => Str::slug('Premium Furniture 99'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 354, 'price_max' => 4871, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product99/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s20->id, 'name' => 'Premium Furniture Model 5', 'slug' => Str::slug('Premium Furniture 100'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 148, 'price_max' => 1627, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product100/600/600'
            ]);
            
        $u = User::create(['name' => 'Patna Lighting Depot Account', 'email' => 'supplier21@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570021']);
        $s21 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Patna Lighting Depot', 'slug' => Str::slug('Patna Lighting Depot-21'),
            'tagline' => 'Top dealer of Lighting in Darbhanga. We provide high-quality materials at wholesale rates.',
            'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.1, 'review_count' => 75,
            'cover_image' => 'https://picsum.photos/seed/supplier21/400/400',
            'phone' => '9876570021', 'email' => 'contact@supplier21.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s21->id, 'name' => 'Premium Lighting Model 1', 'slug' => Str::slug('Premium Lighting 101'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 568, 'price_max' => 4962, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product101/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s21->id, 'name' => 'Premium Lighting Model 2', 'slug' => Str::slug('Premium Lighting 102'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 239, 'price_max' => 4019, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product102/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s21->id, 'name' => 'Premium Lighting Model 3', 'slug' => Str::slug('Premium Lighting 103'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 815, 'price_max' => 3638, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product103/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s21->id, 'name' => 'Premium Lighting Model 4', 'slug' => Str::slug('Premium Lighting 104'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 139, 'price_max' => 4438, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product104/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s21->id, 'name' => 'Premium Lighting Model 5', 'slug' => Str::slug('Premium Lighting 105'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 989, 'price_max' => 2063, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product105/600/600'
            ]);
            
        $u = User::create(['name' => 'Magadh Lighting Traders Account', 'email' => 'supplier22@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570022']);
        $s22 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Magadh Lighting Traders', 'slug' => Str::slug('Magadh Lighting Traders-22'),
            'tagline' => 'Top dealer of Lighting in Bhagalpur. We provide high-quality materials at wholesale rates.',
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.9, 'review_count' => 50,
            'cover_image' => 'https://picsum.photos/seed/supplier22/400/400',
            'phone' => '9876570022', 'email' => 'contact@supplier22.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s22->id, 'name' => 'Premium Lighting Model 1', 'slug' => Str::slug('Premium Lighting 106'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 912, 'price_max' => 1487, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product106/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s22->id, 'name' => 'Premium Lighting Model 2', 'slug' => Str::slug('Premium Lighting 107'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 557, 'price_max' => 2839, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product107/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s22->id, 'name' => 'Premium Lighting Model 3', 'slug' => Str::slug('Premium Lighting 108'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 985, 'price_max' => 2993, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product108/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s22->id, 'name' => 'Premium Lighting Model 4', 'slug' => Str::slug('Premium Lighting 109'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 949, 'price_max' => 1076, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product109/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s22->id, 'name' => 'Premium Lighting Model 5', 'slug' => Str::slug('Premium Lighting 110'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 271, 'price_max' => 2695, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product110/600/600'
            ]);
            
        $u = User::create(['name' => 'Ganga Marble House Account', 'email' => 'supplier23@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570023']);
        $s23 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Ganga Marble House', 'slug' => Str::slug('Ganga Marble House-23'),
            'tagline' => 'Top dealer of Marble in Purnia. We provide high-quality materials at wholesale rates.',
            'city' => 'Purnia', 'district' => 'Purnia',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.5, 'review_count' => 145,
            'cover_image' => 'https://picsum.photos/seed/supplier23/400/400',
            'phone' => '9876570023', 'email' => 'contact@supplier23.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s23->id, 'name' => 'Premium Marble Model 1', 'slug' => Str::slug('Premium Marble 111'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 789, 'price_max' => 2526, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product111/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s23->id, 'name' => 'Premium Marble Model 2', 'slug' => Str::slug('Premium Marble 112'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 989, 'price_max' => 2125, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product112/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s23->id, 'name' => 'Premium Marble Model 3', 'slug' => Str::slug('Premium Marble 113'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 888, 'price_max' => 4037, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product113/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s23->id, 'name' => 'Premium Marble Model 4', 'slug' => Str::slug('Premium Marble 114'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 601, 'price_max' => 4805, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product114/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s23->id, 'name' => 'Premium Marble Model 5', 'slug' => Str::slug('Premium Marble 115'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 196, 'price_max' => 1373, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product115/600/600'
            ]);
            
        $u = User::create(['name' => 'Magadh Marble Traders Account', 'email' => 'supplier24@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570024']);
        $s24 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Magadh Marble Traders', 'slug' => Str::slug('Magadh Marble Traders-24'),
            'tagline' => 'Top dealer of Marble in Bhagalpur. We provide high-quality materials at wholesale rates.',
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.7, 'review_count' => 114,
            'cover_image' => 'https://picsum.photos/seed/supplier24/400/400',
            'phone' => '9876570024', 'email' => 'contact@supplier24.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s24->id, 'name' => 'Premium Marble Model 1', 'slug' => Str::slug('Premium Marble 116'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 190, 'price_max' => 4223, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product116/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s24->id, 'name' => 'Premium Marble Model 2', 'slug' => Str::slug('Premium Marble 117'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 360, 'price_max' => 2077, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product117/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s24->id, 'name' => 'Premium Marble Model 3', 'slug' => Str::slug('Premium Marble 118'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 813, 'price_max' => 1597, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product118/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s24->id, 'name' => 'Premium Marble Model 4', 'slug' => Str::slug('Premium Marble 119'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 943, 'price_max' => 2474, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product119/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s24->id, 'name' => 'Premium Marble Model 5', 'slug' => Str::slug('Premium Marble 120'),
                'description' => 'High quality Marble suitable for all modern constructions.',
                'category' => 'Marble', 'price_min' => 405, 'price_max' => 1393, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product120/600/600'
            ]);
            
        $u = User::create(['name' => 'Magadh Glass Traders Account', 'email' => 'supplier25@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570025']);
        $s25 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Magadh Glass Traders', 'slug' => Str::slug('Magadh Glass Traders-25'),
            'tagline' => 'Top dealer of Glass in Purnia. We provide high-quality materials at wholesale rates.',
            'city' => 'Purnia', 'district' => 'Purnia',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.9, 'review_count' => 22,
            'cover_image' => 'https://picsum.photos/seed/supplier25/400/400',
            'phone' => '9876570025', 'email' => 'contact@supplier25.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s25->id, 'name' => 'Premium Glass Model 1', 'slug' => Str::slug('Premium Glass 121'),
                'description' => 'High quality Glass suitable for all modern constructions.',
                'category' => 'Glass', 'price_min' => 810, 'price_max' => 2352, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product121/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s25->id, 'name' => 'Premium Glass Model 2', 'slug' => Str::slug('Premium Glass 122'),
                'description' => 'High quality Glass suitable for all modern constructions.',
                'category' => 'Glass', 'price_min' => 251, 'price_max' => 3005, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product122/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s25->id, 'name' => 'Premium Glass Model 3', 'slug' => Str::slug('Premium Glass 123'),
                'description' => 'High quality Glass suitable for all modern constructions.',
                'category' => 'Glass', 'price_min' => 882, 'price_max' => 1229, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product123/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s25->id, 'name' => 'Premium Glass Model 4', 'slug' => Str::slug('Premium Glass 124'),
                'description' => 'High quality Glass suitable for all modern constructions.',
                'category' => 'Glass', 'price_min' => 309, 'price_max' => 2747, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product124/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s25->id, 'name' => 'Premium Glass Model 5', 'slug' => Str::slug('Premium Glass 125'),
                'description' => 'High quality Glass suitable for all modern constructions.',
                'category' => 'Glass', 'price_min' => 846, 'price_max' => 2259, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product125/600/600'
            ]);
            
        $u = User::create(['name' => 'Magadh Sanitary Traders Account', 'email' => 'supplier26@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570026']);
        $s26 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Magadh Sanitary Traders', 'slug' => Str::slug('Magadh Sanitary Traders-26'),
            'tagline' => 'Top dealer of Sanitary in Darbhanga. We provide high-quality materials at wholesale rates.',
            'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.7, 'review_count' => 22,
            'cover_image' => 'https://picsum.photos/seed/supplier26/400/400',
            'phone' => '9876570026', 'email' => 'contact@supplier26.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s26->id, 'name' => 'Premium Sanitary Model 1', 'slug' => Str::slug('Premium Sanitary 126'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 617, 'price_max' => 1798, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product126/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s26->id, 'name' => 'Premium Sanitary Model 2', 'slug' => Str::slug('Premium Sanitary 127'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 241, 'price_max' => 1836, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product127/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s26->id, 'name' => 'Premium Sanitary Model 3', 'slug' => Str::slug('Premium Sanitary 128'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 647, 'price_max' => 4203, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product128/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s26->id, 'name' => 'Premium Sanitary Model 4', 'slug' => Str::slug('Premium Sanitary 129'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 427, 'price_max' => 4234, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product129/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s26->id, 'name' => 'Premium Sanitary Model 5', 'slug' => Str::slug('Premium Sanitary 130'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 358, 'price_max' => 3577, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product130/600/600'
            ]);
            
        $u = User::create(['name' => 'Bihar Plywood World Account', 'email' => 'supplier27@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570027']);
        $s27 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Bihar Plywood World', 'slug' => Str::slug('Bihar Plywood World-27'),
            'tagline' => 'Top dealer of Plywood in Bhagalpur. We provide high-quality materials at wholesale rates.',
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.3, 'review_count' => 39,
            'cover_image' => 'https://picsum.photos/seed/supplier27/400/400',
            'phone' => '9876570027', 'email' => 'contact@supplier27.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s27->id, 'name' => 'Premium Plywood Model 1', 'slug' => Str::slug('Premium Plywood 131'),
                'description' => 'High quality Plywood suitable for all modern constructions.',
                'category' => 'Plywood', 'price_min' => 259, 'price_max' => 4865, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product131/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s27->id, 'name' => 'Premium Plywood Model 2', 'slug' => Str::slug('Premium Plywood 132'),
                'description' => 'High quality Plywood suitable for all modern constructions.',
                'category' => 'Plywood', 'price_min' => 478, 'price_max' => 1095, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product132/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s27->id, 'name' => 'Premium Plywood Model 3', 'slug' => Str::slug('Premium Plywood 133'),
                'description' => 'High quality Plywood suitable for all modern constructions.',
                'category' => 'Plywood', 'price_min' => 967, 'price_max' => 2115, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product133/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s27->id, 'name' => 'Premium Plywood Model 4', 'slug' => Str::slug('Premium Plywood 134'),
                'description' => 'High quality Plywood suitable for all modern constructions.',
                'category' => 'Plywood', 'price_min' => 416, 'price_max' => 4044, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product134/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s27->id, 'name' => 'Premium Plywood Model 5', 'slug' => Str::slug('Premium Plywood 135'),
                'description' => 'High quality Plywood suitable for all modern constructions.',
                'category' => 'Plywood', 'price_min' => 496, 'price_max' => 3463, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product135/600/600'
            ]);
            
        $u = User::create(['name' => 'Magadh Aluminium Traders Account', 'email' => 'supplier28@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570028']);
        $s28 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Magadh Aluminium Traders', 'slug' => Str::slug('Magadh Aluminium Traders-28'),
            'tagline' => 'Top dealer of Aluminium in Muzaffarpur. We provide high-quality materials at wholesale rates.',
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.7, 'review_count' => 49,
            'cover_image' => 'https://picsum.photos/seed/supplier28/400/400',
            'phone' => '9876570028', 'email' => 'contact@supplier28.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s28->id, 'name' => 'Premium Aluminium Model 1', 'slug' => Str::slug('Premium Aluminium 136'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 918, 'price_max' => 2851, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product136/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s28->id, 'name' => 'Premium Aluminium Model 2', 'slug' => Str::slug('Premium Aluminium 137'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 766, 'price_max' => 4106, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product137/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s28->id, 'name' => 'Premium Aluminium Model 3', 'slug' => Str::slug('Premium Aluminium 138'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 460, 'price_max' => 4630, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product138/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s28->id, 'name' => 'Premium Aluminium Model 4', 'slug' => Str::slug('Premium Aluminium 139'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 281, 'price_max' => 3679, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product139/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s28->id, 'name' => 'Premium Aluminium Model 5', 'slug' => Str::slug('Premium Aluminium 140'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 507, 'price_max' => 3503, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product140/600/600'
            ]);
            
        $u = User::create(['name' => 'Magadh Furniture Traders Account', 'email' => 'supplier29@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570029']);
        $s29 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Magadh Furniture Traders', 'slug' => Str::slug('Magadh Furniture Traders-29'),
            'tagline' => 'Top dealer of Furniture in Darbhanga. We provide high-quality materials at wholesale rates.',
            'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.9, 'review_count' => 45,
            'cover_image' => 'https://picsum.photos/seed/supplier29/400/400',
            'phone' => '9876570029', 'email' => 'contact@supplier29.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s29->id, 'name' => 'Premium Furniture Model 1', 'slug' => Str::slug('Premium Furniture 141'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 566, 'price_max' => 1576, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product141/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s29->id, 'name' => 'Premium Furniture Model 2', 'slug' => Str::slug('Premium Furniture 142'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 991, 'price_max' => 2894, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product142/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s29->id, 'name' => 'Premium Furniture Model 3', 'slug' => Str::slug('Premium Furniture 143'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 452, 'price_max' => 4909, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product143/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s29->id, 'name' => 'Premium Furniture Model 4', 'slug' => Str::slug('Premium Furniture 144'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 149, 'price_max' => 2466, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product144/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s29->id, 'name' => 'Premium Furniture Model 5', 'slug' => Str::slug('Premium Furniture 145'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 673, 'price_max' => 2467, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product145/600/600'
            ]);
            
        $u = User::create(['name' => 'Patna Aluminium Depot Account', 'email' => 'supplier30@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570030']);
        $s30 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Patna Aluminium Depot', 'slug' => Str::slug('Patna Aluminium Depot-30'),
            'tagline' => 'Top dealer of Aluminium in Gaya. We provide high-quality materials at wholesale rates.',
            'city' => 'Gaya', 'district' => 'Gaya',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.8, 'review_count' => 35,
            'cover_image' => 'https://picsum.photos/seed/supplier30/400/400',
            'phone' => '9876570030', 'email' => 'contact@supplier30.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s30->id, 'name' => 'Premium Aluminium Model 1', 'slug' => Str::slug('Premium Aluminium 146'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 202, 'price_max' => 4425, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product146/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s30->id, 'name' => 'Premium Aluminium Model 2', 'slug' => Str::slug('Premium Aluminium 147'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 229, 'price_max' => 1584, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product147/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s30->id, 'name' => 'Premium Aluminium Model 3', 'slug' => Str::slug('Premium Aluminium 148'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 672, 'price_max' => 2096, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product148/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s30->id, 'name' => 'Premium Aluminium Model 4', 'slug' => Str::slug('Premium Aluminium 149'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 503, 'price_max' => 2601, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product149/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s30->id, 'name' => 'Premium Aluminium Model 5', 'slug' => Str::slug('Premium Aluminium 150'),
                'description' => 'High quality Aluminium suitable for all modern constructions.',
                'category' => 'Aluminium', 'price_min' => 240, 'price_max' => 4838, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product150/600/600'
            ]);
            
        $u = User::create(['name' => 'Ganga Hardware House Account', 'email' => 'supplier31@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570031']);
        $s31 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Ganga Hardware House', 'slug' => Str::slug('Ganga Hardware House-31'),
            'tagline' => 'Top dealer of Hardware in Bhagalpur. We provide high-quality materials at wholesale rates.',
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.2, 'review_count' => 32,
            'cover_image' => 'https://picsum.photos/seed/supplier31/400/400',
            'phone' => '9876570031', 'email' => 'contact@supplier31.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s31->id, 'name' => 'Premium Hardware Model 1', 'slug' => Str::slug('Premium Hardware 151'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 986, 'price_max' => 4877, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product151/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s31->id, 'name' => 'Premium Hardware Model 2', 'slug' => Str::slug('Premium Hardware 152'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 296, 'price_max' => 4515, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product152/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s31->id, 'name' => 'Premium Hardware Model 3', 'slug' => Str::slug('Premium Hardware 153'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 291, 'price_max' => 3904, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product153/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s31->id, 'name' => 'Premium Hardware Model 4', 'slug' => Str::slug('Premium Hardware 154'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 622, 'price_max' => 3215, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product154/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s31->id, 'name' => 'Premium Hardware Model 5', 'slug' => Str::slug('Premium Hardware 155'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 446, 'price_max' => 2271, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product155/600/600'
            ]);
            
        $u = User::create(['name' => 'Patna Lighting Depot Account', 'email' => 'supplier32@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570032']);
        $s32 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Patna Lighting Depot', 'slug' => Str::slug('Patna Lighting Depot-32'),
            'tagline' => 'Top dealer of Lighting in Darbhanga. We provide high-quality materials at wholesale rates.',
            'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.6, 'review_count' => 35,
            'cover_image' => 'https://picsum.photos/seed/supplier32/400/400',
            'phone' => '9876570032', 'email' => 'contact@supplier32.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s32->id, 'name' => 'Premium Lighting Model 1', 'slug' => Str::slug('Premium Lighting 156'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 110, 'price_max' => 1171, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product156/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s32->id, 'name' => 'Premium Lighting Model 2', 'slug' => Str::slug('Premium Lighting 157'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 618, 'price_max' => 1276, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product157/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s32->id, 'name' => 'Premium Lighting Model 3', 'slug' => Str::slug('Premium Lighting 158'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 399, 'price_max' => 2248, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product158/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s32->id, 'name' => 'Premium Lighting Model 4', 'slug' => Str::slug('Premium Lighting 159'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 958, 'price_max' => 2405, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product159/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s32->id, 'name' => 'Premium Lighting Model 5', 'slug' => Str::slug('Premium Lighting 160'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 180, 'price_max' => 1769, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product160/600/600'
            ]);
            
        $u = User::create(['name' => 'Hardware Emporium Account', 'email' => 'supplier33@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570033']);
        $s33 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Hardware Emporium', 'slug' => Str::slug('Hardware Emporium-33'),
            'tagline' => 'Top dealer of Hardware in Purnia. We provide high-quality materials at wholesale rates.',
            'city' => 'Purnia', 'district' => 'Purnia',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.4, 'review_count' => 127,
            'cover_image' => 'https://picsum.photos/seed/supplier33/400/400',
            'phone' => '9876570033', 'email' => 'contact@supplier33.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s33->id, 'name' => 'Premium Hardware Model 1', 'slug' => Str::slug('Premium Hardware 161'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 300, 'price_max' => 3428, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product161/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s33->id, 'name' => 'Premium Hardware Model 2', 'slug' => Str::slug('Premium Hardware 162'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 662, 'price_max' => 1803, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product162/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s33->id, 'name' => 'Premium Hardware Model 3', 'slug' => Str::slug('Premium Hardware 163'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 458, 'price_max' => 2747, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product163/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s33->id, 'name' => 'Premium Hardware Model 4', 'slug' => Str::slug('Premium Hardware 164'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 520, 'price_max' => 2046, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product164/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s33->id, 'name' => 'Premium Hardware Model 5', 'slug' => Str::slug('Premium Hardware 165'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 337, 'price_max' => 3943, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product165/600/600'
            ]);
            
        $u = User::create(['name' => 'Bihar Hardware World Account', 'email' => 'supplier34@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570034']);
        $s34 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Bihar Hardware World', 'slug' => Str::slug('Bihar Hardware World-34'),
            'tagline' => 'Top dealer of Hardware in Gaya. We provide high-quality materials at wholesale rates.',
            'city' => 'Gaya', 'district' => 'Gaya',
            'status' => 'active', 'is_verified' => true, 'is_featured' => true,
            'avg_rating' => 4.2, 'review_count' => 135,
            'cover_image' => 'https://picsum.photos/seed/supplier34/400/400',
            'phone' => '9876570034', 'email' => 'contact@supplier34.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s34->id, 'name' => 'Premium Hardware Model 1', 'slug' => Str::slug('Premium Hardware 166'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 273, 'price_max' => 3874, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product166/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s34->id, 'name' => 'Premium Hardware Model 2', 'slug' => Str::slug('Premium Hardware 167'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 779, 'price_max' => 1914, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product167/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s34->id, 'name' => 'Premium Hardware Model 3', 'slug' => Str::slug('Premium Hardware 168'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 270, 'price_max' => 4288, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product168/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s34->id, 'name' => 'Premium Hardware Model 4', 'slug' => Str::slug('Premium Hardware 169'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 265, 'price_max' => 2486, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product169/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s34->id, 'name' => 'Premium Hardware Model 5', 'slug' => Str::slug('Premium Hardware 170'),
                'description' => 'High quality Hardware suitable for all modern constructions.',
                'category' => 'Hardware', 'price_min' => 877, 'price_max' => 2637, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product170/600/600'
            ]);
            
        $u = User::create(['name' => 'Bihar Lighting World Account', 'email' => 'supplier35@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570035']);
        $s35 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Bihar Lighting World', 'slug' => Str::slug('Bihar Lighting World-35'),
            'tagline' => 'Top dealer of Lighting in Purnia. We provide high-quality materials at wholesale rates.',
            'city' => 'Purnia', 'district' => 'Purnia',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.9, 'review_count' => 71,
            'cover_image' => 'https://picsum.photos/seed/supplier35/400/400',
            'phone' => '9876570035', 'email' => 'contact@supplier35.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s35->id, 'name' => 'Premium Lighting Model 1', 'slug' => Str::slug('Premium Lighting 171'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 272, 'price_max' => 3460, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product171/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s35->id, 'name' => 'Premium Lighting Model 2', 'slug' => Str::slug('Premium Lighting 172'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 737, 'price_max' => 4123, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product172/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s35->id, 'name' => 'Premium Lighting Model 3', 'slug' => Str::slug('Premium Lighting 173'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 787, 'price_max' => 1045, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product173/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s35->id, 'name' => 'Premium Lighting Model 4', 'slug' => Str::slug('Premium Lighting 174'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 161, 'price_max' => 1772, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product174/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s35->id, 'name' => 'Premium Lighting Model 5', 'slug' => Str::slug('Premium Lighting 175'),
                'description' => 'High quality Lighting suitable for all modern constructions.',
                'category' => 'Lighting', 'price_min' => 766, 'price_max' => 2943, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product175/600/600'
            ]);
            
        $u = User::create(['name' => 'Bihar Sanitary World Account', 'email' => 'supplier36@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570036']);
        $s36 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Bihar Sanitary World', 'slug' => Str::slug('Bihar Sanitary World-36'),
            'tagline' => 'Top dealer of Sanitary in Muzaffarpur. We provide high-quality materials at wholesale rates.',
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.5, 'review_count' => 20,
            'cover_image' => 'https://picsum.photos/seed/supplier36/400/400',
            'phone' => '9876570036', 'email' => 'contact@supplier36.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s36->id, 'name' => 'Premium Sanitary Model 1', 'slug' => Str::slug('Premium Sanitary 176'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 446, 'price_max' => 2255, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product176/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s36->id, 'name' => 'Premium Sanitary Model 2', 'slug' => Str::slug('Premium Sanitary 177'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 225, 'price_max' => 4730, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product177/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s36->id, 'name' => 'Premium Sanitary Model 3', 'slug' => Str::slug('Premium Sanitary 178'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 126, 'price_max' => 1504, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product178/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s36->id, 'name' => 'Premium Sanitary Model 4', 'slug' => Str::slug('Premium Sanitary 179'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 759, 'price_max' => 4141, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product179/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s36->id, 'name' => 'Premium Sanitary Model 5', 'slug' => Str::slug('Premium Sanitary 180'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 808, 'price_max' => 1203, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product180/600/600'
            ]);
            
        $u = User::create(['name' => 'Patna Furniture Depot Account', 'email' => 'supplier37@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570037']);
        $s37 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Patna Furniture Depot', 'slug' => Str::slug('Patna Furniture Depot-37'),
            'tagline' => 'Top dealer of Furniture in Muzaffarpur. We provide high-quality materials at wholesale rates.',
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.9, 'review_count' => 131,
            'cover_image' => 'https://picsum.photos/seed/supplier37/400/400',
            'phone' => '9876570037', 'email' => 'contact@supplier37.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s37->id, 'name' => 'Premium Furniture Model 1', 'slug' => Str::slug('Premium Furniture 181'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 695, 'price_max' => 3125, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product181/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s37->id, 'name' => 'Premium Furniture Model 2', 'slug' => Str::slug('Premium Furniture 182'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 687, 'price_max' => 4800, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product182/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s37->id, 'name' => 'Premium Furniture Model 3', 'slug' => Str::slug('Premium Furniture 183'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 882, 'price_max' => 2529, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product183/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s37->id, 'name' => 'Premium Furniture Model 4', 'slug' => Str::slug('Premium Furniture 184'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 112, 'price_max' => 3836, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product184/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s37->id, 'name' => 'Premium Furniture Model 5', 'slug' => Str::slug('Premium Furniture 185'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 473, 'price_max' => 3582, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product185/600/600'
            ]);
            
        $u = User::create(['name' => 'Ganga Sanitary House Account', 'email' => 'supplier38@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570038']);
        $s38 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Ganga Sanitary House', 'slug' => Str::slug('Ganga Sanitary House-38'),
            'tagline' => 'Top dealer of Sanitary in Patna. We provide high-quality materials at wholesale rates.',
            'city' => 'Patna', 'district' => 'Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.3, 'review_count' => 59,
            'cover_image' => 'https://picsum.photos/seed/supplier38/400/400',
            'phone' => '9876570038', 'email' => 'contact@supplier38.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s38->id, 'name' => 'Premium Sanitary Model 1', 'slug' => Str::slug('Premium Sanitary 186'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 592, 'price_max' => 2126, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product186/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s38->id, 'name' => 'Premium Sanitary Model 2', 'slug' => Str::slug('Premium Sanitary 187'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 419, 'price_max' => 3176, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product187/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s38->id, 'name' => 'Premium Sanitary Model 3', 'slug' => Str::slug('Premium Sanitary 188'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 393, 'price_max' => 1613, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product188/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s38->id, 'name' => 'Premium Sanitary Model 4', 'slug' => Str::slug('Premium Sanitary 189'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 802, 'price_max' => 2258, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product189/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s38->id, 'name' => 'Premium Sanitary Model 5', 'slug' => Str::slug('Premium Sanitary 190'),
                'description' => 'High quality Sanitary suitable for all modern constructions.',
                'category' => 'Sanitary', 'price_min' => 717, 'price_max' => 1081, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product190/600/600'
            ]);
            
        $u = User::create(['name' => 'Patna Granite Depot Account', 'email' => 'supplier39@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570039']);
        $s39 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Patna Granite Depot', 'slug' => Str::slug('Patna Granite Depot-39'),
            'tagline' => 'Top dealer of Granite in Bhagalpur. We provide high-quality materials at wholesale rates.',
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.2, 'review_count' => 137,
            'cover_image' => 'https://picsum.photos/seed/supplier39/400/400',
            'phone' => '9876570039', 'email' => 'contact@supplier39.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s39->id, 'name' => 'Premium Granite Model 1', 'slug' => Str::slug('Premium Granite 191'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 758, 'price_max' => 2059, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product191/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s39->id, 'name' => 'Premium Granite Model 2', 'slug' => Str::slug('Premium Granite 192'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 321, 'price_max' => 3405, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product192/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s39->id, 'name' => 'Premium Granite Model 3', 'slug' => Str::slug('Premium Granite 193'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 810, 'price_max' => 2393, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product193/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s39->id, 'name' => 'Premium Granite Model 4', 'slug' => Str::slug('Premium Granite 194'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 152, 'price_max' => 2280, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product194/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s39->id, 'name' => 'Premium Granite Model 5', 'slug' => Str::slug('Premium Granite 195'),
                'description' => 'High quality Granite suitable for all modern constructions.',
                'category' => 'Granite', 'price_min' => 236, 'price_max' => 2766, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product195/600/600'
            ]);
            
        $u = User::create(['name' => 'Furniture Emporium Account', 'email' => 'supplier40@example.com', 'password' => Hash::make('password'), 'role' => 'supplier', 'is_active' => true, 'phone' => '9876570040']);
        $s40 = Supplier::create([
            'user_id' => $u->id, 'company_name' => 'Furniture Emporium', 'slug' => Str::slug('Furniture Emporium-40'),
            'tagline' => 'Top dealer of Furniture in Patna. We provide high-quality materials at wholesale rates.',
            'city' => 'Patna', 'district' => 'Patna',
            'status' => 'active', 'is_verified' => true, 'is_featured' => false,
            'avg_rating' => 4.5, 'review_count' => 150,
            'cover_image' => 'https://picsum.photos/seed/supplier40/400/400',
            'phone' => '9876570040', 'email' => 'contact@supplier40.com'
        ]);
        
            SupplierProduct::create([
                'supplier_id' => $s40->id, 'name' => 'Premium Furniture Model 1', 'slug' => Str::slug('Premium Furniture 196'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 643, 'price_max' => 3107, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product196/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s40->id, 'name' => 'Premium Furniture Model 2', 'slug' => Str::slug('Premium Furniture 197'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 887, 'price_max' => 2893, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product197/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s40->id, 'name' => 'Premium Furniture Model 3', 'slug' => Str::slug('Premium Furniture 198'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 858, 'price_max' => 1453, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product198/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s40->id, 'name' => 'Premium Furniture Model 4', 'slug' => Str::slug('Premium Furniture 199'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 854, 'price_max' => 4046, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product199/600/600'
            ]);
            
            SupplierProduct::create([
                'supplier_id' => $s40->id, 'name' => 'Premium Furniture Model 5', 'slug' => Str::slug('Premium Furniture 200'),
                'description' => 'High quality Furniture suitable for all modern constructions.',
                'category' => 'Furniture', 'price_min' => 302, 'price_max' => 4281, 'unit' => 'piece',
                'is_active' => true,
                'cover_image' => 'https://picsum.photos/seed/product200/600/600'
            ]);
              }
}
