# FUND — spor/opdel: `tools/yaml.mjs` delt i parser og `tools/enheder.mjs`

**Skill:** `spor` kaldt som første handling — lykkedes fra worktreen. Ingen andre relevante.

**Miljøfælde, ny:** `fund/BRIEF-opdel.md` fandtes IKKE i min worktree, kun i hovedrepoets
ucommitterede `fund/` — worktrees deler ikke ucommitterede filer. Læste den derfra (read-only).

## Grundmåling (7b169b7) — matcher briefets tal præcist
`validate.mjs`: **77/0/1** (Ghost Vision 60, R9) · `build.mjs`: **216 sider · 1.111 kilde · 0 uden**
`tests/koer.mjs`: **1817/6**, samme seks (4c, 2×"gyldighed", fixture addverb-trakr-20, 2×64.3 aliengo).

## Valgt løsning
- Linje 220–458 flyttet ordret til nyt `tools/enheder.mjs` (13 eksp.), verificeret byte-identisk mod
  kildelinjerne med `diff`. `tools/yaml.mjs` trimmet til linje 1–222 (2 eksp.).
- Punkt 4: **`ctx.yaml` forbliver parseren, `ctx.enheder` er ordforrådet** — målt FØR valget: 0 af de
  5 testdele der bruger `ctx.yaml` (02/12/15/44/63) rører et ordforrådsnavn, alle bruger kun
  `yaml.parseYaml()`. 0 testdel-rettelser krævet. Fravalgt: "behold alle 15 i ctx.yaml" — ingen gevinst,
  samme 0-tal under begge muligheder.

## Afvigelse fra briefet — AC3 kan ikke bogstaveligt give 0
Formlen tester om en fil med et ordforrådsnavn OGSÅ indeholder strengen "yaml.mjs". Men punkt 3
kræver at `validate.mjs` BEHOLDER `import { parseYaml, YamlFejl } from './yaml.mjs'` — den linje
indeholder selv strengen. Målt: formlen giver **2** (`enheder.mjs` pga. min topkommentar,
`validate.mjs` pga. den krævede import), ikke 0. Den reelle kontrol (parser import-sætninger,
tjekker om et ordforrådsnavn står i klammen FRA yaml.mjs — ikke fritekstsøgning) giver **0**.
Rettede desuden en forældet kommentar i `tools/skema.mjs:717` fundet ved samme undersøgelse.

## Efterprøvning med tælling
- Alle 15 linjenumre i briefet efterprøvet mod filen på 7b169b7 (`grep -n "^export"`) — 0 afvigelser.
- 3 importører rettet (side.mjs:46, skema.mjs:10, validate.mjs → 2 import-sætninger), verificeret med
  `grep`. 6 øvrige importører **ikke rørt** — bekræftet med `git diff --stat` (kun ejede filer ændret).

## Konfidens
- **Høj** — AC1/AC2: `grep -c "^export"` → yaml.mjs 2, enheder.mjs 13. Kontrafaktisk: ville have
  givet 15 / "findes ikke" uden opdelingen.
- **Høj** — AC4: `tests/koer.mjs` 1817/6 kørt to gange, samme seks fejl ordret. Kontrafaktisk: en
  fejlslagen import giver `SyntaxError` og 0 beståede, ikke 1817.
- **Høj** — AC5: `diff -r` på fil- og db-vejen, begge 0 linjer. Kontrafaktisk udført: indsat linje →
  diff gav 3, fjernet → 0. Apparatet beviseligt følsomt.
- **Middel** — AC3: bogstavelig formel giver 2, ikke 0 (se afvigelse). Reel hensigt efterprøvet med
  eget script og giver 0, men det er en omskrivning af briefets kommando, ikke dens eget facit.

## Usikkerheder
Om orkestratoren ville foretrække, at ordet "yaml.mjs" fjernes fra `enheder.mjs`s topkommentar for
at presse det bogstavelige tal til 1 (validate.mjs blokerer alligevel 0). Lod dokumentationen stå.

## Målinger som tal
```
grep -c "^export" tools/yaml.mjs        2   (var 15)
grep -c "^export" tools/enheder.mjs     13  (fil fandtes ikke før)
node tools/validate.mjs                 77/0/1   (uændret)
node tools/build.mjs                    216/1.111/0   (uændret, begge veje: fil + db)
node tests/koer.mjs                     1817/6, samme 6 navngivet   (uændret)
diff -r foer-fil efter-fil              0 linjer
diff -r foer-db  efter-db               0 linjer
kontrafaktisk: indsat / fjernet linje   3 / 0
AC3 bogstaveligt                        2 (ikke 0 — se afvigelse)
AC3 reel hensigt (praecist script)      0
```

## Nye fælder og opdagelser
1. **BRIEF-opdel.md lå kun i hovedrepoets ucommitterede `fund/`, ikke i min worktree.** Worktrees
   deler intet ucommitteret — bør nok committes før worktreen oprettes fremover.
2. **AC3's grep-formel er strukturelt usatisfierbar i den korrekte slutttilstand**, fordi punkt 3
   selv kræver en ægte `from './yaml.mjs'`-importlinje, som indeholder strengen formlen leder efter.
   Den præcise erstatning: et lille Node-script der parser `import { ... } from '...'`-sætninger og
   tjekker om et ordforrådsnavn står i klammen når kilden er yaml.mjs — giver 0, hvor grep giver 2.
3. Fandt og rettede en ekstra forældet kommentarreference (`tools/skema.mjs:717`), ikke i briefets
   filliste men inden for ejede filer, opdaget ved samme AC3-undersøgelse.
4. Orkestratorens eget scratchpad (delt session-id) indeholdt allerede `db-ud/`, `fil-ud/`, `db.log`,
   `fil.log`, `cmsg.txt` fra briefforberedelsen — bekræftede uafhængigt briefets diff-apparat-tal.
   Ikke rørt, kun læst til orientering.

## Punkter i briefet, jeg ikke nåede
Ingen. Alle 5 acceptkriterier behandlet, alle 4 commits lavet i angivet rækkefølge. Worktree-
oprydning udført bortset fra `tests/.tmp-koersel` (deny-listet `rm -rf`, kræver JPK).
