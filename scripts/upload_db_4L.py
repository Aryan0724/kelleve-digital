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
local_path = r"d:\find my interior\findmyinterior-backend\findmyinterior_prod_candidate.sql"
remote_path = "/var/www/find-my-interior/findmyinterior_prod_candidate.sql"

print(f"Uploading {local_path} to {remote_path}...")
sftp.put(local_path, remote_path)
sftp.close()
print("Upload complete.")

def run(cmd):
    print(f"> {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    print(stdout.read().decode())
    print(stderr.read().decode())

print("Creating database and importing data...")
run('docker exec db mysql -u root -psecret -e "DROP DATABASE IF EXISTS findmyinterior_prod_candidate; CREATE DATABASE findmyinterior_prod_candidate;"')
run('docker exec -i db mysql -u root -psecret findmyinterior_prod_candidate < /var/www/find-my-interior/findmyinterior_prod_candidate.sql')

# Also update the backend .env file to use the new connection settings
env_update = """
sed -i 's/DB_DATABASE=findmyinterior/DB_DATABASE=findmyinterior_prod_candidate/g' /var/www/find-my-interior/findmyinterior-backend/.env
sed -i 's/DB_CONNECTION=mysql/DB_CONNECTION=fmi_mysql/g' /var/www/find-my-interior/findmyinterior-backend/.env
"""
run(env_update)

client.close()
print("Done.")
