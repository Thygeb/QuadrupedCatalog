#!/usr/bin/env node
/**
 * tools/validate.mjs — mekanisk haandhaevelse af "opfind aldrig tal".
 *
 * Nul afhaengigheder. Ren Node, ES-moduler, egen YAML-laeser (tools/yaml.mjs).
 *
 *   node tools/validate.mjs                    validerer data/robots/*.yaml
 *   node tools/validate.mjs <fil...>           validerer navngivne filer
 *   node tools/validate.mjs --data=<mappe>     anden datamappe
 *   node tools/validate.mjs --taethed          printer ogsaa taethedstabellen
 *   node tools/validate.mjs --selvtest         koerer parserens egne testtilfaelde
 *
 * Parametre, der IKKE er laast:
 *   --naevner=29,31,33            D7: naevneren i taetheden. Standard: alle tre
 *   --type-uden-model=tael|tael-ikke|begge   D4. Standard: begge
 *   --imperial-tolerance=<pct>    Standard: 2. Graensen er max(denne, afrundingsslaek)
 *   --streng                      advarsler taeller som fejl
 *
 * Exit 0 = ingen fejl. Exit 1 = mindst én fejl; robotnavn og feltnavn staar i linjen.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  parseYaml, YamlFejl, normaliser, faelderI, findTal, kanoniskEnhed,
  ENHEDER, TYPE_ENHEDER, IMPERIALE, tilBasis, decimaler, ORD_OPERATOR, ORD_MAASKE,
} from './yaml.mjs';
import {
  FELTER, FELTNAVNE, IDENTITET_PAAKRAEVET, IDENTITET_VALGFRI, STATUS_VAERDIER,
  TILSTANDE, POST_NOEGLER, NAEVNERE_STANDARD, tilstandAf, jaNejAf, normaliserRobot,
  ANVENDELSE_VAERDIER, ANVENDELSE_NOEGLER,
} from './skema.mjs';

/* ---------------------------------------------------------------- opsamling */

const fejl = [];
const advarsler = [];
let robotINavn = '(ukendt robot)';

function FEJL(regel, felt, besked) { fejl.push({ robot: robotINavn, felt, regel, besked }); }
function ADVARSEL(regel, felt, besked) { advarsler.push({ robot: robotINavn, felt, regel, besked }); }

export const cfg = {
  imperialTolerance: 2,   // procent — prompten: afviger de mere end 2 %, skal det fanges
  streng: false,
  iDag: new Date().toISOString().slice(0, 10),
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

/** R11 — ukendte noegler i en feltpost. En tastefejl skal ikke forsvinde tavst. */
function tjekNoegler(sti, post) {
  for (const n of Object.keys(post)) {
    if (!POST_NOEGLER.has(n)) {
      FEJL('R11', sti, `ukendt noegle "${n}" i feltposten. Tilladte: ${[...POST_NOEGLER].join(', ')}`);
    }
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
function tjekAnvendelse(a) {
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
    // kilde/hentet/note MAA staa: "vi kiggede her, og producenten sagde intet"
    // er en anden og mere brugbar oplysning end tavshed.
    if (a.kilde !== undefined) tjekKilde(sti, a);
    if (a.hentet !== undefined) tjekHentet(sti, a);
    return;
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
  }

  // R16 — producentens egen anvendelsesinddeling. Ligger uden for "felter" med
  // vilje: den taeller ikke i specifikationstaetheden, fordi den ikke er en
  // specifikation, producenten kunne have oplyst og lod vaere.
  tjekAnvendelse(doc.anvendelse);

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

export function main(argv) {
  const { flag, filer } = laesFlag(argv);
  if (flag['selvtest']) return selvtest();
  if (flag['imperial-tolerance'] !== undefined) cfg.imperialTolerance = Number(flag['imperial-tolerance']);
  cfg.streng = Boolean(flag['streng']);

  let maal = filer;
  if (!maal.length) {
    const mappe = path.resolve(String(flag['data'] ?? 'data/robots'));
    maal = findFiler(mappe);
    if (!maal.length) { console.error(`Ingen YAML-filer i ${mappe}.`); return 1; }
  }

  const robotter = [];
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

  for (const f of fejl) console.error(`FEJL      ${f.robot} · ${f.felt} · ${f.regel}: ${f.besked}`);
  for (const a of advarsler) console.error(`advarsel  ${a.robot} · ${a.felt} · ${a.regel}: ${a.besked}`);

  console.log(`\n${maal.length} fil(er) · ${fejl.length} fejl · ${advarsler.length} advarsler` +
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
  console.log(`  Skemaet har ${FELTNAVNE.length} felter. D7 (naevneren: 29 eller 31) er IKKE afgjort,`);
  console.log('  og D4 (taeller type uden model?) heller ikke. Begge staar som parametre, og');
  console.log('  tabellen viser hver kombination. Vaelg ikke en kolonne uden at lukke punktet.\n');
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
if (erHoved) process.exit(main(process.argv.slice(2)));
