import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = """docker exec fmi_backend php artisan tinker --execute="
\$user = \\App\\Models\\User::where('email', 'aryantiwari07245252@gmail.com')->first();
\$token = \$user->createToken('admin')->plainTextToken;
echo \$token;
" """
stdin, stdout, stderr = client.exec_command(cmd)
token = stdout.read().decode().strip()

print("Got token:", token)

if "SyntaxWarning" in token:
    token = token.split("\n")[-1].strip()

cmd2 = f"""curl -k -s -w "\\nHTTP_CODE: %{{http_code}}\\n" -X GET -H "Authorization: Bearer {token}" "https://localhost/api/v1/admin/verifications?filter=pending" """
stdin, stdout, stderr = client.exec_command(cmd2)
print("STDOUT:", stdout.read().decode()[:500])
print("STDERR:", stderr.read().decode())
