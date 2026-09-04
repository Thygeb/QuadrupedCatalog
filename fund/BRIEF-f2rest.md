# BRIEF — `spor/f2rest`: de sidste 40 forbehold uden kildeordlyd, 13 producenter

**Skrevet 4. sep 2026 af `udstilling-47` (orkestrator).** Model: **sonnet**.
**Worktree:** `C:\Praktik\websites\udstilling-wt-f2rest` · **gren:** `spor/f2rest`,
forgrenet fra `5284469`.
**Forventet pris:** ~250–350k tokens. Det er **færre rækker end `spor/f2deep`, men flere
producenter** — 13 mod 1 — så prisen pr. række er højere, ikke lavere. Melder du 400k uden
at være færdig, så stop og rapportér.

**Kald `spor`-skillen som din FØRSTE handling.** Den bærer grundmålingen, kontrollinjen,
skrive-grænsen, filejerskabet, selv-efterprøvningen med tælling, rapportformen og
konfidensskalaen. Lykkes kaldet ikke fra worktreen, så læs `.claude/skills/spor/SKILL.md`
fra disk og **skriv i rapporten, at du gjorde det.**

**Kald derefter:** `robotdata` og `supabase`.
**Gå forbi og skriv hvorfor:** `design` (ingen visuel flade), `fejljagt` (kun ved uventet
adfærd).

---

## 0. Opgaven i én sætning

`field_entries.caveat_wording` skal bære **producentens egne ord, ordret, på kildens
sprog**. **40 rækker fordelt på 13 producenter mangler den.** Du udfylder, hvor
producentens ord findes — og lader stå tomt, hvor de ikke gør.

---

## 1. LÆS DETTE FØRST: et højt tal er IKKE målet

**JPK besluttede 4. sep 2026 (L93), at et TOMT `caveat_wording` er et gyldigt
slutresultat, og at `NOT NULL`-kravet på feltet droppes.** Det står nu i `PLAN.md` fire
steder. Begrundelsen: de fleste af disse forbehold er **vores egen analyse**, ikke
producentens ord, og for dem findes der ingen ordlyd at hente.

**Prisen for at gætte forkert er målt og står i STATUS.md Å171.** `spor/f2pudu` fyldte en
tom prisrække med `"price":8500000` — et JSON-fragment fra sidens Shopify-markup, i cent.
Målt bagefter: `$85,000` findes i **ingen** af de seks råkildefiler. Å171's dom:

> *"Et opdigtet bevis er værre end intet bevis, fordi det **stopper eftersøgningen**, og
> ingen test kan fange det: feltet er udfyldt, tallet er plausibelt."*

**Bemærk, at netop `pudu-d5-w` er én af DINE 40 rækker.** Læs, hvad der skete med den,
før du rører den.

**15 udfyldte plus 25 dokumenterede tomme er et BEDRE resultat end 40 udfyldte, hvoraf 12
er strakt.**

---

## 2. Grundmåling — din første kommando, og den skal stå i rapporten

```sql
select r.manufacturer, count(*) as mangler
from field_entries f join robots r on r.id=f.robot_id
where f.caveat is not null and (f.caveat_wording is null or f.caveat_wording='')
group by r.manufacturer order by mangler desc;
```

**Målt af mig 4. sep 2026 — hele basen mangler 179, fordelt sådan:**
DEEP Robotics **77** · MagicLab **53** · GENISOM AI **11** · Galileo (Tianjin) **9** ·
Unitree **7** · MicroRoboTech **4** · Rainbow Robotics **3** · MAB Robotics **3** ·
Yuejia Lingdong **2** · ANYbotics **2** · Ghost Robotics **2** · WEILAN **2** ·
RIVR **1** · NEURA Robotics **1** · Addverb **1** · Pudu Robotics **1**.

**DEEP og MagicLab er IKKE dine** — `spor/f2deep` og `spor/f2magic` kører på dem lige nu.
**Galileo er heller ikke din** — se punkt 3.

**Dine 40, målt af mig, og det er også din arbejdsliste:**

| Producent | Rækker | Robotter |
|---|---|---|
| GENISOM AI | 11 | `genisom-gangben-l1-w` 2 · `genisom-tongchui-m1-pro` 2 · `genisom-tongchui-m1-ultra` 2 · `genisom-gangben-l2` 1 · `genisom-gangben-l2-w` 1 · `genisom-gangben-l2-w-ultra` 1 · `genisom-qiuqiu-sp1` 1 · `genisom-gangben-l1` 1 |
| Unitree Robotics | 7 | `unitree-go1` 3 · `unitree-b1` 1 · `unitree-a1` 1 · `unitree-b2-w` 1 · `unitree-go2` 1 |
| MicroRoboTech | 4 | `microrobotech-movenew-p1` 2 · `microrobotech-movenew-t1` 2 |
| Rainbow Robotics | 3 | `rainbow-robotics-rbq-10` 3 |
| MAB Robotics | 3 | `mab-honey-badger-5` 2 · `mab-honey-badger-4` 1 |
| Yuejia Lingdong | 2 | `yuejia-yj30` 1 · `yuejia-yj30-w` 1 |
| ANYbotics | 2 | `anybotics-anymal` 2 |
| Ghost Robotics | 2 | `ghost-robotics-vision-60` 2 |
| WEILAN | 2 | `weilan-alphadog-c500` 1 · `weilan-alphadog-c501` 1 |
| RIVR · NEURA · Addverb · Pudu | 1 hver | `rivr-one` · `neura-quadruped` · `addverb-trakr-5` · `pudu-d5-w` |

**Summen er 40 — din kontrollinje på tabellen. Afviger dine tal fra mine, så STOP og
rapportér, før du skriver.**

---

## 3. GALILEO ER SKÅRET UD, og du skal IKKE røre dens 9 rækker

Galileos fem robotter har **én eneste kilde**: en PDF på `worldrobotconference.com`,
arkiveret som `media/_kilder/raa-kand4-2026-08-25/galileo-wrc-product-manual-2025.pdf`.

**Målt af mig:** filen er **1.753.565 bytes** med **103 `FlateDecode`-strømme** — teksten
er komprimeret, og der findes **ingen** tekstudtrækning ved siden af den
(`find media/_kilder -iname "*galileo*text*"` giver 0).

**Reglen i punkt 5 kræver en bogstavelig delstreng af kildefilen.** Den kan ikke opfyldes
mod en PDF uden at inflate strømmene og løse CJK-fontens CMap — et arbejde med sin egen
risiko for tavs forvanskning, og præcis den slags, der producerer et plausibelt forkert
citat. **Det er derfor et selvstændigt spor værd, ikke et hjørne af dette.**

**Rør dem ikke. Bliver du i tvivl, så lad være.** Er der plads i din rapport, må du gerne
skrive, hvad der skulle til — men brug ikke tid på at bygge det.

---

## 4. INTET NETVÆRK — men kildedækningen er ujævn, og det er et fund i sig selv

**Målt af mig: alle 25 kilde-URL'er for dine 40 rækker har en arkiveret fil på disken.**
Du skal derfor **ikke hente noget fra nettet** og ikke lave nye snapshots.

**MEN — og det skal med i din rapport — kun 18 af de 25 kan spores gennem et
`MANIFEST.tsv`. Fem af `media/_kilder/`s 24 mapper har SLET INGEN MANIFEST:**

| Mappe uden MANIFEST | Filer | Hvem af dine ligger der |
|---|---|---|
| `raa-genisom-2026-08-24/` | 28 | GENISOM |
| `raa-kand4-2026-08-25/` | 12 | Yuejia (+ Galileo, ikke din) |
| `raa-kand6-2026-08-25/` | 18 | Addverb |
| `raa-kand7-2026-08-25/` | 20 | — |
| `raa-pdf-2026-08-24/` | 26 | GENISOM's SDK-materiale |

**`PLAN.md` fører *"Råkilden gemmes, hver gang — snapshot + MANIFEST pr. kilde"* under
*"Det, der ikke er til forhandling"*.** For de fem mapper er filnavn↔URL derfor **ikke
bevist**, kun sandsynligt ud fra navnet. **Det ændrer ikke din opgave — men enhver ordlyd,
du henter fra en af de fem mapper, skal mærkes i rapporten som "kilde uden MANIFEST".**
Det er forskellen på en ordlyd, en efterprøver kan følge tilbage, og en, der kun kan
genkendes.

**Nyttige mapper for dine producenter** (ikke udtømmende — find selv resten):
`raa-f2-genisom-2026-09-02/` · `raa-genisom-2026-08-24/` · `raa-pdf-2026-08-24/`
(GENISOM) · `raa-f2-unitree-2026-09-02/` · `raa-kina-unitree-2026-08-19/` ·
`raa-anvendelse-2026-08-19/` (Unitree) · `raa-kand4-2026-08-25/` (Yuejia) ·
`raa-kand6-2026-08-25/` · `raa-f2-pilot-2026-09-02/` (Addverb) ·
`raa-f2-vest-2026-09-02/` · `raa-vest-2026-08-19/` (ANYbotics, Ghost, MAB, RIVR, NEURA) ·
`raa-kina-weilan-xiaomi-2026-08-19/` (WEILAN) · `raa-f2-kildejagt-2026-09-03/` (RIVR).

**LÆS KILDENS EGET SPROG.** PLAN.md: *"Kinesiske producenter læses på deres eget sprog."*
GENISOM, Unitree, MicroRoboTech, Yuejia og WEILAN har alle CN-udgaver. Prisen for at
springe over er målt: `＜60 cm` var undvigelsesafstand på kinesisk og landede som
forhindringshøjde på engelsk.

---

## 5. De tre kasser, og reglen der ikke må brydes

**Kasse A** — producenten HAR en ordlyd, forbeholdet peger på (en label, en fodnote, en
tabelrække). **Udfyld `caveat_wording` ordret.**
**Kasse B** — der er ingenting at citere; forbeholdet er vores egen slutning. **Tomt er
det rigtige svar** — før rækken på B-listen **med den søgning, du foretog** (hvilke filer,
hvilke strenge, 0 træffere).
**Kasse C** — du kan ikke afgøre det. **Meld den. Gæt aldrig.**

**Hver ordlyd, du skriver, verificeres med `indexOf` mod den arkiverede fil, der svarer
til rækkens EGEN `source`-URL — ikke mod "en fil fra den producent".**

Å171, betalt kontant: `含电池` blev efterprøvet til 2 forekomster i Youbaotes egen
katalogside — men udtrykket findes i **29 af 418** arkiverede filer, også hos GENISOM og
limxdynamics. *"Et træf i 'en kinesisk fil' beviser ingenting; det skal være DENNE
producents fil."* **Hos dig er risikoen større end hos de andre spor**, fordi du har 13
producenter og hele arkivet inden for rækkevidde.

`db/f2-cjk-skriv.mjs` gør allerede den kontrol (læs dens hovedkommentar først) og fandt to
tegnkorruptioner: `・` (U+30FB) blevet til `•` (U+2022), og `。` (U+3002) til `.`.
**Kopiér aldrig kildetegn i hånden — udtræk dem programmatisk fra filen.**

**Ordlydens FORM er ikke afgjort, og du skal ikke afgøre den.** Å171 melder to former i
brug blandt de 711 udfyldte: kildens rene værdi (`1.6m/s`) og etiket-plus-værdi
(`Continuous Walking Payload: 20–30 kg`). **Vælg etiket-plus-værdi, når forbeholdet handler
om etiketten**, og den rene værdi, når det handler om tallet. **Skriv i rapporten, hvilken
form du valgte hvor, og hvor mange af hver.**

---

## 6. Acceptkriterier

**Kriterium 1 — regnskabet går op, og det belønner IKKE et højt tal.**
`A + B + C = 40`. *Giver i dag:* A=0, B=0, C=0, mangler=40.
**Færdig når:** summen er **40**, hver række på præcis én liste, og **C så lille, du kan
forsvare hver enkelt.**

**Kriterium 2 — hver udfyldt ordlyd er en bogstavelig delstreng af rækkens EGEN kildefil.**
Byg kontrollen ind i skriveredskabet som `--verificer`.
**Færdig når:** `A af A` verificeret, `0` fejl. **Fejler én, skrives INGEN.**

**Kriterium 3 — intet andet end `caveat_wording` er ændret.** Før og efter:
```sql
select count(*), sum(coalesce(value_number,0)), count(*) filter (where caveat is not null),
       count(*) filter (where unit is not null), count(*) filter (where source is not null)
from field_entries;
```
**Færdig når:** alle fem **uændrede**. Rør ikke `caveat`, `value_*`, `unit`, `source`,
`retrieved_at` eller `caveat_class`.

**Kriterium 4 — herkomst på hver skrivning.** `collected_by = 'spor/f2rest'` plus en
`change_reason` i husets form (målt eksempel: `spor/f2-unitree` brugte
`'fase 2: engelsk kildeordlyd udskilt i caveat_wording, caveat oversat'` på 120 rækker).
**Færdig når:** `select count(*) from field_entries where collected_by='spor/f2rest'`
giver **præcis A**.

**Kriterium 5 — kontrolgruppe: du har ikke rørt de tre andre sspors rækker.**
```sql
select r.manufacturer, count(*) from field_entries f join robots r on r.id=f.robot_id
where f.collected_by='spor/f2rest'
  and r.manufacturer in ('DEEP Robotics','MagicLab','Galileo (Tianjin)')
group by r.manufacturer;
```
**Færdig når: 0 rækker.** Det er ikke en formalitet — tre spor skriver i samme tabel.

---

## 7. Filejerskab

**Du skriver i:**
- **Databasen:** `field_entries.caveat_wording`, `.collected_by`, `.change_reason` — **kun
  for de 13 producenter i punkt 2's tabel.** Intet andet.
- `db/f2rest-skriv.mjs` — nyt skriveredskab, dit alene, efter mønsteret i
  `db/f2-cjk-skriv.mjs`: `--verificer`, `--toerloeb` (standard), `--skriv`.
- `fund/BRIEF-f2rest.md` (denne), `fund/FUND-f2rest.md` (rapporten),
  `fund/f2rest-arbejde.json` (de tre lister).

**Du rører IKKE:** DEEP Robotics', MagicLabs eller Galileos rækker · `applications` ·
`robots` · `images` · `data/robots/` · `tools/` · `tests/` · `assets/` · `STATUS.md` ·
`PLAN.md`.

**Samtidige spor, målt af mig:** `spor/f2deep` (DEEP) og `spor/f2magic` (MagicLab)
skriver i **samme tabel som dig** · `spor/cjkrest` ejer `applications` og `robots` —
**bemærk, at det spor også rører `unitree-a1`, men i `applications.note`, ikke i din
tabel.** Sessionen `udstilling-e0` ejer `assets/system.css` og `assets/generator.css` og
rører ikke databasen.

**Du kører IKKE:** `tests/koer.mjs`, `tools/build.mjs`, `db/eksporter.mjs`. Disken er den
hårde grænse — **19 GB fri, målt lige før du blev sendt**, én suitekørsel er ~2,8 GB, og
der er seks worktrees plus main. Orkestratoren kører dem bagefter.

---

## 8. Commits

1. Skriveredskab + grundmåling, **før første skrivning.**
2. Én commit pr. producent (13 i alt), så et dødt spor efterlader sit arbejde.
   **Tag de store først:** GENISOM (11), Unitree (7), MicroRoboTech (4).
3. `fund/FUND-f2rest.md`.

---

## 9. Rapporten

`fund/FUND-f2rest.md`, højst **60 linjer** plus de to obligatoriske sektioner uden for
loftet (*"Nye fælder og opdagelser"*, *"Punkter i briefet, jeg ikke nåede"*).

**Skriv ÆNDRINGEN først** — en A/B/C-tabel pr. producent — og læg målemetode, konfidens og
forbehold bagefter. JPK's udtrykkelige krav fra 3. sep 2026.

**Konfidens bindes til bevistype: høj kræver en genkørbar kommando PLUS en kontrafaktisk
linje.**

**Fem ting skal med, uanset hvad:**
1. **B-listen med søgningen** for hver række. Det er den liste, der gør et tomt felt til
   et resultat frem for et hul.
2. **Hvilke ordlyd der kom fra en af de fem mapper UDEN `MANIFEST.tsv`** (punkt 4), mærket
   som sådan.
3. Hvilken ordlydsform du valgte hvor, og hvor mange af hver.
4. Hver afvigelse mellem dine målinger og dette briefs påstande. **Briefets fakta er
   påstande, og at måle dem er en del af din leverance — ikke ulydighed.**
5. Hvad du fandt om `pudu-d5-w` — den række har en historie (punkt 1).
