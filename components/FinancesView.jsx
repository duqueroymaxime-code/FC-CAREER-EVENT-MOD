import React, { useState } from 'react';
import Card from './Card';
import Pill from './Pill';
import StatTile from './StatTile';
import Bar from './Bar';
import { money, pick } from '../utils/utils';

/**
 * Vue de gestion des finances (mode Manager)
 * @param {Object} career - Carrière
 * @param {Function} setCareer - Fonction pour mettre à jour la carrière
 */
export default function FinancesView({ career, setCareer }) {
  const [transferBudgetInput, setTransferBudgetInput] = useState(career.transferBudget || career.budget * 0.3);
  const [wageBudgetInput, setWageBudgetInput] = useState(career.wageBudget || career.budget * 0.2);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerPosition, setNewPlayerPosition] = useState("BU");
  const [newPlayerOverall, setNewPlayerOverall] = useState(70);
  const [newPlayerSalary, setNewPlayerSalary] = useState(50);
  const [newPlayerValue, setNewPlayerValue] = useState(5);
  const [sellPlayerId, setSellPlayerId] = useState("");
  const [error, setError] = useState("");

  const totalBudget = career.budget + (career.transferBudget || 0) + (career.wageBudget || 0);
  const usedBudget = career.squad.reduce((sum, player) => sum + (player.salary * 0.001), 0); // Convertir en M€
  const availableBudget = totalBudget - usedBudget;

  const handleUpdateBudgets = () => {
    const newCareer = {
      ...career,
      transferBudget: Number(transferBudgetInput),
      wageBudget: Number(wageBudgetInput)
    };
    setCareer(newCareer);
    setError("");
  };

  const handleBuyPlayer = () => {
    if (!newPlayerName || !newPlayerPosition) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (newPlayerValue > career.transferBudget) {
      setError("Budget transfert insuffisant pour ce joueur.");
      return;
    }
    if (newPlayerSalary * 0.001 > career.wageBudget) {
      setError("Budget salarial insuffisant.");
      return;
    }

    const newPlayer = {
      id: uid("player"),
      name: newPlayerName,
      age: Math.floor(18 + Math.random() * 15),
      nationality: pick(["France", "Brésil", "Espagne", "Argentine", "Allemagne"]),
      position: newPlayerPosition,
      overall: newPlayerOverall,
      potential: Math.min(95, newPlayerOverall + 10),
      value: newPlayerValue,
      salary: newPlayerSalary,
      morale: 60,
      form: 50,
      fatigue: 30,
      reputation: newPlayerOverall - 10,
      popularity: newPlayerOverall - 15,
      contract: 3,
      injury: null,
      history: [],
      personality: pick(["Professionnel", "Ambitieux", "Travailleur", "Leader"]),
      club: career.club.name,
      goals: 0,
      assists: 0,
      appearances: 0,
      averageRating: 0
    };

    const newCareer = {
      ...career,
      squad: [...career.squad, newPlayer],
      transferBudget: career.transferBudget - newPlayerValue,
      wageBudget: career.wageBudget - (newPlayerSalary * 0.001)
    };
    setCareer(newCareer);
    setNewPlayerName("");
    setNewPlayerPosition("BU");
    setNewPlayerOverall(70);
    setNewPlayerSalary(50);
    setNewPlayerValue(5);
    setError("");
  };

  const handleSellPlayer = () => {
    if (!sellPlayerId) {
      setError("Veuillez sélectionner un joueur.");
      return;
    }

    const player = career.squad.find(p => p.id === sellPlayerId);
    if (!player) {
      setError("Joueur introuvable.");
      return;
    }

    const newCareer = {
      ...career,
      squad: career.squad.filter(p => p.id !== sellPlayerId),
      transferBudget: career.transferBudget + (player.value * 0.8), // 80% de la valeur (frais de transfert)
      wageBudget: career.wageBudget + (player.salary * 0.001) // Remboursement du salaire
    };
    setCareer(newCareer);
    setSellPlayerId("");
    setError("");
  };

  const POSITIONS = ["GB", "DD", "DC", "DG", "MDC", "MC", "MOC", "AD", "AG", "BU"];

  return (
    <div className="grid gap-5">
      {/* Résumé financier */}
      <Card>
        <h2 className="text-3xl font-black">Finances du Club</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <StatTile label="Budget Total" value={money(totalBudget)} accent="green" />
          <StatTile label="Budget Utilisé" value={money(usedBudget)} accent="red" />
          <StatTile label="Budget Disponible" value={money(availableBudget)} accent="lime" />
          <StatTile label="Budget Transferts" value={money(career.transferBudget || 0)} accent="cyan" />
          <StatTile label="Budget Salaires" value={money(career.wageBudget || 0)} accent="violet" />
        </div>
        <div className="mt-6">
          <Bar label="Utilisation du Budget" value={Math.min((usedBudget / totalBudget) * 100, 100)} />
        </div>
      </Card>

      {/* Gestion des budgets */}
      <Card>
        <h2 className="text-2xl font-black">Répartition du Budget</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-black uppercase tracking-[.22em] text-slate-400">
              Budget Transferts (M€)
            </label>
            <input
              type="number"
              value={transferBudgetInput}
              onChange={(e) => setTransferBudgetInput(e.target.value)}
              min="0"
              max={career.budget}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
            />
          </div>
          <div>
            <label className="text-sm font-black uppercase tracking-[.22em] text-slate-400">
              Budget Salaires (M€)
            </label>
            <input
              type="number"
              value={wageBudgetInput}
              onChange={(e) => setWageBudgetInput(e.target.value)}
              min="0"
              max={career.budget}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
            />
          </div>
        </div>
        <button
          onClick={handleUpdateBudgets}
          className="mt-4 w-full rounded-2xl bg-lime-300 p-4 font-black text-slate-950"
        >
          Mettre à jour les budgets
        </button>
      </Card>

      {/* Achat de joueurs */}
      <Card>
        <h2 className="text-2xl font-black">Acheter un Joueur</h2>
        <p className="mt-2 text-sm text-slate-300">
          Budget disponible : {money(career.transferBudget || 0)} (Transferts) / {money(career.wageBudget || 0)} (Salaires)
        </p>
        {error && <p className="mt-2 text-red-400">{error}</p>}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-black uppercase tracking-[.22em] text-slate-400">
              Nom
            </label>
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Ex: Kylian Mbappé"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
            />
          </div>
          <div>
            <label className="text-sm font-black uppercase tracking-[.22em] text-slate-400">
              Position
            </label>
            <select
              value={newPlayerPosition}
              onChange={(e) => setNewPlayerPosition(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
            >
              {POSITIONS.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-black uppercase tracking-[.22em] text-slate-400">
              Note (OVR)
            </label>
            <input
              type="number"
              value={newPlayerOverall}
              onChange={(e) => setNewPlayerOverall(e.target.value)}
              min="50"
              max="95"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
            />
          </div>
          <div>
            <label className="text-sm font-black uppercase tracking-[.22em] text-slate-400">
              Salaire (K€/an)
            </label>
            <input
              type="number"
              value={newPlayerSalary}
              onChange={(e) => setNewPlayerSalary(e.target.value)}
              min="10"
              max="500"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-black uppercase tracking-[.22em] text-slate-400">
              Valeur (M€)
            </label>
            <input
              type="number"
              value={newPlayerValue}
              onChange={(e) => setNewPlayerValue(e.target.value)}
              min="1"
              max="20"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
            />
          </div>
        </div>
        <button
          onClick={handleBuyPlayer}
          className="mt-4 w-full rounded-2xl bg-cyan-300 p-4 font-black text-slate-950"
        >
          Acheter ce joueur ({money(newPlayerValue)})
        </button>
      </Card>

      {/* Vente de joueurs */}
      <Card>
        <h2 className="text-2xl font-black">Vendre un Joueur</h2>
        {error && <p className="mt-2 text-red-400">{error}</p>}
        <div className="mt-4">
          <label className="text-sm font-black uppercase tracking-[.22em] text-slate-400">
            Sélectionner un joueur
          </label>
          <select
            value={sellPlayerId}
            onChange={(e) => setSellPlayerId(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
          >
            <option value="">-- Sélectionner un joueur --</option>
            {career.squad.map(player => (
              <option key={player.id} value={player.id}>
                {player.name} ({player.position}, OVR {player.overall}, Valeur: {money(player.value)})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSellPlayer}
          className="mt-4 w-full rounded-2xl bg-red-400 p-4 font-black text-white disabled:opacity-50"
          disabled={!sellPlayerId}
        >
          Vendre ce joueur
        </button>
      </Card>
    </div>
  );
}

// Import de uid et pick
import { uid, pick } from '../utils/utils';