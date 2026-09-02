#!/usr/bin/env node
/**
 * db/tjek.mjs — projektets bevis for, at databasen og bygget siger det
 * samme (L81-L83, spor/skema, punkt 5 — erstatter db/rundtur.mjs).
 *
 * LAeS-KUN, ÉN TILSTAND: siden db/migrer.mjs er slettet (YAML -> DB findes
 * ikke laengere; databasen ER kilden), findes der ikke laengere en "lokal"
 * kaede at proeve (db/rundtur.mjs's gamle tilstand uden --live gik via en
 * lokalt genereret mellemfil, som intet skriver til laengere). db/tjek.mjs
 * har derfor kun ÉT forloeb, altid mod den RIGTIGE Supabase-instans:
 *
 *   1. node db/eksporter.mjs --fra-db --ud=db/.tmp/tjek-eksport
 *   2. For alle *.yaml i data/robots/: parse(original) skal vaere DYBT LIG
 *      parse(eksport). "parse" betyder her normaliserRobot(parseYaml(x)) —
 *      den samme laesning, validate.mjs og build.mjs selv bruger umiddelbart
 *      efter parseYaml, og dermed den definition af "hvad filen betyder",
 *      resten af projektet allerede er enige om.
 *   3. tools/validate.mjs skal koere FEJLFRIT paa den eksporterede mappe.
 *   4. tools/build.mjs mod eksport-mappen skal give SAMME sidetal og
 *      kildetal som tools/build.mjs mod data/robots/ (begge koert i denne
 *      koersel — tallene MAALES her, ikke hardkodede fra en tidligere
 *      session).
 *
 * Exit 0 = alle trin bestod. Exit 1 = mindst ét faldt, med detaljer. Ingen
 * npm-afhaengigheder — child_process.execFileSync mod den samme node-binaer,
 * denne proces selv koerer under (process.execPath), saa scriptet virker
 * uanset PATH. Kraever SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY i .env, se
 * db/LAESMIG.md.
 *
 * dybtLig og traekValidateTal er UAeNDREDE (kopieret fra det slettede
 * db/rundtur.mjs, ikke omskrevet) — de er importeret af db/eksporter.mjs
 * (Aa12-princippet: ét sted, ikke to kopier der kan skride fra hinanden).
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { parseYaml } = await import(`file://${path.join(ROD, 'tools/yaml.mjs')}`);
const { normaliserRobot } = await import(`file://${path.join(ROD, 'tools/skema.mjs')}`);

const EKSPORT_MAPPE = path.join(ROD, 'db/.tmp/tjek-eksport');
const BYG_EKSPORT = path.join(ROD, 'db/.tmp/tjek-byg-eksport');
const BYG_ORIGINAL = path.join(ROD, 'db/.tmp/tjek-byg-original');

/* -------------------------------------------------------------- hjaelp */

function koer(args) {
  return execFileSync(process.execPath, args, { cwd: ROD, encoding: 'utf8' });
}

/** Dyb lighed, UAFHAENGIG af noeglerkkefoelge i objekter (den eksporterede
 *  fils topnoegle- og feltpost-noeglerraekkefoelge er IKKE den samme som
 *  originalens — det er ikke meningen, den skal vaere), men AFHAENGIG af
 *  raekkefoelge i lister (en liste er ordnet data i dette skema — se fx
 *  dataporte, sdk_sprog). undefined-vaerdier og fravaerende noegler
 *  behandles ens, saa "skrev jeg slet ikke noeglen" og "skrev jeg den som
 *  undefined" ikke kan give en falsk uenighed. */
function dybtLig(a, b, stiTilFejl) {
  if (a === b) return true;
  if (typeof a === 'number' && typeof b === 'number') return a === b || (Number.isNaN(a) && Number.isNaN(b));
  if (a === null || b === null || a === undefined || b === undefined) return a === b;
  if (typeof a !== typeof b) { if (stiTilFejl) stiTilFejl.push(`typeforskel: ${typeof a} vs ${typeof b}`); return false; }
  if (Array.isArray(a) !== Array.isArray(b)) { if (stiTilFejl) stiTilFejl.push('den ene er en liste, den anden ikke'); return false; }
  if (Array.isArray(a)) {
    if (a.length !== b.length) { if (stiTilFejl) stiTilFejl.push(`listelaengde ${a.length} vs ${b.length}`); return false; }
    for (let i = 0; i < a.length; i++) {
      if (!dybtLig(a[i], b[i], stiTilFejl)) { if (stiTilFejl) stiTilFejl.push(`[${i}]`); return false; }
    }
    return true;
  }
  if (typeof a === 'object') {
    const ka = Object.keys(a).filter((k) => a[k] !== undefined).sort();
    const kb = Object.keys(b).filter((k) => b[k] !== undefined).sort();
    if (ka.length !== kb.length || ka.some((k, i) => k !== kb[i])) {
      if (stiTilFejl) stiTilFejl.push(`noeglesaet {${ka.join(',')}} vs {${kb.join(',')}}`);
      return false;
    }
    for (const k of ka) {
      if (!dybtLig(a[k], b[k], stiTilFejl)) { if (stiTilFejl) stiTilFejl.push(`.${k}`); return false; }
    }
    return true;
  }
  return false;
}

function laesParsetNormaliseret(fil) {
  return normaliserRobot(parseYaml(fs.readFileSync(fil, 'utf8'), fil));
}

/* ------------------------------------------------------------ talkontrol (D2)
 * PLAN.md par. 0, fase 2-raekken: N parallelle spor skriver KUN tekstkolonner
 * — engelsk formulering (advarsel/citat/note-familien), kildesprogets
 * ordrette ordlyd (caveat=advarsel, note, applications.quote=anvendelse.
 * citat), producentens land/by (country), billedets alt-tekst — og INTET
 * andet. TEKSTNOEGLER er netop den liste: de noegler, fase 2 MAA aendre.
 * Alt andet i skemaet er en talkolonne, og haard begraensning 2 kraever, at
 * de staar helt uroerte, mens fase 2 koerer. */
const TEKSTNOEGLER = [
  'advarsel', 'advarsel_ordlyd', 'advarsel_i18n',
  'note', 'note_ordlyd', 'note_i18n',
  'noter', 'noter_ordlyd',
  'citat', 'citat_ordlyd',
  'producentland', 'producentby',
  'alt',
];
const TEKSTNOEGLE_SAET = new Set(TEKSTNOEGLER);

/** Dyb kopi af `obj` hvor alle TEKSTNOEGLER-noegler er fjernet, paa ALLE
 *  dybder (robottens top, felter.<x>, anvendelse, billede) — samme
 *  rekursionsform (array/objekt/blad) som dybtLig ovenfor, saa de to
 *  funktioner ikke kan naa til hver sin opfattelse af, hvad et "objekt" er.
 *  Muterer IKKE `obj`. */
function udenTekst(obj) {
  if (Array.isArray(obj)) return obj.map(udenTekst);
  if (obj !== null && typeof obj === 'object') {
    const ud = {};
    for (const [k, v] of Object.entries(obj)) {
      if (TEKSTNOEGLE_SAET.has(k)) continue;
      ud[k] = udenTekst(v);
    }
    return ud;
  }
  return obj;
}

/** dybtLig, men blind for TEKSTNOEGLER — beviser at TALLENE er ens, uanset
 *  hvor langt fase 2's tekstgenindsamling er naaet paa netop denne robot. */
function talLig(a, b, stiTilFejl) {
  return dybtLig(udenTekst(a), udenTekst(b), stiTilFejl);
}

/** Samler ALLE differerende TEKSTNOEGLER-stier mellem to dokumenter, til
 *  --kun's rapportering (D3). Modsat dybtLig, som stopper ved den FOeRSTE
 *  forskel den moeder, skal denne finde dem ALLE, saa "unitree-aliengo:
 *  .felter.egenvaegt.advarsel, .noter" kan vise flere paa én linje. Kaldes
 *  kun paa par, hvor talLig(a,b) allerede er sand — enhver forskel, den
 *  finder, er derfor per definition tekstlig, aldrig et tal. Ikke eksporteret:
 *  ren rapporteringshjaelp, ingen anden fil har brug for den. */
function tekstforskelle(a, b, sti = '') {
  if (a === null || b === null || a === undefined || b === undefined) return [];
  if (typeof a !== 'object' || typeof b !== 'object') return [];
  if (Array.isArray(a) !== Array.isArray(b)) return [];
  const resultater = [];
  if (Array.isArray(a)) {
    const n = Math.max(a.length, b.length);
    for (let i = 0; i < n; i++) resultater.push(...tekstforskelle(a[i], b[i], `${sti}[${i}]`));
    return resultater;
  }
  const noegler = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of noegler) {
    const stiK = `${sti}.${k}`;
    if (TEKSTNOEGLE_SAET.has(k)) {
      if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) resultater.push(stiK);
    } else {
      resultater.push(...tekstforskelle(a[k], b[k], stiK));
    }
  }
  return resultater;
}

/** Traekker "N fil(er) · M fejl · K advarsler" ud af validate.mjs's stdout. */
function traekValidateTal(ud) {
  const m = ud.match(/(\d+) fil\(er\) · (\d+) fejl · (\d+) advarsler/);
  if (!m) throw new Error(`Kunne ikke laese validate.mjs's opsummeringslinje i:\n${ud}`);
  return { filer: Number(m[1]), fejl: Number(m[2]), advarsler: Number(m[3]) };
}

/** Traekker sidetal og kildetal ud af build.mjs's stdout. */
function traekBuildTal(ud) {
  const sider = ud.match(/Byggede (\d+) sider/);
  const kilder = ud.match(/Kildemaerker: (\d+) tal med kilde, (\d+) uden/);
  if (!sider || !kilder) throw new Error(`Kunne ikke laese build.mjs's opsummeringslinjer i:\n${ud}`);
  return { sider: Number(sider[1]), medKilde: Number(kilder[1]), udenKilde: Number(kilder[2]) };
}

/* -------------------------------------------------------- argumenter (D1) */

/** Samme "--noegle" / "--noegle=vaerdi"-form som tools/validate.mjs's
 *  laesFlag — ikke importeret derfra, for at tjek.mjs ikke faar en ny
 *  koblingsvej til validate.mjs (den kaldes i forvejen kun som subprocess). */
function laesFlag(argv) {
  const flag = {};
  for (const a of argv) {
    if (!a.startsWith('--')) continue;
    const i = a.indexOf('=');
    if (i === -1) flag[a.slice(2)] = true;
    else flag[a.slice(2, i)] = a.slice(i + 1);
  }
  return flag;
}

/** (slug, producent)-par for alle YAML-filer i data/robots/ — ren lokal
 *  laesning. INGEN database, INGEN .env: bruges af --liste og --kun, som
 *  begge skal kunne svare uden at vente paa eksporten. */
function laesProducenter() {
  const mappe = path.join(ROD, 'data/robots');
  return fs.readdirSync(mappe).filter((f) => /\.ya?ml$/.test(f)).sort().map((f) => {
    const slug = f.replace(/\.ya?ml$/, '');
    const doc = laesParsetNormaliseret(path.join(mappe, f));
    return { slug, producent: String(doc.producent ?? '') };
  });
}

/** --liste: producenter faldende efter antal robotter, "13  Unitree Robotics"
 *  (antal, to mellemrum, navn). Ingen eksport, ingen .env — exit 0 straks. */
function koerListe() {
  const poster = laesProducenter();
  const taelling = new Map();
  for (const { producent } of poster) taelling.set(producent, (taelling.get(producent) ?? 0) + 1);
  const raekker = [...taelling.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'da'));
  for (const [navn, antal] of raekker) console.log(`${antal}  ${navn}`);
  return 0;
}

/** Eksakt match paa producent, trim + case-uafhaengigt (Galileo (Tianjin)
 *  osv. kan indeholde mellemrum og parenteser — der matches paa hele
 *  strengen, ikke ord for ord). match er null ved ukendt navn; gyldige er
 *  de kendte navne, brugt til fejlbeskeden. */
function findProducent(oenske, poster) {
  const soeg = String(oenske ?? '').trim().toLowerCase();
  const navne = [...new Set(poster.map((p) => p.producent))].sort((a, b) => a.localeCompare(b, 'da'));
  const match = navne.find((n) => n.trim().toLowerCase() === soeg) ?? null;
  const egneSlugs = match ? new Set(poster.filter((p) => p.producent === match).map((p) => p.slug)) : null;
  return { match, egneSlugs, gyldige: navne };
}

/* --------------------------------------------------------------- main */

function hoved() {
  const flag = laesFlag(process.argv.slice(2));

  if (flag['liste']) return koerListe();

  let kunProducent = null;
  let egneSlugs = null;
  if (flag['kun'] !== undefined) {
    const oenske = flag['kun'] === true ? '' : String(flag['kun']);
    const poster = laesProducenter();
    const { match, egneSlugs: es, gyldige } = findProducent(oenske, poster);
    if (!match) {
      console.error(`Ukendt producent: "${oenske}".`);
      console.error(`Gyldige producenter (${gyldige.length}):`);
      for (const g of gyldige) console.error(`  ${g}`);
      return 2;
    }
    kunProducent = match;
    egneSlugs = es;
  }

  console.log('1/4  node db/eksporter.mjs --fra-db --ud=db/.tmp/tjek-eksport ...');
  fs.rmSync(EKSPORT_MAPPE, { recursive: true, force: true });
  koer(['db/eksporter.mjs', '--fra-db', `--ud=${EKSPORT_MAPPE}`]);

  const fejl = [];

  console.log('2/4  Dyb lighed for alle filer (normaliserRobot(parseYaml(x))) ...');
  const originalMappe = path.join(ROD, 'data/robots');
  const originalFiler = fs.readdirSync(originalMappe).filter((f) => /\.ya?ml$/.test(f)).sort();
  let ligeAntal = 0;
  const uligeDetaljer = [];
  for (const f of originalFiler) {
    const slug = f.replace(/\.ya?ml$/, '');
    const eksportFil = path.join(EKSPORT_MAPPE, `${slug}.yaml`);
    if (!fs.existsSync(eksportFil)) {
      uligeDetaljer.push(`${slug}: eksportfilen findes ikke (${eksportFil})`);
      continue;
    }
    const original = laesParsetNormaliseret(path.join(originalMappe, f));
    const eksport = laesParsetNormaliseret(eksportFil);
    const stiTilFejl = [];
    if (dybtLig(original, eksport, stiTilFejl)) {
      ligeAntal++;
    } else {
      uligeDetaljer.push(`${slug}: ${stiTilFejl.reverse().join(' -> ')}`);
    }
  }
  console.log(`     ${ligeAntal}/${originalFiler.length} dybt lig.`);
  if (uligeDetaljer.length) {
    fejl.push(`Tjek: ${uligeDetaljer.length} fil(er) er IKKE dybt lig deres original:\n  ` +
      uligeDetaljer.join('\n  '));
  }

  console.log('3/4  node tools/validate.mjs paa den eksporterede mappe ...');
  let validateUd;
  try {
    validateUd = koer(['tools/validate.mjs', `--data=${EKSPORT_MAPPE}`]);
  } catch (e) {
    validateUd = (e.stdout ?? '') + (e.stderr ?? '');
  }
  const vTal = traekValidateTal(validateUd);
  console.log(`     ${vTal.filer} fil(er) · ${vTal.fejl} fejl · ${vTal.advarsler} advarsler.`);
  if (vTal.fejl !== 0) {
    fejl.push(`validate.mjs fandt ${vTal.fejl} fejl paa den eksporterede mappe (forventet 0):\n${validateUd}`);
  }

  console.log('4/4  node tools/build.mjs paa eksport vs. original — sidetal og kildetal skal vaere ens ...');
  fs.rmSync(BYG_EKSPORT, { recursive: true, force: true });
  fs.rmSync(BYG_ORIGINAL, { recursive: true, force: true });
  const bEksport = traekBuildTal(koer(['tools/build.mjs', `--data=${EKSPORT_MAPPE}`, `--ud=${BYG_EKSPORT}`]));
  const bOriginal = traekBuildTal(koer(['tools/build.mjs', `--data=${originalMappe}`, `--ud=${BYG_ORIGINAL}`]));
  console.log(`     eksport:  ${bEksport.sider} sider · ${bEksport.medKilde} tal med kilde, ${bEksport.udenKilde} uden`);
  console.log(`     original: ${bOriginal.sider} sider · ${bOriginal.medKilde} tal med kilde, ${bOriginal.udenKilde} uden`);
  if (bEksport.sider !== bOriginal.sider) {
    fejl.push(`Sidetal er FORSKELLIGT: eksport ${bEksport.sider} vs. original ${bOriginal.sider}`);
  }
  if (bEksport.medKilde !== bOriginal.medKilde || bEksport.udenKilde !== bOriginal.udenKilde) {
    fejl.push(`Kildetal er FORSKELLIGT: eksport ${bEksport.medKilde}/${bEksport.udenKilde} ` +
      `vs. original ${bOriginal.medKilde}/${bOriginal.udenKilde}`);
  }

  console.log('\n' + '='.repeat(72));
  console.log(`TJEK: ${ligeAntal}/${originalFiler.length} dybt lig · validate ${vTal.fejl} fejl · ` +
    `build sider ${bEksport.sider}=${bOriginal.sider} · kilder ${bEksport.medKilde}=${bOriginal.medKilde}`);
  if (fejl.length) {
    console.log(`\n${fejl.length} PROBLEM(ER):\n`);
    for (const f of fejl) console.log(`- ${f}\n`);
    console.log('TJEK FEJLEDE.');
    return 1;
  }
  console.log('TJEK BESTAAET — databasen og bygget siger det samme.');
  return 0;
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('tjek.mjs');
if (erHoved) {
  try {
    process.exit(hoved());
  } catch (e) {
    console.error(String(e && e.stack ? e.stack : e));
    process.exit(1);
  }
}

export { dybtLig, traekValidateTal, udenTekst, talLig, TEKSTNOEGLER };
