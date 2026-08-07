const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Get the actual error message from the log (not just trace)
  conn.exec('grep -B5 "\\[production.ERROR\\]" /var/www/find-my-interior/findmyinterior-backend/storage/logs/laravel.log | head -n 100', (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- PRODUCTION ERRORS ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
