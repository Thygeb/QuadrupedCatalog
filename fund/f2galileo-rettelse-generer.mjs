#!/usr/bin/env node
/**
 * fund/f2galileo-rettelse-generer.mjs — MINIMAL rettelse efter briefets
 * afsnit 7: kun note_wording og quote_wording (applications) roeres igen -
 * quote og alt field_entries/robots-arbejde var allerede korrekt fra foerste
 * runde og roeres IKKE her, saa der ikke laves unoedvendige change_log-
 * raekker paa indhold, der ikke skal aendres igen.
 *
 * Brug: node fund/f2galileo-rettelse-generer.mjs <dump-foer.json> <ud.json>
 */
import fs from 'node:fs';
import { APPLICATIONS as YUEJIA_APPS } from './f2galileo-oversaettelser-yuejia.mjs';
import { QUOTE_WORDING_ZH, GALILEO_ROBOT_IDS, NOTE_WORDING_C1 } from './f2galileo-oversaettelser-galileo.mjs';

const [, , dumpArg, udArg] = process.argv;
const robotter = JSON.parse(fs.readFileSync(dumpArg, 'utf8'));
const robotById = new Map(robotter.map((r) => [r.id, r]));

const CHANGE_REASON = 'fase2/f2-galileo (rettelse jf. briefets afsnit 7): quote_wording/note_wording skal bevare blandet indledning+kildeord-struktur, ikke splittes i rene EN/ZH-felter';

const poster = [];

for (const [idStr, nyt] of Object.entries(YUEJIA_APPS)) {
  const robotId = Number(idStr);
  const robot = robotById.get(robotId);
  const qw0 = robot.applications.quote_wording[0]; // uroert, allerede rent kinesisk
  poster.push({
    tabel: 'applications',
    noegle: { robot_id: robotId },
    saet: {
      note_wording: nyt.note_wording,
      quote_wording: [qw0, nyt.quote_wording[1], nyt.quote_wording[2]],
    },
    change_reason: CHANGE_REASON,
  });
}

for (const robotId of GALILEO_ROBOT_IDS) {
  const saet = { quote_wording: QUOTE_WORDING_ZH };
  if (robotId === 2199) saet.note_wording = NOTE_WORDING_C1;
  poster.push({ tabel: 'applications', noegle: { robot_id: robotId }, saet, change_reason: CHANGE_REASON });
}

fs.writeFileSync(udArg, JSON.stringify(poster, null, 2), 'utf8');
console.log(`${poster.length} post(er) skrevet til ${udArg}`);
