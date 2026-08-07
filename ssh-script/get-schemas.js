const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('docker exec fmi_mysql mysql -u fmi_user -psecret findmyinterior -e "DESCRIBE reviews;"', (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- reviews table schema ---');
      console.log(out);
      
      conn.exec('docker exec fmi_mysql mysql -u fmi_user -psecret findmyinterior -e "DESCRIBE listings;"', (err, stream2) => {
        let out2 = '';
        stream2.on('data', d => { out2 += d; }).on('close', () => {
          console.log('--- listings table schema ---');
          console.log(out2);
          
          conn.exec('docker exec fmi_mysql mysql -u fmi_user -psecret findmyinterior -e "DESCRIBE users;"', (err, stream3) => {
            let out3 = '';
            stream3.on('data', d => { out3 += d; }).on('close', () => {
              console.log('--- users table schema ---');
              console.log(out3);
              conn.end();
            });
          });
        });
      });
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
