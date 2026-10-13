import type { ReactNode } from "react";
import type { PreviewSpec } from "@/content/types";
import { site } from "@/content/site";
import styles from "./PreviewCard.module.css";

/**
 * Janela de navegador desenhada em HTML/CSS: 3 bolinhas, pill de URL, conteúdo e linha de status.
 * Genérico: serve para qualquer marca mostrar "o produto" sem screenshot.
 * `children` substitui o conteúdo padrão quando a seção precisa de outro miolo.
 * `bleed`: miolo sem respiro (vídeo do site ocupando a janela toda).
 */
export function PreviewCard({ preview, children, compact, bleed, className }: { preview: PreviewSpec; children?: ReactNode; compact?: boolean; bleed?: boolean; className?: string }) {
  return (
    <figure className={[styles.card, compact ? styles.compact : "", bleed ? styles.bleed : "", className].filter(Boolean).join(" ")} aria-label={`${site.ui.preview}: ${preview.title}`}>
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.dots}><i /><i /><i /></span>
        <span className={styles.url}>{preview.url}</span>
        <span className={styles.spacer} />
      </div>
      <div className={styles.body}>
        {children ?? (
          <>
            {preview.eyebrow ? <span className={`t-label ${styles.eyebrow}`}>{preview.eyebrow}</span> : null}
            <p className={styles.title}>{preview.title}</p>
            {preview.text ? <p className={styles.text}>{preview.text}</p> : null}
            {preview.cta ? <span className={styles.cta}>{preview.cta}</span> : null}
            {preview.rows?.length ? (
              <dl className={styles.rows}>
                {preview.rows.map((r) => (
                  <div key={r.label} className={styles.row}>
                    <dt className="t-label">{r.label}</dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </>
        )}
      </div>
      <figcaption className={styles.status}>
        <span className={styles.live} aria-hidden="true" />
        {preview.status}
      </figcaption>
    </figure>
  );
}
