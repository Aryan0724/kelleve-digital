import paramiko, sys, time
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=120)

# Read current compose file
stdin, stdout, stderr = client.exec_command('cat /var/www/find-my-interior/docker-compose.yml')
content = stdout.read().decode('utf-8')

# Remove the problematic volume mounts for the frontend service
# Replace the volumes section for frontend
old_volumes = '''    volumes:
      - ./findmyinterior-frontend:/app
      - /app/node_modules
      - /app/.next
    networks:
      - fmi-network

  # Redis for Queue & Cache'''

new_volumes = '''    networks:
      - fmi-network

  # Redis for Queue & Cache'''

if old_volumes in content:
    new_content = content.replace(old_volumes, new_volumes)
    print("Volume section found and replaced")
else:
    print("WARNING: Could not find exact volume section. Content near frontend:")
    idx = content.find('fmi_frontend')
    print(content[max(0,idx-100):idx+500])
    new_content = content

# Write the updated file
stdin, stdout, stderr = client.exec_command('cat > /var/www/find-my-interior/docker-compose.yml << \'ENDOFFILE\'\n' + new_content + '\nENDOFFILE')
ch = stdout.channel
while not ch.exit_status_ready():
    time.sleep(1)
out = stdout.read().decode('utf-8')
err = stderr.read().decode('utf-8')
print("Write result:", out or err or "OK")

# Verify
stdin, stdout, stderr = client.exec_command('grep -A 20 "fmi_frontend" /var/www/find-my-interior/docker-compose.yml')
print("=== Updated frontend section ===")
print(stdout.read().decode('utf-8'))

client.close()
