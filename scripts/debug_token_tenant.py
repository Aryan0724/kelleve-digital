import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Check the token model name
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\"echo json_encode(Laravel\\\\Sanctum\\\\PersonalAccessToken::orderByDesc('id')->take(3)->get(['id','tokenable_id','name','last_used_at'])->toArray());\""
)
print("=== RECENT TOKENS ===")
print(stdout.read().decode())

# Check what tenant_id the new listings need
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\"echo json_encode(DB::table('tenants')->get()->toArray());\""
)
print("=== TENANTS ===")
print(stdout.read().decode())

# How does the forCurrentTenant scope work?
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\"echo json_encode(DB::table('listings')->select('id','user_id','title','tenant_id','status')->take(5)->get()->toArray());\""
)
print("=== FIRST 5 LISTINGS ===")
print(stdout.read().decode())

# Check user info for token 63
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\"echo json_encode(App\\\\Models\\\\User::find(1)->only(['id','name','email','professional_type']));\""
)
print("=== USER 1 ===")
print(stdout.read().decode())

# Check TenantContext
