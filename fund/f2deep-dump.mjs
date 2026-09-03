#!/usr/bin/env node
// fund/f2deep-dump.mjs — dumper raa DEEP Robotics-data (field_entries,
// applications, images, robots) til JSON, saa jeg kan laese/klassificere
// hver dansk celle. Genbruger hentRobotter()/filtrerProducent() fra
// db/fase2-tjek.mjs (samme henteapparat som --dansk/--tal bruger).
import fs from 'node:fs';
import { hentRobotter, filtrerProducent } from '../db/fase2-tjek.mjs';

const robotter = await hentRobotter();
const deep = filtrerProducent(robotter, 'DEEP Robotics');
fs.writeFileSync(new URL('./f2deep-raw-foer.json', import.meta.url), JSON.stringify(deep, null, 2), 'utf8');
console.log(`${deep.length} robotter dumpet til fund/f2deep-raw-foer.json`);
for (const r of deep) console.log(`  ${r.id} ${r.slug}`);
