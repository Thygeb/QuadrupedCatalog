/* katalog.js — soegning. FORBEDRER kun.
 *
 * Filtrene virker uden JavaScript (CSS, :has() og afkrydsningsfelter). Den
 * eneste ting, der ikke kan skrives i CSS, er fritekstsoegning, og derfor er
 * soegefeltet skjult i HTML og taendes herfra: et felt, der intet goer, er en
 * betjeningsflade uden funktion.
 *
 * Ingen cookies, ingen netvaerkskald, ingen tredjepart.
 */
(function () {
  'use strict';

  var felter = document.querySelectorAll('[data-sog="katalog"],[data-sog="forside"]');
  for (var i = 0; i < felter.length; i++) felter[i].removeAttribute('hidden');

  var gitter = document.getElementById('alle');
  var input = document.getElementById('sog-katalog');
  if (!gitter || !input) return;

  var lag = gitter.querySelectorAll('.lag[data-sog]');
  var tomt = document.querySelector('[data-tomt]');
  var form = document.getElementById('styr');

  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });

  function soeg() {
    var q = input.value.trim().toLowerCase();
    var synlige = 0;
    for (var i = 0; i < lag.length; i++) {
      var traf = !q || lag[i].getAttribute('data-sog').indexOf(q) !== -1;
      if (traf) { lag[i].removeAttribute('hidden'); synlige++; }
      else lag[i].setAttribute('hidden', '');
    }
    if (tomt) {
      if (synlige === 0) tomt.removeAttribute('hidden');
      else tomt.setAttribute('hidden', '');
    }
  }
  input.addEventListener('input', soeg);

  // "Vis alle igen" rydder ogsaa afkrydsningerne. Uden JavaScript rydder
  // linket kun :target, og afkrydsningerne fjernes ved at klikke dem af.
  var ryd = document.querySelector('.facet-ryd a');
  if (ryd) {
    ryd.addEventListener('click', function () {
      var bokse = form ? form.querySelectorAll('input[type=checkbox]') : [];
      for (var i = 0; i < bokse.length; i++) bokse[i].checked = false;
      input.value = '';
      soeg();
    });
  }

  // Forsidens soegefelt fører til kataloget og fylder feltet der ud.
  var forside = document.querySelector('form[data-sog="forside"]');
  if (forside) {
    forside.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = forside.querySelector('input').value.trim();
      window.location.href = 'robotter/' + (v ? '?s=' + encodeURIComponent(v) : '');
    });
  }
  var fra = /[?&]s=([^&]*)/.exec(window.location.search);
  if (fra) { input.value = decodeURIComponent(fra[1].replace(/\+/g, ' ')); soeg(); }
}());
