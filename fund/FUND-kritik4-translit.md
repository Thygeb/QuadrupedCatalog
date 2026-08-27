# FUND-kritik4-translit — måleapparatet bag KRITIK-4's fund 1 og 5

Skrevet af orkestratoren 27. aug 2026 under KRITIK-4, så acceptkriterierne i
`KRITIK-4-side.md` kan genkøres af enhver.

## Måleværktøjet

Ligger **uden for repoet**, jf. løftet om en afhængighedsfri generator:

```
node C:/Praktik/websites/maalevaerktoej/translit.mjs
```

Køres fra projektroden. Den læser `dist/`, fjerner `<script>`, `<style>` og alle tags, og
tæller kun i det, en læser faktisk ser.

**Målt 27. aug 2026 på `25b6dec`:**

```
SIDER med translittereret dansk i synlig tekst: 158
forekomster i alt: 1616
gaaende:374  staaende:242  hoejere:84  vaerdi:78  raekke:72  vaegt:62  graense:62
naevner:58  vaegten:42  foerste:42  oevrige:40  maerket:36  foer:32  laengde:30
saetning:30  baerer:30  laengere:28  laeser:28  daekker:26  raekker:24  haeldning:20
hoejde:20  naevnt:18  traef:18  foelger:14  stoerre:12  naeste:12  erklaering:10
maerker:8  maerke:8  laeses:8  tilfoejet:8  vaerdier:6  naevnes:6  boer:6
aabnet:4  aabne:4  oplyste:4  foelge:4  aendre:2  aendring:2  loesning:2
```

Fordelt på sprog: **67 danske sider og 67 engelske**. Resten af de 158 er katalog-,
forside- og producentflader, hvor teksterne optræder i kort og plader.

## Fælden, måleapparatet selv faldt i

**Første måling gav 0 — og 0 var forkert.** Kommandoen var skrevet som en `node -e`-streng
i Git Bash med `\\b` som ordgrænse. Bash oversatte den til et **backspace-tegn**, så
regex'en søgte efter `<BS>naevner` i stedet for ordet. Ingen fejl, ingen advarsel, bare
et nul.

Kontrollen, der afslørede det, var at søge på det bare ord i én fil:
`naevner` gav **2** på Spots side, mens varianten med ordgrænse gav **0**.

**Derfor ligger målingen i en filscript og ikke i en `node -e`-streng.** Det er projektets
egen regel om, at indhold skrevet gennem skallen skal efterprøves — her ramte den selve
måleapparatet, og et nul fra et ødelagt måleapparat ser ud som en bestået kontrol.

## Kilden i data

```
node -e "…"   # se KRITIK-4-side.md fund 1
```

Målt direkte i datafilerne, kun i `advarsel:`- og `note:`-strenge:

| | Antal |
|---|---|
| Datafiler med translittereret dansk i læservendt prosa | **73 af 77** |
| Tekstfelter, der skal skrives om | **319** |
| Datafiler med interne enum-navne i læservendt prosa (fund 5) | **32** |
| Enum-forekomster | **71** |

Fordeling af enum-navnene: `sikkerhed_overvaagning` 25 · `forsvar_beredskab` 20 ·
`forskning_udvikling` 11 · `ikke_oplyst` 11 · `forbruger_uddannelse` 4.

## Hvorfor fundet er seks dage gammelt

`fund/FUND-i18n.md` afsnit **F2** målte det samme den 24. aug 2026 — dengang **42 af 61
danske sider**, med `paa` (152), `staar` (66), `staaende` (33) og `gaaende` (32) som de
hyppigste. Dokumentet skriver selv, at fundet **ikke** blev ført over i STATUS.md, fordi
alle parallelle grene skrev i den fil, og beder om, at det bliver ført over senere.

Det skete ikke. Kataloget voksede fra 46 til 77 robotter, og fundet voksede med det:
**42 sider blev til 134**.

**Lærdommen står i KRITIK-4's afsnit "Mønsteret":** en FUND-fil, der ender med *"bør føres
over i STATUS.md"*, skal føres over samme dag, af den der fletter. Et fund uden for
indekset findes ikke.
