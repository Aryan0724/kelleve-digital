const { Client } = require('ssh2');

const conn = new Client();

const runCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) {
        return reject(err);
      }
      let out = '';
      let errorOut = '';
      stream.on('close', (code, signal) => {
        resolve({ code, out, errorOut });
      }).on('data', (data) => {
        out += data;
        process.stdout.write(data);
      }).stderr.on('data', (data) => {
        errorOut += data;
        process.stderr.write(data);
      });
    });
  });
};

conn.on('ready', async () => {
  console.log('Client :: ready');
  try {
    const filePath = '/var/www/find-my-interior/nginx.conf';
    
    // Check if client_max_body_size already exists
    let res = await runCommand(`grep client_max_body_size ${filePath}`);
    if (res.out.includes('client_max_body_size')) {
      console.log('client_max_body_size already exists. Replacing it...');
      await runCommand(`sed -i -E 's/client_max_body_size .*/client_max_body_size 20M;/' ${filePath}`);
    } else {
      console.log('client_max_body_size not found. Adding it to http block...');
      // Try to add it under http { block. If it's not present (e.g. server block only), add it under server {
      let hasHttp = await runCommand(`grep -q "http {" ${filePath}`);
      if (hasHttp.code === 0) {
        await runCommand(`sed -i '/http {/a \\    client_max_body_size 20M;' ${filePath}`);
      } else {
        await runCommand(`sed -i '/server {/a \\    client_max_body_size 20M;' ${filePath}`);
      }
    }
    
    // Test config using docker exec
    console.log('Testing Nginx config...');
    let testRes = await runCommand('docker exec fmi_nginx nginx -t');
    if (testRes.errorOut.includes('successful')) {
      console.log('Restarting fmi_nginx container...');
      await runCommand('docker restart fmi_nginx');
      console.log('Nginx container restarted successfully.');
    } else {
      console.log('Nginx config test failed: ', testRes.errorOut);
    }
  } catch (err) {
    console.error('Error executing commands: ', err);
  } finally {
    conn.end();
  }
}).connect({
  host: '187.127.164.142',
  port: 22,
  username: 'root',
  password: 'Truedial@1111'
});
