"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/* Ganchos de movimento da rodada 3: tudo só anda quando está na tela e sem reduced-motion. */

function media(query: string) {
  const subscribe = (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
  return { subscribe, get: () => window.matchMedia(query).matches };
}
const REDUCED = media("(prefers-reduced-motion: reduce)");
const SMALL = media("(max-width: 767px)");

/*
 * Pausa global das animações (WCAG 2.2.2): um botão em cada seção com movimento contínuo
 * (MotionToggle) liga e desliga tudo de uma vez — demos, cards ao vivo, vídeos e o Horizonte vivo.
 * Marca o <html> com data-motion-paused para o CSS parar o que é só animação.
 */
let paused = false;
const listeners = new Set<() => void>();
export function toggleMotion() {
  paused = !paused;
  document.documentElement.toggleAttribute("data-motion-paused", paused);
  listeners.forEach((f) => f());
}
const subscribePaused = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
export const useMotionPaused = () => useSyncExternalStore(subscribePaused, () => paused, () => false);

export const useReducedMotion = () => useSyncExternalStore(REDUCED.subscribe, REDUCED.get, () => false);
export const useSmallScreen = () => useSyncExternalStore(SMALL.subscribe, SMALL.get, () => false);

/** `inView` fica true enquanto o elemento está visível (limiar `threshold`). */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/**
 * Máquina de digitar: digita um texto, segura, apaga e passa ao próximo, em loop.
 * `typed` fica true enquanto o texto inteiro está na tela (para acender o resultado).
 * Parado (fora da tela ou reduced-motion): mostra o último texto inteiro.
 */
export function useTypewriter(items: string[], running: boolean, { typeMs = 55, deleteMs = 24, holdMs = 1900, gapMs = 350 } = {}) {
  const [state, setState] = useState({ i: 0, n: 0, phase: "type" as "type" | "hold" | "delete" });
  const last = items.length - 1;
  useEffect(() => {
    if (!running) return;
    const { i, n, phase } = state;
    const full = items[i].length;
    let ms = typeMs;
    let next = state;
    if (phase === "type") {
      if (n < full) next = { i, n: n + 1, phase };
      else { next = { i, n, phase: "hold" }; ms = 0; }
    } else if (phase === "hold") {
      next = { i, n, phase: "delete" };
      ms = holdMs;
    } else if (n > 0) {
      next = { i, n: n - 1, phase };
      ms = deleteMs;
    } else {
      next = { i: (i + 1) % items.length, n: 0, phase: "type" };
      ms = gapMs;
    }
    const id = window.setTimeout(() => setState(next), ms);
    return () => window.clearTimeout(id);
  }, [running, state, items, typeMs, deleteMs, holdMs, gapMs]);

  if (!running && state.n === 0) return { text: items[last], index: last, typed: true };
  return { text: items[state.i].slice(0, state.n), index: state.i, typed: state.phase === "hold" };
}
