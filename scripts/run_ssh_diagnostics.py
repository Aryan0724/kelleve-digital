import paramiko
import sys

hostname = "187.127.164.142"
username = "root"
password = "Truedial@1111"

commands = [
    "docker ps -a",
    "docker compose ps",
    "docker stats --no-stream",
    "docker logs fmi_backend --tail=300",
    "docker logs fmi_mysql --tail=300",
    "docker logs fmi_redis --tail=300",
    "docker logs fmi_frontend --tail=300",
    "docker exec fmi_backend tail -300 /var/log/nginx/error.log",
    "docker exec fmi_backend tail -300 /var/log/nginx/access.log",
    "docker exec fmi_backend tail -300 /var/log/php8-fpm.log",
    "docker exec fmi_backend tail -300 /var/log/php8.2-fpm.log",
    "docker exec fmi_backend tail -300 /var/log/php8.3-fpm.log",
    "docker exec fmi_backend tail -300 /var/log/php8.4-fpm.log",
    "docker exec fmi_backend tail -300 /var/log/php8-fpm-slow.log",
    "docker exec fmi_backend tail -300 storage/logs/laravel.log",
    "docker exec fmi_backend php artisan migrate:status",
    "docker exec fmi_backend php artisan tinker --execute=\"DB::select('SELECT 1');\"",
    "free -h",
    "dmesg -T | grep -Ei 'oom|killed process'",
    "systemctl status nginx",
    "systemctl status php8.4-fpm",
    "systemctl status php8.3-fpm",
    "systemctl status php8.2-fpm",
    "tail -200 /var/log/nginx/error.log",
    "tail -200 /var/log/php8.4-fpm.log",
    "tail -200 storage/logs/laravel.log"
]

def main():
    print(f"Connecting to {hostname}...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(hostname, username=username, password=password, timeout=10)
    except Exception as e:
        print(f"SSH connection failed: {e}")
        sys.exit(1)

    print("Connected successfully. Running diagnostics...")
    
    with open("diagnostics.log", "w", encoding="utf-8") as f:
        for cmd in commands:
            f.write(f"\n{'='*50}\nCMD: {cmd}\n{'='*50}\n")
            print(f"Running: {cmd}")
            try:
                stdin, stdout, stderr = client.exec_command(cmd, timeout=30)
                out = stdout.read().decode('utf-8', errors='replace')
                err = stderr.read().decode('utf-8', errors='replace')
                f.write(out)
                if err:
                    f.write("\nSTDERR:\n")
                    f.write(err)
            except Exception as e:
                f.write(f"\nEXCEPTION: {e}\n")
    
    client.close()
    print("Diagnostics complete. Saved to diagnostics.log")

if __name__ == "__main__":
    main()
