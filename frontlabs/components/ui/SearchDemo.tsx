"use client";
import { useInView, useMotionPaused, useReducedMotion, useTypewriter } from "./useMotion";
import styles from "./SearchDemo.module.css";

/**
 * Página de busca genérica (sem logo nem nome de buscador): a busca é digitada, apagada e trocada
 * em loop; embaixo, 3 resultados em esqueleto. Quando a busca termina, o 1º resultado acende com
 * o nome do negócio e uma estrelinha. Parado: a última busca com o resultado aceso.
 */
export function SearchDemo({ label, queries, result }: { label: string; queries: string[]; result: { name: string; url: string } }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const reduced = useReducedMotion();
  const paused = useMotionPaused();
  const { text, typed } = useTypewriter(queries, inView && !reduced && !paused);
  return (
    <div ref={ref} className={styles.demo} role="img" aria-label={label}>
      <div className={styles.bar} aria-hidden="true">
        <svg viewBox="0 0 16 16" className={styles.glass}><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" /></svg>
        <span className={styles.query}>{text}</span>
        <span className={styles.caret} />
      </div>
      <ul className={styles.results} aria-hidden="true">
        <li className={[styles.result, typed ? styles.lit : ""].join(" ")}>
          <span className={styles.skeleton}><i /><i /></span>
          <span className={styles.found}>
            <span className={styles.name}>{result.name}</span>
            <span className={styles.url}>{result.url}</span>
            <span className={styles.stars}>★★★★★</span>
          </span>
        </li>
        <li className={styles.result}><span className={styles.skeleton}><i /><i /></span></li>
        <li className={styles.result}><span className={styles.skeleton}><i /><i /></span></li>
      </ul>
    </div>
  );
}
