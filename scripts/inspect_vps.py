import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

def run_cmd(cmd):
    stdin, stdout, stderr = client.exec_command(cmd)
    return stdout.read().decode('utf-8') + stderr.read().decode('utf-8')

print('--- find-my-interior ls ---')
print(run_cmd('ls -la /var/www/find-my-interior'))

print('--- nginx conf host ---')
print(run_cmd('ls -la /etc/nginx/conf.d 2>/dev/null || echo "no host dir"'))

print('--- fmi_nginx conf ---')
print(run_cmd('docker exec fmi_nginx ls -la /etc/nginx/conf.d 2>/dev/null'))
