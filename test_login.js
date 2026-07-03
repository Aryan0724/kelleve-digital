const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email: 'audit_cust_1@test.com', password: 'password123' })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
