const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const sql = `SELECT id, email, is_active FROM users WHERE email LIKE '%aryan%' OR email LIKE '%tiwari%' LIMIT 5`;
  conn.exec(`docker compose -f /var/www/find-my-interior/docker-compose.yml exec -T db mysql -u fmi_user -psecret findmyinterior -e "${sql}"`, (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- User search ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
