/**
 * tests/dele/42-om-os.mjs — Om-siden (spor/omos, L61, 1. sep 2026).
 *
 * Om-siden er sitets eneste PROSAside, og den er derfor den eneste flade,
 * hvor de sædvanlige vagter ikke bider: der er ingen robotpost at validere,
 * intet talfelt der kan mangle en enhed, og ingen kildemærker at tælle.
 * Alt, siden påstår, er skrevet af et menneske én gang — og det er præcis
 * den slags flade, hvor en påstand bliver forældet uden at nogen opdager det.
 *
 * De seks ting, denne del beviser, og hvad hver af dem koster, hvis den falder:
 *
 *   1. TALLENE ER UDLEDTE, IKKE SKREVNE. Prøven bygger mod fixturen
 *      (tests/eksempel-robotter, 3 robotter) og kræver, at siden dér viser
 *      FIXTURENS tal — 3 robotter, 90 mulige oplysninger — og ikke det
 *      rigtige datasæts. Skriver nogen "77 robotter" som tekst i en
 *      i18n-nøgle, viser fixturbygget stadig 77, og prøven falder her.
 *      Det er D7/L30-fælden, som allerede har kostet projektet to runder:
 *      et håndskrevet tal ved siden af et udledt bliver forkert i tavshed
 *      den dag robot 78 lander.
 *   2. REGNSKABET GÅR OP. Oplyst + ikke oplyst skal give felter × robotter,
 *      og de tre kildetal skal give de oplyste. Falder den: der findes en
 *      tilstand i data, som siden ikke fortæller om, og afsnittets egen
 *      sætning "og de går op" er en løgn.
 *   3. LINJEN OM INGEN FORHANDLERAFTALE STÅR I <main>. PRODUCT.md linje
 *      95-96 og 119-120 kræver den netop på Om-siden. Den står også i
 *      sidefoden på hver side, så en prøve, der bare søger i hele
 *      dokumentet, ville være grøn uanset hvad — derfor måles der KUN i
 *      <main>. Falder den: kravet er tavst forsvundet.
 *   4. CVR 10049385 STÅR INTET STED. Det er INCUBA a/s' nummer —
 *      science-parken, altså udlejeren, ikke KeyResearch. En researcher
 *      fandt det og var ved at skrive det ind (L61). Havde det stået der,
 *      havde vi begået hård begrænsning 2 mod os selv, på den ene side der
 *      handler om vores egen troværdighed. Prøven ser på HELE bygget, ikke
 *      kun Om-siden, fordi tallet er lige så forkert i en sidefod.
 *   5. INGEN UDGÅENDE LINKS. L61 forbyder link til salgssiden og enhver
 *      beskrivelse af KeyResearchs ydelser: en Om-side, der fører videre til
 *      konsulentforretningen, gør reelt kataloget til indgangen til den, og
 *      hård begrænsning 1 siger, at siden ALDRIG må kunne læses som
 *      salgskanal. Målt strukturelt — nul http(s)-href'er på siden — frem
 *      for på ordvalg, som en fremtidig omskrivning ville slippe forbi.
 *   6. MANGLENDE OPLYSNINGER ER UDELADT HELT. CVR, stiftelsesår og team
 *      står ingen steder og må IKKE markeres som "ikke oplyst". Om-siden er
 *      den ene flade, hvor hård begrænsning 5's tilstands-visning ikke
 *      gælder, fordi prosa ikke er en datapost.
 *
 * AA183/L84 (4. sep 2026): "aegte"-regnskabet (linje ~75) laeser nu
 * hentRobotter() (databasen, cachet af tests/koer.mjs - fund/BRIEF-dbcache.md
 * punkt 1), da data/robots/ er slettet. "Ingen netvaerk, ingen .env" gaelder
 * derfor IKKE laengere for hele filen - kun for byggekaldet mod fixturen
 * (linje ~70), som stadig er lokal og uaendret.
 *
 * Egen dist under ctx.tmp, som del 04 og 37 gør det: prøven må ikke afhænge
 * af, at nogen har kørt build.mjs i forvejen, og må ikke røre den rigtige
 * dist/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok, skema, lasRobotter, hentRobotter,
  } = ctx;

  console.log('\n42. Om-siden (spor/omos, L61)');

  const omOs = await import(`file://${path.join(rod, 'tools/skabelon/om-os.mjs').replace(/\\/g, '/')}`);
  const SPROG = skema.SPROG;

  /* --- byg mod FIXTUREN, ikke mod det rigtige datasæt ---------------------
     Hele pointe 1 hviler på, at fixturens tal er ANDRE end produktionens.
     Er de en dag ens, holder prøven op med at bevise noget — derfor
     kontrolleres forskellen udtrykkeligt nedenfor (42.3). */
  const dist = path.join(tmp, 'dist-om-os');
  const r = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${path.join(rod, 'tests', 'eksempel-robotter')}`, `--ud=${dist}`],
  { cwd: rod, encoding: 'utf8' });
  ok('42.0: build.mjs giver exit 0', r.status === 0, (r.stderr || '').trim());

  const fixtur = omOs.regnskab(lasRobotter(path.join(rod, 'tests', 'eksempel-robotter')));
  // AA183/L84: laeser hentRobotter() (databasen), ikke data/robots/ - mappen
  // er slettet.
  const aegte = omOs.regnskab((await hentRobotter()).map((d) => skema.normaliserRobot(d)));

  /* --- 1. siden findes paa hvert sprog, paa samme segment ----------------- */
  const sider = {};
  for (const s of SPROG) {
    const f = path.join(dist, s, 'om', 'index.html');
    ok(`42.1.${s}: dist/${s}/om/index.html findes`, fs.existsSync(f));
    if (fs.existsSync(f)) sider[s] = fs.readFileSync(f, 'utf8');
  }
  ok('42.1: Om-siden er bygget paa ALLE sprog, ikke kun ét',
    Object.keys(sider).length === SPROG.length,
    `fandt ${Object.keys(sider).length} af ${SPROG.length}`);

  // <main> alene. Sidefoden baerer ogsaa ingen_forhandler paa HVER side, saa
  // en soegning i hele dokumentet ville vaere groen uanset hvad (pointe 3).
  const hovedAf = (html) => {
    const a = html.indexOf('<main');
    const b = html.indexOf('</main>');
    return a >= 0 && b > a ? html.slice(a, b) : '';
  };
  const tekstAf = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');

  /* --- 2. regnskabets to identiteter ------------------------------------- */
  for (const [navn, g] of [['fixtur', fixtur], ['det rigtige datasaet', aegte]]) {
    ok(`42.2.a (${navn}): oplyst + ikke oplyst == felter x robotter`,
      g.oplyst + g.io === g.muligt,
      `${g.oplyst} + ${g.io} = ${g.oplyst + g.io}, men ${g.felter} x ${g.robotter} = ${g.muligt}`);
    ok(`42.2.b (${navn}): medKilde + udenKilde + tilstandssvar == oplyst`,
      g.medKilde + g.udenKilde + g.restSvar === g.oplyst,
      `${g.medKilde} + ${g.udenKilde} + ${g.restSvar} = `
      + `${g.medKilde + g.udenKilde + g.restSvar}, men oplyst = ${g.oplyst}`);
  }

  /* --- 3. TALLENE ER UDLEDTE, IKKE SKREVNE -------------------------------
     Vagtens forudsaetning foerst: fixturen SKAL vise andre tal end
     produktionen, ellers beviser resten af punktet ingenting. */
  ok('42.3.0: fixturen har et andet robottal end det rigtige datasaet',
    fixtur.robotter !== aegte.robotter,
    `begge har ${fixtur.robotter} - prøven kan ikke skelne udledt fra skrevet`);
  ok('42.3.0b: fixturen har et andet antal mulige oplysninger',
    fixtur.muligt !== aegte.muligt, `begge har ${fixtur.muligt}`);

  for (const s of SPROG) {
    if (!sider[s]) continue;
    const t = tekstAf(hovedAf(sider[s]));
    // Tal saettes med sprogets egen tusindtalsgruppering (1.110 / 1,110), saa
    // der maales paa cifrene alene - ellers ville proeven fange formatet i
    // stedet for tallet.
    const cifre = t.replace(/[.,  ](?=\d{3}\b)/g, '');
    const har = (n) => new RegExp(`(^|[^\\d])${n}([^\\d]|$)`).test(cifre);

    ok(`42.3.${s}: siden viser fixturens robottal (${fixtur.robotter})`, har(fixtur.robotter));
    ok(`42.3.${s}: siden viser fixturens mulige oplysninger (${fixtur.muligt})`, har(fixtur.muligt));
    ok(`42.3.${s}: siden viser fixturens oplyste (${fixtur.oplyst})`, har(fixtur.oplyst));
    ok(`42.3.${s}: siden viser fixturens ikke oplyste (${fixtur.io})`, har(fixtur.io));
    ok(`42.3.${s}: siden viser fixturens producenttal (${fixtur.producenter})`, har(fixtur.producenter));

    // Selve faelden: produktionens tal maa IKKE staa paa et fixturbyg.
    ok(`42.3.${s}: siden viser IKKE det rigtige datasaets robottal (${aegte.robotter})`,
      !har(aegte.robotter),
      `"${aegte.robotter}" staar paa en side bygget af ${fixtur.robotter} robotter `
      + '- et tal er skrevet i haanden i en i18n-noegle i stedet for udledt');
    ok(`42.3.${s}: siden viser IKKE det rigtige datasaets mulige oplysninger (${aegte.muligt})`,
      !har(aegte.muligt), `"${aegte.muligt}" staar paa et fixturbyg`);
  }

  /* --- 3b. ingen i18n-noegle baerer et flercifret tal ---------------------
     Den strukturelle halvdel af samme regel: et tal, der ALDRIG naar
     i18n-filen, kan heller ikke blive forældet dér. Encifrede tal er
     tilladt, fordi "fra 1 til 5" er en skala og ikke en optaelling. */
  for (const s of SPROG) {
    const fil = path.join(rod, 'data', 'i18n', `${s}.json`);
    const o = JSON.parse(fs.readFileSync(fil, 'utf8'));
    const syndere = Object.entries(o)
      .filter(([k, v]) => k.startsWith('om_') && typeof v === 'string' && /\d{2,}/.test(v))
      .map(([k]) => k);
    ok(`42.3b.${s}: ingen om_-noegle baerer et flercifret tal`,
      syndere.length === 0, syndere.join(', '));
  }

  /* --- 4. linjen om ingen forhandleraftale, i <main> ---------------------- */
  for (const s of SPROG) {
    if (!sider[s]) continue;
    const i18n = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', `${s}.json`), 'utf8'));
    const linje = i18n.ingen_forhandler;
    ok(`42.4.${s}: "ingen forhandler"-linjen staar ORDRET i <main>`,
      tekstAf(hovedAf(sider[s])).includes(linje),
      'PRODUCT.md linje 95-96 og 119-120 kraever den paa netop denne side');
    // 42.4b VENDT TILBAGE (spor/fodtest, 3. sep 2026): JPK omgjorde samme
    // dag sin egen uifix-beslutning (2. sep) og genindsatte sidefoden
    // (spor/sidefod). Linjen staar nu igen BEGGE steder - Om os' egen
    // (om-os.mjs:300, i <main>, uroert) og fodens (system.css afsnit 17,
    // uden for <main>). 42.4's <main>-afgraensning betyder derfor noget
    // igen: uden den ville 42.4 og 42.4b maale det samme tal. Falder denne
    // vagt til 1, er foden forsvundet igen; falder den til 3+, er linjen
    // kommet til at staa dobbelt ét sted.
    const heleSiden = tekstAf(sider[s]);
    const forekomster = heleSiden.split(linje).length - 1;
    ok(`42.4b.${s}: linjen staar PRAECIS TO steder paa siden (Om os' egen + fodens - foden er tilbage)`,
      forekomster === 2, `fandt ${forekomster} forekomster`);
    // REVERT-BEVIS: en side med linjen kun ÉN gang (foden fjernet igen)
    // maa IKKE bestaa den nye proeve.
    const kunEnGang = `x ${linje} y`;
    ok(`42.4b.${s}.revert: proeven FANGER en side med linjen kun ÉN gang (fjernes foden igen, falder testen)`,
      (kunEnGang.split(linje).length - 1) !== 2);
  }

  /* --- 5. CVR 10049385 staar INTET sted i hele bygget --------------------- */
  {
    const alle = [];
    (function gaa(m) {
      for (const f of fs.readdirSync(m, { withFileTypes: true })) {
        const p = path.join(m, f.name);
        if (f.isDirectory()) gaa(p); else if (/\.(html|css|js|json)$/.test(f.name)) alle.push(p);
      }
    })(dist);
    const ramt = alle.filter((f) => fs.readFileSync(f, 'utf8').includes('10049385'));
    ok('42.5: INCUBA a/s\' CVR 10049385 staar ingen steder i bygget',
      ramt.length === 0,
      `fundet i ${ramt.map((f) => path.relative(dist, f)).join(', ')} `
      + '- det er udlejerens nummer, ikke KeyResearchs (L61)');
  }

  /* --- 6. ingen udgaaende links paa Om-siden ------------------------------ */
  for (const s of SPROG) {
    if (!sider[s]) continue;
    const ude = [...hovedAf(sider[s]).matchAll(/href="(https?:[^"]*)"/g)].map((m) => m[1]);
    ok(`42.6.${s}: Om-siden har nul udgaaende http(s)-links`,
      ude.length === 0,
      `${ude.join(', ')} - L61 forbyder link til salgssiden`);
    // Kontakten skal derimod VAERE der, som mailto og tel.
    ok(`42.6b.${s}: kontakten staar som mailto og tel`,
      /href="mailto:/.test(hovedAf(sider[s])) && /href="tel:/.test(hovedAf(sider[s])));
  }

  /* --- 7. manglende oplysninger er udeladt, ikke markeret ----------------- */
  for (const s of SPROG) {
    if (!sider[s]) continue;
    const t = tekstAf(hovedAf(sider[s])).toLowerCase();
    for (const ord of ['cvr', 'stiftet', 'grundlagt', 'founded', 'incorporated']) {
      ok(`42.7.${s}: ordet "${ord}" staar ikke paa Om-siden`, !t.includes(ord),
        'L61: CVR, stiftelsesaar og team udelades HELT - de markeres ikke som "ikke oplyst"');
    }
  }

  /* --- 8. hreflang mellem sprogudgaverne ---------------------------------- */
  for (const s of SPROG) {
    if (!sider[s]) continue;
    for (const andet of SPROG) {
      ok(`42.8.${s}: hreflang peger paa ${andet}-udgaven af Om-siden`,
        new RegExp(`hreflang="${andet}" href="[^"]*${andet}/om/"`).test(sider[s]));
    }
  }

  /* --- 9. menupunktet staar paa HVER bygget side og peger paa en side ----- */
  {
    const alleSider = [];
    (function gaa(m) {
      for (const f of fs.readdirSync(m, { withFileTypes: true })) {
        const p = path.join(m, f.name);
        if (f.isDirectory()) gaa(p); else if (f.name.endsWith('.html')) alleSider.push(p);
      }
    })(dist);
    // Rodsiden er en ren omdirigering uden skallen, som del 37 ogsaa undtager.
    const medSkal = alleSider.filter((f) => path.relative(dist, f).includes(path.sep));
    const uden = medSkal.filter((f) => !/<a href="[^"]*\/om\/"/.test(fs.readFileSync(f, 'utf8')));
    ok('42.9: menupunktet "Om os" staar i daekket paa hver side med skal',
      uden.length === 0,
      `mangler paa ${uden.slice(0, 3).map((f) => path.relative(dist, f)).join(', ')}`);
    ok('42.9b: der ER sider at maale paa', medSkal.length > 0, `fandt ${medSkal.length}`);
  }

  /* --- 10. de fire kontaktkendsgerninger, og ikke flere ------------------- */
  for (const s of SPROG) {
    if (!sider[s]) continue;
    const t = tekstAf(hovedAf(sider[s]));
    for (const fakta of ['KeyResearch', 'Incuba, Åbogade 15, Aarhus', '+45 22231116', 'jpk@keyresearch.dk']) {
      ok(`42.10.${s}: "${fakta}" staar paa siden`, t.includes(fakta));
    }
  }
}
