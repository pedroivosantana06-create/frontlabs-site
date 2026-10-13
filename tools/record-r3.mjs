// Grava os vídeos curtos dos nossos sites para a home da Front Labs (rodada 3).
// Uso: node record-r3.mjs <url-do-venue> <pasta-saida> [home|booking|booking-m]
// Saída: <pasta>/<nome>.webm cru do Playwright (o corte e a conversão ficam no encode-r3.sh).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const [base = 'http://localhost:3011', out = './rec', only] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });

async function gravar(nome, viewport, fn) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, recordVideo: { dir: out, size: viewport } });
  const page = await ctx.newPage();
  const t0 = Date.now();
  // marca o instante em que o conteúdo bom começa (para cortar o começo vazio)
  const marca = { inicio: 0 };
  await fn(page, () => (marca.inicio = (Date.now() - t0) / 1000));
  const fim = (Date.now() - t0) / 1000;
  const video = page.video();
  await ctx.close();
  await browser.close();
  const destino = path.join(out, `${nome}.webm`);
  fs.renameSync(await video.path(), destino);
  fs.writeFileSync(path.join(out, `${nome}.json`), JSON.stringify({ inicio: marca.inicio, fim }));
  console.log(nome, 'ok', marca, fim.toFixed(1) + 's');
}

// rolagem suave por rAF (easing nas pontas), sem trancos
async function rolar(page, ate, ms) {
  await page.evaluate(
    ({ ate, ms }) =>
      new Promise((ok) => {
        const de = window.scrollY;
        const t0 = performance.now();
        const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
        const passo = (agora) => {
          const t = Math.min(1, (agora - t0) / ms);
          window.scrollTo(0, de + (ate - de) * ease(t));
          if (t < 1) requestAnimationFrame(passo);
          else ok();
        };
        requestAnimationFrame(passo);
      }),
    { ate, ms },
  );
}

async function carregar(page, url) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => page.waitForLoadState('load'));
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}*{cursor:none!important}' });
  await page.waitForTimeout(1200);
}

if (!only || only === 'home') {
  await gravar('home-scroll', { width: 1440, height: 900 }, async (page, comeca) => {
    await carregar(page, base + '/');
    // pré-carrega as imagens das primeiras telas e volta ao topo
    await page.evaluate(() => window.scrollTo(0, 2800));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    comeca();
    await page.waitForTimeout(900);
    await rolar(page, 2700, 11000);
    await page.waitForTimeout(700);
  });
}

async function fluxoTour(page, comeca, mobile) {
  await carregar(page, base + '/');
  await page.waitForTimeout(600);
  comeca();
  await page.waitForTimeout(500);
  // abre o card pelo link /?tour da página (o mesmo que o visitante clica)
  const link = page.locator('a[href="/?tour"]:visible').first();
  if (await link.count()) await link.click();
  else await page.goto(base + '/?tour');
  const card = page.getByRole('dialog');
  await card.waitFor();
  await page.waitForTimeout(1300);
  // escolhe a data (2º chip, para mostrar a troca de seleção)
  const chips = card.locator('label:has(input[type=radio])');
  await chips.nth(1).click();
  await page.waitForTimeout(700);
  await chips.nth(2).click();
  await page.waitForTimeout(900);
  // convidados: arrasta o slider em passos
  const range = card.locator('input[type=range]');
  await range.focus();
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(380);
  }
  await page.waitForTimeout(600);
  await card.getByRole('button', { name: /continue/i }).click();
  await page.waitForTimeout(900);
  // contato (dados de exemplo; o envio do template não manda nada)
  const dados = [['nome', 'Alex Rivera'], ['email', 'alex@example.com'], ['telefone', '(555) 010-2030']];
  for (const [nome, v] of dados) {
    await card.locator(`input[name="${nome}"]`).pressSequentially(v, { delay: mobile ? 28 : 34 });
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(500);
  await card.locator('button[type=submit]').click();
  await page.waitForTimeout(2600);
}

if (!only || only === 'booking') {
  await gravar('booking-flow', { width: 1440, height: 900 }, (p, c) => fluxoTour(p, c, false));
}
if (!only || only === 'booking-m') {
  await gravar('booking-flow-m', { width: 390, height: 844 }, (p, c) => fluxoTour(p, c, true));
}
