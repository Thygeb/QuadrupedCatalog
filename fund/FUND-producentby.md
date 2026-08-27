# FUND-producentby — efterprøvning af 61 producentby-værdier mod egen materiale

Spor `spor/paastande`, 27. aug 2026. Efterprøver punkt 2/3 i briefet: er `producentby` i
`data/robots/*.yaml` belagt af producentens eget gemte materiale i `media/_kilder/`
(læst read-only fra hovedrepoets absolutte sti, aldrig skrevet i, intet nyt hentet)?

## Metode

For hver af de 61 poster med `producentby` er producentens navn + by søgt i alt gemt
materiale for den producent, i **begge** former hvor relevant: translitteration
(`Zuerich`/`Zürich`, `Poznan`/`Poznań`) og — for kinesiske producenter — både pinyin/engelsk
og kinesiske tegn (`Beijing`/北京, `Suzhou`/苏州, `Tianjin`/天津, `Nanjing`/南京, `Wujiang`/吴江).
Et træf tæller kun som **BELAGT**, hvis filen er producentens eget domæne, egen PDF eller
egen pressemeddelelse på eget domæne — ikke vores egne script (ramte `boston-dynamics-spot`
tidligere: "Waltham" lå kun i `sidefod.sh`) og ikke et usaved eksternt opslag (ramte
`yufan-lingmao-cyvet`: en Baidu Baike-kilde nævnt i en eksisterende note er ikke gemt lokalt).

**To værktøjsfælder fundet undervejs, begge dokumenteret så de ikke gentages:**

1. **Det indbyggede søgeværktøj (Grep) gav "No files found" på ALLE søgninger** mod
   `media/_kilder`'s absolutte sti uden for denne worktree — også for "Waltham", som CLAUDE.md
   selv siger findes ét sted. Bekræftet som falsk negativ: almindelig `grep -ril` i Bash fandt
   samme streng øjeblikkeligt. **Alle søgninger i dette dokument er kørt med Bash `grep` eller
   node, aldrig det indbyggede Grep-værktøj**, fordi det ikke kan stoles på uden for worktreen.
2. **`grep -l` og `grep -c`/`-o` er uenige på filer uden linjeskift** ("HTML document ...
   with no line terminators" — hele filen er én linje). Seks Uniubi/Yufan-filer blev listet
   af `grep -ril "Hangzhou|杭州"` som træf, men `grep -c` gav 0 på hver af dem, og en
   uafhængig node-søgning bekræftede 0 forekomster i alle seks. **Enhver "ja" i tabellen
   nedenfor er bekræftet med et faktisk citat (`-o`/node), aldrig kun en `-l`-filliste.**

## Optælling

**Efterprøvede 59 af 61 byer: 50 belagt, 9 ubelagte, 0 kan ikke afgøres (50+9+0=59).**
De resterende 2 (Ghost Robotics, begge modeller) bærer allerede `ikke_oplyst` med en
læservendt note fra et tidligere spor — de bærer ingen påstand at efterprøve og tælles
udenfor N, men er talt med i de 61, der bærer feltet.

## Tabel

| Slug | Producent | By i data (før) | Fundet | Fil + linje i rågrundlaget | Dom |
|---|---|---|---|---|---|
| addverb-trakr-20 | Addverb | Noida | ja | `raa-kand6-2026-08-25/addverb-com-press-trakr2-2026-08-25-text.txt:162` (egen presseside, addverb.com) | BELAGT |
| addverb-trakr-5 | Addverb | Noida | ja | samme fil:162 | BELAGT |
| anybotics-anymal-x | ANYbotics | Zuerich | ja | `raa-felt-eu-2026-08-19/anybotics-forside-2026-08-19.html:622` ("8050 Zürich, Switzerland") | BELAGT |
| anybotics-anymal | ANYbotics | Zuerich | ja | samme fil:622 | BELAGT |
| astrall-dynamics-hypertron-t01 | Astrall Dynamics | Shenzhen | ja | `raa-kand2-2026-08-24/astralldynamics-om-os-2026-08-24.html:296` ("总部位于深圳市宝安区...") | BELAGT |
| bhairav-robotics-shvana | Bhairav Robotics | Kakinada, Andhra Pradesh | delvist | `raa-kand3-2026-08-24/bhairav-careers.txt:13` ("our office in Kakinada") | BELAGT (Kakinada); "Andhra Pradesh" står ikke i noget gemt materiale — ikke rettet, da Kakinada utvetydigt ligger der og staten ikke modsiges |
| boston-dynamics-spot | Boston Dynamics | Waltham, Massachusetts | nej | 54 filer i `raa-vest-2026-08-19/` gennemsøgt (node), 0 træf — kun i vores eget `sidefod.sh` | **UBELAGT → RETTET** til `ikke_oplyst` |
| cvte-maxhub-x7 | CVTE | Guangzhou | ja | `raa-kand2-2026-08-24/cvte-maxhub-x7-nyhed-en-2026-08-24.html:2464` ("Guangzhou Shiyuan Electronic Technology Company Limited") | BELAGT |
| deep-robotics-lite3 | DEEP Robotics | Hangzhou | ja | `raa-kina-deep-magic-2026-08-19/deeprobotics-site-forside-cn-2026-08-19.html:855` ("浙江省杭州市西湖区...") | BELAGT |
| deep-robotics-lynx-m20-pro | DEEP Robotics | Hangzhou | ja | samme fil:855 | BELAGT |
| deep-robotics-lynx-m20 | DEEP Robotics | Hangzhou | ja | samme fil:855 | BELAGT |
| deep-robotics-lynx-m20s | DEEP Robotics | Hangzhou | ja | samme fil:855 | BELAGT |
| deep-robotics-lynx-s10 | DEEP Robotics | Hangzhou | ja | samme fil:855 | BELAGT |
| deep-robotics-mini | DEEP Robotics | Hangzhou | ja | samme fil:855 | BELAGT |
| deep-robotics-x20 | DEEP Robotics | Hangzhou | ja | samme fil:855 | BELAGT |
| deep-robotics-x30-pro | DEEP Robotics | Hangzhou | ja | samme fil:855 | BELAGT |
| deep-robotics-x30 | DEEP Robotics | Hangzhou | ja | samme fil:855 | BELAGT |
| galileo-c1-w | Galileo (Tianjin) | Tianjin | ja | `raa-kand4-2026-08-25/galileotime-home-2026-08-25.html:1` (minificeret enkeltlinje-fil, eget domæne galileotime.com — "伽利略（天津）技术有限公司") | BELAGT |
| galileo-c1 | Galileo (Tianjin) | Tianjin | ja | samme fil:1 | BELAGT |
| galileo-e1-w | Galileo (Tianjin) | Tianjin | ja | samme fil:1 | BELAGT |
| galileo-e1 | Galileo (Tianjin) | Tianjin | ja | samme fil:1 | BELAGT |
| galileo-s1-w | Galileo (Tianjin) | Tianjin | ja | samme fil:1 | BELAGT |
| galileo-s1 | Galileo (Tianjin) | Tianjin | ja | samme fil:1 | BELAGT |
| genisom-gangben-l1-w | GENISOM AI | Beijing / Suzhou | ja | `raa-kand1b-2026-08-24/genisomai-aboutus-2026-08-24.html:473` (Beijing-adresse) og `:477` (Suzhou-adresse) | BELAGT |
| genisom-gangben-l1 | GENISOM AI | Beijing / Suzhou | ja | samme fil:473/477 | BELAGT |
| genisom-gangben-l2-w-ultra | GENISOM AI | Beijing / Suzhou | ja | samme fil:473/477 | BELAGT |
| genisom-gangben-l2-w | GENISOM AI | Beijing / Suzhou | ja | samme fil:473/477 | BELAGT |
| genisom-gangben-l2 | GENISOM AI | Beijing / Suzhou | ja | samme fil:473/477 | BELAGT |
| genisom-qiuqiu-sp1 | GENISOM AI | Beijing / Suzhou | ja | samme fil:473/477 | BELAGT |
| genisom-tongchui-m1-pro | GENISOM AI | Beijing / Suzhou | ja | samme fil:473/477 | BELAGT |
| genisom-tongchui-m1-ultra | GENISOM AI | Beijing / Suzhou | ja | samme fil:473/477 | BELAGT |
| genisom-tongchui-m1 | GENISOM AI | Beijing / Suzhou | ja | samme fil:473/477 | BELAGT |
| ghost-robotics-spirit-40 | Ghost Robotics | (allerede `ikke_oplyst`) | n/a | rettet af et tidligere spor, egen note i filen | ingen påstand — udenfor N |
| ghost-robotics-vision-60 | Ghost Robotics | (allerede `ikke_oplyst`) | n/a | rettet af et tidligere spor, egen note i filen | ingen påstand — udenfor N |
| keybotic-keyper | Keybotic | Barcelona | ja | `raa-kand3-2026-08-24/keybotic-about-us.txt:68` ("Based in Barcelona") | BELAGT |
| mab-honey-badger-4 | MAB Robotics | Poznan | ja | `raa-felt-eu-2026-08-19/mabrobotics-forside-2026-08-19.html` (schema.org-adresse "Poznań, 61-659, Poland") | BELAGT |
| mab-honey-badger-5 | MAB Robotics | Poznan | ja | samme fil | BELAGT |
| magiclab-magicdog-edu | MagicLab | Wujiang/Suzhou | delvist | `raa-kina-deep-magic-2026-08-19/magiclabglobal-site-forside-en-2026-08-19.html:1052` ("headquartered in Suzhou"); "Wujiang" 0 træf (pinyin og 吴江) i 17 gemte filer | **UBELAGT (som skrevet) → RETTET** til `Suzhou` |
| magiclab-magicdog-pro | MagicLab | Wujiang/Suzhou | delvist | samme fil:1052 | **UBELAGT → RETTET** til `Suzhou` |
| magiclab-magicdog-w | MagicLab | Wujiang/Suzhou | delvist | samme fil:1052 | **UBELAGT → RETTET** til `Suzhou` |
| magiclab-magicdog-y1 | MagicLab | Wujiang/Suzhou | delvist | samme fil:1052 | **UBELAGT → RETTET** til `Suzhou` |
| microrobotech-movenew-p1 | MicroRoboTech | Hangzhou | ja | `raa-kand1b-2026-08-24/micbotics-support-2026-08-24.html:7` ("Hangzhou Juwei Technology Co., Ltd.") | BELAGT |
| microrobotech-movenew-t1 | MicroRoboTech | Hangzhou | ja | samme fil:7 | BELAGT |
| neura-quadruped | NEURA Robotics | Metzingen | ja | `raa-kand6-2026-08-25/neura-quadruped-reservation-2026-08-25-text.txt:284` ("Gutenbergstrasse 44, 72555 Metzingen, Germany") | BELAGT |
| pudu-d5-w | Pudu Robotics | Shenzhen | ja | `raa-pdf-2026-08-24/pudu-download-page.html:1` (minificeret enkeltlinje-fil, eget domæne pudurobotics.com — "Shenzhen Pudu Technology Co., LTD") | BELAGT |
| pudu-d5 | Pudu Robotics | Shenzhen | ja | samme fil:1 | BELAGT |
| rainbow-robotics-rbq-10 | Rainbow Robotics | Sejong-si | ja | allerede rettet af et tidligere spor — egen note citerer producentens sidefodsadresse (`data/robots/rainbow-robotics-rbq-10.yaml:22`) | BELAGT (ingen ny handling) |
| raion-robotics-raibo2 | Raion Robotics | Daejeon | ja | `raa-anvendelse-2026-08-19/raionrobotics-raibo2-produktside-en-2026-08-21.html:12` ("Daejeon H.Q 1st Floor, 272-37, Munji-Ro, Yuseong-Gu") | BELAGT |
| weilan-alphadog-c500 | WEILAN | Nanjing | ja | `raa-kina-weilan-xiaomi-2026-08-19/weilan-alphadogc-produktside-2026-08-19.html:28` ("南京蔚蓝智能科技有限公司") | BELAGT |
| weilan-alphadog-c501 | WEILAN | Nanjing | ja | samme fil:28 | BELAGT |
| weilan-alphadog-e300 | WEILAN | Nanjing | ja | samme fil:28 | BELAGT |
| weilan-alphadog-e400l | WEILAN | Nanjing | ja | samme fil:28 | BELAGT |
| weilan-babyalpha | WEILAN | Nanjing | ja | samme fil:28 | BELAGT |
| yobotics-e-dog | Shandong Youbaote Intelligent Robot | Shandong | nej | `raa-kina-weilan-xiaomi-2026-08-19/yobotics-omos-2026-08-19.html:779` ("Jinan City, Shandong Province" — Shandong er provinsen) | **UBELAGT (som skrevet) → RETTET** til `Jinan` |
| yobotics-y10 | Shandong Youbaote Intelligent Robot | Shandong | nej | samme fil:779 | **UBELAGT → RETTET** til `Jinan` |
| yobotics-y20 | Shandong Youbaote Intelligent Robot | Shandong | nej | samme fil:779 | **UBELAGT → RETTET** til `Jinan` |
| yuejia-yj30-max-w | Yuejia Lingdong | Shenzhen | ja | `raa-kand4-2026-08-25/yuejialingdong-en-2026-08-25.html:249` ("Work Address: ... Shenzhen Bay Innovation Technology Company ... Shenzhen") | BELAGT |
| yuejia-yj30-max | Yuejia Lingdong | Shenzhen | ja | samme fil:249 | BELAGT |
| yuejia-yj30-w | Yuejia Lingdong | Shenzhen | ja | samme fil:249 | BELAGT |
| yuejia-yj30 | Yuejia Lingdong | Shenzhen | ja | samme fil:249 | BELAGT |
| yufan-lingmao-cyvet | Yufan Intelligent | Hangzhou | nej | 8 filer på uniubi.com gennemsøgt (node), 0 direkte træf — kun en Zhejiang-provins ICP-kode (`raa-kand2-2026-08-24/yufan-uniubi-forside-2026-08-24.html:1`, "浙ICP备..."); en eksisterende note henviser til Baidu Baike, som ikke er gemt lokalt | **UBELAGT → RETTET** til `ikke_oplyst` |

## Rettelser foretaget (punkt 3)

Kun de 9 rækker dømt UBELAGT er rettet, alle med en læservendt note og citat, i samme form
som Ghost Robotics- og Rainbow-forlæggene:

- `boston-dynamics-spot.yaml` → `ikke_oplyst` (ny note)
- `yufan-lingmao-cyvet.yaml` → `ikke_oplyst` (ny note)
- `magiclab-magicdog-{edu,pro,w,y1}.yaml` → `Suzhou` (4 filer, samme note)
- `yobotics-{e-dog,y10,y20}.yaml` → `Jinan` (3 filer, samme note)

De 50 belagte og de 2 allerede-`ikke_oplyst` Ghost Robotics-poster er ikke rørt.
