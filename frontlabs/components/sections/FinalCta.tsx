"use client";
import { useId, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import type { FinalCtaContent } from "@/content/types";
import { Icon } from "@/components/ui/Icon";
import { LivingGradient } from "@/components/ui/LivingGradient";
import { Media } from "@/components/ui/Media";
import styles from "./FinalCta.module.css";

const valid = {
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
  url: (v: string) => /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v),
};

/** CTA final (B), em todas as páginas: título centralizado, frase, card branco com input pill + botão e microcopy. Sem backend: valida e mostra sucesso. */
export function FinalCta({ data = site.finalCta }: { data?: FinalCtaContent }) {
  const id = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!data.enabled) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!v) return setError(data.errorEmpty);
    if (!valid[data.inputType](v)) return setError(data.errorInvalid);
    setError("");
    setDone(true);
  };

  const shout = data.style === "shout";
  const onMedia = Boolean(data.background);
  return (
    <section id={data.id} data-section="final-cta" className={onMedia ? "field-wrap" : "section"} aria-labelledby={`${data.id}-title`}>
      <div className={[styles.inner, onMedia ? styles.onMedia : ""].join(" ")}>
        {/* rodada 4: o Horizonte (gradient) vira o Horizonte vivo; outra mídia continua parada */}
        {data.background?.kind === "gradient" ? <LivingGradient dim /> : data.background ? <Media media={data.background} fill className={styles.bg} /> : null}
        <div className="container">
          <h2 id={`${data.id}-title`} className={shout ? `t-shout ${styles.shout}` : `t-display ${styles.title}`}>
            {data.title}
            {" "}
            {data.titleTurn ? <span className={styles.turn}>{data.titleTurn}</span> : null}
          </h2>
          <p className={styles.text}>{data.text}</p>
          <div className={styles.card}>
            {done ? (
              <p className={styles.success} role="status"><Icon name="check" size={16} />{data.success}</p>
            ) : (
              <form className={styles.form} onSubmit={submit} noValidate>
                <label htmlFor={id} className="sr-only">{data.inputLabel}</label>
                <div className={[styles.pill, error ? styles.invalid : ""].join(" ")}>
                  <input
                    id={id}
                    type={data.inputType === "email" ? "email" : "text"}
                    inputMode={data.inputType === "email" ? "email" : "url"}
                    autoComplete={data.inputType === "email" ? "email" : "url"}
                    placeholder={data.placeholder}
                    value={value}
                    onChange={(e) => { setValue(e.target.value); if (error) setError(""); }}
                    aria-invalid={Boolean(error)}
                    aria-describedby={`${id}-msg`}
                    className={styles.input}
                  />
                  <button type="submit" className={styles.submit}>{data.button}<Icon name="arrow" size={14} /></button>
                </div>
                <p id={`${id}-msg`} className={error ? styles.error : styles.micro} aria-live="polite">{error || data.microcopy}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
