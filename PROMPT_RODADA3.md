# Rodada 3: vida nas seções da home da Front Labs

**Rodar sem o Pedro por perto.** NÃO pergunte nada: decida pelo mais razoável, anote em `PROGRESSO.md` e siga. Resumo final em português.

Leia antes: `CLAUDE.md`, `docs/DESIGN.md`, `frontlabs/docs/REVISAR.md` e as entradas da Rodada 2 em `PROGRESSO.md`.
Trabalhe **só em `frontlabs/`**. O herói e a linha que preenche ao rolar **ficam como estão** (o Pedro aprovou).

**Antes de tudo:** `git pull` na raiz (o repositório agora está no GitHub e um amigo do Pedro também mexe). Trabalhe na branch `rodada-3`.

---

## O que o Pedro pediu (resumo fiel)

1. **"What a local business needs online"**: cada um dos 4 blocos ganha um elemento visual animado.
2. **"Running while you work"**: o fundo (Horizonte) tem que ter vida, se mexendo; os números nunca param, atualizam a cada 3s mesmo que o valor fique igual; o card de previews mostra **26** previews nesta semana (dado real).
3. **"What changes when it's handled"**: só **3 blocos**, com a imagem de fundo trocando conforme cada bloco passa.
4. **"What we do at every step"**: Code com animação de código sendo escrito; Design com a home de um site nosso passando; Booking com a nossa seção de agendamento e o fundo animado; Launch igual, com o fundo animado; Care igual.
5. **No lugar do "Pay once. No monthly fee."**: uma seção de **passo a passo** (enviar o site ou as informações → preview → design → código → lançamento) com o botão para ver os preços.

---

## Fase A: preparar os vídeos dos nossos sites (assets reais)

### A1. Achar o site "Amor Celeste"
O Pedro chama de "o venue Amor Celeste que a gente criou". Procure, nesta ordem, por pastas, arquivos, `content/site.ts` ou `docs/venue.json` com "celest" (sem diferenciar maiúscula): `~/venues`, `~/clientes`, `~/Downloads`, `~/Documents`, `~/Desktop`. Ignore `node_modules`, `.next` e `.git`.
- Achou: use esse site.
- Não achou: use o site mais completo de `~/venues` que **não** seja o `bella-terra` (sem autorização), dando preferência a um com fotos boas na home (`oaks-event-center`, `therusticchandelier` ou `chandelier-farms`). Anote a escolha em `PROGRESSO.md` e no REVISAR ("trocar pelo Amor Celeste quando achar").

### A2. Gravar dois vídeos curtos com o Playwright
Rode o site escolhido em uma porta livre (as 3010–3019 costumam estar ocupadas; use 3201) e grave com `recordVideo` do Playwright, em 1440×900:
1. **`home-scroll`**: a home rolando devagar, de cima até mais ou menos 3 telas para baixo, em ~12s, com rolagem suave (rAF, sem trancos). Sem o cursor aparecendo.
2. **`booking-flow`**: a nossa seção de agendamento do template de venues (o card **Schedule a Tour**: `components/tour/TourCard.tsx`, abre com `/?tour`). Grave o fluxo em ~10s: o card abrindo, escolhendo uma data, mexendo no número de convidados, escolhendo um horário e chegando na tela de confirmação (se a celebração final existir, mostre o começo dela).

Para cada um: corte o começo vazio, gere `webm` (VP9) e `mp4` (H.264, `-movflags +faststart`) com no máximo ~2,5 MB cada (use o `ffmpeg` que estiver disponível; se não houver, `npx ffmpeg-static`), e um `poster.jpg` do primeiro frame bom. Salve em `frontlabs/public/video/`. Também gere a versão do celular do `booking-flow` (390×844) se o card ficar ilegível pequeno.

Esses vídeos mostram o site de um cliente numa peça da Front Labs: anote no REVISAR o `[CONFIRMAR] autorização do venue para usar o site na home da Front Labs`.

### A3. Componente `LoopVideo`
`<video autoplay muted loop playsinline preload="metadata" poster>` com `webm` + `mp4`. Só começa a tocar quando entra na tela (IntersectionObserver) e pausa quando sai. Com `prefers-reduced-motion`, fica parado no poster. Use dentro do `PreviewCard` (a janela de navegador da marca), no lugar da imagem.

### A4. Componente `LivingGradient` (fundo vivo)
O Horizonte com movimento lento e contínuo, sem trocar as cores do arquivo (o DESIGN.md pede sem color grade): 2 ou 3 camadas do `gradiente-horizonte-*.jpg`, cada uma com `transform` próprio em loop (translate + scale + uma rotação de poucos graus, de 18s a 32s, `alternate`, fases diferentes), `filter: blur()` na de cima e `mix-blend-mode: soft-light` ou opacidade parcial para as manchas "respirarem". Grão (`grao.png`) por cima, parado. Só `transform`/`opacity` animados (nada de animar `background-position`, que pesa). Pausa quando fora da tela. Com `prefers-reduced-motion`, parado.
Esse é o fundo de: "Running while you work", Booking e Launch do "What we do at every step".

Commit `frontlabs: r3 fase A (vídeos, LoopVideo, LivingGradient)`.

---

## Fase B: as seções

### B1. "What a local business needs online" (`Pillars`)
Cada um dos 4 blocos ganha, **em cima** do texto, uma área visual (proporção 4:3, raio 18, fundo `#F4F3F1` ou o fundo borrado, 8px de margem do card, como os cards de passo do DESIGN.md §6.8). O texto (número mono, título, frase) fica embaixo, como hoje. No desktop, 4 colunas; em telas médias, 2×2; no celular, um embaixo do outro.

| Bloco | Visual |
|---|---|
| **Found** | Uma página de busca genérica (estilo "resultado de busca", **sem logo nem nome do Google**): barra de busca com o texto sendo **digitado, apagado e trocado** em loop: "wedding venues near me" → "plumbers near me" → "pool builders near me" → "dentists near me" → "businesses near me". Embaixo, 3 resultados em esqueleto (linhas cinza); depois de cada busca, o 1º resultado acende com "Your Business · yourbusiness.com" e uma estrelinha de avaliação. Nada de "#1" escrito. |
| **Loved** | `PreviewCard` mini com o vídeo `home-scroll` (o site do venue passando bonito). URL na barra: `preview.frontlabs.co/your-business`. |
| **Working** | Um celular desenhado em CSS com um site simples dentro, e ao lado uma lista que vai se marcando em sequência (✓ com ponto verde `--ok`): "Loads fast on phones", "Every button works", "Secure (https)", "Readable by Google", "Works on any screen". Depois de marcar tudo, espera 2s e recomeça. Um anel fino de "speed" pode encher junto, **sem número**. |
| **Booked** | `PreviewCard` mini com o vídeo `booking-flow` (a nossa seção de agendamento). Status embaixo: "booked · added to calendar". |

Animações só quando o bloco está visível; `prefers-reduced-motion` mostra o estado final parado.

### B2. "Running while you work" (`LiveCards`)
- Fundo: `LivingGradient`.
- **Os números nunca param:** a cada 3s, cada card "atualiza": o odômetro rola de novo até o valor (mesmo que o valor seja igual, os dígitos dão a volta), o sparkline ganha um ponto novo e desliza para a esquerda, os mini-stats piscam de leve e o log troca de mensagem. Os 3 cards não atualizam juntos: defasagem de ~1s entre eles. Pare tudo quando a seção sai da tela.
- Valores podem variar um pouco a cada atualização (±1 nos mini-stats ilustrativos), **exceto** o card de previews: **26 previews built this week**, fixo (dado real, de 12/10/2026). Os outros dois cards continuam com `/example`.
- Atualizar o content: `illustrative: false` só no card de previews.

### B3. "What changes when it's handled" (`Results`) — rolagem com fundo que troca
- **Só 3 blocos:** "More people find you", "More calls and visits", "Nothing to manage" (os outros 3 saem do content).
- Layout de *scrollytelling*: uma moldura grande (raio 24, a largura da página menos o gutter) com a **imagem de fundo presa** (`position: sticky`, altura de uma tela) e os 3 blocos de texto rolando por cima, um por vez. Cada bloco é um card (branco ou vidro escuro discreto: **sem vidro fosco**, DESIGN §6.3; use card branco raio 24 ou texto branco direto sobre a imagem com véu).
- Quando um bloco chega no meio da tela, o fundo troca para a imagem dele com **crossfade** de ~600ms (e um leve zoom de 1.04 → 1). Imagens: `foto-cadeiras.jpg` (find you), `foto-noiva-notebook.jpg` (calls and visits), `foto-borrada-hero.jpg` ou Horizonte (nothing to manage). Ajuste o véu para o texto passar AA (meça com `tools/contrast-media.mjs`).
- Mantenha a animação de subida (rise) dos cards.
- Título da seção e a virada continuam ("What changes when it's handled." / "Less chasing. More booked."), acima da moldura.
- Celular: o fundo continua preso e os blocos passam por cima, em largura total.
- `prefers-reduced-motion`: sem zoom, troca seca.

### B4. "What we do at every step" (`FeatureTabs` + `Stage`)

| Etapa | Visual novo |
|---|---|
| **Code** | Janela de editor (barra com 3 bolinhas e o nome do arquivo `app/page.tsx`, fundo `#0A0A0A`, Geist Mono 13) com **código sendo digitado** linha a linha, cursor piscando, rolando quando enche. Código de verdade e curto (um componente Next com `<title>`, um JSON-LD `LocalBusiness`, `<h1>` e um botão "Book a visit"). Cores de sintaxe só em tons de cinza + branco, com **no máximo uma** cor da paleta Paisagem (céu `#86AABB`) para strings. Ao terminar, mostra "✓ build passed" em mono com o ponto verde, espera 2s e recomeça. |
| **Design** | `PreviewCard` grande com o vídeo `home-scroll` sobre o fundo borrado. |
| **Booking** | `PreviewCard` com o vídeo `booking-flow` sobre o `LivingGradient`. |
| **Launch** | Igual ao de hoje (pílula do domínio + "Live."), só que com o `LivingGradient` atrás. |
| **Care** | Igual ao de hoje. |

O `Stage` usa as mesmas peças na página `/how-it-works` (as linhas da página devem ganhar os mesmos visuais).

### B5. Passo a passo no lugar do "Pay once. No monthly fee."
Substituir a seção de preço da home por uma seção de **processo** (o componente `Steps`, adaptado para 5 passos):
- Rótulo `/how it works`, título **"From your link to live."**, virada **"Pay once. No monthly fee."** (a frase do preço continua, como virada).
- 5 cards de passo (DESIGN §6.8: card branco raio 24, imagem do momento em cima, círculo de etapa mono, rótulo curto, título de card e uma frase). No desktop, uma linha com rolagem horizontal *snap* se não couber, ou 3 + 2; no celular, um embaixo do outro. O último círculo preenchido.

| # | Título | Frase | Momento (visual) |
|---|---|---|---|
| 01 | Send your site | Your current link, or just your info if you don't have one yet. | campo de URL com o link sendo digitado + um "or" e um botão "Send my info instead" |
| 02 | See your preview | We rebuild it first. You see it before you pay anything. | mini `PreviewCard` com o `home-scroll` |
| 03 | Design | Your photos and your words, made to look like you. | uma grade de 3 fotos se arrumando (cadeiras, noiva, borrada) |
| 04 | Code | Fast, clean and built the right way for Google. | mini editor com 4 linhas sendo digitadas |
| 05 | Launch | Live on your domain, in your name. | pílula do domínio com ponto verde + "Live." sobre o `LivingGradient` |

- Embaixo: botão primário **"See pricing"** → `/pricing` e link "Get my free preview →" para o CTA final.
- O `PlanCard` continua só na página `/pricing`.

---

## Fase C: QA

1. `npm run build` e `npm run lint` sem erro.
2. `tools/qa-check.mjs`, `tools/gap-audit.mjs`, `tools/contrast-media.mjs` em todas as rotas, 1440/768/390.
3. Desempenho: os vídeos não podem travar a página. Meça com o Playwright (ou Lighthouse via `npx lighthouse`, se rodar) o LCP da home em 390 e anote. Vídeos com `preload="metadata"`, só tocando quando visíveis; no máximo 2 vídeos tocando ao mesmo tempo.
4. Teste de interação (atualize `tools/interact-r2.mjs` → `interact-r3.mjs`): digitação da busca troca de termo; checklist do Working recomeça; LiveCards atualizam a cada 3s e param fora da tela; fundo do Results troca nos 3 blocos; código do Code termina e recomeça; abas e acordeão do celular continuam funcionando; `prefers-reduced-motion` desliga tudo.
5. Grave um GIF ou vídeo curto da home rolando inteira (`qa/frontlabs-r3/home.webm`) para o Pedro ver as animações sem abrir o site.
6. Subagente revisor sem contexto, com a mesma tarefa da rodada 2, focado nas seções novas e no DESIGN.md.

## Fase D: fechar, subir e publicar

1. Screenshots finais em `qa/frontlabs-r3/` (home 1440 e 390, e por seção) e `qa/RESUMO-R3.png`.
2. REVISAR: seção "Rodada 3" (qual site virou o "Amor Celeste", autorização do venue, o que é dado real (26 previews) e o que é ilustrativo).
3. Commits pequenos na branch `rodada-3`, tag `v3.0-frontlabs`.
4. GitHub: `git push -u origin rodada-3 --tags` e abra um Pull Request para a `main` com `gh pr create` (título "Rodada 3: vida nas seções da home", corpo com o resumo e os prints). Se não houver proteção na `main` e não houver conflito, faça o merge (`gh pr merge --merge`). Se houver conflito com algo que o amigo do Pedro subiu, **não resolva apagando o trabalho dele**: anote e deixe o PR aberto.
5. Vercel: `npx vercel deploy --prod` dentro de `frontlabs/`. Se o modo automático bloquear ou pedir login, não insista: deixe o comando no resumo para o Pedro rodar.
6. Resumo final em até 10 linhas: o que mudou, link do PR, URL da Vercel (ou o comando), qual site foi usado nos vídeos e o que o Pedro precisa decidir.
