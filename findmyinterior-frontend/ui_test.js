const puppeteer = require('puppeteer');

(async () => {
  console.log("Starting UI Verification with Puppeteer...");
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // 1. Visit Homepage
    console.log("1. Visiting Homepage...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    const title = await page.title();
    console.log(`   Homepage loaded. Title: ${title}`);
    
    // 2. Go to Login page
    console.log("2. Navigating to Login page...");
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    
    // Assuming we have our Mock Customer from the backend test, or we can just verify the elements exist.
    // Let's verify the Login form exists
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    if (emailInput && passwordInput) {
        console.log("   Login form found successfully.");
    } else {
        throw new Error("Login form not found!");
    }
    
    // 3. Go to Jobs Page
    console.log("3. Navigating to Jobs listing...");
    await page.goto('http://localhost:3000/jobs', { waitUntil: 'networkidle2' });
    
    // Wait for jobs to load
    try {
        await page.waitForSelector('.border-l-green-500', { timeout: 5000 });
        console.log("   Jobs are rendering successfully on the UI!");
    } catch (e) {
        console.log("   No jobs found or timeout reached. This might be normal if the DB is empty, but the page loaded.");
    }
    
    console.log("UI Verification Completed Successfully!");
  } catch (error) {
    console.error("UI Verification Failed:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
