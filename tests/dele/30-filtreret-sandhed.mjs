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

  const sider = ['da/robotter/index.html', 'en/robotter/index.html'];
  for (const rel of sider) {
    const p = path.join(ud, rel);
    if (!fs.existsSync(p)) { ok(`30 ${rel}: bygget`, false, 'ikke bygget'); continue; }
    const html = fs.readFileSync(p, 'utf8');
    const stil = genereretStil(html);

    /* --- 1. Hver statisk taeller erklaerer sit omfang -------------------- */
    // `.antal` staar ved facetterne og i tommelindekset; `.sal__antal` ved
    // salene. Tallene er UDLEDT af siden selv, ikke skrevet i haanden her:
    // kataloget vokser, og en haardkodet 30'er ville vaere forkert i morgen.
    const facetTaellere = (html.match(/<span class="antal">/g) || []).length;
    const salTaellere = (html.match(/<span class="sal__antal figur"/g) || []).length;
    const medMaerke = (html.match(/<span class="taeller-omfang" data-omfang hidden>/g) || []).length;
    ok(`30.1 ${rel}: der ER taellere at vogte`, facetTaellere > 0 && salTaellere > 0,
      `facet/tommel ${facetTaellere}, sal ${salTaellere}`);
    ok(`30.2 ${rel}: hver taeller baerer praecis ét omfangsmaerke`,
      medMaerke === facetTaellere + salTaellere,
      `${medMaerke} maerker mod ${facetTaellere + salTaellere} taellere`);

    /* --- 2. Maerket staar hidden i hvile -------------------------------- */
    // Uden dette ville "41 af 77" staa altid - ogsaa i hvile, hvor taelleren
    // beskriver baade kataloget og det viste, og efterstillingen kun er stoej.
    ok(`30.3 ${rel}: maerkerne er hidden som udgangspunkt`,
      medMaerke > 0 && !/<span class="taeller-omfang" data-omfang>/.test(html),
      'et maerke uden hidden ville staa i enhver tilstand');

    /* --- 3. De genererede tomhedsregler --------------------------------- */
    // Antallet UDLEDES: sale x facetter x 2 tilstande (:checked og :target).
    const sale = new Set([...html.matchAll(/<div class="sal" data-sal="([^"]+)"/g)].map((m) => m[1]));
    const facetter = new Set([...html.matchAll(/<input type="checkbox" class="f-([a-z]+)"/g)].map((m) => m[1]));
    const tomhedsregler = (stil.match(/\[data-sal="[^"]+"\]\{display:none\}/g) || []).length;
    ok(`30.4 ${rel}: sale og facetter fundet`, sale.size > 0 && facetter.size > 0,
      `${sale.size} sale, ${facetter.size} facetter`);
    ok(`30.5 ${rel}: én tomhedsregel pr. sal x facet x tilstand`,
      tomhedsregler === sale.size * facetter.size * 2,
      `${tomhedsregler} regler mod forventet ${sale.size * facetter.size * 2}`);
    // Reglen skal baere sin :not(:has(:is(...)))-form. Uden :not-leddet ville
    // den skjule en sal, saa snart facetten blev brugt - ogsaa naar salen HAR
    // kort, hvilket er vaerre end fejlen, den retter.
    ok(`30.6 ${rel}: tomhedsreglerne er betingede, ikke ubetingede`,
      /:not\(:has\(:is\(#f-/.test(stil),
      'uden :not(:has(:is(...))) ville enhver brug af facetten tomme salen');

    /* --- 4. Alle fire dele af en sal baerer data-sal --------------------- */
    for (const s of sale) {
      const dele = (html.match(new RegExp(`data-sal="${s}"`, 'g')) || []).length;
      // hoved + gitter + indekspost = 3; forklaringen findes kun paa den sal,
      // der har én, saa 3 eller 4 er begge rigtige - men aldrig faerre.
      ok(`30.7 ${rel} sal "${s}": hoved, gitter og indekspost er maerket`,
        dele >= 3, `kun ${dele} elementer baerer data-sal="${s}"`);
    }

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
  ok('30.14: katalog.js lytter paa hashchange (:target-filtre fra forsiden)',
    /addEventListener\('hashchange', opdater\)/.test(js));
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
  ok('30.19: figurens sats undtager de fire datatilstande',
    /\.robot-noegletal \.stribe \.v:not\(\.v-ikke,\.v-billede,\.v-nej,\.v-ja\)\{font-size:23px\}/.test(gen),
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
