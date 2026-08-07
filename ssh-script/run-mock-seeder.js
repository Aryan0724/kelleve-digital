const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  const cmd = `docker compose -f /var/www/find-my-interior/docker-compose.yml exec -T backend php artisan db:seed --class=MockDataSeeder --force`;
  conn.exec(cmd, (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- Output ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
