/**
 * tests/dele/43-samlenhed.mjs — spor/samlenhed, 1. sep 2026.
 *
 * Sammenligningsmatricen tegnes UDELUKKENDE klientside, og skabelonen kalder
 * `H.tal()` nul gange. Den arvede derfor ikke L60's enhedsskift, da spor/enhed
 * flyttede omregningen ind i side.mjs' `tal()`. Denne fil daekker den vej ind,
 * og den er skrevet omkring ét spoergsmaal: HVILKE FEJL HER VILLE VAERE TAVSE?
 *
 * Briefets acceptkriterium var "en test, der fejler, hvis en faktor aendres ét
 * sted og ikke det andet" - skrevet ud fra en ANTAGELSE om, at browseren ville
 * faa sin egen omregningstabel. Den antagelse holder ikke om den byggede
 * loesning: klienten regner ikke. `tools/skabelon/sammenligning.mjs`
 * forudberegner hvert felt gennem side.mjs' `imperialPost()` - den samme
 * funktion, robotsiden bruger - og sender KUN figuren med. Der er ingen anden
 * tabel at divergere fra.
 *
 * Kriteriet er derfor oversat, ikke sloejfet, til den divergens der FAKTISK kan
 * opstaa: at skabelonen holder op med at spoerge `imperialPost()` og begynder
 * at regne selv. Punkt 2 nedenfor genberegner hver eneste af de 565 figurer fra
 * YAML'en og sammenligner med det, der ligger i den byggede side. Aendres en
 * faktor i `OMREGNING`, foelger begge sider med (og testen forbliver groen,
 * korrekt); haandskrives ét tal i skabelonen, bliver den rOEd.
 *
 * BEVIST RØD 1. sep 2026: en 1 %-fejl lagt paa `imperialFelt()`s vaerdi gav
 * "1040 bestaaet, 6 fejlet" mod "1052 bestaaet, 0 fejlet" uden fejlen.
 *
 * DE TRE OEVRIGE TAVSE FEJL, hver med sin egen gruppe herunder:
 *
 *   1. NOEGLEN. Hukommelsen paa tvaers af sider er ÉN streng, "enhedsskift",
 *      skrevet fire steder (robot.mjs, sammenligning.mjs, sammenligning.js og
 *      opslaget i enhed.js). Aendres ét af dem, holder valget op med at foelge
 *      laeseren - og INTET bliver roedt: begge sider virker hver for sig.
 *
 *   3. CSS-VAERTEN. §16c's skifteregler er scopet til `.typeskilt`, og det ord
 *      staar nul gange paa sammenligningssiden. Uden en egen vaert er kontakten
 *      DOED: markup'en er der, JSON'en er der, og intet sker ved klik. Det er
 *      praecis den tilstand, robot.mjs:1016-1018 forbyder, og ingen anden test
 *      ser CSS.
 *
 *   4. NUL GRADER. 0 °C er 32 °F. Otte felter i datasaettet er `temp_min: 0 °C`,
 *      og de er ogsaa dem, spor/enheds egen taelling paa 557 omregnelige felter
 *      overs (det rigtige tal er 565). En udgave, der kun daekkede tilstanden
 *      'tal', ville vise "0 °F": et forkert tal, som oveni ville laese som
 *      nul-TILSTANDEN (haard begraensning 5).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ENHED_ID = 'enhedsskift';

/** JSON-blokken ud af en bygget sammenligningsside. `render()` undslipper `<`
 *  som `<`, saa `</script>` i data aldrig kan lukke blokken - det vendes
 *  om her, foer der parses. */
function dataAf(html) {
  const m = html.match(/<script type="application\/json" id="sammenligning-data">([\s\S]*?)<\/script>/);
  if (!m) return null;
  return JSON.parse(m[1].replace(/\\u003c/g, '<'));
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n43. spor/samlenhed: matricen skifter enhed, og valget deles med sitet');

  const dist = path.join(tmp, 'dist-samlenhed');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${dist}`],
    { cwd: rod, encoding: 'utf8' });
  ok('43.byg', b.status === 0, `build.mjs gav ${b.status}`);
  if (b.status !== 0) return;

  const html = fs.readFileSync(path.join(dist, 'da', 'sammenligning', 'index.html'), 'utf8');
  const htmlEn = fs.readFileSync(path.join(dist, 'en', 'sammenligning', 'index.html'), 'utf8');
  const data = dataAf(html);
  ok('43.1 JSON-blokken kan laeses', !!data && Array.isArray(data.robotter), 'ingen data-blok');
  if (!data) return;

  /* --- 1. NOEGLEN: de fire steder, der skal sige det samme --------------- */
  const samlJs = fs.readFileSync(path.join(rod, 'assets', 'sammenligning.js'), 'utf8');
  const enhedJs = fs.readFileSync(path.join(rod, 'assets', 'enhed.js'), 'utf8');
  const robotMjs = fs.readFileSync(path.join(rod, 'tools', 'skabelon', 'robot.mjs'), 'utf8');

  ok('43.2 enhed.js slaar op paa netop den noegle',
    enhedJs.includes(`getElementById('${ENHED_ID}')`),
    'assets/enhed.js finder ikke kontakten mere');
  ok('43.3 robot.mjs bruger samme id',
    robotMjs.includes(`const ENHED_ID = '${ENHED_ID}'`),
    'robot.mjs har skiftet id - hukommelsen deles ikke laengere');
  ok('43.4 sammenligning.js bruger samme id',
    samlJs.includes(`var ENHED_ID = '${ENHED_ID}'`),
    'assets/sammenligning.js har skiftet id');
  for (const [sprog, h] of [['da', html], ['en', htmlEn]]) {
    ok(`43.5.${sprog} kontakten staar i den byggede side`,
      h.includes(`id="${ENHED_ID}"`) && h.includes('enhedsskift__boks'),
      'afkrydsningen mangler');
    // Hukommelsen er hele pointen med at dele noeglen: uden scriptet husker
    // siden ingenting, og acceptkriteriet (imperial valgt paa en robotside
    // aabner matricen imperialt) falder - tavst, for siden ser ens ud.
    ok(`43.6.${sprog} enhed.js indlaeses`,
      /<script src="[^"]*enhed\.js"><\/script>/.test(h),
      'enhed.js hentes ikke - valget huskes ikke paa tvaers af sider');
  }
  // ... og synkront, FOER den deferrede sammenligning.js. Var den deferred,
  // ville matricen naa at blive tegnet metrisk og blinke.
  ok('43.7 enhed.js er IKKE deferred',
    !/<script src="[^"]*enhed\.js" defer/.test(html),
    'enhed.js er deferred - matricen naar at blinke metrisk foerst');

  /* --- 2. FIGURERNE: genberegnet fra YAML, felt for felt ----------------- */
  // `skema`/`yaml` kommer fra ctx (importeret ÉN gang i _faelles.mjs).
  // side.mjs er ikke blandt dem og importeres her - med `file://` og skraa
  // streger, ellers giver Windows' `C:\...` ERR_UNSUPPORTED_ESM_URL_SCHEME.
  const { parseYaml } = ctx.yaml;
  const { normaliserRobot, normaliserVisningsEnheder, FELTNAVNE } = ctx.skema;
  const { imperialPost } = await import(
    `file://${path.join(rod, 'tools', 'skabelon', 'side.mjs').replace(/\\/g, '/')}`);

  const rDir = path.join(rod, 'data', 'robots');
  const raa = new Map();
  for (const f of fs.readdirSync(rDir).filter((n) => /\.ya?ml$/.test(n))) {
    const r = normaliserVisningsEnheder(normaliserRobot(parseYaml(fs.readFileSync(path.join(rDir, f), 'utf8'), f)));
    raa.set(r.slug, r);
  }

  let sammenlignet = 0; const afvig = []; const manglende = [];
  let egneIData = 0, egneIYaml = 0; let nulGrader = 0;
  for (const rd of data.robotter) {
    const r = raa.get(rd.slug);
    if (!r) { manglende.push(rd.slug); continue; }
    for (const navn of FELTNAVNE) {
      const post = r.felter[navn];
      const facit = imperialPost(post, 'da');
      const set = rd.felter[navn] && rd.felter[navn].imp;
      if (!facit) {
        if (set) afvig.push(`${rd.slug}/${navn}: siden har en imperial figur, YAML'en giver ingen`);
        continue;
      }
      if (!set) { afvig.push(`${rd.slug}/${navn}: YAML'en giver en imperial figur, siden har ingen`); continue; }
      sammenlignet++;
      const vent = facit.post.min !== undefined
        ? { min: facit.post.min, maks: facit.post.maks, enhed: facit.post.enhed || '' }
        : { vaerdi: facit.post.vaerdi, enhed: facit.post.enhed || '' };
      if (facit.egen) vent.egen = 1;
      if (JSON.stringify(set) !== JSON.stringify(vent)) {
        afvig.push(`${rd.slug}/${navn}: siden ${JSON.stringify(set)} != imperialPost ${JSON.stringify(vent)}`);
      }
      if (set.egen) egneIData++;
      if (post.vaerdi_imperial !== undefined && post.min === undefined) egneIYaml++;
      if (post.enhed === '°C' && post.vaerdi === 0) {
        nulGrader++;
        // Selve faelden, som ét eksplicit krav: 0 °C skal blive 32 °F, aldrig 0.
        ok(`43.8.${rd.slug} 0 °C bliver 32 °F, ikke 0`, set.vaerdi === 32,
          `${rd.slug}/${navn} gav ${set.vaerdi}`);
      }
    }
  }
  ok('43.9 alle robotter i JSON findes i data/', manglende.length === 0, manglende.join(', '));
  ok('43.10 hver imperial figur er imperialPost()s egen', afvig.length === 0,
    `${afvig.length} afvigelser: ${afvig.slice(0, 4).join(' | ')}`);
  ok('43.11 der ER figurer at sammenligne', sammenlignet > 500, `kun ${sammenlignet}`);
  ok('43.12 de otte 0 °C-felter er daekket', nulGrader === 8, `fandt ${nulGrader}`);

  /* REGEL 1, som sit eget krav og ikke kun som en foelge af 43.10: oplyser
     producenten selv et imperialt tal, er det DERES, der staar. Taelles fra
     to uafhaengige sider - YAML'en og den byggede side - saa et fald i det
     ene tal ikke kan skjule sig i det andet. */
  ok('43.13 regel 1: producentens egne tal er markeret som egne',
    egneIData === egneIYaml && egneIData > 0,
    `siden: ${egneIData}, YAML: ${egneIYaml}`);

  /* --- 3. CSS-VAERTEN: uden den er kontakten doed ------------------------ */
  const css = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');
  ok('43.14 sammenligningssiden er IKKE en typeskilt-flade',
    !html.includes('typeskilt'),
    'siden baerer nu .typeskilt - saa arver den §16c, og denne fils antagelse skal skrives om');
  for (const regel of ['.enhedsvis--metrisk', '.enhedsvis--imperial', '.enhedsnote']) {
    ok(`43.15${regel} har en vaert paa sammenligningssiden`,
      css.includes(`.sammenligning-app .enhedsskift__boks:checked ~ * ${regel}`),
      'kontakten er doed paa denne flade');
  }
  ok('43.16 fokusringen tegnes ogsaa her',
    css.includes('.sammenligning-app .enhedsskift__boks:focus-visible ~ * .enhedsskift'),
    'boksen er 1x1 px - uden denne regel er der ingen synlig fokus');

  /* --- 4. VAERNET: ingen kontakt uden noget at skifte -------------------- */
  const uden = data.robotter
    .filter((r) => !Object.keys(r.felter).some((n) => r.felter[n].imp))
    .map((r) => r.slug).sort();
  ok('43.17 vaernet har noget at beskytte mod', uden.length > 0 && uden.length < 12,
    `${uden.length} robotter uden en eneste omregnelig figur`);
  ok('43.18 strimlen tegnes betinget', /sidsteOmregnelige \? enhedslinjeHTML\(\)/.test(samlJs),
    'assets/sammenligning.js tegner kontakten ubetinget - en doed kontakt ved de '
    + `${uden.length} robotter uden omregnelige figurer`);
  ok('43.19 afkrydsningen skjules med strimlen',
    /enhedsBoks\.hidden = !sidsteOmregnelige/.test(samlJs),
    'en fokusérbar kontrol uden synlig etikette bliver tilbage');

  /* REGEL 3: kildemaerket foelger det metriske tal. Matricen har ingen
     kildemaerker, men `kildeform`-wrapperen ("Producenten skrev: 1100 mm") er
     af samme slags og maa ALDRIG staa paa den imperiale tvilling - dér ville
     den forklare vores egen omregning med producentens ord. Maalt paa kilden,
     fordi wrapperen bygges ind i `metrisk` foer parret dannes. */
  const impLinje = samlJs.match(/var imperial = vaerdiSpan\([^\n]*\n/);
  ok('43.20 regel 3: kildeformen staar kun paa den metriske tvilling',
    !!impLinje && !impLinje[0].includes('original-enhed')
    && /metrisk = '<span class="original-enhed"/.test(samlJs),
    'kildeformen er havnet paa den imperiale figur');
}
