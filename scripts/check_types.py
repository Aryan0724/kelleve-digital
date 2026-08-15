import paramiko

migration_script = r"""<?php
define('LARAVEL_START', microtime(true));
require '/var/www/html/vendor/autoload.php';
$app = require_once '/var/www/html/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
use Illuminate\Support\Facades\DB;

// Show all distinct professional_types
$types = DB::table('users')->select('professional_type')->distinct()->whereNotNull('professional_type')->pluck('professional_type');
echo "All professional_types:\n";
echo implode(', ', $types->toArray()) . "\n\n";

// Show all roles
$roles = DB::table('roles')->get();
echo "All roles:\n";
foreach($roles as $r) {
    echo "  id={$r->id} slug={$r->slug} name={$r->name}\n";
}

// Show distinct user roles
$userRoles = DB::table('user_roles')->join('roles','roles.id','=','user_roles.role_id')->select('roles.slug', DB::raw('count(*) as cnt'))->groupBy('roles.slug')->get();
echo "\nUser role counts:\n";
foreach($userRoles as $ur) {
    echo "  {$ur->slug}: {$ur->cnt}\n";
}

// Show listings with tenant_id = 2
$listings = DB::table('listings')->where('tenant_id', 2)->join('users','users.id','=','listings.user_id')->select('listings.id','listings.title','listings.tenant_id','users.professional_type','users.email')->get();
echo "\nCurrent tenant_id=2 listings:\n";
foreach($listings as $l) {
    echo "  [{$l->id}] {$l->title} | type={$l->professional_type} | {$l->email}\n";
}

// The user Zee Interior / Ghar Nirman
$users = DB::table('users')->whereIn('email',['zeeinterior@gmail.com','gharnirmanindia@gmail.com'])->get(['id','name','email','professional_type']);
echo "\nTrueDial test users:\n";
foreach($users as $u) {
    echo "  [{$u->id}] {$u->name} | type={$u->professional_type} | email={$u->email}\n";
    // Check their listings
    $userListings = DB::table('listings')->where('user_id',$u->id)->get(['id','title','tenant_id']);
    foreach($userListings as $ul) {
        echo "    Listing [{$ul->id}] {$ul->title} | tenant={$ul->tenant_id}\n";
    }
}
"""

with open('scripts/migrate_tenants_temp.php', 'w') as f:
    f.write(migration_script)

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

sftp = client.open_sftp()
sftp.put('scripts/migrate_tenants_temp.php', '/tmp/check_types.php')
sftp.close()

client.exec_command('docker cp /tmp/check_types.php fmi_backend:/tmp/check_types.php')[1].read()
_, stdout, stderr = client.exec_command('docker exec fmi_backend php /tmp/check_types.php')
print(stdout.read().decode())
err = stderr.read().decode()
if err:
    print("ERRORS:", err[:500])
