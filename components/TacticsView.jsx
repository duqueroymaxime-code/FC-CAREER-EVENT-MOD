import React, { useState } from 'react';
import Card from './Card';
import Pill from './Pill';
import StatTile from './StatTile';
import { pick } from '../utils/utils';

const FORMATIONS = [
  { id: "4-4-2", name: "4-4-2", description: "Équilibre parfait entre attaque et défense.", impact: { attack: 0, defense: 0, possession: 0 } },
  { id: "4-3-3", name: "4-3-3", description: "Attaque agressive avec des ailiers rapides.", impact: { attack: +10, defense: -5, possession: +5 } },
  { id: "3-5-2", name: "3-5-2", description: "Contrôle du milieu avec 5 milieux.", impact: { attack: +5, defense: +5, possession: +10 } },
  { id: "5-3-2", name: "5-3-2", description: "Défense solide avec 5 défenseurs.", impact: { attack: -10, defense: +15, possession: -5 } },
  { id: "4-2-3-1", name: "4-2-3-1", description: "Flexibilité et polyvalence.", impact: { attack: +8, defense: +2, possession: +7 } }
];

const STYLES = [
  { id: "possession", name: "Jeu de possession", description: "Garde le ballon et fais circuler.", impact: { possession: +20, attack: +5, fatigue: +10 } },
  { id: "counter", name: "Contre-attaque", description: "Défends et attaque rapidement.", impact: { possession: -10, attack: +15, fatigue: +5 } },
  { id: "direct", name: "Jeu direct", description: "Longues passes vers l’avant.", impact: { possession: -15, attack: +10, fatigue: 0 } },
  { id: "pressing", name: "Pression haute", description: "Pressionne l’adversaire haut sur le terrain.", impact: { possession: +5, defense: +10, fatigue: +15 } },
  { id: "defensive", name: "Bloc bas", description: "Défense compacte et contre-attaques rapides.", impact: { possession: -5, defense: +15, fatigue: -5 } }
];

const POSITIONS = ["GB", "DD", "DC", "DG", "MDC", "MC", "MOC", "AD", "AG", "BU"];
const ROLES = ["default", "captain", "freeRole", "stayBack", "getForward"];
const BEHAVIORS = ["normal", "aggressive", "defensive", "creative"];

/**
 * Vue de gestion des tactiques (mode Manager)
 * @param {Object} career - Carrière
 * @param {Function} setCareer - Fonction pour mettre à jour la carrière
 */
export default function TacticsView({ career, setCareer }) {
  const [formation, setFormation] = useState(career.tactics?.formation || "4-4-2");
  const [style, setStyle] = useState(career.tactics?.style || "possession");
  const [intensity, setIntensity] = useState(career.tactics?.intensity || 70);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [playerRole, setPlayerRole] = useState("default");
  const [playerBehavior, setPlayerBehavior] = useState("normal");

  const selectedFormation = FORMATIONS.find(f => f.id === formation);
  const selectedStyle = STYLES.find(s => s.id === style);

  const totalImpact = {
    attack: (selectedFormation?.impact.attack || 0) + (selectedStyle?.impact.attack || 0) + Math.floor((intensity - 50) / 5),
    defense: (selectedFormation?.impact.defense || 0) + (selectedStyle?.impact.defense || 0) + Math.floor((100 - intensity) / 5),
    possession: (selectedFormation?.impact.possession || 0) + (selectedStyle?.impact.possession || 0) + Math.floor((intensity - 50) / 10),
    fatigue: (selectedStyle?.impact.fatigue || 0) + Math.floor(intensity / 10)
  };

  const handleSave = () => {
    const newTactics = {
      formation,
      style,
      intensity,
      instructions: {}
    };

    // Ajouter les consignes individuelles si un joueur est sélectionné
    if (selectedPlayerId) {
      newTactics.instructions = {
        ...career.tactics?.instructions,
        [selectedPlayerId]: { role: playerRole, behavior: playerBehavior }
      };
    }

    const newCareer = {
      ...career,
      tactics: newTactics
    };
    setCareer(newCareer);
  };

  const handleSelectPlayer = (playerId) => {
    setSelectedPlayerId(playerId);
    const playerInstructions = career.tactics?.instructions?.[playerId];
    setPlayerRole(playerInstructions?.role || "default");
    setPlayerBehavior(playerInstructions?.behavior || "normal");
  };

  return (
    <div className="grid gap-5">
      {/* Résumé tactique */}
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black">Tactiques</h2>
          <div className="flex gap-2">
            <Pill tone="lime">ATK: {totalImpact.attack > 0 ? "+" : ""}{totalImpact.attack}</Pill>
            <Pill tone="cyan">DEF: {totalImpact.defense > 0 ? "+" : ""}{totalImpact.defense}</Pill>
            <Pill tone="violet">POS: {totalImpact.possession > 0 ? "+" : ""}{totalImpact.possession}</Pill>
            <Pill tone="amber">FAT: {totalImpact.fatigue > 0 ? "+" : ""}{totalImpact.fatigue}%</Pill>
          </div>
        </div>
        <p className="mt-2 text-slate-300">
          Impact estimé sur ton prochain match.
        </p>
      </Card>

      {/* Formation */}
      <Card>
        <h2 className="text-2xl font-black">Formation</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {FORMATIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormation(f.id)}
              className={`rounded-2xl border p-4 text-left transition hover:scale-[1.01] ${
                formation === f.id ? "border-lime-300 bg-lime-300/10" : "border-white/10 bg-white/[.06]"
              }`}
            >
              <h4 className="text-xl font-black">{f.name}</h4>
              <p className="mt-1 text-sm text-slate-300">{f.description}</p>
              <div className="mt-2 flex gap-2 text-xs">
                <span className={f.impact.attack > 0 ? "text-lime-300" : "text-red-400"}>
                  ATK: {f.impact.attack > 0 ? "+" : ""}{f.impact.attack}
                </span>
                <span className={f.impact.defense > 0 ? "text-lime-300" : "text-red-400"}>
                  DEF: {f.impact.defense > 0 ? "+" : ""}{f.impact.defense}
                </span>
                <span className={f.impact.possession > 0 ? "text-lime-300" : "text-red-400"}>
                  POS: {f.impact.possession > 0 ? "+" : ""}{f.impact.possession}
                </span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Style de jeu */}
      <Card>
        <h2 className="text-2xl font-black">Style de Jeu</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`rounded-2xl border p-4 text-left transition hover:scale-[1.01] ${
                style === s.id ? "border-cyan-300 bg-cyan-300/10" : "border-white/10 bg-white/[.06]"
              }`}
            >
              <h4 className="text-xl font-black">{s.name}</h4>
              <p className="mt-1 text-sm text-slate-300">{s.description}</p>
              <div className="mt-2 flex gap-2 text-xs">
                <span className={s.impact.attack > 0 ? "text-lime-300" : "text-red-400"}>
                  ATK: {s.impact.attack > 0 ? "+" : ""}{s.impact.attack}
                </span>
                <span className={s.impact.defense > 0 ? "text-lime-300" : "text-red-400"}>
                  DEF: {s.impact.defense > 0 ? "+" : ""}{s.impact.defense}
                </span>
                <span className={s.impact.possession > 0 ? "text-lime-300" : "text-red-400"}>
                  POS: {s.impact.possession > 0 ? "+" : ""}{s.impact.possession}
                </span>
                <span className={s.impact.fatigue > 0 ? "text-red-400" : "text-lime-300"}>
                  FAT: {s.impact.fatigue > 0 ? "+" : ""}{s.impact.fatigue}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Intensité */}
      <Card>
        <h2 className="text-2xl font-black">Intensité ({intensity}%)</h2>
        <input
          type="range"
          min="0"
          max="100"
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          className="mt-2 w-full"
        />
        <div className="flex justify-between text-sm text-slate-300 mt-1">
          <span>Défensif</span>
          <span>Équilibré</span>
          <span>Offensif</span>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Influence : +{Math.floor((intensity - 50) / 5)} ATK / +{Math.floor((100 - intensity) / 5)} DEF / +{Math.floor(intensity / 10)}% Fatigue
        </p>
      </Card>

      {/* Consignes individuelles */}
      <Card>
        <h2 className="text-2xl font-black">Consignes Individuelles</h2>
        <p className="mt-1 text-sm text-slate-300">
          Sélectionne un joueur pour lui donner des instructions spécifiques.
        </p>
        <div className="mt-4">
          <select
            value={selectedPlayerId || ""}
            onChange={(e) => handleSelectPlayer(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
          >
            <option value="">-- Sélectionner un joueur --</option>
            {career.squad.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} ({player.position}, OVR {player.overall})
              </option>
            ))}
          </select>
        </div>
        {selectedPlayerId && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-black uppercase tracking-[.22em] text-slate-400">
                Rôle
              </label>
              <select
                value={playerRole}
                onChange={(e) => setPlayerRole(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-2 text-white"
              >
                {ROLES.map(role => (
                  <option key={role} value={role}>
                    {role === "default" ? "Rôle par défaut" :
                     role === "captain" ? "Capitaine" :
                     role === "freeRole" ? "Libre" :
                     role === "stayBack" ? "Rester en défense" : "Monter"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-black uppercase tracking-[.22em] text-slate-400">
                Comportement
              </label>
              <select
                value={playerBehavior}
                onChange={(e) => setPlayerBehavior(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-2 text-white"
              >
                {BEHAVIORS.map(behavior => (
                  <option key={behavior} value={behavior}>
                    {behavior === "normal" ? "Normal" :
                     behavior === "aggressive" ? "Aggressif" :
                     behavior === "defensive" ? "Défensif" : "Créatif"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <button
          onClick={handleSave}
          className="mt-4 w-full rounded-2xl bg-lime-300 p-4 font-black text-slate-950"
        >
          Enregistrer les tactiques
        </button>
      </Card>
    </div>
  );
}