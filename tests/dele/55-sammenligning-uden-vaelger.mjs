/**
 * tests/dele/55-sammenligning-uden-vaelger.mjs — spor/saml2 (JPK 1. sep
 * 2026, punkt 1+2): sammenligningssiden mistede sin egen robotvaelger.
 * Kataloget er nu det ene sted, man vaelger robotter (afkrydsning der,
 * eller den klaebende bundbjaelke et samtidigt spor bygger); denne side er
 * ren visning + ÉN knap, "Vaelg robotter", der foerer tilbage til kataloget.
 *
 * LAASER TRE TING, som alle var ubeskyttede indtil nu:
 *
 *   PUNKT A  Vaelgersektionen er vaek: hverken `.vaelgernet`-gitteret,
 *            checkboksene (`.vc__felt`) eller den gamle `<section
 *            class="sektion sammenligning">`-indpakning findes laengere i
 *            det byggede HTML.
 *   PUNKT B  Enhedskontakten (`#enhedsskift`) OVERLEVEDE fjernelsen og
 *            staar STADIG praecis ÉN gang - den deler id med robotsidens
 *            og katalogets egen kontakt (tests/dele/44-samlenhed.mjs), og
 *            en naiv fjernelse af hele den gamle <section> ville have
 *            taget den med i faldet.
 *   PUNKT C  "Vaelg robotter"-knappen ER et rigtigt <a href> til kataloget,
 *            laesbart som saadan af almindelig tekstlaesning af den byggede
 *            HTML-fil (ingen JS koerer i denne testkoersel) - P0's krav om,
 *            at siden er SAND uden JavaScript. Knappen peger paa NOEJAGTIG
 *            samme sti som sidens eksisterende "Tilbage til kataloget"-
 *            link (begge er `url.katalog`), saa testen antager ikke en
 *            haardkodet '/robotter/'-sti, der braekker den dag kataloget
 *            flytter (spor/oversigt).
 *
 * Selve den referrer-styrede tilbage-i-historikken-adfaerd (klik fra
 * kataloget skal give `history.back()`) kan IKKE bevises af en Node-koersel
 * uden browser - det er maalt separat i en rigtig browser (se agentens
 * rapport) og staar udenfor denne fils kontrakt, som briefet selv afgraenser
 * til "vaelgersektionen er vaek, enhedskontakten staar praecis én gang, og
 * knappen har en rigtig href uden JS".
 *
 * REVERT-BEVIS (efterproevet af agenten, se rapporten): fjernes
 * `sammenligning.mjs`s knap-linje, eller genindsaettes den gamle
 * `<section class="sektion sammenligning">`+vaelgerHTML(), gaar 55.3-55.9
 * roede - de tester praecis det, en tilbagerulning ville braekke.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n55. spor/saml2: sammenligningssiden uden vaelger + "Vaelg robotter" tilbage til kataloget');

  const udMappe = path.join(tmp, 'dist-saml2');
  fs.rmSync(udMappe, { recursive: true, force: true });
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udMappe}`],
    { cwd: rod, encoding: 'utf8' });
  ok('55.1 build.mjs giver exit 0 (frisk byg til egen midlertidig mappe)',
    b.status === 0, (b.stdout || b.stderr || '').trim().split('\n').slice(-3).join(' / '));
  if (b.status !== 0) return;

  for (const sprog of ['da', 'en']) {
    const sti = path.join(udMappe, sprog, 'sammenligning', 'index.html');
    const html = fs.existsSync(sti) ? fs.readFileSync(sti, 'utf8') : null;
    ok(`55.2.${sprog} sammenligningssiden findes`, html !== null);
    if (!html) continue;

    /* ---------------------------------------------------------- PUNKT A */
    const antalSektionSammenligning = (html.match(/sektion sammenligning/g) || []).length;
    ok(`55.3.${sprog} den gamle <section class="sektion sammenligning"> er vaek`,
      antalSektionSammenligning === 0, `fandt ${antalSektionSammenligning}, forventede 0`);

    const antalVaelgernet = (html.match(/vaelgernet/g) || []).length;
    ok(`55.4.${sprog} .vaelgernet-gitteret er vaek`,
      antalVaelgernet === 0, `fandt ${antalVaelgernet}, forventede 0`);

    const antalVcFelt = (html.match(/vc__felt/g) || []).length;
    ok(`55.5.${sprog} ingen .vc__felt-checkbokse tilbage (foer: 77)`,
      antalVcFelt === 0, `fandt ${antalVcFelt}, forventede 0`);

    /* ---------------------------------------------------------- PUNKT B */
    const antalEnhedskontakt = (html.match(/enhedsskift__boks/g) || []).length;
    ok(`55.6.${sprog} enhedskontakten (#enhedsskift) staar praecis ÉN gang`,
      antalEnhedskontakt === 1, `fandt ${antalEnhedskontakt}, forventede 1`);
    ok(`55.6b.${sprog} enhedskontakten har id="enhedsskift" (samme noegle som robotsiden/enhed.js)`,
      /<input type="checkbox" id="enhedsskift" class="kunskaerm enhedsskift__boks">/.test(html));

    /* ---------------------------------------------------------- PUNKT C */
    // Sidens eksisterende "Tilbage til kataloget"-link, begge sprogs T.til_katalog.
    // Bruges som facit for hvor url.katalog peger - ingen haardkodet '/robotter/'.
    const returMatch = html.match(/<p class="retur"><a href="([^"]+)">/);
    ok(`55.7.${sprog} siden har det eksisterende "Tilbage til kataloget"-link at sammenligne med`,
      returMatch !== null);
    if (!returMatch) continue;
    const katalogHref = returMatch[1];

    // "Vaelg robotter"-knappen: en RIGTIG <a href>, ikke JS-genereret (denne
    // test laeser raa HTML-tekst, ingen browser, intet script koerer).
    const knapRegex = /<p class="afslutning-knap"><a class="videre videre--stille" href="([^"]+)" data-saml-knap>([^<]*)<svg/;
    const knapMatch = html.match(knapRegex);
    ok(`55.8.${sprog} "Vaelg robotter"-knappen er en rigtig <a href> (data-saml-knap), ikke skabt af JS`,
      knapMatch !== null);
    if (!knapMatch) continue;

    ok(`55.9.${sprog} knappen peger paa NOEJAGTIG samme sti som "Tilbage til kataloget" (url.katalog)`,
      knapMatch[1] === katalogHref, `knap="${knapMatch[1]}" retur="${katalogHref}"`);

    // Teksten skal vaere den oversatte sammenligning_vaelg_titel, laest af
    // data/i18n/*.json - ikke haardkodet her, saa en fremtidig omformulering
    // ikke braekker testen af den forkerte grund.
    const i18nSti = path.join(rod, 'data', 'i18n', `${sprog}.json`);
    const forventetTekst = JSON.parse(fs.readFileSync(i18nSti, 'utf8')).sammenligning_vaelg_titel;
    ok(`55.10.${sprog} knapteksten er i18n-noeglen sammenligning_vaelg_titel ("${forventetTekst}")`,
      knapMatch[2] === forventetTekst, `fandt "${knapMatch[2]}"`);

    // Berøringsmål: knappen har INTET eget CSS her (filejerskabet forbyder at
    // roere system.css/generator.css) - den genbruger .videre, som allerede
    // findes og allerede baerer et maalt min-height. Assertion laeser derfor
    // CSS-KILDEN, ikke en browser-maaling (den staar i agentrapportens
    // browsermaaling af filterbevarelsen i stedet).
  }

  /* CSS-paastandene laeses kun én gang (sprog-uafhaengige). Kommentarer
     fjernes foerst (samme faelde som tests/dele/47: en kommentar, der citerer
     reglen ordret, maa ikke kunne goere en slettet regel til en groen test). */
  const udenKommentarer = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');
  const css = udenKommentarer(fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8'));

  const videreBlok = (css.match(/\n\.videre\s*\{([^}]*)\}/) || [])[1] || '';
  const minHeight = parseFloat((videreBlok.match(/min-height:\s*([\d.]+)px/) || [])[1] || '0');
  ok(`55.11 .videre (knappens genbrugte form) har min-height >= 44px (fandt ${minHeight}px)`,
    minHeight >= 44);

  // Global fokusring, upaavirket for .videre/.afslutning-knap: ingen
  // outline:none/0-overstyring nogen steder i de to CSS-filer (efterproevet
  // separat af agenten - grep gav 0 traeffere i begge filer).
  ok('55.12 :focus-visible saetter en synlig outline globalt (knappen faar den, ingen override fjerner den)',
    /:focus-visible\s*\{[^}]*outline:\s*3px\s+solid/.test(css));

  /* --- klient-JS: den referrer-styrede tilbage-adfaerd findes i KILDEN ----
     Dette er IKKE et bevis for at klikket rent faktisk virker (det kraever
     en browser, se agentrapportens maaling) - kun et strukturelt laas mod,
     at funktionen ved en fejl forsvinder fra filen igen. */
  const js = fs.readFileSync(path.join(rod, 'assets', 'sammenligning.js'), 'utf8');
  ok('55.13 sammenligning.js binder klik paa [data-saml-knap]',
    /querySelectorAll\('\[data-saml-knap\]'\)/.test(js));
  ok('55.14 klikket bruger document.referrer + history.back() (ikke en ny fetch/URL-mekanisme)',
    /document\.referrer/.test(js) && /window\.history\.back\(\)/.test(js));
  ok('55.15 sammenligning.js laeser udvalget fra localStorage, men skriver det ALDRIG (siden er ren visning)',
    /localStorage\.getItem\(SAML_NOEGLE\)/.test(js) && !/localStorage\.setItem/.test(js));

  fs.rmSync(udMappe, { recursive: true, force: true });
}
