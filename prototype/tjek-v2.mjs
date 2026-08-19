// Efterproever V2-prototypens paastande. Koeres med:
//   "/c/Program Files/nodejs/node.exe" prototype/tjek-v2.mjs
//
// Grunden til at scriptet findes: "ser rigtigt ud" er ikke en efterproevning.
// En CSS-regel man kan LAESE, beviser ikke at den RAMMER noget, og et src-attribut
// beviser ikke at filen findes. Her taelles der, og hver taelling skrives ud.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
process.chdir(path.dirname(fileURLToPath(import.meta.url)));

const FILER = ['v2-forside.html', 'v2-katalog.html', 'v2-producent.html', 'v2-robot.html'];
const TOM = new Set(['area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr']);
let fejl = 0;
const sig = (ok, tekst) => { if (!ok) fejl++; console.log(`  ${ok ? 'ok  ' : 'FEJL'}  ${tekst}`); };

// ---------------------------------------------------------- 1. filenes form
console.log('\n=== 1. KODNING OG TAGBALANCE ===');
const kilde = {};
for (const f of FILER) {
  const buf = fs.readFileSync(f);
  const bom = buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF;
  const s = buf.toString('utf8');
  kilde[f] = s;
  const rens = s.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
  const stak = [], problemer = [];
  for (const m of rens.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*?)(\/?)>/g)) {
    const luk = m[1] === '/', tag = m[2].toLowerCase(), selvluk = m[4] === '/';
    if (TOM.has(tag) || selvluk) continue;
    if (!luk) stak.push(tag);
    else if (!stak.length) problemer.push(`</${tag}> uden aabning`);
    else if (stak[stak.length - 1] !== tag) { problemer.push(`</${tag}> lukker, men <${stak[stak.length - 1]}> var aaben`); stak.pop(); }
    else stak.pop();
  }
  if (stak.length) problemer.push(`uafsluttede: ${stak.join(', ')}`);
  const daarlig = (s.match(/�/g) || []).length;
  sig(!bom && !problemer.length && !daarlig,
    `${f.padEnd(20)} ${(buf.length / 1024).toFixed(1).padStart(6)} KB  BOM=${bom ? 'JA' : 'nej'}  U+FFFD=${daarlig}  tagbalance=${problemer.length ? problemer.slice(0, 3).join('; ') : 'ok'}`);
}

// ------------------------------------------------- 2. billeder: findes de?
console.log('\n=== 2. BILLEDER: STI, EKSISTENS OG PLACERING ===');
{
  const alle = new Set();
  for (const f of FILER) for (const m of kilde[f].matchAll(/<img[^>]+src="([^"]+)"/g)) alle.add(m[1]);
  let mangler = 0, forkertMappe = 0;
  for (const src of alle) {
    if (!src.startsWith('../media/_kilder/')) { forkertMappe++; console.log(`        billede uden for media/_kilder: ${src}`); }
    if (!fs.existsSync(path.resolve(src))) { mangler++; console.log(`        findes ikke paa disken: ${src}`); }
  }
  sig(alle.size > 0, `${alle.size} unikke billed-URL'er i de ${FILER.length} filer`);
  sig(mangler === 0, `${mangler} af ${alle.size} peger paa en fil, der ikke findes`);
  sig(forkertMappe === 0, `${forkertMappe} af ${alle.size} ligger uden for media/_kilder/`);
  const iAssets = fs.existsSync('../assets') ? [] : [];
  const scanAssets = (d) => { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name); if (e.isDirectory()) scanAssets(p); else if (/\.(png|jpe?g|webp|avif)$/i.test(e.name)) iAssets.push(p); } };
  scanAssets('../assets');
  sig(iAssets.length === 0, `${iAssets.length} rasterbilleder i assets/ (skal vaere 0: fabrikantmateriale maa ikke derhen)`);
  const alt = [...kilde['v2-katalog.html'].matchAll(/<img[^>]+alt="([^"]*)"/g)].map((m) => m[1]);
  sig(alt.length > 0 && alt.every((a) => a.trim().length > 10), `${alt.length} img-elementer, alle med en alt-tekst paa over 10 tegn`);
}

// ------------------------------------- 3. virker uden JavaScript? Optaelling
console.log('\n=== 3. UDEN JAVASCRIPT ===');
{
  const kat = kilde['v2-katalog.html'];
  const kort = [...kat.matchAll(/<article class="kort" id="robot-([a-z0-9-]+)"/g)].map((m) => m[1]);
  const yaml = fs.readdirSync('../data/robots').filter((f) => f.endsWith('.yaml')).map((f) => f.replace('.yaml', ''));
  sig(kort.length === yaml.length, `kataloget har ${kort.length} kort i kildeteksten; der er ${yaml.length} yaml-filer`);
  sig(new Set(kort).size === kort.length, `alle ${kort.length} kort-id'er er unikke`);
  const manglerIHtml = yaml.filter((s) => !kort.includes(s));
  sig(manglerIHtml.length === 0, `${manglerIHtml.length} robotter mangler i kataloget${manglerIHtml.length ? ': ' + manglerIHtml.join(', ') : ''}`);
  // scriptet maa kun vaere progressiv forbedring: soegefeltet er skjult uden JS
  const forside = kilde['v2-forside.html'];
  const sogRegel = (forside.match(/(?<!js )\.sog\{([^}]*)\}/) || [])[1] || '';
  sig(/display:none/.test(sogRegel) && /html\.js \.sog\{display:flex/.test(forside),
    `soegefeltet er skjult uden JavaScript -- .sog{${sogRegel}} -- og vises kun, naar html.js er sat`);
  const scripts = [...forside.matchAll(/<script[^>]*>/g)];
  sig(scripts.every((m) => !/\bsrc=/.test(m[0])), `${scripts.length} script-tags, ingen med src (ingen tredjepartskald)`);
  for (const f of FILER) {
    const eksterne = [...kilde[f].matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
    const ikkeProducent = eksterne.filter((u) => /fonts\.|cdn\.|googleapis|gstatic|analytics/i.test(u));
    sig(ikkeProducent.length === 0, `${f.padEnd(20)} ${eksterne.length} eksterne links, heraf ${ikkeProducent.length} til font-/CDN-/analysetjenester`);
  }
}

// ----------------------------------------- 4. rammer filterreglerne noget?
console.log('\n=== 4. FILTRENE RAMMER FAKTISK RAEKKER (CSS, ingen JS) ===');
{
  for (const f of ['v2-forside.html', 'v2-katalog.html']) {
    const s = kilde[f];
    const kortAttr = [...s.matchAll(/<article class="kort"([\s\S]*?)>/g)].map((m) => {
      const o = {};
      for (const a of m[1].matchAll(/data-([a-z]+)="([^"]*)"/g)) o[a[1]] = a[2];
      return o;
    });
    const labels = [...s.matchAll(/<label for="f-([a-z]+)">([^<]*)<span class="antal">(\d+)<\/span>/g)]
      .map((m) => ({ id: m[1], navn: m[2].trim(), antal: +m[3] }));
    sig(labels.length === 6, `${f.padEnd(20)} ${labels.length} filterknapper fundet`);
    const regler = [...s.matchAll(/#f-([a-z]+):checked ~ \.indhold \.kort:not\(\[data-([a-z]+)="([^"]+)"\]\)\{display:none\}/g)]
      .map((m) => ({ id: m[1], attr: m[2], vaerdi: m[3] }));
    sig(regler.length === 5, `${f.padEnd(20)} ${regler.length} skjule-regler (5 filtre + "Alle" uden regel)`);
    for (const r of regler) {
      const traef = kortAttr.filter((k) => k[r.attr] === r.vaerdi).length;
      const label = labels.find((l) => l.id === r.id);
      sig(traef > 0, `${f.padEnd(20)} filter "${r.id}" rammer ${traef} kort i kildeteksten`);
      sig(label && label.antal === traef, `${f.padEnd(20)} filter "${r.id}": knappen siger ${label ? label.antal : '?'}, DOM'en har ${traef}`);
    }
    const alle = labels.find((l) => l.id === 'alle');
    sig(alle && alle.antal === kortAttr.length, `${f.padEnd(20)} "Alle" siger ${alle ? alle.antal : '?'}, siden har ${kortAttr.length} kort`);
  }
}

// -------------------------------- 5. de fire tilstande er visuelt forskellige
console.log('\n=== 5. FIRE TILSTANDE, FIRE UDSEENDER ===');
{
  const s = kilde['v2-forside.html'];
  const css = s.match(/<style>([\s\S]*?)<\/style>/)[1];
  const regel = (sel) => { const m = css.match(new RegExp(sel.replace(/[.\-]/g, '\\$&') + '\\{([^}]*)\\}')); return m ? m[1] : null; };
  const tilstande = {
    '.v-tal b': regel('.v-tal b'), '.v-nej': regel('.v-nej'),
    '.v-ikke': regel('.v-ikke'), '.v-billede': regel('.v-billede'),
  };
  for (const [k, v] of Object.entries(tilstande)) sig(!!v, `${k.padEnd(11)} har en egen regel: ${v ? v.slice(0, 62) : 'MANGLER'}`);
  const vaerdier = Object.values(tilstande);
  sig(new Set(vaerdier).size === vaerdier.length, 'de fire regler er indbyrdes forskellige (ingen to er identiske)');
  // "0" skal se ud som et tal -- altsaa BAERE .v-tal, ikke en saerklasse
  const nulRaekke = s.match(/<dt>Laveste driftstemp\.<\/dt><dd class="([^"]+)">[^<]*<b>0<\/b>/);
  sig(!!nulRaekke && /v-tal/.test(nulRaekke[1]) && !/v-ikke|v-nej/.test(nulRaekke[1]),
    `tallet 0 render som et tal (klasse "${nulRaekke ? nulRaekke[1] : 'IKKE FUNDET'}")`);
  const antalIkke = (kilde['v2-katalog.html'].match(/class="v v-ikke"/g) || []).length;
  const antalNej = (kilde["v2-katalog.html"].match(/class="v v-nej/g) || []).length;
  sig(antalIkke > 0 && antalNej > 0, `kataloget viser ${antalIkke} "ikke oplyst" og ${antalNej} "nej" -- begge tilstande forekommer`);
}

// ---------------------------------------------- 6. de haarde begraensninger
console.log('\n=== 6. HAARDE BEGRAENSNINGER ===');
{
  const forbudt = [
    [/\bkøb\b|\bkoeb\b|\bbestil\b|\bkurv\b|læg i kurv/i, 'koebsord'],
    [/type="(email|tel)"|<form[^>]*action=/i, 'formular der sender noget'],
    [/★|⭐|stjerne|rating|bedoemmelse|\bscore\b/i, 'rating eller score'],
    [/FEATURED|fremhaevet betalt|sponsoreret/i, 'betalt placering'],
  ];
  // Retningskontrakten i HTML-kommentaren NAEVNER de forbudte greb for at afvise dem.
  // Der scannes derfor paa det, browseren viser -- kommentarer og CSS taget fra.
  for (const f of FILER) {
    const synligt = kilde[f].replace(/<!--[\s\S]*?-->/g, '').replace(/<style>[\s\S]*?<\/style>/g, '');
    for (const [re, navn] of forbudt) {
      const m = synligt.match(re);
      sig(!m, `${f.padEnd(20)} ingen ${navn} i det viste indhold${m ? ` -- fandt "${m[0]}"` : ''}`);
    }
  }
  const forside = kilde['v2-forside.html'];
  sig(/uden tilladelse/.test(forside) && /media\/_kilder/.test(forside) && /gitignoreret/.test(forside),
    'billednoten staar i teksten: uden tilladelse, media/_kilder, gitignoreret');
  sig(/ikke forhandler af nogen robot/.test(forside), 'linjen om ingen forhandleraftale staar i sidefoden');
}

// ------------------------------------------ 7. beroeringsmaal og fokus (CSS)
console.log('\n=== 7. BEROERINGSMAAL OG TASTATUR (statisk CSS-tjek) ===');
{
  const css = kilde['v2-forside.html'].match(/<style>([\s\S]*?)<\/style>/)[1];
  const maal = [...css.matchAll(/min-height:(\d+)px/g)].map((m) => +m[1]);
  sig(maal.length >= 5 && maal.every((v) => v >= 44), `${maal.length} min-height-erklaeringer, mindste ${Math.min(...maal)} px (krav 44)`);
  sig(/:focus-visible\{outline:3px solid var\(--fokus\)/.test(css), 'fokusring erklaeret globalt paa :focus-visible');
  sig(/\.fod\{[^}]*--fokus:var\(--paafod\)/.test(css), 'fokusringen skifter farve paa den moerke sidefod, saa den kan ses der ogsaa');
  const skjulteInput = /\.filtre input\{position:absolute;opacity:0/.test(css);
  const fokusPaaLabel = /\.filtre input:focus-visible\+label\{outline/.test(css);
  sig(!skjulteInput || fokusPaaLabel, 'de visuelt skjulte radioknapper giver fokusring paa deres label');
  sig(/\.spring:focus\{left:8px/.test(css), 'spring-til-indhold-linket bliver synligt ved fokus');
}

// --------------------------------------------------- 8. vaegtklasserne stemmer
console.log('\n=== 8. VAEGTKLASSERNE STEMMER MED DATA ===');
{
  const s = kilde['v2-forside.html'];
  const yaml = fs.readdirSync('../data/robots').filter((f) => f.endsWith('.yaml'));
  // Uafhaengig linjebaseret laesning -- med vilje IKKE generatorens parser, saa de to
  // kan vaere uenige. Robust over for baade LF og CRLF.
  const vaegt = {};
  for (const f of yaml) {
    const linjer = fs.readFileSync(path.join('../data/robots', f), 'utf8').split(/\r?\n/);
    const slug = (linjer.find((l) => l.startsWith('slug:')) || '').replace('slug:', '').trim();
    let v = null;
    const i = linjer.findIndex((l) => /^ {2}egenvaegt:/.test(l));
    if (i >= 0) {
      const paaLinjen = linjer[i].split(':').slice(1).join(':').trim();
      if (/^[\d.]+$/.test(paaLinjen)) v = Number(paaLinjen);
      else for (let j = i + 1; j < linjer.length && /^ {4}\S|^\s*$/.test(linjer[j]); j++) {
        const m = linjer[j].match(/^ {4}vaerdi:\s*([\d.]+)\s*$/);
        if (m) { v = Number(m[1]); break; }
        if (/^ {2}\S/.test(linjer[j])) break;
      }
    }
    vaegt[slug] = v;
  }
  const forventet = { u20: 0, m: 0, o60: 0, ukendt: 0 };
  for (const v of Object.values(vaegt)) {
    if (v === null) forventet.ukendt++; else if (v < 20) forventet.u20++; else if (v <= 60) forventet.m++; else forventet.o60++;
  }
  for (const id of ['u20', 'm', 'o60', 'ukendt']) {
    const sek = s.split(`id="sek-${id}"`)[1] || '';
    const til = sek.split('</section>')[0];
    const antal = (til.match(/<article class="kort"/g) || []).length;
    const skrevet = +((til.match(/<span class="antal">(\d+) af \d+ robotter/) || [])[1] || -1);
    sig(antal === forventet[id] && skrevet === forventet[id],
      `${id.padEnd(7)} data siger ${forventet[id]}, afsnittet har ${antal} kort og skriver "${skrevet}"`);
  }
  const sum = Object.values(forventet).reduce((a, b) => a + b, 0);
  sig(sum === yaml.length, `de fire grupper daekker ${sum} af ${yaml.length} robotter -- ingen robot forsvinder`);
}

// -------------------------------------------------------------------- facit
console.log('\n' + '='.repeat(70));
console.log(fejl ? `${fejl} TJEK FEJLEDE.` : 'Alle tjek bestaaet.');
process.exit(fejl ? 1 : 0);
