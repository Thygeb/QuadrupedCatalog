// FASE A: byg fund/NOTEARKIV-1.md fra de noter, klassifikationen mærker 'I'.
// Rører IKKE data/robots/ - kun læsning. Fase B (separat script) sletter først,
// når dette output er efterprøvet.
import fs from 'node:fs';
import path from 'node:path';
import { KLASSIFIKATION } from './_noter-klassifikation.mjs';

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

function extractNoter(txt) {
  const lines = txt.split('\n');
  const idx = lines.findIndex(l => l.trim() === 'noter:');
  if (idx < 0) return null;
  const notes = [];
  let endLine = lines.length;
  for (let i = idx + 1; i < lines.length; i++) {
    const l = lines[i];
    const m = l.match(/^  - "(.*)"\s*$/);
    if (m) {
      notes.push(unescapeYamlDouble(m[1]));
    } else if (/^\S/.test(l)) {
      endLine = i;
      break;
    }
  }
  return { startLine: idx, endLine, notes };
}

const rod = 'data/robots';
const files = fs.readdirSync(rod).filter(f => f.endsWith('.yaml')).sort();

const arkivSektioner = [];
let totalIntern = 0;
let totalNoter = 0;
let filerUdenKlassifikation = [];
let laengdeMismatch = [];

for (const f of files) {
  const slug = f.replace(/\.yaml$/, '');
  const txt = fs.readFileSync(path.join(rod, f), 'utf8');
  const parsed = extractNoter(txt);
  if (!parsed || parsed.notes.length === 0) continue;
  totalNoter += parsed.notes.length;

  const klass = KLASSIFIKATION[slug];
  if (!klass) {
    filerUdenKlassifikation.push(slug);
    continue;
  }
  if (klass.length !== parsed.notes.length) {
    laengdeMismatch.push(`${slug}: klassifikation=${klass.length} noter=${parsed.notes.length}`);
    continue;
  }

  const interne = [];
  parsed.notes.forEach((note, i) => {
    if (klass[i] === 'I') {
      interne.push({ index: i, tekst: note });
      totalIntern++;
    }
  });

  if (interne.length > 0) {
    const dele = interne.map(n => `**[${n.index}]** ${n.tekst}`).join('\n\n');
    arkivSektioner.push(`## ${slug}\n\n${dele}\n`);
  }
}

if (filerUdenKlassifikation.length) {
  console.error('MANGLER KLASSIFIKATION for:', filerUdenKlassifikation.join(', '));
  process.exit(1);
}
if (laengdeMismatch.length) {
  console.error('LAENGDE-MISMATCH:', laengdeMismatch.join(' | '));
  process.exit(1);
}

const header = `# NOTEARKIV-1.md — interne noter flyttet ud af \`data/robots/*.yaml\`

Bygget under spor/noter (27. aug 2026), punkt Å25a i briefet. Grundlaget er
\`fund/FUND-forbehold.md\` afsnit 3b: 100 af 325 offentlige noter (regex-gulv, ikke facit)
bar intern revisionstekst - STOPPROEVE-verdikter, regel-/L-nummerhenvisninger, filnavne,
sessionsnavne, skemamangel-klager og katalogdesign-metakommentar.

**Alle ${totalIntern} noter herunder er læst enkeltvis og dømt, ikke fundet med en regex.**
De er citeret ORDRET fra deres YAML-kilde (kun \\" og \\\\-escape er fjernet) og er
FJERNET fra \`noter:\`-blokken i den tilhørende robotfil, i den rækkefølge, dette dokument
blev skrevet, jf. Å15's regel: en note slettes aldrig, før arkivet er efterprøvet at bære den.

Nummeret i firkantet parentes er notens oprindelige indeks i YAML-filens \`noter:\`-liste
(0-tal), så en fremtidig læser kan finde den præcise position, hvis git-historikken skal
efterprøves.

---

${arkivSektioner.join('\n---\n\n')}`;

fs.mkdirSync('fund', { recursive: true });
fs.writeFileSync('fund/NOTEARKIV-1.md', header, 'utf8');

console.log('Robotter med interne noter:', arkivSektioner.length);
console.log('Total noter (alle filer):', totalNoter);
console.log('Total INTERNE noter flyttet til arkiv:', totalIntern);
console.log('Total LAESERVENDT noter (bliver paa siden):', totalNoter - totalIntern);
