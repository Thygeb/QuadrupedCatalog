# FUND — fotofod, runde 3: tre formler vendt

**Skill:** `spor` kaldt via Skill-værktøjet — lykkedes direkte (base
directory pegede på hovedrepoets sti, men indholdet er byte-identisk med
worktreens egen kopi, kun linjeskift adskiller dem, bekræftet med `diff`).
Intet fallback. `design` fravalgt per briefets udtrykkelige instruks.

## Tabel: de tre formler, før og nu

| Formel | Krævede før | Krævede nu | Revert der fælder den |
|---|---|---|---|
| `29:95` (`<tr>`) | `1+grupper+felter` (40) | + `1 fodraekke`, **betinget** af mindst én valgt robot med `foto.ophav==='fabrikant'` (41) | `fotoFodHTML()` tvunget til `''` → tr faldt til 40, ventet forblev 41 (rød) |
| `29:101` (`<td>`) | `1+n×m` (100) | + `(1 hjørne+n celler)`, betinget (104) | Samme mutation → 100 vs 41. Ekstra `<td>` indsat → td 105, ventet 104 (rød) |
| `38:165` (`<td>`) | `hjoerner===1 && 1+n×m` | `hjoerner===1` **UÆNDRET** && `1+n×m+fodceller`, betinget | Ej krævet — kun diff-visning |

Betingelsen er **udledt af data** (`data.standard`→`data.robotter`, samme
opslag som `sammenligning.js`s `robotAf()` og som `38.mjs:170` allerede
brugte) — ikke ved at tælle `<tfoot>` i selve output, som ville måle sig
selv. Ingen af de tre beviser mindre end før; alle bevarer deres gamle led
og lægger kun et betinget led til. `38:165`s `hjoerner`-halvdel er tegn for
tegn urørt (diff i commit `e720b34`).

## Målinger

```
Grundmåling (FØR):  git merge main → clean (main var 5903ea8)
                     validate  77 fil(er) · 0 fejl · 1 advarsel   (som forudsagt)
                     build     216 sider · 1111/0                (som forudsagt)
                     koer.mjs  1763 bestaaet, 15 fejlet
Slutmåling (EFTER):  koer.mjs  1769 bestaaet, 9 fejlet
```

**Afvigelse fra briefets 1769/15-forudsigelse:** bestået var 1763 ikke 1769
FØR rettelsen — differencen er præcis mine 6 endnu-røde assertions. Sum
(1778 tests) matcher briefet. Suiten kørt 2 gange (grundmåling+slutmåling,
inden for disk-grænsen); mellemtjek brugte isolerede kald af 29 og 38.

**Acceptkriterium 4 opfyldt:** præcis 9 fejlede, alle 9 tekster ordret fra
briefets tabel (4c, 259/562-forbehold, 3× han-tegn, `(d)`-fixture, 2× 64.3).
Ingen af de 9 rørt eller blevet grøn.

## Konfidens

1. Grundmåling — **høj**: genkørbar, tal ovenfor. Kontrafaktisk: en
   ubygget/ufusioneret worktree ville have givet andre tal end 1763/15.
2. 29-tabelsemantik.mjs — **høj**: isoleret 36 ok/0 fejl, begge
   mutationsretninger revert-bevist, `git status --porcelain` tom bagefter.
3. 38-typeskilt-sammenligning.mjs — **høj**: isoleret 58 ok/0 fejl, diff
   viser `hjoerner`-leddet uændret.
4. Slutmåling — **høj**: 9/9 fejltekster matcher briefets liste ordret.

## Usikkerheder

Skill-kaldets base directory pegede uforklaret på hovedrepoets sti (samme
uforklarede svingning CLAUDE.md nævner for andre spor) — kun bekræftet
indholdsidentisk, ikke hvorfor. Ingen tredje fuld suitekørsel er lavet for
at udelukke sideeffekt af at fjerne den ubrugte `maal`-import i 29 — men
intet andet importerer `maal` derfra, så risikoen vurderes fraværende.

## Nye fælder og opdagelser

`data.standard` er slug-STRENGE, ikke robotobjekter. Mit første forsøg
antog `.foto` kunne læses direkte af `data.standard[i]`, hvilket gav
`harFabrikantfoto=false` for begge sprog (4 nye, forkerte fejl). Rettelsen:
slå slugs op i `data.robotter`, præcis som `robotAf()` og som
`38.mjs:170` allerede gjorde. Et spor, der ikke havde læst 38's kode først,
ville sandsynligvis ramme samme fælde.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle fire punkter (0-4) er gennemført og efterprøvet.
