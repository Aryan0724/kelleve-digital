const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const conn = new Client();

conn.on('ready', () => {
  console.log('Connected to VPS');
  
  // Files to upload: [localPath, remotePath]
  const files = [
    ['d:/find my interior/findmyinterior-backend/app/Models/Worker.php', '/var/www/find-my-interior/findmyinterior-backend/app/Models/Worker.php'],
    ['d:/find my interior/findmyinterior-backend/app/Models/Supplier.php', '/var/www/find-my-interior/findmyinterior-backend/app/Models/Supplier.php'],
    ['d:/find my interior/findmyinterior-backend/app/Models/Builder.php', '/var/www/find-my-interior/findmyinterior-backend/app/Models/Builder.php'],
    ['d:/find my interior/findmyinterior-backend/app/Models/Listing.php', '/var/www/find-my-interior/findmyinterior-backend/app/Models/Listing.php'],
    ['d:/find my interior/findmyinterior-backend/app/Http/Controllers/Admin/AdminController.php', '/var/www/find-my-interior/findmyinterior-backend/app/Http/Controllers/Admin/AdminController.php'],
    ['d:/find my interior/findmyinterior-backend/app/Http/Controllers/Public/ListingController.php', '/var/www/find-my-interior/findmyinterior-backend/app/Http/Controllers/Public/ListingController.php'],
    ['d:/find my interior/findmyinterior-backend/database/migrations/2026_08_06_060000_fix_listings_district_nullable.php', '/var/www/find-my-interior/findmyinterior-backend/database/migrations/2026_08_06_060000_fix_listings_district_nullable.php'],
  ];
  
  let idx = 0;
  
  function uploadNext() {
    if (idx >= files.length) {
      console.log('All files uploaded! Now rebuilding the backend container...');
      
      conn.exec('cd /var/www/find-my-interior && docker compose exec -T backend php artisan config:cache && docker compose exec -T backend php artisan route:cache && docker compose exec -T backend php artisan view:cache', (err, stream) => {
        let out = '';
        stream.on('data', d => { out += d; }).on('close', () => {
          console.log('--- Artisan cache rebuild ---');
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
