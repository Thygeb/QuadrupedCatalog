/**
 * tests/dele/47-samlvaelger-og-tilstandssats.mjs — spor/samlvaelg.
 *
 * Laaser to ting fast, som begge var ubeskyttede, og som begge var
 * usynlige for de oevrige 1.154 tests:
 *
 *   PUNKT 1  Sammenligningssidens robotvaelger skal baere compens
 *            .vaelgernet-design (retninger/nyverden/typeskilt.css:855-882).
 *            Den blev tegnet i compen og ALDRIG bygget; i mangel af egne
 *            regler faldt vaelgeren tilbage paa katalogets .filtre-chip.
 *            Ingen test faldt, fordi ingen test kiggede.
 *
 *   PUNKT 2  De fire datatilstandes sats maa ikke svinge med den arvede
 *            skrift. `.v-ikke` stod i 16 px i sammenligningsmatricen og
 *            7,82 px i laesenoeglen paa SAMME side, fordi satsen var .46em.
 *
 * Nr. 47 er valgt, fordi main baerer dubletter paa 41-44 og fordi 45/46 var
 * reserveret til to samtidige spor.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** Skaerer vaelgerens markup ud af en bygget side.
 *  Bruger indexOf paa klassenavnet og skaerer frem til </fieldset> -- IKKE
 *  split() paa et id, som rammer det tomme mellemstykke mellem
 *  aria-labelledby og id (CLAUDE.md's femte skalfaelde). */
function vaelgerBlok(html) {
  /* Start ved selve <div, ikke ved klassenavnet: skaeres der fra
     `class="vaelgernet"`, ligger `<div ` uden for udsnittet, og enhver
     assertion paa aabningstaggen fejler, selv om markup'en er rigtig.
     Det kostede to roede tests foerste gang denne fil blev koert. */
  const s = html.indexOf('<div class="vaelgernet"');
  if (s < 0) return null;
  const e = html.indexOf('</fieldset>', s);
  return e < 0 ? html.slice(s) : html.slice(s, e);
}

/** Specificitet som [klasser, elementer] for en simpel selektor. Rakker kun
 *  til de former, denne test sammenligner. */
function spec(sel) {
  return [
    (sel.match(/\.[a-zA-Z_-][\w-]*/g) || []).length,
    (sel.match(/(^|\s|>)[a-z]+(?=[.\s[:]|$)/g) || []).length,
  ];
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n47. spor/samlvaelg: sammenligningens vaelger + tilstandenes faste sats');

  /* KOMMENTARERNE SKAL VAEK FOER DER MAALES, og det er ikke pedanteri.
     Foerste udgave af denne fil laeste raa CSS, og 47.11 stod GROEN efter at
     reglen `.vc[hidden]{display:none}` var slettet - fordi blokkens egen
     kommentar citerer reglen ordret. Testen beviste altsaa, at
     DOKUMENTATIONEN fandtes, ikke at reglen gjorde. Den slags groen test er
     vaerre end ingen test: den attesterer noget, den ikke har maalt.
     Alle CSS-paastande nedenfor laeser derfor den kommentarfri udgave. */
  const udenKommentarer = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');
  const css = udenKommentarer(fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8'));
  const genCss = udenKommentarer(fs.readFileSync(path.join(rod, 'assets', 'generator.css'), 'utf8'));

  const udMappe = path.join(tmp, 'dist-samlvaelg');
  fs.rmSync(udMappe, { recursive: true, force: true });
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udMappe}`],
    { cwd: rod, encoding: 'utf8' });
  ok('47.1 build.mjs giver exit 0 (frisk byg til egen midlertidig mappe)',
    b.status === 0, (b.stdout || b.stderr || '').trim().split('\n').slice(-3).join(' / '));

  /* ============================================================== PUNKT 1 */

  for (const sprog of ['da', 'en']) {
    const sti = path.join(udMappe, sprog, 'sammenligning', 'index.html');
    const html = fs.existsSync(sti) ? fs.readFileSync(sti, 'utf8') : null;
    ok(`47.2.${sprog} sammenligningssiden findes`, html !== null);
    if (!html) continue;

    const blok = vaelgerBlok(html);
    ok(`47.3.${sprog} vaelgeren baerer compens .vaelgernet (ikke katalogets .filtre)`,
      blok !== null && !/class="filtre" data-saml-vaelger/.test(html));

    if (!blok) continue;

    /* Antallet er bundet til datasaettet, ikke til et haandskrevet tal:
       én chip pr. robotfil. Kataloget maa vokse uden at denne test lyver. */
    const antalRobotter = fs.readdirSync(path.join(rod, 'data', 'robots'))
      .filter((f) => /\.ya?ml$/.test(f)).length;
    const bokse = (blok.match(/<input type="checkbox"/g) || []).length;
    ok(`47.4.${sprog} én afkrydsning pr. robotfil (${antalRobotter})`,
      bokse === antalRobotter, `fandt ${bokse}`);

    /* Teknikken, ikke bare udseendet: et RIGTIGT afkrydsningsfelt bevarer
       tastatur og skaermlaeser. En chip bygget af <div> ville se ens ud og
       vaere ubrugelig uden mus. */
    ok(`47.5.${sprog} chippen er et rigtigt <input type="checkbox">, ikke en div-attrap`,
      bokse > 0 && !/role="checkbox"/.test(blok));

    const chips = (blok.match(/<span class="vc" data-sog="/g) || []).length;
    ok(`47.6.${sprog} hver chip baerer data-sog (assets/sammenligning.js:606 soeger paa den)`,
      chips === antalRobotter, `fandt ${chips}`);

    ok(`47.7.${sprog} beholderen baerer data-saml-vaelger (assets/sammenligning.js:488)`,
      /<div class="vaelgernet" data-saml-vaelger>/.test(blok));

    ok(`47.8.${sprog} etiketten er en <label class="vc__mrk" for=...>, saa klik og fokus foelges ad`,
      (blok.match(/<label class="vc__mrk" for="saml-/g) || []).length === antalRobotter);

    /* f-saml er en KROG, ikke en stilklasse: tools/maal-klaebende-hoved.mjs:24
       soeger paa `input.f-saml`. Fjernes den, doer maalevaerktoejet tavst. */
    ok(`47.9.${sprog} f-saml er bevaret paa inputtet (tools/maal-klaebende-hoved.mjs:24)`,
      (blok.match(/class="vc__felt f-saml"/g) || []).length === antalRobotter);
  }

  /* Reglerne skal faktisk findes - punkt 1's egen fejl var netop, at
     klassenavnene stod i markup uden en eneste regel bag sig. */
  for (const sel of ['.vaelgernet', '.vc__felt', '.vc__mrk', '.vc__prod']) {
    ok(`47.10 ${sel} har mindst én regel i system.css`,
      new RegExp(`\\${sel}[{,:\\s]`).test(css));
  }

  /* DEN DYRESTE ENKELTLINJE I SPORET. Comp'ens .vc{display:block} er en
     forfatterregel og slaar UA-arkets [hidden]{display:none}. Soegningen
     skjuler chips med el.hidden, saa uden vaernet bliver alle 77 staaende.
     Maalt modproeve i browseren: uden linjen gav "spot" 77 synlige, med den 1.
     Fejlen ville have vaeret usynlig - fladen ser rigtig ud begge veje. */
  ok('47.11 .vc[hidden] tvinges til display:none, ellers virker soegningen ikke',
    /\.vc\[hidden\]\s*\{[^}]*display:\s*none/.test(css));

  ok('47.12 vaelgeren er et gitter, ikke en flex-raekke (compens greb)',
    /\.vaelgernet\s*\{[^}]*display:\s*grid/.test(css));

  ok('47.13 afkrydsningsfeltet skjules uden at forsvinde for tastaturet',
    /\.vc__felt\s*\{[^}]*opacity:\s*0/.test(css) && !/\.vc__felt\s*\{[^}]*display:\s*none/.test(css));

  ok('47.14 der er en synlig fokusring paa :focus-visible',
    /\.vc__felt:focus-visible\s*\+\s*\.vc__mrk\s*\{[^}]*outline:/.test(css));

  /* ============================================================== PUNKT 2 */

  /* Selve reglen: ingen af de fire tilstande maa saette sin sats i em.
     em'en var aarsagen til, at samme chip stod i 16 px og 7,82 px paa
     samme side. */
  for (const kl of ['v-ikke', 'v-nej', 'v-billede']) {
    const m = css.match(new RegExp(`\\n\\.${kl}\\s*\\{([^}]*)\\}`));
    ok(`47.15 .${kl} har en basisregel i system.css`, m !== null);
    if (!m) continue;
    const fs2 = (m[1].match(/font-size:\s*([^;]+)/) || [])[1];
    ok(`47.16 .${kl} saetter sin sats i px, ikke em (fandt: ${fs2})`,
      fs2 !== undefined && /px\s*$/.test(fs2.trim()));
  }

  /* Kaskadevaernet. generator.css:719 `.saml-raekke__celle .v{font-size:16px}`
     er (0,0,2,0) og indlaeses EFTER system.css. Uden en regel med hoejere
     specificitet arver ALLE fire tilstande 16 px - samme sats som tallet
     selv, hvilket er haard begraensning 5's fejltilstand. */
  const generisk = /\.saml-raekke__celle\s+\.v\s*\{[^}]*font-size:\s*16px/.test(genCss);
  ok('47.17 generator.css saetter stadig den generiske .v til 16px (forudsaetningen for 47.18)',
    generisk);

  for (const kl of ['v-ikke', 'v-nej', 'v-billede', 'v-ja']) {
    const re = new RegExp(`td\\.saml-raekke__celle\\s+\\.${kl}\\b`);
    ok(`47.18 .${kl} har en matrix-regel, der slaar den generiske .v`, re.test(css));
  }

  /* Beviset for at vaernet er staerkt nok - ikke bare til stede. En regel
     med samme specificitet ville TABE, fordi generator.css kommer sidst. */
  const vores = spec('td.saml-raekke__celle .v-ikke');
  const deres = spec('.saml-raekke__celle .v');
  ok(`47.19 matrix-reglen er mere specifik end den generiske (${vores} > ${deres})`,
    vores[0] > deres[0] || (vores[0] === deres[0] && vores[1] > deres[1]));

  /* JPK's oprindelige klage: kassen. .v-ikke skal dele .omregnets kasse. */
  const vIkke = (css.match(/\n\.v-ikke\s*\{([^}]*)\}/) || [])[1] || '';
  const omregnet = (css.match(/\n\.omregnet\s*\{([^}]*)\}/) || [])[1] || '';
  const felt = (blokTekst, navn) => ((blokTekst.match(new RegExp(`${navn}:\\s*([^;]+)`)) || [])[1] || '').trim();

  for (const navn of ['padding', 'border-radius']) {
    ok(`47.20 .v-ikke deler .omregnets ${navn} (${felt(vIkke, navn)} = ${felt(omregnet, navn)})`,
      felt(vIkke, navn) !== '' && felt(vIkke, navn) === felt(omregnet, navn));
  }

  /* HAARD BEGRAENSNING 5. De to maa dele kasse, men ALDRIG blive det samme
     tegn: "ikke oplyst" er en TILSTAND, "omregnet" er et OPRINDELSESMAERKE.
     Den bevidst bevarede forskel er det stiplede kvadrat, som ogsaa er det,
     der skiller de tre tilstande fra hinanden indbyrdes. */
  ok('47.21 .v-ikke beholder sit stiplede kvadrat (.mrk) - det .omregnet aldrig faar',
    /\.v-ikke\s+\.mrk\s*\{[^}]*border:\s*1px\s+dashed/.test(css));

  ok('47.22 .v-ikke er minuskler, .omregnet er versaler - de kan ikke forveksles',
    !/text-transform:\s*uppercase/.test(vIkke) && /text-transform:\s*uppercase/.test(omregnet));

  ok('47.23 de tre tilstande har hver sit kvadrat (fyldt / aabent / stiplet)',
    /\.v-nej\s+\.mrk\s*\{[^}]*background:\s*var\(--blaek\)/.test(css)
    && /\.v-ja\s+\.mrk\s*\{[^}]*inset/.test(css)
    && /\.v-ikke\s+\.mrk\s*\{[^}]*dashed/.test(css));

  fs.rmSync(udMappe, { recursive: true, force: true });
}
