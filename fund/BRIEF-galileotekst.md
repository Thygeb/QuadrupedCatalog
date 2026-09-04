# BRIEF — `spor/galileotekst`: gør Galileos manual læsbar, og krydstjek de 140 tal

**Model:** sonnet. **Gren:** `spor/galileotekst`. **Worktree:**
`c:\Praktik\websites\udstilling-wt-galileotekst` (**ikke oprettet endnu**).
**Rapport:** `fund/FUND-galileotekst.md`. **Forventet pris:** ~200-300k tokens.

**Kald `spor`-skillen som din første handling** — den bærer grundmålingen, skrive-grænsen,
kontrollinjen, filejerskabet, selv-efterprøvningen, rapportformen og miljøfælderne. Lykkes
kaldet ikke fra din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk og **skriv i
rapporten, at du gjorde det.** Ingen designskill er relevant — sporet rører intet visuelt.

**Kør IKKE `tests/koer.mjs`.** Du ændrer ingen kode, der påvirker suiten, og en kørsel
koster ~2,8 GB i en presset disk. Kør heller ikke `tools/build.mjs`. Det er et bevidst
valg, ikke en forglemmelse — sporet koster derved ~400 MB i stedet for ~3,2 GB.

---

## Hvorfor sporet findes

**Alle 140 kildebelagte felter på tværs af Galileos seks robotter peger på ÉN PDF, og
ingen har nogensinde kunnet læse dens tekst.** Målt af mig 4. sep 2026:

| Fil | `grep -c "kilde:"` |
|---|---|
| `galileo-c1.yaml` · `galileo-c1-w.yaml` · `galileo-e1.yaml` · `galileo-e1-w.yaml` | 23 hver |
| `galileo-s1.yaml` · `galileo-s1-w.yaml` | 24 hver |
| **I alt** | **140** |

Alle 140 citerer samme URL: WRC's download af
`Galileo-智能仿生四足机器人产品手册_20250708115131A101.pdf`, arkiveret som
`media/_kilder/raa-kand4-2026-08-25/galileo-wrc-product-manual-2025.pdf`.

`spor/f2rest` målte 2. sep 2026, at teksten er **CID-kodet** og derfor ikke kan læses som
UTF-8 — 0 af 209 streams gav sammenhængende kinesisk. Sporet konkluderede korrekt, at
Galileos ordlyd ikke kunne citeres, **men bemærkede samtidig, at PDF'en HAR seks
`ToUnicode`-CMaps til sine seks `/Type0`-fonte, så en afhængighedsfri udtrækning ER
mulig — den skal bare bygges.** Det er dette spor.

**Efterprøvet af mig 4. sep 2026, alle fire tal reproduceret:**

```
wc -c < <pdf>                                       1753565   (Å175 sagde 1.753.565)
grep -o "stream\r\?\n"        -> antal              209       (Å175 sagde 209)
grep -o "/ToUnicode"          -> antal              6         (Å175 sagde 6)
grep -o "/Subtype\s*/Type0"   -> antal              6         (Å175 sagde 6)
grep -o "/FlateDecode"        -> antal              103
```

---

## Leverance 1 — `tools/pdftekst.mjs`, afhængighedsfri

**Projektets løfte er en generator uden afhængigheder. Det gælder også dette værktøj.**
Kun Node's indbyggede moduler — `zlib` til `inflateSync`, `fs`, `path`. **Installér
ingenting, og tilføj ingen `package.json`.**

Opgaven, i den rækkefølge den skal løses:

1. Find objekterne og inflatér de `/FlateDecode`-streams, der er komprimerede.
2. Parse de seks `/ToUnicode`-CMaps. De bruger `beginbfchar`/`endbfchar` og
   `beginbfrange`/`endbfrange` — begge former skal understøttes.
3. Byg pr. font en tabel fra CID til Unicode-kodepunkt.
4. Læs tekstoperatorerne (`Tj`, `TJ`, `'`, `"`) i indholdsstrømmene, hold styr på hvilken
   font der er valgt (`Tf`), og oversæt hver CID gennem den rette tabel.
5. Skriv ren tekst ud, side for side.

**Kaldeform:** `node tools/pdftekst.mjs <pdf> [--side=N] [--ud=<fil>]`.

**Acceptkriterium 1:** færdig, når
`node tools/pdftekst.mjs media/_kilder/raa-kand4-2026-08-25/galileo-wrc-product-manual-2025.pdf`
skriver **mere end 2.000 tegn**, hvoraf **mindst 500 er CJK** (`[\u4e00-\u9fff]`).
*Giver i dag: kommandoen findes ikke — `tools/pdftekst.mjs` er ikke oprettet.*

**Acceptkriterium 2 — ingen afhængigheder.** Færdig, når hver `import`/`require` i filen
peger på et Node-indbygget modul. Skriv listen i rapporten.
*Giver i dag: n/a.*

---

## Leverance 2 — krydstjek de 140 tal mod den udtrukne tekst

**Det er her værdien ligger, og det er derfor sporet ikke bare er et værktøjsspor.** Når
teksten er læsbar, kan hvert af de 140 tal for første gang efterprøves mod sin egen kilde.

Brug den **tre-kasse-form**, L93 satte for fase 2 (`STATUS.md` Å173) — den er allerede
projektets standard for præcis denne slags:

- **A** — tallet findes som bogstavelig delstreng i den udtrukne tekst.
- **B** — tallet findes **ikke**, og du skriver **den søgning, der giver 0 træffere**.
- **C** — uafgjort, meldt.

**A + B + C skal summe til 140.** En B-række uden sin søgning er et hul; en B-række med
sin søgning er et resultat.

**Ret INTET i `data/robots/`.** Sporet måler og rapporterer; rettelser er en senere
beslutning, og `data/robots/` ejes desuden af et andet spor lige nu.

**Acceptkriterium 3:** færdig, når rapporten bærer en tabel med A-, B- og C-tal, der
summer til **140**, og hver B-række har sin nul-søgning skrevet ud.
*Giver i dag: 0 af 140 efterprøvet — teksten er ulæselig.*

**Forudsigelse, ikke krav: jeg gætter, at A bliver højt, fordi tallene formentlig er
indsamlet fra PDF'ens tabeller via billed-aflæsning. Ram ikke mit gæt — mål det.**
Bliver A lavt, er det et vigtigere fund end et højt A, og det skal stå øverst i rapporten.

---

## To forbehold, der skal stå i rapporten

**1. `raa-kand4-2026-08-25/` har INGEN `MANIFEST.tsv`** — målt af mig i dag
(`ls media/_kilder/raa-kand4-2026-08-25/MANIFEST.tsv` → findes ikke). Det er én af de fem
mapper, Å175 fandt uden manifest. **Konsekvensen for netop dette spor:** filnavn↔URL er
**ikke bevist** for PDF'en, kun sandsynligt ud fra navnet. Din udtrukne tekst kan derfor
belægge, at *et dokument med dette indhold* siger noget — ikke at det er præcis det
dokument, YAML'ens URL peger på.

**Skriv det som et forbehold ved dine A-rækker.** Foreslå ikke at skrive manifestet;
det kræver JPK.

**2. Galileos ni forbehold i databasen citerer IKKE producenten.** Å175 målte det:
*"as expected once the wheel-legs are added"*, *"opposite to C1-W"*, *"an analogy drawn
from the C1/C1-W pair"* — det er vores egne sammenligninger. **PDF-blokeringen var reel og
fuldstændig irrelevant for netop de ni.** Gå derfor ikke i gang med at "redde" dem; dit
krydstjek gælder de **140 kildebelagte talfelter**, ikke de ni forbehold.

---

## Filejerskab

**Du ejer og må skrive i:**

- `tools/pdftekst.mjs` — ny fil.
- `fund/FUND-galileotekst.md` — din rapport.
- `fund/galileotekst-uddrag.txt` — den udtrukne tekst, hvis den er under 1 MB. Er den
  større, så gem kun de sider, dit krydstjek bruger, og skriv hvorfor.

**Du må IKKE røre:** `data/` · `db/` · `assets/` · `DESIGN.md` · `STATUS.md` · `CLAUDE.md` ·
`PLAN.md` · `.claude/` · nogen anden fil i `tools/` · nogen fil i `tests/` ·
`media/_kilder/` (kun læsning).

**Et andet spor kører i repoet:** `spor/fase3` ejer `tools/build.mjs`,
`tools/validate.mjs`, `tests/dele/_faelles.mjs`, `tests/koer.mjs`, `db/hent.mjs` og
`data/robots/`. **Din nye fil rører ingen af dem.**

---

## Miljø

- **`node` er ikke på PATH i Git Bash.** Brug `"/c/Program Files/nodejs/node.exe"`.
- **`media/_kilder/` er GITIGNORERET og følger IKKE med worktreen.** Uden den findes
  PDF'en ikke, og sporet er umuligt. Jeg kopierer den ind ved opsætningen — **efterprøv
  det som din første handling** med
  `ls media/_kilder/raa-kand4-2026-08-25/galileo-wrc-product-manual-2025.pdf` og
  `wc -c` på den (**skal give 1753565**). Giver den noget andet, så stop og meld det.
- **Læs PDF'en i bidder.** Å-historikken har to spor, der døde på 600-sekunders stalls i
  PDF-tunge opgaver. Vent aldrig på retries — ét ekstra forsøg, videre med en note.
- **Kald aldrig `process.exit()` efter et `fetch()`** — den kombination crasher `node.exe`
  v24.13.0 med en libuv-assertion og exit 127. Sporet henter dog intet fra nettet, så det
  bør ikke blive aktuelt. **Hent ikke noget fra nettet.**
- **Skriv filer med UTF-8 uden BOM.** Den udtrukne tekst er kinesisk; en BOM eller en
  forkert kodning ødelægger krydstjekket tavst.

## Commit-rækkefølge

1. `tools/pdftekst.mjs`, når acceptkriterium 1 og 2 er grønne — ét commit.
2. Den udtrukne tekst — ét commit.
3. Krydstjekket og rapporten — ét commit.

**Commit undervejs.** Et spor, der dør, skal efterlade sit arbejde. **Flet ikke, og push
ikke.**

---

## Briefets fakta er påstande

Alle tal ovenfor er mine egne målinger fra 4. sep 2026 eller citater fra `STATUS.md`
Å175, mærket som sådan. **Afviger noget, du måler, fra noget, briefet påstår, så
rapportér afvigelsen** — det er en del af leverancen, ikke ulydighed.

## Opsætning (orkestratorens, ikke din)

```
git worktree add ../udstilling-wt-galileotekst -b spor/galileotekst
cp -r media/_kilder ../udstilling-wt-galileotekst/media/_kilder
```

`.env` og `assets/fotos/fabrikant/` er **ikke** nødvendige — sporet kører hverken
`validate.mjs` eller `build.mjs`. `media/_kilder/` er ~170 MB.
