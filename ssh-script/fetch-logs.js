const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Get the last 100 lines of the laravel log inside the docker container
  const cmd = `docker compose -f /var/www/find-my-interior/docker-compose.yml exec -T backend tail -n 100 storage/logs/laravel.log`;
  conn.exec(cmd, (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; });
    stream.stderr.on('data', d => { out += 'STDERR: ' + d; });
    stream.on('close', () => {
      console.log('--- Laravel Log ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
