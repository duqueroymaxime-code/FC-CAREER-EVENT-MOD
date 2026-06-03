import React from 'react';
import Card from './Card';

/**
 * Vue de l'historique
 * @param {Object} career - Carrière
 */
export default function HistoryView({ career }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <h2 className="text-2xl font-black">Décisions</h2>
        {career.decisions.length ? (
          career.decisions.map(decision => (
            <p key={decision.id} className="mt-3 rounded-2xl bg-white/5 p-3">
              S{decision.week} • {decision.event} → <b>{decision.choice}</b>
            </p>
          ))
        ) : (
          <p className="mt-3 text-slate-300">Aucune décision.</p>
        )}
      </Card>
      <Card>
        <h2 className="text-2xl font-black">Blessures</h2>
        {career.injuries.length ? (
          career.injuries.map(injury => (
            <p key={injury.id} className="mt-3 rounded-2xl bg-red-400/10 p-3">
              {injury.player} • {injury.type} • {injury.weeks} semaines
            </p>
          ))
        ) : (
          <p className="mt-3 text-slate-300">Aucune blessure.</p>
        )}
      </Card>
    </div>
  );
}