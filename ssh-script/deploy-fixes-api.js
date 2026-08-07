const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const conn = new Client();

conn.on('ready', () => {
  console.log('Connected to VPS');
  
  // Files to upload: [localPath, remotePath]
  const files = [
    ['d:/find my interior/findmyinterior-backend/app/Http/Controllers/User/DashboardController.php', '/var/www/find-my-interior/findmyinterior-backend/app/Http/Controllers/User/DashboardController.php'],
    ['d:/find my interior/findmyinterior-backend/app/Http/Controllers/Public/HomepageController.php', '/var/www/find-my-interior/findmyinterior-backend/app/Http/Controllers/Public/HomepageController.php'],
    ['d:/find my interior/findmyinterior-backend/database/seeders/OpportunityTypeSeeder.php', '/var/www/find-my-interior/findmyinterior-backend/database/seeders/OpportunityTypeSeeder.php']
  ];
  
  let idx = 0;
  
  function uploadNext() {
    if (idx >= files.length) {
      console.log('All files uploaded! Now reseeding OpportunityType and rebuilding cache...');
      
      const commands = [
        'cd /var/www/find-my-interior && docker compose exec -T backend php artisan db:seed --class=OpportunityTypeSeeder --force',
        'cd /var/www/find-my-interior && docker compose exec -T backend php artisan config:cache',
        'cd /var/www/find-my-interior && docker compose exec -T backend php artisan route:cache',
        'cd /var/www/find-my-interior && docker compose exec -T backend php artisan view:cache'
      ].join(' && ');

      conn.exec(commands, (err, stream) => {
        let out = '';
        stream.on('data', d => { out += d; }).on('close', () => {
          console.log('--- Deployment Completed ---');
          console.log(out);
          conn.end();
        });
      });
      return;
    }
    
    const [localPath, remotePath] = files[idx++];
    
    conn.sftp((err, sftp) => {
      if (err) { console.error('SFTP error:', err); return; }
      
      const content = fs.readFileSync(localPath);
      const writeStream = sftp.createWriteStream(remotePath);
      writeStream.on('close', () => {
        console.log(`✓ Uploaded: ${path.basename(localPath)}`);
        sftp.end();
        uploadNext();
      });
      writeStream.on('error', (e) => {
        console.error(`✗ Failed: ${path.basename(localPath)}`, e);
        sftp.end();
        uploadNext();
      });
      writeStream.write(content);
      writeStream.end();
    });
  }
  
  uploadNext();
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
