import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

def run_cmd(cmd):
    print(f"--- RUNNING: {cmd} ---")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    if out:
        print(out)
    if err:
        print(f"ERROR: {err}")
    print()

run_cmd('cd /var/www/find-my-interior/findmyinterior-backend && git status')
run_cmd('cd /var/www/find-my-interior/findmyinterior-backend && git log -1 --oneline')
run_cmd('cd /var/www/find-my-interior/findmyinterior-backend && grep DB_ .env')

client.close()
