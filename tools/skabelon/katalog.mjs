/**
 * tools/skabelon/katalog.mjs — katalogsiden: alle robotter, ét kort hver.
 *
 * Filtrene virker UDEN JavaScript. De er almindelige afkrydsningsfelter, og
 * selve filtreringen sker i CSS med :has() og et lag pr. facet:
 *
 *   .styr:has(.f-anv:checked) .lag-anv            { display:none }      skjul alle
 *   .styr:has(#f-anv-industri:checked)
 *        .lag-anv[data-anv~="industri"]           { display:contents }  vis igen
 *
 * Den anden regel vinder, fordi :has() arver sit mest specifikke argument, og
 * et id slaar en klasse. Resultatet er ELLER inden for en facet (flere
 * afkrydsninger udvider udvalget) og OG paa tvaers af facetter (hver facet har
 * sit eget lag, og et lag skjult af facet A kan ikke vises igen af facet B).
 *
 * Lagene er `display:contents`, saa de ikke selv bliver gitterceller. Et skjult
 * kort efterlader derfor intet tomt felt i gitteret.
 *
 * Uden :has()-stoette sker der ingenting: alle kort staar. Det er den rigtige
 * vej at fejle - kataloget er stadig helt.
 *
 * :target gaar den samme vej, saa forsidens filterlinks
 * (robotter/#f-anv-industri) saetter et filter uden JavaScript.
 *
 * OMBYGGET 25. aug 2026 (spor/lysbyg, retning LYS): kataloget er nu sitets
 * fulde browsested (se tools/skabelon/forside.mjs' ARKITEKTURAENDRING-note
 * — forsiden viser kun en smagsproeve). Kortene grupperes i FIRE
 * "sale" (prototype/retning-lys/katalog.html, BEGRUNDELSE.md): romertal
 * I-IV over vaegtklasserne, samme graenser som L27 allerede satte
 * (hjaelp.VAEGTKLASSER/hjaelp.vaegtklasse). Grupperingen aendrer INTET ved
 * selve filtermekanikken ovenfor: hvert kort staar stadig indpakket i det
 * samme lag pr. facet, blot fordelt paa fire mindre gitre i stedet for ét
 * langt. :has()-reglerne i hovedStil() nedenfor kender ikke til sale-
 * inddelingen og virker uaendret paa tvaers af dem.
 *
 * Sal-antallet er en AEGTE OPTAELLING (liste.length pr. vaegtklasse), ikke
 * et tal skrevet i haanden - det AENDRER sig, naar kataloget vokser (i dag
 * 14/17/21/10 over 62 robotter, maalt 25.08.2026; se
 * tools/skabelon/side.mjs' vaegtklasse()). Sal IV ("vaegt ikke oplyst")
 * staar sidst og aabent, med samme forklaringstekst forsiden allerede
 * brugte foer denne aendring (`vaegtklasse_ikke_oplyst_forklaring`).
 *
 * Kontrakten staar i side.mjs. Denne fil skriver kun indholdet af <main>.
 */

import { esc, centralVaerdi } from './side.mjs';
import { tilstandAf } from '../skema.mjs';
/* Specifikationstaetheden hentes fra validate.mjs' egen taethed() - IKKE
   regnet efter i haanden her. Et haandregnet taethedstal ved siden af det
   udledte er praecis D7/L30-faelden, CLAUDE.md advarer imod: de to ville
   skride fra hinanden, saa snart naevneren aendrer sig. validate.mjs koerer
   ikke noget ved import (den er vagtet af `erHoved`), og build.mjs
   importerer den allerede. */
import { taethed } from '../validate.mjs';

const attr = esc;

/** Romertal I-IV, udledt af VAEGTKLASSERs faste raekkefoelge (index+1) -
 *  ikke skrevet ud pr. robot eller pr. antal. Der er altid praecis fire
 *  vaegtklasser (hjaelp.VAEGTKLASSER), saa listen er en konstant af samme
 *  art som selve klasseinddelingen, ikke et haandtal, der kan skride. */
const ROMERTAL = ['I', 'II', 'III', 'IV'];

/** Et vaerdinavn, der kan staa i et id og i en attributvaelger. */
const nogle = (v) => String(v).toLowerCase().replace(/[^a-z0-9_]+/g, '-');

function ipVaerdi(robot) {
  const p = robot.felter?.ip_klasse;
  if (p === undefined) return 'ikke_oplyst';
  if (typeof p === 'string') return tilstandAf(p) ?? 'ikke_oplyst';
  const t0 = tilstandAf(p.vaerdi);
  if (t0) return t0;
  return String(p.vaerdi);
}

/** Facetterne. Raekkefoelgen her er ogsaa lagenes raekkefoelge i HTML. */
function facetter(robotter, hjaelp, i18n) {
  const { T, t } = i18n;
  const tilstandsnavn = (v) => (v === 'ikke_oplyst' ? T.tilstand_ikke_oplyst
    : v === 'nej' ? T.tilstand_nej : v);

  return [
    {
      navn: 'anv',
      etiket: t('filter_anvendelse'),
      vaerdier: (r) => hjaelp.anvendelse(r).vaerdier,
      tekst: (v) => (v === 'ikke_oplyst' ? T.tilstand_ikke_oplyst : t('anvendelse_' + v)),
    },
    {
      // L50: en robot med et vaegtspaend, der daekker flere klasser, skal
      // matche i dem ALLE. vaerdier() returnerer derfor SAETTET fra
      // hjaelp.vaegtklasser() (flertal), ikke det enkelte hjaelp.vaegtklasse()
      // - samme mekanik som 'anv'-facetten ovenfor allerede bruger til flere
      // vaerdier pr. robot. antal-taellingen laengere nede (linje ~117) og
      // CSS'ens data-vaegt~="..."-medlemskabstest (hovedStil) kraever ingen
      // aendring: de virker allerede paa en vaerdiliste, ikke ét tal.
      navn: 'vaegt',
      etiket: t('filter_vaegt'),
      vaerdier: (r) => hjaelp.vaegtklasser(r),
      tekst: (v) => t('vaegtklasse_' + v),
      orden: hjaelp.VAEGTKLASSER,
    },
    {
      navn: 'ip',
      etiket: t('filter_ip'),
      vaerdier: (r) => [ipVaerdi(r)],
      tekst: tilstandsnavn,
    },
    {
      navn: 'land',
      etiket: t('filter_land'),
      vaerdier: (r) => [r.producentland],
      tekst: (v) => hjaelp.land(v),
    },
    {
      navn: 'ce',
      etiket: t('filter_ce'),
      vaerdier: (r) => [hjaelp.ceTilstand(r)],
      tekst: (v) => (v === 'ja' ? T.ja : v === 'nej' ? T.nej : T.tilstand_ikke_oplyst),
    },
  ].map((f) => {
    const antal = new Map();
    for (const r of robotter) {
      for (const v of f.vaerdier(r)) antal.set(v, (antal.get(v) ?? 0) + 1);
    }
    const liste = [...antal.keys()].sort((a, b) => {
      if (f.orden) return f.orden.indexOf(a) - f.orden.indexOf(b);
      // "ikke oplyst" staar sidst; ellers efter antal og saa alfabetisk.
      if (a === 'ikke_oplyst') return 1;
      if (b === 'ikke_oplyst') return -1;
      return antal.get(b) - antal.get(a) || String(a).localeCompare(String(b));
    });
    return { ...f, antal, liste };
  });
}

/** Den genererede filter-CSS. Kaldes af bygget og lægges i <head>. */
export function hovedStil(ctx) {
  const { robotter, hjaelp, i18n } = ctx;
  const F = facetter(robotter, hjaelp, i18n);
  const linjer = [];
  for (const f of F) {
    linjer.push(`.styr:has(.f-${f.navn}:checked) .lag-${f.navn},`);
    linjer.push(`.styr:has(.f-${f.navn}:target) .lag-${f.navn}{display:none}`);
    for (const v of f.liste) {
      const id = `f-${f.navn}-${nogle(v)}`;
      linjer.push(`.styr:has(#${id}:checked) .lag-${f.navn}[data-${f.navn}~="${v}"],`);
      linjer.push(`.styr:has(#${id}:target) .lag-${f.navn}[data-${f.navn}~="${v}"]{display:contents}`);
    }
  }
  /* L44: sorteringen. TO regler i alt - ikke én pr. robot - fordi `order`
     tager en var(), og hvert kort baerer selv sine rangtal (se render()).
     Samme :has()-mekanik og samme @supports-vagt som filtrene, saa den
     fejler samme vej: uden :has()-stoette sker der ingenting, og kortene
     staar i vaegtorden. Det er den rigtige vej at fejle - kataloget er helt.

     `vaegt` har ingen regel med vilje: den ER DOM-raekkefoelgen (`sorteret` i
     render()), saa standardvisningen har visuel orden = DOM-orden = taborden.
     Kun de to valgte alternativer flytter noget. */
  const sortering = [
    '.styr:has(#sort-taethed:checked) .kort{order:var(--o-taethed)}',
    '.styr:has(#sort-alfa:checked) .kort{order:var(--o-alfa)}',
  ];

  /* --- TOMME SALE, SKJULT I REN CSS (P0, 28. aug 2026) --------------------
     Problemet: naar et filter tommer en hel vaegtklasse, blev salens
     overskrift, romertal og taelling staaende over et tomt gitter. Maalt paa
     `#f-land-tyskland` ved 1440: 1 synligt kort, og 3 sale med overskrift og
     tal over nul kort - inklusive saetningen "De staar her, ikke skjult i
     bunden af en anden klasse" over et tomt felt.

     Den naerliggende konklusion er, at det KUN kan loeses med JavaScript,
     fordi :has() ikke kan se computed display paa et kort, en anden regel har
     skjult. Det er rigtigt - men det er ikke det spoergsmaal, der skal
     stilles. Vi behoever ikke spoerge DOM'en, om salen blev tom: vi ved ved
     byggetiden, hvilke vaerdier hver sal indeholder.

     Reglen pr. (sal, facet) bliver derfor:

       "facetten er i brug, OG ingen af de vaerdier, salen faktisk
        indeholder, er valgt"  ->  salen kan ikke have et eneste kort

     som i CSS er
       .styr:has(.f-land:checked):not(:has(:is(#f-land-kina,...):checked))
         [data-sal="under_20"]{display:none}

     hvor :is()-listen er praecis de landevaerdier, sal I indeholder. Det
     haandterer ELLER inden for facetten korrekt: er baade Kina og Tyskland
     krydset af, og salen har kinesiske robotter, saa fanger :is() den, og
     salen bliver staaende.

     REGLEN ER SUND, MEN IKKE KOMPLET, og det skal staa her, saa den naeste
     laeser ikke tror, den daekker mere end den goer. Den skjuler aldrig en
     sal, der HAR kort (ingen falske positive). Men den ser kun ÉN facet ad
     gangen, saa en tomhed, der foerst opstaar paa TVAERS af to facetter,
     fanger den ikke: har en sal én tysk robot til forskning og én kinesisk
     til industri, og laeseren vaelger "Tyskland + industri", er salen tom
     uden at nogen enkelt facet gjorde den tom. Den fulde betingelse ville
     kraeve én regel pr. kombination (5 facetter, 30 vaerdier), og det er ikke
     en stilart, det er en eksplosion.

     Det udestaaende tilfaelde daekkes to andre steder: JavaScript skjuler
     enhver tom sal praecist (katalog.js), og UDEN JavaScript staar
     omfangsmaerkerne og noten over salene, saa intet tal lyver - salen
     staar da med en overskrift og en SAND taelling ("18 robotter i
     kataloget"), ikke med et tal om et udvalg, den ikke beskriver.

     `[data-sal]` rammer alle fire dele af salen paa én gang: indeksposten i
     tommelindekset, hovedet, forklaringen og gitteret. Indeksposten SKAL med
     - ellers ville tommelindekset tilbyde et spring til et anker, der er
     skjult. */
  const tommeSale = [];
  const efterKlasse = new Map(hjaelp.VAEGTKLASSER.map((k) => [k, []]));
  for (const r of robotter) efterKlasse.get(hjaelp.vaegtklasse(r))?.push(r);
  for (const klasse of hjaelp.VAEGTKLASSER) {
    const iSalen = efterKlasse.get(klasse) ?? [];
    if (!iSalen.length) continue;
    for (const f of F) {
      // De vaerdier i denne facet, som salen FAKTISK indeholder.
      const tilstede = new Set();
      for (const r of iSalen) for (const v of f.vaerdier(r)) tilstede.add(v);
      const ider = f.liste.filter((v) => tilstede.has(v))
        .map((v) => `#f-${f.navn}-${nogle(v)}`);
      const maal = `[data-sal="${klasse}"]`;
      for (const tilstand of ['checked', 'target']) {
        const brug = `.styr:has(.f-${f.navn}:${tilstand})`;
        // Tom :is()-liste er ugyldig CSS. Indeholder salen ingen af
        // facettens vaerdier overhovedet, tommer ENHVER markering den.
        tommeSale.push(ider.length
          ? `${brug}:not(:has(:is(${ider.join(',')}):${tilstand})) ${maal}{display:none}`
          : `${brug} ${maal}{display:none}`);
      }
    }
  }

  return `/* Filtrene. Genereret af tools/skabelon/katalog.mjs - én regel pr. vaerdi. */
@supports selector(:has(*)){
${linjer.join('\n')}

/* Sorteringen (L44). */
${sortering.join('\n')}

/* Sale, som det valgte filter beviseligt tommer (P0). Se hovedStil()s note. */
${tommeSale.join('\n')}
}`;
}

export function render(ctx) {
  const { robotter, i18n, sprog, hjaelp } = ctx;
  const { T, t, tf } = i18n;
  const F = facetter(robotter, hjaelp, i18n);

  const klasseOrden = (r) => hjaelp.VAEGTKLASSER.indexOf(hjaelp.vaegtklasse(r));
  const vaegt = (r) => {
    const p = r.felter?.egenvaegt;
    if (!p || typeof p === 'string' || typeof p.vaerdi === 'string') return Infinity;
    const v = centralVaerdi(p);
    return typeof v === 'number' ? (p.enhed === 'g' ? v / 1000 : v) : Infinity;
  };
  const sorteret = [...robotter].sort((a, b) => klasseOrden(a) - klasseOrden(b)
    || vaegt(a) - vaegt(b) || String(a.navn).localeCompare(String(b.navn), sprog));

  /* --- L44: SORTERINGENS RANGTAL ------------------------------------------
     Sorteringen sker i CSS med `order` paa gitterets celler, saa den virker
     UDEN JavaScript - samme krav og samme fejlvej som filtrene ovenfor.
     Hvert kort baerer sine rangtal som CSS-variable; to genererede regler
     (se hovedStil) skifter mellem dem. Det er to regler i alt, ikke én pr.
     robot, fordi var() kan staa i `order`.

     `order` virker inden for ÉN gridbeholder. Kataloget har fire - én pr.
     sal/vaegtklasse (spor/lysbyg's struktur, som ikke roeres her) - saa
     sorteringen ordner kortene INDEN FOR hver vaegtklasse. Salene selv
     staar altid i samme raekkefoelge. Det staar ordret i
     katalog_sortering_forklaring, saa kontrollen ikke lover mere end den goer.

     Rangtallene regnes GLOBALT (1..N) og ikke pr. sal. Det er ligegyldigt
     for resultatet - `order` sammenligner kun celler i samme beholder, og en
     global, monoton raekke bevarer den indbyrdes orden inden i hver sal -
     og det holder bogfoeringen paa ét sted. */
  const naevner = ctx.naevnere?.[0];
  const rang = (liste) => new Map(liste.map((r, i) => [r.slug, i + 1]));

  // Taethed: flest udfyldte felter FOERST. Uafgjort afgoeres af navnet, saa
  // raekkefoelgen er stabil mellem to byg af samme data.
  const rangTaethed = rang([...robotter].sort((a, b) => {
    const ta = taethed(a, naevner, ctx.d4).udfyldt;
    const tb = taethed(b, naevner, ctx.d4).udfyldt;
    return tb - ta || String(a.navn).localeCompare(String(b.navn), sprog);
  }));
  const rangAlfa = rang([...robotter]
    .sort((a, b) => String(a.navn).localeCompare(String(b.navn), sprog)));

  /* --- OMFANGSMAERKET (P0, 28. aug 2026) ---------------------------------
     Hver statisk taeller paa siden faar en lille efterstilling, der siger
     HVAD den taeller. Den staar `hidden` i hvile og vises kun, naar et filter
     er slaaet til OG JavaScript ikke koerer (reglerne i generator.css §2b).

     Hvorfor overhovedet: tallene er regnet ved BYGGETIDEN over hele
     kataloget. Uden JavaScript kan de ikke regnes om, naar laeseren filtrerer
     - :has() kan taende og slukke kort, men kan ikke taelle dem. Et tal, der
     staar uaendret ved siden af et udvalg, det ikke laengere beskriver, er en
     paastand uden daekning; sidens positionering nr. 1 er, at hvert tal har
     en kilde. "18" bliver derfor til "18 af 77", og "18 robotter" til
     "18 robotter i kataloget" - sandt i enhver filtertilstand.

     Teksten staar i HTML og ikke i CSS' content: den skal oversaettes gennem
     de samme sprogfiler som alt andet, kunne markeres og kopieres, og kunne
     ses af de tests, der laeser byggets synlige tekst. */
  const alle = robotter.length;
  const omfangAlle = `<span class="taeller-omfang" data-omfang hidden> ${esc(tf('taeller_af_alle', { n: alle }))}</span>`;
  const omfangKatalog = `<span class="taeller-omfang" data-omfang hidden> ${esc(t('taeller_i_kataloget'))}</span>`;

  /* Salens taelling boejes. Den var hidtil altid flertal ("1 robotter"), fordi
     den kun blev skrevet ved byggetiden, hvor ingen sal har ét kort. Naar
     JavaScript regner den om ved hvert filterklik, bliver ental den normale
     tilstand og ikke et kantstilfaelde - saa formen skal findes, og den skal
     findes ÉT sted, som baade bygget og browseren laeser. `data-*`-parret
     nedenfor er det sted: sprogfilerne ejer ordene, katalog.js kopierer dem
     aldrig. */
  const antalKort = (n) => (n === 1 ? t('antal_kort_en') : tf('antal_kort', { n }));

  /* --- filterfelterne --- */
  const grupper = F.map((f) => `<fieldset class="facet">
<legend class="etiket">${esc(f.etiket)}</legend>
<div class="filtre">
${f.liste.map((v) => {
    const id = `f-${f.navn}-${nogle(v)}`;
    return `<input type="checkbox" class="f-${attr(f.navn)}" id="${attr(id)}" name="${attr(f.navn)}" value="${attr(v)}">`
      + `<label for="${attr(id)}">${esc(f.tekst(v))}`
      + `<span class="antal"><span class="antal__tal">${esc(String(f.antal.get(v)))}</span>${omfangAlle}</span></label>`;
  }).join('\n')}
</div>
</fieldset>`).join('\n');

  /* --- kortet indpakket i ét lag pr. facet - uaendret pr.-kort mekanik,
     kaldes nu pr. vaegtklassegruppe (se sale-loekken nedenfor) i stedet for
     ét langt kald over hele `sorteret`. --- */
  // Loebende taeller paa tvaers af ALLE sale (vaegtklasser), ikke nulstillet
  // pr. sal - de foerste EAGER_KORT_ANTAL kort paa SIDEN (uanset hvilken sal
  // de staar i) er dem, en besoegende ser foer scroll (spor/billedramme,
  // 26. aug 2026: maalt til 4 med maalevaerktoej/_agent-raekke.mjs).
  let kortIndeks = 0;
  const kortHTML = (r) => {
    const sogetekst = [
      r.navn, r.producent, r.producentland, hjaelp.land(r.producentland),
      ipVaerdi(r), t('vaegtklasse_' + hjaelp.vaegtklasse(r)),
      ...hjaelp.anvendelse(r).vaerdier.map((v) => (v === 'ikke_oplyst' ? T.tilstand_ikke_oplyst : t('anvendelse_' + v))),
    ].join(' ').toLowerCase();

    const aabne = F.map((f, i) => {
      const vaerdier = f.vaerdier(r).join(' ');
      // Rangtallene staar paa det YDERSTE lag og arves ned til .kort, som er
      // gitterets egentlige celle (lagene er display:contents). Ét sted at
      // skrive dem, uanset hvor mange facetlag der ligger imellem.
      const ekstra = i === 0
        ? ` data-sog="${attr(sogetekst)}"`
          + ` style="--o-taethed:${rangTaethed.get(r.slug)};--o-alfa:${rangAlfa.get(r.slug)}"`
        : '';
      return `<div class="lag lag-${attr(f.navn)}" data-${attr(f.navn)}="${attr(vaerdier)}"${ekstra}>`;
    }).join('');
    const eager = kortIndeks < hjaelp.EAGER_KORT_ANTAL;
    kortIndeks += 1;
    return `${aabne}\n${hjaelp.kort(r, { op: '../../', til: '', eager })}\n${'</div>'.repeat(F.length)}`;
  };

  /* --- SALENE. Fire vaegtklassegrupper, romertal I-IV, hver med sin egen
     AEGTE optaelling (liste.length) - se filhovedets note. `sorteret` er
     allerede ordnet efter klasse foerst (klasseOrden), saa en simpel
     partition efter vaegtklasse bevarer den eksisterende vaegtorden inden
     for hver sal, uden at sortere igen. */
  const efterKlasse = new Map(hjaelp.VAEGTKLASSER.map((k) => [k, []]));
  for (const r of sorteret) efterKlasse.get(hjaelp.vaegtklasse(r)).push(r);

  /* `data-sal` paa ALLE en sals dele - indeksposten, hovedet, forklaringen og
     gitteret. Salen er fire soeskende i DOM'en, ikke ét element (og maa blive
     ved med at vaere det: `.gitter + .sal`s luftregel i generator.css laeser
     netop den soeskenderaekke). Ét faelles attribut giver alligevel ÉN
     vaelger, der tager hele salen med - baade for de genererede
     tomhedsregler nedenfor og for JavaScript. */
  const saleHTML = hjaelp.VAEGTKLASSER.map((klasse, i) => {
    const liste = efterKlasse.get(klasse);
    if (!liste.length) return '';
    const forklaring = klasse === 'ikke_oplyst' ? t('vaegtklasse_ikke_oplyst_forklaring') : '';
    const s = attr(klasse);
    return `<div class="sal" data-sal="${s}">
<span class="sal__nr" aria-hidden="true">${esc(ROMERTAL[i])}</span>
<h2 class="t-h3 sal__titel" id="h-${attr(klasse)}">${esc(t('vaegtklasse_' + klasse))}</h2>
<span class="sal__antal figur" data-antal-flere="${attr(t('antal_kort'))}" data-antal-en="${attr(t('antal_kort_en'))}"><span class="antal__tal">${esc(antalKort(liste.length))}</span>${omfangKatalog}</span>
</div>
${forklaring ? `<p class="t-lille sal__forklaring" data-sal="${s}">${esc(forklaring)}</p>` : ''}
<div class="gitter" data-sal="${s}">
${liste.map(kortHTML).join('\n')}
</div>`;
  }).join('\n');

  /* --- L44: TOMMELINDEKSET ------------------------------------------------
     Rene HTML-ankre, ingen JavaScript. Maalene er salenes egne <h2 id="h-...">,
     som allerede fandtes - indekset opfinder ingen nye id'er.

     KUN sale med mindst ét kort kommer med. saleHTML springer en tom
     vaegtklasse over (`if (!liste.length) return ''`), saa et anker til den
     ville pege paa et id, der ikke bliver skrevet - et doedt internt link,
     som linktjek.mjs ville fange. Filtret her er derfor ikke pynt: det er
     den samme betingelse som salens egen, laest fra den samme Map. */
  const indeksPoster = hjaelp.VAEGTKLASSER
    .map((klasse) => ({ klasse, liste: efterKlasse.get(klasse) }))
    .filter((p) => p.liste.length);

  const tommelindeks = indeksPoster.length ? `<nav class="tommelindeks" aria-labelledby="tommel-h">
<h2 class="etiket" id="tommel-h">${esc(t('tommelindeks_titel'))}</h2>
<ul class="tommelindeks__liste">
${indeksPoster.map(({ klasse, liste }) => `<li data-sal="${attr(klasse)}"><a href="#h-${attr(klasse)}">`
    + `${esc(t('vaegtklasse_' + klasse))}`
    + `<span class="antal"><span class="antal__tal">${esc(String(liste.length))}</span>${omfangAlle}</span></a></li>`).join('\n')}
</ul>
</nav>` : '';

  /* --- EU-pointen. Staar én gang, ikke paa hvert kort. --- */
  const udenCe = robotter.filter((r) => hjaelp.ceTilstand(r) === 'ikke_oplyst').length;

  return `<div class="rum">
<div class="katalog-hoved">
<h1 class="t-h1">${esc(T.katalog_titel)}</h1>
<p class="t-broed maal">${esc(tf('forside_lede', { n: robotter.length, p: new Set(robotter.map((r) => r.producent)).size }))}</p>
</div>

<form class="styr" id="styr" action="#alle" method="get">
<div class="styring">
<div class="sog" data-sog="katalog" hidden>
<label class="etiket" for="sog-katalog">${esc(t('katalog_soeg_etiket'))}</label>
<input id="sog-katalog" name="s" type="search" autocomplete="off"
 placeholder="${attr(t('katalog_soeg_pladsholder'))}">
</div>
<fieldset class="katalog-sortering">
<legend class="etiket">${esc(t('katalog_sortering_etiket'))}</legend>
<div class="sortervalg">
${[['vaegt', 'katalog_sortering_vaegt'],
    ['taethed', 'katalog_sortering_taethed'],
    ['alfa', 'katalog_sortering_alfabetisk']]
    .map(([navn, noegle], i) => `<input type="radio" class="f-sort" id="sort-${attr(navn)}" name="sort"`
      + ` value="${attr(navn)}"${i === 0 ? ' checked' : ''}>`
      + `<label for="sort-${attr(navn)}">${esc(t(noegle))}</label>`).join('\n')}
</div>
</fieldset>
</div>
<p class="t-mikro sortering-hjaelp">${esc(t('katalog_sortering_forklaring'))}</p>

<div class="facetter">
${grupper}
</div>
<p class="t-mikro facet-hjaelp">${esc(t('filter_uden_js'))}</p>
<p class="facet-ryd"><a class="videre videre--stille" data-ryd href="#alle">${esc(t('filter_vis_alle'))}</a></p>
<p class="t-lille kort-legende">${esc(t('kort_legende'))}</p>

${tommelindeks}

<p class="t-mikro facet-omfang" data-omfang-note hidden>${esc(t('filter_omfang_statisk'))}</p>

<div id="alle">
${saleHTML}
</div>

<p class="tomt" data-tomt hidden role="status">
<span data-tomt-grund="soeg">${esc(t('soeg_ingen_traef'))}</span>
<span data-tomt-grund="filter" hidden>${esc(t('filter_ingen_traef'))}</span>
<a class="videre videre--stille tomt__ryd" data-ryd href="#alle">${esc(t('filter_vis_alle'))}</a>
</p>
</form>

<p class="t-lille sektion-note">${esc(tf('eu_pointe', { n: udenCe, m: robotter.length }))}</p>
${hjaelp.tegnforklaring()}
</div>`;
}
