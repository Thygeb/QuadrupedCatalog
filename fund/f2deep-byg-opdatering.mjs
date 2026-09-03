#!/usr/bin/env node
// fund/f2deep-byg-opdatering.mjs — bygger opdateringer.json til
// db/f2-skriv.mjs ud fra fund/f2deep-tekster.mjs, OG efterproever at
// dækningen er praecis de 110 celler fra fund/f2deep-celler.json (ingen
// glemt, ingen tilfoejet), OG at ingen engelsk streng flager dansk
// (genbruger erDansk() -- samme detektor som --dansk).
import fs from 'node:fs';
import { erDansk } from '../db/fase2-tjek.mjs';
import { CAVEATS, APPLICATIONS, IMAGES, ROBOTS_NOTES } from './f2deep-tekster.mjs';

const celler = JSON.parse(fs.readFileSync(new URL('./f2deep-celler.json', import.meta.url), 'utf8'));

// ---- 1. Daekningstjek: byg samme {robotId, felt, kolonne}-noeglesaet fra
// mine tekster som fra celler.json, og sammenlign SAeT-for-SAeT. ----
function noegle(robotId, felt, kolonne) { return `${robotId}::${felt}::${kolonne}`; }

const forventet = new Set(celler.map((c) => noegle(c.robotId, c.felt, c.kolonne)));
const daekket = new Set();

for (const c of CAVEATS) daekket.add(noegle(c.robotId, c.field_name, 'caveat'));
for (const a of APPLICATIONS) {
  for (const k of ['note', 'note_wording', 'quote', 'quote_wording']) {
    if (a[k] !== undefined) daekket.add(noegle(a.robotId, 'applications', k));
  }
}
for (const im of IMAGES) daekket.add(noegle(im.robotId, 'images(?)', 'note'));
for (const r of ROBOTS_NOTES) {
  r.notes.forEach((_, i) => daekket.add(noegle(r.robotId, 'robots', `notes[${i}]`)));
}

// KENDT UNDTAGELSE: 2193/slope/caveat er IKKE i --dansk's 110 (detektoren
// har ingen aeoeaa og intet markoerord i "Fodnote [2]: Lab-tested slope
// angle; actual performance varies by surface material." -- "Fodnote"
// staar ikke paa DANSKE_MARKOEROR). Verificeret direkte mod raa JSON
// (fund/f2deep-raw-foer.json): feltet er AEGTE dansk-forurenet. Oversat
// bevidst, IKKE en fejl i tekster.mjs -- se rapportens "Nye faelder".
const KENDTE_EKSTRA = new Set([noegle(2193, 'slope', 'caveat')]);

const manglerIDaekning = [...forventet].filter((k) => !daekket.has(k));
const ekstraIDaekning = [...daekket].filter((k) => !forventet.has(k) && !KENDTE_EKSTRA.has(k));

console.log(`Forventede celler: ${forventet.size}, daekkede: ${daekket.size}`);
console.log(`Mangler oversaettelse (i celler.json, ikke i tekster.mjs): ${manglerIDaekning.length}`);
manglerIDaekning.forEach((k) => console.log('  MANGLER: ' + k.replace(/::/g, ' / ')));
console.log(`For meget (i tekster.mjs, ikke i celler.json): ${ekstraIDaekning.length}`);
ekstraIDaekning.forEach((k) => console.log('  EKSTRA: ' + k.replace(/::/g, ' / ')));

// ---- 2. Dansk-kontrol paa alle engelske strenge jeg selv skriver ----
let danskFundet = 0, laest = 0;
function tjekDansk(streng, hvor) {
  laest++;
  if (erDansk(streng)) { danskFundet++; console.log('  DANSK TILBAGE: ' + hvor + ': ' + streng); }
}
for (const c of CAVEATS) tjekDansk(c.caveat, `caveat ${c.robotId}/${c.field_name}`);
for (const a of APPLICATIONS) {
  for (const k of ['note', 'note_wording', 'quote', 'quote_wording']) {
    if (a[k] !== undefined) tjekDansk(a[k], `applications.${k} ${a.robotId}`);
  }
}
for (const im of IMAGES) tjekDansk(im.note, `images.note ${im.robotId}`);
for (const r of ROBOTS_NOTES) r.notes.forEach((n, i) => tjekDansk(n, `robots.notes[${i}] ${r.robotId}`));
console.log(`\nDansk-kontrol: ${laest} strenge laest, ${danskFundet} flagede som danske (forventer 0)`);

if (manglerIDaekning.length || ekstraIDaekning.length || danskFundet) {
  console.log('\nSTOPPER — opdateringer.json IKKE bygget. Ret fejlene ovenfor foerst.');
  process.exitCode = 1;
} else {
  // ---- 3. Byg selve opdateringer.json ----
  const poster = [];
  const AARSAG = 'fase 2 (L87): engelsk oversaettelse af DEEP Robotics egen prosa, verificeret mod raakildefil';
  const AARSAG_ORDLYD = 'fase 2 (L87): ordlydsfelt renset for dansk -- kun kildens ord tilbage, ingen oversaettelse';

  for (const c of CAVEATS) {
    poster.push({
      tabel: 'field_entries',
      noegle: { robot_id: c.robotId, field_name: c.field_name },
      saet: { caveat: c.caveat },
      change_reason: AARSAG,
    });
  }
  for (const a of APPLICATIONS) {
    const saet = {};
    let harOrdlyd = false;
    for (const k of ['note', 'note_wording', 'quote', 'quote_wording']) {
      if (a[k] !== undefined) { saet[k] = a[k]; if (k.endsWith('_wording')) harOrdlyd = true; }
    }
    poster.push({
      tabel: 'applications',
      noegle: { robot_id: a.robotId },
      saet,
      change_reason: harOrdlyd ? `${AARSAG} + ${AARSAG_ORDLYD}` : AARSAG,
    });
  }
  for (const im of IMAGES) {
    poster.push({
      tabel: 'images',
      noegle: { robot_id: im.robotId },
      saet: { note: im.note },
      change_reason: AARSAG,
    });
  }
  for (const r of ROBOTS_NOTES) {
    poster.push({
      tabel: 'robots',
      noegle: { id: r.robotId },
      saet: { notes: r.notes },
      change_reason: AARSAG,
    });
  }

  fs.writeFileSync(new URL('./f2deep-opdateringer.json', import.meta.url), JSON.stringify(poster, null, 2), 'utf8');
  console.log(`\n${poster.length} poster skrevet til fund/f2deep-opdateringer.json`);
}
