import React from 'react';
import Card from './Card';
import Pill from './Pill';
import StatTile from './StatTile';
import Bar from './Bar';
import { money } from '../utils/utils';

/**
 * Tableau de bord pour le mode Manager
 * @param {Object} career - Carrière
 */
export default function Dashboard({ career }) {
  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {/* Hub principal */}
      <Card className="xl:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black">Central Hub</h2>
          <Pill tone="cyan">Semaine {career.week}</Pill>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatTile label="Moral" value={career.morale} accent="lime" />
          <StatTile label="Réputation" value={career.reputation} accent="cyan" />
          <StatTile label="Pression" value={career.pressure} accent="amber" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Bar label="Cohésion" value={career.cohesion} />
          <Bar label="Direction" value={career.boardTrust} />
          <Bar label="Popularité" value={career.popularity} />
          <Bar label="Développement" value={career.development} />
        </div>
      </Card>

      {/* Informations du club */}
      <Card>
        <div className="flex items-center gap-4">
          <ClubBadge club={career.club} />
          <div>
            <h2 className="text-2xl font-black">{career.club.name}</h2>
            <p className="text-slate-300">{career.club.league}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <StatTile label="Budget" value={money(career.budget)} />
          <StatTile label="Board" value={career.boardTrust} accent="violet" />
        </div>
        <p className="mt-5 rounded-2xl bg-black/20 p-4 text-sm text-slate-300">
          Objectif : <b className="text-white">{career.customObjective}</b>
        </p>
      </Card>
    </div>
  );
  {career.type === "player" ? (
  <div className="card media">
    <Kicker tone="cyan">Player Career</Kicker>
    <h2>Marché personnel</h2>
    <p className="muted">
      Des clubs peuvent s’intéresser à ton profil selon ta forme, ta réputation
      et ton temps de jeu.
    </p>

    <div className="grid-2" style={{ marginTop: 14 }}>
      <div className="card">
        <h3>Rumeur de transfert</h3>
        <p>
          Un recruteur de <b>Arsenal</b> suit tes performances et estime que ton
          profil peut exploser dans un championnat plus intense.
        </p>
      </div>

      <div className="card">
        <h3>Message d’un cadre rival</h3>
        <p>
          Une star adverse déclare en interview : “Avec son potentiel, il devrait
          viser un club qui joue plus haut.”
        </p>
      </div>
    </div>
  </div>
) : null}
``
}

// Import de ClubBadge (éviter la dépendance circulaire)
import ClubBadge from './ClubBadge';