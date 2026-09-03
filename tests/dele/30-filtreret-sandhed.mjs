/**
 * tests/dele/30-filtreret-sandhed.mjs — spor/haerd, 28. aug 2026.
 *
 * EMNET er den FILTREREDE tilstand: katalogsiden er sand i hvile, og
 * spoergsmaalet er, om den bliver ved med at vaere det, naar nogen bruger
 * hovedbetjeningen. Kritikken 28. aug maalte, at den ikke gjorde:
 * `#f-land-tyskland` ved 1440 gav 1 synligt kort, mens 37 taellere stod
 * uaendret og 3 sale beholdt overskrift og tal over nul kort.
 *
 * Vagterne her laeser BYGGET OUTPUT og de tre kildefiler, der baerer
 * mekanismen. De kan ikke maale computed px - det kraever en browser, og
 * generatoren skal blive ved med at vaere afhaengighedsfri - saa de vogter
 * MEKANISMEN (findes selektoren, staar maerket paa hver taeller, lytter
 * scriptet paa felterne), mens browsermaalingerne i commit-beskederne
 * beviser VIRKNINGEN. Hver enkelt vagt er valgt, saa den bliver ROED, hvis
 * arbejdet rulles tilbage.
 *
 * 1. Hver statisk taeller baerer et omfangsmaerke ("41 af 77").
 * 2. Maerkerne staar `hidden` i hvile og taendes kun uden JavaScript.
 * 3. De genererede tomhedsregler findes, én pr. (sal x facet x tilstand).
 * 4. Alle fire dele af en sal baerer `data-sal`, saa ÉN regel tager dem alle.
 * 5. Nul-tilstanden kan naas fra filtrene og har begge begrundelser.
 * 6. katalog.js lytter FAKTISK paa afkrydsningsfelterne (fil:linje beviser
 *    at kode findes, ikke at nogen kalder den).
 * 7. De fire datatilstande kollapser ikke paa desktop (K2).
 * 8. Kildemaerket har et gulv, og undtagelsen er ikke genindfoert (K3).
 * 9. Loeftet: kortene staar i statisk HTML, uden JavaScript.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { rens } from '../rens-css.mjs';

/** Synlig tekst: script/style ud, tags ud. */
function synligTekst(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

/** Indholdet af det inline <style>, bygget skriver i <head>. */
function genereretStil(html) {
  const i = html.indexOf('<style>');
  return i === -1 ? '' : html.slice(i + 7, html.indexOf('</style>', i));
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n30. Den filtrerede katalogside lyver ikke (spor/haerd)');

  const ud = path.join(tmp, 'dist-filtersandhed');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('30.0: bygget lykkedes', b.status === 0,
    `exit ${b.status}: ${(b.stderr || '').slice(0, 300)}`);

  // spor/oversigt (1. sep 2026): kataloget flyttede til sprogroden.
  const sider = ['da/index.html', 'en/index.html'];
  for (const rel of sider) {
    const p = path.join(ud, rel);
    if (!fs.existsSync(p)) { ok(`30 ${rel}: bygget`, false, 'ikke bygget'); continue; }
    const html = fs.readFileSync(p, 'utf8');
    const stil = genereretStil(html);

    /* --- 1. Hver statisk taeller erklaerer sit omfang --------------------
       VENDT 31. aug 2026 (spor/katalog): salene og tommelindekset er vaek, saa
       `.sal__antal` findes ikke mere. De taellere, der ER tilbage, er
       facetternes `.antal`, egenskabschippenes `.antal--chip`, strimlens store
       taeller og resultatets overskrift - og KRAVET er uaendret: hver eneste
       af dem skal baere praecis ét omfangsmaerke, fordi hver eneste af dem er
       regnet ved byggetiden over hele kataloget.

       Tallene er UDLEDT af siden selv, ikke skrevet i haanden her: kataloget
       vokser, og en haardkodet 30'er ville vaere forkert i morgen. */
    const facetTaellere = (html.match(/<span class="antal">/g) || []).length;
    const chipTaellere = (html.match(/<span class="antal antal--chip">/g) || []).length;
    const hovedTaellere = (html.match(/<p class="taeller">/g) || []).length
      + (html.match(/<h2 class="resultat__titel"/g) || []).length;
    const medMaerke = (html.match(/<span class="taeller-omfang" data-omfang hidden>/g) || []).length;
    ok(`30.1 ${rel}: der ER taellere at vogte`,
      facetTaellere > 0 && chipTaellere > 0 && hovedTaellere === 2,
      `facet ${facetTaellere}, chip ${chipTaellere}, hoved ${hovedTaellere}`);
    ok(`30.2 ${rel}: hver taeller baerer praecis ét omfangsmaerke`,
      medMaerke === facetTaellere + chipTaellere + hovedTaellere,
      `${medMaerke} maerker mod ${facetTaellere + chipTaellere + hovedTaellere} taellere`);

    /* --- 2. Maerket staar hidden i hvile -------------------------------- */
    // Uden dette ville "41 af 77" staa altid - ogsaa i hvile, hvor taelleren
    // beskriver baade kataloget og det viste, og efterstillingen kun er stoej.
    ok(`30.3 ${rel}: maerkerne er hidden som udgangspunkt`,
      medMaerke > 0 && !/<span class="taeller-omfang" data-omfang>/.test(html),
      'et maerke uden hidden ville staa i enhver tilstand');

    /* --- 3. De genererede filterregler -----------------------------------
       VENDT 31. aug 2026 (spor/katalog). TOMHEDSREGLERNE ER VAEK, fordi det
       problem, de loeste, er vaek: de skjulte en sals overskrift og tal, naar
       et filter tommede salen, og der er ingen sale mere. Reglen kunne ikke
       overleve L56 punkt 3 (alfabetisk standardsortering) - se katalog.mjs'
       filhoved.

       Det, der SKAL vogtes i stedet, er den mekanik, filtrene faktisk hviler
       paa nu, og som skal blive ved med at virke UDEN JavaScript: ét lag pr.
       facet med skjul-alle + vis-de-valgte, og egenskabschippenes modsatte
       form. Tallene udledes af siden selv. */
    const facetter = new Set([...html.matchAll(/class="rk__felt f-([a-z]+)"/g)].map((m) => m[1]));
    /* UDVIDET 1. sep 2026 (spor/filter, L65c/L66). Skjul-reglen findes nu i TO
       former, og maalingen skal kende dem begge:

         .styr:has(...)                              listefacetterne
         .styr:not([data-levende]):has(...)          skalafacetterne

       Den anden form er ikke en variant af den foerste - den er selve
       kontrakten mellem sidens to oploesninger af det samme filter. Skalaerne
       (nyttelast, pris) filtrerer i CSS, NAAR JavaScript ikke koerer, og
       overlades til assets/katalog.js, naar det goer. Uden leddet filtrerede
       begge paa én gang med hver sin graense.

       Foer denne udvidelse taalte regexet kun den foerste form og talte 10 af
       14 skjul-regler - altsaa roed, selvom hver facet HAVDE sine regler. */
    const skjulRegler = (stil.match(/\.styr(?::not\(\[data-levende\]\))?:has\(\.f-[a-z]+:(checked|target)\) \.lag-[a-z]+/g) || []).length;
    const visRegler = (stil.match(/\.lag-[a-z]+\[data-[a-z]+~="[^"]+"\]/g) || []).length;
    ok(`30.4 ${rel}: facetterne er fundet`, facetter.size >= 5,
      `${facetter.size} facetter: ${[...facetter].join(', ')}`);
    // To skjul-regler pr. facet (:checked og :target), og mindst én vis-regel
    // pr. facetvaerdi - ellers kunne et filter slukke kort uden at kunne
    // taende dem igen.
    ok(`30.5 ${rel}: hver facet har baade skjul- og vis-regler`,
      skjulRegler === facetter.size * 2 && visRegler >= facetter.size * 2,
      `${skjulRegler} skjul (forventet ${facetter.size * 2}), ${visRegler} vis`);

    /* DE TO OPLOESNINGER MAA IKKE FILTRERE SAMTIDIG (L65c).
       Fjerner nogen `:not([data-levende])` fra en skalas regler, filtrerer
       CSS'en paa den afkrydsede traerskel OG assets/katalog.js paa sliderens
       stilling - to graenser paa én gang, og fejlen er tavs: siden viser
       faerre kort end begge filtre hver for sig ville give. Derfor vogtes
       leddet her, i begge retninger. */
    const skalaNavne = [...html.matchAll(/data-skala="([a-z]+)"/g)].map((m) => m[1]);
    ok(`30.5b ${rel}: skalafacetterne er fundet`, skalaNavne.length === 2,
      `fandt ${skalaNavne.length}: ${skalaNavne.join(', ')}`);
    for (const s of skalaNavne) {
      ok(`30.5c ${rel}: skalaen "${s}" filtrerer KUN uden JavaScript`,
        new RegExp(`\\.styr:not\\(\\[data-levende\\]\\):has\\(\\.f-${s}:checked\\) \\.lag-${s}`).test(stil)
          && !new RegExp(`\\.styr:has\\(\\.f-${s}:checked\\)`).test(stil),
        'uden :not([data-levende]) filtrerer CSS og slideren samtidig med hver sin graense');
    }
    for (const f of [...facetter].filter((n) => !skalaNavne.includes(n))) {
      ok(`30.5d ${rel}: listefacetten "${f}" filtrerer OGSAA med JavaScript`,
        new RegExp(`\\.styr:has\\(\\.f-${f}:checked\\) \\.lag-${f}`).test(stil),
        'en listefacet har ingen JavaScript-udgave at overlade filtreringen til');
    }
    /* Egenskabschippene gaar den MODSATTE vej: ren HIDE med :not(), saa flere
       chips lagrer sig som OG. Uden :not()-formen ville to chips udvide
       udvalget i stedet for at indsnaevre det - og "gaar paa trapper ELLER
       arbejder i frost" er ikke det, en chipraekke lover. */
    ok(`30.6 ${rel}: egenskabschippene skjuler med :not(), saa de virker som OG`,
      /\.styr:has\(#f-eg-[a-z]+:checked\) \.lag-eg:not\(\[data-eg~="[a-z]+"\]\)/.test(stil),
      'uden :not()-formen ville to chips udvide udvalget i stedet for at indsnaevre det');

    /* --- 4. INGEN facet har en standardtilstand (BRIEF-uifix.md punkt 3,
       spor/uifix, 2. sep 2026, erstatter L56 punkt 5) --------------------
       JPK, ordret: "som standard skal INGEN [filtre] vaere aktive." Status
       havde foer denne rettelse to `checked`-vaerdier (i produktion,
       annonceret) og en tredje, aktivt SKJULT (udgaaet) - to fejl i én, for
       ingen af de to aktive filtre viste en chip. Nu er alle tre status-
       checkbokse UNCHECKED ved indlaesning, ligesom enhver anden facet, og
       kataloget viser alle 77 robotter i stedet for 74. */
    const statusChecked = (html.match(/id="f-status-(i_produktion|annonceret|udgaaet)"[^>]*checked/g) || []).length;
    ok(`30.7 ${rel}: INGEN status-vaerdi er checked i HTML (BRIEF-uifix.md punkt 3)`,
      statusChecked === 0, `${statusChecked} af 3 var checked, forventede 0`);
    // REVERT-BEVIS: samme regex FANGER en syntetisk streng med én checked.
    ok(`30.7.revert ${rel}: samme optaelling fanger en checked status-vaerdi`,
      (('id="f-status-udgaaet" type="checkbox" checked'
        .match(/id="f-status-(i_produktion|annonceret|udgaaet)"[^>]*checked/g)) || []).length === 1);
    /* 30.7b ER VENDT (spor/knap, L77, 2. sep 2026). Den krallede den ordrette
       streng `<button class="nulstil" type="reset"`. Klassen `.nulstil` findes
       ikke mere - knappen er sitets ene knapprimitiv i den moerke omridsede
       vaegt - men KRAVET er uaendret og faktisk skaerpet: det er stadig
       `type="reset"`, der er hele mekanikken uden JavaScript, og nu proeves
       ogsaa, at knappen har valgt en flade. En `.knap` uden flade-variant
       ville arve sin omgivelse; her staar den paa .strimmel, som er moerk. */
    const nulstilKnap = (html.match(/<button[^>]*type="reset"[^>]*>/) || [])[0] || '';
    ok(`30.7b ${rel}: NULSTIL er en reset-knap, saa standarden kan naas uden JavaScript`,
      !!nulstilKnap,
      'et link til #alle kan kun rydde :target, ikke afkrydsningerne');
    ok(`30.7c ${rel}: nulstil-knappen er knapprimitiven med en MOERK flade-variant`,
      /\bclass="[^"]*\bknap\b[^"]*"/.test(nulstilKnap)
      && /knap--(fyldt|kant|tekst)-moerk\b/.test(nulstilKnap),
      `fandt: ${nulstilKnap || '(ingen reset-knap)'}`);

    /* --- 5. Nul-tilstanden ---------------------------------------------- */
    ok(`30.8 ${rel}: nul-tilstanden har baade soege- og filterbegrundelse`,
      /data-tomt-grund="soeg"/.test(html) && /data-tomt-grund="filter"/.test(html),
      'en tom side uden forklaring er den fejltilstand, kritikken kaldte uopnaaelig');
    ok(`30.9 ${rel}: nul-tilstanden tilbyder en vej ud`,
      /class="[^"]*tomt__ryd[^"]*" data-ryd/.test(html),
      'uden et ryd-link er en nul-tilstand en blindgyde');
    ok(`30.10 ${rel}: nul-tilstanden ligger INDE i formularen`,
      html.indexOf('data-tomt') > html.indexOf('<form class="styr"')
        && html.indexOf('data-tomt') < html.indexOf('</form>'),
      'uden for formularen kan CSS ikke naa den fra .styr');

    /* --- 9. Loeftet: kortene staar i statisk HTML ------------------------ */
    const kort = (html.match(/class="kort[ "]/g) || []).length;
    ok(`30.11 ${rel}: kortene staar i statisk HTML (virker uden JavaScript)`,
      kort > 0, 'kataloget maa aldrig kraeve JavaScript for at vise robotter');
    // Og omfangsmaerkets tekst skal vaere OVERSAT, ikke dansk paa /en/.
    const tekst = synligTekst(html);
    if (rel.startsWith('en/')) {
      ok('30.12 en: omfangsmaerket er oversat',
        / of \d+/.test(tekst) && !/ af \d+/.test(tekst),
        'maerket skrives fra sprogfilerne, ikke haardkodet');
    }
  }

  /* --- 6. Lytter katalog.js FAKTISK paa afkrydsningsfelterne? ----------- */
  // Kritikkens mekanisme var netop, at intet gjorde: katalog.js lyttede kun
  // paa soegefeltet, saa [data-tomt] aldrig kunne naas fra filtrene.
  const js = fs.readFileSync(path.join(rod, 'assets', 'katalog.js'), 'utf8');
  ok('30.13: katalog.js lytter paa afkrydsningsfelterne',
    /bokse\[i\]\.addEventListener\('change', opdater\)/.test(js),
    'uden en change-lytter er taellerne doede, uanset hvad opdater() kan');
  /* VENDT 1. sep 2026 (spor/filter). Lytteren var `('hashchange', opdater)`
     og er nu en funktion, der goer TO ting - og begge er paakraevede:

       fraTraerskler()  loefter en traerskel fra et filterlink
                        (robotter/#f-nyttelast-20) ind i skalaen. Uden den
                        taber netop de links deres filter i det oejeblik
                        JavaScript indlaeser, fordi skalafacetternes CSS er
                        slukket af `data-levende`.
       opdater()        det, lytteren altid har gjort.

     Paastanden er derfor skaerpet, ikke sloejfet: den kraever nu begge kald
     inde i den samme lytter. Den gamle form ville bestaa med kun opdater(). */
  /* MAALEAPPARATET, EFTERPROEVET FOER TALLET. Foerste udgave af denne
     paastand var `...([\s\S]{0,160}?)\);` - en dovent afgraenset gruppe, der
     stoppede ved lytterens FOERSTE `);`, altsaa midt inde i `fraTraerskler(`.
     Den rapporterede en manglende opdater(), som stod der hele tiden. Derfor
     et fast vindue i stedet for en afgraensning, regexet skal gaette sig til. */
  const hashI = js.indexOf("addEventListener('hashchange'");
  const hashLytter = hashI < 0 ? null : js.slice(hashI, hashI + 200);
  ok('30.14: hashchange loefter traerskler ind i skalaen OG opdaterer',
    !!hashLytter && /fraTraerskler\(\)/.test(hashLytter) && /opdater\(\)/.test(hashLytter),
    hashLytter ? `lytteren goer: ${hashLytter.split('\n')[0].trim()}` : 'ingen hashchange-lytter fundet');
  ok('30.15: katalog.js maaler geometrien i stedet for at regne CSS efter',
    /getClientRects\(\)\.length/.test(js),
    'to kilder til samme sandhed kan blive uenige');
  // Den maalte faelde: `defer` koerer FOER browseren udpeger :target.
  ok('30.16: foerste opdatering gentages ved load (:target er foerst loest da)',
    /readyState === 'complete'/.test(js) && /addEventListener\('load', opdater\)/.test(js),
    'uden den maaler foerste kald en ufiltreret side og saetter taellerne til katalogets tal');
  ok('30.17: katalog.js saetter data-levende, saa forbeholdene slukkes',
    /setAttribute\('data-levende'/.test(js),
    'ellers ville "41 af 77" staa ved siden af et tal, der ER regnet om');

  /* --- 7. K2: de fire datatilstande paa desktop ------------------------- */
  const gen = fs.readFileSync(path.join(rod, 'assets', 'generator.css'), 'utf8');
  const sys = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');
  ok('30.18: noegletalspanelet saetter IKKE satsen paa alle .v',
    !/\.robot-noegletal \.stribe \.v\{/.test(gen),
    'den brede regel slog system.css\' .v-ikke/.v-nej og gjorde hullet lige saa tungt som tallet');
  // Rens FILEN, ikke moenstret (tests/rens-css.mjs, BRIEF-prodtest.md):
  // generator.css blev omformateret, og de nye mellemrum efter komma inde i
  // :not(...) samt foer "{" knaekkede det gamle, kompakte moenster.
  ok('30.19: figurens sats undtager de fire datatilstande',
    /\.robot-noegletal\.stribe\.v:not\(\.v-ikke,\.v-billede,\.v-nej,\.v-ja\)\{font-size:23px\}/.test(rens(gen)),
    'haard begraensning 5: ikke oplyst, nej og 0 skal se forskellige ud');
  ok('30.20: tilstandenes egen skala staar stadig i system.css',
    /\.stribe \.v-ikke,\.stribe \.v-billede\{font-size:13px\}/.test(sys)
      && /\.stribe \.v-nej,\.stribe \.v-ja\{font-size:18px\}/.test(sys));

  /* --- 8. K3: kildemaerkets gulv ---------------------------------------- */
  ok('30.21: kildemaerket har et gulv i px, ikke kun en em-andel',
    /\.kildemaerke\{[\s\S]{0,200}?font-size:max\(8px,\.34em\)/.test(sys),
    'et rent em-tal arver graden fra en foraelder, der selv kan vaere 11 px');
  ok('30.22: den gamle .47em-undtagelse er ikke genindfoert',
    !/\.stribe--kompakt \.v-tal > \.kildemaerke\{font-size:\.47em\}/.test(sys),
    'den ramte 7,99 px - 0,01 under sit eget maal - og daekkede kun én af fem sammenhaenge');
}
