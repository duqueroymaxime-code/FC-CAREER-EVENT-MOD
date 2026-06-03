import React from 'react';
import { clamp } from '../utils/utils';

/**
 * Composant de barre de progression
 * @param {string} label - Libellé de la barre
 * @param {number} value - Valeur de la barre (0-100)
 * @param {string} className - Classes CSS supplémentaires
 */
export default function Bar({ label, value, className = "" }) {
  return (
    <div className={className}>
      <div className="mb-1 flex justify-between text-sm text-slate-300">
        <span>{label}</span>
        <b>{value}</b>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-lime-300 to-cyan-300"
          style={{ width: `${clamp(value)}%` }}
        />
      </div>
    </div>
  );
}