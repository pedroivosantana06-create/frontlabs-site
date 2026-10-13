"use client";
import { site } from "@/content/site";
import { Icon } from "./Icon";
import { toggleMotion, useMotionPaused, useReducedMotion } from "./useMotion";
import styles from "./MotionToggle.module.css";

/** Botão de pausar/retomar todas as animações da página (WCAG 2.2.2). Some com reduced-motion (já está tudo parado). */
export function MotionToggle({ onMedia, className }: { onMedia?: boolean; className?: string }) {
  const paused = useMotionPaused();
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <button
      type="button"
      className={[styles.toggle, onMedia ? styles.onMedia : "", className].filter(Boolean).join(" ")}
      onClick={toggleMotion}
      aria-pressed={paused}
      aria-label={paused ? site.ui.playMotion : site.ui.pauseMotion}
    >
      <Icon name={paused ? "play" : "pause"} size={12} />
    </button>
  );
}
