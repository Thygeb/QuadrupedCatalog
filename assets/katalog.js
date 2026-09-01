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
        /* Taelleren FORSVINDER ved tomt udvalg i stedet for at staa og sige
           "0 valgt": et nul, ingen har valgt, er ikke en oplysning - det er
           stoej i en strimmel, der ellers kun viser aktive valg. */
        if (valgt.length) {
          samlTaeller.removeAttribute('hidden');
          samlTaeller.setAttribute('data-aktiv', '');
        } else {
          samlTaeller.setAttribute('hidden', '');
          samlTaeller.removeAttribute('data-aktiv');
        }
        if (samlTal) samlTal.textContent = String(valgt.length);
        if (samlOrd) samlOrd.textContent = samlSkabelon.replace('{n}', String(valgt.length));
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

  var lag = gitter.querySelectorAll('.lag[data-sog]');
  var tomt = document.querySelector('[data-tomt]');
  var tomtSoeg = document.querySelector('[data-tomt-grund="soeg"]');
  var tomtFilter = document.querySelector('[data-tomt-grund="filter"]');
  var bokse = form.querySelectorAll('.facetter__net input[type=checkbox]');
  var hovedTaeller = form.querySelector('.taeller__tal');
  var resultatTitel = form.querySelector('.resultat__titel');

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
    var post = { el: k, v: {}, sog: '' };
    var el = k.parentElement;
    while (el && el.classList && el.classList.contains('lag')) {
      for (var c = 0; c < el.classList.length; c++) {
        var navn = el.classList[c];
        if (navn.indexOf('lag-') !== 0) continue;
        var f = navn.slice(4);
        if (FACETTER.indexOf(f) === -1) FACETTER.push(f);
        post.v[f] = (el.getAttribute('data-' + f) || '').split(/\s+/).filter(Boolean);
      }
      if (el.hasAttribute('data-sog')) post.sog = el.getAttribute('data-sog') || '';
      el = el.parentElement;
    }
    poster.push(post);
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

    /* 1. Soegningen - den ENESTE filtrering, JavaScript selv udfoerer.
       Facetterne haandteres af CSS, og det skal de blive ved med: laa de her,
       ville de forsvinde, naar JavaScript ikke koerer. */
    for (a = 0; a < lag.length; a++) {
      if (!q || (lag[a].getAttribute('data-sog') || '').indexOf(q) !== -1) {
        lag[a].removeAttribute('hidden');
      } else lag[a].setAttribute('hidden', '');
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
        antal++;
      }
      var etiket = boks.nextElementSibling;
      var felt = etiket ? etiket.querySelector('.antal__tal') : null;
      if (felt) felt.textContent = String(antal);
      if (etiket) etiket.classList.toggle('facet-tom', antal === 0);
    }

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

  input.addEventListener('input', opdater);
  for (i = 0; i < bokse.length; i++) bokse[i].addEventListener('change', opdater);
  window.addEventListener('hashchange', opdater);

  /* NULSTIL er en <button type="reset">, saa den virker UDEN JavaScript: den
     stiller formularen tilbage til dens `checked`-attributter, altsaa til
     L56's standardtilstand. Browseren nulstiller FOERST efter haendelsen, saa
     opdateringen maa vente et hak - ellers taeller vi den gamle tilstand. */
  form.addEventListener('reset', function () { setTimeout(opdater, 0); });

  /* "Vis alle igen" i nul-tilstanden rydder ALT, ogsaa status-standarden:
     staar man i en blindgyde, skal vejen ud vise hele kataloget. */
  var ryd = document.querySelectorAll('[data-ryd]');
  for (i = 0; i < ryd.length; i++) {
    ryd[i].addEventListener('click', function () {
      for (var b = 0; b < bokse.length; b++) bokse[b].checked = false;
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
