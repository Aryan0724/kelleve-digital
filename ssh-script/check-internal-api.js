const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`docker exec fmi_frontend node -e "fetch('http://fmi_backend/api/v1/listings?search=Interior+Designer').then(r=>r.json()).then(t => console.log('Search Results:', t.meta?.total || 0, t.data?.length)).catch(console.error)"`, (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- Internal Node Fetch ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
