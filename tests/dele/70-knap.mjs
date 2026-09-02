/**
 * tests/dele/70-knap.mjs — spor/knap, L77, 2. sep 2026.
 *
 * Vogter ÉN knapprimitiv. Foer L77 talte sitet ELLEVE knapudtryk, hver med
 * sin egen stemme, sin egen flade og sin egen fejl; nu er der `.knap` med
 * varianter. Denne fil skal fejle, hvis nogen af de tre ting sker igen:
 *
 *   1. En pensioneret knapklasse dukker op (70.1) — eller en helt ny
 *      knap-lignende klasse bliver til det tolvte udtryk (70.2).
 *   2. Grundformen faar en farve (70.4). Det er sporets vigtigste regel og
 *      den, der er koebt dyrest: `.knap` saetter `color:inherit` og
 *      `background:transparent`, saa en knap UDEN flade-variant arver den
 *      flade, den staar paa. Den dag grundformen faar en fast forgrund, er
 *      der igen en "forkert flade, man faar ved et uheld" - og det var
 *      praecis den, spor/saml3 betalte 1,16:1 for dagen foer dette spor.
 *   3. En variant mister sin kontrast (70.5). Kontrasten regnes HER, med
 *      WCAG's egen formel paa tokenernes faktiske hex-vaerdier, og ikke
 *      afskrevet fra en kommentar. L70's laerdom staar i kommentaren til
 *      FLADER nedenfor: et kontrasttal uden en laeseretning er ikke et tal.
 *
 * MAALEAPPARATET VALIDERES FOERST (70.0). Kontrastmotoren proeves mod fem
 * kendte svar fra DESIGN.md, foer ét eneste af dens tal bruges. Et nyt
 * maaleapparat, der ikke er holdt op mod et kendt svar, er et gaet.
 */
import fs from 'node:fs';
import path from 'node:path';

/** Klasser, L77 pensionerede. Ingen af dem maa findes i bygget HTML, i en
 *  CSS-selektor eller som klassenavn i klient-JS'en igen. Listen er en
 *  BESLUTNING, ikke en observation: kommer en klasse tilbage, skal nogen
 *  kunne begrunde hvorfor. */
const PENSIONEREDE = ['videre', 'videre--stille', 'nulstil', 'valg__fjern'];

/** Flade-varianterne og den flade, hver enkelt er skrevet TIL. Kortet er en
 *  BESLUTNING, ikke en maaling — CSS kan ikke selv vide, hvilken baggrund en
 *  knap kommer til at staa paa, og det er netop dét, der gik galt, da
 *  `.nulstil` (skrevet til moerk flade) blev genbrugt paa lys bund.
 *
 *  `paa` er tokenet for FLADEN under knappen. Saetter varianten selv en
 *  baggrund, vinder den over `paa` — saa maales teksten mod knappens egen
 *  flade, hvilket er den rigtige laeseretning for en fyldt knap. */
const FLADER = {
  'knap--fyldt': { paa: 'bund' },          // saetter selv background:var(--blaek)
  'knap--kant': { paa: 'bund' },
  'knap--tekst': { paa: 'bund' },
  'knap--kant-moerk': { paa: 'fod' },
  'knap--tekst-moerk': { paa: 'fod' },
  'knap--maerkat': { paa: 'bund' },        // saetter selv background:var(--bund)
};

/** Sammensatte varianter: `--frem` er tekstvaegtens oeverste trin og staar
 *  altid sammen med en tekst-variant. Selektoren er ordret den, der staar i
 *  CSS'en. */
const SAMMENSATTE = {
  '.knap--tekst.knap--frem': { paa: 'bund' },
  '.knap--tekst-moerk.knap--frem': { paa: 'fod' },
};

/** WCAG 2.x relativ luminans og kontrastforhold. */
const kanal = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const luminans = (hex) => {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => kanal(parseInt(h.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const kontrast = (a, b) => {
  const [hoej, lav] = [luminans(a), luminans(b)].sort((x, y) => y - x);
  return (hoej + 0.05) / (lav + 0.05);
};
const vis = (n) => n.toFixed(2).replace('.', ',');

const udenKommentarer = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');

/** Slaar et token op i :root og foelger var()-kaeden ned til en hex-vaerdi. */
function byggTokens(css) {
  const rod = (css.match(/:root\s*\{([\s\S]*?)\}/) || [])[1] || '';
  const raa = new Map();
  for (const m of rod.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) raa.set(m[1], m[2].trim());
  const slaa = (navn, dybde = 0) => {
    if (dybde > 10) return null;
    const v = raa.get(navn);
    if (!v) return null;
    const via = v.match(/^var\(\s*(--[\w-]+)\s*\)$/);
    if (via) return slaa(via[1], dybde + 1);
    const hex = v.match(/^#([0-9a-fA-F]{6})$/);
    return hex ? '#' + hex[1] : null;
  };
  return slaa;
}

/** Henter kroppen af en regel med en ORDRET selektor (fx ".knap--kant"). */
function regel(css, selektor) {
  for (const blok of css.split('}')) {
    const i = blok.indexOf('{');
    if (i === -1) continue;
    const sel = blok.slice(0, i).split(',').map((s) => s.trim());
    if (sel.includes(selektor)) return blok.slice(i + 1);
  }
  return null;
}

export default async function koer(ctx) {
  const { rod, ok } = ctx;

  console.log('\n70. spor/knap: ÉN knapprimitiv (L77)');

  const sysRaa = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');
  const genRaa = fs.readFileSync(path.join(rod, 'assets', 'generator.css'), 'utf8');
  const sys = udenKommentarer(sysRaa);
  const gen = udenKommentarer(genRaa);
  const begge = sys + '\n' + gen;
  const jsFiler = fs.readdirSync(path.join(rod, 'assets')).filter((f) => f.endsWith('.js'));
  const js = jsFiler.map((f) => fs.readFileSync(path.join(rod, 'assets', f), 'utf8')).join('\n');
  const token = byggTokens(sys);

  /* --- 70.0 MAALEAPPARATET FOERST ---------------------------------------
     Fem kontrastforhold, DESIGN.md allerede angiver. Rammer motoren dem
     ikke, er alt herunder vaerdiloest, og saa skal DEN fejl rettes foerst. */
  {
    const kendte = [
      ['blaek paa bund', '--blaek', '--bund', 12.72],
      ['blaek paa panel', '--blaek', '--panel', 14.69],
      ['blaek paa accent', '--blaek', '--accent', 9.19],
      ['blaek3 paa bund', '--blaek3', '--bund', 4.74],
      ['paafod2 paa fod', '--paafod2', '--fod', 5.94],
    ];
    let ramte = 0;
    const afvig = [];
    for (const [navn, fg, bg, vent] of kendte) {
      const a = token(fg); const b = token(bg);
      const faktisk = a && b ? kontrast(a, b) : null;
      if (faktisk !== null && Math.abs(faktisk - vent) < 0.02) ramte++;
      else afvig.push(`${navn}: ventet ${vis(vent)}, fik ${faktisk === null ? 'intet token' : vis(faktisk)}`);
    }
    ok(`70.0: kontrastmotoren rammer alle ${kendte.length} kendte svar fra DESIGN.md (${ramte}/${kendte.length})`,
      ramte === kendte.length, afvig.join(' · '));
    // REVERT-BEVIS: motoren skal ogsaa kunne sige NEJ. Hvid paa accent er
    // 1,66:1 og maa aldrig komme ud som bestaaet.
    ok('70.0/revert: motoren giver 1,66 for hvid paa accent (den forbudte kombination)',
      Math.abs(kontrast('#FFFFFF', token('--accent')) - 1.66) < 0.02,
      `fik ${vis(kontrast('#FFFFFF', token('--accent')))}`);
  }

  /* --- 70.1 De pensionerede klasser er vaek ------------------------------ */
  {
    const dist = path.join(rod, 'dist');
    const tokensIHtml = new Set();
    const gaa = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) gaa(p);
        else if (e.name.endsWith('.html')) {
          for (const m of fs.readFileSync(p, 'utf8').matchAll(/class="([^"]*)"/g)) {
            for (const c of m[1].split(/\s+/)) if (c) tokensIHtml.add(c);
          }
        }
      }
    };
    if (fs.existsSync(dist)) gaa(dist);

    /* KLASSE-TOKENS, ikke delstrenge. Briefets eget K1 taalte ".robot-videre"
       med under "videre", fordi bindestregen er en \b-ordgraense - og kunne
       derfor aldrig naa 0. Her splittes class-attributten paa mellemrum, saa
       en klasse kun taeller som sig selv. */
    const iHtml = PENSIONEREDE.filter((k) => tokensIHtml.has(k));
    ok(`70.1a: ingen pensioneret knapklasse i bygget HTML (${PENSIONEREDE.length} proevet)`,
      iHtml.length === 0, `fandt: ${iHtml.join(', ')}`);

    const selektorer = (css) => css.split('}').map((b) => b.split('{')[0]).join('\n');
    const iCss = PENSIONEREDE.filter((k) =>
      new RegExp('\\.' + k.replace(/-/g, '\\-') + '(?![\\w-])').test(selektorer(begge)));
    ok(`70.1b: ingen pensioneret knapklasse som CSS-selektor`,
      iCss.length === 0, `fandt: ${iCss.join(', ')}`);

    const iJs = PENSIONEREDE.filter((k) =>
      new RegExp('[\'"`\\s]' + k.replace(/-/g, '\\-') + '[\'"`\\s]').test(js));
    ok('70.1c: ingen pensioneret knapklasse skrives af klient-JS',
      iJs.length === 0, `fandt: ${iJs.join(', ')}`);

    // REVERT-BEVIS: proeven skal kunne SE en klasse, der er der. ".knap"
    // findes beviseligt alle tre steder.
    ok('70.1/revert: samme tre proever finder "knap", som beviseligt ER der',
      tokensIHtml.has('knap')
      && new RegExp('\\.knap(?![\\w-])').test(selektorer(begge))
      && /['"`\s]knap['"`\s]/.test(js));
  }

  /* --- 70.2 Hver <button> paa sitet ER primitiven ------------------------
     Det er vagten mod et TOLVTE knapudtryk. En ny knap-lignende klasse kan
     opstaa uden at nogen fjerner noget; den fanges her, fordi den vil vaere
     en <button> uden `.knap`. */
  {
    const dist = path.join(rod, 'dist');
    let alle = 0;
    const uden = [];
    const gaa = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) gaa(p);
        else if (e.name.endsWith('.html')) {
          for (const m of fs.readFileSync(p, 'utf8').matchAll(/<button\b([^>]*)>/g)) {
            alle++;
            const kl = (m[1].match(/class="([^"]*)"/) || [])[1] || '';
            if (!kl.split(/\s+/).includes('knap') && uden.length < 5) uden.push(`class="${kl}"`);
          }
        }
      }
    };
    if (fs.existsSync(dist)) gaa(dist);
    ok(`70.2a: der ER knapper at maale paa (fandt ${alle} <button> i dist)`, alle > 0);
    ok(`70.2b: hver eneste <button> i dist baerer primitiven .knap (${alle - uden.length} af ${alle})`,
      uden.length === 0, `uden .knap: ${uden.join(' · ')}`);
    // REVERT-BEVIS: en syntetisk knap uden .knap skal fanges af samme proeve.
    ok('70.2/revert: samme proeve fanger en <button> uden .knap',
      !('<button class="ny-knap">x</button>'.match(/<button\b([^>]*)>/)[1]
        .match(/class="([^"]*)"/)[1].split(/\s+/).includes('knap')));
  }

  /* --- 70.3 Hver knap har VALGT en flade -------------------------------- */
  {
    const dist = path.join(rod, 'dist');
    let alle = 0;
    const uden = [];
    const harFlade = (kl) => kl.split(/\s+/).some((c) => /^knap--/.test(c) && c !== 'knap--frem');
    const gaa = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) gaa(p);
        else if (e.name.endsWith('.html')) {
          for (const m of fs.readFileSync(p, 'utf8').matchAll(/class="([^"]*)"/g)) {
            if (!m[1].split(/\s+/).includes('knap')) continue;
            alle++;
            if (!harFlade(m[1]) && uden.length < 5) uden.push(`class="${m[1]}"`);
          }
        }
      }
    };
    if (fs.existsSync(dist)) gaa(dist);
    ok(`70.3: hver .knap i dist har valgt en variant, ingen staar bar (${alle - uden.length} af ${alle})`,
      alle > 0 && uden.length === 0, `bar .knap: ${uden.join(' · ')}`);
  }

  /* --- 70.4 GRUNDFORMEN ER FARVELOES ------------------------------------
     Sporets vigtigste regel. Se filens hoved. */
  {
    const krop = regel(sys, '.knap') || '';
    ok('70.4a: `.knap`-reglen findes i system.css', krop.length > 0);
    const farve = (krop.match(/(?:^|;)\s*color\s*:\s*([^;]+)/) || [])[1];
    const bag = (krop.match(/(?:^|;)\s*background\s*:\s*([^;]+)/) || [])[1];
    ok(`70.4b: grundformen saetter color:inherit, ikke en fast farve (fandt "${(farve || '').trim()}")`,
      (farve || '').trim() === 'inherit',
      'en fast forgrund paa grundformen genskaber "den forkerte flade, man faar ved et uheld" (spor/saml3: 1,16:1)');
    ok(`70.4c: grundformen saetter background:transparent (fandt "${(bag || '').trim()}")`,
      (bag || '').trim() === 'transparent');
    // REVERT-BEVIS: proeven skal afvise en grundform med en fast farve.
    const syntetisk = 'color:var(--paafod);background:var(--fod);';
    ok('70.4/revert: samme proeve afviser en grundform med en fast forgrund',
      (syntetisk.match(/(?:^|;)\s*color\s*:\s*([^;]+)/) || [])[1].trim() !== 'inherit');
  }

  /* --- 70.5 KONTRASTEN PAA HVER VARIANT --------------------------------- */
  {
    const AA = 4.5;
    const maalinger = [];
    const fald = [];
    const proev = (navn, selektor, fladeToken) => {
      const krop = regel(begge, selektor);
      if (krop === null) { fald.push(`${navn}: reglen ${selektor} findes ikke`); return; }
      const fg = (krop.match(/(?:^|;)\s*color\s*:\s*var\(\s*(--[\w-]+)\s*\)/) || [])[1];
      if (!fg) return; // fx --kryds, der bevidst arver forgrunden
      const egenBag = (krop.match(/(?:^|;)\s*background\s*:\s*var\(\s*(--[\w-]+)\s*\)/) || [])[1];
      const bgToken = egenBag || fladeToken;
      const a = token(fg); const b = token(bgToken);
      if (!a || !b) { fald.push(`${navn}: kunne ikke slaa ${fg} eller ${bgToken} op`); return; }
      const k = kontrast(a, b);
      maalinger.push(`${navn} ${vis(k)} (${fg.slice(2)} paa ${bgToken.slice(2)})`);
      if (k < AA) fald.push(`${navn}: ${vis(k)} - ${fg} paa ${bgToken}`);
    };

    for (const [k, { paa }] of Object.entries(FLADER)) proev(k, '.' + k, '--' + paa);
    for (const [sel, { paa }] of Object.entries(SAMMENSATTE)) proev(sel, sel, '--' + paa);
    // Familiens hover-gestus: kassen fyldes med accent, teksten gaar til blaek.
    proev('hover (kasse-vaegtene)', '.knap--fyldt:hover', '--bund');

    ok(`70.5: hver flade-variant er over WCAG AA 4,5:1 — ${maalinger.join(' · ')}`,
      fald.length === 0, `under 4,5: ${fald.join(' · ')}`);

    // REVERT-BEVIS, og det er den vigtige: den kombination, L76 forbyder -
    // accent som forgrund paa lys bund - SKAL falde igennem den samme proeve.
    // Uden dette bevis kunne 70.5 vaere groen, fordi den maaler forkert.
    const forbudt = kontrast(token('--accent'), token('--bund'));
    ok(`70.5/revert: accent paa lys bund fanges som for lav (${vis(forbudt)} < 4,5)`,
      forbudt < AA);
    // ... og den lovlige undtagelse, accent paa den MOERKE flade, skal bestaa.
    const lovlig = kontrast(token('--accent'), token('--fod'));
    ok(`70.5/revert2: accent paa den moerke flade bestaar (${vis(lovlig)} >= 4,5)`,
      lovlig >= AA);
  }

  /* --- 70.6 De to flader hedder noget forskelligt ------------------------
     Briefets tredje vaern: "moerk-flade og lys-flade skal hedde noget
     forskelligt, og ingen af dem maa vaere den, man faar ved et uheld."
     Vagten er, at hver moerk variant BAERER ordet i sit navn. */
  {
    const moerke = Object.keys(FLADER).filter((k) => FLADER[k].paa === 'fod');
    const udenOrd = moerke.filter((k) => !k.endsWith('-moerk'));
    ok(`70.6: hver variant skrevet til den moerke flade baerer "-moerk" i sit navn (${moerke.length} proevet)`,
      moerke.length > 0 && udenOrd.length === 0, `uden ordet: ${udenOrd.join(', ')}`);
  }
}
