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

const sql = `
INSERT INTO projects (
  title, description, slug, budget_range, location, property_type,
  scope_of_work, timeline, status, user_id, city_id, requirement_id,
  created_at, updated_at
) VALUES (
  'Full Home Interior for 3BHK',
  'Looking for a complete interior design and execution for a newly built 3BHK in Patna. Need false ceiling, modular kitchen, and wardrobes.',
  'full-home-interior-3bhk',
  '5L - 10L',
  'Patna',
  'Apartment',
  'End to End',
  'Immediate',
  'open',
  1,
  1,
  NULL,
  NOW(),
  NOW()
);
`;

conn.on('ready', async () => {
  try {
    console.log('--- Seeding Fake Project ---');
    await runCommand(`docker exec fmi_mysql mysql -u fmi_user -psecret findmyinterior -e "${sql}"`);
    console.log('Fake project inserted successfully.');
  } catch(e) {
    console.error(e);
  } finally {
    conn.end();
  }
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
