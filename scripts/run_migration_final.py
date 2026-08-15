import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

sftp = client.open_sftp()
sftp.put('scripts/migrate_tenants_temp.php', '/tmp/migrate_tenants.php')
sftp.close()

client.exec_command('docker cp /tmp/migrate_tenants.php fmi_backend:/tmp/migrate_tenants.php')[1].read()
_, stdout, stderr = client.exec_command('docker exec fmi_backend php /tmp/migrate_tenants.php')
print(stdout.read().decode())
err = stderr.read().decode()
if err:
    print("ERRORS:", err[:500])
