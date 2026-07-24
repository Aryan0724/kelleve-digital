import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = """curl -k -s -w "\\nHTTP_CODE: %{http_code}\\n" -X POST -H "Content-Type: application/json" -d '{"name":"Test User","email":"test12345@test.com","phone":"9876543210","password":"password123","password_confirmation":"password123","role":"civil_engineer"}' https://localhost/api/v1/auth/register"""

stdin, stdout, stderr = client.exec_command(cmd)
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())
