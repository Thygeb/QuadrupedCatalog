/**
 * tests/dele/67-topbar2.mjs — spor/topbar, 2. sep 2026.
 *
 * JPK's to instrukser om topbaren, laast fast:
 *
 *   PUNKT 4, ordret: "Unit-knappen skal vise baade metric og imperial som
 *   der toggles mellem." FOER sporet stod der ÉT ord ad gangen, og det var
 *   det ord, man skiftede TIL - "IMPERIALE ENHEDER" med kontakten slukket.
 *   Er IMPERIAL saa tilstanden eller maalet? Det kunne man ikke se.
 *
 *   PUNKT 5, ordret: "Desuden skal DA/ENG knappen vaek." Prisen er kendt og
 *   valgt: efter sporet er der NUL brugersynligt sprogskift paa alle sider
 *   med topbar; kun dist/index.html (rodens vaelger) kan skifte sprog.
 *   Det MASKINLAESBARE skift - <link rel="alternate" hreflang> i <head> -
 *   er uroert, og det er dét, 67.5-raekken vogter.
 *
 * HVORFOR DENNE FIL MAALER PAA TOPBARENS EGEN SKIVE OG ALDRIG PAA HELE
 * SIDEN. Det er sporets dyreste lektie, arvet fra Å121: dagen foer blev
 * netop denne kontakt erklaeret i orden af et kriterium, der taalte tre
 * enhedsetiketter i HTML'en - hvoraf de to sad paa SKJULTE in-page-
 * instanser (robot.mjs' to egne kald, som system.css:2338-2339 slaar fra).
 * Kriteriet var koert, reproducerbart og groent, og funktionen virkede
 * ikke. Hver paastand herunder skaerer derfor foerst <header class="daek">
 * ud og taeller kun dér.
 *
 * REVERT-BEVIS paa hver strukturel paastand, jf. CLAUDE.md: den samme
 * proeve koeres mod en bevidst FORKERT streng og skal svare forkert dér.
 *
 * Bygger sit eget dist i sin egen undermappe af ctx.tmp, jf. tests/LAESMIG.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok,
  } = ctx;

  console.log('\n67. Topbaren: begge enheder staar samtidig, DA/EN er vaek (spor/topbar)');

  const udMappe = path.join(tmp, 'dist-topbar2');
  fs.rmSync(udMappe, { recursive: true, force: true });
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udMappe}`],
    { cwd: rod, encoding: 'utf8' });
  ok('67.0: build.mjs giver exit 0 (frisk byg, egen tmp-mappe)',
    b.status === 0, (b.stdout || b.stderr || '').trim().split('\n').slice(-3).join(' / '));
  if (b.status !== 0) return;

  const alleHtml = [];
  (function gaa(m) {
    for (const f of fs.readdirSync(m, { withFileTypes: true })) {
      const p = path.join(m, f.name);
      if (f.isDirectory()) gaa(p); else if (f.name.endsWith('.html')) alleHtml.push(p);
    }
  }(udMappe));
  ok(`67.0b: der er sider at maale paa (${alleHtml.length} .html)`, alleHtml.length > 0);

  const sysCss = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');
  const rel = (p) => path.relative(udMappe, p).replace(/\\/g, '/');

  /* DAEKKET ALENE. Alt herunder maaler paa denne skive og intet andet -
     se filhovedets forklaring af Å121. Returnerer '' for en side uden
     topbar (rodens sprogvaelger, dist/index.html), saa de sider falder
     ud af taellingerne i stedet for at forurene dem. */
  const daekAf = (html) => {
    const a = html.indexOf('<header class="daek">');
    if (a < 0) return '';
    const b2 = html.indexOf('</header>', a);
    return b2 < 0 ? '' : html.slice(a, b2);
  };
  const medDaek = alleHtml
    .map((p) => ({ p, html: fs.readFileSync(p, 'utf8') }))
    .map((s) => ({ ...s, daek: daekAf(s.html) }))
    .filter((s) => s.daek !== '');
  ok(`67.0c: ${medDaek.length} af ${alleHtml.length} sider baerer en topbar (resten er rodens vaelger)`,
    medDaek.length > 0 && medDaek.length < alleHtml.length,
    `medDaek ${medDaek.length}, i alt ${alleHtml.length}`);

  /* ======================================================================
     PUNKT 4: BEGGE ENHEDSORD STAAR I TOPBAREN
     ====================================================================== */
  {
    // 67.1 To ord, ikke ét. Taellingen er paa daekket alene.
    const forkerteAntal = medDaek.filter((s) => {
      const ord = (s.daek.match(/class="enhedsskift__ord [^"]*"/g) || []).length;
      return ord !== 2;
    });
    ok('67.1: hver topbar baerer PRAECIS TO enhedsord (ikke ét, som foer sporet)',
      forkerteAntal.length === 0,
      forkerteAntal.slice(0, 3).map((s) => `${rel(s.p)}: ${(s.daek.match(/class="enhedsskift__ord [^"]*"/g) || []).length}`).join(' | '));

    // 67.2 Og de er det METRISKE og det IMPERIALE - ikke det samme ord to gange.
    const manglerEt = medDaek.filter((s) => !/enhedsskift__ord--metrisk/.test(s.daek)
      || !/enhedsskift__ord--imperial/.test(s.daek));
    ok('67.2: begge topbarer baerer BAADE __ord--metrisk OG __ord--imperial',
      manglerEt.length === 0, manglerEt.slice(0, 3).map((s) => rel(s.p)).join(', '));

    // 67.3 DEN AFGOERENDE: ingen af de to maa baere en klasse, hvis regel
    // skjuler den. `.enhedsvis--imperial{display:none}` (system.css:1809) er
    // GLOBAL og var praecis grunden til, at kun ét ord sad i topbaren foer
    // sporet - de to skifte-regler findes kun under .typeskilt/
    // .sammenligning-app. Vender klasserne tilbage paa topbarens ord,
    // forsvinder det ene ord igen UDEN at 67.1/67.2 opdager det.
    const medSkjulerklasse = medDaek.filter((s) => {
      const etiket = s.daek.slice(s.daek.indexOf('<p class="daek__enhed">'));
      return /class="enhedsskift__ord[^"]*enhedsvis/.test(etiket);
    });
    ok('67.3: topbarens ord baerer INGEN enhedsvis-klasse (den globale '
      + '.enhedsvis--imperial{display:none} ville skjule det ene igen)',
      medSkjulerklasse.length === 0, medSkjulerklasse.slice(0, 3).map((s) => rel(s.p)).join(', '));
    ok('67.3.revert: samme proeve FANGER den gamle markup, hvor ordet bar enhedsvis--imperial',
      /class="enhedsskift__ord[^"]*enhedsvis/
        .test('<span class="enhedsskift__ord enhedsvis enhedsvis--imperial">x</span>'));

    // 67.4 …og system.css maa ikke selv skjule et af topbarens ord.
    const skjulerIDaek = /\.daek__enhed[^{]*\.enhedsskift__ord[^{]*\{[^}]*display:\s*none/.test(sysCss);
    ok('67.4: system.css skjuler ikke et af topbarens to ord (display:none paa .daek__enhed …__ord)',
      !skjulerIDaek);
    ok('67.4.revert: samme proeve FANGER en CSS-kilde, der gør det',
      /\.daek__enhed[^{]*\.enhedsskift__ord[^{]*\{[^}]*display:\s*none/
        .test('.daek__enhed .enhedsskift__ord--imperial{display:none}'));

    // 67.5 Den AKTIVE skal kunne skelnes - ellers er to ord bare stoej.
    // Markeringen er et blaek-trin: --blaek paa det gaeldende ord, --blaek3
    // paa det andet, og :has(:checked) bytter om.
    const hvile = /\.daek__enhed \.enhedsskift__ord--metrisk\{color:var\(--blaek\)\}/.test(sysCss);
    const krydset = /body:has\(\.enhedsskift__boks:checked\) \.daek__enhed \.enhedsskift__ord--imperial\{color:var\(--blaek\)\}/.test(sysCss);
    ok('67.5: den aktive enhed er markeret i BEGGE tilstande (metrisk i hvile, imperial ved krydset)',
      hvile && krydset, `hvile ${hvile}, krydset ${krydset}`);

    // 67.6 L76: --accent maa ALDRIG baere forgrund paa lys bund (1,38:1).
    // Markeringen skal derfor vaere blaek, ikke gul.
    const gulForgrund = /\.daek__enhed[^{]*\.enhedsskift__ord[^{]*\{[^}]*color:var\(--accent\)/.test(sysCss);
    ok('67.6: markeringen af det aktive ord er IKKE gul forgrund (L76: --accent giver 1,38:1)',
      !gulForgrund);
    ok('67.6.revert: samme proeve FANGER en gul forgrund, naar den er der',
      /\.daek__enhed[^{]*\.enhedsskift__ord[^{]*\{[^}]*color:var\(--accent\)/
        .test('.daek__enhed .enhedsskift__ord--imperial{color:var(--accent)}'));

    // 67.7 P0: skiftet maa ikke afhaenge af JavaScript. Kontrollen er en
    // aegte afkrydsning, og BEGGE regelsaet (tal-skiftets `~` og topbarens
    // :has()) staar i CSS. Den levende maaling med JS slaaet fra staar i
    // fund/FUND-topbar.md; her vogtes kilden.
    ok('67.7: tal-skiftets soeskende-regel (`~`) staar UROERT i system.css',
      /\.typeskilt \.enhedsskift__boks:checked ~ \* \.enhedsvis--metrisk\{display:none\}/.test(sysCss)
      && /\.typeskilt \.enhedsskift__boks:checked ~ \* \.enhedsvis--imperial\{display:contents\}/.test(sysCss));
    ok('67.7b: ingen side bruger role="checkbox" i stedet for en aegte <input>',
      !medDaek.some((s) => /role="checkbox"/.test(s.html)));
  }

  /* ======================================================================
     PUNKT 5: DA/EN ER VAEK FRA TOPBAREN - OG hreflang ER DET IKKE
     ====================================================================== */
  {
    // 67.8 Ingen topbar baerer et brugersynligt sprogskift. Dette er det ENE
    // sted, fravaeret taelles paa tvaers af alle sider (51.6 slap sin halvdel
    // netop hertil, saa paastanden staar ét sted, hvor den kan fejle).
    const medSkifter = medDaek.filter((s) => /daek__sprogkode|daek__sprog"|daek__skil/.test(s.daek));
    ok(`67.8: 0 af ${medDaek.length} topbarer baerer et sprogskift (DA/EN fjernet 2. sep 2026)`,
      medSkifter.length === 0, medSkifter.slice(0, 3).map((s) => rel(s.p)).join(', '));
    ok('67.8.revert: samme proeve FANGER en topbar, hvor DA/EN er vendt tilbage',
      /daek__sprogkode|daek__sprog"|daek__skil/
        .test('<p class="daek__sprog"><a class="daek__sprogkode">EN</a></p>'));

    // 67.9 …og CSS'en er ryddet med, saa der ikke staar doed CSS tilbage.
    ok('67.9: system.css baerer ingen regler for det fjernede sprogskift',
      !/daek__sprog|daek__skil/.test(sysCss));

    /* 67.10 DET MASKINLAESBARE SKIFT OVERLEVER. Uden denne assertion ville
       67.8 vaere groen ogsaa den dag, nogen fjernede hreflang fra <head>
       sammen med knappen - og siden ville tavst holde op med at fortaelle
       en soegemaskine, at den findes paa to sprog. Det er den dyreste
       udgave af "groent kriterium, oedelagt funktion". */
    const udenAlternate = medDaek.filter((s) => {
      const hoved = s.html.slice(0, s.html.indexOf('</head>'));
      return (hoved.match(/<link rel="alternate" hreflang="[^"]*"/g) || []).length < 3;
    });
    ok('67.10: hver topbar-side baerer stadig 3 <link rel="alternate" hreflang> i <head> '
      + '(da, en, x-default) - sprogskiftet er maskinlaesbart, ikke tabt',
      udenAlternate.length === 0, udenAlternate.slice(0, 3).map((s) => rel(s.p)).join(', '));
    ok('67.10.revert: samme proeve FANGER en side, hvor hreflang er revet ud af <head>',
      (('<head><title>x</title></head>').match(/<link rel="alternate" hreflang="[^"]*"/g) || []).length < 3);

    /* 67.11 TAELLINGEN, DER FORKLARER T5. Et raat `grep -o hreflang` paa en
       bygget side gav 4 FOER sporet og giver 3 EFTER. Forskellen er ikke et
       tab af maskinlaesbarhed: de tre i <head> er uroerte, og den fjerde sad
       paa selve DA/EN-laenkens hreflang-attribut. Et kriterium, der kraever
       4, maaler altsaa den fjernede knap - ikke sprogskiftets overlevelse.
       Linjen her fastholder den skelnen, saa den ikke skal genopdages. */
    const enSide = medDaek[0];
    const iAlt = (enSide.html.match(/hreflang/g) || []).length;
    const iHoved = (enSide.html.slice(0, enSide.html.indexOf('</head>'))
      .match(/<link rel="alternate" hreflang="[^"]*"/g) || []).length;
    ok(`67.11: alle sidens hreflang-forekomster (${iAlt}) sidder i <head> som `
      + `rel="alternate" (${iHoved}) - ingen sidder paa en synlig laenke laengere`,
      iAlt === iHoved && iHoved === 3, `i alt ${iAlt}, i <head> ${iHoved}`);
  }
}
