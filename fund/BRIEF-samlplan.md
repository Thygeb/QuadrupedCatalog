# BRIEF — `spor/samlplan`: fladeplan for sammenligningssiden

**Model: opus** (designspor, L45). **Worktree:** `C:/Praktik/websites/udstilling-wt-samlplan`,
gren `spor/samlplan`, forgrenet fra `44fec14`.

## Første handling

**Kald `spor`-skillen.** Den bærer grundmålingen, skrive-grænsen, kontrollinjen,
filejerskabet, selv-efterprøvningen, rapportformen og miljøfælderne. Lykkes kaldet ikke fra
din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du
gjorde det**.

**Kald derefter `impeccable shape`** — L70: designarbejde går gennem impeccables flows.
Diskstien som reserve: `C:/Users/thyge/.claude/skills/impeccable/SKILL.md`. Samme
rapportkrav, hvis den læses fra disk.

## Leverancen

Én fil: **`fund/PLAN-sammenligning.md`**. Ingen kode, ingen CSS, ingen skabelonændring.
Du ejer **kun** den fil. Rører du noget andet, er det en fejl — også en "lille rettelse".

**MODE: Operate.** Den besøgende løser en opgave: at afgøre, hvilken robot der passer.
Ikke Read. Planen skal navngive det og dømme hvert forslag efter det.

## Fladens tilstand, målt af mig 3. sep 2026 — påstande, du skal efterprøve

Tabellen tegnes af `assets/sammenligning.js` i browseren (`<table class="saml-matrix">`),
ikke af en skabelon. Den statiske side er kun en skal. Tilstanden i localStorage, ikke i URL.

| Måling | Tal | Hvor |
|---|---|---|
| `table-layout` i begge stilark | **0 forekomster** → tabellen kører på `auto` | `generator.css`, `system.css` |
| Rækkestregen findes allerede | `.saml-raekke > *{border-top:1px solid var(--linje)}` | `generator.css:604` |
| `--linje` = rille `#C6CCD1` på panel `#FAFBFB` | **1,56:1** | regnet af mig, token mod token |
| `--hegn` = støvgrå `#9AA3A9` på samme | **2,47:1** | samme |
| WCAG 1.4.11, ikke-tekstligt indhold | krav **3,0:1** | begge ligger under |
| `var(--linje)` bruges i alt | **70** (31 system + 39 generator) | systemomfang, ikke lokalt |
| `id="enhedsskift"` på sammenligningssiden | **1** | og 71 på robotsider, 0 på de øvrige |

**Mine kontrasttal er regnet på tokens, ikke målt i browseren — konfidens middel.**
Efterprøv dem i den styrbare browser (`mcp__playwright__*`) mod den faktiske baggrund bag
stregen, og skriv dine egne tal. **Et kontrasttal uden en læseretning er ikke et tal.**

## Tre LÅSTE krav fra JPK, 3. sep 2026 — ikke forslag, ikke til afvejning

**K1. Kolonnerne skal være lige brede.** Ordret: *"På denne side skal kolonnerne være lige
bredde."* I dag er de det ikke: `table-layout:auto` giver indholdsbestemt bredde, og
`width:100%` lader sidste kolonne sluge resten — på JPK's skærmbillede er C1-kolonnen
omtrent dobbelt så bred som de to tomme WEILAN-kolonner.

Planen skal foreskrive **hvordan**, ikke bare **at**. Kandidaten er `table-layout:fixed`
afgrænset til `.saml-matrix` plus en eksplicit bredde på rækkehoved-kolonnen. **Men den er
ikke gratis, og planen skal tage stilling til begge:** den klæbende venstrekolonne
(`.saml-gruppe__titel{position:sticky;left:0}`) og `.saml-matrix{min-width:640px}` på smalle
skærme (`generator.css:664`). Beskriv, hvad der sker ved 2, 3, 4 og 5 valgte robotter, og
ved 390 px.

**K2. Vandrette skillelinjer — JPK spurgte, om jeg anbefaler dem.** Mit svar, som planen skal
tage stilling til og gerne modsige med bedre argumenter: **nej, ikke flere linjer.** De
findes, og de kan bare ikke ses (1,56:1 mod kravets 3,0). 33 rækker med ens fuldbredde-streger
bliver et bur. Mit forslag er tredelt — løft rækkestregen til mindst 3,0:1, gør
**gruppeskellet** til den kraftige streg og rækken til hårstreg, så der opstår hierarki, og
tilføj **rækkemarkering ved hover/fokus**, fordi det, øjet faktisk mangler på en 1.700 px
bred række, er at kunne følge én række på tværs.

**Dette er JPK's spørgsmål, ikke hans instruks.** Er din analyse en anden, så skriv den — men
med målte tal, ikke med smag.

**K3. Enhedskontakten skal være en fast del af topbaren.** Ordret: *"metric-imperial knappen
skal være en fast del af topbaren. lige nu lever den kun på sammenligningssiden."* Målt:
den står på **72 af 107** danske sider (71 robotsider + sammenligningssiden) og tegnes af
`robot.mjs` og `sammenligning.mjs`; `side.mjs`, som ejer topbaren, tegner den **0** gange.
Topbaren selv står på **107 af 107**.

**Beslutningen, planen skal forelægge:** flyttes den til topbaren, står den også på Om os og
404, hvor der ikke findes ét tal at omregne. Altid synlig (konsistent, død to steder) eller
kun hvor der er noget at skifte (nyttig, men flytter sig)? Skriv begge muligheder med deres
pris. **Du implementerer den ikke** — den hører i systemdeltaet.

## SYSTEMÆNDRING — obligatorisk sektion, og planen afvises uden den

Sammenligningssiden deler komponenter med de andre skærme. Målt af mig i `dist/da`:

| Komponent | Skærme |
|---|---|
| `stans` ("ikke oplyst") | **alle seks** |
| `kort` | katalog · robot(77) · prod(25) · om |
| `knap` | katalog · robot(70) · 404 |
| `tabel` | robot(77) · prod(1) |
| `var(--linje)` | **70 brug på tværs af begge stilark** |

**Foreslår du en ændring af noget på den liste, skal `SYSTEMÆNDRING` navngive hvilke ANDRE
skærme forslaget så gælder for, og hvad det koster dér.** Jeg samler alle fladeplaners
systemdeltaer til ét, før noget bygges. Uden sektionen gentager vi Å103: fire planer, der hver
opfinder sin egen knap.

`--linje` er det skarpeste eksempel: en ændring af hårstregen er ikke en
sammenligningssidebeslutning, den er en systembeslutning med 70 kaldsteder.

## Hårde begrænsninger, der gælder uændret

1. **"Ikke oplyst", "nej" og "0" er tre forskellige tilstande** og skal se forskellige ud.
   `stans`-kassen på JPK's skærmbillede er den mekanisme — den må ikke forsvinde i en
   oprydning. Det er dér, katalogsider lyver.
2. **Opfind aldrig tal.** Planen må ikke foreslå udfyldning af tomme celler.
3. **TYPESKILT er låst.** Paletten er ikke til forhandling; en kontrastrettelse skal være en
   **systemregel om, hvor et token må bruges**, ikke "vælg en anden farve".
4. **Ingen forhandleraftale.** Ingen købsknap, intet affiliate-link.

## Acceptkriterier — kørt mod main af mig 3. sep, med "giver i dag X"

1. `ls fund/PLAN-sammenligning.md` → **findes ikke i dag**, skal findes bagefter.
2. `grep -c 'SYSTEMÆNDRING' fund/PLAN-sammenligning.md` → giver i dag **0**, skal være ≥1.
3. `grep -ci 'Operate' fund/PLAN-sammenligning.md` → giver i dag **0**, skal være ≥1.
4. `git status --short` i din worktree → skal vise **præcis én** fil ud over dine commits.
5. `git diff --name-only main...spor/samlplan` → skal give **præcis** `fund/PLAN-sammenligning.md`
   og `fund/BRIEF-samlplan.md`. Alt andet er en ejerskabsfejl.
6. Planen skal svare på K1, K2 og K3 hver for sig, med overskrift. Kontrol:
   `grep -c '^## K[123]' fund/PLAN-sammenligning.md` → **3**.

## Miljø

- **node:** `/c/Program Files/nodejs/node.exe` — ikke på PATH i Git Bash. Bar `node` giver
  **exit 127**, som ligner libuv-fælden men er bash' `command not found`. Læs fejlteksten.
- **Din serverport er 8141.** Aldrig 8080 — den deles med andre spor. Verificér serveren mod
  disken, før ét tal bruges: vælg en streng, der kun findes i din udgave, og sammenlign
  `curl` mod `grep`. **Luk serveren, når du er færdig med at måle, og skriv i rapporten, at
  du gjorde det.**
- **Kør ikke `tests/koer.mjs`.** Du ændrer ingen kode, og en kørsel koster 2,8 GB disk, mens
  fire fase 2-worktrees står. Grundmålingen er `validate.mjs` alene.
- Skriv UTF-8 **uden** BOM. Commit-beskeder med backticks: `git commit -F <fil>`.
- `sed -i`, der ikke matcher, fejler **tavst med exit 0**. Brug Edit-værktøjet.
- **Commit undervejs** — ét commit pr. sammenhængende afsnit. To spor er døde uden en linje.

## Rapporten — `fund/FUND-samlplan.md`, højst 60 linjer

Valgt/fravalgt løsning · konfidens pr. punkt (høj kræver genkørbar kommando **plus** én linje
om, hvad tallet ville have været, hvis arbejdet var forkert) · usikkerheder · målinger som
tal. **Uden for de 60, obligatorisk:** "Nye fælder og opdagelser" og "Punkter i briefet, jeg
ikke nåede" — én linje pr. punkt, og skriv eksplicit, hvis der ingen er.

**Briefets fakta er påstande.** Afviger noget, du måler, fra noget jeg har skrevet, så
rapportér afvigelsen — det er en del af leverancen, ikke ulydighed. Tre spor rettede mine
fakta 2. sep; det var dagens billigste kvalitetskontrol.
