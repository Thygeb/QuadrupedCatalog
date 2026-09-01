---
name: Firbenede robotter (arbejdstitel — Å1 er ikke afgjort)
description: Et kildeangivet opslagsværk over verdens firbenede robotter, hvor hullerne i vores viden er lige så formgivet som tallene.
colors:
  bund: "#E8EBED"
  panel: "#FAFBFB"
  panel-ro: "#E8EBED"
  tom: "#E8EBED"
  blaek: "#22262A"
  blaek2: "#545C63"
  blaek3: "#5F686F"
  stoev-blaek: "#5F686F"
  accent: "#F2C400"
  accent-ro: "#E8EBED"
  linje: "#C6CCD1"
  hegn: "#9AA3A9"
  fod: "#22262A"
  paafod: "#E8EBED"
  paafod2: "#9AA3A9"
  stans: "#FFFFFF"
typography:
  display:
    fontFamily: "Manrope lokal, Manrope, Segoe UI Variable Text, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(33px, 6.2vw, 76px)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Manrope lokal, Manrope, Segoe UI Variable Text, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(27px, 3.6vw, 46px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Manrope lokal, Manrope, Segoe UI Variable Text, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(23px, 2.8vw, 34px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.026em"
  body:
    fontFamily: "Manrope lokal, Manrope, Segoe UI Variable Text, Segoe UI, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.006em"
  label:
    fontFamily: "SairaSemiCondensed, ui-sans-serif, system-ui, -apple-system, Segoe UI Variable Text, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "11.5px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.15em"
  figur:
    fontFamily: "SairaSemiCondensed, ui-sans-serif, system-ui, -apple-system, Segoe UI Variable Text, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontWeight: 700
    fontFeature: "tnum 1"
  manual:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.62
rounded:
  rund: "12px"
  rund-ind: "8px"
  rund-lille: "6px"
spacing:
  r1: "4px"
  r2: "8px"
  r3: "12px"
  r4: "16px"
  r5: "24px"
  r6: "32px"
  r7: "48px"
  r8: "64px"
  r9: "96px"
  kant: "clamp(16px, 3.4vw, 44px)"
  maal: "68ch"
components:
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.blaek}"
    rounded: "{rounded.rund}"
  videre:
    backgroundColor: "{colors.blaek}"
    textColor: "#FFFFFF"
    rounded: "{rounded.rund-ind}"
    padding: "0 18px"
    height: "46px"
  videre-hover:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
  videre-stille:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    rounded: "{rounded.rund-ind}"
    padding: "0 16px"
    height: "46px"
  nulstil:
    backgroundColor: "transparent"
    textColor: "{colors.blaek2}"
    rounded: "{rounded.rund-ind}"
    height: "44px"
  filter:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.blaek2}"
    rounded: "{rounded.rund-ind}"
    padding: "0 14px"
    height: "44px"
  filter-valgt:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
  sogefelt:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.blaek}"
    rounded: "{rounded.rund-ind}"
    padding: "9px 14px"
    height: "44px"
  vaerdi-tal:
    textColor: "{colors.blaek}"
    typography: "{typography.figur}"
  vaerdi-ikke:
    backgroundColor: "{colors.tom}"
    textColor: "{colors.blaek3}"
    rounded: "2px"
    padding: "1px 5px"
  maerke:
    backgroundColor: "{colors.panel-ro}"
    textColor: "{colors.blaek2}"
    rounded: "{rounded.rund-lille}"
  billednote:
    backgroundColor: "{colors.fod}"
    textColor: "{colors.paafod}"
---
