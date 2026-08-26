# tests/ — sådan tilføjes en ny del

`koer.mjs` er kun en løber: den nulstiller `.tmp-koersel/`, bygger en fælles
`ctx` og importerer hver fil i `tests/dele/`, i den rækkefølge filnavnene
sorterer i. Den OPDAGER dele selv (læser `tests/dele/`, filtrerer på
mønsteret `^\d\d-.*\.mjs$`) — der er ingen liste at redigere noget sted, så to
samtidige spor, der hver tilføjer én fil, kan aldrig konfliktere. Selve
testreglerne bor i `tests/dele/*.mjs`, én fil pr. emne — **ikke** pr. spor, så
en fremtidig læser kan lede efter "billedtests", ikke efter et sporsnavn.
`_faelles.mjs` bærer kun infrastruktur (rod/node, skema/yaml/alder-modulerne,
og de fire hjælpefunktioner mere end én del bruger).

## Kontrakten for en ny del

**Et tocifret præfiks efterfulgt af `-` er PÅKRÆVET** (`15-mit-emne.mjs`, ikke
`mit-emne.mjs`) — uden det bliver filen ikke opdaget, og dens tests koerer
aldrig. Praefikset bærer også læseordenen, så vælg det næste ledige tal.

En del-fil `export default`-er `async function koer(ctx)`. `ctx` giver:
`rod, tmp, node, ok, skema, yaml, alder, lasRobotter, taelFilerRekursivt,
operatorRegex, koerValidator`. Brug `ctx.ok(navn, betingelse, detalje)` til
hver påstand — det er den samme tæller for hele kørslen. Importér selv
`node:fs`/`node:path`/`node:child_process`, hvis du har brug for dem.

**Byg dit eget data/dist i din egen undermappe af `tmp`** (fx
`path.join(tmp, 'dist-mit-emne')`) — ingen del må antage, at en anden del har
bygget noget først. Kun `dele/01-validator-regler.mjs` er særlig: den
returnerer `{validator: {ietFilAntal, paaTVaersAntal, fangede}}`, som
`koer.mjs` bruger til den afsluttende sammendragslinje.

**Så er du færdig.** Læg filen i `tests/dele/` med sit tocifrede præfiks —
og INTET andet. Der er ingen liste, kommentar eller anden fil at røre.

## Sådan flyttes `tests/nyt-instrument.mjs`/`tests/nyt-hastighed.mjs` ind

De to filer er selvstændige i dag. Ombryd deres krop i
`export default async function koer(ctx) { const {ok, rod, tmp, node, ...} =
ctx; ... }`, fjern deres egen `ok()`/tæller/`process.exit`, og læg filen i
`tests/dele/` med det næste ledige tocifrede præfiks.
