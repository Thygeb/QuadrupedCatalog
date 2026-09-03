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

    /* 38.14 + 38.15 er VENDT 2. sep 2026 (spor/saml3, JPK: "Disse bokse der
       angiver felter oplyste skal ikke vaere der").

       FOER beviste de to, at det GRAFISKE svarmaerke blev tegnet: én firkant
       pr. plade pr. raekke (`felter x plader`), og at de stiplede fulgte
       data. Begge maalte noget rigtigt om en flade, der ikke findes mere.
       De er derfor vendt, ikke slettet - en slettet assertion efterlader
       ingenting, der siger, at reglen nogensinde var der, og saa kan
       boksene komme tilbage ved en senere "stramning" uden at noget bliver
       roedt.

       DEN NYE REGEL ER TODELT, og begge halvdele skal holde:
         38.14  det grafiske er VAEK  (0 maerker, uanset datamaengde)
         38.15  TAELLINGEN er tilbage (én .kunskaerm-linje pr. raekke, og
                dens tal foelger data)
       Halvdel to er det egentlige vaern: markoerraekken bar aria-hidden, saa
       tallet i .kunskaerm ER skaermlaeserens eneste udgave af den
       oplysning. Fjernes den med det grafiske, taber siden information for
       en skaermlaeser - en tilgaengelighedsregression, ikke en oprydning. */
    const maerker = (tabelHTML.match(/saml-svar/g) || []).length;
    ok(`38.14.${sprog}: det grafiske svarmaerke er VAEK (0, ikke ${m.antalFelter}x${m.antalRobotter})`,
      maerker === 0, `fandt ${maerker}`);

    // Taellingen: ét .kunskaerm-svar pr. feltraekke. Tallet er UDLEDT af
    // datablokken, ikke haardkodet - vokser skemaet eller kataloget, foelger
    // kravet med. Talt paa raekkehovederne, saa fx fotofeltets eller
    // operatorernes egne .kunskaerm-spans ikke taelles med.
    const taellinger = (tabelHTML.match(/<\/span><span class="kunskaerm">[^<]*<\/span><\/th>/g) || []).length;
    ok(`38.15a.${sprog}: svartaellingen staar stadig for hver af de ${m.antalFelter} feltraekker`,
      taellinger === m.antalFelter, `fandt ${taellinger}`);

    /* ... og tallet skal FOELGE DATA, ellers er taellingen pynt.
       Sammenligningen er ORDNET, ikke en `includes`-stikproeve: raekkerne
       staar i grupperaekkefoelgen, saa den n'te taelling i HTML'en hoerer til
       det n'te felt. Uden ordenen ville to felter med samme tal ("3 af 3
       oplyst") kunne daekke over hinandens fejl. */
    const skabelon = String(data.tekst.svar_taeller);
    const ventedeLinjer = [];
    for (const g of data.grupper) {
      for (const feltNavn of g.felter) {
        let n = 0;
        for (const r of valgte) {
          const f = r.felter[feltNavn];
          if (f && f.tilstand !== 'ikke_oplyst') n++;
        }
        ventedeLinjer.push(skabelon.replace('{a}', n).replace('{b}', valgte.length));
      }
    }
    const fundneLinjer = [...tabelHTML.matchAll(/<span class="kunskaerm">([^<]*)<\/span><\/th>/g)]
      .map((t) => t[1]);
    const foersteAfvig = ventedeLinjer.findIndex((v, i) => v !== fundneLinjer[i]);
    ok(`38.15b.${sprog}: alle ${ventedeLinjer.length} taellinger foelger data, i raekkefoelge`,
      fundneLinjer.length === ventedeLinjer.length && foersteAfvig === -1,
      `fandt ${fundneLinjer.length} linjer; foerste afvigelse ved ${foersteAfvig}: `
      + `ventet "${ventedeLinjer[foersteAfvig]}", fandt "${fundneLinjer[foersteAfvig]}"`);

    // Ingen vindermarkering. Haard begraensning 6: en redaktionel score uden
    // offentliggjort metode findes ikke - heller ikke som en "bedste"-klasse.
    ok(`38.16.${sprog}: matricen markerer ingen vinder`,
      !/vinder|winner|bedst|best-value/i.test(tabelHTML));
  }

  /* --- 5b. Vinderreglens TEKST er vaek - princippet er det ikke ----------
     VENDT 3. sep 2026, ikke slettet. Indtil da stod her 38.17/38.18/38.19,
     som beviste at teksten "Ingen vinder markeret" STOD paa siden og stod
     uden for laesenoeglen. JPK fjernede teksten; assertionerne beviser nu
     den NYE regel, saa der ikke bliver et hul, hvor der foer stod et krav.
     Havde de bare vaeret slettet, ville intet laengere sige, at teksten
     engang var der - og intet ville forhindre, at den kom igen ved et
     uheld sammen med en vindermarkering. */

  console.log('  4. Vinderreglens tekst er fjernet, foden og princippet staar');
  for (const sprog of ['da', 'en']) {
    const html = sider[sprog];
    const fod = html.indexOf('class="saml-fod"');

    ok(`38.17.${sprog}: vinderreglens tekst staar IKKE laengere paa siden`,
      html.indexOf('class="saml-vinderregel"') === -1);
    // Ordet selv, uafhaengigt af klassenavnet: en ny formulering af samme
    // note ville slippe forbi et tjek, der kun kigger efter klassen.
    ok(`38.18.${sprog}: hverken "ingen vinder" eller "no winner" staar i markup'en`,
      !/ingen vinder|no winner/i.test(html));
    // Foden BLIVER: fotokreditten skrives ind i den klientside.
    ok(`38.19.${sprog}: .saml-fod staar stadig, EFTER matricens resultatbeholder`,
      fod !== -1 && fod > html.indexOf('data-saml-resultat'),
      `fod=${fod}, resultat=${html.indexOf('data-saml-resultat')}`);
    // REVERT-BEVIS: de to tjek ovenfor SKAL fange en syntetisk streng, der
    // baerer det, de forbyder. Ellers er et groent 38.17/38.18 ingenting vaerd.
    ok(`38.17.revert.${sprog}: en syntetisk streng med klassen fanges`,
      '<p class="saml-vinderregel">x</p>'.indexOf('class="saml-vinderregel"') !== -1);
    ok(`38.18.revert.${sprog}: en syntetisk streng med ordet fanges`,
      /ingen vinder|no winner/i.test('<p>Ingen vinder markeret</p>'));
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

    /* 6a er VENDT MED 38.14/38.15 (spor/saml3, 2. sep 2026).

       FOER muterede den svarmaerkets klasse ud af kilden og krav, at
       taellingen faldt til 0. Det bevis er nu meningsloest: maerket ER 0 i
       den uroerte kilde, saa mutationen ville ikke kunne aendre noget, og
       modbeviset ville vaere groent uanset input - praecis den slags
       kriterium, filhovedet advarer imod.

       Det, der SKAL modbevises nu, er halvdel to: at 38.15 faktisk maaler
       skaermlaeserens taelling. Mutationen fjerner derfor `.kunskaerm`-
       udsendelsen fra svarHTML(), og 38.15a skal falde fra 30 til 0. Uden
       den kunne taellingen forsvinde tavst sammen med boksene - som var
       netop den tilgaengelighedsregression, briefet forbOEd. */
    const udenTaelling = scriptKilde.replace(
      "html: '<span class=\"kunskaerm\">' + esc(taelling) + '</span>',",
      "html: '',");
    ok('38.21/modbevis: mutationen fjernede faktisk svartaellingen fra kilden',
      udenTaelling !== scriptKilde, 'ingen forekomst at fjerne - testen ville vaere tom');
    const r1 = kaldTabelHTML(sideHTML, udenTaelling);
    const t1 = (r1.tabelHTML.match(/<\/span><span class="kunskaerm">[^<]*<\/span><\/th>/g) || []).length;
    ok('38.22/modbevis: uden .kunskaerm falder svartaellingen til 0',
      t1 === 0, `fandt ${t1}`);

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
    const tRen = (rRen.tabelHTML.match(/<\/span><span class="kunskaerm">[^<]*<\/span><\/th>/g) || []).length;
    ok('38.25/modbevis: samme vej med UROERT kilde giver stadig taellinger, fotos og fuld semantik',
      tRen === mRen.antalFelter
      && (rRen.tabelHTML.match(/<img\b/g) || []).length > 0
      && mRen.table === 1 && mRen.thScopeCol === mRen.antalRobotter,
      `taellinger=${tRen} (ventet ${mRen.antalFelter}), `
      + `img=${(rRen.tabelHTML.match(/<img\b/g) || []).length}, table=${mRen.table}`);
  }
}
