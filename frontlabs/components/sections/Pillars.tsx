import type { PillarVisual } from "@/content/types";
import { site } from "@/content/site";
import { ChecklistDemo } from "@/components/ui/ChecklistDemo";
import { Icon } from "@/components/ui/Icon";
import { MotionToggle } from "@/components/ui/MotionToggle";
import { SearchDemo } from "@/components/ui/SearchDemo";
import { VideoWindow } from "@/components/ui/VideoWindow";
import styles from "./Pillars.module.css";

function Visual({ v }: { v: PillarVisual }) {
  if (v.kind === "search") return <SearchDemo label={v.label} queries={v.queries} result={v.result} />;
  if (v.kind === "checklist") return <ChecklistDemo label={v.label} items={v.items} />;
  return (
    <div className={styles.window}>
      <VideoWindow video={v.video} url={v.url} status={v.status} compact />
    </div>
  );
}

/**
 * Pilares: um card branco por pilar (raio 24) com a área visual animada em cima (4:3, raio 18,
 * 8px de margem, como os cards de passo do DESIGN §6.8) e embaixo o círculo de ícone, o número mono,
 * o título e a frase. 4 colunas no desktop, 2×2 no tablet, um embaixo do outro no celular.
 */
export function Pillars() {
  const data = site.pillars;
  if (!data.enabled) return null;
  return (
    <section id={data.id} data-section="pillars" className={`section ${styles.section}`} aria-labelledby={data.title ? `${data.id}-title` : undefined}>
      <div className="container">
        {data.title ? (
          <div className={styles.headRow}>
          <header className={styles.head}>
            {data.label ? <p className="t-label">{data.label}</p> : null}
            <h2 id={`${data.id}-title`} className="t-display">
              {data.title}
              {" "}
              {data.titleTurn ? <span className={styles.turn}>{data.titleTurn}</span> : null}
            </h2>
          </header>
          <MotionToggle />
          </div>
        ) : null}
        <ul className={styles.grid} style={{ "--cols": data.items.length } as React.CSSProperties}>
          {data.items.map((p, i) => (
            <li key={p.title} className={styles.card}>
              {p.visual ? <div className={styles.visual}><Visual v={p.visual} /></div> : null}
              <div className={styles.body}>
                <div className={styles.top}>
                  <span className={styles.icon}><Icon name={p.icon} size={18} /></span>
                  {data.numbered ? <span className={`t-label ${styles.num}`}>/{String(i + 1).padStart(2, "0")}</span> : null}
                </div>
                <h3 className={`t-title ${styles.title}`}>{p.title}</h3>
                <p className={`t-small ${styles.text}`}>{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
