#!/usr/bin/env node
/**
 * tools/validate.mjs — mekanisk haandhaevelse af "opfind aldrig tal".
 *
 * Nul afhaengigheder. Ren Node, ES-moduler, egen YAML-laeser (tools/yaml.mjs) +
 * enheds-/operatorordforraad (tools/enheder.mjs).
 *
 *   node tools/validate.mjs                    validerer data/robots/*.yaml
 *   node tools/validate.mjs <fil...>           validerer navngivne filer
 *   node tools/validate.mjs --data=<mappe>     anden datamappe
 *   node tools/validate.mjs --taethed          printer ogsaa taethedstabellen
 *   node tools/validate.mjs --selvtest         koerer parserens egne testtilfaelde
 *
 * Parametre, der IKKE er laast:
 *   --naevner=33                  D7 er lukket (L30): naevneren er skemaets feltantal.
 *                                 Flaget bliver staaende, saa en aendring kan MAALES
 *                                 mod den gamle skala — ikke saa siden kan vise to tal
 *   --type-uden-model=tael|tael-ikke|begge   D4. Standard: begge
 *   --imperial-tolerance=<pct>    Standard: 2. Graensen er max(denne, afrundingsslaek)
 *   --assets=<mappe>              hvor R18 slaar billedfiler op. Standard: ./assets
 *   --streng                      advarsler taeller som fejl
 *
 * Exit 0 = ingen fejl. Exit 1 = mindst én fejl; robotnavn og feltnavn staar i linjen.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parseYaml, YamlFejl } from './yaml.mjs';
import {
  normaliser, faelderI, findTal, kanoniskEnhed,
  ENHEDER, TYPE_ENHEDER, IMPERIALE, tilBasis, decimaler, ORD_OPERATOR, ORD_MAASKE,
} from './enheder.mjs';
import {
  FELTER, FELTNAVNE, IDENTITET_PAAKRAEVET, IDENTITET_VALGFRI, STATUS_VAERDIER, FREMDRIFT_VAERDIER,
  TILSTANDE, POST_NOEGLER, NAEVNERE_STANDARD, tilstandAf, jaNejAf, normaliserRobot,
  ANVENDELSE_VAERDIER, ANVENDELSE_NOEGLER, sorterAnvendelse,
  BILLEDE_OPHAV, BILLEDE_NOEGLER, BILLEDE_KRAEVER_KILDE, BILLEDMAPPER, BILLEDE_ENDELSER, SPROG, KILDESPROG,
} from './skema.mjs';
import { hentRobotter } from '../db/hent.mjs';

/* ---------------------------------------------------------------- opsamling */

const fejl = [];
const advarsler = [];
let robotINavn = '(ukendt robot)';

function FEJL(regel, felt, besked) { fejl.push({ robot: robotINavn, felt, regel, besked }); }
function ADVARSEL(regel, felt, besked) { advarsler.push({ robot: robotINavn, felt, regel, besked }); }

/** Projektroden, regnet ud af filens egen placering — ikke af cwd. Bygget og
 *  validatoren skal se den SAMME assets/, ogsaa naar de koeres fra en anden mappe. */
const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const cfg = {
  imperialTolerance: 2,   // procent — prompten: afviger de mere end 2 %, skal det fanges
  streng: false,
  iDag: new Date().toISOString().slice(0, 10),
  // R18 slaar billedfiler op her. Overskrives med --assets=<mappe>, saa en test
  // kan pege paa sit eget saet uden at skulle lave filer i det rigtige assets/.
  assets: path.join(ROD, 'assets'),
};

const OPERATORER = new Set(['>', '>=', '<', '<=', '~', '±']);

/* ------------------------------------------------------------------ hjaelp */

const erPost = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** R6 — hvert tal skal have en kilde (regel 2). */
function tjekKilde(sti, post) {
  const k = post.kilde;
  if (typeof k !== 'string' || !/^https?:\/\//.test(k)) {
    FEJL('R6', sti, `"kilde" mangler eller er ikke en URL (fik ${JSON.stringify(k ?? null)}). ` +
      `Uden kilde er tallet ikke indsamlet, det er husket`);
    return;
  }
  try { new URL(k); } catch { FEJL('R6', sti, `"kilde" kan ikke laeses som URL: ${k}`); }
  const t = post.kildetype;
  if (t !== undefined && t !== 'primaer' && t !== 'sekundaer') {
    FEJL('R6', sti, `"kildetype" skal vaere primaer eller sekundaer, ikke ${JSON.stringify(t)}`);
  }
  tjekInterntSprog('R19', `${sti}.advarsel`, post.advarsel);
}

/**
 * R19 — internt sprog maa ikke laekke ud paa siden (Å25, 27. aug 2026).
 * "advarsel:" og "noter:" er skrevet TIL LAESEREN — en post der naevner et
 * filnavn, et internt feltnavn, et vaerktoej eller vores egen STOPPROEVE-protokol
 * er skrevet til os i stedet, og hoerer i fund/, ikke i datafilen. Fundet paa 189
 * noter og 48 advarsler ved en fuld gennemlaesning (ikke en regex-doemt en) af
 * kataloget 27. aug 2026 — se fund/NOTEARKIV-1.md for de flyttede tekster og
 * begrundelsen for hvert moenster. Listen er den samme, briefet selv brugte som
 * acceptkriterium; udvid den her, hvis et nyt moenster findes, ikke i et
 * engangs-script.
 *
 * Udvidet 27. aug 2026 (spor/prosa2, KRITIK-4 fund 1/5): de fem interne
 * enum-navne fra anvendelse-skemaet (tools/skema.mjs' ANVENDELSE_VAERDIER, plus
 * "ikke_oplyst") laekker paa samme maade som et filnavn eller et feltnavn — en
 * laeser ser "sikkerhed_overvaagning" i loebende tekst i stedet for "sikkerhed
 * og overvaagning". "sikkerhed_overv(aa|å)gning" daekker begge stavemaader,
 * fordi punkt 1's translit-rettelse kan naa at fikse "aa" -> "å" i selve
 * enum-navnet FOER denne regel ser teksten, hvis de to rettelser nogensinde
 * koerer i omvendt raekkefoelge af her.
 *
 * IKKE udvidet til en generel ae/oe/aa-detektor: samme translit-oprydning
 * (punkt 1) fandt gentagne ordrette producent-citater midt i advarsel/noter
 * ("How much does it cost...", "RaaS" i et FAQ-svar) — engelsk tekst, der
 * ægte indeholder "oe"/"aa" uden at vaere internt sprog. En blind ae/oe/aa-vagt
 * ville fejle paa netop den slags citater, og en vagt der fejler paa et gyldigt
 * citat fra en engelsk producentside er vaerre end ingen vagt.
 */
const INTERNT_SPROG = /\.yaml|\.mjs|ved_last|_gaaende|_staaende|validator|skal normaliseres|i indlaesningen|STOPPROEVE|BESTAAET|sikkerhed_overv(?:aa|å)gning|forsvar_beredskab|forskning_udvikling|forbruger_uddannelse|ikke_oplyst/i;

function tjekInterntSprog(regel, sti, tekst) {
  if (typeof tekst !== 'string') return;
  const m = tekst.match(INTERNT_SPROG);
  if (m) {
    FEJL(regel, sti, `internt sprog ("${m[0]}") i en tekst, laeseren ser paa siden. ` +
      `Hoerer i fund/, ikke i datafilen — se fund/NOTEARKIV-1.md for moenstret og hvad det blev omskrevet til.`);
  }
}

/** R7 — hentedato. Uden den kan posten ikke forældes (PLAN.md afsnit 11). */
function tjekHentet(sti, post) {
  const h = post.hentet;
  if (typeof h !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(h)) {
    FEJL('R7', sti, `"hentet" mangler eller er ikke YYYY-MM-DD (fik ${JSON.stringify(h ?? null)})`);
    return;
  }
  if (Number.isNaN(Date.parse(h))) { FEJL('R7', sti, `"hentet: ${h}" er ikke en gyldig dato`); return; }
  if (h > cfg.iDag) ADVARSEL('R7', sti, `"hentet: ${h}" ligger i fremtiden (i dag er ${cfg.iDag})`);
}

/** R8 — operatoren skal vaere en af de seks (regel 4). */
function tjekOperator(sti, post) {
  const op = post.operator;
  if (op === undefined || op === null) return null;
  if (typeof op !== 'string' || !OPERATORER.has(op)) {
    FEJL('R8', sti, `ukendt operator ${JSON.stringify(op)} — gyldige er ${[...OPERATORER].join(' ')}`);
    return null;
  }
  return op;
}

/**
 * R5 — enhed paakraevet, kendt, og af feltets dimension.
 * Et felt kan have to tilladte dimensioner (haeldning: grader ELLER procent).
 * De to omregnes aldrig til hinanden; tjekket accepterer blot begge.
 */
function tjekEnhed(sti, raaEnhed, forventetType, ogsaaType) {
  const tilladte = [forventetType, ogsaaType].filter(Boolean);
  const navne = tilladte.flatMap((t) => TYPE_ENHEDER[t] ?? []);
  const somTekst = tilladte.join(' eller ');
  if (raaEnhed === undefined || raaEnhed === null || raaEnhed === '') {
    FEJL('R5', sti, `talfeltet mangler "enhed"` +
      (tilladte.length ? ` — forventet en ${somTekst}-enhed (${navne.join(', ')})` : ''));
    return null;
  }
  const e = kanoniskEnhed(String(raaEnhed), forventetType);
  if (!ENHEDER[e]) {
    FEJL('R5', sti, `enheden ${JSON.stringify(raaEnhed)} kender skemaet ikke` +
      (tilladte.length ? `. Gyldige ${somTekst}-enheder: ${navne.join(', ')}` : ''));
    return null;
  }
  if (tilladte.length && !tilladte.includes(ENHEDER[e][0])) {
    FEJL('R5', sti, `"${raaEnhed}" er en ${ENHEDER[e][0]}-enhed, men feltet er en ${somTekst} ` +
      `(gyldige: ${navne.join(', ')})`);
    return null;
  }
  return e;
}

/** R9 — metrisk mod imperial. Ghost: 2.4 m/s mod 4.9 mph afviger 9,6 %. */
function tjekImperial(sti, post, tal, enhed) {
  if (post.vaerdi_imperial === undefined) {
    if (post.enhed_imperial !== undefined) FEJL('R9', sti, `"enhed_imperial" staar uden "vaerdi_imperial"`);
    return;
  }
  const impV = post.vaerdi_imperial;
  if (typeof impV !== 'number') { FEJL('R9', sti, `"vaerdi_imperial" er ikke et tal`); return; }
  const impE = kanoniskEnhed(String(post.enhed_imperial ?? ''), ENHEDER[enhed]?.[0]);
  if (!ENHEDER[impE]) { FEJL('R9', sti, `"enhed_imperial: ${post.enhed_imperial}" kender skemaet ikke`); return; }
  if (!enhed) return;
  if (ENHEDER[impE][0] !== ENHEDER[enhed][0]) {
    FEJL('R9', sti, `"${enhed}" og "${post.enhed_imperial}" er ikke samme stoerrelse ` +
      `(${ENHEDER[enhed][0]} mod ${ENHEDER[impE][0]})`);
    return;
  }
  if (!IMPERIALE.has(impE)) ADVARSEL('R9', sti, `"enhed_imperial: ${impE}" er ikke en imperial enhed`);

  const a = tilBasis(tal, enhed);
  const b = tilBasis(impV, impE);
  if (a === null || b === null || b === 0) return;
  const afvigelse = Math.abs(a - b) / Math.abs(b) * 100;

  // Hvor meget kan afrundingen af de to TRYKTE tal alene forklare?
  const slaek = (0.5 * Math.pow(10, -decimaler(impV))) / Math.abs(impV) * 100
              + (0.5 * Math.pow(10, -decimaler(tal))) / Math.abs(tal) * 100;
  const graense = Math.max(cfg.imperialTolerance, slaek);
  if (afvigelse <= graense) return;

  const forhold = a / b;
  const potens = Math.abs(Math.log10(Math.abs(forhold)));
  const erFaktor10 = Math.abs(potens - Math.round(potens)) < 0.02 && Math.round(potens) !== 0;

  const besked =
    `metrisk ${tal} ${enhed} og imperial ${impV} ${impE} afviger ${afvigelse.toFixed(1)} % ` +
    `(graensen er ${graense.toFixed(1)} %: max af tolerancen ${cfg.imperialTolerance} % og ` +
    `afrundingsslaekket ${slaek.toFixed(1)} %)` +
    (erFaktor10 ? ` — forholdet er en faktor ${Math.round(Math.pow(10, Math.round(potens)))}, ` +
      `altsaa formentlig et manglende nul` : '');

  // Regel 9: ret aldrig stiltiende i en producents tal. Enten fejler bygget, eller
  // ogsaa baerer feltet et "advarsel:", der ryger med paa siden ved siden af tallet.
  // --streng goer advarslen til en fejl igen, saa "advarsel:" ikke bliver en lyddaemper.
  if (typeof post.advarsel === 'string' && post.advarsel.trim() !== '') {
    ADVARSEL('R9', sti, besked + ' — baaret som "advarsel:" og vises paa siden, jf. regel 9');
  } else {
    FEJL('R9', sti, besked + '. Ret aldrig stiltiende i producentens tal: enten er et af dem ' +
      'forkert, eller ogsaa skal feltet baere "advarsel:" med begrundelsen');
  }
}

/** R12 — raastrengen er valgfri, men er den der, skal den passe (regel 4). */
function tjekRaa(sti, post, tal, enhed, operator) {
  const raa = post.raa;
  if (raa === undefined) return;
  if (typeof raa !== 'string' || raa.trim() === '') { FEJL('R12', sti, `"raa" er tom`); return; }
  const nrm = normaliser(raa);
  const fundne = findTal(nrm);
  const traef = fundne.find((f) => Math.abs(f.tal - tal) < 1e-9);
  if (!traef) {
    FEJL('R12', sti, `vaerdien ${tal} findes ikke i raastrengen ${JSON.stringify(raa)} ` +
      `(normaliseret: ${JSON.stringify(nrm)}; tal fundet: ${fundne.map((f) => f.tal).join(', ') || 'ingen'})`);
    return;
  }
  const raaEnhed = traef.enhed || traef.enhedArvet;
  if (enhed && raaEnhed && kanoniskEnhed(raaEnhed, ENHEDER[enhed]?.[0]) !== enhed) {
    FEJL('R12', sti, `"enhed: ${enhed}" passer ikke til raastrengen, hvor ${tal} staar med "${raaEnhed}"`);
  }
  const faelder = faelderI(raa);
  if (traef.operator && traef.operator !== operator) {
    FEJL('R12', sti, `kilden skriver operatoren "${traef.operator}" foran ${tal}, men posten har ` +
      (operator ? `"${operator}"` : 'ingen operator') +
      (faelder.length ? ` — raastrengen indeholder ${faelder.join(' og ')}, som aeder operatoren, ` +
        `hvis den laeses uden normalisering` : ''));
  } else if (!traef.operator && operator && !traef.separator) {
    FEJL('R12', sti, `posten har "operator: ${operator}", men raastrengen har ingen operator foran ${tal}`);
  }
  const foran = nrm.slice(Math.max(0, traef.indeks - 22), traef.indeks);
  for (const [re, op] of ORD_OPERATOR) {
    if (re.test(foran) && operator !== op) {
      FEJL('R12', sti, `kilden skriver "${foran.trim()}" foran ${tal} — det er operatoren "${op}", ` +
        `og den skal gemmes`);
      return;
    }
  }
  for (const re of ORD_MAASKE) {
    if (re.test(foran) && !operator) {
      ADVARSEL('R12', sti, `kilden skriver "${foran.trim()}" foran ${tal} — afgoer, om det er en ` +
        `etikette eller en operator`);
      return;
    }
  }
}

/**
 * R11's noegleliste, UDVIDET med "advarsel_klasse" (L48/D14, spor/d14data
 * punkt 1) — UDEN at aendre tools/skema.mjs's egen POST_NOEGLER. To andre
 * spor arbejder i skema.mjs lige nu (CLAUDE.md's filejerskab for dette
 * spor forbyder den fil), saa unionen bygges lokalt her og bruges KUN af
 * tjekNoegler nedenfor. Naar skema.mjs en dag faar sin egen POST_NOEGLER
 * udvidet med samme noegle, kan denne lokale union fjernes igen uden at
 * nogen adfaerd aendrer sig.
 */
const POST_NOEGLER_UDVIDET = new Set([...POST_NOEGLER, 'advarsel_klasse']);

/** R11 — ukendte noegler i en feltpost. En tastefejl skal ikke forsvinde tavst. */
function tjekNoegler(sti, post) {
  for (const n of Object.keys(post)) {
    if (!POST_NOEGLER_UDVIDET.has(n)) {
      FEJL('R11', sti, `ukendt noegle "${n}" i feltposten. Tilladte: ${[...POST_NOEGLER_UDVIDET].join(', ')}`);
    }
  }
}

/**
 * R20 — L48/D14: et forbehold ("advarsel:") kan baere en maskinlaesbar
 * klasse i søsterfeltet "advarsel_klasse:" — "gyldighed" (paavirker
 * sammenligneligheden, faar et synligt maerke i et senere spor) eller
 * "uddybning" (uddybende kontekst, ingen tvivl om selve tallet). Klassen
 * er sat af et menneske, post for post, i fund/FUND-d14-klassifikation.md
 * (562 forbehold, ikke en regex-doemt vaerdi) — validatoren haandhaever
 * kun FORMEN her, ikke klassifikationens rigtighed.
 *
 * Et forbehold UDEN klasse er LOVLIGT: FUND-dokumentet daekker 562 af
 * (maalt 28. aug 2026) 890 "advarsel:"-forekomster i alt — resten (328,
 * mest sensorik/EU-felter som lidar/kameraer/dockingstation/ce_oplyst)
 * ligger uden for dets seks familier og skal ikke gaettes en klasse paa
 * (CLAUDE.md begraensning 6: ingen redaktionel dom uden offentliggjort
 * metode). En UGYLDIG klasse, eller en klasse uden et forbehold at
 * klassificere (feltet har "advarsel_klasse" men intet "advarsel"), er
 * det ikke — begge er en form, der ikke kan vaere sand, og skal fejle.
 */
const ADVARSEL_KLASSER = new Set(['gyldighed', 'uddybning']);
function tjekAdvarselKlasse(sti, post) {
  const k = post.advarsel_klasse;
  if (k === undefined) return;
  if (typeof k !== 'string' || !ADVARSEL_KLASSER.has(k)) {
    FEJL('R20', sti, `"advarsel_klasse" skal vaere "gyldighed" eller "uddybning", fik ${JSON.stringify(k ?? null)}`);
    return;
  }
  if (typeof post.advarsel !== 'string' || post.advarsel.trim() === '') {
    FEJL('R20', sti, `"advarsel_klasse: ${k}" staar uden "advarsel" — en klasse klassificerer et ` +
      `forbehold, og uden et forbehold er der intet at klassificere`);
  }
}

/**
 * R21 — spor/cjkui, 1. sep 2026: "advarsel_ordlyd" er producentens ordrette,
 * ikke-danske formulering, flyttet ud af "advarsel:" saa siden bliver ren
 * for kinesiske tegn uden at kildebeviset gaar tabt — det flytter til
 * datalaget i stedet for at forsvinde. Samme to krav som R20 stiller til
 * "advarsel_klasse": feltet skal have et rigtigt indhold, og det kan ikke
 * staa alene uden det forbehold, det er en ordlyd TIL.
 */
function tjekAdvarselOrdlyd(sti, post) {
  const o = post.advarsel_ordlyd;
  if (o === undefined) return;
  if (typeof o !== 'string' || o.trim() === '') {
    FEJL('R21', sti, `"advarsel_ordlyd" skal vaere en ikke-tom tekst — producentens ordrette ` +
      `kildeformulering — fik ${JSON.stringify(o)}`);
    return;
  }
  if (typeof post.advarsel !== 'string' || post.advarsel.trim() === '') {
    FEJL('R21', sti, `"advarsel_ordlyd" staar uden "advarsel" — ordlyden hoerer til et forbehold, ` +
      `laeseren ser, og uden det forbehold er der intet, den er en ordlyd til`);
  }
}

/**
 * R22 — spor/i18nfelt, 2. sep 2026 (Å98 spor A): tvilling til R21 ovenfor,
 * men for OVERBYGNINGEN i stedet for ordlyden. "<felt>_i18n" er et
 * sprogkort { en: "...", ... } ved siden af den danske kilde
 * ("advarsel:"/"note:"), som forbliver den ENE sandhed (KILDESPROG,
 * tools/skema.mjs) — BRIEF-i18nfelt.md punkt 2 stiller fem krav:
 *
 *   1. vaerdien er et kort af sprogkode -> ikke-tom tekst
 *   2. hver noegle findes i SPROG
 *   3. KILDESPROG maa ikke staa som noegle — dansk bor i kildeNoeglen, og to
 *      steder at rette den samme danske tekst er den fejl, hele opgaven
 *      findes for at undgaa
 *   4. "<felt>_i18n" kan ikke staa uden kildeNoeglen (samme krav som R21)
 *   5. tjekInterntSprog koeres paa HVER oversat tekst — R19 vogter i dag kun
 *      den danske, og uden dette kan et filnavn eller "ikke_oplyst" sive ind
 *      ad den engelske doer
 *
 * Delt af to kaldesteder: feltpostens "advarsel_i18n" (tjekFelt nedenfor) og
 * anvendelse/billedes "note_i18n" (tjekAnvendelse/tjekBillede) — samme form,
 * samme regler, to forskellige kilde-/i18n-noeglepar.
 */
function tjekI18nOverbygning(sti, post, kildeNoegle, i18nNoegle) {
  const blok = post[i18nNoegle];
  if (blok === undefined) return;
  if (!erPost(blok)) {
    FEJL('R22', sti, `"${i18nNoegle}" skal vaere et sprogkort af sprogkode -> tekst, fik ` +
      `${JSON.stringify(blok)}`);
    return;
  }
  if (typeof post[kildeNoegle] !== 'string' || post[kildeNoegle].trim() === '') {
    FEJL('R22', sti, `"${i18nNoegle}" staar uden "${kildeNoegle}" — overbygningen oversaetter en ` +
      `tekst, laeseren ser, og uden den tekst er der intet at oversaette`);
  }
  for (const [sprog, tekst] of Object.entries(blok)) {
    if (sprog === KILDESPROG) {
      FEJL('R22', `${sti}.${i18nNoegle}`, `kildesproget "${KILDESPROG}" staar som noegle. Dansk bor ` +
        `i "${kildeNoegle}:" — to steder at rette den samme danske tekst er den fejl, hele ` +
        `i18n-overbygningen findes for at undgaa`);
      continue;
    }
    if (!SPROG.includes(sprog)) {
      FEJL('R22', `${sti}.${i18nNoegle}`, `ukendt sprog "${sprog}" i "${i18nNoegle}". Gyldige: ${SPROG.join(', ')}`);
      continue;
    }
    if (typeof tekst !== 'string' || tekst.trim() === '') {
      FEJL('R22', `${sti}.${i18nNoegle}.${sprog}`, `oversaettelsen er tom eller ikke tekst, fik ` +
        `${JSON.stringify(tekst)}`);
      continue;
    }
    tjekInterntSprog('R22', `${sti}.${i18nNoegle}.${sprog}`, tekst);
  }
}

/**
 * R15 — "varianter:" paa et felt (skemaudvidelse 2).
 * Go2's fire varianter er fire maskiner, ikke pynt: nyttelasten falder fra 5 til
 * 2,5 kg hen over Lite3's fire kolonner. Blokken skal derfor kunne staa — men
 * variantnavnene skal vaere DE SAMME i hele filen, ellers kan to felter tale om
 * hver sin "Pro" uden at nogen opdager det.
 */
function tjekVarianter(sti, post, kendteNavne) {
  const v = post.varianter;
  if (v === undefined) return;
  if (!erPost(v)) {
    FEJL('R15', sti, `"varianter" skal vaere et kort af variantnavn: vaerdi, fik ${JSON.stringify(v)}`);
    return;
  }
  const navne = Object.keys(v);
  if (!navne.length) { FEJL('R15', sti, `"varianter" er tom`); return; }
  for (const n of navne) {
    const x = v[n];
    if (x === null || (typeof x === 'object')) {
      FEJL('R15', `${sti}.varianter.${n}`, `varianten skal baere en skalar vaerdi, fik ${JSON.stringify(x)}`);
    }
    if (kendteNavne && !kendteNavne.has(n)) {
      FEJL('R15', `${sti}.varianter.${n}`, `varianten "${n}" staar ikke i robottens ` +
        `topnoegle "varianter" (${[...kendteNavne].join(', ') || 'tom'}) — enten er navnet stavet ` +
        `forskelligt to steder, eller ogsaa mangler varianten paa listen`);
    }
  }
  if (!kendteNavne) {
    FEJL('R15', sti, `feltet har en "varianter"-blok, men robotten har ingen topnoegle ` +
      `"varianter" med variantnavnene. Uden den kan to felter tale om hver sin variant`);
  }
}

/* --------------------------------------------------------------- felttjek */

function tjekTalfelt(sti, post, spec) {
  const harInterval = post.min !== undefined || post.maks !== undefined;
  const harVaerdi = post.vaerdi !== undefined;

  if (harVaerdi && harInterval) { FEJL('R4', sti, `posten har baade "vaerdi" og "min"/"maks" — vaelg én`); return; }
  if (!harVaerdi && !harInterval) {
    FEJL('R4', sti, `posten har hverken "vaerdi" eller "min"/"maks". Er oplysningen fravaerende, ` +
      `saa skriv tilstanden ud: ${TILSTANDE.join(' | ')}`);
    return;
  }
  if (harInterval && (typeof post.min !== 'number' || typeof post.maks !== 'number')) {
    FEJL('R4', sti, `et interval kraever baade "min" og "maks" som tal (regel 5: bevar intervaller)`);
    return;
  }
  const tal = harInterval ? [post.min, post.maks] : [post.vaerdi];
  for (const t of tal) {
    if (typeof t !== 'number' || !Number.isFinite(t)) {
      FEJL('R4', sti, `vaerdien ${JSON.stringify(t)} er ikke et tal`);
      return;
    }
  }
  const enhed = tjekEnhed(sti, post.enhed, spec.type, spec.ogsaaType);
  tjekKilde(sti, post);
  tjekHentet(sti, post);
  const op = tjekOperator(sti, post);
  if (enhed) {
    for (const t of tal) tjekRaa(sti, post, t, enhed, harInterval ? null : op);
    if (!harInterval) tjekImperial(sti, post, post.vaerdi, enhed);
  }
  tjekVedLast(sti, post, spec);
}

/**
 * R10 — driftstid uden lastbetingelse er ikke et tal (regel 8).
 * `ved_last` maa vaere et masse-kort ELLER en tilstand — og et masse-kort, hvis
 * `vaerdi` selv er en tilstand, taeller som tilstanden. Yobotics Y20 er stedet:
 * producenten oplyser selv, AT tallet gaelder med last, men ikke hvor meget.
 * "Med last, kg ikke oplyst" er en anden oplysning end "ingen lastbetingelse",
 * og de to maa ikke kollapse.
 */
function tjekVedLast(sti, post, spec) {
  if (spec.kraeverVedLast) {
    const vl = post.ved_last;
    if (vl === undefined) {
      FEJL('R10', sti, `"driftstid" mangler "ved_last". Uden lastbetingelse er tallet ikke ` +
        `sammenligneligt — skriv ved_last: ikke_oplyst, hvis producenten ikke oplyser den`);
    } else if (erPost(vl)) {
      if (tilstandAf(vl.vaerdi)) {
        if (vl.enhed !== undefined) tjekEnhed(`${sti}.ved_last`, vl.enhed, 'masse');
      } else if (typeof vl.vaerdi !== 'number') {
        FEJL('R10', `${sti}.ved_last`, `"vaerdi" er hverken et tal eller en af tilstandene ` +
          `${TILSTANDE.join(' | ')} (fik ${JSON.stringify(vl.vaerdi ?? null)})`);
      } else {
        tjekEnhed(`${sti}.ved_last`, vl.enhed, 'masse');
      }
    } else if (!tilstandAf(vl)) {
      FEJL('R10', `${sti}.ved_last`, `${JSON.stringify(vl)} er hverken et masse-kort eller ` +
        `en af tilstandene ${TILSTANDE.join(' | ')}`);
    }
  } else if (post.ved_last !== undefined) {
    FEJL('R10', sti, `"ved_last" hoerer kun til paa et felt, der kraever en lastbetingelse`);
  }
}

function tjekTekstfelt(sti, post, spec) {
  const v = post.vaerdi;
  if (v === undefined) { FEJL('R4', sti, `posten mangler "vaerdi"`); return; }
  if (typeof v === 'number') {
    // Et tal i et tekstfelt er stadig et tal og skal have enhed.
    tjekEnhed(sti, post.enhed, null);
  } else if (typeof v !== 'string') {
    FEJL('R4', sti, `"vaerdi" skal vaere tekst (eller et tal med enhed), fik ${JSON.stringify(v)}`);
    return;
  } else if (v.trim() === '') {
    FEJL('R4', sti, `"vaerdi" er tom. Er oplysningen fravaerende, saa skriv tilstanden ud`);
    return;
  }
  tjekKilde(sti, post);
  tjekHentet(sti, post);
  if (spec.art === 'ip' && typeof v === 'string' && !/^IP[0-9X]{2}K?$/i.test(v.trim())) {
    FEJL('R13', sti, `"${v}" ligner ikke en IP-klasse (IP65, IP67, IPX4 ...)`);
  }
}

function tjekJaNejfelt(sti, post) {
  // Normaliseringen har allerede oversat "ja"/"nej" til true/false; naar der
  // stadig staar noget andet, er det hverken et ja eller et nej.
  const v = post.vaerdi;
  if (typeof v !== 'boolean') {
    FEJL('R4', sti, `et ja/nej-felt skal have "vaerdi: true"/"ja" eller "vaerdi: false"/"nej", fik ` +
      `${JSON.stringify(v ?? null)}. Er det uoplyst, saa skriv feltet som "ikke_oplyst"`);
    return;
  }
  tjekKilde(sti, post);
  tjekHentet(sti, post);
}

function tjekListefelt(sti, post) {
  const v = post.vaerdi;
  if (!Array.isArray(v)) {
    FEJL('R4', sti, `et listefelt skal have "vaerdi" som liste, fik ${JSON.stringify(v ?? null)}`);
    return;
  }
  if (v.length === 0) { FEJL('R4', sti, `listen er tom. Er oplysningen fravaerende, saa skriv tilstanden ud`); return; }
  for (const e of v) if (typeof e !== 'string') FEJL('R4', sti, `listeelementet ${JSON.stringify(e)} er ikke tekst`);
  tjekKilde(sti, post);
  tjekHentet(sti, post);
}

function tjekFelt(navn, vaerdi, spec, kendteVarianter) {
  const sti = navn;
  // De tre tilstands-strenge. Den fjerde tilstand, 0, er en almindelig post med kilde.
  if (typeof vaerdi === 'string') {
    const kanonisk = tilstandAf(vaerdi);
    if (kanonisk && kanonisk !== vaerdi) {
      ADVARSEL('R3', sti, `skriv tilstanden med understreg: "${kanonisk}", ikke "${vaerdi}"`);
    }
    if (!kanonisk) {
      FEJL('R3', sti, `${JSON.stringify(vaerdi)} er ikke en gyldig tilstand. ` +
        `Gyldige: ${TILSTANDE.join(' | ')} — eller en post med vaerdi, enhed, kilde og hentet`);
    }
    return;
  }
  if (vaerdi === null || vaerdi === undefined) {
    FEJL('R3', sti, `feltet er tomt. Skriv tilstanden ud: ${TILSTANDE.join(' | ')}`);
    return;
  }
  if (typeof vaerdi === 'number' || typeof vaerdi === 'boolean') {
    FEJL('R4', sti, `${JSON.stringify(vaerdi)} staar bart uden enhed, kilde og hentet. ` +
      `Et bart tal er et tal uden herkomst`);
    return;
  }
  if (Array.isArray(vaerdi)) { FEJL('R4', sti, `feltet er en bar liste uden kilde og hentet`); return; }

  tjekNoegler(sti, vaerdi);
  tjekVarianter(sti, vaerdi, kendteVarianter);
  tjekAdvarselKlasse(sti, vaerdi);   // R20 — foer typegrenen, gaelder alle former ens
  tjekAdvarselOrdlyd(sti, vaerdi);   // R21 — samme grund, samme placering
  tjekI18nOverbygning(sti, vaerdi, 'advarsel', 'advarsel_i18n');   // R22 — samme grund, samme placering

  // Skemaudvidelse 1: tilstanden med herkomst. "Producenten svarer nej, her er
  // hvor det staar" er en anden oplysning end en bar "nej" — og en langt bedre.
  if (tilstandAf(vaerdi.vaerdi)) { tjekTilstandspost(sti, vaerdi, spec); return; }

  if (spec.art === 'tal') { tjekTalfelt(sti, vaerdi, spec); return; }

  // Et ikke-talfelt maa baere et maalbart interval ved siden af producentens
  // ordlyd — Spot skriver "ureguleret DC 35-58,8 V". Gaar det med, skal det vaere
  // et helt interval med enhed; ellers er det et halvt tal uden herkomst.
  if (vaerdi.min !== undefined || vaerdi.maks !== undefined) {
    if (typeof vaerdi.min !== 'number' || typeof vaerdi.maks !== 'number') {
      FEJL('R4', sti, `et interval kraever baade "min" og "maks" som tal (regel 5: bevar intervaller)`);
    } else {
      tjekEnhed(sti, vaerdi.enhed, null);
    }
  }
  if (spec.art === 'jaNej') tjekJaNejfelt(sti, vaerdi);
  else if (spec.art === 'liste') tjekListefelt(sti, vaerdi);
  else tjekTekstfelt(sti, vaerdi, spec);
}

/**
 * Skemaudvidelse 1 — et felt maa vaere en tilstand MED kilde, hentedato og
 * forbehold: `{ vaerdi: ikke_oplyst, kilde: ..., hentet: ..., advarsel: ... }`.
 *
 * Det er ikke en opblodning af R4. Kravet gaar den anden vej: en bar tilstand
 * slipper for kilde, men skriver man den som en post, SKAL herkomsten med — og
 * alt det, der kun giver mening om et tal (enhed, operator, interval, imperial,
 * raastreng), er forbudt, saa "ikke oplyst 40 kg" ikke kan opstaa.
 */
const KUN_MED_TAL = ['enhed', 'operator', 'min', 'maks', 'vaerdi_imperial', 'enhed_imperial', 'raa', 'valuta'];
function tjekTilstandspost(sti, post, spec) {
  const kanonisk = tilstandAf(post.vaerdi);
  if (kanonisk !== post.vaerdi) {
    ADVARSEL('R3', sti, `skriv tilstanden med understreg: "${kanonisk}", ikke "${post.vaerdi}"`);
  }
  tjekKilde(sti, post);
  tjekHentet(sti, post);
  for (const n of KUN_MED_TAL) {
    if (post[n] !== undefined) {
      FEJL('R4', sti, `"${n}" staar sammen med tilstanden "${kanonisk}". En tilstand er ikke et ` +
        `tal og maa ikke baere ${n} — enten er tallet der, eller ogsaa er det ikke`);
    }
  }
  if (spec.kraeverVedLast && post.ved_last !== undefined) {
    FEJL('R10', sti, `"ved_last" staar paa en post uden tal. En lastbetingelse uden driftstid ` +
      `betinger ingenting`);
  }
}

/* ----------------------------------------------------------- R16 anvendelse */

/**
 * R16 — producentens egen anvendelsesinddeling.
 *
 * Hele pointen med feltet er, at det ikke kan baere vores mening. Derfor er
 * kravet omvendt af de andre felters: en VAERDI koster et ordret citat plus en
 * kilde. Kan producenten ikke citeres, er "ikke_oplyst" ikke en mangel — det er
 * det rigtige svar, og saa maa der til gengaeld ikke staa et citat, der giver
 * indtryk af, at kategorien var producentens.
 *
 * Uden det her krav ville feltet vaere praecis den redaktionelle inddeling,
 * CLAUDE.md begraensning 6 forbyder: en konklusion skrevet om til en kategori.
 */
function tjekAnvendelse(a, egenSlug) {
  const sti = 'anvendelse';
  if (a === undefined) return;                       // valgfri topnoegle

  // Bar tilstand: "anvendelse: ikke_oplyst" uden kort. Tilladt og entydig.
  if (typeof a === 'string') {
    const k = tilstandAf(a);
    if (k === 'ikke_oplyst') {
      if (a !== 'ikke_oplyst') ADVARSEL('R16', sti, `skriv tilstanden med understreg: "ikke_oplyst"`);
      return;
    }
    FEJL('R16', sti, `${JSON.stringify(a)} er hverken "ikke_oplyst" eller et kort med ` +
      `"vaerdi", "citat" og "kilde"`);
    return;
  }
  if (!erPost(a)) {
    FEJL('R16', sti, `"anvendelse" skal vaere et kort eller tilstanden "ikke_oplyst", fik ` +
      `${JSON.stringify(a)}`);
    return;
  }

  for (const n of Object.keys(a)) {
    if (!ANVENDELSE_NOEGLER.has(n)) {
      FEJL('R16', sti, `ukendt noegle "${n}" i anvendelsesposten. Tilladte: ` +
        `${[...ANVENDELSE_NOEGLER].join(', ')}`);
    }
  }

  // R21 — spor/cjkui, 1. sep 2026: "citat_ordlyd"/"note_ordlyd" er
  // producentens ordrette, ikke-danske formulering, flyttet ud af
  // "citat"/"note" saa siden bliver ren for kinesiske tegn uden at
  // kildebeviset gaar tabt. "citat_ordlyd" foelger "citat"s egen form: staar
  // "citat" som en liste, skal "citat_ordlyd" vaere samme laengde liste,
  // samme raekkefoelge ("" hvor det enkelte citat ikke havde en
  // fremmedsproget ordlyd) — ellers kan ordlyden ikke fores tilbage til det
  // rigtige citat.
  if (a.note_ordlyd !== undefined) {
    if (typeof a.note_ordlyd !== 'string' || a.note_ordlyd.trim() === '') {
      FEJL('R21', sti, `"note_ordlyd" skal vaere en ikke-tom tekst — producentens ordrette ` +
        `kildeformulering — fik ${JSON.stringify(a.note_ordlyd)}`);
    } else if (typeof a.note !== 'string' || a.note.trim() === '') {
      FEJL('R21', sti, `"note_ordlyd" staar uden "note" — ordlyden hoerer til en note, ` +
        `laeseren ser, og uden den note er der intet, den er en ordlyd til`);
    }
  }
  if (a.citat_ordlyd !== undefined) {
    const citatErListe = Array.isArray(a.citat);
    if (citatErListe) {
      if (!Array.isArray(a.citat_ordlyd) || a.citat_ordlyd.length !== a.citat.length
          || a.citat_ordlyd.some((x) => typeof x !== 'string')) {
        FEJL('R21', sti, `"citat_ordlyd" skal vaere en liste af tekster med samme laengde som ` +
          `"citat" (${a.citat.length}) — "" hvor citatet ikke havde en fremmedsproget ordlyd — ` +
          `fik ${JSON.stringify(a.citat_ordlyd)}`);
      }
    } else if (typeof a.citat_ordlyd !== 'string' || a.citat_ordlyd.trim() === '') {
      FEJL('R21', sti, `"citat_ordlyd" skal vaere en ikke-tom tekst — producentens ordrette ` +
        `kildeformulering — fik ${JSON.stringify(a.citat_ordlyd)}`);
    }
  }

  // R22 — spor/i18nfelt, 2. sep 2026: "note_i18n" er soesterfeltet til
  // "note" (anvendelsens egen). Placeret her, foer vaerdi-tjekket, af samme
  // grund som citat_ordlyd/note_ordlyd ovenfor: en strukturel form-regel,
  // uafhaengig af om posten i oevrigt er ikke_oplyst.
  tjekI18nOverbygning(sti, a, 'note', 'note_i18n');

  // 1. Vaerdien: én kategori, en liste af dem, eller tilstanden ikke_oplyst.
  const raa = a.vaerdi;
  if (raa === undefined) { FEJL('R16', sti, `posten mangler "vaerdi"`); return; }
  const liste = Array.isArray(raa) ? raa : [raa];
  if (!liste.length) { FEJL('R16', sti, `"vaerdi" er en tom liste`); return; }
  if (liste.some((v) => typeof v !== 'string' || v.trim() === '')) {
    FEJL('R16', sti, `"vaerdi" skal vaere kategorinavne som tekst, fik ${JSON.stringify(raa)}`);
    return;
  }
  const erIkkeOplyst = liste.length === 1 && tilstandAf(liste[0]) === 'ikke_oplyst';
  if (!erIkkeOplyst) {
    for (const v of liste) {
      if (!ANVENDELSE_VAERDIER.includes(v)) {
        FEJL('R16', sti, `${JSON.stringify(v)} er ikke en gyldig anvendelse. ` +
          `Gyldige: ${ANVENDELSE_VAERDIER.join(' | ')} | ikke_oplyst` +
          (v.includes(' ') ? ' (skriv den med understreg, ikke mellemrum)' : ''));
      }
    }
    if (new Set(liste).size !== liste.length) {
      FEJL('R16', sti, `samme anvendelse staar to gange i listen`);
    }
  }

  // 2. ikke_oplyst maa ikke baere et citat. Ellers ville en post kunne se
  //    kildebelagt ud og alligevel ikke have en kategori — eller omvendt.
  if (erIkkeOplyst) {
    if (a.citat !== undefined) {
      FEJL('R16', sti, `"citat" staar sammen med "ikke_oplyst". Kan producenten citeres, ` +
        `hoerer citatet til en kategori; kan den ikke, hoerer citatet ingen steder`);
    }
    if (a.arvet_fra !== undefined) {
      FEJL('R17', sti, `"arvet_fra" staar sammen med "ikke_oplyst". Der er ikke arvet ` +
        `nogen kategori, saa der er heller ingen arv at maerke`);
    }
    // kilde/hentet/note MAA staa: "vi kiggede her, og producenten sagde intet"
    // er en anden og mere brugbar oplysning end tavshed.
    if (a.kilde !== undefined) tjekKilde(sti, a);
    if (a.hentet !== undefined) tjekHentet(sti, a);
    return;
  }

  // 2b. R17 — arv, den del der kan afgoeres i filen selv. Resten (findes moderen?
  //     har moderen selv et citat? er kategorien en delmaengde af moderens?)
  //     kan kun afgoeres paa tvaers af filer og staar i tjekArv.
  if (a.arvet_fra !== undefined) {
    if (typeof a.arvet_fra !== 'string' || a.arvet_fra.trim() === '') {
      FEJL('R17', sti, `"arvet_fra" skal vaere moderens slug som tekst, fik ` +
        `${JSON.stringify(a.arvet_fra)}`);
    } else if (a.arvet_fra === egenSlug) {
      FEJL('R17', sti, `"arvet_fra: ${a.arvet_fra}" peger paa robotten selv. En post kan ` +
        `ikke arve sin egen kategori`);
    }
  }

  // 3. En kategori koster et ordret citat. Det er hele feltets eksistensberettigelse.
  const citater = Array.isArray(a.citat) ? a.citat : [a.citat];
  if (a.citat === undefined) {
    FEJL('R16', sti, `"citat" mangler. Uden producentens eget ord er kategorien vores ` +
      `mening, og saa skal vaerdien vaere "ikke_oplyst" (CLAUDE.md begraensning 6)`);
  } else if (!citater.length || citater.some((c) => typeof c !== 'string' || c.trim() === '')) {
    FEJL('R16', sti, `"citat" skal vaere producentens ord ordret - én tekst eller en liste ` +
      `af tekster, fik ${JSON.stringify(a.citat)}`);
  }
  tjekKilde(sti, a);
  tjekHentet(sti, a);
}

/* ------------------------------------------------------------- R17 arv */

/** Anvendelsesposten som kort, uanset om YAML'en skrev kort eller bar tilstand. */
function anvKort(a) {
  if (a === undefined) return null;
  if (typeof a === 'string') return { vaerdi: a };
  return erPost(a) ? a : null;
}
const somListe = (v) => (v === undefined ? [] : (Array.isArray(v) ? v : [v]));
const erKunIkkeOplyst = (l) => l.length === 1 && tilstandAf(l[0]) === 'ikke_oplyst';

/**
 * R17 — arv af anvendelse fra grundmodel til variant (L23, 21. aug 2026).
 *
 * En variant MAA arve moderens kategori, men saa skal posten baere `arvet_fra`
 * og vise moderens citat. Arven er vores slutning om, at de to er samme maskine
 * i to udgaver — og en slutning, der ikke er maerket, er ikke til at skelne fra
 * en oplysning. Det er den samme grund, R16 findes af.
 *
 * Reglerne er strengere end R16, ikke mildere. En arv skal kunne foelges hele
 * vejen tilbage til et ord, producenten har skrevet:
 *   1. moderens slug skal findes
 *   2. moderen skal selv have en kategori med citat — man kan ikke arve tavshed
 *   3. moderen maa ikke selv have arvet: en kaede vasker citatet et led laengere
 *      vaek fra producenten for hvert trin
 *   4. variantens kategorier skal vaere en DELMAENGDE af moderens. Ellers kunne
 *      "arv" smugle en kategori ind, moderen aldrig fik
 *   5. variantens citater skal staa ordret hos moderen. Det er moderens citat,
 *      der vises — ikke et nyt, der ligner
 *   6. kilden skal vaere moderens. Citatet blev laest der, ikke paa variantens side
 */
export function tjekArv(robotter, dataMappe) {
  const efterSlug = new Map();
  for (const r of robotter) if (typeof r.slug === 'string') efterSlug.set(r.slug, r);

  /** Moderen kan ligge uden for de filer, der lige nu valideres. Slugget skal
   *  findes i datasaettet — ikke i argumentlisten. Derfor kigges der ogsaa paa disk. */
  const fraDisk = (slug) => {
    if (!dataMappe) return null;
    for (const e of ['.yaml', '.yml']) {
      const p = path.join(dataMappe, slug + e);
      if (!fs.existsSync(p)) continue;
      try { return normaliserRobot(parseYaml(fs.readFileSync(p, 'utf8'), p)); } catch { return null; }
    }
    return null;
  };

  for (const barn of robotter) {
    const a = anvKort(barn.anvendelse);
    if (!a || typeof a.arvet_fra !== 'string' || a.arvet_fra.trim() === '') continue;
    robotINavn = barn.slug || '(ukendt robot)';
    const sti = 'anvendelse';
    const moderSlug = a.arvet_fra;
    if (moderSlug === barn.slug) continue;             // allerede fanget i tjekAnvendelse

    const mor = efterSlug.get(moderSlug) ?? fraDisk(moderSlug);
    if (!mor) {
      FEJL('R17', sti, `"arvet_fra: ${moderSlug}" peger paa en robot, der ikke findes. ` +
        `En arv fra en post, ingen kan slaa op, er ikke en arv`);
      continue;
    }

    const ma = anvKort(mor.anvendelse);
    const morVaerdier = ma ? somListe(ma.vaerdi) : [];
    if (!ma || !morVaerdier.length || erKunIkkeOplyst(morVaerdier)) {
      FEJL('R17', sti, `"${moderSlug}" har selv ingen kategori (${ma ? 'ikke_oplyst' : 'ingen anvendelse'}). ` +
        `Tavshed kan ikke arves`);
      continue;
    }
    if (ma.citat === undefined) {
      FEJL('R17', sti, `"${moderSlug}" har ingen "citat". Arven ville give varianten en ` +
        `kategori, ingen producent har sagt`);
      continue;
    }
    if (ma.arvet_fra !== undefined) {
      FEJL('R17', sti, `"${moderSlug}" har selv arvet sin kategori. Arv i kaede flytter ` +
        `citatet et led laengere vaek fra producenten for hvert trin — arv fra kilden i stedet`);
      continue;
    }

    const barnVaerdier = somListe(a.vaerdi);
    const morSaet = new Set(morVaerdier);
    const ekstra = barnVaerdier.filter((v) => !morSaet.has(v));
    if (ekstra.length) {
      FEJL('R17', sti, `${JSON.stringify(ekstra)} staar ikke paa "${moderSlug}". En arv kan ` +
        `kun give varianten det, moderen selv har — ellers er den nye kategori vores`);
    }

    const morCitater = new Set(somListe(ma.citat));
    const fremmede = somListe(a.citat).filter((c) => !morCitater.has(c));
    if (fremmede.length) {
      FEJL('R17', sti, `citatet staar ikke ordret paa "${moderSlug}": ` +
        `${JSON.stringify(fremmede[0].slice(0, 60))}. En arv viser MODERENS citat`);
    }

    if (a.kilde !== ma.kilde) {
      FEJL('R17', sti, `"kilde" er ${JSON.stringify(a.kilde ?? null)}, men citatet blev laest ` +
        `paa ${JSON.stringify(ma.kilde ?? null)} (${moderSlug}). Kilden skal foelge citatet; ` +
        `variantens egen side hoerer til i "note"`);
    }
  }
}

/* ------------------------------------------------------------- R18 billede */

/**
 * R18 — robottens billede.
 *
 * Tre ting skal vaere sande, foer et billede maa naa en side:
 *
 *   1. Filen FINDES i assets/. En sti til en fil, ingen har lagt, giver et
 *      brudt billede i browseren og intet sted et rigtigt fejlsignal. Det er
 *      den samme fejl som en pladsholder, der overlever til lancering.
 *   2. Ophavet staar skrevet. Uden det kan hverken siden eller et menneske se,
 *      om vi viser eget arbejde eller fabrikantens materiale — og S1 forbyder
 *      publicering med det sidste.
 *   3. Stien peger ind i assets/ og ingen andre steder. media/ er fabrikantens
 *      ophavsret og maa aldrig indgaa i et byg (CLAUDE.md, mappestruktur).
 *      Bygget haandhaever det ved kun at kopiere fra assets/; her haandhaeves
 *      det ogsaa i data, saa spaerringen ikke kun findes ét sted.
 *
 * Feltet er valgfrit. En robot uden `billede:` er ikke en fejl — den faar den
 * tomme plade med en grund skrevet ud, og det er den aerlige tilstand.
 */
function tjekBillede(b, egenSlug) {
  const sti = 'billede';
  if (b === undefined) return;                 // ingen billede = den tomme plade

  if (typeof b === 'string') {
    FEJL('R18', sti, `"billede" skal vaere et kort med "fil" og "ophav", ikke en tekst ` +
      `(${JSON.stringify(b)}). Der findes ingen tilstand "billede: ikke_oplyst" — ` +
      `udelad noeglen, saa staar den tomme plade`);
    return;
  }
  if (!erPost(b)) {
    FEJL('R18', sti, `"billede" skal vaere et kort med mindst "fil" og "ophav", fik ` +
      `${JSON.stringify(b)}`);
    return;
  }

  for (const n of Object.keys(b)) {
    if (!BILLEDE_NOEGLER.has(n)) {
      FEJL('R18', sti, `ukendt noegle "${n}" i billedposten. Tilladte: ` +
        `${[...BILLEDE_NOEGLER].join(', ')}`);
    }
  }

  /* --- ophavet. Uden det ved siden ikke, hvad den viser. --- */
  const ophav = b.ophav;
  if (ophav === undefined) {
    FEJL('R18', `${sti}.ophav`, `billedet mangler "ophav". Uden det kan siden ikke skelne ` +
      `vores eget arbejde fra fabrikantens materiale, og S1 forbyder publicering med det ` +
      `sidste. Gyldige: ${BILLEDE_OPHAV.join(' | ')}`);
  } else if (!BILLEDE_OPHAV.includes(ophav)) {
    FEJL('R18', `${sti}.ophav`, `${JSON.stringify(ophav)} er ikke et gyldigt ophav. ` +
      `Gyldige: ${BILLEDE_OPHAV.join(' | ')}`);
  }

  /* --- filen. Findes den ikke, er stien en paastand. --- */
  const fil = b.fil;
  if (typeof fil !== 'string' || fil.trim() === '') {
    FEJL('R18', `${sti}.fil`, `"fil" mangler eller er tom. Den skal vaere stien RELATIV TIL ` +
      `assets/, fx "silhuetter/unitree-b2-staaende.svg"`);
  } else {
    let ok = true;
    if (fil !== fil.trim()) {
      FEJL('R18', `${sti}.fil`, `stien har mellemrum i hver ende: ${JSON.stringify(fil)}`); ok = false;
    }
    if (fil.includes('\\')) {
      FEJL('R18', `${sti}.fil`, `stien bruger omvendt skraastreg: ${JSON.stringify(fil)}. ` +
        `Skriv den med "/" — to stavemaader af den samme fil er to filer for et byg`); ok = false;
    }
    if (fil.startsWith('/') || /^[a-zA-Z]:/.test(fil) || /^[a-z]+:\/\//i.test(fil)) {
      FEJL('R18', `${sti}.fil`, `stien er absolut eller en URL: ${JSON.stringify(fil)}. ` +
        `Den skal vaere relativ til assets/`); ok = false;
    }
    if (fil.split('/').includes('..')) {
      FEJL('R18', `${sti}.fil`, `stien gaar op ad mappetraeet: ${JSON.stringify(fil)}. ` +
        `Et billede maa ikke ligge uden for assets/`); ok = false;
    }
    if (/^assets\//.test(fil)) {
      FEJL('R18', `${sti}.fil`, `stien begynder med "assets/": ${JSON.stringify(fil)}. ` +
        `Den er ALLEREDE relativ til assets/ — skriv "${fil.replace(/^assets\//, '')}"`); ok = false;
    }
    if (/(^|\/)media(\/|$)/.test(fil)) {
      FEJL('R18', `${sti}.fil`, `stien peger paa media/: ${JSON.stringify(fil)}. media/ er ` +
        `fabrikantens materiale og indgaar ALDRIG i et byg (CLAUDE.md, mappestruktur). ` +
        `Skal billedet med, skal filen ligge i assets/`); ok = false;
    }
    const mappe = fil.split('/')[0];
    if (ok && !BILLEDMAPPER.includes(mappe)) {
      FEJL('R18', `${sti}.fil`, `"${mappe}/" er ikke en billedmappe. Bygget kopierer fra ` +
        `${BILLEDMAPPER.map((m) => `assets/${m}/`).join(', ')} — en fil et andet sted naar ` +
        `aldrig dist/`); ok = false;
    }
    const endelse = path.extname(fil).toLowerCase();
    if (ok && !BILLEDE_ENDELSER.includes(endelse)) {
      FEJL('R18', `${sti}.fil`, `endelsen "${endelse || '(ingen)'}" er ikke et billedformat, ` +
        `bygget kopierer. Gyldige: ${BILLEDE_ENDELSER.join(', ')}`); ok = false;
    }
    if (ok) {
      const fuld = path.join(cfg.assets, fil);
      if (!fs.existsSync(fuld)) {
        FEJL('R18', `${sti}.fil`, `filen findes ikke: assets/${fil}. En sti til en fil, ingen ` +
          `har lagt, giver et brudt billede i browseren og intet fejlsignal her`);
      } else if (!fs.statSync(fuld).isFile()) {
        FEJL('R18', `${sti}.fil`, `assets/${fil} er ikke en fil`);
      }
    }
  }

  /* --- kilden. Samme krav som til et tal, af samme grund. --- */
  const kraeverKilde = BILLEDE_KRAEVER_KILDE.has(ophav);
  if (b.kilde === undefined) {
    if (kraeverKilde) {
      FEJL('R18', `${sti}.kilde`, `ophavet "${ophav}" kraever "kilde". ` +
        (ophav === 'silhuet'
          ? `En silhuet er en gengivelse af MAALTAL, og et maal uden kilde er ikke indsamlet, ` +
            `det er husket (assets/silhuetter/LÆSMIG.md, regel 5)`
          : `Et fabrikantbillede skal kunne foelges tilbage til den side, det blev hentet fra`));
    }
  } else {
    tjekKilde(sti, b);          // R6: URL og kildetype-formen
    tjekHentet(sti, b);         // R7: hentedato, saa posten kan foraeldes
  }
  if (b.hentet !== undefined && b.kilde === undefined) {
    FEJL('R18', `${sti}.hentet`, `"hentet" staar uden "kilde". En hentedato uden et sted at ` +
      `hente fra daterer ingenting`);
  }

  /* --- teksterne. Tomme strenge er huller, der ligner indhold. --- */

  /* "note" er sprogneutral (redaktionel forklaring, ikke brugertekst) og
     forbliver en almindelig streng. */
  if (b.note !== undefined && (typeof b.note !== 'string' || b.note.trim() === '')) {
    FEJL('R18', `${sti}.note`, `"note" skal vaere en ikke-tom tekst, fik ${JSON.stringify(b.note)}`);
  }

  // R22 — spor/i18nfelt, 2. sep 2026: "note_i18n" er soesterfeltet til
  // billedets egen "note".
  tjekI18nOverbygning(sti, b, 'note', 'note_i18n');

  /* "alt" er en skaermlaeser-tekst og derfor SPROGKORTLAGT siden spor/alt
     (1. sep 2026, R18): { da: "...", en: "..." } - et nyt sprog er en noegle
     i SPROG, ikke et nyt felt (CLAUDE.md's arkitekturregel). Maalt samme dag:
     94 engelske sider viste dansk billedtekst, fordi den gamle streng-form
     lod dataskriverens danske tekst vinde paa alle sprog. Staar "alt"
     overhovedet, skal DERFOR alle sprog i SPROG vaere udfyldt - en halv
     oversaettelse ville stadig lade ét sprogs tekst laekke ud paa et andet
     sprogs side. */
  if (b.alt !== undefined) {
    if (!erPost(b.alt)) {
      FEJL('R18', `${sti}.alt`, `"alt" skal vaere et sprogkort med noeglerne ${SPROG.join('/')}` +
        `, ikke ${JSON.stringify(b.alt)}. Et enkelt sprog kan ikke laengere staa alene - se spor/alt`);
    } else {
      for (const n of Object.keys(b.alt)) {
        if (!SPROG.includes(n)) {
          FEJL('R18', `${sti}.alt`, `ukendt sprog "${n}" i "alt". Gyldige: ${SPROG.join(', ')}`);
        }
      }
      for (const sprog of SPROG) {
        const v = b.alt[sprog];
        if (typeof v !== 'string' || v.trim() === '') {
          FEJL('R18', `${sti}.alt.${sprog}`, `"alt" mangler sproget "${sprog}" eller det er tomt. ` +
            `Staar "alt" overhovedet, skal ALLE sprog vaere udfyldt - ellers laekker ét sprogs ` +
            `tekst ud paa et andet sprogs side (det var netop denne fejl, spor/alt lukkede)`);
        }
      }
    }
  }
  if (b.pos !== undefined && (typeof b.pos !== 'string' || b.pos.trim() === '')) {
    FEJL('R18', `${sti}.pos`, `"pos" er en object-position som tekst, fx "50% 40%"`);
  }
  if (b.plade !== undefined && typeof b.plade !== 'boolean') {
    FEJL('R18', `${sti}.plade`, `"plade" skal vaere ja eller nej, fik ${JSON.stringify(b.plade)}`);
  }

  /* --- delt fil (L28). Maerket paa billedet siger, at filen deles. --- */
  if (b.delt_med !== undefined) {
    if (typeof b.delt_med !== 'string' || b.delt_med.trim() === '') {
      FEJL('R18', `${sti}.delt_med`, `"delt_med" skal vaere den anden robots slug som tekst, ` +
        `fik ${JSON.stringify(b.delt_med)}`);
    } else if (b.delt_med === egenSlug) {
      FEJL('R18', `${sti}.delt_med`, `"delt_med" peger paa robotten selv. En fil, der kun ` +
        `bruges ét sted, er ikke delt`);
    }
  }
}

/**
 * R18, den del der foerst kan afgoeres, naar alle filer er laest: peger
 * `delt_med` paa en robot, der findes? Uden opslaget ville en tastefejl give
 * et maerke, der siger "delt med" og naevner en maskine, kataloget ikke har.
 */
export function tjekBilledeDelt(robotter) {
  const kendte = new Set(robotter.map((r) => r.slug).filter(Boolean));
  for (const r of robotter) {
    const d = r.billede?.delt_med;
    if (typeof d !== 'string' || d === '' || kendte.has(d)) continue;
    robotINavn = r.slug || '(ukendt robot)';
    FEJL('R18', 'billede.delt_med', `"${d}" er ikke en robot i datasaettet. Maerket paa ` +
      `billedet ville naevne en maskine, kataloget ikke har`);
  }
}

/* --------------------------------------------------------------- taethed */

/**
 * Et felt taeller som udfyldt, naar det baerer en vaerdi med kilde.
 * `nej` og `0` er oplysninger og TAELLER MED. `ikke_oplyst` og `kun_billede` goer ikke.
 * D4: taeller lidar/kameraer, naar producenten kun oplyser type? Parameter.
 */
export function erUdfyldt(navn, vaerdi, typeUdenModel) {
  if (vaerdi === undefined || vaerdi === null) return false;
  if (typeof vaerdi === 'string') return tilstandAf(vaerdi) === 'nej';
  if (!erPost(vaerdi)) return false;
  // Tilstanden med herkomst taeller praecis som den bare tilstand: et dokumenteret
  // "nej" er en oplysning, et dokumenteret "ikke oplyst" er stadig ingen oplysning.
  const t = tilstandAf(vaerdi.vaerdi);
  if (t) return t === 'nej';
  if (vaerdi.vaerdi === undefined && vaerdi.min === undefined) return false;
  if (FELTER[navn]?.d4 && !typeUdenModel) {
    // "3D LiDAR x1" er en type uden model. Uden et fabrikat eller en opremsning er
    // der ingen model at tale om — indtil D4 er lukket, taeller det ikke med.
    const t = String(vaerdi.vaerdi ?? '');
    if (!/[A-Z][a-z]+\s*[A-Z0-9]/.test(t) && !t.includes(',')) return false;
  }
  return true;
}

export function taethed(robot, naevner, typeUdenModel) {
  const felter = robot.felter || {};
  let udfyldt = 0;
  for (const navn of FELTNAVNE) if (erUdfyldt(navn, felter[navn], typeUdenModel)) udfyldt++;
  return { udfyldt, naevner, pct: Math.round(udfyldt / naevner * 100) };
}

/* ---------------------------------------------------------------- robotten */

export function tjekRobot(doc, fil) {
  if (!erPost(doc)) { FEJL('R1', '(rod)', `filen er ikke et YAML-kort`); return null; }
  robotINavn = doc.slug || path.basename(fil);

  for (const n of IDENTITET_PAAKRAEVET) {
    if (typeof doc[n] !== 'string' || doc[n].trim() === '') {
      FEJL('R1', n, `identitetsfeltet mangler eller er tomt`);
    }
  }
  if (doc.status !== undefined && !STATUS_VAERDIER.includes(doc.status)) {
    FEJL('R1', 'status', `${JSON.stringify(doc.status)} er ikke en gyldig status. ` +
      `Gyldige: ${STATUS_VAERDIER.join(' | ')}` +
      (typeof doc.status === 'string' && doc.status.includes(' ')
        ? ' (skriv den med understreg, ikke mellemrum)' : ''));
  }
  if (doc.fremdrift !== undefined && !FREMDRIFT_VAERDIER.includes(doc.fremdrift)) {
    FEJL('R1', 'fremdrift', `${JSON.stringify(doc.fremdrift)} er ikke en gyldig fremdrift. ` +
      `Gyldige: ${FREMDRIFT_VAERDIER.join(' | ')}` +
      (typeof doc.fremdrift === 'string' && doc.fremdrift.includes(' ')
        ? ' (skriv den med understreg, ikke mellemrum)' : ''));
  }
  const forventetSlug = path.basename(fil).replace(/\.ya?ml$/, '');
  if (typeof doc.slug === 'string' && doc.slug !== forventetSlug) {
    FEJL('R14', 'slug', `slug "${doc.slug}" passer ikke til filnavnet "${path.basename(fil)}" — ` +
      `URL'en bygges af slug, saa de to skal foelges ad`);
  }
  const kendte = new Set([...IDENTITET_PAAKRAEVET, ...IDENTITET_VALGFRI, 'felter']);
  for (const n of Object.keys(doc)) {
    if (!kendte.has(n)) FEJL('R1', n, `ukendt topnoegle. Tilladte: ${[...kendte].join(', ')}`);
  }

  // R15 — variantlisten. Naar den staar, er den facitlisten for felternes
  // "varianter:"-blokke, og den skal derfor selv vaere en liste af navne.
  let kendteVarianter = null;
  if (doc.varianter !== undefined) {
    if (!Array.isArray(doc.varianter) || !doc.varianter.length
        || doc.varianter.some((v) => typeof v !== 'string' || v.trim() === '')) {
      FEJL('R15', 'varianter', `topnoeglen "varianter" skal vaere en ikke-tom liste af ` +
        `variantnavne, fx [AIR, PRO, X, EDU] — fik ${JSON.stringify(doc.varianter)}`);
    } else {
      kendteVarianter = new Set(doc.varianter);
      if (kendteVarianter.size !== doc.varianter.length) {
        FEJL('R15', 'varianter', `samme variantnavn staar to gange i listen`);
      }
    }
  }
  if (doc.noter !== undefined) {
    const n = doc.noter;
    const ok = typeof n === 'string'
      ? n.trim() !== ''
      : Array.isArray(n) && n.length > 0 && n.every((x) => typeof x === 'string' && x.trim() !== '');
    if (!ok) FEJL('R1', 'noter', `"noter" skal vaere en tekst eller en liste af tekster`);
    else if (typeof n === 'string') tjekInterntSprog('R19', 'noter', n);
    else n.forEach((tekst, i) => tjekInterntSprog('R19', `noter[${i}]`, tekst));
  }
  // R21 — spor/cjkui, 1. sep 2026: "noter_ordlyd" er en PARALLEL liste til
  // "noter" (samme mekanik som anvendelse.citat_ordlyd ovenfor) — producentens
  // ordrette, ikke-danske formulering for hver note, "" hvor den enkelte note
  // ikke havde en. "noter" renderes ordret i robot.mjs' noterBlok(), saa den
  // skal vaere ren dansk; ordlyden hoerer i soesterfeltet, som ingen skabelon
  // laeser.
  if (doc.noter_ordlyd !== undefined) {
    const no = doc.noter_ordlyd;
    const nListe = doc.noter === undefined ? [] : (Array.isArray(doc.noter) ? doc.noter : [doc.noter]);
    if (!Array.isArray(no) || no.some((x) => typeof x !== 'string')) {
      FEJL('R21', 'noter_ordlyd', `"noter_ordlyd" skal vaere en liste af tekster — "" hvor noten ` +
        `ikke havde en fremmedsproget ordlyd — fik ${JSON.stringify(no)}`);
    } else if (no.length !== nListe.length) {
      FEJL('R21', 'noter_ordlyd', `"noter_ordlyd" har ${no.length} indgange, men "noter" har ` +
        `${nListe.length} — de to skal foelges ad, position for position`);
    }
  }

  // R16 — producentens egen anvendelsesinddeling. Ligger uden for "felter" med
  // vilje: den taeller ikke i specifikationstaetheden, fordi den ikke er en
  // specifikation, producenten kunne have oplyst og lod vaere.
  tjekAnvendelse(doc.anvendelse, doc.slug);

  // R18 — billedet. Ligger ogsaa uden for "felter": et billede er ikke en
  // specifikation, producenten oplyser eller lader vaere med at oplyse, og maa
  // derfor ikke flytte naevneren i specifikationstaetheden (D7 er aaben).
  tjekBillede(doc.billede, doc.slug);

  const felter = doc.felter;
  if (felter === undefined || felter === null) { FEJL('R1', 'felter', `"felter" mangler`); return null; }
  if (!erPost(felter)) { FEJL('R1', 'felter', `"felter" er ikke et kort`); return null; }

  for (const [navn, vaerdi] of Object.entries(felter)) {
    const spec = FELTER[navn];
    if (!spec) {
      FEJL('R2', navn, `ukendt felt. Skemaet har ${FELTNAVNE.length} felter: ${FELTNAVNE.join(', ')}`);
      continue;
    }
    tjekFelt(navn, vaerdi, spec, kendteVarianter);
  }
  return doc;
}

/* --------------------------------------------------------------- selvtest */

const SELVTEST = [
  ['&gt; 40 kg holder operatoren', () => findTal(normaliser('&gt; 40 kg'))[0].operator === '>'],
  ['U+00A0 mellem tal og enhed', () => {
    const s = '1.5' + String.fromCharCode(0x00A0) + 'm/s';
    const t = findTal(normaliser(s))[0];
    return t.tal === 1.5 && t.enhed === 'm/s';
  }],
  ['fuldbredde-tegnet for stoerre end holder operatoren', () => findTal(normaliser('\uFF1E 6m/s'))[0].operator === '>'],
  ['20~25cm er et interval, ikke en operator', () => {
    const t = findTal(normaliser('20~25cm'));
    return t.length === 2 && t[1].separator === true && t[0].operator === null;
  }],
  ['~60kg er en operator, ikke et interval', () => findTal(normaliser('~60kg'))[0].operator === '~'],
  ['&ge; bliver til >=', () => findTal(normaliser('&ge; 120kg'))[0].operator === '>='],
  ['tabulator i YAML fejler synligt', () => {
    try { parseYaml('a:\n\tb: 1'); return false; } catch (e) { return e instanceof YamlFejl; }
  }],
  ['YAML 1.1-boolean fejler synligt', () => {
    try { parseYaml('ros2: no'); return false; } catch (e) { return e instanceof YamlFejl; }
  }],
  ['flow-kort laeses', () => parseYaml('a: { vaerdi: 20, enhed: kg }').a.enhed === 'kg'],
  ['Ghost: 2.4 m/s mod 4.9 mph afviger over 2 %', () => {
    const a = tilBasis(2.4, 'm/s'), b = tilBasis(4.9, 'mph');
    return Math.abs(a - b) / b * 100 > 2;
  }],

  // Normaliseringen. Den er det sted, hvor validatoren og generatoren enes om,
  // hvad filen betyder - saa den skal bevises, ikke bare bruges.
  ['"vaerdi: ja" bliver til true og "vaerdi: nej" til false paa et ja/nej-felt', () => {
    const d = normaliserRobot(parseYaml('slug: x\nfelter:\n  ros2:\n    vaerdi: ja\n  hot_swap:\n    vaerdi: nej\n'));
    return d.felter.ros2.vaerdi === true && d.felter.hot_swap.vaerdi === false;
  }],
  ['"nej" paa et listefelt er stadig tilstanden nej, ikke en false', () => {
    const d = normaliserRobot(parseYaml('slug: x\nfelter:\n  dataporte:\n    vaerdi: nej\n'));
    return d.felter.dataporte.vaerdi === 'nej';
  }],
  ['"C" er Celsius i et temperaturfelt og stadig ukendt i et massefelt', () => {
    const d = normaliserRobot(parseYaml(
      'slug: x\nfelter:\n  temp_min:\n    vaerdi: -20\n    enhed: C\n  egenvaegt:\n    vaerdi: 60\n    enhed: C\n'));
    return d.felter.temp_min.enhed === '°C' && d.felter.egenvaegt.enhed === 'C';
  }],
  ['vaerdi_min/vaerdi_maks normaliseres til min/maks', () => {
    const d = normaliserRobot(parseYaml(
      'slug: x\nfelter:\n  hoejde:\n    vaerdi_min: 13\n    vaerdi_maks: 50\n    enhed: cm\n'));
    const f = d.felter.hoejde;
    return f.min === 13 && f.maks === 50 && f.vaerdi_min === undefined && f.vaerdi_maks === undefined;
  }],
  ['staar begge stavemaader, roeres ingen af dem — R11 skal kunne se fejlen', () => {
    const d = normaliserRobot(parseYaml(
      'slug: x\nfelter:\n  hoejde:\n    vaerdi_min: 13\n    min: 20\n    vaerdi_maks: 50\n    enhed: cm\n'));
    return d.felter.hoejde.vaerdi_min === 13 && d.felter.hoejde.min === 20;
  }],
  ['"A2-W PRO" er en gyldig noegle i en varianter-blok', () => {
    const d = parseYaml('varianter: [A2-W, A2-W PRO]\nfelter:\n  ip_klasse:\n    varianter:\n      A2-W PRO: "IP56-IP67"\n');
    return d.felter.ip_klasse.varianter['A2-W PRO'] === 'IP56-IP67' && d.varianter[1] === 'A2-W PRO';
  }],
  // L22 og L27. Den syvende kategori og maengde-egenskaben er begge beslutninger,
  // ikke smagssager - de skal kunne fejle synligt, hvis nogen ruller dem tilbage.
  ['sikkerhed_overvaagning er den syvende tilladte anvendelse (L22)',
    () => ANVENDELSE_VAERDIER.includes('sikkerhed_overvaagning') && ANVENDELSE_VAERDIER.length === 7],
  ['anvendelse er en usorteret maengde: to raekkefoelger giver samme kanoniske orden (L27)', () => {
    const a = sorterAnvendelse(['logistik', 'industri', 'sikkerhed_overvaagning']).join(',');
    const b = sorterAnvendelse(['sikkerhed_overvaagning', 'logistik', 'industri']).join(',');
    return a === b && a === 'industri,sikkerhed_overvaagning,logistik';
  }],
  ['sorteringen taber ikke en ukendt vaerdi - R16 skal stadig kunne fange den', () => {
    const s = sorterAnvendelse(['landbrug', 'industri']);
    return s.length === 2 && s[0] === 'industri' && s[1] === 'landbrug';
  }],

  ['haeldning i % og haeldning i grader er to dimensioner, ikke to enheder', () => {
    // 45 % ER 24,2 grader. Ligger de i samme dimension, kan tilBasis stille dem
    // op mod hinanden — og saa er producentens forbehold vekslet til vores tal.
    return ENHEDER['%'][0] === 'stigning' && ENHEDER['°'][0] === 'vinkel'
      && ENHEDER['%'][0] !== ENHEDER['°'][0];
  }],
];

function selvtest() {
  let fejlede = 0;
  for (const [navn, f] of SELVTEST) {
    let ok = false;
    try { ok = f() === true; } catch { ok = false; }
    if (!ok) fejlede++;
    console.log(`${ok ? 'ok  ' : 'FEJL'}  ${navn}`);
  }
  console.log(`\n${SELVTEST.length} selvtest, ${fejlede} fejlede.`);
  return fejlede === 0 ? 0 : 1;
}

/* ------------------------------------------------------------------- main */

export function laesFlag(argv) {
  const flag = {}, filer = [];
  for (const a of argv) {
    if (a.startsWith('--')) {
      const i = a.indexOf('=');
      if (i === -1) flag[a.slice(2)] = true;
      else flag[a.slice(2, i)] = a.slice(i + 1);
    } else filer.push(a);
  }
  return { flag, filer };
}

export function findFiler(mappe) {
  if (!fs.existsSync(mappe)) return [];
  return fs.readdirSync(mappe)
    .filter((f) => /\.ya?ml$/.test(f))
    .map((f) => path.join(mappe, f))
    .sort();
}

export function naevnereFra(flag) {
  if (flag['naevner'] === undefined) return NAEVNERE_STANDARD;
  return String(flag['naevner']).split(',').map((n) => Number(n.trim())).filter((n) => n > 0);
}

export async function main(argv) {
  const { flag, filer } = laesFlag(argv);
  if (flag['selvtest']) return selvtest();
  if (flag['imperial-tolerance'] !== undefined) cfg.imperialTolerance = Number(flag['imperial-tolerance']);
  if (flag['assets'] !== undefined) cfg.assets = path.resolve(String(flag['assets']));
  cfg.streng = Boolean(flag['streng']);

  // spor/fase3 (BRIEF-fase3.md punkt 4): databasen er STANDARD, men KUN naar
  // hverken navngivne filer PAA kommandolinjen eller --data= er givet -
  // samme "--data= BLIVER"-regel som build.mjs. Navngivne filer (`filer`,
  // fra laesFlag's positionelle argumenter) gaar UAeNDRET til den gamle vej:
  // 26 kald i tests/dele/ bruger netop den form (koerValidator([enkeltFil])),
  // og ingen af dem skal ramme databasen.
  const brugDb = !filer.length && flag['data'] === undefined;

  let maal = filer;
  let dataMappe = null;
  let dbDocs = null;
  if (brugDb) {
    try {
      dbDocs = await hentRobotter();
    } catch (e) {
      console.error(`Kunne ikke hente robotter fra databasen: ${e && e.message ? e.message : e}`);
      return 1;
    }
  } else {
    // AA183/L84: 'data/robots' fandtes her som fallback, men var dead code -
    // naar flag['data'] er undefined, er brugDb altid true (se linje 1337),
    // saa denne gren naas kun med filer.length>0, hvor dataMappe aldrig laeses
    // (arvMappe bruger filer[0], ikke dataMappe). Mappen er slettet; fallbacken
    // peger derfor ikke laengere paa noget, der findes.
    dataMappe = flag['data'] !== undefined ? path.resolve(String(flag['data'])) : null;
    if (!maal.length) {
      maal = findFiler(dataMappe);
      if (!maal.length) { console.error(`Ingen YAML-filer i ${dataMappe}.`); return 1; }
    }
  }
  // R17 skal kunne slaa en moder op, ogsaa naar kun varianten er naevnt paa
  // kommandolinjen. Moderen soeges der, hvor de navngivne filer ligger.
  // DB-vejen har ALTID alle 77 i `robotter` i forvejen (fraDisk() i tjekArv
  // er kun en reserve for et navngivet delmaengde-kald) - arvMappe er derfor
  // meningsloest og staar som null, hvilket tjekArv's fraDisk() selv haandterer.
  const arvMappe = brugDb ? null : (filer.length ? path.dirname(path.resolve(filer[0])) : dataMappe);

  const kildeAntal = brugDb ? dbDocs.length : maal.length;
  const robotter = [];
  if (brugDb) {
    for (const doc0 of dbDocs) {
      // Det syntetiske "filnavn" er IKKE en sti - kun det, tjekRobot()
      // bruger via path.basename() (R14: slug skal matche filnavnet) og
      // robotINavn-fejlmeldinger. "<slug>.yaml" er PRAECIS den streng, en
      // rigtig fil ville have haft.
      const synFil = `${doc0 && doc0.slug}.yaml`;
      robotINavn = synFil;
      let doc;
      try {
        doc = normaliserRobot(doc0);
      } catch (e) {
        if (e instanceof YamlFejl) { FEJL('R0', '(syntaks)', e.message); continue; }
        throw e;
      }
      const r = tjekRobot(doc, synFil);
      if (r) robotter.push(r);
    }
  } else {
    for (const fil of maal) {
      robotINavn = path.basename(fil);
      let doc;
      try {
        doc = normaliserRobot(parseYaml(fs.readFileSync(fil, 'utf8'), fil));
      } catch (e) {
        if (e instanceof YamlFejl) { FEJL('R0', '(syntaks)', e.message); continue; }
        throw e;
      }
      const r = tjekRobot(doc, fil);
      if (r) robotter.push(r);
    }
  }

  // R17 — arven kan foerst afgoeres, naar moderen kan slaas op.
  tjekArv(robotter, arvMappe);
  // R18 — det samme gaelder et delt billede: den anden robot skal findes.
  tjekBilledeDelt(robotter);

  for (const f of fejl) console.error(`FEJL      ${f.robot} · ${f.felt} · ${f.regel}: ${f.besked}`);
  for (const a of advarsler) console.error(`advarsel  ${a.robot} · ${a.felt} · ${a.regel}: ${a.besked}`);

  console.log(`\n${kildeAntal} fil(er) · ${fejl.length} fejl · ${advarsler.length} advarsler` +
    (cfg.streng ? ' (--streng: advarsler taeller som fejl)' : ''));

  if (flag['taethed']) skrivTaethed(robotter, flag);

  return (fejl.length + (cfg.streng ? advarsler.length : 0)) > 0 ? 1 : 0;
}

function skrivTaethed(robotter, flag) {
  // Diagnostikken viser ogsaa skemaets faktiske feltantal, saa afstanden mellem
  // de foreslaaede naevnere og virkeligheden er synlig.
  const naevnere = [...new Set([...naevnereFra(flag), FELTNAVNE.length])];
  const d4Flag = String(flag['type-uden-model'] ?? 'begge');
  const d4 = d4Flag === 'begge' ? [false, true] : [d4Flag === 'tael'];

  console.log('\nSpecifikationstaethed');
  console.log(`  Naevneren er ${FELTNAVNE.length} = skemaets feltantal (D7, lukket med L30). Den er UDLEDT,`);
  console.log('  saa taeller og naevner ikke kan skride fra hinanden igen.');
  console.log('  D4 (taeller type uden model?) staar stadig som parameter: L20 siger tael,');
  console.log('  koden defaulter til tael-ikke, og forskellen flytter 16 af 46 pladser.\n');
  const kolonner = [];
  for (const n of naevnere) for (const t of d4) kolonner.push({ n, t });
  console.log('  ' + 'robot'.padEnd(26) +
    kolonner.map((k) => `${k.n} / ${k.t ? 'D4:tael' : 'D4:tael-ikke'}`.padStart(20)).join(''));
  for (const r of robotter) {
    console.log('  ' + String(r.navn || r.slug || '?').padEnd(26) +
      kolonner.map((k) => {
        const x = taethed(r, k.n, k.t);
        return `${x.udfyldt}/${x.naevner} = ${x.pct} %`.padStart(20);
      }).join(''));
  }
  console.log('');
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('validate.mjs');
if (erHoved) {
  // main() er ASYNC siden spor/fase3 (DB-standarden, via db/hent.mjs's aegte
  // fetch()). process.exitCode (IKKE process.exit()) af samme grund som
  // build.mjs's bund og db/eksporter.mjs's: et EKSPLICIT process.exit() efter
  // en aegte fetch() crasher denne maskines node.exe v24.13.0 med en
  // libuv-assertion, exit-kode 127 - ogsaa naar kaldet lykkedes.
  main(process.argv.slice(2)).then((k) => { process.exitCode = k; }).catch((e) => {
    console.error(String(e && e.stack ? e.stack : e));
    process.exitCode = 1;
  });
}
