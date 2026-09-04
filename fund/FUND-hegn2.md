# FUND — `spor/hegn2`: konflikt 6 lukket, de to sidste `--hegn`-kanter skiftet

**Skills:** `spor` og `design` kaldt fra worktreen — begge svarede (ingen `Unknown skill`,
ingen disk-fallback nødvendig). Ingen andre skills relevante for et rent grep/CSS/test-spor.

**Valgt løsning:** `var(--hegn)` → `var(--hegn-baerende)` på de to steder, DESIGN.md konflikt 6
lukket som AFGJORT med historik bevaret. **Fravalgt:** ingen alternativ overvejet — briefet
pegede på den allerede vedtagne regel (R8/`spor/tomstat`), og opgaven var at anvende den, ikke
opfinde en ny.

## Ændringen (UI)

| Flade | Element | Før | Efter |
|---|---|---|---|
| Robotside, nøgletalsstriben | `.stribe--intet` kant | `#9AA3A9`, 2,07:1 (fyld) / 2,14:1 (bund) | `#737F87`, 3,31:1 (fyld) / 3,43:1 (bund) |
| Robotside, typeskiltet | `.typeskilt .maerke--tom` kant | `#9AA3A9`, 2,14:1 mod bund | `#737F87`, 3,43:1 mod bund |

Ingen anden visuel ændring. `.ikon` (samme blok) og `background` uændrede. Bekræftet live i
browser (se nedenfor) — ikke kun i kilden.

## Konfidens pr. punkt

1. **Høj.** `sed -n '1030p;2060p' assets/system.css | grep -c var(--hegn-baerende)` → 2/2, og
   `grep -c "dashed var(--hegn-baerende)" assets/system.css` → 4. Kontrafaktisk: sat tilbage til
   `var(--hegn)` gav 0/0 og 2 (se punkt 3 nedenfor for den fælles kontrafaktiske kørsel).
2. **Høj.** Linje 4 (tokenkommentar): `grep -ro "var(--hegn)" assets/ --include=*.css | wc -l` → 40,
   lig med kommentarens tal. Kontrafaktisk: uden mine to rettelser ville tallet være 42.
3. **Høj.** `grep -c "ok(" tests/dele/59-farvetokens.mjs` → 16. Kontrafaktisk KØRT (ikke kun
   simuleret): system.css midlertidigt sat tilbage til `var(--hegn)` på begge linjer (sed, ikke
   committet), `node tests/koer.mjs` kørt → **59.25 FEJL** (`I dag 2,07 / 2,14`), **59.26 FEJL**
   (`I dag 2,14`). Gendannet (`git diff assets/system.css` tom bagefter), kørt igen → begge
   **OK** (`3,31 / 3,43` og `3,43`). De øvrige 24 assertions i test 59 ordret uændrede begge
   gange (sammenlignet linje for linje).
5. **Høj.** `grep -c "Konflikten er ikke lukket" DESIGN.md` → 0, `grep -c "hegn2" DESIGN.md` → 1.
   Historik bevaret (spor/tomstats afsnit står stadig, som eget stykke).
6. **Høj.** `node tools/validate.mjs` → 77/0/1 (identisk med grundmålingen). `node tools/build.mjs`
   → 216 sider, 1.111 kildemærker, 0 uden (identisk). `node tests/koer.mjs` → **1817 bestået,
   6 fejlet** (grundmålingens forudsigelse var 1815/6 — de +2 er netop 59.25/59.26, nu grønne).
   De 6 røde er **navnesammenlignet** med Å175's liste og er identiske: `4c`, `259 forbehold
   "gyldighed"`, `562 i alt ...`, `(d) fixture addverb-trakr-20`, `64.3` × 2 (unitree-aliengo).
   Ingen nye, ingen forsvundne.

## Usikkerheder

Ingen tilbage. Den ene reelle usikkerhed briefet efterlod — hvad `.maerke--tom` rent faktisk
står på — er målt (se "Nye fælder" nedenfor).

## Målingerne (facit)

`validate 77/0/1` · `build 216/1111/0` · `koer.mjs 1817 bestået/6 fejlet` (grundmåling 1815/6,
+2 = de nye grønne) · `ok( i test 59: 16` · `var(--hegn) tilbage i CSS: 40` · `dashed
var(--hegn-baerende): 4`.

---

## Nye fælder og opdagelser

1. **Linjeforskydning.** Briefets `:1022`/`:2052` er nu **`:1030`**/**`:2060`** efter punkt 4's
   kommentarudvidelse (+4 linjer skubbede resten af filen). Selektoren, ikke tallet, er den
   holdbare reference — bekræftet med `grep -n "stribe--intet{"` / `grep -n "maerke--tom{"`.

2. **En selv-refererende grep-fælde, fundet og løst.** Første forsøg skrev den *ordrette* kommando
   `grep -ro "var(--hegn)" ...` ind i tokenkommentaren — men den streng er selv en gyldig træffer
   for sit eget mønster, så genkørslen gav **41**, ikke 40 (samme klasse fejl som CLAUDE.md
   dokumenterer for `{`/`}` i CSS-kommentarer). Løst ved at dokumentere den ESCAPEDE form
   (`grep -roE "var\(--hegn\)"`), som ikke selv-matcher, og skrive fælden ind i kommentaren,
   så næste agent ikke genopdager den samme vej.

3. **`.maerke--tom` står faktisk på `--bund`, ikke `--panel`.** Målt i browser
   (`getComputedStyle`, `anybotics-anymal-x`): `background-color` er `rgba(0,0,0,0)` op til
   `<body>`, hvis egen regel er `background:var(--bund)` (`system.css:341`) → effektiv baggrund
   `rgb(232,235,237)` = `#E8EBED`. Krydstjekket mod kilden. Kanten (`#737F87`) måler derfor
   **3,43:1**, ikke 3,96 (det ville have været `--panel`-tallet).

4. **`.stribe--intet .ikon` bevidst urørt — målt, ikke kun antaget.** Samme farvepar som kanten
   FØR rettelsen (`#9AA3A9` på `#E4E7EA`) = **2,07:1**, bekræftet både analytisk (WCAG-formel,
   egen node-kontrol) og live i browser (`rgb(154,163,169)` på `rgb(228,231,234)`,
   `ghost-robotics-spirit-40`). Ikonet er tekst-redundant (overskrift + afsnit siger det samme),
   derfor ikke WCAG 1.4.11-relevant. Skrevet ind i DESIGN.md, så det ikke ligner en forglemmelse.

5. **Skærmbillede landede i hovedrepoet**, som Å174 forudsagde (`C:/Praktik/websites/udstilling/
   hegn2-stribe-intet.png`) — flyttet ind i `fund/hegn2-stribe-intet.png` i denne worktree.
   Hovedrepoets `git status` viser intet fra mig efter flytningen.

6. **Bash-værktøjets standard-cwd i denne session var hovedrepoet**, ikke worktreen — opdaget da
   et `git status` uden eksplicit `cd` viste hovedrepoets tilstand. Alle mine skrivende
   kommandoer havde eksplicit `cd` til worktreen; kun læse/kontrol-kommandoer uden effekt blev
   nogensinde kørt uden. Værd at vide for næste spor i denne sessionsform.

7. **Serverhygiejne:** startede `python -m http.server` på port 8126 (verificeret mod disken:
   `curl .../system.css | grep -c hegn-baerende` = 10 = filens eget tal), dræbte kun min egen
   PID (7888, matchede min starttid) og lod en anden, ældre python-proces (PID 228, startet
   07:16, ikke min) stå urørt.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle seks punkter, begge acceptkriterie-sæt (inkl. 3b) og commit-rækkefølgen er udført.
