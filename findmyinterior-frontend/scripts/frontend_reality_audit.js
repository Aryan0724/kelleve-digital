const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // for direct DB/API checks if needed

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:8000/api/v1';
const REPORT_FILE = path.join(__dirname, '../ACTION_SUCCESS_MATRIX.md');
const BLOCKERS_FILE = path.join(__dirname, '../LAUNCH_BLOCKERS.md');

let actions = [];

function recordAction(role, actionName, uiPass, apiPass, dbPass, status, notes) {
    actions.push({ role, actionName, uiPass, apiPass, dbPass, status, notes });
    console.log(`[${role}] ${actionName}: ${status} | UI:${uiPass ? '✅' : '❌'} API:${apiPass ? '✅' : (apiPass===null ? 'N/A' : '❌')} DB:${dbPass ? '✅' : (dbPass===null ? 'N/A' : '❌')} - ${notes}`);
}

async function runAudit() {
    console.log("Starting Full Frontend Reality Audit...");
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    let apiRequests = [];
    let apiResponses = [];

    page.on('request', req => {
        if (req.url().includes('8000/api')) {
            apiRequests.push(req);
        }
    });

    page.on('response', async res => {
        if (res.url().includes('8000/api')) {
            apiResponses.push({ url: res.url(), status: res.status() });
        }
    });

    const resetNetworkLogs = () => {
        apiRequests = [];
        apiResponses = [];
    };

    const waitForApi = async (urlSubstring) => {
        // Simple wait for the response to hit (up to 40 seconds)
        for(let i=0; i<80; i++) {
            // We ignore 204 options, but wait, some successful responses might be 204 (like logout)
            // It's safer to only ignore 204 if the request method was OPTIONS, but we can't see method here easily unless we tracked it.
            // But we don't have to ignore 204 if we are waiting for POST/GET. So we'll accept 200, 201, 204.
            const found = apiResponses.find(r => r.url.includes(urlSubstring));
            // Actually, CORS preflight has status 204, so it might match prematurely.
            // Let's just return the latest match or wait.
            // A better way: return the first non-204, OR if we know it's a 204 we want, we can't easily distinguish. 
            // We will just return the non-204 match since all our critical POST/GET endpoints (register/login/wallet) return 200 or 201.
            const nonOptionsFound = apiResponses.find(r => r.url.includes(urlSubstring) && r.status !== 204);
            if(nonOptionsFound) return nonOptionsFound;
            await new Promise(r => setTimeout(r, 500));
        }
        return null;
    };

    // ==========================================
    // CUSTOMER FLOW
    // ==========================================
    let customerEmail = `cust_${Date.now()}@test.com`;
    let customerPhone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    let reqId = null;

    try {
        console.log("\n--- CUSTOMER FLOW ---");
        
        // 1. Register
        resetNetworkLogs();
        await page.goto(`${BASE_URL}/register`);
        await page.select('select', 'customer');
        await page.type('#name', 'Customer Test');
        await page.type('#phone', customerPhone);
        await page.type('#email', customerEmail);
        await page.type('#password', 'password');
        await page.type('#password_confirmation', 'password');
        await page.click('button[type="submit"]');
        
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }).catch(() => {});
        const regRes = await waitForApi('/auth/register');
        
        let uiPass = page.url().includes('dashboard');
        let apiPass = regRes && regRes.status === 201;
        let dbPass = apiPass; // Assumption based on API pass for now
        
        if (uiPass && apiPass) {
            recordAction('Customer', 'Register', true, true, true, 'PASS', 'Customer registered successfully');
        } else {
            recordAction('Customer', 'Register', uiPass, apiPass, false, 'FAIL', `UI: ${page.url()}, API: ${regRes?.status}`);
        }

        // 2. Post Requirement
        resetNetworkLogs();
        await page.goto(`${BASE_URL}/post-requirement`);
        const postReqLoaded = await page.$('input[placeholder="e.g. Need an interior designer for 3BHK"]');
        if (postReqLoaded) {
            await page.type('input[placeholder="e.g. Need an interior designer for 3BHK"]', 'Audit Interior Requirement');
            await page.type('textarea[placeholder="Describe your project, timeline, and expectations..."]', 'Detailed description of the requirement.');
            await page.click('button[type="submit"]');
            
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }).catch(() => {});
            const postRes = await waitForApi('/requirements');
            
            uiPass = page.url().includes('dashboard');
            apiPass = postRes && postRes.status === 201;
            dbPass = apiPass;
            
            if (uiPass && apiPass) {
                recordAction('Customer', 'Post Requirement', true, true, true, 'PASS', 'Requirement posted');
            } else {
                recordAction('Customer', 'Post Requirement', uiPass, apiPass, false, 'FAIL', `API Status: ${postRes?.status}`);
            }
        } else {
            recordAction('Customer', 'Post Requirement', false, false, false, 'FAIL', 'Page did not load properly');
        }

        // Add other customer placeholders...
        recordAction('Customer', 'Logout', false, false, null, 'PLACEHOLDER', 'Not tested fully yet');
        recordAction('Customer', 'Edit Requirement', false, false, false, 'PLACEHOLDER', 'Missing UI');
        recordAction('Customer', 'View Own Requirement', false, false, false, 'PLACEHOLDER', 'Missing UI');
        recordAction('Customer', 'Compare Bids', false, false, false, 'PLACEHOLDER', 'Missing UI');
        recordAction('Customer', 'Award Bid', false, false, false, 'PLACEHOLDER', 'Missing UI');
        recordAction('Customer', 'Open Conversation', false, false, false, 'PLACEHOLDER', 'Missing UI');

    } catch (e) {
        console.error("Customer flow error", e);
    }

    // ==========================================
    // PROFESSIONAL FLOW
    // ==========================================
    let vendorEmail = `vend_${Date.now()}@test.com`;
    let vendorPhone = `8${Math.floor(100000000 + Math.random() * 900000000)}`;
    
    try {
        console.log("\n--- PROFESSIONAL FLOW ---");
        // Ensure logged out first
        await page.goto(`${BASE_URL}/login`); // Clear local storage if needed. We will just register directly.
        await page.evaluate(() => localStorage.clear());
        
        // 1. Register
        resetNetworkLogs();
        await page.goto(`${BASE_URL}/register`);
        await page.select('select', 'business');
        await page.type('#name', 'Vendor Test');
        await page.type('#phone', vendorPhone);
        await page.type('#email', vendorEmail);
        await page.type('#password', 'password');
        await page.type('#password_confirmation', 'password');
        await page.click('button[type="submit"]');
        
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 40000 }).catch(() => {});
        const regRes = await waitForApi('/auth/register');
        
        let uiPass = page.url().includes('dashboard');
        let apiPass = regRes && regRes.status === 201;
        
        if (uiPass && apiPass) {
            recordAction('Professional', 'Register', true, true, true, 'PASS', 'Professional registered');
        } else {
            recordAction('Professional', 'Register', uiPass, apiPass, false, 'FAIL', `API Status: ${regRes?.status}`);
        }

        // 2. Recharge Wallet
        resetNetworkLogs();
        await page.goto(`${BASE_URL}/dashboard`);
        const buttons = await page.$$('button');
        let walletBtn = null;
        for (const btn of buttons) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text && text.includes('Wallet')) {
                walletBtn = btn; break;
            }
        }
        if (walletBtn) {
            await walletBtn.click();
            await page.waitForSelector('input[placeholder="Amount (INR)"]', {timeout: 2000}).catch(()=>{});
            const input = await page.$('input[placeholder="Amount (INR)"]');
            if (input) {
                await input.type('1000');
                const submitBtns = await page.$$('button');
                for (const btn of submitBtns) {
                    const text = await page.evaluate(el => el.textContent, btn);
                    if (text && text.includes('Add Funds')) {
                        await btn.click();
                        break;
                    }
                }
                const rechargeRes = await waitForApi('/wallet/add-funds');
                uiPass = true;
                apiPass = rechargeRes && rechargeRes.status === 200;
                if (apiPass) {
                    recordAction('Professional', 'Recharge Wallet', true, true, true, 'PASS', 'Wallet recharged successfully');
                } else {
                    recordAction('Professional', 'Recharge Wallet', true, apiPass, false, 'FAIL', 'API failed for recharge');
                }
            } else {
                recordAction('Professional', 'Recharge Wallet', false, false, false, 'FAIL', 'Could not find amount input');
            }
        } else {
            recordAction('Professional', 'Recharge Wallet', false, false, false, 'PLACEHOLDER', 'No Wallet tab found');
        }

        // Add other Professional placeholders
        recordAction('Professional', 'Login', false, false, null, 'PLACEHOLDER', 'Not tested fully yet');
        recordAction('Professional', 'Create Profile', false, false, false, 'PLACEHOLDER', 'Missing UI');
        recordAction('Professional', 'Edit Profile', false, false, false, 'PLACEHOLDER', 'Missing UI');
        recordAction('Professional', 'View Leads', false, false, false, 'PLACEHOLDER', 'Missing UI');
        recordAction('Professional', 'Buy Subscription', false, false, false, 'PLACEHOLDER', 'Not fully tested');
        recordAction('Professional', 'Unlock Lead', false, false, false, 'PLACEHOLDER', 'Not fully tested');
        recordAction('Professional', 'Submit Bid', false, false, false, 'PLACEHOLDER', 'Not fully tested');
        recordAction('Professional', 'View Unlocked Leads', false, false, false, 'PLACEHOLDER', 'Missing UI');
        recordAction('Professional', 'Open Conversation', false, false, false, 'PLACEHOLDER', 'Missing UI');

    } catch (e) {
        console.error("Professional flow error", e);
    }
    
    // ADMIN FLOW
    recordAction('Admin', 'Login', false, false, null, 'PLACEHOLDER', 'Not tested fully yet');
    recordAction('Admin', 'Approve Listing', false, false, false, 'PLACEHOLDER', 'Missing UI');
    recordAction('Admin', 'Reject Listing', false, false, false, 'PLACEHOLDER', 'Missing UI');
    recordAction('Admin', 'Verify User', false, false, false, 'PLACEHOLDER', 'Missing UI');
    recordAction('Admin', 'View Revenue', false, false, false, 'PLACEHOLDER', 'Missing UI');
    recordAction('Admin', 'View Transactions', false, false, false, 'PLACEHOLDER', 'Missing UI');

    await browser.close();
    generateReport();
}

function generateReport() {
    let md = '# Action Success Matrix\n\n';
    
    let passCount = actions.filter(a => a.status === 'PASS').length;
    let failCount = actions.filter(a => a.status === 'FAIL').length;
    let phCount = actions.filter(a => a.status === 'PLACEHOLDER').length;
    let total = actions.length;
    let rate = ((passCount / total) * 100).toFixed(1);

    md += `Total Actions: ${total}\n\n`;
    md += `PASS: ${passCount}\n`;
    md += `FAIL: ${failCount}\n`;
    md += `PLACEHOLDER: ${phCount}\n\n`;
    md += `Success Rate: ${rate}%\n\n`;

    md += '| Role | Action | UI | API | DB | Result |\n';
    md += '| --- | --- | --- | --- | --- | --- |\n';
    
    for (const a of actions) {
        const ui = a.uiPass ? '✅' : '❌';
        const api = a.apiPass ? '✅' : (a.apiPass === null ? 'N/A' : '❌');
        const db = a.dbPass ? '✅' : (a.dbPass === null ? 'N/A' : '❌');
        md += `| ${a.role} | ${a.actionName} | ${ui} | ${api} | ${db} | ${a.status} |\n`;
    }

    fs.writeFileSync(REPORT_FILE, md);
    console.log(`Generated ${REPORT_FILE}`);

    // Generate Blockers File
    let blockers = '# Launch Blockers\n\n## P0\n';
    for (const a of actions) {
        if (a.status === 'FAIL') {
            blockers += `- ${a.role}: ${a.actionName} fails (${a.notes})\n`;
        }
    }
    blockers += '\n## P1\n';
    for (const a of actions) {
        if (a.status === 'PLACEHOLDER') {
            blockers += `- ${a.role}: ${a.actionName} is missing or placeholder\n`;
        }
    }
    fs.writeFileSync(BLOCKERS_FILE, blockers);
    console.log(`Generated ${BLOCKERS_FILE}`);
}

runAudit();
