import subprocess

cmd = ['python', 'run_on_vps.py', r'docker exec fmi_backend php artisan tinker --execute="print_r(\App\Models\User::whereNotNull(\'avatar\')->orWhereNotNull(\'cover_image\')->get()->toArray());"']
res = subprocess.run(cmd, capture_output=True, text=True)
print(res.stdout)
