import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Check DB using artisan tinker properly 
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\"echo 'users: ' . App\\\\Models\\\\User::count(); echo ' listings: ' . App\\\\Models\\\\Listing::count();\""
)
print("=== COUNTS ===")
print(stdout.read().decode())

# Check if migration for professional_type exists
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\"echo 'has professional_type: ' . implode(',', array_map(fn(\$c) => \$c->Field, DB::select(\\\"SHOW COLUMNS FROM users LIKE 'professional_type'\\\")));\""
)
print("=== PROFESSIONAL_TYPE COL ===")
print(stdout.read().decode())

# Check if tenant_id col exists on listings
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\"echo json_encode(array_map(fn(\$c) => \$c->Field, DB::select('SHOW COLUMNS FROM listings')));\""
)
print("=== LISTINGS COLUMNS ===")
print(stdout.read().decode())

# Check actual user data with correct token user
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\"\$token = App\\\\Models\\\\PersonalAccessToken::where('tokenable_id', '!=', null)->first(); if(\$token) { echo json_encode([\$token->tokenable_id, App\\\\Models\\\\User::find(\$token->tokenable_id)?->only(['id','name','email','professional_type'])]); } else echo 'no tokens';\""
)
print("=== FIRST TOKEN USER ===")
print(stdout.read().decode())
