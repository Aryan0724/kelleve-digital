const { Client } = require('ssh2');
const conn = new Client();
const runCommand = (cmd, timeout = 30000) => {
  return new Promise((resolve, reject) => {
    let out = '';
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      stream.on('close', () => resolve(out))
            .on('data', d => { out += d; })
            .stderr.on('data', d => { out += d; });
    });
  });
};

conn.on('ready', async () => {
  try {
    console.log('--- Check Projects in Database ---');
    const dbCount = await runCommand('docker exec fmi_mysql mysql -u fmi_user -psecret findmyinterior -e "SELECT count(*) as count FROM projects;"');
    console.log(dbCount);
    
    console.log('--- Check Listings in Database ---');
    const listingCount = await runCommand('docker exec fmi_mysql mysql -u fmi_user -psecret findmyinterior -e "SELECT count(*) as count FROM listings;"');
    console.log(listingCount);
    
    console.log('--- Curl API directly from VPS ---');
    const apiProjects = await runCommand('curl -s http://localhost:8000/api/v1/projects | head -c 500');
    console.log('\nProjects API: ', apiProjects);
    
    const apiListings = await runCommand('curl -s http://localhost:8000/api/v1/listings | head -c 500');
    console.log('\nListings API: ', apiListings);
    
  } catch(e) {
    console.error(e);
  } finally {
    conn.end();
  }
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
