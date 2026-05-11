import React from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// GRADIENT THEME MAP
// Each color key maps to a unique radial gradient palette,
// icon background, and text accent color.
// ─────────────────────────────────────────────────────────────
const THEME = {
  blue: {
    gradient: "from-blue-400/15 via-indigo-300/5 to-transparent",
    iconBg: "from-blue-500 to-indigo-600",
    iconShadow: "shadow-blue-500/25",
    countColor: "text-blue-700 dark:text-blue-300",
  },
  amber: {
    gradient: "from-amber-400/15 via-orange-300/5 to-transparent",
    iconBg: "from-amber-500 to-orange-600",
    iconShadow: "shadow-amber-500/25",
    countColor: "text-amber-700 dark:text-amber-300",
  },
  teal: {
    gradient: "from-teal-400/15 via-emerald-300/5 to-transparent",
    iconBg: "from-teal-500 to-emerald-600",
    iconShadow: "shadow-teal-500/25",
    countColor: "text-teal-700 dark:text-teal-300",
  },
  red: {
    gradient: "from-red-400/15 via-rose-300/5 to-transparent",
    iconBg: "from-red-500 to-rose-600",
    iconShadow: "shadow-red-500/25",
    countColor: "text-red-700 dark:text-red-300",
  },
  green: {
    gradient: "from-green-400/15 via-emerald-300/5 to-transparent",
    iconBg: "from-green-500 to-emerald-600",
    iconShadow: "shadow-green-500/25",
    countColor: "text-green-700 dark:text-green-300",
  },
  violet: {
    gradient: "from-violet-400/15 via-purple-300/5 to-transparent",
    iconBg: "from-violet-500 to-purple-600",
    iconShadow: "shadow-violet-500/25",
    countColor: "text-violet-700 dark:text-violet-300",
  },
  emerald: {
    gradient: "from-emerald-400/15 via-teal-300/5 to-transparent",
    iconBg: "from-emerald-500 to-teal-600",
    iconShadow: "shadow-emerald-500/25",
    countColor: "text-emerald-700 dark:text-emerald-300",
  },
};

/**
 * SummaryCard — Premium neumorphic + glassmorphism stat card
 *
 * @param {Object} props
 * @param {React.ElementType} props.icon      - Lucide icon component
 * @param {number|string}      props.count    - The stat number to display
 * @param {string}             props.label    - Label text below the number
 * @param {string}             props.color    - Theme key from THEME map
 * @param {number}             [props.index]  - Index for staggered animation
 */
export default function SummaryCard({ icon: Icon, count, label, color = "blue", index = 0 }) {
  const t = THEME[color] || THEME.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.21, 0.68, 0.35, 1.0],
      }}
      whileHover={{
        scale: 1.04,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      className="group relative cursor-default"
    >
      {/* ── Outer Card Shell ── */}
      <div
        className={[
          // Glassmorphism base
          "relative overflow-hidden rounded-[28px]",
          "bg-white/50 dark:bg-slate-900/50",
          "backdrop-blur-xl",
          // Neumorphic depth
          "shadow-[6px_6px_16px_rgba(0,0,0,0.06),-6px_-6px_16px_rgba(255,255,255,0.7)]",
          "dark:shadow-[6px_6px_16px_rgba(0,0,0,0.3),-6px_-6px_16px_rgba(255,255,255,0.03)]",
          // Inner shadow (subtle tactile depth)
          "ring-1 ring-white/60 dark:ring-slate-700/40",
          // Hover elevation
          "group-hover:shadow-[8px_8px_24px_rgba(0,0,0,0.10),-8px_-8px_24px_rgba(255,255,255,0.8)]",
          "dark:group-hover:shadow-[8px_8px_28px_rgba(0,0,0,0.45),-8px_-8px_28px_rgba(255,255,255,0.04)]",
          "transition-shadow duration-500 ease-out",
          // Padding & layout
          "p-6 flex items-center gap-5",
        ].join(" ")}
      >
        {/* ── Radial Gradient Accent (background infiltration) ── */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${t.gradient} pointer-events-none`}
        />
        {/* Secondary glow in bottom-right */}
        <div
          className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${t.gradient} opacity-60 blur-2xl pointer-events-none`}
        />

        {/* ── Icon Container ── */}
        <div
          className={[
            "relative z-10 shrink-0",
            "w-14 h-14 rounded-2xl",
            `bg-gradient-to-br ${t.iconBg}`,
            `shadow-lg ${t.iconShadow}`,
            "flex items-center justify-center",
            "group-hover:scale-110 group-hover:rotate-[-3deg]",
            "transition-transform duration-300 ease-out",
          ].join(" ")}
        >
          <Icon className="text-white" size={24} strokeWidth={2.2} />
        </div>

        {/* ── Text Content ── */}
        <div className="relative z-10 min-w-0">
          <p
            className={[
              "text-[2.5rem] leading-none font-extrabold tracking-tight",
              t.countColor,
              "transition-colors duration-300",
            ].join(" ")}
          >
            {count}
          </p>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
