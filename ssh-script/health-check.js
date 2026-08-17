const { Client } = require('ssh2');
const conn = new Client();
const runCommand = (cmd, timeout = 30000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout: ${cmd}`)), timeout);
    conn.exec(cmd, (err, stream) => {
      if (err) { clearTimeout(timer); return reject(err); }
      let out = '';
      stream.on('close', () => { clearTimeout(timer); resolve(out); })
            .on('data', d => { out += d; })
            .stderr.on('data', d => { out += d; });
    });
  });
};

const check = async (label, cmd) => {
  try {
    const out = await runCommand(cmd);
    console.log(`✅ ${label}`);
    if (out.trim()) console.log(`   ${out.trim().substring(0, 200)}`);
  } catch (e) {
    console.log(`❌ ${label}: ${e.message}`);
  }
};

const apiCheck = async (label, path) => {
  const cmd = `curl -s -o /tmp/api_res -w "%{http_code}" http://localhost:8000/api/v1/${path}`;
  try {
    const statusCode = await runCommand(cmd);
    const body = await runCommand('cat /tmp/api_res | head -c 300');
    const status = statusCode.trim();
    if (status === '200') {
      console.log(`✅ API ${label} → ${status}`);
      console.log(`   ${body.trim().substring(0, 150)}`);
    } else {
      console.log(`⚠️  API ${label} → ${status}`);
      console.log(`   ${body.trim().substring(0, 150)}`);
    }
  } catch (e) {
    console.log(`❌ API ${label}: ${e.message}`);
  }
};

conn.on('ready', async () => {
  console.log('='.repeat(60));
  console.log('   FIND MY INTERIOR — HEALTH CHECK REPORT');
  console.log('='.repeat(60));
  console.log();

  // 1. Docker containers
  console.log('📦 DOCKER CONTAINERS');
  await check('Container status', 'docker ps --format "  {{.Names}} | {{.Status}} | {{.Ports}}"');
  console.log();

  // 2. Database
  console.log('🗄️  DATABASE');
  await check('MySQL ping', 'docker exec fmi_mysql mysqladmin ping -u root -pTruedial@1111 2>&1');
  await check('Listings count', 'docker exec fmi_mysql mysql -u root -pTruedial@1111 find_my_interior -e "SELECT COUNT(*) as listings FROM listings;" 2>&1');
  await check('Users count', 'docker exec fmi_mysql mysql -u root -pTruedial@1111 find_my_interior -e "SELECT COUNT(*) as users FROM users;" 2>&1');
  await check('Keywords column exists', 'docker exec fmi_mysql mysql -u root -pTruedial@1111 find_my_interior -e "SHOW COLUMNS FROM listings LIKE \'keywords\';" 2>&1');
  console.log();

  // 3. Backend health
  console.log('⚙️  BACKEND API (http://localhost:8000)');
  await apiCheck('Health', 'health');
  await apiCheck('Listings', 'listings?per_page=2');
  await apiCheck('Categories', 'categories');
  await apiCheck('Cities', 'cities');
  await apiCheck('Listings search', 'listings?search=interior');
  await apiCheck('Listings keyword search', 'listings?search=modular+kitchen');
  console.log();

  // 4. Frontend
  console.log('🌐 FRONTEND (http://localhost:3000)');
  await check('Frontend responding', 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3000');
  await check('Frontend /professionals', 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/professionals');
  console.log();

  // 5. Redis
  console.log('🔴 REDIS');
  await check('Redis ping', 'docker exec fmi_redis redis-cli ping');
  console.log();

  // 6. Nginx
  console.log('🔁 NGINX');
  await check('Nginx config test', 'docker exec fmi_nginx nginx -t 2>&1');
  console.log();

  // 7. Laravel
  console.log('🐘 LARAVEL');
  await check('Queue status', 'docker exec fmi_backend php artisan queue:monitor 2>&1 || echo "No active queues"');
  await check('Route list count', 'docker exec fmi_backend php artisan route:list 2>&1 | wc -l');
  await check('Storage link', 'docker exec fmi_backend php artisan storage:link 2>&1');
  console.log();

  console.log('='.repeat(60));
  console.log('   HEALTH CHECK COMPLETE');
  console.log('='.repeat(60));
  conn.end();
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
