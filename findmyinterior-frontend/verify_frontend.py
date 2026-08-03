import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.164.142', username='root', password='Truedial@1111')

stdin, stdout, stderr = ssh.exec_command('docker ps | grep fmi_frontend')
print("STDOUT:", stdout.read().decode('ascii', errors='ignore'))
print("STDERR:", stderr.read().decode('ascii', errors='ignore'))

ssh.close()
