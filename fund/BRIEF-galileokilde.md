# BRIEF — `spor/galileokilde`: Galileos 120 ubelagte tal søges i producentens EGNE kilder

**Model:** sonnet. **Gren:** `spor/galileokilde`. **Worktree:**
`c:\Praktik\websites\udstilling-wt-galileokilde` (**ikke oprettet endnu**).
**Rapport:** `fund/FUND-galileokilde.md`. **Forventet pris:** ~100-180k tokens.
**Mellemstort spor.**

**Kald `spor`-skillen som din første handling** — den bærer grundmålingen, skrive-grænsen,
kontrollinjen, filejerskabet, selv-efterprøvningen, rapportformen og miljøfælderne. Lykkes
kaldet ikke fra din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk og **skriv i
rapporten, at du gjorde det.**

**Kald derefter `robotdata`-skillen** — den bærer 33-feltsskemaet og de ti hårde regler om
kilder og operatorer. **`design` er fravalgt:** sporet rører intet visuelt, ingen CSS, ingen
skabelon. **`fejljagt` kaldes, hvis en måling opfører sig uventet** — fx hvis en hentet side
er tom eller identisk med en anden.

---

## Hvor opgaven kommer fra

`STATUS.md` Å180, beslutning 2, truffet 4. sep 2026: **Galileos 120 ubelagte tal skal søges i
ANDRE Galileo-kilder.**

Beslutningen kommer fra en samtale, ikke fra et punkt i en plan, så **der er ingen planpunkt-
forbehold at citere** (`brief`-skillens punkt 8b). Det, der ER baggrunden, er
`fund/FUND-galileotekst.md`, flettet som `e145432`: af Galileos **140** kildebelagte felter
kunne **14 (A)** findes bogstaveligt i producentens PDF, **120 (B)** kunne ikke, og **6 (C)**
var uafgjorte. Årsagen er en defekt i kilden — PDF'ens egen `/ToUnicode`-CMap mapper cifrene
0-9 til `U+FFFD` — og **ingen parser kan rette det.** Vejen frem er derfor en anden kilde,
ikke et bedre værktøj.

---

## Tre målinger, jeg selv har taget, som former opgaven

Alle tre er orkestratorens egne, målt 4. sep 2026 på main `698f4b0`. **De er påstande, indtil
du har genmålt dem** — se afsnittet "Briefets fakta er påstande" nedenst.

### 1. Alle 140 felter peger på ÉN URL, og den ligger ikke på producentens eget domæne

```
grep -h "kilde:" data/robots/galileo-*.yaml | sed 's/.*kilde: *//' | sort -u | wc -l
  -> 1
```

Den ene URL er en PDF på **`www.worldrobotconference.com`** — en messe-/konferenceside, ikke
Galileos eget domæne.

**Kontrollen, der gør det til et fund og ikke en tilfældighed:** samme greb over hele
kataloget viser, at alle andre producenters kilder ligger på producentens **eget** domæne —
`www.unitree.com` (247), `www.genisomai.com` (204), `deeprobotics.cn` (138),
`www.magiclab.top` (70), `yuejialingdong.com` (60). `www.worldrobotconference.com` (140) er
den **eneste** tredjepart i toppen af listen, og

```
grep -h "worldrobotconference" data/robots/unitree-*.yaml | wc -l   -> 0
```

viser, at den udelukkende bruges af Galileo.

**Hvorfor det betyder noget:** `STATUS.md`s **L21** siger ordret, at sekundære kilder er
*"tilladt, når kilden ligger på producentens eget domæne og kan dateres"*, og at
*"forhandlere, databaser, anmeldelser og pressomtale er stadig ude"*. **Om en
konferencearrangørs downloadarkiv falder inden for eller uden for L21, er ikke afgjort
nogen steder.**

### 2. Producentens rigtige domæne er `galileotime.com`

Målt i det arkiverede materiale, ikke gættet: `media/_kilder/raa-kand4-2026-08-25/
galileotime-home-2026-08-25.html` bærer i sin egen `<meta name="description">` teksten
*"伽利略（天津）技术有限公司"* — Galileo (Tianjin) Technology Co. — hvilket matcher YAML'ens
`producent: "Galileo (Tianjin)"` og `producentby: "Tianjin"`.

### 3. Vi HAR allerede arkiveret to sider fra det domæne — og de er værdiløse

```
find media/_kilder -iname "*galileo*"
  -> galileo-wrc-product-manual-2025.pdf
     galileotime-home-2026-08-25.html
     galileotime-robot-zh-2026-08-25.html
```

De to HTML-filer er **byte-identiske** (`cmp` siger intet) og **2.175 bytes hver**. Indholdet
er en tom JavaScript-skal: `<div id="app"></div>`, ingen produktdata, og en indlejret
konfiguration, der peger videre:

```
baseURL: 'https://www.galileotime.com/api'
imgUrl:  'https://www.galileotime.com'
h5:      'https://m.galileotime.com'
```

**Det er sporets vigtigste udgangspunkt:** en tidligere indsamling har hentet noget, der
**så ud som** en arkiveret produktside, og som ikke bærer ét eneste tal. Filen er der, datoen
er der, og indholdet er en tom skal. Antag ikke, at en hentet fil er en kilde, før du har
talt tegn i den.

---

## Det, du skal gøre

### 0. Grundmåling — første kommando, og den skal stå i rapporten

Kør og skriv tallene ned, **før** du rører noget:

```
node tools/validate.mjs
node tools/build.mjs
grep -h "kilde:" data/robots/galileo-*.yaml | sed 's/.*kilde: *//' | sort -u | wc -l
grep -h "worldrobotconference" data/robots/galileo-*.yaml | wc -l
```

**Forudsigelse, ikke krav** (mål og skriv det faktiske): validate **77 filer / 0 fejl /
1 advarsel** · build **216 sider, 1.111 kildemærker, 0 uden** · unikke Galileo-URL'er **1** ·
WRC-felter **140**. Afviger et af dem, så **stop og rapportér** — så er der sket noget på main,
og resten af briefet hviler på et forkert grundlag.

**Kør IKKE `node tests/koer.mjs`.** En suitekørsel er ~2,8 GB og ~4 min, og to andre spor
kører samtidig på den samme disk. Dit spor rører hverken kode eller tests, så suiten kan
ikke ændre sig af dit arbejde.

### 1. Afgør, om `galileotime.com` overhovedet kan levere en kilde

Hent forsiden og produktsiderne. Du har to veje, og du må bruge begge:

- `WebFetch`-værktøjet.
- Et `node`-script med `fetch()`. **Miljøfælde, som koster et helt spor, hvis den rammes:**
  har filen lavet et netværkskald, må du **aldrig** kalde `process.exit()` bagefter — sæt
  `process.exitCode` og lad løkken tømme sig. `process.exit()` efter `fetch` crasher
  `node.exe` v24.13.0 med exit **127** og en libuv-assertion.

Sidens data ligger efter alt at dømme bag `https://www.galileotime.com/api`, fordi HTML'en er
en tom SPA-skal. **Find det endpoint, siden selv kalder**, frem for at gætte en API-sti.

**Acceptkriterium 1:** rapporten indeholder for hver hentet URL: statuskode, byte-størrelse og
antal tegn efter fjernelse af markup. **Giver i dag:** intet er hentet; de to arkiverede filer
giver 2.175 bytes og 0 produkttal.

**Går det ikke** — siden er nede, kræver login, blokerer, eller leverer kun en tom skal — så
**er det et gyldigt og fuldgyldigt resultat.** Skriv nul-søgningen ud, med kommandoen, og gå
til punkt 4. Et spor, der beviser, at kilden ikke findes, har leveret. **Opfind aldrig et tal
for at have noget at komme med** (hård begrænsning 2).

### 2. Arkivér alt, du henter, før du læser det

Ny mappe: `media/_kilder/galileo-<ISO-dato>/`. Gem råt, uændret, med filnavne, der siger
hvad de er. Mappen er gitignoreret bortset fra en `LÆSMIG.md` — skriv en, der siger hvornår
og hvorfra materialet kom.

**Acceptkriterium 2:** `find media/_kilder/galileo-* -type f | wc -l` giver **flere end 0**,
og hver fil er **større end 2.175 bytes** eller har en skrevet begrundelse for ikke at være
det. **Giver i dag: 0** (mappen findes ikke).

### 3. Krydstjek de 120 B-felter mod det nye materiale

`fund/FUND-galileotekst.md`s tabel nederst har alle 140 rækker med feltnavn, robot,
søgestreng og A/B/C-klassifikation. **Brug den som din arbejdsliste** — genopfind den ikke.

For hver af de 120 B-rækker: søg dens værdi i det nye materiale og klassificér:

- **A2** — tallet findes bogstaveligt i producentens egen nye kilde. Skriv citatet og URL'en.
- **B2** — findes ikke. **Skriv nul-søgningen ud** (den kommando, der gav 0), ikke bare "nej".
- **C2** — uafgjort, fx fordi kilden skriver noget, der ligner, men ikke er identisk.

**Acceptkriterium 3:** A2 + B2 + C2 = **120**, og hver B2 har sin nul-søgning i tabellen.
**Giver i dag: 0 rækker klassificeret.**

**Forudsigelse, ikke krav:** jeg forventer, at A2 bliver **lavt** — måske under 20 — fordi
kilden er kinesisk, SPA-baseret og muligvis tom. **Mål det, ram ikke mit gæt.** Bliver A2
højt, er det den bedste nyhed, sporet kan levere.

### 4. Rejs L21-spørgsmålet — men afgør det IKKE

Skriv i rapporten, som et selvstændigt afsnit:

> Alle 140 Galileo-felter er kildet til `worldrobotconference.com`. L21 tillader sekundære
> kilder *"når kilden ligger på producentens eget domæne"*. Falder en konferencearrangørs
> downloadarkiv inden for L21?

**Det er JPK's beslutning, ikke din og ikke min.** Din opgave er at lægge målingen frem, så
den kan træffes: hvor mange felter det drejer sig om (140), hvad alternativet er (det, du
fandt i punkt 3), og hvad prisen er ved hver vej. **Foreslå ikke at fjerne felter, og fjern
ingen.**

**Acceptkriterium 4:** rapporten har et afsnit med overskriften `## L21-spørgsmålet`, som
indeholder (a) tallet 140 med den kommando, der frembragte det, (b) L21's ordlyd citeret fra
`STATUS.md` med linjenummer, og (c) mindst to veje frem med deres pris — **og ingen anbefaling
formuleret som en beslutning.** **Giver i dag:** spørgsmålet er ikke rejst nogen steder;
`grep -rn "worldrobotconference" STATUS.md | wc -l` giver **0**.

### 5. Du skriver INTET i databasen og INTET i `data/robots/`

**Dette er den vigtigste grænse i briefet, og den er ikke til forhandling.**

En anden session kører `spor/opdel` og `spor/dbcache`. `spor/dbcache`s hele bevis er, at et
byg med varm cache er **byte-identisk** med et byg med kold. **En datarettelse midt i den
måling giver en cache fra før rettelsen og et byg fra efter — og diffen ville ligne en
kodefejl.** Det er ikke en flettekonflikt; det er et tal, ingen kan stole på.

**Din leverance er en RAPPORT, ikke en datarettelse.** Rettelserne skrives senere, af et
andet spor, når orkestratoren har fået *"databasen er din"* fra den anden session, og når
JPK har svaret på punkt 4.

**Acceptkriterium 5:** `git diff --name-only main...HEAD` viser **kun**
`fund/FUND-galileokilde.md` og filer under `media/_kilder/` (som er gitignorerede og derfor
formentlig slet ikke vises). **Nul filer under `data/`, `db/`, `tools/`, `tests/`, `assets/`.**
**Giver i dag: 0 filer** (grenen findes ikke).

---

## Filejerskab

**Du ejer:** `fund/FUND-galileokilde.md` · `media/_kilder/galileo-<dato>/` (ny mappe).

**Du må IKKE røre:** `data/robots/*` · databasen (hverken læse-skrive eller migrere) ·
`db/*` · `tools/*` · `tests/*` · `assets/*` · `STATUS.md` · `CLAUDE.md` · `PLAN.md` ·
`DESIGN.md` · `.claude/*` · `fund/FUND-galileotekst.md` (du **læser** den, du ejer den ikke).

**Overlap med kørende spor: målt til nul.** `spor/opdel` ejer `tools/yaml.mjs`,
`tools/enheder.mjs`, `tools/skema.mjs`, `tools/skabelon/side.mjs`, `tools/validate.mjs`,
`tests/dele/`; `spor/dbcache` ejer `db/hent.mjs`, `tests/koer.mjs`, `.gitignore`;
`spor/katalogskaerm` (Gemini) ejer `assets/system.css` og `tools/skabelon/katalog.mjs`. Du
ejer ingen af dem.

---

## Miljø

- **`node` er ikke på PATH i Git Bash.** Brug `/c/Program\ Files/nodejs/node.exe` eller den
  fulde sti i anførselstegn.
- **Ingen port, ingen server, ingen browser.** Sporet bygger ikke og måler ikke i browseren.
- **Ingen `.env` og ingen databaseadgang nødvendig.** Har du brug for den, har du misforstået
  punkt 5.
- **Disken er fælles og presset.** To andre spor kører. Skriv ikke store midlertidige filer;
  det arkiverede råmateriale er undtagelsen og hører i `media/_kilder/`.
- Resten står i `.claude/skills/spor/references/miljoefaelder.md`.

---

## Commit-rækkefølge

Commit undervejs — et spor, der dør, skal efterlade sit arbejde:

1. Grundmålingen + punkt 1's hentninger, som en første udgave af rapporten.
2. Arkiveringen (punkt 2) — eller noten om, at der intet var at arkivere.
3. Krydstjek-tabellen (punkt 3), gerne i flere commits undervejs, en producent ad gangen.
4. L21-afsnittet (punkt 4) og den færdige rapport.

---

## Briefets fakta er påstande

**Afviger noget, du måler, fra noget, dette brief påstår, skal afvigelsen rapporteres — det
er en del af leverancen, ikke ulydighed.** Mine tre målinger ovenfor, `FUND-galileotekst.md`s
A=14/B=120/C=6, og mit gæt om, at A2 bliver lavt, er alle sammen ting, du må modbevise.
To agenter rettede orkestratorens fakta 26.-27. aug 2026, begge på eget initiativ, begge
korrekt — det var sessionens billigste kvalitetskontrol.

**Rapportform:** højst 60 linjer plus de to obligatoriske sektioner uden for loftet (*"Nye
fælder og opdagelser"* og *"Punkter i briefet, jeg ikke nåede"*), plus krydstjek-tabellen fra
punkt 3, som er leverancen og derfor ikke tæller med i loftet. **Konfidens bindes til
bevistype, ikke fornemmelse:** høj kræver en genkørbar kommando **plus** en kontrafaktisk
linje.
