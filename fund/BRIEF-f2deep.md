# BRIEF — `spor/f2deep`: kildeordlyd til DEEP Robotics' 77 forbehold

**Skrevet 4. sep 2026 af `udstilling-47` (orkestrator).** Model: **sonnet** — mekanisk
arbejde med et målbart facit.
**Worktree:** `C:\Praktik\websites\udstilling-wt-f2deep` · **gren:** `spor/f2deep`,
forgrenet fra `5e6eb6f`.
**Forventet pris:** ~250–350k tokens (til sammenligning kostede `spor/f2-genisom` 118
rækker). Melder du 400k uden at være færdig, så stop og rapportér.

**Kald `spor`-skillen som din FØRSTE handling.** Den bærer grundmålingen, kontrollinjen,
skrive-grænsen, filejerskabet, selv-efterprøvningen med tælling, rapportformen og
konfidensskalaen. Lykkes kaldet ikke fra worktreen, så læs `.claude/skills/spor/SKILL.md`
fra disk og **skriv i rapporten, at du gjorde det.**

**Kald derefter:** `robotdata` (de ti hårde regler om kilder og operatorer) og `supabase`.
**Gå forbi og skriv hvorfor:** `design` (ingen visuel flade), `fejljagt` (kun hvis noget
opfører sig uventet).

---

## 0. Opgaven i én sætning

`field_entries.caveat_wording` skal bære **producentens egne ord, ordret, på kildens
sprog**, ved siden af vores engelske forbehold i `caveat`. **77 DEEP Robotics-rækker
mangler den ordlyd.** Du udfylder den, hvor producentens ord findes — og lader den stå
tom, hvor de ikke gør.

---

## 1. LÆS DETTE FØR ALT ANDET: et højt tal er IKKE målet

**JPK besluttede 4. sep 2026, at et TOMT `caveat_wording` er et gyldigt slutresultat, og
at `NOT NULL`-kravet på feltet droppes.** Begrundelsen står i `PLAN.md`s korrektion nummer
to: de fleste af disse forbehold er **vores egen analyse**, ikke producentens ord, og for
dem findes der ingen ordlyd at hente.

**Målt af mig 4. sep på netop dine 77 rækker: `0` af dem indeholder et citat i
anførselstegn.** Det er ikke en udtrækningsopgave. Det er en opgave, hvor du for hver
række skal afgøre, **om producenten overhovedet har sagt noget, der kan citeres.**

**Prisen for at gætte forkert er målt, og den står i STATUS.md Å171.** To spor mødte samme
situation i samme time 3. sep. `spor/f2weilan` meldte to prisrækker som udokumenterede.
`spor/f2pudu` fyldte sin med `"price":8500000` — **et JSON-fragment fra sidens
Shopify-markup, i cent.** Målt bagefter: `$85,000` findes i **ingen** af de seks
råkildefiler. Å171's dom:

> *"Et opdigtet bevis er værre end intet bevis, fordi det **stopper eftersøgningen**, og
> ingen test kan fange det: feltet er udfyldt, tallet er plausibelt."*

**25 udfyldte plus 52 dokumenterede tomme er et BEDRE resultat end 77 udfyldte, hvoraf 20
er strakt.** Det er formuleringen, der reddede `f2weilan`, og den er dit acceptkriterium.

---

## 2. Grundmåling — din første kommando, og den skal stå i rapporten

```sql
select count(*) as mangler_deep
from field_entries f join robots r on r.id=f.robot_id
where f.caveat is not null and (f.caveat_wording is null or f.caveat_wording='')
  and r.manufacturer='DEEP Robotics';

select count(*) filter (where caveat_wording is not null and caveat_wording<>'') as udfyldt_i_alt,
       count(*) filter (where caveat is not null) as caveats_i_alt
from field_entries;
```

**Målt af mig 4. sep 2026:**

| Måling | I dag |
|---|---|
| DEEP Robotics-rækker uden ordlyd | **77** |
| Fordelt på robotter | **9** |
| `caveat_wording` udfyldt i hele basen | **711** af **890** |
| Mangler i hele basen | **179** (DEEP er 77 af dem) |

**Afviger dine tal fra mine, så STOP og rapportér, før du skriver.**

**Fordelingen pr. robot, målt af mig — det er også din arbejdsliste:**

| Robot | Mangler | Producentens URL i `field_entries.source` |
|---|---|---|
| `deep-robotics-lynx-m20-pro` | 13 | `…/en/index/lynx.html` |
| `deep-robotics-lynx-m20` | 13 | `…/en/index/lynx.html` |
| `deep-robotics-lynx-m20s` | 11 | `…/en/index/lynx.html` |
| `deep-robotics-lite3` | 9 | `…/en/index/product1.html` |
| `deep-robotics-x30-pro` | 7 | `…/en/index/product3.html` |
| `deep-robotics-x30` | 7 | `…/en/index/product3.html` |
| `deep-robotics-mini` | 7 | `…/en/index/product2.html` |
| `deep-robotics-x20` | 6 | `…/en/index/product.html` |
| `deep-robotics-lynx-s10` | 4 | `…/en/index/lynxs10.html` |

*(Summen er 77 — det er din kontrollinje på tabellen.)*

---

## 3. INTET NETVÆRK. Alle kilder ligger allerede arkiveret

**Jeg har slået hver af de ni URL'er op i `media/_kilder/raa-kina-deep-magic-2026-08-19/`s
`MANIFEST.tsv`, og alle ni er dækket.** Du skal derfor **ikke hente noget fra nettet**, og
du skal ikke lave nye snapshots eller MANIFEST-poster.

| URL i databasen | Arkiveret fil (i `raa-kina-deep-magic-2026-08-19/`) |
|---|---|
| `…/index/lynx.html` | `deeprobotics-lynx-m20-specside-{cn,en}-2026-08-19.html` |
| `…/index/product1.html` | `deeprobotics-lite3-specside-{cn,en}-…` |
| `…/index/product2.html` | `deeprobotics-mini-specside-{cn,en}-…` |
| `…/index/product.html` | `deeprobotics-x20-specside-{cn,en}-…` |
| `…/index/product3.html` | `deeprobotics-x30-specside-{cn,en}-…` |
| `…/index/lynxs10.html` | `deeprobotics-lynx-s10-specside-{cn,en}-…` |

**Bemærk, at `lynx.html` dækker TRE robotter** (M20, M20 Pro, M20S) og `product3.html`
**to** (X30, X30 Pro) — varianter på samme side, samme mønster som GENISOM's L2-familie.
Det betyder, at en ordlyd kan gælde en variant, siden ikke nævner ved navn. **Er du i
tvivl om, hvilken variant en label hører til, så lad feltet stå tomt og meld det** —
se punkt 5.

**LÆS BÅDE CN- OG EN-FILEN.** Reglen står i PLAN.md under *"Det, der ikke er til
forhandling"*: *"Kinesiske producenter læses på deres eget sprog."* Prisen for at lade
være er målt: `＜60 cm` var undvigelsesafstand på kinesisk og landede som forhindringshøjde
på engelsk. Flere af dine 77 forbehold handler netop om, at CN- og EN-labels **siger
noget forskelligt** — fx `deep-robotics-x20.payload_walking`: *"ONLY the Chinese page
decides the field. The CN label is continuous work load; the EN label is Endurance."*
**Ordlyden skal da bære den label, forbeholdet handler om** — og hvis forbeholdet handler
om begge, så begge, adskilt som to fragmenter.

---

## 4. De tre kasser — hver række havner i præcis én

### Kasse A — producenten HAR en ordlyd, forbeholdet peger på

Kendetegn: forbeholdet navngiver en label, en fodnote eller en tabelrække.
Ægte eksempler fra dine egne 77, ordret fra databasen:

- `deep-robotics-lynx-m20.obstacle_single`: *"The producer's own label: Max. Single-Step Height."*
- `deep-robotics-lynx-m20-pro.stair_step_continuous`: *"The producer's own label: Max. Continuous Stair Height."*
- `deep-robotics-lynx-m20s.slope`: *"Footnote [2]: Lab-tested slope angle; actual performance varies by surface material."*
- `deep-robotics-mini.speed`: *"Speed and slope are in ONE row, separated by a full-width semicolon (U+FF1B): 3.3m/s; 30 degrees."*

**Her SKAL `caveat_wording` fyldes** med producentens streng, **ordret**, fra den
arkiverede fil.

### Kasse B — der er ingenting at citere

Kendetegn: forbeholdet er vores egen slutning, sammenligning eller redaktionelle regel.
Ægte eksempler fra dine 77:

- `deep-robotics-lynx-m20-pro.power_output`: *"The page's 72V power input is power IN, not out."*
- `deep-robotics-x30.runtime`: *"Range >= 10 km. No load condition."*

**Her er tomt det RIGTIGE svar.** Lad feltet være, og før rækken på din B-liste med
**den søgning, du foretog** (hvilke filer, hvilke strenge, 0 træffere).

### Kasse C — du kan ikke afgøre det

**Skriv rækken på C-listen og gå videre. Gæt aldrig.** En C-række er et gyldigt resultat
og skal i rapporten med, hvad der gjorde den uafgørlig.

---

## 5. Reglen, der ikke må brydes: ordlyden er en BOGSTAVELIG delstreng

**Hver eneste ordlyd, du skriver, skal verificeres med `indexOf` mod den arkiverede fil,
der svarer til rækkens egen `source`-URL — ikke mod "en DEEP-fil".**

Å171's regel, betalt kontant: `含电池` blev efterprøvet til 2 forekomster i Youbaotes egen
katalogside — men udtrykket findes i **29 af 418** arkiverede filer, også hos GENISOM og
limxdynamics. *"Et træf i 'en kinesisk fil' beviser ingenting; det skal være DENNE
producents fil."*

`db/f2-cjk-skriv.mjs` gør allerede præcis den kontrol (læs dens hovedkommentar først) og
fandt to tegnkorruptioner på den måde: `・` (U+30FB) blevet til `•` (U+2022), og `。`
(U+3002) til `.`. **Kopiér aldrig kildetegn i hånden — udtræk dem programmatisk fra filen.**

**Fælde, målt på HTML-kilder:** producentens tabel kan bære `&nbsp;`, bløde bindestreger
og fuldbredde-tegn. En ordlyd, der ikke matcher bogstaveligt, er **ikke** bevis for at
teksten mangler — den kan være normaliseret forkert. Sammenlign mod filens rå bytes, og
**meld det, hvis du må normalisere** for at få et match.

---

## 6. Ordlydens FORM er ikke afgjort — og det skal du ikke afgøre

STATUS.md Å171 melder en åben konvention: blandt de 711 udfyldte bruges
`caveat_wording` i **to** former — kildens rene værdi (`1.6m/s`) og **etiket-plus-værdi**
(`Continuous Walking Payload: 20–30 kg (44–66 lbs)`). **Ingen af dem er nedskrevet som
reglen.**

**Vælg etiket-plus-værdi, når forbeholdet handler om etiketten** (og det gør de fleste af
dine), og den rene værdi, når det handler om tallet. **Skriv i rapporten, hvilken form du
valgte hvor, og hvor mange af hver.** Det er data til beslutningen, ikke beslutningen.

---

## 7. Acceptkriterier

**Kriterium 1 — regnskabet går op, og det belønner IKKE et højt tal.**
`A (udfyldt) + B (dokumenteret tom) + C (uafgjort) = 77`, målt fra din egen liste og fra
databasen.
*Giver i dag:* A=0, B=0, C=0, mangler=77.
**Færdig når:** summen er **77**, hver række står på præcis én liste, og **C er så lille,
du kan forsvare hver enkelt.**

**Kriterium 2 — hver udfyldt ordlyd er en bogstavelig delstreng af rækkens EGEN kildefil.**
Byg kontrollen ind i dit skriveredskab som `--verificer`.
**Færdig når:** `A af A` verificeret, `0` fejl. **Fejler én, skrives INGEN.**

**Kriterium 3 — intet andet end `caveat_wording` er ændret.** Kør før og efter:
```sql
select count(*), sum(coalesce(value_number,0)), count(*) filter (where caveat is not null),
       count(*) filter (where unit is not null), count(*) filter (where source is not null)
from field_entries;
```
**Færdig når:** alle fem tal er **uændrede**. Du må ikke røre `caveat`, `value_*`, `unit`,
`source`, `retrieved_at` eller `caveat_class`.

**Kriterium 4 — herkomst er sat på hver skrivning.**
`collected_by = 'spor/f2deep'` og en `change_reason`, der følger husets form. De
eksisterende lyder fx `'fase 2: engelsk kildeordlyd udskilt i caveat_wording, caveat oversat'`
(målt: `spor/f2-unitree`, 120 rækker).
**Færdig når:** `select count(*) from field_entries where collected_by='spor/f2deep'`
giver **præcis A**.

**Kriterium 5 — kontrolgruppe: ingen anden producent er rørt.**
```sql
select count(*) from field_entries f join robots r on r.id=f.robot_id
where f.collected_by='spor/f2deep' and r.manufacturer<>'DEEP Robotics';
```
**Færdig når: 0.**

---

## 8. Filejerskab

**Du skriver i:**
- **Databasen:** `field_entries.caveat_wording`, `.collected_by`, `.change_reason` — **kun
  for rækker, hvis robot har `manufacturer='DEEP Robotics'`.** Intet andet.
- `db/f2deep-skriv.mjs` — nyt skriveredskab, dit alene, efter mønsteret i
  `db/f2-cjk-skriv.mjs`: `--verificer` (kildetjek, ingen netværk), `--toerloeb` (standard),
  `--skriv`.
- `fund/BRIEF-f2deep.md` (denne), `fund/FUND-f2deep.md` (din rapport), og en arbejdsfil
  `fund/f2deep-arbejde.json` med de tre lister.

**Du rører IKKE:** nogen anden producents rækker · `applications` · `robots` ·
`images` · `data/robots/` · `tools/` · `tests/` · `assets/` · `STATUS.md` · `PLAN.md`.

**Samtidige spor, målt af mig:** `spor/cjkrest` ejer `applications` og `robots` ·
`spor/f2magic` ejer MagicLabs rækker i samme tabel som dig — **derfor er
producent-afgrænsningen i kriterium 5 ikke en formalitet.** Sessionen `udstilling-e0`
ejer `assets/system.css` og `assets/generator.css` og rører ikke databasen.

**Du kører IKKE:** `tests/koer.mjs`, `tools/build.mjs`, `db/eksporter.mjs`. Disken er den
hårde grænse (23 GB fri, én suitekørsel er ~2,8 GB, fire spor kører). Orkestratoren kører
dem bagefter.

---

## 9. Commits

1. Skriveredskab + grundmåling, **før første skrivning.**
2. Én commit pr. robot (9 i alt), så et dødt spor efterlader sit arbejde.
3. `fund/FUND-f2deep.md`.

---

## 10. Rapporten

`fund/FUND-f2deep.md`, højst **60 linjer** plus de to obligatoriske sektioner uden for
loftet (*"Nye fælder og opdagelser"*, *"Punkter i briefet, jeg ikke nåede"*).

**Skriv ÆNDRINGEN først** — en tabel med A/B/C pr. robot — og læg målemetode, konfidens
og forbehold bagefter. Det er JPK's udtrykkelige krav fra 3. sep 2026.

**Konfidens bindes til bevistype, ikke fornemmelse: høj kræver en genkørbar kommando PLUS
en kontrafaktisk linje.**

**Fire ting skal med, uanset hvad:**
1. **B-listen med søgningen** for hver række — hvilke filer, hvilke strenge, 0 træffere.
   Det er den liste, der gør et tomt felt til et resultat frem for et hul.
2. Hvilken ordlydsform du valgte hvor, og hvor mange af hver (punkt 6).
3. Hver afvigelse mellem dine målinger og dette briefs påstande. **Briefets fakta er
   påstande, og at måle dem er en del af din leverance — ikke ulydighed.**
4. De rækker, hvor CN og EN siger noget forskelligt, og hvad du gjorde ved dem.
