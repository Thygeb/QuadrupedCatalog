# FUND-prosa — de sidste fire poster + kortfodnoterne til én legende

## Løsninger

**Punkt 1:** Slettede interne henvisninger (fund/FUND-kand4.md, fund/FUND-kand2.md,
INTERN REVISIONSNOTE) fra `noter:`/YAML-kommentarer efter 9ecfa4e's metode; beholdt
producent-/læserrelevant indhold (fx STOPPRØVE-klassifikationen i yuejia-yj30-w).
Fravalgt: at lade "GENBRUGT EVIDENS"-noter (uden literal "FUND-"-streng) stå, fordi
de er samme kategori intern proces som de slettede — ville have brudt konsistensen
med søsterfilerne.

**Punkt 2:** Flyttede de to skabelontekster til én ny i18n-nøgle `kort_legende`,
vist ét sted pr. side (katalog/forside/producent). Kortet viser kun det, der
afviger (0-kilder, anden ophav end fabrikant, note, delt_med). Fravalgt: at lade
kildelinjen stå med varierende N på hvert kort — den bar ingen information ud
over det, striben allerede viser med hævede bogstaver.

## Konfidens

- **Høj** — begge grep-acceptkriterier i punkt 1 er 0, genkørbart:
  `grep -rlE "sha256|FUND-|KILDEKORT" data/robots/ | wc -l` → 0,
  `grep -rl "INTERN REVISIONSNOTE" data/robots/ | wc -l` → 0.
  Var arbejdet forkert, ville disse tal stadig være 4 og 1 (baseline).
- **Høj** — validate/build uændret: `node tools/validate.mjs` → 77/0/1 (samme som
  grundmåling), `node tools/build.mjs` → 213 sider, 1110 kildebelagte/0 uden
  (samme som grundmåling). Var noget brudt, ville sidetal eller kildetal afvige.
- **Høj** — i18n-parring: `node -e` optalte 261 nøgler i da.json og 261 i en.json.
  Var et sprog glemt, ville de to tal afvige.
- **Middel** — standardteksten "Ikke krediteret, ingen tilladelse" højst 1 gang
  pr. HTML-fil: målt med et node-script over hele dist/, højeste tal er 1 (på
  robottens EGEN side, ikke et kort — forventet, da robotsiden viser fuld
  billedsandhed). Ikke i den endelige form en bruger klikker sig til (målt med
  script, ikke ved at åbne siden i en browser), derfor middel og ikke høj.

## Usikkerheder

- Er robotsidens egen visning af "Ikke krediteret, ingen tilladelse" (1 gang,
  uden for kort-konteksten) inden for eller uden for fund 4's hensigt? Jeg
  læste fund 4 som specifikt om KORT (forside/katalog/producent), ikke om
  robottens egen side, og rørte den ikke.
- Alle 54 nuværende billeder har `ophav: fabrikant` og ingen har `note`/
  `delt_med` — så den afvigelses-logik, jeg byggede ind i `kort()`, er ikke
  afprøvet mod et faktisk afvigende kort. Den er læst igennem, ikke set i
  browseren med et ægte eksempel.

## Målinger

validate 77/0/1 (uændret fra grundmåling) · build 213 sider (uændret) ·
kildemærker 1110/0 (uændret) · i18n-nøgler 261=261 · standardtekst maks 1/fil ·
tests/koer.mjs 212 bestået/2 fejlet (samme to kendte, urelaterede fejl som før).

---

## Nye fælder og opdagelser

- **Å15-referencen i briefet var ikke i denne worktrees STATUS.md** — branchen
  er forgrenet før commit 0993a2d/8d1ef89 på `main`, som indførte Å15. Løst ved
  at læse reglen direkte fra `main`s commits (`git show 0993a2d -p -- STATUS.md`
  og fixup-commit 8d1ef89) i stedet for fra worktreens egen fil. Enhver agent,
  der arver denne worktree senere, bør flette `main` ind eller læse Å15 samme vej.
- **"GENBRUGT EVIDENS"-noter matcher ikke altid grep-mønsteret.**
  yuejia-yj30-w.yaml's variant nævnte hverken "FUND-" eller "KILDEKORT" —
  kun "spor/kand4" og en rå HTML-filsti. Et snævert grep-acceptkriterium ville
  have accepteret den. Jeg fjernede den alligevel for konsistens med Å15's
  principielle regel, ikke fordi kriteriet krævede det — værd at vide, hvis
  næste runde stoler blindt på grep-tallet.
- **Alle 54 billeder er i dag `ophav: fabrikant` uden undtagelse** — ingen
  `eget_foto`, `silhuet`, `delt_med` eller `note` findes i det nuværende
  datasæt. Den nye afvigelses-visning i `kort()` er derfor kun logisk
  efterprøvet, ikke set i praksis med et rigtigt afvigende kort.

## Punkter i briefet, jeg ikke nåede

(ingen — begge punkter er gennemført og committet hver for sig)
