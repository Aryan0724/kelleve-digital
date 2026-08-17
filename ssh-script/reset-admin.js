const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const phpScript = `
use App\\Models\\User;
use Illuminate\\Support\\Facades\\Hash;

$user = User::where('email', 'Aryantiwari@findmyinterior.com')->first();
if ($user) {
    $user->password = Hash::make('findmyinterior');
    $user->save();
    echo "Password reset to 'findmyinterior' successfully.\\n";
} else {
    echo "User not found.\\n";
}
`;

  const base64Script = Buffer.from(phpScript).toString('base64');
  
  const cmd = `echo '${base64Script}' | base64 -d > /var/www/find-my-interior/reset-admin.php && docker compose -f /var/www/find-my-interior/docker-compose.yml exec -T backend php artisan tinker /var/www/find-my-interior/reset-admin.php`;

  conn.exec(cmd, (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; }).on('close', () => {
      console.log('--- Reset Output ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
