"use client";

import React, { useState } from "react";

const h = React.createElement;

const n = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value) => {
  return Math.max(0, Math.min(100, Math.round(n(value, 0))));
};

function box(children) {
  return h(
    "section",
    { className: "panel" },
    children
  );
}

function stat(label, value) {
  return h(
    "div",
    { className: "card" },
    h("h3", null, label),
    h("b", null, value)
  );
}

function actionButton(title, description, onClick) {
  return h(
    "button",
    {
      className: "choice-btn",
      type: "button",
      onClick: onClick
    },
    h("b", null, title),
    h("span", null, description)
  );
}

export default function PlayerCareerProView({ career = {}, onApply = () => {} }) {
  const playerCareer = career.playerCareer || {};
  const [message, setMessage] = useState("");

  const form = n(playerCareer.form, 60);
  const coachTrust = n(playerCareer.coachTrust, 50);
  const popularity = n(playerCareer.popularity, 40);
  const energy = n(playerCareer.energy, 75);
  const goals = n(playerCareer.goals, 0);
  const assists = n(playerCareer.assists, 0);
  const appearances = n(playerCareer.appearances, 0);

  function save(patch, label) {
    const timeline = Array.isArray(playerCareer.timeline)
      ? playerCareer.timeline
      : [];

    const nextTimeline = [
      {
        id: "player-" + Date.now(),
        label: label
      },
      ...timeline
    ].slice(0, 10);

    setMessage(label);

    onApply({
      playerCareer: {
        ...playerCareer,
        ...patch,
        timeline: nextTimeline
      }
    });
  }

  function training() {
    save(
      {
        form: clamp(form + 8),
        coachTrust: clamp(coachTrust + 5),
        energy: clamp(energy - 8)
      },
      "Entrainement termine : forme +8, coach +5, energie -8"
    );
  }

  function recovery() {
    save(
      {
        energy: clamp(energy + 15),
        form: clamp(form + 2)
      },
      "Recuperation : energie +15, forme +2"
    );
  }

  function playMatch() {
    const scored = form >= 60 ? 1 : 0;
    const assisted = coachTrust >= 55 ? 1 : 0;

    save(
      {
        appearances: appearances + 1,
        goals: goals + scored,
        assists: assists + assisted,
        form: clamp(form + scored * 5 + assisted * 3),
        popularity: clamp(popularity + scored * 6 + assisted * 3),
        energy: clamp(energy - 15)
      },
      scored ? "Match joue : but marque" : "Match joue : prestation serieuse"
    );
  }

  function interview() {
    save(
      {
        popularity: clamp(popularity + 8),
        coachTrust: clamp(coachTrust - 2)
      },
      "Interview media : popularite +8, coach -2"
    );
  }

  return h(
    "div",
    { style: { display: "grid", gap: 18 } },

    box([
      h(
        "p",
        {
          key: "tag",
          style: { color: "#22d3ee", fontWeight: 1000 }
        },
        "MODE JOUEUR PRO - V19_PLAYER_MODE_PRO_ACTIVE"
      ),
      h("h2", { key: "title" }, "Carriere joueur jouable"),
      h(
        "p",
        { key: "desc", className: "muted" },
        "Gere ton joueur semaine apres semaine : entrainement, recuperation, matchs, medias et progression."
      ),
      message
        ? h(
            "p",
            {
              key: "message",
              style: { color: "#bef264", fontWeight: 900 }
            },
            message
          )
        : null,
      h(
        "div",
        { key: "stats", className: "grid-4" },
        stat("Forme", form + "/100"),
        stat("Coach", coachTrust + "/100"),
        stat("Popularite", popularity + "/100"),
        stat("Energie", energy + "/100")
      )
    ]),

    box([
      h("h2", { key: "actions-title" }, "Actions de la semaine"),
      h(
        "div",
        { key: "actions", className: "grid-4" },
        actionButton(
          "Entrainement individuel",
          "Ameliore la forme et la confiance du coach.",
          training
        ),
        actionButton(
          "Recuperation",
          "Restaure l'energie.",
          recovery
        ),
        actionButton(
          "Jouer le prochain match",
          "Simule une apparition avec stats.",
          playMatch
        ),
        actionButton(
          "Interview media",
          "Gagne en popularite.",
          interview
        )
      )
    ]),

    box([
      h("h2", { key: "player-stats-title" }, "Stats joueur"),
      h(
        "div",
        { key: "player-stats", className: "grid-3" },
        stat("Matchs", appearances),
        stat("Buts", goals),
        stat("Passes", assists)
      )
    ]),

    box([
      h("h2", { key: "journal-title" }, "Journal joueur"),
      Array.isArray(playerCareer.timeline) && playerCareer.timeline.length
        ? playerCareer.timeline.map((item) =>
            h("p", { key: item.id }, "- " + item.label)
          )
        : h(
            "p",
            { key: "empty", className: "muted" },
            "Aucune action enregistree."
          )
    ])
  );
}
