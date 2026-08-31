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
 *      UAENDRET beregning fra foer spor/lysbyg. RETTET af spor/yderpunkt
 *      (26. aug 2026): ekstremer() udelukker nu graense-operatorer (<=, >= …)
 *      og robotter uden et rigtigt fotografi - se begrundelsen ved
 *      YDERPUNKT_OPERATOR_TILLADT i side.mjs.
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
 * IKKE laengere formaalsfilterets store fliser eller soegefeltet.
 * Begge dele FLYTTER til katalogsiden (tools/skabelon/katalog.mjs), som nu
 * er sitets fulde browsested: vaegtklasse-salene I-IV, facetfiltrene
 * (inkl. "Anvendelse", som allerede daekkede formaalsfilterets FUNKTION) og
 * fritekstsoegningen. Det er ikke et tab af indhold, men en arbejdsdeling
 * mellem "indgang" (forside) og "montre" (katalog) — se BEGRUNDELSE.md's
 * eget afsnit om praecis denne todeling.
 *
 * Formaalsfilterets STORE FLISER (CSS-klassen der baerede dem er slettet
 * i spor/indgang, punkt 1b - den rendredes 0 gange) er IKKE genskabt paa
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
 * skaermhoejde, og at (dengang) MINDST ét fotografi i aabningen er markant
 * stoerre end et katalogkort. Der var ikke plads til baade en abstrakt
 * akse-figur OG fire fotobaarne yderpunkter inden for det budget, og
 * yderpunkterne tjener "Udstillingssalen" bedre: de viser en maskine, aksen
 * viste en graf. KRAVET OM ÉT STORT FOTO ER SELV OMGJORT 26. aug 2026 (fund
 * 2): fire ligestillede kort er nu reglen — se yderpunktHTML() og
 * afsnittet "FIRE LIGESTILLEDE KORT" nedenfor. 1,5-skaermhoejde-budgettet
 * (1350 px) staar uaendret.
 *
 * Kontrakten staar i side.mjs. Denne fil skriver kun indholdet af <main>.
 */

import {
  esc, ekstremer, vaegtklasse, YDERPUNKT_FORHOLD,
} from './side.mjs';
import { taethed } from '../validate.mjs';

const attr = esc;

/**
 * Spredningsreglen for "Fra kataloget" (fund 1, JPK 26. aug 2026 — afloeser
 * den gamle "de foerste seks alfabetisk", som var et alfabethoved, ikke et
 * udsnit af kataloget). Deterministisk, ingen Math.random, ingen dato:
 *
 *   (a) hoejst ét kort pr. producent
 *   (b) mindst MIN_VAEGTKLASSER forskellige vaegtklasser repraesenteret
 *   (c) inden for de rammer: hoejeste specifikationstaethed foerst
 *       (samme taethed()-funktion og samme naevner som resten af bygget
 *       bruger, jf. skema.mjs/NAEVNER — L30. Uafgjort afgoeres af slug
 *       alfabetisk, saa bygget er 100 % reproducerbart)
 *
 * Fremgangsmaade: reducér foerst til én kandidat pr. producent (den med
 * hoejeste taethed), sortér kandidaterne efter (c). Tag toppen UDVALG_ANTAL.
 * Mangler der stadig vaegtklasser, byttes det svageste (laveste taethed)
 * medlem af en OVERrepraesenteret klasse ud med den naeste kandidat, der
 * baerer en klasse, valget endnu ikke har — indtil kravet er opfyldt, eller
 * der ikke er flere kandidater at bytte med.
 *
 * NEDGRADERING AF (a), kun naar kataloget selv er mindre end antallet af
 * kort: build.mjs' egen invariant (paastaa() ved "Fra kataloget skal vise")
 * kraever, at forsiden ALTID viser noejagtigt min(antal, robotter.length)
 * kort - ikke faerre, heller ikke naar der er faerre distinkte producenter
 * end antal (tests/eksempel-robotter, byggets 3-fils reservesaet, deler i
 * praksis ét producentnavn). Det rigtige katalog rammer aldrig denne gren
 * (77 robotter, 25 distinkte producenter, altid >= antal=6) - grenen findes
 * kun for ikke at braekke den invariant, build.mjs allerede haandhaever. */
export function udvalgReglen(robotter, { naevner, d4, antal, minVaegtklasser }) {
  const medTaethed = robotter
    .map((r) => ({ r, pct: taethed(r, naevner, d4).pct }))
    .sort((a, b) => b.pct - a.pct || a.r.slug.localeCompare(b.r.slug));

  const perProducent = new Map();
  for (const x of medTaethed) {
    if (!perProducent.has(x.r.producent)) perProducent.set(x.r.producent, x);
  }
  const kandidater = [...perProducent.values()]; // (a) opfyldt her, sorteret efter (c)

  let valgt = kandidater.slice(0, antal);
  const resten = kandidater.slice(antal);

  const klasserI = (liste) => new Set(liste.map((x) => vaegtklasse(x.r)));

  for (const erstatning of resten) {
    if (klasserI(valgt).size >= minVaegtklasser) break;
    const klasse = vaegtklasse(erstatning.r);
    if (klasserI(valgt).has(klasse)) continue; // giver ingen ny klasse

    const taelling = new Map();
    for (const x of valgt) {
      const k = vaegtklasse(x.r);
      taelling.set(k, (taelling.get(k) || 0) + 1);
    }
    // Byt det svageste (laveste taethed = sidst i den sorterede liste) medlem
    // af en overrepraesenteret klasse ud — (c) afgoer stadig, hvem der viger.
    let byttes = -1;
    for (let i = valgt.length - 1; i >= 0; i--) {
      if ((taelling.get(vaegtklasse(valgt[i].r)) || 0) > 1) { byttes = i; break; }
    }
    if (byttes === -1) break; // ingen klasse er overrepraesenteret - kan ikke byttes
    valgt = valgt.map((x, i) => (i === byttes ? erstatning : x));
  }

  // Nedgraderingen af (a): kandidater.length < antal betyder faerre distinkte
  // producenter end kort, sektionen skal vise. Fyld op fra det FULDE,
  // taethedssorterede datasaet (producent-gentagelser tilladt), saa antallet
  // af kort aldrig bliver mindre end min(antal, robotter.length).
  const maal = Math.min(antal, robotter.length);
  if (valgt.length < maal) {
    const brugte = new Set(valgt.map((x) => x.r.slug));
    for (const x of medTaethed) {
      if (valgt.length >= maal) break;
      if (brugte.has(x.r.slug)) continue;
      valgt.push(x);
      brugte.add(x.r.slug);
    }
  }

  return valgt.map((x) => x.r);
}

/**
 * Ét yderpunkt-felt: fotoplade + ét stort maalt tal + robotnavn. Hele fladen
 * er ét klikmaal (samme ::after-teknik som .kort-navn), og kildemaerket
 * loeftes over det, praecis som paa kortet — ellers er bogstavet et link,
 * ingen kan ramme.
 *
 * TO RETTELSER (spor/plader, 27. aug 2026), begge uden at roere ekstremer()
 * (K5: formen aendres, udvaelgelsen ikke):
 *
 * 1. `hjaelp.billede(robot, '../', { forhold: YDERPUNKT_FORHOLD })` — foer
 *    denne rettelse laeste billedet sit plade/cover-tjek mod katalogkortets
 *    16:10 (laesBillede()'s standard), selvom pladen her rendere i en 4:3-
 *    ramme (.yderpunkt .billedled). Galileo S1-W (sideforhold 1,78) bestod
 *    16:10-tjekket (kun 11,9 % afvigelse) men blev beskaaret 25,1 % under
 *    4:3's cover — maalt paa main FOER denne rettelse. Nu tjekkes billedet
 *    mod den ramme, det RENDERES i.
 * 2. `forbehold: post.advarsel ? [post.advarsel] : []` — samme moenster som
 *    felt()'s kompakte gren (side.mjs, kunVaerdi-stien) allerede bruger paa
 *    katalogkortet. UDEN denne linje viste MOVENEW P1's driftstid kun den
 *    generiske "lastbetingelse ikke oplyst" (fra post.ved_last) og TABTE
 *    robottens egen, mere praecise advarselstekst om de to lastbetingelser
 *    — den stod aldrig paa forsidens plade foer denne rettelse, kun paa
 *    robottens egen side og i kataloget.
 */
function yderpunktHTML(x, { hjaelp, t }) {
  const { robot, post, ikon } = x;
  const hvorhen = `robotter/${robot.slug}/`;
  const kilder = hjaelp.kilder(robot);
  const figur = hjaelp.tal(post, {
    kilder, hvorhen, maerke: true, forbehold: post.advarsel ? [post.advarsel] : [],
  });
  // op='../': forsiden ligger paa dist/<sprog>/index.html, billeder/ paa
  // dist/billeder/ — samme "../" som hjaelp.kort() bruger andre steder paa
  // denne side (op:'../' i sektioner-loekken nedenfor).
  return `<article class="yderpunkt">
${hjaelp.billede(robot, '../', { forhold: YDERPUNKT_FORHOLD })}
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
     laengste driftstid) er uaendret.
     FIRE LIGESTILLEDE KORT (fund 2, JPK 26. aug 2026 — afloeser lead/lille-
     opdelingen fra 24. aug). Teksten under gitteret har hele tiden sagt, at
     et yderpunkt "ikke er et udvalg og ikke en anbefaling" (regel 4,
     PRODUCT.md princip 4: vi rangerer producenternes aabenhed, ikke deres
     kvalitet) — men layoutet gav ét af de fire ca. ti gange de andre tres
     areal, og layout vinder altid over tekst. Den gamle loesning (ét foto
     leder, tre foelger, valgt ud fra billedkvalitet — se DESIGN.md) var
     redaktionelt forsvarlig paa BILLEDVALGET, men uforsvarlig paa AREALET:
     der findes intet offentliggjort kriterium for, hvorfor "hurtigste"
     skal fylde ti gange saa meget som "laengste driftstid". JPK har valgt
     fire ens kort frem for reviewets alternativ (rotation efter ugenummer),
     fordi rotation ville goere bygget uafhaengigt af sit eget input - samme
     data ville give en anden forside naeste uge. Alle fire renderes nu af
     samme kald med samme klasse (yderpunktHTML ovenfor), og CSS-gitteret
     (assets/generator.css, afsnit 1b) haandterer stoerrelsen alene. --- */
  const yp = ekstremer(robotter);

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
${yp.map((x) => yderpunktHTML(x, { hjaelp, t })).join('\n')}
</div>
<p class="t-lille sektion-note">${esc(tf('yderpunkter_forklaring', { n: yp.length }))}</p>
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
     UDVAELGELSESREGLEN (fund 1, JPK 26. aug 2026): den gamle regel var "de
     foerste seks alfabetisk" — deterministisk, men ikke et udsnit af
     kataloget, kun et alfabethoved (fire ud af seks fra Unitree, to uden
     billede, jf. FUND-forside.md). Reglen er nu udvalgReglen() ovenfor:
     spredning paa producent og vaegtklasse, med specifikationstaethed som
     prioritet inden for de rammer. Stadig INGEN redaktionel udvaelgelse
     (CLAUDE.md haard begraensning 6) — metoden staar paa siden
     (forside_udvalg_regel), ikke kun her, saa "hvorfor lige de her seks" er
     et efterproveligt svar, ikke en tillidserklaering. */
  const UDVALG_ANTAL = 6;
  const MIN_VAEGTKLASSER = 3;
  const NAEVNER = ctx.naevnere[0];
  const udvalg = udvalgReglen(robotter, {
    naevner: NAEVNER, d4: ctx.d4, antal: UDVALG_ANTAL, minVaegtklasser: MIN_VAEGTKLASSER,
  });

  /* --- 5. AFSLUTNINGEN (spor/indgang, punkt 2, 26. aug 2026, revideret efter
     impeccable-gennemgang samme dag). Forsiden sluttede foer dette spor med
     kun den stille "Se alle N robotter"-linje nedenfor - for diskret til at
     vaere det sidste, en besoegende ser. Foerste udkast var netop den skabelon,
     impeccable's craft-floor navngiver som kategoriens standardsvar ("heading
     + saetning + knap, centreret") - rettet til at genbruge SIDENS EGEN saetning
     i stedet: sammenligningssiden siger allerede "Ingen vinder markeret" (se
     sammenligning_legende_vinder_titel i18n-noeglen), fordi en lavere vaegt
     eller hastighed ikke er "bedre". Overskriften her ("Ingen vinder her
     heller") gentager PRAECIS den paastand om yderpunkterne og "Fra
     kataloget"-udvalget ovenfor: ingen af dem er en anbefaling, kun kataloget
     i sin fulde form lader laeseren selv afgoere hvad der taeller. Det er en
     saetning, kun DENNE side kan sige - ikke en generisk "se mere"-invitation.
     Ingen ny flade: sektionen er en ganske almindelig .sektion, samme
     .katalog-flade som "Fra kataloget" ovenfor (samme rum, samme r8-luft
     mellem sektioner .sektion allerede giver systemet, ingen ny centreret
     bloklayout opfundet ved siden af). Knappen bruger den fyldte .videre
     (system.css: "Den eneste knapform paa sitet"), ikke .videre--stille, som
     allerede baerer den mere tilbageholdne linje ovenfor - to lige tydelige
     knapper paa samme skaerm ville ophaeve hinandens vaegt. INGEN fremhaevet
     robot (L17's kerne staar ved magt) og INGEN salgssprog (nøgtern tone,
     samme register som forside_ordning). */
  const afslutningSektion = `<section class="sektion afslutning" aria-labelledby="h-afslutning">
<h2 class="t-h2" id="h-afslutning">${esc(t('forside_afslutning_titel'))}</h2>
<p class="t-broed maal afslutning-saetning">${esc(tf('forside_afslutning_saetning', { n: robotter.length, p: producenter.size }))}</p>
<p class="afslutning-knap"><a class="videre" href="robotter/">`
    + `${esc(t('forside_afslutning_knap'))}${hjaelp.ikon('i-pil')}</a></p>
</section>`;

  /* Gitteret er katalogets EGET (.net), ikke forsidens gamle .gitter: kortet er
     nu den samme komponent paa begge flader, og en anden ramme om det ville
     genstarte netop den divergens, spor/kort blev sat i verden for at lukke.

     Varianten .net--seneste er ikke pynt. Det flade .net laegger linjefarven i
     BUNDEN og lader kortene staa som huller i den - smukt, naar raekkerne gaar
     op, som katalogets 77 goer. Forsidens smagsproeve er seks kort, og seks gaar
     ikke op i fem spalter ved 1440 px: den sidste raekke ville tegne fire tomme
     graa klodser. .net--seneste vender det om - pladen er bunden, og hvert kort
     baerer selv sin haarstreg - saa en tom celle bliver usynlig, som en tom
     celle skal vaere. Samme grund som katalogets aabningsgitter (generator.css
     linje 1312).

     Legenden er kort_legende_foto, ikke kort_legende: den lange siger "Kortenes
     tal baerer kildemaerker", og TYPESKILT-kortet viser ingen tal. Kildeloeftet
     er ikke svaekket - tallene og deres maerker staar paa robotsiden - men en
     saetning om maerker paa et kort uden tal ville vaere forkert. */
  const smagsproeveSektion = udvalg.length ? `<div class="katalog-flade">
<div class="rum">
<section class="sektion" aria-labelledby="h-udvalg">
<div class="sektion-hoved">
<span class="etiket">${esc(tf('forside_udvalg_etiket', { n: udvalg.length, m: robotter.length }))}</span>
<h2 class="t-h2" id="h-udvalg">${esc(t('forside_udvalg_titel'))}</h2>
</div>
<p class="t-lille udvalg-regel">${esc(tf('forside_udvalg_regel', { n: udvalg.length, m: NAEVNER }))}</p>
<p class="t-lille kort-legende">${esc(t('kort_legende_foto'))}</p>
<div class="net net--seneste">
${udvalg.map((r) => hjaelp.kort(r, { op: '../', til: 'robotter/' })).join('\n')}
</div>
<p class="udvalg-videre"><a class="videre videre--stille" href="robotter/">`
    + `${esc(tf('se_alle', { n: robotter.length }))}${hjaelp.ikon('i-pil')}</a></p>
</section>
${afslutningSektion}
</div>
</div>` : afslutningSektion;

  return `<div class="aabning">
${hero}
${yderpunkterSektion}
${euFund}
</div>
${smagsproeveSektion}`;
}
