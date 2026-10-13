// Grava a home inteira rolando, parando em cada seção para as animações aparecerem (rodada 3).
// node tools/record-home-r3.mjs <url> <saida.webm> [largura=1440]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const [url = 'http://localhost:3202/', out = 'qa/frontlabs-r3/home-raw.webm', w = '1440'] = process.argv.slice(2);
const vp = { width: Number(w), height: Number(w) < 600 ? 844 : 900 };
const dir = path.dirname(out);
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: vp, recordVideo: { dir, size: vp } });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });

const rolar = (ate, ms) => page.evaluate(({ ate, ms }) => new Promise((ok) => {
  const de = scrollY; const t0 = performance.now();
  const e = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
  const f = (n) => { const t = Math.min(1, (n - t0) / ms); scrollTo(0, de + (ate - de) * e(t)); t < 1 ? requestAnimationFrame(f) : ok(); };
  requestAnimationFrame(f);
}), { ate, ms });
const topo = (s) => page.locator(s).first().evaluate((e) => e.getBoundingClientRect().top + scrollY - 70);

await page.waitForTimeout(2500); // herói
for (const [s, fica] of [['[data-section="scroll-fill"]', 1500], ['[data-section="pillars"]', 7000], ['[data-section="live-cards"]', 7500]]) {
  await rolar(await topo(s), 1800);
  await page.waitForTimeout(fica);
}
// "What changes": rola devagar pelos 3 blocos
const r = page.locator('[data-section="results"]');
const r0 = await topo('[data-section="results"]');
const rh = await r.evaluate((e) => e.offsetHeight);
await rolar(r0 + rh - vp.height, 9000);
await page.waitForTimeout(800);
for (const [s, fica] of [['[data-section="tabs"]', 12000], ['[data-section="steps"]', 6000], ['[data-section="faq"]', 1500], ['[data-section="final-cta"]', 1500]]) {
  await rolar(await topo(s), 1800);
  await page.waitForTimeout(fica);
}
const video = page.video();
await ctx.close();
await browser.close();
fs.renameSync(await video.path(), out);
console.log('ok', out);
