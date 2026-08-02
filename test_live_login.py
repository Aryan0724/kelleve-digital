import requests
url = "https://findmyinterior.com/api/v1/auth/login"
data = {
    "email": "Aryantiwari@findmyinterior.com",
    "password": "findmyinterior"
}
headers = {
    "Accept": "application/json"
}
try:
    response = requests.post(url, json=data, headers=headers, timeout=10)
    print("Status:", response.status_code)
    print("Response:", response.text)
except Exception as e:
    print("Error:", e)
