<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Requirement;
use Illuminate\Support\Facades\Hash;
class RequirementSeeder extends Seeder {
  public function run(): void {
  Requirement::unguard();

        Requirement::create([
            'user_id' => 1, 'category_id' => 1,
            'title' => 'Office Interior in Darbhanga', 'description' => 'Looking for experienced professionals for office interior at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 1100000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'open',
            'name' => 'Customer 1', 'phone' => '9900000001'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 10,
            'title' => 'Bathroom Remodeling in Darbhanga', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 1100000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'in_progress',
            'name' => 'Customer 2', 'phone' => '9900000002'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 5,
            'title' => 'Villa Renovation in Muzaffarpur', 'description' => 'Looking for experienced professionals for villa renovation at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 800000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'open',
            'name' => 'Customer 3', 'phone' => '9900000003'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 10,
            'title' => '3BHK Interior Design in Purnia', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Purnia. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 600000,
            'city' => 'Purnia', 'district' => 'Purnia', 'status' => 'open',
            'name' => 'Customer 4', 'phone' => '9900000004'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 6,
            'title' => 'Modular Kitchen in Bhagalpur', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 800000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'closed',
            'name' => 'Customer 5', 'phone' => '9900000005'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 6,
            'title' => 'Villa Renovation in Bhagalpur', 'description' => 'Looking for experienced professionals for villa renovation at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 900000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'closed',
            'name' => 'Customer 6', 'phone' => '9900000006'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 10,
            'title' => 'Villa Renovation in Gaya', 'description' => 'Looking for experienced professionals for villa renovation at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 800000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'open',
            'name' => 'Customer 7', 'phone' => '9900000007'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 4,
            'title' => 'Modular Kitchen in Purnia', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Purnia. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 900000,
            'city' => 'Purnia', 'district' => 'Purnia', 'status' => 'in_progress',
            'name' => 'Customer 8', 'phone' => '9900000008'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 8,
            'title' => 'Modular Kitchen in Muzaffarpur', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 800000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'open',
            'name' => 'Customer 9', 'phone' => '9900000009'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 8,
            'title' => 'False Ceiling Work in Purnia', 'description' => 'Looking for experienced professionals for false ceiling work at my property in Purnia. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 1100000,
            'city' => 'Purnia', 'district' => 'Purnia', 'status' => 'open',
            'name' => 'Customer 10', 'phone' => '9900000010'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 10,
            'title' => 'Modular Kitchen in Darbhanga', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 1400000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'open',
            'name' => 'Customer 11', 'phone' => '9900000011'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 6,
            'title' => '3BHK Interior Design in Purnia', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Purnia. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 1200000,
            'city' => 'Purnia', 'district' => 'Purnia', 'status' => 'closed',
            'name' => 'Customer 12', 'phone' => '9900000012'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 2,
            'title' => 'Hotel Renovation in Darbhanga', 'description' => 'Looking for experienced professionals for hotel renovation at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 1300000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'in_progress',
            'name' => 'Customer 13', 'phone' => '9900000013'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 8,
            'title' => 'Hotel Renovation in Muzaffarpur', 'description' => 'Looking for experienced professionals for hotel renovation at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 1500000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'open',
            'name' => 'Customer 14', 'phone' => '9900000014'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 10,
            'title' => 'Hotel Renovation in Patna', 'description' => 'Looking for experienced professionals for hotel renovation at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 600000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'closed',
            'name' => 'Customer 15', 'phone' => '9900000015'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 9,
            'title' => 'Modular Kitchen in Darbhanga', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 900000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'closed',
            'name' => 'Customer 16', 'phone' => '9900000016'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 1,
            'title' => 'Office Interior in Darbhanga', 'description' => 'Looking for experienced professionals for office interior at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 1300000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'closed',
            'name' => 'Customer 17', 'phone' => '9900000017'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 3,
            'title' => '3BHK Interior Design in Darbhanga', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 900000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'closed',
            'name' => 'Customer 18', 'phone' => '9900000018'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 1,
            'title' => 'Villa Renovation in Gaya', 'description' => 'Looking for experienced professionals for villa renovation at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 1100000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'open',
            'name' => 'Customer 19', 'phone' => '9900000019'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 7,
            'title' => 'Villa Renovation in Muzaffarpur', 'description' => 'Looking for experienced professionals for villa renovation at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 1500000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'closed',
            'name' => 'Customer 20', 'phone' => '9900000020'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 3,
            'title' => 'Office Interior in Gaya', 'description' => 'Looking for experienced professionals for office interior at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 800000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'open',
            'name' => 'Customer 21', 'phone' => '9900000021'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 6,
            'title' => 'Bathroom Remodeling in Gaya', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 800000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'in_progress',
            'name' => 'Customer 22', 'phone' => '9900000022'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 7,
            'title' => 'Bathroom Remodeling in Muzaffarpur', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 1100000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'open',
            'name' => 'Customer 23', 'phone' => '9900000023'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 6,
            'title' => 'Office Interior in Bhagalpur', 'description' => 'Looking for experienced professionals for office interior at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 1100000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'open',
            'name' => 'Customer 24', 'phone' => '9900000024'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 6,
            'title' => 'Modular Kitchen in Gaya', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 600000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'open',
            'name' => 'Customer 25', 'phone' => '9900000025'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 2,
            'title' => 'Modular Kitchen in Patna', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 600000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'open',
            'name' => 'Customer 26', 'phone' => '9900000026'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 4,
            'title' => 'Modular Kitchen in Patna', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 1300000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'closed',
            'name' => 'Customer 27', 'phone' => '9900000027'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 9,
            'title' => 'Modular Kitchen in Patna', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 1100000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'in_progress',
            'name' => 'Customer 28', 'phone' => '9900000028'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 8,
            'title' => '3BHK Interior Design in Muzaffarpur', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 800000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'closed',
            'name' => 'Customer 29', 'phone' => '9900000029'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 8,
            'title' => 'Modular Kitchen in Patna', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 1100000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'open',
            'name' => 'Customer 30', 'phone' => '9900000030'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 9,
            'title' => 'Modular Kitchen in Bhagalpur', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 600000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'open',
            'name' => 'Customer 31', 'phone' => '9900000031'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 3,
            'title' => 'Villa Renovation in Gaya', 'description' => 'Looking for experienced professionals for villa renovation at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 1000000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'closed',
            'name' => 'Customer 32', 'phone' => '9900000032'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 10,
            'title' => 'Office Interior in Gaya', 'description' => 'Looking for experienced professionals for office interior at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 600000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'open',
            'name' => 'Customer 33', 'phone' => '9900000033'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 6,
            'title' => 'False Ceiling Work in Darbhanga', 'description' => 'Looking for experienced professionals for false ceiling work at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 800000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'open',
            'name' => 'Customer 34', 'phone' => '9900000034'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 10,
            'title' => '3BHK Interior Design in Muzaffarpur', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 1200000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'closed',
            'name' => 'Customer 35', 'phone' => '9900000035'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 10,
            'title' => 'Bathroom Remodeling in Purnia', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Purnia. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 1500000,
            'city' => 'Purnia', 'district' => 'Purnia', 'status' => 'open',
            'name' => 'Customer 36', 'phone' => '9900000036'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 6,
            'title' => 'Office Interior in Patna', 'description' => 'Looking for experienced professionals for office interior at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 1400000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'open',
            'name' => 'Customer 37', 'phone' => '9900000037'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 5,
            'title' => '3BHK Interior Design in Darbhanga', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 1400000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'in_progress',
            'name' => 'Customer 38', 'phone' => '9900000038'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 10,
            'title' => 'Office Interior in Purnia', 'description' => 'Looking for experienced professionals for office interior at my property in Purnia. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 600000,
            'city' => 'Purnia', 'district' => 'Purnia', 'status' => 'closed',
            'name' => 'Customer 39', 'phone' => '9900000039'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 10,
            'title' => '3BHK Interior Design in Patna', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 1000000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'in_progress',
            'name' => 'Customer 40', 'phone' => '9900000040'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 2,
            'title' => 'Office Interior in Bhagalpur', 'description' => 'Looking for experienced professionals for office interior at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 800000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'open',
            'name' => 'Customer 41', 'phone' => '9900000041'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 2,
            'title' => 'Villa Renovation in Darbhanga', 'description' => 'Looking for experienced professionals for villa renovation at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 1400000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'in_progress',
            'name' => 'Customer 42', 'phone' => '9900000042'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 2,
            'title' => 'Hotel Renovation in Gaya', 'description' => 'Looking for experienced professionals for hotel renovation at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 1100000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'open',
            'name' => 'Customer 43', 'phone' => '9900000043'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 7,
            'title' => 'Office Interior in Bhagalpur', 'description' => 'Looking for experienced professionals for office interior at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 700000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'closed',
            'name' => 'Customer 44', 'phone' => '9900000044'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 7,
            'title' => 'Villa Renovation in Darbhanga', 'description' => 'Looking for experienced professionals for villa renovation at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 700000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'open',
            'name' => 'Customer 45', 'phone' => '9900000045'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 9,
            'title' => '3BHK Interior Design in Bhagalpur', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 1200000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'in_progress',
            'name' => 'Customer 46', 'phone' => '9900000046'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 10,
            'title' => 'Bathroom Remodeling in Purnia', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Purnia. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 1400000,
            'city' => 'Purnia', 'district' => 'Purnia', 'status' => 'closed',
            'name' => 'Customer 47', 'phone' => '9900000047'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 4,
            'title' => 'Bathroom Remodeling in Bhagalpur', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 1300000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'closed',
            'name' => 'Customer 48', 'phone' => '9900000048'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 4,
            'title' => 'Villa Renovation in Patna', 'description' => 'Looking for experienced professionals for villa renovation at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 900000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'open',
            'name' => 'Customer 49', 'phone' => '9900000049'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 6,
            'title' => 'Villa Renovation in Patna', 'description' => 'Looking for experienced professionals for villa renovation at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 800000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'closed',
            'name' => 'Customer 50', 'phone' => '9900000050'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 9,
            'title' => 'Hotel Renovation in Gaya', 'description' => 'Looking for experienced professionals for hotel renovation at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 900000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'closed',
            'name' => 'Customer 51', 'phone' => '9900000051'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 1,
            'title' => 'Hotel Renovation in Gaya', 'description' => 'Looking for experienced professionals for hotel renovation at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 900000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'closed',
            'name' => 'Customer 52', 'phone' => '9900000052'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 3,
            'title' => '3BHK Interior Design in Patna', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 1500000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'open',
            'name' => 'Customer 53', 'phone' => '9900000053'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 7,
            'title' => 'Bathroom Remodeling in Darbhanga', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 1200000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'closed',
            'name' => 'Customer 54', 'phone' => '9900000054'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 8,
            'title' => 'Modular Kitchen in Gaya', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 700000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'open',
            'name' => 'Customer 55', 'phone' => '9900000055'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 3,
            'title' => 'False Ceiling Work in Gaya', 'description' => 'Looking for experienced professionals for false ceiling work at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 1100000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'open',
            'name' => 'Customer 56', 'phone' => '9900000056'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 3,
            'title' => 'Hotel Renovation in Bhagalpur', 'description' => 'Looking for experienced professionals for hotel renovation at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 1400000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'open',
            'name' => 'Customer 57', 'phone' => '9900000057'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 5,
            'title' => 'Office Interior in Bhagalpur', 'description' => 'Looking for experienced professionals for office interior at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 1300000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'open',
            'name' => 'Customer 58', 'phone' => '9900000058'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 9,
            'title' => 'Bathroom Remodeling in Muzaffarpur', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 1500000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'open',
            'name' => 'Customer 59', 'phone' => '9900000059'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 9,
            'title' => 'Office Interior in Patna', 'description' => 'Looking for experienced professionals for office interior at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 1100000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'in_progress',
            'name' => 'Customer 60', 'phone' => '9900000060'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 7,
            'title' => '3BHK Interior Design in Muzaffarpur', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 600000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'open',
            'name' => 'Customer 61', 'phone' => '9900000061'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 4,
            'title' => 'Modular Kitchen in Patna', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 1000000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'open',
            'name' => 'Customer 62', 'phone' => '9900000062'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 1,
            'title' => 'Modular Kitchen in Muzaffarpur', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 600000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'open',
            'name' => 'Customer 63', 'phone' => '9900000063'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 5,
            'title' => 'False Ceiling Work in Gaya', 'description' => 'Looking for experienced professionals for false ceiling work at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 1200000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'open',
            'name' => 'Customer 64', 'phone' => '9900000064'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 6,
            'title' => 'False Ceiling Work in Patna', 'description' => 'Looking for experienced professionals for false ceiling work at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 900000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'closed',
            'name' => 'Customer 65', 'phone' => '9900000065'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 3,
            'title' => '3BHK Interior Design in Darbhanga', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 1300000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'open',
            'name' => 'Customer 66', 'phone' => '9900000066'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 5,
            'title' => 'Bathroom Remodeling in Purnia', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Purnia. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 1100000,
            'city' => 'Purnia', 'district' => 'Purnia', 'status' => 'open',
            'name' => 'Customer 67', 'phone' => '9900000067'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 8,
            'title' => '3BHK Interior Design in Darbhanga', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 1400000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'open',
            'name' => 'Customer 68', 'phone' => '9900000068'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 1,
            'title' => 'Hotel Renovation in Patna', 'description' => 'Looking for experienced professionals for hotel renovation at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 600000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'in_progress',
            'name' => 'Customer 69', 'phone' => '9900000069'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 6,
            'title' => 'Office Interior in Gaya', 'description' => 'Looking for experienced professionals for office interior at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 1300000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'in_progress',
            'name' => 'Customer 70', 'phone' => '9900000070'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 4,
            'title' => 'Bathroom Remodeling in Gaya', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 1200000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'open',
            'name' => 'Customer 71', 'phone' => '9900000071'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 6,
            'title' => 'Bathroom Remodeling in Darbhanga', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 1200000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'open',
            'name' => 'Customer 72', 'phone' => '9900000072'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 2,
            'title' => 'Hotel Renovation in Patna', 'description' => 'Looking for experienced professionals for hotel renovation at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 1400000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'open',
            'name' => 'Customer 73', 'phone' => '9900000073'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 8,
            'title' => '3BHK Interior Design in Bhagalpur', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 600000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'open',
            'name' => 'Customer 74', 'phone' => '9900000074'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 8,
            'title' => 'Villa Renovation in Gaya', 'description' => 'Looking for experienced professionals for villa renovation at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 1100000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'open',
            'name' => 'Customer 75', 'phone' => '9900000075'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 7,
            'title' => 'False Ceiling Work in Bhagalpur', 'description' => 'Looking for experienced professionals for false ceiling work at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 1100000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'open',
            'name' => 'Customer 76', 'phone' => '9900000076'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 8,
            'title' => 'Office Interior in Purnia', 'description' => 'Looking for experienced professionals for office interior at my property in Purnia. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 1500000,
            'city' => 'Purnia', 'district' => 'Purnia', 'status' => 'closed',
            'name' => 'Customer 77', 'phone' => '9900000077'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 4,
            'title' => 'Office Interior in Patna', 'description' => 'Looking for experienced professionals for office interior at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 1100000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'open',
            'name' => 'Customer 78', 'phone' => '9900000078'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 3,
            'title' => '3BHK Interior Design in Muzaffarpur', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 1500000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'open',
            'name' => 'Customer 79', 'phone' => '9900000079'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 9,
            'title' => '3BHK Interior Design in Muzaffarpur', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 1500000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'closed',
            'name' => 'Customer 80', 'phone' => '9900000080'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 8,
            'title' => 'Bathroom Remodeling in Muzaffarpur', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 700000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'open',
            'name' => 'Customer 81', 'phone' => '9900000081'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 2,
            'title' => 'Hotel Renovation in Muzaffarpur', 'description' => 'Looking for experienced professionals for hotel renovation at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 1100000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'closed',
            'name' => 'Customer 82', 'phone' => '9900000082'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 5,
            'title' => 'Bathroom Remodeling in Muzaffarpur', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 1000000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'closed',
            'name' => 'Customer 83', 'phone' => '9900000083'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 9,
            'title' => 'Modular Kitchen in Patna', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 1000000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'open',
            'name' => 'Customer 84', 'phone' => '9900000084'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 7,
            'title' => 'Hotel Renovation in Muzaffarpur', 'description' => 'Looking for experienced professionals for hotel renovation at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 1100000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'open',
            'name' => 'Customer 85', 'phone' => '9900000085'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 8,
            'title' => 'Office Interior in Bhagalpur', 'description' => 'Looking for experienced professionals for office interior at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 1400000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'in_progress',
            'name' => 'Customer 86', 'phone' => '9900000086'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 5,
            'title' => '3BHK Interior Design in Bhagalpur', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 1300000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'in_progress',
            'name' => 'Customer 87', 'phone' => '9900000087'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 6,
            'title' => 'Modular Kitchen in Darbhanga', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 400000, 'budget_max' => 800000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'open',
            'name' => 'Customer 88', 'phone' => '9900000088'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 5,
            'title' => 'False Ceiling Work in Purnia', 'description' => 'Looking for experienced professionals for false ceiling work at my property in Purnia. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 700000,
            'city' => 'Purnia', 'district' => 'Purnia', 'status' => 'open',
            'name' => 'Customer 89', 'phone' => '9900000089'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 8,
            'title' => 'Modular Kitchen in Patna', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 800000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'open',
            'name' => 'Customer 90', 'phone' => '9900000090'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 7,
            'title' => 'Office Interior in Darbhanga', 'description' => 'Looking for experienced professionals for office interior at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 800000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'closed',
            'name' => 'Customer 91', 'phone' => '9900000091'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 8,
            'title' => 'Villa Renovation in Purnia', 'description' => 'Looking for experienced professionals for villa renovation at my property in Purnia. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 900000,
            'city' => 'Purnia', 'district' => 'Purnia', 'status' => 'in_progress',
            'name' => 'Customer 92', 'phone' => '9900000092'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 3,
            'title' => 'Modular Kitchen in Bhagalpur', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 1300000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'open',
            'name' => 'Customer 93', 'phone' => '9900000093'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 4,
            'title' => '3BHK Interior Design in Gaya', 'description' => 'Looking for experienced professionals for 3bhk interior design at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 600000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'open',
            'name' => 'Customer 94', 'phone' => '9900000094'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 5,
            'title' => 'Hotel Renovation in Muzaffarpur', 'description' => 'Looking for experienced professionals for hotel renovation at my property in Muzaffarpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 500000, 'budget_max' => 1300000,
            'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur', 'status' => 'in_progress',
            'name' => 'Customer 95', 'phone' => '9900000095'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 1,
            'title' => 'Bathroom Remodeling in Darbhanga', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 200000, 'budget_max' => 1000000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'in_progress',
            'name' => 'Customer 96', 'phone' => '9900000096'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 2,
            'title' => 'Bathroom Remodeling in Darbhanga', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Darbhanga. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 300000, 'budget_max' => 800000,
            'city' => 'Darbhanga', 'district' => 'Darbhanga', 'status' => 'closed',
            'name' => 'Customer 97', 'phone' => '9900000097'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 4,
            'title' => 'Bathroom Remodeling in Bhagalpur', 'description' => 'Looking for experienced professionals for bathroom remodeling at my property in Bhagalpur. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 1500000,
            'city' => 'Bhagalpur', 'district' => 'Bhagalpur', 'status' => 'open',
            'name' => 'Customer 98', 'phone' => '9900000098'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 8,
            'title' => 'Modular Kitchen in Gaya', 'description' => 'Looking for experienced professionals for modular kitchen at my property in Gaya. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 700000,
            'city' => 'Gaya', 'district' => 'Gaya', 'status' => 'in_progress',
            'name' => 'Customer 99', 'phone' => '9900000099'
        ]);
        
        Requirement::create([
            'user_id' => 1, 'category_id' => 5,
            'title' => 'False Ceiling Work in Patna', 'description' => 'Looking for experienced professionals for false ceiling work at my property in Patna. Need good quality work.',
            'project_type' => 'residential', 'budget_min' => 100000, 'budget_max' => 800000,
            'city' => 'Patna', 'district' => 'Patna', 'status' => 'open',
            'name' => 'Customer 100', 'phone' => '9900000100'
        ]);
          }
}
