"use client";
import { useInView, useMotionPaused, useReducedMotion, useTypewriter } from "./useMotion";
import styles from "./SendDemo.module.css";

/** Passo 01: campo de URL com o link sendo digitado, um "or" e o botão para mandar as informações. */
export function SendDemo({ label, url, or, button }: { label: string; url: string; or: string; button: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const reduced = useReducedMotion();
  const paused = useMotionPaused();
  const { text } = useTypewriter([url], inView && !reduced && !paused, { typeMs: 70, holdMs: 2200 });
  return (
    <div ref={ref} className={styles.demo} role="img" aria-label={label}>
      <div className={styles.field} aria-hidden="true">
        <span className={styles.text}>{text}</span>
        <span className={styles.caret} />
        <span className={styles.send}>→</span>
      </div>
      <p className={`t-label ${styles.or}`} aria-hidden="true">{or}</p>
      <span className={styles.button} aria-hidden="true">{button}</span>
    </div>
  );
}
