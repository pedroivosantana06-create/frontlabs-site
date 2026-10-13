import type { CSSProperties } from "react";
import styles from "./Sparkline.module.css";

/**
 * Mini gráfico de área (B: cards de número). Valores relativos; desenho em SVG puro.
 * `range`: escala fixa (para o desenho não pular quando os valores mudam).
 * `tick` > 0: um ponto novo entrou à direita → o desenho entra deslocado um passo e desliza para a esquerda.
 */
export function Sparkline({ values, range, tick = 0, className }: { values: number[]; range?: [number, number]; tick?: number; className?: string }) {
  const w = 120;
  const h = 48;
  const [min, max] = range ?? [Math.min(...values), Math.max(...values)];
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => [i * step, h - 4 - ((v - min) / (max - min || 1)) * (h - 8)]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden="true" preserveAspectRatio="none">
      <g key={tick} className={tick ? styles.slide : undefined} style={{ "--step": `${step}px` } as CSSProperties}>
        <path d={`${line} L${w} ${h} L0 ${h} Z`} fill="currentColor" opacity="0.18" />
        <path d={line} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" pathLength={1} />
      </g>
    </svg>
  );
}
