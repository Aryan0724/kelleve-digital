import paramiko
import sys
import time

hostname = '187.127.164.142'
username = 'root'
password = 'Truedial@1111'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    client.connect(hostname, username=username, password=password, timeout=10)
except Exception as e:
    print(f"Connection failed: {e}")
    sys.exit(1)

def run(cmd):
    print(f"> {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    status = stdout.channel.recv_exit_status()
    if out: print(out)
    if err: print(err)
    if status != 0:
        print(f"Command failed with exit code {status}")
    return status, out, err

# 1. Setup Directory
run("mkdir -p /var/www")
# Rather than cp -r which might copy node_modules and .next, we should just rsync or cp and remove them
run("rm -rf /var/www/truedial")
run("cp -r /var/www/find-my-interior/truedial-frontend /var/www/truedial")
run("rm -rf /var/www/truedial/node_modules /var/www/truedial/.next")

# 2. Dockerfile
dockerfile = """
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
"""
run(f"cat << 'EOF' > /var/www/truedial/Dockerfile\n{dockerfile}\nEOF")

# 3. Docker Compose
docker_compose = """
version: '3.8'
services:
  truedial_frontend:
    build: .
    container_name: truedial_staging_frontend
    restart: unless-stopped
    ports:
      - "3001:3000"
    env_file:
      - .env.production
"""
run(f"cat << 'EOF' > /var/www/truedial/docker-compose.yml\n{docker_compose}\nEOF")

# 4. Environment Variables
env_prod = """
NEXT_PUBLIC_API_URL=https://findmyinterior.com/api/v1
NODE_ENV=production
"""
run(f"cat << 'EOF' > /var/www/truedial/.env.production\n{env_prod}\nEOF")

# 5. Build and Start
print("Building and starting TRUEDIAL staging...")
status, out, err = run("cd /var/www/truedial && docker compose up --build -d")

# 6. Verify Runtime Status
time.sleep(10)
run("docker ps | grep truedial_staging_frontend")
run("curl -s -o /dev/null -w '%{http_code}' http://localhost:3001")

client.close()
