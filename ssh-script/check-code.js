const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('cat /var/www/find-my-interior/findmyinterior-frontend/src/components/layout/Navbar.tsx | grep "bg-\\\\[#E8701A\\\\] hover:bg-\\\\[#d66314\\\\]"', (err, stream) => {
    stream.on('data', d => process.stdout.write(d)).on('close', () => conn.end());
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
