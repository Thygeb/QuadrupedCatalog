# BRIEF — spor/f2-unitree: 13 Unitree-robotter, kinesisk kilde OG intet udskilt

**Læs `fund/BRIEF-FAELLES.md` FØRST.** Den bærer L87, kolonnelisten,
efterprøvningen, miljøfælderne og rapportformen. Denne fil siger kun, hvad der
er dit.

Arbejdsmappe: `C:\Praktik\websites\udstilling-wt-f2unitree` (gren
`spor/f2-unitree`).

## Din primære opskrift: BEGGE

**Du er prøvekluden for den tredje metode, som ingen har kørt.** Kilden er
kinesisk, **og** ingen af dine 134 advarsler har et udskilt ordlydsfelt. Du skal
både læse kinesisk (`fund/OPSKRIFT-fase2-cjk.md`) og trække citatet ud af dansk
prosa (`fund/OPSKRIFT-fase2.md`) — i samme arbejde, på samme række.

**Din rapport afgør, om de sidste tre udrulningsspor kan sendes.** Skriv derfor
metoden ned undervejs, ikke kun resultatet.

## Dine robotter — og INGEN andre

```
2231=unitree-a1     2232=unitree-a2      2233=unitree-a2-w
2234=unitree-aliengo                     2235=unitree-as2
2236=unitree-as2-w  2237=unitree-b1      2238=unitree-b2
2239=unitree-b2-w   2240=unitree-go1     2241=unitree-go2
2242=unitree-go2-w  2243=unitree-laikago
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

Kopiér derefter `fund/maal-f2.mjs` til `fund/maal-f2-unitree.mjs`.

**RET FØRST ÉN TING I KOPIEN:** originalen kalder `process.exit(1)` efter et
`fetch` (linje 11) — exit-127-fælden fra fællesbriefet. Skift til
`process.exitCode = 1`, og skriv i rapporten at du gjorde det.

Kør den på dine 13 robotter. **Den giver i dag PRÆCIS dette** — bekræft:

```
caveat                        134 | dansk:  123
  heraf uden ordlyd           134 | dansk:    -
caveat_wording                  0 | dansk:    0
applications.note              13 | dansk:   13
images.note                     1 | dansk:    1
robots.notes (elementer)        9 | dansk:    8
robots.notes_wording (el.)      0 | dansk:    0
```

**Får du andre tal, så STOP og rapportér.**

## `value_text` på dine robotter

Målt: **1 dansk værdi** — færrest af de fire spor. Tallet er en
**forudsigelse** — find den selv.

## Særligt for dit spor: det svære er ikke det kinesiske

**Aliengo er projektets skoleeksempel på en advarsel, der ikke kan indsamles,
og den er din.** Den lyder i dag:

> *"Producenten skriver Weight (without battery) 21.5kg ±1kg. Vægten er UDEN
> batteri — alle andre Unitree-modeller oplyser med. Sat ved siden af Go2's
> 15 kg og As2's 20 kg sammenligner man en robot uden batteri med to robotter
> med."*

**Kun første sætning står hos Unitree.** Resten er vores egen sammenligning.

Under L87 må den blive stående — **men kun hvis hver påstand i den kan
efterprøves.** Der er tre:

1. at de andre Unitree-modeller oplyser vægt **med** batteri,
2. at Go2 er **15 kg**,
3. at As2 er **20 kg**.

**Alle tre handler om dine egne robotter**, så du kan efterprøve dem i din egen
datamængde og i dine egne råkilder. **Gør det, og skriv resultatet for hver.**
Holder en påstand ikke, falder hele trioen jf. L87 — `caveat`,
`caveat_wording` og `caveat_class` sammen.

**56 advarsler i kataloget bærer den slags formulering** (*"alle andre"*,
*"sammenlign"*, *"skemaet har ingen felter til"*), og en stor del er Unitrees —
fordi Unitree er den producent, alle andre sammenlignes med. **Det er dit spors
egentlige vanskelighed.** Det kinesiske er det lette; det svære er at afgøre,
hvornår vores egen sammenligning har belæg.

**Vær særligt varsom med varianterne.** Du har seks par (`a2`/`a2-w`,
`as2`/`as2-w`, `b2`/`b2-w`, `go2`/`go2-w` og flere). En påstand om *"alle andre
modeller"* skal efterprøves mod **alle 13**, ikke mod de tre, der lige er
nævnt — det er præcis den fejlform, hvor tælleren og nævneren kommer fra hver
sin liste.

**Dine råkilder ligger i `media/_kilder/raa-kina-unitree-2026-08-19/`, som HAR
et MANIFEST.** Rør ikke den fil. Har du brug for nye snapshots, så lav din egen
mappe `media/_kilder/raa-f2-unitree-<dagens-dato>/`.

## Filejerskab

Du ejer: `fund/maal-f2-unitree.mjs` · `db/f2-unitree-skriv.mjs` ·
`fund/FUND-f2unitree.md` · `fund/BRIEF-f2-unitree.md` · og
`media/_kilder/raa-f2-unitree-<dato>/`, hvis du henter nyt.

Du rører **ikke** filer, der tilhører `f2-vest`, `f2-genisom` eller
`f2-galileo`, og ikke `db/fase2-tjek.mjs`, `db/f2-skriv.mjs`, `db/tjek.mjs`,
`db/ordbog.mjs`, `tools/`, `assets/`, `data/`, `tests/` eller de to opskrifter.

## Færdig når

- Dansk-tallet er **0** i hver kolonne, du har rørt — undtagen rækker på
  L87-listen, som står urørte. Skriv hvor mange.
- Talkolonne-diffen er **tom**.
- `change_log` har dine skrivninger og **0 uden for dine egne robotter**.
- Du har efterprøvet Aliengo-advarslens **tre** påstande hver for sig og skrevet
  resultatet af hver.
- Du har skrevet, hvordan de to opskrifter skal kombineres — det er den del, de
  tre resterende spor skal bruge.
- Du har læst alle dine tekster igennem selv og skrevet *"N læst, M fejl"*.
