# FUND-fotos-2 — fabrikantfoto til de 14 robotter uden billede

Gren `data/fotos`, worktree `c:\Praktik\websites\udstilling-wt-fotos`. Genstart efter et
session-limit midt i research (se ARBEJDSGANG.md/STATUS.md for spor-B). Intet fra det tidligere
forsøg blev genbrugt fra stash'en — arbejdet her er kørt forfra, som instrueret.

---

## Skill-vurdering (obligatorisk første handling)

**Valgt: `robotdata`.** Kaldt via `Skill`-værktøjet med navnet `robotdata` — den blev fundet og
loadet uden `Unknown skill`, så der var intet fallback til at læse `SKILL.md` fra disk. Den bærer
33-feltsskemaet og — vigtigst her — de ti hårde regler (regel 1: opfind aldrig et tal/en kilde;
regel 2: kilde + hentet på alt) og selv-tjekket med tælling, som er nøjagtig den disciplin,
billede-feltet også skal leve op til (R18 i `tools/validate.mjs` håndhæver det samme).

**Gået forbi:** `parallelt` (jeg *er* ét spor, ikke fordeleren), `grillmig` (intet nyt agentbrief
eller åben beslutning at grille — briefet var allerede grillet, da jeg fik det), `impeccable`/
`critique`/`ui-ux-critique` (ren dataindsamling, intet bygget UI at kritisere), `dataviz` (ingen
graf at lave), `new-project`/`code-review`/`simplify` (ingen kode ændret ud over data og et
engangs-Python-script i scratch).

---

## Præmis efterprøvet

`grep -L "^billede:" data/robots/*.yaml` gav **14 robotter** — samme tal som opgavebeskrivelsen.
11 havde en mappe i `media/robotbilleder/` (læst fra hovedrepoets absolutte sti, som
instrueret — aldrig kopieret ind i egen worktree først). 3 havde ingen mappe:
`raion-robotics-raibo2`, `unitree-laikago`, `xiaomi-cyberdog-1`.

---

## Uventet fund før noget som helst blev skrevet: efterladte filer fra det afbrudte forsøg

Før jeg selv rørte noget, lå der allerede tre filer i `assets/fotos/fabrikant/` med tidsstempel
10:09 (før min egen session): `deep-robotics-lite3.png`, `raion-robotics-raibo2.jpg`,
`xiaomi-cyberdog-1.jpg`. Genstart-briefet sagde udtrykkeligt at **ingen** `assets/fotos/fabrikant/`-
filer var nået at blive skrevet. Det var forkert — mappen er gitignoreret, så filerne kunne ikke
være stashet, og de er derfor rester fra spor-B, direkte på disk, aldrig ryddet op.

Jeg efterprøvede alle tre med sha256, i stedet for at stole på filnavnet:

| Fil | Fund | Handling |
|---|---|---|
| `deep-robotics-lite3.png` | sha256 = `4eb65513a6…` — **byte-identisk** med `pro1.png`, det delte "andre produkter"-miniaturebillede jeg selv fandt og afviste for netop Lite3 (se afsnittet om Lite3/X20 nedenfor) | **Slettet.** Havde jeg ikke hashet den, ville jeg have brugt et billede, der ikke sikkert viser Lite3 |
| `raion-robotics-raibo2.jpg` | sha256 = `3ed28f8d…` — **byte-identisk** med min egen, uafhængigt hentede `08.jpg` (raionrobotics.com, stien "4) 야외/A___0503.jpg") | **Beholdt.** Kilden er dermed kendt og bekræftet — spor-B nåede tilsyneladende frem til samme billede, før den crashede |
| `xiaomi-cyberdog-1.jpg` | 2560×1726, rent studiofoto, visuelt en meget overbevisende CyberDog — men **ingen kendt kilde-URL**. Ingen EXIF med URL, ingen note, intet i `fund/`, intet i git-historikken der forklarer, hvor den kom fra | **Slettet.** R18 og regel 2 kræver `kilde` på et fabrikantbillede. Uden den kan jeg ikke skrive et sandt `kilde:`-felt, og et gættet et ville være præcis den fabrikation, regel 1 forbyder |

**Dette er min største usikkerhed i hele opgaven, se selv-review punkt 1.**

---

## De 11, der fik et billede

| Robot | Fil valgt | Hvorfor netop den |
|---|---|---|
| `anybotics-anymal-x` | `anybotics-anymal-x-4.jpg` (rang 4 i manifestet) | Eneste ikke-splitscreen enkeltbillede af robotten alene i rimelig størrelse i billedet; rang 1 var domineret af en hel raffinaderihorisont, rang 2/3 var samme collage af to robotter side om side |
| `deep-robotics-lynx-m20-pro` | `lynx.jpg` (rang 1) | Producentens eget hero-billede for lynx.html — rene hvide studiofoto, mens de øvrige 4 filer på siden er delte "andre produkter"-ikoner og ledmoduler |
| `deep-robotics-lynx-m20` | samme `lynx.jpg`, egen kopi | Samme billede står på producentens egen M20-fane på samme side |
| `deep-robotics-lynx-m20s` | samme `lynx.jpg`, egen kopi | De øvrige 4 filer på M20S' egen side er logoer/tekstbannere (170×85, 690×170) — ingen alternativ foto findes i det indsamlede materiale |
| `deep-robotics-lynx-s10` | `deep-robotics-lynx-s10-5.jpg` (rang 5) | Eneste af S10's 4 brugbare billeder (rang 2 var en korrupt download) hvor robotten fylder mest og vender front mod kameraet; de tre andre er enten rystet af murbrokker eller robotten er lille i en bambusskov/flod |
| `deep-robotics-x30-pro` | `x30.jpg` (rang 1) | Producentens eget hero-billede for product3.html — samme rene studiokvalitet som Lynx' |
| `deep-robotics-x30` | samme `x30.jpg`, egen kopi | X30 og X30 Pro er samme fysiske chassis og deler siden bogstaveligt det samme billede på producentens side |
| `magiclab-magicdog-y1` | `magiclab-magicdog-y1-2.jpg` (rang 2) | Eneste af de 5 med eksplicit "Y1"-mærkning trykt på robottens ben — de øvrige 4 er lige så rene billeder, men uden den verificerbarhed, og denne har desuden det reneste (mørke, uforstyrrede) baggrund |
| `xiaomi-cyberdog-2` | `xiaomi-cyberdog-2-2.png` (rang 2) | Rent studiofoto uden indbrændt reklametekst; rang 1 havde en stor kinesisk marketingoverskrift brændt ind over billedet, hvilket er præcis den fejltype opgaven bad om at luge ud |
| `raion-robotics-raibo2` | Hentet friskt fra `raionrobotics.com`, "4) 야외/A___0503.jpg" | Af 8 hentede kandidater den eneste med robotten fuldt synlig på en ryddelig, næsten tom asfaltvej — de øvrige 7 er enten mørke lagerhalfotos domineret af trafikkegler og udstyr, eller en robot lille i højt græs |
| `unitree-laikago` | Hentet via Wayback Machine, Unitrees egen (i dag 404'ede) side `products/laikago/`, "Laikago轮播图" | Eneste rene produktfoto blandt de 3 billeder, siden viste; "缩略图"-filen viste sig ved åbning slet ikke at være Laikago, men en helt anden (rød drage-formet) legetøjsrobot |

**2 fik bevidst intet billede, trods eksisterende mappe:**

| Robot | Hvad jeg prøvede | Hvorfor intet blev valgt |
|---|---|---|
| `deep-robotics-lite3` | Åbnede alle 5 billeder (2 var korrupte downloads, http_status 000) | De 3 brugbare er DEEP Robotics' delte "andre produkter"-miniature (`pro1.png`/`pro4.png`, sha256 byte-identisk) og to ledmodul-fotos (`j100.png`/`j60.png`, tydeligt en aktuator, ikke en robot). Samme `pro1.png`/`pro4.png`-par gik igen **byte for byte** på X20's, X30's, X30 Pro's og begge Lynx-siders indsamlede filer — det er et delt "udforsk vores andre robotter"-widget, ikke Lite3-specifik fotografi. At bruge det ville vise en ukendt anden DEEP Robotics-model under Lite3's navn |
| `deep-robotics-x20` | Åbnede alle 5 billeder | Samme 5 filer som Lite3 (samme sha256), samme konklusion. Intet af det X20-specifikke fandtes i det indsamlede materiale — X20's side har tilsyneladende ikke fået sit eget "demo/x20.jpg"-hero indsamlet, sådan som X30 fik sit `x30.jpg` |

**1 fik intet billede, ingen mappe fandtes:**

| Robot | Hvad jeg prøvede | Resultat |
|---|---|---|
| `xiaomi-cyberdog-1` | Hentede `mi.com/cyberdog`, `/gallery`, `/specs` + dens JS-bundle, og `shop/buy/detail?product_id=14815` med curl. Alle fire er enten en tom Vue-SPA-skal uden `og:image` og uden galleribilledmarkup, eller — på købssiden — ~150 generiske butiksikoner (betalingslogoer, kategoriikoner) som er identiske med dem på forsiden, ikke robotfotos. `specs.js`-bundlen indeholder kun ren specifikationstekst, ingen billed-URL'er | **Intet billede.** Mi.com's produktgalleri indlæses helt via JavaScript efter sidens levering, og jeg har ikke et værktøj i denne opgave, der udfører JS. Det efterladte, uverificerbare orphan-billede (se ovenfor) blev bevidst ikke brugt |

**Tælling: N = 11 fik billede, K = 3 dokumenteret uden. N + K = 14 = min egen optælling.**

---

## Vigtigt forbehold om `hentet`-datoerne for de 9 fra arkivet

`hentet_utc` i det eksisterende `MANIFEST.tsv` er **en øvre grænse (filernes mtime)**, ikke et målt
hentetidspunkt — det fremgår ikke af selve manifestet, men blev sagt mig i opgavebeskrivelsen, og
jeg har ingen selvstændig måling, der modsiger det. De 9 `billede.hentet: 2026-08-19`-datoer i
YAML-filerne stammer derfor fra manifestet, ikke fra en ny måling foretaget af mig. De 2 friske
hentninger (`raion-robotics-raibo2`, `unitree-laikago`) er derimod **selv målt** — `date -u` blev
kørt umiddelbart efter hver hentning, og `hentet: 2026-08-24` i deres YAML og `MANIFEST.tsv` er
reelt målt, ikke en gæt-dato.

---

## Filer der ALDRIG kommer i git (gitignorerede) — fuld liste til flet

`assets/fotos/fabrikant/**` og `media/robotbilleder/` (i denne worktree, uden for
`media/_arbejde/**`) ligger uden for `.gitignore`s eksisterende mønstre i nogle tilfælde og inden
for i andre — men uanset hvad er de **ikke** committet (kun de 11 YAML-filer blev `git add`et,
efterprøvet med `git status` før commit). Følgende filer findes kun lokalt i denne worktree og skal
kopieres manuelt ved flet:

**`assets/fotos/fabrikant/` (11 filer, det billede siden reelt bruger):**
```
C:\Praktik\websites\udstilling-wt-fotos\assets\fotos\fabrikant\anybotics-anymal-x.jpg
C:\Praktik\websites\udstilling-wt-fotos\assets\fotos\fabrikant\deep-robotics-lynx-m20-pro.jpg
C:\Praktik\websites\udstilling-wt-fotos\assets\fotos\fabrikant\deep-robotics-lynx-m20.jpg
C:\Praktik\websites\udstilling-wt-fotos\assets\fotos\fabrikant\deep-robotics-lynx-m20s.jpg
C:\Praktik\websites\udstilling-wt-fotos\assets\fotos\fabrikant\deep-robotics-lynx-s10.jpg
C:\Praktik\websites\udstilling-wt-fotos\assets\fotos\fabrikant\deep-robotics-x30-pro.jpg
C:\Praktik\websites\udstilling-wt-fotos\assets\fotos\fabrikant\deep-robotics-x30.jpg
C:\Praktik\websites\udstilling-wt-fotos\assets\fotos\fabrikant\magiclab-magicdog-y1.jpg
C:\Praktik\websites\udstilling-wt-fotos\assets\fotos\fabrikant\xiaomi-cyberdog-2.png
C:\Praktik\websites\udstilling-wt-fotos\assets\fotos\fabrikant\raion-robotics-raibo2.jpg   (uændret fra spor-B, verificeret sha256-identisk med min egen hentning)
C:\Praktik\websites\udstilling-wt-fotos\assets\fotos\fabrikant\unitree-laikago.jpg          (ny)
```

**`media/robotbilleder/` (nye undermapper + manifest, KUN for de 2 friske hentninger — resten af
det eksisterende medie-arkiv i hovedrepoet er urørt og ligger ikke i denne worktree):**
```
C:\Praktik\websites\udstilling-wt-fotos\media\robotbilleder\MANIFEST.tsv                                          (ny fil, kun 2 rækker — de 2 friske hentninger, ikke en kopi af hovedrepoets fulde manifest)
C:\Praktik\websites\udstilling-wt-fotos\media\robotbilleder\raion-robotics-raibo2\raion-robotics-raibo2-1.jpg
C:\Praktik\websites\udstilling-wt-fotos\media\robotbilleder\unitree-laikago\unitree-laikago-1.jpg
```

**Slettet fra `assets/fotos/fabrikant/` (fandtes fra spor-B, se afsnittet ovenfor):**
```
deep-robotics-lite3.png   (byte-identisk med et delt, ikke-modelspecifikt billede — ville have vist en forkert robot)
xiaomi-cyberdog-1.jpg     (visuelt overbevisende, men ingen kendt kilde — kunne ikke skrives sandt ind i R18's kilde-krav)
```

**Ikke en del af leverancen, men findes i worktreet — disponibelt scratch-materiale, kan slettes
uden tab:**
```
C:\Praktik\websites\udstilling-wt-fotos\.tmp-fotos\view\        (alle konverterede JPG-forhåndsvisninger brugt til visuel bedømmelse)
C:\Praktik\websites\udstilling-wt-fotos\.tmp-fotos\fetch\        (rå curl-hentninger: alle 8 RAIBO2-kandidater, alle 3 Laikago-kandidater, mi.com-siderne der blev undersøgt for CyberDog 1, samt en test-convert.jpg i hovedrepoets media/robotbilleder/deep-robotics-lite3/ — se note nedenfor)
```

**Bemærk (rettet):** under research oprettede jeg midlertidigt en `test-convert.jpg` direkte i
**hovedrepoets** `media/robotbilleder/deep-robotics-lite3/` (for at teste om PNG→JPG-konvertering
løste et visningsproblem, før jeg forstod at API'et bare afviste bestemte PNG'er). Det var den
eneste fil, jeg skrev uden for min egen worktree — en afvigelse fra "arbejd kun i din worktree".
Den er slettet igen (`c:\Praktik\websites\udstilling\media\robotbilleder\deep-robotics-lite3\
test-convert.jpg` findes ikke længere), så hovedrepoet er urørt af denne opgave.

---

## Efterprøvning (obligatorisk, med tælling)

**Efterprøvet 11 billedblokke felt for felt mod mønsterfilen `unitree-go2.yaml` (fil/ophav/kilde/
hentet/alt, plus valgfrit `note`) — 55 påkrævede felter + 6 valgfrie noter, fandt 1 fejl:**

Min egen note på `raion-robotics-raibo2` indeholdt oprindeligt den bogstavelige sti
`media/robotbilleder/raion-robotics-raibo2/`. Da `note` vises på den byggede side, fangede
`build.mjs`s egen håndhævelse af "media/ indgår aldrig i et byg" den som en ægte fejl —
**"BYGFEJL: 6 side(r) henviser til media/"** — før jeg fik lov at committe. Rettet ved at fjerne
stien fra notens ordlyd (indholdet — at billedet blev hentet friskt i stedet for fra arkivet — stod
allerede der, kun den interne filsti er fjernet). Genkørt: 0 fejl.

Ud over selve build-fejlen blev der ikke fundet fejl: alle 11 `fil:`-stier peger på filer der
rent faktisk findes (bekræftet mekanisk af `validate.mjs` R18 og af `build.mjs`s tælling —
"Billedfelter: 43 fil(er) brugt af 43 robot(ter) · fabrikant: 43"), alle `ophav: fabrikant` er
korrekte (ingen af de 11 er egne fotos eller silhuetter), alle `kilde`-URL'er er gyldige http(s)
og matcher enten manifestets `side_url` eller min egen friske hentnings kilde, og alle
`hentet`-datoer er gyldig YYYY-MM-DD og ligger ikke i fremtiden.

**Mekanisk kørsel:**
```
node tools/validate.mjs   →  46 fil(er) · 0 fejl · 1 advarsel (ghost-robotics-vision-60,
                              hastighed R9 — foreksisterende, urørt af mig)
node tools/build.mjs      →  Billedfelter: 43 fil(er) brugt af 43 robot(ter) · fabrikant: 43
                              (32 før + 11 nu, som krævet)
                              billeder kopieret fra assets/: 44 (43 rigtige + 1 fast testfixture,
                              media/ indgår aldrig)
```

**Færdigkriterium:** N=11, K=3, N+K=14=min optælling. validate 0 fejl. Byggets billedtæller
32+11=43. Alle fire tal stemmer.

---

## Selv-review — hvad jeg er usikker på

**1. Det slettede `xiaomi-cyberdog-1.jpg`-orphan-billede er min største usikkerhed.** Det var
visuelt et meget rent, overbevisende CyberDog-studiofoto (2560×1726, matchende designsprog med
CyberDog 2's egne billeder). Jeg kan ikke udelukke, at spor-B faktisk fandt en ægte kilde og bare
ikke nåede at skrive den ned, før sessionen ramte grænsen. Jeg har ledt efter enhver spor af den
kilde — EXIF, `fund/`, git-historik, filer med nærliggende tidsstempel — og fandt intet. Havde jeg
haft adgang til spor-B's egen samtalehistorik (det har jeg ikke), kunne kilden muligvis findes der.
**Hvis JPK ved, hvor spor-B ledte, er det billedet muligvis reddeligt** — men jeg har bevidst valgt
at slette det frem for at gætte en kilde, fordi et gættet `kilde:`-felt er præcis den fabrikation,
regel 1 forbyder.

**2. `unitree-laikago`s kilde er et judgment call.** Producentens egen side (`unitree.com/products/
laikago/`) svarer i dag 404. Jeg har hentet billedet via et Wayback Machine-snapshot af netop den
side fra 21. juni 2021 og skrevet `kilde:` som den oprindelige unitree.com-URL, med et `note`-felt
der forklarer arkiveringen. Det er min fortolkning af "producentens egen side", ikke en regel
projektet udtrykkeligt har taget stilling til for en side, der er forsvundet. Er fortolkningen for
løs, bør `unitree-laikago` også stå uden billede.

**3. Lynx- og X30-familiernes delte billede er en bevidst grænsedragning, andre kan være uenige i.**
Jeg brugte samme fysiske billede for `lynx-m20`/`-m20-pro`/`-m20s` og for `x30`/`-x30-pro`, fordi
det er **det samme billede, producenten selv viser på netop den models egen side** (ikke et
tredjeparts-widget). Det er en anden situation end Lite3/X20, hvor billedet var delt på tværs af
**ikke-beslægtede** modelsider. Grænsen mellem de to er min vurdering, ikke en regel skrevet ned
noget sted i projektet.

**4. To valg var tætte, rent æstetisk.** MagicDog Y1 (studieshot med "Y1"-mærkning vs. den lige så
rene bambusskov-optagelse) og RAIBO2 (den ryddelige vej vs. en dramatisk trappe-optagelse ovenfra).
Jeg har begrundet valget i hver linje i tabellen, men en anden bedømmer kunne rimeligt vælge
anderledes uden at det ville være en fejl.

**5. `hentet`-datoerne for de 9 arkivbaserede billeder er ikke selv målt** — se forbeholdet ovenfor.
De er så gode som `MANIFEST.tsv` selv, som blev bygget 19. aug 2026.

**6. Jeg har ikke forsøgt at OCR'e eller på anden vis bekræfte "Laikago Pro"-teksten på
Laikago-billedet mod robotmodellens navn i YAML'en (`Laikago`, ikke `Laikago Pro`).** Se noten i
YAML'en — begge varianter mangler egen side hos Unitree, og det er det eneste rene foto, deres
(numre) daværende side viste for hele modelgruppen.

---

## Hvad jeg ikke nåede

- Jeg har ikke forsøgt at finde CyberDog 1's billede via en browser-drevet metode (headless
  browser/JS-udførelse) — kun statisk `curl`. Et værktøj der udfører JavaScript kunne formentlig
  løse det.
- Jeg har ikke undersøgt, om `deep-robotics-x20` eller `-lite3` har et modelspecifikt hero-billede
  et andet sted på deeprobotics.cn end de 5 URL'er, det eksisterende manifest allerede havde
  indsamlet — jeg har kun dømt på det materiale, der forelå, som opgaven bad om for de 11 med
  mappe (ny hentning var kun i scope for de 3 uden mappe).
- (Løst undervejs: den efterladte `test-convert.jpg` i hovedrepoets `media/robotbilleder/
  deep-robotics-lite3/` er ryddet op, se noten ovenfor.)
