#!/usr/bin/env node
/**
 * tools/efterproev-anvendelse.mjs — slaar hvert citat op i den gemte raafil.
 *
 * "Ser rigtigt ud" er ikke en efterproevning. Det her programmet gaar hvert
 * enkelt citat efter ORDRET i den fil, det blev laest i, og skriver en taelling:
 * hvor mange citater blev proevet, og hvor mange blev ikke fundet.
 *
 * Et citat, der ikke kan findes, er ikke en formalitet: saa er kategorien ikke
 * laengere producentens ord, og feltet skal vaere ikke_oplyst.
 *
 * Sammenligningen sker paa en normaliseret form - HTML-entiteter foldet ud,
 * krolle-anfoerselstegn og bindestreger foldet til de lige, alt hvidt rum til ét
 * mellemrum. Ellers ville et &amp; eller et U+2019 give falsk alarm, uden at der
 * er nogen forskel paa det, en laeser faktisk ser.
 *
 *   node tools/efterproev-anvendelse.mjs
 *
 * Exit 0 = alle citater fundet. Exit 1 = mindst ét mangler.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parseYaml } from './yaml.mjs';
import { TABEL, KILDEROD } from './anvendelse-indsaet.mjs';

const ENTITETER = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&#39;': "'", '&apos;': "'", '&rsquo;': '’', '&lsquo;': '‘',
  '&mdash;': '—', '&ndash;': '–', '&times;': '×', '&deg;': '°',
};

/** Folder det, en laeser ikke kan se forskel paa. Aldrig ord. */
function normaliser(s) {
  return String(s)
    .replace(/&[a-z]+;|&#\d+;/gi, (e) => {
      if (ENTITETER[e.toLowerCase()]) return ENTITETER[e.toLowerCase()];
      const m = e.match(/^&#(\d+);$/);
      return m ? String.fromCodePoint(Number(m[1])) : e;
    })
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, c) => String.fromCharCode(parseInt(c, 16)))
    .replace(/[‘’ʼ´]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‐-―−]/g, '-')
    .replace(/[   　]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const cache = new Map();
function laes(rel) {
  if (!cache.has(rel)) {
    const p = path.join(KILDEROD, rel);
    cache.set(rel, fs.existsSync(p) ? normaliser(fs.readFileSync(p, 'utf8')) : null);
  }
  return cache.get(rel);
}

let proevet = 0; let fejl = 0; let ikkeOplyst = 0; let medCitat = 0;
const linjer = [];

const mappe = 'data/robots';
const filer = fs.readdirSync(mappe).filter((f) => f.endsWith('.yaml'));

for (const f of filer) {
  const slug = f.replace(/\.yaml$/, '');
  const doc = parseYaml(fs.readFileSync(path.join(mappe, f), 'utf8'), f);
  const a = doc.anvendelse;
  if (a === undefined) { linjer.push(`MANGLER  ${slug}: ingen "anvendelse:"`); fejl++; continue; }

  const vaerdier = Array.isArray(a.vaerdi) ? a.vaerdi : [a.vaerdi];
  if (vaerdier.length === 1 && vaerdier[0] === 'ikke_oplyst') {
    ikkeOplyst++;
    if (a.citat !== undefined) { linjer.push(`FEJL     ${slug}: ikke_oplyst med citat`); fejl++; }
    continue;
  }
  medCitat++;

  const t = TABEL[slug];
  if (!t) { linjer.push(`FEJL     ${slug}: har citat, men ingen raekke i TABEL - kan ikke efterproeves`); fejl++; continue; }
  const citater = Array.isArray(a.citat) ? a.citat : [a.citat];
  const filer2 = Array.isArray(t.fil) ? t.fil : [t.fil];

  for (const c of citater) {
    proevet++;
    const n = normaliser(c);
    let fundet = false; let manglendeFil = null;
    for (const rel of filer2) {
      const h = laes(rel);
      if (h === null) { manglendeFil = rel; continue; }
      if (h.includes(n)) { fundet = true; break; }
    }
    if (!fundet) {
      fejl++;
      linjer.push(`IKKE FUNDET  ${slug}\n    citat: ${c.slice(0, 90)}${c.length > 90 ? '...' : ''}`
        + `\n    soegt i: ${filer2.join(', ')}${manglendeFil ? `\n    (filen findes ikke: ${manglendeFil})` : ''}`);
    }
  }
}

for (const l of linjer) console.log(l);
console.log(`\n${filer.length} robotter · ${medCitat} med citat · ${ikkeOplyst} ikke_oplyst`);
console.log(`${proevet} citater efterproevet ordret mod den gemte raafil · ${fejl} fejl`);
process.exit(fejl ? 1 : 0);
