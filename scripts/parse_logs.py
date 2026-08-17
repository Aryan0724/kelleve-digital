import subprocess

cmd = ['python', 'run_on_vps.py', 'docker exec fmi_backend php -r "echo file_get_contents(\'storage/logs/laravel.log\');"']
res = subprocess.run(cmd, capture_output=True, text=True)
with open('scratch/log_output.txt', 'w', encoding='utf-8') as f:
    f.write(res.stdout)
print("Wrote log output, length:", len(res.stdout))
