# Rodada 4: gradiente vivo de verdade + novos nomes das etapas

**Rodar sem o Pedro por perto.** NÃO pergunte nada: decida pelo mais razoável, anote em `PROGRESSO.md` e siga. Resumo final em português.
Trabalhe só em `frontlabs/`. Leia antes `CLAUDE.md`, `docs/DESIGN.md` (§4.2.1, Horizonte) e as entradas da Rodada 3 em `PROGRESSO.md`.

## Git primeiro
1. `git fetch`. A `rodada-3` ainda não entrou na `main`. Se o PR da rodada 3 estiver aberto e sem conflito, faça o merge (`gh pr merge --merge`). Se tiver conflito com algo do amigo do Pedro, não apague o trabalho dele: anote e siga a partir da `rodada-3`.
2. Crie a branch `rodada-4` a partir da `main` atualizada (ou da `rodada-3`, se o merge não deu).

---

## 1 · Gradiente vivo de verdade (o mais importante)

O Pedro olhou o site e **não percebe o fundo se mexendo**. O `LivingGradient` atual são 3 cópias da mesma foto andando ±3–5% em 19–32s: sutil demais. Ele quer o gradiente **visivelmente animado, em loop, como se estivesse fluindo**.

**Reescreva o `components/ui/LivingGradient.tsx`** (mesma API: `dim`, `sizes`, `className`, para tudo que já usa continuar funcionando) como um **mesh gradient animado**, montado com as cores do próprio Horizonte (DESIGN §4.2.1). Não é mais a foto andando; é o Horizonte sendo "pintado" ao vivo:
- Fundo base em `--p-mata`.
- 6 a 8 manchas grandes (`radial-gradient` ou `div` redonda com `filter: blur(60–90px)`), cada uma de uma cor da receita do Horizonte: céu `#1F6F9E` e `#2E86B5` (em cima), névoa `#9BB8C4` (no meio), mata `#25301F` / `#2A3524` (abaixo), grama `#6F7A38` / `#55602A` (embaixo), musgo `#3E4C1D` (na base). Mantenha a lógica do Horizonte: azul em cima, verde embaixo.
- Cada mancha anda num **caminho fechado** (keyframes de 0% a 100% voltando ao mesmo ponto, **sem `alternate`**, para o loop ser contínuo), com ciclos de **9s a 16s**, durações e atrasos diferentes, deslocamento de **15% a 30%** da caixa e escala entre 0.85 e 1.25. O movimento tem que ser **visível em 2 segundos de olhar**, mas suave (nada de piscar).
- Opcional, se ficar melhor: uma camada com a foto `gradiente-horizonte-16x9.jpg` a ~35% de opacidade em `soft-light` por cima das manchas, para manter a textura do arquivo original.
- **Grão** (`grao.png`) por cima, parado.
- Só `transform` e `opacity` animados. Pausa fora da tela (o `useInView` atual), respeita o `MotionToggle` (pausa global) e `prefers-reduced-motion` (parado).
- Alternativa permitida: se as manchas em CSS ficarem pesadas no celular, faça um `<canvas>` 2D com as mesmas cores e o mesmo movimento, limitado a ~30 fps e à resolução de metade do tamanho, escalado com blur. Escolha o que ficar mais fluido e anote o porquê.

**Onde entra o gradiente vivo (todos os lugares com Horizonte na home):**
1. "Running while you work" (fundo dos cards ao vivo).
2. "What we do at every step": **Booking** e **Launch**.
3. **Chamada final "See your new site before you pay a thing."** (o bloco com o campo de e-mail/site): hoje é a imagem parada. Troque pelo `LivingGradient` com `dim`.
4. Passo 05 (Launch) do passo a passo e o CTA final das páginas (`/pricing`, `/how-it-works` etc.), para ficar igual em todo o site.

**Conferir o movimento de verdade:** grave 6s de cada um desses blocos com o Playwright e compare o primeiro e o último frame (diferença média de pixel). Se a diferença for pequena demais, aumente deslocamento/velocidade até ficar claramente visível. Salve os vídeos em `qa/frontlabs-r4/gradiente-*.webm` para o Pedro ver.
**Contraste:** com o fundo mudando, o texto branco por cima tem que passar AA em qualquer momento: rode `tools/contrast-media.mjs` em 5 instantes diferentes do loop e ajuste o véu (`--living-veil`) só o necessário.

---

## 2 · Novos nomes e textos das etapas ("What we do at every step")

Troque em `content/site.ts` (o `STEPS`, que alimenta as abas da home **e** a página `/how-it-works`). A ordem continua a mesma. Copy em inglês, curta, sem prometer posição no Google.

| # | Rótulo | Título | O que é (base para `text` e `long`) | Visual |
|---|---|---|---|---|
| 01 | `/01 front coded` | **Front Coded** | Uma solução de código empacotada: tudo o que o site precisa no código para o Google ler bem, para ser rápido e para funcionar direito, já pronto. Ex. `text`: "Everything your site needs under the hood, packaged: built for Google, fast on every phone." `points`: "Clean, hand-built code" · "Fast on every phone" · "Everything Google needs to read it". | mantém o editor com o código sendo digitado |
| 02 | `/02 front creative` | **Front Creative** | A parte criativa: fotos do negócio animadas com IA (vídeos curtos), tratamento de cor e melhoria de imagem. Ex. `text`: "Your photos, brought to life: AI-animated films, color treatment and sharper images." `points`: "Photos animated with AI" · "Color treatment on every photo" · "Sharper, cleaner images". | **novo visual** (abaixo) |
| 03 | `/03 booking` | **Booking** | Uma estrutura feita para o cliente marcar: cada página leva a agendar. Ex. `text`: "A structure built for your customers to book: every page leads to a date." `points`: "Built for booking, page by page" · "Booking that takes a minute" · "Automatic replies with Signature". | mantém o vídeo do agendamento, agora sobre o gradiente vivo novo |
| 04 | `/04 launch` | **Launch** | Igual ao de hoje. | mantém, com o gradiente vivo novo |
| 05 | `/05 care` | **Care** | Igual ao de hoje. | mantém |

**Visual novo do Front Creative** (no `Stage`, `kind: "creative"`):
- Uma foto em moldura (`foto-cadeiras.jpg`) com **antes/depois**: uma linha vertical que desliza sozinha da esquerda para a direita e volta (loop de ~6s). Do lado "antes", a mesma foto com `filter: saturate(.55) contrast(.85) brightness(.95) blur(.6px)` (sem tratamento); do lado "depois", a foto como ela é. Rótulos mono pequenos `/before` e `/after`.
- A foto "depois" com um movimento lento de câmera (zoom 1.0 → 1.06 em loop), como se fosse o vídeo animado com IA.
- Uma pílula branca no canto: ponto verde + mono "6 films · color graded".
- Fundo do palco: `foto-noiva-borrada.jpg`.
- `prefers-reduced-motion` / pausa global: linha parada no meio, sem zoom.

Atualize também onde os nomes antigos aparecem: rótulos e `aria-label` das abas, `/how-it-works` (títulos das linhas), `/what-you-get` e o passo a passo da home, se citarem "Design" ou "Code" como etapa. Na `/pricing`, o produto "Front Cinematic" continua com esse nome (é o add-on). No `REVISAR.md`, anote que Front Creative (etapa) e Front Cinematic (produto) convivem e o Pedro precisa decidir se unifica.

---

## 3 · QA, subir e publicar

1. `npm run build` + `npm run lint` sem erro. `tools/qa-check.mjs`, `tools/gap-audit.mjs` e `tools/interact-r3.mjs` (ajustado para os nomes novos) em 1440/768/390.
2. Desempenho do gradiente: com a home aberta, meça o uso de quadros (`requestAnimationFrame` por 5s no celular emulado a 4x CPU). Se cair abaixo de ~45 fps, reduza manchas ou use o `<canvas>`.
3. Prints em `qa/frontlabs-r4/` e os vídeos do gradiente. Linha no `PROGRESSO.md` e seção "Rodada 4" no `REVISAR.md`.
4. Commit `frontlabs: rodada 4 (gradiente vivo e etapas Front Coded / Front Creative)`, tag `v4.0-frontlabs`, `git push -u origin rodada-4 --tags`, PR para a `main` com `gh pr create` e merge se não houver conflito.
5. `npx vercel deploy --prod` dentro de `frontlabs/`. Se o modo automático bloquear, deixe o comando no resumo.
6. Resumo em até 8 linhas: o que mudou, link do PR, URL da Vercel (ou o comando) e onde ver os vídeos do gradiente.
