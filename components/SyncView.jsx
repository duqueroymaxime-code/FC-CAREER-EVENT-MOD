import React, { useState } from 'react';
import Card from './Card';
import Pill from './Pill';
import { showSuccess, showError } from './Notifications';

/**
 * Vue de synchronisation avec FC26
 * @param {Function} onSync - Fonction pour synchroniser
 */
export default function SyncView({ onSync }) {
  const [draft, setDraft] = useState({
    result: "",
    scorers: "",
    injuries: "",
    transfers: "",
    opponent: ""
  });

  const set = (key, value) => setDraft(previous => ({ ...previous, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!draft.result) {
      showError("Veuillez entrer un résultat.");
      return;
    }
    onSync(draft);
    showSuccess("Données synchronisées avec succès !");
    setDraft({
      result: "",
      scorers: "",
      injuries: "",
      transfers: "",
      opponent: ""
    });
  };

  return (
    <Card>
      <h2 className="text-3xl font-black">Synchronisation FC26</h2>
      <p className="mt-2 text-slate-300">
        Entre ton vrai résultat FC26 pour déclencher des conséquences crédibles.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-sm font-black uppercase tracking-[.22em] text-slate-400">
            Résultat
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
            placeholder="Ex: PSG 3-1 OM"
            value={draft.result}
            onChange={(e) => set("result", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-black uppercase tracking-[.22em] text-slate-400">
            Adversaire
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
            placeholder="Ex: OM"
            value={draft.opponent}
            onChange={(e) => set("opponent", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-black uppercase tracking-[.22em] text-slate-400">
            Buteurs
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
            placeholder="Ex: Mbappé 2, Messi 1"
            value={draft.scorers}
            onChange={(e) => set("scorers", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-black uppercase tracking-[.22em] text-slate-400">
            Blessures
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
            placeholder="Ex: Neymar 4 semaines"
            value={draft.injuries}
            onChange={(e) => set("injuries", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-black uppercase tracking-[.22em] text-slate-400">
            Transferts
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white"
            placeholder="Ex: Depay → Atlético"
            value={draft.transfers}
            onChange={(e) => set("transfers", e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="md:col-span-2 mt-4 rounded-2xl bg-lime-300 p-4 font-black text-slate-950"
        >
          Importer depuis FC26
        </button>
      </form>
    </Card>
  );
}