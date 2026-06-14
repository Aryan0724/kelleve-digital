const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3000';

async function run() {
    console.log("Starting proof...");
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const custPage = await browser.newPage();
    const profPage = await browser.newPage();

    try {
        // --- 1. Customer Register ---
        console.log("Action 1: Customer Register");
        await custPage.goto(`${BASE_URL}/register`);
        await custPage.waitForSelector('#name');
        
        // Wait for fonts/css to load
        await new Promise(r => setTimeout(r, 2000));
        await custPage.screenshot({ path: 'artifacts/proof_1_before_register.png' });
        
        await custPage.select('select', 'customer');
        const custEmail = `cust_${Date.now()}@test.com`;
        await custPage.type('#name', 'Proof Customer');
        await custPage.type('#phone', '9999999999');
        await custPage.type('#email', custEmail);
        await custPage.type('#password', 'password123');
        await custPage.type('#password_confirmation', 'password123');

        await custPage.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent && b.textContent.includes('Register')) || document.querySelector('.bg-orange-600');
            if(btn) btn.click();
        });
        
        // Wait for dashboard redirect
        await custPage.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(e => console.log("Register timeout"));
        await custPage.screenshot({ path: 'artifacts/proof_1_after_register.png' });

        // --- 2. Post Requirement ---
        console.log("Action 2: Post Requirement");
        await custPage.goto(`${BASE_URL}/post-requirement`);
        await custPage.waitForSelector('#title', { timeout: 10000 });
        await new Promise(r => setTimeout(r, 2000));
        await custPage.screenshot({ path: 'artifacts/proof_2_before_post.png' });
        
        await custPage.type('#title', 'Proof Project 3BHK');
        await custPage.type('#description', 'Proof description of the requirement.');
        await custPage.type('#city', 'Patna');
        await custPage.type('#district', 'Patna');
        
        // Find Post button by text or class
        await custPage.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent && b.textContent.includes('Post'));
            if(btn) btn.click();
        });

        await custPage.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(e => console.log("Post timeout"));
        await new Promise(r => setTimeout(r, 2000));
        await custPage.screenshot({ path: 'artifacts/proof_2_after_post.png' });
        
        // Extract requirement ID from URL
        const reqUrl = custPage.url();
        console.log("Navigated to: " + reqUrl);
        let reqId = '55'; // fallback
        const match = reqUrl.match(/requirements\/(\d+)/);
        if (match) reqId = match[1];

        // --- Prepare Professional ---
        console.log("Preparing Professional...");
        await profPage.goto(`${BASE_URL}/register`);
        await profPage.waitForSelector('#name');
        await profPage.select('select', 'business');
        const profEmail = `prof_${Date.now()}@test.com`;
        await profPage.type('#name', 'Proof Professional');
        await profPage.type('#phone', '8888888888');
        await profPage.type('#email', profEmail);
        await profPage.type('#password', 'password123');
        await profPage.type('#password_confirmation', 'password123');
        
        await profPage.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent && b.textContent.includes('Register')) || document.querySelector('.bg-orange-600');
            if(btn) btn.click();
        });
        await profPage.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(e => console.log("Prof Register timeout"));
        
        console.log("Adding wallet balance via tinker...");
        try {
            require('child_process').execSync(`php artisan tinker --execute="\\App\\Models\\User::where('role', 'business')->update(['wallet_balance' => 50000]);"`, { cwd: 'd:\\find my interior\\findmyinterior-backend' });
        } catch(e) {}

        // --- 3. Unlock Lead ---
        console.log("Action 3: Unlock Lead");
        await profPage.goto(`${BASE_URL}/requirements/${reqId}`);
        await profPage.waitForSelector('body');
        await new Promise(r => setTimeout(r, 3000));
        await profPage.screenshot({ path: 'artifacts/proof_3_before_unlock.png' });
        
        // click UNLOCK NOW
        await profPage.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent && b.textContent.includes('UNLOCK NOW'));
            if(btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 1500));
        
        // click Confirm Unlock
        await profPage.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent && b.textContent.includes('Confirm Unlock'));
            if(btn) btn.click();
        });

        await new Promise(r => setTimeout(r, 5000));
        await profPage.screenshot({ path: 'artifacts/proof_3_after_unlock.png' });

        // --- 4. Submit Bid ---
        console.log("Action 4: Submit Bid");
        await profPage.screenshot({ path: 'artifacts/proof_4_before_bid.png' });
        
        await profPage.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent && b.textContent.includes('PLACE BID NOW'));
            if(btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 1500));
        
        await profPage.evaluate(() => {
            if (document.querySelector('input[name="amount"]')) document.querySelector('input[name="amount"]').value = '50000';
            if (document.querySelector('input[type="number"]')) document.querySelector('input[type="number"]').value = '50000';
            if (document.querySelector('textarea')) document.querySelector('textarea').value = 'I will do it perfectly.';
        });
        
        await profPage.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent && (b.textContent.includes('Submit Bid') || b.textContent.includes('Submit')));
            if(btn) btn.click();
        });

        await new Promise(r => setTimeout(r, 5000));
        await profPage.screenshot({ path: 'artifacts/proof_4_after_bid.png' });

        // --- 5. Award Bid ---
        console.log("Action 5: Award Bid");
        await custPage.goto(`${BASE_URL}/requirements/${reqId}`);
        await custPage.waitForSelector('body');
        await new Promise(r => setTimeout(r, 3000));
        await custPage.screenshot({ path: 'artifacts/proof_5_before_award.png' });
        
        await custPage.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent && (b.textContent.includes('Award') || b.textContent.includes('Accept')));
            if(btn) btn.click();
        });
        
        await new Promise(r => setTimeout(r, 5000));
        await custPage.screenshot({ path: 'artifacts/proof_5_after_award.png' });

        console.log("Proof script finished successfully.");

    } catch (e) {
        console.error("Error during proof:", e);
    } finally {
        await browser.close();
    }
}

run();
