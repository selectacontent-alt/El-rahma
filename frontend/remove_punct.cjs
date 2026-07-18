const fs = require('fs');
const path = require('path');

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      cleanFile(fullPath);
    }
  }
}

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace text in single quotes
  content = content.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (match, p1) => {
    // Only target strings that have spaces and letters (Arabic or English)
    // and aren't obviously tailwind classes (avoid strings with colons or brackets)
    if (/\s/.test(p1) && /[a-zA-Zأ-ي]/.test(p1) && !p1.includes(':') && !p1.includes('[')) {
       let cleaned = p1
         .replace(/\.{3}/g, '___ELLIPSIS___')
         .replace(/(?<!\d)\.(?!\d)/g, '')
         .replace(/___ELLIPSIS___/g, '...')
         .replace(/،/g, '')
         .replace(/؛/g, '')
         .replace(/!/g, '')
         .replace(/\?/g, '')
         .replace(/,(?=\s)/g, '') // comma followed by space
         .replace(/,$/g, ''); // comma at end of string

       if (cleaned !== p1) {
         modified = true;
         return "'" + cleaned + "'";
       }
    }
    return match;
  });
  
  // Replace text in double quotes as well, just in case
  content = content.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match, p1) => {
    if (/\s/.test(p1) && /[a-zA-Zأ-ي]/.test(p1) && !p1.includes(':') && !p1.includes('[')) {
       let cleaned = p1
         .replace(/\.{3}/g, '___ELLIPSIS___')
         .replace(/(?<!\d)\.(?!\d)/g, '')
         .replace(/___ELLIPSIS___/g, '...')
         .replace(/،/g, '')
         .replace(/؛/g, '')
         .replace(/!/g, '')
         .replace(/\?/g, '')
         .replace(/,(?=\s)/g, '')
         .replace(/,$/g, '');

       if (cleaned !== p1) {
         modified = true;
         return '"' + cleaned + '"';
       }
    }
    return match;
  });

  // Replace text in backticks too, but backticks can span multiple lines.
  content = content.replace(/`([^`\\]*(?:\\.[^`\\]*)*)`/g, (match, p1) => {
    // Exclude if it looks like styled-components or inline styles or contains $
    if (/\s/.test(p1) && /[a-zA-Zأ-ي]/.test(p1) && !p1.includes(':') && !p1.includes('{') && !p1.includes('$')) {
       let cleaned = p1
         .replace(/\.{3}/g, '___ELLIPSIS___')
         .replace(/(?<!\d)\.(?!\d)/g, '')
         .replace(/___ELLIPSIS___/g, '...')
         .replace(/،/g, '')
         .replace(/؛/g, '')
         .replace(/!/g, '')
         .replace(/\?/g, '')
         .replace(/,(?=\s)/g, '')
         .replace(/,$/g, '');

       if (cleaned !== p1) {
         modified = true;
         return '`' + cleaned + '`';
       }
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

const targetDir = path.join(__dirname, 'src');
processDirectory(targetDir);
console.log('Done!');
