/**
 * tests/dele/27-kildeloefte.mjs — spor/legende2, 28. aug 2026.
 *
 * L46 (27. aug 2026): kildebogstaver vises IKKE på sammenligningssiden — en
 * bevidst redaktionel beslutning, ikke en fejl. Før dette spor sagde
 * kort_legende ("Fotos på kortene er producenternes egne. Kortenes tal har
 * kilde – et hævet bogstav ved tallet peger på hvilken.") noget, der let
 * læses som et løfte om HELE sidens tal, selvom det kun er kortenes
 * bogstavmarkering, der findes. Sætningen er nu rettet til at knytte sig
 * til kortenes bogstavmærkning specifikt ("Kortenes tal bærer kildemærker"),
 * uden at nævne sammenligningssiden negativt.
 *
 * Vagterne her beviser fire ting, valgt saa de ville FEJLE, hvis nogen
 * senere skrev løftet bredere igen:
 *
 * 1. Legenden staar paa netop de sider, der viser kort (forsiden,
 *    katalogsiden, hver producentside) — talt STRUKTURELT fra dist/, ikke
 *    hardkodet til et fast tal, saa testen ikke braekker naar kataloget
 *    vokser (jf. faelden fra 25. aug 2026 med et haandskrevet sidetal).
 * 2. Legenden optraeder IKKE paa sammenligningssiden — den udtrykkelige
 *    undtagelse, L46 satte.
 * 3. Selve ordlyden knytter loeftet til KORTENE og naevner dem ved navn, og
 *    rammer ikke moensteret "hvert tal"/"alle tal"/"every figure" — den
 *    generelle formulering, der udloeste dette spor.
 * 4. TILFOEJET 28. aug 2026 efter orkestratorens fund: kort_legende og
 *    kilde_maerke_forklaring stod paa SAMME side (dist/en/robotter/index.html)
 *    og brugte hver sit engelske ord for det haevede bogstav ("raised
 *    letter" vs. "superscript letter") — samme fejlform som Å30 (to noegler
 *    skrevet paa hver sin dag, ikke en besluttet forskel). Rettet til
 *    "superscript letter" begge steder; dansk er uroert, der var ingen
 *    divergens der. Guarden her ville fejle, hvis den ene noegle senere
 *    driver fra den anden igen.
 */
import fs from 'node:fs';
import path from 'node:path';

/** Synlig tekst: script/style ud, tags ud — samme moenster som
 *  24-flade.mjs's synligTekst(), saa vi tæller det laeseren rent faktisk
 *  kan se, ikke JSON-nyttelasten i <script>-blokke. */
function synligTekst(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');
}

export default async function koer(ctx) {
  const { rod, ok } = ctx;

  console.log('\n27. Kildeloeftet: kort_legende knytter sig til kortene, ikke til hele siden (spor/legende2)');

  const dist = path.join(rod, 'dist');
  const forBredt = /\balle tal\b|\bhvert tal\b|\bevery figure\b|\bevery number\b|\ball figures\b/i;

  for (const sprog of ['da', 'en']) {
    const i18nPad = path.join(rod, 'data', 'i18n', `${sprog}.json`);
    const i18n = JSON.parse(fs.readFileSync(i18nPad, 'utf8'));
    const legendeTekst = i18n.kort_legende;

    /* Fotoloeftets egen saetning (spor/kort, 31. aug 2026). Den er ordret den
       foerste halvdel af kort_legende OG hele kort_legende_foto, og det er
       netop derfor, den kan taelles paa tvaers af flader, der bruger hver sin
       noegle: kataloget trykker den lange, forsiden og producentsiderne den
       korte, og loeftet om fotografiets ophav staar begge steder. */
    const fotoSaetning = i18n.kort_legende_foto;

    ok(`27.1.${sprog}: kort_legende findes og er en ikke-tom streng`,
      typeof legendeTekst === 'string' && legendeTekst.length > 0);

    ok(`27.1b.${sprog}: kort_legende_foto er ordret starten paa kort_legende`,
      typeof fotoSaetning === 'string' && fotoSaetning.length > 0
        && typeof legendeTekst === 'string' && legendeTekst.startsWith(fotoSaetning),
      `foto: ${JSON.stringify(fotoSaetning)}`);

    /* --- 3. Ordlyden: knyttet til kortene, ikke til "hvert/alle tal" ----- */
    ok(`27.2.${sprog}: legenden loever ikke bredere end kortene ("hvert/alle tal")`,
      typeof legendeTekst === 'string' && !forBredt.test(legendeTekst),
      `fik: ${JSON.stringify(legendeTekst)}`);

    const naevnerKort = typeof legendeTekst === 'string'
      && (sprog === 'da' ? /\bkort\w*/i.test(legendeTekst) : /\bcard\b/i.test(legendeTekst));
    ok(`27.3.${sprog}: legenden naevner kortene ved navn`, naevnerKort,
      `fik: ${JSON.stringify(legendeTekst)}`);

    // Den egentlige forskel paa foer/efter dette spor: den gamle ordlyd
    // ("...har kilde – et hævet bogstav...") knyttede loeftet til en
    // ABSTRAKT egenskab (at tallet HAR en kilde - sandt for HELE sitet, jf.
    // haard begraensning 2's 1110/1110), ikke til den SYNLIGE markering, der
    // rent faktisk mangler paa sammenligningssiden. Den nye ordlyd knytter
    // sig eksplicit til maerket ("kildemærker"/"source marks"). Uden denne
    // paastand ville 27.2 IKKE opdage en tilbagerulning til den gamle
    // ordlyd — maalt: den gamle streng rammer ikke forBredt-moensteret.
    const naevnerMaerke = typeof legendeTekst === 'string'
      && (sprog === 'da' ? /mærke/i.test(legendeTekst) : /\bmark/i.test(legendeTekst));
    ok(`27.3b.${sprog}: legenden knytter sig til den SYNLIGE markering, ikke kun til at tallet "har" en kilde`,
      naevnerMaerke, `fik: ${JSON.stringify(legendeTekst)}`);

    /* --- 4. EN-only: kort_legende og kilde_maerke_forklaring bruger SAMME
     *  udtryk for det haevede bogstav. Dansk har ingen divergens (begge
     *  siger "hævet bogstav") og roeres derfor ikke. */
    if (sprog === 'en') {
      const udtrykRegex = /superscript letter|raised letter/i;
      const term1 = udtrykRegex.exec(legendeTekst)?.[0]?.toLowerCase() ?? null;
      const term2 = udtrykRegex.exec(String(i18n.kilde_maerke_forklaring))?.[0]?.toLowerCase() ?? null;
      ok('27.7.en: kort_legende og kilde_maerke_forklaring bruger samme engelske udtryk for det haevede bogstav',
        term1 !== null && term1 === term2,
        `kort_legende: ${JSON.stringify(term1)}, kilde_maerke_forklaring: ${JSON.stringify(term2)}`);
    }

    if (!fs.existsSync(dist) || typeof legendeTekst !== 'string' || typeof fotoSaetning !== 'string') {
      ok(`27.4.${sprog}: der ER bygget sider at maale paa`, false,
        'uden dist/ eller uden en gyldig legende-streng beviser de foelgende vagter ingenting');
      continue;
    }

    /* --- 1. Strukturel optaelling: forside + katalogliste + hver producentside */
    const producenterDir = path.join(dist, sprog, 'producenter');
    const antalProducenter = fs.existsSync(producenterDir)
      ? fs.readdirSync(producenterDir, { withFileTypes: true }).filter((d) => d.isDirectory()).length
      : 0;
    const forventet = 2 + antalProducenter; // forside + robotter/index + hver producentside

    let fundet = 0;
    (function gaa(dir) {
      if (!fs.existsSync(dir)) return;
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) { gaa(p); continue; }
        if (!e.name.endsWith('.html')) continue;
        const html = fs.readFileSync(p, 'utf8');
        if (synligTekst(html).includes(fotoSaetning)) fundet++;
      }
    })(path.join(dist, sprog));

    /* TAELLER FOTOSAETNINGEN, ikke hele kort_legende (spor/kort, 31. aug 2026).
       Foer i dag trykte alle tre kortflader den samme lange streng. Nu viser
       ingen af kortene tal, saa saetningen "Kortenes tal baerer kildemaerker"
       passer kun der, hvor den endnu ikke er ryddet op (kataloget - se
       rapportens fund). Forsiden og producentsiderne trykker kort_legende_foto.

       Kravet er det samme og maales stadig paa alle 27 flader: viser en side
       fabrikantfotos paa kort, skal den sige, hvis ophav de fotos er. Havde
       vagten fortsat maalt hele kort_legende, ville den vaere faldet til 1 og
       have set ud som et brud paa kildeloeftet - men loeftet, den vogter, er
       fotoets, og det staar uaendret paa alle 27. */
    ok(`27.5.${sprog}: fotoloeftet staar paa forside + katalogliste + hver producentside (${forventet})`,
      fundet === forventet,
      `forventet ${forventet} (2 + ${antalProducenter} producenter), fandt ${fundet}`);

    /* --- 2. Legenden optraeder IKKE paa sammenligningssiden (L46) -------- */
    const samPad = path.join(dist, sprog, 'sammenligning', 'index.html');
    if (fs.existsSync(samPad)) {
      const samHtml = synligTekst(fs.readFileSync(samPad, 'utf8'));
      ok(`27.6.${sprog}: legenden staar IKKE paa sammenligningssiden (L46)`,
        !samHtml.includes(legendeTekst));
    } else {
      ok(`27.6.${sprog}: sammenligningssiden findes`, false, 'ikke bygget');
    }
  }
}
