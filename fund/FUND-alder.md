# FUND-alder.md — kvartalstjek af datakildernes alder (tools/alder.mjs)

Spor `spor/alder`, worktree `udstilling-wt-alder`. Opgave: byg et rapportværktøj,
der uden at læse 77 filer i hånden kan svare på "hvilke robotposter er ældst?" —
og som selv efterprøver sit eneste tal.

## Skill-vurdering

**Ingen skill passer på selve opgaven.** Opgavebrevet pegede eksplicit på tre
filer at læse (`robotdata/SKILL.md`, `tools/skema.mjs`, `tools/yaml.mjs`,
`DATAFLOW.md`), og de blev læst — men opgaven er at skrive et nyt, selvstændigt
rapportværktøj, ikke at tilføje eller ændre en robotpost. `robotdata`-skillen
handler om at *udfylde* en post; her læses posterne kun. `parallelt` er
irrelevant — jeg er allerede den ene agent i sit eget spor, og opgaven deler
sig ikke i uafhængige stykker (PUNKT 1 og PUNKT 2 er sekventielle med vilje,
jf. opgavebrevets ARBEJDSFORM-afsnit). `grillmig` griller briefs og åbne
beslutninger, før de sendes eller låses — jeg er modtageren af briefet, ikke
afsenderen. `code-review`/`simplify` er relevante for orkestratoren senere,
ikke for byggearbejdet selv. Konklusion: ingen af de listede skills dækker
"skriv et nyt værktøj efter et allerede detaljeret brief" — det er almindeligt
implementeringsarbejde, og jeg gik det igennem med Read/Grep/Bash i stedet.

## DATAFLOW.md's "rytme"-afsnit

Grep efter "rytme" i `DATAFLOW.md` gav **ingen træffere** — filen har intet
afsnit med det ord i overskriften eller brødteksten. Jeg læste filens
indholdsfortegnelse i stedet og fandt intet afsnit, der handlede specifikt om
en tilbagevendende arbejdsrytme (kvartalstjek, gentagne kørsler o.l.); filens
fokus er selve dataflowet fra producentside til bygget side, ikke
vedligeholdelsescyklussen. Jeg gik videre uden det afsnit — det ændrede ikke
noget ved implementeringen, da opgavebrevets egen beskrivelse af formålet
(kvartalstjekket skal være en konkret liste) var tilstrækkelig kontekst.

## PUNKT 1 — tools/alder.mjs

Ny, afhængighedsfri fil. Genbruger `parseYaml` fra `tools/yaml.mjs` — ingen ny
parser skrevet. Bruger IKKE `skema.mjs`/`normaliserRobot`, fordi "hentet" er en
rå streng, normaliseringen aldrig rører (den normaliserer kun enheder,
ja/nej-værdier og `billede.plade`) — importet ville have været en kobling uden
funktion.

Tre rene funktioner eksporteret til test: `robotAlder`, `medianDato`,
`dageSiden`, `tilEfterproevning`, `datoerIRobot`, `tilTid`, `tilDato`.

### (a) Kildetal efterprøvet uafhængigt

```
$ grep -o "hentet:" data/robots/*.yaml | wc -l
1355
```

```
$ node tools/alder.mjs | tail -3
77 robotter · 1355 daterede kilder i alt · aeldste i kataloget: 2026-08-19 (anybotics-anymal) · nyeste: 2026-08-25

TIL EFTERPROEVNING (aeldre end 90 dage):
Ingen — alle robotter er efterset inden for 90 dage.
```

**1355 = 1355.** Ingen forskel at forklare — men jeg undersøgte alligevel,
hvorfor tallet ikke er 1.110 (baggrundens "1.110 kildebelagte tal"): en
opdeling af de 1355 forekomster efter indrykningsdybde viser 130 på topniveau
(`anvendelse.hentet` + `billede.hentet`) og 1225 inde i `felter.*.hentet`.
"1.110 kildebelagte tal" i opgavebrevets baggrund er tydeligvis et ANDET,
snævrere mål — formentlig kun `art: 'tal'`-felter, ikke tekst-, ja/nej- og
liste-felter, som også bærer `kilde` + `hentet`, men ikke er "tal". Scriptet
her tæller **alle** daterede kilder, uanset felttype, fordi opgavebrevet
selv definerer opgaven sådan ("samler hver eneste hentet:-dato — både i
feltposter, i anvendelse og i billede"). Jeg har ikke ændret scriptets
afgrænsning for at ramme 1.110 — det ville have været forkert i forhold til
den eksplicitte instruks, og den eneste efterprøvning, opgavebrevet kræver
(mod `grep -c hentet:`), stemmer eksakt.

Jeg bekræftede desuden, at ingen af de 1355 forekomster er skjult i en
kommentar eller en citeret note-tekst (alle matcher `^hentet: \d{4}-\d{2}-\d{2}$`
efter indrykningen er fjernet) — så grep-tallet er et rent talfelt-tal, ikke
en tilfældighed.

### (b) --graense=1 og --graense=36500

```
$ node tools/alder.mjs --graense=36500 | tail -3
77 robotter · 1355 daterede kilder i alt · aeldste i kataloget: 2026-08-19 (anybotics-anymal) · nyeste: 2026-08-25

TIL EFTERPROEVNING (aeldre end 36500 dage):
Ingen — alle robotter er efterset inden for 36500 dage.
```
Som forventet i opgavebrevet.

```
$ node tools/alder.mjs --graense=1 | sed -n '/TIL EFTERPROEVNING/,$p'
TIL EFTERPROEVNING (aeldre end 1 dage):
anybotics-anymal  nyeste 2026-08-19  (6 dage siden)
... [33 robotter i alt] ...
xiaomi-cyberdog-1  nyeste 2026-08-21  (4 dage siden)
```

**Ærlig afvigelse fra opgavebrevets forventning.** Brevet forudsagde "stort
set alle 77" ved `--graense=1`. Det faktiske tal er **33 af 77** — under
halvdelen. Jeg har ikke rettet scriptet til at matche forventningen; jeg har i
stedet efterprøvet, at logikken selv er korrekt (se PUNKT 2's
grænsetest: N dage gammel er IKKE til efterprøvning ved `--graense=N`, kun ved
`--graense=<N-1>` eller lavere — streng ulighed, som opgavebrevet ikke
specificerede eksplicit, men som er den eneste læsning, der giver mening af
"ældre end"). Årsagen til afvigelsen: kataloget er i dag (2026-08-25) fuldt af
robotter, der er rørt inden for de sidste 1-2 dage — git-loggen viser aktivt
arbejde 24.-25. aug (billedport-gennemgang, nye robotposter som
`genisom-*`, `galileo-*`, `yuejia-*` m.fl.). "I dag" er en levende værdi
(`new Date()`), så dette tal vil ændre sig, hver gang scriptet køres på en ny
dato — det er ikke en fastfrosset test, og derfor er "33 i dag" hverken rigtigt
eller forkert i sig selv, kun en øjebliksmåling. Jeg skriver den frem i stedet
for at lade den stå uimodsagt, fordi opgavebrevets egen forventning ellers ville
se ud til at være bekræftet, når den faktisk blev modbevist af de rigtige data.

### (c) --top=5

```
$ node tools/alder.mjs --top=5
Datakildernes alder pr. robot, aeldste foerst — i dag: 2026-08-25

anybotics-anymal  aeldste 2026-08-19  nyeste 2026-08-19  median 2026-08-19  (13 daterede kilder)
anybotics-anymal-x  aeldste 2026-08-19  nyeste 2026-08-19  median 2026-08-19  (7 daterede kilder)
boston-dynamics-spot  aeldste 2026-08-19  nyeste 2026-08-19  median 2026-08-19  (24 daterede kilder)
deep-robotics-lite3  aeldste 2026-08-19  nyeste 2026-08-24  median 2026-08-19  (13 daterede kilder)
deep-robotics-lynx-m20  aeldste 2026-08-19  nyeste 2026-08-19  median 2026-08-19  (25 daterede kilder)
```
Præcis 5 linjer i liste 1, som krævet.

### Den fjerde tilstand — INGEN DATEREDE KILDER

Ingen af de 77 nuværende robotter rammer denne gren (alle har mindst én dateret
kilde) — så den kunne ikke afprøves på de rigtige data. Grenen er i stedet
dækket direkte i PUNKT 2's enhedstest (`robotAlder([])` og
`robotAlder(undefined)` giver begge `null`, og `datoerIRobot` på en robot uden
noget dateret giver en tom liste), samt i visningskoden i `main()`, som skriver
`INGEN DATEREDE KILDER` for enhver robot med `alder === null` og placerer den
øverst i slug-orden, adskilt fra `TIL EFTERPROEVNING`-sektionen (som kun kan
måle fra en `nyeste`-dato, den robot ikke har).

## PUNKT 2 — tests/koer.mjs, afsnit 9

11 nye tests af de rene funktioner, med konstruerede datoer og kendte facit:

- `robotAlder`: 5 usorterede datoer → korrekt ældste/nyeste/median/antal; tom
  liste/undefined → `null`.
- `medianDato`: lige antal med et eksakt midtpunkt (ingen brøkdag) OG lige
  antal med et midtpunkt på en halv dag (runder op) — begge grene af
  afrundingsvalget er bevist, ikke kun den, der aldrig rammer en halv dag.
- `dageSiden`: kendt afstand (24 dage).
- `tilEfterproevning`: grænsens strenge ulighed testet ved N-1/N/N+1 dage, plus
  at `alder === null` altid giver `false`.
- `datoerIRobot`: en konstrueret robot med 4 gyldige datoer og 2 felter uden
  gyldig `hentet` (en bar tilstandsstreng og en tilstandspost uden `hentet`) —
  beviser at de to bevidst IKKE tælles med.

```
$ node tests/koer.mjs | tail -5
Validator: 71 oedelagte tilfaelde (65 i én fil + 6 paa tvaers af filer), fangede 71.
I alt: 212 bestaaet, 2 fejlet.
Fejlede: interval 18-25 kg kollapser ikke til sit midtpunkt (uafklaret - se fund/FUND-test.md) · to filer med samme kategorier i modsat raekkefoelge giver samme indeks (L27) — uafklaret, robots.json bygges af build.mjs (forbudt fil), se fund/FUND-detalje.md
```

201 → 212 bestået (11 nye, alle bestået), 2 fejlet **uændret** — de to
forudeksisterende, uafklarede fund er urørt. Kravet var "mindst 202 bestået,
2 fejlet"; opnået 212.

## Selv-tjek

Efterprøvet 3 ting uafhængigt af scriptets egen kørsel:
1. Kildetallet 1355 mod `grep -o "hentet:" | wc -l` — **stemmer eksakt**.
2. At alle 1355 forekomster er reelle `YYYY-MM-DD`-datoer uden vedhæftet tekst
   (`grep -hoE "hentet: .*" | sort -u` mod regex) — **0 afvigende linjer**.
3. Indrykningsfordelingen 130/1225 (topniveau mod felter) — forklarer hvorfor
   scriptets tal ikke er 1.110 uden at det er en fejl.

**Efterprøvet 3 uafhængige kontroller, fandt 0 fejl i scriptet.** Den ene
"uoverensstemmelse" der blev fundet (33 vs. "stort set alle 77" ved
`--graense=1`) er ikke en fejl i scriptet — den er en forkert forudsætning i
opgavebrevet, som datoen 2026-08-25's faktiske data modbeviser, og den er
skrevet frem ovenfor i stedet for tiet ihjel.

## Selv-review

- **Usikker på afrundingsvalget i `medianDato`** ved et lige antal datoer med
  en halv dags mellemrum: jeg valgte "rund op" (`Math.round`, som i JavaScript
  runder .5 opad). Det er en vilkårlig, men dokumenteret og testet
  beslutning — der findes ingen producent-facitliste for, hvad en "median
  hentedato" betyder ved en brøkdag, så et andet valg (rund ned, eller vis et
  interval) ville også have været forsvarligt. Hvis det bruges til andet end
  et hurtigt overblik, bør det revurderes.
- **`--top=<n>` afskærer den kombinerede liste** (robotter uden datering +
  robotter med datering, i den rækkefølge). Er `n` mindre end antallet af
  "INGEN DATEREDE KILDER"-robotter, ville toppen udelukkende bestå af umålte
  robotter og ingen aldersrangerede — det sker ikke i dag (0 sådanne
  robotter), men er værd at kende, hvis kataloget ændrer sig.
  Jeg overvejede at holde de to grupper adskilt under `--top`, men opgavebrevet
  specificerer kun "begræns liste 1 til de n ældste" — én kombineret liste er
  den enkleste læsning, og de umålte hører reelt hjemme øverst uanset `--top`.
- **`TIL EFTERPROEVNING`-tallet ved `--graense=1` (33/77)** afviger fra
  opgavebrevets forventning, som forklaret ovenfor. Jeg er sikker på, at
  scriptets EGEN logik er korrekt (bevist med grænsetests), men usikker på,
  om orkestratoren forventede et andet "i dag" eller en anden datofordeling,
  da forventningen blev skrevet.
- Ingen af de 77 robotter rammer "INGEN DATEREDE KILDER"-grenen på ægte data —
  den gren er kun bevist via konstruerede test-data, ikke set i praksis.

## Ikke rørt

`tools/build.mjs`, `tools/validate.mjs`, `tools/skema.mjs`, `tools/yaml.mjs`,
`db/`, `CLAUDE.md`, `STATUS.md`, `DATAFLOW.md`, `data/robots/*` (kun læst),
`media/`, `assets/` — som krævet. Eneste ændrede/nye filer: `tools/alder.mjs`
(ny) og `tests/koer.mjs` (afsnit 9 tilføjet).

Flettet ikke selv, som instrueret.
