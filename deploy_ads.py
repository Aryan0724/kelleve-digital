import paramiko
import sys
import io
import json
import time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Step 1: Sync the fixed backend files to VPS
print("=== Step 1: Deploying backend fixes ===")

# Upload the fixed AdvertisementController (Admin)
with open(r'd:\find my interior\findmyinterior-backend\app\Http\Controllers\Api\V1\Admin\AdvertisementController.php', 'r') as f:
    admin_ctrl = f.read()

sftp = client.open_sftp()
with sftp.open('/var/www/find-my-interior/findmyinterior-backend/app/Http/Controllers/Api/V1/Admin/AdvertisementController.php', 'w') as f:
    f.write(admin_ctrl)
print("  Uploaded Admin AdvertisementController")

# Upload the fixed Public AdvertisementController
with open(r'd:\find my interior\findmyinterior-backend\app\Http\Controllers\Api\V1\Public\AdvertisementController.php', 'r') as f:
    pub_ctrl = f.read()

with sftp.open('/var/www/find-my-interior/findmyinterior-backend/app/Http/Controllers/Api/V1/Public/AdvertisementController.php', 'w') as f:
    f.write(pub_ctrl)
print("  Uploaded Public AdvertisementController")

# Upload the new migration
with open(r'd:\find my interior\findmyinterior-backend\database\migrations\2026_07_26_000001_make_banner_url_nullable.php', 'r') as f:
    migration = f.read()

with sftp.open('/var/www/find-my-interior/findmyinterior-backend/database/migrations/2026_07_26_000001_make_banner_url_nullable.php', 'w') as f:
    f.write(migration)
print("  Uploaded migration")
sftp.close()

# Step 2: Run the migration
print("\n=== Step 2: Running migration ===")
stdin, stdout, stderr = client.exec_command(
    'docker exec fmi_backend php artisan migrate --force 2>&1'
)
print(stdout.read().decode('utf-8', errors='replace'))

# Step 3: Clear caches
print("=== Step 3: Clearing caches ===")
stdin, stdout, stderr = client.exec_command(
    'docker exec fmi_backend php artisan config:clear && docker exec fmi_backend php artisan route:clear && docker exec fmi_backend php artisan cache:clear 2>&1'
)
print(stdout.read().decode('utf-8', errors='replace'))

# Step 4: Get admin token
print("\n=== Step 4: Getting admin token ===")
stdin, stdout, stderr = client.exec_command(
    'curl -s -X POST http://localhost:8000/api/v1/auth/login '
    '-H "Content-Type: application/json" '
    '-H "Accept: application/json" '
    '-d \'{"email":"Aryantiwari@findmyinterior.com","password":"Admin@123!"}\''
)
login_resp = json.loads(stdout.read().decode('utf-8', errors='replace'))
token = login_resp['data']['token']
print(f"Token obtained: {token[:20]}...")

# Step 5: Delete existing test ads
print("\n=== Step 5: Cleanup existing ads ===")
stdin, stdout, stderr = client.exec_command(
    f'curl -s http://localhost:8000/api/v1/admin/advertisements '
    f'-H "Authorization: Bearer {token}" '
    f'-H "Accept: application/json"'
)
existing = json.loads(stdout.read().decode('utf-8', errors='replace'))
for ad in existing.get('data', {}).get('data', []):
    stdin, stdout, stderr = client.exec_command(
        f'curl -s -X DELETE http://localhost:8000/api/v1/admin/advertisements/{ad["id"]} '
        f'-H "Authorization: Bearer {token}" '
        f'-H "Accept: application/json"'
    )
    print(f"  Deleted ad {ad['id']}: {ad.get('title', 'Untitled')}")
    stdout.read()

# Step 6: Create fresh test advertisements
print("\n=== Step 6: Creating test advertisements ===")

ads_to_create = [
    {
        "title": "Find My Interior - Bihar No.1 Interior Marketplace",
        "location": "hero_banner",
        "media_type": "html",
        "custom_code": "<div style=\"background: linear-gradient(135deg, #ff6b35 0%, #f7c948 100%); padding: 20px 40px; border-radius: 12px; text-align: center; color: white;\"><h2 style=\"margin: 0; font-size: 24px; font-weight: 800;\">Find My Interior</h2><p style=\"margin: 8px 0 0; font-size: 14px; opacity: 0.9;\">Bihar No.1 Home Improvement and Interior Marketplace | Call: 9534900999</p><p style=\"margin: 4px 0 0; font-size: 12px; opacity: 0.8;\">Usha Niketan, House No.122, Boring Patliputra Road, Patna 800001</p></div>",
        "link": "https://findmyinterior.com",
        "is_active": True,
        "priority": 10
    },
    {
        "title": "20% OFF on Premium Plans - Use code LAUNCH20",
        "location": "top_ribbon",
        "media_type": "html",
        "custom_code": "<div style=\"display:flex;align-items:center;justify-content:center;gap:12px;font-size:14px;\"><span style=\"background:rgba(255,107,53,0.2);color:#ff6b35;font-weight:700;padding:2px 8px;border-radius:4px;font-size:11px;\">OFFER</span><span>Get <strong>20% OFF</strong> on Premium Plans! Use code <strong>LAUNCH20</strong></span><span style=\"opacity:0.6;\">|</span><span>Call <strong>9534900999</strong></span></div>",
        "link": "https://findmyinterior.com/pricing",
        "is_active": True,
        "priority": 10
    },
    {
        "title": "List Your Business on Find My Interior",
        "location": "mid_page",
        "media_type": "html",
        "custom_code": "<div style=\"background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 24px; border-radius: 16px; text-align: center; color: white; border: 1px solid rgba(255,255,255,0.1);\"><h3 style=\"margin: 0; font-size: 20px; font-weight: 700;\">Are You an Interior Professional?</h3><p style=\"margin: 8px 0 16px; font-size: 14px; opacity: 0.8;\">List your business, get verified leads, grow your revenue</p><div style=\"display:inline-block;background:#ff6b35;color:white;padding:10px 24px;border-radius:8px;font-weight:600;font-size:14px;\">Register Now - It is Free!</div><p style=\"margin: 8px 0 0; font-size: 12px; opacity: 0.6;\">Contact: 9534900999 | Patna, Bihar</p></div>",
        "link": "https://findmyinterior.com/register",
        "is_active": True,
        "priority": 5
    },
    {
        "title": "Welcome to Find My Interior!",
        "location": "popup",
        "media_type": "html",
        "custom_code": "<div style=\"background: linear-gradient(135deg, #ff6b35 0%, #e85d26 100%); padding: 32px; text-align: center; color: white;\"><h2 style=\"margin: 0 0 8px; font-size: 28px; font-weight: 800;\">Welcome to Find My Interior!</h2><p style=\"margin: 0 0 16px; font-size: 16px; opacity: 0.9;\">Bihar No.1 Interior Marketplace</p><div style=\"background: white; color: #1e293b; padding: 16px; border-radius: 12px; margin: 16px 0;\"><p style=\"margin: 0 0 4px; font-size: 14px; font-weight: 600;\">Post Your Requirement Now</p><p style=\"margin: 0; font-size: 12px; color: #64748b;\">Get multiple quotes from verified professionals</p></div><p style=\"margin: 12px 0 0; font-size: 13px; opacity: 0.8;\">Call us: 9534900999 | Patna 800001</p></div>",
        "link": "https://findmyinterior.com/post-requirement",
        "is_active": True,
        "priority": 10
    },
    {
        "title": "Havells Premium Interior Solutions",
        "location": "right_sidebar",
        "media_type": "html",
        "custom_code": "<div style=\"background: linear-gradient(135deg, #0052cc 0%, #0747a6 100%); padding: 20px; border-radius: 12px; text-align: center; color: white;\"><h4 style=\"margin: 0; font-size: 16px; font-weight: 700;\">Havells Showroom</h4><p style=\"margin: 6px 0 12px; font-size: 12px; opacity: 0.8;\">Premium Electrical and Interior Solutions</p><div style=\"display:inline-block;background:white;color:#0052cc;padding:8px 16px;border-radius:6px;font-weight:600;font-size:12px;\">Visit Now</div><p style=\"margin: 8px 0 0; font-size: 11px; opacity: 0.6;\">Boring Patliputra Road, Patna</p></div>",
        "link": "https://findmyinterior.com",
        "is_active": True,
        "priority": 5
    },
    {
        "title": "Professional Interior Search Ad",
        "location": "search_feed",
        "media_type": "html",
        "custom_code": "<div style=\"background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 16px 24px; border-radius: 12px; text-align: center; color: #1e293b; border: 1px solid #cbd5e1;\"><p style=\"margin: 0 0 4px; font-size: 13px; font-weight: 600;\">Sponsored | Find My Interior</p><p style=\"margin: 0; font-size: 12px; color: #64748b;\">Compare top-rated professionals near you | Call 9534900999</p></div>",
        "link": "https://findmyinterior.com/professionals",
        "is_active": True,
        "priority": 5
    }
]

for ad_data in ads_to_create:
    payload = json.dumps(ad_data)
    # Write payload to a temp file on the server to avoid shell escaping issues
    stdin2, stdout2, stderr2 = client.exec_command(f"cat > /tmp/ad_payload.json << 'ENDOFPAYLOAD'\n{payload}\nENDOFPAYLOAD")
    stdout2.read()
    
    stdin, stdout, stderr = client.exec_command(
        f'curl -s -X POST http://localhost:8000/api/v1/admin/advertisements '
        f'-H "Authorization: Bearer {token}" '
        f'-H "Content-Type: application/json" '
        f'-H "Accept: application/json" '
        f'-d @/tmp/ad_payload.json'
    )
    resp = stdout.read().decode('utf-8', errors='replace')
    try:
        r = json.loads(resp)
        if r.get('status') == 'success':
            print(f"  Created: {ad_data['title']} ({ad_data['location']}) -> ID {r['data']['id']}")
        else:
            print(f"  FAILED: {ad_data['title']} -> {resp[:300]}")
    except:
        print(f"  ERROR: {ad_data['title']} -> {resp[:300]}")

# Step 7: Verify public API
print("\n=== Step 7: Verify public API returns ads ===")
for loc in ['hero_banner', 'top_ribbon', 'mid_page', 'popup', 'right_sidebar', 'search_feed']:
    stdin, stdout, stderr = client.exec_command(
        f'curl -s "http://localhost:8000/api/v1/advertisements?location={loc}" '
        f'-H "Accept: application/json"'
    )
    resp = stdout.read().decode('utf-8', errors='replace')
    try:
        data = json.loads(resp)
        count = len(data.get('data', []))
        titles = [a.get('title', '') for a in data.get('data', [])]
        print(f"  {loc}: {count} ads -> {titles}")
    except:
        print(f"  {loc}: ERROR -> {resp[:200]}")

client.close()
print("\n=== ALL DONE ===")
