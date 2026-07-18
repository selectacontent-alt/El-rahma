const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/media');

function swapSlate(content) {
  // We want to invert the slate classes because globals.css inverted them.
  // Original (intended) -> Next.js equivalent to achieve intended visual
  // Intended Dark (950, 900, 850, 800) -> Next.js Dark (200, 100, 100, 100)
  // Intended Light (200, 100, 50) -> Next.js Light (800, 900, 950)
  
  // We use a regex replacer function to avoid double-replacements
  return content.replace(/slate-(950|900|850|800|500|400|200|100|50)/g, (match, p1) => {
    switch (p1) {
      case '950': return 'slate-200'; // dark
      case '900': return 'slate-100'; // dark
      case '850': return 'slate-100'; // dark
      case '800': return 'slate-100'; // dark
      
      // mid tones
      case '500': return 'slate-500'; // stays gray
      case '400': return 'slate-500'; // stays gray
      
      // lights
      case '200': return 'slate-800'; // light
      case '100': return 'slate-900'; // light
      case '50':  return 'slate-950'; // light
      default: return match;
    }
  });
}

const files = fs.readdirSync(dir);
for (const file of files) {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = swapSlate(content);
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Fixed slate inversion in', file);
    }
  }
}
