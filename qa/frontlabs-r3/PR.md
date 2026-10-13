## Resumo

Vida nas seções da home da Front Labs (`PROMPT_RODADA3.md`). O herói e a linha que preenche ao rolar ficaram como estavam.

- **What a local business needs online**: cada pilar ganhou uma área animada: busca digitando 5 termos com o 1º resultado acendendo, o site do venue passando em vídeo, celular + checklist que se marca e recomeça, e o nosso fluxo de agendamento em vídeo.
- **Running while you work**: fundo Horizonte vivo (3 camadas, só transform/opacity). Cada card atualiza a cada 3s com 1s de defasagem: o odômetro dá a volta, a sparkline desliza, os mini-stats piscam e o log troca. **26 previews** é dado real; o resto continua marcado `/example`.
- **What changes when it's handled**: 3 blocos sobre uma moldura com a foto presa, que troca a cada bloco (crossfade + zoom leve).
- **What we do at every step**: Code com código Next sendo digitado até "✓ build passed"; Design e Booking com vídeos; Booking e Launch no Horizonte vivo. As mesmas peças em /how-it-works.
- **Passo a passo** no lugar do preço: "From your link to live." / "Pay once. No monthly fee.", 5 cards animados + "See pricing".
- Botão de **pausar as animações** (WCAG 2.2.2). Com `prefers-reduced-motion`, tudo fica parado. Os vídeos só tocam quando visíveis, no máximo 2 ao mesmo tempo, e só baixam quando chegam perto da tela.

## QA
- build + lint ok; qa-check limpo (5 rotas × 1440/768/390); contraste ≥ AA; teste de interação `tools/interact-r3.mjs` 45/45.
- LCP a 390 (produção, CPU 4× + rede 1,6 Mbps): 3,1 s.
- Revisão externa: `qa/frontlabs-r3/revisao-externa.md`, com as respostas em `frontlabs/docs/REVISAR.md` R3.6.

## Para o Pedro decidir
- Os vídeos são do **The Oaks Event Center** (o "Amor Celeste" não foi achado na máquina): [CONFIRMAR] autorização do venue.
- A busca mostra "Your Business" em 1º, o que pode contradizer o "No ranking promises"; e "Send my info instead" ainda não tem caminho no formulário. Detalhes no REVISAR (Rodada 3).

## Prints
- Resumo (home 1440 e 390): `qa/RESUMO-R3.png`
- Seções com as animações: `qa/frontlabs-r3/secoes/`
- Vídeo da home rolando: `qa/frontlabs-r3/home.webm`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
