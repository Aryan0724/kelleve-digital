const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Set viewport to mobile
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  
  await page.goto('https://findmyinterior.com', { waitUntil: 'networkidle0' });
  
  // Take screenshot
  await page.screenshot({ path: 'mobile_view.png', fullPage: true });
  
  console.log("Screenshot taken.");
  await browser.close();
})();
