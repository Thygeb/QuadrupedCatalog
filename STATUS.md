# STATUS — indeks over hvad der er åbent

**Den eneste fil, du skal læse for at vide, hvad der mangler.** Fund- og kildekortfiler er
arkiv og opdateres ikke bagud. Holdes kort med vilje: bliver den en essaysamling, holder
folk op med at læse den.

Opdateret 21. august 2026.

---

## Hvor vi er

| Trin | Status |
|---|---|
| Produktsandhed, byggeplan, datamodel | **Færdig** |
| Dataindsamling Kina (26 poster) | **Færdig, med gemte råkilder og manifest** |
| Dataindsamling Vest (19 poster) | Færdig, men **17 fejl fundet** — rettelser mangler |
| Feltkortlægning + EU-kolonnen | Færdig, **to huller** — se Å6 og Å7 |
| Efterprøvning af råkilder | **Færdig** — 152 påstande, 17 fejl. Se `KILDEKORT-*.md` |
| `data/robots/*.yaml` + validator | **Ikke påbegyndt.** Kode er nu tilladt |
| Visuel retning | Påbegyndt, agent døde på sessionsgrænse |
| Generator, katalog, sider | Ikke påbegyndt |

**Materialet:** ~45 robotposter i 6 FUND-dokumenter · 249 råkildefiler med manifest ·
0 maskinlæsbare datafiler. Det sidste tal er projektets flaskehals.

---

## Åbent

### Venter på CEO'en

| # | Punkt |
|---|---|
| **Å1** | **Navn og domæne.** Hele brandet hænger på det |
| **Å3** | **Billedvejen.** Anbefaling: måltro silhuetter i fælles målestok |
| **Å5** | Hvem vedligeholder kataloget efter lancering |

### Venter på JPK

| # | Punkt |
|---|---|
| **D1** | Må sekundære kilder bruges (udviklerdok, PDF-datablade)? Uden dem har seks felter nul dækning. **Bemærk:** argumentet for dem er svagere end først antaget — se D8 |
| **D4** | Tæller et felt som udfyldt ved type uden model (`3D LiDAR ×1`)? **L20 svarede ja — men koden gør det ikke.** `tools/build.mjs` defaulter til `tael-ikke`. Målt 21. aug 2026: forskellen flytter **16 af 46 pladser**, og det er dermed den eneste af de to tælleparametre, der overhovedet kan ændre en rangering. Enten rettes defaulten til L20, eller L20 vendes om — men de to må ikke stå og modsige hinanden |
| ~~**D7**~~ | ~~Nævneren: 29 eller 31?~~ **Lukket 21. aug 2026 — se L30.** Svaret var ingen af dem: 33 |
| **Å8** | Er Xiaomis JS-bundle en primærkilde? Ja → CyberDog 2 er 48 %. Nej → 0 % |
| **Å9** | Hvilket MagicLab-site er primærkilde? De to modsiger hinanden og blokerer fem felter |
| **D10** | **R17 kan ikke opdage en `arvet_fra`, der bliver slettet.** Fjernes markeringen fra Unitree B2-W, ser posten ud som B2's egen — samme citat, samme kilde — og validatoren siger god for den. Målt: 14 bevidst ødelagte kopier af de rigtige datafiler, 13 fanget, netop denne slap igennem. Hullet kan ikke lukkes med en heuristik: identisk citat betyder *ikke* arv (Unitrees navigation og DEEP's *"LYNX M20 series"* dækker hver robot direkte). Det kræver et maskinlæsbart `variant_af` på identitetsfelterne — en skemabeslutning, der ikke er truffet |

*Å10 og Å11 er lukket — se L22 og L23.*

### Venter på arbejde

| # | Punkt |
|---|---|
| **Å2** | Visuel retning. Påbegyndt |
| **Å4** | **Salgssiden er ikke flyttet.** `c:\Praktik\website` → `websites\salg`. Kræver Claude Code lukket; kør `c:\Praktik\flyt-salg.ps1` |
| **Å6** | **EU-kolonnens hovedpåstand er ubelagt.** PLAN.md siger, køberen bliver importør ved direkte køb fra Asien. Der findes ingen primærkilde for import *til eget brug* |
| **Å7** | **"42 producenter" kan ikke citeres.** Kilden svarer 403, tallet er fra "early 2024" uden definition. Reelt tal er ≥57. PLAN.md afsnit 1 skal rettes |
| **D3** | Hvordan vises intervaller (`20~25cm`, `4-6h`)? |
| **D9** | Syv skemamangler — se nedenfor |
| **R1** | 17 fejl i `fund/FUND-vest.md` skal rettes i et nyt dokument (arkiv rettes ikke bagud) |
| **R2** | `raa-vest-2026-08-19/` mangler manifest — det eneste råkildesæt uden. **Værre end antaget:** `ghost_s40.html` i samme mappe er en 404-side (`<title>Not Found</title>`, teksten "Page Not Found") gemt under et navn, der lover Ghost Robotics Spirit 40. Fundet 21. aug 2026. Uden manifest var der intet, der kunne fange det. Hele mappen bør gennemgås for flere |

---

## D7 — nævneren. Lukket 21. aug 2026, se L30

Her stod tidligere, at valget stod mellem 29 og 31, og at det **ændrede rækkefølgen**.
Begge dele er målt forkert:

- **Svaret er 33, ikke 29 og ikke 31.** Skemaet har 33 feltnøgler, og alle 46 datafiler
  skriver præcis dem — 46 × 33 = 1518 feltposter, nul ukendte nøgler, nul ubrugte felter.
- **Nævneren ændrer ikke rækkefølgen.** Målt på alle 46 poster ved 29, 31 og 33: **0 af 46
  skifter plads**, listerne er byte-identiske. En nævner, der er den samme for alle,
  kan matematisk ikke omrokere. Den omrokering, notatet huskede, kom fra **L6's
  feltopsplitning** — altså fra *tælleren*.
- **Det er D4, der flytter rangeringen: 16 af 46 pladser.** D7 stod som spærring for
  rangeringen, D4 stod som et almindeligt spørgsmål. De var byttet om.

---

## D9 — syv felter og tilstande, skemaet mangler

| Mangler | Fundet på |
|---|---|
| `ex_certificering` (ATEX/IECEx zone + gasgruppe) | ANYmal X: `Zone 1 IIB` |
| `rækkevidde` som **oplyst** felt | RIVR: `over 30 km`. Skemaet har den kun som beregnet |
| `vægt_inkl_batteri: ja/nej` | MagicDog vejes uden, alle andre med |
| Tilstand på driftstid (gående/stående/standby) | Weilan C500: fire tal, ingen lastbetingelse |
| `strøm ud` delt i spænding og effekt | Spot oplyser watt, Ghost og Rainbow kun volt |
| Femte `status`: demonstrator | LimX W1 blev aldrig markedsført |
| Fjerde datatilstand: oplyst, men kun som billede | Yahboom udgiver hele arket som JPG |

*Ottende punkt (`klasse`) er bortfaldet med scope-beslutningen L11.*

---

## Rettelser, der skal ind i eksisterende dokumenter

| Hvor | Hvad |
|---|---|
| PRODUCT.md, PLAN.md | **Sprogkravet er dansk, ikke "et EU-sprog".** BEK 727 §§ 3, 4, 6 kræver dansk for brugsanvisning, advarsler og overensstemmelseserklæring |
| PLAN.md afsnit 1 | "42 producenter" er ukildet og for lavt — se Å7 |
| Alle steder | Maskinforordningen gælder fra **20. januar 2027**. EUR-Lex' Cellar serverer den uberigtigede tekst med 14. januar — brug ikke EUR-Lex direkte til datoen |

---

## Lukket

| # | Punkt | Beslutning |
|---|---|---|
| **L1** | Afsender | Eget brand, KeyResearch som udgiver i footer og på Om-siden |
| **L2** | Datapolitik | Fabrikanttal med kilde + beregnede felter med synlig formel. Ingen 1-5-score |
| **L3** | Sprog | Dansk + engelsk ved lancering, arkitektur bygget til flere |
| **L4** | Stack | YAML + selvskrevet Node-generator uden afhængigheder |
| **L5** | Projektadskillelse | Eget repo. Deler kun tone, målescripts og fontstrategi med salgssiden |
| **L6** | Nyttelast, trinhøjde, driftstid | Splittes i separate felter. Se F1-F3 i DATAMODEL.md |
| **L7** | **D2 — Spot-længden** | **1100 mm.** Produktsiden har en tastefejl; databladet er konsistent med sin egen imperiale værdi. Produktsidens `110mm` føres med som `advarsel` |
| **L8** | Hook og projektskills | Virker efter genstart |
| **L9** | **D6 — kina-sporet uden råkilder** | **Løst.** Alle 26 poster indsamlet om med gemte, kontrolsummerede råkilder |
| **L10** | **D8 — er FUND-vest til at stole på?** | **Efterprøvet: 152 påstande, 17 fejl.** Ingen producenttal læst forkert; fejlene er tilskrivning, tælling og to opfundne hjembyer. Se `KILDEKORT-*.md` |
| **L11** | **Scope** | **Legetøj, hobbyrobotter og undervisningskit hører ikke i kataloget.** Ude: Sony aibo, Tombot, Petoi, MangDang, Hiwonder, Yahboom, Elephant Robotics |
| **L12** | **Kode** | **Tilladt.** `data/robots/*.yaml` og `tools/validate.mjs` må skrives |
| **L13** | **Billeder (Å3)** | **Fabrikantbilleder tilladt, så længe siden er lokal.** Egne fotos og silhuetter også. AI-genererede robotbilleder er stadig ude |
| **L14** | **Produktretning** | **Billeddrevet browsing, ikke opslagsværk.** Specifikationer nedtones; detaljer hentes ved at gå videre til producentens egen side |
| **L29** | **R1 + R2 — vest-sporet** | **Lukket.** `fund/FUND-vest-2.md` bærer 19 rettelser, hver efterprøvet mod råfilen. `raa-vest-2026-08-19/MANIFEST.tsv` dækker alle 58 filer: 47 med verificeret URL, 11 med `ukendt`. Seks fejlsider fundet (fire var kendt); gennemgangen var udtømmende — alle 35 HTML-filer strimlet og målt |
| **L27** | **Forsideakse — vender L15** | **Vægtklasse er aksen, anvendelse er filter.** L15 lagde anvendelse som akse; `KRITIK-1-plan.md` målte, at det ikke duer: forsvar og logistik ville have ét kort hver, `ikke_oplyst` er næststørst med 9, og reglen om at *første værdi* er hovedkategori lader en producents menurækkefølge afgøre, hvor ti robotter havner — altså netop den redaktionelle dom, reglen skulle undgå. Vægt er målt og entydigt. **Grænserne sættes til 20/40 kg** (11/12/12); 20/60 gav 11/22/2. Robotter uden oplyst vægt får egen sektion. Anvendelse bliver **flerværdi**-filter, så en robot må være både industri og inspektion |
| **L28** | **Billeder indtil videre** | **Behold fotos, mærk de dårlige.** Byte-identiske dubletter fjernes (Spirit 40 viste Vision 60's fil), Go2-billedet med indbrændt reklametekst fjernes, delte billeder mærkes synligt. S1 er stadig uafklaret og er nu et større problem end før |
| **L23** | **Å11 — arv til varianter** | **Ja, men synligt mærket.** Varianten arver moderens kategori og viser det: *"arvet fra Unitree B2"* med moderens citat. Slutningen er dermed læserens at bedømme, ikke skjult |
| **L24** | **Sprog i denne fase** | **Dansk først.** Engelsk slås til, når designet står. Arkitekturen er allerede på plads — én fil pr. sprog, URL pr. sprog, `hreflang` |
| **L25** | **Å6 — importørpåstanden** | **Droppet.** EU-kolonnen viser kun `CE oplyst` og `tilgængelig i EU`. Påstanden om at køberen selv bliver importør fjernes fra PLAN.md og PRODUCT.md. **Konsekvens:** en af de tre kanter i PRODUCT.md's positionering falder væk — EU-kolonnen bliver et faktafelt frem for et argument |
| **L26** | **S1 — billeder ved lancering** | **Udsat.** Vi bygger videre på fabrikantbillederne som lokale pladsholdere og beslutter vejen inden lancering. **Noteret risiko:** projektets egen `media/_kilder/LÆSMIG.md` dokumenterer, at en pladsholder, der lignede et rigtigt billede, overlevede til lancering på nabosiden. Spærringen står ved magt indtil beslutningen tages |
| **L30** | **D7 — nævneren. Reviderer L19** | **33 — og den skrives aldrig som et tal igen.** L19 valgte 31 ud fra feltlisten i DATAMODEL.md, dengang der ikke fandtes kode. Det, der har ændret sig siden: `tools/skema.mjs` findes nu, den er maskinlæsbar, og **alle 46 datafiler retter sig efter den** (46 × 33 = 1518 feltposter, nul ukendte nøgler, nul ubrugte felter). L19's princip — *"feltlisten er sandheden"* — står ved magt; det er feltlisten, der har fået krop. **31 var to modsatrettede fejl, der næsten gik lige op:** den talte `mål stående L×B×H` som ét felt, hvor skemaet har tre nøgler med hver sin kilde, og den talte et felt med, `mål sammenfoldet`, som skemaet aldrig har haft — tre datafiler siger det selv i deres noter: *"Skemaet har ingen felter til foldemål."* Et felt, ingen producent kan udfylde, trækker alle ned med et fast beløb og måler ikke længere åbenhed. **`NAEVNER` er nu udledt af `FELTNAVNE.length`**, så tæller og nævner ikke kan skride fra hinanden igen — det var netop dét, der skete: tælleren har hele tiden løbet over 33 nøgler, mens nævneren stod håndskrevet. `tests/koer.mjs` afsnit 3b fælder bygget, hvis nævneren hardkodes, hvis den bliver til flere end én, eller hvis `indhold/metode.md` siger et andet tal end koden. **Rækkefølgen er uændret: 0 af 46 skifter plads.** Niveauet flytter sig: et tal målt på 29 er ca. 14 % højere end det samme tal på 33 — Spot 69 % → 61 %, Vision 60 76 % → 67 % |
| ~~**L19**~~ | ~~**D7 — nævneren**~~ | ~~**31.**~~ **Revideret af L30 (21. aug 2026): 33.** Står her, fordi tal målt mellem L19 og L30 er opgjort på 31 og ikke er sammenlignelige med de nuværende |
| **L20** | **D4 — tællereglen** | **Type uden model tæller som udfyldt, men markeres synligt** (`~`), så tallet kan genberegnes uden dem. Under den strenge regel mistede hver kinesisk robot LiDAR-feltet, og feltet blev konstant og dermed værdiløst som skelnen |
| **L21** | **D1 — sekundære kilder** | **Tilladt, når kilden ligger på producentens eget domæne og kan dateres** — datablade, brugermanualer, udviklerdok, JS-bundles. Mærkes `kildetype: sekundaer`, så de kan filtreres fra. **Lukker samtidig Å8:** Xiaomis JS-bundle er en gyldig kilde, og CyberDog 2 står på ~48 %, ikke 0 %. Forhandlere, databaser, anmeldelser og pressomtale er stadig ude |
| **L22** | **Å10 — syvende kategori** | **`sikkerhed_overvaagning` tilføjes.** Fem producenter bruger selv ordet, så det er stadig et citat. Alternativet ville stille en parkpatruljerobot ved siden af Ghost Robotics' militærplatform |
| **L16** | **Visuel grundtone** | **ORBIT-lys.** Lys grå bund, hvide afrundede paneler, luft, tynde linjer, små versaletiketter. Fotografierne bærer farven. Efter `media/inspiration/`-konceptet — **men uden dets salgsarkitektur**: ingen "request demo", ingen ét-produkt-hero, ingen superlativer, ingen renderede produktfotos |
| **L17** | **Forsidens top** | **Typografisk hero med søgning.** Kort overskrift der siger hvad siden er, søgefelt og anvendelsesfiltre synlige i første viewport. Ingen robot fremhævet — at vælge én ville være en anbefaling |
| **L18** | **Navn i mellemtiden** | **Neutral pladsholder** i header, tydeligt midlertidig, indtil Å1 er afgjort |
| **L15** | **Informationsarkitektur** | **Forsiden organiseres efter vægtklasse** (under 20 kg · 20-60 kg · over 60 kg), ikke efter producent. Producentsider findes som andet niveau og bærer EU-kolonnen. Hver robot beholder sin egen URL. Begrundelse: 43 robotter ligner hinanden; størrelse er den eneste forskel, en køber både kan se og bruge — og tre producenter har 26 af de 43, så producentopdeling giver en skæv forside |

> **SPÆRRING S1 — må ikke glemmes.** Siden må **ikke publiceres**, mens den viser
> fabrikantbilleder uden skriftlig tilladelse. Enten indhentes tilladelserne, eller
> billederne udskiftes med egne fotos og silhuetter før lancering. En pladsholder, der
> ligner et rigtigt billede, overlever til lancering — det er sket på nabosiden.

---

## Regler, der er købt dyrt

- **Gem råkilden, hver gang.** Kina-sporet måtte køres helt om, fordi den ikke blev gemt.
- **Skriv manifest ved siden af:** URL, HTTP-status, UTC, SHA-256. Uden det kunne et
  datablad kun kobles til sin kilde med indicier.
- **Gem aldrig en fejlside under et navn, der lover indhold.** Tre 404-sider ligger i
  vest-sættet, én hedder `petoi_shop.html`.
- **Land og hjemsted er et felt som ethvert andet.** To hjembyer blev skrevet ud af
  hukommelsen; ingen af dem stod i råmaterialet.
- **Producentnavne må aldrig komme fra maskinoversatte sammendrag.** To fejlnavne fanget:
  `云深处` gengivet som et andet firma, og Yobotics stavet 友宝特 i stedet for 优宝特.
- **Læs den kinesiske side.** `＜60 cm` viste sig at være hindringsundvigelsesafstand,
  ikke forhindringshøjde — på engelsk var tallet landet i et mobilitetsfelt.
- **Kan noget ikke belægges, så skriv det.** ATEX-gasgrupperne står som `ikke oplyst`,
  fordi de frie gengivelser modsiger hinanden.
- **En brøk, hvis to halvdele kommer fra hver sin liste, skrider — tavst.** Tælleren i
  specifikationstætheden løb over skemaets feltliste; nævneren stod som et håndskrevet
  tal. Hver skemaændring flyttede den ene og ikke den anden, og intet fejlede, fordi
  ingen af de to vidste, at den anden fandtes. Udled det afledte tal, eller lav en
  prøve, der sammenligner de to. Helst begge dele.
- **En prosaliste, der opremser flere ting, end dens egen overskrift siger, er en
  fejl under opsejling.** *"Fysik (10)"* opremsede 12. Den uoverensstemmelse rejste
  gennem tre dokumenter og to beslutninger, før nogen talte efter.

---

## Kom ikke igen med disse

| Forslag | Hvorfor ikke |
|---|---|
| Købsknap, affiliate-links, prisforespørgselsformular | Gør os til forhandler. Der findes ingen forhandleraftale |
| Redaktionel 1-5-score | Uden offentliggjort metode er det en konklusion skrevet om til tal |
| AI-genererede robotbilleder | Fabrikerer en maskine, der ikke ser sådan ud |
| Fabrikanternes pressefotos | Stærkeste mulige signal om et forhandlerforhold, der ikke findes |
| Cookiebanner | Siden sætter ingen cookies |
| Nyhedssektion | En død nyhedsstrøm daterer siden |
| `data-en`-attributter som sprogløsning | Kontakt med to stillinger; kan ikke få en tredje |
| Én HTML-fil som salgssiden | Bryder sammen ved 60 robotter × flere sprog |
