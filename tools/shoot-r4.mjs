// Prints da rodada 4: blocos com o Horizonte vivo e as etapas novas (Front Coded / Front Creative).
// node tools/shoot-r4.mjs <base> <pasta> [larguras=1440,390]
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { widthsArg } from './lib.mjs';

const [base = 'http://localhost:3301', out = 'qa/frontlabs-r4', ws] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const tab = (i) => async (p, w) => {
  // no celular as abas viram acordeão: o botão da etapa continua sendo o [role=tab] ou um botão com o nome
  const t = p.locator('[data-section="tabs"] [role="tab"], [data-section="tabs"] button[aria-expanded]').nth(i);
  await t.evaluate((e, b) => e.scrollIntoView({ block: b, behavior: 'instant' }), w < 600 ? 'start' : 'center'); await t.click(); await p.waitForTimeout(400);
};
const SHOTS = [
  { name: 'live-cards', path: '/', sel: '[data-section="live-cards"]' },
  { name: 'aba-front-coded', path: '/', sel: '[data-section="tabs"]', before: tab(0) },
  { name: 'aba-front-creative', path: '/', sel: '[data-section="tabs"]', before: tab(1) },
  { name: 'aba-booking', path: '/', sel: '[data-section="tabs"]', before: tab(2) },
  { name: 'aba-launch', path: '/', sel: '[data-section="tabs"]', before: tab(3) },
  { name: 'passo-a-passo', path: '/', sel: '[data-section="steps"]' },
  { name: 'cta-final', path: '/', sel: '[data-section="final-cta"]' },
  { name: 'how-it-works', path: '/how-it-works', sel: '[data-section="feature-rows"]' },
  { name: 'pricing-cta-final', path: '/pricing', sel: '[data-section="final-cta"]' },
];
for (const w of widthsArg(ws || '1440,390')) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: w < 600 ? 844 : 900 } });
  for (const s of SHOTS) {
    if (page.url() !== base + s.path) { await page.goto(base + s.path, { waitUntil: 'networkidle' }); await page.waitForTimeout(800); }
    const el = page.locator(s.sel).first();
    await el.evaluate((e) => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
    if (s.before) await s.before(page, w);
    await page.waitForTimeout(2500);
    await el.screenshot({ path: path.join(out, `${w}-${s.name}.png`) });
    console.log(w, s.name, 'ok');
  }
  await browser.close();
}
