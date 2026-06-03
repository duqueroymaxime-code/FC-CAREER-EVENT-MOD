import React from 'react';

/**
 * Composant de badge de club
 * @param {Object} club - Club
 * @param {string} size - Taille (sm ou lg)
 */
export default function ClubBadge({ club, size = "lg" }) {
  const dimensions = size === "sm" ? "h-10 w-10" : "h-16 w-16";
  const initials = club.name.split(" ").map(word => word[0]).slice(0, 2).join("");

  return (
    <div
      className={`${dimensions} grid place-items-center rounded-2xl border border-white/20 text-sm font-black text-white shadow-xl`}
      style={{ background: `linear-gradient(135deg, ${club.colors[0]}, ${club.colors[1]})` }}
    >
      {initials}
    </div>
  );
}