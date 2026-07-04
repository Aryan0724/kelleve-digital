const fs = require('fs');
const path = require('path');

function findAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findAndReplace(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('http://localhost:8000/api/v1')) {
        content = content.replace(/http:\/\/localhost:8000\/api\/v1/g, 'https://find-my-interior-1.onrender.com/api/v1');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

findAndReplace(path.join(__dirname, 'src'));
