#!/usr/bin/env node
/**
 * fund/f2galileo-udtraek.mjs — LAeS-KUN. Traekker de tekstkolonner, dette
 * spor skal rense, ud af en dump-fil (fund/f2galileo-dump-*.json) til en
 * mere laesbar liste: robot/slug, kolonne, felt/index, nuvaerende tekst.
 * Skriver kun til stdout/fil i fund/, roerer aldrig databasen.
 *
 * Brug: node fund/f2galileo-udtraek.mjs <dump.json> <ud.json>
 */
import fs from 'node:fs';

const [, , dumpArg, udArg] = process.argv;
const robotter = JSON.parse(fs.readFileSync(dumpArg, 'utf8'));

const ud = [];

for (const r of robotter) {
  // field_entries: caveat / caveat_wording
  for (const fe of r.field_entries ?? []) {
    if (fe.caveat) ud.push({ robot_id: r.id, slug: r.slug, tabel: 'field_entries', noegle: { robot_id: r.id, field_name: fe.field_name }, kolonne: 'caveat', vaerdi: fe.caveat });
    if (fe.caveat_wording) ud.push({ robot_id: r.id, slug: r.slug, tabel: 'field_entries', noegle: { robot_id: r.id, field_name: fe.field_name }, kolonne: 'caveat_wording', vaerdi: fe.caveat_wording });
  }
  // applications: note / note_wording / quote[] / quote_wording[]
  const app = r.applications;
  if (app) {
    if (app.note) ud.push({ robot_id: r.id, slug: r.slug, tabel: 'applications', noegle: { robot_id: r.id }, kolonne: 'note', vaerdi: app.note });
    if (app.note_wording) ud.push({ robot_id: r.id, slug: r.slug, tabel: 'applications', noegle: { robot_id: r.id }, kolonne: 'note_wording', vaerdi: app.note_wording });
    if (Array.isArray(app.quote)) {
      app.quote.forEach((v, i) => { if (v) ud.push({ robot_id: r.id, slug: r.slug, tabel: 'applications', noegle: { robot_id: r.id }, kolonne: 'quote', index: i, vaerdi: v }); });
    } else if (app.quote) {
      ud.push({ robot_id: r.id, slug: r.slug, tabel: 'applications', noegle: { robot_id: r.id }, kolonne: 'quote', vaerdi: app.quote });
    }
    if (Array.isArray(app.quote_wording)) {
      app.quote_wording.forEach((v, i) => { if (v) ud.push({ robot_id: r.id, slug: r.slug, tabel: 'applications', noegle: { robot_id: r.id }, kolonne: 'quote_wording', index: i, vaerdi: v }); });
    } else if (app.quote_wording) {
      ud.push({ robot_id: r.id, slug: r.slug, tabel: 'applications', noegle: { robot_id: r.id }, kolonne: 'quote_wording', vaerdi: app.quote_wording });
    }
  }
  // robots.notes / notes_wording (array or string)
  if (Array.isArray(r.notes)) {
    r.notes.forEach((v, i) => { if (v) ud.push({ robot_id: r.id, slug: r.slug, tabel: 'robots', noegle: { id: r.id }, kolonne: 'notes', index: i, vaerdi: v }); });
  } else if (r.notes) {
    ud.push({ robot_id: r.id, slug: r.slug, tabel: 'robots', noegle: { id: r.id }, kolonne: 'notes', vaerdi: r.notes });
  }
  if (Array.isArray(r.notes_wording)) {
    r.notes_wording.forEach((v, i) => { if (v) ud.push({ robot_id: r.id, slug: r.slug, tabel: 'robots', noegle: { id: r.id }, kolonne: 'notes_wording', index: i, vaerdi: v }); });
  } else if (r.notes_wording) {
    ud.push({ robot_id: r.id, slug: r.slug, tabel: 'robots', noegle: { id: r.id }, kolonne: 'notes_wording', vaerdi: r.notes_wording });
  }
}

fs.writeFileSync(udArg, JSON.stringify(ud, null, 2), 'utf8');
console.log(`${ud.length} celler udtrukket til ${udArg}`);
