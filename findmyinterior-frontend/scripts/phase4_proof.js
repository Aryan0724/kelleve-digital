const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const dns = require('node:dns');

dns.setDefaultResultOrder('ipv4first');

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://127.0.0.1:8000/api/v1';
const ARTIFACTS_DIR = path.join(__dirname, '../artifacts');

if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR);
}

async function run() {
    console.log("Starting Phase 4 Proof...");
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    page.setDefaultNavigationTimeout(300000);
    page.setDefaultTimeout(300000);

    const rnd = Math.floor(10000 + Math.random() * 90000);
    const custEmail = `cust4_${rnd}@test.com`;
    const proEmail = `pro4_${rnd}@test.com`;
    const reqTitle = `Phase 4 Messaging Req ${rnd}`;

    // --- SETUP DATA VIA API ---
    console.log("Setting up Users and Messaging via API...");
    let customerToken = "";
    let proToken = "";
    let reqId = null;
    let bidId = null;

    try {
        // 1. Register Customer
        console.log("Registering Customer...");
        const custReg = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                name: "Phase4 Customer",
                email: custEmail,
                phone: `91111${rnd}`,
                password: "password123",
                password_confirmation: "password123",
                role: "customer"
            })
        });
        const custData = await custReg.json();
        customerToken = custData.token || custData.data?.token;

        // 2. Register Professional
        console.log("Registering Professional...");
        const proReg = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                name: "Phase4 Pro",
                email: proEmail,
                phone: `92222${rnd}`,
                password: "password123",
                password_confirmation: "password123",
                role: "business"
            })
        });
        const proData = await proReg.json();
        proToken = proData.token || proData.data?.token;
        const proUserId = proData.data?.user?.id || proData.user?.id;

        // 3. Post Requirement
        console.log("Posting Requirement...");
        const reqPost = await fetch(`${API_URL}/requirements`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${customerToken}` },
            body: JSON.stringify({
                title: reqTitle,
                description: "Test for messaging.",
                city: "Patna",
                district: "Patna",
                budget_min: 50000,
                budget_max: 100000,
                category_id: 1,
                name: "Phase4 Customer",
                phone: `91111${rnd}`
            })
        });
        const reqData = await reqPost.json();
        reqId = reqData.data?.id || reqData.id;

        // 4. Add Funds to Pro
        console.log("Adding funds...");
        await fetch(`${API_URL}/wallet/add-funds`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${proToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 1000, reference_id: `mock_tx_msg_${rnd}` })
        });

        // 5. Pro Unlocks Lead
        console.log("Unlocking lead...");
        await fetch(`${API_URL}/requirements/${reqId}/unlock`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${proToken}`, 'Content-Type': 'application/json' }
        });

        // 6. Pro Submits Bid
        console.log("Submitting bid...");
        const bidRes = await fetch(`${API_URL}/bids`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${proToken}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                requirement_id: reqId,
                amount: 75000,
                timeline_days: 15,
                proposal_message: `Let's discuss this!`,
            })
        });
        const bidData = await bidRes.json();
        bidId = bidData.data?.id || bidData.id;

        // 7. Customer Awards Project
        console.log("Awarding project...");
        await fetch(`${API_URL}/bids/${bidId}/award`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${customerToken}`, 'Accept': 'application/json' }
        });

        // 8. Customer Initiates Conversation
        console.log("Initiating conversation...");
        const convRes = await fetch(`${API_URL}/requirements/${reqId}/conversations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
            body: JSON.stringify({ vendor_id: proUserId })
        });
        const convData = await convRes.json();
        const convId = convData.id;

        // 9. Customer sends first message via API
        console.log("Sending message API...");
        await fetch(`${API_URL}/conversations/${convId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
            body: JSON.stringify({ message: "Hello! I awarded you the project." })
        });

        console.log(`API Setup Complete. Conv ID: ${convId}`);
    } catch (e) {
        console.error("Failed API setup", e);
    }
    
    // --- UI AUTOMATION (As Professional) ---
    console.log("Injecting Pro Auth Token into LocalStorage...");
    await page.goto(`${BASE_URL}`, { waitUntil: 'domcontentloaded' });
    
    await page.evaluate((token, email) => {
        localStorage.setItem('auth-storage', JSON.stringify({
            state: {
                token: token,
                user: { id: 888, name: "Phase4 Pro", email: email, roles: [{slug: "business"}] },
                isCustomer: false
            },
            version: 0
        }));
        localStorage.setItem('auth_token', token);
    }, proToken, proEmail);

    console.log("Navigating directly to Messages...");
    await page.goto(`${BASE_URL}/messages`, { waitUntil: 'networkidle0' });
    
    // Wait for the conversation list to render
    await page.waitForSelector('h3.font-semibold', { timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase4_1_pro_inbox.png') });

    console.log("Clicking on Conversation...");
    await page.evaluate(() => {
        const conv = document.querySelector('h3.font-semibold');
        if (conv) conv.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase4_2_chat_window.png') });

    console.log("Sending a reply...");
    await page.type('input[placeholder="Type your message..."]', "Thanks! I am ready to start.");
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const sendBtn = btns.find(b => b.querySelector('svg.lucide-send'));
        if (sendBtn) sendBtn.click();
    });

    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase4_3_reply_sent.png') });

    console.log("Phase 4 Proof complete.");
    await browser.close();
}

run().catch(e => {
    console.error(e);
    process.exit(1);
});
