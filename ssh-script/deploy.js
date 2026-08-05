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
    console.log('Deploying and Fetching Dashboard Data...');
    await runCommand('cd /var/www/find-my-interior && git pull origin main');
    const phpCode = "echo json_encode(app()->make('App\\\\Http\\\\Controllers\\\\Admin\\\\AdminController')->dashboard()->getData(true));";
    await runCommand(`docker exec fmi_backend php artisan tinker --execute="${phpCode}"`);
    
    console.log('Done!');
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
