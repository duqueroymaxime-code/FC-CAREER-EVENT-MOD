import React from "react";
import Pill from "./Pill";

/**
 * Page d'accueil
 * @param {Function} onChooseType - Fonction pour choisir le type de carrière
 */
export default function Home({ onChooseType }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#080b12] text-white">
      {/* Fond avec dégradés */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(190,255,0,.25),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(0,214,255,.22),transparent_30%),linear-gradient(135deg,#080b12,#101827_45%,#05070b)]" />

      {/* Contenu principal */}
      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center p-6">
        <div className="max-w-4xl text-center">
          <Pill tone="cyan">FC Career Hub</Pill>
          <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">
            Career
            <br />
            <span className="text-lime-300">Overhaul</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-slate-300">
            Interface carrière nouvelle génération : décisions, vestiaire, médias, board, mercato, performance et événements contextuels précis à chaque semaine.
          </p>
        </div>

        {/* Boutons pour choisir le mode */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          <button
            type="button"
            onClick={() => onChooseType("manager")}
            className="rounded-[2rem] border border-lime-300/30 bg-lime-300 p-7 text-left text-slate-950 shadow-2xl shadow-lime-300/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-lime-300/40"
          >
            <p className="text-sm font-black uppercase tracking-[.25em]">Kick-off</p>
            <h2 className="mt-3 text-2xl font-black">Carrière Manager</h2>
            <p className="mt-3 font-semibold opacity-80">
              Contrôle total : board, finances, mercato, vestiaire, résultats.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChooseType("player")}
            className="rounded-[2rem] border border-cyan-300/30 bg-cyan-300 p-7 text-left text-slate-950 shadow-2xl shadow-cyan-300/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-cyan-300/40"
          >
            <p className="text-sm font-black uppercase tracking-[.25em]">Player Path</p>
            <h2 className="mt-3 text-2xl font-black">Carrière Joueur</h2>
            <p className="mt-3 font-semibold opacity-80">
              Suivi individuel : note, relation coach, réputation, progression.
            </p>
          </button>
        </div>
      </main>
    </div>
  );
}