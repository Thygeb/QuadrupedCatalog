# BRIEF — `spor/katalog`: katalogsiden bliver TYPESKILTET (rigtig side)

Worktree `C:/Praktik/websites/udstilling-wt-katalog`, gren `spor/katalog`, base
`0e5ef6e`. **Model: Opus** (L45 — leverancen dømmes med øjne). Port **8170**.

**Dette er sporet, JPK venter på.** Han har set compen og sagt *"sådan skal det se
ud"*; han har set fundamentet og sagt, at det stadig er det gamle design. Han har
ret: skrift og palette er skiftet, men **formen er ikke bygget**. Det gør du nu.

---

## 0. Grundmåling — din FØRSTE handling

Målt af orkestratoren **i din worktree** umiddelbart før afsendelse:

```
node tools/validate.mjs   → 77 filer · 0 fejl · 1 advarsel
node tools/build.mjs      → 213 sider · 1110 tal med kilde, 0 uden · nævnere 30
node tests/koer.mjs       → 673 bestaaet · 0 fejlet
```

Kør alle tre, før du ændrer noget, og skriv tallene i rapporten. Afviger et tal:
**STOP og rapportér.** De 77 gitignorerede fabrikantfotos og `.env` er kopieret ind.

**Bemærk 673, ikke 642:** fundamentet blev flettet i dag og bragte skrifter, palette,
typeskilt-primitiven `.stans`, de fire tre-tilstandsmærker og 31 nye tests med. **Du
bygger oven på det** — skrifterne og farverne er der allerede.

---

## 1. Leverancen

**Byg katalogsiden om, så den ser ud som `retninger/nyverden/katalog.html`.**

Ikke en comp. Den rigtige side, begge sprog, funktionel. Åbn compen i en browser
(`retninger/nyverden/katalog.html`) og hold den ved siden af den byggede side, mens
du arbejder — den er den godkendte retningskontrakt (L57), og `retninger/nyverden/`
er pr. L59 den **eneste** retning i projektet.

Formen, compen viser, kort sagt:

- **Typeskilt-hovedet** øverst: overskrift til venstre, TYPE · UDGAVE · POSTER ·
  OPLYSTE FELTER stanset i højre side.
- **Den klæbende strimmel** derunder: VALGT + de aktive valg som chips med kryds,
  tælleren (`21 AF 77`, tallet i afmærkningsgul) og NULSTIL i højre side.
- **Facetlaget** i et 12-kolonners gitter: Anvendelse (3), Vægtklasse (4),
  Egenskaber (5) i første række; IP-klasse, Status, Land og den reserverede
  certificeringsgruppe (3 hver) i anden.
- **Kortene:** billede, producent, produktnavn. Intet andet. Statusstempel lægges
  **kun** på, når status ikke er "i produktion".
- **390 px:** facetlaget bliver et udtrækspanel med håndtag; **strimlen består**
  øverst med tæller og valg. Kortene går 2-op.

---

## 2. Filtermekanikken — L55 og L56

Begge er besluttede af JPK. Læs posterne Å62 (L55) og Å63 (L56) i `STATUS.md`.

**L55 — facetterne:**

1. **Certificeringsfeltet venter.** Facetten får en **reserveret, ærlig plads** —
   compen skriver *"Certificeringer — indsamles"* med en forklaring. Byg pladsen,
   ikke facetten. CE er kun oplyst på 4 af 77.
2. **Capability-chips, afledt af eksisterende felter, med tærsklen i etiketten.**
   Det godkendte sæt og compens målte tal:

   | Chip | ja | nej | ikke oplyst |
   |---|---|---|---|
   | Går på trapper | 42 | 0 | 35 |
   | Bærer fra 5 kg gående | 57 | 8 | 12 |
   | Arbejder i frost | 36 | 10 | 31 |
   | Lader selv | 31 | 3 | 43 |
   | Hot-swap-batteri | 19 | 0 | 58 |

   **Hver linje summer til 77. Din generator skal fejle, hvis en ikke gør.**
   Tallene er compens; genberegn dem selv og skriv de faktiske i rapporten.
3. **CE-facetten udgår** som selvstændig og opsluges i den kommende certificering.
4. **Landefilteret er en ren landeliste** — regiongruppering er fravalgt af JPK.
5. **Status er en fuld facet** med alle tilstande valgbare (i produktion 68 ·
   annonceret 6 · udgået 3). Standardtilstanden er afgjort i L56 punkt 5: **udgåede
   skjult, i produktion + annoncerede vist.**

**L56 — sortering og kort:**

- **Sortering:** alfabetisk (**standard**), lanceringsdato, pris, nyttelast,
  hastighed. **Ingen Skill Score** — hård begrænsning 6, og den står på
  *"Kom ikke igen med disse"*. Uoplyste ligger **sidst med ærlig mærkning**.
  Målt bæreevne: dato 45/77 (efter dagens dataspor), pris 11/77, hastighed 48/77,
  nyttelast 63/77.
- **Kortet:** billede + producent + produktnavn. JPK droppede udtrykkeligt enhver
  yderligere ordning af kortene; rækkefølgen styres alene af sorteringsreglen.
- **Tom tilstand:** alle vises efter sorteringsregel.

---

## 3. Fem ting, der ALDRIG må rulles tilbage

Hver enkelt er købt med et helt spor. De er lette at ødelægge i en omskrivning.

### 3.1 Filtrene skal virke UDEN JavaScript (Å59)

Siden er i dag **sand men statisk** uden JS: tomme facetgrupper skjules af **40
genererede CSS-regler** (`katalog.mjs:212-234`), fordi vi ved ved byggetiden, hvilke
værdier hver gruppe indeholder. Med JS bliver den **præcis**. `spor/haerd` modbeviste
udtrykkeligt et tidligere briefs påstand om, at det ikke kunne gøres i ren CSS.

**Løftet "virker uden JavaScript" står på siden. Bryd det ikke.**

**Sådan måles det — og pas på måleapparatet.** Reglerne genereres ved byggetid ind i
sidens inline `<style>`, ikke skrevet som linjer i kildekoden. Et `grep` i
`katalog.mjs` tæller derfor *genereringsløkken*, ikke dens output: jeg fik **20**, da
jeg prøvede, og det tal betyder ingenting. Mål på det byggede output — i dag
**153 `:has()`-forekomster i 78 regler, 11.342 tegn** — og bevis desuden i en browser
**med JavaScript slået fra**, at et filtervalg faktisk ændrer, hvad der vises. Det er
den endelige form, en besøgende møder.

### 3.2 Tællerne må ikke lyve (Å59, K1a)

Før `spor/haerd` stod der **37 tællere**, der sagde "af 77", mens siden var filtreret.
Efter: **0** både med og uden JS. Facettallets kontrakt er *"så mange, hvis denne
værdi også vælges"* — standard facetsøgning.

### 3.3 Tre tilstande skal ses (hård begrænsning 5)

**"Ikke oplyst", "nej" og "0" er tre forskellige ting.** Fundamentet leverede de fire
SVG-mærker til spriten: `i-ja` (fyldt firkant), `i-nej` (kontur med skråstreg),
`i-nul` (kontur med prik), `i-ioplyst` (stiplet kontur, ufyldt). Brug dem.

"Ikke oplyst" står **altid sidst**, adskilt af en stiplet linje, i støv-blæk
`#5F686F` — **aldrig** i støvgrå `#9AA3A9`, som er målt til 2,14:1 og kun må tegne
konturer. **Et filter må aldrig straffe ærlig tavshed.**

### 3.4 Skriftgulvet er 8 px for AL synlig tekst (Å59, K3)

`.enhed` gik engang til 5,70 px. Gulvet skal stå i **hvert** trin — et gulv i
grundreglen alene overskrives af trinnet under. `tests/dele/31-pudsning.mjs` vogter
det; den test skal blive ved med at bestå.

### 3.5 Radius-skalaen er 0/2/6/8/12 + 99px-pillen

Fundamentet tilføjede **2 px** som typeskiltets stansning. `31-pudsning.mjs:105-118`
håndhæver skalaen. Ingen 3 px, ingen 4 px — de opstår, når nogen skønner i stedet
for at vælge fra skalaen.

---

## 4. Ét spørgsmål du IKKE må afgøre

**Højdelinealen (Å71).** Manifestet bruger ~40 linjer på den som signaturelement,
men **L57 fjernede den**, og spørgsmålet om at føre den tilbage er rejst og
**ubesvaret**: JPK pegede på et skærmbillede, der har den, men billedet viste sig at
være en cachet version fra før hans egen rettelse.

**Indtil han svarer, står L57: byg den ikke.** Vægtklasse-facetten er
afkrydsningsfelter — som i den nuværende comp. Sporer du en plads, hvor den kunne
sidde, så nævn det i rapporten, men lad være med at tegne den.

---

## 5. Filejerskab

**Du ejer:**

- `tools/skabelon/katalog.mjs`
- `assets/katalog.js`
- `assets/generator.css`
- `assets/system.css` — **kun** nye klasser, du selv indfører. Rør ikke paletten,
  skrifterne eller `.stans`; de kom med fundamentet i dag og er godkendt.
- `data/i18n/da.json` + `en.json` — nye strenge. **Aldrig hårdkodet tekst i
  skabelonen**; alt gennem i18n, og begge filer skal holdes symmetriske (målt i dag:
  279/279 nøgler, 0 asymmetri).
- **ny fil** `tests/dele/35-typeskilt-katalog.mjs`

**Du rører IKKE:**

- `retninger/` — retningskontrakten er arkiv, og `spor/samlcomp` arbejder der lige nu
- `tools/skabelon/robot.mjs`, `forside.mjs`, `producent.mjs`, `sammenligning.mjs`
- `data/robots/`, `db/`, `tools/build.mjs`

**Et fund, du ikke skal bruge tid på:** `assets/filter.js` er **død kode** — 0
referencer i `tools/`, ikke i build-kopilisten. Og L55's binding om, at *"forsidens
filterlinks `robotter/#f-anv-…` ikke må knække"*, beskytter noget, **der ikke
findes**: `grep -c "f-anv" tools/skabelon/forside.mjs` giver **0**. Ankrene på
katalogsiden selv skal stadig virke.

---

## 6. Skills

Vurdér skills først og **skriv, hvilken du valgte, og hvilke du gik forbi med
begrundelse.** Kandidater: **`frontend-design`** (bærer kalibreringen mod de tre
AI-standardudseender og to-trins-processen, hvor designplanen kritiseres for at være
generisk **før** der skrives kode) og **`impeccable`** (`shape`, `layout`).

Diskstier som udtrykkelig reserve, hvis kaldet fejler fra worktreen (det svinger):

```
C:/Users/thyge/.claude/plugins/marketplaces/claude-plugins-official/plugins/frontend-design/skills/frontend-design/SKILL.md
C:/Users/thyge/.claude/skills/impeccable/SKILL.md
```

Læser du fra disk, **skriv det i rapporten.**

**`taste-skill` må ikke følges bogstaveligt:** den råder til opfundne "organiske"
tal og opdigtede firmanavne — brud på hård begrænsning 2. Den siger desuden selv, at
den ikke dækker datatabeller, og det er præcis, hvad denne flade er.

---

## 7. Rapportform

**Højst 60 linjer:** valgt/fravalgt løsning (én linje hver) · konfidens pr. punkt ·
usikkerheder · målinger som **tal**.

**Konfidens:** **Høj** = genkørbar kommando + tallet i rapporten + **én linje om,
hvad tallet ville have været, hvis arbejdet var forkert.** Uden den linje: **middel**.

**UDEN FOR de 60 linjer, obligatorisk:** "Nye fælder og opdagelser" (skriv "ingen",
hvis der ingen er) og "Punkter i briefet, jeg ikke nåede".

**Læg skærmbilleder ved, 1440 OG 390**, og skriv stierne — JPK dømmer med øjnene og
skal ikke starte noget selv:

```
node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs http://localhost:8170/da/robotter/ 1440 <fil.png>
```

---

## 8. Briefets fakta er påstande

Alt ovenfor er målt af mig i dag, men jeg tager fejl. I dag alene tog jeg fejl om
build.mjs' kopiliste (ville have korrumperet fontene — sporet fangede det) og om
tabelsemantikken (grep på dist måler ikke en klientside-tegnet tabel).

**Afviger noget, du måler, fra noget briefet påstår, så rapportér afvigelsen — det
er en del af leverancen, ikke ulydighed.** Otte spor har rettet orkestratorens
fakta i denne sessionsrække. Hver gang havde sporet ret.

---

## 9. Miljø

- **Commit undervejs er et krav.** Ét commit pr. sammenhængende ændring. Tre spor er
  døde midtvejs de seneste dage; commit-kravet reddede arbejdet hver gang. Dette er
  et stort spor — så det gælder dig især.
- **node kun med fuld sti:** `/c/Program Files/nodejs/node.exe`
- **Din port er 8170.** Aldrig 8080 (dist), 8142 (compen) eller 8160 (`samlcomp`).
  Fra worktree-roden, **aldrig** `cd dist`:
  ```
  /c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m http.server 8170 --bind 127.0.0.1 --directory dist
  ```
  Uden fuld sti fejler den **tavst** med exit 127 i en baggrundsskal.
- **Verificér serveren mod disken, før ét tal bruges:** vælg en streng kun din udgave
  har, og sammenlign `curl -s http://localhost:8170/system.css | grep -c "X"` med
  `grep -c "X" assets/system.css`. Forskellige tal = du måler en anden agents byg.
- **`sed -i` fejler TAVST med exit 0.** Brug Edit. **UTF-8 uden BOM.**
- **Commit-beskeder** med backticks/`$`/`%`: skriv til fil, `git commit -F
  <Windows-sti>` (ikke `/c/...`).
- **`split()` på et sektions-id rammer det tomme mellemstykke** — skabelonerne skriver
  hvert id to gange (`aria-labelledby` og `id`). Brug `indexOf` på klassenavnet. Den
  fejl fik to acceptkriterier til at printe 0 uanset arbejdet.

---

## 10. Acceptkriterier — kørt mod din base af mig i dag

| # | Kommando | Giver i dag | Skal give |
|---|---|---|---|
| Grund | `node tools/validate.mjs` | 77 · 0 fejl · 1 adv. | **uændret** |
| Grund | `node tools/build.mjs` | 213 sider · 1110/0 · nævnere 30 | **uændret** |
| Tests | `node tests/koer.mjs` | **673 / 0** | **≥673 / 0** |
| i18n | nøgler i da.json vs en.json | **279 / 279** | **symmetrisk** |
| Uden JS | `:has()`-forekomster i katalogsidens inline `<style>` | **153** (78 regler, 11.342 tegn) | **>0, og filtrene virker** |
| Chips | hver capability-linje summer til 77 | — | **5 af 5 summer** |
| Radius | `grep -c "border-radius:[0-9]" assets/*.css` uden for 0/2/6/8/12/99 | **0** | **0** |

**Alle tal er målt 31. aug 2026 på `0e5ef6e`.** 673 og 213 er grundlinjer: testtallet
**skal stige** med dine egne tests i `tests/dele/35-*` — skriv det faktiske tal, ram
ikke mit. Sidetallet skal derimod være **uændret**: du tilføjer ingen sider.
