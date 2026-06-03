import React from 'react';

/**
 * Composant de carte réutilisable
 * @param {React.ReactNode} children - Contenu de la carte
 * @param {string} className - Classes CSS supplémentaires
 * @param {Function} onClick - Fonction au clic
 * @param {boolean} hoverEffect - Effet de survol (par défaut: true)
 */
export default function Card({ children, className = "", onClick, hoverEffect = true }) {
  return (
    <div
      className={`rounded-[2rem] border border-white/10 bg-white/[.075] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl ${className}`}
      onClick={onClick}
      style={hoverEffect ? { transition: 'transform 0.2s' } : {}}
    >
      {children}
    </div>
  );
}