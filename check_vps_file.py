import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.164.142', username='root', password='Truedial@1111')
stdin, stdout, stderr = ssh.exec_command('cat /var/www/find-my-interior/findmyinterior-frontend/src/components/home/Hero.tsx | grep -i "use current location"')
print("OUTPUT:", stdout.read().decode())
