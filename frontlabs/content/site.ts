import type { CodeSpec, Plan, PreviewSpec, Site, StageSpec, VideoSpec } from "./types";

/*
 * Conteúdo da home da Front Labs (docs/FRONTLABS-HOME.md). Site em inglês americano.
 * Regra: nada de número, cliente, depoimento, prazo ou logo sem fonte.
 * Tudo que precisa de confirmação está marcado [CONFIRMAR] e listado em docs/REVISAR.md.
 */

const EMAIL = "archielewis49@gmail.com"; // [CONFIRMAR se é o e-mail público] — FRONTLABS-HOME §4
// [CONFIRMAR] não há link de agenda: por enquanto o botão abre um e-mail para o Arch pedindo a call
const CALL_HREF = `mailto:archielewis49@gmail.com?subject=${encodeURIComponent("15-minute call")}`;
/* rotas das páginas (rodada 2: o nav abre páginas, não âncoras) */
const R = { how: "/how-it-works", get: "/what-you-get", pricing: "/pricing", questions: "/questions" };
const PREVIEW = "#cta"; // toda página termina no formulário do preview (FinalCta, id "cta")

const AI_PROMPT = encodeURIComponent("What does Front Labs, the website studio for local businesses, do? How does its free website preview work?");

/** O site do próprio visitante, ilustrativo (FRONTLABS-HOME §1). Nunca um cliente real. */
const visitorPreview: PreviewSpec = {
  url: "preview.frontlabs.co/your-business",
  eyebrow: "/your-business",
  title: "Your Business",
  text: "Your new homepage, built before we ever talk.",
  cta: "Book a visit",
  rows: [
    { label: "/calls", value: "Book a visit" },
    { label: "/hours", value: "Open today" },
    { label: "/reviews", value: "On Google" },
  ],
  status: "preview ready before the call",
};

/*
 * Vídeos dos nossos sites (rodada 3), gravados com tools/record-r3.mjs.
 * [CONFIRMAR] É o site do The Oaks Event Center (o "Amor Celeste" não foi achado nesta máquina):
 * autorização do venue para usar o site na home da Front Labs. Ver docs/REVISAR.md (Rodada 3).
 */
const VIDEO: Record<"home" | "booking", VideoSpec> = {
  home: {
    webm: "/video/home-scroll.webm",
    mp4: "/video/home-scroll.mp4",
    poster: "/video/home-scroll-poster.jpg",
    ratio: "16 / 10",
    label: "A venue homepage we built, scrolling",
  },
  booking: {
    webm: "/video/booking-flow.webm",
    mp4: "/video/booking-flow.mp4",
    poster: "/video/booking-flow-poster.jpg",
    ratio: "16 / 10",
    label: "Our booking flow: pick a date, the number of guests, and confirm",
    mobile: { webm: "/video/booking-flow-m.webm", mp4: "/video/booking-flow-m.mp4", poster: "/video/booking-flow-m-poster.jpg", ratio: "3 / 4" },
  },
};

/** Código de verdade e curto: um componente Next com <title>, JSON-LD LocalBusiness, <h1> e o botão. */
const CODE: CodeSpec = {
  file: "app/page.tsx",
  label: "Code being written for a local business homepage, then the build passes",
  writing: "writing…",
  done: "✓ build passed",
  // linhas de até ~41 caracteres: cabem no editor a 390 sem cortar
  code: `const business = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Your Business",
};

export default function Page() {
  return (
    <main>
      <title>Your Business</title>
      <h1>Your Business</h1>
      <a href="/book">Book a visit</a>
      <script type="application/ld+json">
        {JSON.stringify(business)}
      </script>
    </main>
  );
}`,
};
const CODE_MINI: CodeSpec = {
  ...CODE,
  code: `<title>Your Business</title>
<h1>Your Business</h1>
<a href="/book">Book now</a>
<link rel="canonical" />`,
};

/** As 5 etapas (provisórias): usadas nas abas da home e, em versão longa, em /how-it-works. */
/* durationMs: a aba do código espera o "build passed"; as de vídeo, o vídeo quase inteiro */
const STEPS: { label: string; title: string; text: string; long: string; points: string[]; stage: StageSpec; durationMs?: number }[] = [
  {
    label: "/01 front coded",
    title: "Front Coded",
    text: "Everything your site needs under the hood, packaged: built for Google, fast on every phone.",
    long: "A packaged code solution: everything your site needs under the hood, already done. Built so Google can read it, fast on every phone, and working the way it should. No ranking promises, just the right foundation.",
    points: ["Clean, hand-built code", "Fast on every phone", "Everything Google needs to read it"],
    stage: { bg: "/img/foto-borrada-hero.jpg", visual: { kind: "code", code: CODE } },
    durationMs: 10000,
  },
  {
    label: "/02 front creative",
    title: "Front Creative",
    text: "Your photos, brought to life: AI-animated films, color treatment and sharper images.",
    long: "The creative side: we turn your own photos into short films animated with AI, treat the color so every picture matches, and clean up and sharpen the images you already have.",
    points: ["Photos animated with AI", "Color treatment on every photo", "Sharper, cleaner images"],
    stage: {
      bg: "/img/foto-noiva-borrada.jpg",
      visual: {
        kind: "creative",
        src: "/img/foto-cadeiras.jpg",
        alt: "The same photo of a set table, before and after color treatment, with a line sliding between the two",
        before: "/before",
        after: "/after",
        badge: "6 films · color graded",
      },
    },
  },
  {
    label: "/03 booking",
    title: "Booking",
    text: "A structure built for your customers to book: every page leads to a date.",
    long: "A structure built for your customers to book: every page leads to a date. A call button where thumbs reach, a booking form that takes a minute, and with Signature, automatic replies when someone asks.",
    points: ["Built for booking, page by page", "Booking that takes a minute", "Automatic replies with Signature"],
    stage: { bg: "living", visual: { kind: "video", video: VIDEO.booking, url: "yourbusiness.com/book", status: "booked · added to calendar" } },
    durationMs: 11500,
  },
  {
    label: "/04 launch",
    title: "Launch",
    text: "Live on your domain, in your name.",
    long: "When you say yes, we launch it on your domain, in your name. You own it. No monthly fee and no hosting bill.",
    points: ["Your domain, your name", "You own the site", "No monthly fee"],
    stage: { bg: "living", visual: { kind: "live", domain: "yourbusiness.com", word: "Live.", note: "/in your name" } },
  },
  {
    label: "/05 care",
    title: "Care",
    text: "Edits and updates handled for 6 months with Signature.",
    long: "With Signature, changes after launch are on us for six months: new hours, new photos, new prices. You send it, we handle it.",
    points: ["6 months of edits and updates", "You send it, we handle it", "Included in Signature"],
    stage: {
      bg: "/img/foto-borrada-hero.jpg",
      visual: {
        kind: "requests",
        url: "care.frontlabs.co/your-business",
        title: "Your requests",
        items: [
          { text: "Holiday hours", state: "done" },
          { text: "New gallery photos", state: "done" },
          { text: "Updated prices", state: "done" },
        ],
        status: "handled with Signature",
      },
    },
  },
];

/* Preços: apresentação da oferta (10/10/2026). Sem mensalidade; depois dos 6 meses o site continua no ar e é do cliente. */
const PLANS: Record<"launch" | "signature" | "cinematic", Plan> = {
  launch: {
    name: "Launch",
    kind: "plan",
    phrase: "Your new site, built and launched.",
    price: "$600",
    priceNote: "paid once, no monthly fee",
    split: "2 × $300",
    payment: "Half when you approve the preview, half at launch.",
    text: "A new site built for calls and bookings. Creative and automatic booking are not included.",
    features: [
      "Free preview before you pay",
      "15-minute call to walk you through it",
      "Code built the right way for Google",
      "Design made for calls and bookings",
      "Your domain, your name",
    ],
    ctas: [{ label: "Get my free preview", href: PREVIEW, variant: "secondary" }],
  },
  signature: {
    name: "Signature",
    kind: "plan",
    badge: "Everything handled",
    featured: true,
    phrase: "Launch, plus the stuff that runs itself.",
    price: "$999",
    priceNote: "paid once, no monthly fee",
    split: "3 × $333",
    payment: "At approval, at launch and 30 days later.",
    text: "For businesses that want bookings and reviews handled, not just a new site.",
    features: [
      "Everything in Launch",
      "Front Cinematic included",
      "Automatic booking with automatic replies",
      "Automatic Google review requests",
      "6 months of care: edits and updates",
    ],
    ctas: [{ label: "Get my free preview", href: PREVIEW, variant: "primary" }],
  },
  cinematic: {
    name: "Front Cinematic",
    kind: "addon",
    badge: "Add-on",
    phrase: "Your place, in motion. For Launch.",
    price: "+$197",
    priceNote: "added to Launch, once",
    split: "Included in Signature",
    text: "Six cinematic AI films and color grading for every photo on your site.",
    features: ["6 cinematic AI films", "Color grading of all your photos", "Placed across your new site"],
    ctas: [{ label: "Add it to my preview", href: PREVIEW, variant: "outline" }],
  },
};

const unused = "[seção desligada na Front Labs]";

export const site: Site = {
  meta: {
    lang: "en-US",
    title: "Front Labs — Online stuff, handled.",
    description: "We rebuild your local business website before you pay a thing. You see it first, then decide. No monthly fee.",
  },

  ui: {
    skip: "Skip to content",
    external: "(opens in a new tab)",
    home: "home",
    navMain: "Main",
    navFooter: "Footer",
    menu: "Menu",
    preview: "Preview",
    groups: "Groups",
    mediaSpace: "Media",
    step: "Step",
    pauseMarquee: "Pause scrolling list",
    pauseMotion: "Pause animations",
    playMotion: "Play animations",
    playMarquee: "Resume scrolling list",
    example: "/example",
    current: "current page",
  },

  announcement: {
    enabled: false, // rodada 2: desligada (a oferta de lançamento continua sem fonte)
    text: "Launch offer for our first local clients [CONFIRMAR]",
    link: { label: "See pricing", href: "#pricing" },
    cta: { label: "Get my free preview", href: "#cta" },
  },

  header: {
    brand: "FrontLabs",
    brandHref: "/",
    links: [
      { label: "How it works", href: R.how },
      { label: "What you get", href: R.get },
      { label: "Pricing", href: R.pricing },
      { label: "Questions", href: R.questions },
    ],
    secondary: { label: "Book a 15-minute call", href: CALL_HREF },
    primary: { label: "Get my free preview", href: PREVIEW },
    sticky: true,
    menuLabel: "Open menu",
    closeLabel: "Close menu",
  },

  /* herói antigo (rodada 1): desligado, substituído pelo heroFilm */
  hero: {
    enabled: false,
    id: "top",
    variant: "calm",
    label: "/for local businesses",
    title: "Online stuff, handled.",
    titleTurn: "Go run your business.",
    lead: "We rebuild your website before you pay a thing. You see it first, then decide.",
    primary: { label: "Get my free preview", href: "#cta" },
    secondary: { label: "See how it works", href: "#how-it-works" },
    media: { kind: "image", src: "/img/foto-borrada-hero.jpg", alt: "" },
    preview: visitorPreview,
  },

  /* Rodada 2 (PROMPT_RODADA2.md): estrutura Ploy + Runway. Copy provisória em inglês. */
  order: [
    "heroFilm",
    "scrollFill",
    "pillars",
    "liveCards",
    "results",
    "tabs",
    "steps", // rodada 3: o passo a passo entra no lugar do preço ("offers" fica só em /pricing)
    "faq",
    "finalCta",
    // desligadas na rodada 2 (código mantido): logos, statement, steps, timeline, audience
    // desligadas desde a rodada 1: proof, library, spotlight, news
  ],

  heroFilm: {
    enabled: true,
    id: "top",
    title: "Your website should work as hard as you do.",
    lead: "We build it, launch it and handle it. You go run your business.",
    primary: { label: "Get my free preview", href: PREVIEW },
    secondary: { label: "See how it works", href: R.how },
    video: null, // quando houver: { src: "/video/hero.mp4", poster: "/img/hero-poster.jpg" }
    image: { kind: "image", src: "/img/foto-borrada-hero.jpg", alt: "" },
    card: null,
    playLabel: "Play background video",
    pauseLabel: "Pause background video",
  },

  scrollFill: {
    enabled: true,
    id: "why",
    text: "Most local websites launch. Then they stop working.",
    note: "Front Labs keeps yours working.",
  },

  liveCards: {
    enabled: true,
    id: "live",
    illustrative: true, // há dados de exemplo: o rótulo aparece no topo e /example em cada card ilustrativo
    label: "/example numbers · the 26 previews are real",
    title: "Running while you work.",
    text: "Your site, your bookings and your reviews, each one quietly doing its job. These cards show what that looks like.",
    brand: "FrontLabs",
    intervalMs: 3000, // rodada 3: cada card atualiza a cada 3s (o Pedro pediu; a Ploy troca o log a cada ~4s)
    staggerMs: 1000,
    statsExample: "/example stats",
    cards: [
      {
        pill: "Site",
        // dado real: 26 previews nesta semana (12/10/2026). Os mini-stats continuam ilustrativos (marcados /example).
        value: 26,
        illustrative: false,
        caption: "previews built this week",
        spark: [2, 5, 7, 9, 11, 13, 15, 17, 19, 21, 24, 26],
        log: ["Link received → preview started", "Preview built → from the current site", "Preview sent → before the first call"],
        stats: [{ label: "Pages", value: 6 }, { label: "Speed score", value: 96 }, { label: "Fixes", value: 4 }],
        status: "Building a preview",
      },
      {
        pill: "Booking",
        value: 12,
        caption: "visits booked",
        spark: [1, 2, 2, 3, 5, 5, 6, 8, 8, 9, 11, 12],
        log: ["New request → auto-reply sent in 1 min", "Tour booked → added to calendar", "Reminder sent → tomorrow 10am"],
        stats: [{ label: "Replies", value: 14 }, { label: "Reminders", value: 9 }, { label: "Reschedules", value: 2 }],
        status: "Answering a new request",
      },
      {
        pill: "Reviews",
        value: 8,
        caption: "review requests sent",
        spark: [1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 7, 8],
        log: ["Job finished → review request sent", "New 5-star review → thank-you sent", "Follow-up → 3 days later"],
        stats: [{ label: "Sent", value: 8 }, { label: "Opened", value: 6 }, { label: "New reviews", value: 3 }],
        status: "Waiting for replies",
      },
    ],
  },

  results: {
    enabled: true,
    id: "results",
    label: "/what changes",
    title: "What changes when it's handled.",
    titleTurn: "Less chasing. More booked.",
    mode: "scroll", // rodada 3: 3 blocos sobre o fundo que troca
    items: [
      { icon: "search", title: "More people find you", text: "Code built the right way for Google.", product: "Launch", image: { src: "/img/foto-cadeiras.jpg", alt: "" } },
      { icon: "phone", title: "More calls and visits", text: "Every page leads to one action.", product: "Launch", image: { src: "/img/foto-noiva-notebook.jpg", alt: "" } },
      { icon: "check", title: "Nothing to manage", text: "6 months of edits and updates, no monthly fee.", product: "Signature", image: { src: "/img/foto-borrada-hero.jpg", alt: "" } },
    ],
  },

  logos: {
    enabled: false, // rodada 2: desligada
    id: "businesses",
    mode: "words",
    intro: "Built for the businesses your town runs on",
    items: [
      "/home services",
      "/pool builders",
      "/plumbers",
      "/clinics",
      "/studios",
      "/restaurants",
      "/shops",
      "/wedding venues",
    ].map((name) => ({ name })),
  },

  statement: {
    enabled: false, // rodada 2: desligada
    id: "why",
    style: "calm",
    lines: ["People look you up before they call."],
    soft: "If your site looks dead, they call someone else.",
  },

  pillars: {
    enabled: true,
    id: "what-it-needs",
    title: "What a local business needs online.",
    titleTurn: "Four things. We handle all of them.",
    numbered: true,
    items: [
      {
        icon: "search",
        title: "Found",
        text: "When someone nearby searches for what you do, your site is built the right way for Google to read.",
        visual: {
          kind: "search",
          label: "A search for local businesses, with Your Business showing up in the results",
          queries: ["wedding venues near me", "plumbers near me", "pool builders near me", "dentists near me", "businesses near me"],
          result: { name: "Your Business", url: "yourbusiness.com" },
        },
      },
      {
        icon: "heart",
        title: "Loved",
        text: "The first look shows your business as it really is, not a template.",
        visual: { kind: "video", video: VIDEO.home, url: "preview.frontlabs.co/your-business", status: "a site we built" },
      },
      {
        icon: "check",
        title: "Working",
        text: "Every page fast, every button where it should go, on any phone.",
        visual: {
          kind: "checklist",
          label: "A phone with a simple site, and a checklist being ticked: fast on phones, every button works, secure, readable by Google, works on any screen",
          items: ["Loads fast on phones", "Every button works", "Secure (https)", "Readable by Google", "Works on any screen"],
        },
      },
      {
        icon: "calendar",
        title: "Booked",
        text: "A clear path from \"just looking\" to a call, a visit or a booking.",
        visual: { kind: "video", video: VIDEO.booking, url: "yourbusiness.com/book", status: "booked · added to calendar" },
      },
    ],
  },

  steps: {
    // rodada 3: o passo a passo no lugar do "Pay once. No monthly fee." (a frase do preço virou a virada)
    enabled: true,
    id: "process",
    label: "/how it works",
    title: "From your link to live.",
    titleTurn: "Pay once. No monthly fee.",
    items: [
      {
        label: "/your link",
        title: "Send your site",
        text: "Your current link, or just your info if you don't have one yet.",
        visual: { kind: "send", label: "A link being typed into a field, or a button to send your info instead", url: "yourbusiness.com", or: "/or", button: "Send my info instead" },
      },
      {
        label: "/before you pay",
        title: "See your preview",
        text: "We rebuild it first. You see it before you pay anything.",
        visual: { kind: "video", video: VIDEO.home, url: "preview.frontlabs.co/your-business", status: "a site we built" },
      },
      {
        label: "/your photos",
        title: "Front Creative",
        text: "Your photos, color-treated and brought to life.",
        visual: {
          kind: "photos",
          label: "Three photos arranging themselves into a layout",
          photos: [
            { src: "/img/foto-cadeiras.jpg", alt: "" },
            { src: "/img/foto-noiva-notebook.jpg", alt: "" },
            { src: "/img/foto-borrada-hero.jpg", alt: "" },
          ],
        },
      },
      {
        label: "/under the hood",
        title: "Front Coded",
        text: "Everything under the hood, packaged: fast and built for Google.",
        visual: { kind: "code", code: CODE_MINI },
      },
      {
        label: "/live",
        title: "Launch",
        text: "Live on your domain, in your name.",
        visual: { kind: "live", domain: "yourbusiness.com", word: "Live." },
      },
    ],
    primary: { label: "See pricing", href: R.pricing },
    secondary: { label: "Get my free preview →", href: PREVIEW },
  },

  tabs: {
    enabled: true,
    id: "every-step",
    label: "/what we do",
    title: "What we do at every step.",
    intervalMs: 6000,
    pauseLabel: "Pause auto-advance",
    playLabel: "Resume auto-advance",
    groups: [
      {
        name: "Every step",
        tabs: STEPS.map((x) => ({ title: x.title, text: x.text, media: { kind: "placeholder" }, stage: x.stage, durationMs: x.durationMs })),
      },
    ],
  },

  timeline: {
    enabled: false, // rodada 2: desligada
    id: "handled",
    label: "/example week with Signature · illustrative",
    titleStart: "While you run your business,",
    titleEnd: "the online stuff gets handled.",
    field: "image",
    background: { kind: "gradient", src: "/img/gradiente-horizonte-16x9.jpg", alt: "" },
    items: [
      { time: "Mon 9:12 AM", tag: "/booking", tone: 1, title: "A booking request gets an answer", text: "An automatic reply goes out when someone asks for a time." },
      { time: "Tue 2:30 PM", tag: "/reviews", tone: 2, title: "A review request goes out", text: "After the visit, your customer gets a short ask for a Google review." },
      { time: "Wed 10:05 AM", tag: "/care", tone: 3, title: "Holiday hours, updated", text: "You send the change. It's part of your six months of care." },
      { time: "Fri 4:40 PM", tag: "/photos", tone: 1, title: "New photos on the gallery", text: "Color-graded with Front Cinematic, not stuck in your camera roll." },
    ],
  },

  audience: {
    enabled: false, // rodada 2: desligada
    id: "who-its-for",
    tag: "/who it's for",
    title: "For the businesses your town runs on.",
    text: "If people find you online and then call, book or walk in, this is for you.",
    items: [
      {
        name: "Home services",
        short: "Pool builders, plumbers, cleaners, roofers.",
        points: ["A call button on every page", "Service area and hours, clear on every page", "Built the right way for Google"],
        primary: { label: "Get my free preview", href: "#cta" },
      },
      {
        name: "Studios & clinics",
        short: "Bookings without the phone tag.",
        points: ["Booking front and center", "Automatic booking with automatic replies (Signature)", "Fast on every phone"],
        primary: { label: "Get my free preview", href: "#cta" },
      },
      {
        name: "Restaurants & shops",
        short: "Hours, menu, directions. Where people look.",
        points: ["Hours and directions up top", "Photos that look like the real place", "Your domain, your name, no monthly fee"],
        primary: { label: "Get my free preview", href: "#cta" },
      },
      {
        name: "Wedding & event venues",
        short: "Where we started.",
        points: ["A site that shows the space and gets tours booked", "Automatic replies to date questions (Signature)", "Google review requests after every event (Signature)"],
        primary: { label: "Get my free preview", href: "#cta" },
      },
    ],
  },

  offers: {
    enabled: true,
    id: "pricing",
    mode: "pricing",
    label: "/pricing",
    title: "Pay once. No monthly fee.",
    lead: "You see the preview first. You pay only if you want it live.",
    items: [PLANS.launch, PLANS.signature],
    footnote: "Front Cinematic adds 6 cinematic films and color-graded photos to Launch for $197.",
    more: { label: "See full pricing", href: R.pricing },
  },

  faq: {
    enabled: true,
    id: "questions",
    label: "/questions",
    title: "Straight answers.",
    text: "If yours isn't here, ask Arch.",
    contact: {
      name: "Arch",
      initial: "A",
      bubble: "Something else on your mind?",
      email: EMAIL,
      emailNote: "[CONFIRMAR e-mail público]",
      button: "Email Arch",
    },
    more: { label: "See all questions", href: R.questions },
    items: [
      { q: "Do I pay anything before I see the new site?", verdict: "No.", a: "We build your preview first. You see it on a 15-minute call, then decide." },
      { q: "Is there a monthly fee?", verdict: "No.", a: "No subscription and no monthly hosting fee. You pay once and the site is yours." },
      { q: "Can you get me to #1 on Google?", verdict: "No one can.", a: "Anyone who promises that is guessing. We build your site the right way for Google: clean code, fast pages, a clear structure." },
      { q: "Do I own the site?", verdict: "Yes.", a: "It lives on your domain, in your name." },
      { q: "Is this only for wedding venues?", verdict: "No.", a: "We started with venues. We build for any local business that lives on calls, bookings and walk-ins." },
    ],
  },

  finalCta: {
    enabled: true,
    id: "cta",
    style: "calm",
    title: "See your new site before you pay a thing.",
    titleTurn: "Fire your web designer. Politely.",
    text: "Drop your current website. We'll build your preview first.",
    inputLabel: "Your current website",
    inputType: "url",
    placeholder: "yourbusiness.com",
    button: "Get my free preview",
    microcopy: "Free preview · You see it first, then decide",
    errorEmpty: "Add your website so we know what to rebuild.",
    errorInvalid: "That doesn't look like a web address. Try yourbusiness.com",
    success: "Got it. We'll start on your preview.",
    background: { kind: "gradient", src: "/img/gradiente-horizonte-16x9.jpg", alt: "" },
  },

  footer: {
    brand: "FrontLabs",
    tagline: "Online stuff, handled.",
    contact: { label: "Book a 15-minute call", href: CALL_HREF },
    ask: {
      title: "Want the short version?",
      text: "Ask an AI what Front Labs does.",
      items: [
        { label: "ChatGPT", href: `https://chatgpt.com/?q=${AI_PROMPT}` },
        { label: "Claude", href: `https://claude.ai/new?q=${AI_PROMPT}` },
        { label: "Perplexity", href: `https://www.perplexity.ai/search?q=${AI_PROMPT}` },
      ],
    },
    columns: [
      {
        title: "Site",
        links: [
          { label: "Home", href: "/" },
          { label: "How it works", href: R.how },
          { label: "What you get", href: R.get },
          { label: "Pricing", href: R.pricing },
          { label: "Questions", href: R.questions },
        ],
      },
      {
        title: "Talk to us",
        links: [
          { label: "Get my free preview", href: PREVIEW },
          { label: "Book a 15-minute call", href: CALL_HREF },
          { label: "Email Arch", href: `mailto:${EMAIL}` },
        ],
      },
    ],
    legal: "© 2026 Front Labs",
    legalLinks: [],
    social: [],
  },

  /* ---- desligadas (FRONTLABS-HOME §2): sem números reais, sem biblioteca, sem notícias ---- */
  proof: { enabled: false, id: "proof", field: 1, title: unused, text: unused, cards: [] },
  library: { enabled: false, id: "library", field: 3, title: unused, text: unused, prevLabel: "Previous", nextLabel: "Next", items: [] },
  spotlight: { enabled: false, id: "spotlight", label: unused, text: unused, media: { kind: "placeholder" }, items: [] },
  news: { enabled: false, id: "news", title: unused, more: "Read more", items: [] },

  /* ---------- páginas (rodada 2) ---------- */
  pages: {
    pricing: {
      meta: { title: "Pricing", description: "Launch $600 or Signature $999, paid once. No monthly fee. You see your new site before you pay a thing." },
      hero: {
        tag: "Pricing",
        title: "Pay once. Keep it forever.",
        lead: "No monthly fee, no hosting bill. You see your new site first, then decide.",
        primary: { label: "Get my free preview", href: PREVIEW },
        secondary: { label: "Book a 15-minute call", href: CALL_HREF },
      },
      plans: [PLANS.launch, PLANS.signature, PLANS.cinematic],
      plansNote: { text: "Not sure which one?", link: { label: "Start with the free preview", href: PREVIEW } },
      payment: {
        title: "How payment works",
        text: "You pay in parts, only after you've seen the site and said yes.",
        rows: [
          { title: "Nothing before the preview", text: "We build your preview first. You see it on a 15-minute call. If you don't want it, you owe nothing." },
          { title: "Launch: 2 × $300", text: "Half when you approve the preview, half when the site goes live." },
          { title: "Signature: 3 × $333", text: "One part at approval, one at launch and one 30 days later." },
          { title: "Front Cinematic: +$197", text: "Added to Launch, paid once. Already included in Signature." },
          { title: "No monthly fee, ever", text: "After the 6 months of care, the site stays live and stays yours." },
        ],
      },
      compare: {
        tag: "Compare plans",
        title: "Every plan, side by side.",
        text: "Start with Launch. Pick Signature if you want bookings and reviews handled too.",
        columns: ["Launch", "Signature"],
        highlight: 1,
        yes: "Included",
        no: "Not included",
        rows: [
          { label: "Price", values: ["$600", "$999"] },
          { label: "Payments", values: ["2 × $300", "3 × $333"] },
          { label: "Monthly fee", values: ["None", "None"] },
          { label: "Free preview before you pay", values: [true, true] },
          { label: "15-minute call", values: [true, true] },
          { label: "Code built for Google", values: [true, true] },
          { label: "Design made for calls and bookings", values: [true, true] },
          { label: "Your domain, in your name", values: [true, true] },
          { label: "Front Cinematic (6 films + color-graded photos)", values: ["+$197", true] },
          { label: "Automatic booking with automatic replies", values: [false, true] },
          { label: "Automatic Google review requests", values: [false, true] },
          { label: "6 months of edits and updates", values: [false, true] },
        ],
      },
      faq: {
        enabled: true,
        id: "pricing-faq",
        label: "/pricing questions",
        title: "Pricing, answered.",
        text: "The short version: you pay once, after you've seen it.",
        items: [
          { q: "Do I pay anything before I see the preview?", verdict: "No.", a: "The preview is free. You pay the first part only when you approve it." },
          { q: "Is there a monthly fee?", verdict: "No.", a: "No subscription and no monthly hosting fee." },
          { q: "What happens after the 6 months of care?", verdict: "It stays yours.", a: "The site stays live on your domain, in your name. Care ends; the site doesn't." },
          { q: "Can I start with Launch and add Front Cinematic later?", verdict: "Yes.", a: "Front Cinematic is a $197 add-on for Launch. It's already included in Signature." },
          { q: "Why is Signature paid in three parts?", verdict: "To match the work.", a: "One part at approval, one at launch and one 30 days later, while care is running." },
        ],
      },
    },

    howItWorks: {
      meta: { title: "How it works", description: "Code, design, booking, launch and care. What Front Labs does at every step, and how you get from a free preview to a live site." },
      hero: {
        tag: "How it works",
        title: "Every step, handled.",
        lead: "From the first line of code to the edits after launch. You see it first, then decide.",
        primary: { label: "Get my free preview", href: PREVIEW },
        secondary: { label: "See pricing", href: R.pricing },
      },
      rowsTitle: "What we do at every step.",
      rows: STEPS.map((x) => ({ label: x.label, title: x.title, text: x.long, points: x.points, stage: x.stage })),
      steps: {
        enabled: true,
        id: "process",
        label: "/the process",
        title: "From preview to live.",
        titleTurn: "Four steps. One of them is yours.",
        items: [
          {
            label: "/before any call",
            title: "We build your preview",
            text: "Send us your current website. We build the new one before we ever talk.",
            visual: { kind: "preview", preview: visitorPreview },
          },
          {
            label: "/15 minutes",
            title: "A 15-minute call",
            text: "We walk you through the preview. Ask anything. No pitch deck.",
            visual: { kind: "invite", month: "Oct", day: "14", title: "Your preview, walked through", meta: "15 min · call", reply: "Works for me." },
          },
          {
            label: "/your call",
            title: "Pick a plan",
            text: "Launch or Signature. Pay the first part only when you approve.",
            visual: { kind: "plan", options: [{ name: "Launch", note: "$600" }, { name: "Signature", note: "$999", on: true }] },
          },
          {
            label: "/live",
            title: "It goes live",
            text: "We launch it on your domain, in your name.",
            visual: { kind: "live", domain: "yourbusiness.com", word: "Live." },
          },
        ],
      },
    },

    whatYouGet: {
      meta: { title: "What you get", description: "Everything in Launch and Signature: the site, Front Cinematic, the booking system and 6 months of care." },
      hero: {
        tag: "What you get",
        title: "Everything in the box.",
        lead: "A site built for Google and for bookings, the creative to make it look like you, and the care to keep it working.",
        primary: { label: "Get my free preview", href: PREVIEW },
        secondary: { label: "See pricing", href: R.pricing },
      },
      overview: {
        enabled: true,
        id: "products",
        label: "/the products",
        title: "Six parts, one site.",
        titleTurn: "Pick Launch, or get it all with Signature.",
        items: [
          { icon: "code", title: "The site", text: "Clean code, fast pages, made for calls and bookings.", product: "Launch" },
          { icon: "image", title: "Front Cinematic", text: "6 cinematic films and color-graded photos.", product: "Front Cinematic" },
          { icon: "calendar", title: "Booking system", text: "Instant booking with automatic replies.", product: "Signature" },
          { icon: "star", title: "Review requests", text: "A short ask for a Google review after each job.", product: "Signature" },
          { icon: "wrench", title: "Care", text: "6 months of edits and updates.", product: "Signature" },
          { icon: "pin", title: "Yours", text: "Your domain, your name, no monthly fee.", product: "Launch" },
        ],
      },
      blocks: [
        {
          id: "launch",
          label: "/launch · $600",
          name: "Launch",
          phrase: "Your new site, built and launched.",
          price: "$600 · 2 × $300",
          cta: { label: "Get my free preview", href: PREVIEW },
          items: [
            { title: "Free preview first", text: "We rebuild your site before any call. You see it, then decide." },
            { title: "Code built for Google", text: "Clean code, fast pages, a structure Google can read." },
            { title: "Made for calls and bookings", text: "Every page leads to one action." },
            { title: "Your domain, your name", text: "You own it. No monthly fee, no hosting bill." },
          ],
        },
        {
          id: "cinematic",
          label: "/front cinematic · +$197",
          name: "Front Cinematic",
          phrase: "Your place, in motion.",
          price: "+$197 with Launch · included in Signature",
          items: [
            { title: "6 cinematic AI films", text: "Short films of your business, made for your site." },
            { title: "Color-graded photos", text: "Every photo on your site, graded to look like one shoot." },
            { title: "Placed for you", text: "We put them where they do the most work." },
          ],
        },
        {
          id: "booking",
          label: "/booking system · signature",
          name: "Booking system",
          phrase: "Booked while you work.",
          items: [
            { title: "Instant booking", text: "People pick a time without calling." },
            { title: "Automatic replies", text: "Every new request gets an answer right away." },
            { title: "Google review requests", text: "After the job, your customer gets a short ask for a review." },
          ],
        },
        {
          id: "care",
          label: "/care · signature",
          name: "Care",
          phrase: "Six months of changes, handled.",
          price: "Included in Signature · $999 · 3 × $333",
          cta: { label: "See pricing", href: R.pricing },
          items: [
            { title: "Edits and updates", text: "New hours, new photos, new prices. You send it, we handle it." },
            { title: "6 months", text: "Care runs for six months after launch." },
            { title: "Then it stays yours", text: "After care ends, the site stays live and in your name." },
          ],
        },
      ],
    },

    questions: {
      meta: { title: "Questions", description: "Straight answers about the free preview, pricing, ownership and what Front Labs builds." },
      hero: {
        tag: "Questions",
        title: "Straight answers.",
        lead: "If yours isn't here, ask Arch.",
        primary: { label: "Get my free preview", href: PREVIEW },
        secondary: { label: "See pricing", href: R.pricing },
      },
      faq: {
        enabled: true,
        id: "all-questions",
        label: "/all questions",
        title: "Everything people ask.",
        text: "Short questions, short answers.",
        contact: {
          name: "Arch",
          initial: "A",
          bubble: "Something else on your mind?",
          email: EMAIL,
          emailNote: "[CONFIRMAR e-mail público]",
          button: "Email Arch",
        },
        items: [
          { q: "Do I pay anything before I see the new site?", verdict: "No.", a: "We build your preview first. You see it on a 15-minute call, then decide." },
          { q: "Is there a monthly fee?", verdict: "No.", a: "No subscription and no monthly hosting fee. You pay once and the site is yours." },
          { q: "How much does it cost?", verdict: "$600 or $999.", a: "Launch is $600 (2 × $300). Signature is $999 (3 × $333). Front Cinematic adds $197 to Launch." },
          { q: "Can you get me to #1 on Google?", verdict: "No one can.", a: "Anyone who promises that is guessing. We build your site the right way for Google: clean code, fast pages, a clear structure." },
          { q: "Do I own the site?", verdict: "Yes.", a: "It lives on your domain, in your name." },
          { q: "What happens after the 6 months of care?", verdict: "It stays yours.", a: "The site stays live. Care ends; the site doesn't." },
          { q: "Is this only for wedding venues?", verdict: "No.", a: "We started with venues. We build for any local business that lives on calls, bookings and walk-ins." },
        ],
      },
    },

    notFound: {
      meta: { title: "Page not found" },
      tag: "/404",
      title: "This page isn't here.",
      titleTurn: "Your new site could be, though.",
      lead: "The link may be old, or the page moved.",
      primary: { label: "Back to home", href: "/" },
      secondary: { label: "See pricing", href: R.pricing },
    },
  },
};
