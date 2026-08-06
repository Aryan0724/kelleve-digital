const { Client } = require('ssh2');
const conn = new Client();
const runCommand = (cmd, timeout = 120000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Command timed out: ${cmd}`)), timeout);
    conn.exec(cmd, (err, stream) => {
      if (err) { clearTimeout(timer); return reject(err); }
      let out = '';
      stream.on('close', () => { clearTimeout(timer); resolve(out); })
            .on('data', d => { out += d; process.stdout.write(d); })
            .stderr.on('data', d => { out += d; process.stderr.write(d); });
    });
  });
};
conn.on('ready', async () => {
  console.log('Connected to VPS!\n');
  try {
    console.log('--- Pulling latest code ---');
    await runCommand('cd /var/www/find-my-interior && git pull origin main');

    console.log('\n--- Running backend migrations ---');
    await runCommand('docker exec fmi_backend php artisan migrate --force');

    console.log('\n--- Rebuilding frontend inside Docker ---');
    // The frontend container mounts the source - rebuild inside it
    await runCommand('docker exec fmi_frontend sh -c "cd /app && npm run build"', 300000);

    console.log('\n--- Restarting frontend container ---');
    await runCommand('docker restart fmi_frontend');

    console.log('\nDone! Site should be live.');
  } catch (err) {
    console.error('Error:', err.message || err);
  } finally {
    conn.end();
  }
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
