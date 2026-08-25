/**
 * tools/skabelon/sammenligning.mjs — /sammenligning/, felt-for-felt.
 *
 * NY SIDE (spor/lysbyg, kontrakt: prototype/retning-lys/sammenligning.html +
 * BEGRUNDELSE.md). Mockuppens form var en HAARDKODET trio (Spot/ANYmal X/
 * Go2); den rigtige side lader LAESEREN vaelge 2-3 af alle robotterne i
 * kataloget, klientside, uden en gensyntese af siden. Det kraever data,
 * bygget ikke havde foer: `skema.mjs`s `feltVisning()` — samme funktion,
 * `tools/build.mjs` bruger til robots.json's `alle_felter` — gengivet her
 * SPROGSPECIFIKT (labels, gruppenavne, operator-tekst) og indlejret direkte
 * i HVER sprogudgave af siden.
 *
 * HVORFOR INDLEJRET, IKKE `fetch('../../robots.json')`:
 * Siden maa kunne aabnes med `file://` (samme forudsaetning som resten af
 * sitet, se assets/katalog.js' egen kommentar "Ingen netvaerkskald").
 * Chromium naegter `fetch()` af en lokal fil paa tvaers af mapper under
 * `file://` (CORS), saa et kald til `../../robots.json` ville fejle netop
 * dér, hvor siden skal virke uden en server. Data ligger derfor i et
 * `<script type="application/json">` i selve dokumentet — ingen
 * netvaerksafhaengighed, samme robusthed som resten af generatoren.
 * `dist/robots.json` udvides STADIG (build.mjs, `alle_felter`), som
 * kontrakten bad om — det er blot ikke DENNE sides datakilde.
 *
 * TO LAG, VIRKER BEGGE UDEN JS:
 *   1. Tegnforklaringen + en flad robotliste med links (altid synlig,
 *      aldrig en tom side — kontraktens eget krav).
 *   2. Vaelgeren (afkrydsningsfelter, samme `.filtre`-sprog som katalogets
 *      facetter) + resultatbeholderen. Begge staar i markup'en, men selve
 *      TABELLEN kan kun bygges af JavaScript (en fuld combinationsmatrix i
 *      ren CSS for "vaelg 2-3 af 62" er ikke gennemfoerlig) — derfor er
 *      `.sammenligning-app` skjult, indtil `assets/sammenligning.js`
 *      fjerner `hidden`, praecis samme idiom som `.sog[hidden]` andre
 *      steder paa sitet.
 *
 * Kontrakten staar i side.mjs. Denne fil skriver kun indholdet af <main>.
 */

import { esc } from './side.mjs';
import { FELTER, FELTNAVNE, GRUPPER, feltVisning } from '../skema.mjs';

const attr = esc;

/** Mockuppens trio, hvis alle tre findes i det aktuelle datasaet — ellers de
 *  tre foerste robotter alfabetisk (samme regel som forsidens smagsproeve:
 *  deterministisk, ingen redaktionel udvaelgelse). */
const STANDARD_SLUGS = ['boston-dynamics-spot', 'anybotics-anymal-x', 'unitree-go2'];

function standardvalg(robotter) {
  const slugs = new Set(robotter.map((r) => r.slug));
  if (STANDARD_SLUGS.every((s) => slugs.has(s))) return STANDARD_SLUGS;
  return robotter.slice(0, 3).map((r) => r.slug);
}

/** Operatorernes tekst, sprogspecifik — samme noegler som side.mjs' operator(). */
const OPNAVN = {
  '>': 'mereend', '>=': 'mindst', '<': 'mindreend', '<=': 'hoejst', '~': 'cirka', '±': 'pm',
};

/** Den inline JSON-blok, klienten laeser. Ét objekt pr. robot: identitet +
 *  alle 30 felters visningsform (skema.mjs' feltVisning — sprogneutral) +
 *  en lille sprogspecifik ordbog, assets/sammenligning.js bruger til at
 *  tegne cellerne (label pr. felt/gruppe, operator-tekst, tilstandstekst). */
function dataBlok(ctx) {
  const { robotter, i18n } = ctx;
  const { T, t } = i18n;

  const robotterUd = robotter.map((r) => {
    const felter = Object.fromEntries(FELTNAVNE.map((n) => [n, feltVisning(n, r.felter[n])]));
    // "N af 30 felter" (skilt__nr i mockuppen): samme maalestok som
    // resten af sitets taethedstal - "oplyst" er alt, der ikke er hullet
    // ("ikke_oplyst"), praecis de andre taetheds-visninger (skema_taeller,
    // stribe-taeller) allerede taeller efter.
    const taethedAntal = FELTNAVNE.filter((n) => felter[n].tilstand !== 'ikke_oplyst').length;
    return {
      slug: r.slug, navn: r.navn, producent: r.producent,
      producentland: r.producentland, status: r.status, taethedAntal, felter,
    };
  });

  const grupper = GRUPPER.map((g) => ({
    id: g,
    titel: T['gruppe_' + g],
    felter: FELTNAVNE.filter((n) => FELTER[n].gruppe === g),
  })).filter((g) => g.felter.length);

  const feltNavne = Object.fromEntries(FELTNAVNE.map((n) => [n, T['felt_' + n]]));

  // {vis, laest}: samme to-delt operatorsprog som side.mjs' operator() -
  // et aria-hidden forkortet tegn OG en fuld laesetekst til skaermlaesere
  // (regel 4: operatoren skal kunne SES og HOERES).
  const operatorer = Object.fromEntries(
    Object.entries(OPNAVN).map(([kode, navn]) => [kode, {
      vis: T['operator_' + navn], laest: T['operator_' + navn + '_laest'],
    }]),
  );

  return {
    standard: standardvalg(robotter),
    maksAntal: 3,
    robotter: robotterUd,
    grupper,
    feltNavne,
    operatorer,
    tekst: {
      ikke_oplyst: T.tilstand_ikke_oplyst,
      nej: T.tilstand_nej,
      ja: T.ja,
      kun_billede: T.tilstand_kun_billede,
      ved_last: T.ved_last,
      ved_last_ukendt: T.ved_last_ukendt,
      advarsel: T.advarsel,
      maks: t('sammenligning_maks'),
      for_faa: t('sammenligning_for_faa'),
      taethed_skabelon: T.skema_taeller,
      vaegtklasse: {
        under_20: T.vaegtklasse_under_20,
        '20_40': T.vaegtklasse_20_40,
        over_40: T.vaegtklasse_over_40,
        ikke_oplyst: T.vaegtklasse_ikke_oplyst,
      },
    },
  };
}

/** Vaelgeren: ét afkrydsningsfelt pr. robot, samme `.filtre`-sprog som
 *  katalogets facetter (genbrugt CSS, ingen ny komponentfamilie). Legenden
 *  er `.kunskaerm` (skjult visuelt): sektion-hovedet lige ovenfor i render()
 *  viser samme etikette allerede synligt, og to synlige kopier af den
 *  samme etikette ville vaere stoej. */
function vaelgerHTML(robotter, standard, legendeTekst) {
  const std = new Set(standard);
  const felter = [...robotter].sort((a, b) => String(a.navn).localeCompare(String(b.navn), 'da'))
    .map((r) => `<input type="checkbox" class="f-saml" id="saml-${attr(r.slug)}" value="${attr(r.slug)}"`
      + `${std.has(r.slug) ? ' checked' : ''}>`
      + `<label for="saml-${attr(r.slug)}">${esc(r.navn)}<span class="antal">${esc(r.producent)}</span></label>`)
    .join('\n');
  return `<fieldset class="facet sammenligning-vaelger">
<legend class="etiket kunskaerm">${esc(legendeTekst)}</legend>
<div class="filtre" data-saml-vaelger>
${felter}
</div>
</fieldset>`;
}

/** Tegnforklaringen: fire tilstande + reglen om ingen vinder-markering.
 *  Genbruger den SAMME dl/raekke-form som hjaelp.tegnforklaring() (side.mjs,
 *  ".tegnforklaring .raekker") i stedet for at opfinde et nyt layout - ingen
 *  ny CSS-komponent til selve strukturen, kun raekkerne selv er andre.
 *  IKKE hjaelp.tegnforklaring() direkte: den viser ogsaa de to
 *  kildemaerke-raekker (bogstav/sekundaer), og kilder er skjult paa denne
 *  side (BEGRUNDELSE.md "Kilder skjules") - en forklaring paa et maerke,
 *  der aldrig staar paa siden, ville vaere en forklaring uden genstand. De
 *  fire tilstandsraekker her genbruger de samme i18n-noegler,
 *  tegnforklaringen selv bruger; den femte er sammenligningens egen. */
function legendeHTML(t, T) {
  const raekke = (v, tekst) => `<div class="raekke"><dt>${v}</dt><dd>${esc(tekst)}</dd></div>`;
  return `<section class="sektion tegnforklaring" aria-labelledby="h-tegn">
<div class="sektion-hoved"><h2 class="t-h2" id="h-tegn">${esc(t('tegnforklaring_titel'))}</h2></div>
<dl class="raekker">
${raekke('<span class="v v-tal"><b class="num">33,8</b><span class="enhed">kg</span></span>', T.taethed_udfyldte)}
${raekke('<span class="v v-tal v-nul"><b class="num">0</b></span>', T.tilstand_nul_forklaring)}
${raekke(`<span class="v v-nej"><i class="mrk"></i>${esc(T.tilstand_nej)}</span>`, T.tilstand_nej_forklaring)}
${raekke(`<span class="v v-ikke"><i class="mrk"></i>${esc(T.tilstand_ikke_oplyst)}</span>`, T.tilstand_ikke_oplyst_forklaring)}
${raekke(`<span class="v v-vinder-tegn" aria-hidden="true">—</span><span class="kunskaerm">${esc(t('sammenligning_legende_vinder_titel'))}</span>`,
    t('sammenligning_legende_vinder_forklaring'))}
</dl>
</section>`;
}

/** Uden JS: en flad, alfabetisk liste med links - aldrig en tom side. */
function fallbackHTML(robotter, ctx) {
  const { url } = ctx;
  const sorteret = [...robotter].sort((a, b) => String(a.navn).localeCompare(String(b.navn), ctx.sprog));
  const raekker = sorteret.map((r) => `<div class="raekke">
<dt><a href="${attr(url.robot(r.slug))}">${esc(r.navn)}</a></dt>
<dd><span class="v v-tekst">${esc(r.producent)}</span></dd>
</div>`).join('\n');
  return `<dl class="raekker" data-sammenligning-fallback>
${raekker}
</dl>`;
}

export function render(ctx) {
  const { robotter, i18n, url } = ctx;
  const { T, t } = i18n;

  const data = dataBlok(ctx);
  const dataJSON = JSON.stringify(data)
    .replace(/</g, '\\u003c').replace(/-->/g, '--\\u003e'); // saa </script> i data aldrig kan lukke blokken

  return `<div class="rum">
<p class="retur"><a href="${attr(url.katalog)}">${esc(T.til_katalog)}</a></p>

<div class="katalog-hoved">
<h1 class="t-h1">${esc(T.sammenligning_titel)}</h1>
<p class="t-broed maal">${esc(T.sammenligning_lede)}</p>
</div>

${legendeHTML(t, T)}

<section class="sektion sammenligning" aria-labelledby="h-sammenligning">
<h2 class="t-h2 kunskaerm" id="h-sammenligning">${esc(T.sammenligning_vaelg_titel)}</h2>

<div class="sammenligning-app" data-sammenligning hidden>
<div class="sektion-hoved">
<span class="etiket">${esc(T.sammenligning_vaelg_titel)}</span>
</div>
<p class="t-lille sektion-note">${esc(T.sammenligning_vaelg_forklaring)}</p>
${vaelgerHTML(robotter, data.standard, T.sammenligning_vaelg_titel)}
<p class="t-lille sammenligning-status" data-saml-status role="status" aria-live="polite" hidden></p>
<div data-saml-resultat></div>
</div>

<div data-sammenligning-fallback-wrap>
<p class="t-lille sektion-note">${esc(T.sammenligning_uden_js_forklaring)}</p>
${fallbackHTML(robotter, ctx)}
</div>
</section>
</div>
<script type="application/json" id="sammenligning-data">${dataJSON}</script>
`;
}
