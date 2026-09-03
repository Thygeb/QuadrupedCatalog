# BRIEF — `spor/f2-valuetext`: kolonnen, den kanoniske skrivevej ikke kan nå

**Worktree:** `C:/Praktik/websites/udstilling-wt-valuetext` · **Gren:** `spor/f2-valuetext`
**Forgrenet fra main `90c27a5`.**
**Forventet pris:** ~200k tokens. **Gæt**, ikke krav — mål og rapportér.

**Du har to opgaver, og den første er kode.** Punkt 1 skal være færdigt og committet, før
punkt 2 begynder — ellers har du ingen lovlig vej til at skrive.

---

## 0. Første handling

Kald **`spor`-skillen**. Lykkes kaldet ikke fra din worktree, så læs
`.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du gjorde det**.

Vurdér desuden **`supabase-postgres-best-practices`** (du rører skrivevejen til databasen)
og `fejljagt`. Skriv hvilke du valgte og fravalgte.

---

## 1. Hullet, du skal lukke — målt 3. sep 2026

`db/f2-skriv.mjs` er **den eneste lovlige skrivevej** i fase 2. Dens hvidliste,
`TEKSTKOLONNE_HVIDLISTE`, indeholder tolv kolonner:

```
caveat · caveat_wording · caveat_class · note · note_wording · notes ·
notes_wording · quote · quote_wording · alt · manufacturer_city · manufacturer_country
```

**`value_text` står ikke på den.** Kontrolmåling, som du skal genkøre:

```
sed -n '/TEKSTKOLONNE_HVIDLISTE/,/\]/p' db/f2-skriv.mjs | grep -c "value_text"
```

**Giver i dag 0.**

**Men `fund/BRIEF-FAELLES.md` — fase 2's fælles brief — LISTER `value_text` som en kolonne,
sporene må røre**, og har et helt afsnit om, hvordan den skal oversættes
(*"`value_text` er ny i denne runde — læs hvorfor"*). **Prosaen og koden er altså uenige,
og denne gang er det prosaen, der har ret om hensigten, og koden, der spærrer.**

Konsekvensen er målt i `change_log`: de fire gamle spor ændrede `value_text` alligevel —
galileo 50 rækker, genisom 23, vest 20, unitree 2 — altså **uden om den kanoniske
skrivevej, gennem deres egne scripts**. Det er præcis det, hvidlisten findes for at forhindre.

`spor/f2-weilanyoubaote` meldte det som *"strukturelt urørlig fra skriveskriptet"* og lod
korrekt være med at røre den.

---

## 2. Punkt 1 — udvid hvidlisten, og bevis det med en test

**Tilføj `value_text` til `TEKSTKOLONNE_HVIDLISTE` i `db/f2-skriv.mjs`.**

**Læs kommentaren over konstanten først** og skriv en linje i samme ånd om, hvorfor
`value_text` er anderledes end de øvrige: **den er feltets SVAR, ikke en bemærkning om
svaret** — den vises som robottens data. `BRIEF-FAELLES.md`s afsnit siger det præcist:
oversæt kun betydningen, aldrig indholdet; `"grundlæggende"` → `"basic"`, ikke
`"basic (entry-level)"`. **Ændrer du betydningen, har du ændret et datapunkt, og det er
lige så alvorligt som at røre et tal.**

**DU HAR FÅET TESTNUMMER 80.** Ingen andre numre. Målt: højeste på main er 76, og 77-79 er
reserveret af en anden session på grene, der endnu ikke er flettet. Læs
`tests/LAESMIG.md`s *"Kontrakten for en ny del"* og følg den. Filen hedder
`tests/dele/80-<kort-navn>.mjs`.

**Testen skal bevise reglen, ikke bare at koden kører:**

- at `value_text` ER på hvidlisten
- at en kolonne uden for hvidlisten stadig AFVISES — så testen fejler, hvis nogen senere
  åbner listen helt. **Uden det andet ben beviser den ingenting.**

**Acceptkriterium for punkt 1:** `node tests/koer.mjs` går fra sit nuværende tal til samme
tal plus dine nye. **Kør den ÉN gang efter punkt 1 og ÉN gang til sidst — ikke oftere.**
Suiten koster 2,8 GB i `tests/.tmp-koersel`, og disken har været 98 % fuld i dag.
**Mål og skriv suitens tal FØR du rører noget** — det er din grundmåling for punkt 1.

**Commit punkt 1 for sig, før punkt 2 begynder.**

---

## 3. Punkt 2 — de danske `value_text`-celler

`db/fase2-tjek.mjs` måler **ikke** `value_text`. Din liste kommer derfor fra en direkte
måling, ikke fra instrumentet. Målt af mig 3. sep, celler med æøå — altså **beviseligt**
danske:

| Producent | Danske `value_text` | af i alt |
|---|---|---|
| Pudu Robotics | **6** | 10 |
| MagicLab | **4** | 12 |
| Addverb | **3** | 5 |
| DEEP Robotics | **2** | 19 |
| WEILAN | **2** | 5 |
| **I alt** | **17** | |

**`Addverb` er værd at standse ved:** den har aldrig optrådt på nogen dansk-liste i hele
fase 2, fordi instrumentet ikke måler den kolonne. Der kan være flere producenter i samme
situation.

**De 17 er et GULV, ikke et facit.** Æøå fanger kun det åbenlyse — samme blindpunkt som
Å156 beskriver. **Læs alle `value_text`-celler hos dine producenter igennem**, ikke kun de
17. Rapportér to tal: hvor mange du læste, og hvor mange danske du fandt.

---

## 4. Ejerskab — det deles på KOLONNE her, ikke kun på producent

**Du ejer kolonnen `value_text` alene.** Ingen andre spor skriver i den.

`spor/f2-blindpunkt` kører parallelt med dig og læser i de samme robotter. **Den må læse
`value_text`, men ikke skrive i den** — finder den dansk der, rapporterer den det i stedet.
**Dens fund kan komme til dig via orkestratoren undervejs.**

**Du må KUN skrive i `value_text`.** Finder du dansk i `caveat`, `note` eller en anden
kolonne, så **rapportér det, ret det ikke** — det er `spor/f2-blindpunkt`s kolonner.

**Producenter, du IKKE må røre** — tre andre spor ejer dem:

| Spor | Producenter |
|---|---|
| `spor/f2-galileo` | Yuejia Lingdong · Galileo (Tianjin) |
| `spor/f2-feje` | GENISOM AI · Astrall Dynamics · CVTE · Yufan Intelligent · Xiaomi |
| `spor/f2-kildejagt` | RIVR (2230) · Boston Dynamics (2188) |

Alle øvrige producenter er dine, for `value_text`.

**Filer, du ejer:** `db/f2-skriv.mjs` · `tests/dele/80-*.mjs` · `fund/FUND-f2valuetext.md` ·
`fund/BRIEF-f2-valuetext.md` · `fund/f2valuetext-*`
**Rør ikke:** `data/robots/`, `tools/`, `assets/`, `STATUS.md`, `CLAUDE.md`, `DESIGN.md`,
`db/fase2-tjek.mjs`, `fund/BRIEF-FAELLES.md`, og **ingen anden fil i `tests/`** end din egen.

---

## 5. Grundmåling

```
node tests/koer.mjs                                    (ÉN gang, før alt)
node db/fase2-tjek.mjs --tal --producent="<hver af dine producenter med danske celler>"
```

**Talaftryk, målt af mig 3. sep umiddelbart før afsendelse:**

- DEEP Robotics: `a171780a9161f141c0cbd9a63830f82501b8073f4885eec76afbacff8c08c501`
- MagicLab: `596709137cf961440e755197f49df088a49b8dffcf003aaf4ba61286adc3977d`
- Pudu Robotics: `bb0e94d61eda255140d751c9c0c661b14a07cb23e7242e5c725fbb34e305f08d`
- WEILAN: `5fa1a923731e85704686dafe0d2062e6fb989cbe6f2d0c60bb1a3ac6909ca7dc`

**Addverb har jeg ikke målt** — det er en udeladelse i mit brief, ikke et fravalg. Mål den
selv som det første, og skriv aftrykket i din rapport.

**`value_text` er en TEKSTkolonne, så aftrykket skal være uændret**, selv om du skriver i
den. Er det ikke, har du rørt et tal — **stop og meld.**

---

## 6. Acceptkriterier

1. **`value_text` er på hvidlisten.** Kontrolmålingen i afsnit 1 giver **1** i stedet for 0.
2. **Test 80 findes, og begge ben består:** `value_text` accepteres, en ikke-hvidlistet
   kolonne afvises stadig. `node tests/koer.mjs` giver dit grundmålingstal plus dine nye,
   **0 fejlede**.
3. **Alle `value_text`-celler hos dine producenter er læst.** To tal: læste · danske fundet.
   Giver i dag mindst **17** med æøå — men det er et gulv, og dit tal kan være højere.
4. **Hver dansk `value_text` er oversat efter betydning, ikke udvidet.** Ét eksempel pr.
   robot i rapporten, så oversættelsen kan bedømmes.
5. **Alle talaftryk uændrede**, Addverb inklusive.
6. **Nul rækker uden for `value_text`** og nul uden for dine producenter, målt på
   `changed_by='spor/f2-valuetext'`. Giver i dag **0 rækker i alt** — kontrollinjen.

---

## 7. Miljø

- **`node tests/koer.mjs` må køres PRÆCIS TO GANGE** — grundmåling og slutmåling. Ikke
  oftere. `tools/build.mjs` skal ikke køres.
- **Node ikke på PATH i Git Bash:** `"/c/Program Files/nodejs/node.exe"`.
- **Læs aldrig en exitkode gennem en pipe.** `node tests/koer.mjs | tail -3` giver pipens
  kode, ikke node's — et krash så ud som exit 0 for et spor i går. Skriv til en fil.
- **En MSYS-sti som argument til node læses som Windows-sti** — brug `C:/...`.
- **PostgREST kapper ved 1000 rækker uden fejl.** `field_entries` har 2541.
- **Byte-lighed mod en committet fil er en fælde:** `core.autocrlf=true` checker ud med
  CRLF, mens node skriver LF. Normalisér `\r\n` → `\n` på begge sider i din test.
- `.env`, fotos og `media/_kilder/` er kopieret ind.

---

## 8. Commit-rækkefølge og rapport

1. Grundmåling (suite + aftryk). Commit.
2. **Hvidliste + test 80. Commit.** Punkt 2 begynder ikke før dette står.
3. Gennemlæsning og klassificering af `value_text`. Commit.
4. Skrivning + eftermåling. Commit.
5. Rapport. Commit.

Rapport: `fund/FUND-f2valuetext.md`, højst 60 linjer plus `spor`-skillens to obligatoriske
sektioner.

**Briefets fakta er påstande** — især de 17, producentlisten og at 80 er ledigt. Måler du
noget andet, er afvigelsen **en del af leverancen**, ikke ulydighed. Er nummer 80 optaget,
når du når dertil, så **stop og meld det** frem for at vælge et andet selv.
