import paramiko

TOKEN = "67|foPpeJkEtftjB2uG565IkEwset7KeKCJ86NjwiaEfb9bfb39"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

print("=== Test 1: GET /api/v1/truedial/vendor/my-business WITHOUT X-Tenant-ID ===")
print("(Should get tenant_id=1 scope -> wrong result before fix)")
_, stdout, _ = client.exec_command(
    f'docker exec fmi_backend curl -s http://localhost/api/v1/truedial/vendor/my-business '
    f'-H "Authorization: Bearer {TOKEN}" -H "Accept: application/json"'
)
print(stdout.read().decode())

print("\n=== Test 2: GET /api/v1/truedial/vendor/my-business WITH X-Tenant-ID:2 ===")
print("(Should find listing under tenant_id=2 after fix)")
_, stdout, _ = client.exec_command(
    f'docker exec fmi_backend curl -s http://localhost/api/v1/truedial/vendor/my-business '
    f'-H "Authorization: Bearer {TOKEN}" -H "Accept: application/json" -H "X-Tenant-ID: 2"'
)
result2 = stdout.read().decode()
print(result2)

print("\n=== Test 3: PUT /api/v1/truedial/vendor/businesses/1231 WITH X-Tenant-ID:2 ===")
print("(Should UPDATE listing 1231 which belongs to Zee Interior)")
_, stdout, _ = client.exec_command(
    f'docker exec fmi_backend curl -s -X PUT http://localhost/api/v1/truedial/vendor/businesses/1231 '
    f'-H "Authorization: Bearer {TOKEN}" -H "Accept: application/json" '
    f'-H "Content-Type: application/json" -H "X-Tenant-ID: 2" '
    f'-d \'{{"title":"Zee Interior Design Studio","professional_type":"interior_company"}}\''
)
print(stdout.read().decode())

print("\n=== Test 4: Direct call from VPS nginx (simulating Vercel proxy) ===")
_, stdout, _ = client.exec_command(
    f'curl -s http://127.0.0.1:8000/api/v1/truedial/vendor/my-business '
    f'-H "Authorization: Bearer {TOKEN}" -H "Accept: application/json" -H "X-Tenant-ID: 2"'
)
print(stdout.read().decode())
