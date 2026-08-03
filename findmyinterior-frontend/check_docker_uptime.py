import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.164.142', username='root', password='Truedial@1111')

stdin, stdout, stderr = ssh.exec_command('docker ps -a | grep fmi_frontend')
# Safe print without unicode errors
print("STDOUT:", stdout.read().decode('utf-8', errors='ignore'))

ssh.close()
