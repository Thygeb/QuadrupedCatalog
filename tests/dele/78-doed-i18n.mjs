/**
 * tests/dele/78-doed-i18n.mjs — ingen ubrugt noegle i data/i18n/ (spor/certfacet,
 * 3. sep 2026, BRIEF-certfacet-2.md punkt 3).
 *
 * BAGGRUNDEN: L90 (punkt 1 i dette brief) rejste spoergsmaalet, om de gamle
 * CE-tilstandsnoegler var doede efter L89/L90-omlaegningen. MAALINGEN (ikke
 * hukommelsen - se CLAUDE.md) viste, at CE-noeglerne alle stadig bruges
 * (dynamisk, via t('filter_' + v) hvor v er CERT_MAERKER), men afdaekkede i
 * stedet 61 GENUINT doede noegler - primaert rester af den nedlagte
 * tools/skabelon/forside.mjs (slettet i e429962, "PUNKT 1: forsiden slettet,
 * kataloget flytter til sprogroden") og af `spor/prisnote`s flytning af
 * ECB-noten fra katalogsiden til robotsiden (filter_pris_note, pris_kurs_enkel).
 * De 61 er fjernet fra begge sprogfiler i samme commit som denne fil.
 *
 * DEN VANSKELIGE DEL, som denne test skal blive ved med at faa ret i: et
 * LITERALT grep efter en noegles navn er IKKE nok. Generatoren konstruerer
 * mange noeglenavne DYNAMISK ved strengsammensaetning (`t('felt_' + navn)`,
 * `t('status_' + v)` osv.) - saadan en noegle staar ALDRIG ordret i kilden.
 * Et naivt "0 literale forekomster => doed" ville derfor markere over 100
 * levende noegler som doede (maalt under dette spors research: 166 noegler
 * havde 0 literale forekomster, heraf var kun 61 rent faktisk ubrugte).
 *
 * Metoden her er derfor TO-LAGET, ligesom oprydningen der gik forud:
 *   1. Literal forekomst (ordgraense-match) i tools/ + assets/.
 *   2. For resten: matcher noeglen et KENDT, VERIFICERET dynamisk moenster?
 *      - LUKKEDE domaener (en fast, endelig vaerdimaengde laest fra selve
 *        kildekoden - IKKE gaettet): gruppe_/status_/anvendelse_/vaegtklasse_/
 *        eg_/filter_/stribe_/tilstand_/operator_(_laest)/om_metode_[1-4]_*.
 *      - AABNE domaener (datadrevne, kan vokse - felt_/land_): en noegle her
 *        er IKKE doed, bare fordi dagens datasaet ikke rammer den (samme
 *        logik som JPK's UL/CCC-vaern i test 77: et tavst felt er ikke et
 *        forsvundet felt).
 *      - Noegler der starter med "_" er KOMMENTARER i selve JSON-filen
 *        (fx "_om", "_sidefod") - ikke oversaettelser, og tastes aldrig ind
 *        i en t()/T()-opslagsfunktion.
 *
 * Kilderne for hvert lukket domaene staar som kommentar ved siden af det
 * herunder - hver er en linjehenvisning, ikke en antagelse.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// De LUKKEDE domaener - byggerens egne konstanter, importeret levende (ikke
// kopieret), saa testen ikke selv kan komme ud af trit med skemaet.
async function laesLukkedeDomaener(rod) {
  const { GRUPPER, STATUS_VAERDIER, ANVENDELSE_VAERDIER, TILSTANDE } =
    await import(pathToFileURL(path.join(rod, 'tools', 'skema.mjs')).href);
  return {
    gruppe_: GRUPPER,                                       // tools/skema.mjs, GRUPPER
    status_: STATUS_VAERDIER,                                // tools/skema.mjs, STATUS_VAERDIER
    anvendelse_: ANVENDELSE_VAERDIER,                        // tools/skema.mjs, ANVENDELSE_VAERDIER
    tilstand_: TILSTANDE,                                    // tools/skema.mjs, TILSTANDE
    // De fire nedenfor er LOKALE consts i skabelonerne, ikke eksporteret -
    // holdes derfor som en verificeret kopi. Drifter skabelonen, skal denne
    // liste opdateres MED den (se filhovedets forklaring).
    vaegtklasse_: ['under_20', '20_40', 'over_40'],           // katalog.mjs:450/1264, robot.mjs filhoved
    eg_: ['trapper', 'baerer', 'frost', 'lader', 'hotswap'],  // katalog.mjs KAPABILITETER (~L225)
    filter_: ['ce', 'fcc', 'ul', 'ccc'],                      // katalog.mjs CERT_MAERKER (~L435)
    stribe_: ['egenvaegt', 'nyttelast_gaaende', 'hastighed', 'driftstid'], // side.mjs STRIBE (~L1570)
    operator_: ['mereend', 'mindst', 'mindreend', 'hoejst', 'cirka', 'pm'], // sammenligning.mjs:80
  };
}
const AABNE_PRAEFIKSER = ['felt_', 'land_'];
const OM_METODE_RE = /^om_metode_[1-4]_(titel|broed)$/;

function alleFiler(dir) {
  let ud = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) ud = ud.concat(alleFiler(p));
    else ud.push(p);
  }
  return ud;
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/** Er noeglen `k` genstand for et bevist brugsmoenster (literal ELLER et af
 *  de kendte dynamiske)? Returnerer { brugt, hvordan } til fejlmeldingen. */
function klassificer(k, kildeTekst, lukkedeDomaener) {
  if (k.startsWith('_')) return { brugt: true, hvordan: 'kommentarnoegle' };
  const re = new RegExp('\\b' + escapeRe(k) + '\\b');
  if (re.test(kildeTekst)) return { brugt: true, hvordan: 'literal' };
  if (OM_METODE_RE.test(k)) return { brugt: true, hvordan: 'om_metode_[1-4]_* (om-os.mjs L255-259)' };
  for (const [praefiks, domaene] of Object.entries(lukkedeDomaener)) {
    if (!k.startsWith(praefiks)) continue;
    const suffiks = k.slice(praefiks.length);
    const uden_laest = suffiks.endsWith('_laest') ? suffiks.slice(0, -6) : suffiks;
    if (domaene.includes(suffiks) || domaene.includes(uden_laest)) {
      return { brugt: true, hvordan: `lukket domaene (${praefiks}*)` };
    }
    // Praefikset matcher, men vaerdien er UDEN FOR det kendte domaene - det
    // er praecis den fejl, dette spor rettede (fx "filter_titel" mod
    // filter_+CERT_MAERKER). IKKE brugt.
    return { brugt: false, hvordan: `praefiks "${praefiks}" matcher, men "${suffiks}" er uden for det kendte domaene [${domaene.join(', ')}]` };
  }
  if (AABNE_PRAEFIKSER.some((p) => k.startsWith(p))) return { brugt: true, hvordan: 'aabent domaene (data-drevet)' };
  return { brugt: false, hvordan: 'ingen literal forekomst og intet kendt dynamisk moenster' };
}

export default async function koer(ctx) {
  const { rod, ok } = ctx;

  console.log('\n78. Ingen ubrugt noegle i data/i18n/ (spor/certfacet, BRIEF-certfacet-2.md punkt 3)');

  const da = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'da.json'), 'utf8'));
  const en = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'en.json'), 'utf8'));
  const kildeTekst = [...alleFiler(path.join(rod, 'tools')), ...alleFiler(path.join(rod, 'assets'))]
    .map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  const lukkedeDomaener = await laesLukkedeDomaener(rod);

  /* --- 78.1: ingen noegle i da.json er ubrugt -------------------------- */
  const ubrugte = [];
  for (const k of Object.keys(da)) {
    const { brugt, hvordan } = klassificer(k, kildeTekst, lukkedeDomaener);
    if (!brugt) ubrugte.push(`${k} (${hvordan})`);
  }
  ok(`78.1: ingen noegle i da.json er ubrugt (${Object.keys(da).length} noegler efterproevet)`,
    ubrugte.length === 0, `ubrugte: ${ubrugte.join(' · ')}`);

  /* --- 78.1.revert: en paadigtet, aldrig-brugt noegle FANGES ------------ */
  // Beviser at 78.1 kan fejle, ikke kun bestaa - uden dette kunne
  // klassificer() vaere braekket til altid at svare "brugt". Roerer IKKE
  // den rigtige fil.
  {
    const paafundet = 'test_78_revert_ubrugt_noegle_som_ingen_bruger';
    const { brugt } = klassificer(paafundet, kildeTekst, lukkedeDomaener);
    ok('78.1.revert: en opdigtet, aldrig-refereret noegle klassificeres korrekt som UBRUGT',
      brugt === false, `klassificer() svarede brugt=${brugt} for en noegle der garanteret ikke bruges nogen steder`);
  }

  /* --- 78.2: da.json og en.json har SAMME noeglesaet -------------------- */
  const kunDa = Object.keys(da).filter((k) => !(k in en));
  const kunEn = Object.keys(en).filter((k) => !(k in da));
  ok(`78.2: da.json og en.json har samme noeglesaet (${Object.keys(da).length} noegler)`,
    kunDa.length === 0 && kunEn.length === 0,
    `kun i da: ${kunDa.join(', ')} · kun i en: ${kunEn.join(', ')}`);

  /* --- 78.2.revert: en asymmetri mellem filerne FANGES ------------------- */
  {
    const daKopi = { ...da, kun_i_da_test: 'x' };
    const kunDaSimuleret = Object.keys(daKopi).filter((k) => !(k in en));
    ok('78.2.revert: en noegle der kun findes i den ene fil giver en ikke-tom liste',
      kunDaSimuleret.length === 1 && kunDaSimuleret[0] === 'kun_i_da_test');
  }
}
