#!/usr/bin/env node
/**
 * fund/f2galileo-generer-galileo.mjs — bygger opdaterings-JSON for Galileo
 * (Tianjin) ud fra fund/f2galileo-oversaettelser-galileo.mjs. LAeS-KUN mod
 * databasen - skriver kun en lokal JSON-fil.
 */
import fs from 'node:fs';
import { QUOTE_DA_TO_EN, QUOTE_WORDING_ZH, GALILEO_ROBOT_IDS, NOTE_WORDING_C1 } from './f2galileo-oversaettelser-galileo.mjs';

const CHANGE_REASON = 'fase2/f2-galileo (genoptagelse): L87 - engelsk prosa + kildens ordret citat udskilt (Galileo (Tianjin))';

const poster = GALILEO_ROBOT_IDS.map((robotId) => {
  const saet = {
    quote: QUOTE_DA_TO_EN,
    quote_wording: QUOTE_WORDING_ZH,
  };
  if (robotId === 2199) saet.note_wording = NOTE_WORDING_C1;
  return {
    tabel: 'applications',
    noegle: { robot_id: robotId },
    saet,
    change_reason: CHANGE_REASON,
  };
});

fs.writeFileSync('fund/f2galileo-opdateringer-galileo.json', JSON.stringify(poster, null, 2), 'utf8');
console.log(`${poster.length} post(er) skrevet til fund/f2galileo-opdateringer-galileo.json`);
