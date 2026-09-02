#!/usr/bin/env node
/**
 * db/f2-cjk-l87-slet.mjs — spor/f2-cjk's RETTELSE 1: sletter kasse-D-raekken
 * (robot_id 2186, field_name ip_rating) efter JPK's beslutning L87
 * (STATUS.md, besluttet under sporets flettegennemgang, 2. sep 2026):
 *
 *   "Kildens ord ordret, vores prosa KUN naar hver paastand kan
 *   efterproeves i et snapshot - og det, der ikke kan, SLETTES. Det er
 *   haard begraensning 2 gjort til regel for fase 2."
 *
 * FUND-f2cjk.md's egen punkt-5(c)-liste dokumenterede allerede, at denne
 * raekkes paastand ("en ueftereprøvet IP67-paastand i en pressemeddelelse,
 * der ikke kunne hentes") ikke kunne spores i nogen af de tre astrall-
 * kildefiler, og at den henviste "note" er NULL. Under L87 er det ikke
 * laengere en advarsel med et forbehold - det er en paastand uden belaeg,
 * og skal derfor vaere vaek, ikke omskrevet.
 *
 * DENNE SLETNING ER BESLUTTET AF JPK (L87), IKKE PAA SPORETS EGET
 * INITIATIV. Sporets egen brief (kasse D-reglen) sagde eksplicit "ret den
 * ikke" - L87 aendrer den regel for fremtiden, og retroaktivt for denne
 * ene raekke, paa JPK's ord.
 *
 * value_text ("IP66") ROERES IKKE - det er et andet, kildebelagt tal.
 * caveat_wording var allerede NULL og forbliver NULL.
 *
 * OPDAGET UNDER FOERSTE SKRIVEFORSOEG (ikke i braevets rettelse): raekken
 * havde caveat_class = 'validity'. field_entries_caveat_class_requires_caveat
 * (db/skema.sql) kraever caveat_class NULL naar caveat er NULL - en
 * advarsels-KLASSE uden en advarsel giver ikke mening. caveat_class saettes
 * derfor OGSAA til null her; det staar ikke i JPK's ordlyd, men foelger
 * mekanisk af at slette selve advarslen.
 *
 * Brug:
 *   node db/f2-cjk-l87-slet.mjs              Toerloeb (standard).
 *   node db/f2-cjk-l87-slet.mjs --skriv      Skriver rent faktisk.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function laesDotEnv(fil) {
  if (!fs.existsSync(fil)) return;
  for (const linje of fs.readFileSync(fil, 'utf8').split(/\r?\n/)) {
    const t = linje.trim();
    if (!t || t.startsWith('#')) continue;
    const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    const [, noegle, raaVaerdi] = m;
    if (process.env[noegle] !== undefined) continue;
    let vaerdi = raaVaerdi.trim();
    if ((vaerdi.startsWith('"') && vaerdi.endsWith('"')) || (vaerdi.startsWith("'") && vaerdi.endsWith("'"))) {
      vaerdi = vaerdi.slice(1, -1);
    }
    process.env[noegle] = vaerdi;
  }
}

const ROBOT_ID = 2186;
const FIELD_NAME = 'ip_rating';
const FORVENTET_CAVEAT_FOER = 'Se noten om en ueftereprøvet IP67-påstand i en pressemeddelelse, der ikke kunne hentes.';
const CHANGE_REASON = 'L87: paastand uden belaeg slettet - IP67-pressemeddelelse kunne ikke spores i nogen kildefil, og den henviste note findes ikke';

async function main() {
  const skriv = process.argv.includes('--skriv');

  laesDotEnv(path.join(ROD, '.env'));
  const U = process.env.SUPABASE_URL;
  const K = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!U || !K) {
    console.error('Kræver SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY i .env.');
    process.exitCode = 1;
    return;
  }
  const H = { apikey: K, Authorization: `Bearer ${K}` };
  const HW = { ...H, 'Content-Type': 'application/json', Prefer: 'return=representation' };
  const url = `${U}/rest/v1/field_entries?robot_id=eq.${ROBOT_ID}&field_name=eq.${FIELD_NAME}`;

  // Grundmåling: raekken skal se ud som forventet, FØR noget røres.
  const foer = await fetch(`${url}&select=robot_id,field_name,value_text,caveat,caveat_wording,caveat_class`, { headers: H }).then((r) => r.json());
  if (!Array.isArray(foer) || foer.length !== 1) {
    console.error(`Forventede præcis 1 række, fik ${Array.isArray(foer) ? foer.length : '?'}`, foer);
    process.exitCode = 1;
    return;
  }
  const raekke = foer[0];
  console.log('FØR:', JSON.stringify(raekke));
  if (raekke.value_text !== 'IP66') {
    console.error(`AFBRUDT: value_text er "${raekke.value_text}", ikke det forventede "IP66" — værditallet må ikke røres af denne sletning.`);
    process.exitCode = 1;
    return;
  }
  if (raekke.caveat !== FORVENTET_CAVEAT_FOER) {
    console.error('AFBRUDT: caveat matcher ikke det forventede — nogen kan have ændret rækken siden briefets måling.');
    console.error('  forventet:', FORVENTET_CAVEAT_FOER);
    console.error('  fundet   :', raekke.caveat);
    process.exitCode = 1;
    return;
  }
  if (raekke.caveat_wording !== null) {
    console.error('AFBRUDT: caveat_wording er ikke NULL — uventet, sletningen er kun defineret for den kendte tilstand.');
    process.exitCode = 1;
    return;
  }
  if (raekke.caveat_class !== 'validity') {
    console.error(`AFBRUDT: caveat_class er "${raekke.caveat_class}", ikke det forventede "validity" — nogen kan have ændret rækken siden briefets måling.`);
    process.exitCode = 1;
    return;
  }

  console.log(`\n${skriv ? 'SKRIVER' : 'TØRLØB'}: caveat -> null, caveat_class -> null (kraevet af feltposter_advarsel_klasse_kraever_advarsel), caveat_wording forbliver null, collected_by=spor/f2-cjk, change_reason="${CHANGE_REASON}"`);
  if (!skriv) {
    console.log('Dette var et TØRLØB. Kør med --skriv for at skrive rent faktisk.');
    return;
  }

  const body = {
    caveat: null,
    caveat_class: null,
    collected_by: 'spor/f2-cjk',
    change_reason: CHANGE_REASON,
  };
  const svar = await fetch(url, { method: 'PATCH', headers: HW, body: JSON.stringify(body) });
  const json = await svar.json();
  if (!svar.ok || !Array.isArray(json) || json.length !== 1) {
    console.error(`AFBRUDT: status ${svar.status}, ${json.length ?? '?'} rækker`, json);
    process.exitCode = 1;
    return;
  }
  console.log('EFTER:', JSON.stringify(json[0]));
  console.log('OK, 1 række opdateret (L87-sletning).');
}

main().catch((err) => {
  console.error('f2-cjk-l87-slet: fejl —', err.message, err.stack);
  process.exitCode = 1;
});
