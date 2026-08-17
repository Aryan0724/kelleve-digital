import requests
import json
import base64

token = "81|iplc9xRA5y3ZjrzqyWKyIjPgqHTm0d752kfUy6tK68b3f33d"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

profile_id = 1235

# Generate a ~8MB fake image base64 string (approx 10.6MB payload string)
raw_bytes = b"X" * (8 * 1024 * 1024)
large_base64 = "data:image/jpeg;base64," + base64.b64encode(raw_bytes).decode('ascii')

print(f"Sending payload of size: {len(large_base64) / (1024*1024):.2f} MB")

payload = {
    "images": [
        {
            "data": large_base64,
            "caption": "large_test_image_8mb.jpg"
        }
    ]
}

try:
    upload_res = requests.post(f"https://187.127.164.142/api/v1/user/listings/{profile_id}/gallery", headers=headers, json=payload, verify=False, timeout=30)
    print("UPLOAD STATUS:", upload_res.status_code)
    print("UPLOAD RESP:", upload_res.text[:500])
except Exception as e:
    print("UPLOAD ERROR:", e)
