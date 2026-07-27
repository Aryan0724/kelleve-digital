import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

curl_cmd = """curl -s -X POST http://localhost:8000/api/v1/auth/login -H "Content-Type: application/json" -H "Accept: application/json" -d '{"email":"Aryantiwari@findmyinterior.com","password":"Admin@123!"}'"""
stdin, stdout, stderr = client.exec_command(curl_cmd)
print('LOGIN RESULT:', stdout.read().decode('utf-8'))
