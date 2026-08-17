const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Get ALL unique errors from the log
  conn.exec('grep "production.ERROR" /var/www/find-my-interior/findmyinterior-backend/storage/logs/laravel.log | sort -u | head -n 100', (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- ALL UNIQUE ERRORS ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
