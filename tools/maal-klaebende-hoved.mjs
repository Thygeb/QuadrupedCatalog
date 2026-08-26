/**
 * tools/maal-klaebende-hoved.mjs — spor/enheder, acceptkriterium 4.
 *
 * Vaelger tre robotter paa /sammenligning/, ruller til sidste raekke ("CE
 * oplyst") og maaler, om .specimen-hoved (kolonnehovedet med robotnavnene)
 * stadig er i billedet der. Bruger playwright-installationen i
 * C:/Praktik/websites/maalevaerktoej/ (bevidst uden for repoet, samme
 * afhaengighedsfrihed som maal.mjs) via absolut file://-sti - ligger ikke i
 * node_modules her og indgaar ALDRIG i et byg.
 *
 * Brug (server skal koere paa dist-mappen, fx `python -m http.server 8081
 * --directory dist-e` fra projektroden):
 *   node tools/maal-klaebende-hoved.mjs http://localhost:8081/da/sammenligning/
 */
import { chromium } from 'file:///C:/Praktik/websites/maalevaerktoej/node_modules/playwright/index.mjs';

const url = process.argv[2] ?? 'http://localhost:8081/da/sammenligning/';
const browser = await chromium.launch();
const side = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await side.goto(url, { waitUntil: 'networkidle' });

// Vaelg 3 robotter, saa tabellen faktisk bygges (JS-drevet, tom uden valg).
await side.evaluate(() => {
  const boxes = document.querySelectorAll('input.f-saml');
  for (let i = 0; i < 3 && i < boxes.length; i++) {
    boxes[i].checked = true;
    boxes[i].dispatchEvent(new Event('change', { bubbles: true }));
  }
});
await side.waitForTimeout(300);

const foer = await side.evaluate(() => {
  const h = document.querySelector('.specimen-hoved');
  if (!h) return { fundet: false };
  const r = h.getBoundingClientRect();
  return { fundet: true, top: r.top, position: getComputedStyle(h).position };
});

// Rul til sidste raekke ("CE oplyst" er skemaets sidste felt).
await side.evaluate(() => {
  const raekker = document.querySelectorAll('.saml-raekke');
  const sidste = raekker[raekker.length - 1];
  if (sidste) sidste.scrollIntoView({ block: 'end' });
});
await side.waitForTimeout(200);

const efter = await side.evaluate(() => {
  const h = document.querySelector('.specimen-hoved');
  const raekker = document.querySelectorAll('.saml-raekke');
  const sidste = raekker[raekker.length - 1];
  const hr = h.getBoundingClientRect();
  const sr = sidste ? sidste.getBoundingClientRect() : null;
  return {
    hovedTop: hr.top, hovedBund: hr.bottom,
    hovedISkaerm: hr.top >= 0 && hr.top < window.innerHeight,
    sidsteRaekkeTop: sr ? sr.top : null,
    sidsteRaekkeISkaerm: sr ? (sr.top < window.innerHeight && sr.bottom > 0) : null,
    scrollY: window.scrollY,
  };
});

console.log(JSON.stringify({ foer, efter }, null, 1));
await browser.close();
