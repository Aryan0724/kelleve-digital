const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('grep -i "Aryantiwari@findmyinterior.com" /var/www/find-my-interior/findmyinterior-backend/storage/logs/laravel.log | tail -n 20', (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- Logs for correct email ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
