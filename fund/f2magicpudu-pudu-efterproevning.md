# Efterprøvning af citater — Pudu Robotics (spor/f2-magicpudu)

Pudus mappe fandtes IKKE under sit eget navn (briefets punkt 3 var korrekt om
det). Materialet lå i `media/_kilder/raa-kand1a-2026-08-24/` (fundet ved
`find media/_kilder -iname "*pudu*"`), IKKE i `raa-producenter-resten-2026-08-19/`,
som briefet gættede på. Kilderne er alle ENGELSKE (ingen CJK) — samme mønster
som MagicLab, `OPSKRIFT-fase2.md` (den engelske opskrift) er korrekt valg.

MANIFEST.tsv i mappen bekræfter tre relevante filer:
`pudu-d5-storeside-2026-08-24.html/.txt` (webbutik, Shopify-produkt-JSON +
sammenligningstabel), `pudu-d5-officielside-2026-08-24.html/.txt` (officiel
side med fodnoter 1-5), `pudu-d5-prnewswire-2026-08-24.html/.txt`
(pressemeddelelse, eneste kilde med lastbetinget driftstid).

| # | Fragment | Kilde-fil | Fundet |
|---|---|---|---|
| 1 | "Easily handles 25 cm steps, 30° climbs, and 45° descents." | storeside + officielside | ja |
| 2 | "D5: 25° ascent, 45° descent" | storeside | ja |
| 3 | "Maximum Step Height" (label, flere forekomster) | storeside | ja |
| 4 | "PUDU D5 Series is shipped with dual high-precision 96-line LiDAR as the standard configuration…enhanced perception, a dual 192-line LiDAR upgrade is available upon request." | officielside | ja (i to dele) |
| 5 | "Dual 192-line* spherical LiDARs" | officielside + storeside | ja |
| 6 | "Designed for real-world deployment in industrial, inspection, security, research, and advanced robotics applications." | storeside | ja |
| 7 | "Weight (with Battery)" | storeside | ja |
| 8 | "Standing Dimensions" (900 x 543 x 572 mm) | storeside | ja |
| 9 | "Continuous Walking Payload" | storeside | ja |
| 10 | "30kg Payload" | prnewswire | ja |
| 11 | "Cruises at up to 5 m/s" | storeside + officielside | ja |
| 12 | "wheel-leg hybrid locomotion" | prnewswire | ja |
| 13 | "Cold-Start Capability" (Below -10°C) | storeside | ja |
| 14 | "stable 30-kilogram payloads with over two hours of continuous runtime at full load" | prnewswire | ja |
| 15 | "Operating Time" (label) | storeside | ja |
| 16 | "sold separately" / "Inspection Kit" (fodnote 3) | officielside/storeside | ja |
| 17 | "Four 120° fisheye cameras" | prnewswire | ja |
| 18 | "Dual 3D LiDAR + Four Fisheye Cameras" | storeside | ja |
| 19 | "complete autonomous workflows" | prnewswire | ja |
| 20 | "continuous, unsupervised operation" | prnewswire | ja |
| 21 | `"price":8000000` / `"price":8500000` (Shopify-JSON) | storeside.html | ja |

**21 fragmenter kontrolleret, 0 ikke fundet.** Samme forbehold som
MagicLab-tabellen: dette er en stikprøve af de citerede/etiket-agtige
stumper, ikke hver eneste analytiske sætning (fx "USIKKER TILDELING" er en
metodenote om vores egen fortolkning, ikke en citerbar producentpåstand).

**Ingen af de 31 Pudu-caveats blev vurderet ikke-efterprøvelige (kasse D).**
`length`/`width`/`height` er allerede markeret `caveat_class: "validity"`
med eksplicit usikkerhed i selve teksten — det er en ærlig gengivelse af en
uafklaret tildeling, ikke en påstand uden belæg, og oversættes derfor uændret
i sin usikkerhed.

**`value_text` (lidar/cameras/autonomy_level) er STADIG dansk efter dette
spor, bevidst.** Kolonnen står ikke på `TEKSTKOLONNE_HVIDLISTE` i
`db/f2-skriv.mjs`, og OPSKRIFT-fase2.md §6.4 er eksplicit: det er en anden
arbejdsbunke. Flages hermed til JPK, som `OPSKRIFT-fase2.md` selv beder om.
