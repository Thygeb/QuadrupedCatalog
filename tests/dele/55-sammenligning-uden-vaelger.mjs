/**
 * tests/dele/55-sammenligning-uden-vaelger.mjs — spor/saml2 (JPK 1. sep
 * 2026, punkt 1+2): sammenligningssiden mistede sin egen robotvaelger.
 * Kataloget er nu det ene sted, man vaelger robotter (afkrydsning der,
 * eller den klaebende bundbjaelke et samtidigt spor bygger); denne side er
 * ren visning + ÉN knap, "Vaelg robotter", der foerer tilbage til kataloget.
 *
 * LAASER TRE TING, som alle var ubeskyttede indtil nu:
 *
 *   PUNKT A  Vaelgersektionen er vaek: hverken `.vaelgernet`-gitteret,
 *            checkboksene (`.vc__felt`) eller den gamle `<section
 *            class="sektion sammenligning">`-indpakning findes laengere i
 *            det byggede HTML.
 *   PUNKT B  Enhedskontakten (`#enhedsskift`) OVERLEVEDE fjernelsen og
 *            staar STADIG praecis ÉN gang - den deler id med robotsidens
 *            og katalogets egen kontakt (tests/dele/44-samlenhed.mjs), og
 *            en naiv fjernelse af hele den gamle <section> ville have
 *            taget den med i faldet.
 *   PUNKT C  ER VENDT 2. sep 2026 (spor/saml3). JPK, ordret: "Choose robot
 *            knappen skal vaek og der skal istedet vaere en under hver
 *            robot."
 *
 *            PUNKT C LOED FOER: "'Vaelg robotter'-knappen ER et rigtigt
 *            <a href> til kataloget ... Knappen peger paa NOEJAGTIG samme
 *            sti som sidens eksisterende 'Tilbage til kataloget'-link."
 *            55.8-55.10 beviste netop den ene, server-renderede knap.
 *
 *            PUNKT C LYDER NU: den ene SSR-knap findes IKKE mere, og i
 *            stedet baerer hvert robot-kolonnehoved sin EGEN knap, der
 *            fjerner netop den robot fra sammenligningen.
 *
 *            HVORFOR KNAPPEN IKKE BLEV TRE KOPIER AF DEN GAMLE: L73 (JPK,
 *            1. sep) lagde udvalget paa kataloget - ét sted at vaelge - og
 *            spor/saml2's egen kodekommentar sagde det haardere: "Tre
 *            identiske links til samme sted er stoej, ikke betjening." Tre
 *            kataloglinks ville altsaa have vaeret et brud paa en truffet
 *            beslutning. Derfor virker knappen paa SIN EGEN kolonne.
 *
 *            P0 ("siden er SAND uden JavaScript") er ikke svaekket, og det
 *            er den kontrol, 55.8 nu udfoerer: den fjernede knap var en
 *            DUBLET af `<p class="retur">` i destination - begge er
 *            `url.katalog` - saa returlinket (55.7) er stadig en rigtig
 *            <a href> til kataloget i det byggede HTML, uden at ét eneste
 *            script koerer. Testen antager derfor stadig ingen haardkodet
 *            '/robotter/'-sti.
 *
 * Selve den referrer-styrede tilbage-i-historikken-adfaerd (klik fra
 * kataloget skal give `history.back()`) kan IKKE bevises af en Node-koersel
 * uden browser - det er maalt separat i en rigtig browser (se agentens
 * rapport) og staar udenfor denne fils kontrakt. Det samme gaelder selve
 * fjern-klikket; 55.13-55.16 laaser dets MEKANISME i kilden, og
 * tests/dele/66-samlflade.mjs maaler dens virkning paa tabellens output.
 *
 * REVERT-BEVIS (efterproevet af agenten, se rapporten): genindsaettes
 * `sammenligning.mjs`s SSR-knap-linje, gaar 55.8 roed; genindsaettes den
 * gamle `<section class="sektion sammenligning">`+vaelgerHTML(), gaar
 * 55.3-55.5 roede - de tester praecis det, en tilbagerulning ville braekke.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n55. spor/saml2: sammenligningssiden uden vaelger + "Vaelg robotter" tilbage til kataloget');

  const udMappe = path.join(tmp, 'dist-saml2');
  fs.rmSync(udMappe, { recursive: true, force: true });
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udMappe}`],
    { cwd: rod, encoding: 'utf8' });
  ok('55.1 build.mjs giver exit 0 (frisk byg til egen midlertidig mappe)',
    b.status === 0, (b.stdout || b.stderr || '').trim().split('\n').slice(-3).join(' / '));
  if (b.status !== 0) return;

  for (const sprog of ['da', 'en']) {
    const sti = path.join(udMappe, sprog, 'sammenligning', 'index.html');
    const html = fs.existsSync(sti) ? fs.readFileSync(sti, 'utf8') : null;
    ok(`55.2.${sprog} sammenligningssiden findes`, html !== null);
    if (!html) continue;

    /* ---------------------------------------------------------- PUNKT A */
    const antalSektionSammenligning = (html.match(/sektion sammenligning/g) || []).length;
    ok(`55.3.${sprog} den gamle <section class="sektion sammenligning"> er vaek`,
      antalSektionSammenligning === 0, `fandt ${antalSektionSammenligning}, forventede 0`);

    const antalVaelgernet = (html.match(/vaelgernet/g) || []).length;
    ok(`55.4.${sprog} .vaelgernet-gitteret er vaek`,
      antalVaelgernet === 0, `fandt ${antalVaelgernet}, forventede 0`);

    const antalVcFelt = (html.match(/vc__felt/g) || []).length;
    ok(`55.5.${sprog} ingen .vc__felt-checkbokse tilbage (foer: 77)`,
      antalVcFelt === 0, `fandt ${antalVcFelt}, forventede 0`);

    /* ---------------------------------------------------------- PUNKT B */
    const antalEnhedskontakt = (html.match(/enhedsskift__boks/g) || []).length;
    ok(`55.6.${sprog} enhedskontakten (#enhedsskift) staar praecis ÉN gang`,
      antalEnhedskontakt === 1, `fandt ${antalEnhedskontakt}, forventede 1`);
    ok(`55.6b.${sprog} enhedskontakten har id="enhedsskift" (samme noegle som robotsiden/enhed.js)`,
      /<input type="checkbox" id="enhedsskift" class="kunskaerm enhedsskift__boks">/.test(html));

    /* ---------------------------------------------------------- PUNKT C */
    // Sidens eksisterende "Tilbage til kataloget"-link, begge sprogs T.til_katalog.
    // Bruges som facit for hvor url.katalog peger - ingen haardkodet '/robotter/'.
    const returMatch = html.match(/<p class="retur"><a href="([^"]+)">/);
    ok(`55.7.${sprog} siden har det eksisterende "Tilbage til kataloget"-link at sammenligne med`,
      returMatch !== null);
    if (!returMatch) continue;
    const katalogHref = returMatch[1];

    /* 55.8 ER VENDT (spor/saml3). Den beviste, at den ene SSR-knap fandtes
       som en rigtig <a href>; den beviser nu, at den er VAEK. Vendt og ikke
       slettet: uden en assertion her kunne knappen komme tilbage ved en
       senere sammenfletning, og saa ville siden have baade en fodknap og
       tre kolonneknapper - to betjeningsformer for det samme. */
    const gammelKnap = (html.match(/class="afslutning-knap"/g) || []).length;
    ok(`55.8.${sprog} sidens ENE SSR'ede "Vaelg robotter"-knap er vaek (.afslutning-knap)`,
      gammelKnap === 0, `fandt ${gammelKnap}, forventede 0`);

    /* 55.9 ER VENDT MED DEN. Den laaste, at knappen pegede paa samme sti som
       returlinket. Den pointe overlever i en anden form: netop FORDI de to
       pegede samme sted, kostede fjernelsen ingen vej ud af siden uden JS.
       Assertion beviser nu den kontrol - returlinket staar der stadig som en
       rigtig <a href> i det byggede HTML, uden at et script koerer. */
    ok(`55.9.${sprog} returlinket daekker stadig vejen til kataloget uden JS (P0)`,
      katalogHref.length > 0 && html.includes(`<p class="retur"><a href="${katalogHref}">`),
      `katalogHref="${katalogHref}"`);

    /* 55.10 ER VENDT. Den laaste knapteksten til i18n-noeglen
       sammenligning_vaelg_titel. Teksten lever videre - klienten skriver den
       nu paa invitationen tilbage til kataloget - saa noeglen skal stadig
       naa klienten. Den laases derfor dér, hvor den nu rejser: i sidens
       JSON-blok, som `tekst.vaelg_titel`. Uden den stod invitationen tom. */
    const i18nSti = path.join(rod, 'data', 'i18n', `${sprog}.json`);
    const i18nFil = JSON.parse(fs.readFileSync(i18nSti, 'utf8'));
    const dataM = html.match(/<script type="application\/json" id="sammenligning-data">([\s\S]*?)<\/script>/);
    const sideData = dataM ? JSON.parse(dataM[1]) : null;
    ok(`55.10.${sprog} i18n-noeglen sammenligning_vaelg_titel naar klienten som tekst.vaelg_titel ("${i18nFil.sammenligning_vaelg_titel}")`,
      sideData !== null && sideData.tekst.vaelg_titel === i18nFil.sammenligning_vaelg_titel,
      `fandt "${sideData && sideData.tekst.vaelg_titel}"`);

    /* NYT 55.10b: de to fjern-strenge skal ogsaa naa klienten, og den lange
       skal baere pladsholderen {navn}. Uden {navn} ville alle tre knapper
       faa det SAMME tilgaengelige navn - tre ens navne paa tre forskellige
       handlinger, hvilket er praecis den fejl, den lange streng findes for. */
    ok(`55.10b.${sprog} fjern-knappens to strenge naar klienten, og den lange navngiver robotten`,
      sideData !== null
      && sideData.tekst.fjern_kort === i18nFil.saml_fjern_kort
      && sideData.tekst.fjern_navn === i18nFil.saml_fjern_navn
      && String(i18nFil.saml_fjern_navn).includes('{navn}'),
      `kort="${sideData && sideData.tekst.fjern_kort}" navn="${sideData && sideData.tekst.fjern_navn}"`);

    /* NYT 55.10c: katalogets URL skal naa klienten UDEN for `tekst` - den er
       ingen oversaettelse (tests/dele/38.20 ville faelde den dér), og uden
       den kan invitationen ikke tegnes. Samme sti som returlinket, saa
       ingen haardkodet '/robotter/' sniger sig ind ad bagdoeren. */
    ok(`55.10c.${sprog} katalogUrl naar klienten og peger samme sted som returlinket`,
      sideData !== null && sideData.katalogUrl === katalogHref,
      `katalogUrl="${sideData && sideData.katalogUrl}" retur="${katalogHref}"`);

  }

  /* CSS-paastandene laeses kun én gang (sprog-uafhaengige). Kommentarer
     fjernes foerst (samme faelde som tests/dele/47: en kommentar, der citerer
     reglen ordret, maa ikke kunne goere en slettet regel til en groen test). */
  const udenKommentarer = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');
  const css = udenKommentarer(fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8'));
  const genCss = udenKommentarer(fs.readFileSync(path.join(rod, 'assets', 'generator.css'), 'utf8'));

  /* 55.11 ER VENDT (spor/saml3). Den maalte `.videre`s min-height, fordi den
     fjernede knap laante sin form dér. Den nye fjern-knap laaner `.nulstil`,
     som IKKE baerer et min-height - og maa ikke faa ét: kolonnehovedet
     klaeber, og en 44 px hoej knap ville skubbe den klaebende raekke ned over
     matricen.

     KRAVET ER DET SAMME, kun opfyldt paa en anden maade: et usynligt
     `::after`-felt paa mindst 44x44, centreret paa knappen. Assertion maaler
     derfor det felt i stedet - samme tal, samme regel, ny mekanisme. Den
     laeser generator.css, hvor knappen bor (den fjernede laante fra
     system.css), og den laeser CSS-KILDEN, ikke en browser; browsermaalingen
     staar i agentrapporten. */
  const fjernFelt = (genCss.match(/\.specimen__fjern::after\s*\{([^}]*)\}/) || [])[1] || '';
  const feltH = parseFloat((fjernFelt.match(/height:\s*([\d.]+)px/) || [])[1] || '0');
  const feltB = parseFloat((fjernFelt.match(/min-width:\s*([\d.]+)px/) || [])[1] || '0');
  ok(`55.11 fjern-knappens beroeringsmaal er mindst 44x44 (fandt ${feltB}x${feltH}px)`,
    feltH >= 44 && feltB >= 44);

  /* NYT 55.11b: invitationen har plads nok til at baere de 44 px direkte -
     den staar paa sidens lyse bund, ikke i en klaebende raekke. */
  const invitBlok = (genCss.match(/\.saml-invit\s+\.saml-invit__link\s*\{([^}]*)\}/) || [])[1] || '';
  const invitH = parseFloat((invitBlok.match(/min-height:\s*([\d.]+)px/) || [])[1] || '0');
  ok(`55.11c invitationens link har min-height >= 44px (fandt ${invitH}px)`, invitH >= 44);

  /* NYT 55.11d: invitationen skal saette sin EGEN forgrund, og reglen skal
     vaere to selektorer dyb.

     Begge halvdele er koebt af en maalt fejl i dette spor. `.nulstil`s
     `color` er `--paafod` = #E8EBED, en LYS forgrund, fordi katalogets
     nulstil-knap staar paa en MOERK flade; invitationen staar paa sidens
     lyse bund. Foerste udgave arvede den og maalte 1,16:1 i browseren -
     knappen var praktisk talt usynlig. Anden udgave satte farven, men i en
     regel paa 0,1,0, altsaa PRAECIS lige saa specifik som `.nulstil`, der
     staar senere i filen og derfor vandt: maalingen gav stadig 1,16.
     Efter 0,2,0: 14,69:1.

     Assertion laaser mekanismen, ikke tallet - et kontrasttal kan kun
     maales i en browser, og det staar i agentrapporten. Men uden en
     eksplicit farve i en regel, der VINDER, er tallet garanteret forkert. */
  ok('55.11d invitationen saetter sin egen forgrund i en regel, der slaar .nulstil (0,2,0)',
    /color:\s*var\(--/.test(invitBlok),
    `blokken var: "${invitBlok.replace(/\s+/g, ' ').trim().slice(0, 100)}"`);

  // Global fokusring, upaavirket for .nulstil-familien: ingen
  // outline:none/0-overstyring nogen steder i de to CSS-filer (efterproevet
  // separat af agenten - grep gav 0 traeffere i begge filer).
  ok('55.12 :focus-visible saetter en synlig outline globalt (knappen faar den, ingen override fjerner den)',
    /:focus-visible\s*\{[^}]*outline:\s*3px\s+solid/.test(css));

  /* --- klient-JS: mekanismerne findes i KILDEN ---------------------------
     Dette er IKKE et bevis for at klikket rent faktisk virker (det kraever
     en browser, se agentrapportens maaling; virkningen paa tabellens output
     maales af tests/dele/66) - kun et strukturelt laas mod, at funktionerne
     ved en fejl forsvinder fra filen igen.

     KOMMENTARERNE STRIPPES FOERST, af samme grund som CSS'en ovenfor, og
     faelden er ikke teoretisk: den slog til under dette spors egen koersel.
     `sammenligning.js` FORKLARER, hvorfor bindingen skiftede fra
     opstart til delegering, og hvor den ene skrivning kaldes fra - og
     forklaringerne citerer noedvendigvis de moenstre, 55.13 og 55.15b maaler
     paa. Uden stripningen taeller en kommentar med som kode: 55.13 gik roed,
     fordi prosaen naevnte det gamle opslag, og 55.15b taalte 2 kald, hvor der
     er 1. Begge var maalefejl, ikke arbejdsfejl.

     Stripningen er efterproevet sikker for netop denne fil: den indeholder
     ingen '//' inde i en strengliteral (maalt: 0 forekomster), saa
     linjekommentar-regexen kan ikke aede kode. */
  const raaJs = fs.readFileSync(path.join(rod, 'assets', 'sammenligning.js'), 'utf8');
  const js = udenKommentarer(raaJs).replace(/^\s*\/\/.*$/gm, '');

  /* 55.13 ER VENDT. Den laaste `querySelectorAll('[data-saml-knap]')` - en
     binding ved opstart, som var rigtig, da knappen var server-renderet.
     Begge knapper tegnes nu klientside og bygges om ved hvert opdater(), saa
     en opstartsbinding ville ramme elementer, der ikke fandtes endnu, og
     efter foerste omtegning sidde paa elementer, der var kastet vaek.
     Assertion kraever derfor DELEGERING paa den beholder, der overlever. */
  ok('55.13 klik er delegeret til [data-saml-resultat], ikke bundet ved opstart',
    /resultat\.addEventListener\('click'/.test(js)
    && !/querySelectorAll\('\[data-saml-knap\]'\)/.test(js));

  /* NYT 55.13b: begge knaptyper haandteres af den delegerede lytter. */
  ok('55.13b lytteren kender baade fjern-knappen og invitationen',
    /data-saml-fjern/.test(js) && /data-saml-knap/.test(js));
  ok('55.14 klikket bruger document.referrer + history.back() (ikke en ny fetch/URL-mekanisme)',
    /document\.referrer/.test(js) && /window\.history\.back\(\)/.test(js));
  /* 55.15 ER VENDT, og det er den vigtigste af de vendte (spor/saml3).

     DEN LOED: "sammenligning.js laeser udvalget fra localStorage, men skriver
     det ALDRIG (siden er ren visning)" - `!/localStorage\.setItem/`.

     JPK's fjern-knap ER betjening, saa siden MAA skrive. Havde denne
     assertion staaet, var arbejdet gaaet roedt paa en regel, JPK selv havde
     aendret; havde den vaeret slettet, stod der ingenting tilbage om, hvor
     mange steder siden maa skrive.

     Den nye regel er derfor ikke "skriver ikke", men "skriver ÉT sted":
     `gemUdvalg()` er den eneste funktion med et setItem, og den kaldes kun
     af `fjernSlug()`. Det er den egentlige beskyttelse - L73 staar og
     falder med, at siden ikke faar en vaelger ad bagdoeren. Antallet
     maales, saa en anden skrivevej ikke kan snige sig ind ved siden af. */
  const skrivninger = (js.match(/localStorage\.setItem/g) || []).length;
  const laesninger = (js.match(/localStorage\.getItem/g) || []).length;
  ok(`55.15 sammenligning.js laeser udvalget ÉT sted og skriver det ÉT sted (fandt ${laesninger} laes, ${skrivninger} skriv)`,
    laesninger === 1 && skrivninger === 1
    && /localStorage\.getItem\(SAML_NOEGLE\)/.test(js)
    && /function gemUdvalg\(/.test(js));

  /* NYT 55.15b: skrivningen maa KUN naas fra fjern-knappen. Findes der en
     anden kalder af gemUdvalg(), er siden paa vej til at faa sin egen
     vaelger igen - praecis det, spor/saml2 fjernede og L73 lukkede. */
  const gemKald = (js.match(/gemUdvalg\(/g) || []).length; // 1 definition + 1 kald
  ok(`55.15b gemUdvalg() kaldes praecis ét sted, fra fjernSlug() (fandt ${gemKald - 1} kald)`,
    gemKald === 2 && /function fjernSlug\(slug\)[\s\S]{0,400}gemUdvalg\(rest\)/.test(js));

  /* NYT 55.15c: skrivningen skal vaere pakket ind. localStorage KASTER (ikke
     returnerer null) i en privat fane og med blokerede cookies, og en
     fjern-knap, der river hele scriptet ned dér, er vaerre end en, der ikke
     kan huske sit resultat. Samme vaern som laesningen allerede har. */
  ok('55.15c skrivningen staar i en try/catch (privat fane maa ikke braekke siden)',
    /try\s*\{\s*window\.localStorage\.setItem\([\s\S]{0,120}\}\s*catch/.test(js));

  fs.rmSync(udMappe, { recursive: true, force: true });
}
