# Ordbog

Ordene fra katalogets felter, forklaret så de kan bruges i en indkøbsbeslutning. Hvert opslag
slutter med, hvad ordet betyder, når der skal skrives en indstilling.

Linjen under hvert opslag viser, hvor mange af katalogets 46 poster der oplyser feltet.

<!-- DÆKNINGSTAL MÅLT 21. AUGUST 2026 PÅ 46 POSTER. Genmål før udgivelse. -->

---

## Bevægelse og last

### Frihedsgrader (DoF)

*Oplyst på 17 af 46 poster.*

Antallet af led, robotten kan bevæge uafhængigt af hinanden. Tolv er det almindeligste tal i
kataloget, altså tre pr. ben, hvis de fordeler sig ligeligt. De hjulforsynede varianter står
med 16, og et par modeller med 13 eller 17.

**Ved et indkøb:** tallet er ikke et mål for, hvor godt robotten går. En variant med 16
frihedsgrader har ikke ben, der kan mere end en med 12 — den har noget mere at bevæge. Brug
tallet til at forstå, hvad maskinen består af, og ikke som en rangering.

### Nyttelast, gående og stående

*Gående nyttelast er oplyst på 36 af 46 poster, stående på 13.*

To forskellige tal, som ofte forveksles. **Gående nyttelast** er, hvad robotten kan bære,
mens den går. **Stående nyttelast** er, hvad den kan bære uden at flytte sig.

Unitree B2 oplyser begge: `> 40 kg` gående og `≥ 120 kg` stående. Boston Dynamics Spot
oplyser ét tal: 14 kg. Sammenlignes 120 mod 14, er B2 ni gange stærkere. Sammenlignes de to
gående tal, 40 mod 14, er den tre gange stærkere.

**Ved et indkøb:** det er den gående nyttelast, der svarer til en driftsopgave. Kataloget
filtrerer og sorterer kun på den, og den stående står med sin egen etiket. Får du et tal fra
en sælger, så spørg hvilket af de to det er.

### Trinhøjde og forhindringshøjde

*Kontinuerligt trappetrin er oplyst på 15 af 46 poster, enkelt forhindring på 13.*

Også to tal. **Enkelt forhindring** er den højeste kant, robotten kan komme over én gang.
**Trappetrin, kontinuerligt** er, hvad den kan gå op ad trin efter trin.

Unitree B2 oplyser 40 cm som enkelt forhindring og 20-25 cm som kontinuerlig trappegang.
Spot oplyser 300 mm. Stiller man 40 cm mod 30 cm, vinder B2. Stiller man de to
sammenlignelige tal op, 20-25 cm mod 30 cm, vinder Spot. Samme to robotter, samme kilder,
modsat resultat.

**Ved et indkøb:** en trappe i en produktionsbygning er kontinuerlig. Det er det tal, der skal
op mod trinhøjden på stedet — mål den, før du sammenligner.

---

## Strøm

### Batteri i wattimer (Wh)

*Oplyst på 13 af 46 poster.*

Wattimer er den mængde energi, batteriet indeholder. Nogle producenter oplyser i stedet
spænding og amperetimer, for eksempel `7,4 V 1000 mAh`. De to ganget sammen giver
wattimerne, men så er tallet vores udregning og ikke producentens, og det står markeret som
sådan.

**Ved et indkøb:** Wh sammen med den oplyste driftstid viser, hvor hårdt robotten trækker.
Uden lastbetingelsen på driftstiden kan de to tal ikke sammenlignes på tværs af modeller.

### Driftstid og lastbetingelse

*Oplyst på 24 af 46 poster.*

Hvor længe robotten kører på en opladning. Tallet er kun brugbart med den last, det er målt
ved. Unitree B2 oplyser `> 5 t` uden last og `> 4 t` med 20 kg, og samme side skriver også
`Battery Life 4-6h`.

**Ved et indkøb:** en driftstid uden lastbetingelse er ikke et tal, du kan planlægge en vagt
efter. Kataloget viser lastbetingelsen ved siden af tallet, eller markerer at den mangler.

### Hot-swap

*Oplyst på 7 af 46 poster.*

At batteriet kan skiftes, uden at robotten slukkes. Uden hot-swap er robotten ude af drift,
mens den lader.

**Ved et indkøb:** det her afgør, om en rundering kan køre videre efter fire timer, eller om
den holder pause i ladetiden. Er svaret vigtigt for opgaven, skal det stå skriftligt: 39 af
46 poster i kataloget skriver ikke noget om det.

### Dockingstation

*Oplyst på 14 af 46 poster.*

En ladestation, robotten selv kan køre til og lade i.

**Ved et indkøb:** en dockingstation er forudsætningen for drift uden en person til stede.
Elleve poster oplyser, at den findes, og tre svarer udtrykkeligt *nej*. Et nej er et brugbart
svar. Det er noget andet end tavshed, som er svaret på de øvrige 32.

---

## Sensorer og styring

### IP-klasse

*Oplyst på 23 af 46 poster.*

To cifre, der beskriver, hvor tæt kabinettet er. Det første ciffer gælder støv og faste
genstande, det andet vand. Klasserne er defineret i standarden IEC 60529. Vi gengiver
producentens klasse, som den står, og regner ikke om mellem klasser.

ANYmal X står med IP67. Unitree As2 oplyser ingen IP-klasse på grundvarianten, mens
PRO-varianten står med IP54 — samme model, forskellige udgaver.

**Ved et indkøb:** spørg til varianten og ikke til modellen. Og bemærk, at IP-klassen gælder
robotten, ikke den nyttelast, du monterer på den.

### LiDAR

*Oplyst på 4 af 46 poster.*

En sensor, der måler afstand med laser og danner et punktbillede af omgivelserne. Mange
producenter skriver en type uden at oplyse en model, for eksempel `3D LiDAR ×1`. Sådan et
felt tæller som besvaret i kataloget, men det markeres, så du kan se, at modellen mangler.

**Ved et indkøb:** uden modelnavn kan hverken rækkevidde, opløsning eller pris på en
reservedel slås op. Det er også der, en integrator får brug for at spørge først.

### SLAM

Samtidig kortlægning og positionsbestemmelse: robotten tegner et kort over et ukendt område
og finder samtidig sin egen plads i det. SLAM er ikke et selvstændigt felt i kataloget — hvor
producenten nævner det, står det i beskrivelsen af autonominiveauet.

**Ved et indkøb:** SLAM er det, der afgør, om anlægget skal forberedes med markører og
faste ruter, eller om robotten kan sættes ind i et område, den ikke kender. Spørg, hvad
kortet kræver, og hvad der sker, når anlægget bygges om.

### Teleop og autonominiveau

*Oplyst på 12 af 46 poster.*

**Teleop** er fjernstyring: et menneske kører robotten på afstand og træffer beslutningerne.
Trinnene derfra går over rundering efter faste punkter til selvstændig kørsel, hvor robotten
selv vælger vej. Producenterne beskriver niveauet med ord, ikke med tal, og kataloget gengiver
ordene.

**Ved et indkøb:** teleop kræver en person pr. robot og en forbindelse, der holder. Det er
forskellen på en maskine, der sparer et gå-ben, og en maskine, der sparer en vagt. Regn med
det ene, og køb det andet, og forretningen holder ikke.

### ROS 2

*Oplyst på 4 af 46 poster.*

Robot Operating System 2, et udbredt sæt værktøjer og standarder til robotsoftware. Understøtter
en robot ROS 2, kan den tale med systemer og sensorer, der er skrevet til samme økosystem.

**Ved et indkøb:** ROS 2 afgør, hvor let din egen udvikler eller en integrator kan bygge oven
på maskinen. Fire poster i kataloget skriver det direkte. Skriver producenten ingenting, er
svaret ukendt, og det er et spørgsmål, der bør stilles skriftligt inden købet.

### SDK

*Oplyst på 6 af 46 poster.*

Udviklingsværktøjer og programmeringsgrænseflader, producenten stiller til rådighed, og de
sprog de findes i.

**Ved et indkøb:** et lukket SDK betyder, at alt, hvad robotten skal kunne, skal købes hos
producenten. Det er en driftsomkostning, der ikke står i prisen.

---

## Regler og mærkning

Afsnittet her gengiver, hvad reglerne siger, med henvisning til teksten. Det er ikke juridisk
rådgivning, og det siger ikke noget om, hvad der gælder for en bestemt anskaffelse.

### CE

*To poster oplyser CE. To står med et dokumenteret nej. De øvrige 42 skriver ingenting.*

Katalogfeltet hedder **CE oplyst** og handler om, hvad producenten selv skriver på sin egen
side. *Oplyst* er ikke det samme som *har CE*: vi har ikke set et certifikat, og vi
kontrollerer ikke overensstemmelseserklæringer. *Ikke oplyst* betyder heller ikke, at
maskinen mangler CE — kun at producenten ikke skriver noget om det.

**Ved et indkøb:** brug feltet til at se, hvem der siger noget, og bed derefter om
dokumentationen selv. BEK nr. 727 af 13. juni 2024 kræver brugsanvisning,
sikkerhedsoplysninger, advarsler og EU-overensstemmelseserklæring **på dansk** (§§ 3, 4 og 6).
Kravet er dansk, ikke et vilkårligt EU-sprog.

### ATEX og IECEx

To ordninger for materiel, der skal bruges, hvor der kan være eksplosiv atmosfære. ATEX er
europæisk, IECEx er den internationale ordning.

**Zonen beskriver området, ikke robotten.** Zonerne er defineret i ATEX-arbejdsmiljødirektivet
1999/92/EF, bilag I, og det er arbejdsgiveren, der klassificerer sit eget område:

| Zone | Ordlyden i 1999/92/EF, bilag I |
|---|---|
| **Zone 0** | *"Område, hvor der uafbrudt eller i lange perioder eller ofte forekommer eksplosiv atmosfære…"* |
| **Zone 1** | *"Område, hvor det kan forventes, at der ved normal drift lejlighedsvis forekommer eksplosiv atmosfære…"* |
| **Zone 2** | *"Område, hvor det ikke forventes, at der ved normal drift forekommer eksplosiv atmosfære…, eller hvis dette sker, da kun i korte perioder."* |

Zone 20, 21 og 22 er de samme tre trin for støv i stedet for gas.

**Bogstaverne forklarer vi ikke.** ANYbotics skriver om ANYmal X: `ATEX & IECEx certified up
to Zone 1 IIB`. Gasgrupperne IIA, IIB og IIC står ikke i direktivet, men i standardserien
EN IEC 60079, som er betalingsbelagt, og som vi ikke har læst. De frit tilgængelige
gengivelser modsiger hinanden på, hvilke gasser der hører til hvilken gruppe. Derfor gengiver
kataloget producentens tekst ordret og oversætter den ikke.

**Ved et indkøb:** zoneklassifikationen af dit eget område er arbejdsgiverens ansvar, ikke
robotproducentens. Det er den klassifikation, producentens papir skal holdes op imod, og
sammenligningen hører hos den, der har ansvaret for anlægget.

### Specifikationstæthed

Hvor mange af katalogets 31 felter producenten selv oplyser, som en procentdel. Det er
katalogets eneste tal på tværs af robotter.

**Ved et indkøb:** tallet måler producentens åbenhed, ikke robottens kvalitet og ikke dens
egnethed. Regnestykket og dets grænser står på [metodesiden](../metode/).
