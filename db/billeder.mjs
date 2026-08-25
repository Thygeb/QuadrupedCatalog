#!/usr/bin/env node
/**
 * db/billeder.mjs — assets/fotos/  <->  Supabase Storage-spanden "robotbilleder" (L34)
 *                    media/_kilder/ + media/robotbilleder/  <->  spanden "arkiv"
 *
 * Nul afhaengigheder. Samme stil som db/migrer.mjs: fetch mod Supabase' REST-
 * /Storage-API, dansk i kommentarer og udskrifter, --flag-styring.
 *
 * BAGGRUND (billedretningen): robotdataene ligger allerede i Supabase (L34/L35).
 * Billedfilerne gjorde ikke — de findes kun lokalt i assets/fotos/. Dette
 * script flytter dem begge veje, saa en robotpost er hel ét sted.
 *
 * BAGGRUND (arkivretningen, tilfoejet 25. aug 2026): media/_kilder/ (272 HTML-
 * filer, 11 PDF'er, m.fl.) er BEVISET for hvad en producentside sagde den dag,
 * et tal blev hentet derfra — 1.110 kildebelagte tal i projektet staar og
 * falder med, at det bevis kan findes igen. media/robotbilleder/ er det
 * upakkede fabrikantmateriale. Begge findes i ÉT eksemplar (JPK's maskine,
 * 506 MB, gitignoreret) og kan ikke genskabes, hvis producenter aendrer deres
 * sider. --arkiv-op/--arkiv-ned er en sikkerhedskopi af den, IKKE en ny
 * publiceringsvej.
 *
 * DESIGN, IKKE TIL AFVIGELSE: tools/build.mjs forbliver urørt og henter
 * ALDRIG fra nettet. Bygget laeser stadig kun assets/ (se build.mjs:435-482).
 * media/ har INGEN kodesti ind i assets/ eller dist/ — hverken foer eller
 * efter denne udvidelse. Dette script er den eneste kodesti, der taler med
 * NOGEN af de to spande.
 *
 * ADSKILLELSEN MELLEM DE TO SPANDE ER BEVIDST STRUKTUREL, IKKE KUN EN AFTALE:
 * "robotbilleder" (assets/fotos/) og "arkiv" (media/_kilder/ + media/
 * robotbilleder/) er to forskellige spande, laest og skrevet af to forskellige
 * funktionspar (op/ned vs. arkivOp/arkivNed), som hver kun kender ÉN
 * spandkonstant og ÉN lokal rodmappe. --proev-adskillelse beviser det ved
 * rent faktisk at koere koden med fetch og fs mocket ud (se dér for hvorfor
 * det er en maaling, ikke en paastand).
 *
 *   node db/billeder.mjs --op             assets/fotos/  ->  "robotbilleder"
 *   node db/billeder.mjs --ned            "robotbilleder" ->  assets/fotos/
 *   node db/billeder.mjs --arkiv-op       media/_kilder/ + media/robotbilleder/  ->  "arkiv"
 *   node db/billeder.mjs --arkiv-ned [--ud=<mappe>]   "arkiv"  ->  media/ (eller <mappe>)
 *   node db/billeder.mjs --tjek           beviser at BEGGE spande er PRIVATE (public=false)
 *   node db/billeder.mjs --proev-adskillelse   beviser mekanisk at --ned aldrig rammer
 *                                               "arkiv", og at --arkiv-ned aldrig skriver
 *                                               uden for media/
 *
 * BEGGE SPANDE SKAL VAeRE PRIVATE. En privat spand er lagring, ikke
 * publicering — S1 (STATUS.md) forbliver intakt. En offentlig spand ville
 * vaere publicering af fabrikantmateriale uden skriftlig tilladelse.
 *
 * SPRINGES-OVER-STRATEGI: et checksum-KARTOTEK, skrevet som sin egen fil i
 * hver spand ("_manifest.json", sti->sha256), IKKE et sammenlign-mod-objektets-
 * faktiske-indhold. Begrundelse: Supabase Storage's eTag er S3-stilens MD5,
 * ikke SHA-256 — den kan ikke bruges direkte til denne sammenligning uden en
 * ekstra antagelse om lagerbackend'en. Og selv hvis eTag duede, ville en
 * sammenligning mod hvert objekts faktiske indhold kraeve ÉT ekstra API-kald
 * PR. FIL for at hente metadata — manifestet er ÉT lille JSON-kald for hele
 * spanden, uanset om der er 54 eller 770 filer. Prisen: manifestet kan i
 * teorien komme ud af trit med spandens virkelige indhold, hvis nogen
 * redigerer spanden uden om dette script. Det er accepteret, fordi dette
 * script er den ENESTE kodesti, der taler med nogen af de to spande (ligesom
 * migrer.mjs er den eneste, der skriver til robotter-tabellerne). De to
 * spande har HVER SIN "_manifest.json" — det er to forskellige objekter i to
 * forskellige spand-navnerum, ikke én delt fil.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { BILLEDE_ENDELSER } = await import(`file://${path.join(ROD, 'tools/skema.mjs')}`);

const SPAND = 'robotbilleder';
const SPAND_ARKIV = 'arkiv';
const MANIFEST_STI = '_manifest.json';
const LOKAL_UNDERMAPPE = 'fotos'; // assets/fotos — den eneste undermappe, billedretningen synker

/** De to mapper under media/, arkivretningen synker, hver med sit praefiks i
 *  spanden. media/_arbejde/, media/inspiration/ og media/raa/ er BEVIDST
 *  UDELADT — JPK har valgt dem fra som genskabelig mellemvare, ikke bevis. */
const ARKIV_MAPPER = [
  { lokal: '_kilder', praefiks: '_kilder' },
  { lokal: 'robotbilleder', praefiks: 'robotbilleder' },
];

/* -------------------------------------------------------------- .env */

/** Egen, minimal .env-laeser — samme princip som db/migrer.mjs's (ikke
 *  importeret derfra: et andet spor arbejder i den fil lige nu, og denne
 *  fil skal ikke kunne braekke, hvis den aendrer sig midt i en koersel). */
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

function laesTilslutning() {
  laesDotEnv(path.join(ROD, '.env'));
  const url = process.env.SUPABASE_URL;
  const noegle = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !noegle) {
    console.error('Kraever SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY i .env (se db/LAESMIG.md).');
    process.exit(1);
  }
  return { url, noegle };
}

/* -------------------------------------------------------------- hjaelp */

function sha256Fil(sti) {
  return crypto.createHash('sha256').update(fs.readFileSync(sti)).digest('hex');
}

/** Finder alle billedfiler under assets/fotos/, rekursivt. Returnerer stier
 *  RELATIVT TIL assets/ med '/' som separator, uanset OS — det er den sti,
 *  der bliver til objektnavnet i spanden ("fotos/fabrikant/spot.jpg"). */
function findLokaleBilleder() {
  const assetsRod = path.join(ROD, 'assets');
  const start = path.join(assetsRod, LOKAL_UNDERMAPPE);
  const ud = [];
  if (!fs.existsSync(start)) return ud;
  (function gaa(m) {
    for (const p of fs.readdirSync(m, { withFileTypes: true })) {
      if (p.name.startsWith('.')) continue; // .gitkeep osv.
      const fuld = path.join(m, p.name);
      if (p.isDirectory()) { gaa(fuld); continue; }
      if (!BILLEDE_ENDELSER.includes(path.extname(p.name).toLowerCase())) continue;
      const rel = path.relative(assetsRod, fuld).split(path.sep).join('/');
      ud.push(rel);
    }
  })(start);
  return ud.sort();
}

/** Finder ALLE filer (ikke kun billeder — arkivet skal ogsaa daekke .html,
 *  .pdf, .txt, .json, .tsv, .xml, .xhtml m.fl.) under media/_kilder/ og
 *  media/robotbilleder/, rekursivt, INKLUSIVE dotfiler (fx media/robotbilleder/
 *  .gitignore) — arkivet er en sikkerhedskopi, ikke en kurateret assets-mappe,
 *  saa "alt der ligger der" er den rigtige regel, i modsaetning til
 *  findLokaleBilleder()'s "spring dotfiler over". Returnerer stier med
 *  praefiks ("_kilder/...", "robotbilleder/..."), '/' som separator. */
function findLokaleArkivFiler() {
  const mediaRod = path.join(ROD, 'media');
  const ud = [];
  for (const { lokal, praefiks } of ARKIV_MAPPER) {
    const start = path.join(mediaRod, lokal);
    if (!fs.existsSync(start)) continue;
    // relBase starter tomt ('') paa topniveau, saa "praefiks" + relBase + '/'
    // + filnavn giver ét enkelt "/" hvert sted — fx "_kilder/fil.html" paa
    // topniveau og "_kilder/raa-.../fil.html" én mappe nede.
    (function gaa(m, relBase) {
      for (const p of fs.readdirSync(m, { withFileTypes: true })) {
        const fuld = path.join(m, p.name);
        if (p.isDirectory()) { gaa(fuld, `${relBase}/${p.name}`); continue; }
        ud.push(`${praefiks}${relBase}/${p.name}`);
      }
    })(start, '');
  }
  return ud.sort();
}

function contentType(relPath) {
  const ext = path.extname(relPath).toLowerCase();
  return {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml',
    '.html': 'text/html', '.xhtml': 'application/xhtml+xml',
    '.pdf': 'application/pdf', '.txt': 'text/plain', '.md': 'text/markdown',
    '.json': 'application/json', '.tsv': 'text/tab-separated-values',
    '.xml': 'application/xml', '.js': 'text/javascript', '.mjs': 'text/javascript',
    '.sh': 'application/x-sh', '.csv': 'text/csv',
  }[ext] ?? 'application/octet-stream';
}

function objektUrl(url, spandNavn, relPath) {
  const kodet = relPath.split('/').map(encodeURIComponent).join('/');
  return `${url}/storage/v1/object/${spandNavn}/${kodet}`;
}

/* -------------------------------------------------------- Storage-API */

/** PUNKT 1 — opretter en spand idempotent. Findes den allerede (200 paa
 *  GET), goeres intet. Findes den ikke (404), oprettes den med public:false.
 *  Generaliseret 25. aug 2026 til at tage spandnavnet som parameter — GENBRUGT
 *  for baade "robotbilleder" og "arkiv", ikke duplikeret: to kopier af samme
 *  oprettelseslogik ville divergere ved den tredje spand. */
async function sikrSpand(url, noegle, spandNavn) {
  const headers = { apikey: noegle, Authorization: `Bearer ${noegle}` };

  /* STORAGE-FAeLDE (fundet ved afproevning 25. aug 2026, ikke antaget):
     GET paa en IKKE-EKSISTERENDE spand svarer IKKE med HTTP 404. Den svarer
     med HTTP 400 og en JSON-krop, hvor det er KROPPENS statusCode-felt, der
     siger "404" ({"statusCode":"404","error":"Bucket not found",
     "code":"NoSuchBucket"}) — samme moenster som PostgREST-overraskelserne i
     db/LAESMIG.md (HTTP-status og fejlkode lever i to forskellige lag). Et
     tjek paa svar.status === 404 fanger den ALDRIG; kroppen skal laeses. */
  async function hentSpandInfo() {
    const svar = await fetch(`${url}/storage/v1/bucket/${spandNavn}`, { headers });
    if (svar.ok) return { fundet: true, info: await svar.json() };
    const krop = await svar.text();
    let json = null;
    try { json = JSON.parse(krop); } catch { /* ikke JSON — behandles som anden fejl nedenfor */ }
    const erIkkeFundet = svar.status === 404 || json?.statusCode === '404' || json?.code === 'NoSuchBucket';
    if (erIkkeFundet) return { fundet: false };
    throw new Error(`GET /storage/v1/bucket/${spandNavn} fejlede: ${svar.status} ${krop}`);
  }

  let { fundet, info } = await hentSpandInfo();
  if (!fundet) {
    console.log(`  spanden "${spandNavn}" findes ikke endnu — opretter den som PRIVAT (public:false) ...`);
    const opretSvar = await fetch(`${url}/storage/v1/bucket`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: spandNavn, name: spandNavn, public: false }),
    });
    if (!opretSvar.ok) {
      throw new Error(`Kunne ikke oprette spanden "${spandNavn}": ${opretSvar.status} ${await opretSvar.text()}`);
    }
    ({ fundet, info } = await hentSpandInfo());
    if (!fundet) throw new Error(`Spanden "${spandNavn}" blev oprettet, men kan ikke findes igen paa GET.`);
  }
  return info;
}

async function hentManifest(url, noegle, spandNavn) {
  const headers = { apikey: noegle, Authorization: `Bearer ${noegle}` };
  const svar = await fetch(objektUrl(url, spandNavn, MANIFEST_STI), { headers });
  if (svar.status === 404 || svar.status === 400) return {}; // 400: "Object not found" paa nogle versioner
  if (!svar.ok) throw new Error(`Kunne ikke hente manifestet (${spandNavn}): ${svar.status} ${await svar.text()}`);
  return svar.json();
}

async function gemManifest(url, noegle, spandNavn, manifest) {
  const headers = { apikey: noegle, Authorization: `Bearer ${noegle}`, 'Content-Type': 'application/json', 'x-upsert': 'true' };
  const svar = await fetch(objektUrl(url, spandNavn, MANIFEST_STI), { method: 'POST', headers, body: JSON.stringify(manifest, null, 2) });
  if (!svar.ok) throw new Error(`Kunne ikke gemme manifestet (${spandNavn}): ${svar.status} ${await svar.text()}`);
}

async function uploadObjekt(url, noegle, spandNavn, relPath, buffer) {
  const headers = {
    apikey: noegle, Authorization: `Bearer ${noegle}`,
    'Content-Type': contentType(relPath), 'x-upsert': 'true',
  };
  const svar = await fetch(objektUrl(url, spandNavn, relPath), { method: 'POST', headers, body: buffer });
  if (!svar.ok) throw new Error(`Upload af ${spandNavn}/${relPath} fejlede: ${svar.status} ${await svar.text()}`);
}

async function downloadObjekt(url, noegle, spandNavn, relPath) {
  const headers = { apikey: noegle, Authorization: `Bearer ${noegle}` };
  const svar = await fetch(objektUrl(url, spandNavn, relPath), { headers });
  if (!svar.ok) throw new Error(`Download af ${spandNavn}/${relPath} fejlede: ${svar.status} ${await svar.text()}`);
  return Buffer.from(await svar.arrayBuffer());
}

/* --------------------------------------------------------------- --op */
/** Billedretningen. Kender KUN spanden "robotbilleder" og roden assets/. */
async function op(url, noegle) {
  const manifest = await hentManifest(url, noegle, SPAND);
  const lokale = findLokaleBilleder();
  let lagtOp = 0, sprungetOver = 0;
  for (const relPath of lokale) {
    const fuld = path.join(ROD, 'assets', ...relPath.split('/'));
    const sum = sha256Fil(fuld);
    if (manifest[relPath] === sum) { sprungetOver++; continue; }
    await uploadObjekt(url, noegle, SPAND, relPath, fs.readFileSync(fuld));
    manifest[relPath] = sum;
    lagtOp++;
  }
  if (lagtOp > 0) await gemManifest(url, noegle, SPAND, manifest);
  console.log(`${lagtOp} lagt op, ${sprungetOver} sprunget over (uaendret)`);
}

/* -------------------------------------------------------------- --ned */
/** Billedretningen. Kender KUN spanden "robotbilleder" og roden assets/ —
 *  se --proev-adskillelse for det mekaniske bevis paa, at den forbliver saadan. */
async function ned(url, noegle) {
  const manifest = await hentManifest(url, noegle, SPAND);
  const stier = Object.keys(manifest).sort();
  let hentetNed = 0, sprungetOver = 0;
  for (const relPath of stier) {
    const fuld = path.join(ROD, 'assets', ...relPath.split('/'));
    const findes = fs.existsSync(fuld);
    if (findes && sha256Fil(fuld) === manifest[relPath]) { sprungetOver++; continue; }
    const data = await downloadObjekt(url, noegle, SPAND, relPath);
    fs.mkdirSync(path.dirname(fuld), { recursive: true });
    fs.writeFileSync(fuld, data);
    hentetNed++;
  }
  console.log(`${hentetNed} hentet ned, ${sprungetOver} sprunget over (uaendret)`);
}

/* ---------------------------------------------------------- --arkiv-op */
/** Arkivretningen. Kender KUN spanden "arkiv" og roden media/. Laeser fra
 *  media/_kilder/ og media/robotbilleder/ — ALDRIG media/_arbejde/,
 *  media/inspiration/ eller media/raa/ (se ARKIV_MAPPER). RØRER ALDRIG ved
 *  media/ ud over at LAeSE — ingen rename/slet/flyt her. */
async function arkivOp(url, noegle) {
  const manifest = await hentManifest(url, noegle, SPAND_ARKIV);
  const lokale = findLokaleArkivFiler();
  let lagtOp = 0, sprungetOver = 0;
  for (const relPath of lokale) {
    const fuld = path.join(ROD, 'media', ...relPath.split('/'));
    const sum = sha256Fil(fuld);
    if (manifest[relPath] === sum) { sprungetOver++; continue; }
    await uploadObjekt(url, noegle, SPAND_ARKIV, relPath, fs.readFileSync(fuld));
    manifest[relPath] = sum;
    lagtOp++;
  }
  if (lagtOp > 0) await gemManifest(url, noegle, SPAND_ARKIV, manifest);
  console.log(`${lagtOp} lagt op, ${sprungetOver} sprunget over (uaendret)`);
}

/* --------------------------------------------------------- --arkiv-ned */
/** Arkivretningen. Kender KUN spanden "arkiv". Skriver til udMappe, som
 *  DEFAULT er media/ (samme placering som originalerne, saa en gendannelse
 *  lander praecis dér) — men kan pege paa en midlertidig mappe via --ud=,
 *  netop saa en efterproevning ALDRIG behoever at skrive oven i originalerne.
 *  Se --proev-adskillelse for det mekaniske bevis paa, at der aldrig skrives
 *  uden for udMappe. */
async function arkivNed(url, noegle, udMappe) {
  const manifest = await hentManifest(url, noegle, SPAND_ARKIV);
  const stier = Object.keys(manifest).sort();
  let hentetNed = 0, sprungetOver = 0;
  for (const relPath of stier) {
    const fuld = path.join(udMappe, ...relPath.split('/'));
    const findes = fs.existsSync(fuld);
    if (findes && sha256Fil(fuld) === manifest[relPath]) { sprungetOver++; continue; }
    const data = await downloadObjekt(url, noegle, SPAND_ARKIV, relPath);
    fs.mkdirSync(path.dirname(fuld), { recursive: true });
    fs.writeFileSync(fuld, data);
    hentetNed++;
  }
  console.log(`${hentetNed} hentet ned, ${sprungetOver} sprunget over (uaendret)`);
}

/* ------------------------------------------------------------- --tjek */

async function tjek(url, noegle, spandNavn, bucketInfo) {
  console.log(`  GET /storage/v1/bucket/${spandNavn} svar: ${JSON.stringify(bucketInfo)}`);
  console.log(`spand: ${spandNavn}, public=${bucketInfo.public}`);

  // Vaelger ét objekt at proeve at laese UDEN noegle. Bruger manifestet, hvis
  // det findes (et rigtigt objekt); ellers manifestfilen selv — begge er
  // objekter i spanden, saa testen er gyldig i begge tilfaelde.
  const manifest = await hentManifest(url, noegle, spandNavn);
  const stier = Object.keys(manifest);
  const testSti = stier.length ? stier[0] : MANIFEST_STI;
  console.log(`  proever at laese "${testSti}" uden nogen apikey- eller Authorization-header ...`);

  const svarUdenNoegle = await fetch(objektUrl(url, spandNavn, testSti)); // helt uden headers
  if (svarUdenNoegle.status === 200) {
    console.log(`uden noegle: HTTP 200 — LAESBAR. **SPANDEN ER OFFENTLIG — DET ER EN FEJL. STOP.**`);
  } else {
    console.log(`uden noegle: HTTP ${svarUdenNoegle.status} — ikke laesbar`);
  }
  return svarUdenNoegle.status;
}

/* ------------------------------------------------------ --proev-adskillelse */

/**
 * PUNKT 3 — beviser MEKANISK, ikke ved paastand, at:
 *   (1) ned() (billedretningen) ALDRIG sender en Storage-forespoergsel mod
 *       spanden "arkiv", og
 *   (2) arkivNed() (arkivretningen) ALDRIG skriver en fil uden for udMappe
 *       (den overgivne mappe, normalt media/).
 *
 * Metoden: global.fetch og fs.writeFileSync/mkdirSync/existsSync mockes ud,
 * SAA de rigtige funktioner ned() og arkivNed() koeres for RIGTIGT (samme
 * kode, samme kaldsvej som --ned/--arkiv-ned), men uden at noget rigtigt
 * netvaerkskald eller filskriv sker. Alle URL'er og filstier, koden reelt
 * beder om, bliver optaget. Det er en koerende maaling af den faktiske
 * kodesti, ikke en tekstsoegning i kildekoden efter forbudte ord — en saadan
 * tekstsoegning kunne narres af fx en variabel omdoebt til noget andet, mens
 * denne test IKKE kan narres uden at aendre selve adfaerden.
 *
 * Bruger en paafundet noegle ("fiktiv-noegle-mock") — den forlader aldrig
 * denne proces, for global.fetch er mocket ud foer noget kald sker.
 */
async function proevAdskillelse(url) {
  console.log('PROEVER ADSKILLELSEN — koerer ned() og arkivNed() med fetch og fs mocket ud, ingen rigtige kald sker.');

  const nedUrls = [], arkivUrls = [];
  const nedSkrevet = [], arkivSkrevet = [];
  let urlMaal = nedUrls, skrivMaal = nedSkrevet;

  const oprindeligFetch = global.fetch;
  const oprindeligSkriv = fs.writeFileSync;
  const oprindeligMkdir = fs.mkdirSync;
  const oprindeligExists = fs.existsSync;

  global.fetch = async (maalUrl) => {
    const s = String(maalUrl);
    urlMaal.push(s);
    if (s.includes(MANIFEST_STI)) {
      // Paafundet manifest med ÉT objekt, saa loekken rent faktisk proever at
      // hente og skrive noget — en tom loekke ville ikke bevise punkt (2).
      return { ok: true, status: 200, json: async () => ({ 'proeve-fil.txt': 'fiktiv-sha' }) };
    }
    return { ok: true, status: 200, arrayBuffer: async () => new TextEncoder().encode('fiktivt-proeve-indhold').buffer };
  };
  fs.writeFileSync = (sti) => { skrivMaal.push(String(sti)); };
  fs.mkdirSync = () => {};
  fs.existsSync = () => false; // tving download-grenen til rent faktisk at koere

  let fejl = null;
  try {
    await ned(url, 'fiktiv-noegle-mock');
    urlMaal = arkivUrls; skrivMaal = arkivSkrevet;
    await arkivNed(url, 'fiktiv-noegle-mock', path.join(ROD, 'media'));
  } catch (e) {
    fejl = e;
  } finally {
    global.fetch = oprindeligFetch;
    fs.writeFileSync = oprindeligSkriv;
    fs.mkdirSync = oprindeligMkdir;
    fs.existsSync = oprindeligExists;
  }
  if (fejl) throw fejl;

  const assetsRod = path.join(ROD, 'assets');
  const mediaRod = path.join(ROD, 'media');

  const nedRammerArkiv = nedUrls.some((u) => u.includes(`/object/${SPAND_ARKIV}/`));
  const nedSkriverKorrekt = nedSkrevet.length > 0 && nedSkrevet.every((p) => p.startsWith(assetsRod));
  const arkivRammerBilleder = arkivUrls.some((u) => u.includes(`/object/${SPAND}/`));
  const arkivSkriverKorrekt = arkivSkrevet.length > 0 && arkivSkrevet.every((p) => p.startsWith(mediaRod));

  console.log(`  ned() kaldte: ${JSON.stringify(nedUrls)}`);
  console.log(`  ned() skrev: ${JSON.stringify(nedSkrevet)}`);
  console.log(`ned() rammer "${SPAND_ARKIV}"-spanden: ${nedRammerArkiv ? 'JA — FEJL' : 'nej'}`);
  console.log(`ned() skriver kun under assets/: ${nedSkriverKorrekt ? 'ja' : 'NEJ — FEJL'}`);
  console.log(`  arkiv-ned() kaldte: ${JSON.stringify(arkivUrls)}`);
  console.log(`  arkiv-ned() skrev: ${JSON.stringify(arkivSkrevet)}`);
  console.log(`arkiv-ned() rammer "${SPAND}"-spanden: ${arkivRammerBilleder ? 'JA — FEJL' : 'nej'}`);
  console.log(`arkiv-ned() skriver kun under media/: ${arkivSkriverKorrekt ? 'ja' : 'NEJ — FEJL'}`);

  const ok = !nedRammerArkiv && nedSkriverKorrekt && !arkivRammerBilleder && arkivSkriverKorrekt;
  console.log(ok ? 'ADSKILLELSEN HOLDER (maalt ved rigtig koersel, ikke antaget).' : 'ADSKILLELSEN ER BRUDT — SE OVENFOR.');
  if (!ok) process.exitCode = 1;
  return { ok, nedUrls, arkivUrls, nedSkrevet, arkivSkrevet };
}

/* --------------------------------------------------------------- main */

async function main(argv) {
  const { url, noegle } = laesTilslutning();

  const udArg = argv.find((a) => a.startsWith('--ud='));
  const udMappe = udArg ? path.resolve(udArg.slice('--ud='.length)) : path.join(ROD, 'media');

  if (argv.includes('--op')) { await sikrSpand(url, noegle, SPAND); return op(url, noegle); }
  if (argv.includes('--ned')) { await sikrSpand(url, noegle, SPAND); return ned(url, noegle); }
  if (argv.includes('--arkiv-op')) { await sikrSpand(url, noegle, SPAND_ARKIV); return arkivOp(url, noegle); }
  if (argv.includes('--arkiv-ned')) { await sikrSpand(url, noegle, SPAND_ARKIV); return arkivNed(url, noegle, udMappe); }
  if (argv.includes('--proev-adskillelse')) { return proevAdskillelse(url); }
  if (argv.includes('--tjek')) {
    const infoBilleder = await sikrSpand(url, noegle, SPAND);
    await tjek(url, noegle, SPAND, infoBilleder);
    const infoArkiv = await sikrSpand(url, noegle, SPAND_ARKIV);
    await tjek(url, noegle, SPAND_ARKIV, infoArkiv);
    return;
  }

  console.error('Brug: node db/billeder.mjs --op | --ned | --arkiv-op | --arkiv-ned [--ud=<mappe>] | --tjek | --proev-adskillelse');
  process.exit(1);
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('billeder.mjs');
if (erHoved) {
  main(process.argv.slice(2)).catch((e) => {
    console.error(String(e && e.stack ? e.stack : e));
    process.exit(1);
  });
}

export {
  sha256Fil, findLokaleBilleder, findLokaleArkivFiler, sikrSpand, hentManifest,
  ned, arkivNed, proevAdskillelse, SPAND, SPAND_ARKIV,
};
