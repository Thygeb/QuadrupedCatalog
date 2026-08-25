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
    };
  } else {
    const faelles = {
      enhed: post.enhed ?? null, enhed_imperial: post.enhed_imperial ?? null,
      vaerdi_imperial: post.vaerdi_imperial ?? null, operator: post.operator ?? null,
      kilde: post.kilde ?? null, hentet: post.hentet ?? null, kildetype: post.kildetype ?? null,
      advarsel: post.advarsel ?? null, note: post.note ?? null, raa: post.raa ?? null,
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
 *  slug-noeglede form, db/kanonisk.json og db/seed.sql begge bygges af. */
function klassificerRobot(doc) {
  const felter = {};
  for (const feltnavn of FELTNAVNE) {
    const post = doc.felter[feltnavn];
    if (post === undefined) throw new Error(`${doc.slug}: felt "${feltnavn}" mangler efter validering — kan ikke ske`);
    felter[feltnavn] = klassificerFeltpost(feltnavn, post, FELTER[feltnavn]);
  }

  let anvendelse = null;
  if (doc.anvendelse !== undefined) {
    const a = doc.anvendelse;
    if (typeof a === 'string') {
      anvendelse = { er_bar_streng: true, er_ikke_oplyst: true, vaerdi: null, citat: null,
        kilde: null, hentet: null, kildetype: null, arvet_fra: null, note: null };
    } else {
      const erIkkeOplyst = (Array.isArray(a.vaerdi) ? a.vaerdi.length === 1 && tilstandAf(a.vaerdi[0]) === 'ikke_oplyst'
        : tilstandAf(a.vaerdi) === 'ikke_oplyst');
      anvendelse = {
        er_bar_streng: false, er_ikke_oplyst: erIkkeOplyst,
        vaerdi: erIkkeOplyst ? null : (a.vaerdi ?? null),
        citat: erIkkeOplyst ? null : (a.citat ?? null),
        kilde: a.kilde ?? null, hentet: a.hentet ?? null, kildetype: a.kildetype ?? null,
        arvet_fra: a.arvet_fra ?? null, note: a.note ?? null,
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
    producentby: doc.producentby ?? null, status: doc.status,
    foerste_udgivelse: doc.foerste_udgivelse ?? null, forgaenger: doc.forgaenger ?? null,
    varianter: doc.varianter ?? null, noter: doc.noter ?? null,
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

  ud.push('insert into robotter (slug, navn, producent, producentland, producentby, status, foerste_udgivelse, varianter, noter) values');
  ud.push(robotter.map((r) => `  (${sqlStr(r.slug)}, ${sqlStr(r.navn)}, ${sqlStr(r.producent)}, ` +
    `${sqlStr(r.producentland)}, ${sqlStr(r.producentby)}, ${sqlEnum(r.status)}, ${sqlNum(r.foerste_udgivelse)}, ` +
    `${sqlTextArray(r.varianter)}, ${sqlJsonb(r.noter)})`).join(',\n') + ';\n');

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
        `${sqlStr(f.advarsel ?? null)}, ${sqlStr(f.note ?? null)}, ${sqlStr(f.raa ?? null)}, ${sqlStr(f.valuta ?? null)}, ` +
        `${sqlEnum(f.ved_last?.tilstand ?? null)}, ${sqlNum(f.ved_last?.vaerdi ?? null)}, ${sqlStr(f.ved_last?.enhed ?? null)})`);
    }
  }
  ud.push('insert into feltposter (robot_id, feltnavn, form, tilstand, vaerdi_tal, min, maks, vaerdi_tekst, ' +
    'vaerdi_bool, vaerdi_liste, enhed, enhed_imperial, vaerdi_imperial, operator, kilde, hentet, kildetype, ' +
    'advarsel, note, raa, valuta, ved_last_tilstand, ved_last_vaerdi, ved_last_enhed) values\n' +
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
      `${sqlJsonb(a.vaerdi)}, ${sqlJsonb(a.citat)}, ${sqlStr(a.kilde)}, ${sqlDate(a.hentet)}, ${sqlEnum(a.kildetype)}, ` +
      `${a.arvet_fra ? robotSlugRef(a.arvet_fra) : 'null'}, ${sqlStr(a.note)})`;
  });
  if (anvRaekker.length) {
    ud.push('insert into anvendelse (robot_id, er_bar_streng, er_ikke_oplyst, vaerdi, citat, kilde, hentet, ' +
      'kildetype, arvet_fra_robot_id, note) values\n' + anvRaekker.join(',\n') + ';\n');
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
function sammenlignDbMedYaml(dbRobotter, yamlRobotter) {
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
        yaml: yamlR === undefined ? 'mangler i data/robots/' : 'findes i data/robots/',
      });
      continue;
    }
    findAfvigelser(dbR, yamlR, '', slug, afvigelser);
  }
  return afvigelser;
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
 * VAGTEN (L35, STATUS.md): foer toem-og-genindlaes overhovedet starter,
 * laeses DB'ens NUVAeRENDE indhold (samme kodevej som eksporter.mjs's
 * --fra-db) og sammenlignes (samme dybe lighed som rundtur.mjs) mod
 * `robotter` — YAML-filernes kanoniske form. Afviger de, stopper funktionen
 * UDEN at kalde del()/patch() en eneste gang: JPK's redigeringer i Supabase
 * Studio maa ikke kunne overskrives af en genkoersel, der ikke ved, de er
 * der (se db/LAESMIG.md og STATUS.md's L35 for hvorfor). --overskriv-
 * databasen paa kommandolinjen springer vagten over med vilje. En TOM
 * database (0 robotter) har intet at miste og stopper ikke.
 */
async function tilDb(robotter, argv = []) {
  laesDotEnv(path.join(ROD, '.env'));
  const url = process.env.SUPABASE_URL;
  const noegle = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !noegle) {
    console.error('--til-db kraever SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY i .env (se db/LAESMIG.md).');
    return 1;
  }

  if (!argv.includes('--overskriv-databasen')) {
    console.log('  vagt: laeser DB\'ens nuvaerende indhold og sammenligner med data/robots/ ...');
    const dbRobotter = await fraDb();
    if (dbRobotter === null) {
      // Kan i praksis ikke ske her (url/noegle er lige valideret ovenfor),
      // men fraDb() KAN returnere null (manglende .env) — fejl hoejlydt frem
      // for at lade en null-vaerdi glide videre ind i sammenligningen.
      console.error('VAGT: kunne ikke laese databasens nuvaerende indhold (fraDb() gav null, uventet).');
      return 1;
    }
    if (dbRobotter.length === 0) {
      console.log('  vagt: databasen er tom, intet at miste — fortsaetter.');
    } else {
      const afvigelser = sammenlignDbMedYaml(dbRobotter, robotter);
      if (afvigelser.length) {
        console.error('VAGT: databasen indeholder aendringer, der ikke findes i data/robots/.');
        for (const a of afvigelser.slice(0, 20)) {
          console.error(`  ${a.slug}: ${a.sti} — DB "${a.db}" vs YAML "${a.yaml}"`);
        }
        if (afvigelser.length > 20) console.error(`  ... og ${afvigelser.length - 20} flere`);
        console.error('Koer db/eksporter.mjs --fra-db foerst, eller gentag med --overskriv-databasen hvis aendringerne skal kasseres.');
        return 1;
      }
      console.log(`  vagt: databasen (${dbRobotter.length} robotter) matcher data/robots/ — fortsaetter.`);
    }
  } else {
    console.log('  vagt: sprunget over (--overskriv-databasen).');
  }

  const headers = { apikey: noegle, Authorization: `Bearer ${noegle}`, 'Content-Type': 'application/json' };

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
    producentby: r.producentby, status: r.status, foerste_udgivelse: r.foerste_udgivelse,
    varianter: r.varianter, noter: r.noter,
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
      const f = r.felter[feltnavn];
      feltRaekker.push({
        robot_id: robotId, feltnavn, form: f.form, tilstand: f.tilstand ?? null,
        vaerdi_tal: f.vaerdi_tal ?? null, min: f.min ?? null, maks: f.maks ?? null,
        vaerdi_tekst: f.vaerdi_tekst ?? null, vaerdi_bool: f.vaerdi_bool ?? null,
        vaerdi_liste: f.vaerdi_liste ?? null, enhed: f.enhed ?? null, enhed_imperial: f.enhed_imperial ?? null,
        vaerdi_imperial: f.vaerdi_imperial ?? null, operator: f.operator ?? null, kilde: f.kilde ?? null,
        hentet: f.hentet ?? null, kildetype: f.kildetype ?? null, advarsel: f.advarsel ?? null,
        note: f.note ?? null, raa: f.raa ?? null, valuta: f.valuta ?? null,
        ved_last_tilstand: f.ved_last?.tilstand ?? null, ved_last_vaerdi: f.ved_last?.vaerdi ?? null,
        ved_last_enhed: f.ved_last?.enhed ?? null,
      });
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
      vaerdi: a.vaerdi, citat: a.citat, kilde: a.kilde, hentet: a.hentet, kildetype: a.kildetype,
      arvet_fra_robot_id: a.arvet_fra ? slugTilId.get(a.arvet_fra) : null, note: a.note,
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
  return 0;
}

/* --------------------------------------------------------------- main */

async function main(argv) {
  tjekEnumDrift();

  const dataMappe = path.join(ROD, 'data/robots');
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
  sammenlignDbMedYaml,
};
