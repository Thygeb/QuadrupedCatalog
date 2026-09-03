/* katalog.js — soegning OG levende taellinger. FORBEDRER kun.
 *
 * ARBEJDSDELINGEN, som er hele pointen (P0, 28. aug 2026, uaendret af
 * TYPESKILT-ombygningen 31. aug 2026):
 *
 *   UDEN JavaScript er siden SAND, men statisk. Filtrene virker (CSS, :has()
 *   og afkrydsningsfelter), sorteringen virker (`order` paa gitterets celler),
 *   og hver taeller siger selv, hvad den taeller ("41 af 77", "74 robotter i
 *   standardvisningen"). Intet tal paastaar at beskrive det viste udvalg.
 *
 *   MED JavaScript bliver den PRAECIS. Taellerne regnes om ved hvert klik, og
 *   en kombination uden traef faar en forklaring i stedet for en tom side.
 *   Forbeholdene forsvinder samtidig, fordi de er blevet usande:
 *   `data-levende` paa formularen slukker dem i CSS.
 *
 * Det er den raekkefoelge, loeftet i sidefoden kraever. JavaScript maa
 * forbedre sandheden; den maa aldrig vaere forudsaetningen for den.
 *
 * AENDRET 31. aug 2026 (spor/katalog): salene er vaek, saa `salDele`,
 * `salTaellere` og `tommelTaellere` er vaek med dem. I stedet opdateres
 * strimlens taeller og resultatets overskrift. Og `eg`-facetten regnes med OG
 * i stedet for ELLER - se passer().
 *
 * AENDRET 1. sep 2026 (spor/filter, L65c/L66): nyttelast og pris har faaet
 * GLIDENDE skalaer. De er det foerste sted, hvor JavaScript overtager en
 * filtrering fra CSS - og netop derfor er de bygget som TO oploesninger af
 * samme filter, ikke som et filter, der kun findes her: uden scriptet
 * filtrerer begge som traerskel-afkrydsninger i ren CSS ("Mindst 20 kg"),
 * med scriptet bliver de en skala, der kan staa hvor som helst imellem.
 * Se afsnittet SKALAERNE nedenfor. Loeftet i filhovedet er uaendret; det er
 * kun den blevet skarpere, fordi den samme sandhed nu findes i to
 * oploesninger i stedet for én.
 *
 * Ingen cookies, ingen netvaerkskald, ingen tredjepart.
 */
(function () {
  'use strict';

  var felter = document.querySelectorAll('[data-sog="katalog"],[data-sog="forside"]');
  for (var i = 0; i < felter.length; i++) felter[i].removeAttribute('hidden');

  /* Forsidens soegefelt foerer til kataloget og fylder feltet der ud. Det
     staar foerst, fordi forsiden ikke har resten af kataloget at arbejde med
     og skal virke, ogsaa naar den tidlige `return` nedenfor rammer. */
  var forside = document.querySelector('form[data-sog="forside"]');
  if (forside) {
    forside.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = forside.querySelector('input').value.trim();
      window.location.href = 'robotter/' + (v ? '?s=' + encodeURIComponent(v) : '');
    });
  }

  /* ======================================================================
     SAMLINGEN: "Tilfoej til sammenligning" (JPK 1. sep 2026, punkt 1)

     STAAR FOER DEN TIDLIGE `return` NEDENFOR MED VILJE. Linjen
     `if (!gitter || !input || !form) return;` springer resten af filen over
     paa sider uden resultatgitteret - og forsiden er netop saadan en side,
     men den HAR kort med samlknapper. Laegges denne blok efter linjen,
     virker knapperne kun i kataloget, og fejlen er tavs.

     P0 I PRAKSIS (se filhovedet): knapperne staar `hidden` i HTML'en, og det
     er DENNE fil, der fjerner attributten. Uden JavaScript findes de derfor
     ikke - hverken visuelt, i taborden eller i tilgaengelighedstraeet - og
     sammenligningssidens egne afkrydsningsfelter er uroert den eneste vej
     ind. JavaScript forbedrer sandheden; den baerer den ikke.

     JPK valgte UDTRYKKELIGT lokalt lager frem for URL-parametre, saa et
     udvalg kan samles paa tvaers af sider. Ingen cookie, intet netvaerkskald:
     localStorage bliver paa maskinen og forlader den aldrig.
     ====================================================================== */
  var SAML_NOEGLE = 'quad-sammenligning';
  /* SKAL STEMME MED `maksAntal` i tools/skabelon/sammenligning.mjs (i dag 3).
     Tallet kan ikke importeres herind - det er en egenskab paa et objekt,
     skabelonen returnerer, ikke en eksport - saa i stedet vogter
     tests/dele/41-samlknap.mjs, at de to er ens. Driver de fra hinanden,
     bliver testen roed i stedet for at knappen tavst tillader en fjerde. */
  var SAML_MAKS = 3;

  var samlKnapper = document.querySelectorAll('[data-saml]');
  if (samlKnapper.length) {
    var samlTaeller = document.querySelector('[data-saml-taeller]');
    var samlTal = document.querySelector('[data-saml-tal]');
    var samlOrd = document.querySelector('[data-saml-ord]');
    var samlGraense = document.querySelector('[data-saml-graense]');
    var samlRyd = document.querySelector('[data-saml-ryd]');
    /* Ordlyden hentes fra det, skabelonen allerede har skrevet, saa den
       oversatte streng staar ÉT sted (data/i18n/*.json) og ikke ogsaa her.
       `data-saml-skabelon` baerer "valgt til sammenligning" UDEN tallet:
       tallet staar i sit eget gule stempel ved siden af, og stod det begge
       steder, laeste raekken "3 · 3 valgt til sammenligning" (set paa
       skaermbillede, 1440). Skabelonen beholder replace('{n}') alligevel,
       saa en oversaettelse, der HAR brug for tallet inde i saetningen, kan
       saette det - flere sprog kan ikke boeje uden om det. */
    var samlSkabelon = samlTaeller ? samlTaeller.getAttribute('data-saml-skabelon') : '';
    var samlMaksTekst = samlTaeller ? samlTaeller.getAttribute('data-saml-maks-tekst') : '';
    /* FJERN-KNAPPENS TO STRENGE (spor/bundbar, 4. sep 2026, punkt 1) kommer
       ind ad SAMME doer som de to ovenfor. `__kort` er det synlige ord
       ("Fjern" / "Remove"), `__navn` er skaermlaeserens fulde saetning med
       pladsholderen {navn}, som fyldes ved koersel.

       INGEN NY I18N-NOEGLE: saml_fjern_kort og saml_fjern_navn stod i
       forvejen i begge sprogfiler, men KUN sammenligningssiden laeste dem
       (maalt foer sporet: grep "saml_fjern" i tools/ ramte alene
       skabelon/sammenligning.mjs). Skabelonen skriver dem nu ogsaa til
       .saml-taeller, saa katalogsidens bjaelke kan naa dem herfra. */
    var samlFjernKort = samlTaeller ? samlTaeller.getAttribute('data-saml-fjern-kort') : '';
    var samlFjernNavn = samlTaeller ? samlTaeller.getAttribute('data-saml-fjern-navn') : '';

    /* ====================================================================
       KLAEBEBAR: en persistent bjaelke i bunden af skaermen (JPK 1. sep
       2026, L67, punkt 6 - omgoer fravalget, der stod her indtil i dag).

       ÉN DOM-KONSTRUKTION, ALDRIG SERVERRENDERET, og det er selve P0-
       loesningen her: en `<div hidden>`, skabelonen skrev, ville staa i
       markup'en paa hver eneste side, katalog.js henter (ogsaa forsiden) -
       men denne fil bygger KUN elementet, naar den kan fylde det (naar
       .saml-taeller findes, dvs. paa katalogsiden). Uden JavaScript findes
       bjaelken derfor slet ikke - staerkere end `hidden`, som stadig ville
       vaere et element i tilgaengelighedstraeet. Det er samme greb som
       samlknappen (P0 i filhovedet), ét niveau strengere.

       NAVNE, IKKE ANTAL (haard begraensning 1). Slug -> navn laeses af de
       kort, der FAKTISK staar paa denne side - kataloget viser alle 77
       (kun CSS-skjulte ved filtrering), saa opslaget lykkes for enhver
       robot, der kan vaere valgt herfra. Ingen netvaerkskald: samme kilde,
       samme DOM, samme princip som resten af filen.

       TEKSTEN GENBRUGES, IKKE GENTAGES. "Åbn sammenligningen" og "Ryd
       udvalget" staar ÉT sted i sprogfilerne (saml_gaa, saml_ryd) og laeses
       her fra de elementer, skabelonen allerede skrev dem til
       (.saml-taeller__gaa, samlRyd) - to kopier af samme streng ville
       kunne drive fra hinanden ved naeste rettelse. Linket til
       sammenligningssiden er af samme grund IKKE genberegnet her (en
       haandregnet '../' ville vaere praecis den fejl, build.mjs' egen
       advarsel gaelder) - det er samme `url.sammenligning`, katalog.mjs
       allerede skrev til `.saml-taeller__gaa`. */
    var samlNavne = {};
    var klaebebar = null;
    var klaebebarValg = null;
    var klaebebarGaa = null;
    var klaebebarGaaHref = '';

    if (samlTaeller) {
      for (var sn = 0; sn < samlKnapper.length; sn++) {
        var kortEl = samlKnapper[sn].parentElement;
        while (kortEl && kortEl.classList && !kortEl.classList.contains('kort')) kortEl = kortEl.parentElement;
        var navnEl = kortEl ? kortEl.querySelector('.kort__navn') : null;
        var slugAttr = samlKnapper[sn].getAttribute('data-saml');
        if (slugAttr && navnEl) samlNavne[slugAttr] = navnEl.textContent.trim();
      }

      var gaaLink = samlTaeller.querySelector('.saml-taeller__gaa');
      klaebebarGaaHref = gaaLink ? gaaLink.getAttribute('href') : '';

      klaebebar = document.createElement('div');
      klaebebar.className = 'klaebebar';
      klaebebar.setAttribute('hidden', '');
      klaebebar.setAttribute('role', 'region');
      klaebebar.setAttribute('aria-label', samlTaeller.getAttribute('data-klaebebar-etiket') || '');

      /* EN LISTE, IKKE EN SAETNING (spor/bundbar punkt 1, planens D2).
         Her stod ét <p class="klaebebar__navne"> med navne.join(' · ').
         Den kunne kun fjernes HELT: laeseren maatte finde robottens kort
         igen blandt 77 i et 6.603 px hoejt dokument for at fortryde ét
         valg. Nu er hvert navn sit eget <li> med sin egen Fjern-knap
         umiddelbart efter sig - tre knapper, der alle hedder "Fjern",
         skelnes af det navn, de staar ved siden af.

         `aria-live="polite"` fordi listen aendrer sig UDEN at fokus
         flytter sig et sted, der siger hvorfor: forsvinder et led, skal
         skaermlaeseren hoere den nye liste. KUN NAVNENE laeses op - ingen
         optaelling, intet "2 af 3" (haard begraensning 1 gaelder ogsaa i
         lyd, ikke kun paa skaermen). */
      klaebebarValg = document.createElement('ul');
      klaebebarValg.className = 'klaebebar__valg';
      klaebebarValg.setAttribute('aria-live', 'polite');

      klaebebarGaa = document.createElement('a');
      // L77: knapprimitiven i TEKST-vaegten paa MOERK flade (.klaebebar staar
      // paa --fod), med `--frem` fordi dette er bjaelkens handling og
      // `__ryd` nedenfor dens fortrydelse. `--frem` er accent paa den moerke
      // flade = 9,19:1, altsaa noejagtig den farve, linket havde i forvejen -
      // L76 tillader udtrykkeligt accent som tekst dér.
      // classList.add og ikke className = 'a b c': hver klasse staar da som
      // sin EGEN streng. tests/dele/57's doede-klasse-detektor leder efter
      // et klassenavn med et citationstegn omkring, og `knap--tekst-moerk`
      // findes KUN her (bjaelken bygges af JavaScript og staar aldrig i
      // dist/), saa i én lang streng ville den blive talt som doed CSS.
      klaebebarGaa.classList.add('klaebebar__gaa', 'knap', 'knap--tekst-moerk', 'knap--frem');
      klaebebarGaa.textContent = gaaLink ? gaaLink.textContent : '';

      var klaebebarRyd = document.createElement('button');
      klaebebarRyd.type = 'button';
      klaebebarRyd.classList.add('klaebebar__ryd', 'knap', 'knap--tekst-moerk');
      // samlRyd (knappen i strimlen) findes endnu ikke her - den bygges
      // faa linjer laengere nede i filen - men elementet DEN sidder paa
      // ER allerede i DOM'en (skabelonen skrev den), saa teksten kan laeses
      // direkte uden at vente paa variablen.
      var samlRydEl = document.querySelector('[data-saml-ryd]');
      klaebebarRyd.textContent = samlRydEl ? samlRydEl.textContent : '';
      klaebebarRyd.addEventListener('click', function () {
        skrivUdvalg([]);
        sigGraense('');
        tegnSaml();
      });

      klaebebar.appendChild(klaebebarValg);
      klaebebar.appendChild(klaebebarGaa);
      klaebebar.appendChild(klaebebarRyd);
      document.body.appendChild(klaebebar);
    }

    /* Lokalt lager kan KASTE, ikke bare vaere tomt: privat vindue, blokerede
       site-data, eller en browser der afviser skrivning naar kvoten er fuld.
       Hvert kald er derfor pakket ind, og en fejl giver et tomt udvalg -
       knappen holder op med at huske, men siden gaar ikke i stykker. */
    function laesUdvalg() {
      try {
        var raa = window.localStorage.getItem(SAML_NOEGLE);
        if (!raa) return [];
        var a = JSON.parse(raa);
        if (Object.prototype.toString.call(a) !== '[object Array]') return [];
        var ud = [];
        for (var i2 = 0; i2 < a.length && ud.length < SAML_MAKS; i2++) {
          if (typeof a[i2] === 'string' && a[i2]) ud.push(a[i2]);
        }
        return ud;
      } catch (e) { return []; }
    }
    function skrivUdvalg(a) {
      try { window.localStorage.setItem(SAML_NOEGLE, JSON.stringify(a)); } catch (e) { /* tavs */ }
    }

    /* ÉT LED I BJAELKENS LISTE: navnet plus dets egen Fjern-knap.
       (spor/bundbar punkt 1, planens D2 - moensteret er sammenlignings-
       sidens, godkendt af JPK 2. sep 2026, ikke et nyt paafund:
       assets/sammenligning.js:356-359 bygger den samme knap med de samme
       to i18n-noegler.)

       ORDET "Fjern", IKKE ET KRYDS - JPK's beslutning J4, 3. sep 2026.
       Tre knapper med samme navn skelnes af navnet ved siden af, og et ord
       kraever ingen tolkning. (Fundet bag spoergsmaalet staar i
       fund/FUND-bundbar.md: CSS-kommentaren over .klaebebar forbyder
       "symboler af nogen art", og kortets eget stempel bryder allerede den
       regel med content:"+" og "\00d7". Det er en modstrid mellem en
       kommentar og koden - den noteres, den rettes ikke her.)

       TO SPAN, IKKE ÉT: det synlige ord er aria-hidden, og skaermlaeseren
       faar i stedet den fulde saetning "Fjern <navn> fra sammenligningen".
       Uden det hoerer hun "Fjern, Fjern, Fjern". */
    function byggValgLed(slug) {
      var navn = samlNavne[slug] || slug;
      var led = document.createElement('li');

      var navnEl2 = document.createElement('span');
      navnEl2.className = 'klaebebar__navn';
      navnEl2.textContent = navn;

      var fjern = document.createElement('button');
      fjern.type = 'button';
      // classList.add med hver klasse som sin EGEN streng: tests/dele/57's
      // doede-klasse-detektor kraever et citationstegn umiddelbart foer
      // klassenavnet, og disse klasser findes KUN her (bjaelken staar
      // aldrig i dist/). Samme grund som ved __gaa ovenfor.
      fjern.classList.add('klaebebar__fjern', 'knap', 'knap--tekst-moerk');
      fjern.setAttribute('data-saml-fjern', slug);

      var synligt = document.createElement('span');
      synligt.setAttribute('aria-hidden', 'true');
      synligt.textContent = samlFjernKort;

      var forSkaermlaeser = document.createElement('span');
      forSkaermlaeser.className = 'kunskaerm';
      forSkaermlaeser.textContent = (samlFjernNavn || '').replace('{navn}', navn);

      fjern.appendChild(synligt);
      fjern.appendChild(forSkaermlaeser);
      fjern.addEventListener('click', function () { fjernValg(slug); });

      led.appendChild(navnEl2);
      led.appendChild(fjern);
      return led;
    }

    /* Fjern ÉT slug fra udvalget. Samme tre linjer som ryd-knappen, men paa
       ét led i stedet for alle - og graensebeskeden ryddes, fordi den kun
       gav mening, saa laenge udvalget VAR fuldt. */
    function fjernValg(slug) {
      var valgt = laesUdvalg();
      var p2 = valgt.indexOf(slug);
      if (p2 < 0) return;
      valgt.splice(p2, 1);
      skrivUdvalg(valgt);
      sigGraense('');
      tegnSaml();
    }

    function sigGraense(tekst) {
      if (samlGraense) samlGraense.textContent = tekst || '';
    }

    function tegnSaml() {
      var valgt = laesUdvalg();
      var k;
      for (var i2 = 0; i2 < samlKnapper.length; i2++) {
        k = samlKnapper[i2];
        k.removeAttribute('hidden');
        var er = valgt.indexOf(k.getAttribute('data-saml')) >= 0;
        k.setAttribute('aria-pressed', er ? 'true' : 'false');
      }
      if (samlTaeller) {
        /* CHIPPEN I STRIMLEN VISES ALDRIG MERE. JPK 2. sep 2026, ordret:
           "selected to compare baren skal kun leve i bunden af skaermen".
           Udvalget stod to steder - her og i klaebebaren - og to udgaver af
           samme oplysning er én for mange.

           Her stod til i dag en blok, der slog `hidden` fra og satte
           `data-aktiv`. `data-aktiv` er det ENESTE, der kan vise elementet:
           system.css giver `.saml-taeller{display:none}` som grundtilstand og
           `.saml-taeller[data-aktiv]{display:flex}` som den eneste undtagelse.
           Derfor er der ikke roert ét tegn CSS - attributten saettes bare ikke.

           TO LAASE, IKKE ÉN. `hidden` - som skabelonen skriver - bliver nu
           staaende hele siden igennem, fordi intet fjerner det laengere. CSS'
           display:none er den anden laas. system.css ejes af et andet spor;
           med kun CSS-laasen kunne chippen komme frem igen ved en aendring,
           ingen forbandt med denne. `hidden` holder den desuden ude af
           tilgaengelighedstraeet, saa dens <a> og <button> ikke kan naas med
           tabulator - display:none alene goer det samme, men kun saa laenge
           reglen staar.

           ELEMENTET MAA IKKE SLETTES. Klaebebaren LAESER sin tekst af det:
           href og linktekst fra `.saml-taeller__gaa`, ARIA-navnet fra
           `data-klaebebar-etiket`, ryd-knappens tekst fra `[data-saml-ryd]`
           (se KLAEBEBAR-afsnittet ovenfor). Det er nu en SKJULT BAERER af
           oversatte strenge, ikke en flade. Alle tre laeses med `textContent`
           og ikke `innerText` - det foerste er DOM og virker paa et skjult
           element, det andet er layout og ville give tom streng.

           TALLET OG ORDET FYLDES STADIG, og det er et bevidst fravalg, ikke
           en forglemmelse: `samlSkabelon` er den eneste laeser af skabelonens
           `data-saml-skabelon`, som igen er den eneste bruger af i18n-noeglen
           `saml_taeller`. Fjernes de to linjer her, staar noeglen foraeldreloes
           i `data/i18n/`, som dette spor ikke ejer. Oprydningen er noteret i
           rapporten til det spor, der ejer sprogfilerne. */
        if (samlTal) samlTal.textContent = String(valgt.length);
        if (samlOrd) samlOrd.textContent = samlSkabelon.replace('{n}', String(valgt.length));
      }
      if (klaebebar) {
        if (valgt.length) {
          /* Listen bygges FORFRA hver gang. Alternativet - at pille det ene
             <li> ud og lade resten staa - ville spare et par DOM-kald og
             koste den ene ting, der er svaer at faa rigtig: raekkefoelgen i
             listen SKAL vaere raekkefoelgen i `valgt`, ogsaa efter at et led
             i midten er vaek. Tre led er ikke en ydelsesgrund til noget. */
          klaebebarValg.textContent = '';
          for (var vn = 0; vn < valgt.length; vn++) {
            klaebebarValg.appendChild(byggValgLed(valgt[vn]));
          }
          klaebebarGaa.setAttribute('href', klaebebarGaaHref || '#');
          klaebebar.removeAttribute('hidden');
        } else {
          // Samme regel som samlTaeller: en tom bjaelke er ikke en
          // oplysning, den er stoej. Forsvinder helt, naar udvalget goer.
          klaebebar.setAttribute('hidden', '');
        }
      }
    }

    for (var s = 0; s < samlKnapper.length; s++) {
      samlKnapper[s].addEventListener('click', function (e) {
        e.preventDefault();
        var slug = this.getAttribute('data-saml');
        var valgt = laesUdvalg();
        var p = valgt.indexOf(slug);
        if (p >= 0) {
          valgt.splice(p, 1);
          sigGraense('');
        } else if (valgt.length >= SAML_MAKS) {
          /* GRAENSEN SIGES, DEN VISES IKKE SOM 74 DAEMPEDE KNAPPER.
             Alternativet - at slukke alle ikke-valgte knapper, naar den
             tredje er sat - ville gaette, at laeseren er faerdig, og goere
             74 kort passive for at haandhaeve en regel om 3. Her afvises
             kun det klik, der faktisk overskrider, og beskeden staar i en
             role="status", saa den ogsaa hoeres. */
          sigGraense(samlMaksTekst);
          return;
        } else {
          valgt.push(slug);
          sigGraense('');
        }
        skrivUdvalg(valgt);
        tegnSaml();
      });
    }

    /* KAN IKKE KLIKKES I DAG, og det skal staa her, saa den naeste laeser ikke
       tror andet: `samlRyd` er knappen INDE i .saml-taeller, som siden 2. sep
       2026 er permanent `hidden` (se tegnSaml ovenfor). Ryd-handlingen, en
       laeser faktisk kan naa, er klaebebarens egen `.klaebebar__ryd`, som har
       sin egen lytter med samme tre linjer. Lytteren bliver staaende som
       vaern: skulle `hidden` falde bort ved en fremtidig aendring, er knappen
       en virkende knap frem for en doed. */
    if (samlRyd) {
      samlRyd.addEventListener('click', function () {
        skrivUdvalg([]);
        sigGraense('');
        tegnSaml();
      });
    }

    /* To faner aabne paa samme side: den ene skal ikke vise et foraeldet tal.
       `storage` fyrer kun i de ANDRE faner, saa der er ingen sloejfe. */
    window.addEventListener('storage', function (e) {
      if (!e.key || e.key === SAML_NOEGLE) tegnSaml();
    });

    tegnSaml();
  }

  var gitter = document.getElementById('alle');
  var input = document.getElementById('sog-katalog');
  var form = document.getElementById('styr');
  if (!gitter || !input || !form) return;

  /* `eg` er den ene facet, hvor flere markeringer INDSNAEVRER i stedet for at
     udvide - en capability er en uafhaengig betingelse. CSS goer det samme med
     rene HIDE-regler (se katalog.mjs' filhoved); navnet staar ÉT sted her, saa
     de to ikke kan komme til at vaere uenige. */
  var OG_FACET = 'eg';

  var tomt = document.querySelector('[data-tomt]');
  var tomtSoeg = document.querySelector('[data-tomt-grund="soeg"]');
  var tomtFilter = document.querySelector('[data-tomt-grund="filter"]');
  var bokse = form.querySelectorAll('.facetter__net input[type=checkbox]');
  var hovedTaeller = form.querySelector('.taeller__tal');
  var resultatTitel = form.querySelector('.resultat__titel');

  /* Filtergruppernes "mindst ét valgt"-maerke (JPK 1. sep 2026, punkt 4).
     Uden JavaScript viser hver gruppe kun en TILSTEDEVAERELSE (CSS kan ikke
     taelle - se katalog.mjs' facetAktivMrk()); denne del erstatter den med
     det EKSAKTE tal. `[data-facetgruppe]` staar paa alle ni grupper, ogsaa
     den reserverede certificeringsgruppe, som slet ingen afkrydsningsfelter
     har og derfor aldrig faar et maerke at fylde (facetgruppeAntal() springer
     den roligt over via `if (!mrk) continue`). */
  var facetGrupper = form.querySelectorAll('[data-facetgruppe]');

  form.addEventListener('submit', function (e) { e.preventDefault(); });

  /* --- INDEKSET ------------------------------------------------------------
     Bygges ÉN gang af den DOM, bygget allerede har skrevet - ikke af en kopi
     af facetlisten her i filen. Facetnavnene laeses af lagenes egne klasser,
     saa en ny facet i katalog.mjs virker her uden en rettelse, og en
     omdoebt facet kan ikke komme til at staa to forskellige steder. */
  var FACETTER = [];
  var poster = [];
  var kort = gitter.querySelectorAll('.kort');
  for (i = 0; i < kort.length; i++) {
    var k = kort[i];
    var post = { el: k, ydre: null, v: {}, tal: {}, sog: '' };
    var el = k.parentElement;
    while (el && el.classList && el.classList.contains('lag')) {
      for (var c = 0; c < el.classList.length; c++) {
        var navn = el.classList[c];
        if (navn.indexOf('lag-') !== 0) continue;
        var f = navn.slice(4);
        if (FACETTER.indexOf(f) === -1) FACETTER.push(f);
        post.v[f] = (el.getAttribute('data-' + f) || '').split(/\s+/).filter(Boolean);
        /* SKALALAGENES RAA TAL. Attributten findes KUN paa de robotter, der
           oplyser feltet (katalog.mjs udelader den ellers), saa fravaeret her
           ER tilstanden "ikke oplyst". Derfor `hasAttribute` og ikke en
           sammenligning med '' eller 0: et maalt nul er et tal, og de to maa
           ikke kollapse (haard begraensning 5). */
        if (el.hasAttribute('data-' + f + '-tal')) {
          var raat = parseFloat(el.getAttribute('data-' + f + '-tal'));
          if (!isNaN(raat)) post.tal[f] = raat;
        }
      }
      /* Det YDERSTE lag er det, der baerer soegeteksten (katalog.mjs giver
         kun facet nr. 0 `data-sog`). Det er ogsaa det lag, der skal skjules,
         naar JavaScript filtrerer - ét sted at saette `hidden`, saa soegning
         og skalaer ikke kan komme til at slaas om attributten. */
      if (el.hasAttribute('data-sog')) {
        post.sog = el.getAttribute('data-sog') || '';
        post.ydre = el;
      }
      el = el.parentElement;
    }
    poster.push(post);
  }

  /* ======================================================================
     SKALAERNE: nyttelast og pris som GLIDENDE filtre (L65c/L66, JPK 1. sep)

     DET HER ER DEN ANDEN OPLOESNING AF ET FILTER, DER ALLEREDE VIRKER.
     Uden JavaScript filtrerer begge skalaer som traerskel-afkrydsninger i ren
     CSS - "Mindst 20 kg" - noejagtig som enhver anden facet. Naar denne fil
     koerer, skjules trinlisten (CSS: `.styr[data-levende] .skala__trin`),
     CSS-reglerne for de to facetter slukker (katalog.mjs genererer dem med
     `:not([data-levende])`), og skalaen herunder overtager. Det er P0 i sin
     reneste form: samme spoergsmaal, finere svar, og den grove udgave staar
     tilbage af sig selv, hvis scriptet ikke naar frem.

     TO TING SKAL VAERE SANDE, FOR AT SKIFTET IKKE LYVER:
       1. CSS maa ikke filtrere paa de to facetter samtidig med os. Det er
          sikret i katalog.mjs, ikke her - men hvis nogen fjerner det led,
          filtrerer siden to gange med to graenser, og fejlen er tavs.
       2. En traerskel, laeseren allerede havde valgt (et filterlink som
          robotter/#f-nyttelast-20, eller en tilbage-navigation der genskaber
          afkrydsninger), skal FOELGE MED over i skalaen. Ellers ville et
          filter, der virkede foer scriptet indlaeste, forsvinde idet det gjorde.
          Se fraTraerskler() nedenfor.

     "IKKE OPLYST" ER IKKE EN DEL AF SKALAEN, og det er med vilje. De 12
     robotter uden nyttelast og de 66 uden pris kan hverken vaere over eller
     under en graense; de har deres egen raekke, som bliver staaende i BEGGE
     oploesninger. Er skalaen i hvile, er de med (der filtreres jo ikke). Er
     den rykket, kommer de kun med, hvis raekken er krydset af. Det er den
     eneste laesning, hvor de hverken forsvinder tavst eller lader som om de
     baerer 0 kg (haard begraensning 5).
     ====================================================================== */
  var skalaer = [];
  var SKALA_NAVNE = [];

  var skalaEl = form.querySelectorAll('[data-skala]');
  for (i = 0; i < skalaEl.length; i++) {
    (function (rod) {
      var navn = rod.getAttribute('data-skala');
      var greb = rod.querySelector('.skala__greb');
      if (!greb) return;
      var knuder = (rod.getAttribute('data-skala-knuder') || '').split(/\s+/)
        .map(parseFloat).filter(function (n) { return !isNaN(n); });
      if (knuder.length < 2) return;
      var s = {
        navn: navn,
        rod: rod,
        greb: greb,
        retning: rod.getAttribute('data-skala-retning') || 'mindst',
        enhed: rod.getAttribute('data-skala-enhed') || '',
        ord: rod.getAttribute('data-skala-ord') || '',
        hviletekst: rod.getAttribute('data-skala-hviletekst') || '',
        traefSkabelon: rod.getAttribute('data-skala-traef-skabelon') || '{n}/{m}',
        knuder: knuder,
        afrund: parseFloat(rod.getAttribute('data-skala-afrund')) || 1,
        ordEl: rod.querySelector('[data-skala-visord]'),
        talEl: rod.querySelector('[data-skala-vistal]'),
        enhedEl: rod.querySelector('[data-skala-visenhed]'),
        traefEl: rod.querySelector('[data-skala-traef]'),
        chip: form.querySelector('[data-valg-skala="' + navn + '"]'),
        nu: 0,
      };
      s.mindste = knuder[0];
      s.stoerste = knuder[knuder.length - 1];
      s.chipNavn = s.chip ? s.chip.querySelector('[data-valg-skala-navn]') : null;
      // "Ikke oplyst"-raekken er et almindeligt afkrydsningsfelt i samme
      // facetgruppe. Den laeses HER og ikke af passer(): skalaen ejer hele
      // facetten, naar JavaScript koerer.
      s.uoplyst = null;
      var alle = form.querySelectorAll('input[name="' + navn + '"]');
      for (var j = 0; j < alle.length; j++) {
        if (alle[j].value === 'ikke_oplyst') s.uoplyst = alle[j];
      }
      s.traerskler = [];
      for (j = 0; j < alle.length; j++) {
        if (alle[j].value !== 'ikke_oplyst') s.traerskler.push(alle[j]);
      }
      skalaer.push(s);
      SKALA_NAVNE.push(navn);
    }(skalaEl[i]));
  }

  /** Er `navn` en facet, skalaerne har overtaget? */
  function erSkala(navn) {
    return SKALA_NAVNE.indexOf(navn) !== -1;
  }

  /* Tallenes form er sprogets, ikke denne fils: <html lang> baerer allerede
     sidens sprog, og bygget formaterer med samme sprog paa serversiden. Der
     staar derfor ingen tabel over decimaltegn her - kun et opslag. */
  var SPROG = document.documentElement.getAttribute('lang') || 'da';
  function nformat(n) {
    try { return Number(n).toLocaleString(SPROG); } catch (e) { return String(n); }
  }

  /* STILLING -> VAERDI. Aksen er STYKKEVIS LINEAER gennem knuderne, som er
     jaevnt fordelt paa banen. Uden det ville en lineaer akse fra 0 til 200 kg
     samle 60 af de 65 oplyste robotter paa de foerste 40 % af banen, og de
     fire traerskelridser ville staa oven i hinanden. Se katalog.mjs'
     skalaBlok for hele begrundelsen; knuderne selv kommer DERFRA og staar
     ikke som en kopi her. */
  function tilVaerdi(s, p) {
    var led = s.knuder.length - 1;
    var x = (p / 100) * led;
    var i2 = Math.min(Math.floor(x), led - 1);
    var f2 = x - i2;
    var v = s.knuder[i2] + f2 * (s.knuder[i2 + 1] - s.knuder[i2]);
    return Math.round(v / s.afrund) * s.afrund;
  }

  /** Den modsatte vej: bruges kun, naar en traerskel skal loeftes ind i skalaen. */
  function tilStilling(s, v) {
    var led = s.knuder.length - 1;
    if (v <= s.knuder[0]) return 0;
    if (v >= s.knuder[led]) return 100;
    for (var i2 = 0; i2 < led; i2++) {
      if (v <= s.knuder[i2 + 1]) {
        var spaend = s.knuder[i2 + 1] - s.knuder[i2];
        var f2 = spaend ? (v - s.knuder[i2]) / spaend : 0;
        return Math.round(((i2 + f2) / led) * 100);
      }
    }
    return 100;
  }

  /** Filtrerer skalaen overhovedet? I hvilestillingen goer den ikke. */
  function skalaAktiv(s) {
    return s.retning === 'mindst' ? s.nu > s.mindste : s.nu < s.stoerste;
  }

  /**
   * Facetgruppernes eksakte "N valgt"-tal (JPK 1. sep 2026, punkt 4).
   * Erstatter CSS-udgavens tilstedevaerelsesmaerke (katalog.mjs'
   * facetAktivMrk() -> [data-facet-aktiv]) med et tal i [data-facet-antal].
   *
   * TO TAELLEMAADER, praecis som resten af filen skelner mellem dem:
   *   - En SKALA (nyttelast, pris) er ÉN kontrol, ikke en liste af
   *     afkrydsninger, naar JavaScript koerer (se filhovedets afsnit om
   *     SKALAERNE) - "antal valgt" kan der kun vaere 0 eller 1, alt efter om
   *     grebet staar i hvile.
   *   - Enhver anden gruppe taelles ved at gaa `bokse` igennem og summere de
   *     afkrydsede felter med samme `name` som gruppen - samme kilde, `bokse`,
   *     som §4's per-vaerdi-taellere allerede bruger, saa der er ingen anden
   *     taelling at driver fra.
   */
  function facetgruppeAntal() {
    for (var g = 0; g < facetGrupper.length; g++) {
      var gruppe = facetGrupper[g];
      var navn = gruppe.getAttribute('data-facetgruppe');
      var mrk = gruppe.querySelector('[data-facet-antal]');
      if (!navn || !mrk) continue;
      var antal = 0;
      if (erSkala(navn)) {
        for (var si = 0; si < skalaer.length; si++) {
          if (skalaer[si].navn === navn && skalaAktiv(skalaer[si])) antal = 1;
        }
      } else {
        for (var b2 = 0; b2 < bokse.length; b2++) {
          if (bokse[b2].name === navn && bokse[b2].checked) antal++;
        }
      }
      if (antal > 0) {
        mrk.textContent = nformat(antal);
        mrk.removeAttribute('hidden');
      } else {
        mrk.setAttribute('hidden', '');
      }
    }
  }

  /** Slipper ét kort gennem ÉN skala? */
  function skalaPasser(post, s) {
    if (!skalaAktiv(s)) return true;
    var v = post.tal[s.navn];
    if (v === undefined) return !!(s.uoplyst && s.uoplyst.checked);
    return s.retning === 'mindst' ? v >= s.nu : v <= s.nu;
  }

  /** ... og gennem dem alle, evt. med én sprunget over (til facettaellingen). */
  function skalaerPasser(post, spring) {
    for (var i2 = 0; i2 < skalaer.length; i2++) {
      if (skalaer[i2].navn === spring) continue;
      if (!skalaPasser(post, skalaer[i2])) return false;
    }
    return true;
  }

  /** Tegner aflaesning, bane, taelling og strimmelchip for én skala. */
  function tegnSkala(s) {
    var p = parseFloat(s.greb.value);
    if (isNaN(p)) p = s.retning === 'mindst' ? 0 : 100;
    s.nu = tilVaerdi(s, p);
    var aktiv = skalaAktiv(s);
    var ord = aktiv ? s.ord + ' ' + nformat(s.nu) + ' ' + s.enhed : s.hviletekst;

    if (s.ordEl) s.ordEl.textContent = aktiv ? s.ord : s.hviletekst;
    if (s.talEl) s.talEl.textContent = aktiv ? nformat(s.nu) : '';
    if (s.enhedEl) s.enhedEl.textContent = aktiv ? s.enhed : '';
    // Skaermlaeseren skal hoere "Mindst 20 kg", ikke "20" - tallet alene
    // siger ikke hvilken vej graensen vender.
    s.greb.setAttribute('aria-valuetext', ord);

    // Den gule strimmel daekker det udsnit, filteret SLIPPER IGENNEM.
    s.greb.style.setProperty('--f0', (s.retning === 'mindst' ? p : 0) + '%');
    s.greb.style.setProperty('--f1', (s.retning === 'mindst' ? 100 : p) + '%');

    if (s.traefEl) {
      var n = 0;
      var m = 0;
      for (var i2 = 0; i2 < poster.length; i2++) {
        var v = poster[i2].tal[s.navn];
        if (v === undefined) continue;
        m++;
        if (!aktiv || (s.retning === 'mindst' ? v >= s.nu : v <= s.nu)) n++;
      }
      s.traefEl.textContent = s.traefSkabelon
        .replace('{n}', nformat(n)).replace('{m}', nformat(m));
    }

    if (s.chip) {
      if (aktiv) {
        s.chip.removeAttribute('hidden');
        if (s.chipNavn) s.chipNavn.textContent = ord;
      } else s.chip.setAttribute('hidden', '');
    }
  }

  /**
   * Loefter en allerede valgt TRAERSKEL ind i skalaen og slaar den fra.
   *
   * Uden den her ville et filterlink (robotter/#f-nyttelast-20) og enhver
   * tilbage-navigation, hvor browseren genskaber afkrydsninger, tabe sit
   * filter i samme oejeblik JavaScript indlaeste: CSS-reglerne er slukket af
   * `data-levende`, og skalaen stod paa hvile. Traersklen flyttes derfor over
   * i skalaen - samme graense, finere kontrol - og feltet ryddes, saa det
   * ikke ogsaa taeller med i markering() og nogenMarkering().
   *
   * FLERE valgte traerskler forenes til den mildeste, praecis som CSS'ens
   * ELLER-grammatik ville have gjort: ">=20 eller >=50" ER ">=20".
   */
  function fraTraerskler() {
    var haendt = false;
    var maal = location.hash ? location.hash.slice(1) : '';
    for (var i2 = 0; i2 < skalaer.length; i2++) {
      var s = skalaer[i2];
      var valgt = null;
      for (var j = 0; j < s.traerskler.length; j++) {
        var b = s.traerskler[j];
        if (!b.checked && b.id !== maal) continue;
        var v = parseFloat(b.value);
        if (isNaN(v)) continue;
        if (valgt === null) valgt = v;
        else valgt = s.retning === 'mindst' ? Math.min(valgt, v) : Math.max(valgt, v);
        b.checked = false;
        haendt = true;
      }
      if (valgt !== null) {
        s.greb.value = String(tilStilling(s, valgt));
        haendt = true;
      }
      tegnSkala(s);
    }
    return haendt;
  }

  /** Stiller én skala tilbage i hvile. */
  function nulstilSkala(s) {
    s.greb.value = String(s.retning === 'mindst' ? 0 : 100);
    tegnSkala(s);
  }

  /** Den aktuelle markering: afkrydsede felter PLUS det ene `:target`.
   *  `:target` skal med, fordi et filterlink (robotter/#f-anv-industri)
   *  saetter et filter UDEN at krydse noget af - CSS'en laeser begge, og en
   *  taelling, der kun laeste afkrydsningerne, ville vaere uenig med det, der
   *  faktisk staar paa skaermen. */
  function markering() {
    var m = {};
    for (var a = 0; a < FACETTER.length; a++) m[FACETTER[a]] = [];
    for (var b = 0; b < bokse.length; b++) {
      if (bokse[b].checked && m[bokse[b].name]) m[bokse[b].name].push(bokse[b].value);
    }
    var h = location.hash ? location.hash.slice(1) : '';
    if (h) {
      var e = document.getElementById(h);
      if (e && e.type === 'checkbox' && m[e.name] && m[e.name].indexOf(e.value) === -1) {
        m[e.name].push(e.value);
      }
    }
    return m;
  }

  /** Filtrerer laeseren i forhold til STANDARDTILSTANDEN?
   *  Status er krydset af i hvile (L56 punkt 5: udgaaede skjult), saa "er der
   *  markeret noget" er ikke det samme som "har laeseren filtreret". Uden den
   *  skelnen ville nul-tilstandens filterbegrundelse vaere sand fra start. */
  function nogenMarkering(m) {
    for (var b = 0; b < bokse.length; b++) {
      if (bokse[b].checked !== bokse[b].defaultChecked) return true;
    }
    // En skala ude af hvile ER en filtrering, selvom den ikke saetter et
    // afkrydsningsfelt. Uden dette led ville en tom side efter et
    // skalatraek faa soegningens forklaring ("ingen robotter matcher
    // soegningen") i stedet for filterets - fejl nr. 9's slaegtning.
    for (var s2 = 0; s2 < skalaer.length; s2++) {
      if (skalaAktiv(skalaer[s2])) return true;
    }
    var h = location.hash ? location.hash.slice(1) : '';
    if (h) {
      var e = document.getElementById(h);
      if (e && e.type === 'checkbox') return true;
    }
    return false;
  }

  /** Passer posten paa markeringen? `spring` udelader ÉN facet, saa den samme
   *  funktion kan svare paa baade "vises den nu?" og "hvad ville denne facet
   *  give?".
   *
   *  OG_FACET kraever ALLE de markerede vaerdier; alle andre facetter kraever
   *  MINDST ÉN. Det er den samme forskel, CSS'en har mellem sine to slags
   *  regler. */
  function passer(post, m, spring) {
    for (var f in m) {
      if (f === spring || !m[f].length) continue;
      // Skalaernes facetter haandteres af skalaPasser(), ikke her. Baade
      // traersklerne (som er ryddet af fraTraerskler) og "ikke oplyst"-raekken
      // hoerer til skalaen, naar JavaScript koerer - og en dobbelt
      // haandhaevelse ville filtrere med to graenser paa én gang.
      if (erSkala(f)) continue;
      var mine = post.v[f] || [];
      var j;
      if (f === OG_FACET) {
        for (j = 0; j < m[f].length; j++) {
          if (mine.indexOf(m[f][j]) === -1) return false;
        }
      } else {
        var traf = false;
        for (j = 0; j < m[f].length; j++) {
          if (mine.indexOf(m[f][j]) !== -1) { traf = true; break; }
        }
        if (!traf) return false;
      }
    }
    return true;
  }

  /** "{n} robotter" / "1 robot" fra sprogfilernes egne former. Ordene ejes af
   *  data/i18n, ikke af denne fil - den kopierer dem aldrig. */
  function boej(vaert, n) {
    return n === 1
      ? (vaert.getAttribute('data-antal-en') || String(n))
      : (vaert.getAttribute('data-antal-flere') || '{n}').replace('{n}', String(n));
  }

  function opdater() {
    var q = input.value.trim().toLowerCase();
    var m = markering();
    var filtrerer = nogenMarkering(m);
    var a;

    /* 1. Soegningen OG skalaerne - de to filtreringer, JavaScript selv
       udfoerer. Her stod foer "den ENESTE filtrering"; skalaerne kom til
       1. sep 2026 (L65c/L66) og er den anden - men de er den anden paa en
       maade, der ikke bryder loeftet: de har hver deres CSS-baarne
       traerskeludgave, som staar tilbage uden JavaScript. Listefacetterne
       haandteres stadig af CSS alene og skal blive ved med det.

       ÉT sted saettes `hidden`, og det er det yderste lag. To mekanismer, der
       hver satte og fjernede attributten, ville slukke hinandens resultat i
       den raekkefoelge, de tilfaeldigvis koerte i. */
    for (a = 0; a < poster.length; a++) {
      var pa = poster[a];
      if (!pa.ydre) continue;
      var vis = (!q || (pa.sog || '').indexOf(q) !== -1) && skalaerPasser(pa, '');
      if (vis) pa.ydre.removeAttribute('hidden');
      else pa.ydre.setAttribute('hidden', '');
    }

    /* 2. MAAL, hvad der staar paa skaermen. Bevidst en maaling og ikke en
       udregning: CSS ejer facetfiltreringen, og et JavaScript, der regnede
       den efter, ville vaere en ANDEN kilde til samme sandhed - to, der kan
       blive uenige. getClientRects() spoerger layoutet, ikke reglerne. */
    var synligeIalt = 0;
    for (a = 0; a < poster.length; a++) {
      if (poster[a].el.getClientRects().length === 0) continue;
      synligeIalt++;
    }

    /* 3. Strimlens taeller og resultatets overskrift. De to er sidens eneste
       "hvor mange ser jeg nu"-tal, og de skal aldrig kunne staa forskelligt. */
    if (hovedTaeller) hovedTaeller.textContent = String(synligeIalt);
    if (resultatTitel) {
      var rt = resultatTitel.querySelector('.antal__tal');
      if (rt) rt.textContent = boej(resultatTitel, synligeIalt);
    }

    /* 4. Facetternes taellere. Kontrakten er "saa mange ville staa her, hvis
       DENNE vaerdi (ogsaa) var valgt" - de oevrige facetters markering holdt
       fast. Det er den taelling, der forhindrer en blindgyde: staar der 0,
       skal laeseren kunne se det FOER klikket, ikke bagefter paa en tom side.
       Derfor `passer(..., spring: facetten selv)` og ikke en optaelling af de
       kort, der staar paa skaermen nu - de to er forskellige, saa snart
       facetten selv er i brug.

       OG_FACET springes IKKE over paa samme maade: dens chips indsnaevrer
       hinanden, saa "hvis ogsaa denne" betyder "oven i de oevrige chips". */
    for (a = 0; a < bokse.length; a++) {
      var boks = bokse[a];
      var antal = 0;
      for (var y = 0; y < poster.length; y++) {
        var po = poster[y];
        if (q && (po.sog || '').indexOf(q) === -1) continue;
        if ((po.v[boks.name] || []).indexOf(boks.value) === -1) continue;
        if (!passer(po, m, boks.name === OG_FACET ? '' : boks.name)) continue;
        // Skalaerne holdes fast, praecis som de oevrige facetters markering -
        // undtagen den skala, boksen selv hoerer til. Uden det led ville
        // "ikke oplyst"-raekkens tal vaere regnet under en skala, der netop
        // udelukker de robotter, raekken handler om, og altid staa 0.
        if (!skalaerPasser(po, erSkala(boks.name) ? boks.name : '')) continue;
        antal++;
      }
      var etiket = boks.nextElementSibling;
      var felt = etiket ? etiket.querySelector('.antal__tal') : null;
      if (felt) felt.textContent = String(antal);
      if (etiket) etiket.classList.toggle('facet-tom', antal === 0);
    }

    /* 4b. Filtergruppernes eksakte "N valgt" (punkt 4) - se facetgruppeAntal()
       for begrundelsen. Kaldes hver gang, ligesom §4 ovenfor: en gruppes
       markering kan aendre sig ved ethvert klik, ikke kun ved klik i den
       gruppe selv (nulstil, et filterlink, tilbage-navigation). */
    facetgruppeAntal();

    /* 5. Nul-tilstanden. Uden JavaScript kan den ikke naas fra filtrene -
       CSS kan ikke taelle - og det var fejl nr. 9 i kritikken: den ene
       fejltilstand, siden HAR, var uopnaaelig fra den betjening, der oftest
       udloeser den. */
    if (tomt) {
      tomt.hidden = synligeIalt !== 0;
      if (tomtSoeg) tomtSoeg.hidden = filtrerer;
      if (tomtFilter) tomtFilter.hidden = !filtrerer;
    }
  }

  /* Flaget, der slukker de statiske forbehold i CSS. Saettes FOER foerste
     opdater(), saa "af 77" aldrig naar at staa ved siden af et tal, der
     allerede er regnet om. */
  form.setAttribute('data-levende', '');

  /* SKALAERNE TAENDES HER, og raekkefoelgen er ikke ligegyldig.
     `data-levende` ovenfor slukker baade trinlisten og de to facetters
     CSS-regler i samme oejeblik; foerst DEREFTER maa skalaen vise sig. Sattes
     den frem foerst, ville der vaere et hak, hvor begge oploesninger stod og
     kunne betjenes, og et klik i det hak ville filtrere to gange. */
  for (i = 0; i < skalaer.length; i++) {
    skalaer[i].rod.removeAttribute('hidden');
  }
  /* En allerede valgt traerskel loeftes ind i skalaen (se fraTraerskler).
     Kaldet tegner ogsaa alle skalaer foerste gang. */
  fraTraerskler();

  for (i = 0; i < skalaer.length; i++) {
    (function (s) {
      s.greb.addEventListener('input', function () { tegnSkala(s); opdater(); });
      // `change` fyrer ogsaa efter tastaturbetjening i browsere, hvor `input`
      // ikke goer. Dobbelt tegning er gratis; en manglende er en doed pil.
      s.greb.addEventListener('change', function () { tegnSkala(s); opdater(); });
      var kryds = form.querySelector('[data-valg-skala-ryd="' + s.navn + '"]');
      if (kryds) {
        kryds.addEventListener('click', function () { nulstilSkala(s); opdater(); });
      }
    }(skalaer[i]));
  }

  input.addEventListener('input', opdater);
  for (i = 0; i < bokse.length; i++) bokse[i].addEventListener('change', opdater);
  window.addEventListener('hashchange', function () { fraTraerskler(); opdater(); });

  /* NULSTIL er en <button type="reset">, saa den virker UDEN JavaScript: den
     stiller formularen tilbage til dens `checked`-attributter, altsaa til
     L56's standardtilstand. Browseren nulstiller FOERST efter haendelsen, saa
     opdateringen maa vente et hak - ellers taeller vi den gamle tilstand.

     Skalaerne foelger med af sig selv: browserens egen nulstilling saetter
     <input type=range> tilbage til sin `value`-ATTRIBUT, og den er skrevet i
     hvilestillingen. Vi skal derfor kun tegne dem om bagefter, ikke flytte
     dem - én kilde til hvad "nulstillet" betyder. */
  form.addEventListener('reset', function () {
    setTimeout(function () {
      for (var s2 = 0; s2 < skalaer.length; s2++) tegnSkala(skalaer[s2]);
      opdater();
    }, 0);
  });

  /* "Vis alle igen" i nul-tilstanden rydder ALT, ogsaa status-standarden og
     begge skalaer: staar man i en blindgyde, skal vejen ud vise hele
     kataloget. En skala, der blev staaende her, ville vaere netop den
     blindgyde, knappen findes for at komme ud af. */
  var ryd = document.querySelectorAll('[data-ryd]');
  for (i = 0; i < ryd.length; i++) {
    ryd[i].addEventListener('click', function () {
      for (var b = 0; b < bokse.length; b++) bokse[b].checked = false;
      for (var s2 = 0; s2 < skalaer.length; s2++) nulstilSkala(skalaer[s2]);
      input.value = '';
      opdater();
    });
  }

  var fra = /[?&]s=([^&]*)/.exec(window.location.search);
  if (fra) input.value = decodeURIComponent(fra[1].replace(/\+/g, ' '));

  /* FOERSTE OPDATERING KOERER TO GANGE, OG DEN ANDEN ER DEN, DER TAELLER.
     Maalt 28. aug 2026 paa /da/robotter/#f-land-tyskland, 1440 px, ved at
     hooke readystatechange/DOMContentLoaded/load ind FOER sidens egne
     scripts:

       readyState "interactive"   77 af 77 kort synlige, :target = INGEN
       DOMContentLoaded           77 af 77 kort synlige, :target = INGEN
       readyState "complete"       1 af 77 kort synlige, :target = f-land-tyskland
       load                        1 af 77 kort synlige, :target = f-land-tyskland

     Browseren udpeger altsaa foerst dokumentets maalelement - det, `:target`
     haenger paa - ved "complete". Denne fil indlaeses med `defer` og koerer
     derfor FOER da. Trin 2 maaler geometrien, og en maaling taget dér ser en
     UFILTRERET side. Fejlen var lydloes og lignede "JavaScript koerte ikke".

     Det foerste kald bliver staaende: det taender soegningen fra ?s= og
     rydder op i tilstande uden `:target`, hvor maalingen ER gyldig med det
     samme. */
  opdater();
  if (document.readyState === 'complete') opdater();
  else window.addEventListener('load', opdater);
}());
