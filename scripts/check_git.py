import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = 'cd /var/www/find-my-interior && git log -n 1 && docker exec fmi_backend ls -l database/migrations | tail -n 5'
_, stdout, _ = client.exec_command(cmd)
print(stdout.read().decode())
