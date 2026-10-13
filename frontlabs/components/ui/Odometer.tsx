import type { CSSProperties } from "react";
import styles from "./Odometer.module.css";

const DIGITS = "01234567890123456789".split("");

/**
 * Número em odômetro (Ploy): cada dígito é uma coluna 0–9 (duas voltas) que rola até o valor.
 * A primeira rolagem acontece quando um ancestral ganha `data-on` (o card entrou na tela).
 * `tick` > 0: cada atualização rola de novo, do dígito anterior (`from`) dando a volta até o atual,
 * mesmo que o valor seja igual. Sem JS ou com reduced-motion o valor final aparece parado.
 */
export function Odometer({ value, from, tick = 0, prefix = "", suffix = "", className }: { value: number; from?: number; tick?: number; prefix?: string; suffix?: string; className?: string }) {
  const chars = String(value).split("");
  const prev = String(from ?? value).padStart(chars.length, "0").slice(-chars.length).split("");
  return (
    <span className={[styles.odo, className].filter(Boolean).join(" ")} role="img" aria-label={`${prefix}${value}${suffix}`}>
      {prefix ? <span aria-hidden="true">{prefix}</span> : null}
      {chars.map((c, i) => (
        <span key={i} className={styles.slot} aria-hidden="true">
          <span key={tick} className={[styles.col, tick ? styles.spin : ""].join(" ")} style={{ "--d": c, "--f": prev[i], "--i": i } as CSSProperties}>
            {DIGITS.map((d, k) => <span key={k}>{d}</span>)}
          </span>
        </span>
      ))}
      {suffix ? <span aria-hidden="true">{suffix}</span> : null}
    </span>
  );
}
