# BRIEF — `spor/cjkrest`: de sidste 19 kinesiske rækker ud af de brugervendte tekstfelter

**Skrevet 4. sep 2026 af `udstilling-47` (orkestrator).** Model: **sonnet** — mekanisk
arbejde med et målbart facit.
**Worktree:** `C:\Praktik\websites\udstilling-wt-cjkrest` · **gren:** `spor/cjkrest`,
forgrenet fra `5e6eb6f`.
**Forventet pris:** ~150–250k tokens. Melder du over 300k uden at være færdig, så stop og
rapportér frem for at fortsætte.

**Kald `spor`-skillen som din FØRSTE handling** — den bærer grundmålingen, skrive-grænsen,
kontrollinjen, filejerskabet, selv-efterprøvningen, rapportformen og miljøfælderne.
Lykkes kaldet ikke fra worktreen, så læs `.claude/skills/spor/SKILL.md` fra disk og
**skriv i rapporten, at du gjorde det.**

**Øvrige skills, du skal kalde:** `supabase` (alt arbejde mod databasen) og `robotdata`
(du redigerer robotdata — de ti hårde regler om kilder og operatorer gælder).
**Gå forbi og skriv hvorfor:** `design` (ingen visuel flade), `fejljagt` (kald den, hvis
noget opfører sig uventet — ikke før).
**Ingen designfrys-relevans:** du rører intet visuelt.

---

## 0. Hvad opgaven ER, i én sætning

`tests/dele/42-cjk-ordlyd.mjs` kræver, at de fire brugervendte tekstfelter
(`advarsel`/`note`/`citat`/`noter`) er **rene for han-tegn**, mens ordlyden bevares i
søsterfeltet `<felt>_ordlyd`. **19 rækker overholder ikke reglen endnu.** Du bringer dem i
orden **i databasen alene**. Jeg (orkestratoren) kører eksport til YAML, byg og suite
bagefter — det er ikke din opgave, og du skal ikke røre `data/robots/`.

---

## 1. Grundmåling — din første kommando, og den skal stå i rapporten

Kør denne SQL og skriv tallene i rapporten, **før du ændrer noget**:

```sql
select 'applications.note' as felt, count(*) from applications where note ~ '[一-鿿]'
union all select 'applications.quote', count(*) from applications where quote::text ~ '[一-鿿]'
union all select 'robots.notes',       count(*) from robots where notes::text ~ '[一-鿿]'
union all select 'field_entries.caveat', count(*) from field_entries where caveat ~ '[一-鿿]'
union all select 'field_entries.note',   count(*) from field_entries where note ~ '[一-鿿]';
```

**Målt af mig 4. sep 2026, og uafhængigt af sessionen `udstilling-e0` samme morgen —
begge fik samme tal:**

| Felt | I dag | Efter dig |
|---|---|---|
| `applications.note` | **14** | **0** |
| `robots.notes` | **5** | **0** |
| `applications.quote` | 0 | 0 (kontrolgruppe — må ikke ændre sig) |
| `field_entries.caveat` | 0 | 0 (kontrolgruppe — `spor/f2han` ryddede dem; må ikke ændre sig) |
| `field_entries.note` | 0 | 0 (kontrolgruppe) |

**Afviger dine tal fra mine, så STOP og rapportér det, før du skriver noget.** En anden
session kan have rørt rækkerne.

**Baggrundstal, CITERET fra STATUS.md Å172 og ikke målt af mig i dag** (du skal ikke
efterprøve dem, og du skal ikke køre suiten): suiten på main står `1805 bestået / 9 fejlet`.
**Tre af de 9 er præcis de assertions, dit arbejde skal gøre grønne.** De øvrige 6 er ikke
dine — rør dem ikke.

---

## 2. Briefets fakta er påstande. At måle dem er en del af din leverance

Afviger noget, du måler, fra noget dette brief påstår, **skal afvigelsen i rapporten**.
Det er ikke ulydighed, det er leverancen. To tal i dette brief er allerede rettelser af
PLAN.md's egen beskrivelse — se punkt 3.

---

## 3. Planens forbehold, citeret ordret — og hvor planen tager fejl

`PLAN.md`'s fase 2-række siger ordret:

> *"kinesisk er det ikke: 19 rækker står tilbage — `applications.note` 14 · `robots.notes` 5,
> og de holder tre assertions i `tests/dele/42` røde. **17 af de 19 har allerede et
> ordlydsfelt udfyldt, så det er en fjernelse for dem og en flytning for Unitrees 2**"*

**Den sidste sætning er FORKERT, og jeg har målt det.** Det er **15 fjernelser og 4
flytninger**. Kommandoen, der viser det, splitter hver note i sammenhængende CJK-løb og
slår hvert løb op i det tilhørende ordlydsfelt:

```sql
with tekster as (
  select r.slug, 'applications.note' as felt, 0 as idx, a.note, a.note_wording as wording
  from applications a join robots r on r.id=a.robot_id where a.note ~ '[一-鿿]'
  union all
  select r.slug, 'robots.notes', i::int, n.v #>> '{}', (r.notes_wording -> ((i-1)::int)) #>> '{}'
  from robots r cross join lateral jsonb_array_elements(r.notes) with ordinality as n(v,i)
  where (n.v #>> '{}') ~ '[一-鿿]'
), loeb as (
  select t.slug, t.felt, t.idx, t.wording, m.run
  from tekster t cross join lateral regexp_matches(t.note, '[一-鿿]+', 'g') as m(run)
)
select slug, felt, idx, count(*) as cjk_loeb,
       count(*) filter (where wording is null or position(run[1] in wording)=0) as loeb_ikke_i_wording
from loeb group by slug, felt, idx, wording order by loeb_ikke_i_wording desc, slug;
```

**Dette er også dit vigtigste acceptkriterium — se punkt 7.**

**PLAN.md's andet forbehold, som gælder dig med fuld kraft:**

> *"Skriv derfor i ethvert fase 2-brief, at **'ingen kildeordlyd findes' er et gyldigt og
> forventet resultat**, og formulér acceptkriteriet, så det ikke belønner et højt tal."*

Det gør jeg hermed. **Punkt 6 er bygget på præcis den regel, og den er hele grunden til,
at det punkt findes.**

---

## 4. De 15 rene fjernelser

For disse står **hvert eneste CJK-løb i noten allerede i ordlydsfeltet**. Beviset er
bevaret; du fjerner tegnene fra den brugervendte tekst og rører ikke ordlyden.

**`applications.note` (12):** `cvte-maxhub-x7` · `genisom-gangben-l1` ·
`genisom-gangben-l1-w` · `genisom-gangben-l2` · `genisom-gangben-l2-w` ·
`genisom-gangben-l2-w-ultra` · `genisom-qiuqiu-sp1` · `genisom-tongchui-m1` ·
`genisom-tongchui-m1-pro` · `genisom-tongchui-m1-ultra` · `magiclab-magicdog-y1` ·
`yuejia-yj30-max-w`

**`robots.notes` (3):** `genisom-gangben-l2-w-ultra` element **1** ·
`microrobotech-movenew-t1` element **1** · `yufan-lingmao-cyvet` element **2**
*(1-indekseret, som SQL'en ovenfor tæller)*

### 4a. Fjernelse er en OMSKRIVNING, ikke en sletning — og der er allerede et bevis på, hvad der går galt

Et eksempel fra `genisom-gangben-l2`, ordret som noten står i dag:

> `From the section "下一个应用场景，它已提前就位" (next application scenario, already in place). 安防巡逻 -> security and surveillance; 科研教育 -> research and development; 短途配送 (short-distance delivery) -> logistics.`

`安防巡逻 -> security and surveillance` **mister sit grammatiske subjekt**, hvis tegnene
bare klippes ud. Resultatet skal være læsbar engelsk prosa, fx:

> `From the section headed "next application scenario, already in place". The manufacturer's four scenario labels map as follows: security patrol -> security and surveillance; research and education -> research and development; short-distance delivery -> logistics.`

**Beviset for, at den fælde er reel, ligger allerede i dataen.** `yuejia-yj30-max`
`notes[0]` lyder i dag ordret:

> `SAME MERGED-COLUMN PATTERN AS THE YJ30 FOR SLOPE: here the column is simply named  (climb angle) without the '/DOF' addition ...`

Et tidligere pas fjernede `爬坡角度` og efterlod **hullet foran parentesen**. Den skal du
også reparere — se punkt 5c.

**Regler for omskrivningen:**

1. **Den engelske gengivelse skal komme fra noten selv, fra ordlydsfeltet eller fra en
   anden note i kataloget, der allerede oversætter samme term.** `genisom-gangben-l1`s
   note oversætter fx `安防巡逻` til *"security patrol"* og `科研教育` til *"research and
   education"*. **Digte er forbudt — hård begrænsning 2.** Kan du ikke finde en gengivelse
   nogen steder, så beskriv termen funktionelt (*"the manufacturer's own label for the
   scenario"*) og **meld det i rapporten.**
2. **Ingen efterladte huller:** efter din ændring må ingen af de 19 noter indeholde
   `  ` (to mellemrum), `""`, `''`, `()`, ` ,`, ` ;`, `-> ;` eller en sætning, der
   begynder med `->`. Det er et acceptkriterium — se punkt 7, kriterium 3.
3. **Rør ikke ordlydsfeltet på de 15.** Dets indhold er beviset.

---

## 5. De 3 flytninger, hvor belægget FINDES i producentens egen arkiverede fil

Her er ordlydsfeltet tomt eller NULL, og tegnene skal flyttes derhen, før de fjernes fra
noten. **Jeg har slået hvert belæg op i `media/_kilder/` og skrevet filen ved siden af.**

### 5a. `unitree-a1` — `applications.note_wording` er **NULL**

Noten indeholder `消费级` og `科研` (i strengen `'消费级 / 科研'`).
**Belæg, målt af mig:** begge findes i Unitrees **egne** arkiverede filer —
`media/_kilder/raa-f2-unitree-2026-09-02/unitree-cn-forside-2026-09-02.html` og
`media/_kilder/raa-felt-eu-2026-08-19/unitree-forside-cn-2026-08-19.html`.

### 5b. `unitree-a2-w` — `applications.note_wording` er **NULL**

Noten indeholder `行业级`. **Belæg:** samme to Unitree-filer.

### 5c. `yuejia-yj30-max` — `robots.notes_wording` element **2** er `""`

`notes[2]` indeholder `基础参数`. **Belæg:** `基础参数` findes i Yuejias **egne** filer,
`media/_kilder/raa-kand4-2026-08-25/yuejialingdong-yj-5{6,7,8,9}-2026-08-25.html`.
**Du skal afgøre, hvilken af de fire der er YJ30 Max's egen side** — og skrive i
rapporten, hvordan du afgjorde det. **`raa-kand4-2026-08-25/` har INGEN `MANIFEST.tsv`**
(målt af mig), så URL'en står ikke noteret; det er i sig selv et fund, du skal melde.

**Samtidig, i samme række:** reparér `notes[0]`s hul (punkt 4a). `notes_wording[0]` er
allerede `爬坡角度`, og det belæg findes i de samme Yuejia-filer, så der er intet at
flytte — kun hullet i den engelske prosa skal lukkes med *"climb angle"*.

### 5d. Reglen, der gælder alle tre — og hvorfor den findes

**Ordlyden skal være en BOGSTAVELIG delstreng af producentens EGEN arkiverede fil.**
Verificér det med `indexOf`, ikke i hovedet. `db/f2-cjk-skriv.mjs` gør allerede præcis
det (se dens hovedkommentar) og fandt to tegnkorruptioner på den måde — `・` (U+30FB)
blevet til `•` (U+2022), og `。` (U+3002) til `.`.

**Å171's regel, som punkt 6 er bygget på:** *"Et træf i 'en kinesisk fil' beviser
ingenting; det skal være DENNE producents fil."*

**Databasens CHECK-betingelser, målt af mig — kend dem, før du skriver:**
`anvendelse_note_ordlyd_ikke_tom` (`note_wording` skal være NULL eller ikke-blank —
**tom streng er forbudt**) · `anvendelse_note_ordlyd_kraever_note` (`note_wording` kræver
en ikke-blank `note`) · `robotter_noter_ordlyd_form` (`notes_wording` skal være et
jsonb-**array**). **Validatorens R21 kræver desuden, at `noter_ordlyd` har PRÆCIS samme
længde som `noter`** — `""` er markøren for "denne note har ingen ordlyd". Ændr aldrig
arrayets længde.

---

## 6. Den fjerde flytning er et FUND, ikke en flytning — og her må du IKKE fylde feltet

### `xiaomi-cyberdog-1`, `robots.notes` element **2**

Noten bærer **tre** CJK-løb: `立即购买`, `加入购物车`, `已售罄`.
`notes_wording[2]` bærer i dag **kun `立即购买`**.

**Jeg har slået alle tre op i `media/_kilder/`, og resultatet er ikke, hvad det ser ud til:**

| Term | Findes i Xiaomis egne arkiverede filer? |
|---|---|
| `立即购买` | **JA** — `raa-anvendelse-2026-08-19/xiaomi-cyberdog1-produktside-cn-2026-08-21.html` og `-specside-cn-`. |
| `加入购物车` | **NEJ.** Findes kun i **Yufan/uniubi**-filer — en helt anden producent |
| `已售罄` | **NEJ. Findes i NUL arkiverede filer overhovedet** |

**Og noten forklarer selv hvorfor:** den siger ordret, at `加入购物车` blev talt til
**0 forekomster** og `已售罄` til **0**. De to er altså **vores egne søgetermer** — de
strenge, indsamleren ledte efter og ikke fandt. **De er ikke Xiaomis ord, og de må derfor
ALDRIG ind i `notes_wording`.**

**Hvad du skal gøre:** omskriv `notes[2]` så de to termer navngives på engelsk
(*"the add-to-cart button"*, *"the sold-out marker"*), og **lad `notes_wording[2]` stå
uændret som `立即购买`**.

**Hvorfor det er den vigtige del af hele sporet:** dette er nøjagtig den tredje kategori,
`spor/f2han` fandt og **droppede** (STATUS.md Å171): *"indsamlerens egen glose eller en
krydshenvisning til et ANDET produkt"*. At flytte dem til ordlydsfeltet ville **opdigte
falsk proveniens** — det ville påstå, at Xiaomi skrev noget, Xiaomi beviseligt ikke skrev.
Å171 igen: *"Et opdigtet bevis er værre end intet bevis, fordi det **stopper
eftersøgningen**, og ingen test kan fange det."*

**Finder du under arbejdet flere rækker af samme slags — en term i en note, som ikke
findes i producentens egen fil — så behandl dem på samme måde og MELD dem.** Et lavt tal
i ordlydsfelterne er et rigtigt resultat, ikke et dårligt.

---

## 7. Acceptkriterier — alle KØRT mod main af mig, med dagens output

**Kriterium 1 — de brugervendte felter er rene.** Kommandoen er grundmålingens SQL
(punkt 1).
*Giver i dag:* `applications.note` **14**, `robots.notes` **5**.
**Færdig når:** begge er **0**, og de tre kontrolgrupper stadig er **0**.

**Kriterium 2 — intet bevis er gået tabt.** Kør SQL'en fra punkt 3 **før** du begynder og
gem resultatet i `fund/cjkrest-foer.json` i worktreen. Kør den igen bagefter.
*Giver i dag:* 19 rækker, hvoraf 4 har `loeb_ikke_i_wording > 0`
(`unitree-a1` 2, `xiaomi-cyberdog-1` 2, `unitree-a2-w` 1, `yuejia-yj30-max` 1).
**Færdig når:** For hvert CJK-løb, der stod i en note FØR, gælder **enten** at det står i
det tilhørende ordlydsfelt bagefter, **eller** at det står på din liste i punkt 6 som
"ikke producentens ord, belæg mangler i producentens egen fil" med filsøgningen skrevet ud.
**Tredje mulighed findes ikke.** Et løb, der bare forsvinder uden en af de to forklaringer,
er en fejl.

**Kriterium 3 — ingen efterladte huller.** For hver af de 19 rækker, kør efter din
ændring:

```sql
select slug, felt, idx, note from (…punkt 3's "tekster"-CTE…) t
where note ~ '(  |""|''''|\(\)| ,| ;|-> ;)';
```
*Giver i dag:* **1 række** — `yuejia-yj30-max` `notes[0]` (det eksisterende hul, punkt 5c).
**Færdig når:** **0 rækker.** *(Bemærk: kriteriet giver 1 og ikke 0 i dag netop fordi
fælden allerede er sprunget én gang — det er kriteriets egen kontrolgruppe.)*

**Kriterium 4 — hver ordlyd, du SKRIVER, er en bogstavelig delstreng af producentens egen
fil.** Skriv i rapporten, for hver af de 3 flytninger: termen, filens sti, og
`indexOf` ≥ 0.
**Færdig når:** 3 af 3 verificeret, og filen tilhører **den producent, rækken handler om**.

**Kriterium 5 — talkolonner og kontrolgrupper er urørte.**
```sql
select count(*) from field_entries;  -- giver i dag: mål det selv og skriv tallet
select count(*) from applications;   -- do.
select count(*) from robots;         -- giver i dag: 77
```
**Færdig når:** alle tre er uændrede fra din egen grundmåling.

---

## 8. Filejerskab

**Du skriver i:**
- **Databasen:** `applications.note`, `applications.note_wording`, `robots.notes`,
  `robots.notes_wording` — **og intet andet.** Disse fire kolonner er dine alene;
  `udstilling-e0` har meldt, at det ikke rører databasen.
- `db/f2-cjkrest-skriv.mjs` — **nyt** skriveredskab, dit alene. Byg det efter mønsteret i
  `db/f2-cjk-skriv.mjs` (læs den først): `--verificer` (kildetjek, ingen netværk),
  `--toerloeb` (standard, viser hvad der VILLE ske), `--skriv`.
- `fund/BRIEF-cjkrest.md` (denne fil), `fund/FUND-cjkrest.md` (din rapport),
  `fund/cjkrest-foer.json`.

**Du rører IKKE:** `data/robots/` (jeg eksporterer bagefter) · `tools/` · `tests/` ·
`assets/` · `STATUS.md` · `PLAN.md` · `field_entries` · `images` · nogen skabelon.
`assets/system.css` og `assets/generator.css` ejes lige nu af `udstilling-e0`s to spor.

**Du kører IKKE:** `tests/koer.mjs`, `tools/build.mjs`, `db/eksporter.mjs`. Disken er
den hårde grænse (23 GB fri, én suitekørsel er ~2,8 GB, og to andre spor kører). Jeg
kører alle tre mod main bagefter.

---

## 9. Commits — rækkefølge og grænser

1. Skriveredskabet `db/f2-cjkrest-skriv.mjs` + `fund/cjkrest-foer.json` (grundmålingen),
   **før nogen skrivning mod databasen.**
2. De 15 rene fjernelser (punkt 4).
3. De 3 flytninger (punkt 5), inkl. reparationen af `yuejia-yj30-max` `notes[0]`.
4. `xiaomi-cyberdog-1`-omskrivningen (punkt 6) — **egen commit**, fordi det er en
   beslutning og ikke en mekanisk rettelse.
5. `fund/FUND-cjkrest.md`.

**Commit undervejs.** Dør sporet, skal dets arbejde ligge der.

---

## 10. Rapporten

`fund/FUND-cjkrest.md`, højst **60 linjer** plus de to obligatoriske sektioner uden for
loftet (*"Nye fælder og opdagelser"* og *"Punkter i briefet, jeg ikke nåede"*).

**Skriv ÆNDRINGEN først, ikke målemetoden.** JPK's ord 3. sep 2026: rapporter i samtalen
skal vise, hvad der konkret ændrer sig, før de viser, hvordan det blev målt. Begynd derfor
med en før/efter-tabel over de 19 rækker, og læg måling, konfidens og forbehold bagefter.

**Konfidens er bundet til bevistype, ikke fornemmelse.** **Høj** kræver en genkørbar
kommando **plus** en kontrafaktisk linje.

**Tre ting skal stå i rapporten, uanset hvad:**
1. Din liste over de termer, du **ikke** kunne belægge i producentens egen fil (punkt 6),
   med den søgning, der viser det.
2. Hvilken Yuejia-fil du valgte som YJ30 Max's, og hvordan du afgjorde det.
3. Hver afvigelse mellem dine målinger og dette briefs påstande.
