const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('grep -ri "http://localhost:8000/api/v1" /var/www/find-my-interior/findmyinterior-frontend/.next/static/chunks || echo "No localhost found"', (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- Checking for localhost in build ---');
      console.log(out.substring(0, 500));
      
      conn.exec('grep -ri "https://findmyinterior.com/api/v1" /var/www/find-my-interior/findmyinterior-frontend/.next/static/chunks || echo "No production API found"', (err, stream2) => {
        let out2 = '';
        stream2.on('data', d => { out2 += d; }).on('close', () => {
          console.log('--- Checking for prod URL in build ---');
          console.log(out2.substring(0, 500));
          conn.end();
        });
      });
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
