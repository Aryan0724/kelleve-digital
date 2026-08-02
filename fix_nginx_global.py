import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=60)

stdin, stdout, stderr = client.exec_command("docker exec fmi_nginx sed -i '/http {/a \\    client_max_body_size 50M;' /etc/nginx/nginx.conf")
print(stdout.read().decode('utf-8'))
stderr.read()

client.exec_command("docker restart fmi_nginx").channel.recv_exit_status()
print("fmi_nginx restarted")

client.close()
