// Å25b, udførelse: erstat hvert 'fra'-fragment med 'til'-fragment i den navngivne
// robotfils `<felt>: advarsel: "..."`-linje. Fejler synligt (og rører ingen filer)
// hvis et fragment ikke findes PRÆCIS ÉN GANG i den unescapede advarsel-tekst,
// eller hvis advarsel-linjen for det navngivne felt ikke findes, før noget skrives.
import fs from 'node:fs';
import path from 'node:path';
import { OMSKRIVNINGER } from './_advarsel-omskriv-data.mjs';

const rod = 'data/robots';

function unescapeYamlDouble(s) {
  let result = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\' && i + 1 < s.length) {
      const next = s[i + 1];
      if (next === '\\' || next === '"') {
        result += next;
        i++;
        continue;
      }
    }
    result += s[i];
  }
  return result;
}
function escapeYamlDouble(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// Find linjenummeret for <felt>:'s advarsel-linje i en fils linjeliste.
function findAdvarselLinje(lines, felt) {
  let currentFelt = null;
  for (let i = 0; i < lines.length; i++) {
    const feltMatch = lines[i].match(/^  (\w+):\s*$/);
    if (feltMatch) currentFelt = feltMatch[1];
    if (currentFelt === felt) {
      const advMatch = lines[i].match(/^(\s+advarsel:\s*)"(.*)"\s*$/);
      if (advMatch) return i;
    }
  }
  return -1;
}

// Fase 1: valider alt, aendr intet.
const fejl = [];
const planer = []; // {p, lines, lineIdx, nyEscaped}
const filLinjer = new Map();

for (const o of OMSKRIVNINGER) {
  const p = path.join(rod, o.slug + '.yaml');
  if (!filLinjer.has(p)) filLinjer.set(p, fs.readFileSync(p, 'utf8').split('\n'));
  const lines = filLinjer.get(p);
  const lineIdx = findAdvarselLinje(lines, o.felt);
  if (lineIdx < 0) {
    fejl.push(`${o.slug} [${o.felt}]: advarsel-linje ikke fundet`);
    continue;
  }
  const m = lines[lineIdx].match(/^(\s+advarsel:\s*)"(.*)"\s*$/);
  const praefiks = m[1];
  const unescaped = unescapeYamlDouble(m[2]);
  const count = unescaped.split(o.fra).length - 1;
  if (count !== 1) {
    fejl.push(`${o.slug} [${o.felt}]: fragment fundet ${count} gange i advarsel-teksten (forventede 1)`);
    continue;
  }
  const nyUnescaped = unescaped.split(o.fra).join(o.til);
  const nyEscaped = `${praefiks}"${escapeYamlDouble(nyUnescaped)}"`;
  planer.push({ p, lines, lineIdx, nyEscaped, slug: o.slug, felt: o.felt });
}

if (fejl.length) {
  console.error('VALIDERING FEJLEDE - ingen filer aendret:');
  console.error(fejl.join('\n'));
  process.exit(1);
}

// Fase 2: anvend planerne, grupperet pr. fil, saa flere aendringer i samme fil
// begge slaar igennem foer skrivning.
const perFilLinjer = new Map();
for (const plan of planer) {
  if (!perFilLinjer.has(plan.p)) perFilLinjer.set(plan.p, [...plan.lines]);
  const arr = perFilLinjer.get(plan.p);
  arr[plan.lineIdx] = plan.nyEscaped;
}
for (const [p, lines] of perFilLinjer) {
  fs.writeFileSync(p, lines.join('\n'), 'utf8');
}

console.log('Filer aendret:', perFilLinjer.size);
console.log('Omskrivninger udfoert:', OMSKRIVNINGER.length);
