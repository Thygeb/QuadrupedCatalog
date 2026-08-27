// Efterprøvning: sammenlign N interne noter i fund/NOTEARKIV-1.md tegn-for-tegn
// mod den unescapede kildetekst i data/robots/*.yaml. Deterministisk stikprøve
// (hver K'te interne note), så den kan genkøres og give samme resultat.
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

function extractNoter(txt) {
  const lines = txt.split('\n');
  const idx = lines.findIndex(l => l.trim() === 'noter:');
  if (idx < 0) return [];
  const notes = [];
  for (let i = idx + 1; i < lines.length; i++) {
    const l = lines[i];
    const m = l.match(/^  - "(.*)"\s*$/);
    if (m) notes.push(unescapeYamlDouble(m[1]));
    else if (/^\S/.test(l)) break;
  }
  return notes;
}

const rod = 'data/robots';
const arkiv = fs.readFileSync('fund/NOTEARKIV-1.md', 'utf8');

// Byg listen af alle interne (slug, index, kildetekst) i samme rækkefølge som arkiv-scriptet
const alle = [];
for (const f of fs.readdirSync(rod).filter(f => f.endsWith('.yaml')).sort()) {
  const slug = f.replace(/\.yaml$/, '');
  const klass = KLASSIFIKATION[slug];
  if (!klass) continue;
  const notes = extractNoter(fs.readFileSync(path.join(rod, f), 'utf8'));
  notes.forEach((tekst, i) => {
    if (klass[i] === 'I') alle.push({ slug, index: i, tekst });
  });
}

console.log('Total interne noter fundet i kilden:', alle.length);

const K = 18; // stikproevens skridt -> ceil(186/18) = 11 punkter
let fejl = 0, testet = 0;
for (let i = 0; i < alle.length; i += K) {
  const { slug, index, tekst } = alle[i];
  testet++;
  // find sektionen i arkivet
  const sekStart = arkiv.indexOf(`## ${slug}\n`);
  if (sekStart < 0) { console.log('FEJL: sektion mangler for', slug); fejl++; continue; }
  const marker = `**[${index}]** `;
  const markerPos = arkiv.indexOf(marker, sekStart);
  if (markerPos < 0) { console.log('FEJL: marker mangler for', slug, index); fejl++; continue; }
  const afterMarker = arkiv.slice(markerPos + marker.length);
  // teksten slutter ved naeste "\n\n**[" eller "\n\n---" eller sektion-slut
  let endIdx = afterMarker.length;
  const nextMarker = afterMarker.search(/\n\n\*\*\[|\n\n---/);
  if (nextMarker >= 0) endIdx = nextMarker;
  const arkivTekst = afterMarker.slice(0, endIdx);
  if (arkivTekst === tekst) {
    console.log(`OK  ${slug}[${index}] (${tekst.length} tegn)`);
  } else {
    console.log(`FEJL ${slug}[${index}]: laengder ${arkivTekst.length} vs ${tekst.length}`);
    fejl++;
  }
}
console.log(`\nStikproeve: ${testet} testet, ${fejl} fejl.`);
