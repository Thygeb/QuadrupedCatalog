#!/usr/bin/env node
/**
 * tools/linktjek.mjs — doede interne links i dist/.
 *
 *   node tools/linktjek.mjs            laeser dist/
 *   node tools/linktjek.mjs --ud=<m>   laeser en anden mappe
 *
 * Skrevet 24.08.2026 sammen med producentindekset (F1): producentsiderne
 * fandtes i 26 eksemplarer, men ingen side linkede til dem. `fil:linje`
 * beviser, at en side blev SKREVET — ikke at nogen kan NAA den. Scriptet
 * maaler derfor to ting over de faerdige filer:
 *
 *   1. Hvert href/src, der peger internt, skal ramme en fil i dist/.
 *      En mappe-sti taeller kun, hvis mappen har index.html.
 *   2. Hver producentside skal vaere linket fra sit sprogs
 *      producenter/index.html — indekssiden er doeren ind, og en doer,
 *      der ikke daekker alle rum, er F1 en gang til.
 *
 * Eksterne links (http/https/mailto), rene #ankre og data:-URI'er maales
 * ikke her. Exit 1 ved fund, saa scriptet kan staa i en kontrolkaede.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const flag = Object.fromEntries(process.argv.slice(2)
  .map((a) => a.match(/^--([^=]+)(?:=(.*))?$/)).filter(Boolean)
  .map((m) => [m[1], m[2] ?? true]));
const rod = path.resolve(String(flag.ud ?? 'dist'));

if (!fs.existsSync(rod)) {
  console.error(`linktjek: ${rod} findes ikke — byg foerst (node tools/build.mjs).`);
  process.exit(1);
}

const htmlFiler = [];
(function gaa(m) {
  for (const p of fs.readdirSync(m, { withFileTypes: true })) {
    const fuld = path.join(m, p.name);
    if (p.isDirectory()) gaa(fuld);
    else if (p.name.endsWith('.html')) htmlFiler.push(fuld);
  }
})(rod);

/** Peger stien paa noget, der findes? Mapper kraever index.html. */
function findes(sti) {
  if (!fs.existsSync(sti)) return false;
  if (fs.statSync(sti).isDirectory()) return fs.existsSync(path.join(sti, 'index.html'));
  return true;
}

let interne = 0;
let eksterne = 0;
const doede = [];
for (const fil of htmlFiler) {
  const s = fs.readFileSync(fil, 'utf8');
  for (const m of s.matchAll(/(?:href|src)="([^"]*)"/g)) {
    const raa = m[1];
    if (/^(https?:|mailto:|data:|tel:)/i.test(raa)) { eksterne++; continue; }
    if (raa === '' || raa.startsWith('#')) continue;      // samme side
    const uden = raa.replace(/[#?].*$/, '');
    if (uden === '') continue;
    interne++;
    const maal = uden.startsWith('/')
      ? path.join(rod, uden)
      : path.resolve(path.dirname(fil), uden);
    if (!findes(maal)) doede.push(`${path.relative(rod, fil)} -> ${raa}`);
  }
}

/* --- naas hver producentside fra sit sprogs producentindeks? --- */
const unaaede = [];
let producentsider = 0;
for (const sprog of fs.readdirSync(rod, { withFileTypes: true })) {
  if (!sprog.isDirectory()) continue;
  const pmappe = path.join(rod, sprog.name, 'producenter');
  if (!fs.existsSync(pmappe)) continue;
  const indeksFil = path.join(pmappe, 'index.html');
  const indeks = fs.existsSync(indeksFil) ? fs.readFileSync(indeksFil, 'utf8') : null;
  for (const p of fs.readdirSync(pmappe, { withFileTypes: true })) {
    if (!p.isDirectory()) continue;
    producentsider++;
    if (indeks === null) { unaaede.push(`${sprog.name}/producenter/${p.name}/ (index.html mangler)`); continue; }
    if (!indeks.includes(`href="${p.name}/"`)) unaaede.push(`${sprog.name}/producenter/${p.name}/`);
  }
}

console.log(`Laeste ${htmlFiler.length} HTML-filer i ${path.relative(process.cwd(), rod) || rod}.`);
console.log(`Interne henvisninger: ${interne} · eksterne (ikke maalt her): ${eksterne}`);
console.log(`Doede interne links: ${doede.length}`);
for (const d of doede) console.log(`  DOEDT  ${d}`);
console.log(`Producentsider: ${producentsider} · unaaede fra deres producentindeks: ${unaaede.length}`);
for (const u of unaaede) console.log(`  UNAAET ${u}`);

process.exit(doede.length || unaaede.length ? 1 : 0);
