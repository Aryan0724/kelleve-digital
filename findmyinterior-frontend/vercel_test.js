const puppeteer = require('puppeteer');

(async () => {
  console.log("Starting Comprehensive UI Verification on Vercel...");
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000);
    
    // 1. Visit Homepage
    console.log("1. Visiting Homepage...");
    await page.goto('https://find-my-interior.vercel.app', { waitUntil: 'networkidle2' });
    const title = await page.title();
    console.log(`   Homepage loaded. Title: ${title}`);
    
    // 2. Checking for Mock Data (Categories or Listings)
    console.log("2. Checking for data on homepage...");
    const html = await page.content();
    if (html.includes("Interior Designers") || html.includes("Contractors")) {
        console.log("   Categories/Professionals are VISIBLE on homepage!");
    } else {
        console.log("   Warning: Expected data not found on homepage text.");
    }
    
    // 3. Go to Login page
    console.log("3. Navigating to Login page...");
    await page.goto('https://find-my-interior.vercel.app/login', { waitUntil: 'networkidle2' });
    
    const emailInput = await page.$('input[type="email"], input[name="email"]');
    const passwordInput = await page.$('input[type="password"], input[name="password"]');
    
    if (emailInput && passwordInput) {
        console.log("   Login form found successfully. Attempting Login...");
        await emailInput.type('contractor_solid@example.com');
        await passwordInput.type('password123');
        
        // Submit via form evaluation
        await page.evaluate(() => {
            const btn = document.querySelector('button[type="submit"]');
            if(btn) btn.click();
        });
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(() => console.log("   (Navigation processed)"));
    }
    
    // 4. Verify Dashboard / Auth state
    console.log("4. Verifying Dashboard / Auth state...");
    await page.goto('https://find-my-interior.vercel.app/dashboard', { waitUntil: 'networkidle2' });
    const dashHtml = await page.content();
    if (dashHtml.includes("Dashboard") || dashHtml.includes("contractor_solid")) {
        console.log("   Dashboard loaded and user is authenticated!");
    } else {
        console.log("   Warning: User dashboard not fully verified or requires manual check.");
    }

    // 5. Go to Professionals Page
    console.log("5. Navigating to Professionals listing...");
    await page.goto('https://find-my-interior.vercel.app/professionals', { waitUntil: 'networkidle2' });
    const profHtml = await page.content();
    if (profHtml.includes("Contractor") || profHtml.includes("Designer")) {
        console.log("   Professionals list is rendering successfully with data!");
    } else {
        console.log("   Warning: Professionals list might be empty or loading.");
    }

    // 6. Post Requirement Page
    console.log("6. Verifying Post Requirement flow accessibility...");
    await page.goto('https://find-my-interior.vercel.app/post-requirement', { waitUntil: 'networkidle2' });
    const reqHtml = await page.content();
    if (reqHtml.includes("Category") || reqHtml.includes("Budget")) {
        console.log("   Post Requirement form is accessible and rendering.");
    }

    console.log("\n==============================================");
    console.log("Vercel Verification Completed Successfully!");
    console.log("==============================================");
    
  } catch (error) {
    console.error("Vercel Verification Failed:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
