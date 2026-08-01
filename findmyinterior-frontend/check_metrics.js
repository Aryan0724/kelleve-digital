const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  
  await page.goto('https://findmyinterior.com', { waitUntil: 'networkidle2' });
  
  const metrics = await page.evaluate(() => {
    return {
      windowInnerWidth: window.innerWidth,
      htmlClientWidth: document.documentElement.clientWidth,
      htmlScrollWidth: document.documentElement.scrollWidth,
      bodyClientWidth: document.body.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      devicePixelRatio: window.devicePixelRatio
    };
  });
  
  console.log("Metrics:", metrics);
  
  await browser.close();
})();
