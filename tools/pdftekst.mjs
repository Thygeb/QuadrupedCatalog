#!/usr/bin/env node
// tools/pdftekst.mjs — afhaengighedsfri udtraekning af tekst fra en PDF med
// CID-kodede /Type0-fonte og /ToUnicode-CMaps.
//
// Bygget til `spor/galileotekst`: Galileos produktmanual (WRC) har seks
// /Type0-fonte med hver sin /ToUnicode-CMap, men ingen almindelig
// tekstudtraekning kan laese dem, fordi teksten i indholdsstroemmene er
// CID-koder, ikke Unicode. Dette script parser CMap'erne selv og oversaetter
// CID -> Unicode ved at foelge /Tf-operatoren gennem hver sides
// indholdsstroem.
//
// KUN Node-indbyggede moduler: node:fs, node:path, node:zlib. Ingen
// afhaengigheder, ingen package.json.
//
// Kaldeform:
//   node tools/pdftekst.mjs <pdf> [--side=N] [--ud=<fil>]
//
// --side=N   udtraek kun side N (1-baseret). Udelades: alle sider.
// --ud=<fil> skriv til fil (UTF-8 uden BOM) i stedet for stdout.

import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync, constants as zlibConstants } from 'node:zlib';

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  let pdfPath = null;
  let side = null;
  let ud = null;
  for (const a of argv) {
    if (a.startsWith('--side=')) side = parseInt(a.slice('--side='.length), 10);
    else if (a.startsWith('--ud=')) ud = a.slice('--ud='.length);
    else if (!a.startsWith('--')) pdfPath = a;
  }
  return { pdfPath, side, ud };
}

// ---------------------------------------------------------------------------
// Objektparsning: find hvert "N G obj ... " i filen og bestem dets afgraensning
// som teksten fra lige efter "obj"-noeglordet til lige foer NAESTE objekts
// "N G obj"-header. Det er en sikker afgraensning, fordi PDF-objekter altid
// ligger som sammenhaengende, ikke-overlappende byteintervaller i filen.
// ---------------------------------------------------------------------------

function parseObjects(buf, latin1) {
  const headerRe = /(\d+)\s+(\d+)\s+obj\b/g;
  const headers = [];
  let m;
  while ((m = headerRe.exec(latin1))) {
    headers.push({ objNum: parseInt(m[1], 10), matchStart: m.index, bodyStart: headerRe.lastIndex });
  }

  const objects = new Map();

  for (let i = 0; i < headers.length; i++) {
    const { objNum, bodyStart } = headers[i];
    const regionEnd = i + 1 < headers.length ? headers[i + 1].matchStart : latin1.length;
    const region = latin1.slice(bodyStart, regionEnd);

    let p = 0;
    while (p < region.length && /\s/.test(region[p])) p++;

    let dictText = null;
    let bodyText = null;
    let isStream = false;
    let streamRawBytes = null;

    if (region.startsWith('<<', p)) {
      const { dictText: dt, end } = readDict(region, p);
      dictText = dt;
      const after = region.slice(end);
      const sm = /^[ \t]*stream(\r\n|\n)/.exec(after);
      if (sm) {
        const dataStartRel = end + sm[0].length;
        const esIdx = region.indexOf('endstream', dataStartRel);
        const dataEndRel = esIdx >= 0 ? esIdx : region.length;
        let dataStartAbs = bodyStart + dataStartRel;
        let dataEndAbs = bodyStart + dataEndRel;
        // Trim den ene EOL, PDF-spec'en tillader lige foer "endstream" og som
        // ikke er en del af selve stream-dataen.
        if (buf[dataEndAbs - 1] === 0x0a) {
          dataEndAbs--;
          if (buf[dataEndAbs - 1] === 0x0d) dataEndAbs--;
        } else if (buf[dataEndAbs - 1] === 0x0d) {
          dataEndAbs--;
        }
        if (dataEndAbs < dataStartAbs) dataEndAbs = dataStartAbs;
        streamRawBytes = buf.subarray(dataStartAbs, dataEndAbs);
        isStream = true;
      }
    } else {
      bodyText = region.trim();
    }

    // Senere forekomst af samme objektnummer (inkrementelle opdateringer)
    // overskriver tidligere — korrekt ifoelge PDF-spec'en, og .set() i
    // filraekkefoelge giver netop det.
    objects.set(objNum, { dictText, bodyText, isStream, streamRawBytes });
  }

  return objects;
}

// Laes en dict, der starter ved text[startIdx..startIdx+1] === '<<'.
// Returnerer indholdet MELLEM de yderste << >> samt indeks lige efter den
// afsluttende >>. Simpel dybde-taelling paa << og >> — tilstraekkeligt for
// almindelige objekt- og ressource-dicts, som ikke selv indeholder << inde i
// literal- eller hex-strenge (hex-strenge tillader kun hex-cifre og
// mellemrum, saa "<<" kan ikke opstaa der).
function readDict(text, startIdx) {
  let depth = 0;
  let i = startIdx;
  const n = text.length;
  while (i < n) {
    if (text.startsWith('<<', i)) {
      depth++;
      i += 2;
      continue;
    }
    if (text.startsWith('>>', i)) {
      depth--;
      i += 2;
      if (depth === 0) return { dictText: text.slice(startIdx + 2, i - 2), end: i };
      continue;
    }
    i++;
  }
  return { dictText: text.slice(startIdx + 2), end: n };
}

// ---------------------------------------------------------------------------
// Stream-afkodning
// ---------------------------------------------------------------------------

function decodeStreamObject(obj) {
  if (!obj || !obj.isStream) return Buffer.alloc(0);
  const isFlate = obj.dictText && /\/FlateDecode\b/.test(obj.dictText);
  if (!isFlate) return obj.streamRawBytes;
  try {
    return inflateSync(obj.streamRawBytes);
  } catch (e) {
    // Nogle skrivere afslutter zlib-strommen uden korrekt checksum/afslutning.
    // Proev en mere overbaerende afslutning, foer vi giver op.
    try {
      return inflateSync(obj.streamRawBytes, { finishFlush: zlibConstants.Z_SYNC_FLUSH });
    } catch (e2) {
      return Buffer.alloc(0);
    }
  }
}

// ---------------------------------------------------------------------------
// Sidetraet: find /Root -> /Pages -> /Kids (rekursivt) i rigtig raekkefoelge.
// Falder tilbage til alle /Type /Page-objekter sorteret paa objektnummer,
// hvis roden ikke kan findes.
// ---------------------------------------------------------------------------

function findPages(objects) {
  let catalogNum = null;
  for (const [num, obj] of objects) {
    if (obj.dictText && /\/Type\s*\/Catalog\b/.test(obj.dictText)) {
      catalogNum = num;
      break;
    }
  }

  let rootPagesNum = null;
  if (catalogNum != null) {
    const catObj = objects.get(catalogNum);
    const m = /\/Pages\s+(\d+)\s+\d+\s+R/.exec(catObj.dictText || '');
    if (m) rootPagesNum = parseInt(m[1], 10);
  }

  const order = [];
  const seen = new Set();

  function walk(num) {
    if (seen.has(num)) return;
    seen.add(num);
    const obj = objects.get(num);
    if (!obj || !obj.dictText) return;
    const kidsMatch = /\/Kids\s*\[([\s\S]*?)\]/.exec(obj.dictText);
    if (kidsMatch) {
      const refs = [...kidsMatch[1].matchAll(/(\d+)\s+\d+\s+R/g)].map((x) => parseInt(x[1], 10));
      for (const r of refs) walk(r);
    } else if (/\/Type\s*\/Page\b/.test(obj.dictText)) {
      order.push(num);
    }
  }

  if (rootPagesNum != null) walk(rootPagesNum);

  if (order.length === 0) {
    for (const [num, obj] of objects) {
      if (obj.dictText && /\/Type\s*\/Page\b/.test(obj.dictText)) order.push(num);
    }
    order.sort((a, b) => a - b);
  }

  return order;
}

// ---------------------------------------------------------------------------
// Ressourcer: find /Resources for en side, med opstigning via /Parent, hvis
// siden ikke selv baerer dem (arv, som PDF-spec'en tillader).
// ---------------------------------------------------------------------------

function getResourcesDictText(objNum, objects, seen = new Set()) {
  if (seen.has(objNum)) return null;
  seen.add(objNum);
  const obj = objects.get(objNum);
  if (!obj || !obj.dictText) return null;
  const dictText = obj.dictText;

  const indirect = /\/Resources\s+(\d+)\s+\d+\s+R/.exec(dictText);
  if (indirect) {
    const resObj = objects.get(parseInt(indirect[1], 10));
    return resObj ? resObj.dictText : null;
  }

  const inlineIdx = dictText.indexOf('/Resources');
  if (inlineIdx >= 0) {
    const ltIdx = dictText.indexOf('<<', inlineIdx);
    if (ltIdx >= 0) {
      const { dictText: inner } = readDict(dictText, ltIdx);
      return inner;
    }
  }

  const parentMatch = /\/Parent\s+(\d+)\s+\d+\s+R/.exec(dictText);
  if (parentMatch) return getResourcesDictText(parseInt(parentMatch[1], 10), objects, seen);

  return null;
}

// ---------------------------------------------------------------------------
// Fonte og ToUnicode-CMaps
// ---------------------------------------------------------------------------

function hexToUtf16Str(hex) {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.substr(i, 2), 16) || 0);
  let out = '';
  for (let i = 0; i + 1 < bytes.length; i += 2) {
    out += String.fromCharCode((bytes[i] << 8) | bytes[i + 1]);
  }
  return out;
}

// Parser en /ToUnicode-CMap (allerede inflateret til ren tekst) og returnerer
// Map<CID:number, unicodeStreng>. Understoetter baade bfchar og bfrange —
// bfrange i begge dens former: <lo> <hi> <dst> og <lo> <hi> [ <d1> <d2> ... ].
function parseToUnicodeCMap(text) {
  const map = new Map();

  const bfcharRe = /beginbfchar([\s\S]*?)endbfchar/g;
  let m;
  while ((m = bfcharRe.exec(text))) {
    const body = m[1];
    const pairRe = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g;
    let p;
    while ((p = pairRe.exec(body))) {
      map.set(parseInt(p[1], 16), hexToUtf16Str(p[2]));
    }
  }

  const bfrangeRe = /beginbfrange([\s\S]*?)endbfrange/g;
  while ((m = bfrangeRe.exec(text))) {
    const body = m[1];
    const entryRe = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*(\[[\s\S]*?\]|<[0-9A-Fa-f]+>)/g;
    let e;
    while ((e = entryRe.exec(body))) {
      const lo = parseInt(e[1], 16);
      const hi = parseInt(e[2], 16);
      const dstPart = e[3];
      if (dstPart.startsWith('[')) {
        const items = [...dstPart.matchAll(/<([0-9A-Fa-f]+)>/g)].map((x) => x[1]);
        for (let code = lo, idx = 0; code <= hi && idx < items.length; code++, idx++) {
          map.set(code, hexToUtf16Str(items[idx]));
        }
      } else {
        const dstHex = dstPart.slice(1, -1);
        const base = parseInt(dstHex, 16);
        for (let code = lo; code <= hi; code++) {
          const num = base + (code - lo);
          const hexStr = num.toString(16).padStart(dstHex.length, '0');
          map.set(code, hexToUtf16Str(hexStr));
        }
      }
    }
  }

  return map;
}

function getFontInfo(fontObjNum, objects, cache) {
  if (cache.has(fontObjNum)) return cache.get(fontObjNum);
  const fontObj = objects.get(fontObjNum);
  const info = { cmap: null, twoByte: false };
  if (fontObj && fontObj.dictText) {
    const dictText = fontObj.dictText;
    info.twoByte = /\/Subtype\s*\/Type0\b/.test(dictText);
    const tuMatch = /\/ToUnicode\s+(\d+)\s+\d+\s+R/.exec(dictText);
    if (tuMatch) {
      const cmapObj = objects.get(parseInt(tuMatch[1], 10));
      if (cmapObj) {
        const decoded = decodeStreamObject(cmapObj);
        info.cmap = parseToUnicodeCMap(decoded.toString('latin1'));
      }
    }
  }
  cache.set(fontObjNum, info);
  return info;
}

function buildFontMap(resourcesDictText, objects, cache) {
  const map = new Map();
  if (!resourcesDictText) return map;
  const fontIdx = resourcesDictText.indexOf('/Font');
  if (fontIdx < 0) return map;
  const ltIdx = resourcesDictText.indexOf('<<', fontIdx);
  if (ltIdx < 0) return map;
  const { dictText: fontDictText } = readDict(resourcesDictText, ltIdx);
  const entryRe = /\/([^\s/<>[\]()]+)\s+(\d+)\s+\d+\s+R/g;
  let m;
  while ((m = entryRe.exec(fontDictText))) {
    map.set(m[1], getFontInfo(parseInt(m[2], 10), objects, cache));
  }
  return map;
}

// ---------------------------------------------------------------------------
// Indholdsstroem: hent raa bytes for en sides /Contents (enkelt reference
// eller array af referencer), afkodet og sammensat.
// ---------------------------------------------------------------------------

function getContentLatin1(pageObj, objects) {
  const dictText = pageObj.dictText || '';
  let refs = [];
  const arrMatch = /\/Contents\s*\[([\s\S]*?)\]/.exec(dictText);
  if (arrMatch) {
    refs = [...arrMatch[1].matchAll(/(\d+)\s+\d+\s+R/g)].map((x) => parseInt(x[1], 10));
  } else {
    const single = /\/Contents\s+(\d+)\s+\d+\s+R/.exec(dictText);
    if (single) refs = [parseInt(single[1], 10)];
  }
  const parts = [];
  for (const r of refs) {
    const obj = objects.get(r);
    if (obj) parts.push(decodeStreamObject(obj).toString('latin1'));
  }
  return parts.join('\n');
}

// ---------------------------------------------------------------------------
// Indholdsstroem-tokenizer og -fortolker: BT/ET, Tf, Tj, TJ, ' og ".
// ---------------------------------------------------------------------------

function tokenizeContent(text) {
  const tokens = [];
  const n = text.length;
  let i = 0;
  while (i < n) {
    const c = text[i];

    if (c === ' ' || c === '\t' || c === '\r' || c === '\n' || c === '\f' || c === '\0') {
      i++;
      continue;
    }
    if (c === '%') {
      while (i < n && text[i] !== '\n' && text[i] !== '\r') i++;
      continue;
    }
    if (c === '/') {
      let j = i + 1;
      while (j < n && !/[\s()<>[\]{}/%]/.test(text[j])) j++;
      tokens.push({ type: 'name', value: text.slice(i + 1, j) });
      i = j;
      continue;
    }
    if (c === '(') {
      let depth = 1;
      let j = i + 1;
      const bytes = [];
      while (j < n && depth > 0) {
        const ch = text[j];
        if (ch === '\\') {
          const next = text[j + 1];
          if (next === 'n') { bytes.push(10); j += 2; }
          else if (next === 'r') { bytes.push(13); j += 2; }
          else if (next === 't') { bytes.push(9); j += 2; }
          else if (next === 'b') { bytes.push(8); j += 2; }
          else if (next === 'f') { bytes.push(12); j += 2; }
          else if (next === '(') { bytes.push(40); j += 2; }
          else if (next === ')') { bytes.push(41); j += 2; }
          else if (next === '\\') { bytes.push(92); j += 2; }
          else if (next === '\r' || next === '\n') {
            j += 2;
            if (next === '\r' && text[j] === '\n') j++;
          } else if (next != null && /[0-7]/.test(next)) {
            let oct = next;
            j += 2;
            for (let k = 0; k < 2 && j < n && /[0-7]/.test(text[j]); k++) { oct += text[j]; j++; }
            bytes.push(parseInt(oct, 8) & 0xff);
          } else if (next != null) {
            bytes.push(next.charCodeAt(0) & 0xff);
            j += 2;
          } else {
            j++;
          }
        } else if (ch === '(') {
          depth++;
          bytes.push(40);
          j++;
        } else if (ch === ')') {
          depth--;
          j++;
          if (depth > 0) bytes.push(41);
        } else {
          bytes.push(ch.charCodeAt(0) & 0xff);
          j++;
        }
      }
      tokens.push({ type: 'string', value: bytes });
      i = j;
      continue;
    }
    if (c === '<') {
      if (text[i + 1] === '<') {
        let depth = 1;
        let j = i + 2;
        while (j < n && depth > 0) {
          if (text.startsWith('<<', j)) { depth++; j += 2; }
          else if (text.startsWith('>>', j)) { depth--; j += 2; }
          else j++;
        }
        tokens.push({ type: 'dict' });
        i = j;
        continue;
      }
      let j = i + 1;
      let hex = '';
      while (j < n && text[j] !== '>') {
        if (/[0-9A-Fa-f]/.test(text[j])) hex += text[j];
        j++;
      }
      j++;
      if (hex.length % 2 === 1) hex += '0';
      const bytes = [];
      for (let k = 0; k < hex.length; k += 2) bytes.push(parseInt(hex.substr(k, 2), 16));
      tokens.push({ type: 'string', value: bytes });
      i = j;
      continue;
    }
    if (c === '[') { tokens.push({ type: 'arrayStart' }); i++; continue; }
    if (c === ']') { tokens.push({ type: 'arrayEnd' }); i++; continue; }
    if (c === '{') {
      let depth = 1;
      let j = i + 1;
      while (j < n && depth > 0) {
        if (text[j] === '{') depth++;
        else if (text[j] === '}') depth--;
        j++;
      }
      i = j;
      continue;
    }
    if (/[0-9+\-.]/.test(c)) {
      let j = i + 1;
      while (j < n && /[0-9+\-.eE]/.test(text[j])) j++;
      tokens.push({ type: 'num', value: parseFloat(text.slice(i, j)) });
      i = j;
      continue;
    }
    // operator/soegeord — inkl. enkelttegns-operatorerne ' og "
    {
      if (c === "'" || c === '"') {
        tokens.push({ type: 'op', value: c });
        i++;
        continue;
      }
      let j = i + 1;
      while (j < n && /[A-Za-z0-9*]/.test(text[j])) j++;
      tokens.push({ type: 'op', value: text.slice(i, j) });
      i = j;
      continue;
    }
  }
  return tokens;
}

function translateBytes(bytes, fontInfo) {
  if (!fontInfo) return bytes.map((b) => String.fromCharCode(b)).join('');
  if (fontInfo.twoByte) {
    let out = '';
    for (let i = 0; i + 1 < bytes.length; i += 2) {
      const code = (bytes[i] << 8) | bytes[i + 1];
      if (fontInfo.cmap && fontInfo.cmap.has(code)) out += fontInfo.cmap.get(code);
      // Ukendt CID (uden ToUnicode-post) udelades bevidst frem for at give
      // et vildledende erstatningstegn.
    }
    return out;
  }
  let out = '';
  for (const b of bytes) {
    if (fontInfo.cmap && fontInfo.cmap.has(b)) out += fontInfo.cmap.get(b);
    else out += String.fromCharCode(b);
  }
  return out;
}

function extractPageText(contentLatin1, fontInfoByName) {
  // Spring stille over inline billeder (BI ... ID <binaer> EI), som ellers
  // kan indeholde bytes, der fejlagtigt ligner strenge/operatorer og
  // vaelter resten af fortolkningen.
  const cleaned = contentLatin1.replace(/\bBI\b[\s\S]*?\bEI\b/g, ' ');
  const tokens = tokenizeContent(cleaned);

  let stack = [];
  let currentFont = null;
  const out = [];

  function popArrayItems() {
    const items = [];
    while (stack.length && stack[stack.length - 1].type !== 'arrayMarker') items.unshift(stack.pop());
    if (stack.length) stack.pop();
    return items;
  }

  for (const tok of tokens) {
    if (tok.type === 'arrayStart') {
      stack.push({ type: 'arrayMarker' });
      continue;
    }
    if (tok.type === 'arrayEnd') {
      const items = popArrayItems();
      stack.push({ type: 'array', value: items });
      continue;
    }
    if (tok.type !== 'op') {
      stack.push(tok);
      continue;
    }

    const op = tok.value;
    if (op === 'Tf') {
      const nameTok = stack.length >= 2 ? stack[stack.length - 2] : null;
      if (nameTok && nameTok.type === 'name') currentFont = fontInfoByName.get(nameTok.value) || null;
      stack = [];
    } else if (op === 'Tj') {
      const strTok = stack[stack.length - 1];
      if (strTok && strTok.type === 'string') out.push(translateBytes(strTok.value, currentFont));
      stack = [];
    } else if (op === 'TJ') {
      const arr = stack[stack.length - 1];
      if (arr && arr.type === 'array') {
        for (const el of arr.value) {
          if (el.type === 'string') out.push(translateBytes(el.value, currentFont));
          else if (el.type === 'num' && el.value <= -100) out.push(' ');
        }
      }
      stack = [];
    } else if (op === "'") {
      const strTok = stack[stack.length - 1];
      out.push('\n');
      if (strTok && strTok.type === 'string') out.push(translateBytes(strTok.value, currentFont));
      stack = [];
    } else if (op === '"') {
      const strTok = stack[stack.length - 1];
      out.push('\n');
      if (strTok && strTok.type === 'string') out.push(translateBytes(strTok.value, currentFont));
      stack = [];
    } else if (op === 'Td' || op === 'TD' || op === 'T*' || op === 'Tm') {
      out.push('\n');
      stack = [];
    } else {
      stack = [];
    }
  }

  return out.join('');
}

// ---------------------------------------------------------------------------
// Hovedfunktion
// ---------------------------------------------------------------------------

function extractText(buf, onlyPage) {
  const latin1 = buf.toString('latin1');
  const objects = parseObjects(buf, latin1);
  const pageNums = findPages(objects);
  const fontCache = new Map();
  const out = [];

  pageNums.forEach((pageObjNum, idx) => {
    const pageNo = idx + 1;
    if (onlyPage && pageNo !== onlyPage) return;
    const pageObj = objects.get(pageObjNum);
    if (!pageObj) return;
    const resourcesDictText = getResourcesDictText(pageObjNum, objects);
    const fontMap = buildFontMap(resourcesDictText, objects, fontCache);
    const contentLatin1 = getContentLatin1(pageObj, objects);
    const pageText = extractPageText(contentLatin1, fontMap);
    out.push(`--- side ${pageNo} ---\n${pageText}`);
  });

  return out.join('\n\n');
}

function main() {
  const { pdfPath, side, ud } = parseArgs(process.argv.slice(2));
  if (!pdfPath) {
    console.error('Brug: node tools/pdftekst.mjs <pdf> [--side=N] [--ud=<fil>]');
    process.exitCode = 1;
    return;
  }
  const buf = readFileSync(pdfPath);
  const text = extractText(buf, side || null);
  if (ud) {
    writeFileSync(ud, text, { encoding: 'utf8' });
    console.error(`skrevet: ${ud} (${text.length} tegn)`);
  } else {
    process.stdout.write(text);
  }
}

main();
