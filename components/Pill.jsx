import React from "react";

/**
 * Composant de pilule (badge) réutilisable
 * @param {React.ReactNode} children - Contenu de la pilule
 * @param {string} tone - Ton de la pilule (slate, cyan, violet, green, amber, red, lime)
 */
export default function Pill({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-white/10 text-white ring-white/20",
    cyan: "bg-cyan-300 text-slate-950 ring-cyan-200",
    violet: "bg-violet-300 text-slate-950 ring-violet-200",
    green: "bg-emerald-300 text-slate-950 ring-emerald-200",
    amber: "bg-amber-300 text-slate-950 ring-amber-200",
    red: "bg-red-400 text-white ring-red-300",
    lime: "bg-lime-300 text-slate-950 ring-lime-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ring-1 ${
        tones[tone] || tones.slate
      }`}
    >
      {children}
    </span>
  );
}