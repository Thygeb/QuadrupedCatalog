# `assets/silhuetter/` — måltro tegninger i fælles målestok

**Status: forudsætter Å3, som ikke er besluttet endnu** (se [STATUS.md](../../STATUS.md)).
Mappen findes, fordi det er den anbefalede vej — ikke fordi valget er truffet.

## Idéen

Én SVG pr. robot, tegnet ud fra de mål producenten selv oplyser, **alle i samme
målestok**. Ikke stiliserede ikoner: proportionelt korrekte silhuetter.

Det løser billedproblemet, men det er ikke derfor det er den rigtige løsning. Det er den
rigtige løsning, fordi **den slår fotos til det, siden er til for**. Et pressefoto er
skudt for at få robotten til at se stor og handlekraftig ud; hver producent vælger sin
egen vinkel, sin egen baggrund og sin egen brændvidde. Sat ved siden af hinanden fortæller
seks pressefotos intet om, hvilken robot der er størst. Seks silhuetter i fælles målestok
fortæller det på et halvt sekund — og de kan ikke krænke nogens rettigheder.

## Reglerne, hvis vejen vælges

1. **Én målestok for hele kataloget.** Faktoren skrives her i filen, når den er valgt, og
   må ikke ændres pr. robot. Ændres den nogensinde, skal **alle** silhuetter gentegnes —
   en enkelt afvigende figur ødelægger sammenligningen for hele sættet, og det er den
   slags fejl, ingen opdager ved at se på én side ad gangen.
2. **Tegn kun mål, producenten oplyser.** Mangler foldede mål, tegnes robotten kun stående.
   Vi gætter ikke en form.
3. **Samme streg, samme detaljeringsgrad, samme stilling for alle.** Stående, i profil.
   Én robot i en mere dynamisk positur ser ud som en anbefaling.
4. **En silhuet er en gengivelse af måltal, ikke af et produkt.** Den skal se ud som en
   teknisk tegning, ikke som en illustration af netop den maskine. Ligner den for meget,
   er vi tilbage ved at afbilde fabrikantens produkt.
5. **Ingen silhuet uden kilde på de mål, den er tegnet efter.** Samme regel som for tal.

## Navngivning

`<producent>-<model>-<staaende|foldet>.svg`

Eksempel: `unitree-b2-staaende.svg`

## Målestok

Ikke valgt endnu. Kandidat: 1 mm = 0,1 px, hvilket giver Unitree B2 (1098 mm lang) en
bredde på 110 px og Boston Dynamics Spot (1100 mm, se D2) stort set samme — hvilket i
sig selv er et fund, læseren bør kunne se.

## Sådan kommer en fil herfra ud på siden

**At lægge en fil i mappen er ikke nok, og det er med vilje.** Indtil 21. august 2026
gjorde generatoren det modsatte: lå der en fil, der hed det samme som robottens slug,
blev den vist. Så kunne et billede havne på siden uden ophav og uden kilde, alene fordi
nogen lagde en fil i en mappe. Den vej er lukket.

En robotpost skal pege på filen selv (`tools/skema.mjs`, regel R18 i validatoren):

```yaml
billede:
  fil: silhuetter/unitree-b2-staaende.svg   # relativ til assets/
  ophav: silhuet                            # eget_foto | silhuet | fabrikant
  kilde: https://www.unitree.com/b2         # kilden på de MÅL, den er tegnet efter
  hentet: 2026-08-19
  note: "Tegnet efter L 1098 × B 450 × H 645 mm."
```

`kilde` er påkrævet for `silhuet` — det er regel 5 ovenfor, håndhævet mekanisk.
Bygget fejler, hvis filen ikke findes, hvis `ophav` mangler, eller hvis stien peger
uden for `assets/`.

`_proeve-kaede.svg` er **ikke** en katalogsilhuet. Den er en prøvefigur, der beviser
at kæden virker; se `tests/billedkaede/LAESMIG.md`.
