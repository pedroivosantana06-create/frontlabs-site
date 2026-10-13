// LCP, bytes de vídeo baixados no carregamento e vídeos tocando ao rolar (rodada 3).
// node tools/perf-r3.mjs <url> [largura=390]  — usar no build de produção (next start).
// Celular simulado: CPU 4× mais lenta e rede "4G lenta" (1.6 Mbps, 150 ms).
import { chromium } from 'playwright';

const [url = 'http://localhost:3202/', w = '390'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(w) < 600 ? 844 : 900 } });
const cdp = await page.context().newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await cdp.send('Network.enable');
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
let videoBytes = 0;
page.on('response', async (r) => { if (/\/video\//.test(r.url())) videoBytes += Number(r.headers()['content-length'] || 0); });
await page.addInitScript(() => {
  window.__lcp = 0;
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = { t: e.startTime, el: e.element?.tagName + '.' + String(e.element?.className).slice(0, 40) }; }).observe({ type: 'largest-contentful-paint', buffered: true });
});
await page.goto(url, { waitUntil: 'load', timeout: 120000 });
await page.waitForTimeout(3000);
const lcp = await page.evaluate(() => window.__lcp);
console.log(`${w}px · LCP ${Math.round(lcp.t)} ms (${lcp.el}) · vídeo baixado no carregamento: ${(videoBytes / 1024).toFixed(0)} KB`);
// rola a página inteira e anota o máximo de vídeos tocando juntos
let max = 0;
const h = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 300) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(250);
  max = Math.max(max, await page.evaluate(() => [...document.querySelectorAll('video')].filter((v) => !v.paused).length));
}
console.log(`máximo de vídeos tocando ao mesmo tempo: ${max}`);
await browser.close();
