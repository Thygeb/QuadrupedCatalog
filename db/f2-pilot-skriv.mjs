/* spor/f2-pilot: skriver engelsk caveat/caveat_wording/note for robot_id 2182 og 2183.
   Toerloeb er standard. Skrivning kraever --skriv eksplicit.
   Brug:  node db/f2-pilot-skriv.mjs [--skriv] */
import fs from 'node:fs';

for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!U || !K) { console.error('mangler SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY i .env'); process.exit(1); }
const SKRIV = process.argv.includes('--skriv');
const COLLECTED_BY = 'spor/f2-pilot';
const REASON_CITAT   = 'fase 2: engelsk broedtekst, ordret kildeordlyd udskilt i caveat_wording';
const REASON_SYNTESE = 'fase 2: engelsk broedtekst (egen syntese, intet citat i kilden)';
const REASON_EGEN    = 'fase 2: egen tekst oversat til engelsk (ingen kildeordlyd - er ikke et citat)';

const H = {
  apikey: K,
  Authorization: `Bearer ${K}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

// --- Punkt 3's tekster -----------------------------------------------------

const FIELD_ENTRIES = [
  {
    robot_id: 2182, field_name: 'payload_walking', reason: REASON_CITAT,
    caveat: 'Body text for the Trakr 20 tab on the primary product page (see caveat_wording). The manufacturer does not distinguish between walking and standing payload - same interpretation as Trakr 5, Boston Dynamics Spot, and others in this catalog. Independently confirmed by a secondary source (Addverb press release, addverb.com, retrieved 2026-08-25) quoting co-founder Bir Singh. See the robot’s top-level note for why this value is used while the rest of the tab’s own specification table is not.',
    caveat_wording: 'Trakr 20 is the heavy-duty quadruped. 20 kg carry, rock-steady under load. | The Trakr 2.0, a quadruped robot, is capable of carrying up to 20 kg',
  },
  {
    robot_id: 2183, field_name: 'weight', reason: REASON_CITAT,
    caveat: 'From the structured specification table on the Trakr 5 tab.',
    caveat_wording: 'WEIGHT (INCL BATTERY): 18 KG',
  },
  {
    robot_id: 2183, field_name: 'height', reason: REASON_CITAT,
    caveat: 'From the structured specification table on the Trakr 5 tab. A separate crouching-height figure is also given ("HEIGHT OF CROUCHING: 150 MM"); the schema has no field for that posture. Length and width are not stated anywhere on the page.',
    caveat_wording: 'STANDING HEIGHT: 280 MM',
  },
  {
    robot_id: 2183, field_name: 'degrees_of_freedom', reason: REASON_CITAT,
    caveat: 'From the blog post, not an explicit "degrees of freedom" figure - same interpretation used elsewhere in this catalog, where only the actuator/joint-motor count is stated. Assigned to Trakr 5 (not Trakr 20) because the blog’s other figures (90-minute runtime, 5 kg payload) match Trakr 5’s own specification table.',
    caveat_wording: '12 actuators',
  },
  {
    robot_id: 2183, field_name: 'payload_walking', reason: REASON_CITAT,
    caveat: 'The manufacturer does not distinguish between walking and standing payload. Placing this value under walking payload is our interpretation, not a direct reading - same principle applied to Boston Dynamics Spot and ANYbotics ANYmal in this catalog.',
    caveat_wording: 'PAYLOAD: 5 KG',
  },
  {
    robot_id: 2183, field_name: 'speed', reason: REASON_CITAT,
    caveat: 'From the specification table.',
    caveat_wording: 'SPEED: 1.5 M/S',
  },
  {
    robot_id: 2183, field_name: 'slope', reason: REASON_CITAT,
    caveat: 'The specification table states the angle without an operator; the feature description on the same page supplies the operator. The figure agrees in both places (see caveat_wording).',
    caveat_wording: 'MAX CLIMB ANGLE: 30 DEGREES | Climbs stairs, slopes (≤ 30°)...',
  },
  {
    robot_id: 2183, field_name: 'stair_step_continuous', reason: REASON_CITAT,
    caveat: 'From the specification table (=12 cm). CONTRADICTED by the page’s own body text for Trakr 5 specifically: "Trakr 5 is our agile quadruped robot with 5 kg payload capacity and climb steps upto 170 mm" (=17 cm) - two different figures for the same capability on the same page, not silently reconciled (rule 9). The table’s figure is used as the primary value. The manufacturer does not itself distinguish "single obstacle" from "continuous stairs" - classified as continuous stair-climbing based on the wording ("step"/"climb steps") and the order of magnitude (12-17 cm is in line with other robots’ continuous-stair figures, not their single-obstacle figures of 40-80 cm). A separate descent figure is also given ("MAX CLIMB DROP HEIGHT: 150 MM"); the schema has no field for descent height.',
    caveat_wording: 'MAXIMUM STEP: 120 MM',
  },
  {
    robot_id: 2183, field_name: 'ip_rating', reason: REASON_CITAT,
    caveat: 'An optional feature, not standard on every unit.',
    caveat_wording: 'INGRESS PROTECTION (IP RATING): IP67 (OPTIONAL)',
  },
  {
    robot_id: 2183, field_name: 'temperature_max', reason: REASON_CITAT,
    caveat: 'From the specification table.',
    caveat_wording: 'TEMPERATURE: +5 °C TO +45 °C',
  },
  {
    robot_id: 2183, field_name: 'runtime', reason: REASON_CITAT,
    caveat: 'From the specification table, confirmed by the blog post’s repeated figure (=1.5 h, see caveat_wording). No load condition is stated, even though a separate 5 kg payload figure appears elsewhere on the page - the manufacturer does not connect the two, so runtime is recorded without a load requirement. A voltage (24 V) and battery capacity (10 Ah) are also given; Wh is not printed directly and is not calculated from V × Ah, the same caution applied to other entries in this catalog.',
    caveat_wording: 'ENDURANCE: 1.5 HRS | 90-minute runtime',
  },
  {
    robot_id: 2183, field_name: 'charging_time', reason: REASON_CITAT,
    caveat: '(=1.5 h) - the same numeric value as endurance, apparently a coincidence, not corrected. A charger rating of 24 V, 10 A is also given; the schema has no field for input power.',
    caveat_wording: 'CHARGING TIME: 90 MINS',
  },
  {
    robot_id: 2183, field_name: 'docking_station', reason: REASON_CITAT,
    caveat: 'Compatible with a charging pile/dock. A separate figure is also given ("AUTONOMOUS CHARGING: OPTIONAL"); docking compatibility itself is not marked as optional, so "yes" is used without an operator.',
    caveat_wording: 'CHARGING PILE COMPATIBILITY: YES',
  },
  {
    robot_id: 2183, field_name: 'lidar', reason: REASON_CITAT,
    caveat: 'From the Trakr 5 tab’s own sensor section (not only in the shared "Add-On Features" list, which is optional for the whole Trakr line).',
    caveat_wording: 'LIDAR: 3D LIDAR',
  },
  {
    robot_id: 2183, field_name: 'cameras', reason: REASON_CITAT,
    caveat: 'From the Trakr 5 tab’s own sensor section. The blog post (about the same base model, a different page) instead describes "four stereo cameras" - a different camera arrangement than the current product page’s wide-angle camera. The two pages are not silently reconciled; only the current product page’s wording is used as the field value.',
    caveat_wording: 'HD WIDE ANGLE CAMERA: YES',
  },
  {
    robot_id: 2183, field_name: 'compute', reason: REASON_CITAT,
    caveat: 'The manufacturer offers two compute tiers (see caveat_wording).',
    caveat_wording: 'BASIC COMPUTING POWER: I7 PROCESSOR | HIGH COMPUTING POWER MODULE: JETSON ORIN',
  },
  {
    robot_id: 2183, field_name: 'autonomy_level', reason: REASON_SYNTESE,
    caveat: 'Composed from several sections of the page: the four feature cards shown before the tab selector (apply to the whole Trakr line, not tab-specific) and the "OPTIONAL FEATURES & MODULES" row in Trakr 5’s own table. No named autonomy-level scale is given.',
    caveat_wording: null,
  },
];

const APPLICATIONS = [
  {
    robot_id: 2182, reason: REASON_EGEN,
    note: 'Same source section as the Trakr 5 entry ("Industries where we make a difference") - not inherited-from, because both variants live on the same primary source, not a conclusion borrowed from another robot’s page (same principle as GENISOM Gangben L2-W/L2-W Ultra in this catalog). See the Trakr 5 entry (addverb-trakr-5) for the full per-category interpretation rationale.',
  },
  {
    robot_id: 2183, reason: REASON_EGEN,
    note: 'From the "Industries where we make a difference" section on Trakr’s own product page (five items in total, shared between both variants - the page does not distinguish Trakr 5 from Trakr 20 in this section). Our own interpretation of each item: "Security and Defense" -> both security/surveillance and defense/emergency response (one manufacturer item explicitly covers two of the schema’s seven category words); "Remote Inspection" -> inspection; "Construction" -> industrial (the schema has no dedicated construction category); "Education and Research" -> both research/development and consumer/education. The fifth item, "Events and Entertinment" [sic - the misspelling is as printed on the page], is deliberately OMITTED from the quote list: none of the schema’s seven categories cover events/entertainment, and a forced mapping would be our own opinion, not the manufacturer’s (R16). The blog page (addverb.ai/blog/trakr-indias-homegrown-robotic-dog-quadruped, about the same base model, dated 2025-12-15) mentions an overlapping but not identical list - "Construction, Oil, Defence, Exploration & Security" - which confirms industrial/defense-emergency-response/security-surveillance, but is not used as its own quote here to avoid mixing two pages.',
  },
];

const IMAGES = [
  {
    robot_id: 2182, reason: REASON_EGEN,
    note: 'Shared photo with the Trakr 5 entry: the same product page/tab selector that the rest of this entry already documents does not reliably distinguish between the two variants (see the note on Trakr 20’s unusable specification table) - the page also has no separate product photos for Trakr 5 and Trakr 20.',
  },
  {
    robot_id: 2183, reason: REASON_EGEN,
    note: 'Shared photo with the Trakr 20 entry: the same product page/tab selector, which has no separate product photos for Trakr 5 and Trakr 20.',
  },
];

// --- Skrivemotor -------------------------------------------------------

let opdateret = 0;
let toerloebAntal = 0;
const fejl = [];

async function patchEen(tabel, filter, felter, beskrivelse) {
  const body = { ...felter, collected_by: COLLECTED_BY, change_reason: filter._reason };
  delete body._reason;
  const url = `${U}/rest/v1/${tabel}?${filter.q}`;
  if (!SKRIV) {
    toerloebAntal++;
    console.log('[TOERLOEB]', beskrivelse, '->', JSON.stringify(body).slice(0, 90) + '...');
    return;
  }
  const res = await fetch(url, { method: 'PATCH', headers: H, body: JSON.stringify(body) });
  const txt = await res.text();
  if (!res.ok) {
    fejl.push(`${beskrivelse}: HTTP ${res.status} ${txt}`);
    console.error('FEJL', beskrivelse, res.status, txt);
    return;
  }
  let rows;
  try { rows = JSON.parse(txt); } catch { rows = null; }
  if (!Array.isArray(rows) || rows.length !== 1) {
    fejl.push(`${beskrivelse}: forventede 1 raekke, fik ${Array.isArray(rows) ? rows.length : 'ikke-array'}`);
    console.error('FEJL (raekkeantal)', beskrivelse, JSON.stringify(rows));
    return;
  }
  opdateret++;
  console.log('OK', beskrivelse, '-> 1 raekke opdateret');
}

async function koer() {
  console.log(SKRIV ? '=== SKRIVER ===' : '=== TOERLOEB (ingen --skriv) ===');

  for (const r of FIELD_ENTRIES) {
    await patchEen(
      'field_entries',
      { q: `robot_id=eq.${r.robot_id}&field_name=eq.${r.field_name}`, _reason: r.reason },
      { caveat: r.caveat, caveat_wording: r.caveat_wording },
      `field_entries robot_id=${r.robot_id} field_name=${r.field_name}`
    );
  }
  for (const r of APPLICATIONS) {
    await patchEen(
      'applications',
      { q: `robot_id=eq.${r.robot_id}`, _reason: r.reason },
      { note: r.note },
      `applications robot_id=${r.robot_id}`
    );
  }
  for (const r of IMAGES) {
    await patchEen(
      'images',
      { q: `robot_id=eq.${r.robot_id}`, _reason: r.reason },
      { note: r.note },
      `images robot_id=${r.robot_id}`
    );
  }

  console.log('---');
  if (SKRIV) {
    console.log('Raekker skrevet:', opdateret, '(fejl:', fejl.length, ') af', FIELD_ENTRIES.length + APPLICATIONS.length + IMAGES.length, 'forsoegte');
  } else {
    console.log('Raekker der VILLE blive skrevet (toerloeb):', toerloebAntal, 'af', FIELD_ENTRIES.length + APPLICATIONS.length + IMAGES.length);
  }
  if (fejl.length) {
    console.log('FEJL:');
    for (const f of fejl) console.log(' -', f);
    process.exitCode = 1;
  }
}

await koer();
