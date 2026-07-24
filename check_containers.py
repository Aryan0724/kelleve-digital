import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

def run(cmd):
    print(f'CMD: {cmd}')
    stdin, stdout, stderr = client.exec_command(cmd, timeout=60, get_pty=True)
    out = stdout.read().decode('utf-8', errors='replace')
    if out: print(out)
    return out

# Check container names
run('docker ps --format "{{.Names}}"')

# Check where migrations live
run('docker exec $(docker ps --format "{{.Names}}" | grep -i backend | head -1) ls database/migrations/ | tail -10')

client.close()
print('DONE')
