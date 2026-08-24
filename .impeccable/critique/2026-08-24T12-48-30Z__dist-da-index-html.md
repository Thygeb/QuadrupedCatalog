---
target: webstedet (dist/da/index.html)
total_score: 24
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
timestamp: 2026-08-24T12-48-30Z
slug: dist-da-index-html
---
Method: dual-agent (A: designgennemgang · B: detektor/browserbevis) + orkestratorens egen visuelle gennemgang af alle fem flader.

## Design Health Score

| # | Heuristik | Score | Nøglefund |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Filtertilstand vises tredobbelt; aktiv side markeret i nav |
| 2 | Match System / Real World | 3 | Jargonfrit dansk; kildemærke-konventionen kræver ét klik at lære |
| 3 | User Control and Freedom | 3 | Linkbare filtre, sprogskift, tilbage-led; ingen "ryd alle filtre" |
| 4 | Consistency and Standards | 3 | Stærk komponentkonsistens — men detaljesiden fik aldrig designløftet og ligner et andet produkt end forsiden |
| 5 | Error Prevention | 3 | Lav risikoflade, ingen formularer |
| 6 | Recognition Rather Than Recall | 4 | Alt etiketteret, fast feltrækkefølge, ingen ikon-only nav |
| 7 | Flexibility and Efficiency | n/a | Experience-flade uden power-user-krav |
| 8 | Aesthetic and Minimalist Design | 3 | Forsiden ren; EU-tabellens 52 "ikke oplyst"-piller og de rå advarselsblokke på detaljesiden trækker ned |
| 9 | Error Recovery | 2 | Et DÅRLIGT billede kan ikke skelnes fra et bevidst hul — ingen fallback til målepladen |
| 10 | Help and Documentation | n/a | Opslagsværk; kilde/footer bærer forklaringen |
| **Total** | | **24/32 (75 %)** | **God** |

## Design-specificitetsdom
Formsproget er højt specifikt (fire hul-tilstande, måleplade, kildemærker, mono-tal) — men ledestjernen "maskinen står frit på hvid plade" brydes af selve billedmaterialet på de mest sandsynlige landingssider. Detektoren (CLI degraderet, browserinjektion fuld): 510 fund forside / 25 robotside / 6 producentindeks / 18 producentside; domineret af tekststørrelse/skydeafstand på den bevidste 10,5px-etiketskala (kontrakten vinder over detektorens 11px-gulv), MEN med ægte fund imellem: span.maerke 1,1:1 kontrast, span.midlertidig 10,5px. text-occlusion-fundene er detektorens eget banner-artefakt (falsk positiv).

## Prioriterede problemer
1. [P0] Billedpipelinen har ingen kvalitetsport: Go2-hero er et app-skærmbillede, Honey Badger 5.0 viser et instituts logo, AlienGo center-cropper til blank flade, Weilan bærer indbrændt reklametekst. Uegnet billede skal falde tilbage til målepladen, og alle 45 skal efterses med øjne. → harden/audit af billedvejen + manuel gennemgang.
2. [P1] Robotdetaljesiden fik aldrig designløftet: robottens navn står ikke i første viewport, advarselsbokse ligger som rå udfoldede blokke, højre halvdel er tom, helten er ovennævnte app-billede. → layout-pas på robot.mjs med forsidens formsprog.
3. [P1] Tab-rækkefølgen er domineret af kildemærke-stop (46 kort × op til 4 mærker = hundredvis af tryk for Sam) — bryder PRODUCT.md's "filtrering må ikke kræve mus". → aria-describedby / ét stop pr. kort.
4. [P2] EU-tabellen på producentsider: 52 identiske "ikke oplyst"-piller siger det, én sætning ovenfor allerede siger. L32 fjerner 3 af 4 kolonner; kollaps resten til sætningen ved 0 % dækning.
5. [P2] Ægte detektorfund: span.maerke 1,1:1 kontrast (nær-usynlig tekst), span.midlertidig under gulvet. Efterprøv og ret.
6. [P2] Forsidens fold bærer fire samtidige indgange (søg / se alle / 4 yderpunkter / 8 formål) — A målte 2 af 8 kognitive fejlpunkter. Ejerens nyligt godkendte flade; lettes med hierarki, ikke med sortering (princip 4 forbyder rangering).
7. [P3] PRODUCT.md lover ≥44px berøringsmål; DESIGN.md designer kildemærket til 24px (WCAG 2.5.8). Én dokumentationslinje mangler.

## Personaer
Jordan: lander via søgning på Go2 og møder en app-skærm — "er jeg det rigtige sted?" fejler. Sam: fokusring ægte (målt på label), men tab-støjen er rød. Casey: alle mål over 44px undtagen kildemærker (24px, tæt sat).

## Behold
Fokusring på label (målt), kildemærkets usynlige hitboks (klik-testet), producentindeksets redaktionelle ro, hul-sproget hvor det er formgivet.

## Spørgsmål
1. Hvorfor gælder yderpunkternes håndkontrol ikke de øvrige 42 billeder?
2. Skal "dårligt foto" og "intet foto" begge blive til det samme ærlige hul (måleplade)?
3. Kan formålsgitteret grupperes uden kvalitetsdom (hvem bruger den / hvad gør den)?
