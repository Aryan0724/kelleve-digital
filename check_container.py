import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.164.142', username='root', password='Truedial@1111')
stdin, stdout, stderr = ssh.exec_command('docker exec fmi_frontend cat .next/server/app/index.html | grep -i "use current location"')
print("OUTPUT:", stdout.read().decode())
