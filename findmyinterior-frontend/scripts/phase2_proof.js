const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://127.0.0.1:8000/api/v1';
const ARTIFACTS_DIR = path.join(__dirname, '../artifacts');

if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR);
}

async function run() {
    console.log("Starting Phase 2 Proof...");
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    page.setDefaultNavigationTimeout(300000);
    page.setDefaultTimeout(300000);
    
    let latestAlert = "";
    page.on('dialog', async dialog => {
        latestAlert = dialog.message();
        console.log("Alert:", latestAlert);
        await dialog.accept();
    });

    const rnd = Math.floor(10000 + Math.random() * 90000);
    const proEmail = `pro2_${rnd}@test.com`;
    const custEmail = `cust2_${rnd}@test.com`;
    const reqTitle = `Test Requirement ${rnd}`;

    // --- SETUP DATA VIA API ---
    console.log("Setting up Customer and Requirement via API...");
    let customerToken = "";
    try {
        const custReg = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                name: "Phase2 Customer API",
                email: custEmail,
                phone: `77777${rnd}`,
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
                description: "API generated requirement",
                city: "Patna",
                district: "Patna",
                budget_min: 50000,
                budget_max: 100000,
                category_id: 1,
                name: "Phase2 Customer API",
                phone: `77777${rnd}`
            })
        });
        await reqPost.json();
        console.log("Requirement Posted via API.");
    } catch (e) {
        console.error("Failed Customer API setup", e);
    }

    console.log(`Registering Professional: ${proEmail} via API...`);
    let proToken = "";
    try {
        const proReg = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                name: "Phase2 Pro API",
                email: proEmail,
                phone: `66666${rnd}`,
                password: "password123",
                password_confirmation: "password123",
                role: "business"
            })
        });
        const proData = await proReg.json();
        proToken = proData.token || proData.data?.token;

        console.log("Adding mock funds via API...");
        await fetch(`${API_URL}/wallet/add-funds`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${proToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 1000, reference_id: `mock_tx_${rnd}` })
        });
        console.log("Professional Setup Complete.");
    } catch (e) {
        console.error("Failed Pro API setup", e);
    }

    // 1. Professional Login via UI
    console.log("Logging in via UI...");
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#email');
    await page.type('#email', proEmail);
    await page.type('#password', 'password123');
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const loginBtn = btns.find(b => b.textContent.includes('Login'));
        if (loginBtn) loginBtn.click();
    });

    // 2. View Dashboard
    console.log("Viewing Professional Dashboard...");
    await page.waitForSelector('.lucide-layout-dashboard', { timeout: 10000 }).catch(e => console.log("Timeout waiting for dashboard icon"));
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase2_1_dashboard_loaded.png') });

    // 3. View Available Leads
    console.log("Viewing Available Leads...");
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const leadBtn = btns.find(b => b.textContent.includes('Available Leads'));
        if (leadBtn) leadBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase2_2_available_leads.png') });

    // 4. Unlock Lead
    console.log("Unlocking Lead...");
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const unlockBtn = btns.find(b => b.textContent.includes('Unlock (₹50)'));
        if (unlockBtn) unlockBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000)); // wait for API alert
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase2_3_unlocked_lead.png') });

    // 5. View Unlocked Leads Tab
    console.log("Viewing Unlocked Leads Tab...");
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const unlockedBtn = btns.find(b => b.textContent.includes('Unlocked Leads'));
        if (unlockedBtn) unlockedBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase2_4_unlocked_tab.png') });

    // 6. Submit Bid
    console.log("Submitting Bid...");
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const submitBtn = btns.find(b => b.textContent.includes('Submit Bid'));
        if (submitBtn) submitBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    
    // Fill Bid Form
    await page.type('input[placeholder="e.g. 50000"]', "45000");
    await page.type('input[placeholder="e.g. 30"]', "15");
    await page.type('textarea[placeholder="Explain why you are the best fit for this project..."]', "I have exactly the experience you need.");
    
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase2_5_bid_form_filled.png') });
    
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const confirmBtn = btns.find(b => b.textContent.includes('Confirm & Submit Bid'));
        if (confirmBtn) confirmBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    // 7. Verify My Bids Tab
    console.log("Verifying My Bids Tab...");
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const myBidsBtn = btns.find(b => b.textContent.includes('My Bids'));
        if (myBidsBtn) myBidsBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase2_6_my_bids_tab.png') });

    // 8. Simulate Customer Awarding Bid
    console.log("Simulating Customer Awarding Bid...");
    const getBidIdCmd = `php artisan tinker --execute="echo \\App\\Models\\Bid::latest()->first()->id;"`;
    const bidIdBuffer = execSync(getBidIdCmd, { cwd: 'd:\\find my interior\\findmyinterior-backend' });
    const bidId = parseInt(bidIdBuffer.toString().trim().replace(/[^0-9]/g, ''));
    console.log(`Found Bid ID: ${bidId}`);

    const awardRes = await fetch(`${API_URL}/bids/${bidId}/award`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${customerToken}`,
            'Accept': 'application/json'
        }
    });
    const awardData = await awardRes.json();
    console.log("Awarded:", awardData);

    // 9. Verify Won Projects Tab
    console.log("Verifying Won Projects Tab...");
    await page.reload({ waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const wonBtn = btns.find(b => b.textContent.includes('Won Projects'));
        if (wonBtn) wonBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase2_7_won_projects_tab.png') });

    console.log("Phase 2 Proof complete.");
    await browser.close();
}

run().catch(e => {
    console.error(e);
    process.exit(1);
});
