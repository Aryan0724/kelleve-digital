const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('docker exec fmi_mysql mysql -u fmi_user -psecret findmyinterior -e "SELECT COUNT(*) FROM users WHERE deleted_at IS NOT NULL;"', (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- Soft Deleted Users Count ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
