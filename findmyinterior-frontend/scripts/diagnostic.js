const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('requestfailed', req => console.log('REQ FAIL:', req.url(), req.failure()?.errorText));
    page.on('response', res => {
        if (res.url().includes('api/v1')) {
            console.log(`API RES: ${res.url()} [${res.status()}]`);
        }
    });

    console.log("Navigating to register...");
    await page.goto('http://localhost:3000/register');
    
    await page.select('select', 'customer');
    await page.type('#name', 'Diagnostic');
    await page.type('#phone', '1112223334');
    await page.type('#email', 'diag_' + Date.now() + '@test.com');
    await page.type('#password', 'password');
    await page.type('#password_confirmation', 'password');
    
    console.log("Submitting form...");
    await page.click('button[type="submit"]');
    
    await new Promise(r => setTimeout(r, 4000));
    console.log("Final URL:", page.url());
    
    // Check if error is displayed on UI
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.includes('Network Error')) {
        console.log("UI ERROR: Network Error");
    }
    
    await browser.close();
})();
