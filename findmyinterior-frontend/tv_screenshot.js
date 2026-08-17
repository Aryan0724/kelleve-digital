const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  console.log('Setting viewport to 1920x1080...');
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  
  console.log('Navigating to https://findmyinterior.com/...');
  await page.goto('https://findmyinterior.com/', { waitUntil: 'networkidle0' });
  
  const hdPath = 'C:/Users/Aryan/.gemini/antigravity-ide/brain/29170ee0-aa63-4621-ad15-0363e78eb45c/tv_1920x1080.png';
  console.log(`Taking 1080p screenshot at ${hdPath}`);
  await page.screenshot({ path: hdPath, fullPage: false });
  
  console.log('Setting viewport to 3840x2160...');
  await page.setViewport({ width: 3840, height: 2160, deviceScaleFactor: 1 });
  
  const uhdPath = 'C:/Users/Aryan/.gemini/antigravity-ide/brain/29170ee0-aa63-4621-ad15-0363e78eb45c/tv_3840x2160.png';
  console.log(`Taking 4K screenshot at ${uhdPath}`);
  await page.screenshot({ path: uhdPath, fullPage: false });

  await browser.close();
  console.log('Done!');
})();
