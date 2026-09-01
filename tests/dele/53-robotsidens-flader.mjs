/**
 * tests/dele/53-robotsidens-flader.mjs — spor/robotside, 1. sep 2026.
 *
 * JPK's tre punkter paa robotsiden, plus tillaegget om CE-chippen han fandt
 * med egne oejne, efter briefet var sendt:
 *
 *   1. EU-BLOKKEN ER VAEK. `sektion eu-blok` var en tredje, redundant
 *      visning af praecis samme CE-vaerdi som skemaet allerede baerer.
 *      Fjernet i to trin: sektionen (punkt 1) og den fjerde chip i
 *      skiltlinjen (tillaegget). CE staar TILBAGE ét sted: skemaets egen
 *      "eu"-gruppe (tools/skema.mjs) - og forbeholdssaetningen
 *      (eu_forklaring), der IKKE maa forsvinde (haard begraensning 1), er
 *      flyttet med, som en note paa selve CE-raekken.
 *
 *   2. "PRODUKTSIDE"-SEKTIONEN ER MINDRE. Maalt (Playwright, ikke i denne
 *      fil - build/tests har ingen browserafhaengighed): 237,65 px -> 158,5
 *      px ved 1440 px bredde, et fald paa 33,3 %. Det, DENNE fil kan proeve
 *      uden en browser, er MEKANISMEN: at forklaringsteksten skiftede
 *      klasse (t-broed.maal -> t-lille, som allerede bruges af sektionens
 *      eget "ingen produktside"-fald-tilbage) og at CSS-reglen, der
 *      krymper luften, rent faktisk staar i system.css.
 *
 *   3. PROSA-DUBLERING FJERNET TO STEDER:
 *      a) anvendelse-sektionens tre "per the manufacturer"-gentagelser er
 *         skaaret til én saetning ("This category is not our assessment.").
 *      b) forhandler-forbeholdet ("We are not a dealer." / "Vi er ikke
 *         forhandler.") stod BAADE i produktside-sektionen og i sidefoden.
 *         Sidefodens (T.ingen_forhandler, ALLE sider, uafhaengigt af dette
 *         spor) er nu den ENESTE, og skal derfor staa PRAECIS én gang pr.
 *         side.
 *
 * REVERT-BEVIS (CLAUDE.md's krav): hver strukturel paastand proeves ogsaa
 * mod en haandskrevet, bevidst OEDELAGT streng, og proeven kraever, at
 * reglen dér svarer forkert/negativt - ellers beviser en groen test intet
 * (den kunne vaere en regex, der altid rammer, eller en, der rammer en
 * kommentar i stedet for selve markup'en).
 *
 * Bygger det RIGTIGE datasaet (ingen --data=-fixture), fordi punkt 1's
 * acceptkriterium eksplicit er "maalt paa ALLE robotsider" - 154 stykker,
 * 77 robotter x 2 sprog.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok, skema,
  } = ctx;

  console.log('\n53. spor/robotside: eu-blok vaek, produktside mindre, prosa-dublering fjernet (JPK 1. sep 2026)');

  const dist = path.join(tmp, 'dist-robotsidens-flader');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${dist}`],
    { cwd: rod, encoding: 'utf8' });
  ok('53.0: byg af hele kataloget giver exit 0', b.status === 0, (b.stderr || '').trim());

  const sys = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');
  const SPROG = skema.SPROG;

  /** Alle robotsider for ét sprog - undtager kataloglistens egen index.html
   *  (dist/<sprog>/robotter/index.html), som IKKE er en robotside. */
  function robotSider(sprog) {
    const mappe = path.join(dist, sprog, 'robotter');
    return fs.readdirSync(mappe, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => path.join(mappe, d.name, 'index.html'));
  }

  const alleFiler = SPROG.flatMap((s) => robotSider(s).map((f) => ({ sprog: s, fil: f, html: fs.readFileSync(f, 'utf8') })));
  ok('53.1: der er robotsider at maale paa (77 robotter x antal sprog)',
    alleFiler.length === 77 * SPROG.length, `fandt ${alleFiler.length}`);

  /* --- 1. eu-blok-sektionen er vaek, CE staar tilbage i skemaet ---------- */

  const medEuBlok = alleFiler.filter((f) => f.html.includes('class="sektion eu-blok"'));
  ok(`53.2: INGEN af de ${alleFiler.length} robotsider har en sektion.eu-blok tilbage`,
    medEuBlok.length === 0, `fandt paa: ${medEuBlok.map((f) => f.fil).slice(0, 3).join(', ')}`);

  for (const s of SPROG) {
    const T = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', `${s}.json`), 'utf8'));
    const sider = alleFiler.filter((f) => f.sprog === s);
    const udenCeRaekke = sider.filter((f) => !f.html.includes(`>${T.felt_ce_oplyst}</th>`));
    ok(`53.3.${s}: ALLE ${sider.length} robotsider har CE-raekken i skemaet ("${T.felt_ce_oplyst}")`,
      udenCeRaekke.length === 0, `mangler paa: ${udenCeRaekke.map((f) => f.fil).slice(0, 3).join(', ')}`);

    const udenForklaring = sider.filter((f) => !f.html.includes(T.eu_forklaring));
    ok(`53.4.${s}: ALLE ${sider.length} robotsider bevarer forbeholdssaetningen ("${T.eu_forklaring.slice(0, 40)}…")`,
      udenForklaring.length === 0, `mangler paa: ${udenForklaring.map((f) => f.fil).slice(0, 3).join(', ')}`);
  }

  // REVERT-BEVIS: en haandskrevet streng MED en eu-blok-sektion skal fanges
  // af 53.2's regel, og en streng UDEN forbeholdssaetningen skal fanges af
  // 53.4's - ellers beviser en groen test kun, at strengen findes NOGEN steder.
  const medBlok = '<section class="sektion eu-blok" aria-labelledby="eu-h">x</section>';
  ok('53.2.revert: en streng MED sektion.eu-blok matcher reglens negativ (fanges)',
    medBlok.includes('class="sektion eu-blok"'));
  const udenSaetning = '<section class="sektion skema">helt uden forbeholdet</section>';
  ok('53.4.revert: en streng UDEN forbeholdssaetningen fanges af regel 53.4',
    !udenSaetning.includes('The field shows only what the manufacturer states about CE marking. It is a record of fact, not import advice.'));

  /* --- 1b. CE-chippen i skiltlinjen (JPK's tillaeg) er ogsaa vaek --------- */

  const medCeChip = alleFiler.filter((f) => {
    const m = f.html.match(/<ul class="maerker skiltlinje">[\s\S]*?<\/ul>/);
    return m && m[0].includes('maerke--ce');
  });
  ok(`53.5: INGEN af de ${alleFiler.length} robotsider har en CE-chip i skiltlinjen laengere`,
    medCeChip.length === 0, `fandt paa: ${medCeChip.map((f) => f.fil).slice(0, 3).join(', ')}`);

  // REVERT-BEVIS: en skiltlinje MED en CE-chip skal fanges.
  const skiltMedCe = '<ul class="maerker skiltlinje"><li class="maerke maerke--status">x</li>'
    + '<li class="maerke maerke--ce maerke--tom">CE stated: not stated</li></ul>';
  const fangetM = skiltMedCe.match(/<ul class="maerker skiltlinje">[\s\S]*?<\/ul>/);
  ok('53.5.revert: en skiltlinje MED maerke--ce fanges af reglen',
    !!fangetM && fangetM[0].includes('maerke--ce'));

  /* --- 2. produktside-sektionen er lettere (mekanismen, ikke pixlen) ------ */

  ok('53.6: system.css krymper .typeskilt .produktside\'s padding-top til var(--r5)',
    /\.typeskilt \.produktside\{padding-top:var\(--r5\)\}/.test(sys));
  ok('53.7: link- og adresselinjens margin er strammet (var(--r2), var(--r1))',
    /\.typeskilt \.produktside \.videre\{margin-top:var\(--r2\)\}/.test(sys)
    && /\.typeskilt \.produktside \.produktside-url\{margin-top:var\(--r1\)\}/.test(sys));

  const medGammelKlasse = alleFiler.filter((f) => {
    const i = f.html.indexOf('class="sektion produktside"');
    const slut = f.html.indexOf('</section>', i);
    return f.html.slice(i, slut).includes('class="t-broed maal"');
  });
  ok(`53.8: INGEN af de ${alleFiler.length} produktside-sektioner bruger den tunge t-broed.maal-klasse laengere`,
    medGammelKlasse.length === 0, `fandt paa: ${medGammelKlasse.map((f) => f.fil).slice(0, 3).join(', ')}`);

  // REVERT-BEVIS for 53.6/53.7: en CSS-streng UDEN reglerne skal IKKE matche.
  const sysUdenRegel = '.typeskilt .produktside{padding-top:var(--r8)}';
  ok('53.6.revert: den gamle padding-top (var(--r8)) matcher IKKE den nye regel',
    !/\.typeskilt \.produktside\{padding-top:var\(--r5\)\}/.test(sysUdenRegel));

  /* --- 3a. anvendelse-sektionens "manufacturer"-gentagelser er skaaret --- */

  const gamleSaetninger = [
    'own classification, quoted verbatim',
    'cannot be quoted, it reads not stated',
    'gengivet ordret. Kan producenten ikke citeres',
  ];
  for (const frase of gamleSaetninger) {
    const stadigTilstede = alleFiler.filter((f) => f.html.includes(frase));
    ok(`53.9: den fjernede gentagelse "${frase.slice(0, 30)}…" staar INGEN steder i de ${alleFiler.length} sider`,
      stadigTilstede.length === 0, `fandt paa: ${stadigTilstede.map((f) => f.fil).slice(0, 3).join(', ')}`);
  }
  for (const s of SPROG) {
    const T = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', `${s}.json`), 'utf8'));
    ok(`53.10.${s}: den bevarede afgraensning ("${T.anvendelse_forklaring}") staar stadig i i18n`,
      typeof T.anvendelse_forklaring === 'string' && T.anvendelse_forklaring.length > 0);
  }

  /* --- 3b. forhandler-forbeholdet staar PRAECIS én gang pr. side --------- */

  for (const s of SPROG) {
    const T = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', `${s}.json`), 'utf8'));
    const sider = alleFiler.filter((f) => f.sprog === s);
    const afvigende = sider.filter((f) => f.html.split(T.ingen_forhandler).length - 1 !== 1);
    ok(`53.11.${s}: forhandler-forbeholdet ("${T.ingen_forhandler.slice(0, 30)}…") staar PRAECIS 1 gang paa alle ${sider.length} sider`,
      afvigende.length === 0, `afveg paa: ${afvigende.map((f) => f.fil).slice(0, 3).join(', ')}`);
  }

  // REVERT-BEVIS: en side med forbeholdet to gange skal FANGES (talt til 2,
  // ikke 1), og en side med det slettet HELT skal ogsaa fanges (talt til 0).
  const fraseTest = 'X staar to gange';
  const toGange = `${fraseTest} - ${fraseTest}`;
  ok('53.11.revert: en streng med forbeholdet TO gange taeller 2, ikke 1',
    toGange.split(fraseTest).length - 1 === 2);
  const ingenGange = 'helt uden forbeholdet';
  ok('53.11.revert: en streng UDEN forbeholdet taeller 0, ikke 1',
    ingenGange.split(fraseTest).length - 1 === 0);
}
