import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

stdin, stdout, stderr = client.exec_command("curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/admin")
print("HTTP Status Code:", stdout.read().decode().strip())
