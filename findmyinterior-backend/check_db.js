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
  const res = await client.query('SELECT * FROM contact_unlocks LIMIT 1');
  if (res.rows.length > 0) {
    const unlock = res.rows[0];
    console.log("Unlock:", unlock);
    
    // Now get the requirement
    let reqRes;
    if (unlock.requirement_type === 'App\\\\Models\\\\Requirement' || unlock.requirement_type === 'App\\\\Models\\\\Project') {
        reqRes = await client.query('SELECT * FROM projects WHERE id = ', [unlock.requirement_id]);
    } else if (unlock.requirement_type === 'App\\\\Models\\\\Rfq') {
        reqRes = await client.query('SELECT * FROM rfqs WHERE id = ', [unlock.requirement_id]);
    } else if (unlock.requirement_type === 'App\\\\Models\\\\WorkerJob') {
        reqRes = await client.query('SELECT * FROM worker_jobs WHERE id = ', [unlock.requirement_id]);
    }
    
    if (reqRes && reqRes.rows.length > 0) {
        console.log("Requirement:", reqRes.rows[0]);
    }
  }
  
  // also find a project that is 'awarded'
  const awarded = await client.query("SELECT * FROM projects WHERE status = 'awarded' LIMIT 1");
  console.log("Awarded Project:", awarded.rows[0]);
  
  await client.end();
}
run().catch(console.error);
