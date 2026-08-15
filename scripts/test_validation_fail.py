import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

TOKEN = "67|foPpeJkEtftjB2uG565IkEwset7KeKCJ86NjwiaEfb9bfb39"

payload = """{
  "title": "integral groups",
  "description": "xyz",
  "phone": "",
  "address": "",
  "website": "",
  "availability": "09:00 AM to 06:00 PM",
  "response_time": "under_1_hour",
  "professional_type": "restaurant",
  "social_links": {
    "facebook": "",
    "instagram": "",
    "linkedin": "",
    "twitter": ""
  },
  "services": []
}"""

_, stdout, _ = client.exec_command(
    f'docker exec fmi_backend curl -s -X PUT http://localhost/api/v1/truedial/vendor/businesses/1231 '
    f'-H "Authorization: Bearer {TOKEN}" -H "Accept: application/json" '
    f'-H "Content-Type: application/json" -H "X-Tenant-ID: 2" '
    f'-d \'{payload}\''
)
print("=== VALIDATION RESPONSE (SHOULD FAIL) ===")
print(stdout.read().decode())
