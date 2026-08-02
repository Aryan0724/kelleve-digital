import paramiko, sys, time
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=600)

# The key fix: Remove volume mounts from the frontend service so the built image is used
# Read the current compose file
stdin, stdout, stderr = client.exec_command('cat /var/www/find-my-interior/docker-compose.yml')
compose_content = stdout.read().decode('utf-8')
print("=== Current frontend volumes section ===")
import re
# Find volumes in frontend section
match = re.search(r'(# Next.js Frontend.*?networks:.*?fmi-network)', compose_content, re.DOTALL)
if match:
    print(match.group(0)[:800])

client.close()
