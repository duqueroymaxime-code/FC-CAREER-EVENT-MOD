import React from 'react';

/**
 * Composant de tuile de statistique
 * @param {string} label - Libellé de la statistique
 * @param {number|string} value - Valeur de la statistique
 * @param {string} accent - Couleur d'accent (lime, violet, cyan, amber, green, blue, purple)
 */
export default function StatTile({ label, value, accent = "cyan" }) {
  const color = accent === "lime" ? "text-lime-300" :
               accent === "violet" ? "text-violet-300" :
               accent === "amber" ? "text-amber-300" :
               accent === "green" ? "text-emerald-300" :
               accent === "blue" ? "text-blue-300" :
               accent === "purple" ? "text-purple-300" :
               "text-cyan-300";

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-black uppercase tracking-[.22em] text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-black ${color}`}>{value}</p>
    </div>
  );
}