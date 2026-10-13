/* Tipos do conteúdo. Todo texto do site mora em content/site.ts. */

export type Cta = { label: string; href: string };

/** Mídia: foto, vídeo, bloco cinza de placeholder, gradiente ou card de preview em HTML. */
export type MediaSpec = {
  kind: "image" | "video" | "placeholder" | "gradient" | "preview";
  /** proporção CSS, ex.: "16/9", "4/5" */
  ratio?: string;
  src?: string;
  poster?: string;
  alt?: string;
  /** rótulo mono do placeholder, ex.: "[foto 16:9 · mín. 1600px]" */
  label?: string;
  /** placeholder escuro (quando há texto branco por cima) */
  tone?: "light" | "dark";
};

export type PreviewSpec = {
  url: string;
  title: string;
  eyebrow?: string;
  text?: string;
  cta?: string;
  rows?: { label: string; value: string }[];
  status: string;
};

/** Vídeo curto em loop (rodada 3): webm + mp4 + poster; versão do celular opcional. */
export type VideoSrc = { webm: string; mp4: string; poster: string; ratio: string };
export type VideoSpec = VideoSrc & { label: string; mobile?: VideoSrc };

/** Editor com código sendo digitado (etapa Code e passo 04). */
export type CodeSpec = { file: string; code: string; writing: string; done: string; label: string };

export type SectionKey =
  | "logos"
  | "statement"
  | "pillars"
  | "offers"
  | "tabs"
  | "proof"
  | "timeline"
  | "library"
  | "spotlight"
  | "audience"
  | "news"
  | "steps"
  | "faq"
  | "finalCta"
  | "heroFilm"
  | "scrollFill"
  | "liveCards"
  | "results";

type Base = { enabled: boolean; id: string };

export type Announcement = { enabled: boolean; text: string; link?: Cta; cta?: Cta };

export type HeaderContent = {
  brand: string;
  brandHref: string;
  links: Cta[];
  secondary: Cta;
  primary: Cta;
  sticky: boolean;
  menuLabel: string;
  closeLabel: string;
};

export type HeroContent = Base & {
  variant: "calm" | "shout";
  label?: string;
  title: string;
  /** segunda linha do título (virada), opcional */
  titleTurn?: string;
  lead: string;
  primary: Cta;
  secondary?: Cta;
  media: MediaSpec;
  announcement?: { label: string; text: string; href: string; media?: MediaSpec };
  preview?: PreviewSpec;
};

export type LogosContent = Base & { intro: string; items: { name: string; src?: string }[]; mode: "logos" | "words" };

export type StatementContent = Base & { style: "shout" | "calm"; lines: string[]; soft?: string; note?: string };

export type PillarsContent = Base & {
  label?: string;
  title?: string;
  titleTurn?: string;
  /** mostra o número mono (/01, /02…) em cada coluna */
  numbered?: boolean;
  items: { icon: string; title: string; text: string; visual?: PillarVisual }[];
};
/** Área visual animada em cima de cada pilar (rodada 3). */
export type PillarVisual =
  | { kind: "search"; label: string; queries: string[]; result: { name: string; url: string } }
  | { kind: "video"; video: VideoSpec; url: string; status: string }
  | { kind: "checklist"; label: string; items: string[] };

export type OfferItem = {
  name: string;
  media?: MediaSpec;
  phrase: string;
  text: string;
  price?: string;
  priceNote?: string;
  features?: string[];
  ctas: (Cta & { variant?: "primary" | "secondary" | "outline" })[];
  meta?: string;
  featured?: boolean;
  badge?: string;
  /** pagamento em partes, ex.: "2 × $300" */
  split?: string;
};
export type OffersContent = Base & { label?: string; title: string; lead?: string; mode: "products" | "pricing"; items: OfferItem[]; footnote?: string; more?: Cta };

/** Visual em HTML sobre um fundo (borrado ou Horizonte): o "momento" de cada etapa. */
export type StageVisual =
  | { kind: "preview"; preview: PreviewSpec }
  | { kind: "booking"; url: string; title: string; button: string; slotsLabel: string; slots: string[]; status: string }
  | { kind: "live"; domain: string; word: string; note?: string }
  | { kind: "requests"; url: string; title: string; items: { text: string; state: string }[]; status: string }
  | { kind: "code"; code: CodeSpec }
  | { kind: "video"; video: VideoSpec; url: string; status: string }
  /** rodada 4 · Front Creative: a mesma foto antes/depois do tratamento, com a linha deslizando sozinha */
  | { kind: "creative"; src: string; alt: string; before: string; after: string; badge: string };
export type StageSpec = {
  /** caminho da imagem de fundo (foto borrada), "horizon" para o gradiente ou "living" para o Horizonte em movimento */
  bg: string;
  visual: StageVisual;
};

export type TabItem = { title: string; text: string; media: MediaSpec; preview?: PreviewSpec; stage?: StageSpec; /** tempo próprio da aba (o código e os vídeos precisam terminar) */ durationMs?: number };
export type TabsContent = Base & {
  label?: string;
  title?: string;
  intervalMs: number;
  groups: { name: string; tabs: TabItem[] }[];
  pauseLabel: string;
  playLabel: string;
};

export type ProofCard = {
  tag: string;
  value: number;
  prefix?: string;
  suffix?: string;
  caption: string;
  spark: number[];
  note: string;
  stats: { label: string; value: string }[];
  status: string;
};
export type ProofContent = Base & { title: string; text: string; field: 1 | 2 | 3; cards: ProofCard[] };

export type TimelineContent = Base & {
  label?: string;
  titleStart: string;
  titleEnd: string;
  field: 1 | 2 | 3 | "image";
  background?: MediaSpec;
  items: { time: string; tag: string; tone: 1 | 2 | 3; title: string; text: string }[];
};

export type LibraryContent = Base & {
  title: string;
  text: string;
  field: 1 | 2 | 3;
  prevLabel: string;
  nextLabel: string;
  items: { brand: string; title: string; author: string; text: string; href?: string }[];
};

export type SpotlightContent = Base & {
  label: string;
  text: string;
  cta?: Cta;
  media: MediaSpec;
  items: { title: string; text: string; href: string }[];
};

export type AudienceContent = Base & {
  tag: string;
  title: string;
  text?: string;
  items: { name: string; short: string; points: string[]; primary?: Cta; secondary?: Cta }[];
};

export type NewsContent = Base & {
  title: string;
  items: { title: string; text: string; href: string; media: MediaSpec }[];
  more: string;
};

/** Passos (DESIGN §6.8) — componente só da Front Labs. */
export type StepVisual =
  | { kind: "preview"; preview: PreviewSpec }
  | { kind: "plan"; options: { name: string; note: string; on?: boolean }[] }
  | { kind: "invite"; month: string; day: string; title: string; meta: string; reply: string }
  | { kind: "live"; domain: string; word: string }
  | { kind: "send"; label: string; url: string; or: string; button: string }
  | { kind: "video"; video: VideoSpec; url: string; status: string }
  | { kind: "photos"; label: string; photos: { src: string; alt: string }[] }
  | { kind: "code"; code: CodeSpec };
export type StepsContent = Base & {
  label?: string;
  title: string;
  titleTurn?: string;
  primary?: Cta;
  secondary?: Cta;
  items: { label: string; title: string; text: string; visual: StepVisual }[];
};

/** Perguntas (DESIGN §6.9) — componente só da Front Labs. */
export type FaqContent = Base & {
  label?: string;
  title: string;
  text: string;
  more?: Cta;
  contact?: { name: string; initial: string; bubble: string; email: string; emailNote?: string; button: string };
  items: { q: string; verdict: string; a: string }[];
};

export type FinalCtaContent = Base & {
  style: "shout" | "calm";
  title: string;
  titleTurn?: string;
  text: string;
  inputLabel: string;
  inputType: "email" | "url";
  placeholder: string;
  button: string;
  microcopy: string;
  errorEmpty: string;
  errorInvalid: string;
  success: string;
  background?: MediaSpec;
};

/* ---------- rodada 2 ---------- */

/** Herói com "vídeo" de fundo (Ploy). Sem vídeo, usa a imagem com câmera lenta. */
export type HeroFilmContent = Base & {
  title: string;
  lead: string;
  primary: Cta;
  secondary?: Cta;
  video: { src: string; poster: string } | null;
  image: MediaSpec;
  card: { label: string; text: string; href: string; media?: MediaSpec } | null;
  playLabel: string;
  pauseLabel: string;
};

/** Linha que preenche ao rolar (Ploy "Your website launched. Then it stopped."). */
export type ScrollFillContent = Base & { text: string; note?: string };

/** Card "ao vivo": número em odômetro, sparkline, log em rodízio, mini-stats e status. */
export type LiveCard = {
  pill: string;
  value: number;
  prefix?: string;
  suffix?: string;
  caption: string;
  spark: number[];
  log: string[];
  stats: { label: string; value: number; suffix?: string }[];
  status: string;
  /** false = número de verdade (sem /example no card; os mini-stats continuam marcados como exemplo) */
  illustrative?: boolean;
};
export type LiveCardsContent = Base & {
  label?: string;
  title: string;
  text: string;
  /** dados de exemplo (não são números reais): o componente mostra o rótulo */
  illustrative: boolean;
  brand: string;
  intervalMs: number;
  /** defasagem entre os cards (cada um atualiza intervalMs depois do anterior + staggerMs) */
  staggerMs: number;
  /** rótulo no topo do card com número real (os mini-stats dele continuam de exemplo) */
  statsExample: string;
  cards: LiveCard[];
};

/** Resultados: título fixo à esquerda + grade de cards de benefício com o produto que entrega. */
export type ResultsContent = Base & {
  label?: string;
  title: string;
  titleTurn?: string;
  text?: string;
  items: { icon: string; title: string; text: string; product: string; image?: { src: string; alt: string } }[];
  /** "scroll": moldura com fundo preso que troca a cada bloco (rodada 3); padrão: grade */
  mode?: "grid" | "scroll";
};

/** Plano (página de preço e resumo na home). */
export type Plan = OfferItem & { kind?: "plan" | "addon"; payment?: string };

export type PageHeroContent = { tag: string; title: string; titleTurn?: string; lead: string; primary: Cta; secondary?: Cta };

export type FeatureRowContent = { label: string; title: string; text: string; points?: string[]; stage: StageSpec };

export type CompareRow = { label: string; values: (string | boolean)[] };
export type CompareContent = { tag?: string; title: string; text?: string; columns: string[]; highlight?: number; rows: CompareRow[]; yes: string; no: string };

export type ArrowListItem = { title: string; text: string; href?: string };

export type FooterContent = {
  brand: string;
  tagline: string;
  contact: Cta;
  ask?: { title: string; text: string; items: Cta[] };
  columns: { title: string; links: Cta[] }[];
  legal: string;
  legalLinks: Cta[];
  social: { label: string; href: string; icon: "x" | "instagram" | "linkedin" | "youtube" }[];
};

export type PagesContent = {
  pricing: {
    meta: { title: string; description: string };
    hero: PageHeroContent;
    plans: Plan[];
    plansNote: { text: string; link: Cta };
    payment: { title: string; text: string; rows: { title: string; text: string }[] };
    compare: CompareContent;
    faq: FaqContent;
  };
  howItWorks: {
    meta: { title: string; description: string };
    hero: PageHeroContent;
    rowsTitle: string;
    rows: FeatureRowContent[];
    steps: StepsContent;
  };
  whatYouGet: {
    meta: { title: string; description: string };
    hero: PageHeroContent;
    overview: ResultsContent;
    blocks: { id: string; label: string; name: string; phrase: string; price?: string; cta?: Cta; items: ArrowListItem[] }[];
  };
  questions: {
    meta: { title: string; description: string };
    hero: PageHeroContent;
    faq: FaqContent;
  };
  notFound: { meta: { title: string }; tag: string; title: string; titleTurn: string; lead: string; primary: Cta; secondary: Cta };
};

export type Site = {
  meta: { lang: string; title: string; description: string };
  announcement: Announcement;
  header: HeaderContent;
  hero: HeroContent;
  order: SectionKey[];
  logos: LogosContent;
  statement: StatementContent;
  pillars: PillarsContent;
  offers: OffersContent;
  tabs: TabsContent;
  proof: ProofContent;
  timeline: TimelineContent;
  library: LibraryContent;
  spotlight: SpotlightContent;
  audience: AudienceContent;
  news: NewsContent;
  steps: StepsContent;
  faq: FaqContent;
  heroFilm: HeroFilmContent;
  scrollFill: ScrollFillContent;
  liveCards: LiveCardsContent;
  results: ResultsContent;
  finalCta: FinalCtaContent;
  footer: FooterContent;
  pages: PagesContent;
  ui: {
    skip: string;
    external: string;
    home: string;
    navMain: string;
    navFooter: string;
    menu: string;
    preview: string;
    groups: string;
    mediaSpace: string;
    step: string;
    pauseMarquee: string;
    pauseMotion: string;
    playMotion: string;
    playMarquee: string;
    example: string;
    current: string;
  };
};
