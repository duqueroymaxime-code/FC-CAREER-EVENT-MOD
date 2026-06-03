import React from 'react';

/**
 * Composant pour afficher une illustration d'événement
 * @param {Object} illustration - Objet avec icon, scene, gradient
 * @param {string} title - Titre de la catégorie
 */
export default function IllustrationPanel({ illustration, title }) {
  if (!illustration) {
    return (
      <div className="min-h-[260px] rounded-[2rem] bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
        <p className="text-4xl">⚽</p>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-[260px] overflow-hidden rounded-[2rem] bg-gradient-to-br ${illustration.gradient}`}
    >
      {/* Effets de lumière pour le gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.45),transparent_18%),radial-gradient(circle_at_80%_70%,rgba(0,0,0,.24),transparent_28%)]" />

      {/* Contenu */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-slate-950">
        <p className="text-6xl">{illustration.icon}</p>
        <h3 className="mt-3 text-3xl font-black">{title}</h3>
        <p className="mt-2 max-w-xl text-sm font-bold opacity-80">
          {illustration.scene}
        </p>
      </div>
    </div>
  );
}