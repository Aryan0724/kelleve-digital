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
    console.log('--- Pulling latest code ---');
    await runCommand('cd /var/www/find-my-interior && git pull origin main');

    console.log('\n--- Rebuilding Docker Image for Frontend ---');
    // We must rebuild the image because source code is copied into it during build
    await runCommand('cd /var/www/find-my-interior && docker compose build frontend');

    console.log('\n--- Recreating Frontend Container ---');
    // Start the container with the newly built image
    await runCommand('cd /var/www/find-my-interior && docker compose up -d --no-deps frontend');
    
    // Check if the old text exists in the new build
    console.log('\n--- Checking deployment ---');
    await runCommand('sleep 5 && curl -s http://localhost:3000 | grep -i "Search for interior designers, contractors" || echo "Old text NOT found. Update successful!"');

    console.log('\nDone! Site should be live with the new changes.');
  } catch (err) {
    console.error('Error:', err.message || err);
  } finally {
    conn.end();
  }
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
