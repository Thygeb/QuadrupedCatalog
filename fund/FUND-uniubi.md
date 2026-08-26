# FUND: har Uniubi firbenede robotter?

**DOM: Ja, tilføjes — og er allerede tilføjet.** Uniubi (宇泛/Yufan Intelligent, uniubi.com) sælger
præcis én firbenet robot, "灵猫·Cyvet", og den findes allerede i kataloget som
`data/robots/yufan-lingmao-cyvet.yaml` (commits `9e349b2` og `a669895`, begge allerede på denne
gren før dette spor startede). Der er **ikke** tilføjet en ny fil i dette spor — se
"Fælde" nedenfor for hvorfor.

## Kandidattabel

| Navn | URL | Hentet | Firbenet? | Reelt produkt? | Inden for scope? | Dom |
|---|---|---|---|---|---|---|
| 灵猫·Cyvet (Lingmao Cyvet) | https://www.uniubi.com/shop/buy?product=max (og /embodied-ai/robot) | 2026-08-24 (eksisterende post) + 2026-08-26 (dette spor, uafhængig gentagelse) | Ja — egen navigation kalder produktet 四足机器人, uafhængig presse (163.com/sohu.com/sina.com.cn) omtaler det som 机器狗/四足机器人 | Ja, med forbehold — fast pris ¥15.999, købs-/reservationsflow, batch-forsendelse efter ordre, uafhængig presse om en offentlig 720°-salto-demo (WAIC 2026). Producentens EGEN bundtekst kalder specifikationerne "工程样机" (ingeniør-præproduktionseksemplar)-tal, ikke endelige — derfor status `annonceret`, ikke `i_produktion` | Ja — ikke legetøj/hobby/undervisningskit (L11): 15 kg, industriel 20 kg nyttelastplatform, valgfri NVIDIA Jetson Orin op til 157 TOPS, officiel C++/Python-SDK, samme prisklasse som allerede-optagne CyberDog/Unitree Go2 | **Allerede tilføjet** |

Ingen andre firbenede modeller fundet på uniubi.com — kun compute-varianter (Orin Nano/NX) af samme
fysiske robot, ikke separate modeller.

## Hvad der skete i dette spor

Jeg researchede Uniubi fra bunden (uniubi.com, shop/buy-siden, embodied-ai/robot-siden, pressekilder
om WAIC 2026-saltoen) og skrev en fuld 30-feltspost, **uden at tjekke om robotten allerede lå i
kataloget under et andet navn**. Den fandtes: `data/robots/yufan-lingmao-cyvet.yaml`, forfattet
24.-25. aug under producentens EGET selskabsnavn (Yufan/宇泛) i stedet for hjemmesidens brandnavn
(Uniubi). Min duplikat (`uniubi-cyvet.yaml`) er slettet, aldrig committet.

Den eksisterende post er mere grundig end min egen uafhængige research på flere punkter:
- **Status**: jeg satte `i_produktion`; den eksisterende post fandt (og jeg havde overset)
  producentens egen bundtekst om "工程样机"-forbehold og satte korrekt `annonceret`.
- **ros2**: jeg satte `ikke_oplyst`; den eksisterende post fandt en fungerende ROS 2-pakke på
  producentens GitHub (github.com/uniubi-ai) med reelle topics, og satte `ja` (sekundær kilde).
- **monteringsinterface**: udfyldt i den eksisterende post, `ikke_oplyst` i min.

Til gengæld nåede begge uafhængige researchrunder identiske tal på: egenvægt (~15 kg), mål
(672×355×432 mm), nyttelast (~20 kg), hastighed (0-3 m/s), trappetrin (17 cm), IP-klasse (IP54,
kun tilkøbt variant), temperatur (-10 til 50 °C), batteri (432 Wh), driftstid (3,5 t ved 15 kg),
hot-swap (ja), pris (¥15.999), sdk_sprog (C++, Python) — stærk uafhængig krydsbekræftelse af den
eksisterende posts talgrundlag.

## Konfidensniveau

- **At Uniubi kun har én firbenet robot, og den allerede er i kataloget**: Høj.
  Kommando: `ls data/robots/ | grep -i "yufan\|uniubi\|cyvet"` → `yufan-lingmao-cyvet.yaml`.
  Kontrafaktisk: var robotten IKKE optaget, ville kommandoen ikke give noget resultat.
- **At den eksisterende posts talgrundlag er korrekt**: Middel. Krydsbekræftet på ni felter ved
  uafhængig gentagelse af researchen, men ikke feltvis efterprøvet mod kilden for de resterende
  ~20 felter (det var ikke min post at selv-tjekke — den blev skrevet af et tidligere spor).

## Usikkerheder

- Selskabsidentiteten (Uniubi = Universal Ubiquitous AI Co., Ltd. = 杭州宇泛智能) er sandsynliggjort
  af begge researchrunder uafhængigt, men ikke bekræftet med ét dokument, der nævner alle tre navne
  samtidig.
- "annonceret" vs. "i_produktion": et reelt grænsetilfælde — producenten tager betalte ordrer og
  forsender efter kapacitet, men fastholder selv et præproduktions-forbehold på alle tal. Den
  eksisterende post gør den rigtige, konservative læsning.

## Målingerne

`node tools/validate.mjs`: 77 filer, 0 fejl, 1 advarsel (uændret — ingen ny robotfil tilføjet).

## Nye fælder og opdagelser

**Den dyreste fælde i hele sporet.** Briefet sagde spørgsmålet "aldrig var afgjort" — det var det,
bare under et andet navn. Jeg brugte ca. en times research (WebFetch af 6+ sider, byggede en fuld
30-feltspost) på at genopdage noget, `grep -ri "cyvet\|uniubi\|lingmao\|yufan" data/robots/` ville
have fundet på ti sekunder. Global CLAUDE.md's regel "se efter hvad der allerede findes, før du
planlægger" gælder tydeligvis ikke kun skills og STATUS.md-beslutninger — den gælder navngivne
emner i selve datasættet, også når producentens hjemmesidenavn (Uniubi) og det navn, en tidligere
agent valgte at bruge (Yufan/producentens juridiske navn), er to forskellige strenge. **Lære for
enhver fremtidig "skal X tilføjes?"-opgave: grep bredt efter ALLE kendte navne for emnet
(brand, juridisk navn, produktnavn, transskription) i data/robots/ FØR research startes forfra.**

En sekundær, mindre fælde: min egen grundmåling ved sporets start ("77 fil(er), 0 fejl") var
faktisk korrekt og identisk med orkestratorens — fordi `yufan-lingmao-cyvet.yaml` allerede talte
med i de 77. Der var altså ingen afvigelse at reagere på; problemet var udelukkende, at jeg ikke
tjekkede navnet før jeg begyndte at bygge en ny fil.

## Punkter i briefet, jeg ikke nåede

Ingen — Uniubi-spørgsmålet er besvaret (var allerede besvaret), og tabellen/dommen er leveret.
