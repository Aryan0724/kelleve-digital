import requests

TOKEN = "67|foPpeJkEtftjB2uG565IkEwset7KeKCJ86NjwiaEfb9bfb39"
URL = "https://kelleve-digital.vercel.app/api/proxy/truedial/vendor/businesses/1231"

payload = {
  "title": "integral groups",
  "description": "xyz",
  "phone": "9534900999",
  "address": "test address",
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
}

headers = {
    "Cookie": f"auth_token={TOKEN}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

print("=== VERCEL PROXY TEST ===")
response = requests.put(URL, json=payload, headers=headers)
print("Status Code:", response.status_code)
print("Response:", response.text)
