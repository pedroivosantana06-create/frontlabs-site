// node tools/contrast-media.mjs <url> <largura> "<seletor>" ["<seletor>"...]
// Contraste de texto sobre imagem: esconde o texto, fotografa o fundo atrás dele e compara
// a cor do texto com a média e com o pixel 90% mais claro do fundo.
// SEEK_MS=<ms>: mede com as animações congeladas nesse instante (rodada 4, Horizonte vivo).
import { chromium } from 'playwright';

const [url, w, ...sels] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(w) < 600 ? 844 : 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: '*{animation-play-state:paused!important;transition:none!important}' });
await page.waitForTimeout(1500);
const lum = ([r, g, b]) => { const c = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
for (const sel of sels) {
  const el = page.locator(sel).first();
  if (!(await el.count())) { console.log(`- ${sel}: não encontrado`); continue; }
  await el.scrollIntoViewIfNeeded();
  // rodada 4: SEEK_MS=<ms> congela todas as animações nesse instante (o Horizonte vivo muda o fundo)
  if (process.env.SEEK_MS) { await page.waitForTimeout(300); await page.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), Number(process.env.SEEK_MS)); await page.waitForTimeout(200); }
  const info = await el.evaluate((e) => { const c = getComputedStyle(e); return { color: c.color, fs: c.fontSize, fw: c.fontWeight }; });
  await el.evaluate((e) => { e.dataset.prevVis = e.style.visibility; e.style.visibility = 'hidden'; });
  const box = await el.boundingBox();
  const buf = await page.screenshot({ clip: box });
  await el.evaluate((e) => { e.style.visibility = e.dataset.prevVis; });
  const px = await page.evaluate(async (b64) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
    const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
    const d = cx.getImageData(0, 0, img.width, img.height).data; const out = [];
    for (let i = 0; i < d.length; i += 16) out.push([d[i], d[i + 1], d[i + 2]]);
    return out;
  }, buf.toString('base64'));
  const ls = px.map(lum).sort((a, b) => a - b);
  const avg = ls.reduce((a, b) => a + b, 0) / ls.length; const p90 = ls[Math.floor(ls.length * 0.9)];
  const m = info.color.match(/[\d.]+/g).map(Number); const alpha = m[3] ?? 1;
  // cor do texto misturada com o fundo médio quando tem transparência
  const avgRgb = px.reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0]).map((v) => v / px.length);
  const txt = lum([0, 1, 2].map((i) => m[i] * alpha + avgRgb[i] * (1 - alpha)));
  const large = parseFloat(info.fs) >= 24 || (parseFloat(info.fs) >= 18.66 && Number(info.fw) >= 700);
  const need = large ? 3 : 4.5;
  const rAvg = ratio(txt, avg), rP90 = ratio(txt, p90);
  console.log(`${rP90 >= need ? '✓' : rAvg >= need ? '~' : '✗'} ${sel} (${info.fs}/${info.fw}, precisa ${need}:1) média ${rAvg.toFixed(2)} · p90 ${rP90.toFixed(2)}`);
}
await browser.close();
