const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('tail -n 50 /var/www/find-my-interior/findmyinterior-backend/storage/logs/laravel.log', (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- Last 50 lines of log ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
