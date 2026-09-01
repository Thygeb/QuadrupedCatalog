# Metode

Denne side er reglerne, kataloget er bygget efter. Den står her, fordi et katalog uden
offentlig metode ikke kan efterprøves, og et tal, der ikke kan efterprøves, er en påstand.

Alle tal på siden er producenternes egne. Vi har ikke haft en eneste af robotterne i hånden.

<!-- ALLE MÅLTE TAL PÅ DENNE SIDE ER MÅLT 21. AUGUST 2026 PÅ 46 POSTER.
     Genmål før udgivelse — kataloget vokser, og tallene ændrer sig med det. -->

---

## Hvad vi ikke gør

- **Vi tester ikke.** Ingen af robotterne har været igennem en prøve hos os.
- **Vi måler ikke.** Vi vejer ikke, vi kører ikke, vi tager ikke tid.
- **Vi rangerer ikke kvalitet.** Ingen karakter fra 1 til 5, ingen "bedst i test",
  ingen anbefaling af en model frem for en anden.
- **Vi modtager ikke penge fra producenterne.** Ingen annoncer, ingen betalt placering,
  ingen affiliate-links.
- **Vi er ikke forhandler.** Der findes ingen forhandleraftale mellem KeyResearch og nogen
  fabrikant. Der er ingen købsknap og ingen prisforespørgsel i en katalogpost.
- **Vi giver ikke juridisk rådgivning.** Vi gengiver, hvad en regel siger, og henviser til
  teksten. Vi konkluderer aldrig, hvad reglen betyder for en bestemt virksomhed eller en
  bestemt maskine.

---

## Hvor tallene kommer fra

**Producentens egen side er primærkilden.** Hvert tal i kataloget bærer en URL og en
hentedato. Uden dem er tallet ikke indsamlet, det er husket, og bygget afviser posten.

**Sekundære kilder tæller med på to betingelser:** de skal ligge på producentens eget
domæne, og de skal kunne dateres. Det gælder datablade i PDF, manualer,
udviklerdokumentation og de datafiler, en produktside selv henter for at vise sine tal.

To eksempler på, hvorfor den regel er nødvendig:

- **Xiaomi CyberDog 2.** Specifikationerne står ikke i produktsidens HTML. De ligger i en
  JavaScript-fil, siden selv henter, og som browseren viser læseren. Læser man kun HTML'en,
  ser posten tom ud. Læser man det, siden faktisk viser, står den med 17 af 33 felter.
  Katalogets midterste post har 13.
- **Boston Dynamics Spot.** Databladet ligger som PDF på producentens eget domæne. Det er
  der, længdemålet er konsistent — se afsnittet om modstridende tal nedenfor.

**Alt andet mærkes.** Stammer et tal fra en kilde uden for producentens domæne, får feltet
mærket *sekundær*, og det tæller ikke med i specifikationstætheden. I dag gælder det tre
felter på Raion RAIBO2 — egenvægt, hastighed og driftstid — som står hos KAIST RaiLab,
laboratoriet der byggede robotten, og ikke hos den virksomhed der sælger den. Uden dem ville
posten være tom for tal, og en tom post ville skjule, at oplysningerne findes. Bare ikke hos
sælgeren.

**Vi henter ikke tal fra forhandlerkataloger, aggregatorer eller markedsrapporter.** Vi har
prøvet dem af, og i en lille stikprøve fandt vi forkerte navne og forkerte tilskrivninger.
De er brugbare til at finde frem til en producent. De er ikke brugbare som talkilde.

**Vi gemmer en kopi af hver kilde, når vi henter den:** adressen, HTTP-svaret, tidspunktet i
UTC og en SHA-256-kontrolsum. Kopien er vores dokumentation for, hvad siden sagde den dag.
Den udgives ikke — det er producentens materiale.

---

## Hentedato og forældelse

Hvert tal bærer den dato, vi hentede det. **Poster, der er over 12 måneder gamle, markeres
synligt.** Uden den markering er et katalog forkert efter et år, uden at nogen kan se det.

En hentedato ændres kun ved at hente siden igen. Vi skriver ikke en ny dato på et gammelt
tal, fordi tallet ser rigtigt ud.

Nogle kilder skifter adresse, hver gang producenten retter et tal — Xiaomis datafil hedder
`specs.74df51bf.js`, hvor bogstavrækken er en kontrolsum af indholdet. Derfor henter vi
produktsiden først og læser adressen ud af den, i stedet for at gemme adressen som en
konstant.

---

## De fire tilstande

Et tomt felt kan betyde fire forskellige ting. De ser derfor forskellige ud i kataloget.

| Tilstand | Hvad den betyder |
|---|---|
| **ikke oplyst** | Producenten skriver intet om feltet. |
| **nej** | Producenten skriver, at robotten ikke har det. |
| **0** | Producenten oplyser værdien nul. Det er et tal, ikke et hul. |
| **oplyst, men kun som billede** | Værdien står på producentens side, men kun inde i et billede. Vi kan læse den med øjnene. Vi kan ikke citere den maskinelt, og vi kan ikke se, om den er ændret, uden at kigge på billedet igen. |

**0 er et tal.** MAB Honey Badger 4.0 har nedre driftstemperatur `0 °C`. Robotten virker ned
til frysepunktet. Det er noget helt andet end en robot, hvor tallet ikke er oplyst.

**Nej er et svar.** Xiaomi CyberDog 2 står med *nej* i CE-feltet. Producenten oplyser sine
standarder — GB 17625.1-2012, GB 4943.1-2011, GB/T 9254.1-2021, batteristandarden
GB31241-2014 og UN38.3 — og CE er ikke iblandt dem. Det er et dokumenteret nej, ikke et hul.

**Og nul er ikke altid nul.** Samme robots produktdata på producentens side angiver prisen
som `0` sammen med feltet `is_enable: false`. Det betyder, at der ikke er sat en pris, ikke
at robotten er gratis. Prisfeltet står derfor som *ikke oplyst*. At skrive 0 ind ville være
den fejl, hele afsnittet handler om.

Tilstanden *oplyst, men kun som billede* findes i skemaet, fordi vi er stødt på den. Ingen
post i kataloget bruger den i dag.

Det her er ikke en detalje. Målt på de 46 poster, der ligger i kataloget nu, er 543 af 1426
feltpladser udfyldt. **De øvrige 883 står som *ikke oplyst***. Det er ikke undtagelsen, det
er den hyppigste tilstand i kataloget, og den skal kunne læses som en oplysning i sig selv.

---

## Vi bevarer producentens egne ord

**Operatoren følger med tallet.** Skriver Unitree `> 40 kg` om B2's gående last, står der
`> 40 kg` i kataloget. Gemmer man kun tallet, forvandler man producentens forbehold til vores
præcision. Samme robot oplyser `≥ 120 kg` stående. Begge tegn er producentens.

**Intervaller bliver ved med at være intervaller.** `20-25 cm` er ikke 22,5 cm. Vi gemmer
begge ender.

**Enheder oversættes ikke.** Metrisk er det primære. Oplyser producenten både metrisk og
imperialt, gemmer vi begge tal, som de står.

---

## Når producentens egne tal modsiger hinanden

**Vi retter ikke i en producents tal. Vi noterer modsigelsen.**

Boston Dynamics Spot er det tydeligste eksempel. Produktsidens specifikationer angiver
længden som `110mm (43.3 in)`. 43,3 tommer er 1100 mm, så de to halvdele af producentens
egen linje afviger med en faktor 10. Databladet på samme domæne skriver 1100 mm og er
konsistent med sit eget imperiale tal.

Kataloget bruger databladets tal, og modstriden står på posten med begge kilder, så du kan
se, hvorfor. Vi skriver ikke stiltiende det ene tal om til det andet.

Modsigelser mellem metrisk og imperialt i samme felt fanges maskinelt. Afviger de to tal mere
end 2 %, eller mere end afrundingen af producentens egne decimaler tillader, hvis det er
mere, standser bygget med robottens navn og feltets navn. Vi er stødt på den slags modsigelse
flere gange under indsamlingen, så kontrollen er ikke teoretisk.

---

## Specifikationstæthed

Kataloget har ét tal, der stilles op på tværs af robotter:

> **specifikationstæthed = udfyldte felter ÷ 33**

Nævneren er 33, fordi skemaet har 33 felter. Ikke 33 fordi vi synes, men fordi det er
antallet af felter, generatoren faktisk tæller op, og antallet hver eneste datafil skriver.
Tælleren og nævneren kommer fra den samme liste; det er hele pointen.

De 33 felter er:

- **Fysik (14):** egenvægt · længde · bredde · højde · frihedsgrader ·
  nyttelast gående · nyttelast stående · maks. hastighed · maks. hældning · enkelt forhindring ·
  trappetrin kontinuerligt · IP-klasse · driftstemperatur fra · driftstemperatur til
- **Energi (5):** batteri i Wh · driftstid med lastbetingelse · hot-swap · ladetid · dockingstation
- **Sensorik og autonomi (6):** LiDAR · kameraer · onboard compute · ROS 2 · SDK-sprog ·
  autonominiveau
- **Nyttelast og udvidelser (3):** monteringsinterface · strøm ud · dataporte
- **Kommercielt (1):** vejledende pris
- **Regulatorisk (4):** CE oplyst · FCC oplyst · UL oplyst · CCC oplyst — feltet hedder
  internt stadig gruppen "eu" (skemaets `gruppe: 'eu'`, uændret siden CE var den eneste),
  men kun CE er en EU-mekanisme. FCC er amerikansk, UL er nordamerikansk, CCC ("3C") er
  kinesisk. Gruppenavnet i koden er ikke rettet endnu — se rettelsesnoten nedenfor.

Identitetsfelterne — navn, producent, land, status, årstal — skriver vi selv. De tæller ikke
med, hverken i tælleren eller i nævneren. Det samme gælder **anvendelse**: den er
producentens egen hylde, ikke en specifikation, producenten kan vælge at oplyse.

**Længde, bredde og højde er tre felter, ikke ét.** Hver af dem har sin egen kilde og sin
egen hentedato, og en producent, der oplyser længden men ikke bredden, har oplyst ét felt.
Det samme gælder de to temperaturgrænser. Slår man dem sammen til "mål (L×B×H)" og
"driftstemperatur (fra/til)", får man 31 — og det er præcis den fejl, nævneren har
båret rundt på. Se rettelsesnoten nedenfor.

> **Rettet 21. august 2026.** Her stod tidligere `÷ 31`, og feltlisten opremsede
> *"mål sammenfoldet (L×B×H)"* — et felt, skemaet aldrig har haft, og som ingen robot
> derfor kunne udfylde. Tre datafiler siger det selv i deres egne noter: *"Skemaet har
> ingen felter til foldemål."* En nævner med et felt, der aldrig kan udfyldes, trækker
> hver eneste robot ned med et fast beløb og måler ikke længere producentens åbenhed.
> Sammen med sammenlægningen af L×B×H og af de to temperaturgrænser gik de to fejl
> næsten lige op: 31 i stedet for 33.
>
> **Rækkefølgen er uændret.** Vi har regnet alle 46 poster igennem på både 29, 31 og 33
> og sammenlignet listerne element for element: **0 af 46 robotter skifter plads.** En
> nævner, der er den samme for alle, kan matematisk ikke ændre en rangering — den flytter
> kun niveauet. Til gengæld er de gamle procenttal ikke sammenlignelige med de nye:
> et tal målt på 29 er ca. 14 % højere end det samme tal på 33. **Alle tætheder oplyst
> før 21. august 2026 skal regnes om, ikke omskrives.**

> **Rettet 24. august 2026.** Her stod tidligere `÷ 33`, og EU-gruppen talte fire felter:
> tilgængelig i EU, CE oplyst, servicepunkt i EU og leveringstid. De tre første af dem —
> alle undtagen CE oplyst — er fjernet fra skemaet. Målt direkte i de 55 datafiler, der
> ligger i kataloget i dag: alle tre stod `ikke oplyst` på hver eneste post, nul af 165
> mulige værdier var udfyldt, og det, en producent måtte skrive i dem, ville alligevel
> stå i kilder uden for producentens eget domæne. **CE oplyst er ikke fjernet.** Det er
> den eneste EU-oplysning, skemaet indsamler i dag, og den tælles fortsat med både i
> tælleren og i nævneren. Nævneren går fra 33 til 30, og alle tæthedstal på siden stiger
> med det — anden niveauforskydning på en uge efter rettelsen ovenfor. Rækkefølgen
> ændres ikke af samme grund som dengang: en konstant nævner flytter ingen robot i
> forhold til nogen anden.

> **Rettet 1. september 2026.** Her stod tidligere `÷ 30`. Tre regulatoriske jaNej-felter
> er tilføjet i samme form som CE oplyst: FCC oplyst (USA), UL oplyst (Nordamerika) og
> CCC oplyst (Kina, markedsnavn "3C"). Ingen robotdata er rettet i det spor — hård
> begrænsning 2 forbyder at opfinde et tal for at lukke hullet — så samtlige robotter i
> kataloget går automatisk fra "feltet findes ikke" til dokumenteret *ikke oplyst* på de
> tre nye felter. Det er den forventede tilstand: "ikke oplyst" er det rigtige svar for
> langt de fleste, ikke en mangel ved indsamlingen. Nævneren går fra 30 til 33, og alle
> tæthedstal på siden falder med det — tredje niveauforskydning siden 21. august, denne
> gang i den modsatte retning af L32's stigning ovenfor. Rækkefølgen ændres ikke, af
> samme grund som begge gange før.

### Sådan tælles et felt som udfyldt

1. Producenten oplyser en værdi for netop det felt på sin egen side eller i en kilde på sit
   eget domæne.
2. Værdien bærer enhed, hvor feltet kræver enhed.
3. **Et udtrykkeligt nej er et udfyldt felt.** Producenten har svaret.
4. **Type uden model tæller med, men markeres.** Skriver producenten `3D LiDAR ×1` uden at
   sige hvilken, kan du se på markeringen, at feltet er besvaret uden at være specificeret.

   > **Åbent 21. august 2026 — reglen er besluttet, men generatoren gør det ikke endnu.**
   > Bygget kører som standard med den modsatte regel: type uden model tæller *ikke* med.
   > Forskellen er ikke kosmetisk. Vi har målt den på alle 46 poster: den flytter
   > **16 af 46 pladser** i rangeringen. Tallene på siden er indtil videre opgjort uden
   > type-uden-model. Nævneren er den samme i begge tilfælde, så det er tælleren, der
   > flytter sig.
5. Værdier, der kun står i en HTML-kommentar, tæller ikke. De vises ikke for en læser og er
   derfor ikke offentliggjort.

### Hvad tallet betyder — og hvad det ikke betyder

**Tætheden måler producentens åbenhed. Den måler ikke robottens kvalitet, og den måler ikke,
om robotten passer til din opgave.**

Den måler også forretningsmodel. En producent, der sælger til udviklere, *skal* oplyse
kortmodel og batterispænding, ellers kan kunden ikke bruge maskinen. En producent, der sælger
gennem en sælger og et møde, behøver det ikke. Forskellen på de to tal er ikke et mål for,
hvem der laver de bedste robotter.

**Det tydeligste eksempel er ANYbotics ANYmal X.** Den har den stærkeste europæiske
certificering i kataloget: `ATEX & IECEx certified up to Zone 1 IIB` — det papir, der afgør,
om en maskine overhovedet må ind i et område med eksplosionsfare. Producentens
specifikationsafsnit består til gengæld af én sætning: *"2026 ANYmal X specifications coming
soon."* Tætheden er derfor **4 af 33 felter, 12 %**, og posten ligger i bunden af kataloget.

Sorterer du på tæthed, lander den robot, en dansk procesindustri kan bruge i et
eksplosionsfarligt område, nederst. Tallet er ikke forkert. Det svarer bare på et andet
spørgsmål end "hvilken robot skal vi købe".

Prisen er oplyst på 2 af 46. Det er ikke en mangel ved kataloget. Det er, hvad markedet
offentliggør. Tre EU-felter — tilgængelig i EU, servicepunkt i EU og leveringstid — stod
tomme hos **alle** poster i kataloget og er derfor fjernet fra skemaet (se rettelsesnoten
under Specifikationstæthed ovenfor). CE oplyst er stadig den eneste **EU**-oplysning i
skemaet — to producenter oplyser den, to svarer et dokumenteret nej, resten skriver intet.
Siden 1. september 2026 (se rettelsesnoten) står tre regulatoriske søsterfelter ved siden
af den: FCC oplyst, UL oplyst og CCC oplyst. De er ikke EU-mekanismer og forklares derfor
ikke i dette afsnit, som specifikt handler om CE og EU-reglerne nedenfor.

---

## Hvad der er med i kataloget, og hvad der ikke er

Kataloget dækker firbenede, gående maskiner, som en producent stiller frem som et produkt.

**Legetøj, hobbyrobotter og undervisningskit er ikke med.** Konkret er Sony aibo, Tombot,
Petoi, MangDang, Hiwonder, Yahboom og Elephant Robotics holdt uden for.

To grunde, og den anden er den vigtigste:

1. De svarer på et andet spørgsmål. Et selskabsdyr eller et byggesæt til undervisning har
   hverken nyttelast, IP-klasse eller driftsprofil, og de felter kan aldrig udfyldes.
2. **De ødelægger tætheden som mål.** Et byggesæt til 319 dollars *skal* oplyse kortmodel,
   batterispænding og antal servoer, ellers kan køberen ikke samle det. Da vi målte, oplyste
   Petois Bittle X flere felter end ANYmal X gør. Stod de to i samme liste, ville et byggesæt
   stå over en Zone 1-certificeret inspektionsrobot i sidens eneste rangering.

---

## CE-feltet

Feltet hedder **CE oplyst**, og det er en præcis formulering.

**Feltet siger, om producenten selv skriver noget om CE på sin egen side.** Tre svar er
mulige: producenten oplyser det; producenten oplyser sine standarder, og CE er ikke iblandt
dem (et dokumenteret nej); eller producenten skriver ingenting.

**Oplyst er ikke det samme som *har CE*.** Vi har ikke set et certifikat, vi kontrollerer
ikke overensstemmelseserklæringer, og vi udtaler os ikke om, hvorvidt en bestemt maskine må
tages i brug. Omvendt betyder *ikke oplyst* heller ikke, at maskinen mangler CE — kun at
producenten ikke skriver det.

Målt på de 46 poster: to oplyser CE, to står med et dokumenteret nej, og de øvrige 42 skriver
ingenting om det.

**Vi skriver ikke, hvem der får hvilket ansvar ved et direkte køb.** Det spørgsmål kræver en
primærkilde, vi ikke har kunnet fremskaffe, og vi gætter ikke på det.

### Det, vi gengiver om reglerne

Gengivelse med henvisning, ikke rådgivning:

- **Dokumentation på dansk.** BEK nr. 727 af 13. juni 2024 kræver, at brugsanvisninger og
  sikkerhedsoplysninger er på dansk (§ 3, stk. 1), at informationer og advarsler er på dansk
  (§ 4), og at EU-overensstemmelseserklæringen er på dansk (§ 6). Kravet er dansk, ikke
  "et EU-sprog".
- **Maskinforordningen (EU) 2023/1230 anvendes fra 20. januar 2027.** Datoen kommer af en
  berigtigelse fra 4. juli 2023. Vi har den fra Sikkerhedsstyrelsen, ikke fra EUR-Lex, hvor
  den uberigtigede tekst stadig skriver 14. januar. Vi har ikke selv kunnet hente
  berigtigelsens egen tekst.
- **Maskiner, der er bragt i omsætning efter maskindirektivet inden skæringsdatoen.**
  Forordningens artikel 52, stk. 1, siger, at medlemsstaterne ikke må forhindre, at de gøres
  tilgængelige på markedet. Vi gengiver bestemmelsen; vi læser den ikke for nogen.

Hvad det betyder for en konkret anskaffelse, er et spørgsmål til en rådgiver eller til
myndigheden. Ikke til et katalog.

---

## Fejl

Vi laver fejl, og materialet bag kataloget er blevet efterprøvet af den grund. Ved den
gennemgang blev 152 påstande slået op i de gemte kilder igen, og **17 af dem var forkerte**.
Ingen af fejlene var et producenttal, der var læst forkert. Det var tilskrivninger,
optællinger og to hjembyer, der var skrevet af hukommelsen i stedet for af kilden.

Den slags er grunden til, at hvert tal bærer sin kilde: en fejl, der kan slås op, kan rettes.

Finder du en fejl, så skriv til os. <!-- KONTAKT: Å1 — hverken domæne eller postkasse er
besluttet. Adressen skal ind her, før siden udgives. -->

Ord og forkortelser er forklaret i [ordbogen](../ordbog/).
