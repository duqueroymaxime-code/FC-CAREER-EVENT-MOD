import React from 'react';
import Card from './Card';
import Pill from './Pill';
import StatTile from './StatTile';
import Bar from './Bar';

/**
 * Tableau de bord pour le mode Joueur
 * @param {Object} career - Carrière du joueur
 */
export default function PlayerDashboard({ career }) {
  const { playerCareer } = career;

  // Calculer les stats récentes
  const recentMatches = playerCareer.history.slice(-5);
  const avgRating = recentMatches.length > 0
    ? recentMatches.reduce((sum, match) => sum + match.rating, 0) / recentMatches.length
    : playerCareer.averageRating;

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {/* Stats principales */}
      <Card className="xl:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black">Ma Carrière</h2>
          <Pill tone="lime">{playerCareer.position}</Pill>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatTile label="OVR" value={playerCareer.overall} accent="lime" />
          <StatTile label="Potentiel" value={playerCareer.potential} accent="cyan" />
          <StatTile label="Buts" value={playerCareer.goals} accent="violet" />
          <StatTile label="Passes" value={playerCareer.assists} accent="amber" />
          <StatTile label="Matchs" value={playerCareer.appearances} accent="green" />
          <StatTile label="Note Moy." value={avgRating.toFixed(1)} accent="blue" />
          <StatTile label="Followers" value={playerCareer.followers.toLocaleString("fr-FR")} accent="purple" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Bar label="Relation Coach" value={playerCareer.coachRelation} />
          <Bar label="Confiance Agent" value={playerCareer.agentTrust} />
          <Bar label="Marque Perso" value={playerCareer.personalBrand} />
          <Bar label="Envie de Transfert" value={playerCareer.transferDesire} />
          <Bar label="Forme" value={playerCareer.form} />
          <Bar label="Fatigue" value={playerCareer.fatigue} />
        </div>
      </Card>

      {/* Club actuel */}
      <Card>
        <div className="flex items-center gap-4">
          <div
            className="h-16 w-16 grid place-items-center rounded-2xl border border-white/20 text-sm font-black text-white shadow-xl"
            style={{ background: `linear-gradient(135deg, ${career.club.colors[0]}, ${career.club.colors[1]})` }}
          >
            {career.club.name.split(" ").map(word => word[0]).slice(0, 2).join("")}
          </div>
          <div>
            <h2 className="text-2xl font-black">{career.club.name}</h2>
            <p className="text-slate-300">{career.club.league}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <StatTile label="Salaire" value={`${playerCareer.salary}K€/an`} />
          <StatTile label="Contrat" value={`${playerCareer.contract} an(s)`} />
        </div>
        <p className="mt-5 rounded-2xl bg-black/20 p-4 text-sm text-slate-300">
          Objectif : <b className="text-white">{career.customObjective}</b>
        </p>
      </Card>
    </div>
  );
}