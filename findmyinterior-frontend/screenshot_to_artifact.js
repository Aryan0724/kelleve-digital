const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  
  await page.goto('https://findmyinterior.com', { waitUntil: 'networkidle0' });
  
  const destPath = 'C:\\Users\\Aryan\\.gemini\\antigravity-ide\\brain\\baafac13-9b13-458a-b1d1-d19ad9ee9cec\\scratch\\mobile_view.png';
  
  await page.screenshot({ path: destPath, fullPage: true });
  
  console.log("Screenshot taken at", destPath);
  await browser.close();
})();
