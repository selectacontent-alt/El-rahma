const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/media');

function safeReplace(content) {
  // Replace only standalone tailwind color prefixes
  let newContent = content;
  
  // Use word boundary \b to ensure we only match the start of a class part
  // e.g. "bg-slate-900" or "text-slate-900" or "border-slate-800" or "from-slate-950"
  // but NOT "translate-x-1"
  
  newContent = newContent.replace(/\bslate-/g, 'gray-');
  newContent = newContent.replace(/\bpink-/g, 'fuchsia-');
  newContent = newContent.replace(/\brose-/g, 'red-');
  newContent = newContent.replace(/\bamber-/g, 'orange-');
  
  return newContent;
}

const files = fs.readdirSync(dir);
for (const file of files) {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = safeReplace(content);
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Fixed colors safely in', file);
    }
  }
}
