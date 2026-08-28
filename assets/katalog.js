/* katalog.js — soegning OG levende taellinger. FORBEDRER kun.
 *
 * ARBEJDSDELINGEN, som er hele pointen (P0, 28. aug 2026):
 *
 *   UDEN JavaScript er siden SAND, men statisk. Filtrene virker (CSS,
 *   :has() og afkrydsningsfelter), tomme sale skjules saa langt som én
 *   facet kan bevise dem tomme (de genererede regler i katalog.mjs'
 *   hovedStil), og hver taeller siger selv, at den taeller hele kataloget
 *   ("18 af 77", "18 robotter i kataloget"). Intet tal paastaar at beskrive
 *   det viste udvalg.
 *
 *   MED JavaScript bliver den PRAECIS. Taellerne regnes om ved hvert klik,
 *   enhver tom sal skjules - ogsaa den, ingen enkelt facet kan bevise tom -
 *   og en kombination uden traef faar en forklaring i stedet for en tom
 *   side. Forbeholdene forsvinder samtidig, fordi de er blevet usande:
 *   `data-levende` paa formularen slukker dem i CSS.
 *
 * Det er den raekkefoelge, loeftet i sidefoden kraever. JavaScript maa
 * forbedre sandheden; den maa aldrig vaere forudsaetningen for den.
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

  var gitter = document.getElementById('alle');
  var input = document.getElementById('sog-katalog');
  var form = document.getElementById('styr');
  if (!gitter || !input || !form) return;

  var lag = gitter.querySelectorAll('.lag[data-sog]');
  var tomt = document.querySelector('[data-tomt]');
  var tomtSoeg = document.querySelector('[data-tomt-grund="soeg"]');
  var tomtFilter = document.querySelector('[data-tomt-grund="filter"]');
  var bokse = form.querySelectorAll('.filtre input[type=checkbox]');
  var salDele = form.querySelectorAll('[data-sal]');
  var salTaellere = form.querySelectorAll('.sal__antal');
  var tommelTaellere = form.querySelectorAll('.tommelindeks__liste [data-sal] .antal__tal');

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
    var post = { el: k, v: {}, sog: '', sal: '' };
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
    var g = k.closest('.gitter');
    post.sal = g ? (g.getAttribute('data-sal') || '') : '';
    poster.push(post);
  }

  /** Den aktuelle markering: afkrydsede felter PLUS det ene `:target`.
   *  `:target` skal med, fordi forsidens filterlinks (robotter/#f-anv-industri)
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

  function nogenMarkering(m) {
    for (var f in m) if (m[f].length) return true;
    return false;
  }

  /** Passer posten paa markeringen? `spring` udelader ÉN facet, saa den samme
   *  funktion kan svare paa baade "vises den nu?" og "hvad ville denne facet
   *  give?". */
  function passer(post, m, spring) {
    for (var f in m) {
      if (f === spring || !m[f].length) continue;
      var mine = post.v[f] || [];
      var traf = false;
      for (var j = 0; j < m[f].length; j++) {
        if (mine.indexOf(m[f][j]) !== -1) { traf = true; break; }
      }
      if (!traf) return false;
    }
    return true;
  }

  function opdater() {
    var q = input.value.trim().toLowerCase();
    var m = markering();
    var filtrerer = nogenMarkering(m);
    var a;

    /* 1. Fjern vores EGNE skjul foerst. Maalingen i trin 3 laeser den
       faktiske geometri, og en sal, vi selv skjulte sidste gang, ville ellers
       maale 0 kort og blive skjult for evigt. */
    for (a = 0; a < salDele.length; a++) salDele[a].hidden = false;

    /* 2. Soegningen - den ENESTE filtrering, JavaScript selv udfoerer.
       Facetterne haandteres af CSS, og det skal de blive ved med: laa de her,
       ville de forsvinde, naar JavaScript ikke koerer. */
    for (a = 0; a < lag.length; a++) {
      if (!q || (lag[a].getAttribute('data-sog') || '').indexOf(q) !== -1) {
        lag[a].removeAttribute('hidden');
      } else lag[a].setAttribute('hidden', '');
    }

    /* 3. MAAL, hvad der staar paa skaermen. Bevidst en maaling og ikke en
       udregning: CSS ejer facetfiltreringen, og et JavaScript, der regnede
       den efter, ville vaere en ANDEN kilde til samme sandhed - to, der kan
       blive uenige. getClientRects() spoerger layoutet, ikke reglerne. */
    var synligeIalt = 0;
    var perSal = {};
    for (a = 0; a < poster.length; a++) {
      if (poster[a].el.getClientRects().length === 0) continue;
      synligeIalt++;
      perSal[poster[a].sal] = (perSal[poster[a].sal] || 0) + 1;
    }

    /* 4. Salenes taellinger og de tomme sales forsvinden. `[data-sal]` daekker
       alle fire dele: indeksposten, hovedet, forklaringen og gitteret. */
    for (a = 0; a < salTaellere.length; a++) {
      var blok = salTaellere[a].closest('[data-sal]');
      var n = perSal[blok ? blok.getAttribute('data-sal') : ''] || 0;
      var tal = salTaellere[a].querySelector('.antal__tal');
      if (tal) {
        tal.textContent = n === 1
          ? (salTaellere[a].getAttribute('data-antal-en') || String(n))
          : (salTaellere[a].getAttribute('data-antal-flere') || '{n}').replace('{n}', String(n));
      }
    }
    for (a = 0; a < tommelTaellere.length; a++) {
      var li = tommelTaellere[a].closest('[data-sal]');
      tommelTaellere[a].textContent = String(perSal[li ? li.getAttribute('data-sal') : ''] || 0);
    }
    for (a = 0; a < salDele.length; a++) {
      salDele[a].hidden = !(perSal[salDele[a].getAttribute('data-sal')] || 0);
    }

    /* 5. Facetternes taellere. Kontrakten er "saa mange ville staa her, hvis
       DENNE vaerdi (ogsaa) var valgt" - de oevrige facetters markering holdt
       fast. Det er den taelling, der forhindrer en blindgyde: staar der 0,
       skal laeseren kunne se det FOER klikket, ikke bagefter paa en tom side.
       Derfor `passer(..., spring: facetten selv)` og ikke en optaelling af de
       kort, der staar paa skaermen nu - de to er forskellige, saa snart
       facetten selv er i brug, fordi flere krydser i samme gruppe UDVIDER
       udvalget i stedet for at indsnaevre det. */
    for (a = 0; a < bokse.length; a++) {
      var boks = bokse[a];
      var antal = 0;
      for (var y = 0; y < poster.length; y++) {
        var po = poster[y];
        if (q && (po.sog || '').indexOf(q) === -1) continue;
        if ((po.v[boks.name] || []).indexOf(boks.value) === -1) continue;
        if (!passer(po, m, boks.name)) continue;
        antal++;
      }
      var etiket = boks.nextElementSibling;
      var felt = etiket ? etiket.querySelector('.antal__tal') : null;
      if (felt) felt.textContent = String(antal);
      if (etiket) etiket.classList.toggle('facet-tom', antal === 0);
    }

    /* 6. Nul-tilstanden. Uden JavaScript kan den ikke naas fra filtrene -
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
     opdater(), saa "18 af 77" aldrig naar at staa ved siden af et tal, der
     allerede er regnet om. */
  form.setAttribute('data-levende', '');

  input.addEventListener('input', opdater);
  for (i = 0; i < bokse.length; i++) bokse[i].addEventListener('change', opdater);
  window.addEventListener('hashchange', opdater);

  /* "Vis alle igen" rydder ogsaa afkrydsningerne og soegefeltet. Uden
     JavaScript rydder linket kun :target, og afkrydsningerne fjernes ved at
     klikke dem af. Begge forekomster bindes - den i filterpanelet og den i
     nul-tilstanden. */
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
     derfor FOER da. Trin 3 maaler geometrien, og en maaling taget dér ser en
     UFILTRERET side: alle 77 kort staar. Taellerne blev saa sat til
     18/19/29/11, hvilket er praecis de tal, de i forvejen stod paa - saa
     fejlen var lydloes og lignede "JavaScript koerte ikke".

     Bemaerk hvad det IKKE var: alle tre stilark var indlaest, og `.lag` stod
     allerede paa display:contents ved "interactive". Det var ikke CSS, der
     manglede - det var maalelementet.

     Det foerste kald bliver staaende: det taender soegningen fra ?s= og
     rydder op i tilstande uden `:target`, hvor maalingen ER gyldig med det
     samme. */
  opdater();
  if (document.readyState === 'complete') opdater();
  else window.addEventListener('load', opdater);
}());
