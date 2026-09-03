# BRIEF — `spor/doedcss2`: de fem klasser, 2. sep efterlod

**Model: sonnet** (rugbrødsarbejde med målbart facit, L45). **Worktree:**
`C:/Praktik/websites/udstilling-wt-doedcss2`, gren `spor/doedcss2`, forgrenet fra `44fec14`.

## LÆS DETTE FØRST — der har været et spor før dig

`spor/doedcss` kørte **1. sep 2026** og er flettet til main. Dens rapport er
`fund/FUND-doedcss.md`, dens brief `fund/BRIEF-doedcss.md`, og dens måleværktøj
`fund/maal-doede-klasser.mjs`. **Læs rapporten, før du rører noget.**

Den fjernede størstedelen af 66 døde klasser og **efterlod bevidst 15**, med begrundelse.
Fire af dem — `kort-navn`, `gitter`, `stribe--kompakt`, `filtre` — venter på **en menneskelig
beslutning** om, hvorvidt de er bevidst bevarede reserver. Andre er spærret af vagter i
`tests/dele/14` og `tests/dele/16`.

**Du rører ingen af de 15.** Din opgave er de fem klasser, der døde **efter** det spor, da
sidefoden og prisomregningen forsvandt 2. sep. Målt af mig: `fod`, `haard` og `pris-om` er
nævnt **0 gange** i `FUND-doedcss.md` (kontrol: `kort-navn` er nævnt 2 gange). Der er nul
overlap.

**Sporet noterede også en regex-fejl i `fund/maal-doede-klasser.mjs` linje 48**, som det ikke
måtte rette. Den er stadig der. **Ret den ikke** — den er heller ikke din; brug værktøjet med
det forbehold, eller mål selv og skriv hvordan.

## Første handling

**Kald `spor`-skillen.** Den bærer grundmålingen, skrive-grænsen, kontrollinjen,
filejerskabet, selv-efterprøvningen, rapportformen og miljøfælderne. Lykkes kaldet ikke fra
din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du
gjorde det**.

Ingen designskill. **Sporet er undtaget designfrysen L70**, fordi det fjerner regler, ingen
side bruger — det ændrer intet udseende. **Ændrer du én pixel, har du gjort noget forkert.**

## Grundmåling — din FØRSTE kommando

```
"/c/Program Files/nodejs/node.exe" tools/validate.mjs   # mit tal: 77 filer / 0 fejl / 1 advarsel
"/c/Program Files/nodejs/node.exe" tools/build.mjs      # mit tal: 216 sider, 1111 tal med kilde / 0 uden
```

Afviger dine tal fra mine, så **stop og rapportér** — det er miljøet, ikke dit arbejde.

**Testsuiten:** sidste målte tal er **1658 bestået / 0 fejlet** (den anden sessions måling;
kun dokument-commits siden). Det er en **forudsigelse**, ikke et krav — mål og skriv det
faktiske. Kør den **én gang før og én gang efter**: hver kørsel koster **2,8 GB** disk, og
fire fase 2-worktrees står på samme disk.

## Opgaven — fem klasser, målt fra tre uafhængige vinkler

| Klasse | Selektorer | Levende brug i `dist` | I `tools/skabelon/` | I `assets/*.js` |
|---|---|---|---|---|
| `.fod` | **6** (`system.css:1713-1718`) | 0 | 0 | 0 |
| `.haard` | **1** (`:1716`, kun som `.fod .haard`) | 0 | 0 | 0 |
| `.pris-om` | 1 (`:2161`) | 0 | 0 | 0 |
| `.pris-om__tal` | 1 (`:2165`) | 0 | 0 | 0 |
| `.pris-om__ord` | 1 (`:2168`) | 0 | 0 | 0 |

**Kontrol, så du ved at mønsteret virker:** `knap` giver **8** selektorer, **416** brug i dist
og **9** i skabelonerne.

`.fod` er sidefoden, fjernet 2. sep. `.pris-om`-trioen er prisomregningen, som blev afløst.

## FÆLDEN, DER GØR SPORET IKKE-TRIVIELT — læs den, før du sletter

**Tokens `--fod`, `--paafod` og `--paafod2` ser ud til at høre til sidefoden. Det gør de
ikke.** Målt af mig:

| Token | Brug i alt | Brug **uden for** `.fod`-blokken (1713-1718) |
|---|---|---|
| `--fod` | 3 | **2** |
| `--paafod` | 10 | **7** |
| `--paafod2` | 4 | **3** |

**Fjern dem ikke.** En "oplagt oprydning" af dem er den præcise måde, sporet kan knække noget.

**Men efterprøv mit tal:** jeg har ikke undersøgt, om de øvrige kaldsteder selv er levende
regler eller andre døde blokke. Er de også døde, så **skriv det som et fund — slet dem ikke.**
Det bliver i så fald et nyt spor.

**`system.css:2829` er en kommentar**, der nævner *"sidefodens `.haard`"* — den beskriver
noget, der ikke længere findes. **Ret kommentaren.** En kommentar, der peger på en slettet
regel, er værre end ingen kommentar.

## Ejerskab — hård grænse

**Du ejer:** `assets/system.css` · `assets/generator.css` · `fund/BRIEF-doedcss2.md` ·
`fund/FUND-doedcss2.md`

**Du rører ikke:** `fund/BRIEF-doedcss.md`, `fund/FUND-doedcss.md`,
`fund/maal-doede-klasser.mjs` (forgængerens, arkiv) · `db/**` · `data/robots/**` ·
`media/_kilder/**` · `PLAN.md` · `DATAFLOW.md` · `tests/**` · `tools/**` · `assets/*.js`.
`tests/dele/63, 64, 68, 69, 71` er den anden sessions, som kører fase 2.

To fladeplan-spor kører samtidig i `spor/katalogplan` og `spor/samlplan`; de skriver kun i
`fund/PLAN-*.md` og kolliderer ikke med dig.

**Dokumentregel:** genbrug aldrig et dokumentnavn — derfor `doedcss2`, ikke `doedcss`.

## Acceptkriterier — hvert kørt mod main af mig 3. sep, med "giver i dag X"

1. `grep -cE '^[^/*]*\.fod[ ,{:]' assets/system.css` → **giver i dag 6**, skal være **0**.
2. `grep -cE '^[^/*]*\.pris-om[ ,{:]' assets/system.css` → **giver i dag 3**, skal være **0**.
3. `grep -c 'var(--paafod)' assets/system.css` → **giver i dag 10**, skal være **9**.
   **Bliver det 0, har du slettet tokenet — det er en fejl, ikke en oprydning.**
4. `"/c/Program Files/nodejs/node.exe" tools/build.mjs` → **samme sidetal som din
   grundmåling** (ikke et hårdkodet tal).
5. **Byte-identisk output.** Byg før og efter, sammenlign `dist/` fil for fil → **0
   forskelle.** Fjerner du kun døde regler, kan der pr. definition ikke være én ændret byte.
6. `git diff --name-only main...spor/doedcss2` → **præcis** `assets/system.css` og dine to
   `fund/`-filer. Rører du `generator.css`, skal rapporten sige hvorfor.

**Kriterium 5 er det vigtigste.** Kan du ikke få det til at give 0, så **stop og rapportér** i
stedet for at lempe det.

## Miljø

- **node:** `/c/Program Files/nodejs/node.exe` — ikke på PATH i Git Bash. Bar `node` giver
  **exit 127**, som ligner libuv-fælden fra CLAUDE.md, men er bash' `command not found`.
  **Læs fejlteksten, ikke koden.**
- **Din serverport er 8142.** Aldrig 8080. Verificér serveren mod disken, før ét tal bruges.
  **Luk den, når du er færdig, og skriv i rapporten, at du gjorde det** — fem forældreløse
  servere blev fundet 1. sep, hvoraf to låste worktree-mapper.
- **Serveren må ikke køre, når du bygger** — den låser `dist/`, og bygget fejler med EPERM.
- `.env` og `assets/fotos/fabrikant/` (**610 filer**) er kopieret ind af mig. Mangler de,
  fejler `validate.mjs` med 54 fejl, som **ikke** er dine.
- **Et grep på en klasse tæller kommentarer med — og bindestreger:** `\bfod\b` matcher
  `chip-fod`, hvilket gav mig 4 mod 0 i går. Mål **selektorer**
  (`^[^/*]*\.klasse[ ,{:]`), og kør altid en positiv kontrol.
- **`rm -rf` står i projektets `deny`-liste.** Du kan ikke rydde `tests/.tmp-koersel`. Det er
  forventet — skriv det, hvis det generer, men brug ikke tid på at omgå det.
- UTF-8 uden BOM · `git commit -F <fil>` ved backticks · `sed -i` fejler **tavst med exit 0**,
  brug Edit, som fejler synligt.
- **Commit undervejs** — ét commit pr. slettet klasse.

## Rapporten — `fund/FUND-doedcss2.md`, højst 60 linjer

Valgt/fravalgt løsning · konfidens pr. punkt (**høj kræver genkørbar kommando plus én linje
om, hvad tallet ville have været, hvis arbejdet var forkert**) · usikkerheder · målinger som
tal. **Uden for de 60, obligatorisk:** "Nye fælder og opdagelser" og "Punkter i briefet, jeg
ikke nåede" — skriv eksplicit, hvis der ingen er.

**Briefets fakta er påstande.** Afviger din måling fra min, så rapportér afvigelsen — det er
en del af leverancen, ikke ulydighed. Mine tabeller er målt med grep, ikke i en browser.
