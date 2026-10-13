"use client";
import { useEffect, useRef, useState } from "react";
import type { LiveCard, LiveCardsContent } from "@/content/types";
import { LivingGradient } from "@/components/ui/LivingGradient";
import { Odometer } from "@/components/ui/Odometer";
import { Sparkline } from "@/components/ui/Sparkline";
import { MotionToggle } from "@/components/ui/MotionToggle";
import { useInView, useMotionPaused, useReducedMotion } from "@/components/ui/useMotion";
import { site } from "@/content/site";
import styles from "./LiveCards.module.css";

/** Variação determinística −1, 0 ou +1 (a mesma em qualquer renderização). */
const jitter = (seed: number) => (((seed * 2654435761) >>> 0) % 3) - 1;

/**
 * Três cards "ao vivo" (Ploy Web / Grow / Ads) sobre o Horizonte vivo.
 * Cada card: marca + pill, número em odômetro + sparkline, rótulo, linha de log, três mini-stats e status.
 * Os números nunca param: a cada `intervalMs` cada card atualiza (o odômetro dá a volta mesmo com o
 * valor igual, a sparkline ganha um ponto e desliza, os mini-stats piscam, o log troca), com
 * `staggerMs` de defasagem entre os cards. Tudo para quando a seção sai da tela e com reduced-motion.
 * O componente só recebe `cards`: card com `illustrative: false` mostra o número sem /example.
 */
export function LiveCards({ data }: { data: LiveCardsContent }) {
  const { ref, inView } = useInView<HTMLElement>(0.2);
  const reduced = useReducedMotion();
  const paused = useMotionPaused();
  const [ticks, setTicks] = useState(() => data.cards.map(() => 0));
  const running = inView && !reduced && !paused;

  useEffect(() => {
    if (!running) return;
    const timers: number[] = [];
    data.cards.forEach((_, i) => {
      const bump = () => setTicks((t) => t.map((n, k) => (k === i ? n + 1 : n)));
      timers.push(window.setTimeout(() => {
        bump();
        timers.push(window.setInterval(bump, data.intervalMs));
      }, data.intervalMs + i * data.staggerMs));
    });
    return () => timers.forEach((id) => { window.clearTimeout(id); window.clearInterval(id); });
  }, [running, data.cards, data.intervalMs, data.staggerMs]);

  if (!data.enabled) return null;
  return (
    <section ref={ref} id={data.id} data-section="live-cards" className="field-wrap" aria-labelledby={`${data.id}-title`}>
      <div className={styles.field} data-field>
        <LivingGradient dim />
        <div className={styles.inner}>
          <header className={styles.head}>
            <div className={styles.headLeft}>
              {data.illustrative ? <p className={`t-label ${styles.label}`}>{data.label ?? site.ui.example}</p> : null}
              <h2 id={`${data.id}-title`} className={`t-display ${styles.title}`}>{data.title}</h2>
            </div>
            <div className={styles.headRight}>
              <p className={styles.text}>{data.text}</p>
              <MotionToggle onMedia />
            </div>
          </header>
          <ul className={styles.cards}>
            {data.cards.map((c, i) => (
              <Card
                key={c.pill}
                card={c}
                seed={i}
                tick={ticks[i]}
                brand={data.brand}
                example={data.illustrative && c.illustrative !== false ? site.ui.example : undefined}
                statsExample={c.illustrative === false ? data.statsExample : undefined}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Card({ card, seed, tick, brand, example, statsExample }: { card: LiveCard; seed: number; tick: number; brand: string; example?: string; statsExample?: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const [on, setOn] = useState(false);

  // primeira rolagem quando o card aparece
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setOn(true);
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // série da sparkline: os pontos de base e, depois deles, pontos novos oscilando perto do topo
  const n = card.spark.length;
  const top = Math.max(...card.spark);
  const point = (j: number) => (j < n ? card.spark[j] : top * (0.82 + 0.06 * (jitter(j * 7 + seed) + 1)));
  // card com número real: a sparkline não inventa pontos novos (o odômetro continua dando a volta)
  const sparkTick = card.illustrative === false ? 0 : tick;
  const spark = Array.from({ length: n }, (_, k) => point(k + sparkTick));
  const range: [number, number] = [Math.min(...card.spark), top * 1.05];
  const stat = (v: number, k: number, t: number) => Math.max(0, v + (t ? jitter(t * 13 + k * 5 + seed) : 0));

  return (
    <li ref={ref} className={styles.card} {...(on ? { "data-on": "" } : {})}>
      <div className={styles.top}>
        <span className={styles.brand}>{brand}</span>
        <span className={styles.pill}>{card.pill}</span>
        {example ?? statsExample ? <span className={`t-label ${styles.example}`}>{example ?? statsExample}</span> : null}
      </div>
      <div className={styles.numRow}>
        <div className={styles.num}>
          <Odometer value={card.value} tick={tick} prefix={card.prefix} suffix={card.suffix} className={styles.big} />
          <p className={styles.caption}>{card.caption}</p>
        </div>
        <Sparkline values={spark} range={range} tick={sparkTick} className={styles.spark} />
      </div>
      <p className={styles.log} aria-live="off">
        <span key={tick} className={styles.logText}>{card.log[tick % card.log.length]}</span>
      </p>
      <dl className={styles.stats}>
          {card.stats.map((s, k) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd key={tick} className={tick ? styles.flash : undefined}>
                <Odometer value={stat(s.value, k, tick)} from={stat(s.value, k, tick - 1)} tick={tick} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      <p className={styles.status}><span className={styles.dot} aria-hidden="true" />{card.status}</p>
    </li>
  );
}
