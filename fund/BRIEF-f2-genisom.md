# BRIEF — spor/f2-genisom: 9 GENISOM-robotter, kinesisk kilde, ordlyd findes men er gloset

**Læs `fund/BRIEF-FAELLES.md` FØRST.** Den bærer L87, kolonnelisten,
efterprøvningen, miljøfælderne og rapportformen. Denne fil siger kun, hvad der
er dit.

Arbejdsmappe: `C:\Praktik\websites\udstilling-wt-f2genisom` (gren
`spor/f2-genisom`).

## Din primære opskrift

**`fund/OPSKRIFT-fase2-cjk.md`** (kinesisk kilde). **140 af dine 151 advarsler
har allerede et ordlydsfelt, og 126 af dem bærer en dansk glose inde i den
ordrette streng.** Det er CJK-opskriftens kasse A i ren form.

Læs også den engelske opskrift: dine **11** advarsler uden ordlyd er dens
kasse A, og de kræver udtrækning i stedet for rensning.

## Dine robotter — og INGEN andre

```
2205=genisom-gangben-l1          2206=genisom-gangben-l1-w
2207=genisom-gangben-l2          2208=genisom-gangben-l2-w
2209=genisom-gangben-l2-w-ultra  2210=genisom-qiuqiu-sp1
2211=genisom-tongchui-m1         2212=genisom-tongchui-m1-pro
2213=genisom-tongchui-m1-ultra
```

Ethvert skriv mod et andet `robot_id` er en fejl i dit spor og bliver målt i
`change_log`.

## Grundmåling — DINE FØRSTE KOMMANDOER

```
"/c/Program Files/nodejs/node.exe" tools/validate.mjs
git log --oneline -1
```

Orkestratorens tal umiddelbart før afsendelse: validate **77 filer / 0 fejl /
1 advarsel**, HEAD `05cf625`. **Afviger dine, så STOP og rapportér det.**

Kopiér derefter `fund/maal-f2.mjs` til `fund/maal-f2-genisom.mjs`.

**RET FØRST ÉN TING I KOPIEN:** originalen kalder `process.exit(1)` efter et
`fetch` (linje 11) — exit-127-fælden fra fællesbriefet. Skift til
`process.exitCode = 1`, og skriv i rapporten at du gjorde det.

Kør den på dine 9 robotter. **Den giver i dag PRÆCIS dette** — bekræft:

```
caveat                        151 | dansk:  137
  heraf uden ordlyd            11 | dansk:    -
caveat_wording                140 | dansk:  126
applications.note               9 | dansk:    9
images.note                     5 | dansk:    5
robots.notes (elementer)       13 | dansk:   13
robots.notes_wording (el.)     12 | dansk:    9
```

**Får du andre tal, så STOP og rapportér.**

## `value_text` på dine robotter

Målt: **14 danske værdier**. Tallet er en **forudsigelse** — find dem selv og
skriv det faktiske.

## Særligt for dit spor

**Dine råkilder ligger i `media/_kilder/raa-genisom-2026-08-24/`, og den mappe
har INTET `MANIFEST.tsv`.** Den er en af fem uden. **Uden proveniens er et citat
ikke belagt — og L87 kræver netop belæg**, så det er ikke en formalitet for dit
spor, det er en forudsætning.

Byg et MANIFEST for de filer, du faktisk citerer. Hovedet står i en eksisterende:
`media/_kilder/raa-kand2-2026-08-24/MANIFEST.tsv` har de otte kolonner. Beregn
`sha256` og `bytes` på filen selv.

**`hentet_utc` bliver filens mtime, og det er en ØVRE GRÆNSE, ikke en måling.**
58 filer i en anden mappe har mtime inden for **0,475 sekund** af hinanden —
fysisk umuligt for 58 hentninger. **Skriv det forbehold i filens første linje
som en kommentar**, så ingen senere læser det som et hentetidspunkt.

**"Gangben" er robottens faktiske navn**, ikke et overset dansk ord. Lad det stå.

**GENISOM har 9 robotter, hvoraf flere er varianter af hinanden** (`-w`,
`-ultra`, `-pro`). Forvent at samme kildecitat gælder flere robotter — men
**skriv det ind på hver række for sig**, og efterprøv at citatet faktisk står i
kilden for **den** variant. To varianter kan have hver sit tal under samme
etiket.

## Filejerskab

Du ejer: `fund/maal-f2-genisom.mjs` · `db/f2-genisom-skriv.mjs` ·
`fund/FUND-f2genisom.md` · `fund/BRIEF-f2-genisom.md` ·
`media/_kilder/raa-genisom-2026-08-24/MANIFEST.tsv` (**ny fil** — mappens
øvrige indhold rører du ikke) · og `media/_kilder/raa-f2-genisom-<dato>/`, hvis
du henter nyt.

Du rører **ikke** filer, der tilhører `f2-vest`, `f2-galileo` eller
`f2-unitree`, og ikke `db/fase2-tjek.mjs`, `db/f2-skriv.mjs`, `db/tjek.mjs`,
`db/ordbog.mjs`, `tools/`, `assets/`, `data/`, `tests/` eller de to opskrifter.

## Færdig når

- Dansk-tallet er **0** i hver kolonne, du har rørt — undtagen rækker på
  L87-listen, som står urørte. Skriv hvor mange.
- Talkolonne-diffen er **tom**.
- `change_log` har dine skrivninger og **0 uden for dine egne robotter**.
- `media/_kilder/raa-genisom-2026-08-24/MANIFEST.tsv` findes, har hoved plus én
  række pr. citeret fil, og `sha256` for én stikprøve kan genberegnes og passer.
- Du har læst alle dine tekster igennem selv og skrevet *"N læst, M fejl"*.
