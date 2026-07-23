const { chromium } = require('@playwright/test');

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("Navigating to staging login...");
    await page.goto('http://187.127.164.142/login');

    console.log("Filling out login form...");
    await page.fill('input[name="email"]', 'vendor200@truedial.test');
    await page.fill('input[name="password"]', 'password');

    console.log("Submitting login form...");
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);

    const url = page.url();
    console.log("Landed on URL:", url);

    if (url.includes('/dashboard')) {
      console.log("SUCCESS: Successfully logged into staging dashboard!");
      
      const cookies = await context.cookies();
      const authToken = cookies.find(c => c.name === 'auth_token');
      console.log("Auth token cookie found:", !!authToken);
      if (authToken) {
        console.log("Cookie details:", authToken);
      }
    } else {
      console.log("FAILED: Did not land on dashboard.");
      
      // Let's check if there's an error message
      const errorMsg = await page.locator('.text-red-600').textContent().catch(() => null);
      if (errorMsg) {
        console.log("Error message displayed:", errorMsg);
      }
    }
  } catch (error) {
    console.error("Test error:", error);
  } finally {
    await browser.close();
  }
})();
