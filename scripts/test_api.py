import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

_, stdout, _ = client.exec_command("docker exec findmyinterior-app php artisan tinker --execute=\"echo App\\Models\\User::first()->createToken('test')->plainTextToken;\"")
token = stdout.read().decode('utf-8').strip()

print(f"Token: {token}")

if token:
    _, stdout, _ = client.exec_command(f"curl -s -X PUT http://localhost/api/v1/truedial/vendor/businesses/1 -H 'Authorization: Bearer {token}' -H 'Content-Type: application/json' -H 'Accept: application/json' -d '{{\"title\": \"Test\"}}'")
    print(stdout.read().decode('utf-8'))
