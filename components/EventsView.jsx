import React, { useState } from 'react';
import Card from './Card';
import Pill from './Pill';
import { CATEGORY_META } from '../utils/utils';

/**
 * Vue de la liste des événements
 * @param {Object} career - Carrière
 * @param {Function} onOpenEvent - Fonction pour ouvrir un événement
 */
export default function EventsView({ career, onOpenEvent }) {
  const [filter, setFilter] = useState("all");
  const visible = career.events.filter(event => filter === "all" || event.status === filter);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-black">Inbox événements</h2>
        <div className="flex gap-2">
          {["all", "unread", "resolved"].map(item => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-sm font-black ${
                filter === item ? "bg-lime-300 text-slate-950" : "bg-white/10 text-white"
              }`}
            >
              {item === "all" ? "Tous" : item === "unread" ? "À traiter" : "Résolus"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {visible.length > 0 ? (
          visible.map(event => (
            <button
              key={event.id}
              type="button"
              onClick={() => onOpenEvent(event)}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.07] text-left shadow-2xl transition hover:scale-[1.01] hover:border-lime-300/60"
            >
              <div className={`h-2 bg-gradient-to-r ${CATEGORY_META[event.category]?.gradient || CATEGORY_META.Match.gradient}`} />
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <Pill>{event.category}</Pill>
                  <Pill tone={event.status === "resolved" ? "green" : "amber"}>
                    {event.status === "resolved" ? "Résolu" : "Nouveau"}
                  </Pill>
                </div>
                <h3 className="mt-4 text-2xl font-black">{event.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{event.description}</p>
                <p className="mt-4 rounded-2xl bg-black/25 p-3 text-xs font-bold text-lime-200">
                  {event.impact}
                </p>
              </div>
            </button>
          ))
        ) : (
          <Card>
            <p>Aucun événement dans ce filtre. Avance d’une semaine pour générer un événement contextuel automatique.</p>
          </Card>
        )}
      </div>
    </div>
  );
}