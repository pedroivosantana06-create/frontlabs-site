// node tools/fps-r4.mjs <url> — rodada 4: quadros por segundo (requestAnimationFrame, 5s) com o
// Horizonte vivo na tela, celular emulado (390×844, DPR 3) e CPU 4× mais lenta.
import { chromium, devices } from 'playwright';

const [url] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 13'], defaultBrowserType: undefined });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await p.goto(url, { waitUntil: 'networkidle' });
for (const [name, sel] of [['running-while-you-work', '[data-section="live-cards"] [data-field]'], ['passo-05', '[data-section="steps"] [data-stage] >> nth=-1'], ['cta-final', '[data-section="final-cta"] > div']]) {
  await p.locator(sel).first().evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await p.waitForTimeout(1000);
  const r = await p.evaluate(() => new Promise((res) => {
    const t = []; const start = performance.now();
    const f = (now) => { t.push(now); if (now - start < 5000) requestAnimationFrame(f); else res(t); };
    requestAnimationFrame(f);
  }));
  const gaps = r.slice(1).map((x, i) => x - r[i]);
  const fps = (r.length - 1) / ((r.at(-1) - r[0]) / 1000);
  const long = gaps.filter((g) => g > 50).length;
  console.log(`${fps >= 45 ? '✓' : '✗'} ${name}: ${fps.toFixed(1)} fps · quadros > 50 ms: ${long} · pior ${Math.max(...gaps).toFixed(0)} ms`);
}
await browser.close();
