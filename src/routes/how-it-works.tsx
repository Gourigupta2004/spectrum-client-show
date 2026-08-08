import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Camera, Images, Download, ChevronDown, ArrowLeft } from "lucide-react";
import { Orb } from "@/components/spectrum/orb";
import { IMG, pick } from "@/lib/spectrum-data";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Spectrum Event Photography" },
      {
        name: "description",
        content:
          "See how Spectrum covers your school or college event: we shoot, you browse the gallery, and you own every moment you pick.",
      },
      { property: "og:title", content: "How It Works — Spectrum" },
      {
        property: "og:description",
        content: "We shoot, you browse, you own it — the Spectrum event photography process.",
      },
    ],
  }),
  component: HowItWorksPage,
});

const steps = [
  {
    n: "01",
    icon: Camera,
    title: "We Shoot",
    body: "Our crew arrives hours before the first cue — scouting angles, lighting the stage, and mapping the run-of-show with your coordinators. Two to four photographers and a videographer cover every act, from the lamp lighting to the final confetti burst, so nothing memorable happens off-camera.",
    image: IMG(pick(4), 700, 520),
  },
  {
    n: "02",
    icon: Images,
    title: "You Browse",
    body: "Within 48 hours your event goes live as a private gallery, split into named moments — Solo Dance, Award Distribution, Backstage Candids. Every frame is colour-graded and watermarked for preview, so parents and students can browse comfortably on any phone before deciding what they want.",
    image: IMG(pick(11), 700, 520),
  },
  {
    n: "03",
    icon: Download,
    title: "You Own It",
    body: "Pick single moments or grab the full album bundle. Pay once and the clean, full-resolution, watermark-free files land in your WhatsApp or inbox within minutes — yours to print, share and keep forever, with no expiry on your download link.",
    image: IMG(pick(13), 700, 520),
  },
];

const faqs = [
  {
    q: "How soon are photos available after the event?",
    a: "Your private gallery goes live within 48 hours of the event wrapping. Large multi-day fests can take up to 72 hours for the full set.",
  },
  {
    q: "How are the final files delivered?",
    a: "Instantly after checkout, over WhatsApp or email — whichever you choose. You receive full-resolution JPEGs with no watermark and no expiry on the link.",
  },
  {
    q: "What does it cost?",
    a: "Individual moments start at ₹29 each. The full album bundle for an event is ₹299 — usually the better value once you want more than ten moments.",
  },
  {
    q: "Can our institution book a coverage date?",
    a: "Yes. Reach out through the contact page with your event date and venue, and we'll confirm a crew and a coverage plan.",
  },
];

function HowItWorksPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="grain relative min-h-screen overflow-x-clip pb-24 pt-28">
      <Orb className="left-[-10%] top-16" colors={["#7C4DE0", "#D6339A"]} size={560} opacity={0.1} />
      <Orb
        className="right-[-12%] top-[60%]"
        colors={["#FFC93C", "#2FBF8F"]}
        size={520}
        opacity={0.08}
        delay={2}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 font-display text-4xl font-semibold leading-tight text-foreground md:text-6xl"
        >
          How Spectrum <span className="spectrum-text">Works</span>
        </motion.h1>
        <p className="mt-4 max-w-2xl text-base font-medium text-muted-foreground">
          Three simple steps between your event and a set of photographs your students will keep for
          decades.
        </p>

        <div className="mt-16 space-y-14">
          {steps.map((s, i) => (
            <motion.section
              key={s.n}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className={`grid items-center gap-8 md:grid-cols-2 ${
                i % 2 === 1 ? "md:[&>figure]:order-first" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-4">
                  <span className="spectrum-border-thick grid h-14 w-14 place-items-center rounded-full">
                    <s.icon className="h-6 w-6 text-foreground" />
                  </span>
                  <span className="font-display text-3xl font-semibold text-muted-foreground">
                    {s.n}
                  </span>
                </div>
                <h2 className="mt-5 font-display text-2xl font-semibold text-foreground md:text-3xl">
                  {s.title}
                </h2>
                <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground md:text-base">
                  {s.body}
                </p>
              </div>
              <figure className="spectrum-border overflow-hidden rounded-3xl">
                <img
                  src={s.image}
                  alt={`${s.title} — Spectrum event photography`}
                  loading="lazy"
                  draggable={false}
                  className="h-64 w-full object-cover md:h-72"
                />
              </figure>
            </motion.section>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Frequently Asked
          </h2>
          <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface/60">
            {faqs.map((f, i) => (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground"
                >
                  {f.q}
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-teal transition-transform ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open === i && (
                  <p className="px-5 pb-5 text-sm font-medium leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/events"
            className="spectrum-fill inline-flex rounded-full px-8 py-3.5 text-sm font-semibold"
          >
            Browse Events →
          </Link>
        </div>
      </div>
    </div>
  );
}
