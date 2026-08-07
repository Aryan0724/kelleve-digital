const { Client } = require('ssh2');
const conn = new Client();
const runCommand = (cmd, timeout = 300000) => {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${cmd}`);
    const timer = setTimeout(() => reject(new Error(`Timeout: ${cmd}`)), timeout);
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
    console.log('\n--- Rebuilding Docker Image for Frontend (NO CACHE) ---');
    // We must use --no-cache because the previous cached build has the wrong API URL baked in!
    await runCommand('cd /var/www/find-my-interior && docker compose build --no-cache frontend');

    console.log('\n--- Recreating Frontend Container ---');
    await runCommand('cd /var/www/find-my-interior && docker compose up -d --no-deps frontend');

    console.log('\nDone! API URL fixed properly this time.');
  } catch (err) {
    console.error('Error:', err.message || err);
  } finally {
    conn.end();
  }
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
