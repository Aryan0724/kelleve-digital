const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  
  // Go to site and wait for network to be idle
  await page.goto('https://findmyinterior.com', { waitUntil: 'networkidle2', timeout: 60000 });
  
  // Find overflowing elements
  const overflowingElements = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const overflowing = [];
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'META') continue;
      
      const rect = el.getBoundingClientRect();
      if (rect.width > 400) {
        let className = el.className;
        if (typeof className !== 'string') {
           className = (className && className.baseVal) || '';
        }
        overflowing.push({
          tagName: el.tagName,
          className: className,
          width: rect.width,
          scrollWidth: el.scrollWidth,
          text: el.textContent ? el.textContent.substring(0, 30) : ''
        });
      }
    }
    return overflowing;
  });
  
  console.log("Found", overflowingElements.length, "elements > 400px wide:");
  // Print top 10 widest elements
  overflowingElements.sort((a, b) => b.width - a.width);
  for (let i = 0; i < Math.min(20, overflowingElements.length); i++) {
    console.log(`[${overflowingElements[i].tagName}] w:${overflowingElements[i].width} - ${overflowingElements[i].className.substring(0, 50)}... "${overflowingElements[i].text}"`);
  }
  
  await browser.close();
})();
