# FUND — billedport (kvalitetsport på de 45 fabrikantbilleder)

Målt 24. august 2026 i worktreen `udstilling-wt-billedport`, gren `spor/billedport`.
Svar på impeccable-critique-fundet: billedpipelinen har ingen kvalitetsport, og kun
fire yderpunktsbilleder var nogensinde håndkontrolleret. Denne gennemgang åbnede alle
45 billeder med Read-værktøjet og dømte hvert efter en fast bar.

---

## Regel 0 — skill-vurdering

`robotdata` valgt (læst via Skill-værktøjet, som lykkedes — ingen `Unknown skill`,
altså ingen fallback-situation at nævne). Opgaven redigerer robotposters
`billede:`-blokke, og skillen bærer kilde/hentet-disciplinen og selv-tjek-kravet, som
er genbrugt direkte på billedvurderingen.

Gået forbi: `parallelt` (jeg er allerede det ene af flere parallelle spor, sat i gang
af orkestratoren — at splitte 45 billeder ud på endnu et lag underagenter ville
overskride "du er allerede den dedikerede agent for denne opgave, deleger ikke videre"
fra min egen systeminstruks), `grillmig` (intet åbent brief eller beslutning at grille
— opgaven var allerede grillet af orkestratoren), `impeccable`/`critique`/
`ui-ux-critique` (ingen ny flade, ingen visuel kritik af bygget side — ren dataoprydning
i `billede:`-blokke).

---

## GENSTART — den arvede ucommitterede ændring

`data/robots/deep-robotics-lynx-s10.yaml` havde én ucommitteret ændring fra en agent
afbrudt af en procesgenstart. Efterprøvet: sha256 af den kopierede fil
(`2e199fb0472a37e5d1a631ca883f05cf8c5bf6bfe5b0109811b6f054330b1b68`, 143865 byte)
matchede **præcis** MANIFEST.tsv's række for `deep-robotics-lynx-s10-4.jpg`
(kilde-URL `s10_3.jpg` på deeprobotics.cn, samme kilde/hentet som allerede stod i
YAML'en). Erstatningen var **færdig, ikke halv** — beholdt uændret, committet separat
(commit `05ac23e`) som første handling.

---

## Dom-tabellen — alle 45

37 GODKENDT (urørt), 7 AFVIST + fjernet, 1 UVERIFICERET + fjernet (databug). Delte
billeder (byte-identiske filer på tværs af søskendemodeller) er dømt én gang og
gælder for alle rækker, der deler filen — markeret med "(delt)".

| Slug | Dom | Begrundelse |
|---|---|---|
| anybotics-anymal-x | GODKENDT | Rødt ANYmal i industrianlæg, hel maskine, centreret |
| anybotics-anymal | GODKENDT | Samme motivtype, industrianlæg, hel maskine |
| boston-dynamics-spot | GODKENDT (grænsetilfælde) | Hel Spot i transformatorstation; robot ligger i venstre tredjedel — overlever center-crop, men tættest på kanten af noget |
| deep-robotics-lite3 | GODKENDT | Hvidt studiofoto, hel maskine, ren baggrund |
| deep-robotics-lynx-m20-pro | GODKENDT (delt) | Producentens eget seriebillede for hele Lynx-serien (dokumenteret i note) |
| deep-robotics-lynx-m20 | GODKENDT (delt) | Samme fil |
| deep-robotics-lynx-m20s | GODKENDT (delt) | Samme fil |
| deep-robotics-lynx-s10 | GODKENDT | Allerede rettet af forrige agent, efterprøvet ovenfor |
| deep-robotics-mini | **AFVIST → SLETTET** | Billedet var et LiDAR-punktskybillede (farvet højdekort), intet foto af robotten overhovedet |
| deep-robotics-x20 | GODKENDT | Hvidt studiofoto, hel maskine |
| deep-robotics-x30-pro | GODKENDT (delt) | Producentens eget billede for X30/X30 Pro |
| deep-robotics-x30 | GODKENDT (delt) | Samme fil |
| ghost-robotics-spirit-40 | GODKENDT | Hel robot i græs, mærket "GHOSTROBOTICS" på krop (produktbranding, ikke reklametekst) |
| ghost-robotics-vision-60 | GODKENDT | Hel robot, sort studiobaggrund |
| mab-honey-badger-4 | **AFVIST → SLETTET** | Billedet var "Instituto Cajal"-logoet (rød stjerne), intet foto af robotten |
| mab-honey-badger-5 | **AFVIST → SLETTET** | Byte-identisk fejlfil med Honey Badger 4.0 — samme logo |
| magiclab-magicdog-edu | GODKENDT (delt) | Hel robot, studiobaggrund |
| magiclab-magicdog-pro | GODKENDT (delt) | Samme fil |
| magiclab-magicdog-w | GODKENDT | Hjulvariant, hel robot |
| magiclab-magicdog-y1 | GODKENDT | Hel robot på klippegrund, "Y1" på ben |
| rainbow-robotics-rbq-10 | GODKENDT | Hel robot, hvid studiobaggrund |
| raion-robotics-raibo2 | GODKENDT | Hel robot på asfalt, felfoto |
| rivr-one | GODKENDT (grænsetilfælde) | To ens robotter foran en burgerbutik med skiltetekst i baggrunden — begge maskiner tydelige og hele; "to enheder" er ikke det samme som "flere forskellige modeller", og skiltene er miljø, ikke indbrændt reklame |
| unitree-a1 | GODKENDT | Hel robot, sort baggrund |
| unitree-a2-w | GODKENDT | Hel robot i bjergterræn, actionfoto |
| unitree-a2 | GODKENDT | Hel robot midt i spring, bjergterræn |
| unitree-aliengo | GODKENDT — **modsiger briefets P0-fund** | Se separat afsnit nedenfor |
| unitree-as2-w | GODKENDT | Hel robot i lejrscene, person til stede men ikke hovedmotiv |
| unitree-as2 | GODKENDT | Hel robot på ruinplads |
| unitree-b1 | GODKENDT | Hel robot på klippetop |
| unitree-b2-w | GODKENDT | Hel robot i vandfald, kinesisk skilt ("危险") er miljøskiltning, ikke overlejret reklame |
| unitree-b2 | **UVERIFICERET → SLETTET** | Databug: `fil:` pegede på `.jpg`, som ikke findes — den rigtige fil er `.png`. Indholdet nåede aldrig at blive set (kvoten løb tør). Se separat afsnit |
| unitree-go1 | GODKENDT | Hel robot, blåt lys, mørk baggrund |
| unitree-go2-w | **AFVIST → SLETTET** | Dusinvis af robotter i formation på stadion, hver med rødt løve-dans-kostumehoved der skjuler sensorhovedet — ingen enkelt, tydelig maskine |
| unitree-go2 | **AFVIST → SLETTET** (kendt P0-fund) | Skærmbillede af telefon-app (LiDAR-kort + kamerafeed), bekræftet |
| unitree-laikago | GODKENDT (grænsetilfælde) | Hel robot på podie, men "Laikago Pro" fylder ca. 40 % af billedbredden som løst tekstelement — vurderet som produktnavn/titelkort, ikke salgstekst, og robotten er stadig det klare hovedmotiv |
| weilan-alphadog-c500 | GODKENDT (delt) | Hel robot, "WEILAN AlphaDog" som soklenavn (fint) |
| weilan-alphadog-c501 | GODKENDT (delt) | Samme fil |
| weilan-alphadog-e300 | GODKENDT (delt) — **modsiger briefets P0-fund** | Se separat afsnit nedenfor |
| weilan-alphadog-e400l | GODKENDT (delt) | Samme fil |
| weilan-babyalpha | GODKENDT | Hel robot, hvid baggrund, "WEILAN" på halsbånd |
| xiaomi-cyberdog-2 | GODKENDT | Hel robot, gennemsigtigt design-render |
| yobotics-e-dog | GODKENDT (grænsetilfælde) | Lille robot på udstillingsstand, kinesisk tekst på selve standens fysiske skilt (miljø, ikke overlejret reklame); robotten fylder relativt lidt i billedet men er entydigt hovedmotivet |
| yobotics-y10 | **AFVIST → SLETTET** (fejlmønster briefet forudsagde, men på forkert producent) | Familiebanner: seks forskellige Yobotics-modeller i række, indbrændt kinesisk marketingtekst |
| yobotics-y20 | **AFVIST → SLETTET** | Byte-identisk med Y10's fejlbillede |

**G = 37 · B (byttet) = 0 · S (slettet) = 8 · N = 45. G+B+S = 45.**

---

## To vigtige afvigelser fra briefets fire navngivne P0-fund

Briefet navngav fire kendte fejl. Ved håndkontrol holdt to af dem ikke stik for den
fil, jeg faktisk så — det skal frem, ikke glattes ud:

1. **unitree-aliengo** var beskrevet som "en tæt makro-detalje, som object-fit:cover
   beskærer til en blank flade". Billedet, jeg åbnede (3840×2160), viser hele robotten
   — hoved, alle fire ben, krop, "UNITREE"-mærke på siden — i en mørk, tåget
   studiobelysning med rigelig negativ plads omkring. Det er ikke en makrodetalje efter
   nogen rimelig læsning. Jeg dømte GODKENDT ud fra det, jeg faktisk så, ikke ud fra
   briefets beskrivelse.
2. **"Et weilan-billede bærer indbrændt kinesisk reklametekst"** — jeg gennemgik alle
   fem unikke Weilan-billeder (c500/c501 delt, e300/e400l delt, babyalpha) og fandt
   INGEN kinesisk tekst på nogen af dem. Til gengæld fandt jeg **præcis det beskrevne
   fejlmønster** — familiebanner + indbrændt kinesisk marketingtekst — på
   **yobotics-y10/y20**, som ikke stod på briefets liste. Min bedste gæt: fejlen er
   forvekslet mellem to kinesiske producenter i den oprindelige critique, ikke at
   billedet siden er skiftet ud (der findes ingen commit-historik, der peger på en
   mellemliggende rettelse).

Begge afvigelser er vigtige at få frem, fordi opgavens hele præmis er, at ingen tal
skal tages på tro — heller ikke briefets egne.

---

## unitree-b2 — databug, ikke en billeddom

`fil:` pegede på `fotos/fabrikant/unitree-b2.jpg`, som ikke findes på disk. Den
faktiske fil hed `unitree-b2.png` (gyldige PNG-magicbytes, sha256-match til
MANIFEST.tsv's `unitree-b2-2.png`, hentet fra unitree.com/b2). Sitet har derfor vist
intet billede for B2 hele tiden — en broken reference, ikke min fejl, men fundet af
mig.

Jeg forsøgte at åbne `.png`-filen for at dømme dens indhold, men ramte lige da denne
sessions billedlæsekvote (se næste afsnit). Billedet er **aldrig blevet set**, og jeg
har derfor ikke godkendt det på gætteri — blokken er slettet, samme behandling som de
syv reelt afviste. Filen ligger stadig i arkivet
(`media/robotbilleder/unitree-b2/unitree-b2-2.png`) og kan hentes igen, når indholdet
kan efterprøves.

---

## Billedlæsekvoten — hvorfor der ikke blev byttet, kun slettet

Efter de 45 primære billeder var gennemgået, ramte billedlæsning en ustabil
tilstand: samme fil fejlede med "could not process image" på ét forsøg og lykkedes på
et andet (bekræftet ved at genlæse `unitree-a1.png`, som lykkedes, og `unitree-b1.jpg`,
som derefter fejlede igen). Jeg efterprøvede at det ikke var filkorruption — flere af
de fejlende filer har gyldige PNG/JPEG-magicbytes og matcher MANIFEST.tsv's
sha256-summer. Værktøjets egen fejlbesked anbefaler ikke at blive ved med at forsøge,
så jeg stoppede efter flere uafhængige test (enkeltvis og batchet, forskellige filer,
forskellige tidspunkter).

Konsekvens: for de 7 reelt afviste billeder + unitree-b2 kunne jeg **ikke** åbne
arkivkandidaterne i `media/robotbilleder/<slug>/` for at lede efter en erstatning.
Byttefeltet (b) i opgaven er derfor ikke udført — kun (b)'s fallback: slet, når intet
kan bekræftes egnet. Hver af de 8 YAML-filer har fået en note med hvilke
arkivkandidater der står tilbage til en opfølgende gennemgang:

| Slug | Utestede arkivkandidater |
|---|---|
| deep-robotics-mini | mini-1, -2, -4, -5 (kun -3, den afviste LiDAR-fil, er set) |
| mab-honey-badger-4 | badger-4-2, -3, -4, -5 (kun -1, logoet, er set) |
| mab-honey-badger-5 | Samme filsæt som HB4 (byte-identisk arkivmappe) |
| unitree-go2-w | go2-w-2, -3, -4, -5 (kun -1, formationsbilledet, er set) |
| unitree-go2 | go2-2, -3, -4, -5 (kun -1, app-skærmbilledet, er set) |
| yobotics-y10 | y10-1, -3, -4, -5 (kun -2, familiebanneret, er set) |
| yobotics-y20 | Samme filsæt som Y10 |
| unitree-b2 | b2-2 (den fil, der faktisk ligger bag `fil:`-stien) slet ikke set |

---

## Gitignorerede filændringer i min worktree

`assets/fotos/fabrikant/` er gitignoreret — disse ændringer følger IKKE med grenen og
skal udføres igen (eller genskabes fra arkivet) af den, der fletter, hvis en fremtidig
gennemgang bytter billeder ind:

**Slettet (8 filer):**
- `assets/fotos/fabrikant/deep-robotics-mini.png`
- `assets/fotos/fabrikant/mab-honey-badger-4.png`
- `assets/fotos/fabrikant/mab-honey-badger-5.png`
- `assets/fotos/fabrikant/unitree-go2-w.jpg`
- `assets/fotos/fabrikant/unitree-go2.png`
- `assets/fotos/fabrikant/yobotics-y10.jpg`
- `assets/fotos/fabrikant/yobotics-y20.jpg`
- `assets/fotos/fabrikant/unitree-b2.png`

**Tilføjet/ændret:** ingen. Ingen billeder blev byttet (se kvote-afsnittet ovenfor).
`deep-robotics-lynx-s10.jpg` blev ikke rørt af mig — den var allerede kopieret af den
afbrudte agent, og den ændring fulgte heller ikke med grenen (samme gitignore-regel);
det er nævnt her, så den ikke overraskes væk ved en flet.

Intet i `media/robotbilleder/` er rørt (kun læst).

---

## Selv-tjek

Efterprøvet 44 af 45 billede-blokke ved direkte visuel åbning (`unitree-b2` er den
ene, jeg aldrig fik set — behandlet som uverificeret, ikke som "nul fejl"). Fandt 4
fejl blandt de 44 sete (deep-robotics-mini, mab-honey-badger-4, mab-honey-badger-5,
unitree-go2-w, unitree-go2, yobotics-y10, yobotics-y20 — syv rækker, fire distinkte
fejlbilleder pga. delte filer) plus 1 datafejl (unitree-b2's filsti). Kontrolleret at
`hentet`-datoer og `kilde`-URL'er i de urørte 37 GODKENDT-rækker ikke blev rørt (jeg
har kun redigeret blokke, jeg selv dømte AFVIST eller UVERIFICERET). Kørt
`node tools/validate.mjs` (0 fejl, 1 uændret advarsel om Ghost Vision 60's
hastighedsafvigelse — ikke min sag) og `node tools/build.mjs` (37 billedfelter brugt =
45 − 8, som forventet).

## Selv-review

**Domme tættest på grænsen, og hvorfor de faldt som de gjorde:**

- **boston-dynamics-spot**: robotten ligger i billedets venstre tredjedel med meget
  luft til højre. Jeg dømte GODKENDT, fordi selve maskinen (krop + kamera-hoved) ligger
  tilstrækkeligt centralt til at overleve et kvadratisk center-crop — det er kun den
  forreste fod, der risikerer at blive skåret. Havde robotten stået endnu længere ude
  i kanten, var dommen faldet den anden vej.
- **rivr-one**: to identiske robotter, ikke to forskellige modeller — jeg læste barens
  "familiebannere med flere modeller" som rettet mod blandede modeller, ikke mod
  antal enheder af samme model. Baggrundens butiksskiltning er tæt på at ligne
  "indbrændt reklametekst", men er fysisk miljø (skilte på en bygning), ikke en grafik
  lagt oven på fotoet. Usikker på om CEO'en ville dømme det samme — det er den dom, jeg
  er mindst sikker på.
- **unitree-laikago**: "Laikago Pro" som løst, lysende tekstelement fylder betydelig
  plads. Jeg endte med GODKENDT, fordi det læses som en titel/produktnavn, ikke som
  salgstekst ("køb nu", specifikationer) — men det er tættere på "infografik med tekst"
  end noget andet godkendt billede i sættet, og en strengere læser kunne rimeligt
  afvise det.
- **yobotics-e-dog**: robotten er lille i billedet med meget dødt rum foran (en hvid
  udstillingssokkel), og der er kinesisk tekst på standens fysiske skilt. Jeg dømte
  GODKENDT, fordi motivet stadig er entydigt og teksten er miljø, ikke overlejret — men
  det er det svageste "GODKENDT" i hele sættet rent kompositorisk.
- **unitree-aliengo** og **weilan-alphadog-e300/e400l**: ikke grænsetilfælde i sig
  selv, men vigtige, fordi de modsiger briefets forhåndsantagelser. Jeg er sikker på
  min egen læsning af de faktiske filer (gennemgået i detalje ovenfor), men usikker på
  **hvorfor** briefet beskrev noget andet — det bør afklares, ikke antages væk.

**Det jeg ikke nåede:** byttesøgningen for de 7 afviste + unitree-b2. Billedlæsekvoten
blev ustabil midt i arkivgennemgangen, og jeg valgte at stoppe frem for at blive ved
med at forsøge mod værktøjets egen anbefaling. Det er den største åbne post i denne
rapport — 8 robotter er nu på målepladen, som måske har et bedre billede liggende
klar i arkivet, én fil væk fra at blive fundet.
