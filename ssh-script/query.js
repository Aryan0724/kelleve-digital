const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('docker exec fmi_mysql mysql -u fmi_user -psecret findmyinterior -e "SELECT id, name, email, is_active FROM users LIMIT 10;"', (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- Users ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
