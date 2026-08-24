import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import logoLight from "@/assets/spectrum-logo-light.png.asset.json";
import introMp4 from "@/assets/spectrum-intro.mp4.asset.json";
import introWebm from "@/assets/spectrum-intro.webm.asset.json";
import introPoster from "@/assets/spectrum-intro-poster.jpg.asset.json";
import { useIntro } from "./intro-context";

const FLAG = "spectrum_intro_seen";
const HANDOFF_AT = 7000; // ms into the video
const FAIL_TIMEOUT = 3000;

type Phase = "idle" | "playing" | "handoff" | "done";

export function BrandIntro() {
  const { setNavLogoVisible } = useIntro();
  const [phase, setPhase] = useState<Phase>("idle");
  const [reduced, setReduced] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [tapArmed, setTapArmed] = useState(false);
  const handoffMs = useRef(700);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Decide on mount (client only, avoids hydration mismatch).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(FLAG) === "true") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);
    setNavLogoVisible(false);
    setPhase("playing");
  }, [setNavLogoVisible]);

  const finishedRef = useRef(false);
  const finish = useCallback(
    (ms: number) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      handoffMs.current = ms;
      sessionStorage.setItem(FLAG, "true");
      setNavLogoVisible(true);
      setPhase("handoff");
      window.setTimeout(() => setPhase("done"), ms + 260);
    },
    [setNavLogoVisible],
  );

  // Reduced motion: fast fade from black, no video.
  useEffect(() => {
    if (phase !== "playing" || !reduced) return;
    const t = window.setTimeout(() => finish(400), 60);
    return () => window.clearTimeout(t);
  }, [phase, reduced, finish]);

  // Timers: skip affordance, tap-to-skip arming, hand-off, failure fallback.
  useEffect(() => {
    if (phase !== "playing" || reduced) return;
    const timers = [
      window.setTimeout(() => setShowSkip(true), 1000),
      window.setTimeout(() => setTapArmed(true), 3000),
      window.setTimeout(() => finish(700), HANDOFF_AT),
    ];
    const fail = window.setTimeout(() => {
      const v = videoRef.current;
      if (!v || v.readyState < 2 || v.currentTime < 0.1) finish(300);
    }, FAIL_TIMEOUT);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish(500);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(fail);
      window.removeEventListener("keydown", onKey);
    };
  }, [phase, reduced, finish]);

  if (phase === "idle" || phase === "done") return null;

  const exiting = phase === "handoff";
  const dur = handoffMs.current / 1000;

  return (
    <AnimatePresence>
      <motion.div
        key="brand-intro"
        aria-hidden
        className="grain fixed inset-0 z-[80] overflow-hidden"
        initial={{ backgroundColor: "#000000" }}
        animate={{ backgroundColor: exiting ? "#221F29" : "#000000" }}
        transition={{ duration: dur, ease: [0.4, 0, 0.2, 1] }}
        style={{ pointerEvents: exiting ? "none" : "auto" }}
        onClick={() => tapArmed && finish(500)}
        onWheel={() => tapArmed && finish(500)}
        onTouchStart={() => tapArmed && finish(500)}
      >
        {/* ambient drift orb behind the lockup */}
        <div
          className="orb left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 620,
            height: 620,
            opacity: exiting ? 0 : 0.12,
            transition: "opacity 500ms ease",
            background:
              "radial-gradient(circle at 35% 35%, #7C4DE0, #D6339A 60%, transparent 72%)",
          }}
        />

        {!reduced && (
          <motion.video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            playsInline
            preload="auto"
            poster={introPoster.url}
            animate={{ opacity: exiting ? 0 : 1 }}
            transition={{ duration: dur * 0.6, ease: "easeInOut" }}
            onError={() => finish(300)}
            onEnded={() => finish(500)}
          >
            <source src={introWebm.url} type="video/webm" />
            <source src={introMp4.url} type="video/mp4" />
          </motion.video>
        )}

        {/* contained flare: subtle vignette on the stage edges */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* the logo that morphs into the nav pill */}
        {!exiting && (
          <motion.img
            layoutId="spectrum-navlogo"
            src={logoLight.url}
            alt=""
            draggable={false}
            className="absolute left-1/2 top-1/2 h-16 w-auto -translate-x-1/2 -translate-y-1/2 md:h-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: reduced ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        <AnimatePresence>
          {showSkip && !exiting && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                finish(500);
              }}
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
