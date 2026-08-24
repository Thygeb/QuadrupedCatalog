/**
 * tools/skabelon/forside.mjs — forsiden.
 *
 * OMBYGGET 24. aug 2026 (JPK, efter interview + grilning + maaling). Laeseren
 * er den nysgerrige fagperson — presse, studerende, branchefolk — der vil
 * forstaa FELTET af firbenede robotter, og som ankommer UDEN et modelnavn i
 * hovedet. (PRODUCT.md's "Users" beskriver stadig en teknisk indkoeber; det
 * er forkert efter JPK's interview og rettes i et andet spor.)
 *
 * Visitor mode: Experience. Ledestjernen staar i DESIGN.md: "Udstillingssalen"
 * — maskinen staar frit paa hvid plade, fotografiet leder, graensefladen
 * traeder tilbage. Stadig et opslagsvaerk, ikke en gallerside.
 *
 * SIDENS FEM DELE, top til bund:
 *   1. Hero — kort overskrift + lede. Ren tekst, ingen figur.
 *   2. YDERPUNKTER — feltets fire maalte yderpunkter (letteste, tungeste,
 *      hurtigste, laengste driftstid). Loesningen paa "ingen fremhaevet
 *      robot": DESIGN.md forbyder eksplicit "featured", fordi en
 *      fremhaevelse er en kvalitetsdom (PRODUCT.md princip 4: vi rangerer
 *      producenternes aabenhed, ikke deres kvalitet). Et yderpunkt er ingen
 *      dom — den tungeste robot er ikke "bedre" end den letteste. Beregnet i
 *      hjaelp.ekstremer() (side.mjs) af de samme data, kortene selv viser.
 *   3. EU-FUNDET — én rolig saetning med ét stort tal: hvor mange af
 *      kataloget oplyser CE-maerkning. Beregnet her, ikke skrevet i haanden.
 *   4. FORMAALSFILTERET — samme syv+1 kategorier som foer (nu "chips"), men
 *      som en tydelig, indbydende indgang. Stadig et FILTER (link ind i
 *      kataloget), ikke en gruppering: 29 af 46 robotter har mere end ét
 *      formaal, saa en gruppering ville vise samme robot flere gange.
 *   5. KATALOGET — alle 46, statisk, grupperet i vaegtklasser (L27). Vaegten
 *      er stadig aksen: den er maalt og entydig. Faar sin egen flade
 *      (`.katalog-flade`, --panel-ro) som TONESPRING fra aabningen ovenfor —
 *      ikke en streg.
 *
 * VAEGTSTIGEN ER FJERNET (superseret, ikke en stille sletning). Den stod her
 * fra 21.08.2026 til 24.08.2026 som "sidens indholdsfortegnelse": ét maerke
 * pr. robot paa en akse, fire trin ned i sektionerne. JPK's tillaeg 24. aug
 * kraevede at aabningen (titel + lede + yderpunkter) holder sig til 1,5
 * skaermhoejde, og at MINDST ét fotografi i aabningen er markant stoerre end
 * et katalogkort. Der var ikke plads til baade en abstrakt akse-figur OG
 * fire fotobaarne yderpunkter inden for det budget, og yderpunkterne tjener
 * "Udstillingssalen" bedre: de viser en maskine, aksen viste en graf.
 * Navigationen, stigen bar (link ned i hver vaegtklassesektion), er ikke
 * tabt: hver sektion viser sit eget antal i overskriften (uaendret), og
 * siden er kort nok til at rulles.
 *
 * Kontrakten staar i side.mjs. Denne fil skriver kun indholdet af <main>.
 */

import { esc, ekstremer } from './side.mjs';

const attr = esc;

/** Vaegten i kg til sortering inde i en sektion. Uoplyst sorteres sidst. */
function sorteringsvaegt(robot) {
  const p = robot?.felter?.egenvaegt;
  if (!p || typeof p === 'string' || typeof p.vaerdi === 'string') return Infinity;
  const v = p.min !== undefined ? (p.min + p.maks) / 2 : p.vaerdi;
  if (typeof v !== 'number') return Infinity;
  return p.enhed === 'g' ? v / 1000 : v;
}

/**
 * Ét yderpunkt-felt: fotografi + ét stort maalt tal + robotnavn. Hele fladen
 * er ét klikmaal (samme ::after-teknik som .kort-navn), og kildemaerket
 * loeftes over det, praecis som paa kortet — ellers er bogstavet et link,
 * ingen kan ramme.
 */
function yderpunktHTML(x, { hjaelp, t }, { lead = false } = {}) {
  const { robot, post, ikon } = x;
  const hvorhen = `robotter/${robot.slug}/`;
  const kilder = hjaelp.kilder(robot);
  const figur = hjaelp.tal(post, { kilder, hvorhen, maerke: true });
  const klasse = lead ? 'yderpunkt yderpunkt--lead' : 'yderpunkt yderpunkt--lille';
  // op='../': forsiden ligger paa dist/<sprog>/index.html, billeder/ paa
  // dist/billeder/ — samme "../" som hjaelp.kort() bruger andre steder paa
  // denne side (op:'../' i sektioner-loekken nedenfor).
  return `<article class="${klasse}">
${hjaelp.billede(robot, '../')}
<div class="yderpunkt-krop">
<span class="etiket">${hjaelp.ikon(ikon)}${esc(t('yderpunkt_' + x.id))}</span>
${figur}
<p class="yderpunkt-navn"><a href="${attr(hvorhen)}">${esc(robot.navn)}</a></p>
<p class="yderpunkt-prod">${esc(robot.producent)}</p>
</div>
</article>`;
}

export function render(ctx) {
  const { robotter, i18n, sprog, hjaelp } = ctx;
  const { T, t, tf } = i18n;

  const producenter = new Set(robotter.map((r) => r.producent));

  /* --- 1. HERO. Ren tekst, ingen figur — figuren er nu yderpunkterne. --- */
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
<p class="hero-videre"><a class="videre videre--stille" href="robotter/">${esc(tf('se_alle', { n: robotter.length }))}`
    + `${hjaelp.ikon('i-pil')}</a></p>
</div>
</div>
</div>
</section>`;

  /* --- 2. YDERPUNKTERNE. Beregnet i side.mjs (ekstremer), aldrig hardkodet.
     Raekkefoelgen i ekstremer()'s eget udtryk (letteste, tungeste, hurtigste,
     laengste driftstid) er uaendret; kun VISNINGEN her vaelger, hvilket af de
     fire der bliver aabningens ene store foto.
     Lead = hurtigste (23.-24. aug 2026 fotogennemgang): "tungeste" er Unitree
     B2-W, hvis eneste billede er en moerk marketing-infografik med paaklaebet
     spec-tekst ("32-wire Automotive-grade LiDAR" osv.) — den modsiger
     ledestjernen "maskinen staar frit", jo stoerre den vises. "Letteste" (Y10)
     er endnu vaerre: et banner med SEKS forskellige robotter og kinesisk
     marketingoverskrift, ikke ét enkelt foto af Y10. "Hurtigste" (Lynx S10) og
     "laengste driftstid" (RAIBO2) er begge rene, tekstfrie enkeltbilleder;
     Lynx S10 er valgt, fordi robotten staar roligt frem for at loebe i
     bevaegelsesslør. Ingen af billederne er redigeret eller beskaaret uden om
     kortenes egen <picture>-vej — kun VALGET af, hvilket der bliver stort. --- */
  const yp = ekstremer(robotter);
  const ypLead = yp.find((x) => x.id === 'hurtigste') ?? yp[0];
  const ypResten = yp.filter((x) => x !== ypLead);

  /* Forklaringen staar UNDER gitteret, ikke over det (JPK's tillaeg, 24. aug
     2026): foerste skaerm skal naa et fotografi, foer nogen har rullet, og
     et forklarende afsnit mellem overskrift og billede kostede den plads.
     Samme idiom som de trailende "sektion-note"-afsnit nederst paa siden
     allerede bruger — kun flyttet hertil, ikke opfundet. */
  const yderpunkterSektion = yp.length ? `<section class="yderpunkter-sektion" aria-labelledby="h-yderpunkter">
<div class="rum">
<div class="sektion-hoved">
<span class="etiket">${esc(t('yderpunkter_etiket'))}</span>
<h2 class="t-h2" id="h-yderpunkter">${esc(t('yderpunkter_titel'))}</h2>
</div>
<div class="yderpunkter">
${yderpunktHTML(ypLead, { hjaelp, t }, { lead: true })}
<div class="yderpunkter-liste">
${ypResten.map((x) => yderpunktHTML(x, { hjaelp, t })).join('\n')}
</div>
</div>
<p class="t-lille sektion-note">${esc(t('yderpunkter_forklaring'))}</p>
</div>
</section>` : '';

  /* --- 3. EU-FUNDET. Én saetning, ét stort tal, beregnet her — se
     PRODUCT.md's positionering nr. 2. Maalt 24.08.2026: 2 af 46 robotter i
     kataloget har ce_oplyst: true (2 flere svarer eksplicit nej, 42 siger
     intet). "2 af 46 oplyser CE" er den staerkeste egen-iagttagelse, siden
     har — at naesten ingen producent oplyser CE-maerkning. --- */
  const ceJa = robotter.filter((r) => hjaelp.ceTilstand(r) === 'ja').length;
  const euFund = `<section class="eu-fund" aria-label="${attr(t('eu_titel'))}">
<div class="rum">
<p class="eu-fund-linje">${hjaelp.ikon('i-ce', 'ikon ikon--lille')}`
    + `<b class="eu-fund-tal">${esc(tf('forside_eu_tal', { n: ceJa, m: robotter.length }))}</b>`
    + `<span>${esc(t('forside_eu_paastand'))}</span></p>
</div>
</section>`;

  /* --- 4. FORMAALSFILTERET. Samme beregning som foer (chips), nu en
     tydelig, indbydende indgang. Stadig LINKS til kataloget, ikke
     afkrydsningsfelter: forsiden er delt i vaegtklassesektioner, og et
     filter, der tommer tre af fire, efterlader tomme overskrifter. Stadig
     et FILTER, ikke en gruppering — 29 af 46 robotter har mere end ét
     formaal (maalt), saa en gruppering ville vise samme robot flere
     gange. --- */
  const anvAntal = new Map();
  for (const r of robotter) {
    for (const v of hjaelp.anvendelse(r).vaerdier) anvAntal.set(v, (anvAntal.get(v) ?? 0) + 1);
  }
  const anvOrden = [...anvAntal.entries()]
    .sort((a, b) => (a[0] === 'ikke_oplyst' ? 1 : b[0] === 'ikke_oplyst' ? -1 : b[1] - a[1]));

  const formaalTiles = anvOrden.map(([v, n]) => {
    const tom = v === 'ikke_oplyst' ? ' formaal--tom' : '';
    const navn = v === 'ikke_oplyst' ? T.tilstand_ikke_oplyst : t('anvendelse_' + v);
    return `<a class="formaal${tom}" href="robotter/#f-anv-${attr(v)}">`
      + `<span class="formaal-navn">${esc(navn)}</span>`
      + `<span class="formaal-tal figur" aria-hidden="true">${esc(hjaelp.nformat(n))}</span>`
      + `<span class="kunskaerm">${esc(tf('antal_kort', { n }))}</span></a>`;
  }).join('\n');

  const formaalSektion = `<section class="formaal-sektion" aria-labelledby="h-formaal">
<div class="rum">
<div class="sektion-hoved">
<span class="etiket">${esc(t('forside_filtre_etiket'))}</span>
<h2 class="t-h2" id="h-formaal">${esc(t('forside_formaal_titel'))}</h2>
</div>
<p class="t-lille sektion-note">${esc(t('forside_formaal_forklaring'))}</p>
<nav class="formaal-gitter" aria-label="${attr(t('forside_filtre_etiket'))}">
${formaalTiles}
</nav>
</div>
</section>`;

  /* --- 5. KATALOGET. Vaegtklassesektionerne (L27), uaendret logik. --- */
  const efterKlasse = new Map(hjaelp.VAEGTKLASSER.map((k) => [k, []]));
  for (const r of robotter) efterKlasse.get(hjaelp.vaegtklasse(r)).push(r);
  for (const liste of efterKlasse.values()) {
    liste.sort((a, b) => sorteringsvaegt(a) - sorteringsvaegt(b)
      || String(a.navn).localeCompare(String(b.navn), sprog));
  }

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

  return `<div class="aabning">
${hero}
${yderpunkterSektion}
${euFund}
${formaalSektion}
</div>
<div class="katalog-flade">
<div class="rum">
${sektioner}
<p class="t-mikro sektion-note">${esc(t('vaegtklasse_forklaring'))}</p>
<p class="t-mikro sektion-note">${esc(t('forside_ordning'))}</p>
</div>
</div>`;
}
