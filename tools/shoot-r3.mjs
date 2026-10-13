// Prints das seções da rodada 3 com as animações rodando (rola até cada seção e espera).
// node tools/shoot-r3.mjs <url> <pasta> [larguras=1440,390]
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { widthsArg } from './lib.mjs';

const [url = 'http://localhost:3111', out = 'qa/frontlabs-r3/secoes', ws] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const SECOES = ['pillars', 'live-cards', 'tabs', 'steps'];

for (const w of widthsArg(ws || '1440,390')) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: w < 600 ? 844 : 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  for (const s of SECOES) {
    const el = page.locator(`[data-section="${s}"]`).first();
    await el.evaluate((e) => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.waitForTimeout(3500);
    await el.screenshot({ path: path.join(out, `${w}-${s}.png`) });
    console.log(w, s, 'ok');
  }
  // "What changes": um print por bloco, com o bloco no meio da tela
  const blocks = page.locator('[data-section="results"] li[data-i]');
  for (let i = 0; i < (await blocks.count()); i++) {
    await blocks.nth(i).evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(1600);
    await page.screenshot({ path: path.join(out, `${w}-results-${i + 1}.png`) });
  }
  console.log(w, 'results ok');
  await browser.close();
}
