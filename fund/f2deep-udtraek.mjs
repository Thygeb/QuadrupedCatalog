#!/usr/bin/env node
// fund/f2deep-udtraek.mjs — traekker de 110 danske celler ud af
// fund/f2deep-raw-foer.json i et laesbart format, robot for robot, felt for
// felt, saa jeg kan klassificere hver enkelt mod raakilderne uden at
// bladre i det raa JSON-dump.
import fs from 'node:fs';

const raw = JSON.parse(fs.readFileSync(new URL('./f2deep-raw-foer.json', import.meta.url), 'utf8'));

function harAeoeaa(s) { return /[æøåÆØÅ]/.test(String(s ?? '')); }

const linjer = [];
for (const r of raw) {
  linjer.push(`\n### ${r.id} ${r.slug}`);
  for (const fe of (r.field_entries ?? [])) {
    if (fe.caveat) linjer.push(`[${r.id}/${fe.field_name}] caveat: ${JSON.stringify(fe.caveat)}`);
    if (fe.caveat_wording) linjer.push(`[${r.id}/${fe.field_name}] caveat_wording: ${JSON.stringify(fe.caveat_wording)}`);
    if (fe.caveat_class) linjer.push(`[${r.id}/${fe.field_name}] caveat_class: ${JSON.stringify(fe.caveat_class)}`);
  }
  const apps = Array.isArray(r.applications) ? r.applications : (r.applications ? [r.applications] : []);
  for (const a of apps) {
    if (a.note) linjer.push(`[${r.id}/applications] note: ${JSON.stringify(a.note)}`);
    if (a.note_wording) linjer.push(`[${r.id}/applications] note_wording: ${JSON.stringify(a.note_wording)}`);
    if (a.quote) linjer.push(`[${r.id}/applications] quote: ${JSON.stringify(a.quote)}`);
    if (a.quote_wording) linjer.push(`[${r.id}/applications] quote_wording: ${JSON.stringify(a.quote_wording)}`);
  }
  const imgs = Array.isArray(r.images) ? r.images : (r.images ? [r.images] : []);
  for (const im of imgs) {
    if (im.note) linjer.push(`[${r.id}/images ${im.id ?? ''}] note: ${JSON.stringify(im.note)}`);
    if (im.alt) linjer.push(`[${r.id}/images ${im.id ?? ''}] alt: ${JSON.stringify(im.alt)}`);
  }
  if (r.notes) for (const [i, n] of (Array.isArray(r.notes) ? r.notes : [r.notes]).entries()) linjer.push(`[${r.id}/robots] notes[${i}]: ${JSON.stringify(n)}`);
  if (r.notes_wording) for (const [i, n] of (Array.isArray(r.notes_wording) ? r.notes_wording : [r.notes_wording]).entries()) linjer.push(`[${r.id}/robots] notes_wording[${i}]: ${JSON.stringify(n)}`);
}
fs.writeFileSync(new URL('./f2deep-udtraek.txt', import.meta.url), linjer.join('\n') + '\n', 'utf8');
console.log(`${linjer.filter((l) => l.startsWith('[')).length} celler skrevet til fund/f2deep-udtraek.txt`);
