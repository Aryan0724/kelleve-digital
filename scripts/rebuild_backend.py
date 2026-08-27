import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')
def r(cmd):
    i,o,e = client.exec_command(cmd)
    print(o.read().decode())
    print(e.read().decode())

print("Rebuilding backend...")
r('cd /var/www/find-my-interior && docker compose build backend && docker compose up -d backend')
r('curl -s "http://localhost:8000/api/v1/listings?search=Interior+Designer"')
