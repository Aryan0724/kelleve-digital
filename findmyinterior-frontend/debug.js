const { chromium } = require('@playwright/test');

(async () => {
  console.log("Starting browser...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log("Navigating to http://localhost:3000 ...");
  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  
  const content = await page.content();
  if (content.includes("Oops! Something went wrong")) {
      console.log("ERROR BOUNDARY DETECTED IN HTML!");
  } else {
      console.log("NO ERROR BOUNDARY DETECTED. PAGE RENDERED NORMALLY.");
  }
  
  await browser.close();
  console.log("Done");
  process.exit(0);
})();
