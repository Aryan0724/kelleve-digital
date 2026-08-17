const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Get ERROR lines from log
  conn.exec('grep "production.ERROR" /var/www/find-my-interior/findmyinterior-backend/storage/logs/laravel.log | head -n 50', (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- ALL PRODUCTION ERRORS ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
