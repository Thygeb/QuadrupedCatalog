# FUND — spor/certfacet (BRIEF-certfacet-2.md)

**Skill:** `spor` kaldt, lykkedes direkte fra worktreen. `design` fravalgt —
punkt 1-3 er testkode/datarens, ingen rører en flade.

**Grundmåling:** validate 77/0/1 · build 216 sider · `koer.mjs` 1738/6, de 6
= `35.12.{da,en}.{ja,nej,uoplyst}` — matcher briefet præcist. Ingen STOP.

## Punkt 1 — de seks vendte assertions: før / nu

| Assertion | Før | Nu |
|---|---|---|
| `.ja` | CE "ja" var facettens grundform (`id="f-ce-ja"`) | `.gruppe`: gruppen bærer alle fire mærker CE/FCC/UL/CCC (+ eget revert: fjern UL → rødt) |
| `.nej` | CE "nej" bar `rk--nej`+`#i-nej` i **facetten** | `.tilstande`: de fire felter ("CE/FCC/UL/CCC oplyst") viser stadig ja/nej/ikke-oplyst — målt på **robotsiden** |
| `.uoplyst` | CE "ikke oplyst" bar `rk--uoplyst` i **facetten** | dækket af `.tilstande` (samme assertion beviser alle tre på én gang) |
| `.revert` | kollaps af "nej" i facetten → rødt | kollaps af "nej" i robotsidens felter → rødt |

6 `ok()`-kald (uændret antal), `grep -c "35.12"` = 6 (krav ≥6). Egen fejl
fanget under efterprøvning: `.gruppe` ramte først CSS-selektoren i det
genererede `<style>` i stedet for `<details>`-taggen — rettet.
**Konfidens høj:** isoleret kørsel 78/0. Kontrafaktisk: en forkert vending
ville enten stadig pege på den gamle facet, eller mangle et ægte
revert-bevis — jeg fangede selv (a)-varianten live.

## Punkt 2 — ny `tests/dele/77-certfacet.mjs`

Egen fixture (3 robotter), egen `dist` i `ctx.tmp`. Beviser: præcis 4 valg,
hvert mærke filtrerer på OPLYST (CSS + optalt antal mod fixturens kendte
1/0/0/0), JPK's værn 1 (UL/CCC vises ved 0) + revert. **14/0** isoleret.
Konfidens høj (genkørbar, egen fixture, revert verificeret).

## Punkt 3 — 61 døde i18n-nøgler fjernet, ny `tests/dele/78-doed-i18n.mjs`

**Briefets hypotese var forkert, målt:** CE-nøglerne er alle stadig i brug,
dynamisk (`t('filter_' + v)`, `v` ∈ `CERT_MAERKER`). Naivt grep gav 166
nøgler med 0 forekomster; 115 var netop dynamisk konstruerede kald.

**Den rigtige afvigelse:** 61 genuint døde nøgler, uafhængige af CE — mest
rester af `tools/skabelon/forside.mjs` (slettet i `e429962`, JPK: *"HELE
oversigt-siden skal væk"*) og `spor/prisnote`s ECB-noteflytning
(`filter_pris_note`, `pris_kurs_enkel`). Fuld liste i commit `78aaade`.

**Metodefejl fanget FØR sletning:** en første, kun-præfiks-baseret
klassifikator ville have bevaret `filter_titel`/`vaegtklasse_titel`/
`stribe_ip_klasse`/`tilstand_nul` som "sikre" — men deres suffiks ligger
uden for det, kaldet faktisk kan konstruere (`filter_`+v kan KUN blive
ce/fcc/ul/ccc). Rettet ved at læse de faktiske værdimængder fra
kildekoden selv, ikke antage ud fra præfikset.

**Efterprøvet:** build efter sletning = samme 216 sider/1111 kildemærker,
0 «manglende nøgle» i `dist/`. Ekstern revert-bevis: indsatte en rigtig
ubrugt nøgle i `da.json` → test 78 gav 1/3 (alle forventede røde), revertede
→ 4/0 igen. **Konfidens høj** for metoden; **middel** for at 61 er 100 %
komplet (ingen garanti mod en 12. ufundet dynamisk konstruktionsform).

## Uden for filejerskabet: `tests/dele/37-topbar.mjs`

Slutkørsel gav 1761/1 — `37.10.sprog_etiket`. Filens EGEN kommentar (fra
`spor/topbar`) forudsagde ordret dette scenarie: *"Fjernes den ved en
senere oprydning, skal denne linje fjernes SAMTIDIG."* Fulgte forudsigelsen
i egen commit (`cb01572`). Genmålt: 1761/0.

## Åbent spørgsmål: 9 eller 10 facetgrupper?

**Målt: 9**, ikke 10 (Å154's tal). `grep -o 'data-facetgruppe="[a-z]*"'` og
et separat `<details class="facet` -tjek giver begge 9. Ikke rettet — uden
for filejerskabet, skrevet her på orkestratorens ord.

## Slutmåling

`tests/koer.mjs`: **1761/0** (fra 1738/6). 4 commits: `9afe9b9`, `6c598d3`,
`78aaade`, `cb01572`. Arbejdstræ rent. Egne `.tmp-koersel-solo*` ryddet
(node fs.rmSync). Disk: 19 GB fri.

## Nye fælder og opdagelser

1. **Blanket-præfiks-klassifikation ("nøglen starter med et kendt dynamisk
   præfiks") er en grep-fælde ét lag inde** — ikke det samme som "nøglen er
   i kaldets faktiske værdidomæne". Kostede en ekstra runde, forhindrede
   sletning af mindst 4 levende nøgler.
2. **En tests kommentar kan være en fremtidig agents brief.** `37-topbar`s
   `sprog_etiket`-note var skrevet præcis til denne situation en dag før den
   opstod. Værd at gøre til vane ved fremtidige vendinger.
3. **`forside.mjs` blev slettet 1. sep, dens i18n-fodaftryk levede videre
   uopdaget** til nu — ingen skade (build fejlede aldrig), men det er
   "spøgelses-nøgler", som kun en generel dødheds-test (nu test 78) fanger.

## Punkter i briefet, jeg ikke nåede

Ingen. Punkt 1, 2 og 3 er alle udført og efterprøvet.
