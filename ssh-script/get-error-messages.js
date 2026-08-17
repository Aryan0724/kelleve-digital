const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Find all unique error messages (just the first line of each error)
  conn.exec(`grep "production.ERROR" /var/www/find-my-interior/findmyinterior-backend/storage/logs/laravel.log | sed 's/.*production.ERROR: //' | sed 's/ {.*//' | sort -u`, (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- UNIQUE ERROR MESSAGES ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
