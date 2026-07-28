const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  console.log('Navigating to http://localhost:8082...');
  try {
    await page.goto('http://localhost:8082', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log('Page loaded.');
  } catch (err) {
    console.log('Navigation error:', err);
  }
  
  await browser.close();
})();
