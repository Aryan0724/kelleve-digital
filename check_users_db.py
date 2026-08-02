import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)
command = '''docker exec fmi_mysql mysql -u truedial -ptruedial123 truedial -e "SELECT id, email, tenant_id FROM users;"'''
stdin, stdout, stderr = client.exec_command(command)
print("STDOUT:", stdout.read().decode('utf-8'))
client.close()
