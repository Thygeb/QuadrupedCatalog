# FUND-kandglobal — quadruped-producenter uden for Kina, kataloget mangler

Ren researchopgave, stillet af CEO'en 24. aug 2026. Ingen kode eller robotdata er ændret i dette
spor. Indsamlet og skrevet i worktree `C:\Praktik\websites\udstilling-wt-kandglobal`, gren
`spor/kandglobal`.

---

## Skill-vurdering (regel 0)

`ls .claude/skills/` i denne worktree er tom — ingen projektskills er scaffoldet endnu i selve
worktreen (kun de tre globale kataloger findes: `impeccable`, `ui-ux-critique`, `critique` m.fl.,
og projektets egne `robotdata`/`parallelt`/`grillmig`, som findes i hovedrepoet). Gennemgået mod
opgaven:

| Skill | Valgt? | Begrundelse |
|---|---|---|
| `robotdata` | Gået forbi | Bærer 33-feltsskemaet til at *udfylde en katalogpost*. Denne opgave er markedsafdækning — ingen post oprettes, ingen YAML skrives |
| `parallelt` | Gået forbi | Jeg *er* allerede ét spor i en parallel kørsel (spor/kandglobal, ved siden af kand1a/kand1b/kand2). Skillen bruges af den, der fordeler arbejde på tværs af spor — ikke af udførelsen inden i ét spor. Opgaven har desuden én leverance (én rapportfil) og lader sig ikke meningsfuldt dele yderligere uden at gen-uddelegere min egen opgave |
| `grillmig` | Gået forbi | Gælder gril af et brief *før* afsendelse, eller lås af en åben STATUS.md-beslutning. Mit brief er allerede givet og afsendt; jeg låser ingen beslutning her |
| `critique`, `ui-ux-critique`, `impeccable` | Gået forbi | Designkritik af bygget UI. Intet er bygget — ren tekstresearch |
| `dataviz` | Gået forbi | Relevant når sammenligningstal skal *vises*. Her produceres kun en tekstrapport |
| `new-project`, `code-review`, `simplify` | Gået forbi | Ingen kode skrives eller ændres |

**Konklusion: ingen skill passer på "webresearch af globale quadruped-producenter."** Det bekræfter
CEO'ens eget bud i opgaven. Samme konklusion som søster-sporet `FUND-messe.md` nåede for den
kinesiske messeafdækning — begrundelsen er identisk og genbruges bevidst, fordi opgavetypen er den
samme.

---

## 1. Metode — hvor jeg ledte

Systematisk WebSearch/WebFetch, region for region, suppleret med de tre navngivne messespor:

- **USA og Canada:** generelle konkurrentsøgninger ("quadruped robot manufacturer USA/Canada"),
  opfulgt af navngivne firmaer fundet undervejs (Robotic Assistance Devices, Robot.com).
- **Europa:** Tyskland, Spanien, Italien, Schweiz, Frankrig, UK, Norden (Norge/Sverige/Finland/
  Holland), Polen/Tjekkiet/Østrig — hvert land som egen søgning, plus en efterprøvning af at
  Schweiz ikke rummer andre producenter end de to allerede katalogførte (ANYbotics, RIVR).
- **Japan og Sydkorea:** generel søgning + navngivne firmaer (Tmsuk, Hyundai Rotem, LIG Nex1,
  Hanwha).
- **Indien:** bredt favngab ("India quadruped robot startup"), som gav fem selvstændige firmaer;
  hver efterfulgt af en specifik søgning for producentoplyste tal.
- **Israel:** generel søgning + navngivne firmaer (Shifters AI, Roboteam).
- **Australien:** generel søgning + de to firmaer, der dukkede op i AUSA-sporet (Skyborne
  Technologies, Chironix).
- **Messer/branche, eksplicit efterspurgt af opgaven:**
  - **Hannover Messe 2026** — kun allerede katalogførte producenter fundet (DEEP Robotics, Raion
    Robotics).
  - **DSEI 2025** (London) — ingen navngiven quadruped-udstiller fundet i søgningen ud over
    generel omtale af "robot dogs" i UK MoD-sammenhæng.
  - **AUSA 2025** (Washington DC) — gav det stærkeste enkeltfund uden for de allerede kendte
    regioner: Skyborne Technologies (Australien), som dog viste sig at bygge på en allerede
    katalogført producents platform (se afvisningerne).
- Hver kandidat er derefter efterprøvet direkte mod producentens egen hjemmeside, hvor en sådan
  kunne findes, for at afgøre om tal er producentoplyste eller kun presseformidlede.

**Krydstjek mod eksisterende spor:** `fund/FUND-messe.md` (kinesiske messeudstillere — ingen
overlap, alle ti fund der er ren-kinesiske) og `fund/FUND-nye1.md`/`FUND-nye2.md` (dagens
afviste enkeltkandidater: Lenovo Daystar GS, Direct Drive TITA, LimX W1, Guoxing, Rainbow RBQ-3)
er læst før research, så ingen af dem foreslås igen.

---

## 2. Kandidattabel

"Publicerer specs (producent selv)?" betyder: har jeg fundet en kilde, hvor *producenten selv* —
ikke presse — opgiver talværdier med enhed. "Delvist" betyder tal fundet i presse, der citerer
producenten direkte (virksomhedens eget udsagn gengivet), men ikke set på producentens egen
kanal i denne søgning.

| # | Producent | Land | Model(ler) | Status | Specs (producent selv)? | Kilde |
|---|---|---|---|---|---|---|
| 1 | **Keybotic** | Spanien (Barcelona) | Keyper | I produktion, reelle kunder (BASF, Carburos Metálicos, Barcelona Fire Fighters) | Delvist — talværdier (43 kg, 2 m/s, 90 min drift, 40 min hurtiglader) fra brancheartikel der citerer virksomheden direkte; egen specark findes men er formularlåst | [keybotic.com](https://keybotic.com/), [keybotic.com/technical-specifications](https://keybotic.com/technical-specifications/) (formularlåst), [Uncrewed Systems](https://www.uncrewed-systems.com/traces-the-development-of-this-quadrupedal-robot-built-for-high-risk-heavy-industrial-environments/), [EU-Startups](https://www.eu-startups.com/2023/05/barcelona-based-keybotic-bags-e3-million-for-its-robot-dog-keyper/) |
| 2 | **Bhairav Robotics** | Indien (Kakinada, Andhra Pradesh) | Shvana | Unveiled, status for serieproduktion uklar fra siden selv | **Ja** — fuldt talsæt (25 kg egenvægt, 10 kg nyttelast, 2–5 m/s, 8–10 km rækkevidde, ~120 min drift) på producentens egen produktside | [bhairavrobotics.com/shvana-robot](https://bhairavrobotics.com/shvana-robot/) |
| 3 | **Addverb Technologies** | Indien (Noida) | Trakr / Trakr 2.0 | Lanceret på LogiMAT India 2025, sælges kommercielt | **Ja** — 5 kg (Trakr) / 20 kg (Trakr 2.0) nyttelast, 90 min drift, 12 aktuatorer, fire stereokameraer, fra virksomhedens egne pressemeddelelser | [addverb.com — pressemeddelelse](https://addverb.com/press-release/addverb-launches-new-warehouse-robots-trakr-2-0-brisk-and-hoca-at-logimat-india-2025/), [addverb.ai — Trakr-blog](https://addverb.ai/blog/trakr-indias-homegrown-robotic-dog-quadruped) |
| 4 | **General Autonomy** | Indien (Bengaluru) | Param | **Endnu ikke kommercielt tilgængelig** ifølge presseomtale | Delvist — 35 kg, 3 m/s sprint, 1 m spring, 30 cm trappetrin, 8 t drift, alt attribueret til "virksomheden siger" i presse. Intet officielt websted fundet | [officechai.com](https://officechai.com/startups/how-general-autonomy-is-building-robot-dogs-and-humanoid-robots-in-india/), [oneindia.com](https://www.oneindia.com/bengaluru/param-robot-dog-by-bengaluru-startup-turns-heads-at-india-ai-impact-expo-2026-8003197.html) |
| 5 | **NEURA Robotics** | Tyskland (München) | "NEURA Quadruped" (uden selvstændigt modelnavn — adskiller sig fra selskabets hjemmerobot MiPA, som er **hjuldrevet**, se selv-review) | Reservation åben, ventet 2026, pris 50.000 € ekskl. moms/fragt | **Nej** — kun pris publiceret på egen reservationsside. Intet vægt-, nyttelast-, hastigheds- eller batterital fundet, hverken på siden eller i presse | [neura-robotics.com/product/quadruped-reservation](https://neura-robotics.com/product/quadruped-reservation/) |
| 6 | **Svaya Robotics** | Indien (Hyderabad) | Unavngivet quadruped (DRDO-samarbejde) | Udviklet i partnerskab med to DRDO-laboratorier, status som prototype/demonstrator | Delvist — 25 kg nyttelast attribueret til virksomheden i presse. Eget websted (svayarobotics.com) fundet, men ikke direkte efterprøvet for specark i denne søgning | [Deccan Chronicle](https://www.deccanchronicle.com/nation/in-other-news/140323/hyd-based-svaya-robotics-develops-indigenous-quadruped-robot-for-defen.html), [Analytics Insight](https://www.analyticsinsight.net/hyderabads-svaya-robotics-has-developed-indias-first-quadruped-robot) |
| 7 | **Edith Defence Systems** | Indien (Navi Mumbai) | Black Panther | Prototype under test siden 2024 | Nej — kun kvalitative kapabiliteter (terrænklasser, kamera/sensor) fundet, ingen talværdier nogen steder, heller ikke i eget LinkedIn-opslag | [LinkedIn](https://www.linkedin.com/posts/edith-defence-systems_meet-black-panther-a-quadruped-in-development-activity-7162506062422642688-xDZc), [edsystems.in](https://edsystems.in/) (ikke selv efterprøvet for specark) |
| 8 | **Shifters AI (Shifters Robotic Systems Ltd.)** | Israel | TRUST-familien (Tactical Robot for Unmanned Safety & Security Tasks) | Fjernstyret i dag, autonomi under udvikling. $10,2 mio. seed-runde | Nej — intet talværdi fundet nogen steder. Officielt domæne kunne ikke bekræftes i denne søgning (se selv-review) | [Jerusalem Post](https://www.jpost.com/defense-and-tech/article-898434), [Calcalistech](https://www.calcalistech.com/ctechnews/article/b1emlktgmg), [Dealroom](https://app.dealroom.co/news/note/shifters-ai-raises-10m-for-four-legged-defence-and-civilian-robots) |
| 9 | **Robotic Assistance Devices (RAD)**, datterselskab af Artificial Intelligence Technology Solutions Inc. | USA | RADDOG (2LE, 3S, 2S) | **I salg** — 100-styks produktionsserie påbegyndt, leveret til politienheder (bl.a. Taylor Police Department) | Nej — kunne ikke finde talværdier nogen steder, og producentens eget domæne (`raddog.ai`) var **suspenderet** ved kontrol i denne research (se selv-review). Uafklaret om hardwaren er RAD's egen konstruktion eller en tredjeparts platform | [Police1](https://www.police1.com/police-products/police-technology/robots/press-releases/rad-unleashes-raddog-2le-the-robotic-dog-for-law-enforcement-applications-6jNid64rAWuFC62Z/), [GlobeNewswire](https://www.globenewswire.com/news-release/2024/03/21/2850243/0/en/AITX-s-RAD-Has-Begun-100-Unit-Robot-Dog-RADDOG-LE-Generation-2-Production-Run.html) |
| 10 | **Robot.com** (tidl. Kiwibot), Felipe Chávez Cortés | USA (Californien) | R-dog | **Koncept**, unveiled aug. 2026, udrulning planlagt 2027 | Nej — ingen talværdier fundet. Uklart om produktet bygger på selskabets tidligere hjuldrevne leveringsrobot-platform eller en ny firbenet konstruktion | [RoboticsTomorrow](https://www.roboticstomorrow.com/news/2026/08/12/robotcom-unveils-r-dog-a-four-legged-robotic-platform-designed-to-deliver-advertise-and-engage/26939/), [eWeek](https://www.eweek.com/news/r-dog-robot-dog-delivery-ads/) |

---

## 3. Anbefalingsliste, sorteret

### Klart værdige

1. **Keybotic (Keyper)** — det stærkeste fund i hele runden. Reelt kommercielt produkt med navngivne
   industrikunder (BASF, Carburos Metálicos) og en offentlig myndighed (Barcelona Fire Fighters) som
   bruger. Tal er konsistente på tværs af to uafhængige kilder (brancheblad + finansieringsnyhed).
   Eneste hul: den officielle specside er formularlåst, så tallene er endnu ikke bekræftet ordret fra
   producentens egen tekst — kun genfortalt af en fagjournalist, der interviewede selskabet.
2. **Bhairav Robotics (Shvana)** — det eneste kandidatfund i denne runde med et **komplet** talsæt
   direkte på producentens egen produktside, ingen mellemled. Selskabet har desuden en verificerbar
   track record (Vrishabh-køretøjet er dækket af Jane's).

### Sandsynlige

3. **Addverb Technologies (Trakr/Trakr 2.0)** — Addverb er allerede en etableret, velfinansieret
   indisk robotikvirksomhed (ikke en ny opstart), og specifikationerne kommer fra selskabets egne
   pressemeddelelser. Katalogværdig, men bør efterprøves mod en direkte produktside (ikke kun
   pressemeddelelse) før optagelse.
4. **General Autonomy (Param)** — usædvanligt detaljerede tal (35 kg, 3 m/s, 1 m spring, 30 cm
   trappetrin) attribueret direkte til selskabet, VC-støttet (Elevation Capital). Svaghed: intet
   officielt websted fundet, og produktet er selv ifølge kilderne **endnu ikke kommercielt
   tilgængeligt** — status er demonstrator, ikke produkt.
5. **NEURA Robotics ("NEURA Quadruped")** — det økonomisk tungeste selskab på listen (1,4 mia. $
   Series C i juni 2026, investorer inkl. Amazon og Nvidia), men det svageste specgrundlag blandt de
   sandsynlige: kun en pris er offentliggjort, ingen tekniske tal. Kataloget kan efter D1/L21-reglen
   ikke optage robotten, før et specark findes — men selskabets størrelse og eksplicitte 2026-udgivelse
   gør det værd at holde øje med.
6. **Svaya Robotics** — solidt DRDO-partnerskab og et konkret nyttelasttal (25 kg), men kilderne er
   udelukkende presse. Et eget websted findes (svayarobotics.com) og bør efterprøves direkte, før en
   post oprettes.

### Usikre

7. **Edith Defence Systems (Black Panther)** — reelt selskab, reelt produktnavn, men **nul**
   talværdier fundet nogen steder efter to uafhængige søgerunder. For tidligt til en katalogpost.
8. **Shifters AI (TRUST)** — velfinansieret og seriøs (flere uafhængige israelske og internationale
   medier dækker selskabet), men jeg kunne hverken finde talværdier eller bekræfte selskabets
   korrekte officielle domæne i denne søgning. Kræver en ny, mere målrettet søgerunde.
9. **Robotic Assistance Devices (RADDOG)** — den eneste kandidat på listen med **dokumenteret,
   løbende serieproduktion og reelle kunder** (politienheder), hvilket normalt ville placere den i
   toppen. Den lander alligevel i "usikker", fordi to ting ikke kunne afklares: (a) om RAD selv
   konstruerer robotten eller bygger på en tredjepartsplatform, og (b) producentens eget domæne var
   utilgængeligt (kontosuspenderet) ved kontrol — så intet af det, jeg fandt, er efterprøvet mod
   primærkilden i dens nuværende form.
10. **Robot.com (R-dog)** — rent konceptstadie, ingen tal, ingen bekræftet hardwareoprindelse.
    Udrulning er annonceret til 2027. For tidligt til en vurdering, endsige en katalogpost.

---

## 4. Afviste undervejs — med grund

| Kandidat | Land | Hvorfor afvist |
|---|---|---|
| **Skyborne Technologies (CODiAQ)** | Australien | Ikke en selvstændig quadruped-producent. CODiAQ er et våbenmodul/rullebur monteret på **Ghost Robotics' Vision-60**, som allerede er katalogført. Skyborne bygger vægt, ikke robotten |
| **Chironix** | Australien | Bekræftet integrator/forhandler af ANYbotics, Unitree og Boston Dynamics. Intet eget quadruped-produkt |
| **Invelon Technologies** | Fejlagtigt mistænkt for Canada — faktisk Spanien (Lleida) | Officiel Unitree-partner/forhandler, ikke producent. Optræder kun i søgeresultater under en canadisk distributørside, der videresælger deres indhold |
| **Roboteam** | Israel | Bekræftet ren hjul-/bæltekøretøjsproducent (Rook, Probot, MTGR, Roni). Intet quadruped-produkt fundet i to søgerunder |
| **IIT / Moog — HyQReal** | Italien | Forskningsdemonstrator fra et akademisk-industrielt fælleslaboratorium (IIT + Moog). Intet kommercielt selskab sælger den; ingen spinoff fundet |
| **Festo — BionicKangaroo** | Tyskland | Dobbelt diskvalificeret: (1) den er **ikke firbenet** — den hopper på to bagben med hale-aktuering som en kænguru, ikke en quadruped; (2) den er eksplicit en ikke-kommerciel "Bionic Learning Network"-demonstrator, "konceptbil"-agtig efter Festos egen beskrivelse |
| **Tmsuk** | Japan | Ældre sikkerhedsrobotter (T63, Banryu) er hjuldrevne/tobenede, ikke quadrupeds. Nyere SPD-X rørinspektionsrobot har **16 ben** (mangebenet, ikke firbenet) — falder uden for benantalskravet, ligesom dagens Lenovo Daystar-afvisning (seksbenet) |
| **Mirror Me / "Black Panther X"** (mirrorme.bot) | Kina — ikke rest-af-verden | Bekræftet kinesisk selskab (tilknyttet Zhejiang University). Hører til Kina-sporet, ikke dette. Nævnes her for at vise, at det blev fundet og aktivt udelukket, ikke overset |
| **NEURA Robotics — "MiPA"** | Tyskland | En søgesammenfatning kaldte MiPA "a small quadruped." Direkte efterprøvning (Qviro, HumanoidRoboticsTechnology) bekræfter, at MiPA er **hjuldrevet**, ikke benet — den er selskabets hjemmerobot, adskilt fra den faktiske quadruped-reservationsside. Fanget og rettet før optagelse i tabellen — se selv-review for hvorfor dette er et kendt fejlmønster |
| **Hyundai Rotem × Rainbow Robotics — "RB-01K"** | Sydkorea | Sandsynligvis samme objekt som, eller direkte efterfølger til, dagens allerede afviste **Rainbow RBQ-3** (`fund/FUND-nye2.md` nævner selv "RBQ-3 (eller dens mulige efterfølger/omdøbning RB-01K)"). Jeg fandt konkrete tal via forsvarspresse (40 kg, 4 km/t, 10 kg nyttelast, 90 min drift), men **stadig intet** på hverken Rainbow Robotics' eller Hyundai Rotems egen hjemmeside — det bekræfter snarere end omgør den eksisterende afvisning. Selv hvis en primærkilde dukker op, er Rainbow Robotics allerede katalogført; det ville være en ny model, ikke en ny producent |
| **PAL Robotics — SOLO 12** | Spanien | Et 12-frihedsgraders open-source forsknings-/undervisningsplatform solgt som byggesæt eller samlet enhed. Karakteren ligner et forsknings-/undervisningskit mere end et industrielt produkt — grænsetilfælde nær L11-udelukkelsen (undervisningskit). Ikke anbefalet, men nævnt så fravalget er synligt |
| Canada (generelt) | Canada | Systematisk søgt. Ingen selvstændig producent fundet — kun canadiske forhandlere af Unitree/Boston Dynamics |
| Storbritannien (generelt) | UK | Systematisk søgt, inkl. DSEI 2025-sporet specifikt. Ingen selvstændig producent fundet — kun forhandlere/integratorer |
| Frankrig, Norden (Norge/Sverige/Finland/Holland), Polen/Tjekkiet/Østrig ud over MAB | Diverse | Systematisk søgt hver for sig. Ingen selvstændig quadruped-producent fundet i nogen af regionerne |
| Schweiz ud over ANYbotics/RIVR | Schweiz | Efterprøvet specifikt med ekskluderende søgning — ingen tredje schweizisk producent fundet |

---

## 5. Selv-review

**Hvad jeg ikke kunne afgøre:**

- **RADDOG's hardwareoprindelse.** Jeg kunne ikke bekræfte, om Robotic Assistance Devices selv
  konstruerer robotplatformen, eller om RADDOG er bygget på en tredjeparts (fx Unitree) chassis
  med RAD's eget sensor-/kommunikationsmodul ovenpå — et mønster, der er almindeligt i den
  amerikanske sikkerhedsrobot-branche. Dette er afgørende for, om RAD overhovedet tæller som
  "producent" efter projektets egne kriterier (jf. hvordan Chironix og Invelon er udelukket som
  rene integratorer). Producentens eget domæne (`raddog.ai`) var suspenderet ved to separate
  hentningsforsøg i denne søgning, så jeg kunne ikke slå det op direkte.
- **Shifters AI's korrekte officielle domæne.** `shifters.ai`, som jeg forsøgte at hente, viste
  uigenkendeligt indhold (en helt anden virksomhed, "TurboFlow AI") — enten er domænet forkert,
  udløbet eller omregistreret. Jeg fandt ingen alternativ officiel URL i søgeresultaterne på
  trods af tre forsøg med forskellige søgeord.
- **Svaya Robotics' og Edith Defence Systems' egne hjemmesider.** Begge selskabers domæner blev
  identificeret (svayarobotics.com, edsystems.in), men jeg nåede ikke at hente dem direkte for at
  efterprøve, om der findes producentoplyste talværdier der, ud over det presseformidlede. Det er
  den mest oplagte opfølgning, hvis en agent skal tage disse to videre.
- **Keybotics fulde specark.** Siden findes (`keybotic.com/technical-specifications`), men er
  formularlåst — tallene, jeg har medtaget, kommer fra en brancheartikel, der citerer selskabet,
  ikke fra selskabets egen tekst direkte.
- **Om NEURA nogensinde udgiver et specark før lancering.** Reservationssiden lover levering i
  2026 uden tekniske tal. Jeg kan ikke afgøre, om det er fordi produktet stadig er under
  udvikling, eller fordi selskabet bevidst holder specifikationer tilbage til en senere
  produktlancering (selskabets 4NE1-humanoid fulgte samme mønster: pris før specifikationer).

**Hvilke regioner er dårligst dækket:**

- **Canada og Storbritannien** gav reelt nul selvstændige fund — kun forhandlere af allerede
  katalogførte producenter. Jeg vurderer dækningen som solid *for fraværet* (flere uafhængige
  søgeformuleringer landede samme sted), men kan ikke udelukke en lille, dårligt indekseret
  opstart, som ingen af mine søgeord ramte.
- **Frankrig og Norden** er tilsvarende tomme, men med færre søgerunder end Canada/UK — jeg brugte
  én samlet søgning for hver regionsklynge i stedet for land for land. Et enkelt firma i fx
  Nederlandene eller Sverige kan være overset af den grovere søgemetode.
- **Japan** gav kun forældede eller ude-af-scope fund (Tmsuk). Givet at Japan har en stærk
  generel robotikindustri, er det bemærkelsesværdigt tyndt — enten findes der reelt ingen aktiv
  japansk quadruped-producent uden for de store forskningskonsortier (KyoHA blev nævnt som en
  konsortiemodel, ikke et firma), eller også ramte mine engelsksprogede søgeord ikke japansksprogede
  kilder. Jeg søgte ikke på japansk i denne runde — det er den mest oplagte metodesvaghed at rette.

**Hvad jeg ville undersøge med mere tid:**

1. **Søge på japansk og hebraisk direkte** (samme lektion som `FUND-messe.md` fremhævede for
   kinesisk: "læs den [lokalsprogede] side"). Nul fund i en hel region er lige så ofte et
   sprogfilter som et reelt fravær.
2. **Efterprøve RADDOG's hardwareoprindelse** via en analytikerrapport, teardown-artikel eller
   patentsøgning, i stedet for at stole på pressemeddelelser, der aldrig nævner det.
3. **Hente Svaya Robotics' og Edith Defence Systems' egne domæner direkte** for at afgøre, om der
   findes talværdier, jeg overså, fordi de kun optræder bag et menupunkt, presse ikke har fundet.
4. **Genfinde Shifters AI's korrekte domæne** — sandsynligvis via deres finansieringsmeddelelse
   (Ace Capital Partners) eller LinkedIn, som jeg ikke afsøgte i denne runde.
5. **Vente på Keybotics og NEURAs specark** — begge er tydeligt på vej (formular-gate hos
   Keybotic, "expected 2026" hos NEURA), og begge bør genbesøges om nogle måneder frem for at
   antage, de forbliver specløse.

**Hvad jeg er sikker på:** Skyborne/Ghost Robotics-koblingen, Chironix/Invelon som rene
integratorer, MiPA som hjuldrevet, Tmsuk SPD-X's benantal og Schweiz' fravær af en tredje
producent er alle efterprøvet direkte mod mindst to uafhængige kilder eller producentens egen
tekst — de fire afvisninger, jeg har lavest tillid til, er Roboteam (kun to søgerunder, ingen
direkte hentning af roboteam.com) og "ingen fund i Frankrig/Norden" (grovere søgemetode, se
ovenfor).
