/* 82 — Fladernes system: afstandsskalaens fod, skriftskalaens renhed,
   betjeningsfladernes kanter og de fire datatilstandes indbyrdes forskel.
   Bygget af spor/flader 4. sep 2026 (de syv impeccable-pas).

   HVORFOR EN TEST OG IKKE BARE EN KOMMENTAR: hvert af tallene herunder blev
   maalt én gang og kan glide tilbage uden at nogen opdager det. Den dyreste
   af dem er 82.7-82.10: et senere `quieter`- eller `polish`-pas, der daemper
   .v-nej og .v-ikke mod hinanden, bryder haard begraensning 5 - og
   resultatet SER PAENERE UD bagefter, saa ingen opdager det uden en vagt.

   ALLE MAALINGER STRIPPER KOMMENTARER FOERST. Det er ikke pedanteri: under
   dette spor gav tre forskellige maalinger forkerte tal, fordi CSS-kommentarer
   citerer CSS. Raa grep taeller prosa med. */

import fs from 'node:fs';
import path from 'node:path';

/* Fjerner /* ... *\/ men bevarer linjeskift, saa linjenumre ikke skrider. */
const udenKommentarer = (s) =>
  s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

export default async function koer(ctx) {
  const { ok, rod } = ctx;
  const laes = (f) => fs.readFileSync(path.join(rod, 'assets', f), 'utf8');
  const systemRaa = laes('system.css');
  const generatorRaa = laes('generator.css');
  const system = udenKommentarer(systemRaa);
  const generator = udenKommentarer(generatorRaa);
  const beggeRaa = systemRaa + '\n' + generatorRaa;
  const begge = system + '\n' + generator;

  /* ---- Afstandsskalaen og dens fod (pas 1) ---------------------------- */

  /* De ni oprindelige trin SKAL have uaendrede vaerdier. Foden blev lagt til
     netop paa den betingelse, at ingen af de 227 bestaaende var(--rN)-brug
     flyttede sig en pixel. Aendrer nogen et af dem, er den kontrakt brudt. */
  const TRIN = { '--r1': '4px', '--r2': '8px', '--r3': '12px', '--r4': '16px',
                 '--r5': '24px', '--r6': '32px', '--r7': '48px', '--r8': '64px',
                 '--r9': '96px' };
  const vaerdiAf = (navn) => {
    const m = system.match(new RegExp(`${navn}\\s*:\\s*([^;]+);`));
    return m ? m[1].trim() : null;
  };
  for (const [navn, vaerdi] of Object.entries(TRIN)) {
    ok(`82.1 ${navn} staar uaendret paa ${vaerdi}`, vaerdiAf(navn) === vaerdi,
      `fandt ${vaerdiAf(navn)}`);
  }

  /* Foden er skalaens EGNE halvtrin: 2 px-granularitet fra 2 til 16. */
  const FOD = { '--r0': '2px', '--r1h': '6px', '--r2h': '10px', '--r3h': '14px' };
  for (const [navn, vaerdi] of Object.entries(FOD)) {
    ok(`82.2 afstandsskalaens fod: ${navn} = ${vaerdi}`, vaerdiAf(navn) === vaerdi,
      `fandt ${vaerdiAf(navn)}`);
  }

  /* Selve fundet, der startede passet. Graensen er 10 og maa ikke haeves for
     at faa noget groent - overskrides den, skal vaerdien paa skalaen, ikke
     tallet op. Maalt i KODE, ikke i kommentarer. */
  const RAA_AFSTAND = /(padding|margin)(-top|-right|-bottom|-left)?:\s*[0-9.]+px/g;
  const raaKode = [...new Set((begge.match(RAA_AFSTAND) || [])
    .map((s) => s.replace(/:\s+/, ':')))];
  ok(`82.3 hoejst 10 raa px-afstande tilbage i KODE (fandt ${raaKode.length})`,
    raaKode.length <= 10, raaKode.join(' · '));

  /* Regressionsvagt for den fejl, mit eget patch lavede: en var() kan ikke
     negeres med et bart minus. `margin:0 -var(--r2)` er ugyldig CSS og
     fejler TAVST - browseren dropper erklaeringen, og marginen forsvinder. */
  ok('82.4 ingen ugyldig negering af en var() (skal vaere calc(-1 * var(...)))',
    !/-var\(\s*--/.test(begge), (begge.match(/-var\(\s*--[a-z0-9-]+/g) || []).join(' · '));

  /* ---- Skriftskalaen (pas 2) ------------------------------------------ */

  const fsDef = [...new Set((system.match(/--fs-[a-z0-9-]+(?=\s*:)/g) || []))];
  ok(`82.5 hoejst 21 skriftgrader i skalaen (fandt ${fsDef.length})`,
    fsDef.length <= 21, fsDef.join(' '));

  /* spor/skriftskalas resultat: ingen raa font-size i px. Vendes den, er
     hele det spors arbejde rullet tilbage. */
  ok('82.6 ingen raa font-size i px i KODE',
    (begge.match(/font-size:\s*[0-9.]+px/g) || []).length === 0,
    (begge.match(/font-size:\s*[0-9.]+px/g) || []).join(' · '));

  /* Et trin uden forbruger er doedvaegt - det var praecis --fs-display-tal.
     Og en var(--fs-x) uden definition er en tavs fallback til arvet skrift. */
  const ubrugte = fsDef.filter((d) => !begge.includes(`var(${d})`));
  ok('82.7 hver skriftgrad har mindst én forbruger', ubrugte.length === 0,
    `uden forbruger: ${ubrugte.join(' ')}`);
  const fsBrugt = [...new Set((begge.match(/var\((--fs-[a-z0-9-]+)\)/g) || [])
    .map((s) => s.slice(4, -1)))];
  const udefinerede = fsBrugt.filter((b) => !fsDef.includes(b));
  ok('82.8 ingen brugt skriftgrad mangler sin definition', udefinerede.length === 0,
    udefinerede.join(' '));

  /* ---- Betjeningsfladernes kanter (pas 3 og 4) ------------------------ */

  /* SYSTEMREGEL: er kanten det eneste, der identificerer en betjeningsflade,
     skal den klare WCAG 1.4.11's 3:1. --linje (1,56) og --hegn (2,47) goer
     det ikke; --hegn-baerende (3,96 paa panel) er den lyseste, der goer.
     Reglen testes paa de tre flader, den blev indfoert for. */
  const blok = (kilde, vaelger) => {
    const m = kilde.match(new RegExp(
      `(^|[},])\\s*${vaelger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`, 'm'));
    return m ? m[2] : '';
  };
  const sogInput = blok(system, '.sog input');
  ok('82.9 soegefeltets ramme staar paa --hegn-baerende, ikke --hegn',
    /border:[^;]*var\(--hegn-baerende\)/.test(sogInput),
    sogInput.replace(/\s+/g, ' ').trim().slice(0, 120));

  const spor = blok(system, '.enhedsskift__spor');
  ok('82.10 enhedskontaktens spor staar paa --hegn-baerende, ikke --hegn',
    /border:[^;]*var\(--hegn-baerende\)/.test(spor),
    spor.replace(/\s+/g, ' ').trim().slice(0, 120));

  const sorter = blok(generator, '.sortervalg label');
  ok('82.11 sorteringen staar paa sidens eget beroeringsmaal (44px)',
    /min-height:\s*44px/.test(sorter), sorter.replace(/\s+/g, ' ').trim().slice(0, 140));
  ok('82.12 sorteringens kant klarer 3:1 (--hegn-baerende, ikke --linje)',
    /box-shadow:[^;]*var\(--hegn-baerende\)/.test(sorter),
    sorter.replace(/\s+/g, ' ').trim().slice(0, 140));

  /* ---- DE FIRE DATATILSTANDE — haard begraensning 5 ------------------- */

  /* "Ikke oplyst", "nej" og "0" er TRE FORSKELLIGE TILSTANDE og skal se
     forskellige ud. Det er der, katalogsider lyver.

     Vagten er bevidst formuleret som en REGEL om indbyrdes forskel, ikke som
     en laasning af de konkrete vaerdier: skriftgraderne maa gerne aendre sig,
     men de tre maa aldrig smelte sammen. Derfor sammenlignes de PARVIS. */
  const vNul = blok(system, '.v-nul');
  const vNej = blok(system, '.v-nej');
  const vIkke = blok(system, '.v-ikke');
  ok('82.13 de tre kritiske tilstande har hver sin regel i stilarket',
    vNul !== '' && vNej !== '' && vIkke !== '',
    `nul:${vNul.length} nej:${vNej.length} ikke:${vIkke.length}`);

  const felt = (b, n) => ((b.match(new RegExp(`${n}:\\s*([^;]+)`)) || [])[1] || '').trim();

  /* nej vs ikke oplyst: de skal skille sig paa MERE end teksten. */
  const nejSats = ['font-size', 'font-weight', 'text-transform', 'color']
    .map((n) => felt(vNej, n)).join('|');
  const ikkeSats = ['font-size', 'font-weight', 'text-transform', 'color']
    .map((n) => felt(vIkke, n)).join('|');
  ok('82.14 .v-nej og .v-ikke har forskellig sats (ikke kun forskellig tekst)',
    nejSats !== ikkeSats, `nej[${nejSats}] ikke[${ikkeSats}]`);

  /* Den ENE forskel, der aldrig maa forsvinde: nej er VERSALER og fuld blaek,
     ikke oplyst er minuskler paa en daempet flade med stiplet kant. */
  ok('82.15 .v-nej er versaler, .v-ikke er det ikke',
    /text-transform:\s*uppercase/.test(vNej) && !/text-transform:\s*uppercase/.test(vIkke),
    `nej[${felt(vNej, 'text-transform')}] ikke[${felt(vIkke, 'text-transform')}]`);
  ok('82.16 .v-ikke baerer en daempet flade og en stiplet kant, .v-nej ingen af delene',
    /background:\s*var\(--tom\)/.test(vIkke) && /border:[^;]*dashed/.test(vIkke)
      && !/background:/.test(vNej) && !/border:/.test(vNej),
    `ikke[${felt(vIkke, 'background')} / ${felt(vIkke, 'border')}] nej[${felt(vNej, 'background')} / ${felt(vNej, 'border')}]`);

  /* NUL ER ET TAL. Den maa ALDRIG faa hullets sprog - ingen daempet flade,
     ingen stiplet kant, intet maerke. Det er den fejl, der faar en
     katalogside til at vise en maalt nul som en manglende oplysning. */
  ok('82.17 .v-nul har hverken daempet flade, stiplet kant eller maerke',
    !/background:/.test(vNul) && !/dashed/.test(vNul)
      && !new RegExp('\\.v-nul\\s+\\.mrk').test(system),
    vNul.replace(/\s+/g, ' ').trim());
  ok('82.18 .v-nul saettes i fuld --blaek som ethvert andet tal',
    /color:\s*var\(--blaek\)/.test(vNul), felt(vNul, 'color'));

  /* Tre-tilstands-alfabetet: fyldt / aabent med kerne / stiplet kvadrat.
     Samme paastand som 47.23 - den staar HER ogsaa, fordi 47 ejes af et
     andet spor og daekker sammenligningsmatricen, ikke grundreglerne. */
  ok('82.19 de tre kvadrater er stadig fyldt / aabent-med-kerne / stiplet',
    /\.v-nej\s+\.mrk\s*\{[^}]*background:\s*var\(--blaek\)/.test(system)
      && /\.v-ja\s+\.mrk\s*\{[^}]*inset/.test(system)
      && /\.v-ikke\s+\.mrk\s*\{[^}]*dashed/.test(system));

  /* Fjerde tilstand: "kun vist paa billede" er hverken et tal eller et hul. */
  const vBillede = blok(system, '.v-billede');
  ok('82.20 .v-billede skiller sig ud med kursiveret ord og halvt fyldt kvadrat',
    /\.v-billede\s+\.ord\s*\{[^}]*font-style:\s*italic/.test(system)
      && /\.v-billede\s+\.mrk\s*\{[^}]*linear-gradient/.test(system),
    vBillede.replace(/\s+/g, ' ').trim().slice(0, 100));
}
