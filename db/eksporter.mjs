#!/usr/bin/env node
/**
 * db/eksporter.mjs — DB  ->  data/robots/*.yaml-lignende filer (L34, STATUS.md)
 *
 * Nul afhaengigheder.
 *
 * TO TILSTANDE:
 *
 *   node db/eksporter.mjs --ud=<mappe>     LOKAL (standard). Ingen DB findes
 *                                          endnu. Laeser db/kanonisk.json
 *                                          (skrevet af db/migrer.mjs) og
 *                                          genererer én YAML-fil pr. robot i
 *                                          <mappe> — IKKE oven i data/robots/,
 *                                          som er laesekilde for et andet spor.
 *
 *   node db/eksporter.mjs --fra-db --ud=<mappe>   FORBEREDT, IKKE KOERT.
 *                                          Henter robotterne fra et rigtigt
 *                                          Supabase-projekt via fetch mod
 *                                          PostgREST og skriver samme YAML.
 *                                          Kraever SUPABASE_URL og
 *                                          SUPABASE_SERVICE_ROLE_KEY i .env.
 *
 * FIDELITETSKONTRAKTEN: den genererede YAML skal, naar den laeses igen med
 * tools/yaml.mjs's parseYaml + tools/skema.mjs's normaliserRobot, give et
 * DYBT LIG resultat af det samme kaldt paa originalen. Det er IKKE et krav
 * om byte-identisk tekst (facon, kommentarer og noegleraekkefoelge maa gerne
 * skifte) — det er kravet, db/rundtur.mjs proever. Se den fils kommentarer
 * for hvorfor "parse" her betyder normaliserRobot(parseYaml(x)) og ikke den
 * raa parseYaml alene.
 *
 * VAGTEN (L35-opfoelgning, STATUS.md's D12/L35-raekke): eksporten skriver
 * ALDRIG direkte ind i udMappe. Den skriver foerst til en midlertidig
 * sibling-mappe, koerer tools/validate.mjs PAA DEN, og flytter kun filerne
 * ind i udMappe, hvis valideringen er fejlfri. Slaar valideringen fejl,
 * staar udMappe UBERoeRT — samme princip som db/migrer.mjs's vagt (linje
 * "VAGTEN" i den fil): en kontrol, der koerer EFTER filerne allerede er
 * skrevet, opdager problemet, den forhindrer det ikke. Kun FEJL blokerer;
 * advarsler (fx R9 paa ghost-robotics-vision-60) slipper igennem uaendret,
 * ligesom de altid har gjort i data/robots/. Se boerFlyttes() nedenfor for
 * selve beslutningen som en ren, testbar funktion.
 *
 * STRATEGI: for hver robot genopbygges et JS-objekt, der ser ud som den
 * originale YAML-fils PARSEDE (men IKKE normaliserede) form — samme
 * noeglenavne (vaerdi/min/maks/kilde/hentet/...), samme topnoegler
 * (billede/anvendelse/felter/...) — og det objekt skrives saa til YAML af en
 * generisk emitter. Fordi kanonisk.json allerede er bygget af
 * normaliserRobot(parseYaml(original)), er den forme, der skrives her,
 * ALLEREDE i kanonisk form (min/maks ikke vaerdi_min, boolean ikke "ja"),
 * saa en fornyet normalisering af den eksporterede fil er et no-op i forhold
 * til betydning.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { FELTNAVNE } = await import(`file://${path.join(ROD, 'tools/skema.mjs')}`);
// Aa12 (STATUS.md): traekValidateTal var tidligere en BEVIDST duplikeret
// regex her, fordi db/rundtur.mjs var forbudt for dette spor, mens et andet
// spor arbejdede i den (25. aug 2026) - og funktionen var dengang ikke
// eksporteret derfra. Den laas er vaek nu; funktionen importeres i stedet,
// saa udtraekket af validatorens opsummeringslinje kun findes ÉT sted
// (D7/L30-faelden: to kopier af samme ting skrider fra hinanden).
const { traekValidateTal } = await import(`file://${path.join(ROD, 'db/rundtur.mjs')}`);

/* --------------------------------------------------------- YAML-udskrift */

/** Alle streng-skalarer skrives dobbelt-citeret via JSON.stringify. Projektets
 *  egen parser (tools/yaml.mjs's laesSkalar) laeser en dobbeltciteret
 *  vaerdi ved simpelthen at kalde JSON.parse paa den — saa denne vej er
 *  bevisligt tur-retur-sikker for ALT, JSON.stringify kan producere
 *  (kolon, "#", citationstegn, unicode, ±-tegn, ...), i modsaetning til en
 *  "er det sikkert at skrive den bart"-heuristik, der skal gaette rigtigt
 *  hver gang. */
function kvaerdi(v) {
  if (typeof v === 'string') return JSON.stringify(v);
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) throw new Error(`kvaerdi: ikke-endeligt tal ${v}`);
    return String(v);
  }
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  throw new Error(`kvaerdi: uventet type ${typeof v} (${JSON.stringify(v)})`);
}

/** Skriver ét YAML-kort (objekt) som indrykkede "noegle: vaerdi"-linjer.
 *  null/undefined springes over — det er praecis det samme som at udelade
 *  noeglen, hvilket parseYaml ikke kan skelne fra. Rakkefoelgen er
 *  Object.entries' egen (indsaettelsesraekkefoelgen, som byggFeltpostDoc/
 *  byggRobotDoc styrer eksplicit nedenfor, saa output er stabilt).
 *
 *  LISTER SKRIVES SOM BLOKSEKVENS ("- vaerdi" pr. linje), IKKE SOM
 *  FLOW-LISTE ("[a, b]"). Fundet af rundturstesten selv, ikke antaget:
 *  tools/yaml.mjs's laesFlow (flow-listens egen laeser) sporer citerede
 *  strenge med en naiv "er dette tegn samme citationstegn som aabnede"-
 *  regel, UDEN at tjekke om et forudgaaende backslash goer citationstegnet
 *  escaped (fjernKommentar, den anden strengsporing i samme fil, HAR den
 *  kontrol — laesFlow mangler den). En flow-liste med lange citater, der selv
 *  indeholder \"-escapede citater (fx robotdata-noter, der citerer en
 *  producent), bliver derfor splittet forkert midt i strengen. Bloksekvensens
 *  vej gennem parseren er laesSkalar paa HELE linjen efter "- ", som bruger
 *  JSON.parse direkte og haandterer \" korrekt. Fundet paa 12 filer i
 *  db/rundtur.mjs's foerste koersel (25. aug 2026) — noter-listen delte sig i
 *  op til 3x for mange elementer. */
function emitKort(obj, indent, linjer) {
  const pad = ' '.repeat(indent);
  for (const [noegle, vaerdi] of Object.entries(obj)) {
    if (vaerdi === null || vaerdi === undefined) continue;
    if (Array.isArray(vaerdi)) {
      if (!vaerdi.length) continue; // en tom liste er ikke gyldig i skemaet (R4/R16/R18) — skriv slet ikke noeglen
      linjer.push(`${pad}${noegle}:`);
      for (const el of vaerdi) linjer.push(`${pad}  - ${kvaerdi(el)}`);
    } else if (typeof vaerdi === 'object') {
      const under = [];
      emitKort(vaerdi, indent + 2, under);
      if (!under.length) continue; // et tomt underkort er ikke meningsfuldt — udelad
      linjer.push(`${pad}${noegle}:`);
      linjer.push(...under);
    } else {
      linjer.push(`${pad}${noegle}: ${kvaerdi(vaerdi)}`);
    }
  }
}

/* -------------------------------------------------- genopbygning: felter */

/** Genopbygger ÉN feltposts YAML-repraesentation af dens kanoniske form
 *  (se db/migrer.mjs's klassificerFeltpost for det modsatte). */
function byggFeltpostVaerdi(f) {
  if (f.form === 'bare_tilstand') return f.tilstand; // en ren streng, ikke et kort

  const kort = {};
  if (f.form === 'tilstand_med_herkomst') {
    kort.vaerdi = f.tilstand;
  } else if (f.form === 'tal') {
    kort.vaerdi = f.vaerdi_tal;
  } else if (f.form === 'interval') {
    kort.min = f.min; kort.maks = f.maks;
  } else if (f.form === 'tekst') {
    kort.vaerdi = f.vaerdi_tekst;
  } else if (f.form === 'bool') {
    kort.vaerdi = f.vaerdi_bool;
  } else if (f.form === 'liste') {
    kort.vaerdi = f.vaerdi_liste;
  } else {
    throw new Error(`byggFeltpostVaerdi: ukendt form ${f.form}`);
  }

  // SIDESPOR (1 forekomst i data, se db/migrer.mjs's kommentar ved samme
  // navn): et maaleligt interval kan staa ved siden af en tekst/bool/liste-
  // vaerdi — Boston Dynamics' Spot skriver stroem_ud som TEKST og har
  // samtidig min/maks for spaendingen. 'interval'-formen selv har allerede
  // sat kort.min/kort.maks ovenfor og rammer aldrig denne gren.
  if (f.form !== 'interval' && f.min !== undefined && f.min !== null) {
    kort.min = f.min; kort.maks = f.maks;
  }

  if (f.form === 'tal' || f.form === 'interval' || f.form === 'tekst' || f.form === 'bool' || f.form === 'liste') {
    kort.enhed = f.enhed ?? undefined;
    kort.enhed_imperial = f.enhed_imperial ?? undefined;
    kort.vaerdi_imperial = f.vaerdi_imperial ?? undefined;
    kort.operator = f.operator ?? undefined;
    kort.note = f.note ?? undefined;
    kort.raa = f.raa ?? undefined;
    kort.valuta = f.valuta ?? undefined;
  }
  if (f.form === 'tilstand_med_herkomst' || f.form === 'tal' || f.form === 'interval'
    || f.form === 'tekst' || f.form === 'bool' || f.form === 'liste') {
    kort.kilde = f.kilde ?? undefined;
    kort.hentet = f.hentet ?? undefined;
    kort.kildetype = f.kildetype ?? undefined;
    kort.advarsel = f.advarsel ?? undefined;
  }
  if (f.ved_last) {
    // Tre virkelige former, alle fundet i data/robots/ (25. aug 2026, ikke
    // antaget): en BAR tilstand ("ikke_oplyst", 40 forekomster), et
    // masse-kort med tal+enhed (11 forekomster), og — Yobotics Y20 alene —
    // et kort med TILSTAND OG enhed: { vaerdi: ikke_oplyst, enhed: kg },
    // fordi producenten oplyser AT tallet gaelder med last, men ikke hvor
    // meget (D10/R10's egen begrundelse i STATUS.md). Den tredje form ville
    // miste sin enhed, hvis tilstand alene afgjorde om ved_last skrives bart.
    if (f.ved_last.tilstand && f.ved_last.enhed) {
      kort.ved_last = { vaerdi: f.ved_last.tilstand, enhed: f.ved_last.enhed };
    } else if (f.ved_last.tilstand) {
      kort.ved_last = f.ved_last.tilstand;
    } else {
      kort.ved_last = { vaerdi: f.ved_last.vaerdi, enhed: f.ved_last.enhed ?? undefined };
    }
  }
  if (f.varianter) kort.varianter = f.varianter;

  // Fjern undefined-noegler (emitKort springer null/undefined over, men et
  // objekt med kun undefined-vaerdier skal genkendes som "intet at skrive"
  // af Object.entries — undefined-noegler bliver alligevel filtreret der).
  return kort;
}

/* --------------------------------------------------------- genopbygning: robot */

function byggRobotDoc(r) {
  const doc = {
    slug: r.slug, navn: r.navn, producent: r.producent, producentland: r.producentland,
    producentby: r.producentby ?? undefined, status: r.status,
    foerste_udgivelse: r.foerste_udgivelse ?? undefined,
    forgaenger: r.forgaenger ?? undefined,
    varianter: r.varianter ?? undefined,
    noter: r.noter ?? undefined,
  };

  if (r.anvendelse) {
    const a = r.anvendelse;
    if (a.er_bar_streng) {
      doc.anvendelse = 'ikke_oplyst';
    } else {
      const kort = { vaerdi: a.er_ikke_oplyst ? 'ikke_oplyst' : a.vaerdi };
      if (!a.er_ikke_oplyst) kort.citat = a.citat;
      kort.kilde = a.kilde ?? undefined;
      kort.hentet = a.hentet ?? undefined;
      kort.kildetype = a.kildetype ?? undefined;
      kort.arvet_fra = a.arvet_fra ?? undefined;
      kort.note = a.note ?? undefined;
      doc.anvendelse = kort;
    }
  }

  if (r.billede) {
    const b = r.billede;
    doc.billede = {
      fil: b.fil, ophav: b.ophav, kilde: b.kilde ?? undefined, hentet: b.hentet ?? undefined,
      alt: b.alt ?? undefined, note: b.note ?? undefined, delt_med: b.delt_med ?? undefined,
      plade: b.plade ?? undefined, pos: b.pos ?? undefined,
    };
  }

  doc.felter = {};
  for (const feltnavn of FELTNAVNE) {
    doc.felter[feltnavn] = byggFeltpostVaerdi(r.felter[feltnavn]);
  }

  return doc;
}

function skrivRobotYaml(doc) {
  const linjer = [];
  // Topnoeglerne i en stabil, laesbar raekkefoelge — identisk med den
  // raekkefoelge robotdata-skillen selv anbefaler (identitet foerst, saa
  // anvendelse/billede, saa felter til sidst).
  const topRaekkefoelge = [
    'slug', 'navn', 'producent', 'producentland', 'producentby', 'status',
    'foerste_udgivelse', 'forgaenger', 'varianter', 'noter', 'anvendelse', 'billede',
  ];
  const top = {};
  for (const n of topRaekkefoelge) if (doc[n] !== undefined) top[n] = doc[n];
  emitKort(top, 0, linjer);

  linjer.push('felter:');
  const feltLinjer = [];
  for (const feltnavn of FELTNAVNE) {
    const v = doc.felter[feltnavn];
    if (typeof v === 'string') {
      feltLinjer.push(`  ${feltnavn}: ${kvaerdi(v)}`);
    } else {
      const under = [];
      emitKort(v, 4, under);
      feltLinjer.push(`  ${feltnavn}:`);
      feltLinjer.push(...under);
    }
  }
  linjer.push(...feltLinjer);

  return linjer.join('\n') + '\n';
}

/* ------------------------------------------------------------- --fra-db */

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

/** Genopbygger ÉN feltposts kanoniske form (samme facon som db/migrer.mjs's
 *  klassificerFeltpost bygger fra YAML) af DENS raa DB-raekke. */
function omdanFeltpostFraDb(row) {
  const ud = {
    form: row.form, tilstand: row.tilstand,
    vaerdi_tal: row.vaerdi_tal, min: row.min, maks: row.maks,
    vaerdi_tekst: row.vaerdi_tekst, vaerdi_bool: row.vaerdi_bool, vaerdi_liste: row.vaerdi_liste,
    enhed: row.enhed, enhed_imperial: row.enhed_imperial, vaerdi_imperial: row.vaerdi_imperial,
    operator: row.operator, kilde: row.kilde, hentet: row.hentet, kildetype: row.kildetype,
    advarsel: row.advarsel, note: row.note, raa: row.raa, valuta: row.valuta,
  };
  // ved_last_* er tre kolonner paa hver raekke (kun ikke-null for driftstid,
  // jf. db/skema.sql's feltposter_ved_last_kun_paa_driftstid) — genopbyg kun
  // ved_last-noeglen, naar mindst én af dem baerer noget, samme betingelse
  // klassificerVedLast (migrer.mjs) selv bruger til at afgoere om noeglen
  // findes overhovedet.
  if (row.ved_last_tilstand !== null || row.ved_last_vaerdi !== null || row.ved_last_enhed !== null) {
    ud.ved_last = { tilstand: row.ved_last_tilstand, vaerdi: row.ved_last_vaerdi, enhed: row.ved_last_enhed };
  }
  // feltpost_varianter er indlejret UNDER feltposter i selve GET'et (se
  // POSTGREST-OVERRASKELSE 2 nedenfor) — {variant_navn, vaerdi}[] -> {navn: vaerdi}.
  if (row.feltpost_varianter && row.feltpost_varianter.length) {
    ud.varianter = Object.fromEntries(row.feltpost_varianter.map((v) => [v.variant_navn, v.vaerdi]));
  }
  return ud;
}

/** Genopbygger ÉN robots kanoniske form af dens raa, indlejrede DB-raekke.
 *  `idTilSlug` opslaar en robots EGEN id -> slug for de tre selv/kryds-
 *  referencer (forgaenger/arvet_fra/delt_med), som DB'en baerer som
 *  numeriske id'er, men kanonisk() (og dermed YAML) baerer som slugs. */
function omdanRobotFraDb(raa, idTilSlug) {
  const felter = {};
  for (const fp of raa.feltposter) felter[fp.feltnavn] = omdanFeltpostFraDb(fp);
  if (Object.keys(felter).length !== FELTNAVNE.length) {
    throw new Error(`${raa.slug}: ${Object.keys(felter).length} feltposter hentet, forventede ${FELTNAVNE.length} — ` +
      'migreringen har efterladt et hul, eller GET-kaldet blev pagineret. Undersoeg, foer resultatet bruges.');
  }

  let anvendelse = null;
  if (raa.anvendelse) {
    const a = raa.anvendelse;
    anvendelse = {
      er_bar_streng: a.er_bar_streng, er_ikke_oplyst: a.er_ikke_oplyst,
      vaerdi: a.vaerdi, citat: a.citat, kilde: a.kilde, hentet: a.hentet, kildetype: a.kildetype,
      arvet_fra: a.arvet_fra_robot_id ? idTilSlug.get(a.arvet_fra_robot_id) : null, note: a.note,
    };
  }

  let billede = null;
  if (raa.billede) {
    const b = raa.billede;
    billede = {
      fil: b.fil, ophav: b.ophav, kilde: b.kilde, hentet: b.hentet, alt: b.alt, note: b.note,
      delt_med: b.delt_med_robot_id ? idTilSlug.get(b.delt_med_robot_id) : null,
      plade: b.plade, pos: b.pos,
    };
  }

  return {
    slug: raa.slug, navn: raa.navn, producent: raa.producent, producentland: raa.producentland,
    producentby: raa.producentby, status: raa.status, foerste_udgivelse: raa.foerste_udgivelse,
    forgaenger: raa.forgaenger_robot_id ? idTilSlug.get(raa.forgaenger_robot_id) : null,
    varianter: raa.varianter, noter: raa.noter,
    felter, anvendelse, billede,
  };
}

/**
 * Henter robotterne fra et rigtigt Supabase-projekt via fetch mod PostgREST
 * (GET med indlejrede relationer for feltposter/feltpost_varianter/
 * anvendelse/billede) og omsaetter DEM til den SAMME kanoniske,
 * slug-noeglede form, db/migrer.mjs bygger lokalt af YAML — se
 * omdanRobotFraDb ovenfor. Kaldes kun med --fra-db.
 *
 * POSTGREST-OVERRASKELSE 2 (fundet ved afproevning mod en rigtig instans,
 * 25. aug 2026): et indlejret select fra robotter til anvendelse/billede er
 * TVETYDIGT og fejler med 300 + PGRST201 ("more than one relationship was
 * found"), fordi begge tabeller har TO fremmednoegler til robotter
 * (robot_id OG arvet_fra_robot_id / delt_med_robot_id). PostgREST kan ikke
 * gaette, hvilken der menes, og kraever eksplicit valg af constraint-navn:
 * `anvendelse!anvendelse_robot_id_fkey(*)` / `billede!billede_robot_id_fkey(*)`.
 *
 * POSTGREST-OVERRASKELSE 3: feltpost_varianter har INGEN direkte
 * fremmednoegle til robotter (dens FK er den SAMMENSATTE (robot_id,
 * feltnavn) -> feltposter) — et forsoeg paa at indlejre den direkte under
 * robotter fejler med 400 + PGRST200 ("no matches were found... Perhaps you
 * meant 'feltposter'"). Den skal indlejres UNDER feltposter i stedet:
 * `feltposter(*,feltpost_varianter(*))`.
 *
 * POSTGREST-OVERRASKELSE 4: anvendelse og billede kommer tilbage som ENKELTE
 * OBJEKTER (ikke ét-elements arrays), fordi PostgREST selv opdager, at
 * relationen er ét-til-ét (robot_id er BAADE fremmednoegle OG primaernoegle
 * i begge tabeller) — samme facon som naar en 0-1-relation laeses lokalt.
 */
async function fraDb() {
  laesDotEnv(path.join(ROD, '.env'));
  const url = process.env.SUPABASE_URL;
  const noegle = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !noegle) {
    console.error('--fra-db kraever SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY i .env (se db/LAESMIG.md).');
    return null;
  }
  const headers = { apikey: noegle, Authorization: `Bearer ${noegle}` };
  const select = 'select=*,feltposter(*,feltpost_varianter(*)),' +
    'anvendelse!anvendelse_robot_id_fkey(*),billede!billede_robot_id_fkey(*)';
  const svar = await fetch(`${url}/rest/v1/robotter?${select}`, { headers });
  if (!svar.ok) throw new Error(`GET robotter fejlede: ${svar.status} ${await svar.text()}`);
  const raaRobotter = await svar.json();

  const idTilSlug = new Map(raaRobotter.map((r) => [r.id, r.slug]));
  const robotter = raaRobotter.map((r) => omdanRobotFraDb(r, idTilSlug));
  robotter.sort((a, b) => a.slug.localeCompare(b.slug));
  return robotter;
}

/* --------------------------------------------------------------- main */

function laesFlag(argv) {
  const flag = {};
  for (const a of argv) {
    if (!a.startsWith('--')) continue;
    const i = a.indexOf('=');
    if (i === -1) flag[a.slice(2)] = true; else flag[a.slice(2, i)] = a.slice(i + 1);
  }
  return flag;
}

/**
 * Koerer tools/validate.mjs som subproces mod `mappe` og traekker tallene ud
 * af opsummeringslinjen ("N fil(er) · M fejl · K advarsler") via
 * db/rundtur.mjs's traekValidateTal (importeret ovenfor, ikke genskrevet —
 * Aa12, STATUS.md: en tidligere bevidst duplikeret kopi af regex'en er
 * fjernet nu, hvor rundtur.mjs's forbud fra et andet spor er ophoert. To
 * kopier af samme udtraek er praecis D7/L30-faelden: de skrider fra
 * hinanden ved naeste aendring, fordi ingen af dem ved, den anden findes).
 * fejlLinjer (de FEJL-praefikserede linjer, til selve fejlteksten i
 * rapporten) er IKKE en del af traekValidateTal og hentes derfor stadig her.
 */
function koerValidator(mappe) {
  let udskrift;
  try {
    udskrift = execFileSync(process.execPath, ['tools/validate.mjs', `--data=${mappe}`],
      { cwd: ROD, encoding: 'utf8' });
  } catch (e) {
    udskrift = (e.stdout ?? '') + (e.stderr ?? '');
  }
  const { filer, fejl, advarsler } = traekValidateTal(udskrift);
  const fejlLinjer = udskrift.split('\n').filter((l) => l.startsWith('FEJL'));
  return { filer, fejl, advarsler, fejlLinjer };
}

/**
 * Ren beslutningsfunktion — ingen filsystem, ingen netvaerk. Givet
 * valideringens optalte tal ({fejl, ...}, samme facon koerValidator()
 * ovenfor og rundtur.mjs's traekValidateTal begge producerer), afgoer den om
 * den midlertidige eksportmappe maa flyttes ind i den endelige udMappe.
 *
 * KUN FEJL BLOKERER. Advarsler (fx R9 paa ghost-robotics-vision-60, som
 * datasaettet i dag baerer én af, med vilje) maa IKKE blokere — opgavebrevet
 * er eksplicit paa det punkt, og validate.mjs's egen --streng-flag findes
 * netop for den, der VIL have advarsler til at taelle som fejl. Eksporten
 * bruger den ikke.
 *
 * Testet uden netvaerk og uden .env i tests/koer.mjs (samme moenster som
 * db/migrer.mjs's sammenlignDbMedYaml testes rent i afsnit 7 der).
 */
export function boerFlyttes(valideringsTal) {
  return valideringsTal.fejl === 0;
}

async function main(argv) {
  const flag = laesFlag(argv);
  const udMappe = path.resolve(String(flag['ud'] ?? 'db/eksport'));

  let robotter;
  if (flag['fra-db']) {
    const data = await fraDb();
    if (!data) return 1;
    robotter = data;
  } else {
    const kanoniskFil = path.join(ROD, 'db/kanonisk.json');
    if (!fs.existsSync(kanoniskFil)) {
      console.error(`${kanoniskFil} findes ikke. Koer db/migrer.mjs foerst.`);
      return 1;
    }
    robotter = JSON.parse(fs.readFileSync(kanoniskFil, 'utf8')).robotter;
  }

  // VAGTEN: skriv til en midlertidig SIBLING-mappe (samme foraelder som
  // udMappe, saa den senere flytning er en rename inden for samme drev),
  // valider DEN, og ryd den op i ALLE udfald — bestaaet, afvist eller en
  // kastet fejl undervejs. udMappe roeres foerst, naar valideringen er
  // bevist fejlfri.
  const tmpMappe = `${udMappe}.eksport-tmp-${process.pid}`;
  try {
    fs.rmSync(tmpMappe, { recursive: true, force: true });
    fs.mkdirSync(tmpMappe, { recursive: true });

    for (const r of robotter) {
      const doc = byggRobotDoc(r);
      fs.writeFileSync(path.join(tmpMappe, `${r.slug}.yaml`), skrivRobotYaml(doc), 'utf8');
    }

    const valideringsTal = koerValidator(tmpMappe);
    if (!boerFlyttes(valideringsTal)) {
      console.error(`EKSPORT AFVIST: validatoren fandt ${valideringsTal.fejl} fejl i det, ` +
        `databasen ville skrive.`);
      for (const linje of valideringsTal.fejlLinjer) console.error(linje);
      console.error(`${udMappe} er IKKE aendret.`);
      return 1;
    }

    fs.mkdirSync(udMappe, { recursive: true });
    // Ryd maalmappen for gamle filer fra en tidligere koersel, saa en
    // fjernet robot ikke efterlader en foraeldreloes fil, rundturen ville
    // laese ved en fejl — men roer kun *.yaml, ligesom hidtil.
    for (const f of fs.readdirSync(udMappe)) {
      if (/\.ya?ml$/.test(f)) fs.rmSync(path.join(udMappe, f));
    }
    for (const f of fs.readdirSync(tmpMappe)) {
      fs.renameSync(path.join(tmpMappe, f), path.join(udMappe, f));
    }

    console.log(`${robotter.length} YAML-fil(er) skrevet til ${udMappe}`);
    return 0;
  } finally {
    fs.rmSync(tmpMappe, { recursive: true, force: true });
  }
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('eksporter.mjs');
if (erHoved) {
  main(process.argv.slice(2)).then((k) => process.exit(k)).catch((e) => {
    console.error(String(e && e.stack ? e.stack : e));
    process.exit(1);
  });
}

export { byggRobotDoc, skrivRobotYaml, fraDb };
