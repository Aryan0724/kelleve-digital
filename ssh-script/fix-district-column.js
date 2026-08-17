const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Add a default value to district column so it doesn't cause errors
  const sql = `ALTER TABLE listings MODIFY COLUMN district varchar(100) NULL DEFAULT NULL;`;
  conn.exec(`docker exec fmi_mysql mysql -u fmi_user -psecret findmyinterior -e "${sql}"`, (err, stream) => {
    let out = '';
    let errOut = '';
    stream.on('data', d => { out += d; })
          .stderr.on('data', d => { errOut += d; })
          .on('close', () => {
      console.log('--- Make district nullable ---');
      console.log('OUT:', out);
      console.log('ERR:', errOut);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
