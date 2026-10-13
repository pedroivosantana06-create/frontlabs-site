import type { ResultsContent } from "@/content/types";
import { Icon } from "@/components/ui/Icon";
import { ResultsScroll } from "./ResultsScroll";
import styles from "./Results.module.css";

/**
 * Resultados (Ploy "Who's Ploy for" + cards "Build. Optimize. Convert."):
 * título calmo fixo à esquerda, grade de cards de benefício à direita.
 * Cada card: círculo de ícone, título, frase e a pill contornada do produto que entrega.
 */
export function Results({ data }: { data: ResultsContent }) {
  if (!data.enabled) return null;
  if (data.mode === "scroll") return <ResultsScroll data={data} />;
  return (
    <section id={data.id} data-section="results" className="section" aria-labelledby={`${data.id}-title`}>
      <div className={`container ${styles.grid}`}>
        <header className={styles.head}>
          {data.label ? <p className="t-label">{data.label}</p> : null}
          <h2 id={`${data.id}-title`} className="t-display">
            {data.title}
            {" "}
            {data.titleTurn ? <span className={styles.turn}>{data.titleTurn}</span> : null}
          </h2>
          {data.text ? <p className={styles.text}>{data.text}</p> : null}
        </header>
        <ul className={styles.cards}>
          {data.items.map((it) => (
            <li key={it.title} className={styles.card}>
              <span className={styles.icon}><Icon name={it.icon} size={18} /></span>
              <h3 className={`t-title ${styles.title}`}>{it.title}</h3>
              <p className={`t-small ${styles.cardText}`}>{it.text}</p>
              <span className={`t-label ${styles.product}`}>{it.product}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
