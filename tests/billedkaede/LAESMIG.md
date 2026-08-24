# `tests/billedkaede/` — proevedata til billedkaeden

**Ikke katalogindhold.** De tre poster her er opdigtede. De maa aldrig kopieres
til `data/robots/`, og tallene i dem er paafundne — der findes ingen maskine,
der hedder "Proeve Silhuet".

Mappen findes, fordi billedkaeden gaar gennem fem led, og hvert led kan vaere
rigtigt for sig, mens sammenhaengen er brudt:

```
billede: i YAML  ->  R18 i validate.mjs  ->  kopi assets/ -> dist/billeder/
                 ->  <picture> i skabelonen  ->  sti, der peger rigtigt
```

R18 kan sige god for en fil, der findes i `assets/`, uden at bygget nogensinde
kopierer den. Saa staar der et brudt billede paa siden med groenne tests bagved.
Det er den fejl, `tests/koer.mjs` afsnit 3b maaler paa det her datasaet.

## De tre poster

| Fil | Hvad den beviser |
|---|---|
| `proeve-silhuet.yaml` | Hele kaeden: felt, ophav, kilde, egen `alt` og `note` naar frem til `<picture>` og til billedfoden |
| `proeve-delt.yaml` | To poster deler én fil (L28). `.billedmaerke` skal staa PAA billedet, og `delt_med` skal kunne slaas op |
| `proeve-tom-plade.yaml` | **Ingen** `billede:`. Den tomme plade skal blive ved med at virke, ogsaa naar naboen har et billede — ellers gaar 46 aerlige huller til 45 huller og ét, der ser itu ud |

Den sidste er lige saa vigtig som de to foerste. Det var den tilstand, alle 46
rigtige poster stod i den 21. august 2026.

## Billedfilen

Posterne peger paa `assets/silhuetter/_proeve-kaede.svg`, som er tegnet i
haanden til netop det her formaal. Understregen forrest siger, at den ikke
hoerer til robotsaettet. Den er **ikke** en silhuet af en rigtig maskine:
Å3 (billedvejen) er ikke afgjort, og maalestokken i
`assets/silhuetter/LÆSMIG.md` er ikke valgt endnu.

Filen bliver kopieret med i det rigtige byg — `billeder kopieret fra assets/: 1`.
Ingen side i kataloget peger paa den, saa den staar i `dist/billeder/silhuetter/`
uden at blive vist. Skal den vaek, skal `tests/billedkaede/` og afsnit 3b i
`tests/koer.mjs` vaek med den, og saa er kaeden ubevist igen.
