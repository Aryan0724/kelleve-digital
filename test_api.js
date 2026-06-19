const API_BASE = 'http://localhost:8000/api/v1';

async function fetchJSON(path, options = {}) {
  const { headers, ...restOptions } = options;
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(headers || {})
      },
      ...restOptions
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      data = text;
    }
    return { status: res.status, data };
  } catch(e) {
    return { status: 500, error: e.message };
  }
}

async function runTests() {
  console.log("Starting Backend API Verification...\n");

  const rand = Date.now();

  // 1. Register Customer
  console.log("--- 1. Register Customer ---");
  const custRes = await fetchJSON('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: 'Audit Customer', email: `audit_cust_${rand}@test.com`, password: 'password123', password_confirmation: 'password123', role: 'customer' })
  });
  console.log(`Status: ${custRes.status}`);
  if (custRes.status !== 201) console.log(custRes.data);
  const customerToken = custRes.data?.data?.token;

  // 2. Register Vendor
  console.log("\n--- 2. Register Vendor ---");
  const vendorRes = await fetchJSON('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: 'Audit Vendor', email: `audit_vend_${rand}@test.com`, password: 'password123', password_confirmation: 'password123', role: 'business' })
  });
  console.log(`Status: ${vendorRes.status}`);
  if (vendorRes.status !== 201) console.log(vendorRes.data);
  const vendorToken = vendorRes.data?.data?.token;

  // 3. Post Requirement (Customer)
  console.log("\n--- 3. Post Requirement ---");
  const reqRes = await fetchJSON('/requirements', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${customerToken}` },
    body: JSON.stringify({
      title: 'Need Kitchen Design',
      description: 'Test desc',
      category_id: 1,
      project_type: 'Residential',
      city: 'Patna',
      district: 'Patna',
      budget_min: 100000,
      budget_max: 200000,
      name: 'Audit Customer',
      phone: '9999999999'
    })
  });
  console.log(`Status: ${reqRes.status}`);
  if (reqRes.status !== 201) console.log(reqRes.data);
  let reqId = reqRes.data?.data?.id || 1;

  // 4. Submit Bid (Vendor)
  console.log("\n--- 4. Submit Bid ---");
  const bidRes = await fetchJSON('/bids', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${vendorToken}` },
    body: JSON.stringify({
      requirement_id: reqId,
      estimated_cost: 50000,
      timeline_days: 10,
      proposal_message: "We can do this!",
      experience_years: 5
    })
  });
  console.log(`Status: ${bidRes.status}`);
  if (bidRes.status !== 201) console.log(bidRes.data);

  // 5. Unlock Contact (Vendor) - Expected to fail (no funds)
  console.log("\n--- 5. Unlock Contact (Without Funds) ---");
  const unlockRes1 = await fetchJSON(`/requirements/${reqId}/unlock`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${vendorToken}` }
  });
  console.log(`Status: ${unlockRes1.status}`);
  console.log(unlockRes1.data);

  // 6. Wallet Recharge (Vendor)
  console.log("\n--- 6. Wallet Recharge ---");
  const walletRes = await fetchJSON(`/wallet/add-funds`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${vendorToken}` },
    body: JSON.stringify({ amount: 1000, user_id: vendorRes.data?.data?.user?.id, description: 'Test Recharge' })
  });
  console.log(`Status: ${walletRes.status}`);
  if (walletRes.status !== 200 && walletRes.status !== 201) console.log(walletRes.data);

  // 7. Unlock Contact (With Funds)
  console.log("\n--- 7. Unlock Contact (With Funds) ---");
  const unlockRes2 = await fetchJSON(`/requirements/${reqId}/unlock`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${vendorToken}` }
  });
  console.log(`Status: ${unlockRes2.status}`);
  if (unlockRes2.status !== 200 && unlockRes2.status !== 201) console.log(unlockRes2.data);
  
  // 8. Subscription Init
  console.log("\n--- 8. Init Subscription ---");
  const subRes = await fetchJSON(`/payments/create-order`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${vendorToken}` },
    body: JSON.stringify({
      purpose: 'subscription',
      subscription_plan_id: 1,
      billing_cycle: 'monthly'
    })
  });
  console.log(`Status: ${subRes.status}`);
  console.log(subRes.data);
}

runTests();
