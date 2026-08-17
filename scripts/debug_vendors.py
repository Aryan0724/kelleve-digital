import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Check recent vendor registrations on TRUEDIAL (tenant_id = 2)  
# token 66 belongs to user 2306, token 64 to user 2312
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\"echo json_encode(App\\\\Models\\\\User::whereIn('id',[2306,2312])->get(['id','name','email','professional_type','created_at'])->toArray());\""
)
print("=== RECENT USERS (token holders) ===")
print(stdout.read().decode())

# Check if these users have listings
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\"echo json_encode(DB::table('listings')->whereIn('user_id',[2306,2312])->get(['id','user_id','title','tenant_id','status'])->toArray());\""
)
print("=== LISTINGS FOR THESE USERS ===")
print(stdout.read().decode())

# See what their roles are
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\"echo json_encode(DB::table('user_roles')->join('roles','roles.id','=','user_roles.role_id')->whereIn('user_roles.user_id',[2306,2312])->get(['user_roles.user_id','roles.slug'])->toArray());\""
)
print("=== ROLES FOR THESE USERS ===")
print(stdout.read().decode())

# Check how TenantContext determines the tenant from a request
# The request goes through middleware which sets tenant from X-Tenant-ID header
# Let's see what the actual middleware does
_, stdout, _ = client.exec_command(
    "find /var/www/find-my-interior/findmyinterior-backend/app -name 'TenantContext.php' 2>/dev/null | head -5; find /var/www/find-my-interior/findmyinterior-backend/app -name '*Tenant*' 2>/dev/null | head -10"
)
print("=== TENANT FILES ON VPS ===")
print(stdout.read().decode())
