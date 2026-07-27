import paramiko
import sys
import io
import json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Step 1: Run pending migrations for advertisements
print("=== Step 1: Run migrations ===")
stdin, stdout, stderr = client.exec_command(
    'docker exec fmi_backend php artisan migrate --force 2>&1'
)
print(stdout.read().decode('utf-8', errors='replace'))

# Step 2: Login and get a token
print("\n=== Step 2: Get admin token ===")
stdin, stdout, stderr = client.exec_command(
    '''curl -s -X POST http://localhost:8000/api/v1/auth/login '''
    '''-H "Content-Type: application/json" '''
    '''-H "Accept: application/json" '''
    '''-d '{"email":"Aryantiwari@findmyinterior.com","password":"Admin@123!"}'  '''
)
login_resp = json.loads(stdout.read().decode('utf-8', errors='replace'))
token = login_resp['data']['token']
print(f"Token: {token[:20]}...")

# Step 3: Check existing advertisements
print("\n=== Step 3: Check existing ads ===")
stdin, stdout, stderr = client.exec_command(
    f'curl -s http://localhost:8000/api/v1/admin/advertisements '
    f'-H "Authorization: Bearer {token}" '
    f'-H "Accept: application/json"'
)
ads_resp = stdout.read().decode('utf-8', errors='replace')
print("Current ads:", ads_resp[:500])

# Step 4: Create a test Hero Banner Ad using HTML type (no image needed)
print("\n=== Step 4: Creating test Hero Banner ad ===")
ad_data = json.dumps({
    "title": "Find My Interior - Bihar's No.1 Interior Marketplace",
    "location": "hero_banner",
    "media_type": "html",
    "custom_code": '<div style="background: linear-gradient(135deg, #ff6b35 0%, #f7c948 100%); padding: 20px 40px; border-radius: 12px; text-align: center; color: white;"><h2 style="margin: 0; font-size: 24px; font-weight: 800;">Find My Interior</h2><p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Bihar\'s No.1 Home Improvement & Interior Marketplace | Call: 9534900999</p><p style="margin: 4px 0 0; font-size: 12px; opacity: 0.8;">Usha Niketan, House No.122, Boring Patliputra Road, Near Bank of Baroda, Above Havells Showroom, Patna 800001</p></div>',
    "link": "https://findmyinterior.com",
    "is_active": True,
    "priority": 10
})
stdin, stdout, stderr = client.exec_command(
    f"curl -s -X POST http://localhost:8000/api/v1/admin/advertisements "
    f"-H 'Authorization: Bearer {token}' "
    f"-H 'Content-Type: application/json' "
    f"-H 'Accept: application/json' "
    f"-d '{ad_data}'"
)
print("Hero banner:", stdout.read().decode('utf-8', errors='replace'))

# Step 5: Create a Top Ribbon Ad
print("\n=== Step 5: Creating test Top Ribbon ad ===")
ribbon_data = json.dumps({
    "title": "Get 20% OFF on Premium Plans! Use code LAUNCH20 | Call 9534900999",
    "location": "top_ribbon",
    "media_type": "html",
    "custom_code": '<div style="display:flex;align-items:center;justify-content:center;gap:12px;font-size:14px;"><span style="background:rgba(255,107,53,0.2);color:#ff6b35;font-weight:700;padding:2px 8px;border-radius:4px;font-size:11px;">OFFER</span><span>Get <strong>20% OFF</strong> on Premium Plans! Use code <strong>LAUNCH20</strong></span><span style="opacity:0.6;">|</span><span>Call <strong>9534900999</strong></span></div>',
    "link": "https://findmyinterior.com/pricing",
    "is_active": True,
    "priority": 10
})
stdin, stdout, stderr = client.exec_command(
    f"curl -s -X POST http://localhost:8000/api/v1/admin/advertisements "
    f"-H 'Authorization: Bearer {token}' "
    f"-H 'Content-Type: application/json' "
    f"-H 'Accept: application/json' "
    f"-d '{ribbon_data}'"
)
print("Top ribbon:", stdout.read().decode('utf-8', errors='replace'))

# Step 6: Create a Mid Page Ad
print("\n=== Step 6: Creating test Mid Page ad ===")
mid_data = json.dumps({
    "title": "List Your Business on Find My Interior",
    "location": "mid_page",
    "media_type": "html",
    "custom_code": '<div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 24px; border-radius: 16px; text-align: center; color: white; border: 1px solid rgba(255,255,255,0.1);"><h3 style="margin: 0; font-size: 20px; font-weight: 700;">Are You an Interior Professional?</h3><p style="margin: 8px 0 16px; font-size: 14px; opacity: 0.8;">List your business, get verified leads, grow your revenue</p><div style="display:inline-block;background:#ff6b35;color:white;padding:10px 24px;border-radius:8px;font-weight:600;font-size:14px;">Register Now - It\'s Free!</div><p style="margin: 8px 0 0; font-size: 12px; opacity: 0.6;">Contact: 9534900999 | Patna, Bihar</p></div>',
    "link": "https://findmyinterior.com/register",
    "is_active": True,
    "priority": 5
})
stdin, stdout, stderr = client.exec_command(
    f"curl -s -X POST http://localhost:8000/api/v1/admin/advertisements "
    f"-H 'Authorization: Bearer {token}' "
    f"-H 'Content-Type: application/json' "
    f"-H 'Accept: application/json' "
    f"-d '{mid_data}'"
)
print("Mid page:", stdout.read().decode('utf-8', errors='replace'))

# Step 7: Create a Popup Ad
print("\n=== Step 7: Creating test Popup ad ===")
popup_data = json.dumps({
    "title": "Welcome to Find My Interior!",
    "location": "popup",
    "media_type": "html",
    "custom_code": '<div style="background: linear-gradient(135deg, #ff6b35 0%, #e85d26 100%); padding: 32px; text-align: center; color: white;"><h2 style="margin: 0 0 8px; font-size: 28px; font-weight: 800;">Welcome to Find My Interior!</h2><p style="margin: 0 0 16px; font-size: 16px; opacity: 0.9;">Bihar\'s No.1 Interior Marketplace</p><div style="background: white; color: #1e293b; padding: 16px; border-radius: 12px; margin: 16px 0;"><p style="margin: 0 0 4px; font-size: 14px; font-weight: 600;">Post Your Requirement Now</p><p style="margin: 0; font-size: 12px; color: #64748b;">Get multiple quotes from verified professionals</p></div><p style="margin: 12px 0 0; font-size: 13px; opacity: 0.8;">Call us: 9534900999 | Patna 800001</p></div>',
    "link": "https://findmyinterior.com/post-requirement",
    "is_active": True,
    "priority": 10
})
stdin, stdout, stderr = client.exec_command(
    f"curl -s -X POST http://localhost:8000/api/v1/admin/advertisements "
    f"-H 'Authorization: Bearer {token}' "
    f"-H 'Content-Type: application/json' "
    f"-H 'Accept: application/json' "
    f"-d '{popup_data}'"
)
print("Popup:", stdout.read().decode('utf-8', errors='replace'))

# Step 8: Verify public API returns ads
print("\n=== Step 8: Verify public API returns ads ===")
for loc in ['hero_banner', 'top_ribbon', 'mid_page', 'popup']:
    stdin, stdout, stderr = client.exec_command(
        f'curl -s "http://localhost:8000/api/v1/advertisements?location={loc}" '
        f'-H "Accept: application/json"'
    )
    resp = stdout.read().decode('utf-8', errors='replace')
    try:
        data = json.loads(resp)
        count = len(data.get('data', []))
        print(f"  {loc}: {count} ads found")
    except:
        print(f"  {loc}: ERROR - {resp[:200]}")

client.close()
print("\n=== DONE ===")
