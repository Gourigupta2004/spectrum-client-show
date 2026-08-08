import { useCallback, useEffect, useRef, useState } from "react";
import { heroSlides } from "@/lib/spectrum-data";

export function HeroCarousel() {
  const [active, setActive] = useState(2);
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);

  const go = useCallback((dir: number) => {
    setActive((a) => (a + dir + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 3600);
    return () => clearInterval(t);
  }, [go, paused]);

  const onDown = (x: number) => {
    drag.current = { x, moved: false };
    setPaused(true);
  };
  const onMove = (x: number) => {
    if (!drag.current || drag.current.moved) return;
    const dx = x - drag.current.x;
    if (Math.abs(dx) > 44) {
      go(dx < 0 ? 1 : -1);
      drag.current.moved = true;
    }
  };
  const onUp = () => {
    drag.current = null;
    setTimeout(() => setPaused(false), 1200);
  };

  return (
    <div
      className="relative h-[42vh] w-full select-none md:h-[46vh]"
      style={{ perspective: "1600px" }}
      onMouseDown={(e) => onDown(e.clientX)}
      onMouseMove={(e) => onMove(e.clientX)}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={(e) => onDown(e.touches[0]!.clientX)}
      onTouchMove={(e) => onMove(e.touches[0]!.clientX)}
      onTouchEnd={onUp}
    >
      {heroSlides.map((s, i) => {
        const n = heroSlides.length;
        let offset = i - active;
        if (offset > n / 2) offset -= n;
        if (offset < -n / 2) offset += n;
        const abs = Math.abs(offset);
        const hidden = abs > 3;
        return (
          <button
            key={s.id}
            onClick={() => setActive(i)}
            aria-label={s.caption}
            className="absolute left-1/2 top-1/2 h-full w-[clamp(180px,22vw,300px)] rounded-2xl transition-all duration-700 ease-out"
            style={{
              transform: `translate(-50%,-50%) translateX(${offset * 58}%) scale(${
                1 - abs * 0.13
              }) rotateY(${offset * -26}deg)`,
              opacity: hidden ? 0 : 1 - abs * 0.12,
              zIndex: 20 - abs,
              pointerEvents: hidden ? "none" : "auto",
            }}
          >
            <span className="spectrum-border absolute inset-0 block overflow-hidden rounded-2xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85)]">
              <img
                src={s.src}
                alt={s.caption}
                draggable={false}
                className="undraggable h-full w-full rounded-2xl object-cover"
              />
              {abs === 0 && (
                <span className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-[#1C1A22] to-transparent p-4 text-left font-display text-sm font-semibold text-foreground">
                  {s.caption}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
