---
name: design
description: Navigationskortet til DESIGN.md, projektets designsystem. Kald den HVER gang noget visuelt skal bygges, bedømmes, kritiseres eller planlægges — en ny flade, en rettelse i CSS, en farve, en skriftgrad, en komponent, en datatilstand — og hver gang et brief til et designspor skrives. Den kopierer ingenting fra DESIGN.md; den fortæller, hvilket afsnit der svarer på hvilket spørgsmål, så et spor læser 40 linjer i stedet for 834. Bærer desuden de fire regler, der gælder ved ALT designarbejde: designfrysen, palettelåsen, MODE-navngivningen og de fire datatilstande.
---

# design — find det rigtige afsnit i DESIGN.md, og kopiér det aldrig

**DESIGN.md er sandheden om, hvordan siden skal se ud og opføre sig.** JPK's ord
3. sep 2026: *"DESIGN.md beskriver hvordan websiden skal være designet, for at
sikre konsistens og standardisering af websidens udseende og funktionalitet."*

Denne skill er et **kort over den fil**, ikke et resumé af den.

## Hvorfor der ikke findes et destillat, og hvorfor du ikke skal lave et

Målt 3. sep 2026: DESIGN.md er **42 KB ≈ 12,5k tokens**. Til sammenligning
CLAUDE.md 47 KB, `fund/PLAN-producent.md` 45 KB, **STATUS.md 416 KB ≈ 126k**.
DESIGN.md er altså ~3 % af et opus-spors budget — **den er ikke, hvor tokenerne
går.**

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

**Peg på afsnit i stedet.** Et spor, der læser 40 linjer i stedet for 834, sparer
95 % — og ingen kopi kan divergere.

---

## De fire regler, der gælder ved ALT designarbejde

Disse fire står her, fordi de gælder hver gang og ikke kan slås op ét sted i
DESIGN.md. Alt andet i denne skill er henvisninger.

### 1. DESIGNFRYSEN (L70, JPK 1. sep 2026)

***"Vi skal have en overordnet designplan, inden vi retter noget design."***
**Fund noteres, de rettes ikke.** Frysen gælder, indtil den overordnede plan
findes.

**Undtaget:** rene funktionsfejl (en knap, der ikke virker), brudte hårde
begrænsninger, og fejl hvor rettelsen ikke rører en systembeslutning.

**Er du i tvivl, om noget er en designrettelse: det er det.** Skriv det som et
fund.

Fælden, frysen lukker, er at **et designfund kan LIGNE en almindelig fejl**.
Eksemplet: afmærkningsgul som tekstfarve giver **1,38:1** mod WCAG's 4,5. Det
ser ud som en fejl, der bare skal rettes — men paletten er låst, så rettelsen må
være en systemregel om, hvor `--accent` må bruges som forgrund. Den regel hører i
planen, ikke i et hastespor.

### 2. PALETTEN OG SKRIFTEN ER LÅST

**TYPESKILT står som gældende retning.** Foreslå aldrig en ny palet, en ny skrift
eller en ny æra. `impeccable` respekterer selv låsen: *"The brief wins. Honor
pinned aesthetics, eras, materials, fonts, and palettes."*

Farvetokens står i DESIGN.md's frontmatter (`colors:`, linje 4-37) og i
`assets/system.css` `:root`. **Primitiverne er kilden**; de 16 tokens peger på
dem.

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

**Målt 3. sep 2026. Linjenumrene flytter sig, når DESIGN.md redigeres — så brug
overskriften som nøgle og tallet som genvej.** Rammer et linjenummer forkert, så
find afsnittet med `grep -n "^#" DESIGN.md` og skriv i din rapport, at kortet var
forældet, så det kan rettes.

### Frontmatter, linje 1-189 — maskinlæsbare tokens

| Nøgle | Linje | Hvad den svarer på |
|---|---|---|
| `colors:` | 4 | Primitiver og de 16 farvetokens. **Kilden er `assets/system.css` `:root`** |
| `typography:` | 38 | Skriftfamilier, vægte, den variable akse |
| `rounded:` | 78 | Hjørneradier |
| `spacing:` | 82 | Afstandsskalaen |
| `components:` | 94 | Komponenternes tokenværdier |

### Prosaen, linje 191-834

| Afsnit | Linje | Spørg her, når du vil vide |
|---|---|---|
| **Overblik** | 193 | Hvad systemet er, og hvad det vil |
| **Farver** | 240 | Hvornår en farve må bruges |
| · Primær | 250 | Accentens rolle |
| · Neutral | 264 | Blæk- og fladetrinene |
| · Mørk flade | 286 | Den mørke variant |
| · Navngivne regler | 293 | De farveregler, der har et navn |
| **Typografi** | 307 | Skriftgrader og hvorfor der er så mange |
| · Hierarki | 334 | Hvilket trin en overskrift skal have |
| · Navngivne regler | 362 | De typografiregler, der har et navn |
| **Layout** | 372 | Gitteret, spalterne, rytmen |
| **Dybde** | 402 | Skygger, lag, hvad der ligger over hvad |
| **Former** | 418 | Kanter, radier, stansninger |
| **Komponenter** | 458 | **Start her, når du rører et eksisterende element** |
| · Dækket (topbaren) | 460 | |
| · Kort (`.net .kort`) | 472 | Katalogets kort |
| · Filtre (kataloget) | 494 | Facetter, filterfladen |
| · Søgefeltet | 506 | |
| · Knapper (`.knap`, L77) | 514 | **Én primitiv.** Ni klasser blev talt og samlet |
| · Kildemærket | 573 | Hvordan et tal viser sin kilde |
| · **De fire datatilstande** | **583** | **ja / nej / ikke oplyst / kun på billede** |
| · Nøgletalsstriben | 605 | Robotsidens stribe |
| · Stansningen (`.stans`) | 613 | |
| · Slettede komponenter | 620 | **Slå op her, før du genopfinder noget** |
| **Gør og lad være** | 630 | |
| · Gør | 632 | |
| · Lad være | 647 | **Læs den, før du foreslår noget** |
| **Konflikter** | 674 | Målte, uafgjorte spændinger. Fem afgjort, tre åbne |

---

## Sådan bruges kortet

### Skriver du et BRIEF til et designspor

**Peg på afsnit med linjenummer** i stedet for at bede sporet læse hele filen, og
i stedet for at skrive reglen af. Formen:

> *Genbrug DESIGN.md's tilstandsklasser — se **DESIGN.md:583** *"De fire
> datatilstande"*. Opfind ingen ny klasse.*

**Skriv altid fladens MODE i briefet.** Og skriv, om designfrysen gælder for netop
denne opgave, eller om den er undtaget — og hvorfor. Et spor, der selv skal gætte
det, gætter forkert i den dyre retning.

### Er du et SPOR, der skal bygge eller bedømme noget visuelt

1. Kald denne skill.
2. Læs **de fire regler** ovenfor.
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

| Situation | Flow | Frysen? |
|---|---|---|
| Fladen skal **bedømmes** | `impeccable critique` + `audit` | Foreneligt — den producerer fund |
| Fladen skal have en **retning** | `impeccable new-work` | Kræver, at frysen er løftet |
| **Planlæg** før kode | `impeccable shape` | Kræver, at frysen er løftet |
| Mere end **én rettelse** på samme flade | `impeccable shape` på fladen | Kræver, at frysen er løftet |
| **Én** isoleret fejl | Ret den direkte | Kun hvis den er undtaget |

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
