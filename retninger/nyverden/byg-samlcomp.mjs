/* ==========================================================================
   byg-samlcomp.mjs — bygger SAMMENLIGNINGSSIDEN som comp i TYPESKILT-verdenen

   Samme begrundelse som byg-comp.mjs: haard begraensning 2 siger "opfind aldrig
   et tal". Naar hvert tal, hvert feltnavn og hver gruppetitel er REGNET af
   dist/robots.json + data/i18n/da.json + tools/skema.mjs, er reglen mekanisk
   garanteret i stedet for lovet.

   TESEN PAA DENNE FLADE: paa kataloget er filtret pladen. Her er der TRE plader,
   stanset i den samme jig og laest paa tvaers. Det, laeseren finder, er ikke en
   vinder — sidens egen tegnforklaring afviser udtrykkeligt vindermarkering
   (i18n: sammenligning_legende_vinder_forklaring, haard begraensning 6). Det, man
   finder, er hvor pladerne SVARER, og hvor de tier sammen.

   Koer:  node retninger/nyverden/byg-samlcomp.mjs      (fra worktree-roden)
   Kraever at tools/build.mjs har lagt dist/robots.json.
   Skriver KUN i retninger/nyverden/. Laeser — aendrer aldrig — tools/, data/.
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Laeses KUN. Feltraekkefoelge, gruppetilhoer og naevneren importeres i stedet
// for at blive skrevet af som tal — L30/D7-faelden: et haandskrevet 30 ved
// siden af et udledt 30 divergerer, foerste gang skemaet vokser.
import { FELTER, FELTNAVNE, GRUPPER, NAEVNER } from '../../tools/skema.mjs';

const HER = path.dirname(fileURLToPath(import.meta.url));
const ROD = path.resolve(HER, '..', '..');
const D = JSON.parse(fs.readFileSync(path.join(ROD, 'dist', 'robots.json'), 'utf8'));
const I18N = JSON.parse(fs.readFileSync(path.join(ROD, 'data', 'i18n', 'da.json'), 'utf8'));
const R = D.robotter;

/* --- smaa hjaelpere ------------------------------------------------------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const fladt = {};
(function flad(o) {
  for (const k of Object.keys(o)) {
    const v = o[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) flad(v);
    else fladt[k] = v;
  }
})(I18N);
const t = (n, res) => (fladt[n] !== undefined ? fladt[n] : (res !== undefined ? res : n));

const brud = [];
let antalPaastande = 0;
const paastand = (ok, besked) => {
  antalPaastande++;
  if (!ok) { brud.push(besked); console.error('BRUD: ' + besked); process.exitCode = 1; }
  else console.log('  ok  ' + besked);
};

const komma = (n, d = 0) =>
  n.toLocaleString('da-DK', { minimumFractionDigits: d, maximumFractionDigits: d });
const erOplyst = (f) => !!f && f.tilstand !== 'ikke_oplyst';

/* --- 1. Hvilke tre plader ligger i jiggen? -------------------------------
   UDLEDT, ikke valgt. Samme regel som den kOErende side bruger
   (tools/skabelon/sammenligning.mjs' standardvalg): hoejest specifikations-
   taethed, hoejst EEN pr. producent, alfabetisk paa slug ved lige taethed.
   Reglen er gengivet her frem for importeret, fordi standardvalg() ikke er
   eksporteret — og assertion 8 nedenfor efterprOEver, at gengivelsen giver
   samme svar som den maalte, kOErende side.                                */
const taethedAf = (r) => FELTNAVNE.filter((n) => erOplyst(r.alle_felter[n])).length;

/* Fabrikanternes egne produktfotos. Tilladt paa en publiceret side siden L37,
   men ALDRIG uden ophav — se fotoOphavHTML() nedenfor. Ingen AI-genererede
   billeder (haard begraensning 4): filerne her er hentet fra producenternes
   egne sider, de samme, katalogsiden og robotsiden bruger.
   Mappen er gitignoreret; mangler den, staar hver plade med den stiplede
   ikke-oplyst-plade i stedet for et tomt hul.                                */
const FOTOMAPPE = path.join(ROD, 'assets', 'fotos', 'fabrikant');
const FOTO = {};
if (fs.existsSync(FOTOMAPPE)) {
  for (const f of fs.readdirSync(FOTOMAPPE)) FOTO[f.replace(/\.[^.]+$/, '')] = f;
}
const MED_FOTO = R.filter((r) => FOTO[r.slug]).length;

function jiggen() {
  const med = R.map((r) => ({ r, tal: taethedAf(r) }));
  med.sort((a, b) => b.tal - a.tal || String(a.r.slug).localeCompare(String(b.r.slug)));
  const producenter = new Set();
  const valgt = [];
  for (const { r } of med) {
    if (producenter.has(r.producent)) continue;
    producenter.add(r.producent);
    valgt.push(r);
    if (valgt.length === 3) break;
  }
  return valgt;
}
/* Demonstrationstilstand, KUN til at fotografere det manglende-foto-tilfaelde.
   Compens egen jig rammer det aldrig: alle tre taetteste poster HAR foto, saa
   den tomme plade ville ellers vaere formgivet uden at nogen kunne se den.
   Flaget bytter tredje plade ud med den ene robot af 77, der mangler foto, og
   skriver til et andet filnavn — sammenligning.html roeres ikke.
   Koer: node retninger/nyverden/byg-samlcomp.mjs --demo-manglende-foto        */
const DEMO = process.argv.includes('--demo-manglende-foto');
const UDFIL = DEMO ? 'sammenligning-demo-uden-foto.html' : 'sammenligning.html';

const TRE = (() => {
  const j = jiggen();
  if (!DEMO) return j;
  const uden = R.find((r) => !FOTO[r.slug]);
  if (!uden) throw new Error('--demo-manglende-foto: alle 77 robotter har foto, intet at vise');
  return [j[0], j[1], uden];
})();
const N = TRE.length;

/* --- 2. Svartaellingen pr. raekke ----------------------------------------
   IKKE en score. Det er en optaelling af, hvor mange af de valgte plader der
   overhovedet siger noget om feltet — samme maalestok som sidens egne
   taethedstal ("N af 30 felter oplyst", i18n: skema_taeller), blot vendt 90
   grader: pr. FELT i stedet for pr. robot. Haard begraensning 6 forbyder en
   redaktionel score; det her er en taelling, ingen vurdering, og den rangerer
   ikke robotterne indbyrdes.                                                */
const svarFor = (felt) => TRE.map((r) => erOplyst(r.alle_felter[felt]));

/* --- 3. Maerkerne: fire tilstande, fire tegninger ------------------------
   Samme SVG-sprog som byg-comp.mjs. Ingen unicode-glyffer, ingen emoji.     */
const M = {
  ja: '<svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true"><rect x="1" y="1" width="9" height="9" rx="1" fill="currentColor"/></svg>',
  nej: '<svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true"><rect x="1.6" y="1.6" width="7.8" height="7.8" rx="1" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3.2 7.8 7.8 3.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  nul: '<svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true"><rect x="1.6" y="1.6" width="7.8" height="7.8" rx="1" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="5.5" cy="5.5" r="1.7" fill="currentColor"/></svg>',
  uoplyst: '<svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true"><rect x="1.6" y="1.6" width="7.8" height="7.8" rx="1" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2.4 1.9"/></svg>',
  billede: '<svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true"><rect x="1.6" y="1.6" width="7.8" height="7.8" rx="1" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M1.9 8 4.3 5.3 6 7l1.6-1.5 1.5 1.6" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>',
  // Svarmaerket i raekkehovedet: fyldt = pladen svarer, stiplet = pladen tier.
  svarJa: '<svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true"><rect x="0.5" y="0.5" width="7" height="7" rx=".5" fill="currentColor"/></svg>',
  svarNej: '<svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true"><rect x="1" y="1" width="6" height="6" rx=".5" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="1.9 1.5"/></svg>',
  pil: '<svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true"><path d="M7 1.5 2.5 5.5 7 9.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  ned: '<svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true"><path d="M1.8 3.8 5.5 7.5 9.2 3.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

/* --- 4. Vaerdien ---------------------------------------------------------
   Tallet saettes i PLADENS skrift (Saira, tabulaere tal). Producentens egen
   prosa saettes i MANUALENS (Literata) — det er ikke pynt: paa et rigtigt
   typeskilt er tallene stanset, mens saetningerne staar i manualen, og netop
   den todeling loeser en MAALT layoutfejl paa den kOErende side, hvor
   MOVENEW P1's autonominiveau paa 223 tegn saetter raekkehoejden for alle tre
   spalter i samme grotesk som tallene.                                      */
const OPNAVN = {
  '>': 'mereend', '>=': 'mindst', '<': 'mindreend', '<=': 'hoejst', '~': 'cirka', '±': 'pm',
};

function operatorHTML(kode) {
  const navn = OPNAVN[kode];
  if (!navn) return '';
  // Regel 4: operatoren skal kunne SES og HOERES. Samme to-deling som
  // side.mjs' operator() og sammenligning.js' renderTal().
  return `<span class="op" aria-hidden="true">${esc(t('operator_' + navn))}</span>`
    + `<span class="kun-skaerm">${esc(t('operator_' + navn + '_laest'))} </span>`;
}

// NBSP mellem tal og enhed er SI-typografi. Undtagelsen er gradtegnet for en
// VINKEL (40°, uden mellemrum); °C beholder sit mellemrum.
const enhedHTML = (e) => (!e ? ''
  : e === '°' ? `<span class="enhed enhed--klaebet">${esc(e)}</span>`
    : `<span class="enhed">${esc(e)}</span>`);

function talHTML(f) {
  let figur;
  if (f.min !== null && f.min !== undefined) figur = `${komma(f.min)}–${komma(f.maks)}`;
  else if (typeof f.vaerdi === 'number') figur = komma(f.vaerdi, Number.isInteger(f.vaerdi) ? 0 : 1);
  else figur = String(f.vaerdi); // fx "IP66" — et maerkat, ikke en maaling
  return `<span class="v v-tal${f.tilstand === 'nul' ? ' v-nul' : ''}">`
    + operatorHTML(f.operator) + `<b class="num">${esc(figur)}</b>` + enhedHTML(f.enhed) + '</span>';
}

/* Forbeholdet: BAERES, men vises ikke som et synligt maerke. Det er JPK's
   beslutning af 27. aug 2026 (samme interim som side.mjs' fnote() og
   sammenligning.js'): teksten staar i title OG for skaermlaesere, men den
   altid-synlige stjerne er ude, indtil D14's gyldighedsniveauer er flettet.
   Compen foreslaar ikke at omgoere den beslutning.                          */
function forbeholdHTML(f) {
  const noter = [];
  if (f.ved_last) {
    noter.push(f.ved_last.ukendt ? t('ved_last_ukendt')
      : `${t('ved_last')} ${komma(f.ved_last.vaerdi)} ${f.ved_last.enhed || ''}`.trim());
  }
  if (f.forbehold) noter.push(f.forbehold);
  if (!noter.length) return '';
  const tekst = noter.join(' · ');
  return `<abbr class="forbehold-skjult" title="${esc(tekst)}">`
    + `<span class="kun-skaerm">${esc(t('advarsel'))}: ${esc(tekst)}</span></abbr>`;
}

function vaerdiHTML(f) {
  if (!f) f = { tilstand: 'ikke_oplyst' };
  const note = forbeholdHTML(f);
  switch (f.tilstand) {
    case 'nej':
      return `<span class="v v-nej">${M.nej}${esc(t('tilstand_nej'))}</span>${note}`;
    case 'ja':
      return `<span class="v v-ja">${M.ja}${esc(t('ja'))}</span>${note}`;
    case 'kun_billede':
      return `<span class="v v-billede">${M.billede}${esc(t('tilstand_kun_billede'))}</span>${note}`;
    case 'tekst': {
      let ud = `<span class="v v-prosa">${esc(f.tekst)}</span>`;
      if (f.min !== null && f.min !== undefined) {
        ud += ' ' + talHTML({ tilstand: 'tal', vaerdi: null, min: f.min, maks: f.maks, enhed: f.enhed, operator: null });
      }
      return ud + note;
    }
    case 'tal':
    case 'nul':
      return talHTML(f) + note;
    case 'ikke_oplyst':
    default:
      return `<span class="v v-ikke">${M.uoplyst}${esc(t('tilstand_ikke_oplyst'))}</span>${note}`;
  }
}

/* --- 5. Sidens dele ------------------------------------------------------ */
const KONTRAKT = `<!--
TYPESKILTET — sammenligningssiden, spor/samlcomp, 31. aug 2026

THESIS: Paa kataloget ER filtret pladen. Her ligger TRE plader i den samme jig
og laeses paa tvaers. Fundet er ikke en vinder — sidens egen tegnforklaring
afviser vindermarkering — men hvor pladerne svarer, og hvor de tier sammen.

OWN-WORLD: Arvet uaendret fra MANIFEST.md. Eloxgraa #E8EBED, gunmetal #22262A,
afmaerkningsgul #F2C400 KUN som markering, stoevgraa #9AA3A9 stiplet kontur,
kridt #FAFBFB. Saira Semi Condensed = pladen, Literata = manualen. Ingen
monospace, ingen gradient, intet glas, ingen slagskygge.

SIGNATUR: jiggen med tre baase — vaelgeren har samme form som resultatet — og
svarmaerket i hvert raekkehoved, der viser HVEM af de tre der tier.

BEVARET, IKKE ROERT: tabelsemantikken (Aa54/Aa58) og fravaeret af
kildebogstaver (L46). Se assertions i denne fil.

FINISH: comp, ikke implementering. Leverancen er retningen.
-->`;

const daek = () => `<header class="daek">
<div class="daek__ramme">
<a class="daek__navn" href="katalog.html">Firbenede robotter</a>
<ul class="daek__nav">
<li><a href="katalog.html">Oversigt</a></li>
<li><a href="sammenligning.html" aria-current="page">Sammenligning</a></li>
<li><a href="#">Producenter</a></li>
<li><a href="#">Om os</a></li>
</ul>
<p class="sprog"><a href="#" aria-current="true" hreflang="da">DA</a><span>/</span><a href="#" hreflang="en">EN</a></p>
</div>
</header>`;

const bund = `<footer class="bund">
<div class="ramme">
<p>Udgivet af KeyResearch, Aarhus. Hvert tal på siden har en kilde og en hentedato.
Kataloget sælger ikke robotter og har ingen forhandleraftale med nogen fabrikant.</p>
</div>
</footer>
</body>
</html>`;

/* 5a0. Robotbilledet i pladehovedet.
   JPK, 31. aug 2026: "billede mangler af selve robotten". Maalt: baade compen
   og den kOErende side havde 0 — fladen har aldrig vist robotten, man
   sammenligner. Billedet er derfor NYT paa denne flade, ikke genindfoert.

   Det er bevidst et MAERKATFOTO, ikke et hero: hovedet er samtidig
   betjeningen og skal blive ved med at klaebe. Et hoejt billede ville gOEre
   den klaebende raekke til en skaerm i sig selv paa 390.

   DET MANGLENDE TILFAELDE er formgivet, ikke overladt til en tom kasse:
   76 af 77 robotter har foto, og den ene uden faar den stiplede
   ikke-oplyst-plade — samme sprog som ethvert andet uoplyst felt paa siden,
   saa det ikke kan forveksles med et billede, der ikke blev indlaest.       */
function fotoFeltHTML(r) {
  const fil = FOTO[r.slug];
  if (!fil) {
    return `<span class="fotofelt fotofelt--uoplyst">
${M.uoplyst}
<span class="fotofelt__ord">foto ${esc(t('tilstand_ikke_oplyst'))}</span>
</span>`;
  }
  const alt = `${r.producent} ${r.navn} — fabrikantens eget produktfoto`;
  return `<span class="fotofelt">
<img src="../../assets/fotos/fabrikant/${esc(fil)}" alt="${esc(alt)}" width="120" height="90" loading="lazy" decoding="async">
</span>`;
}

/* Ophavet. Fabrikantfotos er tilladt (L37), men aldrig uden kilde — samme
   loefte som resten af sitet. Producentnavn og hentedato er REGNET af
   robottens egen kildeliste, ikke skrevet.                                  */
function fotoOphavHTML() {
  const med = TRE.filter((r) => FOTO[r.slug]);
  if (!med.length) return '';
  const dele = med.map((r) => `${esc(r.producent)} (hentet ${esc(r.kilder[0].hentet)})`).join(' · ');
  const mangler = TRE.filter((r) => !FOTO[r.slug]);
  return `<p class="fotoophav">Fotos: ${dele}. Fabrikanternes egne produktfotos, gengivet med kilde.
${mangler.length ? `${esc(mangler.map((r) => r.navn).join(', '))} har intet foto hos producenten — pladsen står stiplet, ikke tom. ` : ''}
Dækning i kataloget: ${komma(MED_FOTO)} af ${komma(R.length)} robotter har et fabrikantfoto.</p>`;
}

/* 5a. Tegnforklaringen — presset til ÉT baand.
   Paa den kOErende side fylder den 5 raekker og hele foerste skaerm, foer
   laeseren ser et eneste tal (maalt: skud-nuvaerende-saml.png). De samme fem
   udsagn staar her, med de samme i18n-noegler, paa én stribe. Udsagnet om
   at der IKKE markeres en vinder staar med — det er en truffet beslutning
   (haard begraensning 6), ikke en note der kan spares vaek.                  */
/* JPK, 31. aug 2026: "Er 'Saadan laeses tallene'-kassen noedvendig??"
   Svaret er ja til FORKLARINGEN, nej til kassen. "0", "nej" og "ikke oplyst"
   er ikke selvforklarende — forskellen mellem "producenten skriver 0" og
   "producenten siger intet" er praecis den, hele siden findes for at vise
   (haard begraensning 5). Men den fyldte 185 px paa 1440 og 531 px paa 390.

   Loesningen er et <details>: baandet med de fire maerker er ALTID synligt,
   og den fulde forklaring foldes ud. Det virker uden JavaScript — samme krav
   som resten af projektet, og samme element, vaelgeren nedenfor bruger.

   "Ingen vinder markeret" er FLYTTET UD (JPK's punkt 2): de fire andre
   forklarer notation, den femte er en redaktionel position. Den staar nu i
   bunden ved siden af den oevrige forklarende tekst, se vinderHTML().       */
function tegnHTML() {
  /* Etiketten saettes KUN, naar selve maerket ikke allerede baerer ordet.
     "nej"-chippen og "ikke oplyst"-chippen skriver deres eget navn, saa en
     etiket ved siden af gav "nej NEJ" og "ikke oplyst IKKE OPLYST" — maalt
     paa skaermbilledet, ikke gaettet. Tal og nul viser en FIGUR (33,8 kg / 0)
     og har derfor brug for et ord.                                          */
  const mrk = (tegn, ord) =>
    `<span class="tegn"><span class="tegn__mrk">${tegn}</span>`
    + (ord ? `<span class="tegn__ord">${esc(ord)}</span>` : '') + `</span>`;
  const post = (tegn, ord, forklaring) =>
    `<div class="tegnpost"><span class="tegnpost__mrk">${tegn}</span>`
    + `<span class="tegnpost__ord">${esc(ord)}</span>`
    + `<span class="tegnpost__tekst">${esc(forklaring)}</span></div>`;

  const TAL = '<span class="v v-tal"><b class="num">33,8</b><span class="enhed">kg</span></span>';
  const NUL = '<span class="v v-tal v-nul"><b class="num">0</b></span>';
  const NEJ = `<span class="v v-nej">${M.nej}${esc(t('tilstand_nej'))}</span>`;
  const UO = `<span class="v v-ikke">${M.uoplyst}${esc(t('tilstand_ikke_oplyst'))}</span>`;

  return `<details class="tegn-udtraek">
<summary class="tegnbaand">
<span class="tegnbaand__navn">${esc(t('tegnforklaring_titel'))}</span>
<span class="tegnbaand__raekke">
${mrk(TAL, 'tal')}
${mrk(NUL, t('tilstand_nul'))}
${mrk(NEJ, null)}
${mrk(UO, null)}
</span>
<span class="tegnbaand__haandtag">${M.ned}</span>
</summary>
<div class="tegnbaand__krop">
${post(TAL, 'tal', t('tegnforklaring_oplyst'))}
${post(NUL, t('tilstand_nul'), t('tilstand_nul_forklaring'))}
${post(NEJ, t('tilstand_nej'), t('tilstand_nej_forklaring'))}
${post(UO, t('tilstand_ikke_oplyst'), t('tilstand_ikke_oplyst_forklaring'))}
</div>
</details>`;
}

/* Den redaktionelle position, flyttet ud af laesenoeglen. Den staar stadig
   paa siden — den er en truffet beslutning bundet til haard begraensning 6,
   ikke en note der kan spares vaek.                                         */
function vinderHTML() {
  return `<p class="vinderregel">
<span class="vinderregel__navn">${esc(t('sammenligning_legende_vinder_titel'))}</span>
${esc(t('sammenligning_legende_vinder_forklaring'))}</p>`;
}

/* 5c. Matricen.
   Aa54/Aa58: en RIGTIG tabel. <caption>, th[scope=col] pr. plade,
   th[scope=row] pr. felt, th[scope=rowgroup] pr. gruppe, én <tbody> pr.
   gruppe. Ingen display:grid ovenpaa og derfor heller ingen grund til de
   eksplicitte ARIA-roller, den kOErende side maa baere: her ER elementerne
   tabelelementer HELE vejen, og rollerne er de native.                      */
function matrixHTML() {
  const navne = TRE.map((r) => r.navn).join(', ');
  const caption = String(t('sammenligning_tabel_caption')).replace('{robotter}', navne);

  const hoved = TRE.map((r, i) => {
    const antal = taethedAf(r);
    // Kolonnehovedet er OGSAA betjeningen: "Skift plade" staar praecis dér,
    // hvor den plade staar, den skifter. Den kOErende side har de to ting hver
    // sit sted (77 chips over foldkanten, navnene i en raekke langt nede) —
    // og navnene ruller vaek, saa raekke 25 laeses uden kolonne. Her klaeber
    // hovedet, jf. .jigraekke th i typeskilt.css.
    return `<th scope="col" class="skiltehoved">
<span class="skiltehoved__top">
${fotoFeltHTML(r)}
<span class="skiltehoved__id">
<span class="skiltehoved__nr">Plade ${i + 1}</span>
<span class="skiltehoved__navn">${esc(r.navn)}</span>
<span class="skiltehoved__prod">${esc(r.producent)}</span>
</span>
</span>
<span class="skiltehoved__fod">
<span class="skiltehoved__taethed">${esc(String(t('skema_taeller')).replace('{a}', komma(antal)).replace('{b}', komma(NAEVNER)))}</span>
<a class="skiltehoved__skift" href="#vaelger">Skift<span class="kun-skaerm"> plade ${i + 1}: ${esc(r.navn)}</span>${M.ned}</a>
</span>
</th>`;
  }).join('\n');

  const grupper = GRUPPER.map((g) => {
    const felter = FELTNAVNE.filter((n) => FELTER[n].gruppe === g);
    const raekker = felter.map((n) => {
      const svar = svarFor(n);
      const antalSvar = svar.filter(Boolean).length;
      const maerker = svar.map((s, i) =>
        `<span class="svar__m${s ? '' : ' svar__m--tavs'}">${s ? M.svarJa : M.svarNej}</span>`).join('');
      const celler = TRE.map((r) =>
        `<td class="celle${erOplyst(r.alle_felter[n]) ? '' : ' celle--tavs'}">${vaerdiHTML(r.alle_felter[n])}</td>`).join('\n');
      return `<tr class="felt-raekke${antalSvar === 0 ? ' felt-raekke--tavs' : ''}">
<th scope="row" class="feltnavn">
<span class="feltnavn__ord">${esc(t('felt_' + n, n))}</span>
<span class="svar" aria-hidden="true">${maerker}</span>
<span class="kun-skaerm">${antalSvar} af ${N} oplyser dette felt</span>
</th>
${celler}
</tr>`;
    }).join('\n');
    return `<tbody class="gruppe">
<tr class="gruppe__titelraekke"><th scope="rowgroup" colspan="${N + 1}" class="gruppe__titel">${esc(t('gruppe_' + g, g))}</th></tr>
${raekker}
</tbody>`;
  }).join('\n');

  return `<div class="matrix-rulle">
<table class="matrix">
<caption class="matrix__caption">${esc(caption)}</caption>
<thead class="jigraekke">
<tr>
<td class="hjoerne">
<span class="hjoerne__ord">${komma(NAEVNER)} felter</span>
<span class="hjoerne__note">Mærket viser, hvilke plader der svarer</span>
</td>
${hoved}
</tr>
</thead>
${grupper}
</table>
</div>`;
}

/* 5d. Vaelgeren: alle 77, i et udtraek. De er der — men de koster ikke
   foerste skaerm, som de goer i dag.                                        */
function vaelgerHTML() {
  const valgte = new Set(TRE.map((r) => r.slug));
  const chips = [...R].sort((a, b) => String(a.navn).localeCompare(String(b.navn), 'da'))
    .map((r) => `<span class="vc">
<input class="vc__felt" type="checkbox" id="v-${esc(r.slug)}" value="${esc(r.slug)}"${valgte.has(r.slug) ? ' checked' : ''}>
<label class="vc__mrk" for="v-${esc(r.slug)}">${esc(r.navn)}<span class="vc__prod">${esc(r.producent)}</span></label>
</span>`).join('\n');
  return `<details class="udtraek-saml" id="vaelger">
<summary>${esc(t('sammenligning_vaelg_titel'))} — ${komma(R.length)} modeller<span class="haandtag">${M.ned}</span></summary>
<div class="udtraek-saml__krop">
<p class="udtraek-saml__note">${esc(t('sammenligning_vaelg_forklaring'))} ${esc(t('sammenligning_maks'))}</p>
<div class="sog">
<label class="sog__etiket" for="saml-soeg">${esc(t('sammenligning_soeg_etiket'))}</label>
<input id="saml-soeg" type="search" autocomplete="off" placeholder="${esc(t('sammenligning_soeg_pladsholder'))}">
</div>
<div class="vaelgernet">
${chips}
</div>
</div>
</details>`;
}

/* --- 6. Siden ------------------------------------------------------------ */
const ANTAL_SAMMENLIGNELIGE = FELTNAVNE.filter((n) => svarFor(n).every(Boolean)).length;
const ANTAL_TAVSE = FELTNAVNE.filter((n) => svarFor(n).every((s) => !s)).length;

function side() {
  return `<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(t('sammenligning_titel'))} — TYPESKILTET (comp)</title>
<link rel="stylesheet" href="typeskilt.css">
</head>
<body>
${KONTRAKT}
<a class="spring-til" href="#matrix">Spring til sammenligningen</a>
${daek()}
<main>
<div class="ramme">
<a class="retur" href="katalog.html">${M.pil}${esc(t('til_katalog'))}</a>
</div>

<section class="plade" aria-labelledby="plade-titel">
<div class="ramme">
<div class="plade__krop">

<div class="plade__hoved">
<div>
<h1 class="plade__titel" id="plade-titel">${esc(t('sammenligning_titel'))}</h1>
<p class="plade__under">${esc(t('sammenligning_lede'))}</p>
</div>
<div class="stempelblok">
<dl class="stempler">
<dt>Type</dt><dd>QUAD-${komma(R.length)}</dd>
<dt>Udgave</dt><dd>${esc(D.genereret)}</dd>
<dt>Plader i jig</dt><dd>${komma(N)} af ${komma(R.length)}</dd>
<dt>Felter pr. plade</dt><dd>${komma(NAEVNER)}</dd>
<dt>Oplyst af alle ${komma(N)}</dt><dd class="stempler__vaegt">${komma(ANTAL_SAMMENLIGNELIGE)} af ${komma(NAEVNER)}</dd>
</dl>
<p class="comp-stempel">Comp · ét pladevalg</p>
</div>
</div>

${tegnHTML()}

</div>
</div>
</section>

<section class="matrixsektion" id="matrix" tabindex="-1">
<div class="ramme">
${matrixHTML()}
<div class="matrix__fod">
<p>Alle ${komma(NAEVNER)} felter fra skemaet står her, i samme rækkefølge som på robotsiden —
også de ${komma(ANTAL_TAVSE)}, hvor ingen af de ${komma(N)} producenter siger noget.
Et tomt felt er ikke et nul: de tre tilstande har hver sit mærke.</p>
${vinderHTML()}
${fotoOphavHTML()}
</div>
${vaelgerHTML()}
<noscript>
<p class="uden-js">${esc(t('sammenligning_uden_js_noscript'))} <a href="katalog.html">${esc(t('sammenligning_uden_js_link'))}</a></p>
</noscript>
</div>
</section>
</main>
${bund}`;
}

/* --- 7. Skriv og efterproev --------------------------------------------- */
const HTML = side();
fs.writeFileSync(path.join(HER, UDFIL), HTML, 'utf8');
console.log('\nSKREVET: ' + UDFIL + ' (' + komma(Buffer.byteLength(HTML, 'utf8')) + ' bytes)'
  + (DEMO ? '  [DEMO: tredje plade byttet til en robot UDEN foto]' : '') + '\n');

const tael = (re) => (HTML.match(re) || []).length;

console.log('SELVTJEK — tabelsemantikken (Aa54/Aa58) og kildereglen (L46):');
paastand(tael(/<table\b/g) === 1, `præcis 1 <table> (målt ${tael(/<table\b/g)})`);
paastand(tael(/<caption\b/g) === 1, `præcis 1 <caption> (målt ${tael(/<caption\b/g)})`);
paastand(tael(/scope="col"/g) === N, `th[scope=col] = ${N}, én pr. plade i jiggen (målt ${tael(/scope="col"/g)})`);
paastand(tael(/scope="row"/g) === NAEVNER, `th[scope=row] = NAEVNER ${NAEVNER}, importeret ikke skrevet (målt ${tael(/scope="row"/g)})`);
paastand(tael(/scope="rowgroup"/g) === GRUPPER.length, `th[scope=rowgroup] = GRUPPER.length ${GRUPPER.length} (målt ${tael(/scope="rowgroup"/g)})`);
paastand(tael(/<td\b/g) === NAEVNER * N + 1, `<td> = ${NAEVNER}x${N}+1 hjørne = ${NAEVNER * N + 1} (målt ${tael(/<td\b/g)})`);
paastand(tael(/kilde-bogstav|kildemaerke|kilde-maerke/g) === 0,
  `L46: nul kildebogstaver paa fladen (målt ${tael(/kilde-bogstav|kildemaerke|kilde-maerke/g)})`);

console.log('\nSELVTJEK — data er regnet, ikke skrevet:');
paastand(new Set(TRE.map((r) => r.producent)).size === N,
  `jiggens ${N} plader har ${N} forskellige producenter (reglen "højst én pr. producent")`);
// Taethedsreglen gaelder den RIGTIGE jig. Demotilstanden bytter med vilje
// tredje plade ud med den ene robot uden foto, saa reglen er sat ud dér —
// og det skrives, i stedet for at lade et forventet BRUD staa og stoeje.
paastand(DEMO || TRE.every((r) => taethedAf(r) >= 22),
  DEMO
    ? `taethedsreglen er sat ud i demotilstand (tredje plade er valgt paa manglende foto, ikke paa taethed)`
    : `jiggen er de taetteste poster: ${TRE.map((r) => r.navn + ' ' + taethedAf(r)).join(' · ')} af ${NAEVNER}`);
{
  const sum = [0, 1, 2, 3].map((k) => FELTNAVNE.filter((n) => svarFor(n).filter(Boolean).length === k).length);
  paastand(sum.reduce((a, b) => a + b, 0) === NAEVNER,
    `svarfordelingen summer til ${NAEVNER} (0 svar: ${sum[0]} · 1: ${sum[1]} · 2: ${sum[2]} · 3: ${sum[3]})`);
}
{
  const daekkede = GRUPPER.flatMap((g) => FELTNAVNE.filter((n) => FELTER[n].gruppe === g));
  paastand(daekkede.length === NAEVNER && new Set(daekkede).size === NAEVNER,
    `de ${GRUPPER.length} grupper daekker alle ${NAEVNER} felter, uden dubletter (målt ${daekkede.length})`);
}
paastand(FELTNAVNE.every((n) => fladt['felt_' + n] !== undefined),
  `alle ${NAEVNER} feltnavne kommer fra data/i18n/da.json — ingen raa noegle paa siden`);
paastand(GRUPPER.every((g) => fladt['gruppe_' + g] !== undefined),
  `alle ${GRUPPER.length} gruppetitler kommer fra data/i18n/da.json`);
paastand(tael(/class="vc__felt"/g) === R.length,
  `vaelgeren baerer alle ${R.length} robotter (målt ${tael(/class="vc__felt"/g)})`);
paastand(!/font-family:[^;]*mono/i.test(HTML), `ingen monospace (manifestets skriftregel)`);

console.log('\nSELVTJEK — robotbillederne (JPK 31. aug 2026):');
{
  const medFoto = TRE.filter((r) => FOTO[r.slug]);
  paastand(tael(/<img\b/g) === medFoto.length,
    `ét <img> pr. plade MED foto: ${tael(/<img\b/g)} (af ${N} plader; ${MED_FOTO} af ${R.length} robotter i kataloget har foto)`);
  paastand(tael(/<img\b/g) === 0 || tael(/<img[^>]*\salt="[^"]+"/g) === tael(/<img\b/g),
    `alle ${tael(/<img\b/g)} billeder har en ikke-tom alt-tekst`);
  paastand(medFoto.every((r) => fs.existsSync(path.join(FOTOMAPPE, FOTO[r.slug]))),
    `alle ${medFoto.length} billedfiler findes paa disken (ellers ville pladen staa tom paa siden)`);
  paastand(tael(/class="fotofelt fotofelt--uoplyst"/g) === N - medFoto.length,
    `manglende foto tegnes som stiplet ikke-oplyst-plade, aldrig som tomt hul (${N - medFoto.length} i denne jig)`);
  paastand(medFoto.length === 0 || /class="fotoophav"/.test(HTML),
    `ophavet staar paa siden — fabrikantfoto er tilladt (L37), men aldrig uden kilde`);
  paastand(medFoto.every((r) => HTML.includes(r.kilder[0].hentet)),
    `hver foto-producent staar med sin hentedato, regnet af robottens egen kildeliste`);
}
{
  // Skaer selve legende-elementet ud og se, at reglen IKKE ligger i det.
  // Foerste udgave af denne assertion sammenlignede blot dokumentraekkefoelge
  // ("krop ... vinderregel") og var derfor sand uanset hvor reglen laa —
  // den maalte ingenting. Nu skaeres blokken ud og efterproeves.
  const a = HTML.indexOf('<details class="tegn-udtraek">');
  const b = HTML.indexOf('</details>', a);
  const legendeblok = HTML.slice(a, b);
  paastand(a !== -1 && b !== -1 && tael(/class="vinderregel"/g) === 1
    && !legendeblok.includes('vinderregel'),
    `"ingen vinder markeret" staar PRAECIS én gang og UDEN FOR laesenoeglen (legendeblok ${komma(b - a)} tegn)`);
  paastand(legendeblok.includes('tegnbaand__raekke') && legendeblok.includes('tegnbaand__krop'),
    `laesenoeglen er ét synligt baand med en udfoldelig krop (<details>, virker uden JavaScript)`);
}

console.log('\nJIGGEN: ' + TRE.map((r, i) => `${i + 1}. ${r.producent} ${r.navn} (${taethedAf(r)}/${NAEVNER})`).join(' | '));
console.log('SAMMENLIGNELIGE FELTER: ' + ANTAL_SAMMENLIGNELIGE + ' af ' + NAEVNER
  + ' · felter hvor ALLE ' + N + ' tier: ' + ANTAL_TAVSE);
// Tallet TAELLES, det skrives ikke. Et haandskrevet antal ved siden af et
// udledt divergerer, foerste gang en assertion tilfoejes (L30/D7).
console.log(brud.length
  ? `\n${brud.length} BRUD af ${antalPaastande} assertions`
  : `\nAlle ${antalPaastande} assertions bestaaet, 0 brud`);
