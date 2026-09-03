#!/usr/bin/env node
/**
 * fund/f2feje-selvtjek-dansk.mjs — ejet af spor/f2-feje.
 * Koerer de NYE vaerdier fra f2feje-genisom-payload.mjs (og senere de fire
 * andre producenters payload-filer) gennem SAMME erDansk()-detektor som
 * db/fase2-tjek.mjs's --dansk, FOeR databasen roeres. Et 0-tal her er
 * efterprøvet, ikke antaget.
 */
import { erDansk, harAeoeaa } from '../db/fase2-tjek.mjs';
import { poster as genisom } from './f2feje-genisom-payload.mjs';
import { poster as fire } from './f2feje-fire-payload.mjs';

function udfold(v) {
  if (v === null || v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

function tjek(navn, poster) {
  let iAlt = 0, dansk = 0;
  const fejl = [];
  for (const post of poster) {
    for (const kolonne of ['note_wording', 'quote', 'quote_wording']) {
      for (const tekst of udfold(post.saet[kolonne])) {
        iAlt++;
        if (erDansk(tekst)) {
          dansk++;
          fejl.push(`robot_id=${post.noegle.robot_id} ${kolonne}: DANSK -> ${JSON.stringify(tekst)}`);
        }
      }
    }
  }
  console.log(`${navn} nye vaerdier: ${iAlt} celler, ${dansk} danske (forventer 0)`);
  for (const f of fejl) console.log(`  ${f}`);
}

tjek('GENISOM', genisom);
tjek('FIRE (Astrall/CVTE/Yufan/Xiaomi)', fire);
