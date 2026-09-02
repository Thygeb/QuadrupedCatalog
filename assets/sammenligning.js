/* sammenligning.js — felt-for-felt-tabel til /sammenligning/.
   FORBEDRER kun: uden JS staar tegnforklaringen, "Vaelg robotter"-linket til
   kataloget og en flad robotliste med links (server-renderet i
   tools/skabelon/sammenligning.mjs). Med JS erstattes den flade liste af en
   dynamisk felt-for-felt-tabel - samme "skjult, indtil JS taender det"-
   idiom som katalog.js' soegefelt.

   SPOR/SAML2 (JPK 1. sep 2026): filen havde foer sin EGEN vaelger
   (afkrydsningsfelter + soegefelt, samme .filtre-sprog som katalogets
   facetter). Den er FJERNET - kataloget er nu det ene sted, man vaelger
   robotter. Denne fil laeser stadig udvalget fra localStorage
   (`SAML_NOEGLE`, delt med katalogets samlknapper), men SKRIVER det ikke
   laengere: siden er ren visning, ikke betjening. Se `udvalgtSlugs()` og
   `fraKataloget()` nedenfor for de to mekanismer, der traadte i stedet.

   Data laeses fra et <script type="application/json"> i selve dokumentet,
   ALDRIG med fetch() - se tools/skabelon/sammenligning.mjs' begrundelse:
   file://-CORS ville braekke netop denne side, som skal virke uden en
   server. Ingen cookies, ingen netvaerkskald, ingen tredjepart. */
(function () {
  'use strict';

  var app = document.querySelector('[data-sammenligning]');
  var dataEl = document.getElementById('sammenligning-data');
  if (!app || !dataEl) return;

  var DATA;
  try { DATA = JSON.parse(dataEl.textContent); } catch (fejl) { return; }
  if (!DATA || !DATA.robotter || !DATA.robotter.length) return;

  var lang = document.documentElement.lang === 'en' ? 'en-GB' : 'da-DK';
  var nf = (window.Intl && Intl.NumberFormat) ? new Intl.NumberFormat(lang, { maximumFractionDigits: 3 }) : null;
  function fmt(n) { return nf ? nf.format(n) : String(n); }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function robotAf(slug) {
    for (var i = 0; i < DATA.robotter.length; i++) {
      if (DATA.robotter[i].slug === slug) return DATA.robotter[i];
    }
    return null;
  }

  var FELT_ANTAL = Object.keys(DATA.feltNavne).length;
  function taethedTekst(a) {
    return String(DATA.tekst.taethed_skabelon).replace('{a}', a).replace('{b}', FELT_ANTAL);
  }

  /* INTERIM UDEN synligt maerke (JPK 27. aug 2026): samme rettelse som
     side.mjs' fnote() - teksten staar stadig i title OG i .kunskaerm, kun
     den altid-synlige stjerne er fjernet, indtil D14's gyldigheds-niveauer
     er flettet og et designet maerke kan saettes ind. */
  function fnote(tekst) {
    return '<abbr class="forbehold--skjult" title="' + esc(tekst) + '">'
      + '<span class="kunskaerm">' + esc(DATA.tekst.advarsel) + ': ' + esc(tekst) + '</span></abbr>';
  }

  /* Talvaerdien: operator (set OG hoert - regel 4), figur, enhed, og et
     samlet forbeholdstegn af ved_last + advarsel (samme sammenlaegning som
     side.mjs' tal() bruger til den kompakte visning, som mockuppens egen
     sammenligningstabel ogsaa bruger - se sammenligning.mjs' filhoved). */
  /** Figuren som TEKST - ét tal eller et interval. Den samme form, side.mjs'
      tal() bygger (`nformat(min)–nformat(maks)`), og derfor ogsaa den form,
      `imperialPost()`s `kildeform` er skrevet i: samme en-tankestreg, samme
      Intl-indstillinger (maximumFractionDigits: 3). Det er dét, der lader
      "omregnet"-maerkets forklaring nedenfor bygges her i stedet for at skulle
      sendes med i JSON'en for hvert af de 565 felter. */
  function figurAf(v, min, maks) {
    return (min !== null && min !== undefined)
      ? fmt(min) + '–' + fmt(maks)
      : (typeof v === 'number' ? fmt(v) : String(v));
  }

  function vaerdiSpan(figur, enhed, nul, op) {
    return '<span class="v v-tal' + (nul ? ' v-nul' : '') + '">' + op
      + '<b class="num">' + esc(figur) + '</b>'
      + (enhed ? '<span class="enhed">' + esc(enhed) + '</span>' : '')
      + '</span>';
  }

  /* Maerket, der skiller VORES omregning fra producentens eget imperiale tal
     (regel 2). Ordret samme opbygning som side.mjs' omregningsMaerke():

       - producentens eget tal (`imp.egen`, 30 felter i datasaettet) faar
         INTET synligt maerke, kun en linje til skaermlaeseren. Det sjaeldne
         skal ikke vaere det umaerkede, men et maerke paa 535 af 565 felter
         ville drukne matricen; fravaeret forklares i omskifterens egen note.
       - vores omregning faar `.omregnet` med figuren, den kom fra.

     Forklaringen bygges af det METRISKE felt - "33,8 kg" - som er praecis
     det, `imperialPost()` server-side kalder `kildeform`. */
  function omregnetHTML(f, imp) {
    if (imp.egen) return '<span class="kunskaerm">' + esc(DATA.tekst.imperial_forklaring || '') + '</span>';
    var kilde = (figurAf(f.vaerdi, f.min, f.maks) + ' ' + (f.enhed || '')).replace(/\s+$/, '');
    var forklaring = String(DATA.tekst.enhed_omregnet_forklaring || '').replace('{figur}', kilde);
    return '<span class="omregnet" title="' + esc(forklaring) + '">'
      + '<span aria-hidden="true">' + esc(DATA.tekst.enhed_omregnet || '') + '</span>'
      + '<span class="kunskaerm">' + esc(forklaring) + '</span></span>';
  }

  function renderTal(f) {
    var op = '';
    if (f.operator && DATA.operatorer[f.operator]) {
      var o = DATA.operatorer[f.operator];
      op = '<span class="op" aria-hidden="true">' + esc(o.vis) + '</span>'
        + '<span class="kunskaerm">' + esc(o.laest) + ' </span>';
    }
    var noter = [];
    if (f.ved_last) {
      if (f.ved_last.ukendt) noter.push(DATA.tekst.ved_last_ukendt);
      else noter.push((DATA.tekst.ved_last + ' ' + fmt(f.ved_last.vaerdi) + ' ' + (f.ved_last.enhed || '')).trim());
    }
    if (f.forbehold) noter.push(f.forbehold);
    // Forbeholdstegnet staar UDEN FOR begge enhedstvillinger og bliver derfor
    // staaende i begge tilstande. Det er den rigtige adfaerd og gratis her,
    // hvor side.mjs maa foere `ved_last` over i sit rekursive kald: et
    // forbehold om selve MAALINGEN ("ved last 20 kg") gaelder tallet, ikke
    // den enhed, det er skrevet i.
    var noteHTML = noter.length ? fnote(noter.join(' · ')) : '';

    var metrisk = vaerdiSpan(figurAf(f.vaerdi, f.min, f.maks), f.enhed, f.tilstand === 'nul', op);
    // spor/enheder (K9) omregner visse felter til sidens faelles enhed;
    // `f.kildeform` (sat i sammenligning.mjs' dataBlok()) er producentens
    // egen figur+enhed. Samme title, samme i18n-noegle, samme placering
    // (uden om et eventuelt forbeholdstegn) som robot.mjs allerede bruger -
    // genbrugt moenster, ikke et nyt, se robot.mjs's kommentar ved
    // "original-enhed".
    //
    // REGEL 3: den saettes ALDRIG paa den imperiale tvilling. Dér ville
    // "Producenten skrev: 1100 mm" staa som forklaring paa VORES omregning,
    // og en omregning har ingen kilde. Samme `!__imperial`-vagt som
    // side.mjs:1151.
    if (f.kildeform) {
      var titel = String(DATA.tekst.kilde_original_form || '').replace('{figur}', f.kildeform);
      metrisk = '<span class="original-enhed" title="' + esc(titel) + '">' + metrisk + '</span>';
    }

    /* --- de to figurer (spor/samlenhed) ---------------------------------
       `f.imp` er FORUDBEREGNET af tools/skabelon/sammenligning.mjs gennem
       side.mjs' `imperialPost()` - den samme funktion, robotsiden bruger.
       Denne fil regner IKKE: der er ingen omregningstabel her, ingen kopi af
       afrundingsreglen, og ingen kopi af regel 1 ("producentens eget tal
       vinder"). Se skabelonens `imperialFelt()` for hvorfor den vej blev
       valgt frem for en tabel i browseren.

       Begge figurer staar i markup'en; CSS viser én ad gangen, praecis som
       paa robotsiden (`.enhedsvis{display:contents}`). Matricen behoever
       derfor ikke tegnes om, naar laeseren skifter enhed - og den METRISKE
       visning er noejagtig den, der stod her foer, fordi `display:contents`
       ikke laegger en kasse ind.

       NUL-TILSTANDEN AFGOERES PAA NY for den imperiale figur: 0 °C er 32 °F.
       Otte felter i datasaettet er `temp_min: 0 °C`, og `v-nul` paa "32 °F"
       ville baade vaere forkert og laese som nul-tilstanden (haard
       begraensning 5). Samme udledning som side.mjs' `post.vaerdi === 0`,
       taget paa den post, der faktisk vises. */
    if (!f.imp) return metrisk + noteHTML;
    var imp = f.imp;
    var impFigur = figurAf(imp.vaerdi, imp.min, imp.maks);
    var imperial = vaerdiSpan(impFigur, imp.enhed, imp.vaerdi === 0, op) + omregnetHTML(f, imp);
    return '<span class="enhedsvis enhedsvis--metrisk">' + metrisk + '</span>'
      + '<span class="enhedsvis enhedsvis--imperial">' + imperial + '</span>'
      + noteHTML;
  }

  /* Ét felt, de samme fire datatilstande som resten af sitet
     (system.css §8) - kun bygget her af JS i stedet for af side.mjs' egne
     tal()/tilstand(). Se tools/skabelon/sammenligning.mjs' feltVisning(). */
  function renderFelt(f) {
    if (!f) f = { tilstand: 'ikke_oplyst' };
    var forbeholdHTML = f.forbehold ? fnote(f.forbehold) : '';
    switch (f.tilstand) {
      case 'nej':
        return '<span class="v v-nej"><i class="mrk"></i>' + esc(DATA.tekst.nej) + '</span>' + forbeholdHTML;
      case 'ja':
        return '<span class="v v-ja"><i class="mrk"></i>' + esc(DATA.tekst.ja) + '</span>' + forbeholdHTML;
      case 'kun_billede':
        return '<span class="v v-billede"><i class="mrk"></i><span class="ord">' + esc(DATA.tekst.kun_billede) + '</span></span>' + forbeholdHTML;
      case 'tekst': {
        var ud = '<span class="v v-tekst">' + esc(f.tekst) + '</span>';
        if (f.min !== null && f.min !== undefined) {
          // `imp` foeres med: et tekstfelt med et maalbart interval ved siden
          // af (Spots "ureguleret DC 35-58,8 V") skal skifte enhed som ethvert
          // andet interval. MAALT 1. sep 2026: NUL af de 565 omregnelige
          // felter staar i tilstanden 'tekst' i dag - linjen er der, for at
          // det ikke er en tavs mangel, den dag et af dem gOEr.
          ud += ' ' + renderTal({ tilstand: 'tal', vaerdi: null, min: f.min, maks: f.maks, enhed: f.enhed, operator: null, imp: f.imp });
        }
        return ud + forbeholdHTML;
      }
      case 'tal':
      case 'nul':
        return renderTal(f);
      case 'ikke_oplyst':
      default:
        return '<span class="v v-ikke"><i class="mrk"></i>' + esc(DATA.tekst.ikke_oplyst) + '</span>' + forbeholdHTML;
    }
  }

  /* Aa54: matricen er en RIGTIG tabel, ikke et div-gitter.
     Foer stod hver vaerdi i et <div class="saml-raekke__celle"> uden nogen
     relation til robotnavnet i toppen. En skaermlaeser fik 90 loese
     tekstklumper; "1,5 m/s" kunne ikke knyttes til hverken feltet eller
     robotten. Sammenligning ER sidens kerneopgave, saa den relation er ikke
     pynt - den er indholdet.

     TO TING GOER DET IKKE-TRIVIELT, og begge er loest her:

     1. UDSEENDET MAA IKKE FLYTTE SIG (D15 laaste paletten, L40 valgte
        INSTRUMENT). Layoutet er et CSS-grid via --n. Loesningen er derfor
        rigtige tabelelementer, hvor CSS'en saetter display:grid/block
        ovenpaa - samme gitter, ny semantik. Se generator.css.

     2. AT AENDRE `display` PAA ET TABELELEMENT FJERNER DETS ROLLE i
        browserens tilgaengelighedstrae. Det er den klassiske faelde ved
        "display:grid paa en <table>": markup'en ser rigtig ud i kilden, og
        skaermlaeseren faar alligevel ingen tabel. Derfor staar de eksplicitte
        ARIA-roller (role="table"/"rowgroup"/"row"/"columnheader"/
        "rowheader"/"cell") ved siden af de native elementer - baelte OG
        seler. De koster ~1,2 KB i den tegnede streng og er den eneste maade
        at gaa god for semantikken paa uden en styrbar browser at maale i.
        Af samme grund har <caption> et id, som <table aria-labelledby>
        peger paa: caption->navn-relationen er lige saa udsat som resten. */
  var CAPTION_ID = 'saml-tabel-caption';

  /* Enhedskontaktens id. SAMME streng som tools/skabelon/sammenligning.mjs'
     ENHED_ID, robot.mjs' ENHED_ID og opslaget i assets/enhed.js - det er den
     ene noegle, der lader valget foelge laeseren fra en robotside hertil.
     tests/dele/44-samlenhed.mjs holder de fire steder sammen. */
  var ENHED_ID = 'enhedsskift';
  var enhedsBoks = document.getElementById(ENHED_ID);
  var sidsteOmregnelige = 0;

  /* Specimen-raekken: signaturelementet mockuppen viser oeverst (de valgte
     robotter side om side, foer laeseren ser et eneste tal). Fotografiet er
     UDELADT her (dokumenteret afvigelse, fund/FUND-lysbyg.md) - at indlejre
     alle 62 robotters billedmarkup (picture/source/alt/delt-maerke) i den
     samme JSON-blok var uforholdsmaessigt for et JS-lag, der kun forbedrer
     en side, som allerede virker uden det.

     Aa54: raekken er nu tabellens <thead>, og hvert specimen-kort er et
     <th scope="col">. Robotnavnet er dermed det, en skaermlaeser laeser op
     som kolonneoverskrift foran hver eneste vaerdi nedenunder.
     Hjoernecellen er et TOMT <td> (ikke et <th>): et <th> uden indhold
     ville taelle med som en kolonneoverskrift uden kolonne. */
  /* Maerkatfotoet i kolonnehovedet. Data er stier + alt-tekst, sat af
     sammenligning.mjs' fotoPost() - se dens kommentar for hvorfor der ikke
     ligger faerdig markup i JSON'en.

     `object-fit:contain` i CSS'en, ikke cover: chippen er 74x56, og et
     produktfoto i et andet sideforhold ville faa poter og sensorer skaaret
     af. Her er intet at vinde ved beskaering - fotoet skal kun sige HVILKEN
     maskine spalten er.

     Mangler fotoet, tegnes den stiplede ikke-oplyst-plade i stedet for en
     tom kasse: en tom kasse ser ud som en indlaesningsfejl, og
     "ingen brugbar optagelse" er en aerlig tilstand (maalt: 1 af 77). */
  function fotofeltHTML(r) {
    var f = r.foto;
    if (!f) {
      return '<span class="saml-fotofelt saml-fotofelt--uoplyst">'
        + '<span class="saml-fotofelt__ord">' + esc(DATA.tekst.billede_intet) + '</span></span>';
    }
    var kilder = '';
    for (var i = 0; i < (f.kilder || []).length; i++) {
      kilder += '<source srcset="' + esc(f.kilder[i][0]) + '" type="' + esc(f.kilder[i][1]) + '">';
    }
    return '<span class="saml-fotofelt"><picture>' + kilder
      + '<img src="' + esc(f.src) + '" alt="' + esc(f.alt || '') + '"'
      + ' loading="lazy" decoding="async"></picture></span>';
  }

  /* Jigraekken (Aa54 uroert): tabellens <thead>, hvert kolonnehoved et
     <th scope="col">. Robotnavnet er dermed det, en skaermlaeser laeser op
     foran hver eneste vaerdi nedenunder.

     NYT (spor/samlbyg, compens form): hovedet er OGSAA betjeningen. Foer
     rullede robotnavnene vaek, og raekke 25 blev laest uden at vide, hvilken
     spalte der var hvem; nu klaeber raekken (CSS: position:sticky), baerer
     robottens foto, og hver spalte har sit eget "Vaelg robotter"-link ned
     til vaelgeren. Skiftet sker altsaa DER, hvor man opdager, at man kigger
     paa den forkerte maskine.

     `.specimen`-klasserne er BEVIDST beholdt: tests/dele/29-tabelsemantik.mjs
     laeser <span class="specimen__navn"> for at bevise, at captionen naevner
     de robotter, der faktisk staar i tabellen. At doebe dem om ville have
     braekket et krav, der maaler noget rigtigt.

     Hjoernecellen er stadig et TOMT <td> hvad angaar tabelrollen (et <th>
     uden kolonne ville taelle med som en kolonneoverskrift uden kolonne) -
     men den baerer nu noeglen til svarmaerket, som ellers stod uforklaret. */
  function specimenHoved(robotter, n) {
    var celler = robotter.map(function (r) {
      return '<th scope="col" role="columnheader" class="specimen">'
        + '<span class="specimen__top">' + fotofeltHTML(r)
        + '<span class="specimen__id">'
        + '<span class="specimen__navn">' + esc(r.navn) + '</span>'
        + '<span class="specimen__meta">' + esc(r.producent) + '</span>'
        + '</span></span>'
        // `.specimen__skift` ("Vaelg robotter", per kolonne, hoppede foer ned
        // til den nu fjernede #saml-vaelger) er VAEK (spor/saml2). Der er
        // ikke laengere et sted paa DENNE side at hoppe ned til - vaelgeren
        // er flyttet til kataloget - saa et per-kolonne link ville pege paa
        // netop den samme kataloghenvisning som sidens ÉNE knap allerede
        // giver (den SSR'ede .afslutning-knap i sammenligning.mjs' render()).
        // Tre identiske links til samme sted er stoej, ikke betjening.
        + '<span class="specimen__fod">'
        + '<span class="specimen__taethed figur">' + esc(taethedTekst(r.taethedAntal)) + '</span>'
        + '</span>'
        + '</th>';
    }).join('');
    // `--n` (antal valgte) blev sat her, saa CSS'en kunne bygge et
    // grid-template med N spalter. Den er FJERNET sammen med grid-formen
    // 31. aug 2026: matricen er en rigtig tabel igen, og en tabel taeller
    // selv sine spalter. Ingen CSS-regel laeser var(--n) laengere (maalt: 0
    // forekomster i baade generator.css og system.css), og et attribut,
    // ingen bruger, er en paastand om kode der ikke findes.
    return '<thead class="specimen-hoved" role="rowgroup">'
      + '<tr class="specimen-hoved__raekke" role="row">'
      + '<td class="specimen-hoved__hjoerne" role="cell">'
      + '<span class="saml-hjoerne__ord">' + esc(DATA.tekst.alle_felter) + '</span>'
      + '<span class="saml-hjoerne__note">' + esc(feltNaevnerTekst()) + '</span>'
      + '</td>' + celler
      + '</tr></thead>';
  }

  /** "Ud af skemaets 30 felter ..." - naevneren, hjoernecellen staar for. */
  function feltNaevnerTekst() {
    return String(DATA.tekst.felter_naevner || '').replace('{b}', FELT_ANTAL);
  }

  /* Svartaellingen: hvor mange af de viste plader der oplyser DETTE felt.
     Det er en TAELLING, ikke en score - samme maalestok som sidens "N af 30
     felter oplyst", vendt 90 grader. Det er derfor heller ikke en
     vindermarkering: den siger hvem der SVARER, aldrig hvem der svarer BEDST
     (haard begraensning 6).

     DET GRAFISKE ER FJERNET (JPK 2. sep 2026, ordret: "Disse bokse der
     angiver felter oplyste skal ikke vaere der"). Foer stod der under hvert
     feltnavn en raekke smaa firkanter - én pr. plade, fyldt = svarer,
     stiplet = tier - tegnet i CSS. De er vaek sammen med deres tre
     CSS-regler i generator.css, saa der ikke staar en doed klasse tilbage
     (Aa102: projektet har 66 doede klasser, netop fordi hvert spor holdt sig
     inden for sit eget).

     TAELLINGEN BLIVER. Maerkeraekken bar `aria-hidden="true"` - den var en
     GRAFISK opsummering af celler, skaermlaeseren alligevel laeser én for én
     lige nedenunder - mens selve tallet altid har staaet som tekst i
     `.kunskaerm`. Kun det aria-skjulte er altsaa fjernet; en skaermlaeser
     hoerer noejagtig det samme som foer. Havde begge dele vaeret fjernet,
     var det en tilgaengelighedsregression, ikke en oprydning.

     `svarer` bruges desuden stadig af tabelHTML() til `.saml-raekke--tavs`
     (raekker, hvor ingen plade svarer, traeder tilbage som helhed) - den
     returneres derfor uaendret. */
  function svarHTML(robotter, feltNavn) {
    var svarer = 0;
    for (var i = 0; i < robotter.length; i++) {
      var f = robotter[i].felter[feltNavn];
      if (f && f.tilstand !== 'ikke_oplyst') svarer++;
    }
    var taelling = String(DATA.tekst.svar_taeller || '')
      .replace('{a}', svarer).replace('{b}', robotter.length);
    return {
      svarer: svarer,
      html: '<span class="kunskaerm">' + esc(taelling) + '</span>',
    };
  }

  /* Fotokreditten. Staar UDEN FOR <table> (et <p> efter den), fordi den
     handler om siden, ikke om en raekke eller en spalte - og fordi en
     tekstblok inde i en tabel ville staa i en celle, den ikke hoerer til.
     Kun de faktisk viste fotos krediteres, med producentnavn og hentedato,
     saa linjen er sand for netop den trio, laeseren har valgt. */
  function fotoophavHTML(robotter) {
    var dele = [];
    for (var i = 0; i < robotter.length; i++) {
      var f = robotter[i].foto;
      if (!f || f.ophav !== 'fabrikant') continue;
      dele.push(robotter[i].producent + (f.hentet ? ' (' + DATA.tekst.hentet + ' ' + f.hentet + ')' : ''));
    }
    if (!dele.length) return '';
    return '<p class="saml-fotoophav">' + esc(DATA.tekst.foto_ophav) + ' '
      + esc(dele.join(' · ')) + '</p>';
  }

  /* --- VAERNET: en kontakt, hvor intet skifter, er vaerre end ingen kontakt
     (robot.mjs:1016-1018, samme regel som afgOEr, om robotsiden faar en
     omskifter).

     Paa robotsiden er svaret givet én gang pr. side. Her afhaenger det af,
     hvad laeseren har valgt, og det aendrer sig under fingrene paa hende.
     MAALT 1. sep 2026 paa datasaettet: 71 af 77 robotter har mindst én
     omregnelig figur. De seks uden er anybotics-anymal-x,
     ghost-robotics-spirit-40, unitree-laikago, weilan-alphadog-e300,
     weilan-alphadog-e400l og weilan-babyalpha - alle sparsomt udfyldte.
     Af 73.150 mulige trioer har 20 (0,027 %) ingen omregnelig figur
     overhovedet, og 15 af parrene.

     Sjaeldent er ikke det samme som umuligt, og en laeser, der vaelger netop
     de tre, ville faa en kontakt, der intet gjorde. Derfor taelles der pr.
     tegning, og strimlen UDEBLIVER ved nul - den er en del af matricen, ikke
     af sidens faste stel, saa den forsvinder samme sted, som grunden til at
     have den forsvinder. Selve afkrydsningen skjules samtidig (opdater()),
     saa der ikke staar en fokusérbar kontrol tilbage uden en synlig etikette. */
  function omregneligeAntal(robotter) {
    var n = 0;
    for (var i = 0; i < robotter.length; i++) {
      var felter = robotter[i].felter;
      for (var navn in felter) {
        if (Object.prototype.hasOwnProperty.call(felter, navn) && felter[navn] && felter[navn].imp) n++;
      }
    }
    return n;
  }

  /* Strimlen over matricen: kontaktens ETIKETTE (selve afkrydsningen er
     server-renderet som foerste barn af .sammenligning-app, saa CSS'ens
     `:checked ~ *` naar hver celle) og forklaringen af, hvad et UMAERKET
     imperialt tal betyder. Flere <label for> til samme kontrol er gyldig
     HTML - robotsiden har allerede to - saa etiketten maa gerne staa her,
     langt fra boksen.

     Noten er `.enhedsnote`: CSS viser den kun i imperial tilstand. I metrisk
     ville den forklare noget, der ikke er paa skaermen. */
  function enhedslinjeHTML() {
    return '<div class="saml-enhedslinje">'
      + '<label class="enhedsskift" for="' + ENHED_ID + '">'
      + '<span class="enhedsskift__spor" aria-hidden="true"><span class="enhedsskift__knop"></span></span>'
      + '<span class="enhedsskift__ord">' + esc(DATA.tekst.enhed_skift_etiket || '') + '</span></label>'
      + '<p class="t-mikro maal enhedsnote">' + esc(DATA.tekst.enhed_skift_forklaring || '') + '</p>'
      + '</div>';
  }

  function tabelHTML(slugs) {
    // `robotter` styrer BAADE hovedet og kroppen, og `n` udledes af den.
    // Foer taalte specimenHTML() over `slugs` og kroppen over den filtrerede
    // `robotter` - en ukendt slug gav derfor ét hoved for meget, og hver
    // vaerdi rykkede en kolonne. Usynligt i et div-gitter, men i en tabel
    // ville skaermlaeseren laese hver vaerdi op under den FORKERTE robot.
    var robotter = slugs.map(robotAf).filter(Boolean);
    var n = robotter.length;
    if (!n) return '';
    var spalter = n + 1;

    var grupperHTML = DATA.grupper.map(function (g) {
      var raekker = g.felter.map(function (feltNavn) {
        // data-robot: navnet, en smal skaerm viser som cellens eget mikro-
        // maerke (CSS ::before), fordi kolonneoverskriften (specimen-raekken)
        // er langt vaek, naar tabellen staar i én spalte pr. robot. Det
        // maerke er stadig KUN visuelt - relationen baeres nu af scope="col".
        var svar = svarHTML(robotter, feltNavn);
        var celler = robotter.map(function (r) {
          var f = r.felter[feltNavn];
          var tavs = !f || f.tilstand === 'ikke_oplyst';
          return '<td class="saml-raekke__celle' + (tavs ? ' saml-raekke__celle--tavs' : '')
            + '" role="cell" data-robot="' + esc(r.navn) + '">'
            + renderFelt(f) + '</td>';
        }).join('');
        // Raekker, hvor ALLE plader tier, traeder tilbage som helhed.
        // Vaerdierne staar der stadig med deres eget stiplede maerke - hullet
        // er ikke skjult, det er blot holdt op med at konkurrere med de
        // raekker, der baerer tal. Det er tavsheden selv, der er fundet.
        var tavsRaekke = svar.svarer === 0 ? ' saml-raekke--tavs' : '';
        return '<tr class="saml-raekke' + tavsRaekke + '" role="row">'
          + '<th scope="row" role="rowheader" class="saml-raekke__navn">'
          + '<span class="saml-raekke__ord">' + esc(DATA.feltNavne[feltNavn]) + '</span>'
          + svar.html + '</th>' + celler + '</tr>';
      }).join('');
      // Én <tbody> pr. gruppe. Gruppetitlen er scope="rowgroup" - den
      // gaelder netop de raekker, der foelger i DENNE tbody, hvilket er
      // praecis det, HTML'ens rowgroup-scope betyder.
      return '<tbody class="saml-gruppe" role="rowgroup">'
        + '<tr class="saml-gruppe__titelraekke" role="row">'
        + '<th scope="rowgroup" role="rowheader" colspan="' + spalter + '" class="saml-gruppe__titel">'
        + esc(g.titel) + '</th></tr>'
        + raekker + '</tbody>';
    }).join('');

    // Captionen navngiver tabellen for den, der springer mellem tabeller,
    // og naevner hvilke robotter der staar i den. Visuelt skjult
    // (.kunskaerm): de tre navne staar allerede synligt i specimen-hovedet,
    // saa en synlig caption ville vaere en dublet - samme begrundelse som
    // sidens egen <h2 class="t-h2 kunskaerm">.
    var navne = robotter.map(function (r) { return r.navn; }).join(', ');
    var caption = String(DATA.tekst.tabel_caption || '').replace('{robotter}', navne);

    // Strimlen staar FOER tabellen, ikke inde i den: den betjener matricen og
    // hoerer ikke til en raekke eller en spalte - samme begrundelse, som
    // holder fotokreditten uden for <table>.
    sidsteOmregnelige = omregneligeAntal(robotter);

    return (sidsteOmregnelige ? enhedslinjeHTML() : '')
      + '<table class="saml-matrix" role="table" aria-labelledby="' + CAPTION_ID + '">'
      + '<caption id="' + CAPTION_ID + '" class="kunskaerm">' + esc(caption) + '</caption>'
      + specimenHoved(robotter, n) + grupperHTML
      + '</table>'
      + fotoophavHTML(robotter);
  }

  var status = app.querySelector('[data-saml-status]');
  var resultat = app.querySelector('[data-saml-resultat]');
  // Vinderreglens fodnote (matrixFodHTML() i sammenligning.mjs, "Ingen
  // vinder markeret ...") staar STATISK i markup'en, uafhaengig af om
  // matricen faktisk er bygget - den forklarer noget ved MATRICEN, og giver
  // ingen mening naar der ingen matrix er (spor/saml2, Punkt 3: fundet ved
  // en browsermaaling af "vaelg mindst 2"-tilstanden, hvor fodnoten stod
  // alene i et stort tomrum, hvor vaelgeren foer fyldte pladsen). `opdater()`
  // skjuler den derfor sammen med resultatet - ingen ny CSS-regel behoeves,
  // `[hidden]{display:none}` er UA-standarden, og intet andet sted saetter
  // `.saml-fod`s `display` (efterproevet: assets/generator.css:730 saetter
  // kun `margin-top`).
  var fod = app.querySelector('.saml-fod');
  if (!status || !resultat) return;

  function visStatus(tekst) {
    status.hidden = false;
    status.textContent = tekst;
  }
  function skjulStatus() {
    status.hidden = true;
    status.textContent = '';
  }

  function opdaterKontakt() {
    if (enhedsBoks) enhedsBoks.hidden = !sidsteOmregnelige;
  }

  /* --- UDVALGET (spor/saml2, JPK 1. sep 2026, punkt 1+2) -------------------
     Siden har IKKE laengere sin egen vaelger. Kataloget er nu det ENE sted,
     man vaelger robotter (afkrydsning der, eller den klaebende bundbjaelke
     et samtidigt spor bygger til kataloget) - denne side LAESER kun
     `SAML_NOEGLE` fra localStorage og SKRIVER den aldrig. Foer skrev
     `gemUdvalg()` tilbage ved hvert checkbox-`change`; det kald og den
     lytter er vaek sammen med checkboxene, for der er intet `change` at
     lytte paa mere - siden er nu ren visning, ikke betjening.

     LAESERENS EGET VALG VINDER STADIG OVER STANDARDVALGET (uaendret regel,
     kun flyttet hertil fra det tidligere "flet ind i checkboxene"-trin, se
     git-historikken for den gamle udgave af denne funktion): findes et
     gemt udvalg med mindst én KENDT robot, erstatter det standardvalget
     HELT, ogsaa hvis det kun rummer én robot - saa vises "vaelg mindst 2",
     hvilket er sandt og er praecis den tilstand, laeseren selv har lavet.
     Er lageret tomt, ugyldigt, utilgaengeligt eller udelukkende fyldt med
     ukendte/foraeldede slugs, bruges `DATA.standard` (de tre taettest
     udfyldte robotter, én pr. producent - sammenligning.mjs' egen
     standardvalg()) - noejagtig samme faldback som foer, kun laest direkte
     i stedet for foerst krydset af i en DOM, der ikke findes laengere. */
  var SAML_NOEGLE = 'quad-sammenligning';
  function udvalgtSlugs() {
    var kendte = {};
    for (var i = 0; i < DATA.robotter.length; i++) kendte[DATA.robotter[i].slug] = true;
    var brug = [];
    try {
      var raa = window.localStorage.getItem(SAML_NOEGLE);
      if (raa) {
        var gemt = JSON.parse(raa);
        if (Object.prototype.toString.call(gemt) === '[object Array]') {
          for (var j = 0; j < gemt.length && brug.length < DATA.maksAntal; j++) {
            var v = gemt[j];
            if (typeof v === 'string' && kendte[v] && brug.indexOf(v) < 0) brug.push(v);
          }
        }
      }
    } catch (e) { /* intet lager: standardvalget bruges */ }
    return brug.length ? brug : DATA.standard;
  }

  function opdater() {
    var slugs = udvalgtSlugs();
    if (slugs.length < 2) {
      visStatus(DATA.tekst.for_faa);
      resultat.innerHTML = '';
      sidsteOmregnelige = 0;
      if (fod) fod.hidden = true;
      opdaterKontakt();
      return;
    }
    skjulStatus();
    resultat.innerHTML = tabelHTML(slugs);
    if (fod) fod.hidden = false;
    opdaterKontakt();
  }

  /* --- "Vaelg robotter"-knappen (spor/saml2, punkt 2) ----------------------
     Knappen er SSR'et som en RIGTIG <a href> til kataloget (tools/skabelon/
     sammenligning.mjs' render(), `.afslutning-knap .videre--stille[data-
     saml-knap]`) og virker allerede uden JS, jf. P0 ("uden JavaScript er
     siden sand, med JavaScript bliver den praecis"). Denne funktion
     FORBEDRER kun klikket: kommer laeseren netop fra kataloget
     (`document.referrer`s pathname er kataloget), foerer klikket tilbage i
     historikken i stedet for at navigere frem igen - saa katalogets
     afkrydsede filtre genskabes af browseren selv (bfcache-
     formularhukommelse) uden at denne side skal kende til, gemme eller
     genopbygge et eneste filter. Kommer laeseren et andet sted fra (eller
     referrer mangler/er blokeret af browseren), sker der INGENTING i denne
     funktion - linket navigerer normalt til kataloget, praecis adfaerden
     uden JS.

     Sammenligningen bruger to detached <a>-elementer i stedet for
     `new URL()`: samme ES5-stil som resten af filen, og den loeser
     relative href'er (fx "../robotter/") mod DOKUMENTETS base-URL uden at
     kende sitets fulde origin. */
  function fraKataloget(href) {
    if (!document.referrer) return false;
    try {
      var maal = document.createElement('a');
      maal.href = href;
      var kilde = document.createElement('a');
      kilde.href = document.referrer;
      return kilde.protocol === maal.protocol && kilde.host === maal.host
        && kilde.pathname === maal.pathname;
    } catch (e) { return false; }
  }
  var valgKnapper = document.querySelectorAll('[data-saml-knap]');
  for (var vi = 0; vi < valgKnapper.length; vi++) {
    (function (el) {
      el.addEventListener('click', function (e) {
        if (fraKataloget(el.getAttribute('href'))) {
          e.preventDefault();
          window.history.back();
        }
      });
    }(valgKnapper[vi]));
  }

  /* Samme betjeningsflade, to udtryksformer: JS erstatter den statiske
     fallback-liste med den byggede tabel i stedet for at vise begge. */
  var fallback = document.querySelector('[data-sammenligning-fallback-wrap]');
  if (fallback) fallback.hidden = true;
  app.hidden = false;

  opdater();
}());
