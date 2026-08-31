/**
 * tests/dele/39-rod.mjs — sprogvaelgeren paa roden (dist/index.html), spor/rod.
 *
 * Roden er den ENESTE flade i vaerket uden en skabelon: den er en HTML-blok
 * inde i tools/build.mjs. Netop derfor havde intet redesignspor roert den, og
 * netop derfor havde den heller ingen tests. JPK aabnede den 31. aug 2026 og
 * sagde "DET ER JO DEN GAMLE SIDE DU VISER MIG!!" - og han havde ret.
 *
 * DEN HULLEDE VAGT, denne fil lukker. Briefet til sporet sagde, at
 * `tests/dele/04-byg-struktur.mjs:68-69` vogtede rodens hreflang-linker.
 * Maalt 31. aug 2026: de to linjer findes, men de laeser `spotDa` - ROBOT-
 * DETALJESIDEN. En `grep -rn hreflang tests/dele/*.mjs tests/koer.mjs` gav
 * praecis den ene forekomst. Rodens hreflang var altsaa slet IKKE vogtet:
 * havde sporet slettet de tre <link rel="alternate">, var suiten forblevet
 * groen. Det er skolebogseksemplet paa CLAUDE.md's regel - `fil:linje`
 * beviser, at kode findes, ikke at den rammer det, man tror.
 *
 * ANDET HUL, som ogsaa lukkes her: tests/dele/31-pudsning.mjs vogter
 * radius-skalaen og skriftgulvet, men den laeser KUN assets/system.css og
 * assets/generator.css (se dens egen loekke over [['system.css', sys],
 * ['generator.css', gen]]). Rodens form staar i et inline <style> - som
 * spor/rod var noedt til, fordi spor/topbar ejede system.css - og den CSS
 * naaes derfor af ingen af de to vagter. Reglerne haandhaeves her i stedet,
 * saa den midlertidige placering ikke bliver et smuthul.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const { rod, tmp, node, ok, skema, lasRobotter } = ctx;

  console.log('\n39. Sprogvaelgeren paa roden (spor/rod)');

  const dist = path.join(tmp, 'dist-rod');
  const dataMappe = path.join(rod, 'tests', 'eksempel-robotter');
  const r = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${dataMappe}`, `--ud=${dist}`], { cwd: rod, encoding: 'utf8' });
  ok('39.1: build.mjs giver exit 0', r.status === 0, (r.stderr || '').trim());

  const rodSide = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  const fixtur = lasRobotter(dataMappe);
  const fixturLande = new Set(fixtur.map((x) => x.producentland).filter(Boolean));

  /* --- 1. Tallene er REGNET, ikke tastet ---------------------------------
     Kernen i hele filen. Prøvedatasættet har 3 robotter, ikke 77 - saa et
     haardkodet "77" i blokken ville staa sort paa hvidt her, mens et regnet
     tal foelger med ned paa 3. Det er D7/L30-faelden, maalt frem for antaget:
     "et haandskrevet tal ved siden af et udledt". */
  const stempel = (navn) => {
    const m = rodSide.match(new RegExp(`<dt>${navn}</dt><dd>([^<]*)</dd>`));
    return m ? m[1].trim() : null;
  };
  const somTal = (s) => (s === null ? null : Number(s.replace(/\./g, '')));

  ok(`39.2: POSTER foelger datasaettet (${fixtur.length} robotter i proevedata, ikke katalogets 77)`,
    somTal(stempel('Poster')) === fixtur.length,
    `pladen stanser "${stempel('Poster')}", datasaettet har ${fixtur.length}`);
  ok(`39.3: LANDE foelger datasaettet (${fixturLande.size} unikke producentlande)`,
    somTal(stempel('Lande')) === fixturLande.size,
    `pladen stanser "${stempel('Lande')}", datasaettet har ${fixturLande.size}`);

  // Siden og byggets logudskrift skal baere SAMME tal. De kommer i dag fra
  // samme funktion (build.mjs' taelKilder), og denne proeve er det, der
  // opdager det, hvis nogen senere giver dem hver sin kilde igen.
  const logTal = (r.stdout || '').match(/Kildemaerker: (\d+) tal med kilde/);
  ok('39.4: TAL MED KILDE er det samme tal, som bygget selv rapporterer',
    !!logTal && somTal(stempel('Tal med kilde')) === Number(logTal[1]),
    `pladen: "${stempel('Tal med kilde')}", loggen: "${logTal ? logTal[1] : 'intet tal fundet'}"`);
  ok('39.5: TAL MED KILDE er positivt (en tom plade er ikke et gyldigt stempel)',
    somTal(stempel('Tal med kilde')) > 0);

  // Datoen skal vaere en rigtig ISO-dato fra data - ikke byggedatoen, som
  // ville goere outputtet ikke-deterministisk.
  const dato = stempel('Nyeste kilde');
  ok('39.6: NYESTE KILDE er en ISO-dato', /^\d{4}-\d{2}-\d{2}$/.test(dato || ''), `fik "${dato}"`);
  ok('39.7: NYESTE KILDE er ikke byggedagen (den skal komme fra data, ikke fra uret)',
    dato !== new Date().toISOString().slice(0, 10)
      || fixtur.some((x) => JSON.stringify(x).includes(dato)),
    `"${dato}" ligner dagens dato og findes ikke i data`);

  /* --- 2. hreflang - vagten, der ikke fandtes ----------------------------- */
  const alternater = [...rodSide.matchAll(/<link rel="alternate" hreflang="([^"]+)"/g)].map((m) => m[1]);
  ok('39.8: roden baerer praecis 3 <link rel="alternate">',
    alternater.length === 3, `fandt ${alternater.length}: ${alternater.join(', ')}`);
  for (const s of skema.SPROG) {
    ok(`39.9: roden baerer hreflang="${s}"`, alternater.includes(s));
  }
  ok('39.10: roden baerer hreflang="x-default"', alternater.includes('x-default'));

  /* --- 3. De to veje ind er LIGEVAERDIGE ---------------------------------
     Den gamle blok brugte .videre + .videre--stille - en fyldt primaerknap og
     en tonet sekundaer. Paa den ene flade i hele vaerket, hvor sprogvalget per
     definition er ligevaerdigt, gjorde det engelsk til andenrangs. Cellerne
     bygges nu af samme kode fra ét array; proeven her er, at de ogsaa ENDER
     ens: samme klasse, ingen variant, én pr. sprog. */
  const veje = [...rodSide.matchAll(/<a class="(rod__vej[^"]*)" href="([^"]+)" hreflang="([^"]+)" lang="([^"]+)">/g)];
  ok(`39.11: én vej ind pr. sprog (${skema.SPROG.length})`,
    veje.length === skema.SPROG.length, `fandt ${veje.length}`);
  ok('39.12: ingen af cellerne baerer en variantklasse (ingen primaer/sekundaer)',
    veje.every((m) => m[1].trim() === 'rod__vej'),
    `klasser: ${veje.map((m) => m[1]).join(' | ')}`);
  for (const s of skema.SPROG) {
    const v = veje.find((m) => m[3] === s);
    ok(`39.13: vejen til /${s}/ har href, hreflang og lang sat`,
      !!v && v[2] === `${s}/` && v[4] === s, v ? `href="${v[2]}" lang="${v[4]}"` : 'cellen mangler');
  }
  ok('39.14: den gamle primaer/sekundaer-grammatik er vaek fra roden',
    !/videre--stille/.test(rodSide));

  /* --- 4. De tre maalte defekter maa ikke komme igen ---------------------
     1) .t-hero arver --sans = "Manrope lokal", der ikke har noget @font-face
        siden spor/fundament: roden stod i Segoe UI, mens resten stod i Saira.
     2) .t-hero er font-weight:800, som Saira ikke har en fil til -> syntetisk
        fedme, praecis den robotsiden allerede er rettet for.
     3) <main class="rum hero"> satte begge klasser paa SAMME element, mens
        generator.css' regel er `.hero .rum{...}` - en EFTERKOMMER-selektor,
        der derfor aldrig ramte. Maalt: main padding-top = 0px. */
  ok('39.15: roden bruger ikke .t-hero (font-weight:800 + skrift uden @font-face)',
    !/class="[^"]*t-hero/.test(rodSide));
  ok('39.16: roden saetter ikke .rum og .hero paa samme element (.hero .rum rammer aldrig)',
    !/class="[^"]*\brum\b[^"]*\bhero\b|class="[^"]*\bhero\b[^"]*\brum\b/.test(rodSide));
  ok('39.17: ingen font-weight:800 paa roden - Saira selvhostes kun i 400/500/600/700',
    !/font-weight:\s*800/.test(rodSide));

  /* --- 5. Vagterne, 31-pudsning.mjs ikke naar ind i --------------------- */
  const stil = (rodSide.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || '';
  ok('39.18: roden har sin egen form i et inline <style>', stil.length > 0);

  // Radius-skalaen 0/2/6/8/12 (+ 99px-pillen), ordret som 31-pudsning.mjs:112.
  const LOVLIG = new Set(['0', '0px', '2px', '6px', '8px', '12px', '99px', '50%']);
  const drift = [];
  for (const m of stil.matchAll(/border-radius:([^;}]+)/g)) {
    for (const del of m[1].trim().split(/[\s/]+/)) {
      if (del.startsWith('var(') || del === 'inherit') continue;
      if (!LOVLIG.has(del)) drift.push(del);
    }
  }
  ok('39.19: rodens inline-CSS holder radius-skalaen 0/2/6/8/12 (+ 99px)',
    drift.length === 0, `uden for skalaen: ${drift.join(', ')}`);

  // Skriftgulvet er 8px for al SYNLIG tekst.
  const forSmaa = [...stil.matchAll(/font-size:\s*([\d.]+)px/g)]
    .map((m) => Number(m[1])).filter((n) => n < 8);
  ok('39.20: intet skriftgulvsbrud i rodens inline-CSS (alt >= 8px)',
    forSmaa.length === 0, `for smaa: ${forSmaa.join(', ')} px`);

  /* --- 6. Tilgaengelighed og de faste husregler -------------------------- */
  ok('39.21: roden har en synlig fokusring paa vejene ind',
    /\.rod__vej:focus-visible\{[^}]*outline:/.test(stil));
  ok('39.22: bevaegelse respekterer prefers-reduced-motion',
    /prefers-reduced-motion/.test(stil));
  ok('39.23: tal staar med tabulartal (tabular-nums) paa maerkepladen',
    /font-variant-numeric:\s*tabular-nums/.test(stil));
  ok('39.24: roden er stadig noindex (den er en vaelger, ikke en forside)',
    /<meta name="robots" content="noindex">/.test(rodSide));
  ok('39.25: roden henviser ikke til media/ (fabrikantmateriale maa aldrig i et byg)',
    !/["'(/]media\//.test(rodSide));
  ok('39.26: ingen koebsknap eller affiliate-link paa roden',
    !/(affiliate|utm_|buy[-_ ]now|koeb nu)/i.test(rodSide));

  /* --- 7. Et stempel uden vaerdi stanses ikke ----------------------------
     Denne proeve findes, fordi sporet FALDT i praecis dette hul: foerste
     udgave af blokken havde en paastaa(), der kraevede baade lande og en
     hentedato, og den faeldede bygget med exit 1 paa 03-billedkaedens
     S1-datasaet - én robot, hvis eneste felt er `egenvaegt: ikke_oplyst`.
     Et saadant datasaet har ingen `hentet` paa et FELT (kun paa `billede:`,
     som med vilje ikke taelles). Rettelsen var at udelade raekken, ikke at
     stanse en blank eller et "0": haard begraensning 5 siger, at "ikke
     oplyst", "nej" og "0" er tre forskellige tilstande, og en tom plade
     maa ikke laane et nul, ingen har maalt. */
  const magerData = path.join(tmp, 'rod-mager-data');
  fs.mkdirSync(magerData, { recursive: true });
  fs.writeFileSync(path.join(magerData, 'proeve-mager.yaml'),
    'slug: proeve-mager\nnavn: Proeve Mager\nproducent: P\nproducentland: Kina\n'
    + 'status: i_produktion\nfremdrift: ben\nfelter:\n  egenvaegt: ikke_oplyst\n', 'utf8');
  const mager = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${magerData}`, `--ud=${path.join(tmp, 'dist-rod-mager')}`], { cwd: rod, encoding: 'utf8' });
  ok('39.28: bygget gennemfoerer paa et datasaet helt uden kildebelagte felter',
    mager.status === 0, `exit ${mager.status}: ${(mager.stderr || '').trim()}`);
  if (mager.status === 0) {
    const magerSide = fs.readFileSync(path.join(tmp, 'dist-rod-mager', 'index.html'), 'utf8');
    ok('39.29: stempler uden vaerdi udelades - ingen tom <dd> paa pladen',
      !/<dd>\s*<\/dd>/.test(magerSide));
    ok('39.30: "Tal med kilde" stanses slet ikke, naar der ingen er (ikke som "0")',
      !/<dt>Tal med kilde<\/dt>/.test(magerSide));
    ok('39.31: POSTER staar stadig, fordi den ER maalt',
      /<dt>Poster<\/dt><dd>1<\/dd>/.test(magerSide));
  }

  // Dansk skal staa som dansk. Roden er den eneste side uden i18n, og den bar
  // derfor som den eneste "opslagsvaerk"/"paa" - transliteration, ikke en
  // kodningsbegraensning: build.mjs baerer i forvejen UTF-8.
  ok('39.27: dansk paa roden er stavet med æøå, ikke translittereret',
    /Opslagsværk/.test(rodSide) && !/opslagsvaerk/i.test(rodSide));
}
