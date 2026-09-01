# BRIEF — spor/document (LED 1 af designplanen)

**Status: SENDT 1. sep 2026.** Forudsætningen er opfyldt: `spor/doedcss` er
flettet som `afb3b39`, efterprøvet af orkestratoren, og worktreen er ryddet.
JPK gav samme dag stående tilladelse til at sende led 1 af selv, når det skete.
Grundmålingen i afsnit 1 er friske tal fra det flettede main.

**Model: Sonnet.** Opgaven er en udtrækning fra kode med et efterprøvbart facit:
hver token i frontmatter skal matche en værdi, der står i `assets/system.css`.
De steder, hvor der VILLE være skøn, er skåret væk af afsnit 3 — konflikter
skal noteres, ikke afgøres. Fravalgt Opus, fordi leverancen er en beskrivelse
af det bestående, ikke en dom.

**Serverport: 8142. Testnummer: 58** (din nye testfil skal hedde `tests/dele/58-designmd.mjs`). Tildelt af `.claude/skills/parallelt/opsaet.mjs`

**Rør ALDRIG** `c:\Praktik\websites\salg` eller `c:\Praktik\website`.

---

## Regel 0 — skill-vurdering

Skriv, hvilken skill du valgte, og hvilke du gik forbi med begrundelse.
Den forventede er `impeccable document`. **Kan skillen ikke kaldes fra
worktreen, så læs den fra disk og SKRIV I RAPPORTEN at du gjorde det:**

```
C:/Users/thyge/.claude/skills/impeccable/SKILL.md
C:/Users/thyge/.claude/skills/impeccable/reference/document.md
```

Et stille fallback må ikke kunne forveksles med, at skillen kørte.

---

## 1. Grundmåling — første kommando, før du ændrer noget

```bash
node tools/validate.mjs
node tools/build.mjs --ud=.tmp/dist-grund
node tests/koer.mjs
node fund/maal-doede-klasser.mjs
wc -l DESIGN.md
```

**Målt af mig på `003880f`, efter at `spor/doedcss` er flettet:**

| Måling | Værdi |
|---|---|
| validate | 77 filer · 0 fejl · 1 advarsel |
| build | 216 sider · 1111 tal med kilde, 0 uden |
| tests | 1481 bestået · 0 fejlet *(kørt af mig på det flettede main)* |
| linktjek | 0 døde interne links |
| ægte døde klasser | **9** |
| CSS-linjer | 3908 |
| DESIGN.md, linjer | 870 |

**Om de 9 døde klasser:** briefet til `spor/doedcss` forlangte 0, og sporet
leverede 15 med begrundelse — fire huller i min egen definition, alle
efterprøvet og alle holdt. Bagefter rettede jeg en fejl i målescriptet, som
sporet havde fundet, og tallet faldt til 9. **De 9 er ikke dit ansvar. Rør
dem ikke.** De er enten testlåste eller datastyrede; se fletbeskeden på
`afb3b39` og `fund/FUND-doedcss.md`.

**Afviger dine tal fra tabellen, så RAPPORTÉR afvigelsen. Det er en del af
leverancen, ikke ulydighed.**

---

## 2. Opgaven

**Erstat `DESIGN.md` med en beskrivelse af det designsystem, der FAKTISK
sendes ud.**

**Læs dette først, for det er ikke, som det ser ud.** Filen har allerede
korrekt spec-frontmatter — `document` HAR kørt før, og formatet er i orden.
Problemet er ikke formen. Det er, at **hver eneste værdi beskriver systemet
FØR TYPESKILT**. Målt af mig 1. sep med `fund/maal-designmd.mjs`:

| | |
|---|---|
| Farver i frontmatter, der matcher koden | **0 af 14** |
| Eksempel | `accent` står som `#0D5C86` (blå). Koden siger `#F2C400` (gul) |
| Skrifter navngivet i filen | Manrope og JetBrains Mono |
| Skrifter der faktisk ligger i `assets/fonts/` | Saira og Literata |

**Din opgave er derfor ikke at rette en gammel fil, men at skrive en ny mod
koden.** Genbrug formen, kasser indholdet. Følg `reference/document.md`:
YAML-frontmatter med maskinlæsbare tokens, derefter markdown-afsnittene i den
kanoniske rækkefølge. Udelad et afsnit, der ikke er relevant, men byt ikke om
på dem.

### Kilden er koden, ikke den gamle fil

Læs `assets/system.css` og `assets/generator.css`. **Hver eneste værdi i
frontmatter skal kunne findes i koden.** Opfind ingen token, og omdøb ikke til
pænere navne — projektets egne navne er de rigtige, også `--blaek3` og `--r5`.

Til orientering, målt af mig 1. sep: `:root` bærer **21 variabler**, heraf 16
farver og afstandsskalaen `--r1` til `--r9` = 4/8/12/16/24/32/48/64/96 px.
**Efterprøv tallet selv** — det er en påstand, ikke et facit.

---

## 3. DET VIGTIGSTE PUNKT: konflikter noteres, de afgøres IKKE

Systemet har i dag flere steder, hvor to ting kæmper om samme rolle. **Du skal
beskrive begge og markere det som en konflikt. Du må ikke vælge en vinder.**
Valget er led 2 (`extract`) og JPK's beslutning, og **designfrysen (L70) gælder
indtil da.**

Skriv dem i afsnittet `## Do's and Don'ts` eller et tilsvarende sted, hvor de
ikke kan læses som en anbefaling.

**De fire, jeg allerede har målt. Efterprøv hver af dem, og find gerne flere:**

| Konflikt | Målt 1. sep |
|---|---|
| **Knappen** | 7 klasser. `videre`/`videre--stille` på 146 og 144 sider, `nulstil` på 2, plus 3 engangsknapper til hver sin side |
| **Billedrammen** | `.billedled` sætter 16:10 i system.css, `.net .billedled` sætter 4:3 i generator.css. Den sidste vinder på specificitet. Se `fund/FUND-kortramme.md` |
| **Farvedubletter** | Flere navne, samme værdi: **5 navne** på `#E8EBED` (`--bund`, `--tom`, `--panel-ro`, `--accent-ro`, `--paafod`), 2 på `#5F686F`, 2 på `#22262A`, 2 på `#9AA3A9` |
| **Den tredje skrift** | Tre familier deklareret. `--mono` (Saira) i 67 regler, `--manual` (Literata) i 8, `--sans` (Manrope) i **3** — og Manrope har **0 fontfiler** i `assets/fonts/`, så den falder tilbage til systemskrift |

**Fælde ved den sidste:** `assets/fonts/` indeholder 10 filer, 8 `saira-*` og
2 `literata-*`. Et `grep` på `SairaSemiCondensed` mod filnavnene giver **0**,
fordi filerne hedder noget andet. Jeg faldt selv i det. Tæl filerne, søg ikke
på familienavnet.

---

## 4. Filejerskab

**Du ejer:** `DESIGN.md` · `fund/FUND-document.md` (din rapport) ·
`tests/dele/58-designmd.mjs` (ny).

**Du må LÆSE** alt i repoet. **Du må ikke ÆNDRE** stilark, skabeloner, data
eller i18n. Bemærker du en fejl i dem, så skriv den i rapporten — ret den ikke.

---

## 5. Acceptkriterier

Hvert punkt har ét kriterium. **"Giver i dag X"** er målt på DESIGN.md som den
er nu, så du kan se, at kriteriet måler noget.

**1. Hver farve i frontmatter matcher koden.** Dette er hovedkriteriet, og
måleren findes allerede — jeg skrev den, mens jeg lavede briefet:
```bash
node fund/maal-designmd.mjs
```
Giver i dag: `VAERDIER DER STEMMER: 0 af 14`.
**Færdig, når den giver `16 af 16`** — alle 16 farver i `:root` skal være
dokumenteret, og alle skal stemme. Scriptet stopper med `APPARATET ER I
STYKKER`, hvis det ikke kan udtrække noget; sker det, er det målingen og ikke
dit arbejde, og så rapporterer du det.

**2. De navngivne skrifter er dem, der faktisk ligger på disken.**
```bash
node fund/maal-designmd.mjs | tail -2
```
Giver i dag: DESIGN.md siger `Manrope lokal` og `JetBrains Mono lokal`, mens
disken har `saira-*` og `literata-*`. **Færdig, når de familier, frontmatter
navngiver, er dem, der har filer** — plus `--sans`/Manrope beskrevet som det,
den er: deklareret uden fontfil. Se konflikttabellen i afsnit 3.

**3. Slettede komponenter beskrives ikke som levende.**
```bash
grep -c 'Yderpunkt\|Hero.en\|EU-fundet' DESIGN.md
```
Giver i dag: **et positivt tal** — de har hvert sit afsnit, og alle tre er
væk fra siden. **Færdig, når de enten er 0, eller kun optræder i en
udtrykkeligt historisk note med dato.**

**4. De fire konflikter står i filen, MARKERET som konflikter.**

Bemærk, at et rå `grep` på ordene ikke duer her: `videre` giver **7** og
`16:10` giver **2** i dag, fordi de står som helt almindelige tokens i den
gamle fil. **Et kriterium, der allerede er opfyldt, måler ingenting**, og jeg
opdagede det først, da jeg kørte mit eget udkast.

Brug derfor et afsnit med en fast overskrift. Skriv præcis `## Konflikter`
som underafsnit, og kontrollen bliver:
```bash
sed -n '/^## Konflikter/,/^## /p' DESIGN.md | grep -c 'nulstil\|4:3\|#E8EBED\|Manrope'
```
Giver i dag: **0** — afsnittet findes ikke.
**Færdig, når det giver mindst 4**, altså alle fire konflikter navngivet
inden i afsnittet.

**5. Intet andet er rørt.**
```bash
git status --short
```
**Færdig, når kun dine tre ejede filer står der.**

**6. Siden er upåvirket.** validate, build og tests skal give **præcis** dine
grundmålingstal. Du rører kun dokumentation; ændrer et af tallene sig, har du
rørt noget, du ikke ejer.

**7. Din test låser resultatet.** Den skal fejle, hvis frontmatter forsvinder
eller en farve holder op med at matche koden. **Se den fejle først, og skriv i
rapporten at du gjorde det** — en test, der aldrig har været rød, beviser
ingenting.

---

## 6. Commit undervejs

Ét commit pr. sammenhængende del, og formuleringen er en **skrive**-grænse:
skriv KUN frontmatter, mål den, commit — og først DEREFTER markdown-afsnittene.
Målt to gange på agenter med samme instruks: hele arbejdet blev skrevet i ét
kald, og commit 1 bar dermed også uefterprøvet kode.

Foreslået rækkefølge: **(1)** frontmatter med tokens · **(2)** afsnit 1-4
(Overview, Colors, Typography, Layout) · **(3)** afsnit 5-8 med
konfliktnoterne · **(4)** testen.

**Commit-beskeder med backticks, `$` eller anførselstegn skrives til en fil og
committes med `git commit -F <fil>`.**

---

## 7. Miljøfælder

- **`node` er ikke på PATH i Git Bash:** `/c/Program\ Files/nodejs/node.exe`
- **`sed -i`, der ikke matcher, gør intet — tavst, med exit 0.** Brug
  Edit-værktøjet, som fejler synligt.
- **UTF-8 UDEN BOM.** DESIGN.md er dansk og fuld af tankestreger;
  `Set-Content -Encoding utf8` ødelægger dem.
- **Egen serverport**, aldrig 8080. Verificér serveren mod disken, før et
  måletal bruges.
- **Luk din server, når du er færdig med at måle, og skriv det i rapporten.**
- **Et `grep`, der bærer en konklusion, skal have en kontrol:** skriv det
  forventede tal, FØR du læser det. Et forkert mønster giver et plausibelt nul,
  og der er intet at undre sig over.

---

## 8. Rapporten — `fund/FUND-document.md`, HØJST 60 linjer

1. **Valgt løsning + fravalgt alternativ**, én linje hver.
2. **Konfidens pr. punkt.** **høj** = målt med en kommando, orkestratoren kan
   genkøre den og få samme tal, PLUS én linje om, hvad tallet ville have været,
   hvis arbejdet var forkert · **middel** = efterprøvet indirekte · **lav** =
   ikke efterprøvet. **Høj uden genkørbar kommando nedskrives til lav.**
3. **Usikkerheder mødt undervejs.**
4. **Målingerne som tal**, ikke prosa.

**Uden for de 60 linjer, obligatorisk:** *"Nye fælder og opdagelser"* (står der
intet, skal det stå) og *"Punkter i briefet, jeg ikke nåede"*.

**Og et femte punkt, særligt for dette spor:** en liste over **konflikter du
fandt, som ikke stod i afsnit 3**. Det er den mest værdifulde del af
leverancen, fordi led 2 skal afgøre dem, og en konflikt, ingen har set, bliver
til en beslutning, ingen har truffet.

---

## 9. Briefets fakta er påstande

Tallene **21 variabler**, **7 knapklasser**, **146/144/2 sider**, **5 navne på
`#E8EBED`**, **67/8/3 regler** og **10 fontfiler** er målt af mig 1. sep 2026.
**Måler du andet, så skriv det.** Orkestratoren kontrolleres ellers af ingen,
og to agenter rettede mine fakta i august, begge korrekt.
