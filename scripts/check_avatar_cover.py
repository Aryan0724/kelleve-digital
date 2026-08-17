import subprocess

php = r"""require 'vendor/autoload.php'; $a = require 'bootstrap/app.php'; $a->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap(); $u = App\Models\User::all(); foreach($u as $user){ if($user->avatar || $user->cover_image){ echo "ID: {$user->id} | Name: {$user->name} | Avatar: {$user->avatar} | Cover: {$user->cover_image}\n"; } } $l = App\Models\Listing::all(); foreach($l as $lis){ if($lis->cover_image){ echo "LISTING ID: {$lis->id} | Cover: {$lis->cover_image}\n"; } }"""

cmd = ['python', 'run_on_vps.py', f'docker exec fmi_backend php -r "{php}"']
res = subprocess.run(cmd, capture_output=True, text=True)
print(res.stdout)
