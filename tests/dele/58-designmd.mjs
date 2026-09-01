/**
 * tests/dele/58-designmd.mjs — spor/document, 1. sep 2026.
 *
 * DESIGN.md paastod indtil dette spor et forladt system (ORBIT-lys): 0 af 14
 * farver i frontmatter matchede koden, og de navngivne skrifter (Manrope,
 * JetBrains Mono) havde ingen fontfiler paa disken. Filen SAA rigtig ud —
 * gyldig YAML-frontmatter, korrekt afsnitsstruktur — og var alligevel forkert
 * i hvert eneste tal. Ingen test opdagede det, fordi ingen test laeste
 * DESIGN.md overhovedet.
 *
 * Denne del laaser fire ting, saa den fejl ikke kan gentage sig lydloest:
 *   1. Frontmatter findes og har en "colors:"-noegle.
 *   2. HVER farve i DESIGN.md's frontmatter matcher assets/system.css's
 *      :root paa vaerdi (ikke kun paa navn).
 *   3. HVER farve i :root er dokumenteret i DESIGN.md — en ny token i koden,
 *      som ingen har foejet til filen, skal ogsaa faa denne test til at
 *      fejle, ikke kun en aendret vaerdi.
 *   4. Ingen opfundne farvenavne i DESIGN.md, der ikke findes i :root.
 *   5. De to skriftfamilier, der har fontfiler paa disken (SairaSemiCondensed,
 *      Literata), er navngivet i frontmatter.
 *   6. "## Konflikter" findes og navngiver mindst fire konflikter — samme
 *      kontrol som briefets acceptkriterium 4, laast som test.
 *
 * MAALEAPPARATET: udtraekket af farver genbruger PRAECIS samme regex-logik
 * som fund/maal-designmd.mjs (orkestratorens egen maaler, skrevet til
 * briefet) — se den fil for hvorfor: frontmatter-graensen er linjen mellem
 * foerste og andet '---', og en farvelinje er en to-mellemrums-indrykket
 * "navn: \"#HEX\"" inde i "colors:"-blokken.
 */
import fs from 'node:fs';
import path from 'node:path';

/** Samme udtraeksregel som fund/maal-designmd.mjs. Returnerer [[navn, HEX], ...]. */
export function laesFrontmatterFarver(designMd) {
  const linjer = designMd.split(/\r?\n/);
  const graenser = linjer
    .map((l, i) => (l.trim() === '---' ? i : -1))
    .filter((i) => i >= 0);
  if (graenser.length < 2) return null; // ingen frontmatter
  const fm = linjer.slice(graenser[0] + 1, graenser[1]);

  const farver = [];
  let iColors = false;
  for (const l of fm) {
    if (/^colors:/.test(l)) { iColors = true; continue; }
    if (iColors && /^\S/.test(l)) iColors = false;
    const m = iColors && l.match(/^\s+([a-z0-9-]+):\s*"?(#[0-9A-Fa-f]{3,8})"?/);
    if (m) farver.push([m[1], m[2].toUpperCase()]);
  }
  return farver;
}

/** Farver deklareret direkte i :root (navn -> HEX, sidste vinder ved dublet). */
export function laesRodFarver(css) {
  const root = (css.match(/:root\{[\s\S]*?\n\}/) || [''])[0];
  const kode = new Map();
  for (const m of root.matchAll(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{3,8})/g)) {
    kode.set(m[1], m[2].toUpperCase());
  }
  return kode;
}

export default async function koer(ctx) {
  const { rod, ok } = ctx;

  console.log('\n58. DESIGN.md: frontmatter mod koden, og "## Konflikter" (spor/document)');

  const designPath = path.join(rod, 'DESIGN.md');
  const designMd = fs.readFileSync(designPath, 'utf8');
  const css = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');

  const dmFarver = laesFrontmatterFarver(designMd);
  const kodeFarver = laesRodFarver(css);

  ok('58.1: DESIGN.md har en frontmatter med en "colors:"-blok',
    dmFarver !== null && dmFarver.length > 0,
    dmFarver === null ? 'ingen frontmatter fundet (to "---"-linjer mangler)' : `0 farver udtrukket`);

  if (dmFarver === null || dmFarver.length === 0 || kodeFarver.size === 0) {
    ok('58.2: (sprunget over — apparatet er i stykker, se 58.1)', false,
      `DESIGN.md ${dmFarver ? dmFarver.length : 0} farver, :root ${kodeFarver.size} farver`);
    return;
  }

  let ens = 0;
  const afvig = [];
  for (const [navn, vaerdi] of dmFarver) {
    const kodeVaerdi = kodeFarver.get(navn);
    if (kodeVaerdi === vaerdi) ens++;
    else afvig.push(`${navn}: DESIGN.md ${vaerdi} / kode ${kodeVaerdi || '(findes ikke)'}`);
  }
  console.log(`  info  58: ${ens} af ${dmFarver.length} DESIGN.md-farver matcher :root`);

  ok('58.2: hver farve i DESIGN.md matcher :root paa vaerdi',
    ens === dmFarver.length, afvig.join(' · '));

  const dmNavne = new Set(dmFarver.map(([navn]) => navn));
  const udaekket = [...kodeFarver.keys()].filter((navn) => !dmNavne.has(navn));
  ok('58.3: hver farve i :root er dokumenteret i DESIGN.md',
    udaekket.length === 0, `udokumenteret: ${udaekket.join(', ')}`);

  const ikkeIRod = [...dmNavne].filter((navn) => !kodeFarver.has(navn));
  ok('58.4: ingen opfundne farvenavne i DESIGN.md (alle findes i :root)',
    ikkeIRod.length === 0, `opfundet: ${ikkeIRod.join(', ')}`);

  // Skriftfiler: de familier, der reelt ligger i assets/fonts/, skal kunne
  // genfindes i frontmatterens fontFamily-strenge (ikke kun paastaas).
  const fontFiler = fs.readdirSync(path.join(rod, 'assets', 'fonts'));
  const harSaira = fontFiler.some((f) => f.startsWith('saira-'));
  const harLiterata = fontFiler.some((f) => f.startsWith('literata-'));
  const fmFamilier = [...designMd.matchAll(/fontFamily:\s*"?([^",\n]+)/g)].map((m) => m[1]);
  const naevnerSaira = fmFamilier.some((f) => /saira/i.test(f));
  const naevnerLiterata = fmFamilier.some((f) => /literata/i.test(f));

  ok('58.5: skriftfamilier med fontfiler paa disken er navngivet i frontmatter',
    (!harSaira || naevnerSaira) && (!harLiterata || naevnerLiterata),
    `saira-filer:${harSaira} naevnt:${naevnerSaira} · literata-filer:${harLiterata} naevnt:${naevnerLiterata}`);

  // "## Konflikter": samme kontrol som briefets acceptkriterium 4.
  const konfliktStart = designMd.indexOf('\n## Konflikter');
  let konfliktAfsnit = '';
  if (konfliktStart !== -1) {
    const naeste = designMd.indexOf('\n## ', konfliktStart + 1);
    konfliktAfsnit = naeste === -1
      ? designMd.slice(konfliktStart)
      : designMd.slice(konfliktStart, naeste);
  }
  const noegleord = ['nulstil', '4:3', '#E8EBED', 'Manrope'];
  const fundne = noegleord.filter((n) => konfliktAfsnit.includes(n));

  ok('58.6: "## Konflikter" findes og navngiver mindst 4 af de kendte konflikter',
    konfliktStart !== -1 && fundne.length >= 4,
    konfliktStart === -1 ? 'afsnittet findes ikke' : `fandt kun: ${fundne.join(', ')}`);
}
