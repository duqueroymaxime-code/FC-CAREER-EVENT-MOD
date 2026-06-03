import React, { useState } from 'react';
import Card from './Card';
import Pill from './Pill';
import StatTile from './StatTile';
import Bar from './Bar';
import { money, clamp } from '../utils/utils';

/**
 * Vue de l'effectif
 * @param {Object} career - Carrière
 */
export default function SquadView({ career }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("overall");

  const squad = [...career.squad]
    .filter(player =>
      player.name.toLowerCase().includes(query.toLowerCase()) ||
      player.position.includes(query.toUpperCase())
    )
    .sort((a, b) => {
      if (sort === "age") return a.age - b.age;
      if (sort === "value") return b.value - a.value;
      if (sort === "form") return b.form - a.form;
      return b.overall - a.overall;
    });

  return (
    <div>
      <div className="mb-5 grid gap-3 md:grid-cols-2">
        <input
          className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
          placeholder="Filtrer par nom ou poste"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <select
          className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
          value={sort}
          onChange={event => setSort(event.target.value)}
        >
          <option value="overall">Trier par OVR</option>
          <option value="age">Trier par âge</option>
          <option value="value">Trier par valeur</option>
          <option value="form">Trier par forme</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {squad.map(player => (
          <Card key={player.id}>
            <div className="flex justify-between">
              <h3 className="text-xl font-black">{player.name}</h3>
              <Pill>{player.position}</Pill>
            </div>
            <p className="mt-1 text-sm text-slate-300">
              {player.age} ans • {player.nationality} • {player.personality}
            </p>
            {player.injury && (
              <p className="mt-2 rounded-xl bg-red-400/20 p-2 text-sm text-red-100">
                Blessé : {player.injury.type} ({player.injury.weeks} sem.)
              </p>
            )}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <StatTile label="OVR" value={player.overall} />
              <StatTile label="POT" value={player.potential} accent="lime" />
              <StatTile label="Valeur" value={money(player.value)} accent="cyan" />
            </div>
            <div className="mt-4 space-y-2">
              <Bar label="Moral" value={player.morale} />
              <Bar label="Forme" value={player.form} />
              <Bar label="Fatigue" value={player.fatigue} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}