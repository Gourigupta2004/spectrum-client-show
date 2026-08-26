import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import mark from "@/assets/spectrum-mark.png.asset.json";
import introMp4 from "@/assets/spectrum-intro.mp4.asset.json";
import introWebm from "@/assets/spectrum-intro.webm.asset.json";
import introPoster from "@/assets/spectrum-intro-poster.jpg.asset.json";
import { useIntro } from "./intro-context";

const HARD_FALLBACK = 8500;
const SLOW_RATE = 0.7;
const SLOW_UNTIL = 1400;

/** Closing beat: fade in -> hold -> fade out, one continuous motion. */
const FULL = { in: 0.42, hold: 320, out: 0.9 };
const QUICK = { in: 0.16, hold: 60, out: 0.28 };

const ORBS: { colors: [string, string]; size: number; x: string; y: string; delay: number }[] = [
  { colors: ["#FFC93C", "#FF8A3D"], size: 520, x: "22%", y: "28%", delay: 0.05 },
  { colors: ["#7C4DE0", "#D6339A"], size: 620, x: "74%", y: "38%", delay: 0.28 },
  { colors: ["#2FBF8F", "#2FBF8F"], size: 460, x: "44%", y: "78%", delay: 0.5 },
  { colors: ["#E8503A", "#D6339A"], size: 400, x: "62%", y: "16%", delay: 0.72 },
];

type Phase = "video" | "closing" | "exiting" | "done";

export function BrandIntro() {
  const { setContentHidden } = useIntro();
  const [phase, setPhase] = useState<Phase>("video");
  const [showSkip, setShowSkip] = useState(false);
  const [beat, setBeat] = useState(FULL);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closedRef = useRef(false);

  const startClosing = useCallback(
    (quick: boolean) => {
      if (closedRef.current) return;
      closedRef.current = true;
      const b = quick ? QUICK : FULL;
      setBeat(b);
      setPhase("closing");
      const holdFor = b.in * 1000 + b.hold;
      window.setTimeout(() => setPhase("exiting"), holdFor);
      window.setTimeout(
        () => {
          setContentHidden(false);
          setPhase("done");
        },
        holdFor + b.out * 1000,
      );
    },
    [setContentHidden],
  );

  // Playback pacing + skip affordance + hard fallback.
  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.playbackRate = SLOW_RATE;
      v.play().catch(() => {});
    }
    const timers = [
      window.setTimeout(() => {
        const el = videoRef.current;
        if (el) el.playbackRate = 1;
      }, SLOW_UNTIL),
      window.setTimeout(() => setShowSkip(true), 1000),
      window.setTimeout(() => startClosing(false), HARD_FALLBACK),
    ];
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) startClosing(true);
    return () => timers.forEach(window.clearTimeout);
  }, [startClosing]);

  if (phase === "done") return null;

  const closing = phase === "closing" || phase === "exiting";
  const exiting = phase === "exiting";

  return (
    <AnimatePresence>
      <motion.div
        key="brand-intro"
        aria-hidden
        className="grain fixed inset-0 z-[80] overflow-hidden"
        initial={{ backgroundColor: "#000000" }}
        animate={{ backgroundColor: closing ? "#221F29" : "#000000" }}
        transition={{ duration: beat.in + 0.2, ease: [0.4, 0, 0.2, 1] }}
        style={{ pointerEvents: exiting ? "none" : "auto" }}
      >
        {/* poster is painted instantly, under the video */}
        <img
          src={introPoster.url}
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
          style={{ opacity: closing ? 0 : 1, transition: "opacity 300ms ease" }}
        />

        <motion.video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain"
          autoPlay
          muted
          playsInline
          preload="auto"
          poster={introPoster.url}
          initial={{ opacity: 0 }}
          animate={{ opacity: closing ? 0 : 1 }}
          transition={{ duration: closing ? beat.in * 0.7 : 0.45, ease: "easeInOut" }}
          onError={() => startClosing(true)}
          onEnded={() => startClosing(false)}
        >
          <source src={introWebm.url} type="video/webm" />
          <source src={introMp4.url} type="video/mp4" />
        </motion.video>

        {/* closing composition: ribbon mark, ambient orbs, light sweep */}
        <AnimatePresence>
          {closing && (
            <motion.div
              key="closing"
              className="absolute inset-0"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: exiting ? 0 : 1, y: exiting ? -8 : 0 }}
              transition={{
                duration: exiting ? beat.out : beat.in,
                ease: exiting ? [0.4, 0, 0.2, 1] : "easeOut",
              }}
            >
              {ORBS.map((o, i) => (
                <motion.div
                  key={i}
                  className="orb"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.14 }}
                  transition={{ duration: 0.6, delay: exiting ? 0 : o.delay }}
                  style={{
                    width: o.size,
                    height: o.size,
                    left: o.x,
                    top: o.y,
                    transform: "translate(-50%,-50%)",
                    background: `radial-gradient(circle at 35% 35%, ${o.colors[0]}, ${o.colors[1]} 60%, transparent 72%)`,
                  }}
                />
              ))}

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <motion.img
                    src={mark.url}
                    alt=""
                    draggable={false}
                    className="h-24 w-auto md:h-36"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* running ribbon: spectrum colors flow through the mark, as if the S is being painted */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(115deg, transparent 20%, rgba(255,201,60,0.95) 34%, rgba(232,80,58,0.9) 46%, rgba(47,191,143,0.9) 58%, rgba(124,77,224,0.95) 70%, rgba(214,51,154,0.9) 80%, transparent 92%)",
                      backgroundSize: "280% 280%",
                      WebkitMaskImage: `url(${mark.url})`,
                      maskImage: `url(${mark.url})`,
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                      mixBlendMode: "screen",
                      animation: "ribbon-flow 2.4s linear infinite",
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        <AnimatePresence>
          {showSkip && !closing && (
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
