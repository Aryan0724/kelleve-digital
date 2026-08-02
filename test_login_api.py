import requests

url = "https://findmyinterior.com/api/v1/auth/login"
payload = {
    "email": "Aryantiwari@findmyinterior.com",
    "password": "findmyinterior",
    "device_name": "test"
}
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

print("Testing https://findmyinterior.com/api/v1/auth/login")
try:
    response = requests.post(url, json=payload, headers=headers)
    print(response.status_code)
    print(response.text)
except Exception as e:
    print(f"Error: {e}")

url2 = "https://api.findmyinterior.com/api/v1/auth/login"
print("\\nTesting https://api.findmyinterior.com/api/v1/auth/login")
try:
    response = requests.post(url2, json=payload, headers=headers)
    print(response.status_code)
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
