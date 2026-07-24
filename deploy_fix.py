import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

def run(cmd, timeout=30):
    print(f"\n$ {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout, get_pty=True)
    out = stdout.read().decode('utf-8', errors='replace')
    if out: print(out)
    return out

# Restart with runtime env vars injected
run("docker stop truedial_staging_frontend; docker rm truedial_staging_frontend")
run("""docker run -d \
  --name truedial_staging_frontend \
  -p 3001:3000 \
  --network find-my-interior_fmi-network \
  -e INTERNAL_API_URL=http://fmi_backend:80/api/v1 \
  -e NEXT_PUBLIC_API_URL=http://187.127.164.142:8000/api/v1 \
  truedial-truedial_frontend""")

# Verify env vars are set
run("docker exec truedial_staging_frontend env | grep API")
run("docker ps | grep truedial")

client.close()
print("\n=== DONE ===")
