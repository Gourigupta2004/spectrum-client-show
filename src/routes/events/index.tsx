import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { EventCard } from "@/components/spectrum/event-card";
import { Orb } from "@/components/spectrum/orb";
import { events, institutions } from "@/lib/spectrum-data";

type Search = { institution?: string };

export const Route = createFileRoute("/events/")({
  validateSearch: (search: Record<string, unknown>): Search =>
    typeof search["institution"] === "string" ? { institution: search["institution"] } : {},
  head: () => ({
    meta: [
      { title: "All Events — Spectrum Event Photography" },
      {
        name: "description",
        content:
          "Browse every school and college event captured by Spectrum — annual days, sports meets, graduations and cultural fests.",
      },
      { property: "og:title", content: "All Events — Spectrum" },
      {
        property: "og:description",
        content: "Browse every school and college event captured by Spectrum.",
      },
    ],
  }),
  component: EventsPage,
});

const filters = ["All", "Schools", "Colleges", "Recent", "Popular"] as const;

function EventsPage() {
  const { institution } = Route.useSearch();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [inst, setInst] = useState<string | undefined>(institution);

  const instObj = institutions.find((i) => i.id === inst);

  const list = events.filter((e) => {
    if (inst && e.institutionId !== inst) return false;
    const type = institutions.find((i) => i.id === e.institutionId)?.type;
    if (filter === "Schools") return type === "school";
    if (filter === "Colleges") return type === "college";
    if (filter === "Recent") return e.tags.includes("recent");
    if (filter === "Popular") return e.tags.includes("popular");
    return true;
  });

  return (
    <div className="grain relative min-h-screen overflow-x-clip pb-24 pt-28">
      <Orb
        className="left-[-8%] top-10"
        colors={["#f7c21f", "#e8503a"]}
        size={520}
        opacity={0.09}
      />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Link
          to="/"
          className="text-xs text-muted-foreground transition-colors hover:text-teal"
        >
          ← Home
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 font-display text-4xl text-foreground md:text-5xl"
        >
          All Events
        </motion.h1>

        <div className="no-scrollbar mt-8 flex gap-3 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                if (f === "All") setInst(undefined);
              }}
              className={`spectrum-border shrink-0 rounded-full px-5 py-2 text-xs transition-colors ${
                filter === f && !(f === "All" && inst)
                  ? "bg-violet text-foreground"
                  : "text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
          {instObj && (
            <button
              onClick={() => setInst(undefined)}
              className="spectrum-border shrink-0 rounded-full bg-violet px-5 py-2 text-xs text-foreground"
            >
              {instObj.name} ×
            </button>
          )}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e, i) => (
            <EventCard key={e.slug} event={e} index={i} />
          ))}
        </div>
        {list.length === 0 && (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            No events match this filter.
          </p>
        )}
      </div>
    </div>
  );
}
