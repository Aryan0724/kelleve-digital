const { Client } = require('ssh2');
const conn = new Client();
const runCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '';
      stream.on('close', () => resolve(out))
            .on('data', d => { out += d; process.stdout.write(d); })
            .stderr.on('data', d => { process.stderr.write(d); });
    });
  });
};
conn.on('ready', async () => {
  console.log('Connected!\n');
  // Check docker containers - frontend is likely running in Docker
  await runCommand('docker ps --format "{{.Names}} | {{.Image}} | {{.Ports}}"');
  console.log('\n--- Check /usr/local/bin ---');
  await runCommand('ls /usr/local/bin/ | grep -E "npm|pm2|node"');
  console.log('\n--- Check /usr/bin ---');
  await runCommand('ls /usr/bin/ | grep -E "npm|pm2|node"');
  console.log('\n--- Check docker exec fmi_frontend ---');
  await runCommand('docker exec fmi_frontend sh -c "npm --version && pm2 --version" 2>&1 || echo "container not found"');
  conn.end();
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
