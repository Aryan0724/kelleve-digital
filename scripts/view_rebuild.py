import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')
stdin, stdout, stderr = client.exec_command('cat /var/www/find-my-interior/scripts/rebuild_truedial.py')
print(stdout.read().decode())
client.close()
