# Rettelser til eksisterende dokumenter

Skrevet 21. august 2026 af indholdssporet. **Filerne er ikke rettet her** — PLAN.md og
PRODUCT.md ejes af andre spor, og to agenter, der retter samme afsnit samtidig, giver en
flettekonflikt i et dokument, ingen bagefter kan se historikken i.

Nedenfor står den præcise erstatningstekst. Tre rettelser, alle tre besluttet eller belagt et
andet sted i repoet; kilden står ved hver.

---

## R1 — "omkring 42 producenter" kan ikke citeres og er for lavt

**Hvor:** `PLAN.md` afsnit 1 (linje 17-19) og `PRODUCT.md` under *Product Purpose*
(linje 31-34).

**Hvorfor:** `fund/FUND-felt.md` afsnit 2.1 fandt kilden. Sætningen stammer fra en kommerciel
markedsrapportside, som **svarer 403** både på curl og på WebFetch (19. aug 2026). Tallet er
dateret *"early 2024"*, og der står ingen definition af, hvad der tælles som producent. Efter
projektets egen regel — *et tal uden kilde findes ikke* — må 42 ikke stå på siden. Vores egen
optælling gav **57**: 31 producenter med et domæne, der er åbnet og efterprøvet, plus 26 navne
fra China Mobile Robot Alliances oversigt af 22. oktober 2025. Fire kandidater blev forkastet
undervejs og er ikke talt med. Se også `STATUS.md` Å7.

### PLAN.md afsnit 1 — erstat de to første afsnit

> Omkring **42 producenter** af firbenede robotter globalt; den grundigste eksisterende
> oversigt sammenligner **28+ modeller**. Til sammenligning lister humanoid.guide ~235
> humanoider.
>
> Det er planens vigtigste enkelttal. **Feltet kan gøres færdigt.** Et katalog på 50-70
> komplette poster er et opslagsværk; 235 halve poster er en liste. Hele strategien
> nedenfor følger af, at vi kan nå bunden af feltet, og at de ikke kan.

**med:**

```markdown
**57 producenter** af firbenede robotter, talt af os selv 19. august 2026: 31 med et
domæne, vi har åbnet og efterprøvet, plus 26 navne fra China Mobile Robot Alliances
oversigt af 22. oktober 2025. Fire kandidater er forkastet undervejs. Til sammenligning
lister humanoid.guide ~235 humanoider.

Det er planens vigtigste enkelttal, og det er derfor talt frem for citeret. Tallet 42,
som stod her før, kom fra en markedsrapportside, der svarer 403, er dateret "early 2024"
og ikke definerer, hvad den tæller. Vores tal kan genkøres: producentlisten med domæner
står i `fund/FUND-felt.md` afsnit 2.4.

**Feltet kan gøres færdigt.** Et katalog på 50-70 komplette poster er et opslagsværk;
235 halve poster er en liste. Hele strategien nedenfor følger af, at vi kan nå bunden af
feltet, og at de ikke kan.
```

### PRODUCT.md, Product Purpose — erstat første afsnit

> Et komplet, kildeangivet opslagsværk over verdens firbenede robotter. Feltet er
> afgrænset — omkring 42 producenter globalt, og den grundigste eksisterende oversigt
> sammenligner 28+ modeller. Det betyder, at kataloget kan gøres **færdigt**, i modsætning
> til humanoid.guide, hvis ~235 poster nødvendigvis er tynde.

**med:**

```markdown
Et komplet, kildeangivet opslagsværk over verdens firbenede robotter. Feltet er
afgrænset — 57 producenter, talt af os selv 19. august 2026 og opgjort med domæne i
fund/FUND-felt.md. Det betyder, at kataloget kan gøres **færdigt**, i modsætning til
humanoid.guide, hvis ~235 poster nødvendigvis er tynde.
```

**To ting, rettelsen ikke løser, og som ikke skal skjules i formuleringen:**

1. **"28+ modeller" er lige så ukildet som 42.** Tallet står i titlen på `awesomerobots.xyz`,
   hvis egne sider samtidig siger 25 og 115+. Sitet har en købsvej (*"Compare & Buy"*), altså
   samme konstruktion som den, der står på afvist-listen. Jeg har fjernet sætningen i
   erstatningsteksten ovenfor frem for at rette tallet. Vil vi have en sammenligning med
   feltets bedste eksisterende oversigt, skal den skrives om, ikke justeres.
2. **Definitionen mangler stadig.** `fund/FUND-felt.md` afsnit 2.6 foreslår: en producent hører i
   kataloget, når den (a) selv fremstiller en firbenet robot, (b) har en offentlig produktside
   med mindst ét talfelt med enhed, og (c) tilbyder modellen til køb eller leje. **Det er et
   forslag, ikke en beslutning.** Under den definition bliver feltet mindre end 57, ikke
   større. Indtil det er afgjort, betyder 57 "navne, vi har kunnet belægge", og andet må
   sætningen ikke love.

---

## R2 — sprogkravet er dansk, ikke "et EU-sprog"

**Hvor:** `PLAN.md` linje 39 og linje 73, `PRODUCT.md` linje 48.

**Hvorfor:** `BEK nr. 727 af 13/06/2024` om supplerende bestemmelser til maskinforordningen.
§ 3, stk. 1: brugsanvisninger og sikkerhedsoplysninger **skal være på dansk**. § 4:
informationer og advarsler **skal være på dansk**. § 6: EU-overensstemmelseserklæringer
**skal være på dansk**. Kilde: Retsinformation, `eli/lta/2024/727`, efterprøvet i
`fund/FUND-felt.md` (F10). Står der "et EU-sprog", lover katalogfeltet noget svagere, end reglen
kræver — og en køber, der læser feltet som et ja, får en manual på engelsk og en regel imod
sig.

**Feltet skal desuden hedde noget andet.** *Dokumentation på EU-sprog* → **`dokumentation på
dansk`**, med tilstandene `oplyst / ikke oplyst` som resten af EU-kolonnen.

| Sted | Erstat | Med |
|---|---|---|
| `PLAN.md:39` | `Findes dokumentationen på et EU-sprog.` | `Oplyser producenten, at dokumentationen findes på dansk.` |
| `PLAN.md:73` | `dokumentation på EU-sprog` | `dokumentation på dansk` |
| `PRODUCT.md:48` | `dokumentation på EU-sprog` | `dokumentation på dansk` |

---

## R3 — importørpåstanden skal ud

**Hvor:** `PLAN.md` linje 37-38 og linje 73, `PRODUCT.md` linje 47-48.

**Hvorfor:** `STATUS.md` Å6 og `fund/FUND-felt.md` afsnit 5, punkt 1. Påstanden er, at køberen
bliver importør med fuldt ansvar ved direkte køb fra Asien. **Der findes ingen primærkilde
for import til eget brug uden videresalg.** Kæden gennem forordning 2019/1020 art. 4 taler om
produkter, der *bringes i omsætning* — den forudsætter altså svaret på det spørgsmål, den
skulle besvare. Den Blå Vejledning kunne ikke hentes. Det er sidens skarpeste enkeltoplysning,
og den er ubelagt; derfor ud, ikke omskrevet.

### PLAN.md afsnit 2, punkt 2 — erstat

> **2. EU-kolonnen — den ingen andre har.** CE-mærkning oplyst ja/nej/ukendt. Hvem bliver
> importør ved direkte køb fra Asien (svar: køberen, med fuldt ansvar under
> maskinforordningen). Findes dokumentationen på et EU-sprog. Er der et servicepunkt og
> reservedele i Europa. Leveringstid.

**med:**

```markdown
**2. EU-kolonnen — den ingen andre har.** CE oplyst ja/nej/ikke oplyst. Oplyser
producenten, at dokumentationen findes på dansk. Er der et servicepunkt og reservedele i
Europa. Leveringstid.
```

### PLAN.md afsnit 3, gruppen "Kommercielt og EU" — erstat

> CE oplyst · importøransvar ved direkte køb · dokumentation på EU-sprog · servicepunkt i
> EU · reservedelsforsyning · leveringstid.

**med:**

```markdown
CE oplyst · dokumentation på dansk · servicepunkt i EU · reservedelsforsyning ·
leveringstid.
```

### PRODUCT.md, Positioning punkt 2 — erstat

> 2. **EU-kolonnen.** CE-mærkning oplyst ja/nej/ukendt, hvem der bliver importør ved
>    direkte køb fra Asien, dokumentation på EU-sprog, servicepunkt og reservedele i EU.

**med:**

```markdown
2. **EU-kolonnen.** CE oplyst ja/nej/ikke oplyst, om producenten oplyser dokumentation
   på dansk, servicepunkt og reservedele i EU.
```

**Bemærk:** feltet `importøransvar ved direkte køb` udgår helt af datamodellen. Det erstattes
ikke af et svagere formuleret felt — et felt, vi ikke kan belægge, skal ikke findes, for så
bliver det udfyldt.

**Et fjerde sted, uden for opgavens ramme:** `DATAMODEL.md:122` skriver *"For en dansk køber
er det forskellen mellem at købe en maskine og at blive importør af en."* Det er den samme
påstand i en sætning om F6. Den skal med ud, men DATAMODEL.md ejes af kodesporet, og
rettelsen hører derfor til der.

---

## Ikke rettelser — tre fund, der skal afgøres af CEO'en

Det her er ikke tekst, der kan skrives om. Det er tre steder, hvor en beslutning og repoets
indhold ikke passer sammen, og hvor en agent, der bare skriver videre, kommer til at vælge på
andres vegne.

### F1 — nævneren 31 står i metodesiden, men skemaet har 33 felter

Metodesiden, jeg netop har skrevet, offentliggør `udfyldte felter ÷ 31`. **Målt:**
`data/robots/*.yaml` har **33 feltnøgler** under `felter:`, og `tools/skema.mjs:191` siger det
selv i en kommentar. Forskellen er præcis opgjort: koden deler `mål stående` i længde, bredde
og højde (+2) og `driftstemperatur` i nedre og øvre (+1), og har intet felt for `mål
sammenfoldet` (−1). 31 + 2 + 1 − 1 = 33.

`tools/build.mjs` viser i dag begge nævnere (29 og 31) på hver post. To procenttal ved siden
af hinanden er ikke en rangering, en læser kan bruge, og en metodeside, der offentliggør en
tredje værdi, gør det værre. **Enten skal skemaet tælle 31 felter, eller også skal L19
genbesøges.** Metodesiden kan ikke udgives, før de to er enige.

### F2 — ANYmal X tæller ét felt for lavt efter L20

L20 siger, at et felt tæller ved type uden model, men markeres. `anybotics-anymal-x.yaml`
gemmer LiDAR-feltet som `vaerdi: ikke_oplyst` med advarslen *"type uden model. Taeller ikke
under D4"* — skrevet før beslutningen. Posten måler derfor **4 af 31 (13 %)**, hvor L20 giver
**5 af 31 (16 %)**. Metodesiden bruger ANYmal X som sit hovedeksempel og skriver 13 %; rettes
YAML-filen, skal tallet på metodesiden rettes samme dag. Der kan ligge flere felter i samme
tilstand på andre poster.

### F3 — "næstlaveste tæthed" holder ikke længere

`fund/FUND-vest.md` skriver, at ANYmal X har *"den næstlaveste specifikationstæthed i hele
indsamlingen"*. Det var sandt for vest-indsamlingens 19 poster. **Målt på de 46 poster, der
ligger i kataloget nu** (nævner 31, felttype uden model talt med): fem poster står på 0 %
(Spirit 40, Laikago, AlphaDog E300, AlphaDog E400L, BabyAlpha), RIVR ONE på 6 % og RAIBO2 på
10 %. ANYmal X er nummer otte fra bunden. Pointen — at feltets stærkest certificerede robot
ligger i bunden af sidens eneste rangering — holder stadig. Ordet *næstlaveste* gør ikke, og
metodesiden skriver derfor "i bunden af kataloget" og et målt tal med dato.

### F4 — tæller et dokumenteret nej med i tætheden? Metodesiden siger ja, og det er ikke besluttet

`fund/FUND-kina-4-weilan-xiaomi-oevrige.md` (N4) stiller spørgsmålet og lader det stå åbent: et
udtrykkeligt *nej* er et svar, men om det **tæller som udfyldt**, er ikke afgjort. Det flytter
CyberDog 2 mellem 48 % og 55 % i den opgørelse.

Både dokumentets egen tælleregel og koden svarer i dag ja: `tools/validate.mjs` (`erUdfyldt`)
tæller `nej` med. **Målt:** 11 felter i kataloget står som `nej`, fordelt på 10 poster. To af
dem er CE-felter, altså netop de felter, hvor forskellen mellem et dokumenteret nej og tavshed
betyder mest. Metodesiden offentliggør reglen som den er implementeret. Bliver svaret et
andet, skal både koden og metodesiden rettes samme dag.

---

## Om STATUS.md

`STATUS.md` i denne gren slutter ved **L15**. Beslutningerne L19, L20, L21 og L25, som
metodesiden offentliggør, står ikke i filen — de er givet mig som opgavetekst. `KRITIK-1-plan.md`
foreslår desuden *L19* brugt til et helt andet punkt (informationsarkitekturen).

**Metodesiden nævner med vilje ingen L-numre.** Den offentliggør reglerne, ikke vores
beslutningshistorik, så nummerkollisionen kan ikke slå igennem på en udgivet side. Men den
skal lukkes i STATUS.md, før nogen skriver videre på tætheden: L19-L28 skal skrives ind med
dato og begrundelse, og de punkter, de afløser (D1, D4, D7, Å6), skal markeres som lukkede.
