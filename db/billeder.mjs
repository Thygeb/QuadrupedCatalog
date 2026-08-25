#!/usr/bin/env node
/**
 * db/billeder.mjs — assets/fotos/  <->  Supabase Storage-spanden "robotbilleder" (L34)
 *
 * Nul afhaengigheder. Samme stil som db/migrer.mjs: fetch mod Supabase' REST-
 * /Storage-API, dansk i kommentarer og udskrifter, --flag-styring.
 *
 * BAGGRUND: robotdataene ligger allerede i Supabase (L34/L35). Billedfilerne
 * gjorde ikke — de findes kun lokalt i assets/fotos/. Dette script flytter
 * dem begge veje, saa en robotpost er hel ét sted.
 *
 * DESIGN, IKKE TIL AFVIGELSE: tools/build.mjs forbliver urørt og henter
 * ALDRIG fra nettet. Bygget laeser stadig kun assets/ (se build.mjs:435-482).
 * Dette script er den eneste kodesti, der taler med spanden.
 *
 *   node db/billeder.mjs --op     assets/fotos/  ->  spanden
 *   node db/billeder.mjs --ned    spanden        ->  assets/fotos/
 *   node db/billeder.mjs --tjek   beviser at spanden er PRIVAT (public=false)
 *
 * SPANDEN SKAL VAeRE PRIVAT. En privat spand er lagring, ikke publicering —
 * S1 (STATUS.md) forbliver intakt. En offentlig spand ville vaere publicering
 * af fabrikantmateriale uden skriftlig tilladelse.
 *
 * SPRINGES-OVER-STRATEGI: et checksum-KARTOTEK, skrevet som sin egen fil i
 * spanden ("_manifest.json", sti->sha256), IKKE et sammenlign-mod-objektets-
 * faktiske-indhold. Begrundelse: Supabase Storage's eTag er S3-stilens MD5,
 * ikke SHA-256 — den kan ikke bruges direkte til denne sammenligning uden en
 * ekstra antagelse om lagerbackend'en. Og selv hvis eTag duede, ville en
 * sammenligning mod hvert objekts faktiske indhold kraeve ÉT ekstra API-kald
 * PR. FIL for at hente metadata — manifestet er ÉT lille JSON-kald for hele
 * spanden, uanset om der er 54 eller 540 filer. Prisen: manifestet kan i
 * teorien komme ud af trit med spandens virkelige indhold, hvis nogen
 * redigerer spanden uden om dette script. Det er accepteret, fordi dette
 * script er den ENESTE kodesti, der taler med spanden (ligesom migrer.mjs
 * er den eneste, der skriver til robotter-tabellerne).
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { BILLEDE_ENDELSER } = await import(`file://${path.join(ROD, 'tools/skema.mjs')}`);

const SPAND = 'robotbilleder';
const MANIFEST_STI = '_manifest.json';
const LOKAL_UNDERMAPPE = 'fotos'; // assets/fotos — den eneste undermappe, dette script synker

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

function contentType(relPath) {
  const ext = path.extname(relPath).toLowerCase();
  return {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml',
  }[ext] ?? 'application/octet-stream';
}

function objektUrl(url, relPath) {
  const kodet = relPath.split('/').map(encodeURIComponent).join('/');
  return `${url}/storage/v1/object/${SPAND}/${kodet}`;
}

/* -------------------------------------------------------- Storage-API */

/** PUNKT 1 — opretter spanden idempotent. Findes den allerede (200 paa
 *  GET), goeres intet. Findes den ikke (404), oprettes den med public:false.
 *  Kaldes forrest i main() for alle tre flag, saa spanden altid findes,
 *  foer noget andet forsoeger at laese/skrive den. */
async function sikrSpand(url, noegle) {
  const headers = { apikey: noegle, Authorization: `Bearer ${noegle}` };

  /* STORAGE-FAELDE (fundet ved afproevning 25. aug 2026, ikke antaget):
     GET paa en IKKE-EKSISTERENDE spand svarer IKKE med HTTP 404. Den svarer
     med HTTP 400 og en JSON-krop, hvor det er KROPPENS statusCode-felt, der
     siger "404" ({"statusCode":"404","error":"Bucket not found",
     "code":"NoSuchBucket"}) — samme moenster som PostgREST-overraskelserne i
     db/LAESMIG.md (HTTP-status og fejlkode lever i to forskellige lag). Et
     tjek paa svar.status === 404 fanger den ALDRIG; kroppen skal laeses. */
  async function hentSpandInfo() {
    const svar = await fetch(`${url}/storage/v1/bucket/${SPAND}`, { headers });
    if (svar.ok) return { fundet: true, info: await svar.json() };
    const krop = await svar.text();
    let json = null;
    try { json = JSON.parse(krop); } catch { /* ikke JSON — behandles som anden fejl nedenfor */ }
    const erIkkeFundet = svar.status === 404 || json?.statusCode === '404' || json?.code === 'NoSuchBucket';
    if (erIkkeFundet) return { fundet: false };
    throw new Error(`GET /storage/v1/bucket/${SPAND} fejlede: ${svar.status} ${krop}`);
  }

  let { fundet, info } = await hentSpandInfo();
  if (!fundet) {
    console.log(`  spanden "${SPAND}" findes ikke endnu — opretter den som PRIVAT (public:false) ...`);
    const opretSvar = await fetch(`${url}/storage/v1/bucket`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: SPAND, name: SPAND, public: false }),
    });
    if (!opretSvar.ok) {
      throw new Error(`Kunne ikke oprette spanden "${SPAND}": ${opretSvar.status} ${await opretSvar.text()}`);
    }
    ({ fundet, info } = await hentSpandInfo());
    if (!fundet) throw new Error(`Spanden "${SPAND}" blev oprettet, men kan ikke findes igen paa GET.`);
  }
  return info;
}

async function hentManifest(url, noegle) {
  const headers = { apikey: noegle, Authorization: `Bearer ${noegle}` };
  const svar = await fetch(objektUrl(url, MANIFEST_STI), { headers });
  if (svar.status === 404 || svar.status === 400) return {}; // 400: "Object not found" paa nogle versioner
  if (!svar.ok) throw new Error(`Kunne ikke hente manifestet: ${svar.status} ${await svar.text()}`);
  return svar.json();
}

async function gemManifest(url, noegle, manifest) {
  const headers = { apikey: noegle, Authorization: `Bearer ${noegle}`, 'Content-Type': 'application/json', 'x-upsert': 'true' };
  const svar = await fetch(objektUrl(url, MANIFEST_STI), { method: 'POST', headers, body: JSON.stringify(manifest, null, 2) });
  if (!svar.ok) throw new Error(`Kunne ikke gemme manifestet: ${svar.status} ${await svar.text()}`);
}

async function uploadObjekt(url, noegle, relPath, buffer) {
  const headers = {
    apikey: noegle, Authorization: `Bearer ${noegle}`,
    'Content-Type': contentType(relPath), 'x-upsert': 'true',
  };
  const svar = await fetch(objektUrl(url, relPath), { method: 'POST', headers, body: buffer });
  if (!svar.ok) throw new Error(`Upload af ${relPath} fejlede: ${svar.status} ${await svar.text()}`);
}

async function downloadObjekt(url, noegle, relPath) {
  const headers = { apikey: noegle, Authorization: `Bearer ${noegle}` };
  const svar = await fetch(objektUrl(url, relPath), { headers });
  if (!svar.ok) throw new Error(`Download af ${relPath} fejlede: ${svar.status} ${await svar.text()}`);
  return Buffer.from(await svar.arrayBuffer());
}

/* --------------------------------------------------------------- --op */

async function op(url, noegle) {
  const manifest = await hentManifest(url, noegle);
  const lokale = findLokaleBilleder();
  let lagtOp = 0, sprungetOver = 0;
  for (const relPath of lokale) {
    const fuld = path.join(ROD, 'assets', ...relPath.split('/'));
    const sum = sha256Fil(fuld);
    if (manifest[relPath] === sum) { sprungetOver++; continue; }
    await uploadObjekt(url, noegle, relPath, fs.readFileSync(fuld));
    manifest[relPath] = sum;
    lagtOp++;
  }
  if (lagtOp > 0) await gemManifest(url, noegle, manifest);
  console.log(`${lagtOp} lagt op, ${sprungetOver} sprunget over (uaendret)`);
}

/* -------------------------------------------------------------- --ned */

async function ned(url, noegle) {
  const manifest = await hentManifest(url, noegle);
  const stier = Object.keys(manifest).sort();
  let hentetNed = 0, sprungetOver = 0;
  for (const relPath of stier) {
    const fuld = path.join(ROD, 'assets', ...relPath.split('/'));
    const findes = fs.existsSync(fuld);
    if (findes && sha256Fil(fuld) === manifest[relPath]) { sprungetOver++; continue; }
    const data = await downloadObjekt(url, noegle, relPath);
    fs.mkdirSync(path.dirname(fuld), { recursive: true });
    fs.writeFileSync(fuld, data);
    hentetNed++;
  }
  console.log(`${hentetNed} hentet ned, ${sprungetOver} sprunget over (uaendret)`);
}

/* ------------------------------------------------------------- --tjek */

async function tjek(url, noegle, bucketInfo) {
  console.log(`  GET /storage/v1/bucket/${SPAND} svar: ${JSON.stringify(bucketInfo)}`);
  console.log(`spand: ${SPAND}, public=${bucketInfo.public}`);

  // Vaelger ét objekt at proeve at laese UDEN noegle. Bruger manifestet, hvis
  // det findes (et rigtigt billede); ellers manifestfilen selv — begge er
  // objekter i spanden, saa testen er gyldig i begge tilfaelde.
  const manifest = await hentManifest(url, noegle);
  const stier = Object.keys(manifest);
  const testSti = stier.length ? stier[0] : MANIFEST_STI;

  const svarUdenNoegle = await fetch(objektUrl(url, testSti)); // helt uden headers
  if (svarUdenNoegle.status === 200) {
    console.log(`uden noegle: HTTP 200 — LAESBAR. **SPANDEN ER OFFENTLIG — DET ER EN FEJL. STOP.**`);
  } else {
    console.log(`uden noegle: HTTP ${svarUdenNoegle.status} — ikke laesbar`);
  }
  return svarUdenNoegle.status;
}

/* --------------------------------------------------------------- main */

async function main(argv) {
  const { url, noegle } = laesTilslutning();
  const bucketInfo = await sikrSpand(url, noegle); // PUNKT 1 — idempotent, koeres altid foerst

  if (argv.includes('--op')) return op(url, noegle);
  if (argv.includes('--ned')) return ned(url, noegle);
  if (argv.includes('--tjek')) { await tjek(url, noegle, bucketInfo); return; }

  console.error('Brug: node db/billeder.mjs --op | --ned | --tjek');
  process.exit(1);
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('billeder.mjs');
if (erHoved) {
  main(process.argv.slice(2)).catch((e) => {
    console.error(String(e && e.stack ? e.stack : e));
    process.exit(1);
  });
}

export { sha256Fil, findLokaleBilleder, sikrSpand, hentManifest };
