#!/usr/bin/env node
/**
 * fund/f2galileo-generer.mjs — bygger opdaterings-JSON'en til db/f2-skriv.mjs
 * ud fra en dump-fil (foer-tilstand) og en oversaettelses-modul
 * (fund/f2galileo-oversaettelser-<producent>.mjs). LAeS-KUN mod databasen -
 * skriver kun en lokal JSON-fil, roerer aldrig Supabase selv.
 *
 * "undefined" i et array-element betyder "roer ikke dette element - behold
 * DB-vaerdien uaendret". "null" betyder "saet eksplicit til null".
 *
 * Brug: node fund/f2galileo-generer.mjs <dump.json> <oversaettelser.mjs> <ud.json> <change_reason>
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , dumpArg, overArg, udArg, changeReasonArg] = process.argv;
if (!dumpArg || !overArg || !udArg || !changeReasonArg) {
  console.error('Brug: node fund/f2galileo-generer.mjs <dump.json> <oversaettelser.mjs> <ud.json> "<change_reason>"');
  process.exit(2);
}

const robotter = JSON.parse(fs.readFileSync(dumpArg, 'utf8'));
const { FIELD_ENTRIES, APPLICATIONS, ROBOTS } = await import(pathToFileURL(path.resolve(overArg)).href);

const robotById = new Map(robotter.map((r) => [r.id, r]));
const poster = [];

/** Fletter et nyt array med et "maerket" array (undefined = behold original). */
function fletArray(original, nyt) {
  const orig = Array.isArray(original) ? original : [];
  return nyt.map((v, i) => (v === undefined ? (orig[i] ?? null) : v));
}

for (const [idStr, felter] of Object.entries(FIELD_ENTRIES)) {
  const robotId = Number(idStr);
  const robot = robotById.get(robotId);
  if (!robot) { console.error(`UKENDT robot_id ${robotId} i FIELD_ENTRIES`); process.exit(1); }
  for (const [fieldName, nyt] of Object.entries(felter)) {
    const fe = (robot.field_entries ?? []).find((f) => f.field_name === fieldName);
    if (!fe) { console.error(`UKENDT field_entry ${robot.slug}/${fieldName}`); process.exit(1); }
    const saet = {};
    if (Object.prototype.hasOwnProperty.call(nyt, 'caveat')) saet.caveat = nyt.caveat;
    if (Object.prototype.hasOwnProperty.call(nyt, 'caveat_wording')) saet.caveat_wording = nyt.caveat_wording;
    poster.push({
      tabel: 'field_entries',
      noegle: { robot_id: robotId, field_name: fieldName },
      saet,
      change_reason: changeReasonArg,
    });
  }
}

for (const [idStr, nyt] of Object.entries(APPLICATIONS)) {
  const robotId = Number(idStr);
  const robot = robotById.get(robotId);
  if (!robot || !robot.applications) { console.error(`UKENDT applications for robot_id ${robotId}`); process.exit(1); }
  const app = robot.applications;
  const saet = {};
  if (Object.prototype.hasOwnProperty.call(nyt, 'note')) saet.note = nyt.note;
  if (Object.prototype.hasOwnProperty.call(nyt, 'note_wording')) saet.note_wording = nyt.note_wording;
  if (Object.prototype.hasOwnProperty.call(nyt, 'quote')) saet.quote = fletArray(app.quote, nyt.quote);
  if (Object.prototype.hasOwnProperty.call(nyt, 'quote_wording')) saet.quote_wording = fletArray(app.quote_wording, nyt.quote_wording);
  poster.push({
    tabel: 'applications',
    noegle: { robot_id: robotId },
    saet,
    change_reason: changeReasonArg,
  });
}

for (const [idStr, nyt] of Object.entries(ROBOTS)) {
  const robotId = Number(idStr);
  const robot = robotById.get(robotId);
  if (!robot) { console.error(`UKENDT robot_id ${robotId} i ROBOTS`); process.exit(1); }
  const saet = {};
  if (Object.prototype.hasOwnProperty.call(nyt, 'notes')) {
    saet.notes = Array.isArray(nyt.notes) ? fletArray(robot.notes, nyt.notes) : nyt.notes;
  }
  if (Object.prototype.hasOwnProperty.call(nyt, 'notes_wording')) {
    saet.notes_wording = nyt.notes_wording === null ? null
      : (Array.isArray(nyt.notes_wording) ? fletArray(robot.notes_wording, nyt.notes_wording) : nyt.notes_wording);
  }
  poster.push({
    tabel: 'robots',
    noegle: { id: robotId },
    saet,
    change_reason: changeReasonArg,
  });
}

fs.writeFileSync(udArg, JSON.stringify(poster, null, 2), 'utf8');
console.log(`${poster.length} post(er) skrevet til ${udArg}`);
