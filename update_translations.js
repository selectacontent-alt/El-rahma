const fs = require('fs');
const file = 'c:/Users/Elmotkhasess/Desktop/select/kasakis/kasakis store/next-app/src/contexts/translations.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  /pageNameAdmin:\s*\{\s*ar:\s*'لوحة التحكم',\s*en:\s*'Admin Panel'\s*\},/,
  "pageNameAdmin: { ar: 'لوحة التحكم', en: 'Admin Panel' },\n    pageNameContact: { ar: 'تواصل معنا', en: 'Contact Us' },\n    pageNameTrack: { ar: 'تتبع الطلب', en: 'Track Order' },"
);
fs.writeFileSync(file, content);
console.log('done');
