# BRIEF — `spor/f2-kildejagt`: to påstande uden belæg, RIVR og Boston Dynamics

**Worktree:** `C:/Praktik/websites/udstilling-wt-kildejagt` · **Gren:** `spor/f2-kildejagt`
**Forgrenet fra main `90c27a5`.**
**Forventet pris:** ~80k tokens. **Gæt**, ikke krav — mål og rapportér.

**Dette er det mindste spor i fase 2 målt i celler — to — og det eneste, hvor
konklusionen kan blive "slet".** Læs afsnit 2, før du gør noget.

---

## 0. Første handling

Kald **`spor`-skillen**. Lykkes kaldet ikke fra din worktree, så læs
`.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du gjorde det**.
Vurdér desuden `robotdata` (især G1 om kilder) og `supabase`.

---

## 1. Baggrunden

`spor/f2-vest` fandt 2. sep 2026 to påstande i `robots.notes`, **der ikke kunne
efterprøves mod nogen kilde** — heller ikke efter friske hentninger samme dag. Sporet
fulgte L87's tvivlsregel korrekt: **hverken slettet eller oversat.** Begge står stadig på
dansk og har ventet på en beslutning siden.

**JPK har besluttet, 3. sep 2026: der skal en frisk kildejagt først. Lykkes den, beholdes
påstanden med sin kilde. Lykkes den ikke, slettes den.**

**Bemærk, hvad spørgsmålet IKKE er:** begge påstande er efter alt at dømme **sande i
verden**. Det er ikke et faktatjek. Spørgsmålet er, om en påstand uden en gemt kilde må stå
i kataloget — og det er hård begrænsning 2's område: *"Opfind aldrig tal, cases,
certificeringer eller kapaciteter."* En sand påstand uden belæg er stadig uden belæg.

---

## 2. De to påstande, ordret fra databasen

Begge er **elementer i et jsonb-array** (`robots.notes`), ikke hele feltet. Du rører kun
det ene element; de øvrige elementer i samme array skal stå **uændrede**.

**A. RIVR ONE — robot `2230`, slug `rivr-one`.** Element 1 af 2:

> `Tidligere Swiss-Mile. RIVR Technologies AG, udspring fra ETH Zuerich. Hjul-ben-hybrid.`

Bemærk: den bærer **tre** påstande — tidligere navn, selskabsnavn/ophav, og konstruktionstype.
**De skal efterprøves hver for sig.** "Hjul-ben-hybrid" er formentlig let at belægge fra
produktsiden; ophavet fra ETH Zürich er den svære.

**B. Boston Dynamics Spot — robot `2188`, slug `boston-dynamics-spot`.** Element 2 af 3:

> `Majoritetsejet af Hyundai Motor Group (Sydkorea). Noteret fordi producentland bliver tvetydigt.`

Bemærk: anden sætning er **vores egen begrundelse for at notere det**, ikke en påstand om
verden. Den skal ikke belægges — men den giver kun mening, hvis første sætning bliver stående.

**De øvrige elementer i begge arrays er allerede engelske og er IKKE dine.** Rør dem ikke.

---

## 3. Opgaven, i rækkefølge

1. **Hent friskt.** Producenternes egne sider først; derefter, hvis nødvendigt,
   pressemeddelelser og selskabsregistre. **Gem alt hentet materiale** i
   `media/_kilder/raa-f2-kildejagt-2026-09-03/` med en `MANIFEST.tsv` i samme form som de
   øvrige mapper dér — se en eksisterende for formatet. Mappen er gitignoreret og følger
   **ikke** med grenen; skriv i rapporten, at den ligger i worktreen, så orkestratoren kan
   kopiere den ud, før worktreen fjernes.
2. **Efterprøv hver påstand for sig** mod det hentede. En påstand er belagt, når du kan
   citere en konkret sætning fra en gemt fil.
3. **Skriv resultatet** efter reglen i afsnit 4.

---

## 4. Reglen — hvad der sker med hver påstand

**BELAGT:** oversæt til engelsk, og sørg for at kilden er gemt og noteret. Er der ingen
`source`-kolonne på `robots.notes`, så skriv kilden i `change_reason` og i rapporten, og
**meld i rapporten, at feltet mangler en kildekolonne** — det er en strukturel observation,
orkestratoren skal have.

**IKKE BELAGT:** **slet påstanden.** Den oversættes ikke.

**Hvad "slet" betyder præcist:** `fund/BRIEF-FAELLES.md`s afsnit *"Hvad 'slettes' betyder
præcist — HELE trioen, ikke prosaen alene"* gælder. Her har påstandene ingen separat
ordlyd- eller kildekolonne, så trioen er array-elementet selv. **Fjern elementet fra
arrayet** — efterlad ikke en tom streng og ikke en forkortet version.

**I TVIVL:** lad den stå på dansk og skriv hvorfor. Det er stadig et gyldigt udfald, og det
er bedre end et forkert valg. Men **skriv præcist, hvad du søgte efter, og hvor** — en
tvivl uden en søgning kan ikke bruges til noget næste gang.

---

## 5. Grundmåling

```
node db/fase2-tjek.mjs --dansk --producent="RIVR"
node db/fase2-tjek.mjs --dansk --producent="Boston Dynamics"
node db/fase2-tjek.mjs --tal   --producent="RIVR"
node db/fase2-tjek.mjs --tal   --producent="Boston Dynamics"
```

**Giver i dag:** RIVR `robots.notes` 2 i alt / **1 dansk** · Boston Dynamics
`robots.notes` 3 i alt / **1 dansk**.

**Talaftryk, målt af mig 3. sep umiddelbart før afsendelse:**

- RIVR: `43dff8fb1d672438a9088d5bba5463b02c29a537849e00f54e12dc0fb39ff3a4`
- Boston Dynamics: `7bda7f12088419555361a6f1e21558d44205ace2487dd5a3e3a967f7ed4348f6`

Kør `--tal` igen til sidst. Afviger et aftryk, har du rørt en talkolonne — **stop og meld**.

---

## 6. Rækkeejerskab og filejerskab

**Rækker:** **kun robot 2230 og 2188.** To rækker, ikke én mere. To andre spor kører
parallelt (`spor/f2-galileo`: Yuejia Lingdong + Galileo (Tianjin) · `spor/f2-feje`:
GENISOM, Astrall, CVTE, Yufan, Xiaomi). Ingen overlap med dig.

**Bemærk:** `change_log` indeholder allerede rækker på Boston Dynamics og RIVR fra
`spor/f2-vest`. **Filtrér på `changed_by='spor/f2-kildejagt'`**, ellers ligner deres rækker
en ejerskabsfejl hos dig.

**Filer, du ejer:** `fund/FUND-f2kildejagt.md` · `fund/BRIEF-f2-kildejagt.md` ·
`fund/f2kildejagt-*` · `media/_kilder/raa-f2-kildejagt-2026-09-03/`
**Rør ikke:** `data/robots/`, `tools/`, `assets/`, `tests/`, `STATUS.md`, `CLAUDE.md`,
`DESIGN.md`, `db/*.mjs`, `fund/BRIEF-FAELLES.md`.

---

## 7. Acceptkriterier

1. **Hver af de to påstande har fået ét af tre udfald**, og udfaldet står i rapporten med
   begrundelse: belagt+oversat · slettet · stående i tvivl.
   For RIVR gælder det **hver af de tre delpåstande** i elementet, ikke elementet som helhed.
2. **Kildejagten er dokumenteret med tal:** hvor mange sider du hentede, hvor mange
   påstande du kunne belægge, hvor mange ikke. *Et "kunne ikke findes" uden en søgning er
   ikke et resultat.*
3. **De øvrige array-elementer er uændrede.** Efterprøv ved at sammenligne `notes` før og
   efter: RIVR skal have **2 elementer minus eventuelt slettede**, Boston Dynamics **3
   minus eventuelt slettede**, og de ikke-berørte skal være byte-identiske.
4. **Begge talaftryk uændrede.** Se afsnit 5.
5. **Nul rækker uden for 2230 og 2188** på `changed_by='spor/f2-kildejagt'`. Giver i dag
   **0 rækker i alt** — det er kontrollinjen.

---

## 8. Miljø

- **Kør IKKE `node tests/koer.mjs`** (2,8 GB) og **IKKE `tools/build.mjs`**.
- **Node ikke på PATH i Git Bash:** `"/c/Program Files/nodejs/node.exe"`.
- **Har en fil lavet et `fetch()`, så kald ALDRIG `process.exit()` bagefter** — sæt
  `process.exitCode` og lad løkken tømme sig. `node.exe` v24.13.0 crasher ellers med
  libuv-assertionen `src\win\async.c:76`, exit 127, også når kaldet lykkedes.
  **Det rammer netop dette spor**, fordi du henter over nettet.
- **Læs aldrig en exitkode gennem en pipe.**
- **En MSYS-sti som argument til node læses som Windows-sti** — brug `C:/...`.
- **`grep -r` over `media/_kilder/` kan give et falsk 0**, hvor `grep -c` direkte på filen
  finder mønstret. Kontrollér et 0-resultat mod den enkelte fil, før du konkluderer
  *"ikke belagt"* — her afgør det udfaldet.
- `.env`, fotos og `media/_kilder/` er kopieret ind.

---

## 9. Rapport

`fund/FUND-f2kildejagt.md`, højst 60 linjer plus `spor`-skillens to obligatoriske
sektioner. **Skriv udfaldet for hver delpåstand på sin egen linje** — det er dokumentet,
JPK læser for at se, om beslutningen blev fulgt.

**Briefets fakta er påstande.** Afviger noget, du måler — de citerede strenge, antallet af
array-elementer, robot-id'erne — så er afvigelsen **en del af leverancen**, ikke ulydighed.
