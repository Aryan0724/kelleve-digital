import paramiko
import sys

hostname = "187.127.164.142"
username = "root"
password = "Truedial@1111"

command = sys.argv[1]

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    ssh.connect(hostname, username=username, password=password, timeout=10)
    stdin, stdout, stderr = ssh.exec_command(command)
    exit_status = stdout.channel.recv_exit_status()
    print("STDOUT:")
    sys.stdout.buffer.write(stdout.read())
    print("\nSTDERR:")
    sys.stdout.buffer.write(stderr.read())
    sys.exit(exit_status)
except Exception as e:
    print(f"Connection failed: {e}")
    sys.exit(1)
finally:
    ssh.close()
