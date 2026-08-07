const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const curlCmd = 'curl -s -X POST -H "Content-Type: application/json" -d \'{"name":"Test User","email":"testuser12345@findmyinterior.com","password":"Password@123","password_confirmation":"Password@123","role":"user"}\' http://localhost:8000/api/v1/auth/register';
  conn.exec(curlCmd, (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- Register Response ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
