import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)
command = '''docker exec fmi_mysql mysql -u fmi_user -psecret findmyinterior -e "SELECT id, email, tenant_id FROM users WHERE email='Aryantiwari@findmyinterior.com';"'''
stdin, stdout, stderr = client.exec_command(command)
print("STDOUT:", stdout.read().decode('utf-8'))
client.close()
