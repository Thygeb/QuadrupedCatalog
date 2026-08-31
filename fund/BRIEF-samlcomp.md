# BRIEF — `spor/samlcomp`: sammenligningssiden i TYPESKILT-udtrykket (COMP)

Worktree `C:/Praktik/websites/udstilling-wt-samlcomp`, gren `spor/samlcomp`,
base `72960fc`. **Model: Opus** (designspor, L45 — du fortolker en retning til en
flade, ingen har tegnet). Port **8160**.

---

## 0. Grundmåling — din FØRSTE handling

Målt af orkestratoren **i din worktree** umiddelbart før afsendelse:

```
node tools/validate.mjs   → 77 filer · 0 fejl · 1 advarsel
node tools/build.mjs      → 213 sider · 1110 tal med kilde, 0 uden
node tests/koer.mjs       → 642 bestaaet · 0 fejlet
```

Kør alle tre, før du ændrer noget, og skriv tallene i rapporten. Afviger et tal:
**STOP og rapportér** — så er det miljøet, ikke dit arbejde. De 77 gitignorerede
fabrikantfotos og `.env` er allerede kopieret ind af mig.

---

## 1. Leverancen — en COMP, ikke en implementering

Du tegner **sammenligningssiden** i TYPESKILT-udtrykket som en fritstående comp på
rigtige data. **Du rører ikke den kørende side.**

**JPK dømmer compen med øjnene, og først derefter bygges den ind.** Det er samme vej,
`retninger/nyverden/` selv gik, og den blev valgt af JPK i dag netop for at undgå
halvfærdige mellemresultater.

**Hvor filerne skal ligge — og hvorfor det er vigtigt i dag:** JPK besluttede
31. aug 2026 (L59), at **`retninger/nyverden/` er den ENESTE retning**, og alle
øvrige retningsmapper blev slettet samme dag for at fjerne forvirring. **Opret
derfor ingen ny retningsmappe.** Din leverance er:

```
retninger/nyverden/sammenligning.html      (ny — compen)
retninger/nyverden/byg-samlcomp.mjs        (ny — generatoren)
retninger/nyverden/MANIFEST.md             (udvid med et afsnit om fladen)
retninger/nyverden/typeskilt.css           (udvid KUN hvis fladen kræver nye klasser)
```

---

## 2. Retningskontrakten

Læs **`retninger/nyverden/MANIFEST.md`** helt. Den er kontrakten: paletten (ni
navngivne roller med målte kontrasttal), skriftrollerne (Saira Semi Condensed til
pladen, Literata til prosa, **ingen monospace**), tre-tilstandsreglen tegnet som
fire SVG-mærker, og det stansede udtryk (2 px radius, 1 px indfældet kant, **ingen
slagskygge**).

Se også de to eksisterende comps som forlæg for tone og tæthed:
`retninger/nyverden/katalog.html` og `robot-spot.html`.

**To steder er manifestet forældet — JPK omgjorde dem i L57:**

1. **§"Signaturelementet: højdelinealen" er OPHÆVET.** Byg den ikke. Signaturen er
   selve typeskilt-pladen.
2. Tæthedsmåler-blokken på robotsiden er droppet.

**Et tredje punkt er UAFKLARET og må ikke afgøres af dig (Å71):** om højdelinealen
skal ind igen. Indtil JPK har svaret, står L57 — altså ingen højdelineal. Rører din
flade spørgsmålet, så **skriv det i rapporten frem for at vælge.**

---

## 3. Fladen, du skal tegne — og de to ting, der ALDRIG må rulles tilbage

Sammenligningssiden lader læseren vælge robotter og se deres felter side om side.
Den nuværende flade ligger i `tools/skabelon/sammenligning.mjs` og
`assets/sammenligning.js` — **læs dem, ændr dem ikke.**

### 3.1 Tabelsemantikken skal bestå (Å54/Å58)

Fladen var indtil 28. aug en `<dl>`/`<dt>`-konstruktion, hvor **en skærmlæser ikke
kunne knytte en værdi til sin kolonne.** JPK valgte selv rettelsen, og `spor/tabel`
gennemførte den (tests 511 → 547).

**Målt af mig i browseren i dag** (den kørende side, efter JavaScript):

| | |
|---|---|
| `<table>` | 1 |
| `<caption>` | 1 |
| `th[scope="col"]` | 3 |
| `th[scope="row"]` | 30 |
| `th[scope="rowgroup"]` | 6 |
| `<td>` | 91 |

**Din comp skal vise den samme semantik.** Tegner du matricen som `<div>`'er eller
`<dl>`, foreslår du i praksis at rulle en tilgængelighedsrettelse tilbage, som JPK
selv bestilte.

**MÅLEFÆLDE, som kostede mig en forkert konklusion for en time siden:** et `grep`
efter `<table>` i den byggede HTML giver **0**, fordi matricen tegnes **klientside**
af `sammenligning.js`. Jeg troede først, semantikken var væk. **Mål i en browser,
ikke med grep** — ellers måler du noget andet, end du tror.

### 3.2 Kildebogstaver hører IKKE til på denne flade (L46)

Sammenligningssiden bærer **ingen** kildebogstaver. Målt i browseren i dag:
`.kildemaerke`/`.kilde-bogstav` = **0**.

**Det er en truffet beslutning, ikke en forglemmelse.** L46 kasserede dem. Og det er
værd at kende historien: 28. aug blev L46 vendt ved en fejl, arbejdet flettet, og
måtte rulles tilbage (Å55) — sessionens dyreste fejl. **Tegn dem ikke ind igen.**

Robottens tal har stadig kilde; bogstavet står på robottens egen side, som fladen
kan linke til.

### 3.3 Sidevægten er et selvstændigt krav

Den byggede side er i dag **369.777 bytes**. Å43 satte et loft på **+15 %** for
denne flade, fordi den bærer alle 77 robotters data inline. Din comp er ikke den
rigtige side, men **hvis din form kræver væsentligt mere data pr. robot, skal du
skrive det i rapporten** — det er en implementeringsrisiko, JPK skal kende, før han
dømmer formen.

### 3.4 Fladen skal virke uden JavaScript — eller sige det

Katalogets filtre virker uden JS. **Sammenligningssiden gør ikke**, og det står som
en åben mangel i Å54: en besøgende uden JavaScript får 77 afkrydsningsfelter og en
tabel, der aldrig ændrer sig. Der findes ét `<noscript>` i dag (målt: 1).

Du skal ikke løse det i en comp. **Men hvis din form gør problemet værre eller
lettere, så skriv hvilken af delene.**

---

## 4. Compen skal genereres af data — ikke skrives i hånden

**Hård begrænsning 2 forbyder opfundne tal.** `retninger/nyverden/byg-comp.mjs` er
forlægget: den læser `dist/robots.json` og `data/i18n/da.json`, regner hvert tal, og
bærer **14 assertions**, der får den til at fejle, hvis en facetsum ikke stemmer.

**Byg din generator på samme måde.** Hvert tal og hvert navn på compen skal være
*regnet*, ikke skrevet. Skriv i rapporten, hvor mange assertions din generator bærer.

**Én filtertilstand er nok** — katalogcompen viser én og bærer et synligt stempel
*"Comp · én filtertilstand"*. Gør det samme, hvis din flade har en tilstand at vælge.

---

## 5. Filejerskab

**Du ejer KUN `retninger/nyverden/`.**

**Værn, som du selv skal måle og rapportere:**

```
git diff main...spor/samlcomp --name-only -- assets tools data tests db
```

→ skal give **0 filer**. **Bemærk de TRE punktummer.** To punktummer sammenligner
grenspidser og viser mains egen fremdrift som din — det gav 94 falske filer for
`spor/nyverden`. Kontroltjek, der afgør sagen uafhængigt:

```
git log --oneline main..spor/samlcomp --name-only -- assets tools data tests db
```

→ skal være tomt.

**Forbudt:** `assets/`, `tools/`, `data/`, `tests/`, `db/`, og enhver anden mappe
under `retninger/`. Et andet spor (`spor/fundament`) ejer `assets/system.css` og
`tools/skabelon/side.mjs`.

---

## 6. Skills

Vurdér skills som en af dine første handlinger og **skriv, hvilken du valgte, og
hvilke du gik forbi med begrundelse.** "Ingen skill passer her" er gyldigt, men skal
skrives.

Kandidater: **`frontend-design`** (Anthropics egen skill til visuelt design — bærer
kalibreringen mod de tre AI-standardudseender og to-trins-processen, hvor
designplanen kritiseres for at være generisk **før** der skrives kode) og
**`impeccable`** (`new-work`, `shape`).

**Kaldet fra en worktree lykkes nogle gange og fejler andre gange, og vi ved ikke
hvorfor.** Diskstierne som udtrykkelig reserve:

```
C:/Users/thyge/.claude/plugins/marketplaces/claude-plugins-official/plugins/frontend-design/skills/frontend-design/SKILL.md
C:/Users/thyge/.claude/skills/impeccable/SKILL.md
```

Læser du en fra disk, **skriv det i rapporten**, så et stille fallback ikke
forveksles med, at skillen kørte.

**`taste-skill` må IKKE følges bogstaveligt her.** Dens egen tekst råder til
opfundne "organiske" tal og opdigtede firmanavne — det bryder hård begrænsning 2 og
hele kildeløftet. Fladen er desuden en datatabel, som skillen selv siger, den ikke
dækker.

---

## 7. Rapportform

**Højst 60 linjer**, og præcis fire ting: valgt/fravalgt løsning (én linje hver) ·
konfidens pr. punkt · usikkerheder · målingerne som **tal**, ikke prosa.

**Konfidens er bundet til bevistype:** **Høj** = målt med en kommando, tallet står i
rapporten, jeg kan genkøre den — **plus én linje om, hvad tallet ville have været,
hvis arbejdet var forkert.** Kan du ikke skrive den kontrafaktiske linje, er
niveauet **middel**. **Lav** = ikke efterprøvet.

**To sektioner ligger UDEN FOR de 60 linjer og er obligatoriske:**

- **"Nye fælder og opdagelser"** — skriv "ingen", hvis der ingen er.
- **"Punkter i briefet, jeg ikke nåede"** — én linje pr. punkt, tom hvis ingen.

**Læg et skærmbillede ved** (`flade-skud.mjs`, se §9), så JPK kan dømme uden at
starte noget selv.

---

## 8. Briefets fakta er påstande

Alt ovenfor har jeg målt i dag, men jeg kan tage fejl — jeg tog fejl om
tabelsemantikken for en time siden, indtil jeg målte igen. **Afviger noget, du
måler, fra noget, briefet påstår, så rapportér afvigelsen. Det er en del af
leverancen, ikke ulydighed.** Syv spor har rettet orkestratorens fakta i denne
sessionsrække; hver gang havde sporet ret.

---

## 9. Miljø og arbejdsform

- **Commit undervejs er et krav, ikke et råd.** Ét commit pr. sammenhængende
  ændring. Tre spor er døde midtvejs de seneste dage; hver gang var det
  commit-kravet, der reddede arbejdet.
- **node kun med fuld sti:** `/c/Program Files/nodejs/node.exe`
- **Din port er 8160.** Aldrig 8080 (dist), 8142 (compen) eller 8151 (fundamentet).
  Start serveren fra worktree-roden, **aldrig** `cd dist`:
  ```
  /c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m http.server 8160 --bind 127.0.0.1 --directory .
  ```
  Uden fuld sti fejler den **tavst** med exit 127 i en baggrundsskal.
- **Verificér serveren mod disken, før ét eneste tal bruges.** Vælg en streng, kun
  din udgave har, og sammenlign `curl -s http://localhost:8160/... | grep -c` med et
  `grep -c` på filen. Forskellige tal = du måler en anden agents byg.
- **Browsermåling:** `node C:/Praktik/websites/maalevaerktoej/maal.mjs <url> <bredde>`
  for tal; `flade-skud.mjs <url> <bredde> <udfil.png>` for et skærmbillede, du selv
  kan læse med Read.
- **`sed -i` fejler TAVST med exit 0.** Brug Edit-værktøjet, som fejler synligt.
- **UTF-8 uden BOM.** Commit-beskeder med backticks/`$`/`%`: skriv til fil og brug
  `git commit -F <Windows-sti>` (ikke `/c/...`).
- Compens billeder peger på `../../assets/fotos/fabrikant/` — gitignoreret, men
  allerede kopieret ind i din worktree.

---

## 10. Acceptkriterier — målt mod main af mig i dag

| # | Kommando | Giver i dag | Skal give |
|---|---|---|---|
| Værn | `git diff main...spor/samlcomp --name-only -- assets tools data tests db` | 0 filer | **0 filer** |
| Comp | `ls retninger/nyverden/sammenligning.html` | findes ikke | **findes** |
| Data | din generators assertions | — | **≥8, alle bestået** |
| Grund | `node tests/koer.mjs` | **642 / 0** | **642 / 0** (urørt) |
| Grund | `node tools/build.mjs` | 213 sider | 213 (urørt) |

**Målt i browseren på den kørende flade, som din comp skal forholde sig til:**
`<table>` 1 · `<caption>` 1 · `th[scope=col]` 3 · `th[scope=row]` 30 ·
`th[scope=rowgroup]` 6 · `<td>` 91 · kildebogstaver **0** · sidevægt 369.777 bytes.

Alle tal er målt 31. aug 2026 på commit `72960fc`. Tallene 642 og 213 er
**grundlinjer, der skal være uændrede** — du rører ikke kode, der bygger siden.
