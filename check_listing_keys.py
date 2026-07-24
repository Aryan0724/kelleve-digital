import paramiko
import json

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = """docker exec fmi_backend php artisan tinker --execute="echo json_encode(\\App\\Models\\Listing::with('user')->first()->toArray());" """
stdin, stdout, stderr = client.exec_command(cmd)
try:
    data = json.loads(stdout.read().decode())
    print("KEYS:", data.keys())
    if 'user' in data:
        print("USER KEYS:", data['user'].keys())
except Exception as e:
    print("Error:", e, stdout.read().decode(), stderr.read().decode())
