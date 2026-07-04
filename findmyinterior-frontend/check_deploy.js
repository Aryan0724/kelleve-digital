const https = require('https');
https.get('https://find-my-interior.vercel.app/post-requirement', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Extract the script tags to find the chunk containing our page code
    const matches = data.match(/<script src="(\/_next\/static\/chunks\/app\/post-requirement\/[^"]+)"/g);
    if (matches) {
      matches.forEach(m => {
        const url = 'https://find-my-interior.vercel.app' + m.match(/"([^"]+)"/)[1];
        https.get(url, (chunkRes) => {
          let chunkData = '';
          chunkRes.on('data', c => chunkData += c);
          chunkRes.on('end', () => {
            if (chunkData.includes('alert("Error: "')) {
              console.log('NEW CODE DEPLOYED IN CHUNK:', url);
            } else if (chunkData.includes('Failed to post opportunity')) {
              console.log('OLD CODE FOUND IN CHUNK:', url);
            }
          });
        });
      });
    } else {
      console.log('No chunks found');
    }
  });
});
