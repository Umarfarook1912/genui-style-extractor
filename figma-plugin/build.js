const fs = require('fs');
const path = require('path');

// Copy manifest and ui.html to dist
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy manifest.json
fs.copyFileSync(
  path.join(__dirname, 'manifest.json'),
  path.join(distDir, 'manifest.json')
);

// Copy ui.html
fs.copyFileSync(
  path.join(__dirname, 'src', 'ui.html'),
  path.join(distDir, 'ui.html')
);

// Inject ui.html content into code.js if present (replace __html__ usage)
const codePath = path.join(distDir, 'code.js');
const uiPath = path.join(distDir, 'ui.html');
try {
  if (fs.existsSync(codePath) && fs.existsSync(uiPath)) {
    const code = fs.readFileSync(codePath, 'utf8');
    const ui = fs.readFileSync(uiPath, 'utf8');

    // Replace occurrences of figma.showUI(__html__, { ... }) with the actual HTML string
    const replacement = `figma.showUI(${JSON.stringify(ui)}, { width: 400, height: 500 });`;
    const newCode = code.replace(/figma\.showUI\(__html__,\s*\{[^}]*\}\s*\);?/g, replacement);

    fs.writeFileSync(codePath, newCode, 'utf8');
    console.log('✅ Injected ui.html into code.js');
  }
} catch (err) {
  console.warn('⚠️ UI injection skipped:', err && err.message ? err.message : err);
}

console.log('✅ Build complete! Plugin files copied to dist/');
