const { Client } = require('ssh2');

const conn = new Client();

const runCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) {
        return reject(err);
      }
      let out = '';
      let errorOut = '';
      stream.on('close', (code, signal) => {
        resolve({ code, out, errorOut });
      }).on('data', (data) => {
        out += data;
        process.stdout.write(data);
      }).stderr.on('data', (data) => {
        errorOut += data;
        process.stderr.write(data);
      });
    });
  });
};

conn.on('ready', async () => {
  console.log('Connected to VPS...');
  try {
    console.log('Pulling latest code...');
    await runCommand('cd /var/www/find-my-interior && git pull origin main');
    
    console.log('Running migrate:fresh --seed...');
    await runCommand('cd /var/www/find-my-interior && docker exec fmi_backend php artisan migrate:fresh --seed --force');
    
    console.log('Running MockUserSeeder...');
    await runCommand('cd /var/www/find-my-interior && docker exec fmi_backend php artisan db:seed --class=MockUserSeeder --force');
    
    // Optional: rebuild frontend if necessary, but usually just pulling is enough if running Next.js in dev mode or using a restart.
    console.log('Restarting frontend container (if any)...');
    await runCommand('cd /var/www/find-my-interior && docker restart fmi_frontend || true');
    
    console.log('Deployment complete!');
  } catch (err) {
    console.error('Error: ', err);
  } finally {
    conn.end();
  }
}).connect({
  host: '187.127.164.142',
  port: 22,
  username: 'root',
  password: 'Truedial@1111'
});
