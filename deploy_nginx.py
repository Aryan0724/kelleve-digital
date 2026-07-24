import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

nginx_conf = """
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    server {
        listen 80;
        server_name findmyinterior.com www.findmyinterior.com localhost;
        
        # Redirect all HTTP requests to HTTPS
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl;
        server_name findmyinterior.com www.findmyinterior.com;

        ssl_certificate /etc/letsencrypt/live/findmyinterior.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/findmyinterior.com/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        
        location /api {
            proxy_pass http://172.17.0.1:8000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /storage {
            proxy_pass http://172.17.0.1:8000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        location / {
            proxy_pass http://172.17.0.1:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
"""

client.exec_command('rm -rf /var/www/find-my-interior/nginx.conf')
client.exec_command(f'echo \'{nginx_conf}\' > /tmp/nginx.conf')
client.exec_command('cp /tmp/nginx.conf /var/www/find-my-interior/nginx.conf')
client.exec_command('docker restart fmi_nginx')

# check status
stdin, stdout, stderr = client.exec_command('docker ps | grep fmi_nginx')
print('Running:', stdout.read().decode())
