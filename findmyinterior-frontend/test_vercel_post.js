const puppeteer = require('puppeteer');

(async () => {
  console.log("Testing POST requirement on Vercel...");
  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: 'new' });
  const page = await browser.newPage();
  
  page.on('response', async (response) => {
    if (response.url().includes('/api/v1/projects') || response.url().includes('/api/v1/rfqs') || response.url().includes('/api/v1/worker-jobs')) {
      console.log('=================================');
      console.log('API POST RESPONSE URL:', response.url());
      console.log('API POST RESPONSE STATUS:', response.status());
      try {
        const text = await response.text();
        console.log('API POST RESPONSE BODY:', text);
      } catch (e) {
        console.log('Could not read response body.');
      }
      console.log('=================================');
    }
  });

  page.on('console', msg => {
      if (msg.type() === 'error') console.log('PAGE ERROR LOG:', msg.text());
  });

  await page.goto('https://find-my-interior.vercel.app/login', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"]', 'contractor_solid@example.com');
  await page.type('input[type="password"]', 'password123');
  await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]');
      if(btn) btn.click();
  });
  
  await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});

  console.log("Logged in, going to post-requirement...");
  await page.goto('https://find-my-interior.vercel.app/post-requirement', { waitUntil: 'networkidle2' });
  
  // Select Interior Design
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.cursor-pointer');
    if(cards.length > 0) cards[0].click();
  });
  
  // Click Next
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (let b of btns) {
        if(b.innerText.includes('Next Step')) {
            b.click();
            break;
        }
    }
  });

  // Wait for step 2 (district field)
  await page.waitForSelector('#district', { timeout: 10000 });
  console.log("Found #district, filling form...");
  
  await page.type('#district', 'Patna Central');

  // Click submit
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (let b of btns) {
        if(b.innerText.includes('Post Opportunity')) {
            b.click();
            break;
        }
    }
  });

  console.log("Submitted form. Waiting for API response...");
  await new Promise(r => setTimeout(r, 8000));
  
  await browser.close();
})();
