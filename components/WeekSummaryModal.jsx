import React from 'react';
import Card from './Card';
import Pill from './Pill';

/**
 * Modal de résumé de semaine
 * @param {Object} summary - Résumé de la semaine
 * @param {Function} onClose - Fonction pour fermer la modal
 * @param {Function} onOpenEvent - Fonction pour ouvrir l'événement
 */
export default function WeekSummaryModal({ summary, onClose, onOpenEvent }) {
  if (!summary) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xl">
      <Card className="w-full max-w-2xl border-lime-300/30">
        <Pill tone="green">Résumé de semaine</Pill>
        <h2 className="mt-4 text-4xl font-black">Semaine {summary.week}</h2>
        <p className="mt-3 text-xl">{summary.result}</p>
        {summary.eventTitle && (
          <p className="mt-3 rounded-2xl bg-black/25 p-4 text-slate-300">
            Nouvel événement : <b className="text-white">{summary.eventTitle}</b> ({summary.rarity})
          </p>
        )}
        {summary.scorerName && (
          <p className="mt-2 text-slate-300">Buteur notable : {summary.scorerName}</p>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpenEvent}
            className="rounded-2xl bg-lime-300 px-5 py-3 font-black text-slate-950"
          >
            Voir l’événement
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-white/10 px-5 py-3 font-black text-white"
          >
            Fermer
          </button>
        </div>
      </Card>
    </div>
  );
}