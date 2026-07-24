import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = """curl -k -s -w "\\nHTTP_CODE: %{http_code}\\n" -X GET -H "Authorization: Bearer 79|UOXavsDajg77o4vVX5HEoyAxyDPbg7bfnYOfYKPIbcccc3e4" "https://localhost/api/v1/admin/verifications?filter=pending" """

stdin, stdout, stderr = client.exec_command(cmd)
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())
