#!/usr/bin/env node
/**
 * tests/koer.mjs — importerer hver del i tests/dele/, koerer den, taeller op
 * og rapporterer. Selve testreglerne bor IKKE her laengere - se
 * tests/LAESMIG.md for kontrakten en del skal opfylde, og tests/dele/*.mjs
 * for de enkelte emner.
 *
 *   node tests/koer.mjs
 *
 * Hvorfor delt (spor/testdele, 26. aug 2026): filen var 2.209 linjer med otte
 * spor-blokke stablet i bunden, og 6 af 9 spor-flet konfliktede i netop den
 * fil, fordi to spor lagde hver sin nye testblok allersidst (ARBEJDSGANG.md,
 * punkt O1). Løsningen er strukturel: én fil pr. emne, saa et nyt spor
 * TILFOEJER en fil i stedet for at redigere en delt.
 *
 * Testen beviser stadig de samme to ting for validatoren, nu i
 * dele/01-validator-regler.mjs:
 *   1. at validatoren giver exit 1 (den fejler overhovedet)
 *   2. at den fejler paa DEN RIGTIGE regel (den fejler af den rigtige grund)
 * Kun nr. 2 er et bevis. Nr. 1 alene ville ogsaa vaere sandt for en validator,
 * der altid fejlede.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  rod, node, skema, yaml, alder, taelFilerRekursivt, lasRobotter, operatorRegex, koerValidator,
  hentRobotter,
} from './dele/_faelles.mjs';

const tmp = path.join(rod, 'tests', '.tmp-koersel');

let bestaaet = 0, fejlet = 0;
const fejlliste = [];

function ok(navn, betingelse, detalje) {
  if (betingelse) { bestaaet++; console.log(`  ok    ${navn}`); }
  else { fejlet++; fejlliste.push(navn); console.log(`  FEJL  ${navn}${detalje ? ' — ' + detalje : ''}`); }
}

fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });

/** Kontrakten, hver del i tests/dele/ faar ind som eneste argument. Se
 *  tests/LAESMIG.md for hvad en ny del maa forvente heraf. */
const ctx = {
  rod, tmp, node, ok, skema, yaml, alder, lasRobotter, taelFilerRekursivt, operatorRegex, koerValidator,
  hentRobotter,
};

/** Raekkefoelgen er laeseorden, IKKE en afhaengighedskaede - hver del bygger
 *  sit eget data/dist i sin egen undermappe af tmp. Listen er IKKE skrevet i
 *  haanden: den er selve det, to samtidige spor ellers ville konfliktere om
 *  (ARBEJDSGANG.md, punkt O1 - "eet spor = een ny fil = INGEN konflikt"
 *  holder ikke, hvis alle stadig skal redigere den samme array). En ny del
 *  tilfoejes ved at laegge filen i tests/dele/ med det naeste ledige
 *  tocifrede praefiks - og INTET andet, se tests/LAESMIG.md. Praefikset
 *  baerer raekkefoelgen (deraf de to cifre); `_faelles.mjs` falder automatisk
 *  udenfor, fordi den ikke starter med to cifre efterfulgt af "-". */
const DELE = fs.readdirSync(path.join(rod, 'tests', 'dele'))
  .filter((f) => /^\d\d-.*\.mjs$/.test(f))
  .sort()
  .map((f) => `dele/${f}`);

let validatorTal = null;
for (const rel of DELE) {
  const mod = await import(new URL(rel, import.meta.url));
  const res = await mod.default(ctx);
  if (res && res.validator) validatorTal = res.validator;
}

if (!validatorTal) {
  throw new Error('dele/01-validator-regler.mjs returnerede ingen {validator: {...}} - '
    + 'sammendragslinjen "Validator: ..." kan ikke skrives.');
}

console.log(`\nValidator: ${validatorTal.ietFilAntal + validatorTal.paaTVaersAntal} oedelagte tilfaelde `
  + `(${validatorTal.ietFilAntal} i én fil + ${validatorTal.paaTVaersAntal} paa tvaers af filer), `
  + `fangede ${validatorTal.fangede}.`);
console.log(`I alt: ${bestaaet} bestaaet, ${fejlet} fejlet.`);
if (fejlet) console.log(`Fejlede: ${fejlliste.join(' · ')}`);
// process.exitCode (IKKE process.exit()) - spor/fase3 (BRIEF-fase3.md punkt
// 5) eksponerer ctx.hentRobotter(), som laver et AeGTE fetch() (db/hent.mjs).
// Kalder en fremtidig del i tests/dele/ den IN-PROCESS (til forskel fra de
// eksisterende build.mjs/validate.mjs-kald, som altid gaar via spawnSync og
// dermed er en ANDEN proces), ville et efterfoelgende process.exit() her
// crashe denne maskines node.exe v24.13.0 med en libuv-assertion, exit-kode
// 127 - ogsaa naar kaldet lykkedes (miljoefaelder.md). Ingen eksisterende del
// kalder den i dag (efterproevet: grep for hent.mjs/fraDb/fetch( i
// tests/dele/ finder kun subprocess-kald og rene funktionsimporter), men
// vaernet koster intet og fjerner faelden for den foerste, der goer.
process.exitCode = fejlet ? 1 : 0;
