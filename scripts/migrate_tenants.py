import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

print("=== DB: Migrating TrueDial listings from tenant_id=1 to tenant_id=2 ===")
print()

# First, identify which users registered via TrueDial
# These are users in the user_tenant_roles table for tenant 2
# OR we can identify by the fact that they have professional_types from TrueDial categories
# The safest approach: migrate listings for users who either:
# 1. Have a record in user_tenant_roles with tenant_id=2 
# 2. Or registered very recently (after TrueDial launch)
# For now, let's check the user_tenant_roles table first

_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\""
    "echo json_encode(DB::table('user_tenant_roles')->get()->toArray());\""
)
print("user_tenant_roles table:", stdout.read().decode())

# Check the truedial-registered users (those who interacted with truedial vendor endpoints)
# The best signal: listings that were created AFTER the TrueDial frontend was deployed (2026-07-20 based on migrations)
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\""
    "echo 'Recent listings (last 30 days): ' . App\\\\Models\\\\Listing::where('tenant_id',1)->where('created_at','>=',now()->subDays(30))->count();\""
)
print(stdout.read().decode())

# Run the actual migration: 
# Update all listings under tenant_id=1 where the user has professional_type
# that belongs to TrueDial categories (food, healthcare, beauty, fitness, etc.)
# OR where user registered after Aug 1 2026 (truedial was deployed)
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\""
    "// Move listings to tenant 2 for users with TrueDial-specific professional types"
    "\$truedialTypes = ['restaurant','cafe','dhaba','fast_food','bakery','sweet_shop','catering',"
    "'tiffin_service','cloud_kitchen','bar','juice_bar','doctor','hospital','clinic','dentist',"
    "'eye_specialist','diagnostic_lab','pharmacy','physiotherapist','salon','spa','nail_studio',"
    "'makeup_artist','bridal_studio','beauty_parlour','gym','yoga_studio','martial_arts','swimming_pool',"
    "'fitness_center','school','college','coaching_center','music_academy','dance_academy',"
    "'hotel','resort','guest_house','pg_hostel','homestay','chartered_accountant','lawyer',"
    "'insurance_agent','wedding_planner','photographer','videographer','dj','car_garage','car_wash',"
    "'tyre_shop','travel_agency','tour_operator','web_designer','app_developer','digital_marketing_agency'];"
    "\$userIds = App\\\\Models\\\\User::whereIn('professional_type',\$truedialTypes)->pluck('id');"
    "echo 'TrueDial users found: ' . \$userIds->count() . PHP_EOL;"
    "\$updated = App\\\\Models\\\\Listing::where('tenant_id',1)->whereIn('user_id',\$userIds)->update(['tenant_id'=>2]);"
    "echo 'Listings migrated to tenant 2: ' . \$updated . PHP_EOL;\""
)
print("Migration result:", stdout.read().decode())

# Verify
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\""
    "echo 'tenant 1 listings: ' . App\\\\Models\\\\Listing::where('tenant_id',1)->count();"
    "echo PHP_EOL . 'tenant 2 listings: ' . App\\\\Models\\\\Listing::where('tenant_id',2)->count();\""
)
print("After migration:", stdout.read().decode())
