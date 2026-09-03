# FUND-fodtest — 7 assertions vendt til at bevise at foden FINDES

## Tabel over hver vendt assertion

| Sted | Før | Efter | Hvad den nu beviser |
|---|---|---|---|
| `tests/dele/13-billedramme.mjs:113` (`5.revert`) | `5.revert: forhandler-fodnoten er IKKE laengere paa forsiden (foden er fjernet)` | `5.vendt: forhandler-fodnoten ER TILBAGE paa forsiden` + `5.vendt.revert` | Forsidens `<main>` bærer ikke selv linjen — den kommer fra foden. Revert: en side uden fodens tekst falder |
| `tests/dele/42-om-os.mjs:172-175` (`42.4b.{da,en}`) | `forekomster === 1` — "foden er væk, ingen dublet" | `forekomster === 2` — "Om os' egen + fodens, foden er tilbage" + `42.4b.{s}.revert` | Linjen står på BEGGE de to steder den skal (Om os' `<main>` og foden) — 42.4's `<main>`-afgrænsning betyder noget igen. Revert: én forekomst (foden væk) falder |
| `tests/dele/51-fejl404.mjs:117-118` (`51.2.{da,en}`) | `!sider[s].includes(T.ingen_forhandler)` — "foden er væk" | `sider[s].includes(...)` — "foden er tilbage" + `51.2.{s}.revert` | De sprogspecifikke 404-sider bærer fodens hårde linje (hård begrænsning 1). Revert: en 404-side uden linjen falder |
| `tests/dele/53-robotsidens-flader.mjs:172-176` (`53.11.{da,en}`) | `!== 0` — "0 gange, foden er væk" | `!== 1` — "PRÆCIS 1 gang, ingen dublet" + `53.11.{s}.revert` | Hver af de 77×2 robotsider bærer forbeholdet netop én gang (foden), ikke nul og ikke to. Revert specifikt på tærsklen 0→1 |

Alle 4 vendinger ligger i filer jeg allerede ejede (ingen af `spor/testvend`s eller andre
spors filer rørt) — bekræftet: `git diff --stat d645200 HEAD` viser kun disse 4 filer.

## Grundmåling — IKKE briefets tal ved første forsøg

**Første kørsel af `node tests/koer.mjs` uden forudgående `build.mjs` gav 1591/27** —
et helt andet og forkert billede (mange "der ER bygget sider at måle på"-fejl), fordi
en frisk worktree ikke har `dist/`. Efter `node tools/validate.mjs` (77/0/1, matcher
brief) og `node tools/build.mjs` (216 sider, 1111/0, matcher brief) gav den **rigtige**
grundmåling **1684 bestået / 15 fejlet** — identisk med briefets påstand. Jeg opdelte
selv de 15 i 8 arvede vs. 7 nye ved at sammenholde teksterne med FUND-sidefod.md's
tabel; fordelingen stemte 1:1 (31.8, 35.11/12 da+en, 48.11 da+en, 57.1 = 8 arvede;
5.revert, 42.4b da+en, 51.2 da+en, 53.11 da+en = 7 nye).

## Konfidens

**Høj, alle 4 vendinger.** Kommando: `node tests/koer.mjs` fra worktree-roden. Tallet
faldt trinvist og reproducerbart efter hver commit: 1684/15 → 1686/14 → 1690/12 →
1694/10 → **1698/8**, kørt to gange til slut med byte-identisk fejlliste (de 8 arvede).
Kontrafaktisk: fjernes en vending (f.eks. via `git revert` af en af de 4 commits),
falder netop dens assertion(er) tilbage til rødt — vist trin for trin ovenfor, ikke
kun påstået.

## Usikkerheder

- Punkt 1's "bevis kildeløftet, cookie-linjen, udgiveren" er kun direkte opfyldt
  for forhandlerlinjen (hård begrænsning 1) — de 4 eksisterende assertioner
  testede allerede netop den tekst, ikke `<footer>` generisk, og ingen af de 7
  røde dækkede kildeløfte/cookie/udgiver i forvejen. Vendt uden nye assertions
  for de tre andre linjer; er det utilstrækkeligt, er det et opfølgende punkt.
- `fund/FUND-testvend.md` og dens gren findes ikke som commit i dette repo
  (ikke i `git branch -a`) — filen lå ucommitteret i hovedrepoet og i
  `udstilling-wt-prisnote`. Læst derfra som forbillede, ikke fra en gren.

## Målinger og skills

`node tools/validate.mjs`: 77/0/1. `node tools/build.mjs`: 216 sider, 1111/0.
`node tests/koer.mjs`, kørt 6×: 1684/15 (grund) → 1686/14 → 1690/12 → 1694/10 →
1698/8 → 1698/8 (bekræftelse, byte-identisk fejlliste). `find dist -name
"*.html" | wc -l` → 216. `find dist -name "*.html" -exec grep -l "<footer" {}
\; | wc -l` → **214** (forventet 214 — kun `dist/index.html` og `dist/404.html`
mangler foden). De 8 arvede stod uændret røde i alle 5 mellemliggende kørsler.

`spor` kaldt som første handling (lykkedes). Ingen designskill (ingen
flade/CSS rørt). `fejljagt` ikke formelt kaldt, men samme metode brugt i
praksis på 1591/27-afvigelsen: hypotese (manglende `dist/`), test (byg
først), briefets tal igen.

---

## Nye fælder og opdagelser

1. **`node tests/koer.mjs` uden et forudgående `node tools/build.mjs` i en FRISK
   worktree giver et fuldstændig plausibelt, men forkert, facit.** 1591 bestået/27
   fejlet så ud som en reel måling — ingen crash, ingen exception, bare andre
   fejlnavne ("der ER bygget sider at måle på"). Havde jeg ikke kendt briefets
   forventede 1684/15 og undret mig over afvigelsen, var denne rapport bygget på
   et forkert grundlag. Skillens regel 2 ("skriv hvad tallet skal være FØR du
   læser det") er præcis det, der fangede det her.
2. **Backtick-heredoc til en fil med navn startende på `.` (`.commitmsg1.txt`)
   fejlede tavst uden fejlmeddelelse i selve write-kommandoen** — `cat > .fil <<'EOF'`
   gav exit 0 tilsyneladende, men filen blev aldrig skrevet (`git commit -F` fandt
   den ikke). Skiftet til Write-værktøjet med almindeligt filnavn løste det. Ukendt
   om det er dot-filen eller heredoc-formen; ikke undersøgt videre, da CLAUDE.md
   allerede foreskriver Write/Edit frem for shell-heredocs til indhold.
3. **Alle 4 filer krævede kun ÉN vending hver i teksten, men gav to nye
   assertions pr. sted** (den vendte + dens revert), undtagen 13-billedramme.mjs
   der kun havde 1 sprog (kun 'da' i `forsideHTML`). Derfor endte det faktiske
   facit (1698/8) 7 højere end briefets forudsigelse (1691/8) — hele forskellen er
   de 7 nye revert-beviser, som alle er grønne. Ingen af de 8 arvede blev rørt.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle 4 filer (13, 42, 51, 53) er vendt, hver committet for sig med tal i
beskeden, serveren blev aldrig startet (ingen HTTP-måling var nødvendig — al måling
skete på `dist/` direkte og via `node tests/koer.mjs`), og de 8 arvede fejl står
fortsat røde efter sidste kørsel.
