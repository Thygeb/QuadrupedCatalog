# FUND — spor/f2-pilot

## RAPPORTEN (højst 60 linjer, resten af filen er arbejdslog/detalje)

**1. Valgt / fravalgt:**
- Multi-citat-felter: kun de citater, der understøtter feltets NUVÆRENDE værdi, i
  `caveat_wording` (adskilt med `" | "`); ubrugte/modstridende citater bliver
  citeret i `caveat`-prosaen i stedet. Fravalgt: proppe alle citater i
  `caveat_wording` — ville sløre hvilket citat der faktisk beviser værdien.
- Manglende `media/_kilder/raa-kand6-2026-08-25/` (miljøfælde, se nedenfor): gen-
  hentede kilderne friskt med ægte HTTP-headere. Fravalgt: stoppe og rapportere
  blokeret — netadgang virkede, så det var en løsbar fælde, ikke en reel spærring.
- MANIFEST.tsv dateret 2026-09-02 (dagens dato), ikke 2026-08-25. Fravalgt: genbruge
  den gamle dato på filer jeg selv hentede i dag — det ville være en løgn om
  proveniens.

**2. Konfidens pr. punkt:**
- Grundmåling: **Høj.** `node tools/validate.mjs` + `git log --oneline -1`,
  genkørt, samme svar (77/0/1, f8eac85). Forkert arbejde ville give fejltal >0.
- Punkt 1 (sum A+B+C=17): **Høj.** `field_entries?...&caveat=not.is.null` giver 17,
  genkørbart. Hver enkelt A/B/C-TILDELING er derimod et redaktionelt skøn: **Middel**.
- Punkt 2 (citat-efterprøvning): **Høj.** 25/25 citater fundet i tekstudtrukne
  kildefiler; metoden fangede rent faktisk én fejl undervejs (min egen forkerte
  kildeantagelse for "170 mm"-citatet) og rettede den — det beviser at et opfundet
  citat VILLE være blevet fanget som "IKKE FUNDET".
- MANIFEST.tsv: **Høj.** 6 datarækker; sha256 for én stikprøve genberegnet, matcher.
- Punkt 3 (oversættelsernes troskab): **Middel.** `dansk: 0`-tallet er højt målt,
  men at intet er OPFUNDET er efterprøvet ved manuel gennemlæsning, ikke en kommando.
- Punkt 4 (skrivning): **Høj.** `node db/f2-pilot-skriv.mjs --skriv` → "21 (fejl: 0)
  af 21". Forkert `robot_id`/`field_name` ville give 0 rækker og script-exit 1.
- Punkt 5a (talkolonner urørt): **Høj.** Diff-script gav 0/66; mekanismen fangede
  den forventede `caveat`-ændring (ikke-vakuøs). En rørt talkolonne ville printe
  en `DIFF`-linje med kolonnenavn og de to værdier.
- Punkt 5b (`change_log`): **Høj.** 0 → 21 rækker, genkørbart via `select=*`.

**3. Usikkerheder:** hvilke citater der hører i `caveat_wording` vs. `caveat`-prosa
er min fortolkning af briefets regel, ikke eksplicit specificeret der. 2182/
`payload_walking` refererer til "topnoten", som ikke findes (`robots.notes` er
tom for begge robotter) — lod den dinglende reference stå uændret, da det ligger
uden for min kolonnescope at rette den.

**4. Målingerne:** 17 advarsler, A=16 B=1 C=0 · 25/25 citater genfundet · MANIFEST
6 datarækker · tørløb 21/21 · skrevet 21/21, 0 fejl · eftermåling caveat 17|dansk 0,
applications.note 2|dansk 0, images.note 2|dansk 0 · talkolonne-diff 0/66 ·
change_log 0→21 · manuel gennemlæsning 21/21, 0 fejl (2 observationer) · kasse C: 0.

### Nye fælder og opdagelser (uden for loftet)

1. **`media/_kilder/**` er gitignoreret projektbredt og bliver IKKE automatisk
   kopieret ind i en ny worktree** (kun `.env` og `assets/fotos/fabrikant/` er
   det). Et brief, der siger "råkilderne findes allerede", kan tage fejl af netop
   den grund — efterprøv altid `ls media/_kilder/` FØR du stoler på den påstand.
2. **"LABEL: VALUE"-citater i Addverbs specifikationstabel er ikke én sammenhængende
   tekststreng i kilden** — label og værdi ligger i to separate DOM-elementer,
   koblet af en rendering-konvention (kolon), ikke et bogstaveligt kildetegn.
   Stadig gyldig kasse-A-ordlyd, men kræver HTML→tekst-udtrækning FØR grep.
3. **Multi-citat-felter er reglen, ikke undtagelsen:** kun 10 af 16 kasse-A-rækker
   havde ét enkelt citat. Se `fund/OPSKRIFT-fase2.md` §3 for den fulde regel.
4. **`value_text`-kolonnen er stadig dansk** på felter som `compute` og
   `autonomy_level` — en anden tekstbunke, intet spor ejer den endnu.

### Punkter i briefet, jeg ikke nåede

Ingen. Regel 0 og punkt 1-6 er alle gennemført og committet enkeltvis.

---

Arbejdslog og detaljer (tabellerne fra punkt 1 og 5(c) ligger heri):

## Punkt 1 — klassificering af de 17 advarsler

Hentet med `field_entries?robot_id=in.(2182,2183)&caveat=not.is.null` — 17 rækker,
bekræftet (`ANTAL: 17`). Klassificeret ved at læse hver `caveat`-tekst og se, om der
står et citat i anførselstegn, som hævder at være producentens egne ord.

| robot_id | field_name | Kasse | Begrundelse |
|---|---|---|---|
| 2182 | payload_walking | A | To citater: primær "Trakr 20 is the heavy-duty quadruped. 20 kg carry, rock-steady under load." + sekundær (mærket "kildetype sekundær" i teksten selv) "The Trakr 2.0 ... capable of carrying up to 20 kg" |
| 2183 | weight | A | "WEIGHT (INCL BATTERY): 18 KG" — briefets eget eksempel |
| 2183 | height | A | "STANDING HEIGHT: 280 MM" (+ ubrugt "HEIGHT OF CROUCHING: 150 MM") |
| 2183 | degrees_of_freedom | A | "12 actuators" (blogindlæg) |
| 2183 | payload_walking | A | "PAYLOAD: 5 KG" |
| 2183 | speed | A | "SPEED: 1.5 M/S" |
| 2183 | slope | A | To citater der tilsammen giver værdi+operator: "MAX CLIMB ANGLE: 30 DEGREES" og "Climbs stairs, slopes (≤ 30°)..." |
| 2183 | stair_step_continuous | A | "MAXIMUM STEP: 120 MM" (tabel, brugt) vs. modstridende "...climb steps upto 170 mm" (brødtekst, IKKE brugt, regel 9-tilfælde) |
| 2183 | ip_rating | A | "INGRESS PROTECTION (IP RATING): IP67 (OPTIONAL)" |
| 2183 | temperature_max | A | "TEMPERATURE: +5 °C TO +45 °C" |
| 2183 | runtime | A | "ENDURANCE: 1.5 HRS" (+ bekræftende "90-minute runtime" fra blog) |
| 2183 | charging_time | A | "CHARGING TIME: 90 MINS" |
| 2183 | docking_station | A | "CHARGING PILE COMPATIBILITY: YES" |
| 2183 | lidar | A | "LIDAR: 3D LIDAR" |
| 2183 | cameras | A | "HD WIDE ANGLE CAMERA: YES" (+ modstridende ubrugt "four stereo cameras" fra blog) |
| 2183 | compute | A | To citater, begge brugt til samme felt: "BASIC COMPUTING POWER: I7 PROCESSOR" + "HIGH COMPUTING POWER MODULE: JETSON ORIN" |
| 2183 | autonomy_level | B | Intet citat. Egen syntese af fire funktionskort + tabelrække; teksten siger selv "Ingen navngivet autonominiveau-skala" |

**Sum: A=16, B=1, C=0, i alt 17.** ✔ (matcher briefets krav om at de tre kasser summer til 17)

**Bemærkning, der bæres videre til punkt 6 (opskriften):** flere kasse-A-rækker har
MERE END ét citat — enten en bekræftende sekundær kilde (2182), to citater der
tilsammen giver tal+operator (slope), to citater der begge bærer reel feltværdi
(compute), eller et ubrugt/modstridende citat (stair_step_continuous, cameras). Det
"almindelige tilfælde" i briefet (ét citat, én kilde) dækker kun 10 af de 16 A-rækker
rent strukturelt. Beslutningsregel brugt her: `caveat_wording` bærer KUN det/de citater,
der reelt understøtter feltets nuværende værdi (adskilt med " | " hvis flere), aldrig et
ubrugt/modstridende tal — det bliver i `caveat`-prosaen som citeret kontekst.

## Punkt 2 — MILJØFÆLDE fundet, og hvordan den blev lukket

**`media/_kilder/raa-kand6-2026-08-25/` fandtes IKKE i denne worktree** — hverken
mappen eller de seks filer, briefet forudsatte var der ("Addverbs råkilder findes
allerede, seks filer"). Kontrolleret: `ls media/_kilder/` viste kun `LÆSMIG.md`
(mappen er gitignoreret, `.env` og fabrikantfotos blev kopieret ind for mig, denne
mappe blev det ikke). Dette er briefets egen påstand, som jeg her retter, jf.
"Briefets fakta er påstande".

**Løsning:** Netadgang virker fra denne worktree (`curl` til addverb.ai gav 308→200).
Jeg gen-hentede de samme tre URL'er (fundet i `data/robots/addverb-*.yaml`s `kilde:`-
felter og i selve advarslens citat af pressemeddelelsen), gemte dem MED ægte
HTTP-headere (`curl -D`, statuskode + `Date`), beregnede rigtig sha256/bytes, og
byggede `MANIFEST.tsv` af DISSE filer — dateret **2026-09-02**, ikke 25-08, med en
forklarende kommentar øverst i filen om afvigelsen. `hentet_utc` er her serverens
egen `Date`-header (ikke en mtime-øvregrænse — det er LÆSMIG.md's egen anbefalede
forbedring til "næste gang").

**(a) Citatefterprøvning:** alle 16 kasse-A-rækkers citater (25 enkeltstrenge, nogle
rækker har 2) søgt i de tekstudtrukne filer. **25/25 fundet.** Én fejlede først
("climb steps upto 170 mm" ikke fundet i blog.html) — undersøgt, og fejlen var min
egen kildeantagelse: citatet står i `trakr.html`s "COMPARE TRAKR 5 / TRAKR 20"-sammen-
ligningstekst, ikke i blogindlægget. Rettet og genfundet. **Ingen kasse-A nedgraderes
til kasse C** — klassificeringen fra punkt 1 står fast.

**Fund undervejs (vigtigt for opskriften):** "LABEL: VALUE"-citater som `"WEIGHT
(INCL BATTERY): 18 KG"` er IKKE én sammenhængende tekststreng i kilden — det er to
separate DOM-elementer (label i `<h4>`, værdi i naboelement) i Addverbs Framer-tabel.
Kolonnet er en rendering-konvention, ikke bogstaveligt kildetegn. Begge ordstumper er
dog 100 % producentens egne ord, kun adskilt i markup — behandlet som gyldig
kasse-A-ordlyd.

**(b) MANIFEST.tsv:** 6 datarækker + hoved, bekræftet (`tail -n +3 | wc -l` = 6).
Sha256 for `addverb-com-press-trakr2-2026-09-02.html` genberegnet og passer
(`9d3f291e...`).

## Punkt 3+4 — engelske tekster og skrivning

Alle 21 tekster (17 caveat, 2 applications.note, 2 images.note) skrevet i
`db/f2-pilot-skriv.mjs`. Tørløb (standard) viste 21/21 klar. `--skriv` kørt:
**21/21 skrevet, 0 fejl**, hver PATCH verificeret til præcis 1 række via
`Prefer: return=representation` (håndhævet i scriptet — afbryder og logger,
hvis en PATCH giver 0 eller >1 række).

**Efter-måling** (`node fund/maal-f2.mjs 2182,2183`):
```
caveat                         17 | dansk:    0   (krav opfyldt)
  heraf uden ordlyd             1 | dansk:    -   (= B+C = 1+0, som forudsagt i punkt 1)
applications.note               2 | dansk:    0   (krav opfyldt)
images.note                     2 | dansk:    0   (krav opfyldt)
```

**Manuelt gennemsyn af alle 21 tekster** (ordlisten er nødvendig, ikke
tilstrækkelig — læst selv til sidst): **21/21 læst, 0 reelle fejl fundet.**
To observationer, ikke fejl:
1. `field_entries.value_text` for `compute` og `autonomy_level` er STADIG
   dansk ("grundlæggende", "tilvalgt modul til høj beregningskraft" osv.) —
   uden for min tilladte kolonneliste (kun caveat/caveat_wording/note),
   derfor bevidst urørt. Flag til senere fase 2-spor: `value_text` er endnu
   en tekstkolonne, der skal gennem samme proces.
2. I `applications.note` (2182) ændrede jeg en henvisning fra
   `addverb-trakr-5.yaml` til "the Trakr 5 entry (addverb-trakr-5)" — YAML er
   på vej ud (L84/fase 3), og en filsti-henvisning ville blive forældet
   først. Bevidst valg, ikke en oversættelsesfejl.
3. Bekræftet at "Gangben" (i 2182-notens GENISOM-reference) er et egennavn
   (robottens faktiske `navn:`-felt i `data/robots/genisom-gangben-l2-w.yaml`
   m.fl.), ikke et overset dansk ord — efterladt uændret, korrekt.

## Punkt 5 — talkolonner urørt, change_log, kasse C-liste

**(a) Talkolonner:** hentede alle 66 `field_entries`-rækker for 2182+2183
FØR skrivning (`fund/felt-foer-2182-2183.json`) og EFTER (`fund/felt-efter-
2182-2183.json`). Diff på alle kolonner UNDTAGEN caveat/caveat_wording/
collected_by/change_reason: **0 diffs** på 66 rækker. Diff-mekanismen er
efterprøvet ikke-vakuøs: den fangede korrekt at `caveat` ÆNDREDE sig på
`2183/weight` (dansk -> engelsk), så et ægte nul-resultat på resten er til
at stole på.

**(b) change_log:** var 0 rækker før dette spor (bekræftet af briefet).
**Efter: 21 rækker** — én pr. ændret række, `changed_by = "spor/f2-pilot"`,
`old_row` bærer den gamle danske tekst. Triggeren virker.

**(c) Kasse C-listen til JPK:** **TOM.** 0 advarsler kunne ikke føres tilbage
til en kilde. Alle 16 kasse-A-citater blev genfundet ordret (punkt 2), og
den ene kasse-B-advarsel (`autonomy_level`) erklærer selv, at der intet
citat er (ikke en påstand uden belæg — en eksplicit "ingen skala navngivet").
Ingen rækker afventer JPK's beslutning fra dette spor.

## Rettelser efter orkestratorens gennemgang (2. sep 2026)

Arbejdet blev efterprøvet uafhængigt (change_log's `old_row` mod den levende
række, ikke mine før/efter-JSON-filer — samme facit: caveat 17, caveat_wording
16, collected_by 21, change_reason 21, note 4 ændrede, 0 talkolonner, 21/21
rækker på robot_id 2182/2183). Tre præcise rettelser, ingen i data:

1. **Mappenavnet løj om sin egen dato.** De syv filer, jeg gen-hentede
   2026-09-02, lå i `media/_kilder/raa-kand6-2026-08-25/` — samme mappe som
   hovedrepoets rigtige august-batch (Addverb + GENISOM + NEURA), som mit
   MANIFEST ikke dækkede. Flyttet til `media/_kilder/raa-f2-pilot-2026-09-02/`
   (konventionen `raa-<spor>-<dato>` fra robotdata-skillens G1). MANIFEST.tsv's
   kommentarlinje er uændret — filnavnene deri var allerede sti-fri.
2. `fund/OPSKRIFT-fase2.md` linje 130 og 166 pegede på den gamle sti — rettet
   til den nye, og linje 166 skriver nu selve navnekonventionen ud eksplicit,
   så senere spor ikke lander i en fremmed batches mappe.
3. `fund/OPSKRIFT-fase2.md` linje 95 kaldte `value_text` en talkolonne — den
   er en tekstkolonne, uden for denne fases scope (som §6.4 allerede sagde
   rigtigt). Rettet, og §6.4 har fået orkestratorens egne tal: **230
   `value_text`-værdier i kataloget, 105 danske** — målt af orkestratoren
   2. sep 2026, ikke mit gæt.
