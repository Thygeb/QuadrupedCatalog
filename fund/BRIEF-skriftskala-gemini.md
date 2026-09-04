# BRIEF — R5: én skriftskala for hele sitet

**Til:** Gemini. **Gren:** `spor/skriftskala`. **Worktree:**
`c:\Praktik\websites\udstilling-wt-skriftskala` (**ikke oprettet endnu** — se *Opsætning*).
**Rapport:** `fund/FUND-skriftskala.md`.

Dette er planens **sidste** ubyggede punkt og det største. Alle tal er målt af mig på main
`a54fa2f`, 4. sep 2026. **Alle tal er påstande. Afviger noget, du måler, fra noget briefet
siger, så skriv afvigelsen i rapporten — det er en del af leverancen, ikke ulydighed.**

---

## Problemet, målt

```
grep -rhoE "font-size: *[^;}]+" assets/system.css assets/generator.css | wc -l          222
  ... | sed 's/font-size: *//' | sort -u | wc -l                                         55
grep -rhoE "font-size: *[0-9.]+px" ... | sort -u | wc -l                                 29
grep -rhoE "font-size:[^;}]*!important" ... | wc -l                                       4
```

**222 erklæringer. 29 forskellige rene px-værdier. Og det afgørende tal: 19 af dem ligger
i spændet 9-20px:**

```
9  9,5  10  10,5  11  11,5  12  12,5  13  13,5  14  14,5  15  15,5  16  17  18  19  20
```

**Nitten trin over elleve pixels.** Halvpixeltrin kan ikke ses. Et hierarki, læseren ikke
kan se, er ikke et hierarki — det er 19 tilfældige tal, der hver især blev valgt, fordi de
så rigtige ud dén dag. Dertil 8 `clamp()`- og 8 `max(8px, …em)`-erklæringer, som hver
især er rimelige og tilsammen gør skalaen uoverskuelig.

**Advarsel om mit eget måletal:** mit `grep` fanger også ordet `font-size` inde i
CSS-**kommentarer** — værdilisten indeholder strengen `de 11px er dens egne.`, som er
kommentartekst. **Din første opgave er derfor at måle det ordentligt** (se leverance 1).
Mine 55/29/19 er retningsgivende, ikke facit.

---

## MODE — og hvorfor det gør en forskel her

**Sitet har to MODE'er, og de har hver sit succeskriterium:**

- **Operate** — den besøgende løser en opgave: **katalogsiden** og **sammenligningssiden**.
  Her tjener typografien scanning: mange små, ensartede etiketter, hvor forskellen mellem
  to trin skal kunne ses på et halvt sekund.
- **Read** — den besøgende skal forstå noget: **robotsiden**, **producentsiden**, **Om os**.
  Her tjener typografien læsning: lange linjer, rolig rytme, få trin.

**Én skala skal dække begge.** Skriv i rapporten, hvilket trin der bærer hvilken rolle i
hvert MODE — det er dér, en skala enten holder eller falder fra hinanden.

---

## Det, der er LÅST og ikke må røres

**Bryder du én af disse, er sporet afvist uanset hvor godt resten er.**

1. **Skriften og paletten er låst.** TYPESKILT er den gældende retning. Foreslå ingen ny
   skrift, ingen ny familie, ingen ny vægtakse, ingen ny farve. Du ændrer **størrelser og
   deres system**, ikke skriften.
2. **DP3b — trinnet `Række` (14px)** er en truffet beslutning. Slå den op i
   `DESIGN.md:637` og lad den overleve, uanset hvilken skala du bygger.
3. **DP3c — skriftgulvet på 10,5px** med sin dokumenterede rækkevidde. `DESIGN.md:692`.
   **Ingen tekst, en læser møder, må ende under gulvet.** Undtagelserne står i afsnittet;
   udvid dem ikke.
4. **De fire datatilstande har eksakte mål**, og de er systemets kerne (hård begrænsning
   5: *"'Ikke oplyst', 'nej' og '0' er tre forskellige tilstande og skal se forskellige
   ud"*). `DESIGN.md:947`. `.v-nej` er fx *fast 10,5px, versaler, 0,13em spatiering*.
   **Ændrer du et af de mål, skal det stå som et eksplicit forslag i rapporten — ikke
   som en stille konsekvens af skalaen.**
5. **Ret assertions, slet dem ikke.** Går en test rød, fordi den låser en skriftgrad, så
   **læs testens NAVN først**. Bærer det et L-nummer, en dato eller en
   beslutningshenvisning, er testen det sidste sted, beslutningen findes — vend den, så
   den beviser den nye regel, og citér R5 i det nye navn. **Sænk aldrig et krav for at få
   noget grønt.**

**Læs kun disse afsnit i `DESIGN.md`** (den er 1.411 linjer — læs ikke det hele):
`:575` Typografi · `:602` Hierarki · `:637` DP3b · `:692` DP3c · `:947` De fire
datatilstande · `:717` Navngivne regler.

---

## Leverance 1 — mål skalaen ordentligt, før du rører den

**Skriv `tools/maal-skrift.mjs`** (afhængighedsfri, kun Node-indbyggede moduler), som
**parser erklæringer og ikke tekst** — altså springer kommentarer over.

Den skal skrive: hver unik `font-size`-værdi, hvor mange gange den bruges, og hvilke
selektorer der bruger den, for begge stilark.

**Acceptkriterium 1:** færdig, når `node tools/maal-skrift.mjs` kører og udskriver en
tabel, og du i rapporten har skrevet **dit** tal for unikke værdier ved siden af **mit**
(55/29/19) med en linje om, hvorfor de afviger.
*Giver i dag: værktøjet findes ikke.*

**Det er ikke bureaukrati. Det er sporets måleapparat**, og resten af arbejdet dømmes på
tal, det producerer. Et forkert apparat giver plausible tal, og så opdager ingen fejlen.

---

## Leverance 2 — byg skalaen som tokens

**Definér skalaen ét sted**, i `:root` i `assets/system.css`, som navngivne tokens efter
mønsteret, filen allerede bruger til farver og afstande. Hver `font-size` i begge stilark
skal derefter **resolve gennem et token**, ikke gennem et tal.

**Antallet af trin er DIT valg og skal begrundes** — jeg skriver bevidst intet måltal, for
et hårdkodet tal her ville være et gæt forklædt som et krav. Men begrundelsen skal svare på:
hvilke to trin var før forskellige og er nu det samme, og hvad tabte læseren ved det?

**Acceptkriterium 2:** færdig, når antallet af rå px-literaler i `font-size`-erklæringer
uden for skaladefinitionen er **0** — målt med dit eget værktøj fra leverance 1.
*Giver i dag: 29 unikke rene px-værdier, alle rå.*

**Acceptkriterium 3:** færdig, når `clamp()`- og `max()`-erklæringerne enten er udtrykt
gennem skalaen eller står tilbage med **én linje begrundelse hver** i rapporten.
*Giver i dag: 8 `clamp()` og 8 `max(8px, …em)`, ubegrundede.*

**Acceptkriterium 4 — `!important` er et symptom.** De 4 nuværende
`font-size: … !important` findes, fordi to regler kæmper. Færdig, når du i rapporten har
skrevet, hvilken specificitetskonflikt hver af dem dækker over, og om skalaen fjerner den.
*Giver i dag: 4, alle uforklarede.*

---

## Leverance 3 — bevis, at siden ikke blev værre

**Skærmbilleder før og efter, ved 1440 px og 390 px, på begge sprog**, af mindst disse
fire flader (én pr. MODE-par):

```
/da/katalog/            Operate     /da/robotter/unitree-go2/       Read
/da/sammenligning/      Operate     /da/producenter/unitree-robotics/  Read
```

**Acceptkriterium 5:** færdig, når rapporten bærer de otte før/efter-par og **for hvert
par én sætning om, hvad der blev bedre og hvad der blev ringere.** *"Ingen forskel"* er et
gyldigt svar for en flade — men så skal det stå, for en skala, der ikke ændrer noget
synligt, har heller ikke løst noget.

**Acceptkriterium 6 — gulvet holder.** Ingen tekst under 10,5px ud over DP3c's
dokumenterede undtagelser, målt i browseren med `getComputedStyle` på de fire flader,
begge bredder.
*Giver i dag: 9px og 9,5px findes begge i stilarkene — mål selv, om de når skærmen.*

**Acceptkriterium 7 — apparatet er grønt.**
`node tools/validate.mjs` → 77 filer / 0 fejl / 1 advarsel.
`node tools/build.mjs` → 216 sider, 1.111 tal med kilde, 0 uden.
`node tests/koer.mjs` → **samme antal røde som din egen grundmåling, plus 0.**
*Mine tal fra det flettede main i dag: 77/0/1 · 216/1.111/0 · **1817 bestået / 6 fejlet**.
Tag din egen grundmåling — mine er en forudsigelse for din base, ikke et facit.*

**SAMMENLIGN FEJLTEKSTERNE, IKKE NETTOTALLET.** Skriv de røde testnumre **ved navn** i din
grundmåling og igen til sidst, og sammenlign de to lister. `9 → 8` ser ens ud, uanset om
én test blev grøn, eller tre blev grønne og to nye blev røde.

**De 6 kendte røde, som ikke er dine:** `4c` (Spots strøm ud) · 2 forbehold mærket
"gyldighed" · 1 fixture (`addverb-trakr-20`) · 2 × `64.3` (`unitree-aliengo`).

---

## Filejerskab

**Du ejer og må skrive i:**

- `assets/system.css` og `assets/generator.css` — kun `font-size` og skalaens tokens.
- `tools/maal-skrift.mjs` — ny fil.
- `tests/` — kun tests, der låser en skriftgrad, og kun for at **vende** dem. Nye tests i
  egen fil efter kontrakten i `tests/LAESMIG.md`.
- `DESIGN.md` — kun Typografi-afsnittet (`:575-724`).
- `fund/FUND-skriftskala.md` og skærmbilleder i `fund/`.

**Du må IKKE røre:** `tools/build.mjs` · `tools/validate.mjs` · `tools/yaml.mjs` ·
`tools/skabelon/` · `tests/dele/_faelles.mjs` · `tests/koer.mjs` · `data/` · `db/` ·
`STATUS.md` · `CLAUDE.md` · `PLAN.md` · `.claude/`.

**Ét andet spor kører:** `spor/fase3` ejer `tools/build.mjs`, `tools/validate.mjs`,
`tests/dele/_faelles.mjs`, `tests/koer.mjs`, `db/hent.mjs` og `data/robots/`. **Du kører
dem, du ejer dem ikke.** Ingen af dine filer er på dets liste.

---

## Miljø

- **`node` er ikke på PATH i Git Bash.** Brug `"/c/Program Files/nodejs/node.exe"`.
- **Din port er 8128.** Aldrig 8080 — den deles, og en fremmed servers svar ser præcis ud
  som dit eget. Start fra worktree-roden med fuld sti:
  `/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m http.server 8128 --directory dist`
  **Aldrig `cd dist`** — så låser serveren mappen, og næste byg fejler med EPERM.
- **Verificér serveren mod disken, før ét eneste tal bruges:** vælg en streng, der kun
  findes i din udgave, og sammenlign `curl -s http://localhost:8128/system.css | grep -c`
  med `grep -c` på filen. **En server er et måleapparat.**
- **Browsermåling:**
  `node C:/Praktik/websites/maalevaerktoej/maal.mjs <url> [bredde]`
  `node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs <url> <bredde> <udfil.png>`
- **Kør `node tools/build.mjs` FØR din grundmåling.** `dist/` er gitignoreret og mangler i
  en frisk worktree; 13 tests spørger, om en side *er* bygget, og uden bygget måler du dit
  miljø i stedet for dit arbejde.
- **Disk:** hver `tests/koer.mjs` koster ~2,8 GB i din worktrees `tests/.tmp-koersel`.
  **Kør suiten højst tre gange** — grundmåling, midtvejs, slut.
- **`sed -i`, der ikke matcher, gør intet — tavst og med exit 0.** Efterprøv med `grep`.
- **Skriv filer med UTF-8 uden BOM.**

## Commit-rækkefølge

1. `tools/maal-skrift.mjs` — ét commit, **før** du rører en eneste `font-size`.
2. Skalaens tokens i `:root` — ét commit.
3. Omskrivningen af `system.css` — ét commit.
4. Omskrivningen af `generator.css` — ét commit.
5. Vendte tests — ét commit.
6. DESIGN.md's typografiafsnit — ét commit.
7. Rapport og skærmbilleder — ét commit.

**Commit undervejs.** Dette er sitets største enkeltændring i CSS, og et spor, der dør
uden commits, efterlader ingenting. **Flet ikke, og push ikke.**

---

## Rapporten

`fund/FUND-skriftskala.md` skal bære: **(a)** din grundmåling med de røde testnumre ved
navn · **(b)** dit måletal mod mit · **(c)** skalaen med begrundelse for antallet af trin
· **(d)** de syv acceptkriteriers faktiske tal · **(e)** de otte før/efter-par med én
sætning hver · **(f)** hvad du **ikke** nåede · **(g)** hvad du er **usikker** på.

**En rapport, der kun indeholder det, der lykkedes, kan ikke bruges til at beslutte noget.**

## Opsætning (orkestratorens, ikke din)

```
git worktree add ../udstilling-wt-skriftskala -b spor/skriftskala
cp .env ../udstilling-wt-skriftskala/.env
cp -r assets/fotos/fabrikant ../udstilling-wt-skriftskala/assets/fotos/fabrikant
```

`.env` og `assets/fotos/fabrikant/` (610 filer, 60 MB) er gitignorerede og følger **ikke**
med worktreen. Uden dem fejler `validate.mjs` på manglende billeder med fejl, der ligner
sporets egne — to spor er allerede snublet over det.
