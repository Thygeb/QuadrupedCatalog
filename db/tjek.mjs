#!/usr/bin/env node
/**
 * db/tjek.mjs — projektets bevis for, at databasen og bygget siger det
 * samme (L81-L83, spor/skema, punkt 5 — erstatter db/rundtur.mjs).
 *
 * LAeS-KUN, ÉN TILSTAND: siden db/migrer.mjs er slettet (YAML -> DB findes
 * ikke laengere; databasen ER kilden), findes der ikke laengere en "lokal"
 * kaede at proeve (db/rundtur.mjs's gamle tilstand uden --live gik via en
 * lokalt genereret mellemfil, som intet skriver til laengere). db/tjek.mjs
 * har derfor kun ÉT forloeb, altid mod den RIGTIGE Supabase-instans:
 *
 *   1. node db/eksporter.mjs --fra-db --ud=db/.tmp/tjek-eksport
 *   3. tools/validate.mjs skal koere FEJLFRIT paa den eksporterede mappe.
 *   4. tools/build.mjs mod eksport-mappen skal give SAMME sidetal og
 *      kildetal som tools/build.mjs koert DIREKTE mod databasen (begge
 *      koert i denne koersel — tallene MAALES her, ikke hardkodede fra en
 *      tidligere session). Det er fase 3's diff-r-bevis i ny form: to byg
 *      af samme database, ét via en frisk eksport, skal give samme tal.
 *
 * AA183/L84 (4. sep 2026): `data/robots/` er SLETTET. Det gamle trin 2 —
 * dyb lighed mellem hver committet data/robots/*.yaml og eksporten — havde
 * intet grundlag uden mappen og er FJERNET, ikke omskrevet (nummereringen
 * 1/3/4 er bevaret uaendret i konsollen og i --liste's "ingen 1/4 i
 * outputtet"-kontrakt, se tests/dele/68-tjek-kun.mjs). Samme aendring
 * rammer producentlisten: den laeste FOeR dette spor data/robots/ direkte
 * (hurtigt, ingen database). Det kan den ikke laengere — der findes ikke
 * et lokalt sted at laese producenter fra uden mappen. --liste og --kun
 * laeser derfor nu fra den midlertidige eksport, EFTER trin 1 er koert,
 * ogsaa naar kun --liste er bedt om. Det betyder --liste ikke laengere er
 * database-fri: se kommentaren ved ARGUMENTER nedenfor for den fulde
 * konsekvens.
 *
 * Exit 0 = alle trin bestod. Exit 1 = mindst ét faldt, med detaljer. Ingen
 * npm-afhaengigheder — child_process.execFileSync mod den samme node-binaer,
 * denne proces selv koerer under (process.execPath), saa scriptet virker
 * uanset PATH. Kraever SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY i .env, se
 * db/LAESMIG.md.
 *
 * dybtLig og traekValidateTal er UAeNDREDE (kopieret fra det slettede
 * db/rundtur.mjs, ikke omskrevet) — de er importeret af db/eksporter.mjs
 * (Aa12-princippet: ét sted, ikke to kopier der kan skride fra hinanden).
 * dybtLig, talLig, udenTekst og TEKSTNOEGLER er desuden eksporteret til
 * tests/dele/63-ordbog-og-skema.mjs og 68-tjek-kun.mjs, som tester dem
 * ISOLERET — de skal blive staaende, ogsaa selvom trin 2 (deres eneste
 * INTERNE opkald i denne fil) er fjernet.
 *
 * ARGUMENTER (spor/tjekkun, 2. sep 2026 — PLAN.md par. 0 fase 2: N parallelle
 * spor skriver hver KUN én producents tekstkolonner samtidig i databasen, og
 * skal hver kunne maale sig selv uden at blive roede af de ANDRES raekker):
 *
 *   --liste            Producenter (fra den midlertidige eksport, se ovenfor)
 *                       med antal robotter, faldende. FOeR AA183 var dette
 *                       database-frit; det er det IKKE laengere — trin 1's
 *                       eksport koeres altid foerst, saa --liste kraever nu
 *                       .env ligesom alt andet i denne fil, og "1/4" STAAR i
 *                       outputtet (modsat foer). Se tests/dele/68-tjek-kun.mjs
 *                       for den opdaterede kontrakt.
 *   --kun=<producent>  Afgraenser trin 3's fejlgruppering (egne/andre) til én
 *                       producents robotter (eksakt, trim + versalsuafhaengigt).
 *                       Den gamle tal-lig/dybt-lig-rapportering mod
 *                       data/robots/ (trin 2) er vaek sammen med trin 2 selv —
 *                       --kun grupperer nu KUN validate.mjs's fejl, det
 *                       proever ikke laengere at bevise, at talkolonner staar
 *                       uroerte. Se db/LAESMIG.md (staar til opdatering,
 *                       uden for dette spors ejerskab).
 *
 * Uden flag: adfaerd fra trin 1/3/4 UAeNDRET fra foer dette spor. Trin 2's
 * "dybt lig ALLE 77" er vaek — se AA183-noten ovenfor.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { parseYaml } = await import(`file://${path.join(ROD, 'tools/yaml.mjs')}`);
const { normaliserRobot } = await import(`file://${path.join(ROD, 'tools/skema.mjs')}`);

const EKSPORT_MAPPE = path.join(ROD, 'db/.tmp/tjek-eksport');
const BYG_EKSPORT = path.join(ROD, 'db/.tmp/tjek-byg-eksport');
const BYG_DB = path.join(ROD, 'db/.tmp/tjek-byg-db');

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

/* ------------------------------------------------------------ talkontrol (D2)
 * PLAN.md par. 0, fase 2-raekken: N parallelle spor skriver KUN tekstkolonner
 * — engelsk formulering (advarsel/citat/note-familien), kildesprogets
 * ordrette ordlyd (caveat=advarsel, note, applications.quote=anvendelse.
 * citat), producentens land/by (country), billedets alt-tekst — og INTET
 * andet. TEKSTNOEGLER er netop den liste: de noegler, fase 2 MAA aendre.
 * Alt andet i skemaet er en talkolonne, og haard begraensning 2 kraever, at
 * de staar helt uroerte, mens fase 2 koerer. */
const TEKSTNOEGLER = [
  'advarsel', 'advarsel_ordlyd', 'advarsel_i18n',
  'note', 'note_ordlyd', 'note_i18n',
  'noter', 'noter_ordlyd',
  'citat', 'citat_ordlyd',
  'producentland', 'producentby',
  'alt',
];
const TEKSTNOEGLE_SAET = new Set(TEKSTNOEGLER);

/** Dyb kopi af `obj` hvor alle TEKSTNOEGLER-noegler er fjernet, paa ALLE
 *  dybder (robottens top, felter.<x>, anvendelse, billede) — samme
 *  rekursionsform (array/objekt/blad) som dybtLig ovenfor, saa de to
 *  funktioner ikke kan naa til hver sin opfattelse af, hvad et "objekt" er.
 *  Muterer IKKE `obj`. */
function udenTekst(obj) {
  if (Array.isArray(obj)) return obj.map(udenTekst);
  if (obj !== null && typeof obj === 'object') {
    const ud = {};
    for (const [k, v] of Object.entries(obj)) {
      if (TEKSTNOEGLE_SAET.has(k)) continue;
      ud[k] = udenTekst(v);
    }
    return ud;
  }
  return obj;
}

/** dybtLig, men blind for TEKSTNOEGLER — beviser at TALLENE er ens, uanset
 *  hvor langt fase 2's tekstgenindsamling er naaet paa netop denne robot. */
function talLig(a, b, stiTilFejl) {
  return dybtLig(udenTekst(a), udenTekst(b), stiTilFejl);
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

/* -------------------------------------------------------- argumenter (D1) */

/** Samme "--noegle" / "--noegle=vaerdi"-form som tools/validate.mjs's
 *  laesFlag — ikke importeret derfra, for at tjek.mjs ikke faar en ny
 *  koblingsvej til validate.mjs (den kaldes i forvejen kun som subprocess). */
function laesFlag(argv) {
  const flag = {};
  for (const a of argv) {
    if (!a.startsWith('--')) continue;
    const i = a.indexOf('=');
    if (i === -1) flag[a.slice(2)] = true;
    else flag[a.slice(2, i)] = a.slice(i + 1);
  }
  return flag;
}

/** (slug, producent)-par for alle YAML-filer i `mappe` — ren lokal laesning,
 *  INGEN database i sig selv. AA183/L84: foer dette spor laeste denne
 *  funktion `data/robots/` direkte (mappen er nu slettet), og kaldte man
 *  kun `--liste`, blev eksporten aldrig koert. Kalderen (hoved()) koerer nu
 *  ALTID trin 1's eksport foerst og giver EKSPORT_MAPPE ind her — saa
 *  "ingen database" ikke laengere er sandt for --liste, men er flyttet ét
 *  niveau ud (funktionen selv rammer stadig kun disken). */
function laesProducenterFraMappe(mappe) {
  return fs.readdirSync(mappe).filter((f) => /\.ya?ml$/.test(f)).sort().map((f) => {
    const slug = f.replace(/\.ya?ml$/, '');
    const doc = laesParsetNormaliseret(path.join(mappe, f));
    return { slug, producent: String(doc.producent ?? '') };
  });
}

/** --liste: producenter faldende efter antal robotter, "13  Unitree Robotics"
 *  (antal, to mellemrum, navn). `poster` er allerede laest af kalderen (fra
 *  den midlertidige eksport, EFTER trin 1 er koert — se hoved()). */
function koerListe(poster) {
  const taelling = new Map();
  for (const { producent } of poster) taelling.set(producent, (taelling.get(producent) ?? 0) + 1);
  const raekker = [...taelling.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'da'));
  for (const [navn, antal] of raekker) console.log(`${antal}  ${navn}`);
  return 0;
}

/** Eksakt match paa producent, trim + case-uafhaengigt (Galileo (Tianjin)
 *  osv. kan indeholde mellemrum og parenteser — der matches paa hele
 *  strengen, ikke ord for ord). match er null ved ukendt navn; gyldige er
 *  de kendte navne, brugt til fejlbeskeden. */
function findProducent(oenske, poster) {
  const soeg = String(oenske ?? '').trim().toLowerCase();
  const navne = [...new Set(poster.map((p) => p.producent))].sort((a, b) => a.localeCompare(b, 'da'));
  const match = navne.find((n) => n.trim().toLowerCase() === soeg) ?? null;
  const egneSlugs = match ? new Set(poster.filter((p) => p.producent === match).map((p) => p.slug)) : null;
  return { match, egneSlugs, gyldige: navne };
}

/** validate.mjs's fejllinjeform (maalt i tools/validate.mjs:1357):
 *  "FEJL      <robot> · <felt> · <regel>: <besked>", hvor <robot> er
 *  path.basename(fil) — samme "<slug>.yaml" som tjek.mjs' egne EKSPORT_MAPPE-
 *  filnavne (validate.mjs's robotINavn saettes fra samme sti). D4's
 *  egne/andre-gruppering matcher derfor paa slug, ikke paa delstreng, saa
 *  "unitree-b2" ikke ved et uheld fanger "unitree-b2-w". */
function robotFraFejlLinje(linje) {
  const m = linje.match(/^FEJL\s+(\S+)/);
  return m ? m[1].replace(/\.ya?ml$/, '') : null;
}

/* --------------------------------------------------------------- main */

function hoved() {
  const flag = laesFlag(process.argv.slice(2));

  // AA183/L84: data/robots/ er slettet, saa der er intet lokalt sted at
  // laese producenter fra laengere. Trin 1's eksport koeres derfor ALTID
  // foerst nu, ogsaa naar kun --liste er bedt om (foer dette spor exit'ede
  // --liste FOeR eksporten — se docstringen oevenst i filen for den fulde
  // konsekvens: --liste er ikke laengere database-fri).
  console.log('1/4  node db/eksporter.mjs --fra-db --ud=db/.tmp/tjek-eksport ...');
  fs.rmSync(EKSPORT_MAPPE, { recursive: true, force: true });
  koer(['db/eksporter.mjs', '--fra-db', `--ud=${EKSPORT_MAPPE}`]);

  const poster = laesProducenterFraMappe(EKSPORT_MAPPE);

  if (flag['liste']) return koerListe(poster);

  let kunProducent = null;
  let egneSlugs = null;
  if (flag['kun'] !== undefined) {
    const oenske = flag['kun'] === true ? '' : String(flag['kun']);
    const { match, egneSlugs: es, gyldige } = findProducent(oenske, poster);
    if (!match) {
      console.error(`Ukendt producent: "${oenske}".`);
      console.error(`Gyldige producenter (${gyldige.length}):`);
      for (const g of gyldige) console.error(`  ${g}`);
      return 2;
    }
    kunProducent = match;
    egneSlugs = es;
  }

  const fejl = [];

  // Trin 2 (dyb lighed mod data/robots/) er FJERNET, ikke omskrevet — se
  // AA183-noten i docstringen. Nummereringen 1/3/4 er bevaret bevidst.
  console.log('3/4  node tools/validate.mjs paa den eksporterede mappe ...');
  let validateUd;
  try {
    validateUd = koer(['tools/validate.mjs', `--data=${EKSPORT_MAPPE}`]);
  } catch (e) {
    validateUd = (e.stdout ?? '') + (e.stderr ?? '');
  }
  const vTal = traekValidateTal(validateUd);
  console.log(`     ${vTal.filer} fil(er) · ${vTal.fejl} fejl · ${vTal.advarsler} advarsler.`);
  if (kunProducent) {
    // Kravet "0 fejl paa hele eksporten" er UAeNDRET (haard begraensning 2
    // gaelder alle 77) — grupperingen her er ren information, saa sporet
    // straks kan se, om en fejl er dets EGEN eller stammer fra en anden
    // producents raekker, mens de skrives samtidig.
    const fejlLinjer = validateUd.split('\n').filter((l) => l.startsWith('FEJL'));
    const egneFejlLinjer = fejlLinjer.filter((l) => egneSlugs.has(robotFraFejlLinje(l)));
    const andreFejlLinjer = fejlLinjer.filter((l) => !egneSlugs.has(robotFraFejlLinje(l)));
    console.log(`     validate-fejl: ${egneFejlLinjer.length} egne (${kunProducent}), ${andreFejlLinjer.length} andre.`);
  }
  if (vTal.fejl !== 0) {
    fejl.push(`validate.mjs fandt ${vTal.fejl} fejl paa den eksporterede mappe (forventet 0):\n${validateUd}`);
  }

  // AA183/L84: "original" er ikke laengere data/robots/ — det er databasen
  // selv, byget DIREKTE (tools/build.mjs uden --data laeser hentRobotter(),
  // fase 3/punkt-1-standarden). Sammenligningen er dermed to byg af SAMME
  // database: ét via en frisk eksport, ét direkte — ingen committet mappe
  // kraevet, og stadig fase 3's diff-r-bevis.
  console.log('4/4  node tools/build.mjs paa databasen (direkte) vs. den midlertidige eksport ...');
  fs.rmSync(BYG_EKSPORT, { recursive: true, force: true });
  fs.rmSync(BYG_DB, { recursive: true, force: true });
  const bEksport = traekBuildTal(koer(['tools/build.mjs', `--data=${EKSPORT_MAPPE}`, `--ud=${BYG_EKSPORT}`]));
  const bDb = traekBuildTal(koer(['tools/build.mjs', `--ud=${BYG_DB}`]));
  console.log(`     eksport:  ${bEksport.sider} sider · ${bEksport.medKilde} tal med kilde, ${bEksport.udenKilde} uden`);
  console.log(`     database: ${bDb.sider} sider · ${bDb.medKilde} tal med kilde, ${bDb.udenKilde} uden`);
  if (bEksport.sider !== bDb.sider) {
    fejl.push(`Sidetal er FORSKELLIGT: eksport ${bEksport.sider} vs. database ${bDb.sider}`);
  }
  if (bEksport.medKilde !== bDb.medKilde || bEksport.udenKilde !== bDb.udenKilde) {
    fejl.push(`Kildetal er FORSKELLIGT: eksport ${bEksport.medKilde}/${bEksport.udenKilde} ` +
      `vs. database ${bDb.medKilde}/${bDb.udenKilde}`);
  }

  console.log('\n' + '='.repeat(72));
  console.log(`TJEK: validate ${vTal.fejl} fejl · build sider ${bEksport.sider}=${bDb.sider} · ` +
    `kilder ${bEksport.medKilde}=${bDb.medKilde}`);
  if (fejl.length) {
    console.log(`\n${fejl.length} PROBLEM(ER):\n`);
    for (const f of fejl) console.log(`- ${f}\n`);
    console.log('TJEK FEJLEDE.');
    return 1;
  }
  console.log('TJEK BESTAAET — databasen og bygget siger det samme.');
  return 0;
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('tjek.mjs');
if (erHoved) {
  try {
    process.exit(hoved());
  } catch (e) {
    console.error(String(e && e.stack ? e.stack : e));
    process.exit(1);
  }
}

export { dybtLig, traekValidateTal, udenTekst, talLig, TEKSTNOEGLER };
