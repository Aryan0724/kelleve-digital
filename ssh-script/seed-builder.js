const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const phpScript = `
use App\\Models\\User;
use App\\Models\\BuilderProject;

$user = User::first();
if (!$user) { echo "No user found!\\n"; exit; }

if (class_exists(BuilderProject::class)) {
    $builderProjects = [
        [
            'title' => 'Sunrise Luxury Apartments',
            'slug' => 'sunrise-luxury-apartments-' . rand(100,999),
            'description' => 'Premium 3 and 4 BHK apartments in the heart of the city with world-class amenities like swimming pool, gym, and clubhouse.',
            'project_type' => 'apartment',
            'status' => 'upcoming',
            'city' => 'Patna',
            'address' => 'Bailey Road, Patna',
            'possession_date' => '2027-01-01',
            'price_range' => '80 Lakh - 1.2 Cr',
            'is_featured' => true
        ],
        [
            'title' => 'Green Valley Villas',
            'slug' => 'green-valley-villas-' . rand(100,999),
            'description' => 'Exclusive gated community of independent villas with private gardens and smart home automation.',
            'project_type' => 'villa',
            'status' => 'possession_ready',
            'city' => 'Patna',
            'address' => 'Danapur, Patna',
            'possession_date' => '2025-06-01',
            'price_range' => '1.5 Cr - 2.5 Cr',
            'is_featured' => true
        ]
    ];

    $builder = \\App\\Models\\Builder::first();
    foreach ($builderProjects as $data) {
        $data['builder_id'] = $builder ? $builder->id : 1;
        $data['tenant_id'] = 1;
        BuilderProject::create($data);
    }
    echo "Mock builder projects created.\\n";
}
`;

  // Encode the script in base64 to avoid all quoting issues
  const base64Script = Buffer.from(phpScript).toString('base64');
  
  const cmd = `echo '${base64Script}' | base64 -d > /var/www/find-my-interior/mock-builder.php && docker compose -f /var/www/find-my-interior/docker-compose.yml exec -T backend php artisan tinker /var/www/find-my-interior/mock-builder.php`;

  conn.exec(cmd, (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- Seeding output ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
