<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Worker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
class WorkerSeeder extends Seeder {
  public function run(): void {
  Worker::unguard();

        $u = User::create(['name' => 'Vikas Sharma', 'email' => 'worker1@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580001']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Vikas Sharma', 'slug' => Str::slug('Vikas Sharma-1'),
            'skill' => 'Welder', 'experience_years' => 12,
            'daily_rate' => 653, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Vikas Sharma'),
            'phone' => '9876580001'
        ]);
        
        $u = User::create(['name' => 'Rajesh Yadav', 'email' => 'worker2@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580002']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Rajesh Yadav', 'slug' => Str::slug('Rajesh Yadav-2'),
            'skill' => 'Painter', 'experience_years' => 9,
            'daily_rate' => 1084, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Rajesh Yadav'),
            'phone' => '9876580002'
        ]);
        
        $u = User::create(['name' => 'Sunil Paswan', 'email' => 'worker3@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580003']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Sunil Paswan', 'slug' => Str::slug('Sunil Paswan-3'),
            'skill' => 'Welder', 'experience_years' => 21,
            'daily_rate' => 1135, 'city' => 'Gaya', 'district' => 'Gaya',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Sunil Paswan'),
            'phone' => '9876580003'
        ]);
        
        $u = User::create(['name' => 'Sanjay Sharma', 'email' => 'worker4@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580004']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Sanjay Sharma', 'slug' => Str::slug('Sanjay Sharma-4'),
            'skill' => 'Fabricator', 'experience_years' => 7,
            'daily_rate' => 1219, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Sanjay Sharma'),
            'phone' => '9876580004'
        ]);
        
        $u = User::create(['name' => 'Sunil Sharma', 'email' => 'worker5@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580005']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Sunil Sharma', 'slug' => Str::slug('Sunil Sharma-5'),
            'skill' => 'Site Supervisor', 'experience_years' => 3,
            'daily_rate' => 722, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Sunil Sharma'),
            'phone' => '9876580005'
        ]);
        
        $u = User::create(['name' => 'Suresh Mishra', 'email' => 'worker6@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580006']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Suresh Mishra', 'slug' => Str::slug('Suresh Mishra-6'),
            'skill' => 'Welder', 'experience_years' => 5,
            'daily_rate' => 1348, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Suresh Mishra'),
            'phone' => '9876580006'
        ]);
        
        $u = User::create(['name' => 'Dinesh Singh', 'email' => 'worker7@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580007']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Dinesh Singh', 'slug' => Str::slug('Dinesh Singh-7'),
            'skill' => 'Electrician', 'experience_years' => 12,
            'daily_rate' => 580, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Dinesh Singh'),
            'phone' => '9876580007'
        ]);
        
        $u = User::create(['name' => 'Amit Kumar', 'email' => 'worker8@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580008']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Amit Kumar', 'slug' => Str::slug('Amit Kumar-8'),
            'skill' => 'Welder', 'experience_years' => 16,
            'daily_rate' => 997, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Amit Kumar'),
            'phone' => '9876580008'
        ]);
        
        $u = User::create(['name' => 'Vikas Paswan', 'email' => 'worker9@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580009']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Vikas Paswan', 'slug' => Str::slug('Vikas Paswan-9'),
            'skill' => 'Tile Mason', 'experience_years' => 22,
            'daily_rate' => 942, 'city' => 'Gaya', 'district' => 'Gaya',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Vikas Paswan'),
            'phone' => '9876580009'
        ]);
        
        $u = User::create(['name' => 'Sunil Sharma', 'email' => 'worker10@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580010']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Sunil Sharma', 'slug' => Str::slug('Sunil Sharma-10'),
            'skill' => 'Site Supervisor', 'experience_years' => 21,
            'daily_rate' => 736, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Sunil Sharma'),
            'phone' => '9876580010'
        ]);
        
        $u = User::create(['name' => 'Amit Pandey', 'email' => 'worker11@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580011']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Amit Pandey', 'slug' => Str::slug('Amit Pandey-11'),
            'skill' => 'Site Supervisor', 'experience_years' => 8,
            'daily_rate' => 887, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Amit Pandey'),
            'phone' => '9876580011'
        ]);
        
        $u = User::create(['name' => 'Ashok Kumar', 'email' => 'worker12@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580012']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ashok Kumar', 'slug' => Str::slug('Ashok Kumar-12'),
            'skill' => 'Fabricator', 'experience_years' => 6,
            'daily_rate' => 523, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ashok Kumar'),
            'phone' => '9876580012'
        ]);
        
        $u = User::create(['name' => 'Sunil Singh', 'email' => 'worker13@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580013']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Sunil Singh', 'slug' => Str::slug('Sunil Singh-13'),
            'skill' => 'POP Expert', 'experience_years' => 10,
            'daily_rate' => 620, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Sunil Singh'),
            'phone' => '9876580013'
        ]);
        
        $u = User::create(['name' => 'Vikas Kumar', 'email' => 'worker14@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580014']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Vikas Kumar', 'slug' => Str::slug('Vikas Kumar-14'),
            'skill' => 'Welder', 'experience_years' => 11,
            'daily_rate' => 704, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Vikas Kumar'),
            'phone' => '9876580014'
        ]);
        
        $u = User::create(['name' => 'Sanjay Sharma', 'email' => 'worker15@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580015']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Sanjay Sharma', 'slug' => Str::slug('Sanjay Sharma-15'),
            'skill' => 'Site Supervisor', 'experience_years' => 16,
            'daily_rate' => 807, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Sanjay Sharma'),
            'phone' => '9876580015'
        ]);
        
        $u = User::create(['name' => 'Raju Kumar', 'email' => 'worker16@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580016']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Raju Kumar', 'slug' => Str::slug('Raju Kumar-16'),
            'skill' => 'Painter', 'experience_years' => 20,
            'daily_rate' => 509, 'city' => 'Gaya', 'district' => 'Gaya',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Raju Kumar'),
            'phone' => '9876580016'
        ]);
        
        $u = User::create(['name' => 'Dinesh Singh', 'email' => 'worker17@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580017']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Dinesh Singh', 'slug' => Str::slug('Dinesh Singh-17'),
            'skill' => 'Welder', 'experience_years' => 10,
            'daily_rate' => 852, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Dinesh Singh'),
            'phone' => '9876580017'
        ]);
        
        $u = User::create(['name' => 'Sanjay Singh', 'email' => 'worker18@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580018']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Sanjay Singh', 'slug' => Str::slug('Sanjay Singh-18'),
            'skill' => 'Electrician', 'experience_years' => 25,
            'daily_rate' => 1107, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Sanjay Singh'),
            'phone' => '9876580018'
        ]);
        
        $u = User::create(['name' => 'Pappu Sharma', 'email' => 'worker19@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580019']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Pappu Sharma', 'slug' => Str::slug('Pappu Sharma-19'),
            'skill' => 'Fabricator', 'experience_years' => 12,
            'daily_rate' => 1205, 'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Pappu Sharma'),
            'phone' => '9876580019'
        ]);
        
        $u = User::create(['name' => 'Dinesh Pandey', 'email' => 'worker20@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580020']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Dinesh Pandey', 'slug' => Str::slug('Dinesh Pandey-20'),
            'skill' => 'Electrician', 'experience_years' => 5,
            'daily_rate' => 930, 'city' => 'Gaya', 'district' => 'Gaya',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Dinesh Pandey'),
            'phone' => '9876580020'
        ]);
        
        $u = User::create(['name' => 'Rajesh Singh', 'email' => 'worker21@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580021']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Rajesh Singh', 'slug' => Str::slug('Rajesh Singh-21'),
            'skill' => 'Carpenter', 'experience_years' => 24,
            'daily_rate' => 789, 'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Rajesh Singh'),
            'phone' => '9876580021'
        ]);
        
        $u = User::create(['name' => 'Ashok Mishra', 'email' => 'worker22@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580022']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ashok Mishra', 'slug' => Str::slug('Ashok Mishra-22'),
            'skill' => 'Carpenter', 'experience_years' => 19,
            'daily_rate' => 502, 'city' => 'Gaya', 'district' => 'Gaya',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ashok Mishra'),
            'phone' => '9876580022'
        ]);
        
        $u = User::create(['name' => 'Dinesh Singh', 'email' => 'worker23@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580023']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Dinesh Singh', 'slug' => Str::slug('Dinesh Singh-23'),
            'skill' => 'Electrician', 'experience_years' => 8,
            'daily_rate' => 575, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Dinesh Singh'),
            'phone' => '9876580023'
        ]);
        
        $u = User::create(['name' => 'Sanjay Mishra', 'email' => 'worker24@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580024']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Sanjay Mishra', 'slug' => Str::slug('Sanjay Mishra-24'),
            'skill' => 'Painter', 'experience_years' => 18,
            'daily_rate' => 810, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Sanjay Mishra'),
            'phone' => '9876580024'
        ]);
        
        $u = User::create(['name' => 'Rajesh Kumar', 'email' => 'worker25@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580025']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Rajesh Kumar', 'slug' => Str::slug('Rajesh Kumar-25'),
            'skill' => 'Welder', 'experience_years' => 17,
            'daily_rate' => 965, 'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Rajesh Kumar'),
            'phone' => '9876580025'
        ]);
        
        $u = User::create(['name' => 'Manoj Pandey', 'email' => 'worker26@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580026']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Manoj Pandey', 'slug' => Str::slug('Manoj Pandey-26'),
            'skill' => 'Electrician', 'experience_years' => 21,
            'daily_rate' => 607, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Manoj Pandey'),
            'phone' => '9876580026'
        ]);
        
        $u = User::create(['name' => 'Sanjay Paswan', 'email' => 'worker27@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580027']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Sanjay Paswan', 'slug' => Str::slug('Sanjay Paswan-27'),
            'skill' => 'Carpenter', 'experience_years' => 12,
            'daily_rate' => 844, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Sanjay Paswan'),
            'phone' => '9876580027'
        ]);
        
        $u = User::create(['name' => 'Ashok Mishra', 'email' => 'worker28@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580028']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ashok Mishra', 'slug' => Str::slug('Ashok Mishra-28'),
            'skill' => 'Tile Mason', 'experience_years' => 20,
            'daily_rate' => 728, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ashok Mishra'),
            'phone' => '9876580028'
        ]);
        
        $u = User::create(['name' => 'Vikas Yadav', 'email' => 'worker29@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580029']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Vikas Yadav', 'slug' => Str::slug('Vikas Yadav-29'),
            'skill' => 'Fabricator', 'experience_years' => 14,
            'daily_rate' => 911, 'city' => 'Gaya', 'district' => 'Gaya',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Vikas Yadav'),
            'phone' => '9876580029'
        ]);
        
        $u = User::create(['name' => 'Dinesh Sharma', 'email' => 'worker30@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580030']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Dinesh Sharma', 'slug' => Str::slug('Dinesh Sharma-30'),
            'skill' => 'Carpenter', 'experience_years' => 16,
            'daily_rate' => 1299, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Dinesh Sharma'),
            'phone' => '9876580030'
        ]);
        
        $u = User::create(['name' => 'Ramesh Mishra', 'email' => 'worker31@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580031']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ramesh Mishra', 'slug' => Str::slug('Ramesh Mishra-31'),
            'skill' => 'Welder', 'experience_years' => 7,
            'daily_rate' => 1272, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ramesh Mishra'),
            'phone' => '9876580031'
        ]);
        
        $u = User::create(['name' => 'Rajesh Sharma', 'email' => 'worker32@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580032']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Rajesh Sharma', 'slug' => Str::slug('Rajesh Sharma-32'),
            'skill' => 'Welder', 'experience_years' => 6,
            'daily_rate' => 1111, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Rajesh Sharma'),
            'phone' => '9876580032'
        ]);
        
        $u = User::create(['name' => 'Suresh Sharma', 'email' => 'worker33@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580033']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Suresh Sharma', 'slug' => Str::slug('Suresh Sharma-33'),
            'skill' => 'Tile Mason', 'experience_years' => 2,
            'daily_rate' => 886, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Suresh Sharma'),
            'phone' => '9876580033'
        ]);
        
        $u = User::create(['name' => 'Amit Paswan', 'email' => 'worker34@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580034']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Amit Paswan', 'slug' => Str::slug('Amit Paswan-34'),
            'skill' => 'Site Supervisor', 'experience_years' => 11,
            'daily_rate' => 1030, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Amit Paswan'),
            'phone' => '9876580034'
        ]);
        
        $u = User::create(['name' => 'Suresh Mishra', 'email' => 'worker35@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580035']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Suresh Mishra', 'slug' => Str::slug('Suresh Mishra-35'),
            'skill' => 'Carpenter', 'experience_years' => 11,
            'daily_rate' => 1163, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Suresh Mishra'),
            'phone' => '9876580035'
        ]);
        
        $u = User::create(['name' => 'Pappu Sharma', 'email' => 'worker36@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580036']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Pappu Sharma', 'slug' => Str::slug('Pappu Sharma-36'),
            'skill' => 'Fabricator', 'experience_years' => 18,
            'daily_rate' => 978, 'city' => 'Gaya', 'district' => 'Gaya',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Pappu Sharma'),
            'phone' => '9876580036'
        ]);
        
        $u = User::create(['name' => 'Raju Paswan', 'email' => 'worker37@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580037']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Raju Paswan', 'slug' => Str::slug('Raju Paswan-37'),
            'skill' => 'Electrician', 'experience_years' => 22,
            'daily_rate' => 500, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Raju Paswan'),
            'phone' => '9876580037'
        ]);
        
        $u = User::create(['name' => 'Pappu Kumar', 'email' => 'worker38@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580038']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Pappu Kumar', 'slug' => Str::slug('Pappu Kumar-38'),
            'skill' => 'Electrician', 'experience_years' => 22,
            'daily_rate' => 1187, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Pappu Kumar'),
            'phone' => '9876580038'
        ]);
        
        $u = User::create(['name' => 'Raju Kumar', 'email' => 'worker39@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580039']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Raju Kumar', 'slug' => Str::slug('Raju Kumar-39'),
            'skill' => 'Painter', 'experience_years' => 8,
            'daily_rate' => 693, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Raju Kumar'),
            'phone' => '9876580039'
        ]);
        
        $u = User::create(['name' => 'Raju Yadav', 'email' => 'worker40@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580040']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Raju Yadav', 'slug' => Str::slug('Raju Yadav-40'),
            'skill' => 'Welder', 'experience_years' => 2,
            'daily_rate' => 800, 'city' => 'Gaya', 'district' => 'Gaya',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Raju Yadav'),
            'phone' => '9876580040'
        ]);
        
        $u = User::create(['name' => 'Rajesh Mishra', 'email' => 'worker41@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580041']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Rajesh Mishra', 'slug' => Str::slug('Rajesh Mishra-41'),
            'skill' => 'Site Supervisor', 'experience_years' => 16,
            'daily_rate' => 1404, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Rajesh Mishra'),
            'phone' => '9876580041'
        ]);
        
        $u = User::create(['name' => 'Raju Mishra', 'email' => 'worker42@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580042']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Raju Mishra', 'slug' => Str::slug('Raju Mishra-42'),
            'skill' => 'Fabricator', 'experience_years' => 13,
            'daily_rate' => 1436, 'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Raju Mishra'),
            'phone' => '9876580042'
        ]);
        
        $u = User::create(['name' => 'Ramesh Sharma', 'email' => 'worker43@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580043']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ramesh Sharma', 'slug' => Str::slug('Ramesh Sharma-43'),
            'skill' => 'Site Supervisor', 'experience_years' => 7,
            'daily_rate' => 595, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ramesh Sharma'),
            'phone' => '9876580043'
        ]);
        
        $u = User::create(['name' => 'Dinesh Pandey', 'email' => 'worker44@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580044']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Dinesh Pandey', 'slug' => Str::slug('Dinesh Pandey-44'),
            'skill' => 'Site Supervisor', 'experience_years' => 20,
            'daily_rate' => 1360, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Dinesh Pandey'),
            'phone' => '9876580044'
        ]);
        
        $u = User::create(['name' => 'Ashok Kumar', 'email' => 'worker45@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580045']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ashok Kumar', 'slug' => Str::slug('Ashok Kumar-45'),
            'skill' => 'POP Expert', 'experience_years' => 25,
            'daily_rate' => 1257, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ashok Kumar'),
            'phone' => '9876580045'
        ]);
        
        $u = User::create(['name' => 'Ashok Singh', 'email' => 'worker46@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580046']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ashok Singh', 'slug' => Str::slug('Ashok Singh-46'),
            'skill' => 'POP Expert', 'experience_years' => 23,
            'daily_rate' => 636, 'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ashok Singh'),
            'phone' => '9876580046'
        ]);
        
        $u = User::create(['name' => 'Vikas Singh', 'email' => 'worker47@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580047']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Vikas Singh', 'slug' => Str::slug('Vikas Singh-47'),
            'skill' => 'Painter', 'experience_years' => 14,
            'daily_rate' => 781, 'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Vikas Singh'),
            'phone' => '9876580047'
        ]);
        
        $u = User::create(['name' => 'Sanjay Mishra', 'email' => 'worker48@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580048']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Sanjay Mishra', 'slug' => Str::slug('Sanjay Mishra-48'),
            'skill' => 'Painter', 'experience_years' => 10,
            'daily_rate' => 1344, 'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Sanjay Mishra'),
            'phone' => '9876580048'
        ]);
        
        $u = User::create(['name' => 'Rajesh Paswan', 'email' => 'worker49@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580049']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Rajesh Paswan', 'slug' => Str::slug('Rajesh Paswan-49'),
            'skill' => 'Welder', 'experience_years' => 11,
            'daily_rate' => 1476, 'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Rajesh Paswan'),
            'phone' => '9876580049'
        ]);
        
        $u = User::create(['name' => 'Manoj Singh', 'email' => 'worker50@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580050']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Manoj Singh', 'slug' => Str::slug('Manoj Singh-50'),
            'skill' => 'Electrician', 'experience_years' => 23,
            'daily_rate' => 1019, 'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Manoj Singh'),
            'phone' => '9876580050'
        ]);
        
        $u = User::create(['name' => 'Ashok Kumar', 'email' => 'worker51@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580051']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ashok Kumar', 'slug' => Str::slug('Ashok Kumar-51'),
            'skill' => 'Fabricator', 'experience_years' => 7,
            'daily_rate' => 1489, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ashok Kumar'),
            'phone' => '9876580051'
        ]);
        
        $u = User::create(['name' => 'Suresh Mishra', 'email' => 'worker52@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580052']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Suresh Mishra', 'slug' => Str::slug('Suresh Mishra-52'),
            'skill' => 'Tile Mason', 'experience_years' => 25,
            'daily_rate' => 751, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Suresh Mishra'),
            'phone' => '9876580052'
        ]);
        
        $u = User::create(['name' => 'Sunil Paswan', 'email' => 'worker53@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580053']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Sunil Paswan', 'slug' => Str::slug('Sunil Paswan-53'),
            'skill' => 'Tile Mason', 'experience_years' => 13,
            'daily_rate' => 947, 'city' => 'Gaya', 'district' => 'Gaya',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Sunil Paswan'),
            'phone' => '9876580053'
        ]);
        
        $u = User::create(['name' => 'Vikas Kumar', 'email' => 'worker54@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580054']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Vikas Kumar', 'slug' => Str::slug('Vikas Kumar-54'),
            'skill' => 'Welder', 'experience_years' => 12,
            'daily_rate' => 905, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Vikas Kumar'),
            'phone' => '9876580054'
        ]);
        
        $u = User::create(['name' => 'Ramesh Kumar', 'email' => 'worker55@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580055']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ramesh Kumar', 'slug' => Str::slug('Ramesh Kumar-55'),
            'skill' => 'Painter', 'experience_years' => 8,
            'daily_rate' => 1373, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ramesh Kumar'),
            'phone' => '9876580055'
        ]);
        
        $u = User::create(['name' => 'Ashok Kumar', 'email' => 'worker56@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580056']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ashok Kumar', 'slug' => Str::slug('Ashok Kumar-56'),
            'skill' => 'Painter', 'experience_years' => 20,
            'daily_rate' => 671, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ashok Kumar'),
            'phone' => '9876580056'
        ]);
        
        $u = User::create(['name' => 'Vikas Pandey', 'email' => 'worker57@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580057']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Vikas Pandey', 'slug' => Str::slug('Vikas Pandey-57'),
            'skill' => 'Electrician', 'experience_years' => 13,
            'daily_rate' => 944, 'city' => 'Gaya', 'district' => 'Gaya',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Vikas Pandey'),
            'phone' => '9876580057'
        ]);
        
        $u = User::create(['name' => 'Pappu Mishra', 'email' => 'worker58@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580058']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Pappu Mishra', 'slug' => Str::slug('Pappu Mishra-58'),
            'skill' => 'POP Expert', 'experience_years' => 11,
            'daily_rate' => 1208, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Pappu Mishra'),
            'phone' => '9876580058'
        ]);
        
        $u = User::create(['name' => 'Rajesh Singh', 'email' => 'worker59@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580059']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Rajesh Singh', 'slug' => Str::slug('Rajesh Singh-59'),
            'skill' => 'Site Supervisor', 'experience_years' => 23,
            'daily_rate' => 839, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Rajesh Singh'),
            'phone' => '9876580059'
        ]);
        
        $u = User::create(['name' => 'Manoj Sharma', 'email' => 'worker60@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580060']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Manoj Sharma', 'slug' => Str::slug('Manoj Sharma-60'),
            'skill' => 'Welder', 'experience_years' => 12,
            'daily_rate' => 875, 'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Manoj Sharma'),
            'phone' => '9876580060'
        ]);
        
        $u = User::create(['name' => 'Manoj Singh', 'email' => 'worker61@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580061']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Manoj Singh', 'slug' => Str::slug('Manoj Singh-61'),
            'skill' => 'Tile Mason', 'experience_years' => 10,
            'daily_rate' => 1069, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Manoj Singh'),
            'phone' => '9876580061'
        ]);
        
        $u = User::create(['name' => 'Amit Yadav', 'email' => 'worker62@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580062']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Amit Yadav', 'slug' => Str::slug('Amit Yadav-62'),
            'skill' => 'Carpenter', 'experience_years' => 17,
            'daily_rate' => 1390, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Amit Yadav'),
            'phone' => '9876580062'
        ]);
        
        $u = User::create(['name' => 'Ashok Kumar', 'email' => 'worker63@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580063']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ashok Kumar', 'slug' => Str::slug('Ashok Kumar-63'),
            'skill' => 'POP Expert', 'experience_years' => 17,
            'daily_rate' => 734, 'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ashok Kumar'),
            'phone' => '9876580063'
        ]);
        
        $u = User::create(['name' => 'Manoj Kumar', 'email' => 'worker64@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580064']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Manoj Kumar', 'slug' => Str::slug('Manoj Kumar-64'),
            'skill' => 'POP Expert', 'experience_years' => 21,
            'daily_rate' => 1054, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Manoj Kumar'),
            'phone' => '9876580064'
        ]);
        
        $u = User::create(['name' => 'Sanjay Kumar', 'email' => 'worker65@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580065']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Sanjay Kumar', 'slug' => Str::slug('Sanjay Kumar-65'),
            'skill' => 'Electrician', 'experience_years' => 9,
            'daily_rate' => 655, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Sanjay Kumar'),
            'phone' => '9876580065'
        ]);
        
        $u = User::create(['name' => 'Sunil Kumar', 'email' => 'worker66@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580066']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Sunil Kumar', 'slug' => Str::slug('Sunil Kumar-66'),
            'skill' => 'Welder', 'experience_years' => 14,
            'daily_rate' => 1406, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Sunil Kumar'),
            'phone' => '9876580066'
        ]);
        
        $u = User::create(['name' => 'Vikas Kumar', 'email' => 'worker67@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580067']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Vikas Kumar', 'slug' => Str::slug('Vikas Kumar-67'),
            'skill' => 'Site Supervisor', 'experience_years' => 25,
            'daily_rate' => 793, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Vikas Kumar'),
            'phone' => '9876580067'
        ]);
        
        $u = User::create(['name' => 'Ramesh Mishra', 'email' => 'worker68@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580068']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ramesh Mishra', 'slug' => Str::slug('Ramesh Mishra-68'),
            'skill' => 'Fabricator', 'experience_years' => 21,
            'daily_rate' => 666, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ramesh Mishra'),
            'phone' => '9876580068'
        ]);
        
        $u = User::create(['name' => 'Vikas Paswan', 'email' => 'worker69@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580069']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Vikas Paswan', 'slug' => Str::slug('Vikas Paswan-69'),
            'skill' => 'Fabricator', 'experience_years' => 6,
            'daily_rate' => 1229, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Vikas Paswan'),
            'phone' => '9876580069'
        ]);
        
        $u = User::create(['name' => 'Manoj Pandey', 'email' => 'worker70@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580070']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Manoj Pandey', 'slug' => Str::slug('Manoj Pandey-70'),
            'skill' => 'Welder', 'experience_years' => 21,
            'daily_rate' => 985, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Manoj Pandey'),
            'phone' => '9876580070'
        ]);
        
        $u = User::create(['name' => 'Rajesh Pandey', 'email' => 'worker71@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580071']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Rajesh Pandey', 'slug' => Str::slug('Rajesh Pandey-71'),
            'skill' => 'Fabricator', 'experience_years' => 18,
            'daily_rate' => 670, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Rajesh Pandey'),
            'phone' => '9876580071'
        ]);
        
        $u = User::create(['name' => 'Ashok Yadav', 'email' => 'worker72@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580072']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ashok Yadav', 'slug' => Str::slug('Ashok Yadav-72'),
            'skill' => 'Electrician', 'experience_years' => 17,
            'daily_rate' => 700, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ashok Yadav'),
            'phone' => '9876580072'
        ]);
        
        $u = User::create(['name' => 'Ramesh Pandey', 'email' => 'worker73@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580073']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ramesh Pandey', 'slug' => Str::slug('Ramesh Pandey-73'),
            'skill' => 'Welder', 'experience_years' => 9,
            'daily_rate' => 1358, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ramesh Pandey'),
            'phone' => '9876580073'
        ]);
        
        $u = User::create(['name' => 'Ashok Yadav', 'email' => 'worker74@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580074']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ashok Yadav', 'slug' => Str::slug('Ashok Yadav-74'),
            'skill' => 'POP Expert', 'experience_years' => 16,
            'daily_rate' => 1401, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ashok Yadav'),
            'phone' => '9876580074'
        ]);
        
        $u = User::create(['name' => 'Ramesh Yadav', 'email' => 'worker75@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580075']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ramesh Yadav', 'slug' => Str::slug('Ramesh Yadav-75'),
            'skill' => 'Site Supervisor', 'experience_years' => 8,
            'daily_rate' => 672, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ramesh Yadav'),
            'phone' => '9876580075'
        ]);
        
        $u = User::create(['name' => 'Sunil Yadav', 'email' => 'worker76@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580076']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Sunil Yadav', 'slug' => Str::slug('Sunil Yadav-76'),
            'skill' => 'Welder', 'experience_years' => 22,
            'daily_rate' => 969, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Sunil Yadav'),
            'phone' => '9876580076'
        ]);
        
        $u = User::create(['name' => 'Manoj Singh', 'email' => 'worker77@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580077']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Manoj Singh', 'slug' => Str::slug('Manoj Singh-77'),
            'skill' => 'Tile Mason', 'experience_years' => 4,
            'daily_rate' => 951, 'city' => 'Gaya', 'district' => 'Gaya',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Manoj Singh'),
            'phone' => '9876580077'
        ]);
        
        $u = User::create(['name' => 'Sanjay Mishra', 'email' => 'worker78@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580078']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Sanjay Mishra', 'slug' => Str::slug('Sanjay Mishra-78'),
            'skill' => 'Painter', 'experience_years' => 25,
            'daily_rate' => 649, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Sanjay Mishra'),
            'phone' => '9876580078'
        ]);
        
        $u = User::create(['name' => 'Raju Pandey', 'email' => 'worker79@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580079']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Raju Pandey', 'slug' => Str::slug('Raju Pandey-79'),
            'skill' => 'Fabricator', 'experience_years' => 18,
            'daily_rate' => 1430, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Raju Pandey'),
            'phone' => '9876580079'
        ]);
        
        $u = User::create(['name' => 'Pappu Singh', 'email' => 'worker80@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580080']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Pappu Singh', 'slug' => Str::slug('Pappu Singh-80'),
            'skill' => 'Painter', 'experience_years' => 11,
            'daily_rate' => 1355, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Pappu Singh'),
            'phone' => '9876580080'
        ]);
        
        $u = User::create(['name' => 'Vikas Paswan', 'email' => 'worker81@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580081']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Vikas Paswan', 'slug' => Str::slug('Vikas Paswan-81'),
            'skill' => 'Welder', 'experience_years' => 25,
            'daily_rate' => 1338, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Vikas Paswan'),
            'phone' => '9876580081'
        ]);
        
        $u = User::create(['name' => 'Suresh Mishra', 'email' => 'worker82@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580082']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Suresh Mishra', 'slug' => Str::slug('Suresh Mishra-82'),
            'skill' => 'Fabricator', 'experience_years' => 19,
            'daily_rate' => 1059, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Suresh Mishra'),
            'phone' => '9876580082'
        ]);
        
        $u = User::create(['name' => 'Rajesh Yadav', 'email' => 'worker83@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580083']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Rajesh Yadav', 'slug' => Str::slug('Rajesh Yadav-83'),
            'skill' => 'Painter', 'experience_years' => 22,
            'daily_rate' => 560, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Rajesh Yadav'),
            'phone' => '9876580083'
        ]);
        
        $u = User::create(['name' => 'Manoj Sharma', 'email' => 'worker84@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580084']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Manoj Sharma', 'slug' => Str::slug('Manoj Sharma-84'),
            'skill' => 'POP Expert', 'experience_years' => 23,
            'daily_rate' => 684, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Manoj Sharma'),
            'phone' => '9876580084'
        ]);
        
        $u = User::create(['name' => 'Pappu Paswan', 'email' => 'worker85@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580085']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Pappu Paswan', 'slug' => Str::slug('Pappu Paswan-85'),
            'skill' => 'Electrician', 'experience_years' => 6,
            'daily_rate' => 1494, 'city' => 'Gaya', 'district' => 'Gaya',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Pappu Paswan'),
            'phone' => '9876580085'
        ]);
        
        $u = User::create(['name' => 'Rajesh Singh', 'email' => 'worker86@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580086']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Rajesh Singh', 'slug' => Str::slug('Rajesh Singh-86'),
            'skill' => 'Carpenter', 'experience_years' => 18,
            'daily_rate' => 1331, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Rajesh Singh'),
            'phone' => '9876580086'
        ]);
        
        $u = User::create(['name' => 'Ashok Yadav', 'email' => 'worker87@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580087']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ashok Yadav', 'slug' => Str::slug('Ashok Yadav-87'),
            'skill' => 'Site Supervisor', 'experience_years' => 21,
            'daily_rate' => 503, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ashok Yadav'),
            'phone' => '9876580087'
        ]);
        
        $u = User::create(['name' => 'Ashok Singh', 'email' => 'worker88@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580088']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ashok Singh', 'slug' => Str::slug('Ashok Singh-88'),
            'skill' => 'Electrician', 'experience_years' => 2,
            'daily_rate' => 1474, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ashok Singh'),
            'phone' => '9876580088'
        ]);
        
        $u = User::create(['name' => 'Raju Paswan', 'email' => 'worker89@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580089']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Raju Paswan', 'slug' => Str::slug('Raju Paswan-89'),
            'skill' => 'Painter', 'experience_years' => 25,
            'daily_rate' => 1469, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Raju Paswan'),
            'phone' => '9876580089'
        ]);
        
        $u = User::create(['name' => 'Rajesh Pandey', 'email' => 'worker90@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580090']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Rajesh Pandey', 'slug' => Str::slug('Rajesh Pandey-90'),
            'skill' => 'Fabricator', 'experience_years' => 2,
            'daily_rate' => 908, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Rajesh Pandey'),
            'phone' => '9876580090'
        ]);
        
        $u = User::create(['name' => 'Manoj Mishra', 'email' => 'worker91@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580091']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Manoj Mishra', 'slug' => Str::slug('Manoj Mishra-91'),
            'skill' => 'Tile Mason', 'experience_years' => 12,
            'daily_rate' => 957, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Manoj Mishra'),
            'phone' => '9876580091'
        ]);
        
        $u = User::create(['name' => 'Amit Sharma', 'email' => 'worker92@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580092']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Amit Sharma', 'slug' => Str::slug('Amit Sharma-92'),
            'skill' => 'Electrician', 'experience_years' => 7,
            'daily_rate' => 1311, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Amit Sharma'),
            'phone' => '9876580092'
        ]);
        
        $u = User::create(['name' => 'Dinesh Singh', 'email' => 'worker93@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580093']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Dinesh Singh', 'slug' => Str::slug('Dinesh Singh-93'),
            'skill' => 'Electrician', 'experience_years' => 20,
            'daily_rate' => 598, 'city' => 'Muzaffarpur', 'district' => 'Muzaffarpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Dinesh Singh'),
            'phone' => '9876580093'
        ]);
        
        $u = User::create(['name' => 'Pappu Mishra', 'email' => 'worker94@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580094']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Pappu Mishra', 'slug' => Str::slug('Pappu Mishra-94'),
            'skill' => 'Painter', 'experience_years' => 21,
            'daily_rate' => 1097, 'city' => 'Gaya', 'district' => 'Gaya',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Pappu Mishra'),
            'phone' => '9876580094'
        ]);
        
        $u = User::create(['name' => 'Raju Kumar', 'email' => 'worker95@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580095']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Raju Kumar', 'slug' => Str::slug('Raju Kumar-95'),
            'skill' => 'Painter', 'experience_years' => 20,
            'daily_rate' => 838, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Raju Kumar'),
            'phone' => '9876580095'
        ]);
        
        $u = User::create(['name' => 'Ashok Sharma', 'email' => 'worker96@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580096']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ashok Sharma', 'slug' => Str::slug('Ashok Sharma-96'),
            'skill' => 'Carpenter', 'experience_years' => 24,
            'daily_rate' => 1195, 'city' => 'Bhagalpur', 'district' => 'Bhagalpur',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ashok Sharma'),
            'phone' => '9876580096'
        ]);
        
        $u = User::create(['name' => 'Manoj Kumar', 'email' => 'worker97@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580097']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Manoj Kumar', 'slug' => Str::slug('Manoj Kumar-97'),
            'skill' => 'Electrician', 'experience_years' => 2,
            'daily_rate' => 645, 'city' => 'Patna', 'district' => 'Patna',
            'is_available' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Manoj Kumar'),
            'phone' => '9876580097'
        ]);
        
        $u = User::create(['name' => 'Ramesh Mishra', 'email' => 'worker98@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580098']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Ramesh Mishra', 'slug' => Str::slug('Ramesh Mishra-98'),
            'skill' => 'Site Supervisor', 'experience_years' => 9,
            'daily_rate' => 1480, 'city' => 'Gaya', 'district' => 'Gaya',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Ramesh Mishra'),
            'phone' => '9876580098'
        ]);
        
        $u = User::create(['name' => 'Pappu Singh', 'email' => 'worker99@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580099']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Pappu Singh', 'slug' => Str::slug('Pappu Singh-99'),
            'skill' => 'Painter', 'experience_years' => 6,
            'daily_rate' => 1266, 'city' => 'Purnia', 'district' => 'Purnia',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Pappu Singh'),
            'phone' => '9876580099'
        ]);
        
        $u = User::create(['name' => 'Vikas Pandey', 'email' => 'worker100@example.com', 'password' => Hash::make('password'), 'role' => 'worker', 'is_active' => true, 'phone' => '9876580100']);
        Worker::create([
            'user_id' => $u->id, 'name' => 'Vikas Pandey', 'slug' => Str::slug('Vikas Pandey-100'),
            'skill' => 'Welder', 'experience_years' => 23,
            'daily_rate' => 1332, 'city' => 'Darbhanga', 'district' => 'Darbhanga',
            'is_available' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode('Vikas Pandey'),
            'phone' => '9876580100'
        ]);
          }
}
