/**
 * tests/dele/56-strimlens-valg.mjs — spor/valgbar, 1. sep 2026.
 * OMSKREVET af spor/uifix, 2. sep 2026 (BRIEF-uifix.md punkt 3): status'
 * `standard`-felt er fjernet HELT, ikke bare tømt. PUNKT 3/3b/3c og PUNKT 4
 * nedenfor testede begge den gamle, delvise standardtilstand (i_produktion +
 * annonceret checked, udgaaet skjult) og er derfor omskrevet fra bunden -
 * ikke slettet, jf. CLAUDE.md "ret assertions, slet dem ikke". PUNKT 1, 2 og
 * 5 proever fortsat sandt og staar uaendret.
 *
 * JPK, ordret (1. sep 2026): "SELECTED-baren viser DISCONTINUED HIDDEN selv
 * om den ikke er valgt. Baren skal KUN vise aktive filtre!"
 * JPK, ordret (2. sep 2026, BRIEF-uifix.md): "Baren paa katalogsiden skal
 * KUN vise de aktive filtre. som standard skal INGEN vaere aktive." - og i
 * interviewet: "lige nu er 'I produktion 68, Annonceret'-aktive. men de
 * vises ikke som chips?"
 *
 * Mekanismen dengang (fejljagt-skillens skridt 3-4, sporet baglaens fra
 * symptomet): Status-facetten havde TRE mulige vaerdier, men kun TO af dem
 * stod i `status.standard` (i_produktion, annonceret var VIST som standard -
 * deres checkbokse var `checked`). Den tredje, "udgaaet", var SKJULT som
 * standard. spor/valgbar rettede DEN synlige del af symptomet (ingen chip
 * for det ALDRIG-naaelige "udgaaet skjult"), men de to AKTIVE afvigelser
 * (i_produktion/annonceret checket) var STADIG usynlige som chips - JPK's
 * 2. sep-interview fangede netop DET som en resterende fejl: "to fejl i én".
 *
 * spor/uifix's rettelse: status har ingen `standard` og intet `mrk` laengere
 * - facetten er nu STRUKTURELT identisk med enhver anden facet (vaegt, ip,
 * land): ingen checkbox er `checked` ved indlaesning, og alle tre vaerdier
 * faar den samme GENERISKE chip-mekanik (almindelig, ikke-inverteret
 * `:has(#id:checked)`), som resten af facetterne allerede brugte. Kataloget
 * viser derfor 77 robotter ved indlaesning, ikke 74.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n56. spor/valgbar: SELECTED-baren viser kun aktive filtre, ikke standardtilstanden');

  const ud = path.join(tmp, 'dist-strimlens-valg');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('56.0: byg giver exit 0', b.status === 0, (b.stderr || '').slice(0, 400));
  if (b.status !== 0) return;

  /* STIEN FLYTTEDE, ikke testen. Se noten i tests/dele/48 - katalogsiden bor
     paa sprogroden efter L72, og denne fil blev flettet til main efter
     spor/oversigt grenede. Paastandene er uaendrede. */
  const laesHtml = (sprog) => fs.readFileSync(path.join(ud, sprog, 'index.html'), 'utf8');
  const i18nDa = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'da.json'), 'utf8'));
  const i18nEn = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'en.json'), 'utf8'));

  for (const [sprog, i18n] of [['da', i18nDa], ['en', i18nEn]]) {
    const html = laesHtml(sprog);

    /* ==================================================================
       PUNKT 1: "valg--standard" findes slet ikke laengere. Det er ikke nok
       at DAEMPE stilen paa en chip, ingen har valgt - den skal ikke staa i
       en bar, der hedder "valgte filtre", overhovedet.
       ================================================================== */
    const antalStandardKlasse = (html.match(/valg--standard/g) || []).length;
    ok(`56.1.${sprog}: klassen "valg--standard" findes 0 gange (fandt ${antalStandardKlasse})`,
      antalStandardKlasse === 0, html.match(/.{0,60}valg--standard.{0,60}/)?.[0]);

    /* ==================================================================
       PUNKT 2: den konkrete bug er vaek - hverken chippen for "udgaaet skjult"
       eller dens tilhoerende :has()-regel findes, i NOGEN form. Det er den
       vaerdi, JPK's skaermbillede viste (DISCONTINUED HIDDEN / UDGAAET SKJULT).
       ================================================================== */
    ok(`56.2.${sprog}: ingen <li> for "skjult-udgaaet" i strimlen`,
      !html.includes('data-valg="skjult-udgaaet"'));
    ok(`56.2b.${sprog}: ingen :has()-regel for "skjult-udgaaet"`,
      !html.includes('[data-valg="skjult-udgaaet"]'));

    /* ==================================================================
       PUNKT 3 (BRIEF-uifix.md punkt 3): ALLE TRE statusvaerdier - ikke kun
       to - faar nu den samme GENERISKE, ikke-inverterede chip-mekanik som
       enhver anden facet: en almindelig "valg"-chip med id "f-status-X"
       (IKKE det gamle "skjult-X"), taendt af den almindelige
       #f-status-X:checked - ikke af fravaeret af checked.
       ================================================================== */
    for (const v of ['i_produktion', 'annonceret', 'udgaaet']) {
      const liRegex = new RegExp(`<li class="valg" data-valg="f-status-${v}">`);
      ok(`56.3.${sprog}.${v}: <li class="valg" data-valg="f-status-${v}"> findes (generisk chip-id, ikke "skjult-${v}")`,
        liRegex.test(html));

      const regelRegex = new RegExp(
        `\\.styr:has\\(#f-status-${v}:checked\\) \\[data-valg="f-status-${v}"\\]`,
      );
      ok(`56.3b.${sprog}.${v}: :has()-reglen der taender chippen naar #f-status-${v} ER checked, findes (generisk form)`,
        regelRegex.test(html));

      // REVERT-BEVIS: den GAMLE inverterede id-form "skjult-X" findes IKKE
      // laengere, for nogen af de tre vaerdier.
      ok(`56.3.revert.${sprog}.${v}: den gamle inverterede chip-id "skjult-${v}" findes IKKE`,
        !html.includes(`data-valg="skjult-${v}"`));
    }

    // PUNKT 3c: INGEN af de tre statusvaerdier er checked ved indlaesning -
    // det er selve rettelsen (BRIEF-uifix.md punkt 3, "som standard skal
    // INGEN vaere aktive").
    for (const v of ['i_produktion', 'annonceret', 'udgaaet']) {
      const checkboks = html.match(new RegExp(`id="f-status-${v}"[^>]*>`))?.[0] || '';
      ok(`56.3c.${sprog}.${v}: #f-status-${v} er IKKE checked i hvile (ingen standard laengere)`,
        !checkboks.includes('checked'), checkboks || 'checkboksen blev ikke fundet');
    }
    // REVERT-BEVIS: samme udtryk fanger en syntetisk checked-checkboks.
    ok(`56.3c.revert.${sprog}: samme moenster fanger en checked checkboks`,
      'id="f-status-udgaaet" type="checkbox" checked'.includes('checked'));

    /* ==================================================================
       PUNKT 4 (BRIEF-uifix.md punkt 3): "standard: udgaaede skjult" (i18n-
       noeglen filter_status_mrk) er FJERNET, ikke omformuleret - status har
       ingen standardtilstand at forklare laengere, og noeglen er derfor
       fjernet fra da.json/en.json (BRIEF-uifix.md's eget valg: "fjern
       noeglen, eller giv den et indhold, der passer"). Status-facettens
       <summary> er nu STRUKTURELT identisk med enhver anden facet - ingen
       facet__tal/mrk overhovedet.
       ================================================================== */
    ok(`56.4.${sprog}: i18n-noeglen filter_status_mrk findes IKKE laengere (fjernet, ikke omformuleret)`,
      i18n.filter_status_mrk === undefined, `fandt "${i18n.filter_status_mrk}"`);

    const detailsMatch = html.match(/<details[^>]*data-facetgruppe="status"[^>]*>([\s\S]*?)<\/summary>/);
    ok(`56.4b.${sprog}: <details data-facetgruppe="status"> findes`, !!detailsMatch);
    if (detailsMatch) {
      const summaryDel = detailsMatch[1];
      ok(`56.4c.${sprog}: status-summary'en baerer INGEN "facet__tal" (samme form som enhver anden facet)`,
        !summaryDel.includes('facet__tal'));
      // REVERT-BEVIS: land-facetten (som ALDRIG havde et mrk) proever samme
      // vej - fangeren skal ogsaa "bestaa" dér, ellers tester den ingenting.
      const landMatch = html.match(/<details[^>]*data-facetgruppe="land"[^>]*>([\s\S]*?)<\/summary>/);
      ok(`56.4c.revert.${sprog}: samme tjek "bestaar" ogsaa paa land-facetten (proever noget aegte)`,
        !!landMatch && !landMatch[1].includes('facet__tal'));
    }

    // Selve <details>-elementet maa IKKE baere `open` - sammenfoldet er
    // standarden (JPK 1. sep 2026, punkt 4), uaendret af dette spor.
    const detailsAaben = html.match(/<details[^>]*data-facetgruppe="status"[^>]*>/)?.[0] || '';
    ok(`56.4d.${sprog}: status-facetgruppen har IKKE "open" (er sammenfoldet, som resten)`,
      !/\bopen\b/.test(detailsAaben));

    /* ==================================================================
       PUNKT 5 (uaendret mekanik, kontrol): de andre facetters chips (ikke
       status) roeres slet ikke af denne rettelse - stikproeve paa vaegt.
       ================================================================== */
    ok(`56.5.${sprog}: en almindelig facets chip-mekanik (vaegt) staar uaendret`,
      /\.styr:has\(#f-vaegt-[^:]+:checked\) \[data-valg="f-vaegt-[^"]+"\]/.test(html));
  }

  const restTal = (laesHtml('da').match(/valg--standard/g) || []).length;
  console.log(`  info  56: ${restTal} forekomster af "valg--standard" i da/index.html (skal vaere 0)`);
}
