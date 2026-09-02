/**
 * tests/dele/65-katalogbar.mjs — spor/katalog3, 2. sep 2026.
 *
 * JPK 2. sep 2026, ordret: "selected to compare baren skal kun leve i bunden
 * af skaermen". Katalogsiden viste udvalget TO steder - den klaebende
 * bundbjaelke (.klaebebar) og en chip i filterpladen (.saml-taeller). Chippen
 * er vaek som flade. Bjaelken staar.
 *
 * Denne del laaser den ene ting, der er let at rulle tilbage ved et uheld, og
 * den ene ting, der er let at rydde op i ved et uheld:
 *
 *  A. CHIPPEN MAA IKKE KOMME TILBAGE. Den vises af ÉN attribut - `data-aktiv`,
 *     som system.css' `.saml-taeller[data-aktiv]{display:flex}` er den eneste
 *     undtagelse fra grundtilstanden `display:none`. Saettes den igen fra
 *     assets/katalog.js, staar chippen der igen. 65.1 faelder praecis det.
 *
 *  B. BAEREREN MAA IKKE SLETTES. Chippen er ikke bare et levn: klaebebaren
 *     LAESER hele sin tekst af den - href og linktekst fra
 *     .saml-taeller__gaa, ARIA-navnet fra data-klaebebar-etiket og
 *     ryd-knappens tekst fra [data-saml-ryd]. En oprydning, der sletter
 *     elementet fra skabelonen "fordi det jo ikke vises", giver en bjaelke
 *     uden navn, uden linktekst og uden ryd-knap - og INTET andet ville
 *     fejle. 65.2-65.6 faelder det.
 *
 * Den tredje ting, som er let at forveksle med chippen: .saml-graense er
 * IKKE en del af SELECTED-baren. Det er afvisningsbeskeden ("Du kan
 * sammenligne hoejst 3 robotter ad gangen"), den staar kun naar et klik
 * faktisk blev afvist, og den skal blive ved med at kunne vises. 65.7.
 *
 * Browsermaalingerne (chippens kasse er 0x0, bjaelken staar 850-900 i et
 * 900px vindue, og en kontrolkoersel hvor data-aktiv saettes i browseren
 * bringer chippen frem igen paa 41px) staar i fund/FUND-katalogbar.md.
 * Denne fil laeser kildekode og byggetekst, som tests/dele goer alle andre
 * steder. Bygger sit eget dist i sin egen undermappe af ctx.tmp, jf.
 * tests/LAESMIG.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** Udsnittet mellem to markoerer - indexOf paa selve teksten, ALDRIG split()
 *  paa noget der ogsaa kan staa andre steder (CLAUDE.md's femte skalfaelde,
 *  samme greb som 47's vaelgerBlok() og 48's udsnit()). */
function udsnit(kilde, fraTekst, tilTekst) {
  const s = kilde.indexOf(fraTekst);
  if (s < 0) return null;
  const e = tilTekst ? kilde.indexOf(tilTekst, s) : -1;
  return e < 0 ? kilde.slice(s) : kilde.slice(s, e);
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n65. spor/katalog3: SELECTED-baren lever kun i bunden af skaermen');

  const ud = path.join(tmp, 'dist-katalogbar');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('65.0: byg giver exit 0', b.status === 0, (b.stderr || '').slice(0, 400));
  if (b.status !== 0) return;

  const laesHtml = (sprog) => fs.readFileSync(path.join(ud, sprog, 'index.html'), 'utf8');
  const js = fs.readFileSync(path.join(rod, 'assets', 'katalog.js'), 'utf8');
  const css = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');

  /* ==================================================================
     A. CHIPPEN KOMMER IKKE TILBAGE
     ================================================================== */

  /* Maalt paa KALDET, ikke paa strengen: katalog.js' egen kommentar naevner
     data-aktiv fire gange for at forklare hvorfor den ikke saettes, og en
     raa js.includes('data-aktiv') ville derfor vaere roed fra dag ét - en
     test, der maaler sin egen dokumentation. */
  const saetter = js.match(/\.setAttribute\(\s*['"]data-aktiv['"]/g) || [];
  ok('65.1: assets/katalog.js saetter data-aktiv INGEN steder',
    saetter.length === 0,
    `fandt ${saetter.length} kald - chippen i filterpladen vil staa synlig igen. `
    + 'Er det med vilje, saa vend denne paastand om og skriv hvem der besluttede det '
    + '(JPK 2. sep 2026: "selected to compare baren skal kun leve i bunden af skaermen").');

  /* Anden laas, og den er ikke overfloedig: system.css ejes af et andet spor.
     Falder display:none bort dér, er `hidden` det eneste tilbage - og
     omvendt. Begge skal staa. */
  const chipRegel = udsnit(css, '.saml-taeller{', '}');
  ok('65.2: system.css holder .saml-taeller paa display:none som grundtilstand',
    !!chipRegel && /display:\s*none/.test(chipRegel),
    'anden laas: uden den hviler alt paa hidden-attributten alene');

  for (const sprog of ['da', 'en']) {
    const html = laesHtml(sprog);
    const chip = udsnit(html, '<p class="saml-taeller"', '</p>');
    ok(`65.3.${sprog}: chippen udsendes med hidden og UDEN data-aktiv`,
      !!chip && /\shidden[\s>]/.test(chip) && !chip.includes('data-aktiv'),
      'foerste laas: elementet skal vaere ude af tilgaengelighedstraeet fra foerste byte');
  }

  /* ==================================================================
     B. BAEREREN SLETTES IKKE - bjaelken laeser hele sin tekst af den
     ================================================================== */
  for (const sprog of ['da', 'en']) {
    const html = laesHtml(sprog);
    const chip = udsnit(html, '<p class="saml-taeller"', '</p>');

    ok(`65.4.${sprog}: baereren findes i den byggede side (data-saml-taeller)`,
      html.includes('data-saml-taeller'),
      'uden elementet har bjaelken hverken navn, linktekst eller ryd-knap');

    const gaa = chip && /<a class="saml-taeller__gaa" href="([^"]+)">([^<]+)<\/a>/.exec(chip);
    ok(`65.5.${sprog}: .saml-taeller__gaa baerer bjaelkens href OG dens linktekst`,
      !!gaa && gaa[1].length > 0 && gaa[2].length > 0,
      `href="${gaa && gaa[1]}" tekst="${gaa && gaa[2]}" - begge laeses af katalog.js`);

    const etiket = chip && /data-klaebebar-etiket="([^"]*)"/.exec(chip);
    ok(`65.6.${sprog}: data-klaebebar-etiket er en ikke-tom streng (bjaelkens ARIA-navn)`,
      !!etiket && etiket[1].trim().length > 0,
      `fandt "${etiket && etiket[1]}" - tom giver en role="region" uden navn`);

    const ryd = chip && /<button class="saml-taeller__ryd"[^>]*data-saml-ryd>([^<]+)<\/button>/.exec(chip);
    ok(`65.7.${sprog}: [data-saml-ryd] baerer ryd-knappens tekst`,
      !!ryd && ryd[1].trim().length > 0,
      `fandt "${ryd && ryd[1]}" - bjaelkens egen ryd-knap kopierer denne streng`);
  }

  /* Den anden ende af samme kontrakt: laeser katalog.js stadig de tre? En
     baerer, ingen laeser, er lige saa doed som en laeser uden baerer. */
  ok('65.8: katalog.js laeser href/linktekst fra .saml-taeller__gaa',
    /querySelector\(\s*['"]\.saml-taeller__gaa['"]\s*\)/.test(js));
  ok('65.9: katalog.js laeser bjaelkens ARIA-navn fra data-klaebebar-etiket',
    /getAttribute\(\s*['"]data-klaebebar-etiket['"]\s*\)/.test(js));
  ok('65.10: katalog.js laeser ryd-teksten fra [data-saml-ryd]',
    /querySelector\(\s*['"]\[data-saml-ryd\]['"]\s*\)/.test(js));

  /* textContent og IKKE innerText, og det er ikke pedanteri: innerText er
     layout og giver TOM STRENG paa et display:none-element. Da chippen blev
     permanent skjult, var det praecis den fejl, der kunne have gjort
     bjaelkens link- og ryd-tekst tomme uden at noget andet fejlede. Maalt i
     browseren 2. sep 2026: begge er fyldte. Laast her, saa en fremtidig
     omskrivning til innerText faelder i stedet for at gaa stille igennem.

     Maalt paa EJENDOMSOPSLAGET (`.innerText`), ikke paa ordet: katalog.js'
     egen kommentar naevner innerText for at forklare hvorfor det ikke bruges,
     saa foerste udgaves /\binnerText\b/ ville have vaeret roed fra dag ét.
     Samme fejl som 65.1 advarer mod - begaaet i selve testen om den. Fanget
     FOER testen blev koert, af en kontrol der forudsagde hvert regex-tal og
     saa laeste det: forventede 0, fik 1. */
  ok('65.11: bjaelkens tekst laeses med textContent, ikke innerText',
    !/\.innerText\b/.test(js),
    'innerText er tom paa et skjult element - baereren ER skjult');

  /* ==================================================================
     C. AFVISNINGSBESKEDEN ER IKKE EN DEL AF BAREN OG SKAL BLIVE
     ================================================================== */
  for (const sprog of ['da', 'en']) {
    const html = laesHtml(sprog);
    ok(`65.12.${sprog}: .saml-graense udsendes stadig med role="status"`,
      /<p class="saml-graense" data-saml-graense role="status">/.test(html),
      'afvisningsbeskeden staar naar et fjerde valg afvises - den er ikke SELECTED-baren');
  }
  ok('65.13: .saml-graense er tom-skjult via :empty, ikke via en attribut fra JS',
    /\.saml-graense:empty\{display:none\}/.test(css),
    'den skal kunne komme frem uden at JS saetter noget - ellers doer den med chippen');
}
