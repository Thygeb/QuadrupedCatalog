# BRIEF — spor/saml3: sammenligningssiden, to ændringer fra JPK

**Model:** Opus (L45 — leverancen dømmes med øjne).
**Skærm:** `dist/da/sammenligning/` og `dist/en/sammenligning/`. MODE: **Operate**.
**Worktree:** `C:/Praktik/websites/udstilling-wt-saml3` · **gren:** `spor/saml3` · **base:** `a405066`.
**Egen serverport: 8232.** Aldrig 8080.

## Punkt 1 — prøvebokse ved feltnavnene skal væk

JPK, ordret: *"Disse bokse der angiver felter oplyste skal ikke være der."*

Det er `.saml-svar` — tre små firkanter under hvert feltnavn i matricens navnekolonne, én pr.
robot, fyldt = oplyst, stiplet = ikke oplyst. Udsendt af `assets/sammenligning.js:358`
(`svarHTML()`, linje 351-366), tegnet af `assets/generator.css:525-528`.

**Tællingen må ikke forsvinde med dem.** Samme funktion udsender også
`<span class="kunskaerm">` med teksten *"N af 3 oplyser dette felt"* — den er skærmlæserens
udgave, og markørrækken bærer allerede `aria-hidden="true"`. **Behold `.kunskaerm`-teksten,
fjern kun det grafiske.** Fjerner du begge, taber siden information for en skærmlæser, og det
er en tilgængelighedsregression, ikke en oprydning.

**Efterlad ikke død CSS.** `.saml-svar`, `.saml-svar__m` og `.saml-svar__m--tavs` i
`generator.css:525-528` skal fjernes i samme commit — du ejer den fil. Projektet har 66 døde
klasser netop fordi hvert spor holdt sig inden for sit eget (Å102).

## Punkt 2 — "Choose robots" flyttes til én knap pr. robot

JPK, ordret: *"Choose robot knappen skal væk og der skal istedet være en under hver robot."*

I dag: **én** serverrenderet knap, `tools/skabelon/sammenligning.mjs:541`,
`<p class="afslutning-knap"><a class="videre videre--stille" ... data-saml-knap>` → linker
tilbage til kataloget.

**LÆS DETTE, FØR DU BYGGER — der findes en beslutning imod den nemme løsning.**

- **L73 er JPK's egen beslutning fra 1. sep:** *"Kunne man gøre at 'Choose robots' sender en
  tilbage til katalogsiden (med filteret bevaret)? Også fjerne robotvælgeren nederst."*
  Udvalget sker på kataloget — ét sted at vælge, ét sted at læse.
- **`spor/saml2` fjernede allerede en per-kolonne-knap**, og begrundelsen står i koden, i
  kommentaren lige over `specimen__skift` i `assets/sammenligning.js` (`specimenHoved()`,
  omkring linje 303-310): *"Tre identiske links til samme sted er støj, ikke betjening."*

**Derfor må per-kolonne-knappen ikke være tre kopier af den samme kataloghenvisning.** Den skal
gøre noget, den ene knap ikke kunne: **virke på SIN EGEN kolonne.**

**Den løsning, briefet beder om:** hver kolonne får en knap, der **fjerner netop den robot** fra
sammenligningen. Matricen tegnes om med de resterende. Er der plads tilbage (færre end 3), skal
den tomme plads — ikke hver besat kolonne — invitere tilbage til kataloget, så L73's "ét sted at
vælge" holder.

**Er du efter at have læst koden overbevist om, at en anden handling er den rigtige** (skift
frem for fjern, eller noget tredje), så **byg den, du mener er rigtig, og skriv i rapporten
hvilken du valgte og hvorfor** — men begrund den mod L73 og mod kommentaren ovenfor. En løsning,
der ender som tre ens links til kataloget, er afvist på forhånd.

**Knappens form:** brug den stemme, katalogsiden allerede taler — `.nulstil`-familien (mono,
versaler, spærret), ikke `.videre`. **L77 er besluttet men ikke bygget:** der bliver ÉN
knapprimitiv `.knap` med varianter, og grundformen taler TYPESKILT. **Du skal ikke bygge L77** —
det er et senere spor. Du skal bare ikke føje endnu en `.videre`-forekomst til de 146, L77 skal
rydde op i.

**Ny i18n-streng:** der findes ingen nøgle til "fjern denne robot". `valg_fjern`
(*"Fjern filteret {navn}"* / *"Remove the filter {navn}"*) er til filterchips, ikke robotter.
**Du ejer `data/i18n/da.json` og `data/i18n/en.json`** — tilføj nøglen i **begge**. L82: de to
sprogfiler holdes i takt, indtil dansk udgår i fase 4. Knapteksten skal navngive robotten for
en skærmlæser, ikke bare sige "fjern".

## Filejerskab

**Du ejer:**
```
assets/sammenligning.js
tools/skabelon/sammenligning.mjs
assets/generator.css
data/i18n/da.json  ·  data/i18n/en.json
tests/dele/38-typeskilt-sammenligning.mjs
tests/dele/55-sammenligning-uden-vaelger.mjs
tests/dele/57-doed-css.mjs
tests/dele/66-samlflade.mjs        (ny fil, nummeret er tildelt dig)
fund/FUND-samlflade.md             (din rapport)
```

**De tre eksisterende testfiler er MÅLT og hører til dit arbejde — læs dem, før du bygger:**

```
38-typeskilt-sammenligning.mjs   6 assertions paa saml-svar__m (194, 210, 264, 269, 285, 289)
55-sammenligning-uden-vaelger.mjs  linje 94 matcher hele knappens markup ordret;
                                   linje 129 naevner .videre/.afslutning-knap
57-doed-css.mjs                  linje 70 foerer saml-svar__m--tavs som KENDT doed klasse;
                                   linje 23 forklarer hvordan den konstrueres
```

**Assertionerne i 38 skal VENDES, ikke slettes.** De beviser i dag, at markørerne tegnes, og
at de tavse ser anderledes ud. Efter dit arbejde skal de bevise, at markørerne er væk **og at
`.kunskaerm`-tællingen stadig er der**. En slettet assertion efterlader ingenting, der siger,
at reglen nogensinde var der. Skriv i rapporten, hvor mange du vendte og hvor mange du
tilføjede.

**57's kendte-døde-liste skal opdateres, ikke omgås:** fjerner du `.saml-svar*` fra
`generator.css`, er de ikke længere døde — de findes ikke. Posten skal ud af listen, ikke
blive stående.

**Forbudt — tre andre spor og en anden session kører samtidig:**
```
assets/system.css            spor/topbar ejer den
tools/skabelon/side.mjs      spor/topbar
tools/skabelon/katalog.mjs · assets/katalog.js    spor/katalog3
db/**  ·  tests/dele/63-*  ·  tests/dele/64-*     den anden session
```

**Fælde i netop dit spor:** `system.css` bærer sammenligningsfladens enhedskontakt-regler
(2528-2540) og `.saml-taeller` (2455-2491). Du må **ikke** røre dem. Har din ændring brug for
det, så **stop og rapportér**.

## Grundmåling — DIN FØRSTE KOMMANDO er at genmåle den

Målt af orkestratoren på `a405066` umiddelbart før afsendelse:

```
node tools/validate.mjs    77 filer / 0 fejl / 1 advarsel
node tools/build.mjs       216 sider · 1111 tal med kilde / 0 uden
node tests/koer.mjs        1478 bestaaet / 1 fejlet
```

**Den ene røde er IKKE din:** `tests/dele/63` punkt (c), CRLF mod LF i
`db/migrering-engelsk.sql`. Rød i enhver frisk checkout, rettes af `spor/crlf63` i en anden
session. **Rør den ikke.** Er der 2 røde efter dit arbejde, er den ene din.

**Gitignorerede filer skal kopieres ind, ellers giver validate 54 fejl, der ikke er dine:**
```
cp -r ../udstilling/assets/fotos/fabrikant/. assets/fotos/fabrikant/
```

## Acceptkriterier — hvert enkelt er KØRT mod main, og "giver i dag" er målt

| # | Kommando | Giver i dag | Skal give |
|---|---|---|---|
| S1 | `grep -c 'saml-svar__m' assets/sammenligning.js` | **1** | **0** |
| S2 | `grep -c 'svar_taeller' assets/sammenligning.js` | **1** | **1** (skærmlæserens tælling bliver) |
| S3 | `grep -c 'saml-svar' assets/generator.css` | **3** | **0** (ingen død CSS) |
| S4 | `grep -c 'class="afslutning-knap"' tools/skabelon/sammenligning.mjs` | **1** | **0** |
| S5 | `grep -c 'afslutning-knap' assets/generator.css` | **1** | **0** (ingen død CSS) |
| S6 | `grep -c 'class="specimen__skift' assets/sammenligning.js` | **0** | **≥1** hvis du genbruger navnet; ellers skriv dit eget mønster og dets nutal |
| S7 | `grep -c 'videre' assets/sammenligning.js` | **1** (kun en kommentar, linje 586) | **0** — kommentaren skal væk med knappen |

**Bemærk formen på S1 og S4.** Rå `grep -c 'afslutning-knap'` giver **3** og
`grep -c 'specimen__skift'` giver **1** — fordi **kommentarer nævner navnene**. Mønstrene
ovenfor er valgt, så de rammer markup og ikke prosa. **Bruger du et andet mønster, så skriv
hvad det giver i dag, før du ændrer noget.**

**S8 — den, der beviser at det virker for en bruger, og som de syv ovenfor IKKE beviser.**
Kør din server på 8232, vælg tre robotter på kataloget, åbn sammenligningen, og mål:

```
node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs "http://localhost:8232/da/sammenligning/" 1440 <udfil>.png
```

Læs skuddet. **Boksene skal være væk, og der skal stå en knap under hver af de tre robotter.
Klik på én af dem, og se at netop den robot forsvinder.** Skriv alle tre iagttagelser.
Uden S8 er kriterierne kun en påstand om filer — det var præcis den fejl, der gik grøn i går
(Å121 punkt 1: kriteriet var kørt, reproducerbart og gyldigt, og funktionen virkede ikke).

**S9 — ny test i `tests/dele/66-samlflade.mjs`.** Sammenligningen tegnes klientside, så en
DOM-test er ikke gratis; se hvordan de eksisterende `tests/dele/`-filer måler
`assets/sammenligning.js` og følg samme vej. Mindst: en assertion, der fælder, hvis
`.saml-svar` vender tilbage, og en, der fælder, hvis `.kunskaerm`-tællingen forsvinder.
Følg kontrakten i `tests/LAESMIG.md`. **Ret assertions, slet dem ikke** — knækker en
eksisterende test, så vend den, så den beviser den nye regel, og skriv hvilken og hvorfor.
**Der findes assertions om `.saml-svar` og om fodknappen; find dem, før du bygger.**

## Skills

**Vurdér og skriv, hvad du valgte og hvad du gik forbi, med begrundelse.** Kandidater:
`impeccable audit` (tilgængelighed — markørrækken var `aria-hidden`, den nye knap skal have et
navn, en skærmlæser kan bruge), `impeccable layout` (kolonnehovedet får et nyt element i
bunden), `fejljagt` (hvis et måletal opfører sig uventet). **Designfrysen L70 gælder:** du
udfører JPK's egne to instrukser, du opfinder ikke ny form ved siden af. Ser du andet, der
burde laves om, så **notér det, ret det ikke**.

Kald til plugin-skills fra en worktree svinger. Lykkes kaldet ikke, så læs fra disk:
```
C:/Users/thyge/.claude/skills/impeccable/SKILL.md
```
**og skriv i rapporten, at du læste den fra disk.**

## Miljø — hver af disse koster en runde, når den udelades

- `node` ligger i `/c/Program Files/nodejs/node.exe` — Git Bash har den **ikke** på PATH.
- Commit-beskeder med backticks, `$` eller anførselstegn: skriv til fil, `git commit -F <fil>`.
- **`sed -i` fejler tavst med exit 0.** Brug Edit-værktøjet, som fejler synligt.
- **En HTML-kommentar tæller med i et grep-baseret acceptkriterium.** Et spor i går satte en
  forklarende `<!-- -->` ind, som citerede den forbudte streng ordret, og kriteriet gav 216
  i stedet for 0.
- **Send aldrig en kommando til `/dev/null`, hvis dens exitkode eller fejltekst er en del af
  målingen.**
- `git -C` skal have `C:/Praktik/...`, ikke `/c/Praktik/...`.
- Skriv filer som UTF-8 **uden** BOM.
- **Serveren:** `/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m
  http.server 8232 --directory dist` fra worktree-roden, **aldrig `cd dist`**.
  **Verificér mod disken, før ét eneste tal bruges.**
- **Luk din server, når du er færdig med at måle, og skriv i rapporten, at du gjorde det.**
- **Ryd `tests/.tmp-koersel` i din worktree, når du er færdig** — 11,5 GB fri på C:.

## Commit undervejs er et krav

Ét commit pr. sammenhængende ændring. Punkt 1 og punkt 2 er to commits, ikke ét.

## Rapporten — `fund/FUND-samlflade.md`, højst 60 linjer

1. Valgt løsning og fravalgt løsning, én linje hver. **Punkt 2 skal have en fuld linje om,
   hvilken handling knappen fik, og hvorfor den ikke er tre kopier af L73's link.**
2. **Konfidens pr. punkt.** *Høj* kræver en genkørbar kommando **plus** én linje om, hvad
   tallet ville have været, hvis arbejdet var forkert. Uden begge dele: middel.
3. Usikkerheder.
4. Målingerne som tal, ikke prosa.

**UDEN FOR de 60 linjer, obligatorisk:**
- **"Nye fælder og opdagelser."** Er der intet, skal der stå, at der intet er.
- **"Punkter i briefet, jeg ikke nåede."** Én linje pr. punkt, tom hvis ingen.

## Briefets fakta er påstande

**Afviger noget, du måler, fra noget, briefet påstår, så rapportér afvigelsen — det er en del
af leverancen, ikke ulydighed.** Linjenumrene er slået op på `a405066`. Er et af "giver i
dag"-tallene forkert, så skriv det målte.
