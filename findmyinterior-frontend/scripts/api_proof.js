const fs = require('fs');

async function run() {
  console.log("Starting API-level proof...");
  const API_URL = 'http://localhost:8000/api/v1';

  try {
    // 1. Customer Register
    console.log("1. Registering Customer...");
    const custEmail = `cust_${Date.now()}@test.com`;
    let res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: "API Customer", email: custEmail, phone: "9999999999", role: "customer",
        password: "password123", password_confirmation: "password123"
      })
    });
    if (!res.ok) throw new Error("Customer Register failed: " + await res.text());
    const custData = await res.json();
    const custToken = custData.data.token;
    console.log("Customer Registered successfully.");

    // 2. Post Requirement
    console.log("2. Posting Requirement...");
    res = await fetch(`${API_URL}/requirements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${custToken}` },
      body: JSON.stringify({
        title: "API Test Project", description: "This is a test description", category_id: 1, city: "Patna", district: "Patna", name: "API Customer", phone: "9999999999"
      })
    });
    if (!res.ok) throw new Error("Post requirement failed: " + await res.text());
    const reqData = await res.json();
    const reqId = reqData.data?.id || reqData.requirement?.id;
    console.log("Requirement posted successfully. ID:", reqId);

    // 3. Professional Register
    console.log("3. Registering Professional...");
    const profEmail = `prof_${Date.now()}@test.com`;
    res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: "API Professional", email: profEmail, phone: "8888888888", role: "business",
        password: "password123", password_confirmation: "password123"
      })
    });
    if (!res.ok) throw new Error("Professional Register failed: " + await res.text());
    const profData = await res.json();
    const profToken = profData.data.token;
    console.log("Professional Registered successfully.");

    // Add wallet balance
    require('child_process').execSync(`php artisan tinker --execute="\\App\\Models\\User::where('email', '${profEmail}')->update(['wallet_balance' => 5000]);"`, { cwd: 'd:\\find my interior\\findmyinterior-backend' });

    // 4. Unlock Lead
    console.log("4. Unlocking Lead...");
    res = await fetch(`${API_URL}/requirements/${reqId}/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${profToken}` }
    });
    if (!res.ok) throw new Error("Unlock lead failed: " + await res.text());
    console.log("Lead unlocked successfully.");

    // 5. Submit Bid
    console.log("5. Submitting Bid...");
    res = await fetch(`${API_URL}/requirements/${reqId}/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${profToken}` },
      body: JSON.stringify({
        amount: 50000, timeline_days: 14, proposal: "I will do it."
      })
    });
    if (!res.ok) throw new Error("Submit bid failed: " + await res.text());
    const bidData = await res.json();
    const bidId = bidData.data?.id || bidData.bid?.id || bidData.id;
    console.log("Bid submitted successfully. Bid ID:", bidId);

    // 6. Award Bid
    console.log("6. Awarding Bid...");
    res = await fetch(`${API_URL}/bids/${bidId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${custToken}` },
      body: JSON.stringify({ status: "awarded" })
    });
    // some systems might use /accept or similar. We'll check the response.
    if (!res.ok) {
        res = await fetch(`${API_URL}/bids/${bidId}/accept`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${custToken}` }
        });
    }
    if (!res.ok) throw new Error("Award bid failed: " + await res.text());
    console.log("Bid awarded successfully!");

    fs.writeFileSync('artifacts/api_proof_report.json', JSON.stringify({ status: "SUCCESS" }));
    console.log("API Proof Completed Successfully.");

  } catch (err) {
    console.error(err.message);
  }
}

run();
