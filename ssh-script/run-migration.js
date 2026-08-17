const { Client } = require('ssh2');
const conn = new Client();
const runCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '';
      stream.on('close', () => resolve(out))
            .on('data', d => { out += d; console.log(d.toString()); })
            .stderr.on('data', d => { out += d; console.error(d.toString()); });
    });
  });
};

conn.on('ready', async () => {
  try {
    console.log('--- Running Migrations ---');
    await runCommand('cd /var/www/find-my-interior && docker compose exec -T backend php artisan migrate --force');
    console.log('--- Done ---');
  } catch(e) {
    console.error(e);
  } finally {
    conn.end();
  }
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
