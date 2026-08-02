import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.164.142', username='root', password='Truedial@1111')
stdin, stdout, stderr = ssh.exec_command('docker run --rm find-my-interior-frontend stat .next/server/app/index.html')
print("OUTPUT:", stdout.read().decode())
