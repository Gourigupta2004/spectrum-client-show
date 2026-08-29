import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import introMp4 from "@/assets/spectrum-intro.mp4.asset.json";
import introWebm from "@/assets/spectrum-intro.webm.asset.json";
import introPoster from "@/assets/spectrum-intro-poster.jpg.asset.json";
import { useIntro } from "./intro-context";

/** Stage background: a touch deeper than the site base (#221F29). */
const STAGE_BG = "#1B1922";

const CUT_AT = 1.75; // seconds — stop right as the "S" lands center, before the wordmark
const HARD_FALLBACK = 3200; // ms safety net
const HOLD = 300; // ms hold on the centered mark
const FADE = 1.0; // s dissolve into the homepage

const ORBS: { colors: [string, string]; size: number; x: string; y: string; delay: number }[] = [
  { colors: ["#FFC93C", "#FF8A3D"], size: 420, x: "38%", y: "40%", delay: 0 },
  { colors: ["#7C4DE0", "#D6339A"], size: 480, x: "62%", y: "56%", delay: 0.06 },
  { colors: ["#2FBF8F", "#2FBF8F"], size: 360, x: "55%", y: "34%", delay: 0.12 },
  { colors: ["#E8503A", "#D6339A"], size: 320, x: "44%", y: "62%", delay: 0.18 },
];

type Phase = "video" | "exiting" | "done";

export function BrandIntro() {
  const { setContentHidden } = useIntro();
  const [phase, setPhase] = useState<Phase>("video");
  const [showSkip, setShowSkip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closedRef = useRef(false);

  const startClosing = useCallback(
    (quick: boolean) => {
      if (closedRef.current) return;
      closedRef.current = true;
      const hold = quick ? 0 : HOLD;
      const fade = quick ? 0.35 : FADE;
      window.setTimeout(() => {
        videoRef.current?.pause();
        setContentHidden(false); // homepage begins fading in underneath
        setPhase("exiting");
      }, hold);
      window.setTimeout(() => setPhase("done"), hold + fade * 1000 + 60);
    },
    [setContentHidden],
  );

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
    const timers = [
      window.setTimeout(() => setShowSkip(true), 700),
      window.setTimeout(() => startClosing(false), HARD_FALLBACK),
    ];
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) startClosing(true);
    return () => timers.forEach(window.clearTimeout);
  }, [startClosing]);

  if (phase === "done") return null;

  const exiting = phase === "exiting";

  return (
    <AnimatePresence>
      <motion.div
        key="brand-intro"
        aria-hidden
        className="grain fixed inset-0 z-[80] overflow-hidden"
        style={{ backgroundColor: STAGE_BG, pointerEvents: exiting ? "none" : "auto" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: FADE, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* poster paints instantly under the video */}
        <img
          src={introPoster.url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ mixBlendMode: "screen" }}
        />

        <motion.video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          preload="auto"
          poster={introPoster.url}
          style={{ mixBlendMode: "screen" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: exiting ? 1.015 : 1 }}
          transition={{ duration: exiting ? FADE : 0.35, ease: "easeInOut" }}
          onError={() => startClosing(true)}
          onEnded={() => startClosing(false)}
          onTimeUpdate={(e) => {
            if (e.currentTarget.currentTime >= CUT_AT) startClosing(false);
          }}
        >
          <source src={introWebm.url} type="video/webm" />
          <source src={introMp4.url} type="video/mp4" />
        </motion.video>

        {/* soft multi-color pop during the dissolve */}
        <AnimatePresence>
          {exiting && (
            <motion.div key="pop" className="absolute inset-0">
              {ORBS.map((o, i) => (
                <motion.div
                  key={i}
                  className="orb"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: [0, 0.16, 0], scale: 1.15 }}
                  transition={{ duration: FADE, delay: o.delay, ease: "easeOut" }}
                  style={{
                    width: o.size,
                    height: o.size,
                    left: o.x,
                    top: o.y,
                    transform: "translate(-50%,-50%)",
                    background: `radial-gradient(circle at 40% 40%, ${o.colors[0]}, ${o.colors[1]} 58%, transparent 72%)`,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSkip && !exiting && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => startClosing(true)}
              className="absolute bottom-6 right-6 text-xs font-medium uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-white/90"
            >
              Skip
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
