/**
 * tools/skabelon/forside.mjs — forsiden.
 *
 * OMBYGGET 25. aug 2026 (spor/lysbyg): forsiden bliver retning LYS' teaser,
 * ikke laengere sitets eneste browsested. Kontrakten er
 * prototype/retning-lys/forside.html + BEGRUNDELSE.md, godkendt af
 * orkestratoren. Formen (hero -> yderpunkter -> EU-fund -> smagsproeve) er
 * mockuppens; TALLENE er stadig udledt her, aldrig haardkodet.
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
 * SIDENS FIRE DELE, top til bund (spor/lysbyg fjernede to af de fem
 * tidligere dele — se ARKITEKTURAENDRING nedenfor):
 *   1. Hero — kort overskrift + lede + "Se hele kataloget"-knap. Ren tekst,
 *      ingen figur, INGEN soegefelt (soegningen flyttede til katalogsiden,
 *      se ARKITEKTURAENDRING).
 *   2. YDERPUNKTER — feltets fire maalte yderpunkter (letteste, tungeste,
 *      hurtigste, laengste driftstid). Loesningen paa "ingen fremhaevet
 *      robot": DESIGN.md forbyder eksplicit "featured", fordi en
 *      fremhaevelse er en kvalitetsdom (PRODUCT.md princip 4: vi rangerer
 *      producenternes aabenhed, ikke deres kvalitet). Et yderpunkt er ingen
 *      dom — den tungeste robot er ikke "bedre" end den letteste. Beregnet i
 *      hjaelp.ekstremer() (side.mjs) af de samme data, kortene selv viser.
 *      UAENDRET beregning fra foer spor/lysbyg.
 *   3. EU-FUNDET — én rolig saetning med ét stort tal: hvor mange af
 *      kataloget oplyser CE-maerkning. Beregnet her, ikke skrevet i haanden.
 *      UAENDRET beregning fra foer spor/lysbyg.
 *   4. "FRA KATALOGET" — en smagsproeve paa seks kort (eller alle, er der
 *      faerre end seks datafiler — proevedatasaettet har kun tre), med et
 *      link "Se alle N robotter ->" til katalogsiden. Se udvalgReglen()
 *      nedenfor for udvaelgelsesreglen.
 *
 * ARKITEKTURAENDRING (spor/lysbyg, kontrakt: prototype/retning-lys/,
 * BEGRUNDELSE.md "Arkitekturaendring" + "Hvad jeg bevidst fravalgte"):
 * forsiden viser IKKE laengere alle robotter grupperet i vaegtklasser, og
 * IKKE laengere formaalsfilteret (`.formaal-gitter`) eller soegefeltet.
 * Begge dele FLYTTER til katalogsiden (tools/skabelon/katalog.mjs), som nu
 * er sitets fulde browsested: vaegtklasse-salene I-IV, facetfiltrene
 * (inkl. "Anvendelse", som allerede daekkede formaalsfilterets FUNKTION) og
 * fritekstsoegningen. Det er ikke et tab af indhold, men en arbejdsdeling
 * mellem "indgang" (forside) og "montre" (katalog) — se BEGRUNDELSE.md's
 * eget afsnit om praecis denne todeling.
 *
 * Formaalsfilterets STORE FLISER (`.formaal-gitter`) er IKKE genskabt paa
 * katalogsiden: katalogsidens egen "Anvendelse"-facet (fem afkrydsningsfelter
 * blandt facetterne, tools/skabelon/katalog.mjs) filtrerer allerede paa
 * praecis det samme felt. To samtidige UI'er for én dimension paa én side
 * ville vaere den slags dobbelt-mekanik, DESIGN.md's princip om "ét
 * signaturelement, ro omkring det" advarer imod — se fund/FUND-lysbyg.md for
 * den fulde begrundelse.
 *
 * VAEGTSTIGEN ER FJERNET (superseret, ikke en stille sletning). Den stod her
 * fra 21.08.2026 til 24.08.2026 som "sidens indholdsfortegnelse": ét maerke
 * pr. robot paa en akse, fire trin ned i sektionerne. JPK's tillaeg 24. aug
 * kraevede at aabningen (titel + lede + yderpunkter) holder sig til 1,5
 * skaermhoejde, og at MINDST ét fotografi i aabningen er markant stoerre end
 * et katalogkort. Der var ikke plads til baade en abstrakt akse-figur OG
 * fire fotobaarne yderpunkter inden for det budget, og yderpunkterne tjener
 * "Udstillingssalen" bedre: de viser en maskine, aksen viste en graf.
 *
 * Kontrakten staar i side.mjs. Denne fil skriver kun indholdet af <main>.
 */

import { esc, ekstremer } from './side.mjs';

const attr = esc;

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
  const { robotter, i18n, hjaelp } = ctx;
  const { t, tf } = i18n;

  const producenter = new Set(robotter.map((r) => r.producent));

  /* --- 1. HERO. Ren tekst, ingen figur — figuren er nu yderpunkterne.
     INGEN soegefelt (spor/lysbyg): kontrakten (BEGRUNDELSE.md, "Hvad jeg
     bevidst fravalgte") flytter soegningen til katalogsiden, hvor JS'en,
     der taender feltet, allerede bor (katalog.js' data-sog="katalog"). At
     lade et andet soegefelt staa paa forsiden, der ogsaa poster til
     robotter/, ville vaere to indgange til samme funktion. --- */
  const hero = `<section class="hero">
<div class="rum">
<div class="hero-ord">
<h1 class="t-hero">${esc(t('forside_overskrift'))}</h1>
<p class="t-broed maal hero-lede">${esc(tf('forside_lede', { n: robotter.length, p: producenter.size }))}</p>
<div class="styring">
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

  /* --- 4. "FRA KATALOGET" — en smagsproeve, ikke hele kataloget.
     spor/lysbyg (BEGRUNDELSE.md, "Arkitekturaendring"): forsiden viser ikke
     laengere alle robotter. Seks kort (eller alle, er der faerre) leder
     videre til katalogsiden, som nu er stedet, hvor hele kataloget bor.
     UDVAELGELSESREGLEN er den samme, ekstremer() allerede foelger: INGEN
     redaktionel udvaelgelse (CLAUDE.md haard begraensning 6). De foerste
     seks robotter i den alfabetiske raekkefoelge, `robotter` selv modtages
     i (samme sortering som build.mjs bruger og katalogsiden viser inden for
     hver vaegtklasse), er en deterministisk, gentagelig regel uden en
     kvalitetsdom — ikke et haandplukket "bedste" udvalg. */
  const UDVALG_ANTAL = 6;
  const udvalg = robotter.slice(0, UDVALG_ANTAL);

  const smagsproeveSektion = udvalg.length ? `<div class="katalog-flade">
<div class="rum">
<section class="sektion" aria-labelledby="h-udvalg">
<div class="sektion-hoved">
<span class="etiket">${esc(tf('forside_udvalg_etiket', { n: udvalg.length, m: robotter.length }))}</span>
<h2 class="t-h2" id="h-udvalg">${esc(t('forside_udvalg_titel'))}</h2>
</div>
<div class="gitter">
${udvalg.map((r) => hjaelp.kort(r, { op: '../', til: 'robotter/' })).join('\n')}
</div>
<p class="udvalg-videre"><a class="videre videre--stille" href="robotter/">`
    + `${esc(tf('se_alle', { n: robotter.length }))}${hjaelp.ikon('i-pil')}</a></p>
</section>
</div>
</div>` : '';

  return `<div class="aabning">
${hero}
${yderpunkterSektion}
${euFund}
</div>
${smagsproeveSektion}`;
}
