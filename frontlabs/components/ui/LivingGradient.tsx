"use client";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useInView } from "./useMotion";
import styles from "./LivingGradient.module.css";

const HORIZON = "/img/gradiente-horizonte-16x9.jpg";

/*
 * As 8 manchas da receita do Horizonte (DESIGN §4.2.1): céu em cima, névoa no meio, mata abaixo,
 * grama embaixo e musgo na base. x/y = centro e w/h = tamanho, em % da caixa (a mancha é uma elipse
 * que acompanha o formato do bloco). Cada uma anda num caminho fechado próprio (p1–p4, às vezes ao
 * contrário), em 9–16s, com atraso negativo para já começar no meio do caminho.
 */
type Blob = { c: string; x: number; y: number; w: number; h: number; path: string; dur: number; delay: number; reverse?: boolean; o?: number };
const BLOBS: Blob[] = [
  { c: "--h-ceu-1", x: 22, y: 8, w: 95, h: 75, path: "p1", dur: 13, delay: -2 },
  { c: "--h-ceu-2", x: 78, y: 14, w: 85, h: 70, path: "p2", dur: 11, delay: -6 },
  { c: "--h-nevoa", x: 50, y: 40, w: 70, h: 45, path: "p3", dur: 9.5, delay: -3, o: 0.7 },
  { c: "--h-mata-1", x: 18, y: 60, w: 80, h: 55, path: "p4", dur: 15, delay: -9, reverse: true },
  { c: "--h-mata-2", x: 82, y: 56, w: 75, h: 55, path: "p1", dur: 12, delay: -4, reverse: true },
  { c: "--h-grama-1", x: 34, y: 82, w: 80, h: 55, path: "p2", dur: 14, delay: -11, reverse: true },
  { c: "--h-grama-2", x: 74, y: 86, w: 75, h: 50, path: "p3", dur: 10.5, delay: -7 },
  { c: "--h-musgo", x: 50, y: 104, w: 110, h: 50, path: "p4", dur: 16, delay: -5 },
];

/**
 * Horizonte vivo (fundo de "Running while you work", Booking, Launch, passo 05 e chamada final):
 * mesh gradient animado — base em --p-mata, 8 manchas em radial-gradient (sem filter: blur, que pesa
 * no celular) andando em loop contínuo (sem alternate), a foto do Horizonte em soft-light por cima
 * para manter a textura do arquivo. Só transform anima. Pausa fora da tela, com a pausa global
 * (MotionToggle → html[data-motion-paused]) e parado com reduced-motion. O grão fica por conta do
 * contêiner ([data-field] / [data-stage] / final-cta em brand.css), parado por cima.
 * `dim`: véu (--living-veil) quando há texto branco por cima.
 */
export function LivingGradient({ dim = false, sizes = "100vw", className }: { dim?: boolean; sizes?: string; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0);
  return (
    <div ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} data-on={inView ? "" : undefined} data-living aria-hidden="true">
      {BLOBS.map((b, i) => (
        <span
          key={i}
          className={`${styles.blob} ${styles[b.path]}`}
          style={{
            "--c": `var(${b.c})`,
            left: `${b.x - b.w / 2}%`, top: `${b.y - b.h / 2}%`, width: `${b.w}%`, height: `${b.h}%`,
            opacity: b.o,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
            animationDirection: b.reverse ? "reverse" : "normal",
          } as CSSProperties}
        />
      ))}
      <div className={styles.texture}><Image src={HORIZON} alt="" fill sizes={sizes} /></div>
      {dim ? <span className={styles.veil} /> : null}
    </div>
  );
}
