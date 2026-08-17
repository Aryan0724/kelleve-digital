const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('docker logs --tail 200 fmi_frontend', (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).stderr.on('data', d => { out += d; }).on('close', () => {
      console.log('--- Frontend Logs ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
