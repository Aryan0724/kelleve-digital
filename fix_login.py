import sys, paramiko, time
sys.stdout.reconfigure(encoding='utf-8')
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('187.127.164.142', username='root', password='Truedial@1111')

print("=== 1. Current .env.production on VPS ===")
out = c.exec_command("cat /var/www/truedial/.env.production")[1].read().decode('utf-8')
print(out)

print("=== 2. Current env vars INSIDE container ===")
out2 = c.exec_command("docker exec truedial_staging_frontend env | grep -E 'API|INTERNAL|NEXT'")[1].read().decode('utf-8')
print(out2)

print("=== 3. Test if container can reach findmyinterior.com externally ===")
out3 = c.exec_command("docker exec truedial_staging_frontend wget -T 5 -qO- http://187.127.164.142:8000/api/v1/categories 2>&1 | head -c 100")[1].read().decode('utf-8')
print("Container -> host IP:8000:", out3 or "TIMEOUT/FAILED")

print("\n=== 4. Update .env.production with INTERNAL_API_URL ===")
c.exec_command("""printf 'NEXT_PUBLIC_API_URL=https://findmyinterior.com/api/v1\\nINTERNAL_API_URL=http://172.17.0.1:8000/api/v1\\nNODE_ENV=production\\n' > /var/www/truedial/.env.production""")
out4 = c.exec_command("cat /var/www/truedial/.env.production")[1].read().decode('utf-8')
print("Updated .env.production:", out4)

print("=== 5. Recreate container (not just restart) to pick up new env vars ===")
out5 = c.exec_command("cd /var/www/truedial && docker compose up -d 2>&1")[1].read().decode('utf-8', errors='replace')
print(out5[:300])
time.sleep(3)

print("=== 6. Verify INTERNAL_API_URL is now in container ===")
out6 = c.exec_command("docker exec truedial_staging_frontend env | grep -E 'API|INTERNAL|NEXT'")[1].read().decode('utf-8')
print(out6)

print("=== 7. Test login via proxy after recreate ===")
time.sleep(2)
out7 = c.exec_command("curl -s http://localhost:3001/api/auth/login -X POST -H 'Content-Type: application/json' -d '{\"email\":\"admin@truedial.com\",\"password\":\"Truedial@1111\"}'")[1].read().decode('utf-8')
print(out7[:300])

c.close()
