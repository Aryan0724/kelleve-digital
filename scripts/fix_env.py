import paramiko
import sys

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

def run(cmd):
    print(f"> {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    print(stdout.read().decode())
    print(stderr.read().decode())

run("sed -i 's/^DB_DATABASE=.*/DB_DATABASE=findmyinterior_prod_candidate/g' /var/www/find-my-interior/findmyinterior-backend/.env")
run("sed -i 's/^DB_USERNAME=.*/DB_USERNAME=root/g' /var/www/find-my-interior/findmyinterior-backend/.env")
run("sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=secret/g' /var/www/find-my-interior/findmyinterior-backend/.env")
run("sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=fmi_mysql/g' /var/www/find-my-interior/findmyinterior-backend/.env")
run("sed -i 's/^DB_HOST=.*/DB_HOST=fmi_mysql/g' /var/www/find-my-interior/findmyinterior-backend/.env")

run("docker exec fmi_backend php artisan optimize:clear")
run('docker exec fmi_backend php artisan tinker --execute="echo config(\'database.default\').PHP_EOL; echo config(\'database.connections.fmi_mysql.database\').PHP_EOL; echo DB::table(\'users\')->count().PHP_EOL; echo DB::table(\'worker_jobs\')->count().PHP_EOL; echo DB::table(\'rfqs\')->count().PHP_EOL;"')
