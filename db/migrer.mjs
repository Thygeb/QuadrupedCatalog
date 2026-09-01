#!/usr/bin/env node
/**
 * db/migrer.mjs — data/robots/*.yaml  ->  DB (L34, STATUS.md)
 *
 * Nul afhaengigheder. Samme parser og samme normalisering som validate.mjs
 * og build.mjs bruger (tools/yaml.mjs, tools/skema.mjs) — importeret, ikke
 * kopieret, af samme grund som resten af projektet: to laesninger af den
 * samme fil er praecis den fejl, der engang kostede 358 felter.
 *
 * TO TILSTANDE:
 *
 *   node db/migrer.mjs                 LOKAL (standard). Ingen DB findes endnu.
 *                                       Laeser data/robots/*.yaml, skriver
 *                                       db/kanonisk.json (den kanoniske,
 *                                       slug-noeglede JSON-repraesentation)
 *                                       og db/seed.sql (INSERT-saet mod
 *                                       db/skema.sql).
 *
 *   node db/migrer.mjs --til-db        FORBEREDT, IKKE KOERT. Skriver de
 *                                       samme raekker til et rigtigt
 *                                       Supabase-projekt via fetch mod
 *                                       PostgREST (ingen supabase-js).
 *                                       Kraever SUPABASE_URL og
 *                                       SUPABASE_SERVICE_ROLE_KEY i .env
 *                                       (se db/LAESMIG.md). Koeres FOeRST,
 *                                       naar JPK har oprettet projektet og
 *                                       kort db/skema.sql ind i det.
 *
 * db/migrer.mjs koerer ALTID tools/validate.mjs foerst og stopper ved fejl —
 * samme princip som build.mjs: et talfelt uden kilde maa ikke naa databasen,
 * ligesom det ikke maa naa dist/.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { parseYaml } = await import(`file://${path.join(ROD, 'tools/yaml.mjs')}`);
const {
  FELTNAVNE, FELTER, TILSTANDE, tilstandAf, normaliserRobot,
  ANVENDELSE_NOEGLER, GRUPPER, KATALOG_FELTER, FILTER_FELTER,
} = await import(`file://${path.join(ROD, 'tools/skema.mjs')}`);
const { main: validerMain, findFiler } = await import(`file://${path.join(ROD, 'tools/validate.mjs')}`);
// VAGTEN (L35): laeser DB'ens nuvaerende indhold gennem PRAeCIS den samme
// kodevej, som db/eksporter.mjs's --fra-db bruger (importeret, ikke
// genimplementeret), og sammenligner med samme dybe lighed, db/rundtur.mjs
// allerede bruger til at bevise fundamentet (importeret, ikke genimplementeret)
// — to kopier af samme forespoergsel/sammenligning er praecis D7/L30-faelden.
const { fraDb } = await import(`file://${path.join(ROD, 'db/eksporter.mjs')}`);
const { dybtLig } = await import(`file://${path.join(ROD, 'db/rundtur.mjs')}`);

/* ------------------------------------------------------------------------
 * DRIFTVAGT: feltnavn_enum i db/skema.sql er en haandskrevet oejeblikslisme
 * (Postgres kan ikke laese FELTNAVNE ved CREATE TYPE-tid). Den her liste
 * SKAL vaere identisk med db/skema.sql's "create type feltnavn_enum" — bliver
 * de uenige, er det praecis D7/L30-faelden igen (to lister, ét broekstreg),
 * saa scriptet fejler hoejlydt i stedet for at migrere et skema, DB'en ikke
 * har.
 * ------------------------------------------------------------------------ */
const FELTNAVN_ENUM_I_SKEMA_SQL = [
  'egenvaegt', 'laengde', 'bredde', 'hoejde', 'frihedsgrader',
  'nyttelast_gaaende', 'nyttelast_staaende', 'hastighed', 'haeldning',
  'forhindring_enkelt', 'trappetrin_kontinuerlig', 'ip_klasse', 'temp_min', 'temp_maks',
  'batteri_wh', 'driftstid', 'hot_swap', 'ladetid', 'dockingstation',
  'lidar', 'kameraer', 'compute', 'ros2', 'sdk_sprog', 'autonominiveau',
  'monteringsinterface', 'stroem_ud', 'dataporte',
  'pris',
  'ce_oplyst',
  // spor/cert (1. sep 2026): samme tre som tools/skema.mjs's FELTER.
  'fcc_oplyst', 'ul_oplyst', 'ccc_oplyst',
];

function tjekEnumDrift() {
  const a = [...FELTNAVNE].sort();
  const b = [...FELTNAVN_ENUM_I_SKEMA_SQL].sort();
  const ens = a.length === b.length && a.every((v, i) => v === b[i]);
  if (!ens) {
    throw new Error(
      `db/migrer.mjs's kopi af feltnavn_enum er ude af sync med tools/skema.mjs's FELTNAVNE.\n` +
      `  skema.mjs (${a.length}): ${a.join(', ')}\n` +
      `  skema.sql (${b.length}): ${b.join(', ')}\n` +
      `Ret db/skema.sql's "create type feltnavn_enum" OG kopien oeverst i denne fil, saa de to ` +
      `igen er identiske — det er den samme faelde som D7/L30 (naevneren skred fra taelleren, ` +
      `fordi to lister levede hver for sig).`
    );
  }
}

/* ------------------------------------------------------------------------
 * VAGT 2 (spor/dbklasse, punkt 3): "advarsel_klasse" var en RIGTIG, brugt
 * noegle i 562 feltposter i data/robots/*.yaml, uden at NOGEN af de fem
 * kopisteder i denne fil og db/eksporter.mjs vidste, den fandtes —
 * klassificerFeltpost droppede den ind i kanonisk.json, byggSeedSql droppede
 * den ud af seed.sql, og --til-db ville have droppet den ud af den levende
 * database. Ingen af de tre fejlede: en glemt noegle er tavs, ikke en fejl.
 *
 * FELTPOST_NOEGLER_KENDT er den ENE liste, denne fil selv haevder at kende —
 * de noegler, klassificerFeltpost() rent faktisk laeser (direkte-kopi-
 * noeglerne i "faelles"/tilstand_med_herkomst ovenfor) PLUS de strukturelle
 * noegler ("vaerdi", "min", "maks", "ved_last", "varianter"), som ikke
 * kopieres 1:1 til en kolonne af samme navn, men haandteres af deres egen
 * kode-gren (form-afgoerelsen, klassificerVedLast, varianter-passet).
 * "vaerdi_min"/"vaerdi_maks" staar IKKE her — normaliserRobot() (tools/
 * skema.mjs's POST_NOEGLE_ALIAS) omdoeber dem til "min"/"maks" FOeR denne
 * fil nogensinde ser dem, saa den normaliserede form, vagten scanner
 * (samme facon som klassificerFeltpost selv laeser), bruger kun maalnavnet.
 *
 * DENNE LISTE ER STADIG HAANDSKREVET — samme svaghed som
 * FELTNAVN_ENUM_I_SKEMA_SQL ovenfor (Postgres/denne fil kan ikke laese
 * "hvilke noegler bruger klassificerFeltpost" ud af koden selv uden et
 * AST-vaerktoej, som projektets nul-afhaengigheder-regel forbyder). Vagten
 * her loeser derfor IKKE "opdager automatisk enhver kodeaendring" — den
 * loeser den SNAEVRERE, men reelle fejl, der ramte advarsel_klasse: en
 * noegle, DATA rent faktisk bruger, som INGEN liste her kender noget til.
 * Ret denne liste, naar en ny feltpost-noegle tages i brug — vagten fejler
 * proev paa proev, indtil det sker, saa det ikke kan glemmes tavst igen.
 * ------------------------------------------------------------------------ */
const FELTPOST_NOEGLER_KENDT = new Set([
  // direkte kopieret ind i "faelles" / tilstand_med_herkomst ovenfor:
  'enhed', 'enhed_imperial', 'vaerdi_imperial', 'operator',
  'kilde', 'hentet', 'kildetype', 'advarsel', 'advarsel_klasse',
  // "advarsel_ordlyd" — spor/cjkui, 1. sep 2026 (R21): soesterfeltet til
  // "advarsel", producentens ordrette kildeformulering. Samme kopisteder som
  // advarsel_klasse (faelles-objektet ovenfor, byggSeedSql, byggFeltpostRaekkeTilDb
  // her, samt byggFeltpostVaerdi/omdanFeltpostFraDb i db/eksporter.mjs).
  'advarsel_ordlyd',
  'note', 'raa', 'valuta',
  // strukturelle noegler, haandteret af deres egen kode-gren (ikke "faelles"):
  'vaerdi', 'min', 'maks', 'ved_last', 'varianter',
]);

/**
 * Scanner ALLE feltposter i `dataMappe` (normaliseret, samme form
 * klassificerFeltpost selv laeser — se FELTPOST_NOEGLER_KENDT's kommentar)
 * og finder noegler, INGEN kopisted her kender noget til. Ren funktion:
 * intet netvaerk, kun filsystem — koeres derfor uden .env i tests og fejler
 * HOEJLYDT fra main() foer noget som helst migreres.
 *
 * Returnerer en Map<noegle, string[]> ("slug.feltnavn"-lokationer). Tom Map
 * = alt kendt.
 */
function tjekFeltpostNoeglerKendt(dataMappe) {
  const ukendte = new Map();
  for (const fil of findFiler(dataMappe)) {
    const doc = normaliserRobot(parseYaml(fs.readFileSync(fil, 'utf8'), fil));
    for (const [feltnavn, post] of Object.entries(doc.felter ?? {})) {
      if (!erKort(post)) continue; // bare_tilstand er en ren streng — ingen noegler at tjekke
      for (const n of Object.keys(post)) {
        if (FELTPOST_NOEGLER_KENDT.has(n)) continue;
        if (!ukendte.has(n)) ukendte.set(n, []);
        ukendte.get(n).push(`${doc.slug ?? path.basename(fil)}.${feltnavn}`);
      }
    }
  }
  return ukendte;
}

/* -------------------------------------------------------------- hjaelp */

const erKort = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Klassificerer ÉN feltpost til den form, db/skema.sql's feltform_enum kender.
 *  Speejler tools/validate.mjs's tjekFelt-gren for gren, men bygger en raekke
 *  i stedet for at rapportere fejl (validate.mjs er allerede koert og har
 *  sagt god for filen, foer denne funktion kaldes). */
function klassificerFeltpost(feltnavn, post, spec) {
  // 1. Bar tilstand: "ikke_oplyst" | "nej" | "kun_billede" som ren streng.
  if (typeof post === 'string') {
    const t = tilstandAf(post);
    if (!t) throw new Error(`${feltnavn}: uventet streng "${post}" naaede migreringen uvalideret`);
    return { form: 'bare_tilstand', tilstand: t };
  }
  if (!erKort(post)) throw new Error(`${feltnavn}: uventet vaerditype naaede migreringen uvalideret`);

  // 2. Tilstand MED herkomst (skemaudvidelse 1): { vaerdi: <tilstand>, kilde, ... }
  //
  // VIGTIGT (fundet af formscannet, 25. aug 2026, ikke antaget): en post kan
  // vaere tilstand_med_herkomst PAA TOPNIVEAU og STADIG baere en
  // "varianter:"-underblok — fx unitree-as2.yaml's ip_klasse, hvor den
  // SAMLEDE vaerdi er en tilstand ("nej" for AIR-varianten indgaar i
  // helhedsbilledet), mens hver variant har sit eget svar. "varianter"
  // haandteres derfor ÉN gang, EFTER hele if/else-kaeden nedenfor —
  // uafhaengigt af hvilken form raekken ender med. Den tidligere version af
  // denne funktion haengte kun "varianter" paa 'tal'-formen, hvilket er
  // FORKERT: formscannet fandt 37 varianter-forekomster paa tvaers af tal,
  // tekst, ip, jaNej OG liste-felter.
  let ud;
  const tilstandVaerdi = tilstandAf(post.vaerdi);
  if (tilstandVaerdi) {
    ud = {
      form: 'tilstand_med_herkomst', tilstand: tilstandVaerdi,
      kilde: post.kilde ?? null, hentet: post.hentet ?? null,
      kildetype: post.kildetype ?? null, advarsel: post.advarsel ?? null,
      advarsel_klasse: post.advarsel_klasse ?? null, advarsel_ordlyd: post.advarsel_ordlyd ?? null,
    };
  } else {
    const faelles = {
      enhed: post.enhed ?? null, enhed_imperial: post.enhed_imperial ?? null,
      vaerdi_imperial: post.vaerdi_imperial ?? null, operator: post.operator ?? null,
      kilde: post.kilde ?? null, hentet: post.hentet ?? null, kildetype: post.kildetype ?? null,
      advarsel: post.advarsel ?? null, advarsel_klasse: post.advarsel_klasse ?? null,
      advarsel_ordlyd: post.advarsel_ordlyd ?? null,
      note: post.note ?? null, raa: post.raa ?? null,
      valuta: post.valuta ?? null,
    };

    if (spec.art === 'tal') {
      // 3. Tal-arten: interval (min/maks) eller enkeltvaerdi.
      if (post.min !== undefined || post.maks !== undefined) {
        ud = { form: 'interval', min: post.min, maks: post.maks, ...faelles };
      } else {
        ud = { form: 'tal', vaerdi_tal: post.vaerdi, ...faelles };
      }
      if (spec.kraeverVedLast) ud.ved_last = klassificerVedLast(post.ved_last);
    } else if (typeof post.vaerdi === 'number') {
      // 4. Defensiv graense (0 forekomster i dag): et bart tal i et
      // ikke-tal-felt (tjekTekstfelt tillader det teoretisk: "et tal i et
      // tekstfelt er stadig et tal og skal have enhed").
      throw new Error(
        `${feltnavn}: post.vaerdi er et TAL i et ${spec.art}-felt (${JSON.stringify(post.vaerdi)}). ` +
        `Denne kant har 0 forekomster i data/robots/ (formscan 25. aug 2026) og er ikke modelleret ` +
        `i db/skema.sql. Ret klassificerFeltpost, hvis den nogensinde opstaar.`
      );
    } else if (spec.art === 'jaNej') {
      if (typeof post.vaerdi !== 'boolean') {
        throw new Error(`${feltnavn}: jaNej-felt uden boolean vaerdi naaede migreringen uvalideret`);
      }
      ud = { form: 'bool', vaerdi_bool: post.vaerdi, ...faelles };
    } else if (spec.art === 'liste') {
      if (!Array.isArray(post.vaerdi)) throw new Error(`${feltnavn}: liste-felt uden liste-vaerdi naaede migreringen uvalideret`);
      ud = { form: 'liste', vaerdi_liste: post.vaerdi, ...faelles };
    } else {
      // 'tekst' og 'ip'.
      if (typeof post.vaerdi !== 'string' || post.vaerdi.trim() === '') {
        throw new Error(`${feltnavn}: tekstfelt uden gyldig streng-vaerdi naaede migreringen uvalideret`);
      }
      ud = { form: 'tekst', vaerdi_tekst: post.vaerdi, ...faelles };
    }

    // SIDESPOR: den generiske min/maks-gren i validate.mjs's tjekFelt tillader
    // et MAALBART interval ved siden af en tekst/bool/liste-vaerdi (koden
    // naevner selv eksemplet: Spot's stroem_ud, "ureguleret DC 35-58,8 V ...",
    // med min:35/maks:58,8 ved siden af teksten). Fundet af rundturstesten,
    // ikke antaget: formscan talte kun 1 forekomst, men den findes, og db/
    // skema.sql's feltposter tillader derfor min/maks paa 'tekst'/'bool'/
    // 'liste'-former som et sidespor, ikke kun paa den rene 'interval'-form.
    if (post.min !== undefined || post.maks !== undefined) {
      ud.min = post.min; ud.maks = post.maks;
    }
  }

  if (post.varianter !== undefined) ud.varianter = post.varianter;
  return ud;
}

function klassificerVedLast(vl) {
  if (vl === undefined) return null;
  if (typeof vl === 'string') {
    const t = tilstandAf(vl);
    return t ? { tilstand: t, vaerdi: null, enhed: null } : null;
  }
  if (erKort(vl)) {
    const t = tilstandAf(vl.vaerdi);
    if (t) return { tilstand: t, vaerdi: null, enhed: vl.enhed ?? null };
    return { tilstand: null, vaerdi: vl.vaerdi, enhed: vl.enhed ?? null };
  }
  return null;
}

/** Klassificerer én robot (allerede parset + normaliseret) til den kanoniske,
 *  slug-noeglede form, db/kanonisk.json og db/seed.sql begge bygges af.
 *
 *  Et FELTNAVNE-felt, der slet ikke staar i doc.felter, er "ikke_oplyst" —
 *  IKKE en fejltilstand. Frem til spor/cert (1. sep 2026) holdt en kastet
 *  fejl her, fordi datakonventionen hidtil ALTID skrev alle skemafelter
 *  eksplicit i hver robots YAML (ogsaa som "ikke_oplyst"); det var en
 *  tilfaeldighed ved dataindtastningen, ikke en regel validate.mjs haandhaever
 *  (R2 fanger UKENDTE felter, ingen regel fanger et MANGLENDE kendt felt).
 *  Da fcc_oplyst/ul_oplyst/ccc_oplyst blev tilfoejet til skemaet UDEN at
 *  robotdata blev rettet (haard begraensning 2: intet tal opfindes for at
 *  lukke hullet), blev antagelsen falsk. Resten af koden har altid vaeret
 *  enig om absence = ikke_oplyst — feltVisning() (skema.mjs) returnerer
 *  { tilstand: 'ikke_oplyst' } for post===undefined, side.mjs' felt()
 *  samme, taelKilder() i build.mjs springer den bare over — saa denne
 *  funktion foelger nu samme regel i stedet for at vaere den ene undtagelse. */
function klassificerRobot(doc) {
  const felter = {};
  for (const feltnavn of FELTNAVNE) {
    const post = doc.felter[feltnavn] ?? 'ikke_oplyst';
    felter[feltnavn] = klassificerFeltpost(feltnavn, post, FELTER[feltnavn]);
  }

  let anvendelse = null;
  if (doc.anvendelse !== undefined) {
    const a = doc.anvendelse;
    if (typeof a === 'string') {
      anvendelse = { er_bar_streng: true, er_ikke_oplyst: true, vaerdi: null, citat: null, citat_ordlyd: null,
        kilde: null, hentet: null, kildetype: null, arvet_fra: null, note: null, note_ordlyd: null };
    } else {
      const erIkkeOplyst = (Array.isArray(a.vaerdi) ? a.vaerdi.length === 1 && tilstandAf(a.vaerdi[0]) === 'ikke_oplyst'
        : tilstandAf(a.vaerdi) === 'ikke_oplyst');
      anvendelse = {
        er_bar_streng: false, er_ikke_oplyst: erIkkeOplyst,
        vaerdi: erIkkeOplyst ? null : (a.vaerdi ?? null),
        citat: erIkkeOplyst ? null : (a.citat ?? null),
        // citat_ordlyd/note_ordlyd — spor/cjkui, 1. sep 2026 (R21): soester-
        // felterne til citat/note, producentens ordrette kildeformulering.
        // citat_ordlyd foelger citat's egen er_ikke_oplyst-nulstilling (uden
        // et citat er der intet at have en ordlyd til); note_ordlyd foelger
        // note's ubetingede kopi (note selv nulstilles heller ikke af
        // er_ikke_oplyst ovenfor).
        citat_ordlyd: erIkkeOplyst ? null : (a.citat_ordlyd ?? null),
        kilde: a.kilde ?? null, hentet: a.hentet ?? null, kildetype: a.kildetype ?? null,
        arvet_fra: a.arvet_fra ?? null, note: a.note ?? null, note_ordlyd: a.note_ordlyd ?? null,
      };
    }
  }

  let billede = null;
  if (doc.billede !== undefined) {
    const b = doc.billede;
    billede = {
      fil: b.fil, ophav: b.ophav, kilde: b.kilde ?? null, hentet: b.hentet ?? null,
      alt: b.alt ?? null, note: b.note ?? null, delt_med: b.delt_med ?? null,
      plade: b.plade ?? null, pos: b.pos ?? null,
    };
  }

  return {
    slug: doc.slug, navn: doc.navn, producent: doc.producent, producentland: doc.producentland,
    producentby: doc.producentby ?? null, status: doc.status, fremdrift: doc.fremdrift,
    foerste_udgivelse: doc.foerste_udgivelse ?? null, forgaenger: doc.forgaenger ?? null,
    varianter: doc.varianter ?? null, noter: doc.noter ?? null,
    // noter_ordlyd — spor/cjkui, 1. sep 2026 (R21): soesterfeltet til "noter",
    // ALTID en liste (aldrig en bar streng, modsat "noter" selv).
    noter_ordlyd: doc.noter_ordlyd ?? null,
    felter, anvendelse, billede,
  };
}

/* ------------------------------------------------------------- SQL-udskrift */

const sqlStr = (v) => v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`;
const sqlNum = (v) => v === null || v === undefined ? 'null' : String(v);
const sqlBool = (v) => v === null || v === undefined ? 'null' : (v ? 'true' : 'false');
const sqlDate = (v) => v === null || v === undefined ? 'null' : `'${v}'::date`;
const sqlEnum = (v) => v === null || v === undefined ? 'null' : sqlStr(v);
const sqlJsonb = (v) => v === null || v === undefined ? 'null' : `${sqlStr(JSON.stringify(v))}::jsonb`;
const sqlTextArray = (v) => v === null || v === undefined ? 'null'
  : `ARRAY[${v.map((x) => sqlStr(x)).join(', ')}]::text[]`;
const robotSlugRef = (slug) => `(select id from robotter where slug = ${sqlStr(slug)})`;

function byggSeedSql(robotter) {
  const ud = [];
  ud.push('-- db/seed.sql — genereret af db/migrer.mjs. IKKE haandskrevet, IKKE til redigering.');
  ud.push(`-- Kilde: data/robots/*.yaml, ${robotter.length} filer. Koer db/skema.sql foerst.\n`);
  ud.push('begin;\n');

  ud.push('insert into robotter (slug, navn, producent, producentland, producentby, status, fremdrift, foerste_udgivelse, varianter, noter, noter_ordlyd) values');
  ud.push(robotter.map((r) => `  (${sqlStr(r.slug)}, ${sqlStr(r.navn)}, ${sqlStr(r.producent)}, ` +
    `${sqlStr(r.producentland)}, ${sqlStr(r.producentby)}, ${sqlEnum(r.status)}, ${sqlStr(r.fremdrift)}, ${sqlNum(r.foerste_udgivelse)}, ` +
    `${sqlTextArray(r.varianter)}, ${sqlJsonb(r.noter)}, ${sqlJsonb(r.noter_ordlyd)})`).join(',\n') + ';\n');

  // forgaenger_robot_id saettes i et andet trin, fordi den peger PAA robotter
  // og alle raekker skal findes, foer opslaget kan laves.
  const medForgaenger = robotter.filter((r) => r.forgaenger);
  if (medForgaenger.length) {
    ud.push(medForgaenger.map((r) =>
      `update robotter set forgaenger_robot_id = ${robotSlugRef(r.forgaenger)} where slug = ${sqlStr(r.slug)};`
    ).join('\n') + '\n');
  }

  const feltRaekker = [];
  for (const r of robotter) {
    for (const feltnavn of FELTNAVNE) {
      const f = r.felter[feltnavn];
      feltRaekker.push(`  (${robotSlugRef(r.slug)}, ${sqlEnum(feltnavn)}, ${sqlEnum(f.form)}, ` +
        `${sqlEnum(f.tilstand ?? null)}, ${sqlNum(f.vaerdi_tal ?? null)}, ${sqlNum(f.min ?? null)}, ${sqlNum(f.maks ?? null)}, ` +
        `${sqlStr(f.vaerdi_tekst ?? null)}, ${sqlBool(f.vaerdi_bool ?? null)}, ${sqlTextArray(f.vaerdi_liste ?? null)}, ` +
        `${sqlStr(f.enhed ?? null)}, ${sqlStr(f.enhed_imperial ?? null)}, ${sqlNum(f.vaerdi_imperial ?? null)}, ` +
        `${sqlEnum(f.operator ?? null)}, ${sqlStr(f.kilde ?? null)}, ${sqlDate(f.hentet ?? null)}, ${sqlEnum(f.kildetype ?? null)}, ` +
        `${sqlStr(f.advarsel ?? null)}, ${sqlStr(f.advarsel_klasse ?? null)}, ${sqlStr(f.advarsel_ordlyd ?? null)}, ` +
        `${sqlStr(f.note ?? null)}, ${sqlStr(f.raa ?? null)}, ${sqlStr(f.valuta ?? null)}, ` +
        `${sqlEnum(f.ved_last?.tilstand ?? null)}, ${sqlNum(f.ved_last?.vaerdi ?? null)}, ${sqlStr(f.ved_last?.enhed ?? null)})`);
    }
  }
  ud.push('insert into feltposter (robot_id, feltnavn, form, tilstand, vaerdi_tal, min, maks, vaerdi_tekst, ' +
    'vaerdi_bool, vaerdi_liste, enhed, enhed_imperial, vaerdi_imperial, operator, kilde, hentet, kildetype, ' +
    'advarsel, advarsel_klasse, advarsel_ordlyd, note, raa, valuta, ved_last_tilstand, ved_last_vaerdi, ved_last_enhed) values\n' +
    feltRaekker.join(',\n') + ';\n');

  const variantRaekker = [];
  for (const r of robotter) {
    for (const feltnavn of FELTNAVNE) {
      const f = r.felter[feltnavn];
      if (!f.varianter) continue;
      for (const [navn, vaerdi] of Object.entries(f.varianter)) {
        variantRaekker.push(`  (${robotSlugRef(r.slug)}, ${sqlEnum(feltnavn)}, ${sqlStr(navn)}, ${sqlJsonb(vaerdi)})`);
      }
    }
  }
  if (variantRaekker.length) {
    ud.push('insert into feltpost_varianter (robot_id, feltnavn, variant_navn, vaerdi) values\n' +
      variantRaekker.join(',\n') + ';\n');
  }

  const anvRaekker = robotter.filter((r) => r.anvendelse).map((r) => {
    const a = r.anvendelse;
    return `  (${robotSlugRef(r.slug)}, ${sqlBool(a.er_bar_streng)}, ${sqlBool(a.er_ikke_oplyst)}, ` +
      `${sqlJsonb(a.vaerdi)}, ${sqlJsonb(a.citat)}, ${sqlJsonb(a.citat_ordlyd)}, ${sqlStr(a.kilde)}, ${sqlDate(a.hentet)}, ${sqlEnum(a.kildetype)}, ` +
      `${a.arvet_fra ? robotSlugRef(a.arvet_fra) : 'null'}, ${sqlStr(a.note)}, ${sqlStr(a.note_ordlyd)})`;
  });
  if (anvRaekker.length) {
    ud.push('insert into anvendelse (robot_id, er_bar_streng, er_ikke_oplyst, vaerdi, citat, citat_ordlyd, kilde, hentet, ' +
      'kildetype, arvet_fra_robot_id, note, note_ordlyd) values\n' + anvRaekker.join(',\n') + ';\n');
  }

  const bilRaekker = robotter.filter((r) => r.billede).map((r) => {
    const b = r.billede;
    return `  (${robotSlugRef(r.slug)}, ${sqlStr(b.fil)}, ${sqlEnum(b.ophav)}, ${sqlStr(b.kilde)}, ${sqlDate(b.hentet)}, ` +
      `${sqlStr(b.alt)}, ${sqlStr(b.note)}, ${b.delt_med ? robotSlugRef(b.delt_med) : 'null'}, ${sqlBool(b.plade)}, ${sqlStr(b.pos)})`;
  });
  if (bilRaekker.length) {
    ud.push('insert into billede (robot_id, fil, ophav, kilde, hentet, alt, note, delt_med_robot_id, plade, pos) values\n' +
      bilRaekker.join(',\n') + ';\n');
  }

  // feltdefinitioner udledes direkte af FELTER — den mekaniske haandhaevelse
  // af "databaseskemaet skal udledes af skemaet, ikke opfindes" (opgavebrevet).
  const defRaekker = FELTNAVNE.map((navn) => {
    const spec = FELTER[navn];
    return `  (${sqlEnum(navn)}, ${sqlStr(spec.gruppe)}, ${sqlStr(spec.art)}, ${sqlStr(spec.type ?? null)}, ` +
      `${sqlStr(spec.ogsaaType ?? null)}, ${sqlBool(!!spec.kraeverVedLast)}, ${sqlBool(!!spec.d4)}, ` +
      `${sqlBool(KATALOG_FELTER.includes(navn))}, ${sqlBool(FILTER_FELTER.includes(navn))})`;
  });
  ud.push('insert into feltdefinitioner (feltnavn, gruppe, art, dimension, ogsaa_dimension, kraever_ved_last, ' +
    'd4_beroert, katalogfelt, filterfelt) values\n' + defRaekker.join(',\n') + ';\n');

  ud.push('commit;');
  return ud.join('\n');
}

/**
 * Bygger ÉN feltpost-raekke i det JSON-format, --til-db's POST mod
 * PostgREST bruger (db/skema.sql's feltposter-kolonner, samme facon som
 * byggSeedSql's SQL-raekke ovenfor, men som et almindeligt objekt i stedet
 * for en SQL-tekststreng). Udtrukket til sin egen funktion (spor/dbklasse,
 * punkt 3), saa den kan efterproeves UDEN netvaerk — tilDb() kaldte den
 * tidligere som en inline objektliteral midt i en async funktion, hvor et
 * testscript ikke kunne naa den uden ogsaa at kalde fetch().
 */
function byggFeltpostRaekkeTilDb(f, feltnavn, robotId) {
  return {
    robot_id: robotId, feltnavn, form: f.form, tilstand: f.tilstand ?? null,
    vaerdi_tal: f.vaerdi_tal ?? null, min: f.min ?? null, maks: f.maks ?? null,
    vaerdi_tekst: f.vaerdi_tekst ?? null, vaerdi_bool: f.vaerdi_bool ?? null,
    vaerdi_liste: f.vaerdi_liste ?? null, enhed: f.enhed ?? null, enhed_imperial: f.enhed_imperial ?? null,
    vaerdi_imperial: f.vaerdi_imperial ?? null, operator: f.operator ?? null, kilde: f.kilde ?? null,
    hentet: f.hentet ?? null, kildetype: f.kildetype ?? null, advarsel: f.advarsel ?? null,
    advarsel_klasse: f.advarsel_klasse ?? null, advarsel_ordlyd: f.advarsel_ordlyd ?? null,
    note: f.note ?? null, raa: f.raa ?? null, valuta: f.valuta ?? null,
    ved_last_tilstand: f.ved_last?.tilstand ?? null, ved_last_vaerdi: f.ved_last?.vaerdi ?? null,
    ved_last_enhed: f.ved_last?.enhed ?? null,
  };
}

/* ------------------------------------------------------- --til-db (stub) */

/** Egen, minimal .env-laeser. Ingen npm-pakke (dotenv) — projektet er
 *  afhaengighedsfrit. Laeser NOEGLE=VAeRDI-linjer, ignorerer kommentarer
 *  og tomme linjer, overskriver ikke variabler, der allerede er sat. */
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

/* --------------------------------------------------------------- vagten */

/** Skriver én vaerdi til rapportformatet "DB "<v>" vs YAML "<v>"" — strenge
 *  skrives raat (uden ekstra JSON-citering, formatet laegger selv citaterne
 *  udenom), tal/bool som deres egen String(), objekter/lister som JSON, og
 *  null/undefined som den synlige streng "null" (ellers ville "" og "null"
 *  se ens ud i rapporten). */
function formatVaerdi(v) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'string') return v;
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

/** Graver videre i to vaerdier, der dybtLig() allerede har afgjort er
 *  UENS, for at finde den/de konkrete bladsti(er) og de to bladvaerdier —
 *  dybtLig alene fortaeller kun "typeforskel"/"listelaengde" til
 *  fejlsoegning, ikke de faktiske vaerdier en redaktoer skal kunne laese.
 *  Rekurserer parallelt med dybtLig's egne regler (samme kort/liste/blad-
 *  afgoerelser), saa "er de uens" og "hvor er de uens" aldrig kan skride
 *  fra hinanden. */
function findAfvigelser(dbVaerdi, yamlVaerdi, sti, slug, ud) {
  if (dybtLig(dbVaerdi, yamlVaerdi)) return;

  if (erKort(dbVaerdi) && erKort(yamlVaerdi)) {
    const noegler = new Set([...Object.keys(dbVaerdi), ...Object.keys(yamlVaerdi)]);
    for (const n of [...noegler].sort()) {
      findAfvigelser(dbVaerdi[n] ?? null, yamlVaerdi[n] ?? null, sti ? `${sti}.${n}` : n, slug, ud);
    }
    return;
  }
  if (Array.isArray(dbVaerdi) && Array.isArray(yamlVaerdi) && dbVaerdi.length === yamlVaerdi.length) {
    for (let i = 0; i < dbVaerdi.length; i++) {
      findAfvigelser(dbVaerdi[i], yamlVaerdi[i], `${sti}[${i}]`, slug, ud);
    }
    return;
  }
  // Bladniveau, eller en strukturel forskel (liste vs. ikke-liste, forskellig
  // listelaengde, ...), som ikke kan graves laengere ned i — rapportér HELE
  // undertraeet paa dette sted som ét afvigende blad.
  ud.push({ slug, sti: sti || '(hele robotten)', db: formatVaerdi(dbVaerdi), yaml: formatVaerdi(yamlVaerdi) });
}

/**
 * VAGTEN's rene sammenligningsfunktion (L35, STATUS.md). Sammenligner
 * DB'ens nuvaerende indhold (samme kanoniske, slug-noeglede form, fraDb()
 * returnerer) mod YAML-kildernes kanoniske form (samme `robotter`-argument,
 * tilDb() selv modtager fra klassificerRobot()) — begge sider er ALLEREDE
 * paa den form, db/kanonisk.json selv bruger, saa der er ingen tredje,
 * uprøvet normalisering imellem dem.
 *
 * Bruger dybtLig (db/rundtur.mjs) til selve ja/nej-afgoerelsen paa hvert
 * delfelt — praecis den samme regel, "RUNDTUR BESTAAET" allerede staar paa
 * — og finder derefter, via findAfvigelser, den konkrete feltsti og de to
 * vaerdier for hvert punkt, hvor de er uenige.
 *
 * Ren funktion: ingen fetch, ingen filsystem — testes derfor uden netvaerk
 * og uden .env (tests/koer.mjs's afsnit 7).
 *
 * Returnerer en liste af { slug, sti, db, yaml }. Tom liste = ingen
 * afvigelse (databasen er, feltvis, den samme, YAML'en siger).
 */
function sammenlignDbMedYaml(dbRobotter, yamlRobotter, modLabel = 'data/robots/') {
  const afvigelser = [];
  const dbPrSlug = new Map(dbRobotter.map((r) => [r.slug, r]));
  const yamlPrSlug = new Map(yamlRobotter.map((r) => [r.slug, r]));
  const alleSlugs = new Set([...dbPrSlug.keys(), ...yamlPrSlug.keys()]);
  for (const slug of [...alleSlugs].sort()) {
    const dbR = dbPrSlug.get(slug);
    const yamlR = yamlPrSlug.get(slug);
    if (dbR === undefined || yamlR === undefined) {
      afvigelser.push({
        slug, sti: '(hele robotten)',
        db: dbR === undefined ? 'mangler i DB' : 'findes i DB',
        yaml: yamlR === undefined ? `mangler i ${modLabel}` : `findes i ${modLabel}`,
      });
      continue;
    }
    findAfvigelser(dbR, yamlR, '', slug, afvigelser);
  }
  return afvigelser;
}

/**
 * VAGTENS BESLUTNINGSFUNKTION (Å14). Ren funktion: intet fetch, intet
 * filsystem — testes derfor uden netvaerk og uden .env (tests/koer.mjs's
 * afsnit 7, som denne funktion nu er den centrale del af).
 *
 * Afgoer, om --til-db maa fortsaette, givet:
 *   - dbRobotter: databasens NUVAeRENDE indhold (fraDb()'s kanoniske form).
 *   - aftrykRobotter: den kanoniske robotter-struktur, GEMT ved seneste
 *     vellykkede --til-db (synk_aftryk.aftryk, db/skema.sql's afsnit 7) —
 *     eller null, hvis der endnu ikke findes noget aftryk.
 *   - yamlRobotter: YAML-kildernes nuvaerende kanoniske form
 *     (klassificerRobot() paa hele data/robots/).
 *
 * REGLERNE (Å14, STATUS.md — retter L35's foerste udgave, som naegtede paa
 * BEGGE de tilfaelde, den skulle adskille):
 *   1. En TOM database har intet at miste — naegter aldrig.
 *   2. Findes der et aftryk, sammenlignes DATABASEN MOD AFTRYKKET — IKKE mod
 *      YAML. Matcher de, er databasen uroert siden sidste migrering, og det
 *      er derfor underordnet, hvor meget YAML selv er rykket videre (det
 *      normale agent-tilfaelde: nye robotter tilfoejet, intet at miste).
 *      Afviger de, er databasen redigeret uden om YAML siden sidst
 *      (Studio-tilfaeldet) — naegt, med de praecise afvigelser (slug +
 *      feltsti + de to vaerdier).
 *   3. Findes der IKKE et aftryk endnu (foerste koersel efter Å14, eller
 *      synk_aftryk er ikke oprettet endnu i den live database), er der
 *      ingen kendt "senest synkede" tilstand at maale databasen mod —
 *      funktionen falder da tilbage til den GAMLE sammenligning (databasen
 *      mod YAML), praecis som vagten opfoerte sig foer Å14. Det er en
 *      bevidst, midlertidig tilstand: naeste vellykkede koersel gemmer et
 *      aftryk (skrivAftryk nedenfor), og fald-tilbage-grenen rammes ikke
 *      igen, foer synk_aftryk er tom af en anden grund.
 *
 * Returnerer { naegt, afvigelser, kilde }, hvor kilde er
 * 'tom-database' | 'aftryk' | 'yaml-fallback'.
 */
function afgoerVagt(dbRobotter, aftrykRobotter, yamlRobotter) {
  if (dbRobotter.length === 0) {
    return { naegt: false, afvigelser: [], kilde: 'tom-database' };
  }
  if (aftrykRobotter === null) {
    const afvigelser = sammenlignDbMedYaml(dbRobotter, yamlRobotter);
    return { naegt: afvigelser.length > 0, afvigelser, kilde: 'yaml-fallback' };
  }
  const afvigelser = sammenlignDbMedYaml(dbRobotter, aftrykRobotter, 'aftrykket');
  return { naegt: afvigelser.length > 0, afvigelser, kilde: 'aftryk' };
}

/**
 * Skriver robotterne til et rigtigt Supabase-projekt via fetch mod PostgREST.
 * Kaldes kun naar --til-db er sat PAA kommandolinjen. Kraever SUPABASE_URL og
 * SUPABASE_SERVICE_ROLE_KEY i .env (se db/LAESMIG.md).
 *
 * REST-mønsteret: POST til <SUPABASE_URL>/rest/v1/<tabel> med
 *   headers: apikey + Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>,
 *            Content-Type: application/json, Prefer: return=representation
 *   body: JSON-array af raekker.
 * service_role omgaar RLS (db/skema.sql's afsnit 7), saa denne vej kraever
 * IKKE en policy — men noeglen maa ALDRIG bruges andre steder end her og i
 * db/eksporter.mjs's --fra-db, og ALDRIG i en offentlig klient.
 *
 * GENKOeRSELSSTRATEGI: toem-og-genindlaes (ikke upsert). Migreringen ER
 * redaktionslagets FULDE indlaesning (opgavebrevets egen formulering), ikke
 * en inkrementel sync — der er intet krav om at bevare raekker, en fjernet
 * YAML-fil ikke laengere leverer. Upsert paa slug/unikke noegler ville kraeve
 * en SLETNINGSdetektion oveni (hvilke DB-raekker svarer IKKE laengere til en
 * fil?), som toem-og-genindlaes faar gratis: DB'en efter koerslen er PRAeCIS
 * det, data/robots/ siger, hverken mere eller mindre. Prisen er, at de
 * generede `id`-vaerdier IKKE er stabile paa tvaers af koersler (identity-
 * sekvensen fortsaetter, den nulstilles ikke af DELETE) — men id er den
 * TEKNISKE noegle (db/skema.sql's egen begrundelse), slug er den
 * FORRETNINGSMAeSSIGE, og intet uden for denne proces gemmer et id paa
 * tvaers af koersler.
 *
 * SLETNINGSRAeKKEFOeLGE (boern foer foraeldre, PLUS et saerligt hensyn til
 * selvreferencen): feltpost_varianter -> feltposter -> anvendelse -> billede
 * -> robotter -> feltdefinitioner (uafhaengig, ingen FK). robotter.
 * forgaenger_robot_id er en SELVreference uden "on delete cascade" (default
 * NO ACTION) — at slette alle raekker i én DELETE-saetning risikerer at
 * Postgres tjekker FK'en foer alle de refererede raekker selv er vaek, saa
 * forgaenger_robot_id nulstilles FOeRST med en UPDATE, for at goere sletningen
 * uafhaengig af Postgres' interne raekkefoelge inden for saetningen.
 *
 * POSTGREST-OVERRASKELSE 1: DELETE uden filter afvises haardt (400, "DELETE
 * requires a WHERE clause", kode 21000) — Supabase/PostgREST kraever et
 * filter paa enhver DELETE/UPDATE, ogsaa naar service_role omgaar RLS. Fixet
 * med et filter, der matcher enhver raekke: "<NOT NULL-kolonne>=not.is.null".
 *
 * VAGTEN (Å14, revideret fra L35's oprindelige udgave, STATUS.md): foer
 * toem-og-genindlaes overhovedet starter, laeses DB'ens NUVAeRENDE indhold
 * (samme kodevej som eksporter.mjs's --fra-db) og sammenlignes — IKKE mod
 * `robotter` (YAML'ens nuvaerende tilstand, som L35's foerste udgave gjorde),
 * men mod AFTRYKKET af den tilstand, seneste vellykkede --til-db selv
 * skrev (synk_aftryk, db/skema.sql's afsnit 7). Det er praecis den
 * retningsforskel, Å14 blev fundet af: L35's udgave naegtede lige saa
 * haardt, naar et agent-spor blot havde rykket YAML videre (databasen har
 * intet at miste), som naar Supabase Studio faktisk var redigeret
 * (databasen KAN miste noget) — og et rutineflag, der beskytter mod begge
 * dele, beskytter reelt mod ingen af dem. Se afgoerVagt() nedenfor for selve
 * beslutningen som en ren, testbar funktion (inkl. fald-tilbage-reglen, naar
 * intet aftryk findes endnu). Afviger databasen fra aftrykket, stopper
 * funktionen UDEN at kalde del()/patch() en eneste gang. --overskriv-
 * databasen paa kommandolinjen springer vagten over med vilje. En TOM
 * database (0 robotter) har intet at miste og stopper ikke.
 */

/**
 * Laeser den ENE raekke fra synk_aftryk (Å14) — se db/skema.sql's afsnit 7
 * for singleton-begrundelsen. Returnerer null i TO tilfaelde, som funktionen
 * bevidst ikke skelner mellem: "tabellen findes ikke endnu" (den opdaterede
 * db/skema.sql er ikke koert i den live database) og "tabellen findes, men
 * er tom" (foerste --til-db efter Å14 er ikke koert faerdig endnu) — begge
 * betyder for kaldstedet praecis det samme: "intet aftryk at sammenligne
 * imod", og afgoerVagt() falder da tilbage til at sammenligne mod YAML (se
 * den funktions kommentar). Fejler selve HTTP-kaldet (netvaerk, forkert
 * noegle), behandles det IKKE som "intet aftryk" — en uventet fejl her
 * kastes videre, saa den ikke kan forveksles med en legitim fald-tilbage.
 */
async function laesAftryk(url, headers) {
  const svar = await fetch(`${url}/rest/v1/synk_aftryk?select=aftryk,robotantal,opdateret&limit=1`, { headers });
  if (!svar.ok) {
    const krop = await svar.text();
    // PostgREST svarer 404 (ofte med kode PGRST205, "Could not find the
    // table ... in the schema cache") naar tabellen slet ikke findes endnu
    // — det er den FORVENTEDE tilstand, foer JPK har koert den opdaterede
    // db/skema.sql i den live database, og skal IKKE stoppe migreringen.
    // Ethvert andet fejlsvar (401/500/...) er derimod uventet og kastes.
    if (svar.status === 404) {
      console.log(`  vagt: synk_aftryk findes ikke endnu (404) — behandler som "intet aftryk" (fald-tilbage til YAML). Kør den opdaterede db/skema.sql for at faa fingeraftryksvagten fuldt ud.`);
      return null;
    }
    throw new Error(`GET synk_aftryk fejlede: ${svar.status} ${krop}`);
  }
  const raekker = await svar.json();
  return raekker.length ? raekker[0] : null;
}

/**
 * Gemmer aftrykket af den robotter-struktur, --til-db LIGE HAR skrevet,
 * i synk_aftryk (slet-og-genindsaet, samme toem-og-genindlaes-princip som
 * resten af tabellerne — se db/skema.sql's afsnit 7). Kaldes KUN efter hele
 * toem-og-genindlaes-sekvensen er lykkedes, saa et aftryk aldrig kan pege
 * paa en migrering, der reelt fejlede undervejs.
 *
 * BEVIDST IKKE-FATAL: fejler dette skridt (typisk fordi synk_aftryk ikke
 * findes endnu i den live database), er selve robotdata-migreringen
 * ALLEREDE gennemfoert og committet — at lade aftryksskrivningen fejle
 * migreringen ville goere en NY sikkerhedsforanstaltning til en aarsag til
 * falske fejl paa en ellers vellykket koersel. Naeste koersel falder blot
 * tilbage til YAML-sammenligningen (afgoerVagt's 'yaml-fallback'-gren),
 * indtil synk_aftryk findes og et aftryk er gemt.
 */
async function skrivAftryk(url, headers, robotter) {
  try {
    await fetch(`${url}/rest/v1/synk_aftryk?id=not.is.null`, { method: 'DELETE', headers });
    const svar = await fetch(`${url}/rest/v1/synk_aftryk`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify([{ id: true, aftryk: robotter, robotantal: robotter.length }]),
    });
    if (!svar.ok) throw new Error(`${svar.status} ${await svar.text()}`);
    console.log(`  vagt: aftryk gemt (${robotter.length} robotter) — naeste koersel sammenligner databasen mod DETTE, ikke mod YAML.`);
  } catch (e) {
    console.log(`  vagt: KUNNE IKKE gemme aftrykket (${e.message}) — selve migreringen er alligevel gennemfoert. ` +
      'Naeste koersel falder tilbage til at sammenligne mod YAML, indtil synk_aftryk findes (kør den opdaterede db/skema.sql) og et aftryk er gemt.');
  }
}

async function tilDb(robotter, argv = []) {
  laesDotEnv(path.join(ROD, '.env'));
  const url = process.env.SUPABASE_URL;
  const noegle = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !noegle) {
    console.error('--til-db kraever SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY i .env (se db/LAESMIG.md).');
    return 1;
  }
  const headers = { apikey: noegle, Authorization: `Bearer ${noegle}`, 'Content-Type': 'application/json' };

  if (!argv.includes('--overskriv-databasen')) {
    console.log('  vagt: laeser DB\'ens nuvaerende indhold ...');
    const dbRobotter = await fraDb();
    if (dbRobotter === null) {
      // Kan i praksis ikke ske her (url/noegle er lige valideret ovenfor),
      // men fraDb() KAN returnere null (manglende .env) — fejl hoejlydt frem
      // for at lade en null-vaerdi glide videre ind i sammenligningen.
      console.error('VAGT: kunne ikke laese databasens nuvaerende indhold (fraDb() gav null, uventet).');
      return 1;
    }
    const aftrykRaekke = dbRobotter.length === 0 ? null : await laesAftryk(url, headers);
    const beslutning = afgoerVagt(dbRobotter, aftrykRaekke ? aftrykRaekke.aftryk : null, robotter);
    if (beslutning.naegt) {
      const forklaring = beslutning.kilde === 'aftryk'
        ? 'databasen er aendret siden seneste --til-db (sammenlignet mod det gemte aftryk i synk_aftryk) — en Studio-redigering ville blive slettet af en genindlaesning.'
        : 'intet aftryk findes endnu i synk_aftryk, saa vagten faldt tilbage til den gamle sammenligning (databasen mod data/robots/), og de to er uenige.';
      console.error(`VAGT: ${forklaring}`);
      const modLabel = beslutning.kilde === 'aftryk' ? 'AFTRYK' : 'YAML';
      for (const a of beslutning.afvigelser.slice(0, 20)) {
        console.error(`  ${a.slug}: ${a.sti} — DB "${a.db}" vs ${modLabel} "${a.yaml}"`);
      }
      if (beslutning.afvigelser.length > 20) console.error(`  ... og ${beslutning.afvigelser.length - 20} flere`);
      console.error('Koer db/eksporter.mjs --fra-db foerst, eller gentag med --overskriv-databasen hvis aendringerne skal kasseres.');
      return 1;
    }
    if (beslutning.kilde === 'tom-database') {
      console.log('  vagt: databasen er tom, intet at miste — fortsaetter.');
    } else if (beslutning.kilde === 'aftryk') {
      console.log(`  vagt: databasen (${dbRobotter.length} robotter) matcher aftrykket fra seneste migrering — fortsaetter, uanset hvor langt data/robots/ selv er rykket.`);
    } else {
      console.log(`  vagt: intet aftryk fundet endnu i synk_aftryk — databasen (${dbRobotter.length} robotter) matcher data/robots/ (fald-tilbage, foerste koersel efter Å14) — fortsaetter.`);
    }
  } else {
    console.log('  vagt: sprunget over (--overskriv-databasen).');
  }

  async function del(tabel, matchAltKolonne) {
    const svar = await fetch(`${url}/rest/v1/${tabel}?${matchAltKolonne}=not.is.null`, { method: 'DELETE', headers });
    if (!svar.ok) throw new Error(`DELETE ${tabel} fejlede: ${svar.status} ${await svar.text()}`);
  }
  async function patch(tabel, filter, body) {
    const svar = await fetch(`${url}/rest/v1/${tabel}?${filter}`, { method: 'PATCH', headers, body: JSON.stringify(body) });
    if (!svar.ok) throw new Error(`PATCH ${tabel} fejlede: ${svar.status} ${await svar.text()}`);
  }
  async function post(tabel, raekker, { repraesentation = false } = {}) {
    if (!raekker.length) return [];
    const h = repraesentation ? { ...headers, Prefer: 'return=representation' } : headers;
    const svar = await fetch(`${url}/rest/v1/${tabel}`, { method: 'POST', headers: h, body: JSON.stringify(raekker) });
    if (!svar.ok) throw new Error(`POST ${tabel} fejlede (${raekker.length} raekker): ${svar.status} ${await svar.text()}`);
    return repraesentation ? svar.json() : [];
  }

  console.log('  toemmer eksisterende raekker (toem-og-genindlaes — se funktionens kommentar for begrundelsen) ...');
  await del('feltpost_varianter', 'robot_id');
  await del('feltposter', 'robot_id');
  await del('anvendelse', 'robot_id');
  await del('billede', 'robot_id');
  await patch('robotter', 'id=not.is.null', { forgaenger_robot_id: null }); // loes selvreferencen foer sletning
  await del('robotter', 'id');
  await del('feltdefinitioner', 'feltnavn');

  // 1. robotter FOeRST, med Prefer: return=representation for at faa de
  // genererede id'er tilbage — resten af tabellerne peger via robot_id/
  // *_robot_id og kan foerst skrives, naar dette opslag findes.
  const indsatte = await post('robotter', robotter.map((r) => ({
    slug: r.slug, navn: r.navn, producent: r.producent, producentland: r.producentland,
    producentby: r.producentby, status: r.status, fremdrift: r.fremdrift, foerste_udgivelse: r.foerste_udgivelse,
    varianter: r.varianter, noter: r.noter, noter_ordlyd: r.noter_ordlyd,
  })), { repraesentation: true });
  const slugTilId = new Map(indsatte.map((r) => [r.slug, r.id]));
  if (slugTilId.size !== robotter.length) {
    throw new Error(`Forventede ${robotter.length} indsatte robotter, PostgREST returnerede ${slugTilId.size}.`);
  }

  // 2. forgaenger_robot_id: ANDET pas, fordi den kraever robottens EGEN nye
  // id, som lige er blevet genereret ovenfor. Kun 1/62 i data i dag.
  for (const r of robotter.filter((r) => r.forgaenger)) {
    const forgaengerId = slugTilId.get(r.forgaenger);
    if (!forgaengerId) throw new Error(`${r.slug}: forgaenger "${r.forgaenger}" findes ikke i slug->id-opslaget.`);
    await patch('robotter', `slug=eq.${encodeURIComponent(r.slug)}`, { forgaenger_robot_id: forgaengerId });
  }

  // 3. feltposter — 62 x 30 = 1860 raekker, ÉN POST-request (afproevet:
  // PostgREST tog imod alle 1860 i ét kald uden at chunke eller time ud).
  const feltRaekker = [];
  for (const r of robotter) {
    const robotId = slugTilId.get(r.slug);
    for (const feltnavn of FELTNAVNE) {
      feltRaekker.push(byggFeltpostRaekkeTilDb(r.felter[feltnavn], feltnavn, robotId));
    }
  }
  await post('feltposter', feltRaekker);

  // 4. feltpost_varianter — kraever, at feltposter allerede findes (den
  // sammensatte FK er (robot_id, feltnavn) references feltposter).
  const variantRaekker = [];
  for (const r of robotter) {
    const robotId = slugTilId.get(r.slug);
    for (const feltnavn of FELTNAVNE) {
      const f = r.felter[feltnavn];
      if (!f.varianter) continue;
      for (const [navn, vaerdi] of Object.entries(f.varianter)) {
        variantRaekker.push({ robot_id: robotId, feltnavn, variant_navn: navn, vaerdi });
      }
    }
  }
  await post('feltpost_varianter', variantRaekker);

  // 5. anvendelse — arvet_fra_robot_id kraever samme slug->id-opslag.
  const anvRaekker = robotter.filter((r) => r.anvendelse).map((r) => {
    const a = r.anvendelse;
    return {
      robot_id: slugTilId.get(r.slug), er_bar_streng: a.er_bar_streng, er_ikke_oplyst: a.er_ikke_oplyst,
      vaerdi: a.vaerdi, citat: a.citat, citat_ordlyd: a.citat_ordlyd, kilde: a.kilde, hentet: a.hentet, kildetype: a.kildetype,
      arvet_fra_robot_id: a.arvet_fra ? slugTilId.get(a.arvet_fra) : null, note: a.note, note_ordlyd: a.note_ordlyd,
    };
  });
  await post('anvendelse', anvRaekker);

  // 6. billede — delt_med_robot_id kraever samme opslag.
  const bilRaekker = robotter.filter((r) => r.billede).map((r) => {
    const b = r.billede;
    return {
      robot_id: slugTilId.get(r.slug), fil: b.fil, ophav: b.ophav, kilde: b.kilde, hentet: b.hentet,
      alt: b.alt, note: b.note, delt_med_robot_id: b.delt_med ? slugTilId.get(b.delt_med) : null,
      plade: b.plade, pos: b.pos,
    };
  });
  await post('billede', bilRaekker);

  // 7. feltdefinitioner — uafhaengig af robotter, udledt direkte af FELTER.
  const defRaekker = FELTNAVNE.map((navn) => {
    const spec = FELTER[navn];
    return {
      feltnavn: navn, gruppe: spec.gruppe, art: spec.art, dimension: spec.type ?? null,
      ogsaa_dimension: spec.ogsaaType ?? null, kraever_ved_last: !!spec.kraeverVedLast,
      d4_beroert: !!spec.d4, katalogfelt: KATALOG_FELTER.includes(navn), filterfelt: FILTER_FELTER.includes(navn),
    };
  });
  await post('feltdefinitioner', defRaekker);

  console.log(`  ${slugTilId.size} robotter · ${feltRaekker.length} feltposter · ${variantRaekker.length} varianter · ` +
    `${anvRaekker.length} anvendelser · ${bilRaekker.length} billeder · ${defRaekker.length} feltdefinitioner skrevet.`);

  // Aftrykket gemmes SIDST, kun naar hele toem-og-genindlaes-sekvensen ovenfor
  // er lykkedes (se skrivAftryk's kommentar for hvorfor et fejlslagent forsoeg
  // her ikke maa faelde en ellers vellykket migrering).
  await skrivAftryk(url, headers, robotter);

  return 0;
}

/* --------------------------------------------------------------- main */

async function main(argv) {
  tjekEnumDrift();

  const dataMappe = path.join(ROD, 'data/robots');

  const ukendteNoegler = tjekFeltpostNoeglerKendt(dataMappe);
  if (ukendteNoegler.size) {
    console.error('VAGT 2: fandt feltpost-noegle(r), INGEN kopisted i db/migrer.mjs/db/eksporter.mjs kender:');
    for (const [noegle, steder] of ukendteNoegler) {
      console.error(`  "${noegle}" — ${steder.length} forekomst(er), fx ${steder.slice(0, 3).join(', ')}`);
    }
    console.error('Foej noeglen til FELTPOST_NOEGLER_KENDT OG til de faktiske kopisteder ' +
      '(klassificerFeltpost/byggSeedSql/byggFeltpostRaekkeTilDb her, omdanFeltpostFraDb/byggFeltpostVaerdi i ' +
      'db/eksporter.mjs) foer migrering fortsaetter — ellers forsvinder noeglens data tavst, praecis som ' +
      'advarsel_klasse gjorde (spor/dbklasse).');
    return 1;
  }

  console.log(`Validerer ${findFiler(dataMappe).length} fil(er) foer migrering ...`);
  if (validerMain([`--data=${dataMappe}`]) !== 0) {
    console.error('\nMigrering stoppet: validatoren fandt fejl. Ingen DB-filer skrevet.');
    return 1;
  }

  const filer = findFiler(dataMappe);
  const robotter = filer.map((f) => {
    const doc = normaliserRobot(parseYaml(fs.readFileSync(f, 'utf8'), f));
    return klassificerRobot(doc);
  });
  robotter.sort((a, b) => a.slug.localeCompare(b.slug));

  if (argv.includes('--til-db')) return tilDb(robotter, argv);

  const kanoniskFil = path.join(ROD, 'db/kanonisk.json');
  fs.writeFileSync(kanoniskFil, JSON.stringify({ genereret: new Date().toISOString().slice(0, 10), robotter }, null, 2), 'utf8');

  const seedFil = path.join(ROD, 'db/seed.sql');
  fs.writeFileSync(seedFil, byggSeedSql(robotter), 'utf8');

  console.log(`\n${robotter.length} robotter migreret (lokal tilstand, ingen DB findes endnu):`);
  console.log(`  db/kanonisk.json — ${fs.statSync(kanoniskFil).size} bytes`);
  console.log(`  db/seed.sql — ${fs.statSync(seedFil).size} bytes`);
  return 0;
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('migrer.mjs');
if (erHoved) {
  main(process.argv.slice(2)).then((k) => process.exit(k)).catch((e) => {
    console.error(String(e && e.stack ? e.stack : e));
    process.exit(1);
  });
}

export {
  klassificerRobot, klassificerFeltpost, tjekEnumDrift, FELTNAVN_ENUM_I_SKEMA_SQL,
  sammenlignDbMedYaml, afgoerVagt,
  byggSeedSql, byggFeltpostRaekkeTilDb, tjekFeltpostNoeglerKendt, FELTPOST_NOEGLER_KENDT,
};
