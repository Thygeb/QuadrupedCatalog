---
name: brief
description: Rygraden i ethvert agentbrief for quadruped-kataloget. Brug den HVER gang et spor skal sendes ud — også små rettelsesspor og genstarter. Besluttet af JPK 26. aug 2026 efter at fire defekter slap gennem 13 håndskrevne briefs på én dag. grillmig dømmer om briefet SKAL sendes (hensigten); denne skill bygger selve kroppen, så konstruktionsfejlene ikke gentages. Send aldrig et brief uden at have kørt dens tjekliste.
---

# Brief — kroppen, ikke hensigten

13 briefs blev skrevet i hånden 26. aug 2026. Fire defekter slap igennem, og
hver af dem kostede en runde eller var ren nåde: et acceptkriterium der altid
gav 0 (to gange), et selvmodsigende filejerskab, en manglende designskill, en
forældet grundmåling. `grillmig` fangede dem ikke, for den dømmer hensigten —
ingen skill dækkede konstruktionen. Det gør denne.

**Rækkefølgen:** `grillmig` først (skal briefet overhovedet sendes?), så denne
tjekliste (er det bygget rigtigt?). Spring aldrig den første over, fordi den
anden findes.

## Tjeklisten — ni punkter, alle målbare

### 1. Grundmålingen står i briefet, med orkestratorens egne tal

Sporets FØRSTE kommando er at genmåle den. Uden den kan agenten ikke svare på
*"var det mig, der ødelagde det?"* — og tallene skal være FRISKE: et
s1-spor fik 232 tests med som grundmåling, mens main havde 275, fordi briefet
var skrevet før fire flet. Mål umiddelbart før afsendelse, ikke ved planlægning.

### 2. Hvert acceptkriterium er KØRT mod main, før det sendes

Det skal give det "forkerte" svar nu — ellers måler det ingenting (O2).
`split('h-udvalg')[1]` printede 0 uanset arbejdet, to briefs i træk. Og
kriteriets script er selv et gæt: `Object.values(j)[0]` var ikke robotarrayet.
**Kør kommandoen, sæt dens nuværende output ind i briefet som "giver i dag X".**

### 3. Filejerskabet er komplet og modsigelsesfrit

- Alle filer, opgaven skal røre, ER på ejerlisten. Tjek: bor funktionen, der
  skal ændres, i en fil på listen? ("ret `ekstremer()`" + "rør ikke `side.mjs`"
  — hvor funktionen bor — var et ægte brief her.)
- Ingen fil ejes af to samtidige spor. Nye tests går i egen fil efter
  `tests/LAESMIG.md`s kontrakt, aldrig i en delt.

### 4. Tal er mærket: krav, gæt eller forudsigelse

Et udledt tal skrives som regel ("samme sidetal plus 2 pr. ny robot"), aldrig
som konstant ("213 sider"). Kan det ikke udledes, mærkes det **forudsigelse**:
agenten skal måle og skrive det faktiske tal, ikke ramme dit. Mit "177 sider"
blev til 175; agenten gjorde det rigtige. Nævner og dato på ethvert citeret tal.

### 5. Skill-instruksen peger, kopierer ikke

Navngiv de skills, sporet skal kalde (og dem, det skal vurdere og evt. gå
forbi). Skriv aldrig reglerne af i hånden — tre kopier divergerer ved den
fjerde. Plugin-skills fra en worktree svinger: giv diskstien med som reserve,
og kræv at rapporten siger, hvis den blev læst fra disk.

### 6. Rapportformen er bestilt eksplicit

Højst 60 linjer: valgt/fravalgt løsning, konfidens pr. punkt (høj kræver
genkørbar kommando PLUS kontrafaktisk linje — ellers middel), usikkerheder,
målinger som tal. UDEN FOR de 60, obligatorisk: "Nye fælder og opdagelser" og
"Punkter i briefet, jeg ikke nåede". Uden bestillingen kommer der 226 linjer.

### 7. Miljøfælderne er med

De koster en runde hver, når de udelades: node's fulde sti · commit-beskeder
med backticks via `git commit -F` · `sed -i` fejler tavst, brug Edit ·
gitignorerede filer kopieret ind i worktreen (billeder!) · egen serverport +
verificér mod disken · UTF-8 uden BOM. Kopiér blokken fra et nyligt brief —
det er en huskeliste, ikke en regel, så kopien er lovlig her.

### 8. Commit undervejs er et krav, ikke et råd

To spor døde på tre dage uden en linje efterladt. Ét commit pr. sammenhængende
ændring, så et dødt spor kan måles i stedet for at gættes.

### 9. Pladsholder-scanning til sidst

Læs briefet igennem for: "TODO", "stram op", "gør det pænere", "fix X" uden
eksempel, et punkt uden acceptkriterium, et acceptkriterium uden "giver i dag
X". Finder du ét, er briefet ikke færdigt. Reglen for rettelses-briefs er den
samme, skærpet: fil:linje, citat af det nuværende, det ønskede resultat
konkret, ét kriterium pr. punkt, én linje hvorfor.

## Efter afsendelse

Skriv sporet i STATUS.md's kørende-spor-post (worktree, gren, ejerskab,
grundmåling), så en læser, der ikke var med, kan finde det. Det var det, der
reddede `spor/retning`-obduktionen: posten fandtes, arbejdet gjorde ikke.
