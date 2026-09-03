/**
 * tests/rens-css.mjs — normaliserer bygget CSS, saa en assertion kan soege i
 * den UANSET skrivemaade. BRIEF-prodtest.md, 3. sep 2026: et spor omformaterede
 * assets/generator.css (samme regler, ny skrivemaade - afsluttende semikolon,
 * `.1em` -> `0.1em`, `#FFFFFF` -> `#ffffff`, mellemrum efter `:` og foer `{`),
 * og ti assertions i tests/dele/ ledte efter den gamle, kompakte skrivemaade.
 *
 * Loesningen normaliserer FILEN, ikke moensteret: fjern kommentarer, fjern
 * afsluttende semikolon foer `}`, fjern AL whitespace, ret foranstillet
 * punktum (`.1em` -> `0.1em`) og saet hex til smaat. Et moenster skrevet mod
 * den rensede streng virker saa paa BEGGE skrivemaader - efterproevet 3. sep
 * 2026 mod baade den nuvaerende (formaterede) og den forrige (kompakte,
 * commit 8258e98) udgave af assets/generator.css: samme moenstre, samme svar.
 *
 * VIGTIGT: rens() fjerner AL whitespace, ogsaa den, der er syntaktisk
 * meningsfuld i raa CSS - mellemrummet i en efterkommer-kombinator
 * (".net .billedled" -> ".net.billedled") og mellemrummet mellem vaerdier i
 * en shorthand (fx "1px solid var(--x)" -> "1pxsolidvar(--x)"). Det er med
 * vilje: begge skrivemaader reduceres til PRAECIS samme streng for samme
 * regel. Skriver du et moenster mod den rensede streng, skal det ogsaa staa
 * UDEN mellemrum de tilsvarende steder.
 *
 * BRUGT AF (peg hertil i stedet for at kopiere reglen - se tests/LAESMIG.md):
 *   tests/dele/74-rammebeskaering.mjs
 *   tests/dele/31-pudsning.mjs
 *   tests/dele/12-enheder.mjs
 *   tests/dele/14-afslutning-oprydning.mjs
 *   tests/dele/30-filtreret-sandhed.mjs
 */
export function rens(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, '')          // kommentarer
    .replace(/;\s*}/g, '}')                     // afsluttende semikolon
    .replace(/\s+/g, '')                        // al whitespace
    .replace(/([:,(\s])\.(\d)/g, '$10.$2')      // .1em -> 0.1em
    .replace(/#([0-9A-Fa-f]{3,8})\b/g, (m) => m.toLowerCase());
}
