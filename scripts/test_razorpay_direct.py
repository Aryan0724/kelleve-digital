import urllib.request
import base64
import json

key_id = "rzp_live_TRfrjzfAExcLjs"
key_secret = "OBznnGo3CVenrGsOu3ED2nWe"

auth_str = f"{key_id}:{key_secret}"
b64_auth = base64.b64encode(auth_str.encode()).decode()

req = urllib.request.Request(
    "https://api.razorpay.com/v1/orders",
    headers={
        "Authorization": f"Basic {b64_auth}",
        "Content-Type": "application/json",
    },
    data=json.dumps({
        "amount": 10000,
        "currency": "INR",
        "receipt": "test_receipt_1",
    }).encode(),
    method="POST"
)

try:
    with urllib.request.urlopen(req) as resp:
        print("Success:", resp.status, resp.read().decode())
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code, e.read().decode())
except Exception as e:
    print("Error:", e)
