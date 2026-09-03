# Efterprøvning af citater — MagicLab (spor/f2-magicpudu)

Stikprøve af de indlejrede citater/etiketter, der forekommer i de danske
caveat/notes-tekster (allerede på engelsk eller kinesisk i kilden — de
oversættes IKKE, kun den omgivende danske prosa oversættes). Kontrolleret mod
`media/_kilder/raa-kina-deep-magic-2026-08-19/` med `grep -io`.

| # | Fragment | Kilde-fil | Fundet |
|---|---|---|---|
| 1 | "Founded in 2024 and headquartered in Suzhou" | magiclabglobal-site-forside-en | ja |
| 2 | "Founded in Suzhou, China" | magiclabglobal-site-forside-en | ja |
| 3 | "Wujiang" (fravær, 0 forekomster) | 4 forsidefiler | ja (0 træf, som påstået) |
| 4 | "Net Weight (Excluding Battery)" | magiclab-magicdog-specside-en | ja |
| 5 | "PRO and EDU configurations are available" | magiclabglobal-magicdog-specside-en | ja |
| 6 | "Maximum Speed" | magiclab-magicdog-specside-en | ja |
| 7 | "Movement Speed" | magiclabglobal-magicdog-specside-en | ja |
| 8 | "Maximum Obstacle Height" / "Max Obstacle Step Height" | magiclab/magiclabglobal-magicdog-specside-en | ja |
| 9 | "Approx. 2.5hours of continuous movement" | magiclabglobal-magicdog-specside-en | ja |
| 10 | "Battery Charging Dock" | magiclab-magicdog-specside-en | ja |
| 11 | "Quadruped Wheeled Robot" | magiclab-magicdog-w-specside-en | ja |
| 12 | "with battery" | magiclab-magicdog-w-specside-en | ja |
| 13 | "Head Motor" | magiclab-magicdog-w-specside-en | ja |
| 14 | "payload of 10 kg" (dækker "Maximum 10 kg") | magiclabglobal-magicdog-w-specside-en | ja |
| 15 | "3.0m/s" | magiclabglobal-magicdog-w-specside-en | ja |
| 16 | "Climbs and Drops" | magiclabglobal-magicdog-w-specside-en | ja |
| 17 | "Minimum obstacle clearance height" | magiclab-magicdog-w-specside-en | ja |
| 18 | "Computing Accelerator Module" | magiclab-magicdog-w-specside-en | ja |
| 19 | "157" (TOPS-tallet, kun CN) | magiclab-magicdog-w-specside-cn | ja |
| 20 | "Standby Time" / "8 hours" | magiclab-magicdog-w-specside-en | ja |
| 21 | "Dynamic Payload" | magiclab-magicdog-y1-specside-en | ja |
| 22 | "Maximum Payload" | magiclab-magicdog-y1-specside-en | ja |
| 23 | "Maximum Climbing Height" | magiclab-magicdog-y1-specside-en | ja |
| 24 | "45Ah (2400Wh), Voltage 54V" | magiclab-magicdog-y1-specside-en | ja |
| 25 | "LiDAR ×1 … configurations may vary" (dækker "3D LiDAR x1") | magiclab-magicdog-y1-specside-en | ja |
| 26 | "continuous walking with 20 kg load" | magiclab-magicdog-y1-specside-en | ja |
| 27 | "MagicLab Industrial Quadruped Robot" | magiclab-magicdog-y1-specside-en | ja |
| 28 | "魔法原子工业四足机器人" | magiclab-magicdog-y1-specside-cn | ja |

**28 fragmenter kontrolleret, 0 ikke fundet.** Dette er en stikprøve af de
citerede/etiket-agtige stumper i teksten, ikke en fuldstændig gennemgang af
hver eneste analytiske påstand (fx "tabellen bruger udfyldt/åben cirkel",
"cookien i18n_redirected=zh") — de er metodenoter om selve indsamlingen, ikke
citerbare tekststykker, og kan ikke efterprøves med grep mod HTML-teksten.

**Ingen af de 53 MagicLab-caveats blev vurderet ikke-efterprøvelige (kasse D).**
Alle påstande kunne enten (a) direkte spores til et citeret fragment ovenfor,
eller (b) er beskrivelser af tabelstruktur/sidens opbygning, som ikke er en
"citerbar påstand" i L87's forstand, men en observation om kildens layout.

**Formateringsforskelle fundet, ikke rettet (uden for scope):**
- DB'ens `caveat` for `weight` (2219/2220) skriver "Net Weight, Excluding
  Battery" (komma); kilden skriver "Net Weight (Excluding Battery)"
  (parentes). Forskellen fandtes allerede i den danske DB-tekst før dette
  spor — vi oversætter, vi retter ikke stille en eksisterende unøjagtighed.
