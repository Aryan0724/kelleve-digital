import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Write a PHP migration script to the server
migration_script = r"""<?php

define('LARAVEL_START', microtime(true));
require '/var/www/html/vendor/autoload.php';
$app = require_once '/var/www/html/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$truedialTypes = [
    'restaurant','cafe','dhaba','fast_food','bakery','sweet_shop','catering',
    'tiffin_service','cloud_kitchen','bar','juice_bar',
    'doctor','hospital','clinic','dentist','eye_specialist','diagnostic_lab',
    'pharmacy','physiotherapist','ayurvedic_doctor','veterinary_doctor','optician',
    'mental_health_counselor','dietitian',
    'salon','spa','nail_studio','tattoo_studio','makeup_artist','bridal_studio',
    'beauty_parlour','mehendi_artist','unisex_salon','hair_salon','massage_center',
    'gym','yoga_studio','martial_arts','swimming_pool','sports_academy','fitness_center',
    'zumba_studio','personal_trainer','crossfit_box','cycling_studio',
    'school','college','coaching_center','music_academy','dance_academy','language_class',
    'computer_training','skill_development_center','photography_course','cooking_classes',
    'electronics_shop','clothing_store','jewellery_shop','grocery_store','mobile_shop',
    'supermarket','toy_store','sports_goods','shoe_store','watch_store',
    'hotel','resort','guest_house','pg_hostel','homestay','service_apartment',
    'boutique_hotel','co_living_space',
    'chartered_accountant','lawyer','insurance_agent','financial_advisor','tax_consultant',
    'wedding_planner','photographer','videographer','dj','decorator','banquet_hall',
    'event_manager','caterer_event','photo_studio',
    'car_garage','car_wash','tyre_shop','driving_school','auto_spare_parts','bike_mechanic',
    'travel_agency','tour_operator','car_rental','taxi_service','visa_consultant',
    'web_designer','app_developer','digital_marketing_agency','computer_repair',
    'graphic_designer','software_company','seo_agency',
];

// Get user IDs with TrueDial-specific professional types
$userIds = DB::table('users')
    ->whereIn('professional_type', $truedialTypes)
    ->pluck('id');

echo "TrueDial users found: " . $userIds->count() . "\n";
echo "Sample IDs: " . implode(', ', $userIds->take(10)->toArray()) . "\n\n";

// Count before
$before1 = DB::table('listings')->where('tenant_id', 1)->count();
$before2 = DB::table('listings')->where('tenant_id', 2)->count();
echo "Before: tenant_id=1: {$before1}, tenant_id=2: {$before2}\n";

// Run the migration
$updated = DB::table('listings')
    ->where('tenant_id', 1)
    ->whereIn('user_id', $userIds)
    ->update(['tenant_id' => 2]);

echo "Listings migrated to tenant_id=2: {$updated}\n";

// Verify after
$after1 = DB::table('listings')->where('tenant_id', 1)->count();
$after2 = DB::table('listings')->where('tenant_id', 2)->count();
echo "After: tenant_id=1: {$after1}, tenant_id=2: {$after2}\n";

echo "\nDone!\n";
"""

# Write the script to a temp file on the server
_, stdin, _ = client.exec_command('cat > /tmp/migrate_tenants.php')
stdin.write(migration_script)
stdin.channel.shutdown_write()

import time
time.sleep(1)

# Run it inside the docker container
_, stdout, stderr = client.exec_command('docker cp /tmp/migrate_tenants.php fmi_backend:/tmp/migrate_tenants.php')
print(stdout.read().decode(), stderr.read().decode())

_, stdout, stderr = client.exec_command('docker exec fmi_backend php /tmp/migrate_tenants.php')
print("=== MIGRATION OUTPUT ===")
print(stdout.read().decode())
err = stderr.read().decode()
if err:
    print("ERRORS:", err)
