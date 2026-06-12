<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Inquiry;
class InquirySeeder extends Seeder {
  public function run(): void {
  Inquiry::unguard();

        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 7,
            'name' => 'Customer 1', 'email' => 'cust1@example.com', 'phone' => '9800000001',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 19,
            'name' => 'Customer 2', 'email' => 'cust2@example.com', 'phone' => '9800000002',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 19,
            'name' => 'Customer 3', 'email' => 'cust3@example.com', 'phone' => '9800000003',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 2,
            'name' => 'Customer 4', 'email' => 'cust4@example.com', 'phone' => '9800000004',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 6,
            'name' => 'Customer 5', 'email' => 'cust5@example.com', 'phone' => '9800000005',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 6,
            'name' => 'Customer 6', 'email' => 'cust6@example.com', 'phone' => '9800000006',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 3,
            'name' => 'Customer 7', 'email' => 'cust7@example.com', 'phone' => '9800000007',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 17,
            'name' => 'Customer 8', 'email' => 'cust8@example.com', 'phone' => '9800000008',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 7,
            'name' => 'Customer 9', 'email' => 'cust9@example.com', 'phone' => '9800000009',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 6,
            'name' => 'Customer 10', 'email' => 'cust10@example.com', 'phone' => '9800000010',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 14,
            'name' => 'Customer 11', 'email' => 'cust11@example.com', 'phone' => '9800000011',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 4,
            'name' => 'Customer 12', 'email' => 'cust12@example.com', 'phone' => '9800000012',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 15,
            'name' => 'Customer 13', 'email' => 'cust13@example.com', 'phone' => '9800000013',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 8,
            'name' => 'Customer 14', 'email' => 'cust14@example.com', 'phone' => '9800000014',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 18,
            'name' => 'Customer 15', 'email' => 'cust15@example.com', 'phone' => '9800000015',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 6,
            'name' => 'Customer 16', 'email' => 'cust16@example.com', 'phone' => '9800000016',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 20,
            'name' => 'Customer 17', 'email' => 'cust17@example.com', 'phone' => '9800000017',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 8,
            'name' => 'Customer 18', 'email' => 'cust18@example.com', 'phone' => '9800000018',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 1,
            'name' => 'Customer 19', 'email' => 'cust19@example.com', 'phone' => '9800000019',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 2,
            'name' => 'Customer 20', 'email' => 'cust20@example.com', 'phone' => '9800000020',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 1,
            'name' => 'Customer 21', 'email' => 'cust21@example.com', 'phone' => '9800000021',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 16,
            'name' => 'Customer 22', 'email' => 'cust22@example.com', 'phone' => '9800000022',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 20,
            'name' => 'Customer 23', 'email' => 'cust23@example.com', 'phone' => '9800000023',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 6,
            'name' => 'Customer 24', 'email' => 'cust24@example.com', 'phone' => '9800000024',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 16,
            'name' => 'Customer 25', 'email' => 'cust25@example.com', 'phone' => '9800000025',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 12,
            'name' => 'Customer 26', 'email' => 'cust26@example.com', 'phone' => '9800000026',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 2,
            'name' => 'Customer 27', 'email' => 'cust27@example.com', 'phone' => '9800000027',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 15,
            'name' => 'Customer 28', 'email' => 'cust28@example.com', 'phone' => '9800000028',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 8,
            'name' => 'Customer 29', 'email' => 'cust29@example.com', 'phone' => '9800000029',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 13,
            'name' => 'Customer 30', 'email' => 'cust30@example.com', 'phone' => '9800000030',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 4,
            'name' => 'Customer 31', 'email' => 'cust31@example.com', 'phone' => '9800000031',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 7,
            'name' => 'Customer 32', 'email' => 'cust32@example.com', 'phone' => '9800000032',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 7,
            'name' => 'Customer 33', 'email' => 'cust33@example.com', 'phone' => '9800000033',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 13,
            'name' => 'Customer 34', 'email' => 'cust34@example.com', 'phone' => '9800000034',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 5,
            'name' => 'Customer 35', 'email' => 'cust35@example.com', 'phone' => '9800000035',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 1,
            'name' => 'Customer 36', 'email' => 'cust36@example.com', 'phone' => '9800000036',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 12,
            'name' => 'Customer 37', 'email' => 'cust37@example.com', 'phone' => '9800000037',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 6,
            'name' => 'Customer 38', 'email' => 'cust38@example.com', 'phone' => '9800000038',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 19,
            'name' => 'Customer 39', 'email' => 'cust39@example.com', 'phone' => '9800000039',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 14,
            'name' => 'Customer 40', 'email' => 'cust40@example.com', 'phone' => '9800000040',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 2,
            'name' => 'Customer 41', 'email' => 'cust41@example.com', 'phone' => '9800000041',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 10,
            'name' => 'Customer 42', 'email' => 'cust42@example.com', 'phone' => '9800000042',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 3,
            'name' => 'Customer 43', 'email' => 'cust43@example.com', 'phone' => '9800000043',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 18,
            'name' => 'Customer 44', 'email' => 'cust44@example.com', 'phone' => '9800000044',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 20,
            'name' => 'Customer 45', 'email' => 'cust45@example.com', 'phone' => '9800000045',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 5,
            'name' => 'Customer 46', 'email' => 'cust46@example.com', 'phone' => '9800000046',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 2,
            'name' => 'Customer 47', 'email' => 'cust47@example.com', 'phone' => '9800000047',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 9,
            'name' => 'Customer 48', 'email' => 'cust48@example.com', 'phone' => '9800000048',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 7,
            'name' => 'Customer 49', 'email' => 'cust49@example.com', 'phone' => '9800000049',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 2,
            'name' => 'Customer 50', 'email' => 'cust50@example.com', 'phone' => '9800000050',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 3,
            'name' => 'Customer 51', 'email' => 'cust51@example.com', 'phone' => '9800000051',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 10,
            'name' => 'Customer 52', 'email' => 'cust52@example.com', 'phone' => '9800000052',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 15,
            'name' => 'Customer 53', 'email' => 'cust53@example.com', 'phone' => '9800000053',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 20,
            'name' => 'Customer 54', 'email' => 'cust54@example.com', 'phone' => '9800000054',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 11,
            'name' => 'Customer 55', 'email' => 'cust55@example.com', 'phone' => '9800000055',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 8,
            'name' => 'Customer 56', 'email' => 'cust56@example.com', 'phone' => '9800000056',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 4,
            'name' => 'Customer 57', 'email' => 'cust57@example.com', 'phone' => '9800000057',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 1,
            'name' => 'Customer 58', 'email' => 'cust58@example.com', 'phone' => '9800000058',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 13,
            'name' => 'Customer 59', 'email' => 'cust59@example.com', 'phone' => '9800000059',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 12,
            'name' => 'Customer 60', 'email' => 'cust60@example.com', 'phone' => '9800000060',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 9,
            'name' => 'Customer 61', 'email' => 'cust61@example.com', 'phone' => '9800000061',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 9,
            'name' => 'Customer 62', 'email' => 'cust62@example.com', 'phone' => '9800000062',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 13,
            'name' => 'Customer 63', 'email' => 'cust63@example.com', 'phone' => '9800000063',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 4,
            'name' => 'Customer 64', 'email' => 'cust64@example.com', 'phone' => '9800000064',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 3,
            'name' => 'Customer 65', 'email' => 'cust65@example.com', 'phone' => '9800000065',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 20,
            'name' => 'Customer 66', 'email' => 'cust66@example.com', 'phone' => '9800000066',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 3,
            'name' => 'Customer 67', 'email' => 'cust67@example.com', 'phone' => '9800000067',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 3,
            'name' => 'Customer 68', 'email' => 'cust68@example.com', 'phone' => '9800000068',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 19,
            'name' => 'Customer 69', 'email' => 'cust69@example.com', 'phone' => '9800000069',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 9,
            'name' => 'Customer 70', 'email' => 'cust70@example.com', 'phone' => '9800000070',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 16,
            'name' => 'Customer 71', 'email' => 'cust71@example.com', 'phone' => '9800000071',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 12,
            'name' => 'Customer 72', 'email' => 'cust72@example.com', 'phone' => '9800000072',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 11,
            'name' => 'Customer 73', 'email' => 'cust73@example.com', 'phone' => '9800000073',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 5,
            'name' => 'Customer 74', 'email' => 'cust74@example.com', 'phone' => '9800000074',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 18,
            'name' => 'Customer 75', 'email' => 'cust75@example.com', 'phone' => '9800000075',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 6,
            'name' => 'Customer 76', 'email' => 'cust76@example.com', 'phone' => '9800000076',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 16,
            'name' => 'Customer 77', 'email' => 'cust77@example.com', 'phone' => '9800000077',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 10,
            'name' => 'Customer 78', 'email' => 'cust78@example.com', 'phone' => '9800000078',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 12,
            'name' => 'Customer 79', 'email' => 'cust79@example.com', 'phone' => '9800000079',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 10,
            'name' => 'Customer 80', 'email' => 'cust80@example.com', 'phone' => '9800000080',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 10,
            'name' => 'Customer 81', 'email' => 'cust81@example.com', 'phone' => '9800000081',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 13,
            'name' => 'Customer 82', 'email' => 'cust82@example.com', 'phone' => '9800000082',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 9,
            'name' => 'Customer 83', 'email' => 'cust83@example.com', 'phone' => '9800000083',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 20,
            'name' => 'Customer 84', 'email' => 'cust84@example.com', 'phone' => '9800000084',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 14,
            'name' => 'Customer 85', 'email' => 'cust85@example.com', 'phone' => '9800000085',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 4,
            'name' => 'Customer 86', 'email' => 'cust86@example.com', 'phone' => '9800000086',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 13,
            'name' => 'Customer 87', 'email' => 'cust87@example.com', 'phone' => '9800000087',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 15,
            'name' => 'Customer 88', 'email' => 'cust88@example.com', 'phone' => '9800000088',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 4,
            'name' => 'Customer 89', 'email' => 'cust89@example.com', 'phone' => '9800000089',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 12,
            'name' => 'Customer 90', 'email' => 'cust90@example.com', 'phone' => '9800000090',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Listing', 'inquirable_id' => 4,
            'name' => 'Customer 91', 'email' => 'cust91@example.com', 'phone' => '9800000091',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 17,
            'name' => 'Customer 92', 'email' => 'cust92@example.com', 'phone' => '9800000092',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 18,
            'name' => 'Customer 93', 'email' => 'cust93@example.com', 'phone' => '9800000093',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 15,
            'name' => 'Customer 94', 'email' => 'cust94@example.com', 'phone' => '9800000094',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 8,
            'name' => 'Customer 95', 'email' => 'cust95@example.com', 'phone' => '9800000095',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 8,
            'name' => 'Customer 96', 'email' => 'cust96@example.com', 'phone' => '9800000096',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 17,
            'name' => 'Customer 97', 'email' => 'cust97@example.com', 'phone' => '9800000097',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Builder', 'inquirable_id' => 18,
            'name' => 'Customer 98', 'email' => 'cust98@example.com', 'phone' => '9800000098',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Supplier', 'inquirable_id' => 20,
            'name' => 'Customer 99', 'email' => 'cust99@example.com', 'phone' => '9800000099',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
        
        Inquiry::create([
            'inquirable_type' => 'App\Models\Worker', 'inquirable_id' => 12,
            'name' => 'Customer 100', 'email' => 'cust100@example.com', 'phone' => '9800000100',
            'message' => 'Hi, I am interested in your services. Please call me back.',
            'status' => 'new'
        ]);
          }
}
