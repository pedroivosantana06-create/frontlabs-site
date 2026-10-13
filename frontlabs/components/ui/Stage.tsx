import Image from "next/image";
import type { StageSpec } from "@/content/types";
import { BeforeAfter } from "./BeforeAfter";
import { CodeTyper } from "./CodeTyper";
import { LivingGradient } from "./LivingGradient";
import { PreviewCard } from "./PreviewCard";
import { VideoWindow } from "./VideoWindow";
import styles from "./Stage.module.css";

const HORIZON = "/img/gradiente-horizonte-16x9.jpg";

/**
 * Palco (DESIGN §4.2.2): fundo borrado, Horizonte ou Horizonte vivo, raio 18–24, grão, e por cima o
 * "momento" desenhado em HTML (código sendo escrito, site em vídeo, foto antes/depois, domínio no ar, lista de pedidos).
 * Usado nas abas da home e nas linhas de /how-it-works.
 */
export function Stage({ stage, className, sizes = "(max-width: 1023px) 100vw, 60vw" }: { stage: StageSpec; className?: string; sizes?: string }) {
  const horizon = stage.bg === "horizon";
  const wide = stage.visual.kind === "video" || stage.visual.kind === "code";
  return (
    <div className={[styles.stage, horizon ? styles.horizon : "", className].filter(Boolean).join(" ")} data-stage>
      {stage.bg === "living" ? (
        <LivingGradient dim={stage.visual.kind === "live"} sizes={sizes} />
      ) : (
        <Image src={horizon ? HORIZON : stage.bg} alt="" fill sizes={sizes} className={styles.bg} aria-hidden="true" />
      )}
      <div className={[styles.visual, wide ? styles.wide : ""].join(" ")}><Visual stage={stage} /></div>
    </div>
  );
}

function Visual({ stage }: { stage: StageSpec }) {
  const v = stage.visual;
  if (v.kind === "preview") return <PreviewCard preview={v.preview} />;
  if (v.kind === "code") return <CodeTyper code={v.code} />;
  if (v.kind === "creative") return <BeforeAfter src={v.src} alt={v.alt} before={v.before} after={v.after} badge={v.badge} />;
  if (v.kind === "video") return <VideoWindow video={v.video} url={v.url} status={v.status} />;
  if (v.kind === "live") {
    return (
      <div className={styles.live}>
        <span className={styles.domain}><span className={styles.dot} aria-hidden="true" />{v.domain}</span>
        <p className={styles.word}>{v.word}</p>
        {v.note ? <p className={`t-label ${styles.note}`}>{v.note}</p> : null}
      </div>
    );
  }
  if (v.kind === "booking") {
    return (
      <PreviewCard preview={{ url: v.url, title: v.title, status: v.status }}>
        <p className={styles.cardTitle}>{v.title}</p>
        <span className={styles.bookBtn}>{v.button}</span>
        <p className={`t-label ${styles.slotsLabel}`}>{v.slotsLabel}</p>
        <ul className={styles.slots}>
          {v.slots.map((s, i) => <li key={s} className={i === 1 ? styles.slotOn : undefined}>{s}</li>)}
        </ul>
      </PreviewCard>
    );
  }
  return (
    <PreviewCard preview={{ url: v.url, title: v.title, status: v.status }}>
      <p className={styles.cardTitle}>{v.title}</p>
      <ul className={styles.requests}>
        {v.items.map((r) => (
          <li key={r.text}>
            <span>{r.text}</span>
            <span className={styles.done}>{r.state}</span>
          </li>
        ))}
      </ul>
    </PreviewCard>
  );
}
