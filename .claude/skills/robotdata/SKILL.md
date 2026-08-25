---
name: robotdata
description: Indsaml, udfyld eller efterprøv en robotpost i quadruped-oversigten. Brug den hver gang en firbenet robot skal tilføjes, opdateres eller kontrolleres — den bærer 30-feltsskemaet, de ti hårde regler om kilder og operatorer, og det obligatoriske selv-tjek med tælling. Bruges også af agenter, der indsamler data i en worktree.
user-invokable: true
argument-hint: "[producent model] eller [efterprøv <fil>]"
---

# Robotdata

Én robot = én YAML-fil i `data/robots/`. Denne skill er det, der gør en post
**efterprøvelig** frem for blot udfyldt.

Læs [DATAMODEL.md](../../../DATAMODEL.md) for begrundelserne bag skemaet. Reglerne
nedenfor er destillatet; hver enkelt er lært på en rigtig robot, ikke opfundet.

---

## To veje ind i data, siden L35 (25. aug 2026)

Data findes nu to steder: `data/robots/*.yaml` (git, sandheden agenterne arbejder mod) og
en Supabase-database (redaktionslag, L34). Siden L35 kan JPK også rette direkte i
**Supabase Studio** — det er JPK's vej, ikke agenternes.

**Agenternes egen arbejdsgang er UÆNDRET.** En agent, der indsamler eller retter en
robotpost, redigerer stadig `data/robots/<slug>.yaml` i sin egen worktree, som hidtil —
aldrig databasen direkte. Intet i denne skill ændrer sig for det arbejde.

Retter JPK i Studio, skal rettelsen hentes hjem, før nogen kører en migrering:

```
node db/eksporter.mjs --fra-db --ud=data/robots
```

...og resultatet committes som almindelige YAML-ændringer. `db/migrer.mjs --til-db`
**nægter selv at køre**, hvis databasens indhold afviger fra `data/robots/` uden at
være hentet hjem først — det er den mekaniske vagt (se `db/LAESMIG.md`), ikke en
formaning. Vagten kan omgås bevidst med `--overskriv-databasen`, som kasserer
Studio-rettelsen og skriver YAML'en ind i stedet — brug den kun, når det er meningen.

**Eksporten validerer sig selv, før den rører `data/robots/`.** `db/eksporter.mjs`
skriver ikke længere direkte ind i `udMappe` — den skriver først til en midlertidig
mappe, kører `tools/validate.mjs` PÅ DEN, og flytter kun filerne ind, hvis
valideringen er fejlfri. Bryder en Studio-rettelse en regel (forkert enhedstype,
manglende kilde, ugyldig operator, …), stopper kommandoen med `EKSPORT AFVIST:
validatoren fandt <M> fejl …`, validatorens egne fejllinjer og `<udMappe> er IKKE
ændret.` — og `data/robots/` står urørt. **Advarsler blokerer ikke:** en kendt
advarsel (fx R9 på `ghost-robotics-vision-60`) slipper igennem uændret, ligesom den
altid har gjort. Ret fejlen i Studio og kør kommandoen igen.

---

## De ti hårde regler

Brud på disse gør posten ubrugelig — ikke ufuldstændig, ubrugelig, fordi en post man ikke
kan stole på er værre end ingen post.

1. **Opfind aldrig et tal.** Mangler en oplysning: `ikke oplyst`. Et plausibelt gæt er
   værre end et tomt felt, fordi det ikke kan skelnes fra en måling.
2. **Hvert tal skal have `kilde` (URL) og `hentet` (dato).** Uden kilde er tallet ikke
   indsamlet, det er husket.
3. **Producentens egen side er primærkilden.** En sekundær kilde skal mærkes
   `kildetype: sekundaer`, så det senere kan besluttes, om de overhovedet må tælle med.
4. **Bevar producentens operator.** Skriver de `> 40kg`, er værdien 40 med `operator: ">"`.
   Skriver de `≈ 60kg`, er operatoren `~`. Gemmer man kun tallet, forvandler man
   producentens forbehold til vores præcision.
5. **Bevar intervaller som intervaller.** `20~25cm` er ikke 22,5 cm. Gem `min` og `maks`.
6. **Nyttelast er to felter.** `nyttelast_gaaende` og `nyttelast_staaende`. Unitree B2
   oplyser 40 kg gående og 120 kg stående; Boston Dynamics Spot oplyser 14 kg. Blandes de,
   bliver sammenligningen ni gange forkert i stedet for tre.
7. **Trinhøjde er to felter.** `forhindring_enkelt` og `trappetrin_kontinuerlig`. B2
   oplyser 40 cm forhindring, men kun 20-25 cm kontinuerlig trappe. Mod Spots 30 cm
   **vender rangeringen**, alt efter hvilket felt man bruger. Sammenligninger må kun
   bruge den kontinuerlige.
8. **Driftstid uden lastbetingelse er ikke et tal.** Hvert driftstidsfelt bærer
   `ved_last: <kg>` eller `ved_last: ikke oplyst`.
9. **Oplyser producenten både metrisk og imperial, gem begge.** Afviger de mere end
   afrunding tillader, sæt `advarsel:` på feltet. **Ret aldrig stiltiende i en producents
   tal** — Boston Dynamics' egen specside oplyser tilsyneladende længde som
   `110mm (43.3 in)`, hvor 43,3 tommer er 1100 mm.
10. **Tre tilstande, tre værdier.** `ikke oplyst`, `nej` og `0` er forskellige ting og må
    aldrig kollapse til hinanden — hverken i data eller i visningen. Det er der,
    katalogsider lyver.

---

## Feltets form

```yaml
nyttelast_gaaende:
  vaerdi: 40
  enhed: kg
  operator: ">"
  kilde: https://www.unitree.com/b2
  hentet: 2026-08-19

driftstid:
  vaerdi: 4
  enhed: t
  operator: ">"
  ved_last: { vaerdi: 20, enhed: kg }
  kilde: https://www.unitree.com/b2
  hentet: 2026-08-19

laengde:
  vaerdi: 110
  enhed: mm
  vaerdi_imperial: 43.3
  enhed_imperial: in
  kilde: https://bostondynamics.com/products/spot/
  hentet: 2026-08-19
  advarsel: metrisk og imperial afviger med faktor 10 - efterproeves
```

## Billedbaren

Tilføjet af billedport-sporet 24. aug 2026, efter en impeccable-critique fandt at
billedpipelinen ingen kvalitetsport havde (skærmbillede af en app, et forskningsinstituts
logo, en makrodetalje der beskæres blank, indbrændt reklametekst — ingen af dem var
nogensinde håndkontrolleret). Døm hvert `billede:`-felt efter denne bar, med øjne, ikke
kun ved at tjekke at feltet er udfyldt:

**GODKENDT:** hele maskinen er tydeligt hovedmotivet; studio- eller feltfoto; ingen
indbrændt marketingtekst; ingen UI-elementer; motivet overlever et kvadratisk
center-crop (kortene bruger object-fit:cover — et motiv klistret i billedets ene ende
bliver blankt på kortet; vurdér det).

**AFVIST:** logoer, app-skærmbilleder, infografikker med tekst, familiebannere med
flere modeller, makro-detaljer uden hel maskine, indbrændt reklametekst.

Findes intet egnet billede i arkivet (eller kan et fundet billede ikke efterprøves —
fx fordi en billedlæsekvote er opbrugt midt i arbejdet), slet hele `billede:`-blokken
frem for at gætte. Et forkert eller uefterprøvet billede er værre end intet: robotten
falder tilbage til målepladen, ikke til en gætning.

## De 30 felter

**Sandheden er `tools/skema.mjs`.** Listen her er en læsbar gengivelse af den, ikke en
konkurrerende liste. Er de to uenige, har skemaet ret — og så skal listen her rettes,
ikke omvendt. Tæl efter med `node -e "import('./tools/skema.mjs').then(m=>console.log(m.FELTNAVNE.length))"`.

**Fysik (14)** egenvægt · længde · bredde · højde · frihedsgrader ·
nyttelast gående · nyttelast stående · maks. hastighed · maks. hældning ·
forhindring enkelt · trappetrin kontinuerlig · IP-klasse · temp\_min · temp\_maks

**Energi (5)** batteri Wh · driftstid + ved_last · hot-swap · ladetid · dockingstation

**Sensorik (6)** LiDAR type og model · kameraer · onboard compute · ROS 2 · SDK-sprog ·
autonominiveau

**Nyttelast (3)** monteringsinterface · strøm ud V/W pr. port · dataporte

**Kommercielt (1)** vejledende pris

**EU (1)** CE oplyst. (L32, 24. aug 2026: tilgængelig i EU, servicepunkt i EU og
leveringstid er fjernet fra skemaet — stod `ikke_oplyst` på samtlige poster.)

**Længde, bredde og højde er tre felter, ikke ét**, og det samme gælder de to
temperaturgrænser. Hver af dem har sin egen `kilde` og `hentet`. Her stod tidligere
*"mål stående L×B×H"* som ét punkt og desuden *"mål sammenfoldet"*, som skemaet
aldrig har haft — det var de to fejl, der gjorde nævneren til 31 i stedet for 33
(L30). **Skemaet har ingen felter til foldemål;** oplyser en producent dem, hører de i
en `advarsel:` på målfeltet, som Xiaomi- og Yobotics-posterne allerede gør det.

Nævneren er 30, ikke 33, siden L32 (24. aug 2026): tre af de fire EU-felter er fjernet
fra skemaet, se listen ovenfor.

Identitetsfelter (slug, navn, producent, land, udgivelse, status, forgænger) skrives af
os og **tæller ikke** i specifikationstætheden. Det samme gælder `anvendelse`, som med
vilje ligger som topnøgle og ikke i `felter` — netop for ikke at flytte nævneren.

---

## Specifikationstæthed

`udfyldte felter ÷ 30`, afrundet til hele procent. Sidens eneste rangering, fordi den
måler producentens åbenhed og ikke vores mening. Nævneren er **skemaets feltantal** og
udledes i koden (`NAEVNER = FELTNAVNE.length`) — skriv den aldrig som et tal.

Målt 24. aug 2026 (efter L32) på alle 55 poster, med D4 = tæl-ikke, som bygget kører i dag:
**Gangben L2 77 % (højeste) · Vision 60 73 % · Spot 67 % · Unitree B2 67 % · ANYmal 33 % ·
ANYmal X 13 % · median 13 af 30.** Fem poster står på 0 %.
Ligger en ny post markant over **77 %**, er det sandsynligvis en fejl — kontrollér, om
sekundære kilder er sneget med ind uden mærkning.

> **De gamle referencetal er ikke forkerte, de er en anden skala — og et tyndere
> datasæt.** Her stod tidligere *"Ghost Vision 60 67 % (højeste) · Spot 61 % ·
> Unitree B2 61 % · ANYmal 30 % · ANYmal X 12 % · median 13 af 33"*, målt 21. aug 2026
> på nævneren 33 og på 46 poster. To ting ændrede sig siden: L32 (24. aug 2026) fjernede
> tre EU-felter (nævner 33 → 30 — se listen ovenfor), og kataloget voksede fra 46 til 55
> poster med bl.a. Genisom Gangben L1/L2 og MOVENEW P1/T1, som nu ligger over det gamle
> "højeste"-mærke. Begge dele flytter tallene; ingen af dem er en fejl i de gamle tal.
> Sammenlign aldrig et tal fra før 24. aug 2026 med et nyt uden at regne om.

> **De endnu gamle referencetal er heller ikke forkerte, de er en tredje skala.** Her
> stod *"Spot 55 % · Unitree B2 48 % · ANYmal 28 %"*, målt 19. aug 2026 på nævneren 29 og
> på et endnu tyndere datasæt. Et tal målt på 29 er ca. 14 % højere end det samme tal på
> 33 — og begge er nu en anden skala end nævneren 30.

**Åbent (D4):** tæller et felt som udfyldt, når producenten oplyser type men ikke model
(`3D LiDAR ×1`)? **L20 besluttede ja, men generatoren gør det ikke** — `build.mjs`
defaulter til `tael-ikke`. Målt: forskellen flytter **16 af 46 pladser** i rangeringen.
Skriv derfor altid, hvilken indstilling et tæthedstal er målt med. Nævneren er den
samme i begge tilfælde; det er tælleren, der flytter sig.

---

## Selv-tjek (obligatorisk)

Når posten er skrevet:

1. Gå den igennem **felt for felt**. Åbn kilden igen for hvert enkelt tal.
2. **Skriv tællingen:** `Efterprøvet N felter, fandt M fejl.` Nul fundne fejl uden en
   tælling er ikke en efterprøvning — det er en fornemmelse.
3. Kontrollér særligt: operatorer bevaret (regel 4), nyttelast ikke blandet (regel 6),
   trinhøjde ikke blandet (regel 7), driftstid har lastbetingelse (regel 8).

## Selv-review (obligatorisk)

Læs posten som en kritisk læser og skriv, hvad du er usikker på:

- Er der felter, der **ser** sammenlignelige ud, men ikke er det?
- Er der tal, der ser for pæne ud til at være målt?
- Oplyser producenten meget, men kun det flatterende? Det er i sig selv en observation,
  der hører til i posten.

## Rapportér ærligt

Hvad nåede du ikke, hvad sprang du over, hvad er du usikker på. En rapport, der kun
indeholder det der lykkedes, kan ikke bruges til at beslutte noget.
