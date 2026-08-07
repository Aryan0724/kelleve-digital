const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('curl -s "http://localhost:8000/api/v1/listings?city=Patna"', (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- Listings for Patna ---');
      try {
        const json = JSON.parse(out);
        console.log(`Total returned: ${json.meta?.total || (json.data ? json.data.length : 0)}`);
      } catch (e) {
        console.log("Failed to parse JSON. Raw output:");
        console.log(out.substring(0, 500));
      }
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
