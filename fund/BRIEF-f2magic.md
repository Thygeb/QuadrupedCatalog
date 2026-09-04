# BRIEF — `spor/f2magic`: kildeordlyd til MagicLabs 53 forbehold

**Skrevet 4. sep 2026 af `udstilling-47` (orkestrator).** Model: **sonnet** — mekanisk
arbejde med et målbart facit.
**Worktree:** `C:\Praktik\websites\udstilling-wt-f2magic` · **gren:** `spor/f2magic`,
forgrenet fra `5e6eb6f`.
**Forventet pris:** ~200–300k tokens. Melder du 350k uden at være færdig, så stop og
rapportér.

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
sprog**, ved siden af vores engelske forbehold i `caveat`. **53 MagicLab-rækker mangler
den ordlyd.** Du udfylder den, hvor producentens ord findes — og lader den stå tom, hvor
de ikke gør.

---

## 1. LÆS DETTE FØR ALT ANDET: et højt tal er IKKE målet

**JPK besluttede 4. sep 2026, at et TOMT `caveat_wording` er et gyldigt slutresultat, og
at `NOT NULL`-kravet på feltet droppes.** Begrundelsen står i `PLAN.md`s korrektion nummer
to: de fleste af disse forbehold er **vores egen analyse**, ikke producentens ord.

**Målt af mig 4. sep på netop dine 53 rækker: `0` af dem indeholder et citat i
anførselstegn.** Det er ikke en udtrækningsopgave. For hver række skal du afgøre, **om
producenten overhovedet har sagt noget, der kan citeres.**

**Prisen for at gætte forkert er målt og står i STATUS.md Å171.** `spor/f2pudu` fyldte en
tom prisrække med `"price":8500000` — et JSON-fragment fra sidens Shopify-markup, i cent.
Målt bagefter: `$85,000` findes i **ingen** af de seks råkildefiler. Å171's dom:

> *"Et opdigtet bevis er værre end intet bevis, fordi det **stopper eftersøgningen**, og
> ingen test kan fange det: feltet er udfyldt, tallet er plausibelt."*

**20 udfyldte plus 33 dokumenterede tomme er et BEDRE resultat end 53 udfyldte, hvoraf 15
er strakt.** Det er dit acceptkriterium.

---

## 2. Grundmåling — din første kommando, og den skal stå i rapporten

```sql
select count(*) as mangler_magiclab
from field_entries f join robots r on r.id=f.robot_id
where f.caveat is not null and (f.caveat_wording is null or f.caveat_wording='')
  and r.manufacturer='MagicLab';

select count(*) filter (where caveat_wording is not null and caveat_wording<>'') as udfyldt_i_alt,
       count(*) filter (where caveat is not null) as caveats_i_alt
from field_entries;
```

**Målt af mig 4. sep 2026:**

| Måling | I dag |
|---|---|
| MagicLab-rækker uden ordlyd | **53** |
| Fordelt på robotter | **4** |
| `caveat_wording` udfyldt i hele basen | **711** af **890** |
| Mangler i hele basen | **179** (MagicLab er 53 af dem) |

**Afviger dine tal fra mine, så STOP og rapportér, før du skriver.**

**Fordelingen pr. robot — også din arbejdsliste:**

| Robot | Mangler | Producentens URL i `field_entries.source` |
|---|---|---|
| `magiclab-magicdog-y1` | 14 | `https://support.magiclab.top/docs/y1/about` |
| `magiclab-magicdog-edu` | 13 | `https://support.magiclab.top/docs/dog/about` |
| `magiclab-magicdog-pro` | 13 | `https://support.magiclab.top/docs/dog/about` |
| `magiclab-magicdog-w` | 13 | `https://support.magiclab.top/docs/dog_w/about` |

*(Summen er 53 — din kontrollinje på tabellen.)*

---

## 3. INTET NETVÆRK. Alle kilder ligger arkiveret

**Jeg har slået hver URL op i `media/_kilder/raa-kina-deep-magic-2026-08-19/MANIFEST.tsv`,
og alle er dækket.** Hent intet fra nettet, lav ingen nye snapshots eller MANIFEST-poster.

| URL i databasen | Arkiveret fil (i `raa-kina-deep-magic-2026-08-19/`) |
|---|---|
| `support.magiclab.top/docs/y1/about` | `magiclab-magicdog-y1-udviklerguide-cn-2026-08-19.html` |
| `support.magiclab.top/docs/dog/about` | `magiclab-magicdog-udviklerguide-cn-2026-08-19.html` |
| `support.magiclab.top/docs/dog_w/about` | `magiclab-magicdog-w-udviklerguide-cn-2026-08-19.html` |

**Supplerende filer for samme produkter**, som du må bruge som **krydskontrol** — men
ordlyden skal komme fra rækkens egen `source`-URL's fil, ikke fra disse:
`magiclab-magicdog-{,w-,y1-}specside-cn-…` (`www.magiclab.top/dog`, `/dog-w`, `/dog-y`) ·
`…-specside-en-…` (`/en/dog` osv.) · `magiclabglobal-magicdog{,-w,-y1}-specside-en-…`
(`magiclabglobal.com`) · `magiclab-support-forside-2026-08-19.html`.

**BEMÆRK, at `docs/dog/about` dækker TO robotter** — `magicdog-edu` og `magicdog-pro`. De
er varianter i samme tabel. Flere af dine forbehold handler netop om, at **den eneste
specifikationsforskel mellem dem er et udfyldt kontra åbent cirkelsymbol** (se punkt 4).
Er du i tvivl om, hvilken variant en label hører til, så lad feltet stå tomt og meld det.

**MANIFEST'et bærer en fælde, du skal kende:** CN-spec-siderne er noteret med
*"KRAEVER cookie i18n_redirected=zh + Accept-Language: zh-CN; uden den 301'er til /en/"*.
Det betyder ikke noget for dig (filerne er allerede hentet), men det betyder, at
**CN- og EN-udgaven er to forskellige dokumenter og ikke oversættelser af hinanden.**

**LÆS BÅDE CN- OG EN-FILEN.** PLAN.md, under *"Det, der ikke er til forhandling"*:
*"Kinesiske producenter læses på deres eget sprog."* Prisen for at lade være er målt:
`＜60 cm` var undvigelsesafstand på kinesisk og landede som forhindringshøjde på engelsk —
**og netop det forbehold er ét af dine** (`magiclab-magicdog-w.obstacle_single`, ordret:
*"THREE LABELS, THREE MEANINGS, ONE FIGURE — and that is why the field is left blank.
EN: Minimum obstacle clearance height < 60 cm. CN: minimum obstacle-AVOIDANCE distance
height < 60 cm"*). Her skal ordlyden bære **begge** labels som to fragmenter, fordi
forbeholdet handler om forskellen mellem dem.

---

## 4. De tre kasser — hver række havner i præcis én

### Kasse A — producenten HAR en ordlyd, forbeholdet peger på

Kendetegn: forbeholdet navngiver en label, en tabelrække eller et symbol.
Ægte eksempler fra dine egne 53, ordret fra databasen:

- `magiclab-magicdog-y1.payload_standing`: *"The manufacturer's label: Maximum Payload (CN: max. load)."*
- `magiclab-magicdog-w.battery_wh`: *"Only Capacity: 8200 mAh, Rated Voltage: 29.6 V. No Wh."*
- `magiclab-magicdog-y1.lidar`: *"3D LiDAR x1 — type without model, does not count under D4."*
- `magiclab-magicdog-edu.docking_station`: *"Battery Charging Dock marked with a filled circle."*

**Her SKAL `caveat_wording` fyldes** med producentens streng, **ordret**, fra den
arkiverede fil.

**MagicLabs symbolfælde, som rammer flere af dine rækker:** tabellen bruger **udfyldt
cirkel = ja, åben cirkel = nej**, og har **ingen tredje tilstand** for *ikke oplyst*. To af
dine forbehold siger det udtrykkeligt, og ét kalder tegnet *"counterintuitive"*.
**Ordlyden skal da bære producentens egen label PLUS det tegn, der står i cellen** —
udtrukket programmatisk, så du får det rigtige Unicode-punkt (fx `●` U+25CF mod `○`
U+25CB, eller helt andre tegn; **mål det, gæt det ikke**).

### Kasse B — der er ingenting at citere

Kendetegn: forbeholdet er vores egen slutning eller redaktionelle regel.
Ægte eksempler fra dine 53:

- `magiclab-magicdog-y1.temperature_min`: *"Stated in body text, not in the table."*
  *(Bemærk: her KAN kropsteksten selv være citérbar — undersøg det, før du dømmer B.)*
- `magiclab-magicdog-w.battery_wh`, anden halvdel: *"We do not calculate it."*

**Her er tomt det RIGTIGE svar.** Lad feltet være, og før rækken på din B-liste med
**den søgning, du foretog** (hvilke filer, hvilke strenge, 0 træffere).

### Kasse C — du kan ikke afgøre det

**Skriv rækken på C-listen og gå videre. Gæt aldrig.** En C-række er et gyldigt resultat
og skal i rapporten med, hvad der gjorde den uafgørlig.

---

## 5. Reglen, der ikke må brydes: ordlyden er en BOGSTAVELIG delstreng

**Hver ordlyd verificeres med `indexOf` mod den arkiverede fil, der svarer til rækkens
egen `source`-URL — ikke mod "en MagicLab-fil".**

Å171, betalt kontant: `含电池` blev efterprøvet til 2 forekomster i Youbaotes egen
katalogside — men udtrykket findes i **29 af 418** arkiverede filer, også hos GENISOM og
limxdynamics. *"Et træf i 'en kinesisk fil' beviser ingenting; det skal være DENNE
producents fil."* **Hos dig er faren større end normalt**, fordi MagicLab har **tre
domæner** for de samme produkter (`magiclab.top`, `magiclabglobal.com`,
`support.magiclab.top`) — en streng fra det forkerte domæne ser fuldstændig rigtig ud.

`db/f2-cjk-skriv.mjs` gør allerede den kontrol (læs dens hovedkommentar først) og fandt to
tegnkorruptioner sådan: `・` (U+30FB) blevet til `•` (U+2022), og `。` (U+3002) til `.`.
**Kopiér aldrig kildetegn i hånden — udtræk dem programmatisk fra filen.** Det gælder
dobbelt for cirkelsymbolerne i punkt 4.

**Fælde ved HTML-kilder:** tabellen kan bære `&nbsp;`, bløde bindestreger og
fuldbredde-tegn. Et manglende bogstaveligt match er **ikke** bevis for, at teksten mangler.
Sammenlign mod filens rå bytes, og **meld det, hvis du må normalisere** for at få et match.

---

## 6. Ordlydens FORM er ikke afgjort — og det skal du ikke afgøre

STATUS.md Å171 melder en åben konvention: blandt de 711 udfyldte bruges `caveat_wording`
i **to** former — kildens rene værdi (`1.6m/s`) og **etiket-plus-værdi**
(`Continuous Walking Payload: 20–30 kg (44–66 lbs)`). **Ingen af dem er nedskrevet som
reglen.**

**Vælg etiket-plus-værdi, når forbeholdet handler om etiketten** (og det gør de fleste af
dine), og den rene værdi, når det handler om tallet. **Skriv i rapporten, hvilken form du
valgte hvor, og hvor mange af hver.** Det er data til beslutningen, ikke beslutningen.

---

## 7. Acceptkriterier

**Kriterium 1 — regnskabet går op, og det belønner IKKE et højt tal.**
`A (udfyldt) + B (dokumenteret tom) + C (uafgjort) = 53`.
*Giver i dag:* A=0, B=0, C=0, mangler=53.
**Færdig når:** summen er **53**, hver række står på præcis én liste, og **C er så lille,
du kan forsvare hver enkelt.**

**Kriterium 2 — hver udfyldt ordlyd er en bogstavelig delstreng af rækkens EGEN kildefil.**
Byg kontrollen ind i skriveredskabet som `--verificer`.
**Færdig når:** `A af A` verificeret, `0` fejl. **Fejler én, skrives INGEN.**

**Kriterium 3 — intet andet end `caveat_wording` er ændret.** Før og efter:
```sql
select count(*), sum(coalesce(value_number,0)), count(*) filter (where caveat is not null),
       count(*) filter (where unit is not null), count(*) filter (where source is not null)
from field_entries;
```
**Færdig når:** alle fem er **uændrede**. Rør ikke `caveat`, `value_*`, `unit`, `source`,
`retrieved_at` eller `caveat_class`.

**Kriterium 4 — herkomst på hver skrivning.** `collected_by = 'spor/f2magic'` plus en
`change_reason` i husets form; de eksisterende lyder fx
`'fase 2: engelsk kildeordlyd udskilt i caveat_wording, caveat oversat'` (målt:
`spor/f2-unitree`, 120 rækker).
**Færdig når:** `select count(*) from field_entries where collected_by='spor/f2magic'`
giver **præcis A**.

**Kriterium 5 — kontrolgruppe: ingen anden producent er rørt.**
```sql
select count(*) from field_entries f join robots r on r.id=f.robot_id
where f.collected_by='spor/f2magic' and r.manufacturer<>'MagicLab';
```
**Færdig når: 0.**

---

## 8. Filejerskab

**Du skriver i:**
- **Databasen:** `field_entries.caveat_wording`, `.collected_by`, `.change_reason` — **kun
  for rækker, hvis robot har `manufacturer='MagicLab'`.** Intet andet.
- `db/f2magic-skriv.mjs` — nyt skriveredskab, dit alene, efter mønsteret i
  `db/f2-cjk-skriv.mjs`: `--verificer`, `--toerloeb` (standard), `--skriv`.
- `fund/BRIEF-f2magic.md` (denne), `fund/FUND-f2magic.md` (rapporten),
  `fund/f2magic-arbejde.json` (de tre lister).

**Du rører IKKE:** nogen anden producents rækker · `applications` · `robots` · `images` ·
`data/robots/` · `tools/` · `tests/` · `assets/` · `STATUS.md` · `PLAN.md`.

**Samtidige spor, målt af mig:** `spor/cjkrest` ejer `applications` og `robots` ·
`spor/f2deep` skriver i **samme tabel som dig**, men kun DEEP Robotics' rækker — **derfor
er producent-afgrænsningen i kriterium 5 ikke en formalitet.** Sessionen `udstilling-e0`
ejer `assets/system.css` og `assets/generator.css` og rører ikke databasen.

**Du kører IKKE:** `tests/koer.mjs`, `tools/build.mjs`, `db/eksporter.mjs`. Disken er den
hårde grænse (23 GB fri, én suitekørsel er ~2,8 GB, fire spor kører). Orkestratoren kører
dem bagefter.

---

## 9. Commits

1. Skriveredskab + grundmåling, **før første skrivning.**
2. Én commit pr. robot (4 i alt).
3. `fund/FUND-f2magic.md`.

---

## 10. Rapporten

`fund/FUND-f2magic.md`, højst **60 linjer** plus de to obligatoriske sektioner uden for
loftet (*"Nye fælder og opdagelser"*, *"Punkter i briefet, jeg ikke nåede"*).

**Skriv ÆNDRINGEN først** — en tabel med A/B/C pr. robot — og læg målemetode, konfidens og
forbehold bagefter. Det er JPK's udtrykkelige krav fra 3. sep 2026.

**Konfidens bindes til bevistype, ikke fornemmelse: høj kræver en genkørbar kommando PLUS
en kontrafaktisk linje.**

**Fire ting skal med, uanset hvad:**
1. **B-listen med søgningen** for hver række — hvilke filer, hvilke strenge, 0 træffere.
   Det er den liste, der gør et tomt felt til et resultat frem for et hul.
2. Hvilken ordlydsform du valgte hvor, og hvor mange af hver (punkt 6).
3. Hver afvigelse mellem dine målinger og dette briefs påstande. **Briefets fakta er
   påstande, og at måle dem er en del af din leverance — ikke ulydighed.**
4. Hvad du fandt ud af om cirkelsymbolerne: hvilke Unicode-punkter tabellen faktisk
   bruger, og om `edu`/`pro`-forskellen holder ved en programmatisk aflæsning.
