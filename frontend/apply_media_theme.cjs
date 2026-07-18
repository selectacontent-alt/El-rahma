const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/media');

function applyMediaTheme(content) {
  let newContent = content;
  
  // Replace standalone color classes with media- prefixed ones
  newContent = newContent.replace(/\bslate-/g, 'media-slate-');
  newContent = newContent.replace(/\bpink-/g, 'media-pink-');
  newContent = newContent.replace(/\brose-/g, 'media-rose-');
  newContent = newContent.replace(/\bamber-/g, 'media-amber-');
  newContent = newContent.replace(/\bpurple-/g, 'media-purple-');
  
  return newContent;
}

const files = fs.readdirSync(dir);
for (const file of files) {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = applyMediaTheme(content);
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Applied media theme in', file);
    }
  }
}
