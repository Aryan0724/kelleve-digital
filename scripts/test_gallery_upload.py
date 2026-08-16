import requests
import json

token = "81|iplc9xRA5y3ZjrzqyWKyIjPgqHTm0d752kfUy6tK68b3f33d"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

# 1. Get profile
res = requests.get("https://187.127.164.142/api/v1/user/professional-profile", headers=headers, verify=False)
print("PROFILE RESP:", json.dumps(res.json(), indent=2)[:500])

data = res.json()
profile_id = data.get("data", {}).get("id")
print("\nPROFILE ID:", profile_id)

if profile_id:
    # 2. Upload image
    fake_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    payload = {
        "images": [
            {
                "data": fake_base64,
                "caption": "test_image.png"
            }
        ]
    }
    upload_res = requests.post(f"https://187.127.164.142/api/v1/user/listings/{profile_id}/gallery", headers=headers, json=payload, verify=False)
    print("\nUPLOAD STATUS:", upload_res.status_code)
    print("UPLOAD RESP:", upload_res.text)
