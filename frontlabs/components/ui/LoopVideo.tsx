"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { VideoSpec } from "@/content/types";
import { useMotionPaused, useReducedMotion, useSmallScreen } from "./useMotion";
import styles from "./LoopVideo.module.css";

/* No máximo 2 vídeos tocando ao mesmo tempo na página: o mais antigo pausa. */
const MAX_PLAYING = 2;
const playing = new Set<HTMLVideoElement>();
function start(v: HTMLVideoElement) {
  if (playing.has(v)) return;
  if (playing.size >= MAX_PLAYING) {
    const oldest = playing.values().next().value;
    if (oldest) stop(oldest);
  }
  playing.add(v);
  v.play().catch(() => playing.delete(v));
}
function stop(v: HTMLVideoElement) {
  playing.delete(v);
  v.pause();
}

/**
 * Vídeo curto em loop, mudo, sem controles: o "site passando" dentro do card de preview.
 * `preload="metadata"`, só toca quando metade dele está na tela e pausa quando sai.
 * Sem `autoplay` no HTML de propósito: quem dá o play é o observador (e com reduced-motion
 * ele nunca dá, então o vídeo fica parado no poster).
 * As fontes só entram quando o vídeo chega perto da tela (meia tela de distância): antes disso
 * é só o poster, e o carregamento da página não disputa banda com o herói.
 */
export function LoopVideo({ video, allowMobile = true, className }: { video: VideoSpec; allowMobile?: boolean; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const paused = useMotionPaused();
  const small = useSmallScreen();
  // versão do celular só onde há altura para ela (palcos); nas áreas 4:3 fica a de desktop
  const src = allowMobile && small && video.mobile ? video.mobile : video;
  const [near, setNear] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setNear(true);
        io.disconnect();
      }
    }, { rootMargin: "50% 0px" });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // fontes novas (entrou perto da tela ou trocou para a versão do celular): recarrega no mesmo elemento
  useEffect(() => {
    if (near) ref.current?.load();
  }, [near, src]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !near || reduced || paused) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start(v) : stop(v)), { threshold: 0.5 });
    io.observe(v);
    return () => {
      io.disconnect();
      stop(v);
    };
  }, [reduced, paused, src, near]);

  return (
    <video
      ref={ref}
      className={[styles.video, className].filter(Boolean).join(" ")}
      style={{ "--ratio": src.ratio } as CSSProperties}
      poster={src.poster}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-label={video.label}
    >
      {near ? <source key={src.webm} src={src.webm} type="video/webm" /> : null}
      {near ? <source key={src.mp4} src={src.mp4} type="video/mp4" /> : null}
    </video>
  );
}
