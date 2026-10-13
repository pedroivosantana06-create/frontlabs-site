"use client";
import Image from "next/image";
import { useInView } from "./useMotion";
import styles from "./BeforeAfter.module.css";

/**
 * Front Creative (rodada 4): a mesma foto antes/depois do tratamento. A linha desliza sozinha da
 * esquerda para a direita e volta (~6s); a foto "depois" tem um movimento lento de câmera, como o
 * filme animado com IA. Só transform anima: o lado "antes" é uma janela que anda (translateX) com a
 * foto andando ao contrário dentro dela. Parado no meio com reduced-motion ou com a pausa global.
 */
export function BeforeAfter({ src, alt, before, after, badge, sizes = "(max-width: 1023px) 90vw, 480px" }: { src: string; alt: string; before: string; after: string; badge: string; sizes?: string }) {
  const { ref, inView } = useInView<HTMLElement>(0);
  return (
    <figure ref={ref} className={styles.frame} data-on={inView ? "" : undefined} role="img" aria-label={alt}>
      <div className={styles.after}><Image src={src} alt="" fill sizes={sizes} className={styles.img} /></div>
      <div className={styles.clip} aria-hidden="true">
        <div className={styles.unclip}><Image src={src} alt="" fill sizes={sizes} className={`${styles.img} ${styles.raw}`} /></div>
        <span className={styles.line} />
      </div>
      <span className={`t-label ${styles.tag} ${styles.tagBefore}`} aria-hidden="true">{before}</span>
      <span className={`t-label ${styles.tag} ${styles.tagAfter}`} aria-hidden="true">{after}</span>
      <span className={styles.badge} aria-hidden="true"><i className={styles.dot} />{badge}</span>
    </figure>
  );
}
