import Image from "next/image";
import { site } from "@/content/site";
import type { StepsContent, StepVisual } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { CodeTyper } from "@/components/ui/CodeTyper";
import { LivingGradient } from "@/components/ui/LivingGradient";
import { MotionToggle } from "@/components/ui/MotionToggle";
import { PhotoShuffle } from "@/components/ui/PhotoShuffle";
import { PreviewCard } from "@/components/ui/PreviewCard";
import { Reveal } from "@/components/ui/Reveal";
import { SendDemo } from "@/components/ui/SendDemo";
import { VideoWindow } from "@/components/ui/VideoWindow";
import styles from "./Steps.module.css";

/**
 * Passos (DESIGN §6.8) — só da Front Labs.
 * Card branco raio 24 com a imagem do momento em cima (raio 18, 8px de margem)
 * e embaixo: círculo de etapa + rótulo mono, título de card e uma frase. O último círculo é preenchido.
 * Com 5 passos (home, rodada 3): uma linha no desktop largo, faixa com rolagem horizontal (snap)
 * entre 768 e 1279, um embaixo do outro no celular. Botões opcionais embaixo.
 */
function Visual({ v }: { v: StepVisual }) {
  if (v.kind === "send") {
    return (
      <div className={`${styles.stage} ${styles.veil}`} data-stage>
        <Image src="/img/foto-borrada-hero.jpg" alt="" fill sizes="(max-width: 767px) 100vw, 20vw" className={styles.bg} />
        <SendDemo label={v.label} url={v.url} or={v.or} button={v.button} />
      </div>
    );
  }
  if (v.kind === "video") {
    return (
      <div className={styles.stage} data-stage>
        <Image src="/img/foto-noiva-borrada.jpg" alt="" fill sizes="(max-width: 767px) 100vw, 20vw" className={styles.bg} />
        <div className={styles.mini}><VideoWindow video={v.video} url={v.url} status={v.status} compact /></div>
      </div>
    );
  }
  if (v.kind === "photos") {
    return (
      <div className={styles.stage} data-stage>
        <Image src="/img/foto-cadeiras-borrada.jpg" alt="" fill sizes="(max-width: 767px) 100vw, 20vw" className={styles.bg} />
        <PhotoShuffle label={v.label} photos={v.photos} />
      </div>
    );
  }
  if (v.kind === "code") {
    return (
      <div className={styles.stage} data-stage>
        <Image src="/img/foto-borrada-hero.jpg" alt="" fill sizes="(max-width: 767px) 100vw, 20vw" className={styles.bg} />
        <div className={styles.editor}><CodeTyper code={v.code} rows={4} small /></div>
      </div>
    );
  }
  if (v.kind === "preview") {
    return (
      <div className={styles.stage} data-stage>
        <Image src="/img/foto-borrada-hero.jpg" alt="" fill sizes="(max-width: 767px) 100vw, 33vw" className={styles.bg} />
        <div className={styles.mini}>
          <PreviewCard preview={{ ...v.preview, rows: v.preview.rows?.slice(0, 2) }} compact />
        </div>
      </div>
    );
  }
  if (v.kind === "plan") {
    return (
      <div className={styles.stage} data-stage>
        <Image src="/img/foto-cadeiras-borrada.jpg" alt="" fill sizes="(max-width: 767px) 100vw, 25vw" className={styles.bg} />
        <ul className={styles.plans}>
          {v.options.map((o) => (
            <li key={o.name} className={o.on ? styles.planOn : undefined}>
              <span className={styles.planName}>{o.name}</span>
              <span className={`t-label ${styles.planNote}`}>{o.note}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (v.kind === "invite") {
    return (
      <div className={styles.stage} data-stage>
        <Image src="/img/foto-borrada-hero.jpg" alt="" fill sizes="(max-width: 767px) 100vw, 33vw" className={styles.bg} />
        <div className={styles.invite}>
          <div className={styles.inviteCard}>
            <span className={styles.date}><span>{v.month}</span><strong>{v.day}</strong></span>
            <span className={styles.inviteText}>
              <span className={styles.inviteTitle}>{v.title}</span>
              <span className={`t-label ${styles.inviteMeta}`}>{v.meta}</span>
            </span>
          </div>
          <p className={styles.bubble}>{v.reply}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`${styles.stage} ${styles.horizon}`} data-stage>
      <LivingGradient dim sizes="(max-width: 767px) 100vw, 33vw" />
      <div className={styles.live}>
        <span className={styles.domain}><i className={styles.dot} aria-hidden="true" />{v.domain}</span>
        <span className={styles.word}>{v.word}</span>
      </div>
    </div>
  );
}

export function Steps({ data = site.steps }: { data?: StepsContent }) {
  if (!data.enabled) return null;
  return (
    <section id={data.id} data-section="steps" className="section" aria-labelledby={`${data.id}-title`}>
      <div className="container">
        <div className={styles.headRow}>
        <header className={styles.head}>
          {data.label ? <p className="t-label">{data.label}</p> : null}
          <h2 id={`${data.id}-title`} className="t-display">
            {data.title}
            {" "}
            {data.titleTurn ? <span className={styles.turn}>{data.titleTurn}</span> : null}
          </h2>
        </header>
        {data.items.some((s) => !["preview", "plan", "invite"].includes(s.visual.kind)) ? <MotionToggle /> : null}
        </div>
        <ol className={[styles.grid, data.items.length > 4 ? styles.five : ""].join(" ")} style={{ "--cols": data.items.length } as React.CSSProperties}>
          {data.items.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 120} className={styles.card}>
              <Visual v={s.visual} />
              <div className={styles.body}>
                <p className={styles.meta}>
                  <span className={[styles.circle, i === data.items.length - 1 ? styles.filled : ""].join(" ")} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="t-label">{s.label}</span>
                </p>
                <h3 className="t-title">
                  <span className="sr-only">{`${site.ui.step} ${i + 1}: `}</span>
                  {s.title}
                </h3>
                <p className={styles.text}>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        {data.primary || data.secondary ? (
          <div className={styles.actions}>
            {data.primary ? <Button href={data.primary.href} variant="primary" size="md">{data.primary.label}</Button> : null}
            {data.secondary ? <Button href={data.secondary.href} variant="link" size="md">{data.secondary.label}</Button> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
