"use client";

import { useState } from "react";

import PlayerCreator from "./PlayerCreator";
import PlayerHQ from "./PlayerHQ";
import PlayerMatchReport from "./PlayerMatchReport";
import {
  clamp,
  createTimelineEvent,
  normalizePlayerCareer,
} from "./playerCareerDefaults";

function ActionButton({ title, text, onClick, danger = false }) {
  return (
    <button
      type="button"
      className="choice-btn"
      onClick={onClick}
      style={{
        background: danger
          ? "linear-gradient(135deg, rgba(239,68,68,.22), rgba(15,23,42,.78))"
          : "linear-gradient(135deg, rgba(34,211,238,.16), rgba(15,23,42,.78))",
      }}
    >
      <b>{title}</b>
      <span>{text}</span>
    </button>
  );
}

export default function PlayerCareerApp({ career = {}, onApply = () => {} }) {
  const playerCareer = normalizePlayerCareer(career.playerCareer);
  const [showMatchReport, setShowMatchReport] = useState(false);

  function savePlayerCareer(nextPlayerCareer) {
    onApply({
      playerCareer: normalizePlayerCareer(nextPlayerCareer),
    });
  }

  function handleCreate(nextPlayerCareer) {
    savePlayerCareer(nextPlayerCareer);
  }

  function addTimeline(careerData, label, detail = "") {
    return [
      createTimelineEvent(label, detail),
      ...(careerData.world.timeline || []),
    ].slice(0, 20);
  }

  function applyWeeklyAction(type) {
    const current = normalizePlayerCareer(playerCareer);

    const next = {
      ...current,
      state: {
        ...current.state,
      },
      stats: {
        ...current.stats,
      },
      profile: {
        ...current.profile,
      },
      world: {
        ...current.world,
        timeline: [...(current.world.timeline || [])],
      },
    };

    if (type === "technical_training") {
      next.state.form = clamp(next.state.form + 7);
      next.state.fatigue = clamp(next.state.fatigue + 8);
      next.state.coachTrust = clamp(next.state.coachTrust + 3);
      next.profile.xp = Number(next.profile.xp || 0) + 35;

      next.world.timeline = addTimeline(
        next,
        "Entraînement technique",
        "Forme +7, fatigue +8, coach +3, XP +35."
      );
    }

    if (type === "recovery") {
      next.state.fatigue = clamp(next.state.fatigue - 15);
      next.state.morale = clamp(next.state.morale + 4);
      next.state.form = clamp(next.state.form + 2);

      next.world.timeline = addTimeline(
        next,
        "Récupération",
        "Fatigue -15, moral +4, forme +2."
      );
    }

    if (type === "interview") {
      next.state.popularity = clamp(next.state.popularity + 7);
      next.state.mediaPressure = clamp(next.state.mediaPressure + 6);
      next.state.coachTrust = clamp(next.state.coachTrust - 2);
      next.world.followers = Number(next.world.followers || 0) + 5000;

      next.world.timeline = addTimeline(
        next,
        "Interview média",
        "Popularité +7, pression média +6, coach -2, followers +5000."
      );
    }

    savePlayerCareer(next);
  }

  if (!playerCareer.created) {
    return <PlayerCreator career={career} onCreate={handleCreate} />;
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <PlayerHQ playerCareer={playerCareer} onUpdate={savePlayerCareer} />
{playerCareer.needsMatchReport ? (
        <section
          className="panel"
          style={{
            border: "1px solid rgba(251,191,36,.35)",
            background:
              "linear-gradient(135deg, rgba(251,191,36,.14), rgba(15,23,42,.82))",
          }}
        >
          <p
            style={{
              color: "#fbbf24",
              fontWeight: 1000,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Match FC26 en attente
          </p>

          <h2 style={{ fontSize: 28, margin: "6px 0" }}>
            Saisis ton dernier match
          </h2>

          <p className="muted">
            Tu as avancé d’une semaine. Le site n’a pas simulé le match :
            joue-le dans FC26, puis utilise le bouton “Saisir match FC26” pour
            entrer ton score, ta note et tes statistiques.
          </p>
        </section>
      ) : null}

      <section className="panel">
        <p
          style={{
            color: "#22d3ee",
            fontWeight: 1000,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Player Career Universe V1
        </p>

        <h2 style={{ fontSize: 32, margin: "6px 0" }}>
          Actions de la semaine
        </h2>

        <p className="muted" style={{ maxWidth: 860 }}>
          Le terrain se joue dans FC26. Ici, tu gères tout ce qui entoure ta
          carrière : entraînement, récupération, médias, relations, image et
          conséquences.
        </p>

        <div className="grid-4" style={{ marginTop: 16 }}>
          <ActionButton
            title="Entraînement technique"
            text="Forme, XP et confiance coach augmentent, mais la fatigue monte."
            onClick={() => applyWeeklyAction("technical_training")}
          />

          <ActionButton
            title="Récupération"
            text="Réduit la fatigue et stabilise le moral."
            onClick={() => applyWeeklyAction("recovery")}
          />

          <ActionButton
            title="Saisir match FC26"
            text="Entre le score, ta note et tes statistiques réelles."
            onClick={() => setShowMatchReport(true)}
          />

          <ActionButton
            title="Interview média"
            text="Augmente la popularité mais ajoute de la pression."
            onClick={() => applyWeeklyAction("interview")}
          />
        </div>
      </section>

      {playerCareer.needsMatchReport || showMatchReport ? (
        <PlayerMatchReport
          playerCareer={playerCareer}
          onSave={(nextPlayerCareer) => {
            savePlayerCareer({
              ...nextPlayerCareer,
              needsMatchReport: false,
            });
            setShowMatchReport(false);
          }}
          onCancel={() => setShowMatchReport(false)}
        />
      ) : null}
    </div>
  );
}









