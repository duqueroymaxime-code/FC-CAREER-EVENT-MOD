import React from 'react';
import Card from './Card';

/**
 * Vue des analytiques
 * @param {Object} career - Carrière
 */
export default function AnalyticsView({ career }) {
  const maxBudget = Math.max(...career.analytics.map(item => item.budget), 1);

  return (
    <Card>
      <h2 className="text-3xl font-black">Analytiques</h2>
      <div className="mt-3 flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="h-2 w-4 rounded bg-cyan-300" /> Budget
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-4 rounded bg-violet-300" /> Moral
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-4 rounded bg-emerald-300" /> Réputation
        </span>
      </div>
      <div className="mt-5 space-y-4">
        {career.analytics.slice(-12).map(item => (
          <div key={item.week} className="grid grid-cols-[90px_1fr] items-center gap-3">
            <span className="text-sm text-slate-300">S{item.week}</span>
            <div className="space-y-1">
              <div
                className="h-2 rounded bg-cyan-300"
                style={{ width: `${(item.budget / maxBudget) * 100}%` }}
              />
              <div
                className="h-2 rounded bg-violet-300"
                style={{ width: `${item.morale}%` }}
              />
              <div
                className="h-2 rounded bg-emerald-300"
                style={{ width: `${item.reputation}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}