# BRIEF — spor/i18nfelt: sprogoverbygning på advarsel og note

**Skrevet 2. sep 2026. Gren `spor/i18nfelt`, worktree
`C:\Praktik\websites\udstilling-wt-i18nfelt`, forgrenet fra `3ca4355`.**

Dette er spor A af Å98. Det oversætter **ingenting**. Det bygger den mekanisme,
fire senere oversættelsesspor skal fylde tekst i. Rør ikke `data/robots/`.

---

## Hvorfor

En engelsk læser møder dansk midt i brødteksten på `/en/`-siderne. Målt på det
byggede resultat, ikke sluttet:

```
dist/da/robotter/unitree-aliengo/index.html   "UDEN batteri"   2
dist/en/robotter/unitree-aliengo/index.html   "UDEN batteri"   2
felter med _en-suffiks i data/robots/*.yaml                    0
```

Der er kun én tekst. Sprogvalget har intet at skifte til.

Omfanget, målt 2. sep 2026 med `awk` på indrykning (kontroltal skrevet før
aflæsning, begge ramte):

```
advarsel:   891 forekomster, ALLE paa indryk 4 (inde i en feltpost)
note:        97 forekomster, ALLE paa indryk 2 — anvendelse 76 + billede 21
tegn i alt  144.068
```

`tools/validate.mjs:296` siger uafhængigt **890** advarsler målt 28. aug; én er
kommet til siden. Tallet er altså krydsbekræftet af koden selv.

---

## Den valgte form, og hvorfor ikke de to nærliggende

```yaml
egenvaegt:
  vaerdi: 21.5
  advarsel: "Producenten skriver Weight (without battery) 21.5kg. Vaegten er UDEN batteri."
  advarsel_i18n:
    en: "The manufacturer states Weight (without battery) 21.5kg. The weight is WITHOUT the battery."
```

`advarsel:` **bliver dansk og bliver kilden**. Overbygningen er valgfri og
sprognøglet.

**Fravalgt: `advarsel_en:`.** Det er en kontakt med to stillinger, og den står
navngivet på STATUS.md's *"Kom ikke igen med disse"*-liste (`data-en`-attributter,
samme begrundelse: *"kan ikke få en tredje"*).

**Fravalgt: `advarsel: { da: …, en: … }`.** Målt blast radius: **44 læsesteder**
i `tools/` læser `post.advarsel` eller `.note` som en streng
(`grep -rn 'post\.advarsel\|\.advarsel\b\|post\.note\|\.note\b' tools/*.mjs tools/skabelon/*.mjs`).
Alle 44 skulle skrives om. Med overbygningen skal **0** af dem ændres.

---

## Punkterne

### 1. `advarsel_i18n` og `note_i18n` bliver kendte nøgler

`tools/skema.mjs:349-353` bærer `POST_NOEGLER`. I dag står der:

```js
export const POST_NOEGLER = new Set([
  'vaerdi', 'min', 'maks', 'enhed', 'operator', 'kilde', 'hentet', 'kildetype',
  'vaerdi_imperial', 'enhed_imperial', 'advarsel', 'advarsel_klasse', 'advarsel_ordlyd',
  'note', 'raa', 'ved_last', 'valuta', 'varianter',
]);
```

`advarsel_i18n` tilføjes her. `note_i18n` hører ikke i feltposten — `note` bor
på `anvendelse` og `billede`, ikke i en feltpost — så find den rigtige
nøgleliste for de to blokke og udvid den.

**Acceptkriterium, kørt mod main i dag:** en robotfil med `advarsel_i18n` på ét
felt giver nu

```
FEJL  unitree-aliengo · egenvaegt · R11: ukendt noegle "advarsel_i18n" i feltposten
77 fil(er) · 1 fejl · 1 advarsler
```

Færdig, når samme fil giver `77 fil(er) · 0 fejl · 1 advarsler`.
Prøvescriptet, der laver filen, ligger i
`C:/Users/thyge/AppData/Local/Temp/claude/c--Praktik-websites-udstilling/0625e2b4-7f7c-4c17-99c0-6a8b393968f2/scratchpad/proeve-i18n.mjs`
— skriv din egen, hvis den er væk; den kopierer `data/robots` til en prøvemappe
og kalder `node tools/validate.mjs --data=<mappe>`.

### 2. Ny validatorregel R22 — formen, ikke oversættelsens rigtighed

Byg den som en tvilling til R21 (`tjekAdvarselOrdlyd`, `tools/validate.mjs:326-337`),
som allerede har præcis den form, opgaven kræver. Reglen skal håndhæve:

- værdien er et kort af sprogkode → ikke-tom tekst
- hver nøgle findes i `SPROG` (`tools/skema.mjs`)
- **kildesproget må ikke stå som nøgle** — dansk bor i `advarsel:`, og to steder
  at rette den samme danske tekst er den fejl, hele opgaven handler om
- `advarsel_i18n` kan ikke stå uden `advarsel` (samme krav som R21 stiller)
- `tjekInterntSprog('R22', …)` køres på **hver** oversat tekst. R19 vogter i dag
  kun den danske. Uden dette kan et filnavn eller `ikke_oplyst` sive ind ad den
  engelske dør

**Acceptkriterium:** din nye testfil har ét ødelagt tilfælde pr. punkt ovenfor,
og `node tests/koer.mjs` skal vise linjen `Validator: N oedelagte tilfaelde …
fangede N` med **samme tal på begge sider**. I dag står der `71 … fangede 71`.

### 3. Build vælger tekst efter sprog — ét sted

`tools/build.mjs:262` er `for (const sprogkode of SPROG) {`. Inde i den løkke,
**før** skabelonerne kaldes, laves en sprogopløst kopi af `robotter`: hvor
`advarsel_i18n[sprogkode]` findes, træder den i stedet for `advarsel`; findes
den ikke, står `advarsel` uændret. Samme for `note_i18n`.

Kopi, ikke mutation — løkken kører to gange over de samme objekter, og en
mutation i runde ét ville sive ind i runde to.

**Acceptkriterium:** læg en engelsk tekst på AlienGos `egenvaegt` i din
prøvemappe, byg, og mål:

```
dist/en/robotter/unitree-aliengo/  "UDEN batteri"     i dag 2  ->  skal give 0
dist/da/robotter/unitree-aliengo/  "UDEN batteri"     i dag 2  ->  skal blive 2
```

Begge tal skal stå i rapporten. Kun det første ændrer sig.

### 4. Databasen skal kunne bære feltet, ellers slettes oversættelserne tavst

`db/eksporter.mjs` remser felterne op ét for ét — `kort.advarsel` (linje 174),
`kort.advarsel_klasse` (178), `kort.advarsel_ordlyd` (182) og igen samlet på
linje 318. Et felt, der ikke står der, forsvinder ved næste `--fra-db`.
**Det er præcis den fejl, prosa-sporet blev afvist på 25. aug** (YAML-kommentarer,
der ville være slettet ved regenerering).

Begge veje udvides. Migreringen skrives som **fil**, `db/migrering-i18n.sql`,
efter mønstret i `db/migrering-cjk-ordlyd.sql` — **kør den ikke mod databasen.**
JPK kører den, som han kører Å52's ALTER.

**Kald `supabase-postgres-best-practices` før du skriver SQL'en.** CLAUDE.md
kræver det for enhver ændring i `db/skema.sql`, også en enkelt kolonne.

**Acceptkriterium:** `grep -c 'i18n' db/eksporter.mjs` giver i dag **0**; efter
skal begge retninger være dækket, og du skal skrive i rapporten, hvilke to
linjenumre du rørte.

### 5. Ingen dansk tekst må ændre sig

**Acceptkriterium, to tal:**

```
git diff --stat data/robots/ | wc -l          skal give 0
```

og efter dit byg skal `node tools/validate.mjs` stadig give `77 fil(er) · 0
fejl · 1 advarsler`. Rører du en robotfil, er sporet gået uden for sit ejerskab.

---

## Grundmåling — målt af mig 2. sep 2026 kl. 08:33 på `3ca4355`

**Din første kommando er at genkøre alle fire.** Afviger noget, er det miljøet
eller mig, ikke dit arbejde — og så skal det stå i rapporten før alt andet.

```
node tools/validate.mjs      77 fil(er) · 0 fejl · 1 advarsler
node tools/build.mjs         216 sider · 1111 tal med kilde, 0 uden · 611 billeder
node tests/koer.mjs          1487 bestaaet, 0 fejlet · Validator: 71 fangede 71
node tools/linktjek.mjs      0 doede interne · 50 producentsider · 0 unaaede
```

**Byg mindst én gang UDEN `--ud=`.** Bygger du kun til en sidemappe, står
`dist/` tom, og 12 tests fejler på hårdkodede `dist/`-stier. Det ligner dit
arbejde og er miljøet.

---

## Filejerskab

**Du ejer og må ændre:**

```
tools/skema.mjs          noeglelisterne
tools/validate.mjs       ny regel R22
tools/build.mjs          sprogoploesningen i loekken linje 262
db/eksporter.mjs         begge veje
db/skema.sql             kolonnen
db/migrering-i18n.sql    NY fil
tests/dele/60-i18nfelt.mjs   NY fil — 60 er ledigt, 58 er hoejeste paa main,
                             og spor/primitiv har taget 59
fund/BRIEF-i18nfelt.md   denne fil, hvis noget viser sig forkert
```

**Du må ikke røre:**

```
data/robots/**              spor A oversaetter intet
assets/system.css
assets/generator.css        ejes af spor/primitiv lige nu
tests/dele/59-*             samme
```

`tools/skabelon/*.mjs` skal **ikke** ændres. Kan du ikke løse punkt 3 uden at
røre dem, så stop og skriv hvorfor — så er formen valgt forkert, og det er min
fejl, ikke din.

---

## Skills

Vurdér og skriv, hvilke du valgte og gik forbi:

- **`supabase-postgres-best-practices`** — obligatorisk før punkt 4's SQL.
- **`fejljagt`** — hver gang et tal ikke passer. Måleapparatet før tallet.
- **`robotdata`** — vurdér den; den bærer feltskemaet. Sandsynligt fravalg, da
  du ikke rører robotdata, men skriv fravalget.

Lykkes et skill-kald ikke fra worktreen (det svinger, målt 26. aug), så læs
`SKILL.md` fra disk og **skriv i rapporten at du gjorde det**. Projektets egne
skills ligger i `.claude/skills/` og følger med worktreen.

---

## Miljø

```
node        "/c/Program Files/nodejs/node.exe"  — intet er paa PATH i Git Bash
python      /c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe
commit      skriv beskeden til en fil og brug  git commit -F <fil>
sed -i      fejler TAVST med exit 0 naar moensteret ikke rammer. Brug Edit
filer       UTF-8 uden BOM. Set-Content -Encoding utf8 oedelaegger tankestreger
git -C      MSYS-stier (/c/Praktik/...) fejler paa Windows. Brug C:/Praktik/...
2>/dev/null brug det ALDRIG paa en kommando, hvis exitkode eller fejltekst
            er en del af maalingen
port        8143, hvis du overhovedet skal starte en server. Aldrig 8080.
            Luk den, naar du er faerdig med at maale, og skriv i rapporten
            at du gjorde det
```

De gitignorerede filer er allerede kopieret ind: `assets/fotos/fabrikant/`
(610 filer, målt), `.env`, `db/kanonisk.json`, `db/seed.sql`.

**Commit undervejs er et krav.** Ét commit pr. sammenhængende ændring. To spor
er døde uden en linje efterladt; et dødt spor skal kunne måles i stedet for
gættes.

---

## Rapporten

Højst 60 linjer, i `fund/FUND-i18nfelt.md`:

1. Valgt løsning pr. punkt, og hvad du fravalgte — én linje hver.
2. **Konfidens pr. punkt.** Høj kræver en genkørbar kommando **plus** én linje
   om, hvad tallet ville have været, hvis arbejdet var forkert. Kan du ikke
   skrive den linje, er niveauet middel.
3. Usikkerheder — det du ikke kunne afgøre.
4. Målingerne som tal, ikke prosa.

**Uden for de 60 linjer, obligatorisk:**

- **"Nye fælder og opdagelser"** — skriv "ingen", hvis der ingen er.
- **"Punkter i briefet, jeg ikke nåede"** — én linje pr. punkt, tom hvis ingen.

---

## Til sidst: briefets fakta er påstande

Alle tal ovenfor er mine målinger, ikke sandheder. **Afviger noget, du måler,
fra noget, briefet påstår, så er afvigelsen en del af leverancen — ikke
ulydighed.** To agenter rettede mine fakta 26.-27. aug, begge på eget initiativ,
begge korrekt. Det var sessionens billigste kvalitetskontrol.

Det gælder også citaterne. Jeg har slået hvert linjenummer op i dag, men
`tools/`-filerne ændrer sig: rammer et `fil:linje` forbi, så skriv det.
