import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Social } from "@/types/socials";
import { SocialCard } from "./social-card";

/**
 * Bento-сетка с пружинной механикой по референсу vuesax anim-bento-bounce:
 * клик по карточке раскрывает её — веса колонок-треков анимируются физическим
 * пружинным симулятором (v += (-k·(x-target) - c·v)·dt) с «приседанием»
 * (отрицательный импульс) и недодемпфированным отскоком; соседние колонки
 * сжимаются — fr-веса нормируются самим гридом. Паттерн раскладки остаётся
 * из JSON (size), пружины двигают только ширины колонок на lg (4 колонки).
 * rAF-цикл засыпает, когда все пружины успокоились. reduced-motion — мгновенно.
 */

const COLS_LG = 4;
const EXPAND = 3.5;
const HOVER_GROW = 1.22;
const BOUNCE = 0.55;
const SPEED = 1;
const K = 130 * SPEED;
const LG_QUERY = "(min-width: 1024px)";

type Spring = { x: number; v: number; target: number };
const makeSpring = (): Spring => ({ x: 1, v: 0, target: 1 });
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export function BentoGrid({ socials }: { socials: Social[] }) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const colSprings = useRef<Spring[]>(Array.from({ length: 3 }, makeSpring));
  const cardStarts = useRef<number[]>([]);
  const loop = useRef({ raf: 0, sleeping: true, last: 0 });
  const ui = useRef({ focused: -1, hovered: -1 });
  const [focused, setFocusedState] = useState(-1); // зеркало для React-эффектов
  const [cols, setCols] = useState(3); // 3 трека на мобильном (мозаика), 4 на lg
  const [, bump] = useState(0);
  const reduced = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // Мобильная мозаика на 3 треках — точная раскладка референса vuesax:
  // r1 «2+1» (featured двойная + первая wide узкая высокая 1×2),
  // r2 «1+2» (хвост высокой + первая normal двойная — большая карточка),
  // r3 «1+1+1» (остальные по треку)
  const mobileLayout = useMemo(() => {
    let wideSeen = 0;
    let normalSeen = 0;
    return socials.map((s) => {
      const size = s.size ?? "normal";
      if (size === "featured") return { cls: "col-span-2", cols: 2, compact: false };
      if (size === "wide") {
        const first = wideSeen++ === 0;
        return { cls: first ? "col-span-1 row-span-2" : "col-span-1", cols: 1, compact: true };
      }
      if (size === "full") return { cls: "col-span-3", cols: 3, compact: false };
      const first = normalSeen++ === 0;
      return { cls: first ? "col-span-2" : "col-span-1", cols: first ? 2 : 1, compact: !first };
    });
  }, [socials]);

  // Сколько колонок занимает каждая карточка (full на lg — вся ширина)
  const spans = useMemo(
    () =>
      socials.map((s, i) => {
        const size = s.size ?? "normal";
        if (cols === 4) return size === "full" ? 4 : size === "normal" ? 1 : 2;
        return mobileLayout[i].cols;
      }),
    [socials, cols, mobileLayout]
  );

  const applyColumns = useCallback(() => {
    const grid = gridRef.current;
    if (grid) {
      grid.style.gridTemplateColumns = colSprings.current
        .map((t) => `${Math.max(t.x, 0.08).toFixed(4)}fr`)
        .join(" ");
    }
  }, []);

  const resetColumns = useCallback(() => {
    if (gridRef.current) gridRef.current.style.gridTemplateColumns = "";
  }, []);

  // Стартовые колонки карточек — из фактической раскладки DOM
  const measureStarts = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const gridLeft = grid.getBoundingClientRect().left;
    const colWidth = grid.clientWidth / cols;
    cardStarts.current = Array.from(
      grid.querySelectorAll<HTMLElement>(":scope > .contents > article"),
      (card) => clamp(Math.round((card.getBoundingClientRect().left - gridLeft) / colWidth), 0, cols - 1)
    );
  }, [cols]);

  const retarget = useCallback(() => {
    const { focused, hovered } = ui.current;
    for (const t of colSprings.current) t.target = 1;
    const pick = focused >= 0 ? focused : hovered;
    if (pick >= 0) {
      const c0 = cardStarts.current[pick] ?? 0;
      const cs = spans[pick];
      for (let c = c0; c < Math.min(c0 + cs, cols); c++) {
        colSprings.current[c].target = focused >= 0 ? EXPAND : HOVER_GROW;
      }
    }
  }, [spans, cols]);

  const squashKick = useCallback(
    (idx: number) => {
      const c0 = cardStarts.current[idx] ?? 0;
      const cs = spans[idx];
      for (let c = c0; c < Math.min(c0 + cs, cols); c++) colSprings.current[c].v -= 4;
    },
    [spans, cols]
  );

  const stepSpring = (t: Spring, dt: number) => {
    const zeta = 1 - clamp(BOUNCE, 0, 0.95) * 0.85;
    const damp = 2 * zeta * Math.sqrt(K);
    t.v += (-K * (t.x - t.target) - damp * t.v) * dt;
    t.x += t.v * dt;
    if (t.x < 0.08) {
      t.x = 0.08;
      if (t.v < 0) t.v = 0;
    }
  };
  const settled = (t: Spring) => Math.abs(t.x - t.target) < 0.001 && Math.abs(t.v) < 0.002;

  const tickRef = useRef<(t: number) => void>(() => {});
  tickRef.current = (t: number) => {
    const st = loop.current;
    st.raf = 0;
    const dtMs = st.last ? Math.min(t - st.last, 100) : 16;
    st.last = t;
    let done = true;
    for (const s of colSprings.current) {
      stepSpring(s, Math.min(dtMs, 64) / 1000);
      if (!settled(s)) done = false;
    }
    applyColumns();
    if (done) {
      if (ui.current.focused < 0 && ui.current.hovered < 0) resetColumns();
      st.sleeping = true; // уснуть: не перезапускаем rAF
      return;
    }
    st.raf = requestAnimationFrame(tickRef.current);
  };

  const wake = useCallback(() => {
    const st = loop.current;
    if (reduced.current) return;
    st.sleeping = false;
    if (!st.raf) {
      st.last = 0;
      st.raf = requestAnimationFrame(tickRef.current);
    }
  }, []);

  const toggle = useCallback(
    (idx: number) => {
      const next = ui.current.focused === idx ? -1 : idx;
      ui.current.focused = next;
      setFocusedState(next);
      bump((n) => n + 1);
      measureStarts();
      retarget();
      if (next >= 0 && !reduced.current) squashKick(idx);
      if (reduced.current) {
        // без анимации: пружины сразу в цель
        for (const s of colSprings.current) {
          s.x = s.target;
          s.v = 0;
        }
        next < 0 ? resetColumns() : applyColumns();
      }
      wake();
    },
    [applyColumns, measureStarts, resetColumns, retarget, squashKick, wake]
  );

  const hover = useCallback(
    (idx: number) => {
      ui.current.hovered = idx;
      measureStarts();
      retarget();
      wake();
    },
    [measureStarts, retarget, wake]
  );

  const unhover = useCallback(
    (idx: number) => {
      if (ui.current.hovered === idx) {
        ui.current.hovered = -1;
        retarget();
        wake();
      }
    },
    [retarget, wake]
  );

  // Кол-во колонок меняется на брейкпоинте — пересоздаём пружины под новую сетку
  useEffect(() => {
    colSprings.current = Array.from({ length: cols }, makeSpring);
    ui.current.focused = -1;
    ui.current.hovered = -1;
    setFocusedState(-1);
    resetColumns();
    bump((n) => n + 1);
  }, [cols, resetColumns]);

  useEffect(() => {
    const mq = window.matchMedia(LG_QUERY);
    const sync = () => setCols(mq.matches ? 4 : 3);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Escape сворачивает раскрытую карточку
  useEffect(() => {
    if (focused < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggle(focused);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused, toggle]);

  // Proximity-glow: один pointermove на сетку, rAF-троттлинг; переменные --gx/--gy/--glow
  // на каждой карточке (адаптация vs-fx attachGlow, привязанная к нашей сетке)
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    let raf = 0;
    let px = 0, py = 0, has = false;
    const cards = () => Array.from(grid.querySelectorAll<HTMLElement>(":scope > .contents > article"));
    const flush = () => {
      raf = 0;
      if (!has) return;
      for (const el of cards()) {
        const r = el.getBoundingClientRect();
        const nx = Math.max(r.left, Math.min(px, r.right));
        const ny = Math.max(r.top, Math.min(py, r.bottom));
        const i = Math.max(0, 1 - Math.hypot(px - nx, py - ny) / 220);
        el.style.setProperty("--glow", i.toFixed(3));
        if (i > 0) {
          el.style.setProperty("--gx", `${px - r.left}px`);
          el.style.setProperty("--gy", `${py - r.top}px`);
        }
      }
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return; // тач не зажигает glow — иначе на мобильных артефакт
      px = e.clientX; py = e.clientY; has = true;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const leave = () => {
      has = false;
      for (const el of cards()) el.style.setProperty("--glow", "0");
    };
    grid.addEventListener("pointermove", move, { passive: true });
    grid.addEventListener("pointerleave", leave);
    return () => {
      grid.removeEventListener("pointermove", move);
      grid.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={gridRef} className="grid grid-flow-dense grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
      {socials.map((social, i) => (
        <div key={social.id} className="contents" style={{ "--stagger": i } as React.CSSProperties}>
          <SocialCard
            social={social}
            mobileClassName={mobileLayout[i].cls}
            mobileCompact={mobileLayout[i].compact}
            expanded={focused === i}
            onToggle={() => toggle(i)}
            onHover={() => hover(i)}
            onUnhover={() => unhover(i)}
          />
        </div>
      ))}
    </div>
  );
}
