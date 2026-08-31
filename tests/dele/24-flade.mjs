/**
 * tests/dele/24-flade.mjs — spor/flade, 27. aug 2026.
 *
 * Vagter for de fem ting, sporet aendrede, valgt efter ét princip: en test
 * skal kunne FEJLE, hvis arbejdet rulles tilbage. Derfor laeses alt fra det
 * BYGGEDE output og fra sprogfilerne - ikke fra skabelonernes kildekode, som
 * kan se rigtig ud uden at naa siden.
 *
 * 1. S1-SPROGET (KRITIK-4 fund 3, L37). JPK ophaevede billedspaerringen
 *    26. aug og sagde udtrykkeligt, at den heller ikke skal OMTALES paa
 *    websiden. To tidligere spor fjernede hver sin forekomst; den tredje -
 *    stoerre end de to andre tilsammen - overlevede begge, fordi hvert funds
 *    ordlyd navngav ét sted. Vagten her spoerger derfor bredt: staar
 *    spaerringssproget NOGET sted i synlig tekst i dist?
 *
 * 2. TEGNFORKLARINGENS FOERSTE RAEKKE. Sektionen findes for at laere laeseren
 *    at skelne 0, nej og ikke oplyst - haard begraensning 5's egen
 *    forklaring. Foerste raekke viste "33,8 kg" og navngav den "udfyldte
 *    felter": en masse kaldt et antal felter.
 *
 * 3. TOMMELINDEKSET (L44). Hvert anker skal ramme et id, der findes paa
 *    SAMME side. En tom vaegtklasse renderes ikke som sal, saa et anker til
 *    den ville vaere doedt.
 *
 * 4. SORTERINGEN (L44). Tre valg, og "nyeste" maa ALDRIG vaere ét af dem:
 *    der findes intet lanceringsaar i skemaet, og at gaette ét ville bryde
 *    haard begraensning 2.
 *
 * 5. NOEGLETALLENE I HOVEDET (KRITIK-4 fund 4). Striben skal staa inde i
 *    robotsidens <header>, ikke som soeskende under den.
 */
import fs from 'node:fs';
import path from 'node:path';

/** Synlig tekst: script/style ud, tags ud, de faa entiteter vi bruger afkodet. */
function synligTekst(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');
}

function alleHtml(dir, ud = []) {
  if (!fs.existsSync(dir)) return ud;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) alleHtml(p, ud);
    else if (e.name.endsWith('.html')) ud.push(p);
  }
  return ud;
}

export default async function koer(ctx) {
  const { rod, ok } = ctx;

  console.log('\n24. Fladen: S1-sprog, tegnforklaring, tommelindeks, sortering, noegletal (spor/flade)');

  /* --- 1. Spaerringssproget, i BEGGE sprogfiler ------------------------- */
  for (const sprog of ['da', 'en']) {
    const i18n = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', `${sprog}.json`), 'utf8'));
    const alleStrenge = Object.values(i18n).filter((v) => typeof v === 'string').join(' ');
    ok(`24.1.${sprog}: ingen spaerringspaastand i ${sprog}.json`,
      !/ingen tilladelse|no permission|uncredited|ikke krediteret|maa ikke bygges ind|må ikke bygges ind|may not be built into/i.test(alleStrenge),
      'S1 blev ophaevet 26. aug 2026 (L37) og maa heller ikke OMTALES');
    // Kildeoplysningen skal blive staaende - vi fjernede en paastand, ikke en kilde.
    ok(`24.2.${sprog}: billedets ophav staar stadig i ${sprog}.json`,
      typeof i18n.billede_uden_tilladelse === 'string'
        && /producentens eget billede|manufacturer's own photo/i.test(i18n.billede_uden_tilladelse),
      `fik: ${JSON.stringify(i18n.billede_uden_tilladelse)}`);
  }

  const dist = path.join(rod, 'dist');
  const sider = alleHtml(dist);
  ok('24.3: der ER bygget sider at maale paa', sider.length > 0,
    'uden dist/ beviser de foelgende vagter ingenting');

  if (sider.length) {
    let medSpaerring = 0;
    for (const f of sider) {
      if (/ingen tilladelse|no permission|uncredited|Ikke krediteret/i.test(synligTekst(fs.readFileSync(f, 'utf8')))) medSpaerring++;
    }
    ok('24.4: 0 byggede sider naevner spaerringen i synlig tekst', medSpaerring === 0,
      `${medSpaerring} af ${sider.length} sider gjorde`);
  }

  /* --- 2. Tegnforklaringens foerste raekke ------------------------------- */
  const legendeSider = [
    'da/robotter/index.html', 'en/robotter/index.html',
    'da/sammenligning/index.html', 'en/sammenligning/index.html',
  ];
  for (const rel of legendeSider) {
    const p = path.join(dist, rel);
    if (!fs.existsSync(p)) { ok(`24.5 ${rel}: filen findes`, false, 'ikke bygget'); continue; }
    const html = fs.readFileSync(p, 'utf8');
    // indexOf paa KLASSENAVNET, ikke split() paa sektions-id'et: skabelonen
    // skriver hvert id TO gange (aria-labelledby og id), saa split rammer det
    // tomme mellemstykke og giver 0 uanset hvad der staar paa siden.
    const start = html.indexOf('class="sektion tegnforklaring"');
    const sektion = start === -1 ? '' : html.slice(start, html.indexOf('</section>', start));
    ok(`24.5 ${rel}: tegnforklaringen findes`, start !== -1);
    if (start !== -1) {
      ok(`24.6 ${rel}: foerste raekke kalder ikke en masse for "udfyldte felter"`,
        !/udfyldte felter|fields filled/i.test(synligTekst(sektion)));
    }
  }

  /* --- 3. og 4. Tommelindeks og sortering paa katalogsiden --------------- */
  for (const sprog of ['da', 'en']) {
    const p = path.join(dist, sprog, 'robotter', 'index.html');
    if (!fs.existsSync(p)) { ok(`24.7.${sprog}: katalogsiden findes`, false); continue; }
    const html = fs.readFileSync(p, 'utf8');
    const idsPaaSiden = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));

    /* VENDT 31. aug 2026 (spor/katalog, L54/L57/L56).
       TOMMELINDEKSET er fjernet sammen med vaegtklasse-salene: det sprang til
       `#h-<vaegtklasse>`, og de overskrifter findes ikke mere, fordi
       vaegtklassen nu er en facet (se tools/skabelon/katalog.mjs' filhoved).
       Et indeks over fire ankre uden maal ville vaere fire doede links.

       Vagt 24.8 var den vaerdifulde af de to - "intet anker peger i tomme
       luft" - og den er derfor IKKE droppet, men UDVIDET: den gaelder nu
       hvert eneste interne anker paa siden, ikke kun indeksets fire. Det er
       en strengere test end den, den erstatter. */
    const alleAnkre = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1])
      .filter((a) => a !== '' && a !== 'alle');
    ok(`24.7.${sprog}: katalogsiden har interne ankre at vogte`, alleAnkre.length > 0,
      `fandt ${alleAnkre.length}`);
    const doede = [...new Set(alleAnkre)].filter((a) => !idsPaaSiden.has(a));
    ok(`24.8.${sprog}: hvert internt anker paa siden rammer et id paa samme side`,
      doede.length === 0, `doede: ${doede.join(', ')}`);

    /* L56 punkt 3 gjorde de tre valg til FEM: alfabetisk (standard),
       lanceringsdato, pris, nyttelast, hastighed. Vagten er stadig et
       LIGHEDSKRAV og ikke et minimum - en sjette mulighed skal ikke kunne
       snige sig ind uden en beslutning, og det er netop saadan en Skill Score
       ville komme. */
    const valg = [...html.matchAll(/id="sort-([a-z]+)"/g)].map((m) => m[1]);
    ok(`24.9.${sprog}: sorteringen har fem valg (L56 punkt 3)`, valg.length === 5,
      `fandt ${valg.join(', ')}`);
    ok(`24.9b.${sprog}: alfabetisk er standardvalget`,
      /<input type="radio"[^>]*id="sort-alfa"[^>]*checked>/.test(html),
      'L56 punkt 3: alfabetisk er STANDARD, og standarden er DOM-raekkefoelgen');
    // Sorteringen skal virke UDEN JavaScript: valgene skal vaere rigtige
    // formularfelter, ikke knapper, et script skal taende.
    ok(`24.10.${sprog}: sorteringsvalgene er radioknapper (virker uden JS)`,
      /<input type="radio"[^>]*id="sort-/.test(html));
    // "Nyeste" maa aldrig blive et valg: skemaet har intet lanceringsaar, og
    // et gaettet aar ville bryde haard begraensning 2.
    ok(`24.11.${sprog}: "nyeste" er IKKE en sorteringsmulighed`,
      !valg.includes('nyeste') && !/id="sort-(nyeste|newest|nyest)"/i.test(html));
  }

  /* --- 5. Noegletallene inde i robotsidens hoved ------------------------- */
  for (const sprog of ['da', 'en']) {
    const p = path.join(dist, sprog, 'robotter', 'anybotics-anymal', 'index.html');
    if (!fs.existsSync(p)) { ok(`24.12.${sprog}: robotsiden findes`, false); continue; }
    const html = fs.readFileSync(p, 'utf8');
    const iHoved = html.indexOf('<header class="robot-top">');
    const slutHoved = html.indexOf('</header>', iHoved);
    const hoved = iHoved === -1 ? '' : html.slice(iHoved, slutHoved);
    ok(`24.12.${sprog}: robotsidens hoved findes`, iHoved !== -1);
    ok(`24.13.${sprog}: noegletalsstriben staar INDE i hovedet, ved siden af fotoet`,
      hoved.includes('robot-noegletal') && hoved.includes('stribe'),
      'striben laa foer som soeskende UNDER hovedet, saa den foerst kunne laeses efter fotoet');
  }
}
