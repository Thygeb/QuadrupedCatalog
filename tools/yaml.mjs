/**
 * tools/yaml.mjs — YAML-delmaengde-laeser. Nul afhaengigheder.
 *
 * Delt af validate.mjs og build.mjs, saa de to ikke kan divergere paa, hvad en
 * datafil betyder. En tredje kopi af parseren ville vaere den fjerde regel, ingen
 * har besluttet at aendre.
 *
 * Parseren er reddet fra den stoppede agents tools/validate.mjs (D9-udkastet).
 * Resten af det udkast er kasseret, fordi det validerede et andet skema end
 * det, dataagenten skriver efter lige nu.
 *
 * Understoettet: kort, blok-sekvenser, flow-kort {a: 1}, flow-lister [a, b],
 * citerede og bare skalarer, kommentarer, true/false/null.
 * Bevidst IKKE understoettet: tabulatorindrykning, blokskalarer (| og >), ankre,
 * tags, YAML 1.1-booleans (yes/no/on/off). Alt det fejler med linjenummer.
 *
 * Enheds- og operatorordforraadet (ENHEDER, kanoniskEnhed, tilBasis, OPERATORER,
 * findTal, normaliser, m.fl.) er IKKE her laengere — det bor i tools/enheder.mjs
 * (spor/opdel, 4. sep 2026, Aa178's punkt (b)). De to moduler deler ingenting.
 */

export class YamlFejl extends Error {}

function fjernKommentar(linje) {
  let ud = '';
  let citat = null;
  for (let i = 0; i < linje.length; i++) {
    const c = linje[i];
    if (citat) {
      ud += c;
      if (c === citat && linje[i - 1] !== '\\') citat = null;
      continue;
    }
    if (c === '"' || c === "'") { citat = c; ud += c; continue; }
    if (c === '#' && (i === 0 || /\s/.test(linje[i - 1]))) break;
    ud += c;
  }
  return ud.replace(/\s+$/, '');
}

/**
 * Noeglenavne. Feltnavne er understreg-ord, men "varianter:"-blokkene har
 * PRODUCENTENS egne variantnavne som noegler, og Unitree kalder den ene "A2-W PRO"
 * — med mellemrum. Derfor tillades enkelte indre mellemrum, men kun mellem to
 * navnetegn: "A2-W PRO" er en noegle, mens "Producenten skriver: noget" ikke er,
 * fordi ":" saa staar efter et mellemrum, og fordi bare skalarer i den her
 * datamaengde altid er citerede.
 */
const NOEGLE_RE = /^([A-Za-z_][A-Za-z0-9_.-]*(?: [A-Za-z0-9_.-]+)*)\s*:(?:\s+([\s\S]*))?$/;
const YAML11_BOOL = /^(y|Y|yes|Yes|YES|n|N|no|No|NO|on|On|ON|off|Off|OFF)$/;

export function parseYaml(src, fil = '<streng>') {
  const raekker = [];
  const linjer = src.replace(/^\uFEFF/, '').split(/\r?\n/);
  for (let i = 0; i < linjer.length; i++) {
    const nr = i + 1;
    const linje = linjer[i];
    if (/^\s*\t/.test(linje)) {
      throw new YamlFejl(`${fil}:${nr}: tabulator i indrykningen — brug to mellemrum pr. niveau`);
    }
    const uden = fjernKommentar(linje);
    if (!uden.trim()) continue;
    if (uden.trim() === '---' || uden.trim() === '...') continue;
    const indryk = uden.match(/^ */)[0].length;
    if (indryk % 2 !== 0) {
      throw new YamlFejl(`${fil}:${nr}: indrykning er ${indryk} mellemrum — skal vaere et lige antal`);
    }
    raekker.push({ nr, indryk, txt: uden.trim() });
  }

  let pos = 0;
  const erSekvens = (r) => r.txt === '-' || r.txt.startsWith('- ');

  function laesBlok(indryk) {
    if (pos >= raekker.length) return null;
    return erSekvens(raekker[pos]) ? laesSekvens(indryk) : laesKort(indryk);
  }

  function laesSekvens(indryk) {
    const ud = [];
    while (pos < raekker.length && raekker[pos].indryk === indryk && erSekvens(raekker[pos])) {
      const r = raekker[pos];
      const rest = r.txt === '-' ? '' : r.txt.slice(2).trim();
      if (rest === '') {
        pos++;
        if (pos < raekker.length && raekker[pos].indryk > indryk) ud.push(laesBlok(raekker[pos].indryk));
        else ud.push(null);
      } else if (NOEGLE_RE.test(rest) && !rest.startsWith('{') && !rest.startsWith('[')) {
        raekker[pos] = { nr: r.nr, indryk: indryk + 2, txt: rest };
        ud.push(laesKort(indryk + 2));
      } else {
        pos++;
        ud.push(laesSkalar(rest, r.nr, fil));
      }
    }
    return ud;
  }

  function laesKort(indryk) {
    const ud = {};
    while (pos < raekker.length && raekker[pos].indryk === indryk && !erSekvens(raekker[pos])) {
      const r = raekker[pos];
      const m = r.txt.match(NOEGLE_RE);
      if (!m) throw new YamlFejl(`${fil}:${r.nr}: forventede "noegle: vaerdi", fik: ${r.txt}`);
      const noegle = m[1];
      const rest = (m[2] ?? '').trim();
      if (Object.prototype.hasOwnProperty.call(ud, noegle)) {
        throw new YamlFejl(`${fil}:${r.nr}: noeglen "${noegle}" staar to gange i samme kort`);
      }
      pos++;
      const blok = rest.match(/^([|>])([+-]?)\s*$/);
      if (blok) {
        ud[noegle] = laesBlokskalar(blok, r.nr, indryk);
      } else if (rest !== '') {
        ud[noegle] = laesSkalar(rest, r.nr, fil);
      } else if (pos < raekker.length && raekker[pos].indryk > indryk) {
        ud[noegle] = laesBlok(raekker[pos].indryk);
      } else {
        ud[noegle] = null;
      }
    }
    return ud;
  }

  /**
   * Blokskalarer: "|" beholder linjeskift, ">" folder dem til mellemrum.
   * Laeses fra de RAA linjer, ikke fra de forbehandlede raekker — ellers ville
   * en "#" inde i teksten blive spist som en kommentar.
   * Lange "advarsel:"- og "noter:"-tekster skrives naturligt paa den maade, saa
   * uden dette ville en dataagents post fejle paa formatering frem for indhold.
   */
  function laesBlokskalar(m, nr, foraeldreIndryk) {
    const stil = m[1], chomp = m[2];
    const raa = [];
    let i = nr;                       // nr er 1-baseret: linjerne[nr] er linjen EFTER noeglen
    while (i < linjer.length) {
      const l = linjer[i];
      if (l.trim() === '') { raa.push(''); i++; continue; }
      if (l.match(/^ */)[0].length <= foraeldreIndryk) break;
      raa.push(l); i++;
    }
    while (raa.length && raa[raa.length - 1] === '') raa.pop();
    const sidsteNr = nr + raa.length;
    while (pos < raekker.length && raekker[pos].nr <= sidsteNr) pos++;
    if (!raa.length) return '';

    const mindst = Math.min(...raa.filter((l) => l.trim() !== '').map((l) => l.match(/^ */)[0].length));
    const ind = raa.map((l) => l.slice(mindst).replace(/\s+$/, ''));

    let tekst;
    if (stil === '|') {
      tekst = ind.join('\n');
    } else {
      tekst = '';
      for (const l of ind) {
        if (l === '') { tekst += '\n'; continue; }
        if (tekst !== '' && !tekst.endsWith('\n')) tekst += ' ';
        tekst += l;
      }
    }
    if (chomp === '-') return tekst.replace(/\n+$/, '');
    if (chomp === '+') return tekst.endsWith('\n') ? tekst : tekst + '\n';
    return tekst.replace(/\n+$/, '') + '\n';
  }

  if (!raekker.length) return {};
  const rod = laesBlok(raekker[0].indryk);
  if (pos < raekker.length) {
    throw new YamlFejl(`${fil}:${raekker[pos].nr}: uventet indrykning — linjen hoerer ikke til nogen blok`);
  }
  return rod;
}

function laesSkalar(s, nr, fil) {
  if (s.startsWith('{')) return laesFlow(s, nr, fil, '}');
  if (s.startsWith('[')) return laesFlow(s, nr, fil, ']');
  if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) {
    try { return JSON.parse(s); } catch { return s.slice(1, -1); }
  }
  if (s.length >= 2 && s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1).replace(/''/g, "'");
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null' || s === '~') return null;
  if (YAML11_BOOL.test(s)) {
    throw new YamlFejl(
      `${fil}:${nr}: "${s}" er en YAML 1.1-boolean og laeses forskelligt af forskellige parsere. ` +
      `Skriv true/false — eller skriv tilstanden ud: ikke_oplyst | nej | kun_billede`);
  }
  if (/^-?\d+$/.test(s)) return Number(s);
  if (/^-?\d+\.\d+$/.test(s)) return Number(s);
  return s;
}

function laesFlow(s, nr, fil, luk) {
  if (!s.endsWith(luk)) throw new YamlFejl(`${fil}:${nr}: flow-vaerdi mangler "${luk}": ${s}`);
  const indre = s.slice(1, -1).trim();
  if (indre === '') return luk === '}' ? {} : [];
  const dele = [];
  let dybde = 0, citat = null, buf = '';
  for (let i = 0; i < indre.length; i++) {
    const c = indre[i];
    if (citat) { buf += c; if (c === citat) citat = null; continue; }
    if (c === '"' || c === "'") { citat = c; buf += c; continue; }
    if (c === '{' || c === '[') dybde++;
    if (c === '}' || c === ']') dybde--;
    if (c === ',' && dybde === 0) { dele.push(buf.trim()); buf = ''; continue; }
    buf += c;
  }
  dele.push(buf.trim());
  if (luk === ']') return dele.filter((d) => d !== '').map((d) => laesSkalar(d, nr, fil));
  const ud = {};
  for (const d of dele) {
    if (d === '') continue;
    const m = d.match(/^([A-Za-z_][A-Za-z0-9_.-]*)\s*:\s*([\s\S]*)$/);
    if (!m) throw new YamlFejl(`${fil}:${nr}: flow-kort forventede "noegle: vaerdi", fik: ${d}`);
    if (Object.prototype.hasOwnProperty.call(ud, m[1])) {
      throw new YamlFejl(`${fil}:${nr}: noeglen "${m[1]}" staar to gange i flow-kortet`);
    }
    ud[m[1]] = laesSkalar(m[2].trim(), nr, fil);
  }
  return ud;
}
