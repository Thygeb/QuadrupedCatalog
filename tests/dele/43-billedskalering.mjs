/* 43-billedskalering.mjs — srcset, bredder og sizes i billedvejen.
   Bygget af spor/foto 1. sep 2026, da der ikke fandtes NOGEN skalering:
   maalt foer sporet gav `grep -ro '<source' dist --include=*.html` NUL, og
   sammenligningssidens 74x56 chip hentede microrobotech-movenew-p1.jpg paa
   4096 px og 329 KB.

   ============================================================================
   SAADAN GENSKABES DE SKALEREDE FILER
   ============================================================================
   Derivaterne ligger i assets/fotos/**, som er GITIGNORERET — de foelger
   derfor ikke med en gren, og det er med vilje: de er byggeartefakter af
   gitignorerede kilder. Generatoren ligger uden for repoet, saa build.mjs
   forbliver afhaengighedsfri (Node kan ikke skalere uden et bibliotek):

     PATH="/c/Program Files/nodejs:$PATH" npm i --prefix C:/Praktik/websites/maalevaerktoej sharp
     node C:/Praktik/websites/maalevaerktoej/skaler-fotos.mjs --rod=<repoets rod>

   Koerslen tog 99 s og skrev 534 derivater (14,45 MB) fra 76 originaler
   (43,10 MB). `--rens` sletter dem igen, `--tor` er et toerloeb.

   ============================================================================
   HVAD DER PROEVES
   ============================================================================
   Testen maa IKKE kraeve, at derivaterne findes — den koerer ogsaa paa en
   maskine, hvor generatoren aldrig er koert. Derfor proever den REGLERNE:

     A. Faldskaermen. Findes ingen skalerede filer, skrives noejagtigt den
        gamle markup, og billedet er stadig rigtigt. Der bygges ALDRIG en
        srcset til en fil, ingen har lavet.
     B. Raekkefoelgen. Smalleste bredde foerst inden for hver type. Det er
        ikke kosmetik: assets/sammenligning.js skriver én <source> pr. post og
        lader browseren tage den FOERSTE kilde, hvis type den forstaar. Vender
        raekkefoelgen, henter 74px-chippen 1400px-udgaven.
     C. Descriptor-reglen. En srcset har w-descriptorer paa ALLE poster eller
        paa ingen — aldrig blandet, for saa ignorerer browseren hele listen.
     D. Sandheden paa disken. Hver eneste sti i hver eneste srcset i det
        byggede site skal svare til en fil, der faktisk ligger i dist/. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** Splitter en srcset i [[sti, bredde|null], …]. Ingen regex over linjeskift:
 *  en srcset staar altid paa én linje i vores markup. */
function splitSrcset(vaerdi) {
  return vaerdi.split(',').map((post) => {
    const dele = post.trim().split(/\s+/);
    const bredde = dele[1] && /^\d+w$/.test(dele[1]) ? Number(dele[1].slice(0, -1)) : null;
    return [dele[0], bredde];
  });
}

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok,
  } = ctx;

  console.log('\n43. Billedskalering: srcset, bredder og sizes');

  /* ---------------------------------------------------------------- A + B + C
     Enhedsniveau mod et syntetisk assets-trae. Filerne behoever ikke vaere
     rigtige billeder: billedFiler()/billedSkala() laeser kun NAVNE. (Den
     fuldstoerrelses-gren, der laeser byte-headeren, roeres ikke her — den
     proeves af 03-billedkaede.mjs.) */
  const modulUrl = `file://${path.join(rod, 'tools', 'skabelon', 'side.mjs').replace(/\\/g, '/')}`;
  const mod = await import(modulUrl);

  const skalaRod = path.join(tmp, 'skalering-med');
  const skalaM = path.join(skalaRod, 'assets', 'fotos');
  fs.mkdirSync(skalaM, { recursive: true });
  for (const f of ['a.png', 'a-240w.avif', 'a-1400w.avif', 'a-560w.avif',
    'a-240w.webp', 'a-560w.webp', 'b.png']) {
    fs.writeFileSync(path.join(skalaM, f), 'ikke et rigtigt billede', 'utf8');
  }

  const medSkala = mod.billedAlternativer('fotos/a.png', skalaRod);
  const udenSkala = mod.billedAlternativer('fotos/b.png', skalaRod);

  // A. Faldskaermen: b.png har ingen derivater og faar ingen kilder.
  ok('ingen srcset for en fil uden skalerede udgaver (faldskaermen)',
    udenSkala.length === 0, JSON.stringify(udenSkala));

  ok('alle tre avif-bredder og begge webp-bredder bliver til kilder',
    medSkala.length === 5, JSON.stringify(medSkala));

  // B. Raekkefoelgen — smalleste foerst inden for hver type.
  const avif = medSkala.filter(([, t]) => t === 'image/avif').map(([, , w]) => w);
  const webp = medSkala.filter(([, t]) => t === 'image/webp').map(([, , w]) => w);
  ok('avif-bredderne staar stigende (240 foerst — sammenligningens 74px-chip)',
    JSON.stringify(avif) === '[240,560,1400]', JSON.stringify(avif));
  ok('webp-bredderne staar stigende',
    JSON.stringify(webp) === '[240,560]', JSON.stringify(webp));
  ok('avif staar foer webp, som i BILLEDE_ALTERNATIVER',
    medSkala[0][1] === 'image/avif' && medSkala.at(-1)[1] === 'image/webp',
    medSkala.map(([, t]) => t).join(' '));

  // Markup'en for de to tilfaelde.
  const tekst = {
    intet: 'i', grund: 'g', alt: 'et billede', delt: 'd',
  };
  const medHTML = mod.billedledHTML({
    b: { fil: 'fotos/a.png', plade: false }, op: '../', stor: true, tekst, rod: skalaRod,
  });
  const udenHTML = mod.billedledHTML({
    b: { fil: 'fotos/b.png', plade: false }, op: '../', stor: false, tekst, rod: skalaRod,
  });

  ok('faldskaermen: uden derivater skrives INGEN <source>, kun <img src>',
    !udenHTML.includes('<source') && udenHTML.includes('src="../billeder/fotos/b.png"'),
    udenHTML.replace(/\n/g, ' '));

  const kildeLinjer = [...medHTML.matchAll(/<source srcset="([^"]*)"([^>]*)>/g)];
  ok('én <source> pr. type — ikke én pr. bredde',
    kildeLinjer.length === 2, `${kildeLinjer.length} <source>`);

  // C. Descriptor-reglen og sizes.
  let bredderOK = true; let sizesOK = true; let blandet = 0;
  for (const [, srcset, rest] of kildeLinjer) {
    const poster = splitSrcset(srcset);
    const medW = poster.filter(([, w]) => w !== null).length;
    if (medW !== 0 && medW !== poster.length) blandet += 1;
    if (medW !== poster.length) bredderOK = false;
    if (!/ sizes="/.test(rest)) sizesOK = false;
  }
  ok('hver post i srcset baerer en w-descriptor', bredderOK, medHTML.replace(/\n/g, ' '));
  ok('ingen srcset blander poster med og uden w-descriptor', blandet === 0, `${blandet} blandede`);
  ok('en srcset med bredder faar ogsaa en sizes', sizesOK, medHTML.replace(/\n/g, ' '));
  ok('robotsidens store led faar BILLED_SIZES.stor',
    medHTML.includes(`sizes="${mod.BILLED_SIZES.stor}"`), mod.BILLED_SIZES.stor);
  ok('originalen staar stadig som <img src> — faldskaerm for gamle browsere',
    medHTML.includes('src="../billeder/fotos/a.png"'), medHTML.replace(/\n/g, ' '));

  /* -------------------------------------------------------------------- D
     Hele det byggede site: hver sti i hver srcset skal findes paa disken.
     Det er selve loeftet — "kun formater, der FINDES som fil" — og det er den
     eneste proeve, der ogsaa fanger en fejl i KOPIERINGEN til dist/, ikke kun
     i markup-genereringen. */
  const ud = path.join(tmp, 'dist-billedskalering');
  const byg = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${ud}`],
    { cwd: rod, encoding: 'utf8' });
  ok('bygget gennemfoerer', byg.status === 0, `exit ${byg.status}`);

  const htmlFiler = [];
  (function gaa(m) {
    for (const p of fs.readdirSync(m, { withFileTypes: true })) {
      const f = path.join(m, p.name);
      if (p.isDirectory()) { gaa(f); continue; }
      if (p.name.endsWith('.html')) htmlFiler.push(f);
    }
  })(ud);

  let srcsetAntal = 0; let poster = 0; let manglende = 0; let blandetByg = 0;
  const foerste = [];
  for (const f of htmlFiler) {
    const html = fs.readFileSync(f, 'utf8');
    for (const [, vaerdi] of html.matchAll(/<source srcset="([^"]*)"/g)) {
      srcsetAntal += 1;
      const liste = splitSrcset(vaerdi);
      const medW = liste.filter(([, w]) => w !== null).length;
      if (medW !== 0 && medW !== liste.length) blandetByg += 1;
      for (const [sti] of liste) {
        poster += 1;
        const fuld = path.resolve(path.dirname(f), sti);
        if (!fs.existsSync(fuld)) { manglende += 1; if (foerste.length < 3) foerste.push(sti); }
      }
    }
  }
  ok('hver sti i hver srcset findes som fil i dist/',
    manglende === 0, `${manglende} manglede af ${poster}: ${foerste.join(', ')}`);
  ok('ingen srcset i bygget blander w-descriptorer', blandetByg === 0, `${blandetByg} blandede`);

  /* Sammenligningssidens JSON-blob: den tegnes af assets/sammenligning.js,
     som tager den FOERSTE kilde, browseren forstaar. Findes der derivater,
     SKAL foerste post pr. type derfor vaere den smalleste. Findes de ikke
     (generatoren er ikke koert), staar der ingen kilder, og proeven er
     tom-men-sand — samme faldskaerm som A. */
  const samlSti = path.join(ud, 'da', 'sammenligning', 'index.html');
  const samlHtml = fs.readFileSync(samlSti, 'utf8');
  const blob = /<script type="application\/json" id="sammenligning-data">([\s\S]*?)<\/script>/
    .exec(samlHtml);
  ok('sammenligningssidens datablok findes', !!blob, samlSti);
  if (blob) {
    const data = JSON.parse(blob[1].replace(/&lt;/g, '<'));
    let medKilder = 0; let forkertFoerste = 0;
    for (const r of data.robotter) {
      const k = r.foto?.kilder ?? [];
      if (!k.length) continue;
      medKilder += 1;
      // Grupper pr. type i den raekkefoelge, de staar. Foerste post af en type
      // er den, browseren faktisk vaelger.
      const prType = new Map();
      for (const [sti, type] of k) {
        const m = /-(\d+)w\.[a-z0-9]+$/i.exec(sti);
        if (!prType.has(type)) prType.set(type, []);
        prType.get(type).push(m ? Number(m[1]) : null);
      }
      for (const bredder of prType.values()) {
        const kendte = bredder.filter((w) => w !== null);
        if (kendte.length && bredder[0] !== Math.min(...kendte)) forkertFoerste += 1;
      }
    }
    ok('foerste kilde pr. type i sammenligningens blob er den SMALLESTE',
      forkertFoerste === 0, `${forkertFoerste} forkerte af ${medKilder} robotter med kilder`);
    console.log(`     (${medKilder} af ${data.robotter.length} robotter har skalerede kilder;`
      + ` ${srcsetAntal} srcset med ${poster} poster i ${htmlFiler.length} html-filer)`);
  }
}
