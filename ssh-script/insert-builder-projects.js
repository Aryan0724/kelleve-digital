const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const sql = `
    INSERT INTO builder_projects 
    (title, slug, description, project_type, location, city, bhk_options, area_sqft_min, area_sqft_max, price_min, price_max, possession_date, is_possession_ready, status, is_featured, builder_id, created_at, updated_at) 
    VALUES 
    ('Sunrise Luxury Apartments', 'sunrise-luxury-apartments-999', 'Premium 3 and 4 BHK apartments in the heart of the city.', 'residential', 'Bailey Road', 'Patna', '3 BHK, 4 BHK', 1500, 2500, 8000000.00, 12000000.00, '2027-01-01', 0, 'upcoming', 1, 1, NOW(), NOW()),
    ('Green Valley Villas', 'green-valley-villas-999', 'Exclusive gated community of independent villas with private gardens.', 'residential', 'Danapur', 'Patna', '4 BHK Villa, 5 BHK Villa', 2500, 4000, 15000000.00, 25000000.00, '2025-06-01', 1, 'possession_ready', 1, 1, NOW(), NOW());
  `;
  
  conn.exec(`docker compose -f /var/www/find-my-interior/docker-compose.yml exec -T db mysql -u fmi_user -psecret findmyinterior -e "${sql}"`, (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; });
    stream.stderr.on('data', d => { out += 'STDERR: ' + d; });
    stream.on('close', () => {
      console.log('--- Direct SQL Insert output ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '187.127.164.142', port: 22, username: 'root', password: 'Truedial@1111' });
