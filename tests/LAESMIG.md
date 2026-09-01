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
aldrig. Praefikset bærer også læseordenen.

### Nummeret TILDELES af orkestratoren. Vælg det aldrig selv

Her stod indtil 1. sep 2026 *"vælg det næste ledige tal"*. **Den regel er
umulig at følge fra et spor, og den kostede fire kollisioner på én dag** —
to 41, to 42, to 43 og to 44.

Årsagen er strukturel, ikke sjusk: et spor arbejder i sin egen worktree,
grenet fra sin egen commit. Det kan se `tests/dele/` som mappen så ud DA
grenen blev lavet, og kan hverken se de numre, andre samtidige spor er ved
at bruge, eller dem, der er kommet på main siden. "Næste ledige" er derfor
ikke et opslag, det er et gæt — og fire spor gættede ens.

Bemærk, at afsnittet ovenfor har ret i, at to spor **ikke kan konfliktere i
git**: filnavnene er forskellige (`44-cjk-ordlyd-db.mjs` og
`44-noget-andet.mjs`), så begge flettes ind uden en lyd. Det er præcis
derfor, fejlen er farlig — den ser ikke ud som noget. Læseordenen bliver
tvetydig, og den næste, der leder efter "test 44", finder to.

**Reglen nu:**

- **Orkestratoren skriver nummeret i briefet**, sammen med hvilke numre der
  er i brug, og hvilke andre samtidige spor der har fået tildelt hvilke.
- **Sporet bruger det tildelte nummer og intet andet.** Er nummeret ikke i
  briefet, så spørg — vælg det ikke selv.
- Ved flet af flere spor: er en kollision alligevel sluppet igennem, omdøbes
  filen **og dens interne facit-ID'er** (`45.1`, `45.2` …), ikke kun
  filnavnet. Det blev glemt én gang og gav en halv omdøbning.

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

## `tests/nyt-instrument.mjs`/`tests/nyt-hastighed.mjs` — flyttet ind 26. aug 2026

Udført af spor/testfold. De to selvstændige filer er ombrudt til
`export default async function koer(ctx) { const {ok, rod, tmp, node, ...} =
ctx; ... }`, deres egen `ok()`/tæller/`process.exit` er fjernet, og de ligger
nu som `tests/dele/15-hastighedsenhed.mjs` (27 påstande, L41) og
`tests/dele/16-instrumentkort.mjs` (11 påstande, L40). De gamle filer er slettet.

Kontrakten ovenfor holdt uændret — med to ting, den ikke selv nævnte, men som
den generelle kontrakt (afsnittet "Byg dit eget data/dist...") allerede
dækkede:

- Begge filer byggede oprindeligt deres eget `dist` direkte under `tests/`
  (`tests/.tmp-hastighed-dist`, `tests/.tmp-instrument-dist`). Det skal rettes
  til en undermappe af `ctx.tmp` (`dist-hastighed`, `dist-instrument`) — ellers
  risikerer en fremtidig del at kollidere med den samme mappe.
- Instrumentkort-filen havde en lokal hjælpefunktion (`laesFil`), der
  lukkede over den gamle `udMappe`-variabel. Den måtte flyttes ind i selve
  `koer(ctx)`-funktionen, fordi `udMappe` nu afhænger af `ctx.tmp`. Den anden
  hjælpefunktion (`taelStribeLi`) rørte ikke `udMappe` og kunne blive på
  modulniveau uændret.

Navngivningen er efter emne (`hastighedsenhed`, `instrumentkort`), ikke efter
sporet der skrev dem (`hastighed`, `instrument2`) — jf. instruksen om, at en
fremtidig læser leder efter emnet.
