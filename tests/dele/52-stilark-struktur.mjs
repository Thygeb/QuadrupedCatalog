/**
 * tests/dele/52-stilark-struktur.mjs — spor/klamme, 1. sep 2026.
 *
 * Vaernet mod den fejl, der er sluppet igennem TO gange paa to dage: et flet
 * efterlader en ubalanceret klamme i assets/system.css (eller generator.css),
 * og den efterfoelgende blok bliver TAVST nestet inde i en @media-forespoergsel
 * - ingen syntaksfejl, browseren siger ingenting, reglerne gaelder bare kun
 * paa én skaermbredde. Begge gange var validate/build/ALLE oevrige tests
 * groenne paa den oedelagte fil, fordi ingen af dem laeser CSS'ens EGEN
 * struktur - kun om skabelonerne producerer gyldig HTML, der PEGER paa filen.
 *
 * MAALEAPPARATET SKAL VALIDERES FOER TALLET BRUGES (fejljagt-skillen, trin 1):
 * en naiv `grep -o '[{}]' | wc -l` er FORKERT, fordi klammer optraeder inde i
 * /* ... *-/ -kommentarer (dette stilark er tungt kommenteret - flere steder
 * citerer en kommentar CSS-reglen ORDRET), inde i strenge ("}") og i
 * url()-vaerdier. analyserCss() nedenfor foerer en lille tilstandsmaskine hen
 * over teksten og springer alle tre over, foer den taeller.
 *
 * De fire paastande, for baade system.css og generator.css:
 *   1. Klammerne balancerer (sluttdybde 0).
 *   2. Dybden bliver ALDRIG negativ undervejs (fanger en "}" for meget - en
 *      ren optaelling af totaler ser IKKE dette, kun en dybde-simulering goer).
 *   3. Ingen efterladte konfliktmarkoerer (<<<<<<< / ======= / >>>>>>>) i
 *      begyndelsen af en linje.
 *   4. Ingen utilsigtet nestet @media - en @media-blok maa ikke aabne, mens en
 *      anden @media-blok allerede er aaben. Det er PRAECIS den regel, der
 *      ville have fanget begge de faktiske haendelser direkte: en mistet "}"
 *      goer netop, at det naeste @media (eller den naeste almindelige regel)
 *      lander inde i det forrige.
 *
 * Revert-bevis for alle fire ligger i
 * scratchpad/klamme-revert-bevis.mjs (koert manuelt mod fire oedelagte
 * kopier i scratchpad - IKKE mod de rigtige stilark). Se sporets rapport for
 * kommandoerne og deres output.
 */
import fs from 'node:fs';
import path from 'node:path';

/**
 * Foerer en lille tilstandsmaskine hen over CSS-tekst og returnerer:
 *   sluttDybde        - antal aabne { ved filens slutning (0 = balanceret)
 *   negativVedLinje    - foerste linje, hvor dybden gik under 0 (eller null)
 *   nestedMediaVedLinje - foerste linje, hvor en @media aabnede INDE I en
 *                         anden endnu-aaben @media (eller null)
 *   dybdeAntal          - { aabne, luk } - de faktiske { og } talt af
 *                         maskinen (til at efterproeve mod en raa grep)
 *
 * Kommentarer (/* ... *-/) og citerede strenge ('...'/"...") springes helt
 * over - deres indhold taeller aldrig med, og et "@media" naevnt i en
 * kommentar udloeser derfor ikke nested-media-reglen. url(...) med ucitrede
 * tegn (fx url(fil.woff2)) springes ogsaa over, saa en parentes med et "{"
 * i en dataURI ikke kan forveksles med en regel-aabning (ingen af de to
 * filer bruger det i dag, men reglen skal ikke vaere skoer af den grund).
 *
 * Konfliktmarkoerer laeses UAFHAENGIGT af tilstandsmaskinen (paa raa linjer)
 * - en efterladt <<<<<<< skal opdages, ogsaa hvis den ved et uheld staar
 * inde i noget, der ligner en kommentar.
 */
export function analyserCss(tekst) {
  const n = tekst.length;
  let i = 0;
  let linje = 1;
  let dybde = 0;
  let negativVedLinje = null;
  let nestedMediaVedLinje = null;
  let aabneTalt = 0;
  let lukTalt = 0;
  const stak = []; // { erMedia, linje }
  let buffer = '';

  function taelNyeLinjer(fra, til) {
    let c = 0;
    for (let k = fra; k < til; k++) if (tekst[k] === '\n') c++;
    return c;
  }

  while (i < n) {
    const ch = tekst[i];

    // /* ... */ - spring HELE kommentaren over, tael ingen tegn i den.
    if (ch === '/' && tekst[i + 1] === '*') {
      const slut = tekst.indexOf('*/', i + 2);
      const til = slut === -1 ? n : slut + 2;
      linje += taelNyeLinjer(i, til);
      i = til;
      continue;
    }

    // '...' eller "..." - spring strengen over (respekterer \" og \').
    if (ch === '"' || ch === "'") {
      const anfoer = ch;
      let j = i + 1;
      while (j < n) {
        if (tekst[j] === '\\') { j += 2; continue; }
        if (tekst[j] === anfoer) { j++; break; }
        j++;
      }
      linje += taelNyeLinjer(i, j);
      i = j;
      continue;
    }

    // url(...) med ucitrede tegn - spring til den matchende ')'. Citerede
    // url("...")/url('...') rammes allerede af strengspringet ovenfor foer
    // parentesindholdet naas.
    if ((ch === 'u' || ch === 'U') && tekst.slice(i, i + 4).toLowerCase() === 'url(') {
      let j = i + 4;
      while (j < n && tekst[j] !== ')') {
        if (tekst[j] === '"' || tekst[j] === "'") {
          const anfoer = tekst[j];
          j++;
          while (j < n && tekst[j] !== anfoer) { if (tekst[j] === '\\') j++; j++; }
          j++;
          continue;
        }
        j++;
      }
      if (j < n) j++; // spring selve ')'
      linje += taelNyeLinjer(i, j);
      i = j;
      continue;
    }

    if (ch === '\n') { linje++; buffer += ch; i++; continue; }

    if (ch === ';') { buffer = ''; i++; continue; }

    if (ch === '{') {
      aabneTalt++;
      const bufTrim = buffer.trim();
      const erMedia = /^@media\b/i.test(bufTrim);
      if (erMedia && stak.some((s) => s.erMedia) && nestedMediaVedLinje === null) {
        nestedMediaVedLinje = linje;
      }
      stak.push({ erMedia, linje });
      dybde++;
      buffer = '';
      i++;
      continue;
    }

    if (ch === '}') {
      lukTalt++;
      dybde--;
      if (dybde < 0 && negativVedLinje === null) negativVedLinje = linje;
      if (stak.length > 0) stak.pop();
      buffer = '';
      i++;
      continue;
    }

    buffer += ch;
    i++;
  }

  return {
    sluttDybde: dybde,
    negativVedLinje,
    nestedMediaVedLinje,
    dybdeAntal: { aabne: aabneTalt, luk: lukTalt },
  };
}

/** Konfliktmarkoerer i begyndelsen af en linje - uafhaengig af kommentar-/
 *  strengspringet ovenfor, se filhovedet. */
export function findKonfliktMarkoerer(tekst) {
  const fund = [];
  const linjer = tekst.split('\n');
  for (let idx = 0; idx < linjer.length; idx++) {
    const l = linjer[idx];
    if (/^(<{7}|={7}|>{7})/.test(l)) fund.push({ linje: idx + 1, tekst: l.slice(0, 40) });
  }
  return fund;
}

export default async function koer(ctx) {
  const { rod, ok } = ctx;

  console.log('\n52. Stilarkets struktur: klammebalance, negativ dybde, konfliktmarkoerer, nestet @media (spor/klamme)');

  const filer = ['assets/system.css', 'assets/generator.css'];

  for (const rel of filer) {
    const sti = path.join(rod, rel);
    const tekst = fs.readFileSync(sti, 'utf8');
    const a = analyserCss(tekst);
    const konflikt = findKonfliktMarkoerer(tekst);

    // Raa kontroltal, kun til rapportens sammenligning mod grep -o '[{}]' - se
    // sporets rapport for om den korrekte maskine gav samme tal som den raa.
    console.log(`  info  ${rel}: { ${a.dybdeAntal.aabne} } ${a.dybdeAntal.luk} (motorens eget tal, kommentarer/strenge/url() ekskluderet)`);

    ok(`52.1 ${rel}: klammerne balancerer (sluttdybde 0)`,
      a.sluttDybde === 0, `sluttdybde ${a.sluttDybde}`);

    ok(`52.2 ${rel}: dybden gaar aldrig negativ`,
      a.negativVedLinje === null, `negativ foerst ved linje ${a.negativVedLinje}`);

    ok(`52.3 ${rel}: ingen efterladte konfliktmarkoerer`,
      konflikt.length === 0,
      konflikt.map((k) => `linje ${k.linje}: "${k.tekst}"`).join(' · '));

    ok(`52.4 ${rel}: ingen utilsigtet nestet @media`,
      a.nestedMediaVedLinje === null, `nestet foerst ved linje ${a.nestedMediaVedLinje}`);
  }
}
