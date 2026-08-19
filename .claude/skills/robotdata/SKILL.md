---
name: robotdata
description: Indsaml, udfyld eller efterprøv en robotpost i quadruped-oversigten. Brug den hver gang en firbenet robot skal tilføjes, opdateres eller kontrolleres — den bærer 29-feltsskemaet, de ti hårde regler om kilder og operatorer, og det obligatoriske selv-tjek med tælling. Bruges også af agenter, der indsamler data i en worktree.
user-invokable: true
argument-hint: "[producent model] eller [efterprøv <fil>]"
---

# Robotdata

Én robot = én YAML-fil i `data/robots/`. Denne skill er det, der gør en post
**efterprøvelig** frem for blot udfyldt.

Læs [DATAMODEL.md](../../../DATAMODEL.md) for begrundelserne bag skemaet. Reglerne
nedenfor er destillatet; hver enkelt er lært på en rigtig robot, ikke opfundet.

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

## De 29 felter

**Fysik (10)** egenvægt · mål stående L×B×H · mål sammenfoldet · frihedsgrader ·
nyttelast gående · nyttelast stående · maks. hastighed · maks. hældning ·
forhindring enkelt · trappetrin kontinuerlig · IP-klasse · driftstemperatur fra/til

**Energi (5)** batteri Wh · driftstid + ved_last · hot-swap · ladetid · dockingstation

**Sensorik (6)** LiDAR type og model · kameraer · onboard compute · ROS 2 · SDK-sprog ·
autonominiveau

**Nyttelast (3)** monteringsinterface · strøm ud V/W pr. port · dataporte

**Kommercielt og EU (5)** vejledende pris · tilgængelig i EU · CE oplyst ·
servicepunkt i EU · leveringstid

Identitetsfelter (slug, navn, producent, land, udgivelse, status, forgænger) skrives af
os og **tæller ikke** i specifikationstætheden.

---

## Specifikationstæthed

`udfyldte felter ÷ 29`, afrundet til hele procent. Sidens eneste rangering, fordi den
måler producentens åbenhed og ikke vores mening.

Målt 19. aug 2026 som reference: **Spot 55 % · Unitree B2 48 % · ANYmal 28 %.**
Ligger en ny post markant over 55 %, er det sandsynligvis en fejl — kontrollér, om
sekundære kilder er sneget med ind uden mærkning.

**Åbent spørgsmål (D4):** tæller et felt som udfyldt, når producenten oplyser type men
ikke model (`3D LiDAR ×1`)? Indtil det er afgjort: tæl det **ikke** med, og notér det.

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
