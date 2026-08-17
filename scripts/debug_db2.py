import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Check all users with simpler command
_, stdout, stderr = client.exec_command(
    "docker exec fmi_backend mysql -u$(grep DB_USERNAME /var/www/html/.env | cut -d= -f2) -p$(grep DB_PASSWORD /var/www/html/.env | cut -d= -f2) $(grep DB_DATABASE /var/www/html/.env | cut -d= -f2) -e 'SELECT id, name, email, professional_type, created_at FROM users LIMIT 20;' 2>/dev/null"
)
print("=== USERS TABLE ===")
print(stdout.read().decode())

# Check listings
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend mysql -u$(grep DB_USERNAME /var/www/html/.env | cut -d= -f2) -p$(grep DB_PASSWORD /var/www/html/.env | cut -d= -f2) $(grep DB_DATABASE /var/www/html/.env | cut -d= -f2) -e 'SELECT id, user_id, title, status, tenant_id FROM listings LIMIT 20;' 2>/dev/null"
)
print("=== LISTINGS TABLE ===")
print(stdout.read().decode())

# Check roles table
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend mysql -u$(grep DB_USERNAME /var/www/html/.env | cut -d= -f2) -p$(grep DB_PASSWORD /var/www/html/.env | cut -d= -f2) $(grep DB_DATABASE /var/www/html/.env | cut -d= -f2) -e 'SELECT * FROM roles;' 2>/dev/null"
)
print("=== ROLES TABLE ===")
print(stdout.read().decode())

# Check user_roles pivot
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend mysql -u$(grep DB_USERNAME /var/www/html/.env | cut -d= -f2) -p$(grep DB_PASSWORD /var/www/html/.env | cut -d= -f2) $(grep DB_DATABASE /var/www/html/.env | cut -d= -f2) -e 'SELECT ur.user_id, r.slug FROM user_roles ur JOIN roles r ON r.id = ur.role_id LIMIT 20;' 2>/dev/null"
)
print("=== USER_ROLES TABLE ===")
print(stdout.read().decode())

# Check X-Tenant-ID handling in TenantContext
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend mysql -u$(grep DB_USERNAME /var/www/html/.env | cut -d= -f2) -p$(grep DB_PASSWORD /var/www/html/.env | cut -d= -f2) $(grep DB_DATABASE /var/www/html/.env | cut -d= -f2) -e 'SHOW TABLES;' 2>/dev/null"
)
print("=== ALL TABLES ===")
print(stdout.read().decode())
