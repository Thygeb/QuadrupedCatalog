# FUND — fotofod: efterprøvning af test 79 (aldrig kørt før)

**Skill:** `spor` kaldt fra worktreen — lykkedes. `design` fravalgt: opgaven
er kun at BEVISE eksisterende, committet kode, ikke ændre design.

**Grundmåling:** `validate.mjs` → 77 fil(er) · 0 fejl · 1 advarsel (upåvirket).
`build.mjs` → 216 sider. `tests/koer.mjs` → **1755 bestået, 6 fejlet**
(1761 i alt). Overskriften "79. Fotokreditten staar pr. kolonne i en <tfoot>" står i output.

## Acceptkriterium 1: kører 79 med, og stemmer summen?

**Ja.** 1761 = 1749 (orkestratorens tal for main) + 12 (79's egne
assertions, alle 12 grønne i den fulde kørsel).

## Acceptkriterium 2: revert-bevis pr. assertion i 79

Kørt via en standalone-runner (kun 79, ikke hele suiten), mutation direkte i
`assets/sammenligning.js` (ejet fil), efterfulgt af `git checkout` og
`git status --porcelain` (tom hver gang → intet brudt repo efterladt).

| # | Krav | Revert der fælder den | Udfald |
|---|---|---|---|
| 79.1 | celler.length===4 | Ekstra 5. `<td>` i `fotoFodHTML()` | FEJL (5), 79.9 med |
| 79.2 | hjørnecelle tom | Hjørnetekst sat til "X" | FEJL, isoleret |
| 79.3 | egen celle, rigtigt navn | Tekst tvunget til `robotter[0].producent` | FEJL, 79.10 med |
| 79.4 | ingen foto → tom celle | Tom-gren → "OPFUNDET-KREDIT" | FEJL, 79.11 med |
| 79.5 | ingen fabrikantfoto → intet tfoot | `harFabrikantfoto`-guard neutraliseret | FEJL, isoleret |
| 79.6 | gammelt format matcher ikke regex | Selvstændig — se note nedenfor | ikke muteret |
| 79.7 | Del B's build giver exit 0 | Forsøgt, intet rent revert i scope | **Ubevist** |
| 79.8 | 3 `<th scope=col>`, rigtig orden | `specimenHoved`: droppede 1 kolonne | FEJL (2), isoleret |
| 79.9 | byg giver 4 saml-fotofod-celler | Samme mutation som 79.1 | FEJL (5) |
| 79.10 | rigtige navne+datoer pr. kolonne | "FEJL-"-præfiks på teksten | FEJL, 79.3 med |
| 79.11 | build: robot uden foto → tom | Samme mutation som 79.4 | FEJL |
| 79.12 | indledning UDEN FOR `<table>` | Flyttet til FØR `</table>` | FEJL, isoleret |

**79.6:** hardkodet gammelt eksempel, ikke et kilde-revert. **79.7:** intet
rent revert i scope — se "Nye fælder".

## Acceptkriterium 3: ser fladen rigtig ud på den KØRENDE side?

Server 8205 (verificeret mod disk: `saml-noegle` 5=5), Playwright mod
`http://localhost:8205/da/sammenligning/`. DOM-tælling (ikke `dist/`-grep,
matricen er klientside):

- `.saml-fotofod__celle` = **3**, `.saml-fotofod__hjoerne` = **1**.
- De 3 standardvalgte robotter (MOVENEW P1, Gangben L2, S1) har **alle**
  fabrikantfoto → 3 = antal valgte med fabrikantfoto. Matcher kriteriet.
- Fodtekster hver i egen `<td>`: "MicroRoboTech (Hentet 2026-08-24)",
  "GENISOM AI (Hentet 2026-08-24)", "Galileo (Tianjin) (Hentet 2026-08-26)".
- `<p class="saml-fotoophav">` står som egen linje UNDER tabellen.
- Skærmbillede taget (1440px, set med egne øjne): tre kolonneopdelte
  krediteringer + fælles sætning under, øvrige datatilstande uændrede.
  Server lukket efter måling, port bekræftet fri.

## Konfidens

- **Høj** — kriterium 1 (kontrafaktisk: manglede 79, ville totalen falde til ≤1749) og
  kriterium 3 (DOM-tælling + skærmbillede på kørende side).
- **Høj** for 11/12 revert-bevis i kriterium 2, kontrafaktisk i tabellen — **Lav** for 79.7.

## Nye fælder og opdagelser

**Test 79's 12 assertions er alle grønne — men 6 ANDRE tests (29 og 38.10,
ikke ejet af fotofod) blev røde af fotofods allerede-committede kode.**
`assets/sammenligning.js:632-633` placerer `fotoFodHTML()`'s `<tfoot>` **INDE
i** `<table>` (bevidst, JPK ordret 3. sep: "et foto hoerer til PRAECIS én
robot ... <tfoot> er elementet HTML har til indhold"). Tests 29/38 (ejet af
andre spor) tæller `<tr>`/`<td>` med hårdkodede formler der ikke kender
tfoot-rækken: målt `tr=41` mod ventet 40 (+1), `td=104` mod ventet 100 (+4,
tfoot's hjørne+3 celler). **Ikke en fejl i fotofods kode** — det er 29/38's
formler, uopdaterede til den nye, JPK-godkendte struktur. Rørt ikke (uden for
filejerskab); meldes videre til orkestratoren som ukendt konsekvens af
allerede-flettet main-kode.

**79.7's revert:** `build.mjs:59` kører `fs.rmSync(mappe,{recursive:true,
force:true})` før `mkdirSync` på `--ud`-målet, så et forudplaceret
spærre-filnavn på dist-stien selv-helbredes — bygget lykkedes alligevel. Et
ægte build-fejl-scenarie kræver `tools/` eller `data/`, begge uden for
filejerskabet. 79.7 er strukturelt identisk med 29's/38's egne uafprøvede
"byg giver exit 0"-linjer (ingen andre steder i kodebasen har et revert for
den slags) — skrevet frem her frem for gjort tavst grøn.

## Punkter i briefet, jeg ikke nåede

- 79.7 har intet isoleret revert-bevis (forsøgt, ikke opgivet uden forsøg).
- Rettede ikke 29/38's formler — uden for filejerskab
  (`tests/dele/29-tabelsemantik.mjs`, `tests/dele/38-typeskilt-sammenligning.mjs`).
  Meldes videre, rettes ikke her.
