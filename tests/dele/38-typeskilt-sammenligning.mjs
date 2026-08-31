/**
 * tests/dele/38-typeskilt-sammenligning.mjs — spor/samlbyg, 31. aug 2026.
 *
 * TYPESKILT-redesignets sammenligningsside, bygget efter compen
 * `retninger/nyverden/sammenligning.html` (godkendt af JPK efter to
 * feedbackrunder). Delen beviser de fem ting, der ellers ville kunne rulles
 * tilbage TAVST ved en senere "stramning" — hver af dem er en beslutning,
 * JPK traf udtrykkeligt, ikke en udførelsesdetalje:
 *
 *   1. Laesenoeglen er ÉT ALTID-SYNLIGT BAAND. Ingen <details>, ingen fold.
 *   2. Baandets lead er UDLEDT af i18n, ikke skrevet — lead + rest skal give
 *      den oprindelige streng TEGN FOR TEGN, paa begge sprog.
 *   3. Kildebogstaver hoerer IKKE til paa denne flade (L46). En fejlagtig
 *      omgoerelse kostede et helt flet i Aa55; her faelder den en test.
 *   4. Fotoet i jigraekken peger paa filer, der FAKTISK naaede dist/billeder/.
 *   5. Svarmaerket er en TAELLING af hvem der svarer — aldrig en vinder
 *      (haard begraensning 6). Antallet skal foelge data, ikke et fast tal.
 *
 * HVORFOR DEN IKKE MAA MAALE PAA `dist/` ALENE: matricen tegnes KLIENTSIDE
 * (assets/sammenligning.js' `tabelHTML()`). Et grep paa den byggede fil giver
 * 0 <table>, uanset om arbejdet er rigtigt eller ravruskende galt — et
 * kriterium, der giver samme tal uanset input, maaler ingenting. Punkt 3-5
 * gaar derfor gennem `tools/maal-tabelsemantik.mjs`, som koerer den RIGTIGE
 * sammenligning.js i en `vm`. Punkt 1-2 er server-renderet og laeses i dist.
 *
 * BEGGE RETNINGER BEVISES: blok 6 muterer kilden med vilje og kraever, at
 * maalingerne FALDER. Mutationen sker paa en streng i hukommelsen — ingen fil
 * roeres, intet skal ryddes op bagefter.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { kaldTabelHTML, taelSemantik } from '../../tools/maal-tabelsemantik.mjs';

/** Den laengste faelles forstavelse — SAMME udledning som skabelonens egen. */
function faellesForstavelse(strenge) {
  if (!strenge.length) return '';
  const f = String(strenge[0]);
  let i = 0;
  while (i < f.length && strenge.every((s) => String(s)[i] === f[i])) i++;
  return f.slice(0, i);
}

/** Fladgoer en i18n-fil til {noegle: streng}, saa vaerdier kan slaas op. */
function fladt(obj) {
  const ud = {};
  (function gaa(o) {
    for (const k of Object.keys(o)) {
      const v = o[k];
      if (v && typeof v === 'object') gaa(v); else ud[k] = v;
    }
  }(obj));
  return ud;
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n38. TYPESKILT: sammenligningssiden (spor/samlbyg)');

  const dist = path.join(tmp, 'dist-samlbyg');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${dist}`],
    { cwd: rod, encoding: 'utf8' });
  ok('38: byg af hele kataloget giver exit 0', b.status === 0, (b.stderr || '').trim());

  const sider = {};
  for (const sprog of ['da', 'en']) {
    sider[sprog] = fs.readFileSync(path.join(dist, sprog, 'sammenligning', 'index.html'), 'utf8');
  }
  const i18n = {
    da: fladt(JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'da.json'), 'utf8'))),
    en: fladt(JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'en.json'), 'utf8'))),
  };

  /* --- 1. Laesenoeglen er et baand, ikke en fold ------------------------- */

  console.log('  1. Laesenoeglen staar altid synlig — ingen fold');
  for (const sprog of ['da', 'en']) {
    const html = sider[sprog];

    // JPK var udtrykkelig: noeglen til at laese tallene maa ikke ligge bag et
    // klik paa den side, hvis hele opgave er at laese tal.
    const folder = (html.match(/<details\b|<summary\b/g) || []).length;
    ok(`38.1.${sprog}: sammenligningssiden har 0 <details>/<summary>`,
      folder === 0, `fandt ${folder}`);

    // indexOf paa KLASSENAVNET, ikke split() paa sektions-id'et: skabelonen
    // skriver hvert id TO gange (aria-labelledby og id), saa split rammer det
    // tomme mellemstykke og giver 0 uanset hvad der staar paa siden.
    const start = html.indexOf('class="saml-noegle"');
    ok(`38.2.${sprog}: laesenoegle-baandet findes paa siden`, start !== -1);
    const baand = start === -1 ? '' : html.slice(start, html.indexOf('</section>', start));

    // Baandet maa ikke vaere skjult ad bagvejen.
    ok(`38.3.${sprog}: baandet er hverken hidden eller display:none`,
      start !== -1 && !/\shidden[=\s>]/.test(baand) && !/display:\s*none/.test(baand));

    // Alle fire datatilstande skal staa i baandet. Haard begraensning 5: "0",
    // "nej" og "ikke oplyst" er tre forskellige tilstande, og en noegle, der
    // kun forklarer to af dem, er en noegle med et hul.
    for (const klasse of ['v-tal', 'v-nul', 'v-nej', 'v-ikke']) {
      ok(`38.4.${sprog}: baandet viser tilstanden .${klasse}`,
        baand.includes(klasse), baand.slice(0, 200));
    }
  }

  /* --- 2. Leadet er UDLEDT, ikke skrevet -------------------------------- */

  console.log('  2. Baandets lead er udledt af i18n — tegn for tegn');
  for (const sprog of ['da', 'en']) {
    const T = i18n[sprog];
    const fulde = [T.tegnforklaring_oplyst, T.tilstand_nul_forklaring,
      T.tilstand_nej_forklaring, T.tilstand_ikke_oplyst_forklaring];
    const lead = faellesForstavelse(fulde);

    // Kernen: leadet + hver rest skal give den oprindelige streng TILBAGE,
    // tegn for tegn. Uden denne assertion kunne en "stramning" af en
    // oversaettelse tavst fjerne et ord fra forklaringen, uden at nogen
    // opdagede det — teksten paa siden ville stadig se hel ud.
    ok(`38.5.${sprog}: lead + rest giver den oprindelige streng tilbage, tegn for tegn`,
      fulde.every((s) => lead + String(s).slice(lead.length) === s));

    // Et halvt ord som lead ville vaere vaerre end intet. Skabelonen falder
    // tilbage til de fulde saetninger under to ord — her kraeves, at den
    // faktiske i18n stadig HAR en faelles forstavelse at loefte ud.
    const ordILead = lead.trim().split(/\s+/).filter(Boolean).length;
    ok(`38.6.${sprog}: leadet er mindst to ord ("${lead.trim()}")`, ordILead >= 2,
      `${ordILead} ord`);

    // Resterne skal vaere FORSKELLIGE. Var to ens, bar to tilstande samme
    // forklaring, og baandet ville lyve om, at de kan skelnes.
    const rester = fulde.map((s) => String(s).slice(lead.length));
    ok(`38.7.${sprog}: de fire rester er indbyrdes forskellige`,
      new Set(rester).size === rester.length, rester.join(' | '));

    // Og resten skal FAKTISK staa paa siden — ellers er udledningen rigtig,
    // men bruges ikke.
    const html = sider[sprog];
    const synligRest = String(fulde[0]).slice(lead.length)
      .replace(/^[,\s]+/, '').replace(/\s*\.\s*$/, '');
    ok(`38.8.${sprog}: den udledte rest staar paa siden ("${synligRest}")`,
      html.includes(synligRest), synligRest);
  }

  /* --- 3-5. Klientsidens matrice ---------------------------------------- */

  console.log('  3. Jigraekken, fotoet og svarmaerket (klientside-output)');
  const scriptKilde = fs.readFileSync(path.join(rod, 'assets', 'sammenligning.js'), 'utf8');

  for (const sprog of ['da', 'en']) {
    const { tabelHTML, data } = kaldTabelHTML(sider[sprog], scriptKilde);
    const m = taelSemantik(tabelHTML, data);

    // L46, bekraeftet af JPK 27. aug 2026: kildebogstaver hoerer ikke til paa
    // denne flade. En fejlagtig omgoerelse kostede et helt flet i Aa55.
    const kildemaerker = (tabelHTML.match(/kildemaerke|kilde-bogstav/g) || []).length;
    ok(`38.9.${sprog}: matricen tegner 0 kildebogstaver (L46)`,
      kildemaerker === 0, `fandt ${kildemaerker}`);

    // Hjoernecellen skal blive ved med at vaere PRAECIS ét <td>. Et <th> uden
    // kolonne ville taelle med som en kolonneoverskrift uden kolonne og
    // braekke forholdet mellem vaerdi og robot.
    const hjoerner = (tabelHTML.match(/class="specimen-hoved__hjoerne"/g) || []).length;
    ok(`38.10.${sprog}: jigraekken har praecis ét hjoerne, og det er et <td>`,
      hjoerner === 1 && m.td === 1 + m.antalRobotter * m.antalFelter,
      `hjoerner=${hjoerner}, td=${m.td}`);

    // Fotoet: ét <img> pr. valgt robot, der HAR et foto - og hver af dem skal
    // baere en alt-tekst. Et billede uden alt er et hul for en skaermlaeser.
    const valgte = data.standard.map((s) => data.robotter.find((r) => r.slug === s));
    const medFoto = valgte.filter((r) => r && r.foto);
    const imgs = (tabelHTML.match(/<img\b/g) || []).length;
    ok(`38.11.${sprog}: ét <img> pr. valgt robot med foto (${medFoto.length})`,
      imgs === medFoto.length, `img=${imgs}`);
    ok(`38.12.${sprog}: hvert <img> i matricen har en alt-tekst`,
      imgs === 0 || (tabelHTML.match(/<img[^>]*\salt="[^"]+"/g) || []).length === imgs);

    // En srcset til en fil, ingen har lavet, er en tom paastand. Stierne er
    // relative til sidens egen mappe (dist/<sprog>/sammenligning/), saa de
    // opløses derfra - praecis som browseren ville gøre det.
    const sideMappe = path.join(dist, sprog, 'sammenligning');
    const manglende = [];
    for (const r of data.robotter) {
      if (!r.foto) continue;
      for (const s of [r.foto.src, ...(r.foto.kilder || []).map((k) => k[0])]) {
        if (!fs.existsSync(path.resolve(sideMappe, s))) manglende.push(r.slug + ' -> ' + s);
      }
    }
    ok(`38.13.${sprog}: alle ${data.robotter.filter((r) => r.foto).length} fotostier findes i dist/billeder/`,
      manglende.length === 0, manglende.slice(0, 4).join(' · '));

    // Svarmaerket: ét pr. plade pr. raekke. Tallet er UDLEDT af datablokken,
    // ikke haardkodet - vokser skemaet eller kataloget, foelger kravet med.
    const maerker = (tabelHTML.match(/class="saml-svar__m/g) || []).length;
    ok(`38.14.${sprog}: svarmaerker = felter x plader = ${m.antalFelter}x${m.antalRobotter}`,
      maerker === m.antalFelter * m.antalRobotter, `fandt ${maerker}`);

    // De TAVSE maerker skal svare til de felter, robotterne faktisk ikke
    // oplyser - ellers er maerket pynt, ikke en maaling. Talt uafhaengigt her,
    // ud af datablokken, og holdt op mod det tegnede.
    let ventetTavse = 0;
    for (const g of data.grupper) {
      for (const feltNavn of g.felter) {
        for (const r of valgte) {
          const f = r.felter[feltNavn];
          if (!f || f.tilstand === 'ikke_oplyst') ventetTavse++;
        }
      }
    }
    const tegnetTavse = (tabelHTML.match(/saml-svar__m saml-svar__m--tavs/g) || []).length;
    ok(`38.15.${sprog}: tavse svarmaerker foelger data (${ventetTavse})`,
      tegnetTavse === ventetTavse, `tegnet ${tegnetTavse}, ventet ${ventetTavse}`);

    // Ingen vindermarkering. Haard begraensning 6: en redaktionel score uden
    // offentliggjort metode findes ikke - heller ikke som en "bedste"-klasse.
    ok(`38.16.${sprog}: matricen markerer ingen vinder`,
      !/vinder|winner|bedst|best-value/i.test(tabelHTML));
  }

  /* --- 5b. Vinderreglen staar ved foden, ikke i noeglen ------------------ */

  console.log('  4. Vinderreglen staar ved matricens fod');
  for (const sprog of ['da', 'en']) {
    const html = sider[sprog];
    const noegle = html.indexOf('class="saml-noegle"');
    const noegleSlut = html.indexOf('</section>', noegle);
    const regel = html.indexOf('class="saml-vinderregel"');

    ok(`38.17.${sprog}: vinderreglen staar paa siden`, regel !== -1);
    // Den er en TRUFFET BESLUTNING, ikke et tegn man slaar op. Stod den i
    // noeglen, blev den laest som endnu et tegn blandt tegnene.
    ok(`38.18.${sprog}: vinderreglen staar UDEN FOR laesenoeglen`,
      regel !== -1 && (regel < noegle || regel > noegleSlut),
      `noegle=${noegle}..${noegleSlut}, regel=${regel}`);
    ok(`38.19.${sprog}: vinderreglen staar EFTER matricens resultatbeholder`,
      regel > html.indexOf('data-saml-resultat'));
  }

  /* --- 6. Ingen opfundne strenge ---------------------------------------- */

  console.log('  5. Hver klientstreng kommer fra i18n — ingen opfundet tekst');
  for (const sprog of ['da', 'en']) {
    const m = sider[sprog].match(/<script type="application\/json" id="sammenligning-data">([\s\S]*?)<\/script>/);
    const data = JSON.parse(m[1]);
    const kendte = new Set(Object.values(i18n[sprog]).filter((v) => typeof v === 'string'));
    // Sporet maatte ikke roere data/i18n/*.json (spor/topbar ejer dem). Denne
    // assertion er vaernet mod den nemme udvej: at skrive en dansk streng
    // direkte i skabelonen, som saa ville staa uoversat paa den engelske side.
    const opfundne = Object.entries(data.tekst)
      .filter(([, v]) => typeof v === 'string')
      .filter(([, v]) => !kendte.has(v))
      .map(([k, v]) => `${k}="${v}"`);
    ok(`38.20.${sprog}: alle ${Object.keys(data.tekst).length} klientstrenge findes ordret i ${sprog}.json`,
      opfundne.length === 0, opfundne.slice(0, 4).join(' · '));
  }

  /* --- 7. MODBEVIS: maalingerne skal FALDE, naar arbejdet fjernes -------- */

  console.log('  6. Modbevis — kriterierne skal falde, naar reglen fjernes');
  {
    const sideHTML = sider.da;

    // 6a - fjern svarmaerket. 38.14 skal gaa fra opfyldt til brudt.
    const udenSvar = scriptKilde.replace(/class="saml-svar__m/g, 'class="ingenting');
    ok('38.21/modbevis: mutationen fjernede faktisk svarmaerkets klasse fra kilden',
      udenSvar !== scriptKilde, 'ingen forekomst at fjerne - testen ville vaere tom');
    const r1 = kaldTabelHTML(sideHTML, udenSvar);
    ok('38.22/modbevis: uden svarmaerket falder taellingen til 0',
      (r1.tabelHTML.match(/class="saml-svar__m/g) || []).length === 0);

    // 6b - fjern fotoet. 38.11 skal falde med.
    const udenFoto = scriptKilde.replace(/<img src="/g, '<span data-src="');
    ok('38.23/modbevis: mutationen fjernede faktisk <img> fra kilden',
      udenFoto !== scriptKilde, 'ingen forekomst at erstatte');
    const r2 = kaldTabelHTML(sideHTML, udenFoto);
    ok('38.24/modbevis: uden <img> falder fototaellingen til 0',
      (r2.tabelHTML.match(/<img\b/g) || []).length === 0);

    // 6c - kontrol: den UROERTE kilde skal stadig maale rigtigt gennem SAMME
    // vej som mutationerne. Ellers kunne 6a/6b vaere faldet af en anden grund
    // end mutationen (fx en shim, der slet ikke koerer scriptet).
    const rRen = kaldTabelHTML(sideHTML, scriptKilde);
    const mRen = taelSemantik(rRen.tabelHTML, rRen.data);
    ok('38.25/modbevis: samme vej med UROERT kilde giver stadig maerker, fotos og fuld semantik',
      (rRen.tabelHTML.match(/class="saml-svar__m/g) || []).length
        === mRen.antalFelter * mRen.antalRobotter
      && (rRen.tabelHTML.match(/<img\b/g) || []).length > 0
      && mRen.table === 1 && mRen.thScopeCol === mRen.antalRobotter,
      `maerker=${(rRen.tabelHTML.match(/class="saml-svar__m/g) || []).length}, `
      + `img=${(rRen.tabelHTML.match(/<img\b/g) || []).length}, table=${mRen.table}`);
  }
}
