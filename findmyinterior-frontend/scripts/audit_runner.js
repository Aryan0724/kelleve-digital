const axios = require('axios');

const API_BASE = 'http://127.0.0.1:8000/api/v1';

async function testRevenueAudit() {
    console.log("=== STARTING REVENUE AUDIT ===");

    try {
        // 1. Authenticate as Vendor (Designer Test)
        console.log("--> Logging in as Designer Test...");
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: 'designer_test@example.com',
            password: 'password123'
        });
        
        const token = loginRes.data.data.token;
        console.log("--> Successfully logged in. Token acquired.");

        const headers = { Authorization: `Bearer ${token}` };

        // 2. Test Wallet Recharge
        console.log("\n--> Testing Wallet Recharge...");
        try {
            const rechargeRes = await axios.post(`${API_BASE}/wallet/add-funds`, {
                amount: 1000
            }, { headers });
            console.log("Wallet Recharge SUCCESS:", rechargeRes.data);
        } catch (e) {
            console.log("Wallet Recharge Init FAILED:", e.response ? e.response.status : e.message);
            console.log(e.response ? e.response.data : '');
        }

        // 3. Test Subscription Purchase
        console.log("\n--> Testing Subscription Purchase...");
        try {
            const plansRes = await axios.get(`${API_BASE}/subscriptions/plans`);
            if (plansRes.data && plansRes.data.data && plansRes.data.data.length > 0) {
                const planId = plansRes.data.data[0].id;
                console.log("Found Plan ID:", planId);
                
                const subRes = await axios.post(`${API_BASE}/payments/create-order`, {
                    purpose: 'subscription',
                    subscription_plan_id: planId,
                    billing_cycle: 'yearly'
                }, { headers });
                console.log("Subscription Purchase SUCCESS:", subRes.data);
            } else {
                console.log("No subscription plans found in the system.");
            }
        } catch (e) {
            console.log("Subscription Purchase FAILED:", e.response ? e.response.status : e.message);
            console.log(e.response ? e.response.data : '');
        }

        // 4. Test Lead Unlock
        console.log("\n--> Testing Lead Unlock...");
        try {
            const reqsRes = await axios.get(`${API_BASE}/requirements`);
            if (reqsRes.data && reqsRes.data.data && reqsRes.data.data.length > 0) {
                const leadId = reqsRes.data.data[0].id;
                console.log("Found Lead ID:", leadId);

                const unlockRes = await axios.post(`${API_BASE}/requirements/${leadId}/unlock`, {}, { headers });
                console.log("Lead Unlock SUCCESS:", unlockRes.data);
            } else {
                console.log("No leads found to unlock.");
            }
        } catch (e) {
            console.log("Lead Unlock FAILED:", e.response ? e.response.status : e.message);
            console.log(e.response ? e.response.data : '');
        }

    } catch (e) {
        console.error("CRITICAL FAILURE in Audit Runner:");
        console.error(e.response ? e.response.data : e.message);
        console.error("Full Error Object:", e);
    }
}

testRevenueAudit();
