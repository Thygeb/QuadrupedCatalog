#!/usr/bin/env node
/**
 * db/rundtur.mjs — fundamentets faerdighedskriterium (L34, STATUS.md).
 *
 * TO TILSTANDE:
 *
 *   node db/rundtur.mjs          LOKAL (standard, uaendret siden fundamentet).
 *                                 Koerer HELE den lokale kaede fra bunden:
 *   1. node db/migrer.mjs          data/robots/*.yaml -> db/kanonisk.json
 *   2. node db/eksporter.mjs       db/kanonisk.json -> db/.tmp/rundtur-eksport/*.yaml
 *   3. For alle 62 filer: parse(original) skal vaere DYBT LIG parse(eksport).
 *      "parse" betyder her normaliserRobot(parseYaml(x)) — den samme
 *      laesning, validate.mjs og build.mjs selv bruger umiddelbart efter
 *      parseYaml, og dermed den definition af "hvad filen betyder", resten
 *      af projektet allerede er enige om. En raa parseYaml-sammenligning
 *      ville i stedet kraeve, at eksporten genskriver producenters egne
 *      stavemaader af enheder ("Kg", "WH") bogstaveligt — det er ikke
 *      informationen, rundturen skal bevise blev bevaret.
 *   4. tools/validate.mjs skal koere FEJLFRIT paa den eksporterede mappe.
 *   5. tools/build.mjs mod eksport-mappen skal give SAMME sidetal og
 *      kildetal som tools/build.mjs mod data/robots/ (begge koert i denne
 *      koersel — tallene MAALES her, ikke hardkodede fra en tidligere
 *      session, saa proeven ikke raadner, hvis datasaettet vokser).
 *
 *   node db/rundtur.mjs --live   LIVE (L34-tilslutning). Samme fem trin,
 *                                 men trin 1-2 gaar mod den RIGTIGE Supabase-
 *                                 instans i stedet for db/kanonisk.json:
 *                                   1. node db/migrer.mjs --til-db
 *                                   2. node db/eksporter.mjs --fra-db --ud=db/.tmp/rundtur-live-eksport
 *                                 Trin 3-5 er BOGSTAVELIGT den samme
 *                                 sammenligningskode som den lokale tilstand
 *                                 (koerSammenligning nedenfor) — kun mappen,
 *                                 der sammenlignes mod, skifter. Kraever
 *                                 SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY i
 *                                 .env, se db/LAESMIG.md.
 *
 * Exit 0 = alle trin bestod. Exit 1 = mindst ét faldt, med detaljer.
 * Ingen npm-afhaengigheder — child_process.execFileSync mod den samme
 * node-binaer, denne proces selv koerer under (process.execPath), saa
 * scriptet virker uanset PATH.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { parseYaml } = await import(`file://${path.join(ROD, 'tools/yaml.mjs')}`);
const { normaliserRobot } = await import(`file://${path.join(ROD, 'tools/skema.mjs')}`);

const EKSPORT_MAPPE = path.join(ROD, 'db/.tmp/rundtur-eksport');
const LIVE_EKSPORT_MAPPE = path.join(ROD, 'db/.tmp/rundtur-live-eksport');
const BYG_EKSPORT = path.join(ROD, 'db/.tmp/rundtur-byg-eksport');
const BYG_LIVE_EKSPORT = path.join(ROD, 'db/.tmp/rundtur-byg-live-eksport');
const BYG_ORIGINAL = path.join(ROD, 'db/.tmp/rundtur-byg-original');

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

/* --------------------------------------------------------------- main */

/**
 * Trin 3-5 (lokal) / 3-5 (live) er BOGSTAVELIGT samme kode i begge
 * tilstande — kun `eksportMappe`/`bygEksportMappe` skifter. Adskillelsen fra
 * trin 1-2 (som ER forskellige: lokal fil vs. rigtig DB) er bevidst, saa der
 * ikke findes to kopier af sammenligningslogikken, der kan skride fra
 * hinanden (samme princip som D7/L30's to-lister-fælde andre steder i
 * projektet).
 */
function koerSammenligning(eksportMappe, bygEksportMappe, trinPraefix) {
  const fejl = [];

  console.log(`${trinPraefix}  Dyb lighed for alle filer (normaliserRobot(parseYaml(x))) ...`);
  const originalMappe = path.join(ROD, 'data/robots');
  const originalFiler = fs.readdirSync(originalMappe).filter((f) => /\.ya?ml$/.test(f)).sort();
  let ligeAntal = 0;
  const uligeDetaljer = [];
  for (const f of originalFiler) {
    const slug = f.replace(/\.ya?ml$/, '');
    const eksportFil = path.join(eksportMappe, `${slug}.yaml`);
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
    fejl.push(`Rundtur: ${uligeDetaljer.length} fil(er) er IKKE dybt lig deres original:\n  ` +
      uligeDetaljer.join('\n  '));
  }

  console.log(`${trinPraefix}  node tools/validate.mjs paa den eksporterede mappe ...`);
  let validateUd;
  try {
    validateUd = koer(['tools/validate.mjs', `--data=${eksportMappe}`]);
  } catch (e) {
    validateUd = (e.stdout ?? '') + (e.stderr ?? '');
  }
  const vTal = traekValidateTal(validateUd);
  console.log(`     ${vTal.filer} fil(er) · ${vTal.fejl} fejl · ${vTal.advarsler} advarsler.`);
  if (vTal.fejl !== 0) {
    fejl.push(`validate.mjs fandt ${vTal.fejl} fejl paa den eksporterede mappe (forventet 0):\n${validateUd}`);
  }

  console.log(`${trinPraefix}  node tools/build.mjs paa eksport vs. original — sidetal og kildetal skal vaere ens ...`);
  fs.rmSync(bygEksportMappe, { recursive: true, force: true });
  fs.rmSync(BYG_ORIGINAL, { recursive: true, force: true });
  const bEksport = traekBuildTal(koer(['tools/build.mjs', `--data=${eksportMappe}`, `--ud=${bygEksportMappe}`]));
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

  return { fejl, ligeAntal, totalFiler: originalFiler.length, vTal, bEksport, bOriginal };
}

function afslut(resultat) {
  console.log('\n' + '='.repeat(72));
  console.log(`RUNDTUR: ${resultat.ligeAntal}/${resultat.totalFiler} dybt lig · validate ${resultat.vTal.fejl} fejl · ` +
    `build sider ${resultat.bEksport.sider}=${resultat.bOriginal.sider} · kilder ${resultat.bEksport.medKilde}=${resultat.bOriginal.medKilde}`);
  if (resultat.fejl.length) {
    console.log(`\n${resultat.fejl.length} PROBLEM(ER):\n`);
    for (const f of resultat.fejl) console.log(`- ${f}\n`);
    console.log('RUNDTUR FEJLEDE.');
    return 1;
  }
  console.log('RUNDTUR BESTAAET — fundamentet er efterproevet.');
  return 0;
}

function hovedLokal() {
  console.log('1/5  node db/migrer.mjs ...');
  koer(['db/migrer.mjs']);

  console.log('2/5  node db/eksporter.mjs --ud=db/.tmp/rundtur-eksport ...');
  fs.rmSync(EKSPORT_MAPPE, { recursive: true, force: true });
  koer(['db/eksporter.mjs', `--ud=${EKSPORT_MAPPE}`]);

  const resultat = koerSammenligning(EKSPORT_MAPPE, BYG_EKSPORT, '3-5/5');
  return afslut(resultat);
}

/** LIVE-tilstand (--live): samme fem trin, men 1-2 gaar mod den rigtige
 *  Supabase-instans. Kraever SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY i .env
 *  — se db/LAESMIG.md. Fejler tydeligt (exit 1, ingen npm-retry-loop), hvis
 *  .env mangler eller et af de to underliggende scripts returnerer fejl. */
function hovedLive() {
  console.log('1/5  node db/migrer.mjs --til-db ...');
  koer(['db/migrer.mjs', '--til-db']);

  console.log('2/5  node db/eksporter.mjs --fra-db --ud=db/.tmp/rundtur-live-eksport ...');
  fs.rmSync(LIVE_EKSPORT_MAPPE, { recursive: true, force: true });
  koer(['db/eksporter.mjs', '--fra-db', `--ud=${LIVE_EKSPORT_MAPPE}`]);

  const resultat = koerSammenligning(LIVE_EKSPORT_MAPPE, BYG_LIVE_EKSPORT, '3-5/5');
  return afslut(resultat);
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('rundtur.mjs');
if (erHoved) {
  try {
    process.exit(process.argv.includes('--live') ? hovedLive() : hovedLokal());
  } catch (e) {
    console.error(String(e && e.stack ? e.stack : e));
    process.exit(1);
  }
}

export { dybtLig, traekValidateTal };
