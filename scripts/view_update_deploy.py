import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')
stdin, stdout, stderr = client.exec_command('cat /var/www/find-my-interior/scripts/update_and_deploy.py')
print(stdout.read().decode())
client.close()
