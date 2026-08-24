#!/usr/bin/env node
/**
 * tools/muteringstjek.mjs — muterer de RIGTIGE datafiler og beviser, at
 * validatoren stadig fanger dem.
 *
 * tests/koer.mjs oedelaegger syntetiske proeveposter. Det her program oedelaegger
 * kopier af de faktiske filer i data/robots/ - dem, en fremtidig aendring rent
 * faktisk vil roere ved. Forskellen er ikke akademisk: en regel kan vaere rigtig
 * paa en proevepost og alligevel ikke naa den form, de rigtige filer er skrevet i.
 *
 * Originalerne roeres ALDRIG. Hver sag skrives til sin egen mappe under
 * tests/.tmp-mutering/ og valideres der.
 *
 *   node tools/muteringstjek.mjs
 *
 * Exit 0 = hver sag opfoerte sig som forventet. Exit 1 = mindst én gjorde ikke.
 *
 * KENDT HUL (D10): én sag er markeret `kendtHul` og forventes at SLIPPE IGENNEM.
 * Fjernes `arvet_fra` fra en variant, ser posten ud som moderens egen - samme
 * citat, samme kilde - og intet i data siger, at de to er samme maskine. Sagen
 * staar her frem for at blive slettet, saa hullet er et maalt faktum og ikke en
 * husket bekymring. Lukkes det (fx med et maskinlaesbart `variant_af`), FEJLER
 * det her program - og det er med vilje: saa skal D10 lukkes i STATUS.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const node = process.execPath;
const ud = path.join('tests', '.tmp-mutering');
fs.rmSync(ud, { recursive: true, force: true });

const l = (f) => fs.readFileSync(`data/robots/${f}.yaml`, 'utf8');

/** [navn, forventet regel (null = kendt hul, skal slippe igennem), filer i mappen] */
const SAGER = [
  ['X30: citatet fjernet, kategorien staar', 'R16',
    { 'deep-robotics-x30': l('deep-robotics-x30').replace(/^  citat: .*\r?\n/m, '') }],
  ['X30: sikkerhed_overvaagning stavet med mellemrum', 'R16',
    { 'deep-robotics-x30': l('deep-robotics-x30').replace('sikkerhed_overvaagning', '"sikkerhed overvaagning"') }],
  ['X30: kategori uden for det tilladte saet smuglet ind', 'R16',
    { 'deep-robotics-x30': l('deep-robotics-x30').replace('sikkerhed_overvaagning', 'landbrug') }],
  // KENDT HUL - D10. Forventes at slippe igennem, indtil noget i data siger,
  // at B2-W er en udgave af B2. Se hovedkommentaren.
  ['B2-W: arvet_fra fjernet - arven staar nu umaerket', null,
    { 'unitree-b2-w': l('unitree-b2-w').replace(/^  arvet_fra: .*\r?\n/m, ''),
      'unitree-b2': l('unitree-b2') }],
  ['B2-W: arven peger paa en robot, der ikke findes', 'R17',
    { 'unitree-b2-w': l('unitree-b2-w').replace('arvet_fra: unitree-b2', 'arvet_fra: unitree-b9'),
      'unitree-b2': l('unitree-b2') }],
  ['B2-W: arven peger paa en moder uden citat (Laikago)', 'R17',
    { 'unitree-b2-w': l('unitree-b2-w').replace('arvet_fra: unitree-b2', 'arvet_fra: unitree-laikago'),
      'unitree-laikago': l('unitree-laikago') }],
  ['B2-W: arven giver varianten "logistik", som B2 ikke har', 'R17',
    { 'unitree-b2-w': l('unitree-b2-w').replace('vaerdi: industri', 'vaerdi: [industri, logistik]'),
      'unitree-b2': l('unitree-b2') }],
  ['B2-W: citatet skrevet om, saa det ikke laengere er B2s', 'R17',
    { 'unitree-b2-w': l('unitree-b2-w').replace('"Robot - Industry"', '"Robot for Industry"'),
      'unitree-b2': l('unitree-b2') }],
  ['B2-W: kilden skiftet til variantens egen side', 'R17',
    { 'unitree-b2-w': l('unitree-b2-w').replace('kilde: https://www.unitree.com/', 'kilde: https://www.unitree.com/b2-w'),
      'unitree-b2': l('unitree-b2') }],
  ['Go2-W: arv i kaede - Go2 saettes til selv at have arvet', 'R17',
    { 'unitree-go2-w': l('unitree-go2-w'),
      'unitree-go2': l('unitree-go2').replace(/^  hentet: (.*)$/m, '  hentet: $1\n  arvet_fra: unitree-b2'),
      'unitree-b2': l('unitree-b2') }],
  ['RBQ-10: citat og ikke_oplyst paa samme post', 'R16',
    { 'rainbow-robotics-rbq-10': l('rainbow-robotics-rbq-10').replace(/^  vaerdi: \[.*\]$/m, '  vaerdi: ikke_oplyst') }],
  ['Lynx S10: samme kategori to gange', 'R16',
    { 'deep-robotics-lynx-s10': l('deep-robotics-lynx-s10').replace('[inspektion, sikkerhed_overvaagning,', '[inspektion, inspektion, sikkerhed_overvaagning,') }],
  ['As2-W: hentedatoen fjernet fra anvendelsen', 'R7',
    { 'unitree-as2-w': l('unitree-as2-w').replace(/^  hentet: 2026-08-19\r?\n(?=  note)/m, '') }],
  ['X30 Pro: arvet_fra peger paa sig selv', 'R17',
    { 'deep-robotics-x30-pro': l('deep-robotics-x30-pro').replace('arvet_fra: deep-robotics-x30', 'arvet_fra: deep-robotics-x30-pro') }],

  /* R18 — billedet, sat ind i RIGTIGE filer. tests/koer.mjs proever R18 paa
     syntetiske poster; de her sager beviser, at reglen ogsaa naar den form, de
     46 faktiske filer er skrevet i. Ingen af dem har et `billede:` i dag, saa
     mutationen TILFOEJER et - det er praecis den redigering, en dataagent vil
     lave, naar billederne begynder at komme ind. */
  ['B2: billede tilfoejet uden ophav', 'R18',
    { 'unitree-b2': l('unitree-b2').replace(/^felter:/m,
      'billede:\n  fil: silhuetter/_proeve-kaede.svg\n  kilde: https://www.unitree.com/b2\n'
      + '  hentet: 2026-08-19\nfelter:') }],
  ['B2: billede peger paa en fil, ingen har lagt i assets/', 'R18',
    { 'unitree-b2': l('unitree-b2').replace(/^felter:/m,
      'billede:\n  fil: silhuetter/unitree-b2-staaende.svg\n  ophav: silhuet\n'
      + '  kilde: https://www.unitree.com/b2\n  hentet: 2026-08-19\nfelter:') }],
  ['Spot: billede hentet direkte fra media/', 'R18',
    { 'boston-dynamics-spot': l('boston-dynamics-spot').replace(/^felter:/m,
      'billede:\n  fil: media/_kilder/spot.jpg\n  ophav: fabrikant\n'
      + '  kilde: https://bostondynamics.com/products/spot/\n  hentet: 2026-08-19\nfelter:') }],
  ['ANYmal: silhuet uden kilde paa de maal, den er tegnet efter', 'R18',
    { 'anybotics-anymal': l('anybotics-anymal').replace(/^felter:/m,
      'billede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: silhuet\nfelter:') }],
];

let proevet = 0, fanget = 0, huller = 0, uventet = 0;
for (const [navn, regel, filer] of SAGER) {
  const m = path.join(ud, `sag-${proevet}`);
  fs.mkdirSync(m, { recursive: true });
  for (const [slug, indhold] of Object.entries(filer)) fs.writeFileSync(path.join(m, `${slug}.yaml`), indhold, 'utf8');
  const r = spawnSync(node, ['tools/validate.mjs', `--data=${m}`], { encoding: 'utf8' });
  const s = (r.stdout || '') + (r.stderr || '');
  const fejlIUd = s.split('\n').filter((x) => x.startsWith('FEJL')).join(' | ') || '(ingen fejl)';
  proevet++;

  if (regel === null) {
    // Kendt hul: sagen SKAL slippe igennem. Goer den ikke det, er hullet lukket,
    // og saa er det her program forkert - ikke validatoren.
    huller++;
    const slapIgennem = r.status === 0;
    if (!slapIgennem) uventet++;
    console.log(`${slapIgennem ? 'KENDT HUL (D10), slap igennem som ventet' : 'HULLET ER LUKKET - opdatér D10 og denne sag'}`
      + `  ${navn}` + (slapIgennem ? '' : `   [exit ${r.status}] ${fejlIUd}`));
    continue;
  }

  const somVentet = r.status === 1 && s.includes(` ${regel}: `);
  if (somVentet) fanget++; else uventet++;
  console.log(`${somVentet ? 'FANGET ' : 'SLAP IGENNEM'}  ${navn}  ->  ${regel}`
    + (somVentet ? '' : `   [exit ${r.status}] ${fejlIUd}`));
}
console.log(`\n${proevet} bevidst oedelagte kopier af RIGTIGE datafiler`
  + ` · ${proevet - huller} skulle fanges, fangede ${fanget}`
  + ` · ${huller} kendt hul (D10)`);
process.exit(uventet ? 1 : 0);
