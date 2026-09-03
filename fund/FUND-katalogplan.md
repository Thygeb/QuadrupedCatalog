# FUND — `spor/katalogplan`

**Skills:** `spor` + `impeccable shape`, begge kaldt og begge virkede fra worktreen (`context.mjs` kørt, `reference/shape.md` læst). Gik forbi: `ui-ux-critique` og `impeccable critique` (leverancen er en plan, ikke en dom), `frontend-design` (ingen ny flade), `grillmig` (L70: aldrig på en designretning), `robotdata`/`supabase` (rører ingen data).

**Substitution:** `shape` kræver en interviewrunde; jeg er subagent uden `AskUserQuestion` (bekræftet via `ToolSearch`). Briefets låste krav er brugt som svarene, og mine egne tilføjelser er mærket *(antagelse)* i planen.

**Leverance:** `fund/PLAN-katalog.md`, 465 linjer. Ingen kode, CSS eller skabelon rørt.

## Valgt / fravalgt

- **J1: udvendig luft, ikke indvendig** — `padding:9px 14px` fravalgt, fordi JPK selv justerede den 1. sep og den lander præcis på to gulve (44 px højde, 16 px skrift).
- **J2: færre trin, ikke et nyt** — ny skriftgrad fravalgt; fire eksisterende fjernes i stedet.
- **J3: fjern margin + ét trin polstring** — de 44 px (berøringsgulvet) fravalgt.
- **F2: de ti bliver IKKE `.knap`** — `.knap`s hover er accent = sorteringens *valgte* farve; sammenlægning ville gøre hover ulæseligt som valgt.
- **Kortet: én implementering, forskel ved fratrækning** — to komponenter fravalgt.

## Fire af briefets påstande er forkerte — målt

1. **J3's mekanisme.** Briefet: grid-strækning. **Målt 0 px** — alle ni facetter er lukkede (JPK's standard 1. sep), naturlig højde 108 px i alle ni. Strækning er ægte, men **kun når en facet er åben** (389,5 px, og rækkefællerne følger med).
2. **`kort` når ikke robotsiden eller Om** — kun kataloget + 25 producentundersider. Robotsiden har `kort-ophav`, Om har `om-kort`: to andre klasser, som et bindestregs-grep tager med. Briefets egen advarsel, udløst.
3. **`.maerke` står ikke på kataloget** — 77 robotsider, ingen andre steder. F1 er robotsidens problem, ikke katalogets.
4. **Enhedskontakten står allerede i topbaren på 107/107** (etiketten), mens inputtet kun er på 72: **35 sider udsender et `<label for="enhedsskift">`, der peger på ingenting.** Kravet er halvt bygget, ikke ubygget.

Desuden genmålt: bundbjælken dækker **44,1 px**, ikke 89. Hover-zoomen beskærer **vandret** (0 % slæk i bredden, 8,96 % i højden) — imod L78's ordrette *"et produktfoto beskæres aldrig"*.

## Konfidens

| Punkt | Niveau | Bevis |
|---|---|---|
| J1/J3-tal, søgefeltets position, kortantal | **Høj** | Genmålingsscriptet ligger i scratchpad (sti nederst); server på 8140. Kørt to gange, 16/16 identiske. **Var arbejdet forkert**, ville `J3_netEfterFix` ikke give 230 mod 326, og `J1_luftOver/Under` ikke 0/0 |
| Klasse- og sidetællinger (107/72, 77, 142, 5+5, 123) | **Høj** | greps med forudsagt tal skrevet før aflæsning. **Var de forkerte**, ville `id=enhedsskift` ikke give 72 mod etikettens 107 |
| 19 fil:linje-citater | **Høj** | `sed -n Np` + `grep` pr. citat, 19/19 ramte |
| J2's retning (12 px, `.09em`) | **Middel** | Graderne er målt; at 12 px *læser bedre* er en vurdering, ikke en måling |
| F1's kontrolgrammatik | **Middel** | De seks kontrollers værdier er målt; de tre kategorier er et designvalg |
| J2's virkning på sammenligningssiden | **Lav** | Ikke målt. `.facet` findes dér. Åbent punkt 2 i planen |

## Usikkerheder

- **Hvad JPK mener med "padding omkring search-feltet".** Indersiden kan ikke reduceres uden at bryde et gulv, han selv satte; ydersiden er nul. Jeg læser ham som ydersiden.
- **Enhedskontakten på 404 og Om.** Planen siger "tegnes ikke, hvor intet kan omregnes". Læser han kravet som *synlig overalt*, vinder hans læsning — men så skal inputtet udsendes dér.
- **Forslag 0.1 fjerner en synlig sektion** (åbningens ni kort). Indholdsbeslutning, markeret som sådan i planen.

## Målinger

byg **216 sider · 77 filer · 0 fejl · 1 advarsel** (R9 på `ghost-robotics-vision-60`, lå der før mig) · AK1–AK4 **4/4** · citater **19/19** · klassetællinger **13/13** · genmåling **16/16 identiske** · fejl fundet i eget arbejde **1** (rettet) · plan **465 linjer**

**AK5 kolliderer med rapportkravet:** kriteriet siger "præcis `PLAN-katalog.md` og `BRIEF-katalogplan.md`", men samme brief forlanger rapporten som `fund/FUND-katalogplan.md`. Jeg har committet rapporten (konventionen i `fund/`), så diffen er **3 filer**. Vil du have AK5 ordret: `git rm --cached fund/FUND-katalogplan.md`.

**Serveren på 8140 er lukket og efterprøvet** — `curl` giver 000, 0 LISTENING.

**Genmåling** (start først en server på 8140 fra worktree-roden):
`node "C:/Users/thyge/AppData/Local/Temp/claude/c--Praktik-websites-udstilling/0625e2b4-7f7c-4c17-99c0-6a8b393968f2/scratchpad/genmaal-katalog.mjs"`

---

## Nye fælder og opdagelser

- **Den styrbare MCP-browser er DELT mellem samtidige spor, og det ødelagde en måling.**
  Midt i min facetmåling stod browseren på `localhost:8141/da/sammenligning/` i bredde
  1536 — et andet spors server og side. Jeg havde navigeret til 8140 og resizet til 1700.
  Fælden er værre end portkollisionen i `miljoefaelder.md`: **egen port beskytter ikke,
  når selve browseren er fælles**, og et andet spors side svarer lige så villigt som ens
  egen. Opdaget kun, fordi jeg spurgte `location.href` efter en uventet `null`.
  **Modtræk, der virkede:** egen Playwright-instans via
  `file:///C:/Praktik/websites/maalevaerktoej/node_modules/playwright/index.js`.
  To importfælder undervejs: ESM kræver `file:///C:/...` (ikke `C:/...`, ikke `/c/...`),
  og pakken er CommonJS, så `import { chromium }` fejler — brug default-import.
- **`miljoefaelder.md`s tal for manglende fabrikantfotos er forældet.** Den siger
  R18 giver **54** fejl. Målt i dag i en frisk worktree: **76**. Kataloget er vokset.
- **En positiv kontrol fangede to af mine egne greps, ikke projektets kode.**
  `kort__savn"` gav 0 mod 123 (klassen står aldrig alene i sit attribut), og et
  `\\"`-escape i en shell-funktion gav falsk FEJL på et korrekt citat. Begge gav
  fuldstændig plausible tal.
- **Fejl fundet i mit eget arbejde ved selv-efterprøvning:** planen påstod, at alle ni
  facetter er 109 px. Målt: syv er 109, to er 108 (`facet--sidste-raekke` fjerner
  `border-bottom`). Rettet i egen commit. Den slap kun igennem, fordi min første aflæsning
  så på én facet i stedet for hver; forudsigelsen `alleFacetterSammeHoejde: true` mod
  målte `false` fangede den.
- **`side.mjs`s "fælles" `kort()` har præcis én kalder i dag.** `katalog.mjs:1137`
  begrunder to kort med, at den fælles "deles med forsiden og producentsiderne" — men
  forsiden blev slettet af L72. Begrundelsen overlevede den beslutning, der ophævede den.
- **`build.mjs` tæller `<article class="kort">` ordret**, så åbningens ni kort undslipper
  tællingen via `kort--seneste`. Enhver kort-sammenlægning skal holde åbningstaggen
  byte-identisk.

## Punkter i briefet, jeg ikke nåede

- **`.facet__navn`s virkning på sammenligningssiden er ikke målt.** Den er katalogets
  nabo i J2-forslaget og står som åbent punkt 2 i planen, men jeg målte kun kataloget.
- **Bundbjælken er kun målt ved 390 px med to robotter valgt.** Om den vokser ved tre
  valgte eller ved ombrudt tekst, ved jeg ikke — mit tal (44,1 px) gælder den tilstand,
  jeg fremkaldte.
- **`chip__navn` og `skala__ridse-tal` er foreslået foldet ind i J2's skala uden at være
  målt i deres egen sammenhæng** (de stod i skriftgradstællingen, men jeg har ikke set
  på, om 13,5 → 14 og 10 → 12 bryder noget i skalafilterets egen geometri).
