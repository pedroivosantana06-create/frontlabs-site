// node tools/gap-audit.mjs <url> [larguras=1440,390]
// Mede o maior vazio vertical entre blocos de conteúdo dentro de cada seção e aponta
// o que passar de 12% da altura da janela (DESIGN.md §10.1, adaptada para web).
import { openPage, widthsArg } from './lib.mjs';

const [url, ws] = process.argv.slice(2);
if (!url) { console.error('uso: node tools/gap-audit.mjs <url> [larguras]'); process.exit(1); }
let fails = 0;
for (const w of widthsArg(ws || '1440,390')) {
  const { browser, page } = await openPage(url, w);
  const res = await page.evaluate(() => {
    const vh = innerHeight; const limit = vh * 0.12;
    let secs = [...document.querySelectorAll('[data-section], section, footer')];
    secs = secs.filter((e) => !secs.some((o) => o !== e && o.contains(e)));
    // blocos de conteúdo: texto, controles, mídia que não seja fundo (fundos com mais de 60% da janela são ignorados),
    // palcos ([data-stage]) e desenhos com role=img (rodada 3: o Horizonte vivo tem camadas maiores que a moldura)
    const hasText = (e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    const leafs = (root) => [...root.querySelectorAll('*')]
      .filter((e) => e.matches('img,video,svg,button,input,[data-media],[data-stage],[role=img]') || hasText(e))
      .filter((e) => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.height > 2 && r.width > 2 && r.height < innerHeight * 0.6 && c.visibility !== 'hidden' && !e.closest('[hidden]'); });
    return secs.map((s) => {
      const items = leafs(s).map((e) => { const r = e.getBoundingClientRect(); return [r.top + scrollY, r.bottom + scrollY]; }).sort((a, b) => a[0] - b[0]);
      let maxGap = 0; let at = 0; let bottom = items.length ? items[0][1] : 0;
      for (const [t, b] of items) { if (t - bottom > maxGap) { maxGap = t - bottom; at = bottom; } bottom = Math.max(bottom, b); }
      return { name: s.dataset.section || s.id || s.tagName.toLowerCase(), maxGap: Math.round(maxGap), at: Math.round(at), limit: Math.round(limit) };
    });
  });
  console.log(`\n== ${w}px (limite ${res[0]?.limit}px = 12% de ${w < 600 ? 844 : 900})`);
  for (const r of res) {
    const bad = r.maxGap > r.limit; if (bad) fails++;
    console.log(`${bad ? '✗' : '✓'} ${r.name.padEnd(18)} maior vazio ${String(r.maxGap).padStart(4)}px  (y=${r.at})`);
  }
  await browser.close();
}
console.log(fails ? `\n${fails} seção(ões) acima do limite.` : '\nNenhum vazio acima do limite.');
