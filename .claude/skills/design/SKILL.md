---
name: design
description: Navigationskortet til DESIGN.md, projektets designsystem. Kald den HVER gang noget visuelt skal bygges, bedømmes, kritiseres eller planlægges — en ny flade, en rettelse i CSS, en farve, en skriftgrad, en komponent, en datatilstand — og hver gang et brief til et designspor skrives. Den kopierer ingenting fra DESIGN.md; den fortæller, hvilket afsnit der svarer på hvilket spørgsmål, så et spor læser 40 linjer i stedet for 1.628. Bærer desuden de tre regler, der gælder ved ALT designarbejde: palettelåsen, MODE-navngivningen og de fire datatilstande. (Designfrysen er ophævet, L98.)
---

# design — find det rigtige afsnit i DESIGN.md, og kopiér det aldrig

**DESIGN.md er sandheden om, hvordan siden skal se ud og opføre sig.** JPK's ord
3. sep 2026: *"DESIGN.md beskriver hvordan websiden skal være designet, for at
sikre konsistens og standardisering af websidens udseende og funktionalitet."*

Denne skill er et **kort over den fil**, ikke et resumé af den.

## Hvorfor der ikke findes et destillat, og hvorfor du ikke skal lave et

Genmålt 4. sep 2026 kl. 23: DESIGN.md er **86 KB ≈ 26k tokens** (her stod *"42 KB ≈ 12,5k"*
fra 3. sep — filen voksede 71 % på ét døgn). **STATUS.md 508 KB ≈ 154k** (her stod
416 KB). Til sammenligning CLAUDE.md 47 KB.

**Argumentet holder alligevel, og det er derfor tallet er rettet frem for fjernet:**
DESIGN.md er stadig **~14 %** af STATUS.md og ~4 % af et opus-spors budget. Den er
ikke, hvor tokenerne går. Men bemærk retningen — vokser filen i samme tempo en uge
mere, skal regnestykket tages op igen. **Genmål det, i stedet for at citere denne
linje.**

Tre grunde til, at et destillat er en dårlig handel, selv når det ser billigt ud:

1. **Det er kopi nummer to.** CLAUDE.md: *"Skriv aldrig reglerne af i hånden ind
   i en agentprompt. Peg på skillen. Tre håndskrevne kopier af samme regel
   divergerer ved den fjerde."* Et destillat af designsystemet er præcis den
   fælde, ét lag længere ude.
2. **Værdien ER detaljen.** DESIGN.md siger, at `.v-nej` er *"fast 10,5px,
   versaler, 0,13em spatiering, udfyldt 9×9px firkant"*. Et destillat, der
   beholder den slags, er lige så stort som originalen. Et, der skærer den væk,
   efterlader *"nej skal se anderledes ud"* — og så er vi tilbage ved den
   generiske AI-frontend, systemet skulle forhindre.
3. **Filen advarer selv.** DESIGN.md om løste konflikter: *"en løst konflikt, der
   slettes, efterlader ingen forklaring på, hvorfor koden ser ud, som den gør."*

**Peg på afsnit i stedet.** Et spor, der læser 40 linjer i stedet for 1.628, sparer
95 % — og ingen kopi kan divergere.

---

## De tre regler, der gælder ved ALT designarbejde — og den fjerde, der er ophævet

Disse står her, fordi de gælder hver gang og ikke kan slås op ét sted i
DESIGN.md. Alt andet i denne skill er henvisninger.

### 1. DESIGNFRYSEN ER OPHÆVET (L98, JPK 4. sep 2026)

**JPK, ordret: *"OPHÆV REGLEN."*** L70's frys gjaldt fra 1. sep og faldt, da
den overordnede designplan fandtes og blev bygget. **Designfund må rettes, og
alle 23 impeccable-kommandoer er lovlige** — også de 16, der retter fladen.
Rejs ikke frysen igen, og bed ikke om lov til at rette et designfund.

**Kravet, der IKKE faldt med den:** rører rettelsen en systembeslutning — en
palettefarve, en skriftgrad, en radius, et token — så er den en **systemregel**
og skal skrives som en. Rører den kun én flade, så ret den. Frysen tvang den
skelnen frem; nu skal den holdes uden tvang.

Fælden, frysen lukkede, gælder stadig: **et designfund kan LIGNE en almindelig
fejl.**
Eksemplet: afmærkningsgul som tekstfarve giver **1,38:1** mod WCAG's 4,5. Det
ser ud som en fejl, der bare skal rettes — men paletten er låst, så rettelsen må
være en systemregel om, hvor `--accent` må bruges som forgrund. Den regel hører i
planen, ikke i et hastespor.

### 2. PALETTEN OG SKRIFTEN ER LÅST

**TYPESKILT står som gældende retning.** Foreslå aldrig en ny palet, en ny skrift
eller en ny æra. `impeccable` respekterer selv låsen: *"The brief wins. Honor
pinned aesthetics, eras, materials, fonts, and palettes."*

Farvetokens står i DESIGN.md's frontmatter (`colors:`, linje 4-37; frontmatteren
slutter på **301**) og i
`assets/system.css` `:root`. **Primitiverne er kilden**; de semantiske tokens peger
på dem. **Tæl dem med `node fund/maal-farvetokens.mjs`, ikke efter hukommelsen** —
her stod "de 16 tokens", og måleren gav 26 i alt den 4. sep 2026.

### 3. NAVNGIV FLADENS MODE, HVER GANG

To succeskriterier, og projektet behandlede dem ens i alt arbejde før 1. sep 2026:

- **Operate** — den besøgende løser en opgave. Katalogsiden. Sammenligningssiden.
- **Read** — den besøgende skal forstå noget. Robotsiden, producentsiden, Om os.

**Skriv MODE'et eksplicit**, hver gang en flade bedømmes eller bygges. En
Read-flade, dømt efter Operate-kriteriet, får de forkerte anmærkninger.

### 4. DE FIRE DATATILSTANDE ER SYSTEMETS KERNE

Hård begrænsning 5, ordret fra CLAUDE.md: ***"'Ikke oplyst', 'nej' og '0' er tre
forskellige tilstande og skal se forskellige ud. Det er der, katalogsider
lyver."***

DESIGN.md's afsnit *"De fire datatilstande"* definerer klasserne `.v-tal`,
`.v-nul`, `.v-nej`, `.v-ja`, `.v-ikke` og `.v-billede` med deres nøjagtige
skriftgrader og mærker. **Genbrug dem. Opfind aldrig en ny måde at vise en
tilstand på.**

Bygger du noget, der viser data: gå det afsnit igennem, felt for felt, og skriv
hvor mange tilstande din flade kan komme i, og hvordan hver af dem ser ud.

---

## Kortet — hvilket afsnit svarer på hvad

**Målt 4. sep 2026 af `udstilling-e0`. Linjenumrene flytter sig, når DESIGN.md
redigeres — så brug overskriften som nøgle og tallet som genvej.** Rammer et
linjenummer forkert, så find afsnittet med `grep -nE "^#{2,3} " DESIGN.md` og skriv
i din rapport, at kortet var forældet, så det kan rettes.

**HELE TABELLEN VAR FORKERT I ET DØGN, OG DEN SÅ RETTET UD.** Kortet stod med
3. sep-tal, mens filen var vokset fra **834 til 1.628 linjer**. Alle fem
hovedafsnit lå forkert — Farver 240 mod **344**, Layout 372 mod **715**,
Komponenter 458 mod **801**, datatilstandene 583 mod **934**, Konflikter 674 mod
**1169** — og **syv afsnit manglede helt**, heriblandt tre af de fire DP-beslutninger
fra designplanen.

Fælden er værd at kende, fordi den gentager sig: **Å172 rettede afsnits-ANTALLET
(32 → 45) og lod numrene stå.** Et halvt rettet kort er farligere end et helt
forældet, fordi tællingen stemmer, og læseren derfor tror på resten. Retter du
antallet, så ret numrene i samme commit — eller skriv, at du ikke gjorde.

### Frontmatter, linje 1-301 — maskinlæsbare tokens

| Nøgle | Linje | Hvad den svarer på |
|---|---|---|
| `colors:` | 4 | Primitiver og farvetokens. **Kilden er `assets/system.css` `:root`** — kør `node fund/maal-farvetokens.mjs` for det aktuelle antal |
| `typography:` | 38 | Skriftfamilier, vægte, den variable akse. **Målt 4. sep 2026: frontmatteren var forældet for 5 af 21 skriftgrader** (`--fs-robot` stod 54 px, den er 84). Stol på `system.css`, ikke på frontmatteren |
| `rounded:` | 78 | Hjørneradier |
| `spacing:` | 82 | Afstandsskalaen. **13 trin siden `spor/flader`** (var 9), 2 px granularitet fra 2-16 |
| `components:` | 94 | Komponenternes tokenværdier |

### Prosaen, linje 305-1628

**Hele tabellen er genmålt 4. sep 2026 kl. 23 med `grep -nE "^#{2,3} " DESIGN.md`,
efter at `spor/flader` havde udvidet filen til 1.628 linjer.** Kør den kommando
igen frem for at stole på tallene her — de flytter sig, hver gang filen redigeres.

| Afsnit | Linje | Spørg her, når du vil vide |
|---|---|---|
| **Overblik** | 305 | Hvad systemet er, og hvad det vil |
| **Fladernes MODE — DP3** | **368** | **Slå MODE op her, ikke i denne skill** |
| · Operate | 380 | Den besøgende løser en opgave |
| · Read | 397 | Den besøgende skal forstå noget |
| · Reglen om fladens eget emne | 411 | Gælder Read: fladens egne sektioner > halvdelen af højden |
| **Farver** | **428** | Hvornår en farve må bruges |
| · Primær | 438 | Accentens rolle |
| · Neutral | 454 | Blæk- og fladetrinene |
| · Mørk flade | 486 | |
| · Forgrundsreglen for `--accent` — DP1 | **493** | **L76: accent er baggrund og markør, aldrig tekst på lys flade** |
| · Navngivne regler | 639 | |
| **Typografi** | **656** | |
| · Hierarki | 683 | |
| · R5 — én samlet skriftskala | **748** | 29 rå px blev til navngivne trin (4. sep) |
| · DP3b — trinnet skalaen manglede | 791 | |
| · DP3c — skriftgulvets rækkevidde | 846 | Det autoritative gulv, 10,5 px |
| · Navngivne regler | 871 | |
| **Layout** | **882** | Afstande, rytme, gitre |
| **Dybde** | 912 | |
| **Former** | 928 | |
| **Komponenter** | **981** | |
| · Dækket (topbaren) | 983 | |
| · Kort (`.net .kort`) | 995 | |
| · Filtre (kataloget) | 1017 | Facetrækkerne er 44 px siden `spor/flader` |
| · Søgefeltet | 1050 | |
| · Knapper — én primitiv `.knap` (L77) | 1058 | |
| · Fokusringen | 1117 | |
| · Kildemærket | 1125 | |
| · **De fire datatilstande** | **1135** | **Hård begrænsning 5. Slå ALTID op her, før en datatilstand tegnes** |
| · Nøgletalsstriben (robotsiden) | 1161 | |
| · Stansningen (`.stans`) | 1169 | |
| · Slettede komponenter — historisk | 1176 | Hvorfor noget IKKE findes |
| · Producentfladen — DP2 | 1198 | |
| **Gør og lad være** | 1327 | |
| **Konflikter** | **1374** | Løste konflikter med deres begrundelse. **Punkt 10 (4. sep): en CSS-kommentar kan både knække en test og holde den falsk grøn** |


## Sådan bruges kortet

### Skriver du et BRIEF til et designspor

**Peg på afsnit med linjenummer** i stedet for at bede sporet læse hele filen, og
i stedet for at skrive reglen af. Formen:

> *Genbrug DESIGN.md's tilstandsklasser — se **DESIGN.md:583** *"De fire
> datatilstande"*. Opfind ingen ny klasse.*

**Skriv altid fladens MODE i briefet.** Og skriv, om rettelsen rører en
systembeslutning (palette, skriftgrad, radius, token) eller kun én flade — og
hvorfor. Et spor, der selv skal gætte det, gætter forkert i den dyre retning.

### Er du et SPOR, der skal bygge eller bedømme noget visuelt

1. Kald denne skill.
2. Læs **de tre regler** ovenfor.
3. Slå de 2-4 afsnit op i DESIGN.md, som din opgave faktisk rører. **Ikke hele
   filen**, medmindre briefet udtrykkeligt beder om det.
4. **Hvert fund og hvert valg skal pege på et sted i DESIGN.md med linjenummer.**
   Et fund uden henvisning er en smagsdom.
5. Finder du noget ægte, som DESIGN.md **ikke** dækker, så skriv det i et afsnit
   *"Huller i DESIGN.md"*. **Det er den mest værdifulde del af leverancen** —
   det er dér, standardiseringen mangler.

### Hvilket impeccable-flow

L70, JPK 1. sep 2026: ***"fremover anvender vi impeccables plugin og flows."***
Begrundelsen, købt for tre kritikrunder: **en fejlliste kan kun bringe siden
tilbage til sit eget tilsigtede udseende — den kan aldrig hæve loftet.**

| Situation | Flow | Rører den en systembeslutning? |
|---|---|---|
| Fladen skal **bedømmes** | `impeccable critique` + `audit` | Foreneligt — den producerer fund |
| Fladen skal have en **retning** | `impeccable shape` | Ja — skriv retningen som en systemregel |

**Rækken ovenfor sagde `impeccable new-work` indtil 4. sep 2026, og den kommando
findes ikke.** CLAUDE.md målte det på disken 3. sep: `new-work` er en **reference**
(`reference/new-work.md`), som `shape` selv indlæser, når en flade skal have en
retning frem for en rettelse. **Et spor, der kaldte den herfra, fik ingenting** —
og skillen, der skulle forhindre gætteri, var selv kilden til det. Kald `shape`.
| **Planlæg** før kode | `impeccable shape` | Afhænger af fundet — skriv hvilket |
| Mere end **én rettelse** på samme flade | `impeccable shape` på fladen | Ofte ja — derfor shape frem for enkeltrettelser |
| **Én** isoleret fejl | Ret den direkte | Nej — ellers er den ikke isoleret |

**Diskstien som reserve**, fordi kaldet fra en worktree svinger:

```
C:/Users/thyge/.claude/skills/impeccable/SKILL.md
```

**Skriv i rapporten, hvis du læste den fra disk** — et stille fallback må ikke
forveksles med, at skillen kørte.

---

## Tre målefælder, der er betalt for i dette projekt

**1. Et kontrasttal uden en læseretning er ikke et tal.** Palettens kommentar
sagde `9,19`, og det var rigtigt for gunmetal **på** gult. Tokenet blev målt som
**baggrund** og bruges som **forgrund** — den rigtige aflæsning er **1,38:1**.
Skriv altid *hvad på hvad*.

**2. `impeccable`s detektor (`detect.mjs`) kører stille degraderet her.** Fire
parser-moduler mangler, og den fejler ikke — den *dæmpes*: exit 0, tom liste, én
linje på stderr. Målt mod en kontrolside med bevidst slop fandt den **2 af 13**
fund og **nul** CSS-afhængige regler, kontrastmåling inklusive. **Validér motoren
mod et kendt svar, før dens tal bruges** — kan du ikke, så mål i browseren i
stedet.

**3. Mål fladen med øjne, ikke kun i kilden.** Skærmbilleder kan læses med
Read-værktøjet:

```
node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs <url> <bredde> <udfil.png>
node C:/Praktik/websites/maalevaerktoej/maal.mjs <url> [bredde]
```

Mål mindst **to bredder** (1440 og 390) og **begge sprog**. Server på **din egen
port**, aldrig 8080 — og **verificér serveren mod disken, før ét eneste tal
bruges**.

---

## Hold kortet sandt

Ændrer nogen DESIGN.md's struktur, går tabellen ovenfor i stykker uden at fejle —
den bliver bare forkert, og det ser man ikke. Genmål den med:

```
grep -n "^#" DESIGN.md
```

og ret afvigelser i samme commit som ændringen i DESIGN.md. **Et forældet kort er
værre end intet kort**, fordi det bliver troet.
