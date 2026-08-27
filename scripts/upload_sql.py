import paramiko
import os

hostname = '187.127.164.142'
username = 'root'
password = 'Truedial@1111'

print("Connecting...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname, username=username, password=password)

print("Opening SFTP...")
sftp = client.open_sftp()
local_path = r"d:\find my interior\findmyinterior-backend\findmyinterior_prod_candidate_utf8.sql"
remote_path = "/var/www/find-my-interior/findmyinterior-backend/findmyinterior_prod_candidate_utf8.sql"

print(f"Uploading {local_path} to {remote_path}...")
sftp.put(local_path, remote_path)
sftp.close()
print("Upload complete.")

def run(cmd):
    print(f"> {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out: print(out)
    if err: print(err)

print("Importing database...")
run('docker exec fmi_mysql mysql -u root -psecret -e "DROP DATABASE IF EXISTS findmyinterior_prod_candidate; CREATE DATABASE findmyinterior_prod_candidate;"')
run('docker exec -i fmi_mysql mysql -u root -psecret findmyinterior_prod_candidate < /var/www/find-my-interior/findmyinterior-backend/findmyinterior_prod_candidate_utf8.sql')

print("Verifying DB state...")
run('docker exec fmi_backend php artisan tinker --execute="echo config(\'database.default\').PHP_EOL; echo config(\'database.connections.fmi_mysql.database\').PHP_EOL; echo DB::table(\'users\')->count().PHP_EOL; echo DB::table(\'worker_jobs\')->count().PHP_EOL; echo DB::table(\'rfqs\')->count().PHP_EOL;"')

client.close()
print("Done.")
