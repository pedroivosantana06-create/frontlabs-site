// node tools/interact-r3.mjs <base>  — teste de interação da rodada 3: o da rodada 2 (abas, acordeões, formulário, menu,
// navegação) + as animações novas (busca, checklist, cards ao vivo, fundo do Results, código, vídeos, reduced-motion).
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:3111';
const b = await chromium.launch();
const ok = (c, m) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) process.exitCode = 1; };
let p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(base + '/', { waitUntil: 'networkidle' });
const sel = () => p.evaluate(() => [...document.querySelectorAll('[data-section="tabs"] [role="tab"]')].findIndex((t) => t.getAttribute('aria-selected') === 'true'));
// troca automática (6s) quando visível
await p.locator('[data-section="tabs"]').scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
const s0 = await sel(); await p.waitForTimeout(10800); const s1 = await sel(); // a aba Code dura 10s (rodada 3)
ok(s1 === (s0 + 1) % 5, `abas: troca automática ${s0} → ${s1}`);
ok(await p.locator('[data-section="tabs"] span[class*="FeatureTabs-module__"][class$="__bar"]').count() === 1, 'abas: barra de progresso visível na etapa ativa');
// clique para
await p.locator('[data-section="tabs"] [role="tab"]').nth(3).click(); await p.waitForTimeout(300);
ok(await sel() === 3, 'abas: clique ativa a etapa 4');
await p.waitForTimeout(7000); ok(await sel() === 3, 'abas: troca automática para depois do clique');
ok(await p.locator('[data-section="tabs"] span[class*="FeatureTabs-module__"][class$="__bar"]').count() === 0, 'abas: barra some depois da interação');
// teclado
await p.keyboard.press('ArrowDown'); ok(await sel() === 4, 'abas: seta para baixo');
await p.keyboard.press('Home'); ok(await sel() === 0, 'abas: Home');
await p.keyboard.press('End'); ok(await sel() === 4, 'abas: End');
// pausa/retoma
const pause = p.locator('[data-section="tabs"] button[aria-label*="auto-advance"]');
ok((await pause.getAttribute('aria-label')).startsWith('Resume'), 'abas: botão mostra "Resume" depois de parar');
await pause.click(); ok((await pause.getAttribute('aria-label')).startsWith('Pause'), 'abas: retomar volta a troca automática');
// FAQ
const q = p.locator('[data-section="faq"] button[aria-expanded]');
await q.nth(1).click(); ok(await q.nth(1).getAttribute('aria-expanded') === 'true', 'faq: abre a pergunta 2');
await q.nth(1).click(); ok(await q.nth(1).getAttribute('aria-expanded') === 'false', 'faq: fecha a pergunta 2');
// formulário
const f = p.locator('[data-section="final-cta"] form');
await f.locator('button[type=submit]').click(); ok(await f.locator('[aria-invalid="true"]').count() === 1, 'form: vazio dá erro');
await f.locator('input').fill('isso não'); await f.locator('button[type=submit]').click(); ok((await f.locator('[aria-live]').textContent()).includes("doesn't look"), 'form: formato inválido dá erro');
await f.locator('input').fill('meunegocio.com'); await f.locator('button[type=submit]').click(); ok(await p.locator('[data-section="final-cta"] [role=status]').count() === 1, 'form: sucesso');
// navegação + aria-current
for (const [label, path] of [['How it works', '/how-it-works'], ['What you get', '/what-you-get'], ['Pricing', '/pricing'], ['Questions', '/questions']]) {
  await p.locator('header nav').getByRole('link', { name: label }).click(); await p.waitForURL('**' + path); await p.waitForFunction((l) => document.title.startsWith(l), label, { timeout: 5000 }).catch(() => {});
  const cur = await p.locator('header nav[aria-label="Main"] [aria-current="page"]').textContent();
  ok(cur === label && (await p.title()).startsWith(label), `nav: ${path} abre, aria-current e title certos`);
}
await p.locator('footer').getByRole('link', { name: 'Home' }).click(); await p.waitForURL(base + '/'); ok(true, 'rodapé: volta para a home');
const r404 = await p.goto(base + '/nao-existe'); ok(r404.status() === 404 && (await p.locator('h1').textContent()).includes("isn't here"), '404 da marca');
// pricing: acordeão
await p.goto(base + '/pricing', { waitUntil: 'networkidle' });
const pq = p.locator('[data-section="faq"] button[aria-expanded]'); await pq.nth(2).click(); ok(await pq.nth(2).getAttribute('aria-expanded') === 'true', 'pricing: acordeão abre');
await p.close();
// celular: menu + acordeão das abas
p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto(base + '/', { waitUntil: 'networkidle' });
const t = p.locator('header button[aria-controls="menu-mobile"]');
await t.click(); ok(await t.getAttribute('aria-expanded') === 'true', 'menu: abre');
await p.keyboard.press('Escape'); ok(await t.getAttribute('aria-expanded') === 'false', 'menu: Esc fecha');
await t.click(); await p.locator('#menu-mobile').getByRole('link', { name: 'Pricing' }).click(); await p.waitForURL('**/pricing'); ok(true, 'menu: link abre /pricing');
await p.goto(base + '/', { waitUntil: 'networkidle' });
await p.locator('[data-section="tabs"] [role="tab"]').nth(2).click(); await p.waitForTimeout(800);
const inline = await p.evaluate(() => { const items = [...document.querySelectorAll('[data-section="tabs"] [data-stage]')].filter((e) => e.offsetParent); return items.length; });
ok(inline === 1, 'celular: abas viram acordeão com a mídia dentro da etapa aberta');
await p.close();
// ---------- rodada 3: animações ----------
p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(base + '/', { waitUntil: 'networkidle' });
const scrollTo = (s, block = 'start') => p.locator(s).first().evaluate((e, block) => e.scrollIntoView({ block, behavior: 'instant' }), block);
// busca do Found: digita, troca de termo
await scrollTo('[data-section="pillars"]');
const termos = new Set();
for (let i = 0; i < 40; i++) {
  const t = await p.locator('[data-section="pillars"] [class*="SearchDemo-module"][class*="__query"]').textContent();
  if (t.endsWith('near me')) termos.add(t);
  await p.waitForTimeout(300);
}
ok(termos.size >= 2, `busca: troca de termo (${[...termos].join(' | ')})`);
// checklist do Working: marca tudo e recomeça
const marcados = () => p.locator('[data-section="pillars"] [class*="ChecklistDemo-module"][class*="__list"] li[class*="__on"]').count();
let max = 0, voltou = false;
for (let i = 0; i < 40; i++) { const n = await marcados(); if (n > max) max = n; if (max === 5 && n < 5) voltou = true; await p.waitForTimeout(250); }
ok(max === 5 && voltou, `checklist: marca os 5 e recomeça (máx ${max}, recomeçou ${voltou})`);
// vídeos: tocam na tela, no máximo 2 ao mesmo tempo
await p.waitForTimeout(800);
const tocando = () => p.evaluate(() => [...document.querySelectorAll('video')].filter((v) => !v.paused).length);
// as fontes só entram perto da tela: dá até 4s para carregar e começar
let nt = 0; for (let i = 0; i < 16 && nt === 0; i++) { await p.waitForTimeout(250); nt = await tocando(); }
ok(nt >= 1 && nt <= 2, `vídeos: tocam quando visíveis (${nt} tocando nos pilares)`);
// cards ao vivo: atualizam a cada 3s com defasagem e param fora da tela
// (recarrega a página para partir do zero: rolar pelos pilares já pode ter posto a seção na tela)
await p.goto(base + '/', { waitUntil: 'networkidle' });
await scrollTo('[data-section="live-cards"]');
await p.evaluate(() => {
  window.__upd = [0, 0, 0];
  document.querySelectorAll('[data-section="live-cards"] li[class*="LiveCards-module"][class*="__card"]').forEach((card, i) => {
    new MutationObserver(() => { window.__upd[i]++; }).observe(card.querySelector('p[aria-live]'), { childList: true, subtree: true });
  });
});
await p.waitForTimeout(3300);
const u1 = await p.evaluate(() => [...window.__upd]);
await p.waitForTimeout(3000);
const u2 = await p.evaluate(() => [...window.__upd]);
ok(u1[0] > 0 && u1[2] === 0 && u2.every((n) => n > 0), `cards ao vivo: atualizam a cada 3s, defasados (${u1} → ${u2})`);
ok((await p.locator('[data-section="live-cards"] [role=img][aria-label="26"]').count()) === 1, 'cards ao vivo: 26 previews (fixo)');
await scrollTo('[data-section="faq"]');
await p.waitForTimeout(500);
const u3 = await p.evaluate(() => [...window.__upd]);
await p.waitForTimeout(4000);
const u4 = await p.evaluate(() => [...window.__upd]);
ok(JSON.stringify(u3) === JSON.stringify(u4), 'cards ao vivo: param fora da tela');
// What changes: o fundo troca nos 3 blocos
const ativos = [];
for (let i = 0; i < 3; i++) {
  await scrollTo(`[data-section="results"] li[data-i="${i}"]`, 'center');
  await p.waitForTimeout(900);
  ativos.push(await p.evaluate(() => [...document.querySelectorAll('[data-section="results"] [class*="ResultsScroll-module"][class*="__bg"]')].findIndex((e) => /__on/.test(e.className))));
}
ok(ativos.join() === '0,1,2', `results: fundo troca a cada bloco (${ativos})`);
// código da etapa Code: termina, mostra "build passed" e recomeça
await scrollTo('[data-section="tabs"]');
await p.locator('[data-section="tabs"] [role="tab"]').nth(0).click();
const status = () => p.locator('[data-section="tabs"] [role=tabpanel] [class*="CodeTyper-module"][class*="__status"]').textContent();
let passou = false, recomecou = false;
for (let i = 0; i < 50; i++) { const t = await status(); if (t.includes('build passed')) passou = true; else if (passou) { recomecou = true; break; } await p.waitForTimeout(300); }
ok(passou && recomecou, `código: termina com "build passed" e recomeça (${passou}, ${recomecou})`);
// pausa global (WCAG 2.2.2): o botão dos cards ao vivo para tudo e retoma
await scrollTo('[data-section="live-cards"]'); await p.waitForTimeout(3500);
await p.locator('[data-section="live-cards"] button[aria-label="Pause animations"]').click();
const pa = await p.evaluate(() => [...window.__upd]); await p.waitForTimeout(4000);
ok(JSON.stringify(pa) === JSON.stringify(await p.evaluate(() => [...window.__upd])) && (await p.locator('html[data-motion-paused]').count()) === 1, 'pausa: botão para os cards ao vivo e marca a página');
await scrollTo('[data-section="pillars"]'); await p.waitForTimeout(1500);
ok((await p.evaluate(() => [...document.querySelectorAll('video')].filter((v) => !v.paused).length)) === 0, 'pausa: vídeos parados');
await p.locator('[data-section="pillars"] button[aria-label="Play animations"]').click(); await p.waitForTimeout(2500);
ok((await p.evaluate(() => [...document.querySelectorAll('video')].filter((v) => !v.paused).length)) >= 1, 'pausa: retomar volta a tocar');
await p.close();
// celular: o vídeo do agendamento (versão do celular) carrega e toca em /how-it-works
p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto(base + '/how-it-works', { waitUntil: 'networkidle' });
const vb = p.locator('[data-section="feature-rows"] video[aria-label^="Our booking flow"]').first();
await vb.evaluate((e) => e.scrollIntoView({ block: 'center' }));
let vok = false; for (let i = 0; i < 20 && !vok; i++) { await p.waitForTimeout(250); vok = await vb.evaluate((v) => !v.paused && v.currentSrc.includes('booking-flow-m')); }
ok(vok, 'celular: vídeo do agendamento (versão -m) carrega e toca em /how-it-works');
await p.close();
// reduced motion: linha cheia, sem barra
const ctx = await b.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
p = await ctx.newPage(); await p.goto(base + '/', { waitUntil: 'networkidle' });
const prog = await p.evaluate(() => getComputedStyle(document.querySelector('[data-section="scroll-fill"] [data-word]')).getPropertyValue('--progress'));
ok(prog.trim() === '100%', `reduced-motion: linha cheia (${prog.trim()})`);
await p.locator('[data-section="tabs"]').scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
ok(await p.locator('[data-section="tabs"] span[class*="FeatureTabs-module__"][class$="__bar"]').count() === 0, 'reduced-motion: sem troca automática');
ok((await p.locator('[data-section="tabs"] [role=tabpanel] [class*="CodeTyper-module"][class*="__status"]').textContent()).includes('build passed'), 'reduced-motion: código inteiro, parado');
await p.locator('[data-section="pillars"]').evaluate((e) => e.scrollIntoView({ block: 'start' })); await p.waitForTimeout(1500);
ok((await p.locator('[data-section="pillars"] [class*="SearchDemo-module"][class*="__query"]').textContent()) === 'businesses near me', 'reduced-motion: busca parada no último termo');
ok((await p.locator('[data-section="pillars"] li[class*="__on"]').count()) === 5, 'reduced-motion: checklist inteiro marcado');
ok((await p.evaluate(() => [...document.querySelectorAll('video')].filter((v) => !v.paused).length)) === 0, 'reduced-motion: vídeos parados no poster');
await p.locator('[data-section="live-cards"]').evaluate((e) => e.scrollIntoView({ block: 'start' }));
await p.waitForTimeout(1500); // primeira entrada (data-on) já aconteceu
const r1 = await p.locator('[data-section="live-cards"] ul').innerHTML(); await p.waitForTimeout(4500);
ok(r1 === (await p.locator('[data-section="live-cards"] ul').innerHTML()), 'reduced-motion: cards ao vivo parados');
await b.close();
