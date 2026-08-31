/**
 * tests/dele/35-typeskilt-katalog.mjs — spor/katalog, 31. aug 2026 (L54/L57).
 *
 * EMNET er katalogsidens TYPESKILT-form og de beslutninger, den hviler paa.
 * Hver vagt er valgt efter ét princip: den skal blive ROED, hvis arbejdet
 * rulles tilbage. Vagter, der ville bestaa uanset hvad, hoerer ikke hjemme
 * her - de giver en falsk attest.
 *
 * Filen laeser BYGGET OUTPUT, ikke skabelonens kildekode. Det er ikke en
 * formalitet: filterreglerne GENERERES ind i sidens inline <style>, saa et
 * grep i katalog.mjs ville taelle genereringsloekken og ikke dens output -
 * praecis den maalefaelde, briefet advarede imod (orkestratoren fik 20, og
 * tallet betoed ingenting).
 *
 *  1. Formen: pladen, strimlen, facetgitteret, det flade kortgitter.
 *  2. Filtrene virker uden JavaScript: reglerne findes i det byggede output.
 *  3. Egenskabschippene summer til antallet af robotter - hver linje.
 *  4. Tre tilstande kan SES (haard begraensning 5).
 *  5. L55/L56's beslutninger staar paa siden: ingen CE-facet, reserveret
 *     certificeringsplads, fem sorteringer uden Skill Score, status-standard.
 *  6. Kortet er billede + producent + produktnavn (L56 punkt 7).
 *  7. Aabningen er aerlig om de robotter, der ikke oplyser et aarstal.
 *  8. Skriftgulvet og radius-skalaen er ikke brudt af de nye regler.
 *  9. Ingen haardkodet UI-tekst: alt gaar gennem sprogfilerne.
 */
import fs from 'node:fs';
import path from 'node:path';

/** Indholdet af det inline <style>, bygget skriver i <head>. */
function genereretStil(html) {
  const i = html.indexOf('<style>');
  return i === -1 ? '' : html.slice(i + 7, html.indexOf('</style>', i));
}

/** Synlig tekst: script/style ud, tags ud. */
function synligTekst(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

export default async function koer(ctx) {
  const { rod, ok } = ctx;

  console.log('\n35. Katalogsiden er typeskiltet (spor/katalog, L54/L57)');

  const dist = path.join(rod, 'dist');
  const robotFiler = fs.readdirSync(path.join(rod, 'data', 'robots'))
    .filter((f) => /\.ya?ml$/.test(f));
  const ANTAL = robotFiler.length;

  for (const sprog of ['da', 'en']) {
    const p = path.join(dist, sprog, 'robotter', 'index.html');
    if (!fs.existsSync(p)) { ok(`35 ${sprog}: katalogsiden er bygget`, false, 'ikke bygget'); continue; }
    const html = fs.readFileSync(p, 'utf8');
    const stil = genereretStil(html);

    /* --- 1. FORMEN ---------------------------------------------------- */
    // Compens fire baerende dele. Falder én af dem ud, er det ikke laengere
    // den godkendte retning, uanset hvad farverne siger.
    for (const [navn, m] of [
      ['pladen', /<div class="plade__krop stans">/],
      ['stempelblokken (TYPE/UDGAVE/POSTER/OPLYSTE FELTER)', /<dl class="stempler">/],
      ['den klaebende strimmel', /<div class="strimmel">/],
      ['facetgitteret', /<div class="facetter__net">/],
      ['det flade kortgitter', /<div class="net" id="alle">/],
    ]) {
      ok(`35.1 ${sprog}: ${navn} findes`, m.test(html));
    }
    // Salene maa IKKE komme igen uden en beslutning: de kan ikke sameksistere
    // med alfabetisk standardsortering (L56 punkt 3).
    ok(`35.2 ${sprog}: ingen vaegtklasse-sale og intet tommelindeks`,
      !/class="sal"/.test(html) && !/class="tommelindeks"/.test(html),
      'salene tvinger vaegtorden igennem foer laeserens eget sorteringsvalg');

    /* --- 2. FILTRENE VIRKER UDEN JAVASCRIPT --------------------------- */
    // Maalt paa OUTPUTTET, ikke paa kilden - se filhovedet.
    const hasAntal = (stil.match(/:has\(/g) || []).length;
    ok(`35.3 ${sprog}: filterreglerne staar i sidens inline <style> (${hasAntal} :has())`,
      hasAntal > 0 && /@supports selector\(:has\(\*\)\)/.test(stil),
      'uden dem filtrerer siden ikke uden JavaScript');
    ok(`35.4 ${sprog}: kortene staar i statisk HTML`,
      (html.match(/<article class="kort">/g) || []).length === ANTAL,
      `kataloget maa aldrig kraeve JavaScript for at vise sine ${ANTAL} robotter`);
    // Sorteringen skal ogsaa virke uden JavaScript: radioknapper, ikke en
    // <select>, som CSS ikke kan laese til `order`.
    ok(`35.5 ${sprog}: sorteringen er radioknapper og styrer order i CSS`,
      /<input type="radio" class="f-sort"/.test(html)
        && /\.styr:has\(#sort-[a-z]+:checked\) \.kort\{order:var\(--o-[a-z]+\)\}/.test(stil));

    /* --- 3. EGENSKABSCHIPPENE SUMMER ---------------------------------- */
    /* Hver linje skal summe til antallet af robotter. Generatoren kaster selv,
       hvis den ikke goer (katalog.mjs' kapabiliteter()), men det bevis lever
       kun i byggetiden - denne vagt laeser de TAL, der faktisk staar paa
       siden, saa en fejl i visningen ogsaa fanges. */
    const chips = [...html.matchAll(/<label class="chip__krop"[\s\S]*?<\/label>/g)].map((m) => m[0]);
    ok(`35.6 ${sprog}: der er fem egenskabschips`, chips.length === 5, `fandt ${chips.length}`);
    for (const chip of chips) {
      const navn = (chip.match(/<span class="chip__navn">([^<]*)</) || [])[1] || '?';
      const tal = [...chip.matchAll(/<span class="d__tal">(\d+)<\/span>/g)].map((m) => Number(m[1]));
      const sum = tal.reduce((a, b) => a + b, 0);
      ok(`35.7 ${sprog}: chippen "${navn}" summer til ${ANTAL} (${tal.join(' + ')})`,
        tal.length === 3 && sum === ANTAL, `sum ${sum}`);
    }

    /* --- 4. TRE TILSTANDE KAN SES (haard begraensning 5) --------------- */
    // De fire maerker fra spriten. "nul" er det, der skiller et taelleligt
    // nul fra en tavshed: 0 producenter afviser hot-swap, 58 siger ingenting.
    for (const maerke of ['i-ja', 'i-nej', 'i-nul', 'i-ioplyst']) {
      ok(`35.8 ${sprog}: maerket ${maerke} bruges paa siden`,
        html.includes(`#${maerke}`), 'de tre tilstande skal kunne SES, ikke kun taelles');
    }
    // "ikke oplyst" staar sidst i sin gruppe og har sin egen klasse.
    ok(`35.9 ${sprog}: "ikke oplyst"-raekkerne baerer rk--uoplyst`,
      /<div class="rk rk--uoplyst">/.test(html));
    // Et filter maa aldrig straffe aerlig tavshed: "ikke oplyst" er en
    // vaelgelig vaerdi i de facetter, der HAR uoplyste - ikke et fravaer.
    ok(`35.10 ${sprog}: "ikke oplyst" kan vaelges som filter`,
      /id="f-anv-ikke_oplyst"/.test(html) && /id="f-ip-ikke_oplyst"/.test(html),
      'kan tavsheden ikke vaelges, kan den heller ikke undersoeges');

    /* --- 5. L55 OG L56 STAAR PAA SIDEN -------------------------------- */
    ok(`35.11 ${sprog}: CE-facetten er vaek (L55 punkt 3)`,
      !/class="rk__felt f-ce"/.test(html),
      'den kunne kun udvaelge 2 af 77 og opsluges i certificeringsfacetten');
    ok(`35.12 ${sprog}: certificeringspladsen er reserveret og aerlig (L55 punkt 1)`,
      /<div class="reserveret">/.test(html),
      'pladsen bygges, ikke facetten - der er ingen data at filtrere paa endnu');
    ok(`35.13 ${sprog}: status er en fuld facet med alle tre tilstande (L55 punkt 5)`,
      /id="f-status-i_produktion"/.test(html) && /id="f-status-annonceret"/.test(html)
        && /id="f-status-udgaaet"/.test(html));
    // Haard begraensning 6, og posten staar paa "Kom ikke igen med disse".
    ok(`35.14 ${sprog}: ingen Skill Score blandt sorteringerne`,
      !/skill.?score/i.test(synligTekst(html)) && !/id="sort-skill/.test(html),
      'en redaktionel score uden offentliggjort metode er forbudt');
    ok(`35.15 ${sprog}: landefilteret er en ren landeliste (L55 punkt 4)`,
      /id="f-land-kina"/.test(html) && !/data-region|class="region"/.test(html),
      'regiongruppering er fravalgt af JPK');

    /* --- 6. KORTET (L56 punkt 7) -------------------------------------- */
    ok(`35.16 ${sprog}: kortet er billede + producent + produktnavn`,
      /<p class="kort__prod">/.test(html) && /<h3 class="kort__navn">/.test(html)
        && !/<ul class="stribe/.test(html),
      'JPK droppede udtrykkeligt enhver yderligere ordning af kortene');
    /* Statusstemplet KUN naar status ikke er "i produktion". Tallet udledes:
       en haardkodet 9'er ville vaere forkert, saa snart en robot skifter
       status.

       Maalt i RESULTATGITTERET alene. Aabningen viser de samme robotter igen
       og stempler dem efter samme regel, saa et tal over hele siden ville
       taelle nogle af dem to gange - foerste udgave af denne vagt gjorde det
       og gav 12 mod 9. Det var vagten, der var forkert, ikke siden. */
    const iNet = html.indexOf('<div class="net" id="alle">');
    const netto = iNet === -1 ? '' : html.slice(iNet);
    const stempler = (netto.match(/<span class="kort__mrk">/g) || []).length;
    const ikkeIProduktion = robotFiler
      .filter((f) => !/^status:\s*"?i_produktion"?\s*$/m
        .test(fs.readFileSync(path.join(rod, 'data', 'robots', f), 'utf8'))).length;
    ok(`35.17 ${sprog}: statusstempel kun paa de ${ikkeIProduktion}, der ikke er i produktion`,
      iNet !== -1 && stempler === ikkeIProduktion, `fandt ${stempler} stempler i resultatgitteret`);

    /* --- 7. AABNINGEN ER AERLIG --------------------------------------- */
    /* Den vigtigste vagt i filen. De robotter, der ikke oplyser et
       udgivelsesaar, maa ALDRIG komme til at se gamle ud - "ikke oplyst" er en
       tavshed, ikke en aargang. Kvalifikationen skal staa i SELVE blokken,
       hvor udvalget vises, ikke i en fodnote. */
    const iAabning = html.indexOf('class="aabning__krop');
    const aabning = iAabning === -1 ? '' : html.slice(iAabning, html.indexOf('</section>', iAabning));
    ok(`35.18 ${sprog}: aabningen findes og er sat af robotkort`,
      iAabning !== -1 && /<article class="kort kort--seneste">/.test(aabning),
      'et hero-baand af ren tekst ville skubbe det foerste robotkort laengere ned (D20)');
    const medAar = robotFiler.filter((f) => /^foerste_udgivelse:\s*\d{4}\s*$/m
      .test(fs.readFileSync(path.join(rod, 'data', 'robots', f), 'utf8'))).length;
    const udenAar = ANTAL - medAar;
    const tekst = synligTekst(aabning);
    ok(`35.19 ${sprog}: aabningen siger, hvor mange der oplyser et aarstal (${medAar} af ${ANTAL})`,
      tekst.includes(String(medAar)) && tekst.includes(String(ANTAL)),
      'uden kvalifikationen laeses udvalget som "de nyeste robotter", og det er usandt');
    ok(`35.20 ${sprog}: aabningen naevner de ${udenAar}, der ikke oplyser et aarstal`,
      tekst.includes(String(udenAar)),
      'de tavse skal taelles med, ellers forsvinder de ud af regnskabet');

    /* --- 9. INGEN HAARDKODET UI-TEKST --------------------------------- */
    ok(`35.21 ${sprog}: ingen manglende sprognoegle staar paa siden`,
      !/«[a-z_]+»/.test(html), 'en noegle uden oversaettelse skrives som «noegle»');
  }

  /* --- 8. SKRIFTGULV OG RADIUS I DE NYE REGLER ------------------------ */
  /* 31-pudsning.mjs vogter begge dele for hele stilarket. Vagterne her er
     smallere med vilje: de peger paa TYPESKILT-afsnittet, saa en fejl dér
     kan laeses som "det nye afsnit brød reglen" og ikke som en generel
     regression et ukendt sted i 1400 linjer. */
  const gen = fs.readFileSync(path.join(rod, 'assets', 'generator.css'), 'utf8');
  const i20 = gen.indexOf('20. KATALOGSIDEN SOM TYPESKILT');
  const afsnit = i20 === -1 ? '' : gen.slice(i20);
  ok('35.22: TYPESKILT-afsnittet findes i generator.css', i20 !== -1);
  const LOVLIG = new Set(['0', '0px', '2px', '6px', '8px', '12px', '99px', '50%']);
  const drift = [];
  for (const m of afsnit.matchAll(/border-radius:([^;}]+)/g)) {
    for (const del of m[1].trim().split(/[\s/]+/)) {
      if (del.startsWith('var(') || del === 'inherit') continue;
      if (!LOVLIG.has(del)) drift.push(del);
    }
  }
  ok('35.23: ingen radius uden for skalaen i TYPESKILT-afsnittet',
    drift.length === 0,
    `uden for skalaen: ${drift.join(', ')} - compen skriver 3px, men 3px er ikke et trin`);
  const smaa = [];
  for (const m of afsnit.matchAll(/font-size:([0-9.]+)px/g)) {
    if (Number(m[1]) < 8) smaa.push(m[1]);
  }
  ok('35.24: intet skriftgulv under 8px i TYPESKILT-afsnittet',
    smaa.length === 0, `fandt: ${smaa.join(', ')}px`);

  /* --- 9b. Sprogfilerne er symmetriske ------------------------------- */
  const da = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'da.json'), 'utf8'));
  const en = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'en.json'), 'utf8'));
  const kunDa = Object.keys(da).filter((k) => !(k in en));
  const kunEn = Object.keys(en).filter((k) => !(k in da));
  ok(`35.25: sprogfilerne er symmetriske (${Object.keys(da).length} noegler)`,
    kunDa.length === 0 && kunEn.length === 0,
    `kun i da: ${kunDa.join(', ')} · kun i en: ${kunEn.join(', ')}`);
}
