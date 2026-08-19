// Engangsvaerktoej: traek laesbar tekst ud af en gemt raa HTML-side.
import { readFileSync } from 'node:fs';
const f = process.argv[2];
let h = readFileSync(f, 'utf8');
h = h.replace(/<script[\s\S]*?<\/script>/gi, ' ')
     .replace(/<style[\s\S]*?<\/style>/gi, ' ')
     .replace(/<!--[\s\S]*?-->/g, ' ');
h = h.replace(/<(br|\/p|\/div|\/li|\/tr|\/h[1-6]|\/td|\/th|\/span)[^>]*>/gi, '\n');
h = h.replace(/<[^>]+>/g, ' ');
h = h.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
     .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
     .replace(/&times;/g, '×').replace(/&deg;/g, '°');
h = h.replace(/\u([0-9a-fA-F]{4})/g, (_, c) => String.fromCharCode(parseInt(c, 16)));
const lines = h.split('\n').map(s => s.replace(/[ \t]+/g, ' ').trim()).filter(s => s.length > 0);
console.log(lines.join('\n'));
