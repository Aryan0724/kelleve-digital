const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const TIMEOUT_MS = 60000;

async function runEndToEndFunnel() {
    console.log("Starting Core Business Funnel E2E Verification...");
    const browser = await puppeteer.launch({ headless: 'new' });
    const custPage = await browser.newPage();
    custPage.on('console', msg => console.log('CUST PAGE LOG:', msg.text()));
    const profPage = await browser.newPage();
    profPage.on('console', msg => console.log('PROF PAGE LOG:', msg.text()));

    const waitForDashboard = async (page) => {
        const start = Date.now();
        while (Date.now() - start < 45000) {
            if (page.url().includes('dashboard')) return true;
            await new Promise(r => setTimeout(r, 1000));
        }
        throw new Error('Timeout waiting for dashboard');
    };

    let steps = [];
    const logStep = (step, result, notes = "") => {
        console.log(`[${result ? 'PASS' : 'FAIL'}] ${step} ${notes ? '- ' + notes : ''}`);
        steps.push({ step, result, notes });
    };

    try {
        // ==========================================
        // 1. CUSTOMER POST REQUIREMENT
        // ==========================================
        const custEmail = `customer_${Date.now()}@test.com`;
        await custPage.goto(`${BASE_URL}/register`);
        await custPage.select('select', 'customer');
        await custPage.type('#name', 'E2E Customer');
        await custPage.type('#phone', '9999999999');
        await custPage.type('#email', custEmail);
        await custPage.type('#password', 'password123');
        await custPage.type('#password_confirmation', 'password123');
        
        console.log("Customer clicking register...");
        await custPage.evaluate(() => document.querySelector('button.bg-orange-600').click());
        
        console.log("Waiting for dashboard URL...");
        try {
            await waitForDashboard(custPage);
            await custPage.screenshot({ path: 'artifacts/step1_cust_dashboard.png' });
            logStep('Customer Register & Login', true);
        } catch (e) {
            throw new Error(`Customer failed to reach dashboard. URL: ${custPage.url()} Error: ${e.message}`);
        }

        console.log("Customer posting requirement...");
        await custPage.goto(`${BASE_URL}/post-requirement`);
        await custPage.waitForSelector('#title', { timeout: TIMEOUT_MS });
        
        // Clear and type
        await custPage.evaluate(() => {
            document.querySelector('#title').value = '';
            document.querySelector('#description').value = '';
            document.querySelector('#city').value = '';
            document.querySelector('#district').value = '';
            document.querySelector('#name').value = '';
            document.querySelector('#phone').value = '';
        });

        await custPage.type('#title', 'E2E Test Project 3BHK');
        await custPage.type('#description', 'This is an end to end test project.');
        await custPage.type('#city', 'Patna');
        await custPage.type('#district', 'Patna');
        await custPage.type('#name', 'E2E Customer Name');
        await custPage.type('#phone', '9999999999');
        console.log("Submitting requirement...");
        
        const [response] = await Promise.all([
            custPage.waitForResponse(res => res.url().includes('/requirements') && res.request().method() === 'POST', { timeout: TIMEOUT_MS }).catch(e => null),
            custPage.evaluate(() => document.querySelector('button.bg-orange-600').click())
        ]);

        if (response) {
            console.log(`API Response Status: ${response.status()}`);
            if (response.status() !== 201) {
                const body = await response.text();
                throw new Error(`API failed: ${response.status()} - ${body}`);
            }
        } else {
            console.log("No API response captured or timed out.");
        }

        // Wait for success or check if error appears
        try {
            await custPage.waitForSelector('.text-green-600, .bg-red-50', { timeout: TIMEOUT_MS });
            const errorElement = await custPage.$('.bg-red-50');
            if (errorElement) {
                const errorMsg = await custPage.evaluate(el => el.textContent, errorElement);
                throw new Error(`Form submission failed with error: ${errorMsg}`);
            }
            await custPage.waitForSelector('.text-green-600', { timeout: TIMEOUT_MS });
        } catch (err) {
            await custPage.screenshot({ path: 'artifacts/step2_cust_requirement_posted_error.png' });
            throw err;
        }
        
        await custPage.screenshot({ path: 'artifacts/step2_cust_requirement_posted.png' });
        
        logStep('Customer Post Requirement', true);

        // ==========================================
        // 2. PROFESSIONAL VIEWS & UNLOCKS LEAD
        // ==========================================
        const profEmail = `prof_${Date.now()}@test.com`;
        await profPage.goto(`${BASE_URL}/register`);
        await profPage.select('select', 'business'); // or builder
        await profPage.type('#name', 'E2E Professional');
        await profPage.type('#phone', '8888888888');
        await profPage.type('#email', profEmail);
        await profPage.type('#password', 'password123');
        await profPage.type('#password_confirmation', 'password123');
        
        console.log("Professional clicking register...");
        await profPage.evaluate(() => document.querySelector('button.bg-orange-600').click());
        
        console.log("Waiting for dashboard URL...");
        try {
            await waitForDashboard(profPage);
            await profPage.screenshot({ path: 'artifacts/step3_prof_dashboard.png' });
            logStep('Professional Register & Login', true);
        } catch (e) {
            throw new Error(`Professional failed to reach dashboard. URL: ${profPage.url()} Error: ${e.message}`);
        }

        console.log("Professional viewing leads...");
        // We are already on the dashboard. Let's pause and see if we can find the project in the UI
        await profPage.waitForFunction("document.body.innerText.includes('E2E Test Project 3BHK')", { timeout: TIMEOUT_MS }).catch(()=>{});
        
        const pageText = await profPage.evaluate(() => document.body.innerText);
        if (pageText.includes('E2E Test Project 3BHK')) {
            await profPage.screenshot({ path: 'artifacts/step4_prof_sees_requirement.png' });
            logStep('Professional sees Requirement', true);
        } else {
            await profPage.screenshot({ path: 'artifacts/error_prof_missing_requirement.png' });
            throw new Error('Professional could not see the requirement on dashboard.');
        }

        // Try to click unlock/bid
        // We will do this after ensuring the UI has these buttons.
        
    } catch (e) {
        logStep('Encountered Error', false, e.message);
        await custPage.screenshot({ path: 'artifacts/error_cust_state.png' }).catch(()=>{});
        console.error(e);
    } finally {
        fs.writeFileSync('E2E_FUNNEL_REPORT.md', steps.map(s => `- [${s.result ? 'x' : ' '}] ${s.step} ${s.notes ? '('+s.notes+')' : ''}`).join('\n'));
        console.log("Wrote E2E_FUNNEL_REPORT.md");
        process.exit(0);
    }
}

runEndToEndFunnel();
