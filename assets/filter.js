/* filter.js — IKKE LAESSET AF NOGEN SIDE (opdaget under spor/spaend, L50,
   27. aug 2026 - grep efter "filter.js" i hele tools/ og dist/ giver 0
   traeff, ingen skabelon skriver <script src="filter.js">). Filen antager
   en <table><tr>-struktur (#filter, .katalog tbody, tr) og <select>-vaerdier
   (v.value), som slet ikke findes i kataloget i dag - katalog.mjs blev
   ombygget 25. aug 2026 (spor/lysbyg) til kort/gitter/"sal"-markup, og
   filtreringen sker nu UDEN JavaScript, alene i CSS med :has() (se
   tools/skabelon/katalog.mjs' hovedStil()). katalog.js (som RENT FAKTISK
   indlæses) tilfoejer kun fritekstsoegning oveni - ikke selve filtreringen.

   Denne fil ser ud til at vaere en rest fra FOER 25. aug-ombygningen, som
   ikke blev slettet. Den er IKKE slettet her (uden for dette punkts
   bemyndigelse - se rapporten), men linje 39's strenge lighed er alligevel
   rettet til en medlemskabstest nedenfor, saa filen ikke laengere
   demonstrerer den forkerte regel, hvis den nogensinde genoplives eller
   bruges som skabelon andetsteds. L50 kraever, at en robot med FLERE
   vaerdier i sit data-attribut (mellemrumsadskilt, samme form som
   katalog.mjs allerede skriver) matcher paa ETHVERT af dem - ikke kun ved
   fuld strengelighed. */
(function () {
  'use strict';
  var form = document.getElementById('filter');
  var tabel = document.querySelector('.katalog tbody');
  if (!form || !tabel) return;

  var raekker = Array.prototype.slice.call(tabel.querySelectorAll('tr'));
  var vaelgere = Array.prototype.slice.call(form.querySelectorAll('[data-filter]'));
  var tom = document.getElementById('filter-tom');
  form.hidden = false;

  function fraUrl() {
    var p = new URLSearchParams(location.search);
    vaelgere.forEach(function (v) {
      var vaerdi = p.get(v.dataset.filter);
      if (vaerdi !== null) v.value = vaerdi;
    });
  }

  function tilUrl() {
    var p = new URLSearchParams();
    vaelgere.forEach(function (v) { if (v.value) p.set(v.dataset.filter, v.value); });
    var q = p.toString();
    history.replaceState(null, '', q ? location.pathname + '?' + q : location.pathname);
  }

  function anvend() {
    var synlige = 0;
    raekker.forEach(function (r) {
      var vis = vaelgere.every(function (v) {
        // L50: en medlemskabstest, ikke streng lighed - et data-attribut kan
        // baere flere mellemrumsadskilte vaerdier (fx en vaegtklasse-robot,
        // hvis spaend daekker flere klasser), og skal matche saa snart
        // filtervaerdien er ÉT af dem.
        if (!v.value) return true;
        var vaerdi = r.dataset[v.dataset.filter] || '';
        return vaerdi.split(/\s+/).indexOf(v.value) !== -1;
      });
      r.hidden = !vis;
      if (vis) synlige++;
    });
    if (tom) tom.hidden = synlige !== 0;
    tilUrl();
  }

  vaelgere.forEach(function (v) { v.addEventListener('change', anvend); });
  var ryd = document.getElementById('ryd');
  if (ryd) ryd.addEventListener('click', function () {
    vaelgere.forEach(function (v) { v.value = ''; });
    anvend();
  });

  fraUrl();
  anvend();
})();
