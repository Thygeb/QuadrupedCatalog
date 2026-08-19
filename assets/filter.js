/* filter.js — JavaScript maa KUN tilfoeje filtrering.
   Kataloget er allerede fuldt renderet i tabellen, naar denne fil koerer. Uden
   JS ser laeseren hele tabellen og ingen daade knapper: formularen staar med
   `hidden` i HTML'en, og det er denne fil, der fjerner den. Skulle filen fejle,
   bliver siden staaende som en komplet, statisk tabel.

   Hver filtertilstand faar sin egen URL (PLAN.md afsnit 6), saa en filtreret
   liste kan sendes videre. */
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
        return !v.value || r.dataset[v.dataset.filter] === v.value;
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
