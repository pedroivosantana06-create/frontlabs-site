"use client";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { TabItem } from "@/content/types";
import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { PreviewCard } from "@/components/ui/PreviewCard";
import { Stage } from "@/components/ui/Stage";
import styles from "./FeatureTabs.module.css";

/**
 * Abas (Runway): painel branco com as etapas à esquerda e a mídia à direita (~62%, 4:3).
 * Cada etapa: número mono + título grande; a descrição abre só na ativa (altura animada) e
 * uma barra fina corre embaixo dela enquanto conta o tempo da troca automática.
 * A troca acontece no fim da barra (uma fonte de verdade); para quando a pessoa interage.
 * Teclado: setas, Home/End. Celular: acordeão, com a mídia dentro da etapa aberta.
 */
export function FeatureTabs() {
  const data = site.tabs;
  const [g, setG] = useState(0);
  const [t, setT] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const groupRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const groups = data.groups;
  const tabs = groups[g]?.tabs ?? [];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const next = useCallback(() => {
    if (t < tabs.length - 1) setT(t + 1);
    else {
      setG((g + 1) % groups.length);
      setT(0);
    }
  }, [t, g, tabs.length, groups.length]);

  const stop = useCallback(() => setAuto(false), []);
  const running = auto && !reduced;

  const onTabKey = (e: KeyboardEvent, i: number) => {
    const n = tabs.length;
    const map: Record<string, number> = { ArrowDown: (i + 1) % n, ArrowRight: (i + 1) % n, ArrowUp: (i - 1 + n) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    stop();
    setT(map[e.key]);
    tabRefs.current[map[e.key]]?.focus();
  };
  const onGroupKey = (e: KeyboardEvent, i: number) => {
    const n = groups.length;
    const map: Record<string, number> = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    stop();
    setG(map[e.key]);
    setT(0);
    groupRefs.current[map[e.key]]?.focus();
  };

  if (!data.enabled) return null;
  const active = tabs[t];
  const panelId = `${data.id}-panel`;

  return (
    <section ref={rootRef} id={data.id} data-section="tabs" className={`section ${styles.section}`} aria-labelledby={data.title ? `${data.id}-title` : undefined} aria-label={data.title ? undefined : groups.map((x) => x.name).join(", ")}>
      <div className="wide">
        {data.title ? (
          <header className={styles.head}>
            {data.label ? <p className="t-label">{data.label}</p> : null}
            <h2 id={`${data.id}-title`} className="t-display">{data.title}</h2>
          </header>
        ) : null}

        {groups.length > 1 ? (
          <div className={styles.groups} role="tablist" aria-label={site.ui.groups}>
            {groups.map((grp, i) => (
              <button
                key={grp.name}
                ref={(el) => { groupRefs.current[i] = el; }}
                role="tab"
                type="button"
                aria-selected={i === g}
                aria-controls={panelId}
                tabIndex={i === g ? 0 : -1}
                className={[styles.group, i === g ? styles.groupOn : ""].join(" ")}
                onClick={() => { stop(); setG(i); setT(0); }}
                onKeyDown={(e) => onGroupKey(e, i)}
              >
                {grp.name}
              </button>
            ))}
          </div>
        ) : null}

        <div className={styles.panel} id={panelId}>
          <div className={styles.listWrap}>
            <div className={styles.list} role="tablist" aria-orientation="vertical" aria-label={groups[g]?.name}>
              {tabs.map((tab, i) => {
                const on = i === t;
                return (
                  <div key={tab.title} className={[styles.item, on ? styles.itemOn : ""].join(" ")}>
                    <button
                      ref={(el) => { tabRefs.current[i] = el; }}
                      role="tab"
                      type="button"
                      id={`${data.id}-tab-${i}`}
                      aria-selected={on}
                      aria-controls={`${data.id}-tabpanel`}
                      tabIndex={on ? 0 : -1}
                      className={styles.tab}
                      onClick={() => { stop(); setT(i); }}
                      onKeyDown={(e) => onTabKey(e, i)}
                    >
                      <span className={`t-label ${styles.num}`}>{String(i + 1).padStart(2, "0")}</span>{" "}
                      <span className={styles.tabTitle}>{tab.title}</span>
                    </button>
                    <div className={styles.more} aria-hidden={!on}>
                      <div className={styles.moreInner}>
                        <p className={styles.tabText}>{tab.text}</p>
                        {on ? <div className={styles.inlineStage}><TabMedia tab={tab} /></div> : null}
                      </div>
                    </div>
                    {on && running ? (
                      <span
                        key={`${g}-${t}`}
                        className={styles.bar}
                        style={{ "--interval": `${tab.durationMs ?? data.intervalMs}ms`, animationPlayState: visible ? "running" : "paused" } as CSSProperties}
                        onAnimationEnd={next}
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
            <button type="button" className={styles.pause} onClick={() => setAuto((a) => !a)} aria-label={auto ? data.pauseLabel : data.playLabel}>
              <Icon name={auto ? "pause" : "play"} size={12} />
            </button>
          </div>
          <div className={styles.stage} role="tabpanel" id={`${data.id}-tabpanel`} aria-labelledby={`${data.id}-tab-${t}`}>
            {active ? (
              <div key={`${g}-${t}`} className={styles.fade}>
                <TabMedia tab={active} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function TabMedia({ tab }: { tab: TabItem }) {
  if (tab.stage) return <Stage stage={tab.stage} className={styles.stageFrame} />;
  if (tab.preview) return <div className={styles.previewWrap} data-media><PreviewCard preview={tab.preview} /></div>;
  return <Media media={tab.media} className={styles.media} sizes="(max-width: 1023px) 100vw, 60vw" />;
}
