import paramiko

migration_script = r"""<?php
define('LARAVEL_START', microtime(true));
require '/var/www/html/vendor/autoload.php';
$app = require_once '/var/www/html/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
use Illuminate\Support\Facades\DB;

$truedialTypes = ['restaurant','cafe','dhaba','fast_food','bakery','sweet_shop','catering','tiffin_service','cloud_kitchen','bar','juice_bar','doctor','hospital','clinic','dentist','eye_specialist','diagnostic_lab','pharmacy','physiotherapist','ayurvedic_doctor','veterinary_doctor','optician','mental_health_counselor','dietitian','salon','spa','nail_studio','tattoo_studio','makeup_artist','bridal_studio','beauty_parlour','mehendi_artist','unisex_salon','hair_salon','massage_center','gym','yoga_studio','martial_arts','swimming_pool','sports_academy','fitness_center','zumba_studio','personal_trainer','crossfit_box','cycling_studio','school','college','coaching_center','music_academy','dance_academy','language_class','computer_training','skill_development_center','photography_course','cooking_classes','electronics_shop','clothing_store','jewellery_shop','grocery_store','mobile_shop','supermarket','toy_store','sports_goods','shoe_store','watch_store','hotel','resort','guest_house','pg_hostel','homestay','service_apartment','boutique_hotel','co_living_space','chartered_accountant','lawyer','insurance_agent','financial_advisor','tax_consultant','wedding_planner','photographer','videographer','dj','decorator','banquet_hall','event_manager','caterer_event','photo_studio','car_garage','car_wash','tyre_shop','driving_school','auto_spare_parts','bike_mechanic','travel_agency','tour_operator','car_rental','taxi_service','visa_consultant','web_designer','app_developer','digital_marketing_agency','computer_repair','graphic_designer','software_company','seo_agency'];

$userIds = DB::table('users')->whereIn('professional_type', $truedialTypes)->pluck('id');
echo "TrueDial users: " . $userIds->count() . "\n";

$before1 = DB::table('listings')->where('tenant_id', 1)->count();
$before2 = DB::table('listings')->where('tenant_id', 2)->count();
echo "Before: tenant1={$before1}, tenant2={$before2}\n";

$updated = DB::table('listings')->where('tenant_id', 1)->whereIn('user_id', $userIds)->update(['tenant_id' => 2]);
echo "Migrated: {$updated} listings to tenant_id=2\n";

$after1 = DB::table('listings')->where('tenant_id', 1)->count();
$after2 = DB::table('listings')->where('tenant_id', 2)->count();
echo "After: tenant1={$after1}, tenant2={$after2}\n";
"""

with open('scripts/migrate_tenants_temp.php', 'w') as f:
    f.write(migration_script)

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# SCP the file
sftp = client.open_sftp()
sftp.put('scripts/migrate_tenants_temp.php', '/tmp/migrate_tenants.php')
sftp.close()

# Copy to container and run
_, stdout, _ = client.exec_command('docker cp /tmp/migrate_tenants.php fmi_backend:/tmp/migrate_tenants.php')
stdout.read()

_, stdout, stderr = client.exec_command('docker exec fmi_backend php /tmp/migrate_tenants.php')
print(stdout.read().decode())
err = stderr.read().decode()
if err:
    print("ERRORS:", err[:500])
