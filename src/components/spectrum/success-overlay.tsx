import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

export function SuccessOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[90] grid place-items-center overflow-hidden bg-background px-6 text-center"
    >
      {[0, 1.6, 3.2].map((d) => (
        <span
          key={d}
          aria-hidden
          className="absolute h-[380px] w-[380px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(247,194,31,0.35), rgba(139,92,246,0.25) 45%, transparent 70%)",
            animation: `burst-pulse 4.8s ease-out ${d}s infinite`,
          }}
        />
      ))}

      <div className="relative">
        <div className="spectrum-fill mx-auto grid h-20 w-20 place-items-center rounded-full">
          <svg viewBox="0 0 52 52" className="h-10 w-10">
            <path
              d="M14 27l8 8 16-17"
              fill="none"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="48"
              strokeDashoffset="48"
              style={{ animation: "draw-check 0.8s ease-out 0.25s forwards" }}
            />
          </svg>
        </div>
        <h2 className="mt-8 font-display text-3xl text-foreground md:text-4xl">
          Your Memories Are On Their Way.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-foreground">
          We're sending your full-resolution photos to your WhatsApp right now. Check your
          messages in a while.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Didn't receive? Contact us at support@spectrum.in
        </p>
        <Link
          to="/events"
          onClick={onClose}
          className="mt-8 inline-block border-b border-transparent text-sm text-foreground transition-colors hover:border-teal"
        >
          Back to Events
        </Link>
      </div>
    </motion.div>
  );
}
