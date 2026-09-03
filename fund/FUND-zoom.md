# FUND — spor/zoom: L78 vs. kortets hover-zoom

**Skill:** `spor` kaldt først (virkede fra worktreen). Ingen designskill valgt —
opgaven er undtaget L70 og har et målbart facit (0 % crop), ikke en designretning.

## Valgt løsning

**Fjernede begge scale()-regler (1.024 på foto, 1.04 på `.billedled--plade`),
byggede INGEN erstatning.** Begge målte kandidater var dårlige på katalogets
egen flade (`.net`, 77 kort, 1 px gittermellemrum — se måling):

- **A (skalér ramme/kort):** et 267 px-kort skaleret 1.024 rækker 3–5 px ud
  over sin egen kant pr. side — langt mere end de 1 px, gitteret har at give
  af. Ville dække naboens kant. Fravalgt.
- **B (translateY i lodret slæk):** mindste brugbare slæk på tværs af de 40
  korrekt tilpassede fotos er **1,98 %** af rammens højde (~2 px ved 267 px
  kortbredde) — for lille til at være et signal. Fravalgt.

Kortet beholder sit eksisterende border-color-signal (`.gitter`-kontekst) og
baggrundsfarve+fokusring (`.net`-kontekst, generator.css, urørt).

## Konfidens

- **Høj**: 0 hover-induceret crop efter rettelsen. `grep -c "img{transform:scale(1.0" assets/system.css`
  → **0** (kun ét kommentar-citat af den gamle værdi tilbage, ikke en regel).
  Var arbejdet forkert, ville tallet være ≥1. Playwright-målt før/efter på
  As2 (frame 199,91px/img 182,09px, IDENTISK før og efter hover) og A1
  (249,23px før og efter — 0,0 px delta).
- **Høj**: build 216 sider, 1111/0 kilder — genkørt, matcher grundmålingen.
  Var CSS'en gået i stykker, ville byg fejle eller sidetal afvige.
- **Høj**: tests **1665/0** (`node tests/koer.mjs`) — 1658 grundmåling + 7 nye
  (72.0–72.3 inkl. revert-bevis). Et fejlslået revert-bevis ville vise 1664/1.
- **Middel**: at kortet stadig "svarer på hover" i `.net` — målt at
  baggrundsfarven skifter #FAFBFB→#FFFFFF, men det er en svag, ikke stærkt
  synlig ændring (ikke målt med kontrastværktøj mod en synlighedsgrænse).

## Usikkerheder

Om #FAFBFB→#FFFFFF er et "godt nok" hover-svar i `.net`, er en smagsdom —
L70/designfrysen forbød mig at designe en erstatning, så jeg lod det stå.

## Målinger

- Grundmåling: validate 77/0/1 ✓ (matcher briefet). Build 216/1111/0 ✓.
  Tests 1658/0 ✓ — **men** `grep -c 'scale(1.024)' assets/system.css` gav
  **2 ved grundmåling**, ikke briefets påstået 1 (rule 5 — se fælde nedenfor).
- Efter rettelse: build 216/1111/0. Tests 1665/0. `git diff --name-only
  main...spor/zoom` → kun `assets/system.css`, `tests/dele/72-*.mjs`.
- Server 8143 lukket (PID 14396, `taskkill`), verificeret med `netstat` (tomt).

## Punkter i briefet, jeg ikke nåede

Ingen. Begge mekanismer er målt og fravalgt, som briefet selv tillod
("er begge dårlige, byg ingen af dem").

---

## Nye fælder og opdagelser (uden for de 60 linjer)

1. **BRIEFETS PÅSTAND OM `.billedled--plade` VAR FORKERT — og den ændrer
   opgavens omfang.** Briefet sagde "Målepladerne er VORES EGNE tegninger,
   L78 dækker dem ikke, rør kun hvis nødvendigt." Målt i `tools/skabelon/
   side.mjs:119-130,496`: `.billedled--plade` sættes på RIGTIGE FOTOGRAFIER
   (robotter fotograferet fri på hvid), ikke på tegningen. Den egentlige
   tegning (`.billedled--maal`/`.maalplade`) har INTET `<img>` overhovedet
   (kun `<span>`, `side.mjs:1771-1775`) — ingen af de to scale-regler kunne
   nogensinde have ramt den. Begge scale-regler ramte altså ægte fotografier,
   og begge er nu fjernet.
2. **STØRRE, ALLEREDE LEVERET L78-BRUD, UDEN FOR MIT SPOR: 44 af 85 fotos i
   selve katalogsiden (`dist/da/index.html`, `.net`-gitteret) er beskåret
   LODRET VED HVILE — helt uden hover, op til 49,1 %.** Årsag: `.net
   .billedled{display:grid;place-items:center}` + `.net .billedled
   img{width:100%;height:100%}` (generator.css:1439-1443) — af en grund jeg
   ikke kunne udlede fuldt ud fra specifikationen, resolver `height:100%`
   IKKE til rammens pixelhøjde for billeder smallere end 4:3 (bekræftet
   visuelt: AlienGo-kortet viser kun et lårben, resten er væk). Screenshot
   taget og set. `generator.css` er UDEN FOR mit ejerskab ("kan blive rørt af
   systemdeltaet", men jeg rørte det ikke) — dette bør blive et selvstændigt,
   prioriteret spor. Genkørbar kontrol: åbn `dist/da/index.html` ved 1440px,
   sammenlign `.billedled`s og dens `<img>`s `getBoundingClientRect().height`
   for fx `alt="AlienGo"`.
3. **Målefælde: CSS-transition midt i en måling gav et spøgelsestal.**
   Umiddelbart efter at flytte hover væk fra et kort, viste et andet korts
   `getComputedStyle().transform` STADIG `scale(1.04)` — ikke fordi det var
   forkert kort, men fordi `var(--tid)=.42s`-transitionen var i gang. Løst
   ved at injicere `*{transition:none!important}` før måling. Uden
   kontrollen ("hvad SKAL det vise") havde jeg fejlkonkluderet, at hover
   lækkede til et forkert element.
4. **Playwright MCP-serverens cwd er hovedrepoet, ikke min worktree — bekræftet
   konkret.** `browser_take_screenshot` skrev til `C:/Praktik/websites/
   udstilling/aliengo-crop-check.png`, IKKE min worktree. Filen (og et
   `.playwright-mcp/`-snapshot) blev efterladt i hovedrepoet af selve
   værktøjet; jeg fjernede screenshottet igen (untracked, `git status`
   bekræftede), rørte intet andet der. URL-/bredde-vagten i selve
   sideevalueringen fangede intet forkert her (URL og bredde var altid mine),
   men gem-stien er en anden, ukontrolleret kanal — værd at vide for næste
   spor, der tager skærmbilleder.
