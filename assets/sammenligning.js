/* sammenligning.js — vaelger + felt-for-felt-tabel til /sammenligning/.
   FORBEDRER kun: uden JS staar tegnforklaringen og en flad robotliste med
   links (server-renderet i tools/skabelon/sammenligning.mjs). Med JS
   erstattes den flade liste af en vaelger (afkrydsningsfelter, samme
   .filtre-sprog som katalogets facetter) og en dynamisk felt-for-felt-
   tabel - samme "skjult, indtil JS taender det"-idiom som katalog.js'
   soegefelt.

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

  /* Kildemaerket (spor/sammenlign, punkt 2 - Å38's krydskontrolfund): samme
     markup, samme klasse (kildemaerke/kildemaerke--sek), samme title-tekster
     som side.mjs' egen kildemaerke() bygger server-side for de andre flader -
     genbrugt form, ikke en ny. `f.k` (bogstavet) og `f.sek` (sekundaer-flaget)
     er sat pr. felt af sammenligning.mjs' dataBlok(); `r.href` er robottens
     egen side, sat ÉN gang pr. robot (ikke gentaget pr. felt, jf. punkt 3).
     ANKERET (fælden, spor/proveniens naesten faldt i 27. aug 2026): kildelisten
     staar IKKE paa denne side, saa href er `r.href + '#kilde-' + f.k` -
     robottens egen #kilde-<bogstav>, aldrig et bart `#kilde-A` her. */
  function kildeMaerkeHTML(r, f) {
    if (!r || !f || !f.k) return '';
    var sek = f.sek ? ' kildemaerke--sek' : '';
    var titel = f.sek ? DATA.tekst.kilde_sekundaer_forklaring : DATA.tekst.kilde_primaer;
    return '<a class="kildemaerke' + sek + '" href="' + esc(r.href) + '#kilde-' + esc(f.k) + '"'
      + ' tabindex="-1" title="' + esc(titel) + '">' + esc(f.k) + '</a>';
  }

  /* Talvaerdien: operator (set OG hoert - regel 4), figur, enhed, og et
     samlet forbeholdstegn af ved_last + advarsel (samme sammenlaegning som
     side.mjs' tal() bruger til den kompakte visning, som mockuppens egen
     sammenligningstabel ogsaa bruger - se sammenligning.mjs' filhoved). */
  function renderTal(f, r) {
    var figur = (f.min !== null && f.min !== undefined)
      ? fmt(f.min) + '–' + fmt(f.maks)
      : (typeof f.vaerdi === 'number' ? fmt(f.vaerdi) : String(f.vaerdi));
    var op = '';
    if (f.operator && DATA.operatorer[f.operator]) {
      var o = DATA.operatorer[f.operator];
      op = '<span class="op" aria-hidden="true">' + esc(o.vis) + '</span>'
        + '<span class="kunskaerm">' + esc(o.laest) + ' </span>';
    }
    var enhed = f.enhed ? '<span class="enhed">' + esc(f.enhed) + '</span>' : '';
    var noter = [];
    if (f.ved_last) {
      if (f.ved_last.ukendt) noter.push(DATA.tekst.ved_last_ukendt);
      else noter.push((DATA.tekst.ved_last + ' ' + fmt(f.ved_last.vaerdi) + ' ' + (f.ved_last.enhed || '')).trim());
    }
    if (f.forbehold) noter.push(f.forbehold);
    var noteHTML = noter.length ? fnote(noter.join(' · ')) : '';
    var klasse = 'v v-tal' + (f.tilstand === 'nul' ? ' v-nul' : '');
    // Kildemaerket SKAL staa som direkte barn af .v-tal (system.css'
    // ".v-tal > .kildemaerke{align-self:flex-start}") - derfor inde i spannet,
    // foer det lukker, samme placering som side.mjs' egen tal()-funktion
    // bruger server-side (krop += kildemaerke(...) foer </span>).
    var vaerdiHTML = '<span class="' + klasse + '">' + op + '<b class="num">' + esc(figur) + '</b>' + enhed
      + kildeMaerkeHTML(r, f) + '</span>';
    // spor/enheder (K9) omregner visse felter til sidens faelles enhed;
    // `f.kildeform` (sat i sammenligning.mjs' dataBlok()) er producentens
    // egen figur+enhed. Samme title, samme i18n-noegle, samme placering
    // (uden om et eventuelt forbeholdstegn) som robot.mjs allerede bruger -
    // genbrugt moenster, ikke et nyt, se robot.mjs's kommentar ved
    // "original-enhed".
    if (f.kildeform) {
      var titel = String(DATA.tekst.kilde_original_form || '').replace('{figur}', f.kildeform);
      vaerdiHTML = '<span class="original-enhed" title="' + esc(titel) + '">' + vaerdiHTML + '</span>';
    }
    return vaerdiHTML + noteHTML;
  }

  /* Ét felt, de samme fire datatilstande som resten af sitet
     (system.css §8) - kun bygget her af JS i stedet for af side.mjs' egne
     tal()/tilstand(). Se tools/skabelon/sammenligning.mjs' feltVisning(). */
  function renderFelt(f, r) {
    if (!f) f = { tilstand: 'ikke_oplyst' };
    var forbeholdHTML = f.forbehold ? fnote(f.forbehold) : '';
    var kildeHTML = kildeMaerkeHTML(r, f);
    switch (f.tilstand) {
      case 'nej':
        return '<span class="v v-nej"><i class="mrk"></i>' + esc(DATA.tekst.nej) + kildeHTML + '</span>' + forbeholdHTML;
      case 'ja':
        return '<span class="v v-ja"><i class="mrk"></i>' + esc(DATA.tekst.ja) + kildeHTML + '</span>' + forbeholdHTML;
      case 'kun_billede':
        return '<span class="v v-billede"><i class="mrk"></i><span class="ord">' + esc(DATA.tekst.kun_billede) + '</span>' + kildeHTML + '</span>' + forbeholdHTML;
      case 'tekst': {
        var ud = '<span class="v v-tekst">' + esc(f.tekst) + kildeHTML + '</span>';
        if (f.min !== null && f.min !== undefined) {
          ud += ' ' + renderTal({ tilstand: 'tal', vaerdi: null, min: f.min, maks: f.maks, enhed: f.enhed, operator: null });
        }
        return ud + forbeholdHTML;
      }
      case 'tal':
      case 'nul':
        return renderTal(f, r);
      case 'ikke_oplyst':
      default:
        return '<span class="v v-ikke"><i class="mrk"></i>' + esc(DATA.tekst.ikke_oplyst) + kildeHTML + '</span>' + forbeholdHTML;
    }
  }

  /* Specimen-raekken: signaturelementet mockuppen viser oeverst (de valgte
     robotter side om side, foer laeseren ser et eneste tal). Fotografiet er
     UDELADT her (dokumenteret afvigelse, fund/FUND-lysbyg.md) - at indlejre
     alle 62 robotters billedmarkup (picture/source/alt/delt-maerke) i den
     samme JSON-blok var uforholdsmaessigt for et JS-lag, der kun forbedrer
     en side, som allerede virker uden det. */
  function specimenHTML(slugs, n) {
    var celler = slugs.map(function (slug) {
      var r = robotAf(slug);
      if (!r) return '<div></div>';
      return '<div class="specimen">'
        + '<div class="specimen__label"><span class="specimen__navn">' + esc(r.navn) + '</span>'
        + '<span class="specimen__taethed figur">' + esc(taethedTekst(r.taethedAntal)) + '</span></div>'
        + '<p class="specimen__meta">' + esc(r.producent) + '</p>'
        + '</div>';
    }).join('');
    return '<div class="specimen-hoved" style="--n:' + n + '"><div aria-hidden="true"></div>' + celler + '</div>';
  }

  function tabelHTML(slugs) {
    var n = slugs.length;
    var robotter = slugs.map(robotAf).filter(Boolean);
    var grupperHTML = DATA.grupper.map(function (g) {
      var raekker = g.felter.map(function (feltNavn) {
        // data-robot: navnet, en smal skaerm viser som cellens eget mikro-
        // maerke (CSS ::before), fordi kolonneoverskriften (specimen-raekken)
        // er langt vaek, naar tabellen staar i én spalte pr. robot.
        var celler = robotter.map(function (r) {
          return '<div class="saml-raekke__celle" data-robot="' + esc(r.navn) + '">' + renderFelt(r.felter[feltNavn], r) + '</div>';
        }).join('');
        return '<div class="saml-raekke" style="--n:' + n + '">'
          + '<div class="saml-raekke__navn">' + esc(DATA.feltNavne[feltNavn]) + '</div>' + celler + '</div>';
      }).join('');
      return '<div class="saml-gruppe" style="--n:' + n + '">'
        + '<p class="saml-gruppe__titel">' + esc(g.titel) + '</p>' + raekker + '</div>';
    }).join('');
    return specimenHTML(slugs, n) + '<div class="saml-tabel">' + grupperHTML + '</div>';
  }

  var vaelger = app.querySelector('[data-saml-vaelger]');
  var status = app.querySelector('[data-saml-status]');
  var resultat = app.querySelector('[data-saml-resultat]');
  if (!vaelger || !status || !resultat) return;
  var checkboxes = Array.prototype.slice.call(vaelger.querySelectorAll('input[type=checkbox]'));

  function valgte() {
    return checkboxes.filter(function (c) { return c.checked; }).map(function (c) { return c.value; });
  }

  function visStatus(tekst) {
    status.hidden = false;
    status.textContent = tekst;
  }
  function skjulStatus() {
    status.hidden = true;
    status.textContent = '';
  }

  function opdater() {
    var slugs = valgte();
    if (slugs.length < 2) {
      visStatus(DATA.tekst.for_faa);
      resultat.innerHTML = '';
      return;
    }
    skjulStatus();
    resultat.innerHTML = tabelHTML(slugs);
  }

  checkboxes.forEach(function (c) {
    c.addEventListener('change', function () {
      if (valgte().length > DATA.maksAntal) {
        c.checked = false;
        visStatus(DATA.tekst.maks);
        return;
      }
      opdater();
    });
  });

  /* Soegefeltet (punkt 3, spor/sammenlign): 77 chips uden soegning kraevede
     visuel skimning af alle for at finde én model. Genbruger katalogsidens
     moenster (assets/katalog.js' `soeg()`: lowercased substring-match paa et
     `data-sog`-maerket lag, `hidden`-attributten alene styrer synlighed) -
     tilpasset til denne sides ét-niveaus vaelger (ingen facetter at krydse,
     kun navn+producent pr. chip, sat af tools/skabelon/sammenligning.mjs'
     vaelgerHTML()). Ingen netvaerkskald, samme regel som resten af siden. */
  var soegInput = app.querySelector('#saml-soeg');
  var traeffere = Array.prototype.slice.call(vaelger.querySelectorAll('[data-sog]'));
  if (soegInput && traeffere.length) {
    soegInput.addEventListener('input', function () {
      var q = soegInput.value.trim().toLowerCase();
      traeffere.forEach(function (el) {
        var traf = !q || el.getAttribute('data-sog').indexOf(q) !== -1;
        el.hidden = !traf;
      });
    });
  }

  /* Samme betjeningsflade, to udtryksformer: JS erstatter den statiske
     fallback-liste med vaelgeren + tabellen i stedet for at vise begge. */
  var fallback = document.querySelector('[data-sammenligning-fallback-wrap]');
  if (fallback) fallback.hidden = true;
  app.hidden = false;

  opdater();
}());
