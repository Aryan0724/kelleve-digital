const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  try {
    await page.goto('https://findmyinterior.com', { waitUntil: 'networkidle', timeout: 10000 });
  } catch (e) {
    console.log('Navigation error:', e.message);
  }
  
  const content = await page.content();
  if (content.includes("Oops! Something went wrong")) {
      console.log("ERROR BOUNDARY FOUND ON LIVE SITE");
  } else {
      console.log("NO ERROR BOUNDARY DETECTED ON LIVE SITE");
  }
  
  await browser.close();
  process.exit(0);
})();
