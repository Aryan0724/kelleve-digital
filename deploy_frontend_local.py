import paramiko, base64, os
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

files_to_upload = [
    'findmyinterior-frontend/src/components/home/PublicProjects.tsx',
    'findmyinterior-frontend/src/app/login/page.tsx',
    'findmyinterior-frontend/src/app/register/page.tsx'
]

for file_path in files_to_upload:
    with open(file_path, 'rb') as f:
        content = f.read()
    b64_content = base64.b64encode(content).decode('utf-8')
    remote_tmp = f"/tmp/{os.path.basename(file_path)}.b64"
    remote_target = f"/var/www/find-my-interior/{file_path.replace('findmyinterior-frontend/', '')}"
    
    cmd = f"echo '{b64_content}' > {remote_tmp} && base64 -d {remote_tmp} > /tmp/{os.path.basename(file_path)} && docker cp /tmp/{os.path.basename(file_path)} fmi_frontend:/app/{file_path.replace('findmyinterior-frontend/', '')}"
    print(f"Uploading {file_path}...")
    stdin, stdout, stderr = client.exec_command(cmd)
    print(stdout.read().decode())
    print(stderr.read().decode())

print("Building frontend...")
stdin, stdout, stderr = client.exec_command('docker exec fmi_frontend npm run build')
for line in iter(stdout.readline, ""):
    print(line, end="")

print("Restarting frontend...")
stdin, stdout, stderr = client.exec_command('docker restart fmi_frontend')
print(stdout.read().decode())

client.close()
