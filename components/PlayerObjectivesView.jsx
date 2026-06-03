import React from 'react';
import Card from './Card';
import Pill from './Pill';
import Bar from './Bar';

/**
 * Vue des objectifs du joueur
 * @param {Object} career - Carrière du joueur
 */
export default function PlayerObjectivesView({ career }) {
  const { objectives } = career.playerCareer;

  const completedCount = objectives.filter(o => o.progress >= o.target).length;
  const totalCount = objectives.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">Mes Objectifs</h2>
        <Pill tone="cyan">
          {completedCount}/{totalCount} ({progress}%)
        </Pill>
      </div>

      <div className="mt-4 h-2 rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-lime-300 to-cyan-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-5 grid gap-3">
        {objectives.map((objective) => {
          const isCompleted = objective.progress >= objective.target;
          const progressPercent = Math.min((objective.progress / objective.target) * 100, 100);

          return (
            <div
              key={objective.id}
              className={`rounded-2xl p-4 transition hover:scale-[1.01] ${
                isCompleted ? "bg-lime-300/10 border border-lime-300" : "bg-white/5 border border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black">{objective.description}</h3>
                <Pill tone={isCompleted ? "green" : "slate"}>
                  {isCompleted ? "✓ Complété" : `${objective.progress}/${objective.target}`}
                </Pill>
              </div>
              <div className="mt-2 h-1 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {isCompleted && (
                <p className="mt-2 text-xs text-lime-300">
                  Récompense :{" "}
                  {Object.entries(objective.reward)
                    .map(([key, value]) => `${key}: +${value}`)
                    .join(", ")}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}