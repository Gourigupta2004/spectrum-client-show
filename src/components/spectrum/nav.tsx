import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import logoLight from "@/assets/spectrum-logo-light.png.asset.json";
import mark from "@/assets/spectrum-mark.png.asset.json";
import { useSelection } from "./selection-context";

const links = [
  { label: "Events", to: "/events" as const },
  { label: "How It Works", to: "/", hash: "how" },
  { label: "Contact", to: "/", hash: "contact" },
];

export function SpectrumNav() {
  const [scrolled, setScrolled] = useState(false);
  const [dim, setDim] = useState(false);
  const [menu, setMenu] = useState(false);
  const { count, openCheckout } = useSelection();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setDim(y > last && y > 140);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{
          y: 0,
          opacity: dim ? 0.6 : 1,
          scale: dim ? 0.94 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <div
          className={`flex items-center gap-6 rounded-full px-4 py-2.5 transition-all duration-500 md:gap-9 md:px-6 ${
            scrolled ? "glass spectrum-border shadow-2xl" : ""
          }`}
        >
          <Link to="/" className="flex shrink-0 items-center" aria-label="Spectrum home">
            <img
              src={logoLight.url}
              alt="Spectrum"
              className="hidden h-6 w-auto md:block"
              draggable={false}
            />
            <img
              src={mark.url}
              alt="Spectrum"
              className="h-6 w-auto md:hidden"
              draggable={false}
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => {
              const active =
                l.to === "/events" ? pathname.startsWith("/events") : pathname === "/" && !l.hash;
              return (
                <Link
                  key={l.label}
                  to={l.to}
                  {...(l.hash ? { hash: l.hash } : {})}
                  className="group relative font-display text-[0.72rem] uppercase tracking-[0.22em] text-foreground/90 transition-colors hover:text-foreground"
                >
                  {l.label}
                  <span
                    className={`spectrum-hairline absolute -bottom-1.5 left-0 w-full origin-left transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <button
            aria-label="Open menu"
            onClick={() => setMenu(true)}
            className="flex items-center gap-1 px-1 md:hidden"
          >
            {[0, 1, 2].map((i) => (
              <span key={i} className="spectrum-fill h-1 w-1 rounded-full" />
            ))}
          </button>

          {count > 0 && (
            <button
              onClick={openCheckout}
              aria-label={`${count} moments selected`}
              className="spectrum-fill flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
            >
              {count}
            </button>
          )}
        </div>
      </motion.nav>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-10 bg-surface/95 backdrop-blur-2xl"
          >
            <button
              onClick={() => setMenu(false)}
              aria-label="Close menu"
              className="absolute right-6 top-6 text-3xl leading-none text-foreground"
            >
              ×
            </button>
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                {...(l.hash ? { hash: l.hash } : {})}
                onClick={() => setMenu(false)}
                className="group relative font-display text-3xl text-foreground"
              >
                {l.label}
                <span className="spectrum-hairline absolute -bottom-2 left-0 w-full scale-x-0 transition-transform duration-300 group-active:scale-x-100" />
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
