"use client";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { CodeSpec } from "@/content/types";
import { useInView, useMotionPaused, useReducedMotion } from "./useMotion";
import styles from "./CodeTyper.module.css";

type Tok = { t: string; c: "kw" | "str" | "tag" | "dim" | "plain" };
const RE = /("[^"]*"|'[^']*')|\b(const|export|default|function|return|import|from|type)\b|(<\/?[A-Za-z][\w.]*|\/?>)|([{}()[\];,:=.])/g;

/** Realce de sintaxe só em cinzas + branco; strings no céu claro (a única cor). */
function tokenize(line: string): Tok[] {
  const out: Tok[] = [];
  let at = 0;
  for (const m of line.matchAll(RE)) {
    if (m.index > at) out.push({ t: line.slice(at, m.index), c: "plain" });
    out.push({ t: m[0], c: m[1] ? "str" : m[2] ? "kw" : m[3] ? "tag" : "dim" });
    at = m.index + m[0].length;
  }
  if (at < line.length) out.push({ t: line.slice(at), c: "plain" });
  return out;
}

const CHAR_MS = 12;
const LINE_MS = 70;
const DONE_MS = 2000;

/**
 * Janela de editor (3 bolinhas + nome do arquivo) com o código sendo digitado linha a linha,
 * cursor piscando e rolagem quando enche. No fim mostra "✓ build passed", espera 2s e recomeça.
 * Só anda na tela; com reduced-motion mostra o código inteiro e o "build passed" parados.
 */
export function CodeTyper({ code, rows = 14, small, className }: { code: CodeSpec; rows?: number; small?: boolean; className?: string }) {
  const lines = useMemo(() => code.code.split("\n").map(tokenize), [code.code]);
  const total = useMemo(() => lines.map((l) => l.reduce((n, t) => n + t.t.length, 0)), [lines]);
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reduced = useReducedMotion();
  const paused = useMotionPaused();
  const [pos, setPos] = useState({ line: 0, ch: 0, done: false });

  useEffect(() => {
    if (!inView || reduced || paused) return;
    let ms = CHAR_MS;
    let next = pos;
    if (pos.done) {
      next = { line: 0, ch: 0, done: false };
      ms = DONE_MS;
    } else if (pos.ch < total[pos.line]) {
      // espaços do recuo entram de uma vez
      const rest = code.code.split("\n")[pos.line].slice(pos.ch);
      const indent = pos.ch === 0 ? rest.length - rest.trimStart().length : 0;
      next = { ...pos, ch: pos.ch + Math.max(1, indent) };
    } else if (pos.line < lines.length - 1) {
      next = { line: pos.line + 1, ch: 0, done: false };
      ms = LINE_MS;
    } else {
      next = { ...pos, done: true };
      ms = 500;
    }
    const id = window.setTimeout(() => setPos(next), ms);
    return () => window.clearTimeout(id);
  }, [inView, reduced, paused, pos, total, lines.length, code.code]);

  const still = reduced;
  const shown = still ? { line: lines.length - 1, ch: total[lines.length - 1], done: true } : pos;
  const scroll = Math.max(0, shown.line - rows + 1);

  return (
    <div ref={ref} className={[styles.editor, small ? styles.small : "", className].filter(Boolean).join(" ")} role="img" aria-label={code.label}>
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.dots}><i /><i /><i /></span>
        <span className={styles.file}>{code.file}</span>
      </div>
      <div className={styles.body} style={{ "--rows": rows } as CSSProperties} aria-hidden="true">
        {/* rolando, o respiro de cima também sai: a linha anterior some inteira, sem meia linha no topo */}
        <pre className={styles.code} style={{ transform: scroll ? `translateY(calc(${-scroll} * var(--code-lh) - var(--code-pad)))` : undefined }}>
          {lines.slice(0, shown.line + 1).map((toks, li) => {
            let budget = li < shown.line ? Infinity : shown.ch;
            const cursorHere = li === shown.line && !shown.done;
            return (
              <span key={li} className={styles.line}>
                {toks.map((tk, ti) => {
                  if (budget <= 0) return null;
                  const t = tk.t.slice(0, budget);
                  budget -= tk.t.length;
                  return <span key={ti} className={styles[tk.c]}>{t}</span>;
                })}
                {cursorHere ? <span className={styles.cursor} /> : null}
                {"\n"}
              </span>
            );
          })}
        </pre>
      </div>
      <p className={styles.status} aria-hidden="true">
        <span className={[styles.dot, shown.done ? styles.dotOn : ""].join(" ")} />
        {shown.done ? code.done : code.writing}
      </p>
    </div>
  );
}
