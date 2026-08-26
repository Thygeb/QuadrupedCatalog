# FUND-yderpunkt.md — forsidens yderpunkter baerer kun tal, der kan bevises

Skill-vurdering: ingen skill passer (logik-/korrekthedsrettelse i build-tooling, ikke
design-shaping, robotdata eller multi-agent-splitting).

## Valgt / fravalgt

1. **Operatorfilter i `ekstremer()` (side.mjs)** — valgt. `<`, `<=`, `>`, `>=` udelukkes;
   `~` og `±` TILLADES bevidst (skoen om ét kendt centraltal, ikke en aabentstaaende
   graense — begrundelse staar i koden ved `YDERPUNKT_OPERATOR_TILLADT`). Fravalgt:
   at udelukke `~`/`±` ogsaa — ville have fjernet Y10 som letteste uden grund.
2. **Fotokrav i samme filter** — valgt: `laesBillede(robot) !== null` som ekstra
   betingelse, sammen med punkt 1, i selve udvaelgelsen (ikke et CSS-plaster).
3. **`{n}`-pladsholder + tankestreg** i `yderpunkter_forklaring` (begge sprogfiler) —
   valgt, samme moenster som `forside_udvalg_etiket`. Fravalgt: at omskrive resten af
   sprogfilens hyphen-brug — uden for briefets omfang.
4. **Tests som ren funktionskald + syntetisk fixture + bygget HTML** — valgt, fordi
   punkt 3's fotoregel ikke kan bevises paa DAGENS 77 datafiler alene (se nedenfor).

## Konfidens

| Punkt | Niveau | Kommando | Kontrafaktisk |
|---|---|---|---|
| 1 (operator) | **Høj** | `node tests/koer.mjs` -> K5a | Med gammel side.mjs (git-commit foer denne): K5a FEJLER paa netop Qiuqiu SP1 og MOVENEW T1 |
| 3 (foto) | **Høj** | samme, K5c | Med fotobetingelsen fjernet: K5c FEJLER ("valgte uden-foto-letst") |
| 2 (tekst+tal) | **Høj** | samme, K6b | Med da.json's `{n}` tilbage til "Fire": K6b FEJLER ("gitteret viser 4 kort") |
| build uaendret | **Høj** | `node tools/build.mjs --ud=dist-y` | Ville have vist andet sidetal/talantal, hvis noget andet var roert |

Alle fire niveauer er høje, fordi alle fire blev bevidst rullet tilbage og genkoert —
ikke kun laest.

## Usikkerheder

- `±`/`~`-undtagelsen er en fortolkning, ikke en given regel — begge svar (tillad/
  udeluk) kan forsvares, se koden for min begrundelse.
- Fotoreglen (punkt 3) aendrer **0** yderpunkter paa dagens katalog — den staar som
  vaern, ikke som en observeret rettelse. Uden K5c's syntetiske fixture ville dette
  ikke vaere bevist, kun paastaaet.

## Målingerne

- Grundmåling (foer, taget med `git stash`): validate 77/0/1, tests 232/2, build 213
  sider / 1110 tal med kilde / 75 billeder brugt af 75.
- Efter: validate 77/0/1 (uaendret), tests **239/2** (7 flere, samme 2 kendte røde),
  build 213 sider / 1110 tal med kilde (uaendret).
- Operatorreglen skiftede **2 af 4** yderpunkter (tungeste: Qiuqiu SP1 -> S1-W,
  laengste driftstid: MOVENEW T1 -> MOVENEW P1). Fotoreglen skiftede **0** ud over det.
- Yderpunkternes operatorer efter rettelsen: letteste "±", tungeste/hurtigste/laengste
  driftstid null (eksakt) — alle fire staar paa den tilladte liste.

## Nye fælder og opdagelser

- **Statement outside my instructions I fixed anyway:** `tools/skabelon/forside.mjs`s
  kommentar sagde stadig "UAENDRET beregning fra foer spor/lysbyg" ved yderpunkt-
  afsnittet — sandt indtil denne rettelse, misvisende derefter. Tilfoejet en linje,
  der peger paa denne rettelse (separat commit, ren dokumentation).
- **Bash-heredoc-fælden ramte mig direkte:** et forsoeg paa at skrive et Node-testscript
  via bash-heredoc strøg alle `\\` i regex'er (`.replace(/\\/g, '/')` blev til
  `/\/g`), akkurat den fælde CLAUDE.md advarer om for `node -e`. Rettet ved at bruge
  Write-vaerktoejet i stedet, som CLAUDE.md forudsagde.
- **Grundmålingen kom for sent:** jeg skrev kode i side.mjs/i18n/forside.mjs FØR jeg
  koerte punkt 0's baseline-kommandoer. Rettet ved `git stash` af mine egne
  ændringer, koerte den ægte baseline (matchede orkestratorens tal praecist), og
  `stash pop` for at faa arbejdet tilbage. Ren proces-selverkendelse, ingen data tabt.

## Punkter i briefet, jeg ikke nåede

(ingen)
