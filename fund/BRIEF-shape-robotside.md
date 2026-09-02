# BRIEF — spor/shaperobot: `impeccable shape` på robotsiden (led 3, første flade)

**Model:** Opus (L45 — designspor).
**Skærm:** robotsiden. **154 sider** (77 robotter × 2 sprog). **MODE: Read** — den besøgende
skal forstå noget, ikke løse en opgave. Det er skillens egen ramme, og succeskriteriet er et
andet end katalogsidens Operate.
**Worktree:** `C:/Praktik/websites/udstilling-wt-shaperobot` · **gren:** `spor/shaperobot` ·
**base:** `a405066`. **Egen serverport: 8234.** Aldrig 8080.

## DU SKRIVER EN PLAN, IKKE KODE

**Leverancen er ét dokument: `fund/PLAN-robotside.md`.** Ingen ændring i `assets/`,
`tools/`, `data/` eller `tests/`. Rører du en af dem, er sporet forkert udført — også hvis
ændringen er rigtig.

**Hvorfor:** designfrysen **L70** siger, at fund noteres, de rettes ikke, indtil den overordnede
plan findes. Led 1 (`document` → `DESIGN.md`) og led 2 (`extract` → primitiverne samlet i
systemet) er færdige og flettet. **Led 3 er fladeplanerne, og du skriver den første.** Planen
er det, frysen venter på — ikke en ny fejlliste.

**Tre kodespor kører samtidig på andre skærme** (`spor/katalog3`, `spor/saml3`,
`spor/topbar`). De rører **ikke** robotsiden. Men de rører `assets/system.css`, som robotsiden
også bruger — så din plan skal skrives, så den holder, uanset hvad de tre lander. Nævner du et
tal fra en delt fil, så mål det og skriv datoen.

## Læs disse, før du ser på fladen

```
DESIGN.md                    systemet, skrevet ned af led 1. 36.733 tegn.
fund/FUND-extract.md         led 2: hvad der blev samlet ind i systemet
fund/FUND-primitiv.md        farveprimitiverne
STATUS.md                    Lukket-tabellen OG "Kom ikke igen med disse".
                             AFKORT ALDRIG DEN SØGNING MED head - Lukket-tabellen
                             ligger nederst i filen, og det er Å55, sessionens
                             dyreste fejl.
CLAUDE.md                    de seks hårde begrænsninger
```

**De beslutninger, planen skal respektere og ikke genåbne** (slå dem op i STATUS.md, citér dem
med nummer i planen):

- **L76** — `--accent` (gul) må ikke være forgrundsfarve på lys bund. Målt **1,38:1** mod WCAG's
  4,5. Kontrasttal uden en læseretning er ikke et tal.
- **L77** — der bliver **én** knapprimitiv `.knap` med varianter, og grundformen taler
  TYPESKILT. **Besluttet, ikke bygget.** Planen må regne med den, men ikke bygge den.
- **L78** — billeder vises i deres helhed (`contain`), ikke beskåret.
- **L79** — 2px er systemets radius (`--hjoerne`).
- **L80** — `--sans` udgår; Saira til maskinen, Literata til brødteksten.
- **TYPESKILT** er den låste retning. Skillen respekterer selv låse: *"The brief wins. Honor
  pinned aesthetics, eras, materials, fonts, and palettes."*
- **Hård begrænsning 5:** *"ikke oplyst"*, *"nej"* og *"0"* er **tre** forskellige tilstande og
  skal se forskellige ud. Det er der, katalogsider lyver. Planen må ikke forenkle dem sammen.
- **Hård begrænsning 1:** ingen forhandleraftale. Ingen købsknap, intet affiliate-link, ingen
  prisforespørgselsformular.
- **Hård begrænsning 2:** opfind aldrig tal, cases, certificeringer eller kapaciteter.

## Kør skillen

```
impeccable shape
```

Lykkes kaldet ikke fra worktreen — det svinger, og vi ved ikke hvorfor — så læs den fra disk og
følg den derfra:

```
C:/Users/thyge/.claude/skills/impeccable/SKILL.md
```

**og skriv i rapporten, at du læste den fra disk.** Et stille fallback må ikke forveksles med,
at skillen kørte.

Skriv også, hvilke andre skills du gik forbi og hvorfor. `impeccable critique` og
`ui-ux-critique` er **fejljagt** på en bygget side — det er ikke opgaven her, og en fejlliste
kan pr. projektets egen erfaring aldrig hæve loftet.

## Se fladen med egne øjne, ikke kun i koden

Byg, start din server på 8234, og mål mindst tre robotter, der er forskellige: én med mange
oplyste felter, én med få, og én med et højt billede.

```
node C:/Praktik/websites/maalevaerktoej/maal.mjs "http://localhost:8234/da/robotter/<slug>/" 1440
node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs "http://localhost:8234/da/robotter/<slug>/" 1440 <udfil>.png
node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs "http://localhost:8234/da/robotter/<slug>/" 390 <udfil>.png
```

**Skuddet kan læses med Read-værktøjet.** Se den. En plan skrevet uden at have set fladen er en
omskrivning af koden.

**Mål også den engelske:** `/en/robotter/<slug>/`. Engelsk tekst er længere, og en plan, der kun
holder på dansk, er en halv plan.

**Verificér serveren mod disken, før ét eneste tal bruges:** vælg en streng, der kun findes i
din udgave, og sammenlign `curl -s` mod `grep` på filen. Ordet `hjoerne` duer **ikke** som
kontrolord — det findes 10 gange i mains eget stilark. Måler du en anden agents byg, er alle
dine tal forkerte, og de vil se rigtige ud.

## Kendte åbne fund på eller nær robotsiden — efterprøv dem, tro dem ikke

Alle tre er noteret, ingen er rettet. **Mål hver enkelt selv og skriv det målte tal**; de er
skrevet ned af andre og kan være forældede.

1. **Hover-zoomen `scale(1.024)` beskærer nu 2,4 %.** Den var harmløs under `cover` og klipper
   under `contain` efter L78. Sidens eneste sanktionerede bevægelse.
2. **55 forskellige skriftstørrelser** i stilarkene, 18 trin alene i spændet 9–20 px (målt
   1. sep). Robotsidens andel er ikke målt.
3. **Tæthedstallet står nu som "24 af 33" uden nævnerforklaring**, fordi fodens forklaring blev
   fjernet 2. sep. Forklaringen findes ikke længere nogen steder på robotsiden.

## Hvad planen skal indeholde

`impeccable shape`s egen form styrer. Ud over den kræver briefet fire ting, fordi de er dem,
projektet har betalt for at lære:

1. **MODE navngivet og brugt.** Robotsiden er **Read**. Skriv, hvad det konkret betyder for
   hierarki, tempo og hvor øjet skal lande først — ikke som en etiket, men som noget planen
   træffer valg ud fra.
2. **Hvert forslag skal kunne mødes med et acceptkriterium.** *"Stram hierarkiet op"* er ikke
   et forslag; *"nøgletalsblokken skal have præcis tre niveauer, målt som antal forskellige
   `font-size` i blokken: i dag N, efter M"* er. Uden kriterium er et forslag en stemning, og
   en stemning kan ikke afvises af den, der er uenig.
3. **Hvert tal skal have en måling ved siden af.** Skriv kommandoen. Et tal, du har udledt i
   hovedet, mærkes **skønnet**.
4. **Rækkefølge og pris.** Hvad skal bygges først, og hvad koster hvert skridt — filer, sider,
   tests. En plan uden rækkefølge bliver til en liste, nogen plukker fra.

**Planen må gerne sige, at noget skal blive, som det er.** Skriv da hvorfor — det er lige så
meget en beslutning som en ændring, og den er lettere at glemme.

## Miljø

- `node` ligger i `/c/Program Files/nodejs/node.exe` — Git Bash har den **ikke** på PATH.
- **Gitignorerede filer skal kopieres ind, ellers giver validate 54 fejl, der ikke er dine, og
  bygget mangler billeder — så dine skærmbilleder viser tomme rammer og du drager en forkert
  konklusion om `contain`:**
  ```
  cp -r ../udstilling/assets/fotos/fabrikant/. assets/fotos/fabrikant/
  ```
- Serveren: `/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m http.server
  8234 --directory dist` fra worktree-roden, **aldrig `cd dist`**.
- **Luk din server, når du er færdig med at måle, og skriv i rapporten, at du gjorde det.**
- Skriv filer som UTF-8 **uden** BOM. Lange markdown-filer knækker i bash-heredocs — brug
  Write-værktøjet.
- Commit-beskeder med backticks, `$` eller anførselstegn: skriv til fil, `git commit -F <fil>`.
- **Commit undervejs er et krav.** Ét commit pr. sammenhængende afsnit af planen. To spor er
  døde på tre dage uden en linje efterladt.
- **Ryd `tests/.tmp-koersel` i din worktree, når du er færdig** — 11,5 GB fri på C:.

## Rapporten — `fund/FUND-shape-robotside.md`, højst 60 linjer

Planen selv er `fund/PLAN-robotside.md` og har ikke noget loft. Rapporten er kort og
indeholder fire ting:

1. Hvilken retning planen valgte, og hvilken den fravalgte — én linje hver.
2. **Konfidens pr. påstand.** *Høj* kræver en genkørbar kommando **plus** én linje om, hvad
   tallet ville have været, hvis arbejdet var forkert. Uden begge dele: middel.
3. Usikkerheder — det du ikke kunne afgøre, og det du måtte gætte.
4. Målingerne som tal.

**UDEN FOR de 60 linjer, obligatorisk:**
- **"Nye fælder og opdagelser."** Er der intet, skal der stå, at der intet er.
- **"Punkter i briefet, jeg ikke nåede."** Én linje pr. punkt, tom hvis ingen.

## Briefets fakta er påstande

**Afviger noget, du måler, fra noget, briefet påstår, så rapportér afvigelsen — det er en del
af leverancen, ikke ulydighed.** De tre åbne fund ovenfor er skrevet af andre; to af mine egne
tal i nabosporenes briefs var forkerte, fordi kommentarer nævnte klassenavnene.
