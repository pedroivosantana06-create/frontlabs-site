"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { useInView, useMotionPaused, useReducedMotion } from "./useMotion";
import styles from "./ChecklistDemo.module.css";

const STEP_MS = 650;
const REST_MS = 2000;

/**
 * Celular desenhado em CSS com um site simples dentro e, ao lado, a lista que vai se marcando
 * em sequência (✓ com ponto verde). Um anel fino enche junto (sem número). Tudo marcado →
 * espera 2s e recomeça. Parado: tudo marcado.
 */
export function ChecklistDemo({ label, items }: { label: string; items: string[] }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const reduced = useReducedMotion();
  const paused = useMotionPaused();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || reduced || paused) return;
    const full = n >= items.length;
    const id = window.setTimeout(() => setN(full ? 0 : n + 1), full ? REST_MS : STEP_MS);
    return () => window.clearTimeout(id);
  }, [inView, reduced, paused, n, items.length]);

  const done = reduced ? items.length : n;
  return (
    <div ref={ref} className={styles.demo} role="img" aria-label={label}>
      <div className={styles.phone} aria-hidden="true">
        <span className={styles.notch} />
        <span className={styles.siteTitle} />
        <span className={styles.siteLine} />
        <span className={styles.siteLine} />
        <span className={styles.sitePhoto} />
        <span className={styles.siteBtn} />
      </div>
      <div className={styles.side} aria-hidden="true">
        <svg viewBox="0 0 36 36" className={styles.ring} style={{ "--p": done / items.length } as CSSProperties}>
          <circle cx="18" cy="18" r="15" pathLength={1} />
          <circle cx="18" cy="18" r="15" pathLength={1} />
        </svg>
        <ul className={styles.list}>
          {items.map((it, i) => (
            <li key={it} className={i < done ? styles.on : undefined}>
              <span className={styles.check}>✓</span>
              {it}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
