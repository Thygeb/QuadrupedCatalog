#!/usr/bin/env node
/**
 * fund/f2feje-korte-celler.mjs — ejet af spor/f2-feje. BRIEF-f2-feje.md afsnit 5:
 * detektoren er to-benet (æøå ELLER markoerord) og overser dansk uden begge.
 * Dette script lister alle KORTE celler (<=40 tegn) i de 10 DANSK_KOLONNER for
 * mine fem producenter, der IKKE bliver flagget af erDansk() — de er farligst,
 * fordi en lang saetning naesten altid rammer et markoerord, et enkelt ord goer
 * ikke. Til gennemlaesning med øjnene, ikke til automatisk rettelse.
 */
import { hentRobotter, filtrerProducent, findProducent, danskAlle, erDansk } from '../db/fase2-tjek.mjs';

const PRODUCENTER = ['GENISOM AI', 'Astrall Dynamics', 'CVTE', 'Yufan Intelligent', 'Xiaomi'];

const DANSK_KOLONNER_DEF = [
  { navn: 'caveat', uddrag: (raa) => (raa.field_entries ?? []).flatMap((fe) => (fe.caveat ? [{ field: fe.field_name, tekst: fe.caveat }] : [])) },
  { navn: 'caveat_wording', uddrag: (raa) => (raa.field_entries ?? []).flatMap((fe) => (fe.caveat_wording ? [{ field: fe.field_name, tekst: fe.caveat_wording }] : [])) },
  { navn: 'applications.note', uddrag: (raa) => (raa.applications?.note ? [{ field: null, tekst: raa.applications.note }] : []) },
  { navn: 'applications.note_wording', uddrag: (raa) => (raa.applications?.note_wording ? [{ field: null, tekst: raa.applications.note_wording }] : []) },
  { navn: 'applications.quote', uddrag: (raa) => udfoldMedKilde(raa.applications?.quote) },
  { navn: 'applications.quote_wording', uddrag: (raa) => udfoldMedKilde(raa.applications?.quote_wording) },
  { navn: 'images.note', uddrag: (raa) => (raa.images?.note ? [{ field: null, tekst: raa.images.note }] : []) },
  { navn: 'images.alt', uddrag: (raa) => (raa.images?.alt?.en ? [{ field: null, tekst: raa.images.alt.en }] : []) },
  { navn: 'robots.notes', uddrag: (raa) => udfoldMedKilde(raa.notes) },
  { navn: 'robots.notes_wording', uddrag: (raa) => udfoldMedKilde(raa.notes_wording) },
];
function udfoldMedKilde(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string' && x.trim() !== '').map((tekst) => ({ field: null, tekst }));
  if (typeof v === 'string' && v.trim() !== '') return [{ field: null, tekst: v }];
  return [];
}

const GRAENSE = 40;

async function hoved() {
  const robotter = await hentRobotter();
  let iAlt = 0, kortIkkeFlaget = 0;
  for (const navn of PRODUCENTER) {
    const { match } = findProducent(navn, robotter);
    const filtreret = filtrerProducent(robotter, match);
    console.log(`\n=== ${match} ===`);
    for (const raa of filtreret) {
      for (const { navn: kolNavn, uddrag } of DANSK_KOLONNER_DEF) {
        for (const { field, tekst } of uddrag(raa)) {
          iAlt++;
          if (tekst.length <= GRAENSE && !erDansk(tekst)) {
            kortIkkeFlaget++;
            console.log(`  ${raa.slug} · ${kolNavn}${field ? `[${field}]` : ''}: ${JSON.stringify(tekst)}`);
          }
        }
      }
    }
  }
  console.log(`\nI ALT ${iAlt} celler undersoegt · ${kortIkkeFlaget} korte (<=${GRAENSE} tegn) IKKE flaget af erDansk() — listet ovenfor til gennemlaesning.`);
}

hoved().then(() => { process.exitCode = 0; }).catch((e) => { console.error(e); process.exitCode = 1; });
