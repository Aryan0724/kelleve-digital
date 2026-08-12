const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, '.next', 'static', 'chunks');

if (!fs.existsSync(cssDir)) {
    console.log('CSS directory not found!');
    process.exit(1);
}

const files = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
let failed = false;

for (const file of files) {
    const cssPath = path.join(cssDir, file);
    const cssData = fs.readFileSync(cssPath, 'utf8');
    const oklchCount = (cssData.match(/oklch/gi) || []).length;
    const colorMixCount = (cssData.match(/color-mix/gi) || []).length;
    console.log(`File ${file}: oklch count = ${oklchCount}, color-mix count = ${colorMixCount}`);
    if (oklchCount > 0 || colorMixCount > 0) {
        failed = true;
    }
}

if (failed) {
    console.error('FAILED: Modern CSS found in local build!');
    process.exit(1);
} else {
    console.log('SUCCESS: All local CSS files are clean of oklch and color-mix.');
}
