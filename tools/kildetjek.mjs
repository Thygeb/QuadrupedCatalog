#!/usr/bin/env node
/**
 * tools/kildetjek.mjs — lever kildernes URL'er stadig noget?
 *
 *   node tools/kildetjek.mjs                  tjekker alle kilde-URL'er i data/
 *   node tools/kildetjek.mjs --tidsudl=<ms>   aendrer forespoergselstimeout (std. 15000)
 *   node tools/kildetjek.mjs --samtidig=<n>   aendrer antal samtidige forespoergsler (std. 8)
 *
 * Skrevet 27.08.2026: sidens ene loefte er, at hvert tal har en kilde. Der
 * staar 1.110 kildebelagte tal paa de byggede sider, og hver kilde er en URL
 * til producentens egen side. `tools/linktjek.mjs` maaler kun INTERNE links i
 * dist/ - dens egen indledning siger det ordret: "Eksterne links (http/https/
 * mailto) ... maales ikke her." Ingen har nogensinde efterproevet, om
 * kilde-URL'erne i data/ stadig svarer. Det goer dette vaerktoej.
 *
 * Tre udfald, og de MAA ALDRIG blandes sammen - det er hele vaerktoejets vaerdi:
 *   OK       2xx, eller en 3xx fetch selv fulgte frem til 2xx.
 *   DOED     4xx/5xx - serveren svarede, og svaret var "siden er her ikke".
 *   UNAAELIG timeout, DNS-fejl, TLS-fejl, forbindelse naegtet/afbrudt - IKKE
 *            det samme som doed. Mange kilder er kinesiske, og et dansk
 *            netvaerk kan ikke skelne "siden er vaek" fra "vi kan ikke naa
 *            derhen". Kun DOED goer, at scriptet exit'er med fejlkode.
 *
 * Afhaengighedsfrit: kun Node-indbyggede moduler og den globale fetch (Node
 * 24.13.0) - projektets loefte om en afhaengighedsfri generator gaelder ogsaa
 * vaerktoejerne. Gemmer ALDRIG sidernes indhold, kun status: fabrikantmateriale
 * hoerer hjemme i media/_kilder/ (gitignoreret), som dette vaerktoej ikke roerer.
 *
 * Exit 1 ved mindst én DOED, saa scriptet kan staa i en kontrolkaede - samme
 * form som tools/linktjek.mjs. Exit 0 hvis der er nul DOEDE (unaaelige tael-
 * ler ikke med, jf. ovenfor).
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const flag = Object.fromEntries(process.argv.slice(2)
  .map((a) => a.match(/^--([^=]+)(?:=(.*))?$/)).filter(Boolean)
  .map((m) => [m[1], m[2] ?? true]));

const TIDSUDL = Number(flag.tidsudl ?? 15000);
const SAMTIDIG = Number(flag.samtidig ?? 8);

/* ------------------------------------------------------------------ *
 * Rene, testbare klassifikationsfunktioner - INGEN netvaerk herunder.
 * tests/dele/22-kildetjek.mjs kalder disse direkte med opdigtede svar,
 * saa klassifikationen kan bevises rigtig uden at kraeve internetadgang.
 * ------------------------------------------------------------------ */

/** HTTP-statuskoder, hvor en HEAD-afvisning IKKE betyder "siden er doed" -
 *  serveren afviser specifikt metoden HEAD, ikke ressourcen. 403 er medtaget
 *  udover briefets egne 405/501, fordi flere CDN'er/WAF'er svarer 403 paa
 *  HEAD alene som bot-beskyttelse, mens GET paa samme URL giver 200 - uden
 *  denne udvidelse ville saadanne kilder fejlagtigt blive talt som DOEDE. */
const FALDBACK_STATUS = new Set([403, 405, 501]);

/** Skal der proeves GET, naar en HEAD-forespoergsel gav denne status? */
export function skalFaldeTilbage(status) {
  return FALDBACK_STATUS.has(status);
}

/** 2xx/3xx (fetch har allerede fulgt omdirigeringer, saa en 3xx der ender i
 *  2xx viser sig her som den endelige 2xx) = OK. 4xx/5xx = DOED. */
export function klassificerStatus(status) {
  return status < 400
    ? { udfald: 'OK', status, aarsag: null }
    : { udfald: 'DOED', status, aarsag: null };
}

/** Klassificerer en KASTET fejl fra fetch. Returnerer ALTID UNAAELIG - aldrig
 *  OK eller DOED - fordi en netvaerksfejl beviser intet om, om siden findes. */
export function klassificerFejl(fejl) {
  const kode = fejl?.cause?.code;
  const navn = fejl?.name;
  const besked = typeof fejl?.message === 'string' ? fejl.message : String(fejl);
  let aarsag;
  if (navn === 'TimeoutError' || navn === 'AbortError') aarsag = 'timeout';
  else if (kode === 'ENOTFOUND' || kode === 'EAI_AGAIN') aarsag = 'dns-opslag fejlede';
  else if (kode === 'ECONNREFUSED') aarsag = 'forbindelse naegtet';
  else if (kode === 'ECONNRESET') aarsag = 'forbindelse afbrudt undervejs';
  else if ((typeof kode === 'string' && kode.startsWith('ERR_TLS')) || /certificate|SSL|TLS/i.test(besked)) {
    aarsag = `tls-fejl: ${kode || besked}`;
  } else aarsag = `netvaerksfejl: ${kode || besked}`;
  return { udfald: 'UNAAELIG', status: null, aarsag };
}

/* ------------------------------------------------------------------ *
 * Indsamling af URL'er fra data/ - samme regex-tilgang som orkestratorens
 * egen optaelling, saa tallene stemmer overens.
 * ------------------------------------------------------------------ */

const URL_REGEX = /https?:\/\/[^\s"']+/g;

function slugFraFil(sti, indhold) {
  const m = indhold.match(/^slug:\s*(\S+)/m);
  return m ? m[1] : path.basename(sti, path.extname(sti));
}

function laesYamlMappe(mappe) {
  if (!fs.existsSync(mappe)) return [];
  return fs.readdirSync(mappe)
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
    .map((f) => path.join(mappe, f));
}

/** Kortlaegger hver unikke URL til de robot-/producent-slugs, der baerer den
 *  som kilde et sted i deres YAML. En tom data/manufacturers/-mappe (dagens
 *  tilstand) giver blot en tom liste her - den faar scriptet ikke til at fejle. */
export function indsamlUrler(rod = process.cwd()) {
  const filer = [
    ...laesYamlMappe(path.join(rod, 'data', 'robots')),
    ...laesYamlMappe(path.join(rod, 'data', 'manufacturers')),
  ];
  const urlTilSlugs = new Map();
  for (const fil of filer) {
    const indhold = fs.readFileSync(fil, 'utf8');
    const slug = slugFraFil(fil, indhold);
    for (const m of indhold.matchAll(URL_REGEX)) {
      const url = m[0].replace(/[.,)]+$/, '');
      if (!urlTilSlugs.has(url)) urlTilSlugs.set(url, new Set());
      urlTilSlugs.get(url).add(slug);
    }
  }
  return urlTilSlugs;
}

/* ------------------------------------------------------------------ *
 * Selve netvaerkskaldet - HEAD foerst, GET som reserve.
 * ------------------------------------------------------------------ */

async function forespoergSvar(url, metode) {
  const res = await fetch(url, {
    method: metode,
    redirect: 'follow',
    signal: AbortSignal.timeout(TIDSUDL),
  });
  // Gemmer ALDRIG indholdet - kun statuskoden laeses. Kroppen kasseres
  // eksplicit, saa der ikke ligger et uafhentet respons-body tilbage.
  if (res.body) { try { await res.body.cancel(); } catch { /* ligegyldigt */ } }
  return res;
}

/** Proever HEAD foerst. Falder til GET, naar HEAD-svaret er 403/405/501
 *  (metoden selv blev afvist) - IKKE ved en netvaerksfejl paa HEAD, for en
 *  DNS-/forbindelsesfejl rammer GET paa samme host lige saa haardt og ville
 *  kun fordoble ventetiden uden at aendre udfaldet. */
export async function tjekUrl(url) {
  let hovedSvar;
  try {
    hovedSvar = await forespoergSvar(url, 'HEAD');
  } catch (fejl) {
    return { url, metode: 'HEAD', ...klassificerFejl(fejl) };
  }
  if (!skalFaldeTilbage(hovedSvar.status)) {
    return { url, metode: 'HEAD', ...klassificerStatus(hovedSvar.status) };
  }
  try {
    const getSvar = await forespoergSvar(url, 'GET');
    return { url, metode: 'GET', ...klassificerStatus(getSvar.status) };
  } catch (fejl) {
    return { url, metode: 'GET', ...klassificerFejl(fejl) };
  }
}

/** Koerer `arbejde` over `poster` med hoejst `graense` samtidige kald. */
async function koerMedBegraensning(poster, graense, arbejde) {
  const resultater = new Array(poster.length);
  let naeste = 0;
  async function arbejder() {
    while (naeste < poster.length) {
      const i = naeste++;
      resultater[i] = await arbejde(poster[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(graense, poster.length)) }, arbejder));
  return resultater;
}

/* ------------------------------------------------------------------ *
 * main() - koerer kun naar filen koeres som script, ikke naar den
 * importeres (tests/dele/22-kildetjek.mjs importerer klassifikations-
 * funktionerne ovenfor uden at udloese en eneste netvaerksforespoergsel).
 * ------------------------------------------------------------------ */

async function main() {
  const rod = process.cwd();
  const urlTilSlugs = indsamlUrler(rod);
  const urls = [...urlTilSlugs.keys()].sort();

  console.log(`Fandt ${urls.length} unikke kilde-URL'er i data/robots/ og data/manufacturers/.`);
  console.log(`Tjekker med tidsudl=${TIDSUDL} ms, samtidig=${SAMTIDIG} ...`);
  console.log('');

  const resultater = await koerMedBegraensning(urls, SAMTIDIG, async (url) => {
    const svar = await tjekUrl(url);
    return { ...svar, slugs: [...urlTilSlugs.get(url)].sort() };
  });

  let ok = 0;
  let doede = 0;
  let unaaelige = 0;
  const ikkeOk = [];
  for (const r of resultater) {
    if (r.udfald === 'OK') ok++;
    else {
      if (r.udfald === 'DOED') doede++; else unaaelige++;
      ikkeOk.push(r);
    }
  }

  if (ikkeOk.length) {
    console.log('URL\tudfald\tstatus/aarsag\trobot-slugs');
    for (const r of ikkeOk) {
      const statusEllerAarsag = r.status != null ? String(r.status) : r.aarsag;
      console.log(`${r.url}\t${r.udfald}\t${statusEllerAarsag}\t${r.slugs.join(', ')}`);
    }
    console.log('');
  }

  console.log(`${resultater.length} af ${urls.length} prøvet · ${ok} ok · ${doede} døde · ${unaaelige} unåelige`);

  process.exitCode = doede > 0 ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main();
}
