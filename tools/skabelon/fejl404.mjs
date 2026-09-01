/**
 * tools/skabelon/fejl404.mjs — 404-siden (spor/404).
 *
 * ============================ HVAD SIDEN LOESER ============================
 *
 * Foer dette spor havde sitet INGEN 404-side (maalt: `ls dist/404.html
 * dist/da/404.html dist/en/404.html` gav 0 filer). En forkert URL - en
 * robot-slug med en tastefejl, et gammelt link - ramte webserverens bare
 * standardside: intet af sitets skrift, ingen navigation, ingen vej tilbage.
 *
 * ============================== FILLAYOUT ===================================
 *
 * Sitet er statisk med to sprog og en sprogneutral rod (dist/index.html,
 * dist/da/index.html, dist/en/index.html). En statisk vaert leder typisk
 * efter EN fast fil ved navn 404.html, og forskellige vaerter leder forskellige
 * steder efter den:
 *
 *   - Nogle (fx GitHub Pages) serverer PRAECIS ÉN 404.html for hele sitet,
 *     placeret i sidens rod, uanset hvilken mappe den ukendte sti laa under.
 *   - Andre (fx Netlify's asset-server, visse nginx/Apache-opsaetninger med
 *     et location-scopet ErrorDocument) leder OPAD fra den ukendte stis egen
 *     mappe og bruger den naermeste 404.html, foer de falder tilbage til roden.
 *
 * Denne fil kan ikke afgoere, hvilken af de to sitet i sidste ende hostes med
 * - det staar ikke i repoet. Loesningen daekker BEGGE: renderRod() bygger en
 * sprogneutral fil til dist/404.html (roden, for vaerter der kun kender ÉN
 * fast 404-fil), og render() bygger en sprogSPECIFIK fil pr. sprog
 * (dist/da/404.html, dist/en/404.html) til vaerter, der finder den naermeste.
 *
 * ANTAGELSEN, SKREVET NED: rammer en vaert kun roden, ser en besoegende under
 * /en/robotter/tastefejl/ den TOSPROGEDE rod-side i stedet for den rene
 * engelske - stadig sitets eget udseende og en vej videre, blot uden at
 * gaette hvilket sprog laeseren var paa vej til. Er antagelsen forkert (en
 * vaert der hverken finder rod- eller mappefilen), er faldet det samme som
 * foer dette spor: serverens egen standardside. Testet lokalt kan kun
 * bekraefte at FILERNE findes og INDHOLDET er korrekt - ikke hvilken af de
 * to en fremtidig vaert faktisk vaelger (se rapportens punkt om
 * python -m http.server, som ikke servererer 404.html overhovedet).
 *
 * ============================== FORMEN ======================================
 *
 * render() bruger sitets egen skal() - samme daekke og fod som alle andre
 * sider (skabelon-kontrakten i side.mjs). INGEN ny CSS: overskrift (.t-h1),
 * en linje forklaring (.t-broed.maal) og ét link (.videre, "den eneste
 * knapform paa sitet"). Sprogskiftet findes allerede i daekket og i fodens
 * T.andet_sprog-laenke (peger paa `${op}${andet}/`, sprogets rod) - en
 * ekstra sprogknap i <main> ville gentage noget, chrome'en allerede giver.
 *
 * renderRod() er sprogneutral og kan derfor IKKE bruge skal() (som kraever
 * ÉT sprog for at daekke navigationen). Den foelger samme praecedens som
 * dist/index.html i build.mjs: en selvbaerende <!doctype>-side med eget
 * inline <style>, fordi den ligger UDEN FOR sti-systemet, praecis som
 * sprogvaelgeren. Klassenavnene her (f404-*) deler derfor IKKE navnerum med
 * index.html's .rod-klasser - de to dokumenter er adskilte HTML-filer, men et
 * faelles praefiks forhindrer forveksling for den, der laeser koden.
 *
 * TONEN: ingen jargon ("404" alene er ikke et svar, jf. briefet), ingen
 * spoeg. Siden siger hvad der skete, og giver én vej videre: kataloget.
 */

import { esc } from './side.mjs';

const attr = esc;

/**
 * Sprogspecifik 404 (dist/<sprog>/404.html). ctx foelger den almindelige
 * skabelon-kontrakt (grund('') i build.mjs) - samme ctx.url som forsiden
 * faar, fordi filen ligger i noejagtig samme mappedybde som
 * dist/<sprog>/index.html.
 */
export function render(ctx) {
  const { i18n, hjaelp, url } = ctx;
  const { t } = i18n;
  return `<section class="sektion" aria-labelledby="h-fejl404">
<div class="rum">
<h1 class="t-h1" id="h-fejl404">${esc(t('fejl404_titel'))}</h1>
<p class="t-broed maal">${esc(t('fejl404_forklaring'))}</p>
<p><a class="videre" href="${attr(url.katalog)}">${esc(t('fejl404_knap'))}${hjaelp.ikon('i-pil')}</a></p>
</div>
</section>`;
}

/**
 * Den sprogneutrale rod-404 (dist/404.html). Ingen ctx-kontrakt at foelge -
 * siden staar uden for sti-systemet, ligesom dist/index.html.
 *
 * `sprog` er listen af sprogkoder ({kode, navn, forklaring, knap, href}) -
 * sendt ind fra build.mjs, IKKE hardkodet her, saa et tredje sprog foejer
 * sig selv ind samme sted som roden allerede goer det (RODSPROG-moenstret,
 * build.mjs). build.mjs's egen paastaa() vogter allerede, at RODSPROG daekker
 * praecis SPROG.length sprog; denne fil laeser blot listen, den faar.
 */
export function renderRod(sprog) {
  const veje = sprog.map((s) => `<a class="f404-vej" href="${attr(`${s.kode}/robotter/`)}" hreflang="${attr(s.kode)}" lang="${attr(s.kode)}">
<span class="f404-vej__kode">${esc(s.kode.toUpperCase())}</span>
<span class="f404-vej__titel">${esc(s.titel)}</span>
<span class="f404-vej__linje">${esc(s.forklaring)}</span>
<span class="f404-vej__knap">${esc(s.knap)}<svg class="f404-vej__pil" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/></svg></span>
</a>`).join('\n');

  return `<!doctype html>
<html lang="${attr(sprog[0].kode)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${sprog.map((s) => esc(s.titel)).join(' · ')}</title>
<meta name="robots" content="noindex">
<link rel="stylesheet" href="system.css">
<link rel="stylesheet" href="generator.css">
<style>
/* Selvbaerende, som dist/index.html - se filhovedet. Praefiks f404- deler
   ingen klasse med index.html's .rod-navnerum (to separate dokumenter). */
.f404-rod{min-height:100dvh;display:grid;place-items:center;padding:var(--r5) var(--kant);box-sizing:border-box}
.f404-rod__plade{width:100%;max-width:720px;background:var(--panel);border-radius:2px;
  box-shadow:inset 0 0 0 1px var(--linje), inset 0 1px 0 var(--stans);overflow:hidden}
.f404-rod__hoved{padding:var(--r5);border-bottom:1px solid var(--linje)}
.f404-rod__kode{font-family:var(--mono);font-size:10.5px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;color:var(--blaek3)}
.f404-rod__titler{margin:var(--r2) 0 0;display:grid;gap:2px;font-weight:inherit}
.f404-rod__titel{font-family:var(--mono);font-weight:700;font-size:clamp(22px,3vw,32px);
  line-height:1.08;letter-spacing:-.016em;color:var(--blaek)}
.f404-veje{display:grid;grid-template-columns:1fr 1fr}
.f404-vej{display:grid;align-content:start;gap:var(--r2);padding:var(--r5);
  text-decoration:none;color:var(--blaek);border-left:3px solid transparent;min-width:0}
.f404-vej + .f404-vej{box-shadow:inset 1px 0 0 var(--linje)}
.f404-vej__kode{font-family:var(--mono);font-size:10.5px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;color:var(--blaek3)}
.f404-vej__titel{font-family:var(--mono);font-size:19px;font-weight:700;line-height:1.1;letter-spacing:-.008em}
.f404-vej__linje{font-family:var(--manual);font-size:14px;line-height:1.5;color:var(--blaek2);margin:0}
.f404-vej__knap{display:inline-flex;align-items:center;gap:8px;margin-top:var(--r2);
  font-family:var(--mono);font-size:12.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase}
.f404-vej__pil{width:15px;height:15px;flex:none;transition:transform .12s ease-out}
.f404-vej:hover{background:var(--bund);border-left-color:var(--accent)}
.f404-vej:focus-visible{outline:3px solid var(--accent);outline-offset:-3px;background:var(--bund)}
.f404-vej:hover .f404-vej__pil,.f404-vej:focus-visible .f404-vej__pil{transform:translateX(3px)}
@media (prefers-reduced-motion:reduce){.f404-vej__pil{transition:none}}
@media (max-width:640px){
  .f404-veje{grid-template-columns:1fr}
  .f404-vej + .f404-vej{box-shadow:inset 0 1px 0 var(--linje)}
}
</style>
</head>
<body>
<main class="f404-rod" id="hoved">
<div class="f404-rod__plade">
<div class="f404-rod__hoved">
<span class="f404-rod__kode">${sprog.map((s) => esc(s.kode.toUpperCase())).join(' / ')} · 404</span>
<h1 class="f404-rod__titler">
${sprog.map((s) => `<span class="f404-rod__titel" lang="${attr(s.kode)}">${esc(s.titel)}</span>`).join('\n')}
</h1>
</div>
<div class="f404-veje">
${veje}
</div>
</div>
</main>
</body>
</html>
`;
}
