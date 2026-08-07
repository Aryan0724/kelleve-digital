const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const phpScript = `<?php
use App\\Models\\User;
use App\\Models\\Requirement;
use App\\Models\\BuilderProject;

// Find admin user
$user = User::first();

if (!$user) {
    echo "No user found!";
    exit;
}

// 1. Create Mock Requirements (Public Projects / Leads)
$reqs = [
    [
        'title' => 'Complete Home Renovation in Kankarbagh',
        'description' => 'Looking for an experienced interior designer or turnkey contractor for a 3BHK flat (1500 sqft). Needs modular kitchen, false ceiling, and custom wardrobes.',
        'project_type' => 'residential',
        'city' => 'Patna',
        'district' => 'Patna',
        'budget_min' => 500000,
        'budget_max' => 800000,
        'name' => 'Rahul Verma',
        'phone' => '9876543210',
        'email' => 'rahul@example.com',
        'opportunity_type' => 'JOB',
        'requirement_type' => 'interior_design',
        'status' => 'open',
        'category_id' => 1
    ],
    [
        'title' => 'Commercial Office Space Setup',
        'description' => 'Need 20 workstations, 2 cabins, and a conference room for a new IT office in Frazer Road area. Total area 2000 sq ft.',
        'project_type' => 'commercial',
        'city' => 'Patna',
        'district' => 'Patna',
        'budget_min' => 1000000,
        'budget_max' => 1500000,
        'name' => 'Sneha Sharma',
        'phone' => '9876543211',
        'email' => 'sneha@example.com',
        'opportunity_type' => 'RFQ',
        'requirement_type' => 'contractor',
        'status' => 'open',
        'category_id' => 1
    ],
    [
        'title' => 'Modular Kitchen and Wardrobes',
        'description' => 'Seeking quotes for L-shaped modular kitchen (acrylic finish) and two sliding wardrobes for a new apartment.',
        'project_type' => 'residential',
        'city' => 'Patna',
        'district' => 'Patna',
        'budget_min' => 150000,
        'budget_max' => 250000,
        'name' => 'Amit Kumar',
        'phone' => '9876543212',
        'email' => 'amit@example.com',
        'opportunity_type' => 'JOB',
        'requirement_type' => 'skilled_worker',
        'status' => 'open',
        'category_id' => 1
    ]
];

foreach ($reqs as $data) {
    $data['user_id'] = $user->id;
    Requirement::create($data);
}
echo "Mock requirements created. \\n";

// 2. Create Mock Builder Projects
$builderProjects = [
    [
        'title' => 'Sunrise Luxury Apartments',
        'slug' => 'sunrise-luxury-apartments-' . rand(100,999),
        'description' => 'Premium 3 and 4 BHK apartments in the heart of the city with world-class amenities like swimming pool, gym, and clubhouse.',
        'project_type' => 'apartment',
        'status' => 'upcoming',
        'city' => 'Patna',
        'district' => 'Patna',
        'state' => 'Bihar',
        'address' => 'Bailey Road, Patna',
        'possession_date' => '2027-01-01',
        'price_range' => '₹80 Lakh - ₹1.2 Cr',
        'is_featured' => true
    ],
    [
        'title' => 'Green Valley Villas',
        'slug' => 'green-valley-villas-' . rand(100,999),
        'description' => 'Exclusive gated community of independent villas with private gardens and smart home automation.',
        'project_type' => 'villa',
        'status' => 'possession_ready',
        'city' => 'Patna',
        'district' => 'Patna',
        'state' => 'Bihar',
        'address' => 'Danapur, Patna',
        'possession_date' => '2025-06-01',
        'price_range' => '₹1.5 Cr - ₹2.5 Cr',
        'is_featured' => true
    ]
];

if (class_exists(BuilderProject::class)) {
    foreach ($builderProjects as $data) {
        $data['builder_id'] = $user->id; 
        $data['tenant_id'] = 1;
        
        $builder = \\App\\Models\\Builder::first();
        if ($builder) {
            $data['builder_id'] = $builder->id;
        } else {
             $data['builder_id'] = 1;
        }
        
        BuilderProject::create($data);
    }
    echo "Mock builder projects created. \\n";
} else {
    echo "BuilderProject model not found. \\n";
}
`;

  // Escape single quotes for bash
  const escapedScript = phpScript.replace(/'/g, "'\\''");
  const cmd = `echo '${escapedScript}' > /var/www/find-my-interior/mock-data.php && docker compose -f /var/www/find-my-interior/docker-compose.yml exec -T backend php artisan tinker /var/www/find-my-interior/mock-data.php`;

  conn.exec(cmd, (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- Seeding output ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
