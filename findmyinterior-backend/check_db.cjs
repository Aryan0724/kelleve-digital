const { Client } = require('pg');
const client = new Client({
  host: 'dpg-d8luoscvikkc73bu2pd0-a.oregon-postgres.render.com',
  port: 5432,
  database: 'findmyinterior_db',
  user: 'findmyinterior_db_user',
  password: 'WIBm9aTAekpE9C8EqcBFaklLTJRUO6LD',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  const awarded = await client.query("SELECT * FROM projects WHERE status = 'awarded' LIMIT 1");
  console.log("Awarded Project:", awarded.rows[0]);
  
  await client.end();
}
run().catch(console.error);
