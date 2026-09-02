# BRIEF — spor/f2-vaern: to live farer, der kun findes som advarsler i prosa

**Model: Sonnet. Egen worktree.** Du skriver **INTET** i databasen. Du læser den.

Arbejdsmappe: `C:\Praktik\websites\udstilling-wt-f2vaern` (gren `spor/f2-vaern`).
Rør aldrig `c:\Praktik\websites\udstilling` (hovedrepoet — to sessioner arbejder
i det), `c:\Praktik\websites\salg` eller `c:\Praktik\website`.

## Regel 0 — skill-vurdering, skriv den

Skriv **hvilken skill du valgte og hvilke du gik forbi, med begrundelse.**
Overvej mindst `supabase`, `fejljagt` og `robotdata`. *"Ingen skill passer her"*
er gyldigt, men skal skrives. Lykkes et skill-kald ikke fra worktreen, så læs
`SKILL.md` fra disk og **skriv i rapporten at du gjorde det.**

## Læs først

`CLAUDE.md`, især **værktøjsafsnittet** (Node-fælden står der) · `db/LAESMIG.md` ·
`STATUS.md`s Å132 og Å134 · `db/hentbyg.mjs` og `db/eksporter.mjs` helt igennem.

## Hvorfor du findes

Fire fase 2-spor oversætter lige nu databasen fra dansk til engelsk. Midt i det
arbejde findes der to farer, som kun er skrevet ned som advarsler i prosa — og
**en advarsel i et dokument stopper ikke en kommando.**

**Fare 1: `db/hentbyg.mjs` er JPK's ét-kommando-vej.** Den gør
`eksporter --fra-db` → **`git commit`** → `build`. Databasen er halvt oversat
lige nu (målt: `caveat` 890 i alt, **795 stadig danske**). En kørsel ville skrive
77 halvt engelske filer ned i `data/robots/` som *"dansk YAML"* og committe dem.
Ordbogen oversætter tabel-, kolonne- og enumnavne — **ikke fri prosa**. Der er
**intet værn og ingen bekræftelse**; kun `--uden-commit`, som skal skrives aktivt.

**Fare 2: exit-127.** Et ægte `fetch()` efterfulgt af `process.exit()` crasher
`node.exe` v24.13.0 på denne maskine med libuv-assertionen
`!(handle->flags & UV_HANDLE_CLOSING)` og **exit 127 — også når kaldet lykkedes.**
Reproduceret med kontrolgruppe. I `db/eksporter.mjs` er det **ikke** en fejlsti:
linje 603 er `main(...).then((k) => process.exit(k))`, den **normale** afslutning
på hver eneste kørsel.

## Grundmåling — DINE FØRSTE KOMMANDOER

```
"/c/Program Files/nodejs/node.exe" tools/validate.mjs
"/c/Program Files/nodejs/node.exe" tools/build.mjs
"/c/Program Files/nodejs/node.exe" tests/koer.mjs
git log --oneline -1
```

Orkestratorens tal umiddelbart før afsendelse: validate **77/0/1** · build
**216 sider, 1111 tal med kilde / 0 uden** · tests **1644/0** · HEAD `a3c501d`.

**Din worktree mangler `dist/`** (gitignoreret), og 13 tests spørger, om siden er
bygget — derfor står `build.mjs` **før** `koer.mjs` ovenfor. Kører du testene
først, får du 14 røde, der ikke er dine.

**Afviger et af de fire tal, så STOP og rapportér det.**

## Filejerskab

Du ejer: `db/hentbyg.mjs` · `db/eksporter.mjs` · `db/billeder.mjs` ·
`fund/maal-f2.mjs` · `tests/dele/71-hentbyg-vaern.mjs` (ny) ·
`fund/FUND-f2vaern.md` · `fund/BRIEF-f2-vaern.md`.

**Testnummer 71 er målt ledigt** (70 er højeste på main). Efterprøv selv mod
`tests/dele/` og `tests/LAESMIG.md`, og **skriv hvilket nummer du faktisk brugte.**

Du rører **ikke**: `db/fase2-tjek.mjs`, `db/f2-skriv.mjs`, `db/tjek.mjs`,
`db/ordbog.mjs`, `db/f2-*-skriv.mjs`, `fund/maal-f2-*.mjs` (fire samtidige spor
ejer dem), `tools/`, `assets/`, `data/`, eller nogen anden testfil end din egen.

---

## Punkt 1 — værnet i `db/hentbyg.mjs`

**Før trin 1 (eksporten) må køre**, skal `hentbyg` måle, om databasen indeholder
dansk, og **nægte at fortsætte**, hvis den gør.

Genbrug det instrument, der allerede findes: `db/fase2-tjek.mjs --dansk` (som du
**ikke** må ændre — importér fra den, eller kald den som subproces, præcis som
`hentbyg` allerede kalder `eksporter` og `build`).

Krav:

1. **Nægtelsen skal sige tallet**, ikke bare "nej". Fx: *"HENTBYG STOPPET: 795 af
   890 advarsler i databasen er stadig danske. Fase 2 er ikke færdig, og en
   eksport nu ville committe halvt oversat YAML."*
2. **Den skal sige, hvad man gør i stedet:** `--alligevel` kører uden værnet.
3. **`--alligevel` skal kræve, at man også fravælger commit**, eller selv skrive
   tydeligt i sin besked, at der committes halvt oversat data. Vælg selv hvilken
   af de to og **begrund valget i rapporten** — det er den eneste beslutning i
   dette brief, jeg overlader til dig.
4. **Værnet må ikke koste noget, når databasen er ren.** Er dansk-tallet 0,
   kører `hentbyg` som før, uden ekstra spørgsmål.
5. **Ingen `.env` → ingen tavs succes.** Kan værnet ikke måle, fordi nøglen
   mangler, så **stop** med en besked om hvorfor. Et værn, der springer sig selv
   over, når det ikke kan måle, er værre end intet værn.

**Færdig når:**

- `grep -c 'fase2-tjek' db/hentbyg.mjs` giver **≥ 1** (**giver i dag 0**).
- `node db/hentbyg.mjs --uden-commit --uden-byg` **stopper med værnets besked og
  et tal** i stedet for at eksportere. Skriv beskeden ordret i rapporten.
- Samme kommando med `--alligevel` kommer forbi værnet.
- **Kontrafaktisk, obligatorisk:** vis at værnet ville have SLUPPET en ren
  database. Du kan ikke gøre databasen ren — så bevis det på funktionen i stedet
  (kald tælle-funktionen med et konstrueret 0-resultat), og skriv hvordan du
  gjorde det. Et værn, der altid siger nej, er ikke efterprøvet.

**Kør ALDRIG `db/hentbyg.mjs` uden `--uden-commit`.** Det er hele den fare, du er
sendt for at lukke. Den skriver i `data/robots/` og committer.

Commit punkt 1, før du skriver punkt 2's kode.

## Punkt 2 — de tre ægte exit-127-steder

**Triageret af orkestratoren; tallene er målt, ikke gættet.** Kald, som ligger
**efter** et fetch og kan nås:

| Fil | Rigtige kald i dag | Heraf efter fetch |
|---|---|---|
| `db/eksporter.mjs` | **2** | begge — L603 er den **normale** afslutning, L605 fejlstien |
| `db/billeder.mjs` | **3** | L500 og L507 (L118 ligger før fetch — **lad den stå**) |
| `fund/maal-f2.mjs` | **3** | kun L11 (L8 og L17 er argumentvalidering, der kører før noget netværk — **lad dem stå**) |

**Ret kun dem, der kan nås efter et fetch.** `process.exit(n)` →
`process.exitCode = n` og lad løkken tømme sig; på fejlstier følg op med et
`return`, så udførelsen faktisk stopper.

**Efterprøv, at exitkoden stadig er den rigtige.** `process.exitCode` virker kun,
hvis der ikke er mere arbejde bagefter — og en `.then((k) => process.exit(k))`
kan ikke bare blive til `process.exitCode = k`, hvis noget efterfølgende kan
kaste. Læs koden, gæt ikke.

**Færdig når:**

- `grep -n 'process\.exit(' <fil> | grep -vE ':\s*(\*|//|/\*)' | wc -l` giver
  **1** for `db/billeder.mjs` (L118 bliver), **2** for `fund/maal-f2.mjs`
  (L8 og L17 bliver), **0** for `db/eksporter.mjs`.
  *(Giver i dag 3, 3 og 2.)*
- `node --check` er ren på alle tre.
- **En fejlsti afprøves rigtigt:** kør `node fund/maal-f2.mjs` uden argument →
  skal give exit **1**, ikke 127. Og kør den med et gyldigt `robot_id` → exit
  **0** og samme tal som før. Skriv begge exitkoder.
- **`db/eksporter.mjs --fra-db` afprøves KUN med `--ud=` til en midlertidig
  mappe i din worktree** — aldrig mod `data/robots/`. Skriv exitkoden. Den skal
  være 0, ikke 127. **Slet den midlertidige mappe bagefter og skriv, at du
  gjorde det.**

## Punkt 3 — testen

`tests/dele/71-hentbyg-vaern.mjs` efter kontrakten i `tests/LAESMIG.md`.
**Ingen databaseadgang** — brug fixtures eller rene funktioner. Dæk mindst:

- værnet siger nej ved et dansk-tal > 0
- værnet slipper igennem ved 0
- værnets besked indeholder tallet
- `--alligevel` omgår værnet
- manglende måling giver stop, ikke stiltiende succes

**Færdig når** `node tests/koer.mjs` giver **1644 + dine nye assertions**
bestået og **0 nye røde**. Skriv begge tal. Kør `build.mjs` først.

---

## Rækkefølge, miljø og rapport

**Én skrive-grænse pr. punkt:** skriv kun punkt 1's kode, mål den, commit — og
først derefter punkt 2. Målt tre gange i dette projekt: en agent, der skriver
alt i ét Write-kald, får punkt 1's commit til at bære punkt 3's uefterprøvede
kode. Commit undervejs er et krav; to spor er døde uden at efterlade en linje.

**Miljøfælder, hver har kostet en runde:**

- `node` er `/c/Program Files/nodejs/node.exe`; Git Bash har den ikke på PATH.
- **`/tmp` ligger ikke samme sted for node og Git Bash.** Brug en sti i projektet.
- Commit-beskeder med backticks, `$` eller anførselstegn: `git commit -F <fil>`.
- `sed -i`, der ikke matcher, gør **intet — tavst, med exit 0**. Brug Edit.
- Lange markdown-filer knækker i bash-heredocs. Brug Write.
- UTF-8 **uden** BOM.
- `.env`, `assets/fotos/fabrikant/` og `media/_kilder/` er kopieret ind. Efterprøv:
  `ls -la .env` · `ls assets/fotos/fabrikant | wc -l` (**610**) ·
  `ls -d media/_kilder/*/ | wc -l` (**19**).
- **Skriv aldrig nøglen fra `.env` i en fil, en commit eller din rapport.**
- **Sig til i rapporten, før du kører `tests/koer.mjs`** — to sessioner deler
  arbejdstræet, og samtidige kørsler crasher. Kør den i DIN worktree, aldrig i
  hovedrepoet.

**Skriv en kontrol før hver måling:** *"forventer N"* før du læser tallet. Et
forkert mønster giver typisk et fuldstændig plausibelt tal, så der er intet at
undre sig over. **Og tæl aldrig `process.exit(` uden at filtrere kommentarer
fra** — det er sket for to sessioner på samme dag, og begge fik et plausibelt,
forkert tal.

**Briefets fakta er påstande.** Alle tal ovenfor er orkestratorens målinger.
Afviger noget, du måler, så **rapportér afvigelsen — det er leverance, ikke
ulydighed.**

**Rapporten — `fund/FUND-f2vaern.md`, højst 60 linjer:** valgt/fravalgt løsning
i én linje hver · **konfidens pr. punkt** (høj = genkørbar kommando **plus** én
linje om hvad tallet ville have været, hvis arbejdet var forkert; høj uden
genkørbar kommando nedskrives til lav) · usikkerheder · målingerne som tal.

**Uden for loftet, obligatorisk:** *"Nye fælder og opdagelser"* (står der intet,
skal det skrives) og *"Punkter i briefet, jeg ikke nåede"*.
