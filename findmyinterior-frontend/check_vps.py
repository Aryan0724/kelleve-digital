import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.164.142', username='root', password='Truedial@1111')

stdin, stdout, stderr = ssh.exec_command('pm2 list; cat /var/www/find-my-interior/findmyinterior-frontend/package.json')
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())

ssh.close()
