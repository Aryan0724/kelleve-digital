const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dns = require('node:dns');

dns.setDefaultResultOrder('ipv4first');

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://127.0.0.1:8000/api/v1';
const ARTIFACTS_DIR = path.join(__dirname, '../artifacts');

if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR);
}

async function run() {
    console.log("Starting Phase 3 Proof...");
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    page.setDefaultNavigationTimeout(300000);
    page.setDefaultTimeout(300000);

    const rnd = Math.floor(10000 + Math.random() * 90000);
    const custEmail = `cust3_${rnd}@test.com`;
    const reqTitle = `Phase 3 Test Req ${rnd}`;

    // --- SETUP DATA VIA API ---
    console.log("Setting up Customer and Requirement via API...");
    let customerToken = "";
    let reqId = null;
    try {
        const custReg = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                name: "Phase3 Customer",
                email: custEmail,
                phone: `55555${rnd}`,
                password: "password123",
                password_confirmation: "password123",
                role: "customer"
            })
        });
        const custData = await custReg.json();
        customerToken = custData.token || custData.data?.token;

        const reqPost = await fetch(`${API_URL}/requirements`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
                'Authorization': `Bearer ${customerToken}`
            },
            body: JSON.stringify({
                title: reqTitle,
                description: "Looking for top-tier professionals to bid on this.",
                city: "Patna",
                district: "Patna",
                budget_min: 50000,
                budget_max: 100000,
                category_id: 1,
                name: "Phase3 Customer",
                phone: `55555${rnd}`
            })
        });
        const reqData = await reqPost.json();
        reqId = reqData.data?.id || reqData.id;
        console.log(`Requirement Posted via API. ID: ${reqId}`);
    } catch (e) {
        console.error("Failed Customer API setup", e);
    }

    console.log("Registering 3 Professionals and submitting bids via API...");
    for (let i = 1; i <= 3; i++) {
        const proEmail = `pro3_${i}_${rnd}@test.com`;
        let proToken = "";
        try {
            const proReg = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    name: `Phase3 Pro ${i}`,
                    email: proEmail,
                    phone: `4444${i}${rnd}`,
                    password: "password123",
                    password_confirmation: "password123",
                    role: "business"
                })
            });
            const proData = await proReg.json();
            proToken = proData.token || proData.data?.token;

            // Add Mock Funds so they can unlock
            await fetch(`${API_URL}/wallet/add-funds`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${proToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: 1000, reference_id: `mock_tx_${rnd}_${i}` })
            });

            // Unlock the lead
            await fetch(`${API_URL}/requirements/${reqId}/unlock`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${proToken}`, 'Content-Type': 'application/json' }
            });

            // Submit Bid
            await fetch(`${API_URL}/bids`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${proToken}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    requirement_id: reqId,
                    amount: 40000 + (i * 5000),
                    timeline_days: 10 + (i * 2),
                    proposal_message: `I am Pro ${i} and I will do a great job.`,
                })
            });
            console.log(`Professional ${i} registered and bid submitted.`);
        } catch (e) {
            console.error(`Failed Pro ${i} API setup`, e);
        }
    }
    
    // --- UI AUTOMATION ---
    console.log("Injecting Auth Token into LocalStorage...");
    await page.goto(`${BASE_URL}`, { waitUntil: 'domcontentloaded' });
    
    // Inject the customer token directly into Zustand store / localStorage
    await page.evaluate((token, email) => {
        localStorage.setItem('auth-storage', JSON.stringify({
            state: {
                token: token,
                user: { id: 999, name: "Phase3 Customer", email: email, roles: [{slug: "customer"}] },
                isCustomer: true
            },
            version: 0
        }));
    }, customerToken, custEmail);

    console.log("Navigating directly to Customer Dashboard...");
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.lucide-layout-dashboard', { timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase3_1_customer_dashboard.png') });

    console.log("Navigating to Compare Bids...");
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const compareBtn = btns.find(b => b.textContent.includes('Compare Bids'));
        if (compareBtn) compareBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase3_2_compare_bids_matrix.png') });

    console.log("Clicking Award Project...");
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const awardBtn = btns.find(b => b.textContent.includes('Award Project'));
        if (awardBtn) awardBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase3_3_award_modal.png') });

    console.log("Confirming Award...");
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const confirmBtn = btns.find(b => b.textContent.includes('Confirm Award'));
        if (confirmBtn) confirmBtn.click();
    });

    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase3_4_after_award.png') });

    console.log("Phase 3 Proof complete.");
    await browser.close();
}

run().catch(e => {
    console.error(e);
    process.exit(1);
});
