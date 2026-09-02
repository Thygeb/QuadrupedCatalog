/**
 * tests/dele/61-extract.mjs — spor/extract, 2. sep 2026.
 *
 * Laaser LED 2's fire systemregler, JPK traf 2. sep 2026:
 *
 *   L76  --accent er BAGGRUND og MARKOER, aldrig tekst paa en lys flade.
 *        Tekst PAA accent er altid --blaek, aldrig hvid.
 *   L78  Et produktfoto beskaeres aldrig: 4:3 og contain overalt.
 *   L79  2px er systemets radius overalt, og den er et token (--hjoerne).
 *   L80  Der er TO skrifter. Saira til maskinen, Literata til mennesket.
 *
 * (L77, knapprimitivet, er IKKE laast her - den er et selvstaendigt spors
 * arbejde og aendrer ogsaa skabelonerne.)
 *
 * HVER REGEL HAR ET OEDELAGT TILFAELDE. Det er ikke pynt. En vagt, der kun
 * koeres mod kode, som allerede er rigtig, beviser at den ikke SIGER FRA -
 * ikke at den kan se noget. Hver kontrol koeres derfor to gange: én gang
 * mod de rigtige stilark (skal give 0 fund) og én gang mod en haandskrevet
 * CSS-stump med netop den fejl, reglen forbyder (skal give mindst 1).
 * Falder et oedelagt tilfaelde igennem, er vagten i stykker, og saa er dens
 * groenne svar paa den rigtige fil ingenting vaerd.
 *
 * FAELDE, DER KOSTEDE EN ROED KOERSEL, OG SOM DENNE FIL UNDGAAR MED VILJE:
 * 31-pudsning.mjs' radius-vagt laeser CSS'en UDEN at fjerne kommentarer,
 * saa ordet "border-radius:0" inde i en kommentar taelles som en
 * erklaering. Alle maalinger her koerer paa `udenKommentarer(css)`.
 */
import fs from 'node:fs';
import path from 'node:path';

/** Kommentarer er ikke kode. Alt nedenfor maaler paa resultatet heraf. */
const udenKommentarer = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Regler som {vaelger, krop}. Bevidst simpel: stilarkene her har ingen
 *  indlejrede at-regler med krøllede vaelgere, og en fuld parser ville
 *  vaere et nyt maaleapparat, der selv skulle valideres. */
function regler(css) {
  const ud = [];
  for (const m of udenKommentarer(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    ud.push({ vaelger: m[1].trim().replace(/\s+/g, ' '), krop: m[2] });
  }
  return ud;
}

/* ====================== L76 ====================== */

/** De ENESTE tre steder, accent maa staa som tekst: alle paa den moerke
 *  flade (--fod/--blaek), hvor forholdet er 9,19 : 1. Listen er en
 *  BESLUTNING, ikke en observation - vokser den, skal nogen kunne
 *  begrunde hvorfor, og det er hele pointen med at skrive den ned. */
/* TO AF DE TRE HAR SKIFTET NAVN, ikke betydning (spor/knap, L77, 2. sep
   2026). Begge var knapper med hver sit klassenavn og er nu den samme
   knapprimitiv med en variant; fladen under dem og dermed kontrasttallet er
   uaendret. Listen er stadig tre poster, og ingen ny flade er kommet til:
     .klaebebar__gaa    -> .knap--tekst-moerk.knap--frem  (stadig paa --fod)
     .valg__fjern:hover -> .knap--kryds:hover             (stadig paa --blaek)
   Selektorerne staar med deres nye navne, saa en fremtidig laeser ikke leder
   efter en regel, der ikke findes. */
const ACCENT_TEKST_TILLADT = [
  '.knap--tekst-moerk.knap--frem',  // klaebebarens gaa-link, staar paa --fod
  '.knap--kryds:hover',             // chippens kryds, staar paa --blaek
  '.taeller__tal',                  // staar i .strimmel, som er --fod
];

/** Fund: regler, der bruger accent som TEKSTfarve uden at staa paa listen. */
function l76AccentSomForgrund(css) {
  return regler(css)
    .filter((r) => /(^|[;\s])color:var\(--accent\)/.test(r.krop))
    .map((r) => r.vaelger)
    .filter((v) => !ACCENT_TEKST_TILLADT.some((t) => v.split(',').every((d) => d.trim() === t) || v === t));
}

/** Fund: hvid tekst paa accent-baggrund - OGSAA naar de to erklaeringer
 *  staar i hver sin regel. Det var praecis den form, briefets linjebaserede
 *  soegning ikke kunne se: `.videre` satte color:#FFFFFF, og
 *  `.videre:hover` skiftede kun baggrunden til accent. */
function l76HvidPaaAccent(css) {
  const r = regler(css);
  const farvePaa = new Map();
  for (const { vaelger, krop } of r) {
    const m = krop.match(/(?:^|[;\s])color:\s*(#[0-9A-Fa-f]{3,8}|var\([a-z0-9-]+\))/);
    if (m) for (const d of vaelger.split(',')) farvePaa.set(d.trim(), m[1]);
  }
  const fund = [];
  for (const { vaelger, krop } of r) {
    if (!/background(-color)?:var\(--accent\)/.test(krop)) continue;
    for (const d of vaelger.split(',')) {
      const del = d.trim();
      // egen farve, ellers den samme vaelger uden pseudoklasse/-element
      const grund = del.replace(/:{1,2}[a-z-]+(\([^)]*\))?/g, '').trim();
      const farve = farvePaa.get(del) ?? farvePaa.get(grund);
      if (farve && /^#FFF(FFF)?$/i.test(farve)) fund.push(del);
    }
  }
  return fund;
}

/** Fund: en dashed/solid kant i hvid oven paa en accent-flade. */
const l76HvidKantPaaAccent = (css) => regler(css)
  .filter((r) => /background:var\(--accent\)/.test(r.krop) && /border[^:]*:[^;]*#FFFFFF/i.test(r.krop))
  .map((r) => r.vaelger);

/* ====================== L78 ====================== */

const l78ForkertRamme = (css) => [
  ...udenKommentarer(css).matchAll(/aspect-ratio:\s*16\s*\/\s*10/g),
].map(() => 'aspect-ratio:16/10');

const l78Beskaering = (css) => [
  ...udenKommentarer(css).matchAll(/object-fit:\s*cover/g),
].map(() => 'object-fit:cover');

/* ====================== L79 ====================== */

/** Fund: en radius skrevet i haanden. 0 er en anden PAASTAND end
 *  "systemets hjoerne", og 99px er en fuldt afrundet ENDE - begge lovlige. */
function l79HaandskrevetRadius(css) {
  const fund = [];
  for (const m of udenKommentarer(css).matchAll(/border-radius:([^;}]+)/g)) {
    for (const del of m[1].trim().split(/[\s/]+/)) {
      if (del.startsWith('var(') || del === 'inherit') continue;
      if (del === '0' || del === '0px' || del === '99px' || del === '50%') continue;
      fund.push(del);
    }
  }
  return fund;
}

/* ====================== L80 ====================== */

/** Fund: et skrift-token, hvis FOERSTE familie ikke har en @font-face.
 *  Det er den vagt, der ville have fanget den oprindelige fejl aarevis
 *  foer: tokenet pegede paa en familie uden fontfil, og hele sitet faldt
 *  til systemskrift, mens alt saa gyldigt ud for CSS-parseren. */
function l80FantomSkrift(css) {
  const ren = udenKommentarer(css);
  const hosted = new Set(
    [...ren.matchAll(/@font-face\{[^}]*font-family:\s*"([^"]+)"/g)].map((m) => m[1]),
  );
  const fund = [];
  for (const m of ren.matchAll(/--([a-z0-9-]+):\s*"([^"]+)"\s*,/g)) {
    if (!hosted.has(m[2])) fund.push(`--${m[1]} -> "${m[2]}"`);
  }
  return fund;
}

export default async function koer(ctx) {
  const { rod, ok } = ctx;

  console.log('\n61. L76/L78/L79/L80: systemreglerne fra 2. sep (spor/extract)');

  const sys = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');
  const gen = fs.readFileSync(path.join(rod, 'assets', 'generator.css'), 'utf8');
  const begge = sys + '\n' + gen;

  /* --- 0. Maaleapparatet foerst -------------------------------------
     Hver vagt faar en CSS-stump med praecis den fejl, den skal fange.
     Ser den ikke fejlen her, betyder dens 0 paa de rigtige filer intet. */
  {
    const OEDELAGT = {
      'L76 accent som tekst': [
        l76AccentSomForgrund, '.prosalink{color:var(--accent)}'],
      'L76 hvid paa accent, SAMME regel': [
        l76HvidPaaAccent, '.chip{background:var(--accent);color:#FFFFFF}'],
      'L76 hvid paa accent, SPLITTET over to regler': [
        l76HvidPaaAccent, '.knap{background:var(--blaek);color:#FFFFFF}\n.knap:hover{background:var(--accent)}'],
      'L76 hvid kant paa accent': [
        l76HvidKantPaaAccent, '.hul:checked{background:var(--accent);border:1px dashed #FFFFFF}'],
      'L78 forkert sideforhold': [
        l78ForkertRamme, '.billedled{aspect-ratio:16/10}'],
      'L78 beskaeret foto': [
        l78Beskaering, '.billedled img{object-fit:cover}'],
      'L79 haandskrevet radius': [
        l79HaandskrevetRadius, '.panel{border-radius:12px}'],
      'L80 fantomskrift': [
        l80FantomSkrift, ':root{--sans:"Manrope lokal",Manrope,sans-serif}'],
    };
    let fangede = 0;
    const slap = [];
    for (const [navn, [vagt, stump]] of Object.entries(OEDELAGT)) {
      if (vagt(stump).length > 0) fangede++; else slap.push(navn);
    }
    const antal = Object.keys(OEDELAGT).length;
    ok(`61.0: alle ${antal} oedelagte tilfaelde fanges af deres egen vagt`,
      slap.length === 0,
      `slap igennem: ${slap.join(', ')} - vagternes nul nedenfor betyder saa ingenting`);
    console.log(`  info  61: ${fangede} af ${antal} oedelagte tilfaelde fanget`);

    // Og modsat: en ren stump maa ikke give falske fund.
    ok('61.0b: vagterne larmer ikke paa ren CSS',
      l76AccentSomForgrund('.a{color:var(--blaek)}').length === 0
      && l76HvidPaaAccent('.a{background:var(--accent);color:var(--blaek)}').length === 0
      && l79HaandskrevetRadius('.a{border-radius:var(--hjoerne)}').length === 0
      && l79HaandskrevetRadius('.a{border-radius:0}.b{border-radius:99px}').length === 0
      && l80FantomSkrift('@font-face{font-family:"X"}\n:root{--t:"X",serif}').length === 0,
      'en vagt, der altid finder noget, er lige saa ubrugelig som en, der aldrig goer');
  }

  /* --- 1. L76 ------------------------------------------------------- */
  {
    const forgrund = l76AccentSomForgrund(begge);
    ok('61.1: --accent bruges kun som tekst paa de tre kendte moerke flader',
      forgrund.length === 0,
      `accent som forgrund uden for listen: ${forgrund.join(' · ')}`);

    ok('61.2: ingen hvid tekst paa en accent-flade (ogsaa naar farve og '
      + 'baggrund staar i hver sin regel)',
      l76HvidPaaAccent(begge).length === 0,
      `hvid paa accent: ${l76HvidPaaAccent(begge).join(' · ')}`);

    ok('61.3: ingen hvid kant paa en accent-flade',
      l76HvidKantPaaAccent(begge).length === 0,
      `hvid kant paa accent: ${l76HvidKantPaaAccent(begge).join(' · ')}`);

    // Grundreglen for links: --blaek, ikke accent. Accent er markoeren.
    const aRegel = (regler(sys).find((r) => r.vaelger === 'a') || {}).krop || '';
    ok('61.4: linkets grundregel saetter --blaek, ikke accent',
      /color:var\(--blaek\)/.test(aRegel) && !/color:var\(--accent\)/.test(aRegel),
      `a{...}: ${aRegel.trim()}`);
    ok('61.5: accent flytter til hover som UNDERSTREGNINGENS farve, ikke tekstens',
      /a:hover\{[^}]*text-decoration-color:var\(--accent\)/.test(udenKommentarer(sys)),
      'en gul tekstfarve paa hover ville give 1,38 mod hvilens 12,72 - modsat hensigten');
  }

  /* --- 2. L78 ------------------------------------------------------- */
  {
    ok('61.6: intet 16:10-sideforhold er tilbage i stilarkene',
      l78ForkertRamme(begge).length === 0);
    ok('61.7: intet produktfoto beskaeres (ingen cover-fit)',
      l78Beskaering(begge).length === 0);

    const billedled = (regler(sys).find((r) => r.vaelger === '.billedled') || {}).krop || '';
    ok('61.8: .billedled baerer sideforholdet 4:3 i grundreglen',
      /aspect-ratio:\s*4\s*\/\s*3/.test(billedled), billedled.trim());
    const billedledImg = (regler(sys).find((r) => r.vaelger === '.billedled img') || {}).krop || '';
    ok('61.9: .billedled img indpasser billedet (contain) i grundreglen',
      /object-fit:\s*contain/.test(billedledImg), billedledImg.trim());

    /* MAALTRO-PLADEN: den ene undtagelse, og den er en MAALEENHED.
       Pladens kasse tegnes i procent af feltet, og procenterne regnes i
       tools/skabelon/side.mjs ud fra et 16:10-felt. Skifter CSS'en
       sideforhold uden at side.mjs foelger med, bliver hver silhuet
       tegnet forkert - maalt 20,0 % for hoej ved 4:3 - og INTET andet i
       testpakken ville sige fra. Vagten laeser BEGGE sider og kraever, at
       de er enige. Den er derfor ikke en kopi af en konstant, men en
       sammenligning af to uafhaengige kilder. */
    const cssForhold = (udenKommentarer(sys).match(/--plade-forhold:\s*(\d+)\s*\/\s*(\d+)/) || []);
    const side = fs.readFileSync(path.join(rod, 'tools', 'skabelon', 'side.mjs'), 'utf8');
    const mm = side.match(/PLADE_MM_HOEJ\s*=\s*PLADE_MM_BRED\s*\*\s*(\d+)\s*\/\s*(\d+)/);
    ok('61.10: --plade-forhold findes i CSS og PLADE_MM_HOEJ i side.mjs',
      cssForhold.length === 3 && !!mm,
      `css=${cssForhold[0] || 'mangler'} · side.mjs=${mm ? mm[0] : 'mangler'}`);
    if (cssForhold.length === 3 && mm) {
      // CSS skriver bredde/hoejde (16/10); side.mjs skriver hoejde-faktoren
      // som hoejde/bredde (10/16). De er enige, naar produktet er 1.
      const cssR = Number(cssForhold[1]) / Number(cssForhold[2]);
      const mjsR = Number(mm[1]) / Number(mm[2]);
      ok('61.11: maaltro-pladens sideforhold er ENS i CSS og i side.mjs',
        Math.abs(cssR * mjsR - 1) < 1e-9,
        `css ${cssForhold[1]}/${cssForhold[2]} mod side.mjs ${mm[1]}/${mm[2]} `
        + `- skrider de fra hinanden, tegnes hver silhuet forkert i en side, `
        + `hvis kerneloefte er at maalene er tro`);
    }
  }

  /* --- 3. L79 ------------------------------------------------------- */
  {
    const haand = l79HaandskrevetRadius(begge);
    ok('61.12: ingen radius er skrevet i haanden (0 og 99px-pillen undtaget)',
      haand.length === 0, `haandskrevne vaerdier: ${[...new Set(haand)].join(', ')}`);

    const rod16 = (udenKommentarer(sys).match(/:root\{[\s\S]*?\n\}/) || [''])[0];
    ok('61.13: --hjoerne er defineret og er 2px',
      /--hjoerne:\s*2px/.test(rod16), 'systemets ene hjoerne');
    ok('61.14: de tre bloede radius-tokens er vaek',
      !/--rund(-ind|-lille)?:/.test(rod16),
      'rund/rund-ind/rund-lille udgik med L79');
    ok('61.15: intet brugssted peger paa et af de tre gamle tokens',
      !/var\(--rund(-ind|-lille)?\)/.test(udenKommentarer(begge)));

    // De tre .typeskilt-regler, der ophaevede --rund tilbage til 2px, var
    // selvophaevende, da 2px blev standarden. Kommer de igen, er nogen ved
    // at genindfoere haandrettelsen, L79 afskaffede.
    ok('61.16: de selvophaevende .typeskilt-radiusregler er ikke kommet igen',
      !/\.typeskilt \.robot-noegletal \.stribe\{border-radius/.test(udenKommentarer(sys))
      && !/\.typeskilt \.robot-foto \.billedled--stor\{border-radius/.test(udenKommentarer(sys)));
  }

  /* --- 4. L80 ------------------------------------------------------- */
  {
    const fantom = l80FantomSkrift(sys);
    ok('61.17: intet skrift-token peger paa en familie uden @font-face',
      fantom.length === 0,
      `fantomskrift: ${fantom.join(' · ')} - sitet ville falde til systemskrift, `
      + `og CSS'en ville se gyldig ud hele vejen`);

    ok('61.18: --sans er vaek som token og som brugssted',
      !/--sans:/.test(udenKommentarer(sys))
      && !/var\(--sans\)/.test(udenKommentarer(begge)));

    const body = (regler(sys).find((r) => r.vaelger === 'body') || {}).krop || '';
    ok('61.19: body saetter sin skrift EKSPLICIT til --mono (Saira)',
      /font-family:var\(--mono\)/.test(body),
      'det var netop denne ene erklaering, der sendte hele sitet i systemskrift');

    /* Hver @font-face skal pege paa en fil, der FINDES. Foerste udgave af
       denne vagt gaettede paa filnavnet ud fra familienavnet
       ("SairaSemiCondensed" -> "sairas...") og gav et falsk fund, fordi
       filerne hedder "saira-400-...". Den slags gaet er praecis det, en
       vagt ikke skal lave: her aabnes src-URL'en i stedet, saa det er
       DISKEN og ikke et navnemoenster, der svarer. */
    const ren = udenKommentarer(sys);
    const hosted = [...ren.matchAll(/@font-face\{[^}]*font-family:\s*"([^"]+)"/g)].map((m) => m[1]);
    const kilder = [...ren.matchAll(/@font-face\{[^}]*src:url\("([^"]+)"/g)].map((m) => m[1]);
    const manglerFil = kilder.filter(
      (u) => !fs.existsSync(path.join(rod, 'assets', u)),
    );
    ok('61.20: hver @font-face peger paa en fil, der findes i assets/',
      kilder.length > 0 && manglerFil.length === 0,
      kilder.length === 0 ? 'fandt ingen src:url() - vagten maaler intet'
        : `uden fil paa disken: ${manglerFil.join(', ')}`);
    ok('61.21: der er praecis TO selvhostede familier (Saira og Literata)',
      new Set(hosted).size === 2, `fandt: ${[...new Set(hosted)].join(', ')}`);
  }
}
