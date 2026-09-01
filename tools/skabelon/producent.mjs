/**
 * tools/skabelon/producent.mjs — producentsiden. 12 af dem.
 *
 * Siden har ét job, som robotsiden ikke kan goere: at vise CE-oplysningen
 * SAMLET for hele producentens modelrække. Det er her en indkoeber ser, at
 * Unitree har 12 modeller i kataloget, og at ingen af dem naevner CE. Ét
 * "ikke oplyst" er en tom rubrik; tolv under hinanden er en oplysning om
 * producenten.
 *
 * L32 (24. aug 2026): EU-KOLONNEN VAR EN TABEL MED FIRE FELTER (ce_oplyst,
 * eu_tilgaengelig, eu_service, leveringstid), ét pr. model. De tre sidste er
 * fjernet fra skemaet — stod ikke_oplyst paa alle 55 robotter — og med kun
 * ét felt tilbage er en matrix ikke laengere den rigtige form. euSaetning()
 * nedenfor erstatter tabellen med ÉN linje, beregnet paa samme maade som
 * forsidens EU-fund (forside.mjs), bare talt over denne producents modeller
 * i stedet for hele kataloget.
 *
 * ---------------------------------------------------------------------------
 * KONTRAKTEN (laast — side.mjs skrives af en anden agent)
 *
 *   import { skal, hjaelp } from './side.mjs';
 *   export function render(ctx)     // HTML-streng til <main>
 *   ctx = { robot, producent, i18n, sprog, url, hjaelp }
 *
 * `skal` importeres, fordi kontrakten kraever det, men kaldes ikke — se
 * begrundelsen i robot.mjs' hoved.
 *
 * ctx.producent's form er ikke i kontrakten. Filen laeser den taalmodigt:
 *   { navn, slug, land|producentland, by|producentby,
 *     modeller|robotter|robots: [robotdokument, …] }
 * og falder tilbage paa ctx.robotter, hvis modellerne ligger der.
 * Ligger modellerne ingen af stederne, tegnes siden med et TOMT modelafsnit og
 * en synlig grund — den maa ikke se ud, som om producenten ingen modeller har.
 *
 * VAERKTOEJET deles med robot.mjs frem for at blive skrevet af igen. Tre
 * haandskrevne kopier af `esc` og `T` divergerer ved den fjerde aendring.
 * Naar side.mjs staar faerdig, hoerer de hjemme DER, ikke i robot.mjs.
 *
 * L25 — DET DER IKKE STAAR PAA SIDEN: der staar intet om, at koeberen selv
 * bliver importoer ved direkte koeb fra Asien. Paastanden er droppet, fordi der
 * ikke findes en primaerkilde for import til eget brug. CE vises som
 * "oplyst / ikke oplyst", ALDRIG som "har CE / har ikke CE". FUND-vest viser
 * hvorfor: MAB Robotics er polsk producent og skriver intet om CE, fordi det er
 * en selvfoelge for dem. Havde vi skrevet "har ikke CE", havde vi loejet.
 *
 * HJEMSTED er et felt som ethvert andet. Rainbow Robotics er Sejong-si; Ghost
 * Robotics oplyser ingen hjemby noget sted, og Boston Dynamics' YAML siger
 * `ikke_oplyst`. To hjembyer blev tidligere skrevet ud af hukommelsen og maatte
 * rettes (STATUS.md L10). Derfor: citér, eller skriv "ikke oplyst".
 *
 * NYE i18n-NOEGLER, denne fil kraever:
 *   producent_modeller · producent_modeller_titel · producent_hjemsted ·
 *   producent_ingen_modeller · producent_alle · tabel_model ·
 *   producent_model_en (ental — "1 modeller" er ikke dansk)
 *
 * EU-saetningen (L32) genbruger forsidens noegler i stedet for at opfinde nye:
 * eu_titel · forside_eu_tal · forside_eu_paastand. Se euSaetning() nedenfor.
 */

import { skal, hjaelp } from './side.mjs';
import { tilstandAf } from '../skema.mjs';
import {
  esc, T, TD, flet, sti, kraevHjaelp,
} from './robot.mjs';

/** EU-feltet/felterne, skemaet baerer. L32 (24. aug 2026) fjernede tre af de
 *  fire — eu_tilgaengelig, eu_service, leveringstid — og efterlod ét. Ikke
 *  slettet: robot.mjs' egen EU_FELTER holder samme form, og euSaetning()
 *  nedenfor slaar op i den frem for at haardkode 'ce_oplyst' to steder. */
const EU_FELTER = ['ce_oplyst'];

/* KORT_FELTER er vaek (spor/kort, 31. aug 2026). Listen var producentkortets
   fire tal, og dens egen kommentar bar advarslen: "katalog.mjs har den samme
   liste. Aendres den ét sted, ser laeseren ét saet tal paa katalogsiden og et
   andet her." Den advarsel er nu indfriet paa den eneste maade, der holder -
   ikke ved at synkronisere to lister, men ved at kortet holder op med at vise
   tal. TYPESKILT-kortet er billede, producent og produktnavn; tallene bor paa
   robotsiden, hvor de har plads til deres enheder og kildemaerker. */

/* ------------------------------------------------------------------ hjaelp */

/**
 * Hjemstedet, naar producentfilen ikke selv oplyser det. Det maa IKKE plukkes
 * fra den foerste model i listen: producentby staar paa 9 af Unitrees filer og
 * mangler paa de oevrige, og "den foerste" er da et lotteri. Derfor:
 * er alle modellernes oplyste byer den samme, er den byen. Er de uenige — eller
 * er der ingen — staar der "ikke oplyst". Vi gaetter aldrig en hjemby; to blev
 * tidligere skrevet ud af hukommelsen og maatte rettes (STATUS.md L10).
 */
function hjemstedAf(modeller) {
  const byer = new Set();
  for (const m of modeller) {
    const b = m?.producentby;
    if (b === undefined || b === null || b === '') continue;
    if (tilstandAf(b)) continue;
    byer.add(String(b));
  }
  return byer.size === 1 ? [...byer][0] : undefined;
}

/** "{n} modeller", men aldrig "1 modeller": ental har sin egen noegle. */
function modelTal(i18n, n) {
  return n === 1 ? T(i18n, 'producent_model_en') : flet(T(i18n, 'producent_modeller'), { n });
}

/** Modellerne, uanset hvad noeglen hedder. */
function modellerAf(ctx) {
  const p = ctx?.producent ?? {};
  const m = p.modeller ?? p.robotter ?? p.robots ?? ctx?.robotter ?? ctx?.modeller ?? [];
  return Array.isArray(m) ? m.filter(Boolean) : [];
}

/** Tallet i et felt, hvis det er et tal. Bruges KUN til at sortere — ikke til
 *  at vise. Et interval sorteres paa sin nedre graense; intervallet bevares
 *  uroert i visningen (regel 5: "20~25 cm" er ikke 22,5). */
function sorteringstal(post) {
  if (!post || typeof post !== 'object') return null;
  if (tilstandAf(post.vaerdi)) return null;
  if (typeof post.vaerdi === 'number') return post.vaerdi;
  if (typeof post.min === 'number') return post.min;
  return null;
}

/** Letteste foerst, ukendt vaegt sidst. Vaegt er katalogets akse (L27), og en
 *  producentside, der sorterer anderledes end forsiden, foeles som et andet sted. */
function sorterModeller(modeller) {
  return [...modeller].sort((a, b) => {
    const va = sorteringstal(a?.felter?.egenvaegt);
    const vb = sorteringstal(b?.felter?.egenvaegt);
    if (va === null && vb === null) return String(a?.navn ?? '').localeCompare(String(b?.navn ?? ''), 'da');
    if (va === null) return 1;
    if (vb === null) return -1;
    if (va !== vb) return va - vb;
    return String(a?.navn ?? '').localeCompare(String(b?.navn ?? ''), 'da');
  });
}

/**
 * CE-opgoerelsen. TRE tal, ikke to: oplyst ja, oplyst nej, og intet oplyst.
 * De tre maa ikke kollapse — det er praecis CLAUDE.md begraensning 5 paa
 * producentniveau. Maalt over kataloget: 2 modeller siger ja, 2 siger nej,
 * 42 siger intet.
 */
function ceOpgoerelse(modeller) {
  let ja = 0; let nej = 0; let ukendt = 0;
  for (const m of modeller) {
    const p = m?.felter?.[EU_FELTER[0]];
    if (p === undefined || typeof p === 'string') { ukendt++; continue; }
    if (tilstandAf(p.vaerdi) === 'nej') { nej++; continue; }
    if (tilstandAf(p.vaerdi)) { ukendt++; continue; }
    if (p.vaerdi === true) ja++;
    else if (p.vaerdi === false) nej++;
    else ukendt++;
  }
  return { ja, nej, ukendt, i_alt: modeller.length };
}

/* ------------------------------------------------------------------ toppen */

function top(ctx, modeller) {
  const { i18n } = ctx;
  const p = ctx.producent ?? {};
  const foerste = modeller[0] ?? {};
  const navn = p.navn ?? foerste.producent ?? '';
  const landVaerdi = p.land ?? p.producentland ?? foerste.producentland ?? null;
  const byVaerdi = p.by ?? p.producentby ?? hjemstedAf(modeller);

  // Hjemstedet er et felt som ethvert andet. Er det ikke oplyst, siger vi det
  // med samme visuelle sprog som alle andre huller — ikke ved at lade linjen
  // vaere tom, og aldrig ved at gaette en by.
  const byTilstand = byVaerdi === undefined ? 'ikke_oplyst' : tilstandAf(byVaerdi);
  const byDel = byTilstand
    ? ctx.__H.tilstand(byTilstand, i18n)
    : `<span class="hjemsted">${esc(byVaerdi)}</span>`;

  return `<header class="producent-top">
<h1 class="t-hero">${esc(navn)}</h1>
<dl class="producent-fakta">
${landVaerdi ? `<div><dt class="etiket">${esc(T(i18n, 'tabel_land'))}</dt><dd>${esc(TD(i18n, 'land_' + landVaerdi, landVaerdi))}</dd></div>` : ''}
<div><dt class="etiket">${esc(T(i18n, 'producent_hjemsted'))}</dt><dd>${byDel}</dd></div>
<div><dt class="etiket">${esc(T(i18n, 'producent_modeller_titel'))}</dt><dd class="figur">${esc(String(modeller.length))}</dd></div>
</dl>
</header>`;
}

/* ------------------------------------------------------------- EU-saetningen */

/**
 * EU-saetningen. FOER L32 (24. aug 2026) var det her en tabel: fire EU-felter
 * gange N modeller, en matrix der laeses paa tvaers. Med kun ét felt tilbage
 * (ce_oplyst — se EU_FELTER) er en matrix ikke laengere den rigtige form; én
 * raekke i en tabel er en saetning, der har taget en tabels plads.
 *
 * Formen genbruger forsidens EU-fund (forside.mjs' euFund, samme i18n-noegler
 * forside_eu_tal og forside_eu_paastand, samme CSS-klasser eu-fund-linje/
 * eu-fund-tal) fremfor at opfinde en producent-specifik variant — kun tallene
 * bag "{n} af {m}" skifter, fra hele kataloget til denne producents modeller.
 */
function euSaetning(ctx, modeller) {
  const { i18n } = ctx;

  if (!modeller.length) {
    return `<section class="sektion" aria-labelledby="eu-h">
<div class="sektion-hoved"><h2 class="t-h2" id="eu-h">${esc(T(i18n, 'eu_titel'))}</h2></div>
<p class="t-lille">${esc(T(i18n, 'producent_ingen_modeller'))}</p>
</section>`;
  }

  const t = ceOpgoerelse(modeller);
  return `<section class="sektion" aria-labelledby="eu-h">
<div class="sektion-hoved"><h2 class="t-h2" id="eu-h">${esc(T(i18n, 'eu_titel'))}</h2></div>
<p class="eu-fund-linje">${ctx.__H.ikon('i-ce', 'ikon ikon--lille')}<b class="eu-fund-tal">${esc(flet(T(i18n, 'forside_eu_tal'), { n: t.ja, m: t.i_alt }))}</b><span>${esc(T(i18n, 'forside_eu_paastand'))}</span></p>
</section>`;
}

/* ---------------------------------------------------------------- kortene */

/* kompaktStribe() og anvendelseMaerker() er vaek (spor/kort, 31. aug 2026).

   De var producentkortets fire tal og dets anvendelsesmaerker - og hver af dem
   var en HAANDKOPI af noget, der ogsaa fandtes i side.mjs og robot.mjs. Begge
   funktioners egne kommentarer var i praksis fejlrapporter om netop den kopi:
   kompaktStribe() havde sin egen "nul oplyste tal"-prosagren, som gav 8 filer
   et andet udseende end katalog og forside (spor/instrument2), og siden sit
   eget kildemaerke uden `hvorhen`, som gav ankre uden maal (KRITIK-4 fund 2).
   anvendelseMaerker() bar noten om "tre parallelle implementeringer af samme
   maerke".

   TYPESKILT-kortet fjerner grundlaget for begge fejl frem for at rette dem en
   tredje gang: kortet viser billede, producent og produktnavn, saa der er
   hverken tal at fejlformatere eller maerker at holde synkroniseret. Tallene,
   deres enheder og deres kildemaerker staar paa robotsiden. */

/** Modelkortet. Ét kald til den FAELLES kort() i side.mjs - ikke en fjerde
 *  haandkopi. `op` er den samme sti, robot.mjs' opAf() ville have regnet:
 *  producentsider ligger i <sprog>/producenter/<slug>/, altsaa tre niveauer
 *  nede (maalt paa den byggede side: ../../../billeder/...).
 *
 *  `billedeKilde` er producentsidens eget opslag i ctx.billeder. Det SKAL
 *  vinde over robottens eget felt - ellers viser minikortet et andet billede
 *  end det, siden har valgt. Det var praecis den overskrivning, billedled()
 *  lavede via ctx.billede, og den er baaret med over.
 *
 *  `samling: false` (spor/oprydknap, 1. sep 2026): producentsiderne
 *  indlaeser intet JavaScript (maalt), saa "Tilfoej til sammenligning"-
 *  knappen ville staa `hidden` for evigt - doed markup, ikke en fungerende
 *  knap i venteposition. Se kort()s egen kommentar i side.mjs for hvorfor
 *  forsidens kald IKKE faar samme parameter: dens knap virker rent faktisk,
 *  fordi forsiden henter katalog.js. */
function modelkort(ctx, m) {
  return ctx.__H.kort(m, {
    op: ctx?.url?.op || '../../../',
    href: sti(ctx, 'robot', m.slug),
    billedeKilde: ctx.billeder?.[m.slug] ?? m.billede ?? null,
    samling: false,
  });
}

function modelafsnit(ctx, modeller) {
  const { i18n } = ctx;
  if (!modeller.length) {
    return `<section class="sektion" aria-labelledby="modeller-h">
<div class="sektion-hoved"><h2 class="t-h2" id="modeller-h">${esc(T(i18n, 'katalog_titel'))}</h2></div>
<p class="t-lille">${esc(T(i18n, 'producent_ingen_modeller'))}</p>
</section>`;
  }
  return `<section class="sektion" aria-labelledby="modeller-h">
<div class="sektion-hoved">
<h2 class="t-h2" id="modeller-h">${esc(modelTal(i18n, modeller.length))}</h2>
</div>
<p class="t-lille kort-legende">${esc(T(i18n, 'kort_legende_foto'))}</p>
<div class="net net--fritstaaende">
${modeller.map((m) => modelkort(ctx, m)).join('\n')}
</div>
</section>`;
}

/** Alle producenter, hvis bygget giver os listen. Uden den springes afsnittet
 *  over — en liste med ét navn ville se ud, som om der kun var én producent. */
function alleProducenter(ctx) {
  const { i18n } = ctx;
  const alle = Array.isArray(ctx.producenter) ? ctx.producenter : [];
  if (alle.length < 2) return '';
  const her = ctx.producent?.slug;
  const punkter = alle.map((p) => {
    const n = p.antal ?? (Array.isArray(p.modeller) ? p.modeller.length
      : Array.isArray(p.robotter) ? p.robotter.length : null);
    const navn = p.slug === her
      ? `<span class="pnavn" aria-current="page">${esc(p.navn)}</span>`
      : `<a class="pnavn" href="${esc(sti(ctx, 'producent', p.slug))}">${esc(p.navn)}</a>`;
    return `<li>${navn}` +
      (p.land ? `<span class="pland">${esc(TD(i18n, 'land_' + p.land, p.land))}</span>` : '') +
      (n === null ? '' : `<span class="pantal figur">${esc(modelTal(i18n, n))}</span>`) +
      `</li>`;
  }).join('\n');
  return `<section class="sektion" aria-labelledby="alle-h">
<div class="sektion-hoved"><h2 class="t-h2" id="alle-h">${esc(flet(T(i18n, 'producent_alle'), { n: alle.length }))}</h2></div>
<ul class="prodliste">
${punkter}
</ul>
</section>`;
}

/* ------------------------------------------------------------------ render */

export function render(ctx) {
  const H = ctx?.hjaelp ?? hjaelp;
  kraevHjaelp(H);
  const modeller = sorterModeller(modellerAf(ctx));

  // Kilderne slaas op én gang pr. model, ikke én gang pr. celle. Uden det her
  // ville hjaelp.kilder() blive kaldt 4 x N gange alene til EU-tabellen.
  const kilder = new Map();
  for (const m of modeller) {
    try { kilder.set(m.slug, H.kilder(m) ?? []); } catch { kilder.set(m.slug, []); }
  }

  const arbejde = { ...ctx, __H: H, __fra: 'producent', __kilder: kilder };
  const { i18n } = arbejde;

  return `<main class="side" id="hoved">
<div class="rum">
<p class="retur"><a href="${esc(sti(arbejde, 'katalog'))}">${esc(T(i18n, 'til_katalog'))}</a></p>

<article class="producentside">
${top(arbejde, modeller)}
${euSaetning(arbejde, modeller)}
${modelafsnit(arbejde, modeller)}
${alleProducenter(arbejde)}
</article>
</div>
</main>
`;
}

/* ----------------------------------------------------------------- indeks */

/**
 * Landefordelingen: producenter og modeller grupperet paa producentens land.
 * Et land, der ikke er oplyst (falsy, eller en tilstandsvaerdi som
 * "ikke_oplyst" — samme vagt som hjemstedAf() ovenfor), taeller IKKE med i
 * fordelingen: vi kan ikke sige, hvilket land der har "flest", naar landet
 * ikke er kendt. Det taeller stadig med i totalerne (n af {alle.length}) —
 * kun selve fordelingen udelader det.
 */
function landefordeling(alle) {
  const perLand = new Map();
  for (const p of alle) {
    if (!p.land || tilstandAf(p.land)) continue;
    const noegle = String(p.land);
    const t = perLand.get(noegle) ?? { producenter: 0, modeller: 0 };
    t.producenter += 1;
    t.modeller += (typeof p.antal === 'number' ? p.antal : 0);
    perLand.set(noegle, t);
  }
  return perLand;
}

/**
 * Den beregnede iagttagelse (spor/producent, punkt 2, 26. aug 2026).
 * Producentsiden har hele fordelingen liggende foran sig og sagde hidtil
 * intet om den — modsat forsidens CE-linje (forside.mjs' euFund) og
 * katalogets vaegtklasse-sale, der begge tør skrive et stort udledt tal.
 * Formen laaner CE-linjens: ét tal, en noegtern konstatering, ALDRIG en dom
 * (begraensning 6 — "kinesisk dominans" er en dom, "14 af 25 er fra Kina"
 * er et tal). Derfor "fra {land}", ikke et demonym-adjektiv ("kinesisk") -
 * et adjektiv skal boejes rigtigt for hvert land, et landenavn skal ikke.
 *
 * Landet med flest producenter findes ved LOEB over `alle` ved byggetid,
 * ALDRIG skrevet i haanden — se D7/L30-faelden i CLAUDE.md: et haardkodet
 * 14/25/62/77 her ville vaere fundet FLYTTET, ikke løst, og ville staa
 * forkert i det oejeblik kataloget fik en 78. robot eller en 26. producent.
 * Uafgjort (samme producentantal) afgoeres alfabetisk paa landenavnet, saa
 * resultatet er deterministisk uden at vaere en redaktionel rangering.
 */
function producentSaetning(ctx, alle) {
  const { i18n } = ctx;
  const perLand = landefordeling(alle);
  if (perLand.size === 0) return '';

  let bedst = null;
  for (const [land, tal] of perLand) {
    const bedreEnd = !bedst
      || tal.producenter > bedst.tal.producenter
      || (tal.producenter === bedst.tal.producenter && land.localeCompare(bedst.land, 'da') < 0);
    if (bedreEnd) bedst = { land, tal };
  }

  const totalProducenter = alle.length;
  const totalModeller = alle.reduce((s, p) => s + (typeof p.antal === 'number' ? p.antal : 0), 0);
  const landNavn = esc(TD(i18n, 'land_' + bedst.land, bedst.land));
  const saetning = flet(T(i18n, 'producent_fordeling_saetning'), {
    n: bedst.tal.producenter,
    m: totalProducenter,
    land: landNavn,
    x: bedst.tal.modeller,
    y: totalModeller,
  });
  return `<p class="t-broed producent-fordeling">${saetning}</p>`;
}

/**
 * Producentindekset — siden paa /<sprog>/producenter/, F1's manglende doer ind.
 * Ét led pr. producent: navn (link), land og antal modeller i kataloget.
 * Ingen vurdering og ingen raekkefoelge ud over alfabetet: en sortering efter
 * "stoerst foerst" ville vaere en redaktionel skala, vi ikke har metode til.
 *
 * L(spor/producent, 26. aug 2026), punkt 1: raekken var FOER en <dl>/.raekke
 * (system.css' delte 2-kolonne-komponent) med land og modeltal klistret sammen
 * i én <dd>-streng ("Kina 13 modeller") — to tal, der ikke flugtede lodret, og
 * en side, der brugte under halvdelen af sin bredde. .raekker/.raekke ejes af
 * et andet spor (system.css), saa den genbruges IKKE laengere her; en rigtig
 * <table> med tre <td> giver tre selvstaendige kolonner, kan style modeltallet
 * for sig (font-variant-numeric: tabular-nums via .figur) og fylder .rum's
 * fulde bredde. Markup'en bruger .prod-tabel (assets/generator.css, afsnit 9h)
 * plus .figur, som allerede findes i system.css og ikke er min at redefinere.
 *
 * Linket er `<slug>/` og ikke sti(ctx, 'producent', …): siden ligger selv i
 * producenter/, saa barnelinket kan ikke pege forkert, heller ikke uden ctx.url.
 *
 * ---------------------------------------------------------------------------
 * MODELKOLONNEN (spor/prodindeks, 1. sep 2026)
 *
 * JPK, 1. sep: "masser af plads, saa modelnavne kunne fint staa efter antal
 * til hoejre". Maalt paa den byggede side ved 1440 px: producentnavnene
 * sluttede omkring 155 px, "Land" begyndte foerst omkring 1130 px — cirka
 * 975 px tom midte, fordi tre kolonner blev strakt over hele bredden.
 *
 * KOLONNEORDENEN ER AENDRET, ikke bare udvidet: tallet er flyttet fra sidste
 * plads ind FOER navnene, saa det staar klods op ad den raekke, det taeller.
 * Det er svaret paa 13-og-1-problemet. Unitree har 13 modeller, ti
 * producenter har 1. Med tallet som anker laeses begge raekker rigtigt:
 * "13  A1, A2-W, …" er en optaelling, og "1  Spot" er en KOMPLET liste, ikke
 * en raekke der mangler noget. Stod tallet 800 px vaek ude til hoejre, kunne
 * laeseren ikke se forskel paa "én model" og "resten faldt ud".
 *
 * DER AFKORTES IKKE, og det er en MAALING, ikke en fornemmelse. Briefet
 * formodede, at de 13 var det brede tilfaelde; det er de ikke. Maalt over
 * alle 25 producenter er den laengste navneraekke GENISOM AI's NI modeller
 * paa 131 tegn ("Gangben L2-W Ultra, Tongchui M1 Pro, …"), mens Unitrees 13
 * kun fylder 73 tegn, fordi navnene er korte koder (A1, B2-W, Go2). Galileos
 * seks fylder 28. Belastningen er altsaa TEGNLAENGDE, ikke modelantal — og
 * 131 tegn er der plads til. En "+ 6 flere"-afkortning ville derfor tilfoeje
 * en risiko for at se ud, som om en producent har faerre modeller, uden at
 * loese noget. Vokser kataloget, saa en raekke bliver for lang, ombryder
 * cellen; den lyver ikke.
 *
 * TALLET I "Antal" ER ALTID DET FULDE ANTAL og udledes af p.antal — samme
 * kilde som foer — ALDRIG af navnelistens laengde. De to kan ikke komme fra
 * hinanden, og skulle en fremtidig afkortning alligevel komme, kan den ikke
 * naa tallet.
 *
 * REKKEFOELGEN er sorterModeller() (linje 126) — letteste foerst, ukendt
 * vaegt sidst, samme akse som producentsiden og forsiden. Ikke en ny orden:
 * to steder, der sorterer den samme modelraekke forskelligt, foeles som to
 * forskellige kataloger.
 *
 * SEPARATOREN staar UDEN FOR <a>-teksten: et klikbart komma er en unoejagtig
 * traefflade, og en skaermlaeser ville laese linkets navn med kommaet paa.
 * Den behoever ingen egen klasse — cellen er sat i den daempede --blaek3, og
 * kun linkene loefter sig til fuld --blaek, saa kommaerne traeder tilbage af
 * sig selv.
 *
 * SMALLE SKAERME: kolonnen falder vaek under 900 px (assets/generator.css,
 * blokken "producentindeks"). Begrundelsen er JPK's egen — anmodningen var
 * "masser af plads", og den plads findes ikke ved 390 px. Markup'en bliver
 * staaende, saa tabellen har fire rigtige <th scope="col"> uanset bredde;
 * CSS skjuler den fjerde, og tabellen er ved 390 px praecis den, den var foer
 * dette spor. Modellerne er stadig ét tryk vaek via producentens eget navn.
 */
export function renderIndeks(ctx) {
  const H = ctx?.hjaelp ?? hjaelp;
  const { i18n } = ctx;
  const alle = (Array.isArray(ctx?.producenter) ? ctx.producenter : [])
    .map((p) => ({
      ...p,
      // p.antal !== undefined, IKKE `p.antal ?? …`: `??` behandler et
      // EKSPLICIT `null` (producenten oplyser ikke sit fulde modeltal) som
      // det samme som et helt fravaerende felt og ville regne det ud fra
      // listens laengde alligevel — noejagtig den sammenblanding, "ikke
      // oplyst" / "0" ikke maa lave (begraensning 5). Fundet af spor/
      // prodindeks' 49.3, der satte antal: null og fik "1" tilbage, ikke en
      // tom celle. Rammer ingen af de 25 rigtige producenter i dag —
      // build.mjs saetter aldrig p.antal, saa feltet er altid `undefined`
      // der, aldrig `null` — men reglen skal holde den dag data/
      // manufacturers/ ikke laengere er tom.
      antal: p.antal !== undefined ? p.antal : (Array.isArray(p.modeller) ? p.modeller.length
        : Array.isArray(p.robotter) ? p.robotter.length : null),
    }))
    .sort((a, b) => String(a.navn ?? '').localeCompare(String(b.navn ?? ''), ctx?.sprog ?? 'da'));

  const raekker = alle.map((p) => {
    // Landet er et felt som ethvert andet: mangler det, staar hullet med
    // tilstandens eget sprog — aldrig som en tom plads (begraensning 5).
    const landDel = p.land
      ? esc(TD(i18n, 'land_' + p.land, p.land))
      : (typeof H?.tilstand === 'function' ? H.tilstand('ikke_oplyst', i18n) : '');
    // Antalkolonnen viser TALLET alene. Det kommer fra p.antal og aldrig fra
    // modelnavnenes laengde — se hovedkommentaren: de to maa ikke kunne
    // udledes af hinanden.
    const antalDel = p.antal === null ? '' : esc(String(p.antal));
    // Modelnavnene. Er listen der ikke (producenten kom uden robotter), staar
    // cellen tom frem for at paastaa noget — tallet ved siden af baerer stadig
    // sandheden om, hvor mange modeller producenten har.
    const modeller = sorterModeller(
      Array.isArray(p.modeller) ? p.modeller
        : Array.isArray(p.robotter) ? p.robotter : [],
    );
    const navneDel = modeller
      .filter((m) => m && m.slug)
      .map((m) => `<a href="${esc(sti({ ...ctx, __fra: 'producent' }, 'robot', m.slug))}">${esc(m.navn ?? m.slug)}</a>`)
      .join(', ');
    return `<tr>
<td><a href="${esc(String(p.slug))}/">${esc(p.navn ?? p.slug)}</a></td>
<td>${landDel}</td>
<td class="figur">${antalDel}</td>
<td class="prod-navne">${navneDel}</td>
</tr>`;
  }).join('\n');

  return `<main class="side" id="hoved">
<div class="rum">
<div class="katalog-hoved">
<h1 class="t-h1">${esc(T(i18n, 'nav_producenter'))}</h1>
${producentSaetning(ctx, alle)}
<p class="t-broed maal">${esc(flet(T(i18n, 'producent_alle'), { n: alle.length }))}</p>
</div>
<section class="sektion" aria-labelledby="prodliste-h">
<h2 class="t-h2 kunskaerm" id="prodliste-h">${esc(flet(T(i18n, 'producent_alle'), { n: alle.length }))}</h2>
<div class="prod-tabel-wrap">
<table class="prod-tabel">
<thead>
<tr>
<th scope="col">${esc(T(i18n, 'tabel_producent'))}</th>
<th scope="col">${esc(T(i18n, 'tabel_land'))}</th>
<th scope="col" class="figur">${esc(T(i18n, 'prod_antal'))}</th>
<th scope="col" class="prod-navne">${esc(T(i18n, 'tabel_modeller'))}</th>
</tr>
</thead>
<tbody>
${raekker}
</tbody>
</table>
</div>
</section>
</div>
</main>
`;
}

export default { render, renderIndeks };
