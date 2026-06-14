const puppeteer = require('puppeteer');
const fs = require('fs');

async function runAuthVerification() {
    console.log("Starting Auth Verification (waiting up to 40s per request)...");
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // We will collect the report lines here
    const reportLines = [];
    reportLines.push("# Auth Fixed Verification");
    reportLines.push("This report proves whether the core auth flows succeed when given enough time (30s) to wait for the remote Render PostgreSQL database.");

    const apiResponses = [];
    page.on('response', async res => {
        if (res.url().includes('/api/v1')) {
            apiResponses.push({ url: res.url(), status: res.status() });
        }
    });

    const waitForApi = async (urlSubstring) => {
        // Wait up to 40 seconds (80 iterations of 500ms)
        for(let i=0; i<80; i++) {
            const found = apiResponses.find(r => r.url.includes(urlSubstring) && r.status !== 204);
            if(found) return found;
            await new Promise(r => setTimeout(r, 500));
        }
        return null;
    };

    const verifyFlow = async (role, email, isRegister) => {
        apiResponses.length = 0; // clear
        
        let reqUrl = '';
        if (isRegister) {
            await page.goto('http://localhost:3000/register');
            await page.select('select', role);
            await page.type('#name', role + ' User');
            if (role !== 'customer') {
                // If there's a company name field, handle it if needed
            }
            await page.type('#phone', '9999999999');
            await page.type('#email', email);
            await page.type('#password', 'password123');
            await page.type('#password_confirmation', 'password123');
            reqUrl = '/auth/register';
        } else {
            await page.goto('http://localhost:3000/login');
            await page.type('#email', email);
            await page.type('#password', 'password123');
            reqUrl = '/auth/login';
        }

        const actionName = `${role === 'customer' ? 'Customer' : 'Professional'} ${isRegister ? 'Register' : 'Login'}`;
        console.log(`Testing ${actionName}...`);
        
        await page.click('button[type="submit"]');
        
        // Wait for API response
        const apiRes = await waitForApi(reqUrl);
        
        // Wait for navigation/redirect
        await new Promise(r => setTimeout(r, 2000));
        
        const finalUrl = page.url();
        const tokenData = await page.evaluate(() => localStorage.getItem('auth-storage'));
        
        let tokenExists = false;
        if (tokenData) {
            try {
                const parsed = JSON.parse(tokenData);
                tokenExists = !!parsed.state.token;
            } catch(e) {}
        }
        
        const isPass = apiRes && apiRes.status >= 200 && apiRes.status < 300 && tokenExists && finalUrl.includes('/dashboard');
        
        reportLines.push(`## ${actionName}: ${isPass ? 'PASS' : 'FAIL'}`);
        reportLines.push(`- **HTTP Request:** POST ${reqUrl}`);
        reportLines.push(`- **HTTP Response:** ${apiRes ? apiRes.status : 'TIMEOUT/FAIL'}`);
        reportLines.push(`- **localStorage Token Stored:** ${tokenExists ? 'YES' : 'NO'}`);
        reportLines.push(`- **Redirect Result:** ${finalUrl}`);
        reportLines.push("");
        
        return isPass;
    };

    const verifyLogout = async (role) => {
        apiResponses.length = 0;
        console.log(`Testing ${role} Logout...`);
        
        // Find logout button
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const logoutBtn = btns.find(b => b.innerText.toLowerCase().includes('logout'));
            if(logoutBtn) logoutBtn.click();
        });
        
        const apiRes = await waitForApi('/auth/logout');
        await new Promise(r => setTimeout(r, 2000));
        
        const finalUrl = page.url();
        const tokenData = await page.evaluate(() => localStorage.getItem('auth-storage'));
        
        let tokenExists = false;
        if (tokenData) {
            try {
                const parsed = JSON.parse(tokenData);
                tokenExists = !!parsed.state.token;
            } catch(e) {}
        }
        
        const isPass = apiRes && apiRes.status === 200 && !tokenExists && finalUrl.includes('/login');
        
        reportLines.push(`## ${role === 'customer' ? 'Customer' : 'Professional'} Logout: ${isPass ? 'PASS' : 'FAIL'}`);
        reportLines.push(`- **HTTP Request:** POST /auth/logout`);
        reportLines.push(`- **HTTP Response:** ${apiRes ? apiRes.status : 'TIMEOUT/FAIL'}`);
        reportLines.push(`- **localStorage Token Stored:** ${tokenExists ? 'YES' : 'NO (Expected)'}`);
        reportLines.push(`- **Redirect Result:** ${finalUrl}`);
        reportLines.push("");
    };

    const ts = Date.now();
    const custEmail = `cust_${ts}@test.com`;
    const profEmail = `prof_${ts}@test.com`;

    // Customer Flow
    await verifyFlow('customer', custEmail, true); // Register
    await verifyLogout('customer'); // Logout
    await verifyFlow('customer', custEmail, false); // Login
    await verifyLogout('customer'); // Logout

    // Professional Flow (Builder)
    await verifyFlow('builder', profEmail, true); // Register
    await verifyLogout('professional'); // Logout
    await verifyFlow('builder', profEmail, false); // Login
    await verifyLogout('professional'); // Logout

    fs.writeFileSync('AUTH_FIXED_VERIFICATION.md', reportLines.join('\n'));
    console.log("Verification complete! Wrote AUTH_FIXED_VERIFICATION.md");
    
    await browser.close();
}

runAuthVerification();
