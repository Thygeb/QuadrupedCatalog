// FASE B: fjern de 'I'-klassificerede noter fra data/robots/*.yaml, behold 'L'.
// Køres KUN efter fase A's arkiv er skrevet og efterprøvet (se
// tools/_noter-verificer-arkiv.mjs) - Å15's regel: aldrig slet før arkivet bærer det.
import fs from 'node:fs';
import path from 'node:path';
import { KLASSIFIKATION } from './_noter-klassifikation.mjs';

function unescapeYamlDouble(s) {
  let result = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\' && i + 1 < s.length) {
      const next = s[i + 1];
      if (next === '\\' || next === '"') {
        result += next;
        i++;
        continue;
      }
    }
    result += s[i];
  }
  return result;
}

// Modsat af unescapeYamlDouble: gengiv en YAML dobbelt-anfoert scalar korrekt.
function escapeYamlDouble(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

const rod = 'data/robots';
const files = fs.readdirSync(rod).filter(f => f.endsWith('.yaml')).sort();

let filerAendret = 0;
let noterSlettet = 0;
let noterBevaret = 0;
const log = [];

for (const f of files) {
  const slug = f.replace(/\.yaml$/, '');
  const fullPath = path.join(rod, f);
  const txt = fs.readFileSync(fullPath, 'utf8');
  const lines = txt.split('\n');
  const idx = lines.findIndex(l => l.trim() === 'noter:');
  if (idx < 0) continue;

  const notes = [];
  let endLine = lines.length;
  for (let i = idx + 1; i < lines.length; i++) {
    const l = lines[i];
    const m = l.match(/^  - "(.*)"\s*$/);
    if (m) {
      notes.push(unescapeYamlDouble(m[1]));
    } else if (/^\S/.test(l)) {
      endLine = i;
      break;
    }
  }
  if (notes.length === 0) continue;

  const klass = KLASSIFIKATION[slug];
  if (!klass || klass.length !== notes.length) {
    console.error('SPRINGER OVER (klassifikationsfejl):', slug);
    continue;
  }

  const bevaret = notes.filter((_, i) => klass[i] === 'L');
  noterSlettet += notes.filter((_, i) => klass[i] === 'I').length;
  noterBevaret += bevaret.length;

  const nyeLinjer = bevaret.length > 0
    ? ['noter:', ...bevaret.map(n => `  - "${escapeYamlDouble(n)}"`)]
    : []; // ingen L-noter tilbage -> hele noter:-noeglen fjernes

  const foer = lines.slice(0, idx);
  const efter = lines.slice(endLine);
  const nyeLines = [...foer, ...nyeLinjer, ...efter];
  const nyTxt = nyeLines.join('\n');

  fs.writeFileSync(fullPath, nyTxt, 'utf8');
  filerAendret++;
  log.push(`${slug}: ${notes.length} noter -> ${bevaret.length} bevaret, ${notes.length - bevaret.length} slettet`);
}

console.log(log.join('\n'));
console.log('\nFiler aendret:', filerAendret);
console.log('Noter slettet (intern, i arkivet):', noterSlettet);
console.log('Noter bevaret (laeservendt, paa siden):', noterBevaret);
