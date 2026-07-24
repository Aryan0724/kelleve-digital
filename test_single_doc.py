import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = """docker exec fmi_backend php artisan tinker --execute="
\$user = \\App\\Models\\User::where('email', 'aryantiwari07245252@gmail.com')->first();
echo 'TOKEN=' . \$user->createToken('admin')->plainTextToken;
" """
stdin, stdout, stderr = client.exec_command(cmd)
token_out = stdout.read().decode().strip()
print("TOKEN OUT:", token_out)

if "TOKEN=" in token_out:
    token = token_out.split("TOKEN=")[1].strip()
    cmd2 = f"""curl -k -s -w "\\nHTTP_CODE: %{{http_code}}\\n" -X GET -H "Authorization: Bearer {token}" "http://localhost:8000/api/v1/admin/verifications/documents/1" """
    stdin, stdout, stderr = client.exec_command(cmd2)
    out = stdout.read().decode()
    print("STDOUT:", out[:500])
    print("STDERR:", stderr.read().decode())
