"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ResultsContent } from "@/content/types";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./ResultsScroll.module.css";

/**
 * "What changes" em scrollytelling: moldura grande (raio 24) com a imagem de fundo presa
 * (sticky, uma tela de altura) e os blocos (cards brancos raio 24) passando por cima, um por vez.
 * Quando um bloco cruza o meio da tela, o fundo troca para a imagem dele (crossfade + zoom 1.04 → 1).
 * Reduced-motion: troca seca, sem zoom.
 */
export function ResultsScroll({ data }: { data: ResultsContent }) {
  const [active, setActive] = useState(0);
  const blocks = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    // faixa fina no meio da janela: o bloco que a cruza é o ativo
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      }),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    blocks.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id={data.id} data-section="results" className="section" aria-labelledby={`${data.id}-title`}>
      <div className="container">
        <header className={styles.head}>
          {data.label ? <p className="t-label">{data.label}</p> : null}
          <h2 id={`${data.id}-title`} className="t-display">
            {data.title}
            {" "}
            {data.titleTurn ? <span className={styles.turn}>{data.titleTurn}</span> : null}
          </h2>
        </header>
      </div>
      <div className={styles.frame}>
        <div className={styles.sticky} aria-hidden="true">
          {data.items.map((it, i) =>
            it.image ? (
              <div key={it.title} className={[styles.bg, i === active ? styles.on : ""].join(" ")}>
                <Image src={it.image.src} alt="" fill sizes="100vw" className={styles.img} />
              </div>
            ) : null,
          )}
        </div>
        <ol className={styles.blocks}>
          {data.items.map((it, i) => (
            <li key={it.title} ref={(el) => { blocks.current[i] = el; }} data-i={i} className={styles.block}>
              <Reveal className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.icon}><Icon name={it.icon} size={18} /></span>
                  <span className={`t-label ${styles.count}`}>{String(i + 1).padStart(2, "0")} / {String(data.items.length).padStart(2, "0")}</span>
                </div>
                <h3 className={`t-title ${styles.title}`}>{it.title}</h3>
                <p className={styles.text}>{it.text}</p>
                <span className={`t-label ${styles.product}`}>{it.product}</span>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
