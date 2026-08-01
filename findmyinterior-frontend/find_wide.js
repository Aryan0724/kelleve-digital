const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  
  await page.goto('https://findmyinterior.com', { waitUntil: 'networkidle2' });
  
  const widths = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    let maxScroll = 0;
    let maxEl = null;
    let maxClass = '';
    
    const results = [];
    
    for (const el of all) {
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'META' || el.tagName === 'LINK') continue;
      
      const sw = el.scrollWidth;
      const cw = el.clientWidth;
      const ow = el.offsetWidth;
      
      if (sw > 390 || cw > 390 || ow > 390) {
        let className = el.className;
        if (typeof className !== 'string') {
           className = (className && className.baseVal) || '';
        }
        results.push({
          tag: el.tagName,
          class: className.substring(0, 50),
          sw, cw, ow,
          text: el.textContent ? el.textContent.substring(0, 30).replace(/\n/g, '') : ''
        });
      }
    }
    return results.sort((a,b) => b.sw - a.sw);
  });
  
  console.log("Elements > 390px:");
  console.table(widths.slice(0, 20));
  
  await browser.close();
})();
