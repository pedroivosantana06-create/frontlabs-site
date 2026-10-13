// node tools/gradient-r4.mjs <base-url> <saida-dir> [largura]
// Rodada 4: o Horizonte vivo se mexe de verdade? Para cada bloco com o gradiente: grava 6s de vídeo
// (bloco centralizado) e compara o bloco em t=0, t=2s e t=6s (diferença média de pixel, 0–255).
// Opcional: CPU=4 para emular celular lento.
import { chromium } from 'playwright';
import { mkdirSync, renameSync } from 'node:fs';

const [base, out, w = '1440'] = process.argv.slice(2);
const width = Number(w), height = width < 600 ? 844 : 900;
mkdirSync(out, { recursive: true });
const tab = (i) => async (p) => { await p.locator('[data-section="tabs"]').scrollIntoViewIfNeeded(); await p.locator('[data-section="tabs"] [role="tab"]').nth(i).click(); await p.waitForTimeout(500); };
const TARGETS = [
  { name: 'running-while-you-work', path: '/', sel: '[data-section="live-cards"] [data-field]' },
  { name: 'aba-booking', path: '/', before: tab(2), sel: '[data-section="tabs"] [role="tabpanel"] [data-stage]' },
  { name: 'aba-launch', path: '/', before: tab(3), sel: '[data-section="tabs"] [role="tabpanel"] [data-stage]' },
  { name: 'passo-05', path: '/', sel: '[data-section="steps"] [data-stage] >> nth=-1' },
  { name: 'cta-final-home', path: '/', sel: '[data-section="final-cta"] > div' },
  { name: 'cta-final-pricing', path: '/pricing', sel: '[data-section="final-cta"] > div' },
  { name: 'how-it-works-booking', path: '/how-it-works', sel: '[data-stage] >> nth=2' },
];
const diff = (p, a, b) => p.evaluate(async ([a, b]) => {
  const load = async (s) => { const i = new Image(); i.src = 'data:image/png;base64,' + s; await i.decode(); const c = document.createElement('canvas'); c.width = 200; c.height = Math.round(200 * i.height / i.width); c.getContext('2d').drawImage(i, 0, 0, c.width, c.height); return c.getContext('2d').getImageData(0, 0, c.width, c.height).data; };
  const [x, y] = [await load(a), await load(b)]; let s = 0, n = 0;
  for (let i = 0; i < x.length; i += 4) { s += Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]); n += 3; }
  return s / n;
}, [a.toString('base64'), b.toString('base64')]);

const browser = await chromium.launch();
let fail = 0;
for (const t of TARGETS) {
  const ctx = await browser.newContext({ viewport: { width, height }, recordVideo: { dir: out, size: { width, height } } });
  const p = await ctx.newPage();
  if (process.env.CPU) { const s = await ctx.newCDPSession(p); await s.send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.CPU) }); }
  await p.goto(base + t.path, { waitUntil: 'networkidle' });
  if (t.before) await t.before(p);
  const el = p.locator(t.sel).first();
  await el.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await p.waitForTimeout(800);
  // esconde o conteúdo por cima: compara só o fundo
  await el.evaluate((e) => { const st = document.createElement('style'); st.id = 'r4hide'; st.textContent = '[data-r4] > :not([data-living]):not(img){visibility:hidden!important}'; document.head.append(st); e.setAttribute('data-r4', ''); const lg = e.querySelector('[data-living]'); if (lg && lg.parentElement !== e) lg.parentElement.setAttribute('data-r4', ''); });
  const s0 = await el.screenshot(); await p.waitForTimeout(2000);
  const s2 = await el.screenshot(); await p.waitForTimeout(4000);
  const s6 = await el.screenshot();
  const d2 = await diff(p, s0, s2), d6 = await diff(p, s0, s6);
  const ok = d2 >= 6 && d6 >= 6;
  if (!ok) fail++;
  console.log(`${ok ? '✓' : '✗'} ${t.name}: diferença média t0→2s ${d2.toFixed(1)} · t0→6s ${d6.toFixed(1)} (0–255)`);
  const v = p.video(); await ctx.close();
  if (v) renameSync(await v.path(), `${out}/gradiente-${t.name}.webm`);
}
await browser.close();
if (fail) process.exitCode = 1;
