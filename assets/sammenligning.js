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

  /* Talvaerdien: operator (set OG hoert - regel 4), figur, enhed, og et
     samlet forbeholdstegn af ved_last + advarsel (samme sammenlaegning som
     side.mjs' tal() bruger til den kompakte visning, som mockuppens egen
     sammenligningstabel ogsaa bruger - se sammenligning.mjs' filhoved). */
  function renderTal(f) {
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
    var vaerdiHTML = '<span class="' + klasse + '">' + op + '<b class="num">' + esc(figur) + '</b>' + enhed + '</span>';
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
          ud += ' ' + renderTal({ tilstand: 'tal', vaerdi: null, min: f.min, maks: f.maks, enhed: f.enhed, operator: null });
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
  function specimenHoved(robotter, n) {
    var celler = robotter.map(function (r) {
      return '<th scope="col" role="columnheader" class="specimen">'
        + '<div class="specimen__label"><span class="specimen__navn">' + esc(r.navn) + '</span>'
        + '<span class="specimen__taethed figur">' + esc(taethedTekst(r.taethedAntal)) + '</span></div>'
        + '<p class="specimen__meta">' + esc(r.producent) + '</p>'
        + '</th>';
    }).join('');
    return '<thead class="specimen-hoved" role="rowgroup" style="--n:' + n + '">'
      + '<tr class="specimen-hoved__raekke" role="row">'
      + '<td class="specimen-hoved__hjoerne" role="cell"></td>' + celler
      + '</tr></thead>';
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
        var celler = robotter.map(function (r) {
          return '<td class="saml-raekke__celle" role="cell" data-robot="' + esc(r.navn) + '">'
            + renderFelt(r.felter[feltNavn]) + '</td>';
        }).join('');
        return '<tr class="saml-raekke" role="row" style="--n:' + n + '">'
          + '<th scope="row" role="rowheader" class="saml-raekke__navn">'
          + esc(DATA.feltNavne[feltNavn]) + '</th>' + celler + '</tr>';
      }).join('');
      // Én <tbody> pr. gruppe. Gruppetitlen er scope="rowgroup" - den
      // gaelder netop de raekker, der foelger i DENNE tbody, hvilket er
      // praecis det, HTML'ens rowgroup-scope betyder.
      return '<tbody class="saml-gruppe" role="rowgroup" style="--n:' + n + '">'
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

    return '<table class="saml-matrix" role="table" aria-labelledby="' + CAPTION_ID + '">'
      + '<caption id="' + CAPTION_ID + '" class="kunskaerm">' + esc(caption) + '</caption>'
      + specimenHoved(robotter, n) + grupperHTML
      + '</table>';
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
