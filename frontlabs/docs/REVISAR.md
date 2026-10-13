# REVISAR — Front Labs (rodada da noite, 12/10/2026)

O que o Pedro precisa conferir de manhã. Todo `[CONFIRMAR]` visível no site está listado aqui.
Para ver: `cd ~/Documents/FrontLabs-Site/frontlabs && npm run dev -- -p 3011` → http://localhost:3011
(durante a noite as portas 3010–3019 estavam ocupadas por outros projetos seus — a 3011 era o `oaks-event-center`; testei na 3111).

## 1. [CONFIRMAR] — fatos que precisam de fonte

| Onde | O que está no site | Pergunta |
|---|---|---|
| Barra de oferta (topo) | **desligada na rodada 2** (`announcement.enabled: false`); o texto "[CONFIRMAR]" continua no content | Qual é a oferta de lançamento? Se existir, é só religar |
| Perguntas · card do Arch | `archielewis49@gmail.com` + "[CONFIRMAR e-mail público]" | É o e-mail público? (também usado em "Email Arch" no rodapé) |
| Botões "Book a 15-minute call" (nav, /pricing, rodapé) | abrem e-mail para o Arch | Qual o link da agenda (Cal.com/Calendly)? Trocar `CALL_HREF` em `content/site.ts` |
| Rodapé · "Want the short version?" | pergunta pronta citando `frontlabs.co` | O domínio é mesmo frontlabs.co? (inferido de `preview.frontlabs.co` no briefing) |
| Formulário final | só pede o site atual, sem backend | Como a Front Labs vai falar com quem enviou? Hoje não há campo de e-mail/telefone nem envio. Sugestão: adicionar e-mail e ligar num Formspree/Resend |

## 2. Decisões tomadas sozinho

| Decisão | Por quê |
|---|---|
| Símbolo `|/` do logo desenhado em SVG na mão (barra reta + barra inclinada) | O kit da marca (`logo/` com o SVG) não está nesta pasta. Trocar pelo SVG oficial: `components/ui/Logo.tsx` |
| Horizonte 16:9 gerado reamostrando o 4:5 (1200×1500 → 2400×1350), sem corte | Cortar perdia o céu ou a grama; reamostrar mantém todas as cores. O grão do arquivo fica um pouco achatado; por cima vai o `grao.png` |
| Campos de cor (`--c-field-*`) viram branco/cinza | DESIGN §4.2: campos são "legado, em aberto" e a interface é preto e branco; a cor da página fica no Horizonte (barra, "Um dia handled" e chamada final) |
| Nenhuma foto em moldura | FRONTLABS-HOME §1 permite no máximo uma, "só se ajudar". Os momentos visuais já são o herói borrado, o Horizonte e os cards de preview; uma foto a mais disputaria atenção. Se quiser, a `foto-cadeiras.jpg` cabe numa seção "Foto em moldura" (DESIGN §9.6) |
| Ordem: tipos de negócio → frase → pilares → como funciona → o que vem → semana "handled" → para quem → preço → perguntas → CTA | Exatamente a ordem do FRONTLABS-HOME §2 |
| Copy das seções sem fonte de fatos (pilares, abas, timeline, segmentos, FAQ) | Escrita só com fatos do §4 (preview grátis antes, call de 15 min, código para o Google, sem mensalidade/hospedagem, site no nome do cliente, Launch/Signature/Front Cinematic). Nenhum número, prazo ou cliente |
| Timeline marcada `/example week · illustrative` | Os horários e eventos são ilustrativos (pedido do briefing) |
| "Signature" com o selo "everything handled" | Não usei "most popular" (seria um fato sem fonte) |
| FAQ com 5 perguntas, todas com veredito | Uma 6ª ("e se eu precisar mudar algo depois, no Launch?") ficou de fora: não há regra de alterações para o Launch no briefing |
| Nav vira menu de celular abaixo de 1100px (não 1024) | A pílula com 4 links + 2 botões não cabe entre 1024 e 1100 |
| Nome do segmento em "Para quem" em 30px (Destaque) | Em 48px quebrava em 3 linhas |
| Botão de pausa das abas logo abaixo da lista, lista no topo | Na Runway a lista fica centralizada; aqui abria um vazio > 12% (DESIGN §10.1) |

## 3. Diferenças em relação ao DESIGN.md

| DESIGN.md diz | No site | Por quê |
|---|---|---|
| `--soft` #9A9792 na frase de destaque (preto + soft, §9.3) | `#8A8782` | #9A9792 sobre #F4F3F1 dá 2.6:1 e não passa AA nem para texto grande (3:1). #8A8782 dá 3.2:1 e quase não muda o tom |
| Grão em overlay ~60% + multiply ~22% (§4.3) | só overlay a 22% (`--grain-opacity`) | Com o `grao.png` do kit, 60% apagava o texto e virava chiado de TV. A camada multiply ficava escondida atrás da imagem de fundo; tirei |
| "Uma cor por título" (§3.2) / frase de destaque em duas cores (§9.3) | segui o §9.3 na frase de destaque | São regras que se contradizem; o §9.3 é específico para essa frase |
| Navegação "pill flutuante, altura 36–44" (§6.5) | pílula de 52px com botões de 36px | Com botões de 36 dentro, a pílula precisa de respiro; 52 = botão + 8px em cima e embaixo |
| Rótulo mono 13 "começa com `/`" (§3.1) | todos começam com `/`, exceto as etiquetas pill ("Who it's for") | A etiqueta escura de "Para quem" é o padrão Ploy do default |
| Botão "Link: texto + seta →" (§6.1) | os links secundários (ex.: "Book a 15-minute call" em Para quem) são sublinhados, sem seta | Vem do botão `link` do default; vale decidir se o default passa a ter a seta |

## 4. Vale devolver ao default?

| Componente / mudança | Recomendação |
|---|---|
| `Steps` (cards de passo com imagem do momento, §6.8) | **Sim.** É o "como funciona" que o default não tem; generalizar o `Visual` para aceitar qualquer mídia |
| `Faq` (duas colunas, card de contato, veredito) | **Sim.** Toda empresa de serviço precisa de FAQ; o card de contato pode ser opcional |
| Nav em pílula (Header da Front Labs) | **Sim, como variante** (`header.variant: "bar" \| "pill"`) |
| `Logo` com símbolo + nome | Não (é da marca); o default continua com o nome em texto |
| `styles/brand.css` (grão e câmera lenta por seletor) | Talvez: o grão poderia virar token `--grain` opcional no default |
| Tokens já devolvidos nesta rodada | `--w-card`, `--w-label`, `--label-case`, `--text-fvs`/`--title-fvs`, `--frame-gutter`, `--bar-bg`, `--stage-bg`, `--t-feature`, `--turn-*`, cores sobre mídia; `minmax(0, 1fr)` em todos os grids |

## 5. Revisão externa (Fase 7) — o que foi feito com cada apontamento

Relatório completo do revisor (subagente sem contexto): `qa/frontlabs/revisao-externa.md`.

| # | Apontamento | O que fiz |
|---|---|---|
| 1 | Foco invisível no rodapé escuro e sobre foto | **Corrigido** (default e Front Labs): anel escuro + halo branco de 5px (`--c-focus-halo`) |
| 2 | Lead do herói abaixo de AA no celular | **Corrigido**: lead sem transparência, véu mais forte no celular. Medido com `tools/contrast-media.mjs`: 5.7:1 no pixel 90% mais claro |
| 3 | Textos sobre o Horizonte abaixo de AA | **Corrigido**: Horizonte a 72% de brilho atrás de texto (`--horizon-dim`) e véu de 28% na barra. Todos ≥ 4.5:1 (texto pequeno) / 3:1 (grande); a virada do CTA no celular fica em 4.49 no pixel mais claro e 5.66 na média |
| 4 | Vazio entre seções > 12% | **Ajustado**: padding de seção 72 (144 entre seções = "entre seções grandes" do §5.1) e 52 no celular (104 < 12% de 844). No desktop 144 > 108: mantive porque o próprio DESIGN pede 144 entre seções; a regra dos 12% vale para blocos dentro da seção (gap-audit limpo) |
| 5 | Rótulos fora da Geist Mono | **Corrigido**: "/who it's for" e as tags da timeline em mono 400 |
| 6 | Peso 500 | **Corrigido**: `--w-medium` = 550 (o sistema só tem 400/550) |
| 7 | Virada com tracking apertado | **Corrigido** (os dois apps): tracking em em no próprio tamanho |
| 8 | Cards de "Para quem" sem raio e com bolinhas | **Corrigido**: raio 10, sem bolinhas |
| 9 | Botão da barra com 28px | **Corrigido**: 36 (`--bar-btn-h`) |
| 10 | aria-labels em português | **Corrigido**: todos vêm de `site.ui` (inglês na Front Labs) |
| 11 | "Book a 15-minute call" levava ao formulário | **Corrigido provisoriamente**: abre e-mail para o Arch com assunto "15-minute call". `[CONFIRMAR]` link da agenda |
| 12 | Promessas sem fonte | **Corrigido**: "We handle it" agora diz que o care é do Signature; "always right" saiu; Launch sem "everything you need to be found"; timeline marcada "with Signature" e cada item aponta o recurso |
| 13 | Nicho em venue | **Corrigido**: venues por último em "Para quem" e no fim da faixa, todos os segmentos com o mesmo botão; FAQ 05 virou "Is this only for wedding venues? — No." |
| 14 | Tamanhos fora da escala (20px/550, 30px, "Oct" 11px) | **Mantido**: 20px é o "subtítulo" do default; nomes em 30 = Destaque (agora em 400, como "nome sobre campo"); "Oct" é um rótulo de 11px dentro de um quadrado de 52px |
| 15 | Frase de destaque com opsz de texto | **Corrigido**: tamanho ótico de título |
| 16 | `--soft` no celular (22px) | **Corrigido**: no celular vira `--mute` (4.9:1) |
| 17–18 | Ícones dos pilares e raio do card | **Corrigido**: círculos de 44, card raio 24, título 72px abaixo do ícone |
| 19 | Pílula do nav 52px | **Corrigido**: 44px |
| 20 | Botão do formulário 44px | **Corrigido**: 52 (`--form-h`) |
| 21 | Selo preenchido | **Corrigido**: contornado |
| 22 | Pills "Ask AI" com fundo translúcido | **Corrigido**: só contorno |
| 23 | Seta antes do texto no rodapé | **Mantido**: padrão "→ Contact us" da Ploy no componente do default. Decidir se vira seta depois |
| 24 | Erro em vermelho | **Mantido**: mensagem de erro precisa se distinguir (acessibilidade); é o único vermelho e só aparece no erro |
| 25 | Rodapé alto | **Mantido** (padrão Ploy); dá para tirar o bloco "Want the short version?" se pesar |
| 26 | Foto do herói ainda legível | **Corrigido**: desfoque de 14px por cima |
| 27 | Fundos com `role="img"` vazio | **Corrigido**: fundo sem `alt` fica `aria-hidden` |
| 28 | Faixa rolante sem pausa | **Corrigido** (os dois apps): botão de pausa; para também no foco |
| 29 | Detalhes sem fonte ("video call", "No card", "checked before launch", "Tap-to-call") | **Corrigido**: trocados por texto neutro |
| 30 | `frontlabs.co` no prompt da IA | **Corrigido**: o prompt não cita domínio |
| 31 | "You see it first, / then decide." em dois tons | **Mantido**: é a "virada" do §3.2 (segunda linha menor, cor secundária), permitida |


---

# Rodada 2 (12/10/2026) — nova home (Ploy + Runway) e páginas de verdade

Prompt: `PROMPT_RODADA2.md`. Ver: `cd frontlabs && npm run dev -- -p 3011` → `/`, `/how-it-works`, `/what-you-get`, `/pricing`, `/questions` (e qualquer rota inexistente para o 404). Screenshots finais em `qa/frontlabs-r2/`.

## R2.1 Preços (saíram do [CONFIRMAR])
Fonte: apresentação da oferta (10/10/2026), passada no prompt da rodada 2.
- **Launch $600** = 2 × $300 (metade ao aprovar o preview, metade no lançamento).
- **Signature $999** = 3 × $333 (na aprovação, no lançamento e 30 dias depois). Selo "Everything handled" (não "Most chosen": não é um fato que temos).
- **Front Cinematic +$197** para o Launch (incluso no Signature).
- Sem mensalidade; depois dos 6 meses o site continua no ar e é do cliente.

## R2.2 Copy provisória por seção (toda em inglês, toda trocável em `content/site.ts`)
| Onde | Copy provisória |
|---|---|
| Herói (`heroFilm`) | "Your website should work as hard as you do." / "We build it, launch it and handle it. You go run your business." |
| Linha que preenche (`scrollFill`) | "Most local websites launch. Then they stop working." / "Front Labs keeps yours working." |
| Pilares | "What a local business needs online." / "Four things. We handle all of them." — Found · Loved · Working · Booked |
| Cards ao vivo (`liveCards`) | "Running while you work." + frase à direita |
| Resultados (`results`) | "What changes when it's handled." / "Less chasing. More booked." — 6 benefícios, cada um com o produto |
| Abas (`tabs`) | "What we do at every step." — Code · Design · Booking · Launch · Care (constante `STEPS`, reaproveitada em /how-it-works) |
| Preço (home) | "Pay once. No monthly fee." + "See full pricing" |
| Páginas | heróis "Pay once. Keep it forever." (/pricing), "Every step, handled." (/how-it-works), "Everything in the box." (/what-you-get), "Straight answers." (/questions), "This page isn't here." (404) |
| FAQ de preço | 5 perguntas novas ("What happens after the 6 months of care?" etc.), só com os fatos acima |

## R2.3 Dados ilustrativos (cards ao vivo)
`site.liveCards.illustrative = true` → rótulo "/example · illustrative numbers" no topo da seção. **Todos os números e mensagens são inventados como exemplo** (3 previews, 12 visitas, 8 pedidos de review, mini-stats, "plumbing company in Houston"…). Para trocar por dados reais: o componente `LiveCards` só recebe `cards: LiveCard[]`; basta montar esse array a partir de uma fonte real e pôr `illustrative: false`.

## R2.4 Decisões tomadas sozinho
| Decisão | Por quê |
|---|---|
| Log dos cards troca a cada **4s** (não 5s) | Medido na Ploy: ~4s com fade de 0.4s (`qa/refs/ploy-r2/MEDIDAS.md`) |
| Herói: sem vídeo, imagem borrada com câmera lenta; botão play/pause só aparece com vídeo | O prompt pede `video: null` por enquanto. Para pôr vídeo: `heroFilm.video = { src, poster }` |
| Moldura do herói a 24px das bordas (Ploy: 32) | DESIGN §9: "24px de respiro" |
| Abas: lista no topo (Runway centraliza) | Centralizada abria vazio > 12% entre o título e a 1ª etapa; mesma decisão da rodada 1 |
| Abas: a troca automática acontece no fim da barra de progresso | Uma fonte de verdade: a barra pausa quando a seção sai da tela e a troca acompanha |
| /how-it-works: texto e palco em 50/50 (não 5/7) | Com 7/12 o palco passava de 60% da janela e o auditor de vazio o tratava como fundo; 50/50 também fica mais calmo |
| /pricing: tabela compara Launch × Signature; Front Cinematic aparece como linha (+$197 / ✓) | É um add-on, não um plano |
| Bloco "How payment works" em cinza `#E9E8E5` (token `--c-panel-grey`) | Clone do cinza da Ploy (#E5E5E5) ajustado ao fundo #F4F3F1; o DESIGN não tem esse cinza → anotar se vale entrar no §4.1 |
| `/questions` junta as perguntas da home + preço + "após o care" | Página de FAQ completo |
| Todas as páginas terminam no formulário (`#cta`) | Assim "Get my free preview" funciona em qualquer página sem sair dela |
| Nav e rodapé foram para o `app/layout.tsx` | São iguais em todas as páginas; o nav marca a atual com `aria-current="page"` (sublinhado) |
| Fundos borrados novos `foto-noiva-borrada.jpg` e `foto-cadeiras-borrada.jpg` | Receita do DESIGN §4.2.2 com blur mais forte (rostos irreconhecíveis) |

## R2.5 O que ficou para o Pedro decidir
1. **Copy**: toda provisória (R2.2).
2. **Dados dos cards ao vivo**: hoje ilustrativos (R2.3). Manter como exemplo, trocar por dados reais, ou tirar a seção.
3. **Vídeo do herói**: quando existir, preencher `heroFilm.video`.
4. Link da agenda (`CALL_HREF`) e e-mail público do Arch continuam `[CONFIRMAR]` (§1).

## R2.6 Vale devolver ao default? (§4, rodada 2)
| Componente | Recomendação |
|---|---|
| `ScrollFill` | **Sim.** Genérico (texto do content), sem dependência de marca |
| `Odometer` + `LiveCards` | **Sim**: é o `ProofField` do default com odômetro, log em rodízio e dados por props; trocar o Horizonte por `--c-field-*` no default |
| `HeroFilm` | **Sim, como variante** do herói (`variant: "film"`), aceita vídeo ou imagem |
| `Stage` | **Sim**: palco com fundo + visual em HTML; no default o fundo seria `--c-placeholder` |
| `PageHero`, `PlanCard`, `CompareTable`, `PaymentBlock`, `FeatureRow`, `ArrowList` | **Sim**: estrutura de página de preço/feature que toda empresa de serviço usa |
| `Results` | Talvez: é o "Audience" da Ploy simplificado; útil como "benefícios" |
| Abas com barra de progresso e acordeão no celular | **Sim**: melhora direta do `FeatureTabs` do default |
| Rotas de página no default | Sim: o default hoje é só a home; vale ter `/pricing` e uma página de feature como modelo |

## R2.7 Revisão externa da rodada 2: o que foi feito com cada apontamento
Relatório completo: `qa/frontlabs-r2/revisao-externa.md` (2 graves, 10 médios, 22 leves).

| # | Apontamento | O que fiz |
|---|---|---|
| 1 | Card de preview cortado no palco a 390 (home e /how-it-works) | **Corrigido**: o palco não usa mais `overflow: hidden` (imagem e grão herdam o raio), então cresce com o card |
| 2 | Tabela de /pricing com a coluna Signature fora da tela a 390 | **Corrigido**: no celular a tabela tem largura fixa da tela (3 colunas cabem, texto quebra); `caption` para leitor de tela |
| 3 | H1 de 104px (Display do DESIGN é 72) | **Mantido**: o PROMPT_RODADA2 pede `clamp(48px, 7.2vw, 112px)` no herói e nos títulos de página (clone da Ploy). Vale decidir se entra no DESIGN como "Display XL" |
| 4 | Linha que preenche com 86px (briefing antigo: 30–34) | **Mantido**: o prompt da rodada 2 pede `clamp(40px, 6vw, 96px)`; ela substitui a frase de destaque antiga |
| 5 | Horizonte em duas seções (cards ao vivo e CTA) | **Mantido**: pedido do prompt (cards ao vivo "no lugar do rosa"). Se pesar, o CTA final pode voltar ao fundo claro |
| 6 | Palcos de /how-it-works com raio 10 | **Corrigido**: 24 |
| 7 | Home diferente do FRONTLABS-HOME (sem `/for local businesses`, card de preview, tipos de negócio, Para quem…) | **Decisão da rodada 2** (prompt): seções desligadas sem apagar código. O FRONTLABS-HOME §2 ficou desatualizado; a lista de segmentos pode voltar como seção se fizer falta |
| 8 | "Five parts" com 6 cards | **Corrigido**: "Six parts, one site." |
| 9 | "More people find you" / "built to show up" perto de promessa de Google | **Ajustado**: o pilar Found agora diz "built the right way for Google to read". Os títulos dos cards de resultado vieram do prompt; ficam como copy provisória para o Pedro revisar |
| 10 | Bloco "How payment works" com 4,47:1 e cinza fora do DESIGN | **Corrigido**: fundo `--grey` (#EFEEEC, do sistema) → 4,72:1 |
| 11 | "Get my free preview" do nav com 36px no celular | **Mantido**: visual de 36 (§6.1 "Pequeno · Navegação"); a área de toque já é ampliada para 48 por `::after` |
| 12 | Link "Start with the free preview" com 17px de altura | **Mantido**: mesmo mecanismo, área de toque de 45px por `::after` |
| L | Rótulo `/example` só no topo dos cards ao vivo | **Corrigido**: cada card mostra `/example` no canto quando `illustrative: true` |
| L | Foco fraco no campo do CTA | **Corrigido**: anel de 2px preto na pílula |
| L | H1 → H3 em /pricing | **Corrigido**: h2 oculto antes dos planos |
| L | Nomes de título grudados ("thing.Fire", "01Do I pay") | **Corrigido**: espaço antes da virada e depois do número |
| L | Copiar o odômetro sai "0123456789" | **Corrigido**: colunas com `user-select: none` (o número fica no `aria-label`) |
| L | Pausa das abas com 32px | **Corrigido**: 36 |
| L | Etiquetas de página em pílula preta com Inter, sem "/" | **Mantido**: é a etiqueta "Pricing" da Ploy pedida no prompt (mesmo padrão de "Who it's for" da rodada 1) |
| L | "Pay once. Keep it forever." / "No monthly fee, ever" / "takes a minute" | **Copy provisória**: os fatos (sem mensalidade, site do cliente depois do care) têm fonte; "takes a minute" é estilo, revisar |
| L | `[CONFIRMAR]` do e-mail visível | **Mantido de propósito** até o Pedro confirmar (§1) |
| L | Rodapé preto, mini card cortado no passo 01, setas em itens sem link, dois CTAs no menu aberto, vazio de 215px depois da linha que preenche | **Mantidos**: rodapé e passo 01 vêm da rodada 1 (já registrados); setas sem link agora em cinza, sem círculo; o respiro da linha que preenche é o `--s-10` (144) entre seções grandes |

---

# Rodada 3 (12/10/2026) — vida nas seções da home

Prompt: `PROMPT_RODADA3.md`. Branch `rodada-3`. Para ver as animações sem abrir o site: `qa/frontlabs-r3/home.webm`.

## R3.1 Qual site virou o "Amor Celeste"
Não achei nenhum site "Amor Celeste" nesta máquina (procurei em ~/venues, ~/clientes, ~/Downloads, ~/Documents e ~/Desktop; só há crawls de sites de terceiros com "celest" no nome). Usei o **The Oaks Event Center** (`~/venues/oaks-event-center`, o primeiro da lista de preferência). **Trocar pelo Amor Celeste quando achar:** rodar `node tools/record-r3.mjs <url-do-site> <pasta>` com o site rodando e reencodar como está no PROGRESSO (Fase A); os nomes dos arquivos em `frontlabs/public/video/` ficam iguais.

## R3.2 [CONFIRMAR]
| Onde | O que está no site | Pergunta |
|---|---|---|
| Pilares (Loved, Booked), abas (Design, Booking), passo 02, /how-it-works | vídeo da home e do card "Schedule a Tour" do **The Oaks Event Center** (aparecem o nome, a cidade, o telefone e "Rebecca or Gwen" na tela de confirmação) | **Autorização do venue para usar o site na home da Front Labs.** O DESIGN §10.2 pede confirmar com o cliente antes de usar o site dele fora da empresa |
| Fluxo de agendamento gravado | dados de contato de exemplo ("Alex Rivera", alex@example.com, (555) 010-2030); o envio do template não manda nada | Nada a confirmar: só para registro |

## R3.3 Dado real × ilustrativo (cards "Running while you work")
- **Real:** "26 previews built this week" (dado do Pedro, 12/10/2026). Esse card não leva `/example`. Quando o número mudar: `site.liveCards.cards[0].value`.
- **Ilustrativo (marcado `/example`):** os outros dois cards inteiros (12 visitas, 8 pedidos de review, logs, mini-stats) e os **mini-stats do card de previews** (Pages, Speed score, Fixes), que têm o rótulo `/example` em cima. O rótulo do topo da seção diz "/example numbers · the 26 previews are real".
- Os logs do card de previews foram reescritos para descrever o processo (sem cliente nem cidade inventados): "Link received → preview started" etc.
- A sparkline do card de previews é decorativa (sobe até 26, sem eixo nem valores).
- Os mini-stats variam ±1 a cada atualização (pedido do prompt), por isso só nos números ilustrativos.

## R3.4 Decisões tomadas sozinho
| Decisão | Por quê |
|---|---|
| Vídeos gravados de uma cópia do oaks no scratchpad (build de produção na porta 3201) | Os servidores de desenvolvimento do Pedro nas portas 3011/3019 estavam com erro 500 nos arquivos JS (o card de agendamento não abria). Nada em `~/venues` foi alterado |
| `booking-flow` recortado no card (1040×650) e uma versão do celular só da folha (390×520, 3:4) | Na tela inteira o card ocupava 40% do quadro e ficava ilegível pequeno. A versão do celular entra só nos palcos grandes (abas e /how-it-works a 390); nas áreas 4:3 fica a de desktop |
| Vídeo sem `autoplay` no HTML; as fontes só entram a meia tela de distância | Com reduced-motion fica no poster; e sem isso a home baixava 2,4 MB de vídeo no carregamento, disputando banda com a imagem do herói (agora 156 KB de posters) |
| Duração própria por aba (Code 10s, Design 10s, Booking 11,5s; Launch e Care 6s) | Com 6s o código nunca chegava ao "build passed" e o vídeo do agendamento nunca chegava à confirmação |
| Cards ao vivo atualizam a cada 3s (não 4s) e o log troca junto | Pedido do Pedro ("a cada 3s"); a Ploy troca o log a cada ~4s |
| What changes: card branco raio 24 sobre a foto, sem véu | Opção do prompt; sem texto direto na foto não precisa de véu, e a foto fica sem efeito de cor (DESIGN §7.2.10) |
| What changes: blocos 3 (find you, calls and visits, nothing to manage) com `foto-cadeiras`, `foto-noiva-notebook`, `foto-borrada-hero` | Pedido do prompt. As outras 3 saíram só da home: /what-you-get continua com os 6 cards em grade (`mode` padrão) |
| Passo a passo: 5 numa linha a partir de 1280px; faixa com rolagem *snap* entre 768 e 1279; empilhados no celular | Com 5 colunas abaixo de 1280 o card ficava estreito demais para a mini tela |
| `offers` saiu da ordem da home (o `PlanCard` continua em /pricing) | Pedido do prompt; a frase do preço virou a virada do passo a passo |
| Código digitado: componente Next com `<title>` (React 19 sobe para o `<head>`), JSON-LD `LocalBusiness`, `<h1>` e o link "Book a visit" | Código de verdade e curto; cores só em cinzas + branco e o céu claro `#86AABB` nas strings |
| Estrelas no resultado de busca em preto, sem número | "Nada de #1" e sem nota inventada; amarelo seria cor na interface |
| O grão por cima do Horizonte vivo vem do contêiner (`[data-field]`/`[data-stage]`), não do componente | Evita grão duplo; ele fica parado por cima, como pede o prompt |

## R3.5 Vale devolver ao default?
| Componente | Recomendação |
|---|---|
| `LoopVideo` (play só visível, máx. 2, fontes perto da tela, reduced-motion no poster) | **Sim.** Genérico |
| `useMotion` (`useInView`, `useReducedMotion`, `useTypewriter`) | **Sim** |
| `LivingGradient` | Sim, como "fundo vivo" a partir de qualquer imagem (no default, o placeholder) |
| `CodeTyper`, `SearchDemo`, `ChecklistDemo`, `SendDemo`, `PhotoShuffle` | Talvez: são da história da Front Labs, mas o `CodeTyper` serve a qualquer estúdio |
| `ResultsScroll` (scrollytelling com fundo preso) | **Sim**, como variante do Results/Spotlight |
| Odômetro que dá a volta + sparkline que desliza | **Sim**: melhora direta do `ProofField` do default |

## R3.6 Revisão externa da rodada 3: o que foi feito com cada apontamento
Relatório completo: `qa/frontlabs-r3/revisao-externa.md` (1 grave, 7 médios, 9 leves).

| # | Apontamento | O que fiz |
|---|---|---|
| G1 | /how-it-works a 390: o vídeo do agendamento nunca carregava (a troca para a versão do celular recriava o `<video>` e o observador ficava no antigo) | **Corrigido**: o `<video>` não é mais recriado; as fontes trocam no mesmo elemento com `load()`. Teste novo: a 390 o vídeo `-m` carrega e toca |
| M1 | O card real (26) se mexe como os ilustrativos | **Ajustado**: a sparkline do card real não ganha pontos novos. O odômetro continua dando a volta a cada 3s (pedido explícito do Pedro: "os números nunca param"); os mini-stats dele variam porque são de exemplo e estão marcados "/example stats". **Atenção:** "this week" envelhece: atualizar o 26 em `site.liveCards.cards[0].value` |
| M2 | Movimento contínuo sem pausa (WCAG 2.2.2) | **Corrigido**: botão de pausa (`MotionToggle`) no cabeçalho dos pilares, dos cards ao vivo e do passo a passo; pausa a página inteira (demos, cards, vídeos, Horizonte vivo) e retoma |
| M3 | "Get my free preview →" com 17px de altura; primário é "See pricing" | **Mantido**: a hierarquia é a do prompt (botão primário "See pricing" + link para o CTA). A área de toque do link já é ampliada para 45px por `::after` (mesmo mecanismo da R2) |
| M4 | Código cortado à direita (passo 04 a 1440, aba Code a 390) | **Corrigido**: linhas de até 41 caracteres, editor grande em 11px no celular, mini editor em 10px com linhas de até 28 |
| M5 | Foto presa ocupa ~2.800px; vários Horizontes e momentos de impacto | **Reduzido**: blocos de 65% da tela (55% no celular), a seção caiu ~25%. A estrutura (fundo preso de uma tela, Horizonte vivo em "Running", Booking e Launch) é pedido do prompt e fica para o Pedro decidir |
| M6 | A busca mostra "Your Business" em 1º com ★★★★★ e o Results diz "More people find you", contra o "No ranking promises" do próprio site | **Para o Pedro decidir** (o prompt pede o 1º resultado acendendo). Já sem "#1" e sem nota. Opção mais segura: acender o 2º ou 3º resultado, ou trocar "More people find you" por "Easier to find" |
| M7 | Passo 01 mostra "Send my info instead", mas o formulário final só aceita o link | **[CONFIRMAR]**: o formulário precisa de um caminho para quem não tem site (campo de e-mail/telefone ou link para mandar as informações). Hoje o botão da animação é só ilustração |
| L1 | Strings do código em céu claro (paleta Paisagem em texto) | **Mantido**: exceção pedida no prompt ("no máximo uma cor da paleta para strings"); registrada aqui |
| L2 | Texto de 11–12px nas mini telas; botão "Send my info instead" com mínimo 2,78:1 | **Ajustado**: o botão foi para 13px e o véu do passo 01 para 32% → 4,5 no pixel 90% mais claro. Os 11–12px são texto dentro de desenho (`role="img"` com descrição), não texto de leitura |
| L3 | Rótulo do topo dos cards ao vivo no limite (4,50) | **Corrigido**: véu do Horizonte vivo de 28% para 32% → 4,97 (p90) a 390 e 5,59 a 1440 |
| L4 | 144px de Horizonte vazio entre o cabeçalho e os cards | **Corrigido**: 72px |
| L5 | Só o card 1 tinha a linha `/example` acima dos mini-stats (cards desalinhados) | **Corrigido**: o rótulo "/example stats" foi para o canto de cima, no mesmo lugar do `/example` dos outros |
| L6 | Meia linha cortada no topo do editor quando o código rola | **Corrigido**: o respiro de cima sai junto na rolagem |
| L7 | Passo 02 rotulado "preview ready" com o site de um venue | **Corrigido**: "a site we built" (igual ao pilar Loved) |
| L8 | Mídia da aba ativa montada duas vezes (palco + acordeão escondido) | **Mantido**: estrutura da R2 (acordeão no celular). A cópia escondida não toca (o vídeo só toca visível) e não baixa (fontes só perto da tela) |
| L9 | Results com 2.644px a 390 | Ver M5 |


---

## Rodada 4 (13/10)

### R4.1 Decidir
- **Front Creative (etapa) × Front Cinematic (produto).** Convivem agora: a etapa 02 da home e de /how-it-works chama "Front Creative" (fotos animadas com IA, cor, imagem melhor); na /pricing e em /what-you-get o add-on de $197 continua "Front Cinematic". Pedro: unificar o nome? Atenção: como etapa, o Front Creative parece incluído em todo plano, mas os filmes são add-on no Launch e inclusos só no Signature. Se não unificar, talvez a etapa precise de uma nota "/with Signature or Front Cinematic".
- A pílula "6 films · color graded" do visual do Front Creative usa o número do Front Cinematic (6 filmes), que já está na /pricing.
- Textos novos das etapas (Front Coded, Front Creative, Booking) foram escritos a partir do roteiro da rodada 4; revisar o tom.

### R4.2 Decisões tomadas sozinho
- Gradiente vivo em **CSS** (8 manchas em radial-gradient, sem blur de filtro), não em canvas: mais simples, 60 fps no celular emulado a 4× CPU.
- Mantive a foto do Horizonte a 35% em soft-light por cima das manchas (textura do arquivo original).
- Véu do Horizonte vivo de 32% → **40%** e névoa a 70%: com o fundo andando 15–30%, a névoa clara passava atrás da virada da chamada final e caía abaixo de AA. O passo 05 continua com o véu duplo da R3 (fica mais escuro que os outros blocos; dá para tirar um se o Pedro achar escuro demais, o "Live." é grande).
- No passo a passo da home, "Design" virou **Front Creative** (rótulo /your photos) e "Code" virou **Front Coded**; a ordem dos 5 passos não mudou (Front Creative antes de Front Coded ali, ao contrário das abas).
- A aba Front Creative usa o tempo padrão (6s = uma ida e volta da linha).
- O título "Running while you work." estava preto em produção (ordem do CSS); corrigido.

### R4.3 Git
- O merge do PR #1 (rodada 3) foi bloqueado pelo modo automático do Claude; a rodada 4 saiu da `rodada-3`. O PR #2 (do amigo, `allowScripts`) está aberto e não foi tocado.
