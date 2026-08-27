# FUND-kildetjek.md — lever kilde-URL'erne stadig noget?

Spor: `spor/kildetjek`. Værktøj: `tools/kildetjek.mjs`. Test: `tests/dele/22-kildetjek.mjs`.

## Genkør målingen

```
"/c/Program Files/nodejs/node.exe" tools/kildetjek.mjs
```

Målt 27. aug 2026, virkelig netværksmåling (ikke en test-fixture). Kørselstid: **16,3 sekunder**
(`time`-målt), samtidighed 8, timeout 15.000 ms pr. forsøg.

## Opsummeringstal

```
103 af 103 prøvet · 100 ok · 3 døde · 0 unåelige
```

103 = 100 + 3 + 0. Exit-kode **1** (mindst én DØD, jf. værktøjets kontrakt).

Grundmåling af antal/værter (genkørt, matcher orkestratorens påstand præcist):
**103 unikke URL'er, 37 unikke værter**, tungest: `www.unitree.com` (15), `www.deeprobotics.cn` (7),
`deeprobotics.cn` (6), `www.genisomai.com` (5), `github.com` (5).

## De 3 URL'er, der ikke er OK

| URL | Udfald | Status | Robotpost |
|---|---|---|---|
| `https://www.ghostrobotics.io/spirit-40` | DØD | 404 | `ghost-robotics-spirit-40` |
| `https://www.unitree.com/laikago` | DØD | 404 | `unitree-laikago` |
| `https://www.unitree.com/products/laikago/` | DØD | 404 | `unitree-laikago` |

Uafhængigt krydstjekket med `curl -I -L` mod alle tre — samme tre 404'ere, ingen afvigelse.

**Ingen af de tre er en overraskelse.** Begge YAML-filer har allerede — dateret 19. og 21. aug
2026, altså *før* dette spor — en note om, at producentsiden er væk, og at "felter: ikke
indsamlet, bevidst" for at undgå en falsk friskhedsdato. `kildetjek.mjs` bekræfter i dag blot,
at situationen ikke har ændret sig, og at ingen af de øvrige 100 URL'er er i samme tilstand.

## Hvor mange tal på den byggede side hænger på hver død URL

Bygget lokalt (`tools/build.mjs`, kun for at læse det færdige resultat — ingen ejede filer
ændret) og læst felt for felt i de to robotters HTML:

- **`ghost-robotics-spirit-40`**: samtlige 29 `felter:` er skrevet som bar `ikke_oplyst` UDEN
  eget kilde-objekt — de bærer intet kildemærke og optræder ikke i "Kilder"-listen. Den døde
  URL bærer **kun** `anvendelse`-feltets attribution (selve "ikke oplyst"-tilstanden) og
  fremstår som **2 klikbare links pr. sprogside** ("Åbn producentens side"-knappen + linjen i
  Kilder-listen) × 2 sprog = **4 klikbare forekomster i alt, 0 tal**.
- **`unitree-laikago``s anvendelse-kilde** (`.../laikago`): samme mønster — 29 bare
  `ikke_oplyst`-felter, ingen af dem kildebelagt. **4 klikbare forekomster i alt (2 sprog ×
  2 links), 0 tal.**
- **`unitree-laikago`'s billede-kilde** (`.../products/laikago/`): denne URL står i YAML'en,
  men **fremgår slet ikke som link på den byggede side** — billedteksten skriver i stedet den
  faktiske proveniens i prosa ("hentet via Wayback Machine-snapshot af siden fra 21. juni
  2021"), og `billede.kilde`-feltet selv bliver aldrig til en `<a href>`. **0 klikbare
  forekomster, 0 tal.**

Konklusion: **ingen af de 1.110 kildebelagte tal på siden hænger på en død URL.** De to ramte
robotter har nul indsamlede måltal, netop fordi kildekritikken allerede var gjort ved
indsamlingen. De døde links, der reelt er klikbare (2 stk., 8 forekomster i alt på tværs af
sprog), understøtter kun en "ikke oplyst"-attribution og optræder derfor i "Kilder"-listen som
dokumentation af selve fraværet — ikke som belæg for et tal.

## Ærlighed om metoden

- Alle 103 URL'er blev afgjort fra denne maskine i dag. **0 unåelige** — ingen DNS-, TLS- eller
  timeout-fejl, heller ikke blandt de mange kinesiske værter (`deeprobotics.cn`,
  `www.genisomai.com`, `www.magiclab.top` m.fl.), som briefet advarede kunne være svære at nå
  fra Danmark. Det er et øjebliksbillede: et netværk der svarer i dag, kan være blokeret i
  morgen, og omvendt.
- HEAD→GET-fald-tilbage udløses i koden ved 403/405/501 (403 er en udvidelse ud over briefets
  405/501, begrundet i kommentaren i `tools/kildetjek.mjs` — nogle CDN'er/WAF'er svarer 403
  specifikt på HEAD som botbeskyttelse). **Ingen af de 103 URL'er ramte denne dag et 403/405/501
  på HEAD** — alle blev afgjort på selve HEAD-forsøget, så fald-tilbage-stien er verificeret af
  testen (22.19–22.21), ikke af dagens rigtige kørsel.
- Værktøjet gemmer intet sideindhold — kun status er læst, `.body.cancel()` kaldes eksplicit.

## Konfidens

1. **Værktøjet virker og klassificerer korrekt: HØJ.** Kommando: `node tests/koer.mjs` →
   `416 bestået, 2 fejlet` (samme 2 kendt-røde som grundmålingen: intervalfeltet 18-25 kg og
   L27/robots.json). 28 nye påstande (22.1–22.28), alle bestået. Kontrafaktisk: havde
   `klassificerStatus`/`klassificerFejl` blandet DØD og UNÅELIG sammen, ville mindst 22.16-22.18
   have fejlet — de asserterer eksplicit forskellen.
2. **De 3 fundne DØDE er korrekte: HØJ.** Kommando: `node tools/kildetjek.mjs` →
   `103 af 103 prøvet · 100 ok · 3 døde · 0 unåelige`. Uafhængigt krydstjekket med `curl -I -L`
   mod alle tre — samme facit. Kontrafaktisk: havde værktøjet en fejl der talte OK som DØD eller
   omvendt, ville curl-tjekket af de konkrete 3 URL'er (eller af en stikprøve blandt de 100 OK)
   have afsløret uoverensstemmelsen; det gjorde det ikke.
3. **"0 tal hænger på en død URL": MIDDEL.** Bygget og læst i de to konkrete robotters HTML
   (citeret ovenfor med linjenumre/klasser), men ikke skrevet som en generel, genkørbar
   automatisk kontrol — en fremtidig ny "ikke_oplyst uden kilde"-post ville kræve samme manuelle
   gennemgang. Kontrafaktisk: var konklusionen forkert, ville et tal med `vaerdi` ≠ `ikke_oplyst`
   og `kilde` lig en af de 3 URL'er findes i YAML'en — det blev tjekket ved at læse begge filer
   i deres helhed, ikke kun grep'et efter URL'en.

## Nye fælder og opdagelser

- **`billede.kilde` bliver aldrig en klikbar `<a href>` på siden** — kun `billede.note` (prosa)
  vises for læseren, når kilden er problematisk. Et værktøj, der kun leder efter *klikbare*
  døde links, ville underrapportere: det ville også skulle læse `billede.kilde` fra YAML'en
  direkte, hvilket `kildetjek.mjs` gør (den regner ikke kun på det, der ender som `<a href>`).
- **HEAD→GET-fald-tilbage blev aldrig øvet af dagens rigtige kørsel** — alle 103 blev afgjort
  på HEAD alene. Fald-tilbage-koden er kun bevist af testens opdigtede tal, ikke af en rigtig
  403/405/501 fra nettet. Det er ikke en fejl, men det er værd at vide, hvis en fremtidig
  kørsel pludselig viser DØD på en URL, der plejer at være OK — check da om HEAD alene gav et
  andet resultat end GET ville have gjort.
- Ingen anden overraskelse: 100/103 var enkle 2xx-svar, ingen omdirigeringskæder gav problemer.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle tre punkter (værktøj, kørsel+fund, netværksfri test) samt selv-review er udført.
