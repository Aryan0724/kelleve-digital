const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('docker exec fmi_frontend wget -qO- http://backend:80/api/v1/health || docker exec fmi_frontend wget -qO- http://fmi_backend/api/v1/health', (err, stream) => {
    let out = '';
    let errOut = '';
    stream.on('data', d => { out += d; })
          .stderr.on('data', d => { errOut += d; })
          .on('close', () => {
      console.log('--- Frontend to Backend Health Check ---');
      console.log('OUT:', out);
      console.log('ERR:', errOut);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
