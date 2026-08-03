import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

client.exec_command("sed -i 's/cookies().set/(await cookies()).set/g' /var/www/truedial/src/app/actions/auth.ts")
client.exec_command("sed -i 's/cookies().get/(await cookies()).get/g' /var/www/truedial/src/app/dashboard/user/page.tsx")
client.exec_command("cd /var/www/truedial && docker compose up --build -d")
client.close()
