const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Intercept network requests
    await page.setRequestInterception(true);
    page.on('request', req => req.continue());
    page.on('response', async res => {
        if (res.url().includes('/api/v1/projects') && res.request().method() === 'POST') {
            console.log('--- POST /projects ---');
            console.log('Status:', res.status());
            try {
                console.log('Response:', await res.json());
            } catch(e) {
                console.log('Response text:', await res.text());
            }
        }
    });

    console.log('Navigating to login...');
    await page.goto('https://find-my-interior.vercel.app/login');
    
    console.log('Logging in...');
    await page.type('input[type="email"]', 'homeowner1@example.com');
    await page.type('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    console.log('Navigating to post-requirement...');
    await page.goto('https://find-my-interior.vercel.app/post-requirement', { waitUntil: 'networkidle2' });
    
    console.log('Selecting Interior Design...');
    // The cards don't have good selectors, let's find by text
    const cards = await page.$$('div.border.rounded-xl.cursor-pointer');
    await cards[0].click(); // First one is Interior Design
    
    const [nextBtn] = await page.$x("//button[contains(., 'Next Step')]");
    if (nextBtn) await nextBtn.click();
    
    console.log('Filling form...');
    // Just click submit, everything has defaults or empty strings which pass validation
    await page.waitForXPath("//button[contains(., 'Post Opportunity')]");
    const [postBtn] = await page.$x("//button[contains(., 'Post Opportunity')]");
    if (postBtn) await postBtn.click();
    
    // Wait for a bit
    await new Promise(r => setTimeout(r, 5000));
    
    console.log('Done.');
    await browser.close();
})();
