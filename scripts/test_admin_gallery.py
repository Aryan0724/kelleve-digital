import requests

token = "83|FWUiwW0KZTGuNZPzt6wAePlRQEyYnOCkbMoDzmik2afb306e"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

fake_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
payload = {
    "images": [
        {
            "data": fake_base64,
            "caption": "Admin Test Portfolio Image"
        }
    ]
}

res = requests.post("https://187.127.164.142/api/v1/user/listings/1637/gallery", headers=headers, json=payload, verify=False)
print("GALLERY UPLOAD STATUS:", res.status_code)
print("GALLERY UPLOAD RESP:", res.text)
