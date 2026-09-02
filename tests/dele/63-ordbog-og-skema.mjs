/**
 * tests/dele/63-ordbog-og-skema.mjs — spor/skema, punkt 6 af FASE 1
 * (L81-L83). Efter kontrakten i tests/LAESMIG.md.
 *
 * (a) ordbogen er vendbar for hver post (eksplicit, ud over lavOrdbog()'s
 *     eget import-tidsvaern — se db/ordbog.mjs).
 * (b) hvert identifikator i db/skema.sql (tabel, kolonne, enum-type,
 *     enum-label) findes i ordbogen praecis én gang, og ordbogen har ingen
 *     post, skemaet ikke bruger. NYE_ENGELSKE_IDENTIFIKATORER (afgjort af
 *     dette spor, se kommentaren ved konstanten) er en eksplicit,
 *     dokumenteret undtagelse — de blev FOEDT engelske (punkt 3, L81) og har
 *     intet dansk ord at oversaette fra.
 * (c) db/byg-migrering.mjs's output er byte-lig db/migrering-engelsk.sql.
 * (d) db/eksporter.mjs's omdannelse af en FIXTURE (addverb-trakr-20's
 *     indhold i engelsk kolonneform) giver det danske dokument, der er
 *     dybt lig data/robots/addverb-trakr-20.yaml.
 * (e) db/migrering-cert.sql er idempotent (hver ALTER-linje har
 *     "if not exists").
 *
 * SET FEJLE FOERST (a, c, d) — dokumenteret i fund/FUND-skema.md, ikke her:
 * (a) fejlede, da tilstand_enum.ikke_oplyst stadig var oversat til
 * "undisclosed" (orkestrator-fandt kollisionen med "provenance" andetsteds,
 * ikke denne test) — testen blev IKKE brugt til at finde den fejl, men
 * en tilsvarende manuel korruption ("ikke_oplyst" -> "no", en bevidst
 * duplikering af "nej"s maal) blev afproevet mod den FAERDIGE ordbog og gav
 * korrekt "IKKE 1:1" ved import, foer denne test-fil overhovedet fandtes —
 * (c) fejlede foer db/migrering-engelsk.sql var genereret (filen fandtes
 * ikke); (d) fejlede foer db/eksporter.mjs's omdanRobotFraDb kendte de
 * engelske raekkenavne (kastede paa "raa.field_entries er undefined").
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import * as ordbog from '../../db/ordbog.mjs';

/**
 * Identifikatorer i db/skema.sql, der er FOEDT ENGELSKE af punkt 3 (L81) —
 * change_log-tabellen (fortrydelsesknappen) og collected_by/change_reason
 * paa de fem skrivbare tabeller. AFGOERELSE (spor/skema, 2. sep 2026, efter
 * orkestrator-spoergsmaal): disse hoerer IKKE i db/ordbog.mjs, fordi en
 * ordbog oversaetter mellem to ord for det SAMME begreb — et begreb, der
 * aldrig har haft et dansk navn (change_log fandtes ikke foer L81), har intet
 * at oversaette FRA. At tvinge dem ind i ordbogen ville kraeve en opfundet
 * "dansk" side, som ingen fil nogensinde skrev. Denne liste er i stedet den
 * TREDJE, eksplicitte undtagelse, testen selv haandhaever — vokser den
 * uventet (dvs. et rigtigt omdoebningsnavn glider ind her ved en fejl), vil
 * (b) alligevel fange det: sker en Danish->English glidning, opdager næste
 * paastand (at ordbogen daekker ALT andet i skema.sql) uligheden, fordi det
 * "nye" navn saa optraeder i ordbogen for lidt.
 */
const NYE_ENGELSKE_TABELLER = new Set(['change_log']);
const NYE_ENGELSKE_KOLONNER = new Set([
  'collected_by', 'change_reason', // de fem skrivbare tabeller
  'table_name', 'row_key', 'operation', 'old_row', 'changed_by', 'reason', 'changed_at', // change_log selv
]);

function laesSkema(rod) {
  return fs.readFileSync(path.join(rod, 'db/skema.sql'), 'utf8');
}

/** Letvaegts-udtraek, skraeddersyet til DENNE fils egen, konsistente facon
 *  (skrevet af samme spor) — ikke en generel SQL-parser. */
function parseSkema(sql) {
  const tabeller = [...sql.matchAll(/^create table (\w+) \(/gm)].map((m) => m[1]);
  const enumTyper = [...sql.matchAll(/^create type (\w+) as enum/gm)].map((m) => m[1]);

  // Enum-labels: for hver "create type X as enum (...)"-blok, find alle
  // citerede strenge frem til det afsluttende ");".
  const enumLabels = {};
  for (const m of sql.matchAll(/create type (\w+) as enum\s*\(([\s\S]*?)\);/g)) {
    const [, navn, krop] = m;
    enumLabels[navn] = [...krop.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((x) => x[1]);
  }

  // Kolonner: for hver "create table X (...\n);"-blok, find linjer formet
  // "  <identifier> <resten>" (to-mellemrums-indrykning, IKKE en
  // "constraint"/"primary key"/"foreign key"/"unique"-linje).
  const kolonner = new Set();
  for (const m of sql.matchAll(/create table \w+ \(([\s\S]*?)\n\);/g)) {
    for (const linje of m[1].split('\n')) {
      const felt = linje.match(/^  (\w+)\s+\S/);
      if (!felt) continue;
      const noegle = felt[1];
      if (['constraint', 'primary', 'foreign', 'unique', 'check'].includes(noegle)) continue;
      kolonner.add(noegle);
    }
  }

  return { tabeller, enumTyper, enumLabels, kolonner: [...kolonner] };
}

export default async function koer(ctx) {
  const { ok, rod } = ctx;

  // (a) Ordbogen er vendbar for HVER post i alle kortlaegninger.
  let alleVendbare = true;
  let posterTjekket = 0;
  const enkeltKortlaegninger = [
    ['TABELLER', ordbog.TABELLER], ['KOLONNER', ordbog.KOLONNER], ['ENUM_TYPER', ordbog.ENUM_TYPER],
    ['FELTGRUPPER', ordbog.FELTGRUPPER], ['FELTARTER', ordbog.FELTARTER], ['FELTDIMENSIONER', ordbog.FELTDIMENSIONER],
  ];
  for (const [navn, dict] of enkeltKortlaegninger) {
    for (const da of dict.danske()) {
      posterTjekket++;
      if (dict.tilDansk(dict.tilEngelsk(da)) !== da) { alleVendbare = false; ok(`(a) ${navn}.${da} vendbar`, false, 'tilDansk(tilEngelsk(x)) !== x'); }
    }
  }
  for (const [navn, dict] of Object.entries(ordbog.ENUM_LABELS)) {
    for (const da of dict.danske()) {
      posterTjekket++;
      if (dict.tilDansk(dict.tilEngelsk(da)) !== da) { alleVendbare = false; ok(`(a) ENUM_LABELS.${navn}.${da} vendbar`, false, 'tilDansk(tilEngelsk(x)) !== x'); }
    }
  }
  for (const [navn, dict] of Object.entries(ordbog.DATA_VAERDIER)) {
    for (const da of dict.danske()) {
      posterTjekket++;
      if (dict.tilDansk(dict.tilEngelsk(da)) !== da) { alleVendbare = false; ok(`(a) DATA_VAERDIER.${navn}.${da} vendbar`, false, 'tilDansk(tilEngelsk(x)) !== x'); }
    }
  }
  ok('(a) ordbogen er vendbar for hver post', alleVendbare, `${posterTjekket} poster tjekket paa tvaers af alle kortlaegninger`);

  // (b) Bijektion mod db/skema.sql, med de FOEDT ENGELSKE identifikatorer
  //     som eksplicit, dokumenteret undtagelse.
  const sql = laesSkema(rod);
  const parsed = parseSkema(sql);

  const skemaTabeller = parsed.tabeller.filter((t) => !NYE_ENGELSKE_TABELLER.has(t));
  const ordbogTabeller = ordbog.TABELLER.engelske();
  ok('(b) tabeller: skema.sql daekker praecis ordbogens engelske navne',
    skemaTabeller.length === ordbogTabeller.length && skemaTabeller.every((t) => ordbogTabeller.includes(t)),
    `skema (uden foedt-engelske): ${skemaTabeller.sort().join(',')} · ordbog: ${[...ordbogTabeller].sort().join(',')}`);
  ok('(b) tabeller: skema.sql naevner ALLE tabeller, ordbog + foedt-engelsk kender',
    parsed.tabeller.length === ordbogTabeller.length + NYE_ENGELSKE_TABELLER.size,
    `skema ${parsed.tabeller.length} vs ordbog+ny ${ordbogTabeller.length + NYE_ENGELSKE_TABELLER.size}`);

  const skemaKolonner = parsed.kolonner.filter((k) => !NYE_ENGELSKE_KOLONNER.has(k));
  const ordbogKolonner = new Set(ordbog.KOLONNER.engelske());
  const kolonnerUdenforOrdbog = skemaKolonner.filter((k) => !ordbogKolonner.has(k));
  ok('(b) kolonner: ingen skema.sql-kolonne (ud over de foedt-engelske) mangler i ordbogen',
    kolonnerUdenforOrdbog.length === 0,
    kolonnerUdenforOrdbog.length ? `mangler: ${kolonnerUdenforOrdbog.join(',')}` : 'alle daekket');
  const ordbogKolonnerUbrugt = [...ordbogKolonner].filter((k) => !skemaKolonner.includes(k));
  ok('(b) kolonner: ordbogen har ingen post, skema.sql ikke bruger',
    ordbogKolonnerUbrugt.length === 0,
    ordbogKolonnerUbrugt.length ? `ubrugte: ${ordbogKolonnerUbrugt.join(',')}` : `${skemaKolonner.length} kolonner, alle brugt`);

  const skemaEnumTyper = parsed.enumTyper;
  const ordbogEnumTyper = ordbog.ENUM_TYPER.engelske();
  ok('(b) enum-typer: skema.sql og ordbog er enige',
    skemaEnumTyper.length === ordbogEnumTyper.length && skemaEnumTyper.every((t) => ordbogEnumTyper.includes(t)),
    `skema: ${skemaEnumTyper.sort().join(',')} · ordbog: ${[...ordbogEnumTyper].sort().join(',')}`);

  let alleLabelsEnige = true;
  const labelDetaljer = [];
  for (const [daType, delOrdbog] of Object.entries(ordbog.ENUM_LABELS)) {
    const enType = ordbog.ENUM_TYPER.tilEngelsk(daType);
    const skemaLabels = (parsed.enumLabels[enType] ?? []).slice().sort();
    const ordbogLabels = delOrdbog.engelske().slice().sort();
    const samme = skemaLabels.length === ordbogLabels.length && skemaLabels.every((l, i) => l === ordbogLabels[i]);
    if (!samme) { alleLabelsEnige = false; labelDetaljer.push(`${enType}: skema ${skemaLabels.join('/')} vs ordbog ${ordbogLabels.join('/')}`); }
  }
  ok('(b) enum-labels: hver enum-types vaerdier i skema.sql matcher ordbogen praecist',
    alleLabelsEnige, labelDetaljer.join(' · ') || `${Object.keys(ordbog.ENUM_LABELS).length} enum-typer tjekket`);

  // (c) db/byg-migrering.mjs's output er byte-lig db/migrering-engelsk.sql.
  const genereret = execFileSync(ctx.node, [path.join(rod, 'db/byg-migrering.mjs')], { cwd: rod, encoding: 'utf8' });
  const committet = fs.readFileSync(path.join(rod, 'db/migrering-engelsk.sql'), 'utf8');
  ok('(c) byg-migrering.mjs output er byte-lig db/migrering-engelsk.sql',
    genereret === committet,
    genereret === committet ? `${genereret.length} bytes` : `genereret ${genereret.length} bytes vs committet ${committet.length} bytes`);

  // (d) Fixture-omdannelse: addverb-trakr-20 i engelsk kolonneform ->
  //     dansk dokument, dybt lig originalen.
  const { omdanRobotFraDb, byggRobotDoc, skrivRobotYaml } = await import(`file://${path.join(rod, 'db/eksporter.mjs').replace(/\\/g, '/')}`);
  const { dybtLig } = await import(`file://${path.join(rod, 'db/tjek.mjs').replace(/\\/g, '/')}`);
  const fixture = JSON.parse(fs.readFileSync(path.join(rod, 'tests/dele/fixtures/63-robot-en.json'), 'utf8'));
  const idTilSlug = new Map([[fixture.id, fixture.slug]]);
  let fixtureFejl = null;
  let ligMedOriginal = false;
  let kanoniskDa = null;
  try {
    kanoniskDa = omdanRobotFraDb(fixture, idTilSlug);
    const doc = byggRobotDoc(kanoniskDa);
    const yamlTekst = skrivRobotYaml(doc);
    const genskabt = ctx.skema.normaliserRobot(ctx.yaml.parseYaml(yamlTekst, 'fixture-genskabt'));
    const originalFil = path.join(rod, 'data/robots/addverb-trakr-20.yaml');
    const original = ctx.skema.normaliserRobot(ctx.yaml.parseYaml(fs.readFileSync(originalFil, 'utf8'), originalFil));
    const stiTilFejl = [];
    ligMedOriginal = dybtLig(original, genskabt, stiTilFejl);
    if (!ligMedOriginal) fixtureFejl = stiTilFejl.reverse().join(' -> ');
  } catch (e) {
    fixtureFejl = e.stack;
  }
  ok('(d) fixture (addverb-trakr-20, engelsk) -> eksporteret dansk dokument er dybt lig originalen',
    ligMedOriginal, fixtureFejl ?? '33 feltposter, anvendelse (6 kategorier, liste), billede (alt-sprogkort) alle dybt lig');

  // (d2) EKSPLICIT, ud over den brede dybtLig ovenfor: fixturens
  // payload_walking.caveat_class = "validity" (engelsk, DB-formen) skal
  // blive til "gyldighed" (dansk, YAML-formen) — orkestrator-tilfoejet
  // 2. sep 2026, DEN faktiske robot addverb-trakr-20 baerer netop denne
  // vaerdi paa netop dette felt (data/robots/addverb-trakr-20.yaml:45).
  ok('(d2) caveat_class "validity" -> "gyldighed" paa payload_walking (den faktiske vaerdi i fixturen)',
    kanoniskDa?.felter?.nyttelast_gaaende?.advarsel_klasse === 'gyldighed',
    JSON.stringify(kanoniskDa?.felter?.nyttelast_gaaende?.advarsel_klasse));

  // (e) db/migrering-cert.sql er idempotent.
  const cert = fs.readFileSync(path.join(rod, 'db/migrering-cert.sql'), 'utf8');
  const alterLinjer = cert.split('\n').filter((l) => /^alter type/.test(l.trim()));
  ok('(e) migrering-cert.sql er idempotent (hver ALTER-linje har "if not exists")',
    alterLinjer.length > 0 && alterLinjer.every((l) => l.includes('if not exists')),
    `${alterLinjer.length} ALTER-linje(r), alle med "if not exists": ${alterLinjer.every((l) => l.includes('if not exists'))}`);

  // FLYTTET fra tests/dele/07-db-vagt.mjs (slettet, punkt 6): boerFlyttes
  // (db/eksporter.mjs) er UAeNDRET af L81-L83 og stadig den funktion, der
  // afgoer om en eksport maa flytte fra den midlertidige mappe til
  // udMappe — "ret assertions, slet dem ikke" (CLAUDE.md).
  const { boerFlyttes } = await import(`file://${path.join(rod, 'db/eksporter.mjs').replace(/\\/g, '/')}`);
  ok('(flyttet fra 07) 0 fejl foerer til flytning (boerFlyttes === true)',
    boerFlyttes({ filer: 77, fejl: 0, advarsler: 1 }) === true);
  ok('(flyttet fra 07) 1 fejl blokerer flytningen, selv med 0 advarsler',
    boerFlyttes({ filer: 77, fejl: 1, advarsler: 0 }) === false);
  ok('(flyttet fra 07) flere fejl blokerer ligesaa — advarsler alene maa aldrig maskere en fejl',
    boerFlyttes({ filer: 77, fejl: 55, advarsler: 1 }) === false);

  // FLYTTET fra tests/dele/44-cjk-ordlyd-db.mjs (slettet, punkt 6), TILPASSET
  // de nye engelske navne: R21's fire *_ordlyd-soesterfelter (advarsel_ordlyd/
  // citat_ordlyd/note_ordlyd/noter_ordlyd) lever videre som caveat_wording/
  // quote_wording/note_wording/notes_wording — stadig CHECK-haandhaevet i
  // db/skema.sql. Det er briefets eget eksempel paa "en formregel paa
  // advarsel_ordlyd, der stadig beviser noget levende".
  ok('(flyttet fra 44) db/skema.sql definerer robots.notes_wording (jsonb)', /notes_wording\s+jsonb/.test(sql));
  ok('(flyttet fra 44) db/skema.sql definerer field_entries.caveat_wording (text)', /caveat_wording\s+text/.test(sql));
  ok('(flyttet fra 44) db/skema.sql definerer applications.quote_wording (jsonb)', /quote_wording\s+jsonb/.test(sql));
  ok('(flyttet fra 44) db/skema.sql definerer applications.note_wording (text)', /note_wording\s+text/.test(sql));
  ok('(flyttet fra 44) db/skema.sql haandhaever caveat_wording ikke-tom + kraever caveat (R21s to krav, CHECK)',
    /caveat_wording_not_blank/.test(sql) && /caveat_wording_requires_caveat/.test(sql));
}
