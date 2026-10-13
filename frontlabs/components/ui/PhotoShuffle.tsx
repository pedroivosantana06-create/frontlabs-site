"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView, useMotionPaused, useReducedMotion } from "./useMotion";
import styles from "./PhotoShuffle.module.css";

const HOLD_MS = 2600;

/** Passo 03: três fotos soltas que se arrumam numa grade, se soltam e se arrumam de novo. Parado: arrumadas. */
export function PhotoShuffle({ label, photos }: { label: string; photos: { src: string; alt: string }[] }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const reduced = useReducedMotion();
  const paused = useMotionPaused();
  const [tidy, setTidy] = useState(false);
  useEffect(() => {
    if (!inView || reduced || paused) return;
    const id = window.setTimeout(() => setTidy((t) => !t), tidy ? HOLD_MS : 900);
    return () => window.clearTimeout(id);
  }, [inView, reduced, paused, tidy]);
  return (
    <div ref={ref} className={[styles.grid, tidy || reduced ? styles.tidy : ""].join(" ")} role="img" aria-label={label}>
      {photos.slice(0, 3).map((p, i) => (
        <span key={p.src} className={styles.photo} data-i={i}>
          <Image src={p.src} alt="" fill sizes="160px" />
        </span>
      ))}
    </div>
  );
}
