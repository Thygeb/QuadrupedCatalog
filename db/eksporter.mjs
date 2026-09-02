#!/usr/bin/env node
/**
 * db/eksporter.mjs — DB  ->  data/robots/*.yaml-lignende filer (L34, STATUS.md)
 *
 * Nul afhaengigheder.
 *
 * ÉN TILSTAND, siden L81-L83 (STATUS.md) punkt 5: databasen er kilden, YAML
 * -> DB findes ikke laengere, og db/migrer.mjs — den eneste skriver af den
 * lokale mellemfil, en tidligere, nu fjernet LOKAL tilstand her laeste — er
 * SLETTET.
 *
 *   node db/eksporter.mjs --fra-db --ud=<mappe>   KOeRT (L81-L83, spor/skema,
 *                                          2. sep 2026 — var forberedt, ikke
 *                                          koert, indtil dette spor). Henter
 *                                          robotterne fra det ENGELSKE
 *                                          Supabase-skema
 *                                          (db/skema.sql,
 *                                          db/migrering-engelsk.sql) via
 *                                          fetch mod PostgREST og OVERSAeTTER
 *                                          dem tilbage til nøjagtig den
 *                                          danske form, data/robots/ har i
 *                                          dag — via db/ordbog.mjs, den ENE
 *                                          dansk<->engelsk-ordbog. Kraever
 *                                          SUPABASE_URL og
 *                                          SUPABASE_SERVICE_ROLE_KEY i .env.
 *
 * FIDELITETSKONTRAKTEN: den genererede YAML skal, naar den laeses igen med
 * tools/yaml.mjs's parseYaml + tools/skema.mjs's normaliserRobot, give et
 * DYBT LIG resultat af det samme kaldt paa originalen. Det er IKKE et krav
 * om byte-identisk tekst (facon, kommentarer og noegleraekkefoelge maa gerne
 * skifte) — det er kravet, db/tjek.mjs proever (efterfoelgeren for
 * db/rundtur.mjs, L81-L83 punkt 5). Se den fils kommentarer for hvorfor
 * "parse" her betyder normaliserRobot(parseYaml(x)) og ikke den raa
 * parseYaml alene.
 *
 * VAGTEN (L35-opfoelgning, STATUS.md's D12/L35-raekke): eksporten skriver
 * ALDRIG direkte ind i udMappe. Den skriver foerst til en midlertidig
 * sibling-mappe, koerer tools/validate.mjs PAA DEN, og flytter kun filerne
 * ind i udMappe, hvis valideringen er fejlfri. Slaar valideringen fejl,
 * staar udMappe UBERoeRT. Kun FEJL blokerer; advarsler (fx R9 paa
 * ghost-robotics-vision-60) slipper igennem uaendret, ligesom de altid har
 * gjort i data/robots/. Se boerFlyttes() nedenfor for selve beslutningen som
 * en ren, testbar funktion.
 *
 * STRATEGI: for hver robot genopbygges et JS-objekt paa NØJAGTIG den DANSKE
 * kanoniske form, db/migrer.mjs's klassificerRobot() tidligere byggede af
 * YAML (samme noeglenavne: vaerdi/min/maks/kilde/hentet/tilstand/...,
 * samme topnoegler: billede/anvendelse/felter/...) — og det objekt skrives
 * saa til YAML af en generisk emitter. omdanRobotFraDb/omdanFeltpostFraDb
 * nedenfor er derfor OVERSAeTTERE: de laeser de ENGELSKE PostgREST-raekker
 * og skriver den DANSKE kanoniske form via db/ordbog.mjs — resten af filen
 * (byggRobotDoc, byggFeltpostVaerdi, skrivRobotYaml, emitKort) er UAeNDRET
 * siden foer L81-L83, fordi den kun kender den danske kanoniske form, ikke
 * hvor den kom fra.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import * as ordbog from './ordbog.mjs';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { FELTNAVNE } = await import(`file://${path.join(ROD, 'tools/skema.mjs')}`);
// Aa12 (STATUS.md): traekValidateTal var tidligere en BEVIDST duplikeret
// regex her, fordi db/rundtur.mjs var forbudt for dette spor, mens et andet
// spor arbejdede i den (25. aug 2026) - og funktionen var dengang ikke
// eksporteret derfra. Den laas er vaek nu; funktionen importeres i stedet,
// saa udtraekket af validatorens opsummeringslinje kun findes ÉT sted
// (D7/L30-faelden: to kopier af samme ting skrider fra hinanden). Importeret
// fra db/tjek.mjs (L81-L83 punkt 5's efterfoelger for db/rundtur.mjs).
const { traekValidateTal } = await import(`file://${path.join(ROD, 'db/tjek.mjs')}`);

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

/** Genopbygger ÉN feltposts YAML-repraesentation af dens danske kanoniske
 *  form (se omdanFeltpostFraDb nedenfor for OVERSAeTTELSEN engelsk -> dansk,
 *  som sker FOeR denne funktion nogensinde kaldes). UAeNDRET siden foer
 *  L81-L83 — den kender kun den danske kanoniske form. */
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
  // navn — bevaret som historisk reference, filen selv er slettet):
  // et maaleligt interval kan staa ved siden af en tekst/bool/liste-
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
    // R20/L48/D14 (spor/dbklasse): søsterfeltet til advarsel. Samme
    // form-betingelse som advarsel selv — kun de fem former, der kan baere
    // et forbehold, kan baere dets klasse.
    kort.advarsel_klasse = f.advarsel_klasse ?? undefined;
    // R21 (spor/cjkui, 1. sep 2026): "advarsel_ordlyd" — samme form-
    // betingelse som advarsel_klasse ovenfor, producentens ordrette
    // kildeformulering, ingen skabelon laeser den.
    kort.advarsel_ordlyd = f.advarsel_ordlyd ?? undefined;
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
    producentby: r.producentby ?? undefined, status: r.status, fremdrift: r.fremdrift,
    foerste_udgivelse: r.foerste_udgivelse ?? undefined,
    forgaenger: r.forgaenger ?? undefined,
    varianter: r.varianter ?? undefined,
    noter: r.noter ?? undefined,
    // noter_ordlyd — spor/cjkui, 1. sep 2026 (R21): soesterfeltet til noter.
    noter_ordlyd: r.noter_ordlyd ?? undefined,
  };

  if (r.anvendelse) {
    const a = r.anvendelse;
    if (a.er_bar_streng) {
      doc.anvendelse = 'ikke_oplyst';
    } else {
      const kort = { vaerdi: a.er_ikke_oplyst ? 'ikke_oplyst' : a.vaerdi };
      // citat_ordlyd foelger citat's egen er_ikke_oplyst-udeladelse (R21,
      // spor/cjkui) — uden et citat er der intet at have en ordlyd til.
      if (!a.er_ikke_oplyst) { kort.citat = a.citat; kort.citat_ordlyd = a.citat_ordlyd ?? undefined; }
      kort.kilde = a.kilde ?? undefined;
      kort.hentet = a.hentet ?? undefined;
      kort.kildetype = a.kildetype ?? undefined;
      kort.arvet_fra = a.arvet_fra ?? undefined;
      kort.note = a.note ?? undefined;
      // note_ordlyd — spor/cjkui, 1. sep 2026 (R21): soesterfeltet til note.
      kort.note_ordlyd = a.note_ordlyd ?? undefined;
      doc.anvendelse = kort;
    }
  }

  if (r.billede) {
    const b = r.billede;
    doc.billede = {
      fil: b.fil, ophav: b.ophav, kilde: b.kilde ?? undefined, hentet: b.hentet ?? undefined,
      alt: b.alt ?? undefined, note: b.note ?? undefined,
      delt_med: b.delt_med ?? undefined,
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
    'slug', 'navn', 'producent', 'producentland', 'producentby', 'status', 'fremdrift',
    'foerste_udgivelse', 'forgaenger', 'varianter', 'noter', 'noter_ordlyd', 'anvendelse', 'billede',
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

/** Oversaetter anvendelse.value (jsonb: STRENG eller LISTE af strenge,
 *  engelske kategorier) tilbage til danske ANVENDELSE_VAERDIER-navne via
 *  ordbog.DATA_VAERDIER.anvendelse_vaerdi. Formen (streng vs. liste)
 *  bevares praecist — samme regel som db/byg-migrering.mjs's sektion A3
 *  brugte den ANDEN vej. */
function oversaetAnvendelseVaerdi(v) {
  if (v === null || v === undefined) return v;
  if (Array.isArray(v)) return v.map((x) => ordbog.DATA_VAERDIER.anvendelse_vaerdi.tilDansk(x));
  return ordbog.DATA_VAERDIER.anvendelse_vaerdi.tilDansk(v);
}

/** Genopbygger ÉN feltposts danske kanoniske form (samme facon som det
 *  slettede db/migrer.mjs's klassificerFeltpost byggede fra YAML) af DENS
 *  raa, ENGELSKE DB-raekke (field_entries, jf. db/skema.sql). Hver
 *  ordbog.tilDansk()-kald er punktet, hvor L81-L83's omdoebning gaar i
 *  omvendt retning igen — se db/ordbog.mjs. */
function omdanFeltpostFraDb(row) {
  const ud = {
    form: ordbog.ENUM_LABELS.feltform_enum.tilDansk(row.form),
    tilstand: row.state === null || row.state === undefined ? row.state : ordbog.ENUM_LABELS.tilstand_enum.tilDansk(row.state),
    vaerdi_tal: row.value_number, min: row.minimum, maks: row.maximum,
    vaerdi_tekst: row.value_text, vaerdi_bool: row.value_bool, vaerdi_liste: row.value_list,
    enhed: row.unit, enhed_imperial: row.imperial_unit, vaerdi_imperial: row.imperial_value,
    // operator_enum er identitetsoversat (symboler, ikke ord) — se
    // db/ordbog.mjs's ENUM_LABELS.operator_enum. tilDansk() virker stadig
    // korrekt her (kaster ikke), fordi lavOrdbog() ogsaa registrerer
    // identitetspar i BEGGE retninger.
    operator: row.operator === null || row.operator === undefined ? row.operator : ordbog.ENUM_LABELS.operator_enum.tilDansk(row.operator),
    kilde: row.source, hentet: row.retrieved_at,
    kildetype: row.source_type === null || row.source_type === undefined ? row.source_type : ordbog.ENUM_LABELS.kildetype_enum.tilDansk(row.source_type),
    advarsel: row.caveat,
    // advarsel_klasse ER IKKE oversat (briefets punkt 1's afgraensning, se
    // db/skema.sql's kommentar ved field_entries.caveat_class) — kolonnen
    // hedder engelsk, INDHOLDET er stadig dansk ('gyldighed'/'uddybning').
    advarsel_klasse: row.caveat_class,
    advarsel_ordlyd: row.caveat_wording,
    note: row.note, raa: row.raw, valuta: row.currency,
  };
  // load_state/load_value/load_unit er tre kolonner paa hver raekke (kun
  // ikke-null for 'runtime', jf. db/skema.sql's
  // field_entries_load_only_on_runtime) — genopbyg kun ved_last-noeglen, naar
  // mindst én af dem baerer noget.
  if (row.load_state !== null || row.load_value !== null || row.load_unit !== null) {
    ud.ved_last = {
      tilstand: row.load_state === null || row.load_state === undefined ? row.load_state : ordbog.ENUM_LABELS.tilstand_enum.tilDansk(row.load_state),
      vaerdi: row.load_value, enhed: row.load_unit,
    };
  }
  // field_entry_variants er indlejret UNDER field_entries i selve GET'et (se
  // POSTGREST-OVERRASKELSE 3 nedenfor) — {variant_name, value}[] ->
  // {navn: vaerdi}. variant_name er producentens EGET variantnavn (fx "Go2
  // Pro") — fri tekst, ikke en ordbogsnoegle, oversaettes ikke.
  if (row.field_entry_variants && row.field_entry_variants.length) {
    ud.varianter = Object.fromEntries(row.field_entry_variants.map((v) => [v.variant_name, v.value]));
  }
  return ud;
}

/** Genopbygger ÉN robots danske kanoniske form af dens raa, indlejrede,
 *  ENGELSKE DB-raekke (robots, jf. db/skema.sql). `idTilSlug` opslaar en
 *  robots EGEN id -> slug for de tre selv/kryds-referencer (forgaenger/
 *  arvet_fra/delt_med), som DB'en baerer som numeriske id'er, men den
 *  kanoniske form (og dermed YAML) baerer som slugs. */
function omdanRobotFraDb(raa, idTilSlug) {
  const felter = {};
  for (const fp of raa.field_entries) felter[ordbog.ENUM_LABELS.feltnavn_enum.tilDansk(fp.field_name)] = omdanFeltpostFraDb(fp);
  if (Object.keys(felter).length !== FELTNAVNE.length) {
    throw new Error(`${raa.slug}: ${Object.keys(felter).length} feltposter hentet, forventede ${FELTNAVNE.length} — ` +
      'migreringen har efterladt et hul, eller GET-kaldet blev pagineret. Undersoeg, foer resultatet bruges.');
  }

  let anvendelse = null;
  if (raa.applications) {
    const a = raa.applications;
    anvendelse = {
      er_bar_streng: a.is_bare_string, er_ikke_oplyst: a.is_not_stated,
      vaerdi: oversaetAnvendelseVaerdi(a.value), citat: a.quote, citat_ordlyd: a.quote_wording,
      kilde: a.source, hentet: a.retrieved_at,
      kildetype: a.source_type === null || a.source_type === undefined ? a.source_type : ordbog.ENUM_LABELS.kildetype_enum.tilDansk(a.source_type),
      arvet_fra: a.inherited_from_robot_id ? idTilSlug.get(a.inherited_from_robot_id) : null,
      note: a.note, note_ordlyd: a.note_wording,
    };
  }

  let billede = null;
  if (raa.images) {
    const b = raa.images;
    billede = {
      fil: b.file, ophav: ordbog.ENUM_LABELS.ophav_enum.tilDansk(b.origin),
      kilde: b.source, hentet: b.retrieved_at, alt: b.alt, note: b.note,
      delt_med: b.shared_with_robot_id ? idTilSlug.get(b.shared_with_robot_id) : null,
      plade: b.plate, pos: b.position,
    };
  }

  return {
    slug: raa.slug, navn: raa.name, producent: raa.manufacturer,
    producentland: ordbog.DATA_VAERDIER.producentland.tilDansk(raa.manufacturer_country),
    producentby: raa.manufacturer_city,
    status: ordbog.ENUM_LABELS.status_enum.tilDansk(raa.status),
    fremdrift: ordbog.DATA_VAERDIER.fremdrift.tilDansk(raa.locomotion),
    foerste_udgivelse: raa.first_released,
    forgaenger: raa.predecessor_robot_id ? idTilSlug.get(raa.predecessor_robot_id) : null,
    varianter: raa.variants, noter: raa.notes, noter_ordlyd: raa.notes_wording,
    felter, anvendelse, billede,
  };
}

/**
 * Henter robotterne fra det ENGELSKE Supabase-skema (db/skema.sql,
 * db/migrering-engelsk.sql) via fetch mod PostgREST (GET med indlejrede
 * relationer for field_entries/field_entry_variants/applications/images) og
 * omsaetter DEM til den danske kanoniske, slug-noeglede form — se
 * omdanRobotFraDb ovenfor.
 *
 * POSTGREST-OVERRASKELSE 2 (fundet ved afproevning mod en rigtig instans,
 * 25. aug 2026, gaelder stadig efter L81-L83's omdoebning): et indlejret
 * select fra robots til applications/images er TVETYDIGT (300 + PGRST201),
 * fordi begge tabeller har TO fremmednoegler til robots. PostgREST kraever
 * eksplicit valg af CONSTRAINT-navn — og her er faelden, L81-L83s omdoebning
 * efterlod: RENAME TABLE/COLUMN aendrer IKKE en eksisterende constraints
 * EGET navn (kun tabellens/kolonnens). De to FK-constraints hedder derfor
 * STADIG deres oprindelige DANSKE navne, laest raat af pg_constraint 2. sep
 * 2026 (ikke gaettet): "anvendelse_robot_id_fkey" og "billede_robot_id_fkey"
 * — IKKE "applications_robot_id_fkey"/"images_robot_id_fkey", som en
 * naiv laesning af det NYE tabelnavn ville forvente.
 *
 * POSTGREST-OVERRASKELSE 3: field_entry_variants har INGEN direkte
 * fremmednoegle til robots (dens FK er den SAMMENSATTE (robot_id,
 * field_name) -> field_entries) — indlejres derfor UNDER field_entries:
 * `field_entries(*,field_entry_variants(*))`.
 *
 * POSTGREST-OVERRASKELSE 4: applications og images kommer tilbage som
 * ENKELTE OBJEKTER (ikke ét-elements arrays), fordi PostgREST selv opdager,
 * at relationen er ét-til-ét (robot_id er BAADE fremmednoegle OG
 * primaernoegle i begge tabeller).
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
  const select = 'select=*,field_entries(*,field_entry_variants(*)),' +
    'applications!anvendelse_robot_id_fkey(*),images!billede_robot_id_fkey(*)';
  const svar = await fetch(`${url}/rest/v1/robots?${select}`, { headers });
  if (!svar.ok) throw new Error(`GET robots fejlede: ${svar.status} ${await svar.text()}`);
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
 * db/tjek.mjs's traekValidateTal (importeret ovenfor, ikke genskrevet —
 * Aa12, STATUS.md). fejlLinjer (de FEJL-praefikserede linjer, til selve
 * fejlteksten i rapporten) er IKKE en del af traekValidateTal og hentes
 * derfor stadig her.
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
 * ovenfor og db/tjek.mjs's traekValidateTal begge producerer), afgoer den om
 * den midlertidige eksportmappe maa flyttes ind i den endelige udMappe.
 *
 * KUN FEJL BLOKERER. Advarsler (fx R9 paa ghost-robotics-vision-60, som
 * datasaettet i dag baerer én af, med vilje) maa IKKE blokere — opgavebrevet
 * er eksplicit paa det punkt, og validate.mjs's egen --streng-flag findes
 * netop for den, der VIL have advarsler til at taelle som fejl. Eksporten
 * bruger den ikke.
 *
 * Testet uden netvaerk og uden .env i tests/koer.mjs (samme moenster som
 * det slettede db/migrer.mjs's sammenlignDbMedYaml blev testet rent).
 */
export function boerFlyttes(valideringsTal) {
  return valideringsTal.fejl === 0;
}

async function main(argv) {
  const flag = laesFlag(argv);
  const udMappe = path.resolve(String(flag['ud'] ?? 'db/eksport'));

  // ÉN vej ind, siden L81-L83 punkt 5 (db/migrer.mjs, den eneste skriver af
  // den tidligere lokale mellemfil, er slettet — databasen er kilden).
  if (!flag['fra-db']) {
    console.error('db/eksporter.mjs kraever --fra-db. Den tidligere lokale tilstand ' +
      '(uden --fra-db, laeste en lokal mellemfil) er fjernet (L81-L83, punkt 5) — ' +
      'db/migrer.mjs, den eneste skriver af den fil, findes ikke laengere.');
    return 1;
  }
  const robotter = await fraDb();
  if (!robotter) return 1;

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
    // fjernet robot ikke efterlader en foraeldreloes fil, tjek.mjs ville
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

export { byggRobotDoc, skrivRobotYaml, fraDb, byggFeltpostVaerdi, omdanFeltpostFraDb, omdanRobotFraDb, oversaetAnvendelseVaerdi };
