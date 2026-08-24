/**
 * tools/skabelon/forside.mjs — forsiden.
 *
 * L17: typografisk hero. Kort overskrift, soegefelt og anvendelsesfiltre i
 * foerste viewport. INGEN robot fremhaevet - at vaelge én ville vaere en
 * anbefaling, og siden har ingen metode at anbefale efter.
 *
 * L27: derunder vaegtklassesektioner. Vaegt er aksen, fordi den er maalt og
 * entydig; anvendelse er filter. Alle robotter staar paa forsiden - ogsaa dem
 * uden oplyst vaegt, som faar deres egen sektion i stedet for at forsvinde.
 *
 * VAEGTSTIGEN (21.08.2026). Hero'en var ren tekst: en overskrift, en lede og
 * to betjeningsflader paa et hvidt baand. Den viste ikke, hvad siden HAR.
 * Stigen tegner den samme akse, som siden i forvejen er ordnet efter: ét
 * maerke pr. robot med oplyst egenvaegt, sat paa en maalt skala, og de fire
 * vaegtklasser under den som links ned i sektionerne.
 *
 * To ting goer den til andet end pynt. Den er sidens indholdsfortegnelse, og
 * den virker uden en linje JavaScript. Og den viser hullet i foerste viewport:
 * de robotter, ingen kan placere paa aksen, fordi producenten ikke oplyser en
 * vaegt, staar UDEN FOR aksen i hullets eget sprog - ikke gemt, ikke talt med
 * i en klasse, de ikke hoerer til.
 *
 * INGEN robot er navngivet paa stigen. Et maerke, der kunne klikkes hen til én
 * maskine, ville vaere en fremhaevelse, og den har vi ingen metode til.
 *
 * Kontrakten staar i side.mjs. Denne fil skriver kun indholdet af <main>.
 */

import { esc, VAEGTGRAENSER } from './side.mjs';

const attr = esc;

/** Vaegten i kg til sortering inde i en sektion. Uoplyst sorteres sidst. */
function sorteringsvaegt(robot) {
  const p = robot?.felter?.egenvaegt;
  if (!p || typeof p === 'string' || typeof p.vaerdi === 'string') return Infinity;
  const v = p.min !== undefined ? (p.min + p.maks) / 2 : p.vaerdi;
  if (typeof v !== 'number') return Infinity;
  return p.enhed === 'g' ? v / 1000 : v;
}

export function render(ctx) {
  const { robotter, i18n, sprog, hjaelp } = ctx;
  const { T, t, tf } = i18n;

  const producenter = new Set(robotter.map((r) => r.producent));

  /* --- anvendelsesfiltrene i hero'en. De er LINKS til kataloget, ikke
     afkrydsningsfelter: forsiden er delt i vaegtklassesektioner, og et filter,
     der tommer tre af fire sektioner, efterlader tre overskrifter uden
     indhold. Linket saetter filteret paa katalogsiden, hvor det hoerer til,
     og det virker uden en linje JavaScript. --- */
  const anvAntal = new Map();
  for (const r of robotter) {
    for (const v of hjaelp.anvendelse(r).vaerdier) anvAntal.set(v, (anvAntal.get(v) ?? 0) + 1);
  }
  const anvOrden = [...anvAntal.entries()]
    .sort((a, b) => (a[0] === 'ikke_oplyst' ? 1 : b[0] === 'ikke_oplyst' ? -1 : b[1] - a[1]));

  const chips = anvOrden.map(([v, n]) => `<a class="chip" href="robotter/#f-anv-${attr(v)}">`
    + `${esc(v === 'ikke_oplyst' ? T.tilstand_ikke_oplyst : t('anvendelse_' + v))}`
    + `<span class="antal">${esc(String(n))}</span></a>`).join('\n');

  /* --- vaegtklassesektionerne (L27). Klasserne er afledt i bygget. --- */
  const efterKlasse = new Map(hjaelp.VAEGTKLASSER.map((k) => [k, []]));
  for (const r of robotter) efterKlasse.get(hjaelp.vaegtklasse(r)).push(r);
  for (const liste of efterKlasse.values()) {
    liste.sort((a, b) => sorteringsvaegt(a) - sorteringsvaegt(b)
      || String(a.navn).localeCompare(String(b.navn), sprog));
  }

  /* --- vaegtstigen ------------------------------------------------------
     Aksen gaar fra 0 til det naeste hele klassetrin over den tungeste robot,
     saa aksens top er et rundt tal og ikke en enkelt maskines vaegt. Trinnet
     er klassegraensen selv (20 kg), saa begge graenser rammer en maerkestreg
     og aksen ikke kan komme til at sige noget andet end sektionerne. --- */
  const vaegte = robotter.map(sorteringsvaegt).filter((v) => Number.isFinite(v));
  const trin = VAEGTGRAENSER.under;
  const aksetop = Math.max(trin, Math.ceil(Math.max(0, ...vaegte) / trin) * trin);
  const pct = (kg) => `${(kg / aksetop * 100).toFixed(2)}%`;

  const maerker = vaegte.sort((a, b) => a - b)
    .map((kg) => `<span style="--x:${pct(kg)}"></span>`).join('');
  const graenser = [VAEGTGRAENSER.under, VAEGTGRAENSER.over]
    .map((kg) => `<span class="graense" style="--x:${pct(kg)}"></span>`).join('');
  const aksetal = [];
  for (let kg = 0; kg <= aksetop; kg += trin) {
    aksetal.push(`<span style="--x:${pct(kg)}">${esc(hjaelp.nformat(kg))}`
      + (kg === aksetop ? ' kg' : '') + '</span>');   /* SI-symbol, ikke tekst */
  }

  const baand = hjaelp.VAEGTKLASSER.map((klasse) => {
    const n = efterKlasse.get(klasse).length;
    if (!n) return '';
    const hul = klasse === 'ikke_oplyst' ? ' stige-trin--hul' : '';
    return `<a class="stige-trin${hul}" href="#vaegt-${attr(klasse)}">`
      + `<span class="navn">${esc(t('vaegtklasse_' + klasse))}</span>`
      + `<b class="figur" aria-hidden="true">${esc(hjaelp.nformat(n))}</b>`
      + `<span class="kunskaerm">${esc(tf('antal_kort', { n }))}</span></a>`;
  }).join('\n');

  const stige = `<div class="stige panel">
<span class="etiket">${esc(t('vaegtklasse_titel'))}</span>
<div class="stige-akse" aria-hidden="true">
<div class="stige-maerker">${maerker}</div>
<div class="stige-linje">${graenser}</div>
<div class="stige-tal">${aksetal.join('')}</div>
</div>
<nav class="stige-baand" aria-label="${attr(t('vaegtklasse_titel'))}">
${baand}
</nav>
</div>`;

  const hero = `<section class="hero">
<div class="rum">
<div class="hero-ord">
<h1 class="t-hero">${esc(t('forside_overskrift'))}</h1>
<p class="t-broed maal hero-lede">${esc(tf('forside_lede', { n: robotter.length, p: producenter.size }))}</p>
<div class="styring">
<form class="sog" action="robotter/" method="get" data-sog="forside" hidden>
<label class="etiket" for="sog-forside">${esc(t('forside_soeg_etiket'))}</label>
<input id="sog-forside" name="s" type="search" autocomplete="off"
 placeholder="${attr(t('forside_soeg_pladsholder'))}">
</form>
<p class="hero-videre"><a class="videre" href="robotter/">${esc(tf('se_alle', { n: robotter.length }))}`
    + `${hjaelp.ikon('i-pil')}</a></p>
</div>
</div>
${stige}
<nav class="chips" aria-label="${attr(t('forside_filtre_etiket'))}">
<span class="etiket">${esc(t('forside_filtre_etiket'))}</span>
<div class="chips-raekke">
${chips}
</div>
</nav>
</div>
</section>`;

  const sektioner = hjaelp.VAEGTKLASSER.map((klasse) => {
    const liste = efterKlasse.get(klasse);
    if (!liste.length) return '';
    const forklaring = klasse === 'ikke_oplyst'
      ? t('vaegtklasse_ikke_oplyst_forklaring') : '';
    return `<section class="sektion" id="vaegt-${attr(klasse)}" aria-labelledby="h-${attr(klasse)}">
<div class="sektion-hoved">
<span class="etiket">${esc(t('vaegtklasse_titel'))}</span>
<h2 class="t-h2" id="h-${attr(klasse)}">${esc(t('vaegtklasse_' + klasse))}</h2>
<span class="tal">${esc(tf('antal_kort', { n: liste.length }))}</span>
</div>
${forklaring ? `<p class="t-lille sektion-note">${esc(forklaring)}</p>` : ''}
<div class="gitter">
${liste.map((r) => hjaelp.kort(r, { op: '../', til: 'robotter/' })).join('\n')}
</div>
</section>`;
  }).join('\n');

  return `${hero}
<div class="rum">
${sektioner}
<p class="t-mikro sektion-note">${esc(t('vaegtklasse_forklaring'))}</p>
<p class="t-mikro sektion-note">${esc(t('forside_ordning'))}</p>
</div>`;
}
