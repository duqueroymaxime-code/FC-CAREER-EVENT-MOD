import React, { useState } from 'react';
import Card from './Card';
import ClubBadge from './ClubBadge';
import Pill from './Pill';
import StatTile from './StatTile';
import { money, CLUB_PRESETS } from '../utils/utils';

/**
 * Sélecteur de club pour créer une nouvelle carrière
 * @param {string} type - Type de carrière ("manager" ou "player")
 * @param {Function} onBack - Fonction pour revenir en arrière
 * @param {Function} onConfirm - Fonction pour confirmer la création
 */
export default function ClubPicker({ type, onBack, onConfirm }) {
  const [selectedName, setSelectedName] = useState(CLUB_PRESETS[0].name);
  const [managerName, setManagerName] = useState(type === "player" ? "Mon Pro" : "Coach");
  const [objective, setObjective] = useState(CLUB_PRESETS[0].objectives);

  const selected = CLUB_PRESETS.find(club => club.name === selectedName) || CLUB_PRESETS[0];

  function chooseClub(club) {
    setSelectedName(club.name);
    setObjective(club.objectives);
  }

  return (
    <div className="min-h-screen bg-[#080b12] p-5 text-white">
      <div className="mx-auto max-w-7xl py-8">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-white/10 bg-white/10 px-5 py-2 font-black"
        >
          ← Retour
        </button>
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Pill tone="lime">Club Select</Pill>
            <h1 className="mt-4 text-5xl font-black">
              Créer une carrière {type === "player" ? "Joueur" : "Manager"}
            </h1>
            <p className="mt-2 text-slate-300">
              Choisis un club, un nom et un objectif. La carrière générera ensuite des événements liés au contexte.
            </p>
          </div>
          <ClubBadge club={selected} />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CLUB_PRESETS.map(club => (
            <button
              key={club.name}
              type="button"
              onClick={() => chooseClub(club)}
              className={`rounded-[2rem] border p-5 text-left transition hover:scale-[1.01] ${
                selected.name === club.name ? "border-lime-300 bg-lime-300/10" : "border-white/10 bg-white/[.06]"
              }`}
            >
              <ClubBadge club={club} size="sm" />
              <h2 className="mt-4 text-2xl font-black">{club.name}</h2>
              <p className="mt-1 text-sm text-slate-300">
                {club.league} • {club.country}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <span>Budget <b>{money(club.budget)}</b></span>
                <span>Rép. <b>{club.reputation}</b></span>
              </div>
            </button>
          ))}
        </div>
        <Card className="mt-6 border-lime-300/20">
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="text-xs font-black uppercase tracking-[.22em] text-slate-400">
                {type === "player" ? "Nom du joueur" : "Nom du coach"}
              </span>
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none focus:border-lime-300"
                value={managerName}
                onChange={event => setManagerName(event.target.value)}
              />
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-[.22em] text-slate-400">
                Objectif personnalisé
              </span>
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none focus:border-lime-300"
                value={objective}
                onChange={event => setObjective(event.target.value)}
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => onConfirm(type, selected, { managerName, objective })}
            className="mt-5 rounded-2xl bg-lime-300 px-6 py-4 font-black text-slate-950"
          >
            Commencer avec {selected.name}
          </button>
        </Card>
      </div>
    </div>
  );
}