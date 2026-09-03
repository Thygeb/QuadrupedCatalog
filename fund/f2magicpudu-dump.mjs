#!/usr/bin/env node
/**
 * fund/f2magicpudu-dump.mjs — engangsredskab for spor/f2-magicpudu.
 * Henter alle robotter, filtrerer til MagicLab/Pudu Robotics, og skriver
 * de tekstbærende felter (kun caveat/caveat_wording/caveat_class/note/
 * note_wording/notes/notes_wording/quote/quote_wording/alt) til JSON, så
 * de kan læses og klassificeres i kasser A-D uden gentagne DB-kald.
 *
 * Brug: node fund/f2magicpudu-dump.mjs <ProducentNavn> > fund/f2magicpudu-<navn>.json
 */
import process from 'node:process';
import { hentRobotter, filtrerProducent, findProducent } from '../db/fase2-tjek.mjs';

async function hoved() {
  const oenske = process.argv[2];
  if (!oenske) { console.error('Brug: node f2magicpudu-dump.mjs <ProducentNavn>'); return 2; }
  const robotter = await hentRobotter();
  const { match, gyldige } = findProducent(oenske, robotter);
  if (!match) { console.error(`Ukendt producent "${oenske}". Gyldige: ${gyldige.join(', ')}`); return 2; }
  const filtreret = filtrerProducent(robotter, match);
  const ud = filtreret.map((r) => ({
    id: r.id,
    slug: r.slug,
    manufacturer: r.manufacturer,
    notes: r.notes ?? null,
    notes_wording: r.notes_wording ?? null,
    applications: r.applications ? {
      note: r.applications.note ?? null,
      note_wording: r.applications.note_wording ?? null,
      quote: r.applications.quote ?? null,
      quote_wording: r.applications.quote_wording ?? null,
      value: r.applications.value ?? null,
    } : null,
    images: r.images ? { alt: r.images.alt ?? null, note: r.images.note ?? null } : null,
    field_entries: (r.field_entries ?? []).map((fe) => ({
      field_name: fe.field_name,
      caveat: fe.caveat ?? null,
      caveat_wording: fe.caveat_wording ?? null,
      caveat_class: fe.caveat_class ?? null,
      value_number: fe.value_number ?? null,
      value_text: fe.value_text ?? null,
      unit: fe.unit ?? null,
    })).filter((fe) => fe.caveat || fe.caveat_wording),
  }));
  console.log(JSON.stringify(ud, null, 2));
  return 0;
}
hoved().then((k) => { process.exitCode = k; }).catch((e) => {
  console.error(String(e && e.stack ? e.stack : e));
  process.exitCode = 1;
});
