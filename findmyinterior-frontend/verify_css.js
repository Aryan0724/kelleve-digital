const https = require('https');
https.get('https://findmyinterior.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const cssLinks = [...data.matchAll(/href="([^"]+\.css[^"]*)"/g)].map(m => m[1]);
    console.log('Found CSS links:', cssLinks);
    if (cssLinks.length === 0) {
       console.log('No external CSS links found. CSS might be inline.');
       // Check inline CSS
       const oklchCount = (data.match(/oklch/gi) || []).length;
       const colorMixCount = (data.match(/color-mix/gi) || []).length;
       console.log(`Inline CSS: oklch count = ${oklchCount}, color-mix count = ${colorMixCount}`);
       if (oklchCount === 0 && colorMixCount === 0) {
           console.log('SUCCESS: No modern CSS found inline either.');
       }
    }
    
    let checksPending = cssLinks.length;
    let failed = false;

    if (checksPending === 0) return;

    cssLinks.forEach(link => {
      const url = link.startsWith('http') ? link : 'https://findmyinterior.com' + (link.startsWith('/') ? '' : '/') + link;
      https.get(url, (cssRes) => {
        let cssData = '';
        cssRes.on('data', (chunk) => cssData += chunk);
        cssRes.on('end', () => {
          const oklchCount = (cssData.match(/oklch/gi) || []).length;
          const colorMixCount = (cssData.match(/color-mix/gi) || []).length;
          console.log(`CSS ${url}: oklch count = ${oklchCount}, color-mix count = ${colorMixCount}`);
          if (oklchCount > 0 || colorMixCount > 0) {
            console.error('FAILED: Modern CSS found!');
            failed = true;
          }
          checksPending--;
          if (checksPending === 0) {
              if (failed) process.exit(1);
              else console.log('SUCCESS: All CSS files are clean of oklch and color-mix.');
          }
        });
      });
    });
  });
});
