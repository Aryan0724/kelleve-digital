import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.164.142', username='root', password='Truedial@1111')

stdin, stdout, stderr = ssh.exec_command('tail -n 20 /var/www/find-my-interior/frontend_build.log')
print("STDOUT:", stdout.read().decode('utf-8', errors='ignore'))
print("STDERR:", stderr.read().decode('utf-8', errors='ignore'))

ssh.close()
