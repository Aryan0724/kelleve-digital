const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const ARTIFACTS_DIR = path.join(__dirname, '../artifacts');

if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR);
}

async function run() {
    console.log("Starting Phase 1 Proof...");
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    // Remote database has high latency, increase timeouts significantly
    page.setDefaultNavigationTimeout(300000);
    page.setDefaultTimeout(300000);
    
    // Setup alert handling
    let latestAlert = "";
    page.on('dialog', async dialog => {
        latestAlert = dialog.message();
        console.log("Alert:", latestAlert);
        await dialog.accept();
    });

    const rnd = Math.floor(Math.random() * 100000);
    const proEmail = `pro_${rnd}@test.com`;
    const custEmail = `cust_${rnd}@test.com`;
    const proName = `Test Pro ${rnd}`;
    
    console.log(`[Phase 1] Professional Email: ${proEmail}`);

    // 1. Professional Registration
    console.log("Registering Professional...");
    await page.goto(`${BASE_URL}/register`);
    await page.waitForSelector('select');
    await page.select('select', 'business');
    await page.waitForSelector('#name');
    await page.type('#name', proName);
    await page.type('#email', proEmail);
    await page.type('#phone', `99999${rnd}`);
    await page.type('#password', 'password123');
    await page.type('#password_confirmation', 'password123');
    await page.select('select', 'business'); // business role for professional
    
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase1_1_before_pro_register.png') });
    
    // Set up response listener
    const registerResponsePromise = page.waitForResponse(response => 
        response.url().includes('/auth/register') && response.request().method() === 'POST'
    );
    
    await page.click('button.bg-orange-600');
    
    // Wait for the API response
    let errorText = null;
    try {
        const response = await registerResponsePromise;
        if (!response.ok()) {
            const body = await response.json().catch(() => ({}));
            errorText = body.message || "Registration failed";
        }
    } catch (e) {
        errorText = "API call timed out or failed";
    }
    
    if (errorText) {
        console.error("REGISTRATION ERROR:", errorText);
        await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase1_2_error_pro_register.png') });
        throw new Error("Registration failed: " + errorText);
    }
    
    // Wait a second for Zustand to persist the state and Next.js to possibly navigate
    await new Promise(r => setTimeout(r, 1000));
    
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase1_2_after_pro_register.png') });

    // 2. Complete Profile
    console.log("Navigating to Profile Completion...");
    await page.goto(`${BASE_URL}/dashboard/profile`, { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase1_3_before_profile_completion.png') });
    
    try {
        await page.waitForSelector('input[placeholder="e.g. Acme Interiors"]');
    } catch (e) {
        console.log("Failed to find input. Page content:");
        const content = await page.evaluate(() => document.body.innerText);
        console.log(content.substring(0, 1000));
        throw e;
    }
    // Title is already filled with proName, let's update it to ensure clarity
    await page.evaluate(() => {
        const input = document.querySelector('input[placeholder="e.g. Acme Interiors"]');
        if (input) input.value = '';
    });
    await page.type('input[placeholder="e.g. Acme Interiors"]', proName + " Interiors");
    
    // Select category (wait for categories to load)
    await page.waitForSelector('select', { visible: true });
    await page.select('select', '1'); // Assuming category ID 1 exists (Architects)
    
    await page.type('input[placeholder="e.g. Transforming spaces into dreams"]', "We build great things");
    await page.type('textarea[placeholder="Describe your services, expertise, and what makes you unique..."]', "Detailed description here.");
    await page.type('input[placeholder="e.g. Patna"]', "Patna");
    
    const districtInput = await page.$$('input[placeholder="e.g. Patna"]');
    if (districtInput.length > 1) {
        await districtInput[1].type("Patna"); // district
    }
    
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase1_4_profile_form_filled.png') });
    await page.click('button[type="submit"]');
    
    // Wait for the alert to pop up and be handled
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase1_5_after_profile_submit.png') });
    
    // 3. Add Portfolio Image
    console.log("Adding Portfolio Image...");
    // The form should now show the gallery upload section
    await page.waitForSelector('input[placeholder="https://example.com/project-image.jpg"]');
    await page.type('input[placeholder="https://example.com/project-image.jpg"]', "https://placehold.co/600x400/png");
    await page.type('input[placeholder="e.g. Modern living room renovation"]', "Test Project Image");
    
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase1_6_before_portfolio_add.png') });
    // Click the specific Add to Portfolio button
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const addBtn = btns.find(b => b.textContent && b.textContent.includes('Add to Portfolio'));
        if (addBtn) addBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    // 4. Get the actual slug
    await page.waitForSelector('a[href^="/professionals/"]');
    const publicProfileUrl = await page.$eval('a[href^="/professionals/"]', el => el.getAttribute('href'));
    console.log("Public profile URL is:", publicProfileUrl);
    
    // 5. Logout Professional
    console.log("Logging out Professional...");
    await page.evaluate(() => {
        localStorage.clear();
    });
    
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase1_7_after_portfolio_add.png') });

    // 4. Register Customer
    console.log("Registering Customer...");
    await page.goto(`${BASE_URL}/register`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#name');
    await page.type('#name', "Test Customer " + rnd);
    await page.type('#email', custEmail);
    await page.type('#phone', `88888${rnd}`);
    await page.type('#password', 'password123');
    await page.type('#password_confirmation', 'password123');
    
    console.log("Submitting Customer Registration...");
    const navPromise = page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 300000 });
    await page.click('button.bg-orange-600');
    await navPromise;
    
    await new Promise(r => setTimeout(r, 1000));

    // 5. Customer Views Profile and Reviews
    console.log("Customer visiting Professional Profile...");
    await page.goto(`${BASE_URL}${publicProfileUrl}`, { waitUntil: 'domcontentloaded' });
    
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase1_8_customer_viewing_profile.png') });

    // Scroll to review section
    await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
    });
    
    console.log("Customer submitting Review...");
    await page.waitForSelector('textarea[placeholder="Share your experience working with this professional..."]');
    
    // Type review if textarea exists
    const textareaExists = await page.evaluate(() => !!document.querySelector('textarea[placeholder="Share your experience working with this professional..."]'));
    if (textareaExists) {
        await page.type('textarea[placeholder="Share your experience working with this professional..."]', "Amazing professional, highly recommended!");
        
        await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase1_9_before_review_submit.png') });
        
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const subBtn = btns.find(b => b.textContent && b.textContent.includes('Submit Review'));
            if (subBtn) subBtn.click();
        });
        
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase1_10_after_review_submit.png') });
    } else {
        console.log("Review textarea not found. Customer might not be logged in or component missing.");
    }
    
    console.log("Phase 1 Proof complete.");
    await browser.close();
}

run().catch(e => {
    console.error(e);
    process.exit(1);
});
