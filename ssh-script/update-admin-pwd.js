const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const sql = "UPDATE users SET password = '$2y$12$IAKzhPOSE3Ykz9HfBPkcpuHMNV1Y06whpeqfVRnhFnskyY3nCWc56' WHERE email = 'Aryantiwari@findmyinterior.com'";
  const base64Sql = Buffer.from(sql).toString('base64');
  
  const cmd = `docker compose -f /var/www/find-my-interior/docker-compose.yml exec -T db sh -c "echo '${base64Sql}' | base64 -d > /tmp/query.sql && mysql -u fmi_user -psecret findmyinterior < /tmp/query.sql"`;

  conn.exec(cmd, (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; });
    stream.stderr.on('data', d => { out += 'STDERR: ' + d; });
    stream.on('close', () => {
      console.log('--- Direct SQL Update output ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
