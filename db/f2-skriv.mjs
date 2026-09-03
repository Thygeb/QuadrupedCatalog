#!/usr/bin/env node
/**
 * db/f2-skriv.mjs — DEN ENE skrivevej, ~23 fase 2-spor deler (spor/f2-maal,
 * fund/BRIEF-f2-maal.md punkt 4, PLAN.md par. 0 fase 2).
 *
 *   node db/f2-skriv.mjs <opdateringer.json>            TOeRLOeB (standard)
 *   node db/f2-skriv.mjs <opdateringer.json> --skriv     Skriver rigtigt
 *
 * <opdateringer.json>: array af poster,
 *   { "tabel": "field_entries",
 *     "noegle": { "robot_id": 2183, "field_name": "weight" },
 *     "saet": { "caveat": "...", "caveat_wording": "..." },
 *     "change_reason": "fase 2: engelsk brødtekst + ordret kildeordlyd udskilt" }
 *
 * HAeRDNINGERNE, briefets punkt 4 kraever, ALLE strukturelle (ikke kun
 * konvention):
 *   1. collected_by saettes AUTOMATISK til grennavnet (git rev-parse
 *      --abbrev-ref HEAD) — INGEN post kan saette den selv (den staar ikke
 *      paa hvidlisten nedenfor). change_reason er PAAKRAeVET paa HVER post;
 *      MANGLER den paa BARE ÉN, afvises HELE koerslen FOeR noget sendes
 *      (valider() koeres foer foerste fetch).
 *   2. Prefer: return=representation paa HVER PATCH — uden den svarer
 *      PostgREST 204 UDEN krop, og "1 raekke opdateret" kan ikke skelnes
 *      fra "0 raekker matchede" (den dyreste faelde i denne fil, jf.
 *      briefet). ALDRIG udeladt her.
 *   3. Svarer PATCH-arrayet med andet end PRAeCIS 1 raekke, afbrydes HELE
 *      koerslen med posten navngivet (kastet fejl, fanget i hoved()).
 *   4. TEKSTKOLONNE_HVIDLISTE er den ENESTE vej en kolonne kan naa
 *      PATCH-kroppen igennem "saet" — enhver anden noegle i "saet" afvises
 *      FOeR noget sendes. Det er vaernet, der goer db/fase2-tjek.mjs --tal's
 *      aftryk (punkt 1) AeGTE: fase 2-sporene kan strukturelt IKKE roere et
 *      tal her, selv hvis en post proever.
 *   5. --toerloeb er STANDARD (intet flag skrevet betyder toerloeb).
 *      --skriv kraeves EKSPLICIT for at sende noget.
 *   6. Skriver til sidst "N raekker skrevet", opdelt pr. tabel.
 *
 * Nul afhaengigheder. Genbruger laesDotEnv/laesForbindelse fra
 * db/fase2-tjek.mjs (ÉN .env-laeser, ikke en tredje kopi ved siden af
 * db/eksporter.mjs's — Å12/L30-princippet, CLAUDE.md).
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { laesForbindelse } from './fase2-tjek.mjs';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Primaernoeglerne pr. tabel, maalt i db/skema.sql (2. sep 2026) — briefets
 *  punkt 4 gengiver dem, denne konstant HAaNDHAeVER dem: "noegle" i en post
 *  skal indeholde PRAeCIS disse felter, hverken flere eller faerre. */
export const TABEL_NOEGLER = {
  field_entries: ['robot_id', 'field_name'],
  applications: ['robot_id'],
  images: ['robot_id'],
  robots: ['id'],
  field_entry_variants: ['robot_id', 'field_name', 'variant_name'],
};

/** Den ENESTE vej en kolonne kan skrives — briefets punkt 4.4. BEMAeRK:
 *  field_entry_variants har KUN én ikke-noegle-kolonne ("value", jsonb,
 *  selve specifikationsvaerdien) — den staar IKKE her, saa i PRAKSIS kan
 *  denne hjaelper ALDRIG skrive til field_entry_variants (enhver "saet" med
 *  mindst én noegle vil altid ramme "ikke hvidlistet"). Det er en
 *  konsekvens af hvidlisten, ikke en separat kontrol af tabellen — se
 *  fund/FUND-f2maal.md's "Nye fælder" for hvorfor det ogsaa er en GOD
 *  ting (db/skema.sql's log_change()-trigger laeser NEW.collected_by
 *  ubetinget, og den kolonne findes ikke paa field_entry_variants). */
export const TEKSTKOLONNE_HVIDLISTE = new Set([
  'caveat', 'caveat_wording', 'caveat_class',
  'note', 'note_wording', 'notes', 'notes_wording',
  'quote', 'quote_wording', 'alt',
  'manufacturer_city', 'manufacturer_country',
  // value_text er ANDERLEDES end de tolv ovenfor: den er feltets SVAR, ikke en
  // bemaerkning om svaret — den vises som robottens data (fund/BRIEF-FAELLES.md,
  // "value_text er ny i denne runde"). Oversaettelse maa derfor kun aendre SPROG,
  // aldrig BETYDNING: "grundlaeggende" -> "basic", ikke "basic (entry-level)".
  // Udvider en post value_text's indhold, har den aendret et datapunkt, og det
  // er lige saa alvorligt som at roere et tal (spor/f2-valuetext, 3. sep 2026).
  'value_text',
]);

/**
 * Ren valideringsfunktion, INGEN I/O — testbar uden database (tests/dele).
 * {fejl: string[]} — HELE koerslen afvises, hvis fejl.length > 0 (briefets
 * "en post uden change_reason afvises FOeR noget sendes" gaelder for
 * BATCHEN, ikke kun den enkelte post: én ugyldig post stopper alle).
 */
export function valider(poster) {
  const fejl = [];
  if (!Array.isArray(poster)) return { fejl: ['JSON-filen skal vaere et array af poster.'] };
  poster.forEach((post, i) => {
    const kort = `post[${i}]`;
    if (!post || typeof post !== 'object' || Array.isArray(post)) { fejl.push(`${kort}: er ikke et objekt`); return; }
    const { tabel, noegle, saet, change_reason } = post;

    if (!Object.prototype.hasOwnProperty.call(TABEL_NOEGLER, tabel)) {
      fejl.push(`${kort}: ukendt tabel "${tabel}" (gyldige: ${Object.keys(TABEL_NOEGLER).join(', ')})`);
    } else {
      const forventet = [...TABEL_NOEGLER[tabel]].sort();
      const givne = noegle && typeof noegle === 'object' ? Object.keys(noegle).sort() : null;
      if (!givne || JSON.stringify(givne) !== JSON.stringify(forventet)) {
        fejl.push(`${kort}: "noegle" for tabel "${tabel}" skal PRAeCIS vaere {${forventet.join(', ')}}, `
          + `fik ${givne ? `{${givne.join(', ')}}` : 'ingen/ugyldig noegle'}`);
      }
    }

    if (!saet || typeof saet !== 'object' || Array.isArray(saet) || Object.keys(saet).length === 0) {
      fejl.push(`${kort}: "saet" mangler eller er tomt`);
    } else {
      const ugyldige = Object.keys(saet).filter((k) => !TEKSTKOLONNE_HVIDLISTE.has(k));
      if (ugyldige.length) {
        fejl.push(`${kort}: "saet" indeholder ikke-hvidlistede kolonner: ${ugyldige.join(', ')} `
          + `(kun: ${[...TEKSTKOLONNE_HVIDLISTE].join(', ')})`);
      }
    }

    if (typeof change_reason !== 'string' || change_reason.trim() === '') {
      fejl.push(`${kort}: "change_reason" mangler eller er tom — PAAKRAeVET (briefets punkt 4.1)`);
    }
  });
  return { fejl };
}

/** PATCH-URL'en for én post: <base>/rest/v1/<tabel>?<noegle1>=eq.<v1>&... */
export function byggUrl(baseUrl, tabel, noegle) {
  const qs = Object.entries(noegle).map(([k, v]) => `${encodeURIComponent(k)}=eq.${encodeURIComponent(v)}`).join('&');
  return `${baseUrl}/rest/v1/${tabel}?${qs}`;
}

/** PATCH-kroppen: postens "saet" PLUS collected_by (grennavnet, ALDRIG fra
 *  posten selv) og change_reason (fra posten, allerede valideret paakraevet). */
export function byggBody(post, grennavn) {
  return { ...post.saet, collected_by: grennavn, change_reason: post.change_reason };
}

/**
 * collected_by's vaerdi — grennavnet, LAeST FRA DISK (.git/HEAD), IKKE
 * spawnet via "git rev-parse" (child_process.execFileSync).
 *
 * FAeLDE, fundet ved foerste rigtige --skriv-koersel (ikke antaget):
 * execFileSync() + et rigtigt fetch()-kald i SAMME proces faar node.exe
 * v24.13.0 til at CRASHE ved process.exit() med "Assertion failed:
 * !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76" —
 * exit-kode 127, SELV OM baade PATCH'et og git-kaldet lykkedes fuldt ud
 * (efterproevet: raekken var korrekt skrevet i databasen efter crashet).
 * Reproduceret isoleret, UAFHAeNGIGT af raekkefoelge (execFileSync foer
 * ELLER efter fetch giver samme crash) — den fælles faktor er BEGGE dele
 * i samme proces PLUS et eksplicit process.exit()-kald. Uden
 * process.exit() (naturlig afslutning) crasher intet. Et
 * skriveresultat, en fremtidig kalder laeser exit-koden paa (23 spor
 * skal bruge dette script!), maa IKKE kunne se ud som en fejl, naar
 * skrivningen rent faktisk lykkedes — derfor denne fil-baserede laesning
 * i stedet, som slet ikke spawner en child-proces og saaledes ikke
 * udloeser faelden. Se fund/FUND-f2maal.md's "Nye fælder".
 *
 * Understoetter BAaDE et normalt repo (.git er en MAPPE) og en git
 * worktree (.git er en FIL med "gitdir: <sti>", saa HEAD ligger under
 * DEN sti, ikke i lokal .git/ — praecis denne worktrees egen situation).
 */
export function laesGrennavn() {
  const gitSti = path.join(ROD, '.git');
  let gitDir = gitSti;
  if (fs.statSync(gitSti).isFile()) {
    const indhold = fs.readFileSync(gitSti, 'utf8').trim();
    const m = indhold.match(/^gitdir:\s*(.+)$/);
    if (!m) throw new Error(`laesGrennavn: kunne ikke laese .git-filen (worktree-peger): "${indhold}"`);
    gitDir = m[1].trim();
  }
  const head = fs.readFileSync(path.join(gitDir, 'HEAD'), 'utf8').trim();
  const refMatch = head.match(/^ref:\s*refs\/heads\/(.+)$/);
  if (!refMatch) throw new Error(`laesGrennavn: HEAD peger ikke paa en gren (detached HEAD?): "${head}"`);
  return refMatch[1];
}

function laesFlag(argv) {
  const flag = {};
  const positionelle = [];
  for (const a of argv) {
    if (a.startsWith('--')) {
      const i = a.indexOf('=');
      if (i === -1) flag[a.slice(2)] = true; else flag[a.slice(2, i)] = a.slice(i + 1);
    } else positionelle.push(a);
  }
  return { flag, positionelle };
}

/** Sender (eller — i toerloeb — VISER) ÉN post. Kaster ved alt andet end
 *  PRAeCIS 1 raekke i svaret (briefets punkt 4.3: afbryd HELE koerslen). */
async function skrivPost(baseUrl, headers, post, grennavn, udfoer) {
  const url = byggUrl(baseUrl, post.tabel, post.noegle);
  const body = byggBody(post, grennavn);
  if (!udfoer) {
    console.log(`  [TOeRLOeB] PATCH ${post.tabel} WHERE ${JSON.stringify(post.noegle)} `
      + `SAeT ${JSON.stringify(post.saet)} (collected_by=${JSON.stringify(grennavn)}, `
      + `change_reason=${JSON.stringify(post.change_reason)})`);
    return 0;
  }
  const svar = await fetch(url, {
    method: 'PATCH',
    // Prefer: return=representation er OBLIGATORISK — se filens toptekst,
    // punkt 2. Uden den er 204+tom-krop UMULIG at skelne fra "0 matchede".
    headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(body),
  });
  if (!svar.ok) throw new Error(`PATCH ${post.tabel} WHERE ${JSON.stringify(post.noegle)} fejlede: ${svar.status} ${await svar.text()}`);
  const raekker = await svar.json();
  if (raekker.length !== 1) {
    throw new Error(`PATCH ${post.tabel} WHERE ${JSON.stringify(post.noegle)}: ${raekker.length} raekker `
      + `matchede (forventede PRAeCIS 1). AFBRYDER HELE KOeRSLEN — se briefets punkt 4.3.`);
  }
  console.log(`  skrevet: ${post.tabel} ${JSON.stringify(post.noegle)}`);
  return 1;
}

async function hoved() {
  const { flag, positionelle } = laesFlag(process.argv.slice(2));
  const filArg = positionelle[0];
  if (!filArg) {
    console.error('Brug: node db/f2-skriv.mjs <opdateringer.json> [--skriv]');
    return 2;
  }

  const poster = JSON.parse(fs.readFileSync(path.resolve(filArg), 'utf8'));
  const { fejl } = valider(poster);
  if (fejl.length) {
    console.error(`${fejl.length} POST(ER) AFVIST — INTET SENDT (briefets punkt 4.1/4.4):`);
    for (const f of fejl) console.error(`  - ${f}`);
    return 1;
  }

  const udfoer = !!flag['skriv'];
  console.log(udfoer ? `SKRIVER (--skriv) ${poster.length} post(er)` : `TOeRLOeB (standard) ${poster.length} post(er) — brug --skriv for at skrive`);

  const { url, headers } = laesForbindelse();
  const grennavn = laesGrennavn();
  console.log(`collected_by = ${JSON.stringify(grennavn)}`);

  const tabelTal = {};
  for (const post of poster) {
    const raekker = await skrivPost(url, headers, post, grennavn, udfoer);
    tabelTal[post.tabel] = (tabelTal[post.tabel] ?? 0) + raekker;
  }
  const samlet = Object.values(tabelTal).reduce((a, b) => a + b, 0);
  const prTabel = Object.entries(tabelTal).map(([t, n]) => `${t}: ${n}`).join(', ');
  console.log(`\n${samlet} raekker skrevet${prTabel ? ` (${prTabel})` : ''}`);
  return 0;
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('f2-skriv.mjs');
if (erHoved) {
  // process.exitCode (IKKE process.exit()) — se laesGrennavn()s toptekst:
  // et rigtigt fetch() + et EKSPLICIT process.exit() bagefter crasher denne
  // maskines node.exe v24.13.0 (libuv-assertion, exit-kode 127), OGSAA UDEN
  // execFileSync i billedet (efterproevet isoleret). process.exitCode
  // saetter kun exit-koden og lader Node afslutte NATURLIGT, naar
  // event-loopet er tomt — det udloeser ikke faelden (efterproevet).
  hoved().then((k) => { process.exitCode = k; }).catch((e) => {
    console.error(String(e && e.stack ? e.stack : e));
    process.exitCode = 1;
  });
}
