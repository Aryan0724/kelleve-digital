import paramiko
import os
import sys

hostname = '187.127.164.142'
username = 'root'
password = 'Truedial@1111'

print("Connecting...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname, username=username, password=password)

def run(cmd):
    print(f"> {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out: sys.stdout.write(out + '\n')
    if err: sys.stderr.write(err + '\n')

print("1. Pulling latest code...")
run("cd /var/www/find-my-interior && git remote set-url origin https://github.com/Aryan0724/kelleve-digital.git && git reset --hard HEAD && git pull origin main")

print("2. Setting up Database...")
# The sql dump was pushed via git, so it's already there!
run('docker exec fmi_mysql mysql -u root -psecret -e "DROP DATABASE IF EXISTS findmyinterior_prod_candidate; CREATE DATABASE findmyinterior_prod_candidate;"')
run('docker exec -i fmi_mysql mysql -u root -psecret findmyinterior_prod_candidate < /var/www/find-my-interior/findmyinterior-backend/findmyinterior_prod_candidate.sql')

print("3. Updating backend .env...")
env_update = """
sed -i 's/DB_DATABASE=findmyinterior/DB_DATABASE=findmyinterior_prod_candidate/g' /var/www/find-my-interior/findmyinterior-backend/.env
sed -i 's/DB_CONNECTION=mysql/DB_CONNECTION=fmi_mysql/g' /var/www/find-my-interior/findmyinterior-backend/.env
sed -i 's/DB_HOST=db/DB_HOST=fmi_mysql/g' /var/www/find-my-interior/findmyinterior-backend/.env
"""
run(env_update)

print("4. Rebuilding and restarting containers...")
run("cd /var/www/find-my-interior && docker compose restart")
run("sleep 10") # Give MySQL time to start
run("docker exec fmi_backend php artisan optimize:clear")
# Also rebuild frontend just in case
run("docker exec fmi_frontend bash -c 'CI=1 npm run build'")

print("5. Verifying DB state...")
run('docker exec fmi_backend php artisan tinker --execute="echo config(\'database.default\').PHP_EOL; echo config(\'database.connections.fmi_mysql.database\').PHP_EOL; echo DB::table(\'users\')->count().PHP_EOL; echo DB::table(\'worker_jobs\')->count().PHP_EOL; echo DB::table(\'rfqs\')->count().PHP_EOL;"')

client.close()
print("Done.")
